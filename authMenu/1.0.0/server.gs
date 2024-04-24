/** サーバ側の認証処理を分岐させる
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
 * 1. passPhrase {string} : authServerのパスフレーズ
 * 1. SSkey {Object} : authServerの秘密鍵
 * 1. SPkey {string} : authServerの公開鍵
 * 1. map {Object} : `{email:userId}`形式のマップ
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
        passPhrase : createPassword(16),
        map : {'shimokitasho.oyaji@gmail.com':0},
        userIdStartNumber : 1,
      };
      w.prop.SSkey = cryptico.generateRSAKey(w.prop.passPhrase,1024);
      w.prop.SPkey = cryptico.publicKeyString(w.prop.SSkey);
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
      if( ['registMail'].find(x => x === func) ){
        w.step = 1; // userId未定でも可能な処理 ⇒ 一般公開用
/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {number} arg.updated - 公開鍵更新日時(UNIX時刻)
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(arg){
  const v = {whois:w.whois+'.registMail',rv:null,step:0,
    max:(w.prop.userIdStartNumber - 1),
    prop:PropertiesService.getDocumentProperties(),
  };
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(arg.email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    // DocumentPropertiesにメアドが登録済か確認
    console.log(`l.132 w.prop=${stringify(w.prop)}`);
    if( w.prop.map.hasOwnProperty(arg.email) ){
      // メアドが登録済の場合

      v.step = 2.1; // ユーザの公開鍵を更新
      v.rv = w.prop[w.prop.map[arg.email]];
      v.rv.updated = arg.updated;
      v.rv.CPkey = arg.CPkey;
      v.prop.setProperty(w.prop.map[arg.email],v.rv);

      v.step = 2.2; // 戻り値用にユーザ情報を補完
      v.rv.isExit = true;
      v.rv.SPkey = w.prop.SPkey;

    } else {
      // メアドが未登録の場合

      v.step = 3.1; // 既登録userIdの最大値を検索
      Object.keys(w.prop.map).forEach(x => {
        if( w.prop.map[x] > v.max ) v.max = w.prop.map[x];
      });

      v.step = 3.2; // プロパティサービス用ユーザ情報オブジェクトを作成
      v.rv = {
        userId  : v.max + 1,
        created : Date.now(),
        updated : arg.updated,
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
      }

      v.step = 3.3; // プロパティサービスに保存
      v.step = 3.31; // email -> userId マップ
      w.prop.map[arg.email] = v.rv.userId;
      console.log(`l.180 w.prop=${stringify(w.prop)}`)
      v.prop.setProperties(w.prop);
      v.step = 3.32; // ユーザ情報
      v.prop.setProperty(v.rv.userId,v.rv);

      v.step = 3.4; // シートに追加
      v.master = new SingleTable(w.prop.masterSheet);
      v.r = v.master.insert([{
        userId: v.rv.userId,
        created: toLocale(new Date(v.rv.created),'yyyy/MM/dd hh:mm:ss.nnn'),
        email: v.rv.email,
        auth: v.rv.auth,
      }]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 3.5; // 戻り値用にユーザ情報を補完
      v.rv.isExist = false;
      v.rv.SPkey = w.prop.SPkey;
    }

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.registMail(arg);
if( w.rv instanceof Error ) throw w.rv;
      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {  // userIdが必要な処理
      if( ['login1S'].find(x => x === func) ){
        w.step = 3; // ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object}
 * 
 * @example
 * 
 * サーバ側に鍵ペアが存在しない場合は自動生成してプロパティサービスに保存
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`w.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`w.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
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
  const v = {whois:w.whois+'.verifySignature',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    // userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois);
    if( v.RSA === null ){
      v.step = 1.1;
      v.bits = 1024;  // ビット長
      v.RSA.passPhrase = createPassword(16); // 16桁のパスワードを自動生成
      v.step = 1.2; // 秘密鍵の生成
      v.RSA.privateKey = cryptico.generateRSAKey(v.RSA.passPhrase, v.bits);
      v.step = 1.3; // 公開鍵の生成
      v.RSA.publicKey = cryptico.publicKeyString(v.RSA.privateKey);
      PropertiesService.getDocumentProperties().setProperty(w.whois,v.RSA);
    }

    v.step = 2; // クライアント側情報の取得
    v.client = PropertiesService.getDocumentProperties().getProperty(userId);

    if( v.client === null ){
      v.step = 3; // クライアント側情報未登録 ⇒ 空オブジェクトを返す
      v.client = {
        userId: userId,
        email: '',
        created: Date.now(),
        publicKeyID: '',
        authority: 2,
        log: [],
      };
      PropertiesService.getDocumentProperties().setProperty(userId,v.client);
    } else {
      v.step = 4; // クライアント側情報登録済
      v.step = 4.1; // 引数の復元
      v.decrypt = cryptico.decrypt(arg,v.RSA.privateKey);
      console.log(`v.decrypt=${stringify(v.decrypt)}`);
      v.step = 4.2; // 署名の検証
      v.decrypt.publicKeyID = cryptico.publicKeyID(v.decrypt.publicKeyString);
      v.decrypt.verify = v.client.publicKeyID === v.decrypt.publicKeyID;
      v.step = 4.3; // 有効期間の確認。　※親関数のvalidityPeriodを使用
      v.decrypt.validityPeriod = (v.client.created + w.validityPeriod) < Date.now();
      v.step = 4.3; // 戻り値をオブジェクト化
      v.rv = v.decrypt.status === 'success' && v.decrypt.verify && v.decrypt.validityPeriod
      ? JSON.parse(v.decrypt.plaintext)
      : new Error(`cryptico.decrypt error.`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    console.log(`type = ${typeof v.rv}\npassPhrase="${v.rv.passPhrase}\npublicKey="${v.rv.publicKey}"`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
w.r = w.func.verifySignature(userId,arg);
if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
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
