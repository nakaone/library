/**
 * cryptoServer - サーバ側復号・署名検証モジュール (Apps Script 用)
 *
 * 依存:
 *  - jsrsasign (KEYUTIL, KJUR, RSAKey 等)
 *  - Google Apps Script 環境 (PropertiesService, SpreadsheetApp, Utilities)
 *
 * 使い方 (例):
 *   const authConfig = {
 *     system: { name: 'MyAuthSystem' },
 *     allowableTimeDifference: 1000 * 60 * 5, // 5分
 *     loginLifeTime: 1000 * 60 * 60 * 24 * 7 // 7日
 *   };
 *
 *   // 初期化(必要なら)
 *   const server = new cryptoServer(authConfig);
 *
 *   // 復号 (static)
 *   const encryptedRequest = { memberId:'a@b', deviceId:'dev01', ciphertext: '...' };
 *   const decrypted = cryptoServer.decrypt(encryptedRequest, authConfig);
 *
 *   // 暗号化 (応答をクライアントの公開鍵で暗号化)
 *   const encryptedResponse = cryptoServer.encrypt(authResponse, authConfig, clientSPkeyPEM);
 *
 *   // 鍵ローテーション
 *   cryptoServer.reset(authConfig);
 */
class cryptoServer {
  /**
   * constructor: インスタンス用(静的メソッド利用が主だが、プロパティ取得目的で使用可)
   * @param {Object} authConfig
   */
  constructor(authConfig = {}) {
    this.authConfig = authConfig;
    this.propName = (this.authConfig && this.authConfig.system && this.authConfig.system.name) || 'cryptoServer_default';
    this.pv = cryptoServer._loadScriptProperties(this.propName);
    // 鍵未存在なら作成して保存
    if (!this.pv || !this.pv.SPkey || !this.pv.SSkey) {
      const kp = cryptoServer._generateKeyPair();
      const now = Date.now();
      this.pv = {
        keyGeneratedDateTime: now,
        SPkey: kp.publicPEM,
        SSkey: kp.privatePEMEncrypted || kp.privatePEM, // 暗号化保存を想定(簡略化)
        requestLog: [] // TTL付きキャッシュに使う
      };
      cryptoServer._saveScriptProperties(this.propName, this.pv);
    }
  }

  // --------------------
  // 静的ユーティリティ
  // --------------------

  static _loadScriptProperties(propName) {
    try {
      const raw = PropertiesService.getScriptProperties().getProperty(propName);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('cryptoServer._loadScriptProperties error', e);
      return null;
    }
  }

  static _saveScriptProperties(propName, obj) {
    try {
      PropertiesService.getScriptProperties().setProperty(propName, JSON.stringify(obj));
      return true;
    } catch (e) {
      console.error('cryptoServer._saveScriptProperties error', e);
      return false;
    }
  }

  /**
   * 鍵ペア生成 (jsrsasign を使用)
   * @returns { publicPEM, privatePEM, privatePEMEncrypted (optional) }
   */
  static _generateKeyPair() {
    try {
      // KEYUTIL.generateKeypair の使用を想定(jsrsasign)
      // RSA 2048
      const kp = KEYUTIL.generateKeypair("RSA", 2048);
      const pubPEM = KEYUTIL.getPEM(kp.pubKeyObj); // 公開鍵PEM
      const privPEM = KEYUTIL.getPEM(kp.prvKeyObj, "PKCS1PRV"); // 秘密鍵PEM
      // 実運用では秘密鍵はさらにApps Script側で暗号化して保存すべき(ここでは平文保存)
      return { publicPEM: pubPEM, privatePEM: privPEM, privatePEMEncrypted: privPEM };
    } catch (e) {
      console.error('_generateKeyPair error', e);
      throw e;
    }
  }

  /**
   * 定数時間比較
   * @param {string} a
   * @param {string} b
   */
  static _constantTimeCompare(a = '', b = '') {
    // UTF-8バイト比較を意図
    const sa = Utilities.newBlob(a).getBytes();
    const sb = Utilities.newBlob(b).getBytes();
    let diff = sa.length ^ sb.length;
    const len = Math.max(sa.length, sb.length);
    for (let i = 0; i < len; i++) {
      const va = sa[i] || 0;
      const vb = sb[i] || 0;
      diff |= va ^ vb;
    }
    return diff === 0;
  }

  /**
   * requestId の再生防止キャッシュ管理(TTL付き)
   * ScriptProperties 内の requestLog を array に保存 (short TTL)
   * @param {Object} pv (プロパティオブジェクト)
   * @param {string} requestId
   * @param {number} ttlMs
   * @returns { boolean } 既存なら false(重複) / 新規なら true
   */
  static _checkAndPushRequestLog(pv, requestId, ttlMs = 1000 * 60 * 5) {
    try {
      pv.requestLog = pv.requestLog || [];
      const now = Date.now();
      // TTL expired ones removed
      pv.requestLog = pv.requestLog.filter(r => (now - (r.timestamp || 0)) <= ttlMs);
      const found = pv.requestLog.some(r => r.requestId === requestId);
      if (found) return false;
      pv.requestLog.push({ requestId, timestamp: now });
      return true;
    } catch (e) {
      console.error('_checkAndPushRequestLog error', e);
      return false;
    }
  }

  // --------------------
  // Member 取得ユーティリティ
  // --------------------
  /**
   * MemberList シートから memberId に一致するメンバを取得し、deviceId が含まれる device 情報を使って Member を返す
   * 期待するシート構成(例):
   *   columns: memberId,name,log,profile,device,note
   * device カラムには JSON 文字列の配列 (MemberDevice[]) が入っている想定
   *
   * @param {string} memberId
   * @param {string} deviceId
   * @returns {object|null} Member object or null
   */
  static _getMemberFromSheet(memberId, deviceId) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('MemberList');
      if (!sheet) return null;
      const data = sheet.getDataRange().getValues();
      if (data.length < 2) return null;
      const headers = data[0].map(h => (h || '').toString().trim());
      let member = null;
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx]; });
        if (obj.memberId === memberId) {
          // parse device/json fields if string
          try {
            if (typeof obj.device === 'string' && obj.device) obj.device = JSON.parse(obj.device);
            if (typeof obj.profile === 'string' && obj.profile) obj.profile = JSON.parse(obj.profile);
            if (typeof obj.log === 'string' && obj.log) obj.log = JSON.parse(obj.log);
          } catch (e) {
            // ignore parse errors
          }
          // find device match (member may have devices array)
          if (!deviceId) {
            member = obj;
            break;
          }
          const devices = Array.isArray(obj.device) ? obj.device : [];
          const matched = devices.find(d => d.deviceId === deviceId);
          if (matched) {
            // merge device properties into member object for easy access
            obj._matchedDevice = matched;
            member = obj;
            break;
          }
        }
      }
      return member;
    } catch (e) {
      console.error('_getMemberFromSheet error', e);
      return null;
    }
  }

  // --------------------
  // decrypt メソッド(static)
  // --------------------
  /**
   * encryptedRequest を復号・検証して構造化オブジェクトを返す
   * @param {Object} encryptedRequest { memberId, deviceId, ciphertext }
   * @param {Object} authConfig
   * @returns {Object} { result:'fatal'|'warning'|'normal', message?:string, request?:object, timestamp?:string }
   *
   * 注意: fatal 系でもオブジェクトを返す(throw は内部で補助的に使用するが外向けはオブジェクト)
   */
  static decrypt(encryptedRequest, authConfig = {}) {
    const propName = (authConfig && authConfig.system && authConfig.system.name) || 'cryptoServer_default';
    const pv = cryptoServer._loadScriptProperties(propName) || {};
    const now = Date.now();
    const rvBase = { timestamp: new Date(now).toISOString() };

    try {
      // 入力チェック
      if (!encryptedRequest || typeof encryptedRequest !== 'object') {
        return Object.assign({ result: 'fatal', message: 'invalid input' }, rvBase);
      }
      const { memberId, deviceId, ciphertext } = encryptedRequest;
      if (!memberId || !deviceId || !ciphertext) {
        const missing = !memberId ? 'memberId' : (!deviceId ? 'deviceId' : 'cipherText');
        return Object.assign({ result: 'fatal', message: `[${missing}] not specified` }, rvBase);
      }

      // 重複リクエストチェック(replay)
      if (!cryptoServer._checkAndPushRequestLog(pv, encryptedRequest.requestId || ('rid:' + ciphertext), authConfig.requestTTL || (1000 * 60 * 5))) {
        // 保存してから戻す
        cryptoServer._saveScriptProperties(propName, pv);
        return Object.assign({ result: 'fatal', message: 'Duplicate request' }, rvBase);
      }
      // 一旦プロパティ保存(requestLog 更新)
      cryptoServer._saveScriptProperties(propName, pv);

      // member を取得
      const Member = cryptoServer._getMemberFromSheet(memberId, deviceId);
      const isExistingMember = !!Member;

      // 秘密鍵(SSkey)を取得して復号を試行
      if (!pv.SSkey) {
        return Object.assign({ result: 'fatal', message: 'Server private key not found' }, rvBase);
      }
      const serverPrivatePEM = pv.SSkey; // 暗号化されている想定なら復号処理をここで行う

      // --- 復号処理 (RSA-OAEP -> plain JSON) ---
      let plain = null;
      try {
        // jsrsasign での RSA OAEP 形式の復号を想定:
        // - ciphertext が base64 エンコードされた RSA-OAEP であることを想定
        // 実装: KJUR.crypto.Cipher による復号など(環境に依る)
        // ここでは jsrsasign の RSAKey を使ったデモ形式を記載します。
        const prvKey = KEYUTIL.getKey(serverPrivatePEM);
        // ciphertext は base64 string -> raw hex へ変換(環境依存)
        // 実運用ではクライアントと暗号化フォーマットを厳密に合わせてください。
        const b64 = ciphertext;
        // KJUR.crypto.Cipher.decrypt の利用例(ライブラリにより関数名は変動)
        // try OAEP:
        if (typeof KJUR !== 'undefined' && KJUR.crypto && KJUR.crypto.Cipher && KJUR.crypto.Cipher.decrypt) {
          // KJUR.crypto.Cipher.decrypt expects array of keys? this is illustrative.
          // Many environments require custom adapter. If not available, replace with appropriate call.
          const decryptedHex = KJUR.crypto.Cipher.decrypt(b64, prvKey); // ※ 実環境で要調整
          plain = hextoutf8(decryptedHex); // hextoutf8 は jsrsasign ユーティリティ
        } else if (prvKey && prvKey.decrypt) {
          // RSAKey の decrypt があれば
          // convert base64 to hex
          const hex = b64tohex(b64);
          const decryptedHex = prvKey.decrypt(hex);
          plain = hextoutf8(decryptedHex);
        } else {
          // ライブラリ差異のため復号ができない場合、例外を投げて下の catch でハンドルする
          throw new Error('No RSA-OAEP decrypt facility found in environment');
        }
      } catch (e) {
        return Object.assign({ result: 'fatal', message: 'decrypt failed' }, rvBase);
      }

      // JSON パース
      let authRequest = null;
      try {
        authRequest = JSON.parse(plain);
      } catch (e) {
        return Object.assign({ result: 'fatal', message: 'decrypt produced invalid JSON' }, rvBase);
      }

      // timestamp 差チェック
      if (!authRequest.timestamp || typeof authRequest.timestamp !== 'number') {
        return Object.assign({ result: 'fatal', message: 'Invalid or missing timestamp' }, rvBase);
      }
      const delta = Math.abs(now - authRequest.timestamp);
      if (authConfig.allowableTimeDifference && delta > authConfig.allowableTimeDifference) {
        return Object.assign({ result: 'fatal', message: 'Timestamp difference too large' }, rvBase);
      }

      // ここから署名検証処理
      // authRequest.signature と Member 側 CPkey を使用して照合する
      const signature = authRequest.signature;
      if (!signature) {
        return Object.assign({ result: 'fatal', message: 'Missing signature' }, rvBase);
      }

      // Member が存在する場合は CPkey と署名照合 (Member.profile.CPkey など)
      if (isExistingMember) {
        // Check membership expiry
        const memberExpire = Member.expire || (Member.profile && Member.profile.expire) || null;
        if (memberExpire && Date.now() >= memberExpire) {
          return Object.assign({ result: 'warning', message: 'Membership has expired' }, rvBase);
        }
        // CPkey update time & loginLifeTime check
        const cpUpdated = (Member.CPkeyUpdated || (Member.profile && Member.profile.CPkeyUpdated)) || 0;
        if (Date.now() >= (cpUpdated + (authConfig.loginLifeTime || 0))) {
          return Object.assign({ result: 'warning', message: 'CPkey has expired' }, rvBase);
        }
        // CPkey (公開鍵) を取得
        const CPkeyPEM = Member.CPkey || (Member.profile && Member.profile.CPkey) || null;
        if (!CPkeyPEM) {
          return Object.assign({ result: 'fatal', message: 'Member CPkey not found' }, rvBase);
        }

        // verify signature: authRequest (without signature field) should match signature by CPkey
        const forVerify = Object.assign({}, authRequest);
        delete forVerify.signature;
        const payload = JSON.stringify(forVerify);

        let verified = false;
        try {
          const pubKey = KEYUTIL.getKey(CPkeyPEM);
          // jsrsasign の verify を使用：RSASSA-PKCS1-v1_5 を想定(実運用で alg を統一)
          // 署名は base64 文字列を想定
          const sig = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
          sig.init(pubKey);
          sig.updateString(payload);
          verified = sig.verify(signature);
        } catch (e) {
          console.error('signature verify error', e);
          verified = false;
        }

        // 定数時間比較で安全に判定(結果の bool を文字列にして比較するなど)
        if (!verified) {
          return Object.assign({ result: 'fatal', message: 'Signature unmatch' }, rvBase);
        }

        // 正常
        return Object.assign({ result: 'normal', request: authRequest }, rvBase);
      } else {
        // 新規登録要求
        // メールアドレスとして適切か(簡易チェック)
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mailRegex.test(memberId)) {
          return Object.assign({ result: 'fatal', message: 'Invalid mail address' }, rvBase);
        }

        // 署名検証：クライアントからの自己署名のみで OK (メンバ未登録のため CPkey は無い)
        // ここでは authRequest にクライアント側が公開鍵を含めていることを期待する(例: authRequest.CPkey)
        const candidateCPkey = authRequest.CPkey || null;
        if (!candidateCPkey) {
          // client didn't include CPkey -> cannot verify
          return Object.assign({ result: 'fatal', message: 'Client CPkey missing for registration' }, rvBase);
        }

        const forVerify = Object.assign({}, authRequest);
        delete forVerify.signature;
        const payload = JSON.stringify(forVerify);
        let verified = false;
        try {
          const pubKey = KEYUTIL.getKey(candidateCPkey);
          const sig = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
          sig.init(pubKey);
          sig.updateString(payload);
          verified = sig.verify(signature);
        } catch (e) {
          console.error('registration signature verify error', e);
          verified = false;
        }

        if (!verified) {
          return Object.assign({ result: 'fatal', message: 'Signature unmatch' }, rvBase);
        }

        // 登録可能な要求(warning として返す: 後続の登録処理が必要)
        return Object.assign({ result: 'warning', message: 'Member registerd', request: authRequest }, rvBase);
      }
    } catch (e) {
      console.error('cryptoServer.decrypt unexpected error', e);
      return Object.assign({ result: 'fatal', message: e && e.message ? e.message : 'unknown error' }, rvBase);
    } finally {
      // 最後に pv を保存する(requestLog 等が更新されている場合)
      try {
        cryptoServer._saveScriptProperties(propName, pv);
      } catch (e) {
        // ignore
      }
    }
  }

  // --------------------
  // encrypt メソッド(static)
  // --------------------
  /**
   * authResponse をクライアントの公開鍵で暗号化し、署名を付与して返す
   * @param {Object} authResponse
   * @param {Object} authConfig
   * @param {string} clientSPkeyPEM - クライアントの公開鍵 (PEM)
   * @returns {Object} { result:'normal'|'fatal', ciphertext: '...', signature: '...', timestamp: number }
   */
  static encrypt(authResponse, authConfig = {}, clientSPkeyPEM) {
    const propName = (authConfig && authConfig.system && authConfig.system.name) || 'cryptoServer_default';
    const pv = cryptoServer._loadScriptProperties(propName) || {};
    const now = Date.now();

    try {
      if (!authResponse || typeof authResponse !== 'object') {
        return { result: 'fatal', message: 'invalid input' };
      }
      if (!clientSPkeyPEM) {
        return { result: 'fatal', message: 'client public key not specified' };
      }
      if (!pv.SSkey) {
        return { result: 'fatal', message: 'server private key not found' };
      }

      // 署名: server の秘密鍵で authResponse に署名(署名付与)
      const serverPrivatePEM = pv.SSkey;
      const payload = JSON.stringify(authResponse);
      let signature = null;
      try {
        const prv = KEYUTIL.getKey(serverPrivatePEM);
        const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
        sig.init(prv);
        sig.updateString(payload);
        signature = sig.sign(); // base64
      } catch (e) {
        console.error('encrypt sign error', e);
        return { result: 'fatal', message: 'sign failed' };
      }

      // 暗号化: クライアント公開鍵で RSA-OAEP 暗号化(cipherText を生成)
      let ciphertext = null;
      try {
        const pub = KEYUTIL.getKey(clientSPkeyPEM);
        // jsrsasign による RSA-OAEP 暗号化の例(実際のAPIは環境で要確認)
        if (typeof KJUR !== 'undefined' && KJUR.crypto && KJUR.crypto.Cipher && KJUR.crypto.Cipher.encrypt) {
          // illustrative
          ciphertext = KJUR.crypto.Cipher.encrypt(payload, pub);
        } else if (pub && pub.encrypt) {
          // RSAKey.encrypt expects hex input; convert payload -> hex
          const hex = utf8tohex(payload);
          const encHex = pub.encrypt(hex);
          ciphertext = hextob64(encHex);
        } else {
          throw new Error('No RSA-OAEP encrypt facility found in environment');
        }
      } catch (e) {
        console.error('encrypt encrypt error', e);
        return { result: 'fatal', message: 'encrypt failed' };
      }

      return {
        result: 'normal',
        timestamp: now,
        ciphertext,
        signature
      };
    } catch (e) {
      console.error('cryptoServer.encrypt unexpected error', e);
      return { result: 'fatal', message: e && e.message ? e.message : 'unknown error' };
    }
  }

  // --------------------
  // reset メソッド(鍵ローテーション)
  // --------------------
  /**
   * 鍵ペアを生成して ScriptProperties に上書きする
   * @param {Object} authConfig
   * @returns {Object} { result:'normal'|'fatal', message?:string }
   */
  static reset(authConfig = {}) {
    const propName = (authConfig && authConfig.system && authConfig.system.name) || 'cryptoServer_default';
    try {
      const kp = cryptoServer._generateKeyPair();
      const pv = {
        keyGeneratedDateTime: Date.now(),
        SPkey: kp.publicPEM,
        SSkey: kp.privatePEMEncrypted || kp.privatePEM,
        requestLog: []
      };
      cryptoServer._saveScriptProperties(propName, pv);
      return { result: 'normal' };
    } catch (e) {
      console.error('cryptoServer.reset error', e);
      return { result: 'fatal', message: e.message || 'reset failed' };
    }
  }
}
