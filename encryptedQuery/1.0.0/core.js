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
        vlog(this.conf,'CPkey',55);
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
        v.url = `${this.url}?${this.upv}=${this.clientId}&CPkey=${this.CPkey}`;
        vlog(v,'url',141);

      } else {  // サーバ側公開鍵取得済 -> 暗号化して送る

        v.step = 1.2; // responseで署名検証のためにIDが必要なので付加し、JSON化
        v.json = JSON.stringify({id:this.clientId,arg:arg});
        vlog(v,'json',147);
  
        v.step = 1.3; // JSON -> base64
        v.b64 = await this.base64Encode(v.str);
        if( v.b64 instanceof Error ) throw v.b64;
        vlog(v,'b64',152);
  
        v.step = 1.4; // SPkeyがあればbase64を暗号化、無ければそのまま使用
        v.enc = cryptico.encrypt(v.b64,this.SPkey,this.CSkey);
        if( v.enc.status !== 'success' ) throw new Error('encrypt failed.');
        v.arg = v.enc.cipher;
        vlog(v,'arg',158);
  
        v.url = `${this.url}?${this.upv}=${v.arg}`;
        vlog(v,'url',161);
      }

      v.step = 2; // 問合せの実行、結果受領
      vlog(v,'url',165);
      v.r = await fetch(v.url,{
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "text/plain",
        }
      });
      if( !v.r.ok ) throw new Error(`[fetch error] status=${v.r.status}`);
      v.res = await v.r.json();
      vlog(v,'res',175);
      if( v.res.isOK === false ) throw new Error(v.res.message);

      v.step = 3.1; // 結果を復号(encrypted -> base64)
      v.cipher = v.res.rv;
      vlog(v,'cipher',180);
      vlog(this,'CSkey',181);
      v.dec = cryptico.decrypt(v.cipher,this.CSkey);
      vlog(v,'dec',183);
      if( v.dec.status !== 'success' ) throw new Error(`decrypt failed.\n${stringify(v.dec)}`);

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
      v.b64 = v.dec.plaintext;
      v.json = await this.base64Decode(v.b64);
      vlog(v,'json',200);

      v.step = 3.4; // JSON -> Object
      v.rv = this.objectizeJSON(v.json);
      if( v.rv === null ) throw new Error(`invalid JSON\n${stringify(v.json)}`);

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
   * - 引数argはthis.upvのメンバは必須。これ以外のメンバが存在する場合は平文、
   *   存在しない場合はthis.upvの値を暗号文と解釈する。
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

      v.step = 1; // 事前準備
      if( !arg.hasOwnProperty(this.upv) )
        throw new Error(`必須項目"${this.upv}"が定義されてません`);

      if( Object.keys(arg).length > 1 ){  v.step = 2; // argのメンバが複数 ⇒ 平文

        v.step = 2.1; // 復号が必要ないので、e.parameterをそのまま渡す
        v.isPlain = true;
        v.arg = arg;

        v.step = 2.2; // 平文の場合、arg[this.upv]はIDなので、ユーザ情報をv.userに取得
        v.user = this.master.data.find(x => x[this.IDcol] == arg[this.upv]);
        if( !v.user )
          throw new Error(`対象が見つかりません(ID=${arg[this.upv]}[${whichType(arg[this.upv])}])`);
        vlog(v,'user',251);

        v.step = 2.3; // ユーザ情報にCPkeyを登録
        v.val = {};
        v.val[this.CPcol] = arg.CPkey;
        vlog(v,'val',256);
        v.r = this.master.update(v.val,{key:this.IDcol,value:arg[this.upv]});
        if( v.r instanceof Error ) throw v.r;

      } else {  v.step = 3; // argのメンバが単数 ⇒ 暗号文
        // 暗号文は{id,arg}形式のオブジェクトを暗号化したもの。

        v.isPlain = false;
        v.cipher = arg[this.upv];  // 暗号文本体

        v.step = 3.1; // cipher -> base64
        v.dec = cryptico.decrypt(v.cipher,this.SSkey);
        if( v.dec.status === 'success' ) v.b64 = v.dec.plaintext;
        else throw new Error(`decrypt failed.\n${stringify(v.dec)}`);
  
        v.step = 3.2; // base64 -> JSON
        v.json = Utilities.newBlob(Utilities.base64Decode(v.b64, Utilities.Charset.UTF_8)).getDataAsString();

        v.step = 3.3; // JSON -> Object({id,arg}形式)
        v.obj = this.objectizeJSON(v.json);
        if( v.obj === null ) throw new Error(`Objectize failed.\n${v.json}`);

        v.step = 3.4; // 署名検証
        v.user = this.master.data.find(x => x[this.IDcol] === v.obj.id);
        if( v.user === null )
          throw new Error(`対象が見つかりません(ID=${v.obj.id}[${whichType(v.obj.id)}])`);
        if( v.dec.publicKeyString !== v.user.CPkey )
          throw new Error(`unmatch CPkey.\ndec.CPkey=${v.dec.publicKeyString}\nregistrated=${v.user.CPkey}`);

        v.step = 3.5; // 分岐先関数への引数をv.argに設定
        v.arg = v.obj.arg;
      }
      vlog(v,['isPlain','arg'],288);

      v.step = 4; // 分岐用関数の呼び出し(この段階でのv.rvはObject)
      v.r = callback(v.arg,v.isPlain);
      vlog(v,'r',292);

      (()=>{  v.step = 5; // 結果の暗号化

        v.step = 5.1; // 結果(Object) -> JSON
        v.json = JSON.stringify(v.r);
        vlog(v,'json',298);

        v.step = 5.2; // JSON -> base64
        v.b64 = Utilities.base64Encode(v.json, Utilities.Charset.UTF_8);
        vlog(v,'b64',302);

        v.step = 5.3; // base64 -> encrypt
        vlog(v,'user',305);
        vlog(this,'SSkey',306);
        v.enc = cryptico.encrypt(v.b64,v.user.CPkey,this.SSkey);  // 署名あり
        if( v.enc.status !== 'success' )
          throw new Error(`encrypt failed.\n${stringify(v.enc)}`);

        v.step = 5.4; // 結果オブジェクトの作成
        v.rv = {isOK:true,rv:v.enc.cipher};
  
      })();

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
