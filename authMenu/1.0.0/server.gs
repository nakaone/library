/** サーバ側の認証処理を分岐させる
 * 
 * 1. ユーザID未定でも可能な処理(一般公開部分)
 * 1. ユーザIDは必要だが、ログイン(RSA)は不要な処理
 * 1. RSAキーが必要な処理
 * 
 * @param {number} userId 
 * @param {string} func - 分岐先処理名
 * @param {string} arg - 分岐先処理に渡す引数オブジェクト
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{},prop:{}};
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 既定値をwに登録
/** authServerの適用値を設定
 * 
 * これら設定値はプロジェクトにより異なるため、
 * プロジェクト毎に適宜ソースを修正して使用すること。
 * 
 * @param {number|null} userId 
 * @returns {null}
 * 
 * 1. propertyName='authServer' {string}<br>
 *    プロパティサービスのキー名
 * 1. passcodeDigits=6 {number} : パスコードの桁数
 * 1. loginRetryInterval=3,600,000(60分) {number}<br>
 *    前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
 * 1. numberOfLoginAttempts=3 {number}<br>
 *    ログイン失敗になるまでの試行回数
 * 1. loginGraceTime=900,000(15分) {number}<br>
 *    パスコード生成からログインまでの猶予時間(ミリ秒)
 * 1. userLoginLifeTime=86,400,000(24時間) {number}<br>
 *    クライアント側ログイン(CPkey)有効期間
 * 1. defaultAuth=2 {number}<br>
 *    新規登録者に設定する権限
 * 1. masterSheet='master' {string}<br>
 *    参加者マスタのシート名
 * 1. primatyKeyColumn='userId' {string}<br>
 *    主キーとなる項目名。主キーは数値で設定
 * 1. emailColumn='email' {string}<br>
 *    e-mailを格納するシート上の項目名
 * 1. RSA {Object} : サーバ側RSAキー関連情報
 *    1. passPhraseLength=16 {number} : authServerのパスフレーズの長さ
 *    1. passPhrase {string} : authServerのパスフレーズ(自動生成)
 *    1. bits=1024 {number} : RSAキーのビット長
 *    1. SSkey {Object} : authServerの秘密鍵
 *    1. SPkey {string} : authServerの公開鍵
 * 1. userIdStartNumber=1 : ユーザID(数値)の開始
 * 
 * - [Class Properties](https://developers.google.com/apps-script/reference/properties/properties?hl=ja)
 */
w.func.setProperties = function(){
  const v = {whois:w.whois+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 適用値をセット
    w.prop = PropertiesService.getDocumentProperties().getProperties();
    if( Object.keys(w.prop).length === 0 ){
      w.prop = {
        propertyName : 'authServer',
        loginRetryInterval : 3600000,
        numberOfLoginAttempts : 3,
        loginGraceTime : 900000,
        userLoginLifeTime : 86400000,
        defaultAuth : 2,
        masterSheet : 'master',
        primatyKeyColumn : 'userId',
        emailColumn : 'email',
        RSA : {
          passPhraseLength : 16,
          bits: 1024,  
        },
        userIdStartNumber : 1,
        notificatePasscodeMail: {
          subject: '[連絡] パスコード',
          body: 'パスコードは以下の通りです。\n\n::passcode::',
          options: {},
        },
      };
      w.prop.RSA.passPhrase = createPassword(w.prop.RSA.passPhraseLength),
      w.prop.RSA.SSkey = cryptico.generateRSAKey(w.prop.RSA.passPhrase,w.prop.RSA.bits);
      w.prop.RSA.SPkey = cryptico.publicKeyString(w.prop.RSA.SSkey);
      // プロパティサービスを更新
      PropertiesService.getDocumentProperties().setProperties(w.prop);
    }
    console.log(`${v.whois} normal end.\n`,w.prop);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.setProperties(arg);
if( w.rv instanceof Error ) throw w.rv;

    if( userId === null ){ // userIdが不要な処理
      if( ['registMail','getUserInfo'].find(x => x === func) ){
        w.step = 1; // userId未定でも可能な処理 ⇒ 一般公開用
        //:x:メールアドレスの登録::$src/server.registMail.js::
/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @returns {object} 以下のメンバを持つオブジェクト
 * 1. SPkey {string} - サーバ側公開鍵
 * 1. isExist {boolean} - 既存メアドならtrue、新規登録ならfalse
 * 1. isEqual {boolean} - 引数のCPkeyがシート上のCPkeyと一致するならtrue
 * 1. isExpired {boolean} - CPkeyが有効期限切れならtrue
 * 1. data {object} - 該当ユーザのシート上のオブジェクト
 */
w.func.getUserInfo = function(arg){
  const v = {whois:w.whois+'.getUserInfo',step:0,rv:{
    SPkey:w.prop.SPkey,
    isExist:true, isEqual:true, isExpired:false, data:null,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(arg.email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // メアドの登録状況を取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 3; // メアドが登録済か確認、登録済ならシートのユーザ情報を保存
    for( v.i=0 ; v.i<v.master.data.length ; v.i++ ){
      if( v.master.data[v.i][w.prop.emailColumn] === arg.email ){
        v.rv.data = v.master.data[v.i];
        break;
      }
    }

    if( v.rv.data === null ){
      v.step = 4; // メアドが未登録の場合

      v.step = 4.1; // userIdの最大値を取得
      if( v.master.data.length === 0 ){
        // 登録済が0件(シート作成直後)の場合
        v.max = w.prop.userIdStartNumber - 1;
      } else {
        v.map = v.master.data.map(x =>
          isNaN(x[w.prop.primatyKeyColumn])
          ? 0 : Number(x[w.prop.primatyKeyColumn]));
        v.max = Math.max(...v.map);
      }

      v.step = 4.2; // シートに初期値を登録
      v.rv.data = {
        userId  : v.max + 1,
        created : toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn'),
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
        updated : null,
        trial   : '{}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = v.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 4.3; // 存否フラグを更新
      v.rv.isExist = false;
    }

    v.step = 5; // 戻り値用にユーザ情報の項目を調整
    v.rv.isEqual = v.rv.data.CPkey === arg.CPkey;
    v.rv.isExpired = (new Date(v.rv.data.updated).getTime() + w.userLoginLifeTime) > Date.now();

    v.step = 6; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.getUserInfo(arg);
if( w.rv instanceof Error ) throw w.rv;
      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {  // userIdが必要な処理
      if( ['sendPasscode'].find(x => x === func) ){
        w.step = 3; // ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)
        switch( func ){
          case 'sendPasscode': w.step += ':sendPasscode';
/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * ユーザIDやCS/CPkey他の自ユーザ情報、およびSPkeyはauthClient.constructor()で初期値を設定し、
 * 先行する「新規ユーザ登録」で修正済情報がインスタンス変数に存在する前提。
 * 
 * @param {Object} arg
 * @param {number} arg.userId - ユーザID
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {string} arg.updated - CPkey生成・更新日時文字列
 * @returns {object} 以下のメンバを持つオブジェクト
 * - status {number}
 *   - 0 : 成功(パスコード通知メールを送信)
 *   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
 *   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - SPkey=null {Object} サーバ側公開鍵
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.sendPasscode = function(arg){
  const v = {whois:w.whois+'.sendPasscode',step:0,rv:{
    status: 0, data: null, SPkey: null,
    loginGraceTime: w.prop.loginGraceTime,
    remainRetryInterval: 0,
    passcodeDigits: w.prop.passcodeDigits,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // シートから全ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 1.2; // 対象ユーザ情報の取得
    v.user = v.master.select({where: x => x[w.prop.primatyKeyColumn] === arg.userId});
    if( v.user instanceof Error ) throw v.user;

    v.step = 1.3; // trialオブジェクトの取得
    v.trial = JSON.parse(v.user.trial);
    if( !v.trial.hasOwnProperty('log') ) v.trial.log = [];


    // ---------------------------------------------
    v.step = 2; // パスコード生成
    //【trialオブジェクト定義】
    // - passcode {number} パスコード(原則数値6桁)
    // - created {number} パスコード生成日時(UNIX時刻)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} v.rv.statusの値
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // ---------------------------------------------

    v.step = 2.1; // 試行可能かの確認
    // 以下のいずれかの場合はエラーを返して終了
    // ①パスコード生成からログインまでの猶予時間を過ぎている
    if( (w.prop.loginGraceTime + trial.created) > Date.now() ){
      v.rv.status = 1;
      return v.rv;
    }
    // ②前回ログイン失敗から凍結時間を過ぎていない
    if( v.trial.log.length > 0 ){
      if( trial.log[0].status === w.prop.numberOfLoginAttempts
      && (trial.log[0].timestamp + w.prop.loginRetryInterval) > Date.now() )
        v.rv.status = 2;
        v.rv.remainRetryInterval = trial.log[0].timestamp
          + w.prop.loginRetryInterval - Date.now();
        return v.rv;
    }

    v.step = 2.2; // trialオブジェクトを生成、シートに保存
    v.trial.passcode = Math.floor(Math.random() * Math.pow(10,w.prop.passcodeDigits));
    v.trial.created = Date.now();

    v.step = 2.3; // trial更新に合わせ、CPkey/updatedも更新
    // sendPasscodeが呼ばれるのは「CP不一致 or CP無効」の場合。
    // よって送られてきた新規CPkey/updatedでシート上のそれを更新する
    v.r = v.master.update({
      CPkey: arg.CPkey,
      updated: arg.updated,
      trial: JSON.stringify(v.trial)
    },{where: x => x[w.prop.primatyKeyColumn] === arg.userId});


    // ---------------------------------------------
    v.step = 3; // パスコード通知メールの発信
    // ---------------------------------------------
    // $lib/sendmail/1.0.0/core.js
    // @param {String} recipient - 受信者のアドレス
    // @param {String} subject - 件名
    // @param {String} body - メールの本文
    // @param {Object} options - 詳細パラメータを指定する JavaScript オブジェクト（下記を参照）
    // @param {BlobSource[]} options.attachments - メールと一緒に送信するファイルの配列
    // @param {String} options.bcc - Bcc で送信するメールアドレスのカンマ区切りのリスト
    // @param {String} options.cc - Cc に含めるメールアドレスのカンマ区切りのリスト
    // @param {String} options.from - メールの送信元アドレス。getAliases() によって返される値のいずれかにする必要があります。
    // @param {String} options.htmlBody - 設定すると、HTML をレンダリングできるデバイスは、必須の本文引数の代わりにそれを使用します。メール用にインライン画像を用意する場合は、HTML 本文にオプションの inlineImages フィールドを追加できます。
    // @param {Object} options.inlineImages - 画像キー（String）から画像データ（BlobSource）へのマッピングを含む JavaScript オブジェクト。これは、htmlBody パラメータが使用され、<img src="cid:imageKey" /> 形式でこれらの画像への参照が含まれていることを前提としています。
    // @param {String} options.name - メールの送信者の名前（デフォルト: ユーザー名）
    // @param {String} options.replyTo - デフォルトの返信先アドレスとして使用するメールアドレス（デフォルト: ユーザーのメールアドレス）
    // @returns {null|Error}
    //
    // w.prop.notificatePasscodeMailでテンプレート設定済
    // notificatePasscodeMail: {
    //   subject: '[連絡] パスコード',
    //   body: 'パスコードは以下の通りです。\n\n::passcode::',
    //   options: {},
    // },
    v.trial.body = w.prop.notificatePasscodeMail.body
    .replaceAll('::passcode::',('0'.repeat(w.prop.passcodeDigits)
    + String(v.trial.passcode)).slice(-w.prop.passcodeDigits));
    v.r = sendmail(
      v.user.email, // recipient
      w.prop.notificatePasscodeMail.subject, // subject
      v.trial.body, // body
      w.prop.notificatePasscodeMail.options // options
    );
    if( v.r instanceof Error ) throw v.r;


    // ---------------------------------------------
    v.step = 4; // 終了処理
    // ---------------------------------------------
    v.rv.data = v.user;
    delete v.rv.data.trial; // 悪用されないよう、念のため削除
    v.rv.SPkey = w.prop.SPkey;
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.sendPasscode(arg);
if( w.rv instanceof Error ) throw w.rv;
            break;
        }

      } else if( ['verifyPasscode','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object|Error} 復号化したオブジェクト
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{result:0,message:'',obj:null},step:0};
  console.log(`${v.whois} start.`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // 引数チェック。userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1.2; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois).RSA;


    // ---------------------------------------------
    v.step = 2; // クライアント側情報の取得
    // ---------------------------------------------
    v.step = 2.1; // シートから全ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 2.2; // 対象ユーザ情報の取得
    v.user = v.master.select({where: x => x[w.prop.primatyKeyColumn] === userId});
    if( v.user instanceof Error ) throw v.user;

    v.step = 2.3 // userIdがシートに存在しない
    if( v.user.length === 0 ){
      v.rv.result = 1;
      console.log(`${v.whois}: no userId on sheet ${w.prop.masterSheet} (step ${v.step}).`);
      return v.rv;
    }
    
    // ---------------------------------------------
    v.step = 3; // 引数の復元
    // 【以下の処理におけるv.rvオブジェクトのメンバ】
    // - result {number}
    //   - 0: 正常終了
    //   - 1: userIdがシートに存在しない
    //   - 2: 不適切な暗号化(decrypt.status != 'success')
    //   - 3: 不適切な署名(decrypt.publicKeyString != sheet.CPkey)<br>
    //     ※ decrypt.signatureは常に"forged"で"verified"にならないため、CPkeyを比較
    //   - 4: CPkey有効期限切れ
    // - message='' {string} エラーだった場合のメッセージ
    // - obj=null {object} 復号したオブジェクト
    // ---------------------------------------------
    v.decrypt = cryptico.decrypt(arg,v.RSA.SPkey);
    //console.log(`v.decrypt=${stringify(v.decrypt)}`);
    if( v.decrypt.status !== 'success' ){
      v.step = 3.1; // 復号不可
      v.rv.result = 2;
      v.rv.message = `${v.whois}: decrypt error (step ${v.step}).`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`;
    } else if( v.decrypt.publicKeyString !== v.user.CPkey ){
      v.step = 3.2; // 不適切な署名(CPkey不一致)
      v.rv.result = 3;
      v.rv.message = `${v.whois}: CPkey unmatch (step ${v.step}).`
      + `\nv.decrypt.publicKeyString=${v.decrypt.publicKeyString}`
      + `\nv.user.CPkey=${v.user.CPkey}`;
    } else if( (new Date(v.user.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      v.step = 3.3; // CPkey有効期限切れ
      v.rv.result = 4;
      v.rv.message = `${v.whois}: CPkey expired (step ${v.step}).`
      + `\nupdated: ${v.user.updated})`
      + `\nuserLoginLifeTime: ${w.prop.userLoginLifeTime/3600000} hours`
      + `\nDate.now(): ${toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')}`;
    } else {
      v.step = 3.4; // 正常終了
      v.rv.obj = JSON.parse(v.decrypt.plaintext);
    }
    if( v.rv.result > 0 ) throw new Error(v.rv.message);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv.obj;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
w.r = w.func.verifySignature(userId,arg);
if( w.r instanceof Error ) throw w.r;
        // verifySignatureの戻り値はw.rで受けるので、後続処理に引数として渡す

        switch( func ){
          case 'verifyPasscode': w.step += ':verifyPasscode';
/** 入力されたパスコードの検証
 * 
 * @param {Object} arg
 * @param {number} arg.userId - ユーザID
 * @param {number} arg.passcode - 入力されたパスコード
 * @returns {Object|number} ユーザ情報オブジェクト。エラーならエラーコード
    // ログイン失敗になるまでの試行回数(numberOfLoginAttempts)
    // パスコード生成からログインまでの猶予時間(ミリ秒)(loginGraceTime)
    // クライアント側ログイン(CPkey)有効期間(userLoginLifeTime)
 * @returns {object} 以下のメンバを持つオブジェクト
 * - status {number}
 *   - 0 : 成功(パスコードが一致)
 *   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
 *   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
 *   - 3 : クライアント側ログイン(CPkey)有効期限切れ
 *   - 4 : パスコード不一致
 * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
 * - SPkey=null {Object} サーバ側公開鍵
 * - loginGraceTime=900,000(15分) {number}<br>
 *   パスコード生成からログインまでの猶予時間(ミリ秒)
 * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
 * - passcodeDigits=6 {number} : パスコードの桁数
 */
w.func.verifyPasscode = function(arg){
  const v = {whois:w.whois+'.verifyPasscode',step:0,rv:{
    status: 0, data: null, SPkey: null,
    loginGraceTime: w.prop.loginGraceTime,
    remainRetryInterval: 0,
    passcodeDigits: w.prop.passcodeDigits,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    // ---------------------------------------------
    v.step = 1; // 事前準備
    // ---------------------------------------------
    v.step = 1.1; // シートから全ユーザ情報の取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 1.2; // 対象ユーザ情報の取得
    v.user = v.master.select({where: x => x[w.prop.primatyKeyColumn] === arg.userId});
    if( v.user instanceof Error ) throw v.user;

    v.step = 1.3; // trialオブジェクトの取得
    v.trial = JSON.parse(v.user.trial);
    if( !v.trial.hasOwnProperty('log') ) v.trial.log = [];


    // ---------------------------------------------
    v.step = 2; // パスコード検証
    // ---------------------------------------------
    // ログイン失敗になるまでの試行回数(numberOfLoginAttempts)
    // パスコード生成からログインまでの猶予時間(ミリ秒)(loginGraceTime)
    // クライアント側ログイン(CPkey)有効期間(userLoginLifeTime)

    v.step = 2.1; // 試行可能かの確認
    // 以下のいずれかの場合はエラーを返して終了
    if( (w.prop.loginGraceTime + v.trial.created) > Date.now() ){
      // ①パスコード生成からログインまでの猶予時間を過ぎている
      v.rv.status = 1;
    } else if( v.trial.log.length > 0
      && trial.log[0].status === w.prop.numberOfLoginAttempts
      && (trial.log[0].timestamp + w.prop.loginRetryInterval) > Date.now() ){
      // ②前回ログイン失敗から凍結時間を過ぎていない
      v.rv.status = 2;
      v.rv.remainRetryInterval = trial.log[0].timestamp
        + w.prop.loginRetryInterval - Date.now();
    } else if( (new Date(v.user.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
      // ③クライアント側ログイン(CPkey)有効期限切れ(userLoginLifeTime)
      v.rv.status = 3;
    } else if( v.trial.passcode !== arg.passcode ){
      // ④パスコード不一致
      v.rv.status = 4;
    } else {
      // パスコードが一致
      v.rv.data = v.user;
    }

    // ---------------------------------------------
    v.step = 3; // 終了処理
    // ---------------------------------------------
    v.step = 3.1; // trial更新(検証結果の格納)
    // - passcode {number} パスコード(原則数値6桁)
    // - log {object[]} 試行の記録。unshiftで先頭を最新にする
    //   - timestamp {number} 試行日時(UNIX時刻)
    //   - entered {number} 入力されたパスコード
    //   - status {number} v.rv.statusの値
    //   - result {number} 0:成功、1〜n:連続n回目の失敗
    // 
    // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
    // 新しいlogオブジェクトの作成
    v.log = {
      timestamp: Date.now(),
      entered: arg.passcode,
      status: v.status,
      result: v.status === 0 ? 0 : (v.trial.log[0].result + 1),
    }
    v.trial.log.unshift(v.log);
    v.r = v.master.update({trial:JSON.stringify(v.trial)},
      {where:x => x.userId === arg.userId});
    if( v.r instanceof Error ) throw v.r;


    v.step = 3.2; // 検証OKならユーザ情報を、NGなら通知を返す
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.verifyPasscode(w.r);  // w.rはserver.verifySignatureの戻り値
if( w.rv instanceof Error ) throw w.rv;
            break;
          case 'operation': w.step += ':operation';
            //:x:$src/server.operation.js::
            break;
          // 後略
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
