function authServer(arg,opt={}){
  const v = {whois:'authServer',step:0,rv:null};
  const pv = {};  // public values: 擬似メンバ
  console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
  try {

    v.step = 1; // 事前準備
    v.rv = setup();

    v.step = 2;
    if( pv.arg.CPkey ){
      // 引数にCPkeyが存在
      if( pv.arg.email ){
        // 引数にemailが存在 ⇒ ユーザ管理情報を生成、シートに追加
      } else {
        // 引数にemailが不在 ⇒ No Mailエラー
        v.rv = {status:'Err:No Mail'};
      }
    } else {
      // 引数にCPkeyが不存在
      if( pv.arg.userId === null && pv.arg.email === null ){
        // userIdもemailも不存在 ⇒ ゲスト
        // setupで権限の既定値をゲストとして設定しているので、特段の処理は不要
      } else {
        // ユーザ管理情報を取得
        v.r = SpreadDb({table:pv.opt.accountTableName,command:'select',where:pv.arg.userId});
        if( v.r instanceof Error ) throw v.r;
        if( v.r[0].isErr || v.r[0].data.length === 0 ){
          // ユーザ情報取得失敗 ⇒ No Accountエラー
          v.rv = {status:'Err:No Account'};
        } else {
          // ユーザ情報取得成功
          pv.account = v.r[0].data;
          // token復号
          // v.r = cryptico.decrypt(v.cipher,v.SSkey);
          // 署名検証
          // v.r = login()
        }
      }
    }

    if( v.rv === null ){
      // pv.accountでSpreadDb実行
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  function setup(arg,opt){
    const v = {whois:'authServer.setup',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {

      v.step = 1.1; // 引数を整形、メンバに格納
      pv.arg = Object.assign({
        userId: null, // {string|number}=null ユーザ識別子。nullはゲスト
        token: null, // {string} 発信時刻(UNIX時刻)を暗号化・署名した文字列
        email: null, // {string} ユーザのメールアドレス
        CPkey: null, // {string} ユーザの公開鍵
        query: null, // {Object|Object[]} 以下の内容を署名・暗号化した文字列
      },arg);
      if( pv.arg.query !== null ){
        if( !Array.isArray(pv.arg.query) ) pv.arg.query = [pv.arg.query];
        for( v.i=0 ; v.i<pv.arg.query.length ; v.i++ ){
          pv.arg.query[v.i] = Object.assign({
            table: null,
            command: null,
            where: null,
            record: null,
            passcode: null,
          },pv.arg.query[v.i]);
        }
      }

      v.step = 1.2; // オプションの既定値設定
      pv.opt = Object.assign({
        accountTableName: 'ユーザ管理', // {string} 「ユーザ管理」シートの名前
        tokenExpiry: 10 * 60 * 1000, // トークンの有効期間
        validityPeriod: 24 * 60 * 60 * 1000, // {number}=1日 ログイン有効期間。有効期間を超えた場合は再ログインを必要とする
        graceTime: 10 * 60 * 1000, // {number} メール送信〜パスコード確認処理終了までの猶予時間(ミリ秒)
        passcodeValidityPeriod: 10 * 60 * 1000, // {number} パスコードの有効期間。ミリ秒
        maxTrial: 3 , // {number} パスコード入力の最大試行回数
        passcodeDigit: 6, // {number}=6  パスコードの桁数
        freezing: 60 * 60 * 1000, // {number} 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
        bits: 1024, // {number} 鍵長
      },opt);

      v.step = 1.3; // SpreadDb使用時のアカウントの既定値
      pv.account = {userId:'guest',userAuth:{log:'r'}};

      v.step = 2; // 「ユーザ管理」シートが存在しなければ作成
      v.r = SpreadDb({command:'create',table:pv.opt.accountTableName,cols:[
        {name:'userId',type:'string',primatyKey:true,default:'()=>{return Utilities.getUuid()}',note:'ユーザ識別子'},
        {name:'email',type:'',unique:true,note:'ユーザのメールアドレス'},
        {name:'name',type:'string',note:'ユーザの氏名'},
        {name:'phone',type:'string',note:'ユーザの電話番号'},
        {name:'address',type:'',note:'ユーザの住所'},
        {name:'note',type:'string',note:'その他ユーザ情報(備考)'},
        {name:'validityStart',type:'string',note:'有効期間開始日時'},
        {name:'validityEnd',type:'string',note:'有効期間終了日時'},
        {name:'CPkey',type:'string',note:'クライアント側公開鍵'},
        {name:'CPkeyExpiry',type:'string',note:'CPkey有効期限'},
        {name:'authority',type:'JSON',note:'シート毎のアクセス権限。{シート名:rwdos文字列} 形式'},
        {name:'trial',type:'JSON',note:'ログイン試行関連情報'},
        {name:'created',type:'string',note:'ユーザ登録日時',default:'()=>{return toLocale(new Date())'},
        {name:'updated',type:'string',note:'最終更新日時',default:'()=>{return toLocale(new Date())'},
        {name:'deleted',type:'string',note:'論理削除日時'},
      ]},{userId:'Administrator'});

      v.step = 3; // RSA鍵の取得
      v.docProps = PropertiesService.getDocumentProperties();
      pv.SPkey = v.docProps.getProperty('SPkey');
      if( !pv.SPkey ){
        v.pw = createPassword();
        if( v.pw instanceof Error ) throw v.pw;
        pv.SSkey = cryptico.generateRSAKey(v.pw,pv.opt.bits);
        v.docProps.setProperty('SSkey',JSON.stringify(pv.SSkey.toJSON()));
        pv.SPkey = cryptico.publicKeyString(pv.SSkey);
        v.docProps.setProperty('SPkey',pv.SPkey);
      } else {
        pv.SSkey = RSAKey.parse(v.docProps.getProperty('SSkey'));
        pv.SPkey = v.docProps.getProperty('SPkey');
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}