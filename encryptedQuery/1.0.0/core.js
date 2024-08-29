class encryptedQuery {

  /** @constructor
   * @param {Object} arg
   * @param {string} arg.url - 問合せ先(server=WebAPI)のURL
   * @param {string} [arg.upv='n'] - URLパラメータ(クエリ文字列)の変数名(URL Parameter Variable)
   * @param {string} arg.storageKey - DocumentProperties/sessionStorageのキー文字列
   * @param {number} arg.bits=1024 - クライアント側で鍵ペアを生成する場合の鍵長
   * @param {string} arg.sheetName='master' - サーバ側でユーザ情報を保持するシート名
   * @param {string} arg.IDcol='entryNo' - 当該シート上でのユーザ側を特定する欄名
   * @param {string} arg.CPcol='CPkey' - 当該シート上でユーザ側公開鍵を保持する欄名
   * @param {string} [arg.SPkey] - サーバ側の公開鍵
   * @returns 
   * 
   * 
   * @param {string|Object} [CSkey] - クライアント側の秘密鍵。文字列ならcryptico.toJSON()で出力された文字列
   * @param {string} [CPkey] - クライアント側の公開鍵
   * @param {string|Object} [SSkey] - サーバ側の秘密鍵。文字列ならcryptico.toJSON()で出力された文字列
   * 
   */
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {

      v.step = 1; // 環境変数(メンバ)の設定
      this.isClient = window ? true : false;  // 実行環境の識別。クライアント側(ブラウザ)ならtrue
      if( arg.storageKey ){
        this.storageKey = arg.storageKey;
      } else {
        throw new Error(`${this.isClient?'sessionStorage':'DocumentProperties'}のキー文字列が指定されていません`);
      }
      this.upv = arg.upv || 'n';  // URLパラメータ(クエリ文字列)の変数名

      if( this.isClient ){  // 実行環境がクライアント側の場合の鍵ペア設定

        v.step = 2.1; // 必須パラメータの存否確認、既定値設定
        if( arg.url ){
          this.url = arg.url;
        } else {
          throw new Error('問合せ先(API)のURLが指定されていません');
        }
        arg.bits = arg.bits || 1024;

        v.step = 2.2; // 実行環境がクライアント側かつsessionStorageに保存されているなら取得
        this.conf = JSON.parse(sessionStorage.getItem(this.storageKey));

        v.step = 2.3; // クライアント側鍵ペアの設定
        if( this.conf.CPkey ){
          // クライアント側公開鍵が指定されている場合
          this.CSkey = RSAKey.parse(this.conf.CSkey);
          this.CPkey = this.conf.CPkey;
        } else {
          // クライアント側公開鍵が未定の場合、鍵ペア未生成と看做して生成
          v.password = createPassword();
          this.CSkey = cryptico.generateRSAKey(v.password,(arg.bits));
          this.conf.CSkey = this.CSkey.toJSON();
          this.conf.CPkey = this.CPkey = cryptico.publicKeyString(this.CSkey);
          // 生成した鍵ペアをsessionStorageに保存
          sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));
        }

        v.step = 2.4; // サーバ側公開鍵を取得済なら設定
        this.SPkey = arg.SPkey || this.conf.SPkey || '';

      } else {  // 実行環境がサーバ側の場合の鍵ペア設定

        v.step = 3.1; // 必須パラメータの存否確認、既定値設定
        this.master = new SingleTable(arg.sheetName || 'master');
        this.IDcol = arg.IDcol || 'entryNo';
        this.CPcol = arg.CPcol || 'CPkey';

        v.step = 3.2; // 実行環境がサーバ側(GAS)かつDocumentPropertiesに保存されているなら取得
        this.conf = JSON.parse(PropertiesService.getDocumentProperties().getProperty(arg.DocPropKey));

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

  /** setSPkey: クライアント側で新たにサーバ側公開鍵取得時、メンバ変数とsessionStorageに保存
   * @param {string} arg - 新たに取得したサーバ側公開鍵
   * @returns {null}
   */
  setSPkey(arg){
    const v = {whois:this.constructor.name+'.setSPkey',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
  
      this.conf.SPkey = this.SPkey = arg;
      // sessionStorageに保存
      sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** request: クライアント->サーバ側への処理要求
   * 
   * @param {Object} arg 
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
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
  
      // id {number|string} - ユーザデータを特定する情報。ex.受付番号
      // arg {Object} - 分岐処理を行うコールバック関数に渡す引数

      // argが文字列以外の場合、JSON化＋base64化
      v.str = whichType(arg,'String') ? arg : JSON.stringify(arg);
      v.b64 = this.base64Encode(v.str);
      if( v.b64 instanceof Error ) throw v.b64;

      // サーバ側に問合せ、結果受領
      v.url = `${this.url}?${this.upv}=${v.b64}`;
      v.b64 = await fetch(v.url);

      // base64->JSONで復元、オブジェクト化
      v.str = this.base64Decode(v.b64);
      v.rv =JSON.parse(v.str);

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
   * @param {*} arg 
   * @param {*} callback 
   * @returns 
   */
  async response(arg,plainCB,encryptedCB){
    const v = {whois:this.constructor.name+'.response',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
  
      // base64->文字列に復元
      v.str = this.base64Decode(v.arg);

      v.obj = objectizeJSON(v.str);
      if( v.obj === null ){  // 復元結果が非JSON文字列

        // 暗号化文字列と解釈し、復号
        v.dec = cryptico.decrypt(v.r,this.SSkey);
        if( v.dec.status !== 'success' ) throw new Error('decode failed.');

        // 復号文字列(JSON)をオブジェクト化、シートからユーザ情報を取得して署名検証
        v.obj = JSON.parse(v.dec.plaintext);
        v.user = this.master.data.find(x => x[this.IDcol] === v.obj.id);
        if( !v.user ) throw new Error(`"${v.obj.id}"は未登録です`);

        // 検証NG(署名が未登録)ならthrowする
        if( v.user[this.CPcol] !== v.dec.publicKeyString ){
          throw new Error('不適切な署名です');
        }

        // 引数が暗号化されている場合の処理分岐を呼び出す
        v.r = await encryptedCB(v.obj.arg);

      } else {  // 復元結果がオブジェクト
        v.r = await plainCB(v.obj);
      }
      if( v.r instanceof Error ) throw v.r;

      // 結果をJSON＋base64化して返す
      v.str = JSON.stringify(v.r);
      v.b64 = this.base64Encode(v.str);
      v.enc = cryptico.encrypt(v.b64,this.CPkey,this.SSkey);
      if( v.enc.status !== 'success' ){}
      v.rv = {status:true,data:v.enc.cipher};

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
  base64Encode(...parts) {
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
  base64Decode(text, charset='UTF-8') {
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