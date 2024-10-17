class encryptedQueryClient extends encryptedQuery {

  /** @constructor
   * 
   * @param {*} arg 
   * @returns 
   */
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {

      v.step = 1; // 事前準備
      // 引数をメンバ/内部変数として格納

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

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }


}
