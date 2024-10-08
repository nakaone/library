class encryptedQuery {

  /** @constructor
   * @param {Object} arg
   * === client/server両方で使用するパラメータ ==================
   * @param {boolean} arg.isClient=true - 動作環境。true:クライアント側、false:サーバ側
   * @param {string} arg.storageKey - DocumentProperties/sessionStorageのキー文字列
   * @param {string} arg.pUP='x' - 平文送信時のURLクエリパラメータの変数名(Plain URL Parameter)
   * @param {string} arg.eUP='y' - 暗号文〃(encrypted URL Parameter)
   * @param {number} arg.expire=172800000 - クライアント側鍵の有効期間。既定値48時間
   * @param {number} [arg.bits=1024] - クライアント側で鍵ペアを生成する場合の鍵長。既定値はconfig.jsで設定
   * === clientでのみ使用するパラメータ ==================
   * @param {string} arg.url - 問合せ先(server=WebAPI)のURL
   * @param {number|string} arg.clientId - クライアントのID。例：受付番号(entryNo)
   * === serverでのみ使用するパラメータ ==================
   * @param {SingleTable} arg.master - サーバ側でユーザ情報を保持するシート
   * @param {string} arg.IDcol - 当該シート上でのユーザ側を特定する欄名。ex.'entryNo'
   * @param {string} arg.CPcol - 当該シート上でユーザ側公開鍵を保持する欄名。ex.'CPkey'
   * @param {string} arg.upv - URLクエリパラメータ文字列。URL Parameter Variable
   * @param {number} arg.passcodeValidityPeriod=600000 - パスコードの有効期間。ミリ秒、既定値10分
   * @returns 
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
        this.pUP = arg.pUP || 'x';
        this.eUP = arg.eUP || 'y';
        this.expire = arg.expire || 172800000;
      })();

      if( this.isClient ){  v.step = 2; // 実行環境がクライアント側の場合の鍵ペア設定

        v.step = 2.1; // 必須パラメータの存否確認、既定値設定
        if( arg.url ) this.url = arg.url; else throw new Error('問合せ先(API)のURLが指定されていません');
        if( arg.clientId ) this.clientId = arg.clientId; else throw new Error('IDが指定されていません');

        v.step = 2.2; // 実行環境がクライアント側かつsessionStorageに保存されているなら取得
        this.conf = JSON.parse(sessionStorage.getItem(this.storageKey)) || {};

        v.step = 2.3; // 任意パラメータに既定値設定
        arg.bits = arg.bits || 1024;

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
          vlog(this,'CPkey');
          v.step = 2.33; // 生成した鍵ペアをsessionStorageに保存
          sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));
        }
        vlog(v,'password');
        vlog(this.conf,'CPkey');

        v.step = 2.4; // サーバ側公開鍵を取得済なら設定
        this.SPkey = this.conf.SPkey || null;

      } else {  v.step = 3; // 実行環境がサーバ側の場合の鍵ペア設定

        v.step = 3.1; // 必須パラメータの存否確認、既定値設定
        if( arg.master ) this.master = arg.master; else throw new Error('master is not defined.');
        if( arg.IDcol ) this.IDcol = arg.IDcol; else throw new Error('IDcol is not defined.');
        if( arg.CPcol ) this.CPcol = arg.CPcol; else throw new Error('CPcol is not defined.');
        this.passcodeValidityPeriod = this.passcodeValidityPeriod || 600000;

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
   */
  async request(arg=this.CPkey){
    const v = {whois:this.constructor.name+'.request',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      // -------------------------------------------------
      // step.1 : 問合せ先URL(WebAPI+param)を作成
      // -------------------------------------------------

      v.step = 1.1; // 平文か暗号文か判定。サーバ側公開鍵取得済なら暗号文とする。
      v.isPlain = this.SPkey === null ? true : false;
      vlog(v,'isPlain');

      v.step = 1.2; // responseで署名検証のためにIDが必要なので付加し、JSON化
      v.json = JSON.stringify({id:this.clientId,arg:arg});
      vlog(v,'json');

      v.step = 1.3; // base64化
      v.b64 = await this.encB64(v.json);
      vlog(v,'b64');

      v.step = 1.4; // 暗号化
      if( v.isPlain ){
        v.str = v.b64;
      } else {
        v.enc = cryptico.encrypt(v.b64,this.SPkey,this.CSkey);
        vlog(v,'enc');
        if( v.enc.status !== 'success' ) throw new Error('encrypt failed.');
        v.str = v.enc.cipher;
      }

      v.step = 1.5; // URLセーフ化
      v.param = encodeURIComponent(v.str);
      vlog(v,'param');

      v.step = 1.6; // WebAPI+paramでURL作成
      v.url = `${this.url}?${v.isPlain ? this.pUP : this.eUP}=${v.param}`;
      vlog(v,'url');


      // -------------------------------------------------
      // step.2 : サーバ側に問合せ実行、結果検証
      // -------------------------------------------------

      v.step = 2.1; // 問合せの実行、ネットワークエラーなら弾く
      v.r = await fetch(v.url,{
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "text/plain",
        }
      });
      vlog(v,'r');
      if( !v.r.ok ) throw new Error(`[fetch error] status=${v.r.status}`);

      v.step = 2.2; // オブジェクト化
      v.obj = await v.r.json();
      vlog(v,'obj');

      v.step = 2.3; // 分岐先関数では無く、response()で起きたエラーの場合はthrow
      // ※分岐先関数でのエラーは本関数(response)の戻り値として本関数呼出元に返す
      if( v.obj.isOK === false ){
        throw new Error(v.obj.message);
      }

      v.step = 2.4;
      v.res = v.obj.rv;
      vlog(v,'res');


      // -------------------------------------------------
      // step.3 : 呼出元への戻り値の作成(結果の復号、署名検証)
      // -------------------------------------------------

      v.step = 3.1; // decrypt
      v.dec = cryptico.decrypt(v.res,this.CSkey);
      if( v.dec.status !== 'success' ){
        throw new Error(`decrypt failed.\n${stringify(v.dec)}`);
      }

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
      v.json = await this.decB64(v.dec.plaintext);

      v.step = 3.4; // JSON -> Object
      v.rv = this.objectizeJSON(v.json);
      if( v.rv === null ){
        throw new Error(`invalid JSON\n${stringify(v.json)}`);
      }


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
   * @returns {Object}
   * 
   * - ContentService.createTextOutput()はdoGetで行うため、定義不要
   * 
   * - 戻り値のデータ型
   *   - isOK {boolean} true:正常終了、false:異常終了
   *   - message {string} エラーメッセージ(平文)
   *   - rv {Object} 署名＋暗号化された、分岐先関数の戻り値(JSON)。ex.`{status:-1}`
   */
  response(arg,callback){
    const v = {whois:this.constructor.name+'.response',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      // -------------------------------------------------
      // step.1 : 分岐用関数に渡す引数v.argを作成
      // -------------------------------------------------

      v.step = 1.1; // 引数(e.parameter)が平文か暗号文か判定
      v.keys = Object.keys(arg);
      if( v.keys.length === 1 && v.keys.indexOf(this.pUP) >= 0 ){
        v.isPlain = true;
        v.str = arg[this.pUP];
      } else if( v.keys.length === 1 && v.keys.indexOf(this.eUP) >= 0 ){
        v.isPlain = false;
        v.str = arg[this.eUP];
      } else {
        throw new Error('Invalid URL query parameter');
      }
      vlog(v,['isPlain','str']);

      v.step = 1.2;  // URLセーフ解除
      v.cipher = decodeURIComponent(v.str);
      vlog(v,'cipher');

      v.step = 1.3;  // 暗号文なら復号
      if( v.isPlain ){
        v.b64 = v.cipher;
      } else {
        v.dec = cryptico.decrypt(v.cipher,this.SSkey);
        if( v.dec.status === 'success' ) v.b64 = v.dec.plaintext;
        else throw new Error(`decrypt failed.\n${stringify(v.dec)}`);
      }
      vlog(v,'b64');

      v.step = 1.4;  // base64解除
      v.json = this.decB64(v.b64);
      vlog(v,'json');

      v.step = 1.5;  // Object化
      v.obj = JSON.parse(v.json);
      vlog(v,'obj');

      v.step = 1.6;  // ユーザ情報を取得
      v.user = this.master.data.find(x => x[this.IDcol] == v.obj.id);
      if( !v.user )
        throw new Error(`対象が見つかりません(ID=${arg[this.upv]}[${whichType(arg[this.upv])}])`);
      vlog(v,'user');

      v.step = 1.7;  // 暗号文なら署名検証
      // 尚v.user.CPkeyおよびシートへの保存はauth1で実施、この時点での変更は不可。
      // ∵ masterは同一Objectなので、ここで変更すると「変更点無し」と解釈されupdateされない。
      if( v.isPlain === false && v.dec.publicKeyString !== v.user.CPkey ){
        throw new Error(`unmatch CPkey.\ndec.CPkey=${v.dec.publicKeyString}\nregistrated=${v.user.CPkey}`);
      }

      v.step = 1.8;  // 分岐用関数に渡す引数をv.argに設定
      // @param {Object} arg
      // @param {Boolean} arg.isPlain - true:平文、false:暗号文
      // @param {SingleTable} arg.master - ユーザ情報のシートオブジェクト
      // @param {Object.<string,any>} arg.user - master内の該当ユーザの情報
      // @param {number|string} arg.id - ユーザを特定する値
      // @param {Object} arg.arg - encryptedQuery.request()に渡された、分岐先関数の引数
      // @param {number} arg.expire - クライアント側鍵の有効期間。既定値48時間
      v.arg = {
        isPlain: v.isPlain,
        master: this.master,
        user: v.user,
        id: v.obj.id,
        arg: v.obj.arg,
        expire: this.expire,
      }
      vlog(v,'arg');


      // -------------------------------------------------
      v.step = 2; // 分岐用関数の呼び出し
      // -------------------------------------------------
      v.r = callback(v.arg);
      vlog(v,'r');


      // -------------------------------------------------
      // step.3 : 呼出元への戻り値の作成(結果への署名・暗号化)
      // -------------------------------------------------
      v.step = 3.1; // 分岐先関数の戻り値(Object) -> JSON
      v.json = JSON.stringify(v.r);
      vlog(v,'json');

      v.step = 3.2; // JSON -> base64
      v.b64 = this.encB64(v.json);
      vlog(v,'b64');

      v.step = 3.3; // base64 -> encrypt
      v.enc = cryptico.encrypt(v.b64,v.user.CPkey,this.SSkey);  // 署名あり
      if( v.enc.status !== 'success' ){
        throw new Error(`encrypt failed.\n${stringify(v.enc)}`);
      }

      v.step = 3.4; // 結果オブジェクトの作成
      v.rv = {isOK:true,rv:v.enc.cipher};

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      v.rv = {isOK:false,message:e.message};
    } finally {
      return v.rv;
    }
  }

  /** encB64: 日本語文字列を含め、base64にエンコード
   * @param {string} parts - 変換する日本語文字列
   * @returns {string} base64エンコード文字列
   * 
   * - Qiita [JavaScriptでBase64エンコード・デコード](https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06)
   * - Zenn [URLセーフなBase64エンコーディングとデコーディング](https://zenn.dev/jusanz/articles/d6cec091d45657)
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
  encB64(text){
    const cl = async (...parts) => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          const offset = reader.result.indexOf(",") + 1;
          resolve(reader.result.slice(offset));
        };
        reader.readAsDataURL(new Blob(parts));
      });
    };
    const sv = text => Utilities.base64Encode(text, Utilities.Charset.UTF_8);

    return this.isClient ? cl(text) : sv(text);
  }

  /** decB64: base64を日本語文字列にデコード
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
  async base64Decode(text, charset='UTF-8') {
    return fetch(`data:text/plain;charset=${charset};base64,` + text)
    .then(response => response.text());
  }
   */
  decB64(text, charset='UTF-8') {
    const cl = (text, charset='UTF-8') => {
      return fetch(`data:text/plain;charset=${charset};base64,` + text)
      .then(response => response.text());
    };
    const sv = text => Utilities.newBlob(Utilities.base64Decode(text, Utilities.Charset.UTF_8)).getDataAsString();

    return this.isClient ? cl(text) : sv(text);
  }

  /** objectizeJSON: 文字列がJSONか判定、parse結果かnullを返す
   * 
   * @param {string} arg - 文字列
   * @returns {Object|null} JSON文字列だったらparse結果、非JSONならnull
   */
  objectizeJSON(arg){try{return JSON.parse(arg)}catch{return null}};

}
