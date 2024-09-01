class encryptedQuery {

  /** @constructor
   * @param {Object} arg
   * === client/server両方で使用するパラメータ ==================
   * @param {boolean} arg.isClient=true - 動作環境。true:クライアント側、false:サーバ側
   * @param {string} arg.storageKey - DocumentProperties/sessionStorageのキー文字列
   * @param {string} [arg.upv='n'] - URLパラメータ(クエリ文字列)の変数名(URL Parameter Variable)
   * === clientでのみ使用するパラメータ ==================
   * @param {string} arg.url - 問合せ先(server=WebAPI)のURL
   * @param {number|string} arg.clientId - クライアントのID。例：受付番号(entryNo)
   * @param {number} [arg.bits=1024] - クライアント側で鍵ペアを生成する場合の鍵長
   * === serverでのみ使用するパラメータ ==================
   * @param {SingleTable} arg.master - サーバ側でユーザ情報を保持するシート
   * @param {string} arg.IDcol - 当該シート上でのユーザ側を特定する欄名。ex.'entryNo'
   * @param {string} arg.CPcol - 当該シート上でユーザ側公開鍵を保持する欄名。ex.'CPkey'
   * @param {string} arg.upv - URLクエリパラメータ文字列。URL Parameter Variable
   * @returns 
   * 
   * 
   * @param {string|Object} [CSkey] - クライアント側の秘密鍵。文字列ならcryptico.toJSON()で出力された文字列
   * @param {string} [CPkey] - クライアント側の公開鍵
   * @param {string|Object} [SSkey] - サーバ側の秘密鍵。文字列ならcryptico.toJSON()で出力された文字列
   * @param {string} [arg.SPkey] - サーバ側の公開鍵
   * 
   */
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {

      (()=>{  v.step = 1; // 事前準備

        v.step = 1; // 環境変数(メンバ)の設定
        this.isClient = arg.hasOwnProperty('isClient') ? arg.isClient : true;
        if( arg.storageKey ){
          this.storageKey = arg.storageKey;
        } else {
          throw new Error(`${this.isClient?'sessionStorage':'DocumentProperties'}のキー文字列が指定されていません`);
        }
        this.upv = arg.upv || 'n';  // URLパラメータ(クエリ文字列)の変数名
      })();

      if( this.isClient ){  v.step = 2; // 実行環境がクライアント側の場合の鍵ペア設定

        v.step = 2.1; // 必須パラメータの存否確認、既定値設定
        if( arg.url ) this.url = arg.url; else throw new Error('問合せ先(API)のURLが指定されていません');
        if( arg.clientId ) this.clientId = arg.clientId; else throw new Error('IDが指定されていません');
        arg.bits = arg.bits || 1024;

        v.step = 2.2; // 実行環境がクライアント側かつsessionStorageに保存されているなら取得
        this.conf = JSON.parse(sessionStorage.getItem(this.storageKey)) || {};

        v.step = 2.3; // クライアント側鍵ペアの設定
        if( this.conf.CPkey ){
          v.step = 2.31; // クライアント側公開鍵が指定されている場合
          this.CSkey = RSAKey.parse(this.conf.CSkey);
          this.CPkey = this.conf.CPkey;
        } else {
          v.step = 2.32; // クライアント側公開鍵が未定の場合、鍵ペア未生成と看做して生成
          v.password = createPassword();
          this.CSkey = cryptico.generateRSAKey(v.password,(arg.bits));
          this.conf.CSkey = JSON.stringify(this.CSkey.toJSON());
          this.conf.CPkey = this.CPkey = cryptico.publicKeyString(this.CSkey);
          v.step = 2.33; // 生成した鍵ペアをsessionStorageに保存
          sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));
        }

        v.step = 2.4; // サーバ側公開鍵を取得済なら設定
        this.SPkey = this.conf.SPkey || null;

      } else {  v.step = 3; // 実行環境がサーバ側の場合の鍵ペア設定

        v.step = 3.1; // 必須パラメータの存否確認、既定値設定
        if( arg.master ) this.master = arg.master; else throw new Error('master is not defined.');
        if( arg.IDcol ) this.IDcol = arg.IDcol; else throw new Error('IDcol is not defined.');
        if( arg.CPcol ) this.CPcol = arg.CPcol; else throw new Error('CPcol is not defined.');

        v.step = 3.2; // 実行環境がサーバ側(GAS)かつDocumentPropertiesに保存されているなら取得
        this.conf = JSON.parse(PropertiesService.getDocumentProperties().getProperty(arg.storageKey));

        v.step = 3.3; // サーバ側鍵ペアの設定
        if( this.conf.SPkey ){
          // サーバ側公開鍵が作成済の場合
          this.SSkey = RSAKey.parse(this.conf.SSkey);
          this.SPkey = this.conf.SPkey;
        } else {
          // サーバ側公開鍵が未定の場合、鍵ペア未生成と看做して生成
          v.password = createPassword();
          this.SSkey = cryptico.generateRSAKey(v.password,(arg.bits || 1024));
          this.conf.SSkey = this.SSkey.toJSON();
          this.conf.SPkey = this.SPkey = cryptico.publicKeyString(this.SSkey);
          // 生成した鍵ペアをDocumentPropertiesに保存
          PropertiesService.getDocumentProperties().setProperty(this.storageKey,JSON.stringify(v.prop));
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** request: クライアント->サーバ側への処理要求
   * 
   * @param {string|Object} arg - サーバ側で分岐処理を行うコールバック関数に渡す引数
   * @returns 
   * 
   * [自分]
   * Object(引数)
   *   JSON.stringify()
   * String(plain)
   *   base64Encode()
   * String(base64)
   *   cryptico.encrypt()
   * cipher
   * 
   * [相手]
   * cipher
   *   cryptico.decrypt()
   * String(base64)
   *   base64Decode()
   * String(plain)
   *   JSON.parse()
   * Object(戻り値)
   */
  async request(arg){
    const v = {whois:this.constructor.name+'.request',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      if( this.SPkey === null ){  // サーバ側公開鍵未取得

        v.step = 1.1; // 平文で送付。送付内容はidとCPkeyのみ(固定)
        v.url = `${this.url}?${this.upv}=${this.clientId}&CPkey=${this.CPkey}`
        console.log(`l.140 v.url(${whichType(v.url)})=${stringify(v.url)}`);

      } else {  // サーバ側公開鍵取得済 -> 暗号化して送る

        v.step = 1.2; // responseで署名検証のためにIDが必要なので付加し、JSON化
        v.json = JSON.stringify({id:this.clientId,arg:arg});
        console.log(`l.146 v.json(${whichType(v.json)})=${stringify(v.json)}`);
  
        v.step = 1.3; // JSON -> base64
        v.b64 = await this.base64Encode(v.str);
        if( v.b64 instanceof Error ) throw v.b64;
        console.log(`l.151 v.b64(${whichType(v.b64)})=${stringify(v.b64)}`);
  
        v.step = 1.4; // SPkeyがあればbase64を暗号化、無ければそのまま使用
        v.enc = cryptico.encrypt(v.b64,this.SPkey,this.CSkey);
        if( v.enc.status !== 'success' ) throw new Error('encrypt failed.');
        v.arg = v.enc.cipher;
        console.log(`l.157 v.arg(${whichType(v.arg)})=${stringify(v.arg)}`);
  
        v.url = `${this.url}?${this.upv}=${v.arg}`;
        console.log(`l.160 v.url(${whichType(v.url)})=${stringify(v.url)}`);
      }

      v.step = 2; // 問合せの実行、結果受領
      console.log(`l.164 v.url(${whichType(v.url)})=${stringify(v.url)}`);
      v.r = await fetch(v.url,{
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "text/plain",
        }
      });
      if( !v.r.ok ) throw new Error(`[fetch error] status=${v.r.status}`);
      v.res = await v.r.json();
      console.log(`l.165 v.res(${whichType(v.res)})=${stringify(v.res)}`);

      v.step = 3.1; // 結果を復号(encrypted -> base64)
      v.dec = cryptico.decrypt(v.res,this.CSkey);
      console.log(`l.169 v.dec(${whichType(v.dec)})=${stringify(v.dec)}`);
      if( v.dec.status !== 'success' ) throw new Error('decrypt failed.');

      v.step = 3.2; // 署名検証、SPkeyが無ければ保存
      if( v.dec.publicKeyString !== this.SPkey ){
        if( this.SPkey === null ){
          this.conf.SPkey = this.SPkey = v.dec.publicKeyString;
          // sessionStorageに保存
          sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));  
        } else {
          throw new Error('サーバ側の署名が不正です');
        }
      }

      v.step = 3.3; // base64 -> JSON
      v.json = await this.base64Decode(v.b64);
      console.log(`l.185 v.json(${whichType(v.json)})=${stringify(v.json)}`);

      v.step = 3.4; // JSON -> Object
      v.rv = JSON.parse(v.json);

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** response: サーバ側処理、結果通知
   * 
   * @param {Object} arg - URLクエリ文字列のオブジェクト(e.parameter)
   * @param {*} callback - 分岐処理を行うコールバック関数。asyncで定義のこと。
   * @returns 
   * 
   * - ContentService.createTextOutput()はdoGetで行うため、定義不要
   */
  async response(arg,callback){
    const v = {whois:this.constructor.name+'.response',step:0,rv:null,arg:arg,isPlain:true};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {

      if( this.objectizeJSON(arg) === null ){
        // argがJSON化不可能なら暗号文と看做す
        v.isPlain = false;

      } else {
        // argがJSON化可能なら平文と看做す
        v.arg = JSON.parse(v.arg);
      }

      v.rv = await callback(v.arg,v.isPlain);

      /*
      // cipher -> base64
      v.dec = cryptico.decrypt(arg,this.SSkey);
      if( v.dec.status === 'success' ){
        // 署名検証。
        v.b64 = v.dec.plaintext;
      } else {
        // 復号失敗⇒平文として、引数をそのまま使用
        v.obj = arg;
      }

      // base64 -> json
      v.json = Utilities.newBlob(Utilities.base64Decode(v.b64, Utilities.Charset.UTF_8)).getDataAsString();

      // json -> Object
      v.arg = JSON.parse(v.json);

      v.obj = objectizeJSON(v.str);
      if( v.obj === null ){  // 復元結果が非JSON文字列


        // 復号文字列(JSON)をオブジェクト化、シートからユーザ情報を取得して署名検証
        v.obj = JSON.parse(v.dec.plaintext);
        v.user = this.master.data.find(x => x[this.IDcol] === v.obj.id);
        if( !v.user ) throw new Error(`"${v.obj.id}"は未登録です`);

        // 検証NG(署名が未登録)ならthrowする
        if( v.user[this.CPcol] !== v.dec.publicKeyString ){
          throw new Error('不適切な署名です');
        }

        // 引数が暗号化されている場合の処理分岐を呼び出す
        v.r = await callback(v.obj.arg);
        v.isPlain = false;
      }
      v.r = await callback(v.obj,v.isPlain);
      if( v.r instanceof Error ) throw v.r;

      // 結果をJSON＋base64化して返す
      v.str = JSON.stringify(v.r);
      v.b64 = this.base64Encode(v.str);
      v.enc = cryptico.encrypt(v.b64,this.CPkey,this.SSkey);
      if( v.enc.status !== 'success' ){}
      v.rv = {status:true,data:v.enc.cipher};
      */

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      v.rv = {status:false,message:e.message};
    } finally {
      return v.rv;
    }
  }

  /** base64Encode: 日本語文字列をbase64にエンコード
   * @param {string} parts - 変換する日本語文字列
   * @returns {string} base64エンコード文字列
   * 
   * - Qiita [JavaScriptでBase64エンコード・デコード](https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06)
   * 
   * @example
   * 
   * ```
   * v.str = 'これはテスト用文字列です';
   * v.enc = await base64Encode(v.str);
   * v.dec = await base64Decode(v.enc);
   * console.log(`str=${v.str}\nenc=${v.enc}\ndec=${v.dec}`);
   * ```
   */
  async base64Encode(...parts) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(",") + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }

  /** base64Decode: base64を日本語文字列にデコード
   * @param {string} text - base64文字列
   * @param {string} charset='UTF-8'
   * @returns {string} 復号された日本語文字列
   * 
   * - Qiita [JavaScriptでBase64エンコード・デコード](https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06)
   * 
   * @example
   * 
   * ```
   * v.str = 'これはテスト用文字列です';
   * v.enc = await base64Encode(v.str);
   * v.dec = await base64Decode(v.enc);
   * console.log(`str=${v.str}\nenc=${v.enc}\ndec=${v.dec}`);
   * ```
   */
  async base64Decode(text, charset='UTF-8') {
    return fetch(`data:text/plain;charset=${charset};base64,` + text)
    .then(response => response.text());
  }

  /** objectizeJSON: 文字列がJSONか判定、parse結果かnullを返す
   * 
   * @param {string} arg - 文字列
   * @returns {Object|null} JSON文字列だったらparse結果、非JSONならnull
   */
  objectizeJSON(arg){try{return JSON.parse(arg)}catch{return null}};

}
