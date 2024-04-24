function authServerTest(){
  //PropertiesService.getDocumentProperties().deleteAllProperties();
  const p = PropertiesService.getDocumentProperties().getProperties();
  console.log(p);
  /*
  ローカル側での重複メアドチェック
  サーバ側での重複メアドチェック
  シートに格納された値
  localStorage
  sessionStorage
  properties.authServer(特にmap)
  properties.userId

  const v = {target:'registMail',
    registMail:[
      //[null,'registMail','invalid'],
      [null,'registMail','hoge@gmail.com'],
      [null,'registMail','fuga@gmail.com'],
    ],
  };
  if( true ){ // debug
    PropertiesService.getDocumentProperties().deleteAllProperties();
  }
  if( v.target === 'registMail' ){
    for( v.i=0 ; v.i<v[v.target].length ; v.i++ ){
      v.rv = authServer(...v[v.target][v.i]);
      console.log(`${v.i} v.rv=${stringify(v.rv)}`);
    }
  }
  */
}
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
/** 文字列がe-mail等として正しい形式か判断
 * 
 * @param {string} str - 検査対象となる文字列
 * @param {string} type='email' - 'email' or 'URL' or 'tel'
 * @returns {boolean}
 */
function checkFormat(str,type='email'){
  switch(type){
    case 'email':
      //return str.match(new RegExp("[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+")) ? true : false;
      // https://www.javadrive.jp/regex-basic/sample/index13.html#google_vignette
      return str.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) ? true : false;
    case 'URL':
      return str.match(new RegExp("https?://[\w!?/+\-_~;.,*&@#$%()'[\]]+")) ? true : false;
    default: return false;
  }
}
/** 長さ・文字種指定に基づき、パスワードを生成
 * 
 * @param {number} [len=16] - パスワードの長さ
 * @param {Object} opt 
 * @param {boolean} [opt.lower=true] - 英小文字を使うならtrue
 * @param {boolean} [opt.upper=true] - 英大文字を使うならtrue
 * @param {boolean} [opt.symbol=true] - 記号を使うならtrue
 * @param {boolean} [opt.numeric=true] - 数字を使うならtrue
 * @returns {string}
 */
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,',
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}/** パラメータを確認、表示ページを振り分ける
 * @param {Event} e - GASから渡されるイベントオブジェクト。
 * @returns {HtmlOutput}
 * - GAS公式 ウェブアプリ - [リクエストパラメータ](https://developers.google.com/apps-script/guides/web?hl=ja)
 * - [Webページからデータを送信する](https://www2.kobe-u.ac.jp/~tnishida/programming/GAS-02.html#senddata)
 * 
 * @example
 * 
 * `https://〜/dev?hoge=fuga&a=10&b=true`
 * ⇒ `{"b":"true","hoge":"fuga","a":"10"}`
 */
function doGet(e){
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = e.parameter.id;
  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('camp2024');
  return htmlOutput;
}
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/**
 * @typedef {Object} SingleTableObj
 * @prop {string} className - クラス名(='SingleTable')
 * @prop {string} name - シート名。データを引数で渡し、シートを作成しない場合は空文字列
 * @prop {string} type - 元データ。'sheet' or 'data'
 * @prop {string[]} header - ヘッダ行(項目名欄の並び)
 * @prop {any[][]} raw - 指定シート上の有効データ(二次元配列)。添字=0がヘッダ行になる
 * @prop {Array.Object.<string, any>} data - 項目名：値をメンバとするオブジェクトの配列
 * @prop {number} top - ヘッダ行の行番号(自然数)
 * @prop {number} left - データ領域左端の列番号(自然数)
 * @prop {number} right - データ領域右端の列番号(自然数)
 * @prop {number} bottom - データ領域下端の行番号(自然数)
 */

/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * 
 * - 原則「1シート1テーブル」で運用する
 *   ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
 *   複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
 * - 表の結合には対応しない(join機能は実装しない)
 * - データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
 * - 本クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
 * 
 * #### 参考
 * 
 * - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
 * 
 * #### 使用するライブラリ
 * 
 * - convertNotation
 * 
 * #### 将来的検討課題
 * 
 * 1. groupByメソッドの追加
 * 1. ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)
 */
class SingleTable {

  /** SingleTableオブジェクトの生成
   * - 引数が二つの場合、name＋optと解釈。一つの場合はoptのみと解釈する。
   * - optで指定可能なメンバは以下の通り
   *   - name : 参照先シート名またはA1形式の範囲指定文字列
   *   - raw : シートイメージ(二次元配列)
   *   - data : オブジェクトの配列
   * - クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
   * 
   * @param {string|Object} arg1 - 参照先シート名またはA1形式の範囲指定文字列(name)、またはオプション(opt)
   * @param {Object} arg2 - オプション(opt)
   * @returns {SingleTableObj|Error}
   */
  constructor(arg1,arg2){
    const v = {whois:'SingleTable.constructor',rv:null,step:0,arg:{}};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1.1; // 全引数のオブジェクト化＋既定値の設定
      if( typeof arg1 === 'string' ){ // name指定あり
        v.arg = Object.assign({name:arg1},(arg2 || {}));
      } else { // name指定なしでopt指定、または引数無し
        v.arg = arg1;
      }
      v.arg = Object.assign({name:'',raw:[],data:[],header:[]},v.arg);
  
      v.step = 1.2; // メンバの初期値を設定
      this.sheet = null;
      this.className = 'SingleTable';
      this.name = v.arg.name || '';
      ['header','raw','data'].forEach(x => this[x] = (v.arg[x] || []));
  
      v.step = 1.3; // nameから指定範囲を特定、メンバに保存
      v.m = this.name.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
      //old v.m = this.name.match(/^'*(.+?)'*!([A-Za-z]+)([0-9]*):([A-Za-z]+)([0-9]*)$/);
      if( v.m ){
        // シート名がA1形式の範囲指定文字列ならname,left/top/right/bottomを書き換え
        this.name = v.m[1];
        this.left = convertNotation(v.m[2]);
        if( v.m[3] ) this.top = Number(v.m[3]);
        this.right = convertNotation(v.m[4]);
        if( v.m[5] ) this.bottom = Number(v.m[5]);
      } else {
        this.top = this.left = 1;
        this.bottom = this.right = Infinity;
      }
      //console.log(`l.65 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}\ndata=${JSON.stringify(this.data)}\nraw=${JSON.stringify(this.raw)}`);
  
      v.step = 2; // sheetかdataかで処理を分岐
      this.type = (this.data.length > 0 || this.raw.length > 0 ) ? 'data' : 'sheet';
      if( this.type === 'sheet' ){
        v.r = this.prepSheet();
      } else {
        v.r = this.prepData();
      }
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg1=${JSON.stringify(arg1)}\narg2=${JSON.stringify(arg2)}`;  // 引数
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }  

  /** シートから指定有効範囲内のデータを取得
   * - 「指定有効範囲」とは、指定範囲かつデータが存在する範囲を指す。<br>
   *   例：指定範囲=C2:F ⇒ top=3, bottom=7, left=3(C列), right=6(F列)
   * 
   *   | | A | B | C | D | E | F | G | H |
   *   | :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
   *   | 1 | |  | タイトル |  |  |  |  |  |  |
   *   | 2 | |  |  |  |  |  |  |  |  |
   *   | 3 | |  | (Col1) | D3 | E3 | (Col2) |  |  |  |
   *   | 4 | |  |  |  |  |  |  |  |  |
   *   | 5 | |  | 5 | 4 |  |  |  |  |  |
   *   | 6 | |  | 5 | 6 | 7 | 8 |  |  |  |
   *   | 7 | |  | 4 | 3 | hoge | fuga |  |  |  |
   *   | 8 | |  |  |  |  |  |  |  |  |
   *   | 9 | |  |  |  |  |  |  | dummy |  |
   *   | 10 | |  |  |  |  |  |  |  |  |
   * 
   *   - 有効範囲とはデータが存在する範囲(datarange=C1:H9)
   *   - 「タイトル(C1)」「dummy(H9)」は有効範囲だが、指定範囲(C2:F)から外れるので除外
   *   - 指定範囲にデータが存在しない場合、指定有効範囲はデータが存在する範囲とする<br>
   *     ex.C2:Fだが2行目は空なのでtop=3、C列はタイトルはないがデータが存在するのでleft=3
   *   - ヘッダ行(3行目)の空白セル(C3,F3)には自動採番したコラム名を設定(Col1,Col2)
   *   - データ範囲はヘッダ行(3行目)の次の行(4行目)から始まると看做す
   *   - データ範囲内の空行(4行目)もraw/data共に入れる<br>
   *     ∵ シート上の行位置とオブジェクトの位置を対応可能にするため
   *   - 空白セルはdataには入れない(undefinedになる)<br>
   *     ex.5行目={C3:5,D3:4}(Col1,2はundef)、6行目={C3:5,D3:6,Col1:7,Col2:8}
   *   - 有効範囲は9行目(dummy)までだが、指定範囲内だと7行目までなので、bottom=7
   * 
   * @param {void}
   * @returns {void}
   */
  prepSheet(){
    const v = {whois:this.className+'.prepSheet',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // シートからデータを取得、初期値設定
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.name);
      if( this.sheet instanceof Error ) throw this.sheet;
  
      v.step = 2; // 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
      v.dataRange = this.sheet.getDataRange();
      v.top = v.dataRange.getRow();
      v.bottom = v.dataRange.getLastRow();
      v.left = v.dataRange.getColumn();
      v.right = v.dataRange.getLastColumn();
      //console.log(`l.185 v.top=${v.top}, bottom=${v.bottom}, left=${v.left}, right=${v.right}`+`\nthis.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);
      this.top = this.top < v.top ? v.top : this.top;
      // 最終行が先頭行以上、または範囲外の場合は存在範囲に変更
      this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
      this.left = this.left < v.left ? v.left : this.left;
      this.right = this.right > v.right ? v.right : this.right;
      //console.log(`l.191 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);
  
      v.step = 3; // ヘッダ行番号以下の有効範囲(行)をv.rawに取得
      v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
      v.raw = this.sheet.getRange(...v.range).getValues();
      //console.log(`l.196 v.raw=${JSON.stringify(v.raw.slice(0,10))}`);
  
      v.step = 4; // ヘッダ行の空白セルに'ColN'を補完
      v.colNo = 1;
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        this.header.push( v.raw[0][v.i] === '' ? 'Col' + v.colNo : v.raw[0][v.i] );
        v.colNo++;
      }
  
      v.step = 5; // 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
      for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
        if( v.raw[v.r].join('').length > 0 ){
          this.bottom = this.top + v.r;
          break;
        }
      }
  
      v.step = 6; // this.raw/dataにデータをセット
      this.raw[0] = v.raw[0]; // ヘッダ行
      for( v.r=1 ; v.r<=(this.bottom-this.top) ; v.r++ ){
        this.raw.push(v.raw[v.r]);
        v.o = {};
        for( v.c=0 ; v.c<this.header.length ; v.c++ ){
          if( v.raw[v.r][v.c] !== '' ){
            v.o[this.header[v.c]] = v.raw[v.r][v.c];
          }
        }
        this.data.push(v.o);
      }
  
      v.step = 7; // 終了処理
      this.dump();
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  /** オブジェクトの配列からシートイメージを作成
    * - シートイメージで渡された場合(raw)
    *   - headerは指定の有無に拘わらず先頭行で置換<br>
    *     ∵ rawとheaderで内容に齟齬が有った場合、dataが適切に作成されない
    *   - 先頭行に空欄が有った場合、ColNで自動的に命名
    * - オブジェクトの配列が渡された場合(data)
    *   - headerの指定なし：メンバ名を抽出してheaderを作成
    *   - headerの指定あり：データとしてのオブジェクトにheaderに無いメンバが有っても無視
    * - rawとdata両方が渡された場合、いずれも変更しない(齟齬の有無はノーチェック)
    * - 以下の条件をすべて満たす場合、新規にシートを作成
    *   - シート名がthis.nameのシートが存在しない
    *   - 操作対象がシートではない(this.type === 'data')
    *   - シート名(this.name)が指定されている
    * - シートはthis.nameで指定された名前になるが、左上のセル位置も併せて指定可能<br>
    *   ex. 'testsheet'!B2<br>
    *   なおセル位置は左上の単一セル指定のみ有効、他は有っても無視(ex.B2:C5ならC5は無視)
    * 
    * 1. オブジェクトの配列(this.data.length > 0) ※択一
    *    1. headerの作成
    *    1. rawの作成
    * 1. シートイメージ(this.raw.length > 0) ※択一
    *    1. headerの作成 : 1行目をヘッダと看做す(添字:0)
    *    1. dataの作成
    * 1. シートの作成(this.type=='data' && this.name!=null)
    *    1. 既存のシートがないか確認(存在すればエラー)
    *    1. this.rawをシートに出力
    * 
    * @param {void}
    * @returns {void}
    */
  prepData(){
    const v = {whois:this.className+'.prepData',rv:null,step:0,colNo:1};
    console.log(`${v.whois} start.`);
    try {
  
      if( this.data.length > 0 ){
        v.step = 1; // オブジェクトの配列でデータを渡された場合
        v.step = 1.1; // headerの作成
        if( this.header.length === 0 ){
          v.members = new Set();
          this.data.forEach(x => {
            Object.keys(x).forEach(y => v.members.add(y));
          });
          this.header = Array.from(v.members);
        }
        v.step = 1.2; // rawの作成
        this.raw[0] = this.header;
        for( v.r=0 ; v.r<this.data.length ; v.r++ ){
          this.raw[v.r+1] = [];
          for( v.c=0 ; v.c<this.header.length ; v.c++ ){
            v.val = this.data[v.r][this.header[v.c]];
            this.raw[v.r+1][v.c] = v.val ? v.val : '';
          }
        }
      } else {
        v.step = 2; // シートイメージでデータを渡された場合
        v.step = 2.1; // headerの作成
        this.header = JSON.parse(JSON.stringify(this.raw[0]));
        for( v.c=0 ; v.c<this.header.length ; v.c++ ){
          if( this.header[v.c] === '' ) this.header[v.c] = 'Col' + v.colNo++;
        }
        v.step = 2.2; // dataの作成
        if( this.data.length === 0 ){
          for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
            v.o = {};
            for( v.c=0 ; v.c<this.header.length ; v.c++ ){
              v.o[this.header[v.c]] = this.raw[v.r][v.c];
            }
            this.data.push(v.o);
          }
        }
      }
  
      v.step = 3; // raw/data以外のメンバの設定
      this.bottom = this.top + this.raw.length - 1;
      this.right = this.left + this.raw[0].length - 1;
  
      v.step = 4; // シートの作成
      v.ass = SpreadsheetApp.getActiveSpreadsheet();
      if( this.type==='data' && this.name!=='' && v.ass.getSheetByName(this.name)===null ){
        this.sheet = v.ass.insertSheet();
        this.sheet.setName(this.name);
        this.sheet.getRange(this.top,this.left,this.raw.length,this.raw[0].length)
        .setValues(this.raw);
      }
  
      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

    /** SingleTableクラスメンバの値をダンプ表示 */
    dump(av=null){
      const v = {whois:this.className+'.dump',rv:null,step:0,colNo:1};
      console.log(`${v.whois} start.`);
      try {
  
        v.step = 1; // メンバの値
        v.msg = `member's value ----------`
        + `\nclassName=${this.className}, name=${this.name}, type=${this.type}`
        + `\ntop=${this.top}, left=${this.left}, bottom=${this.bottom}, right=${this.right}`
        + `\nheader=${JSON.stringify(this.header)}`
        + `\ndata=${JSON.stringify(this.data)}`
        + `\nraw=${JSON.stringify(this.raw)}`;
  
        v.step = 2; // vの値
        if( av !== null ){
          v.msg += `\n\nvariable's value ----------`
          + `\ntop=${av.top}, left=${av.left}, bottom=${av.bottom}, right=${av.right}`;
        }
  
        v.step = 3; // ダンプ
        console.log(v.msg);
  
        v.step = 2; // 終了処理
        console.log(`${v.whois} normal end.`);
        return v.rv;
  
      } catch(e) {
        e.message = `\n${v.whois} abnormal end at step.${v.step}\n${e.message}`;
        console.error(`${e.message}\nv=${JSON.stringify(v)}`);
        return e;
      }
    }

  /** 条件に該当するレコード(オブジェクト)を抽出
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @param {string[][]} [opt.orderBy=[]] - 並べ替えのキーと昇順/降順指定
    *  [['key1'(,'desc')],['key2'(,'desc')],...]
    * @returns {Array.Object.<string, any>|Error}
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.r = v.table.select({
    *   where: x => x.B3 && 1<x.B3 && x.B3<9,
    *   orderBy:[['B3'],['C3','desc']]
    * });
    * console.log(JSON.stringify(v.r));
    * // -> [
    *   {"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
    *   {"B3":5,"C3":6,"Col1":7,"E3":8},
    *   {"B3":5,"C3":4}
    * ]
    * ```
    * 
    * 「Col1に'g'が含まれる」という場合
    * ```
    * where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1}
    * ```
    */
  select(opt={}){
    const v = {whois:this.className+'.select',rv:[],step:0};
    console.log(`${v.whois} start.`); //\nopt.where=${opt.where.toString()}\nopt.orderBy=${JSON.stringify(opt.orderBy)}`);
    try {
  
      v.step = 1; // 既定値の設定
      //if( !opt.hasOwnProperty('where') )
      //  opt.where = () => true;
      if( opt.hasOwnProperty('where') ){
        if( typeof opt.where === 'string' )
          opt.where = new Function(opt.where);
      } else {
        opt.where = () => true;
      }
      if( !opt.hasOwnProperty('orderBy') )
        opt.orderBy = [];
      console.log(`l.478 opt.where [${typeof opt.where}] = '${opt.where.toString()}'`)
  
      v.step = 2; // 対象となるレコードを抽出
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0 // 空Objではない
            && opt.where(this.data[v.i]) ) // 対象判定結果がtrue
          v.rv.push(this.data[v.i]);
      }
  
      v.step = 3; // 並べ替え
      v.rv.sort((a,b) => {
        for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
          [v.p, v.q] = opt.orderBy[v.i][1]
          && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
          if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
          if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
        }
        return 0;
      });
  
      v.step = 4; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nopt=${JSON.stringify(opt)}`;  // 引数
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  
  }

  /**
    * @typedef {Object} UpdateResult
    * @prop {number} row - 変更対象の行番号(自然数)
    * @prop {Object} old - 変更前の行オブジェクト
    * @prop {Object} new - 変更後の行オブジェクト
    * @prop {Object.<string, any[]>} diff - {変更した項目名：[変更前,変更後]}形式のオブジェクト
    * @prop {number} row - 更新対象行番号(自然数)
    * @prop {number} left - 更新対象領域左端列番号(自然数)
    * @prop {number} right - 更新対象領域右端列番号(自然数)
    */
  /** 条件に該当するレコード(オブジェクト)を更新
    * 
    * @param {Object|Function} set - セットする{項目名:値}、または行オブジェクトを引数にセットする{項目名:値}を返す関数
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @returns {UpdateResult[]|Error} 更新結果を格納した配列
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test!B3:E');
    * // B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
    * v.table.update({Col1:'hoge',E3:'fuga'},{where:o=>o.B3&&o.B3==4});  // 戻り値 -> [{
    *   "old":{"B3":4,"C3":3,"Col1":"a","E3":"b"},
    *   "new":{"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
    *   "diff":{"Col1":["a","hoge"],"E3":["b","fuga"]},
    *   "row":7,
    *   "left":4,"right":5
    * }]
    * ```
    * 
    * 更新対象データを直接指定、また同一行の他の項目から導出してセットすることも可能。
    * 
    * ```
    * // E3欄に'a'をセットする
    * v.table.update(
    *   {E3:'a'},  // 更新対象データを直接指定
    *   {where:o=>o.B3==5&&o.C3==4}
    * )
    * // Col1欄にB3+C3の値をセットする
    * v.table.update(
    *   o=>{return {Col1:(o.B3||0)+(o.C3||0)}},  // 他項目から導出
    *   {where:o=>o.B3==5&&o.C3==4}
    * )
    * ```
    */
  update(set,opt={}){
    const v = {whois:this.className+'.update',step:0,rv:[],
      // top〜rightは更新する場合の対象領域(行/列番号。自然数)
      top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
    console.log(`${v.whois} start.\nset=${typeof set === 'function' ? set.toString() : JSON.stringify(set)}\nopt=${JSON.stringify(opt)}`);
    try {
  
      v.step = 1; // 既定値の設定
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
  
      v.step = 2; // 1行ずつ差分をチェックしながら処理結果を保存
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
          v.step = 2.1; // 「空Objではない かつ 対象判定結果がtrue」なら更新対象
          v.r = { // {UpdateResult} - 更新結果オブジェクトを作成
            old: Object.assign({},this.data[v.i]),
            new: this.data[v.i],
            diff: {},
            row: this.top + 1 + v.i,
            left: Infinity, right: -Infinity,  // 変更があった列番号の範囲
          };
  
          v.step = 2.2; // 更新後の値をv.diffに格納
          v.diff = whichType(set) === 'Object' ? set : set(this.data[v.i]);
  
          v.step = 2.3; // 差分が存在する項目の洗い出し
          v.exist = false;  // 差分が存在したらtrue
          this.header.forEach(x => {
            v.step = 2.4; // 項目毎に差分判定
            if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
              v.step = 2.5; // 更新後に値が変わる場合
              v.exist = true; // 値が変わった旨、フラグを立てる
              v.r.new[x] = v.diff[x];
              v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
              v.col = this.left + this.header.findIndex(i=>i==x); // 変更があった列番号
              // 一行内で、更新があった範囲(左端列・右端列)の値を書き換え
              v.r.left = v.r.left > v.col ? v.col : v.r.left;
              v.r.right = v.r.right < v.col ? v.col : v.r.right;
            }
          });
  
          v.step = 3; // いずれかの項目で更新後に値が変わった場合
          if( v.exist ){
            v.step = 3.1; // 更新対象領域を書き換え
            v.top = v.top > v.r.row ? v.r.row : v.top;
            v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
            v.left = v.left > v.r.left ? v.r.left : v.left;
            v.right = v.right < v.r.right ? v.r.right : v.right;
  
            v.step = 3.2; // this.raw上のデータを更新
            this.raw[v.r.row-this.top] = (o=>{
              const rv = [];
              this.header.forEach(x => rv.push(o[x]||''));
              return rv;
            })(v.r.new);
  
            v.step = 3.3; // ログ(戻り値)に追加
            v.rv.push(v.r);
          }
        }
      }
  
      v.step = 4; // 更新が有ったら、シート上の更新対象領域をthis.rawで書き換え
      if( v.rv.length > 0 ){
        v.step = 4.1; // 更新対象領域のみthis.rawから矩形に切り出し
        v.data = (()=>{
          let rv = [];
          this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
            rv.push(l.slice(v.left-this.left,v.right-this.left+1));
          });
          return rv;
        })();
        v.step = 4.2; // データ渡しかつシート作成指示無しを除き、シートを更新
        if( this.sheet !== null ){
          this.sheet.getRange(
            v.top,
            v.left,
            v.bottom-v.top+1,
            v.right-v.left+1
          ).setValues(v.data);
        }
      }
  
      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
      console.error(`${e.message}\nv=${JSON.stringify(v)}`,set,opt);
      return e;
    }
  }

  /** レコード(オブジェクト)を追加
    * 
    * - 複数行の一括追加も可
    * 
    * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
    * @returns {number|Error} 追加した行数
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.table.insert({B3:3,E3:1});
    *   // -> 一行追加
    * v.table.insert([{B3:2,E3:2},{C3:1,Col1:'hoge'}]);
    *   // -> 複数行追加
    * ```
    */
  insert(records=[]){
    const v = {whois:this.className+'.insert',step:0,rv:[],
      r:[],left:Infinity,right:-Infinity};
    console.log(`${v.whois} start.\nrecords=${JSON.stringify(records)}`);
    try {
  
      v.step = 1; // 引数がオブジェクトなら配列に変換
      if( !Array.isArray(records) ) records = [records];
      // 追加対象が0件なら処理終了
      if( records.length === 0 ) return 0;
  
      for( v.i=0 ; v.i<records.length ; v.i++ ){
        v.step = 2; // 挿入するレコード(オブジェクト)を配列化してthis.rawに追加
        v.arr = [];
        for( v.j=0 ; v.j<this.header.length ; v.j++ ){
          v.step = 3; // 空欄なら空文字列をセット
          v.cVal = records[v.i][this.header[v.j]] || '';
  
          if( v.cVal !== '' ){
            v.step = 4; // 追加する範囲を見直し
            v.left = v.left > v.j ? v.j : v.left;
            v.right = v.right < v.j ? v.j : v.right;
          }
  
          v.step = 5; // 一行分のデータ(配列)に項目の値を追加
          v.arr.push(v.cVal);
        }
        v.step = 6; // 一行分のデータをthis.raw/dataに追加
        this.raw.push(v.arr);
        this.data.push(records[v.i]);
        v.rv.push(v.arr);
      }
  
      v.step = 7; // 更新範囲(矩形)のみv.rv -> v.rにコピー
      v.rv.forEach(x => v.r.push(x.slice(v.left,v.right+1)));
  
      v.step = 8; // データ渡しかつシート作成指示無しを除き、シートに追加
      if( this.sheet !== null ){
        this.sheet.getRange(
          this.bottom+1,
          this.left+v.left,
          v.r.length,
          v.r[0].length
        ).setValues(v.r);
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nrecords=${JSON.stringify(records)}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

  /** 条件に該当するレコード(オブジェクト)を削除
    * @param {Object} [opt={}] - オプション
    * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
    * @returns {Object|Error} 削除されたthis.data行のオブジェクト
    * 
    * @example
    * 
    * ```
    * v.table = new SingleTable('test',{top:3});
    * v.table.delete({where:o=>o.Col1&&o.Col1==7});
    *   // -> Col1==7の行を削除。判定用変数(Col1)の存否、要確認
    * v.table.delete({where:o=>o.val&&o.val==5});
    *   // -> val==5の行を全て削除。
    * ```
    */
  /* 将来的に対応を検討する項目
    - 引数をwhereのみとし、Object->Functionに変更
    - "top 3"等、先頭・末尾n行の削除
  */
  delete(opt={}){
    const v = {whois:this.className+'.delete',step:0,rv:[]};
    console.log(`${v.whois} start.\nopt.where=${opt.where.toString()}`);
    try {
  
      v.step = 1; // 既定値の設定
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
  
      v.step = 2; // 下の行から判定し、削除による行ズレの影響を回避
      for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
        v.step = 3; // 削除対象(空Objではない and 対象判定結果がtrue)
        if( Object.keys(this.data[v.i]).length === 0
          || !opt.where(this.data[v.i]) ) continue;
        v.step = 4; // this.dataからの削除
        v.rv.push(this.data.splice(v.i,1)[0]);
        v.step = 5; // this.rawからの削除
        this.raw.splice(v.i,1)[0];
        v.step = 6; // (シートが存在すれば)シートからの削除
        if( this.sheet === null ) continue;
        v.rowNum = this.top + v.i + 1;
        // 1シート複数テーブルの場合を考慮し、headerの列範囲のみ削除して上にシフト
        this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
        .deleteCells(SpreadsheetApp.Dimension.ROWS);
      }
  
      v.step = 7; // 終了処理
      console.log(`${v.whois} normal end. num=${v.rv.length}`);
      return v.rv;
  
    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\nopt=${JSON.stringify(opt)}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }

}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 日時を指定形式の文字列にして返す
 * @param {Date} dObj - 日付型オブジェクト
 * @param {string} [format='yyyy/MM/dd'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function toLocale(dObj,format='yyyy/MM/dd'){
  const v = {rv:format,l:{ // 地方時ベース
    y: dObj.getFullYear(),
    M: dObj.getMonth()+1,
    d: dObj.getDate(),
    h: dObj.getHours(),
    m: dObj.getMinutes(),
    s: dObj.getSeconds(),
    n: dObj.getMilliseconds()
  }};
  try {

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.step = 2; // 日付文字列作成
    for( v.x in v.l ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.l[v.x]).slice(-v.m[0].length)
          : String(v.l[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
/** GASLib.cryptico: crypticoをGASで動作するようカスタマイズ
 * https://wwwtyro.github.io/cryptico/  cryptico.min.js
 * ※navigatorは動作のために追加したブラウザの動作環境
 */

const navigator = {
  appName: "Netscape",
  appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};

var dbits,canary=244837814094590,j_lm=(canary&16777215)==15715070;function BigInteger(a,b,c){a!=null&&("number"==typeof a?this.fromNumber(a,b,c):b==null&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function nbi(){return new BigInteger(null)}function am1(a,b,c,d,e,g){for(;--g>=0;){var h=b*this[a++]+c[d]+e,e=Math.floor(h/67108864);c[d++]=h&67108863}return e}
function am2(a,b,c,d,e,g){var h=b&32767;for(b>>=15;--g>=0;){var f=this[a]&32767,o=this[a++]>>15,p=b*f+o*h,f=h*f+((p&32767)<<15)+c[d]+(e&1073741823),e=(f>>>30)+(p>>>15)+b*o+(e>>>30);c[d++]=f&1073741823}return e}function am3(a,b,c,d,e,g){var h=b&16383;for(b>>=14;--g>=0;){var f=this[a]&16383,o=this[a++]>>14,p=b*f+o*h,f=h*f+((p&16383)<<14)+c[d]+e,e=(f>>28)+(p>>14)+b*o;c[d++]=f&268435455}return e}
j_lm&&navigator.appName=="Microsoft Internet Explorer"?(BigInteger.prototype.am=am2,dbits=30):j_lm&&navigator.appName!="Netscape"?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28);BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=[],rr,vv;
rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(a){return BI_RM.charAt(a)}function intAt(a,b){var c=BI_RC[a.charCodeAt(b)];return c==null?-1:c}function bnpCopyTo(a){for(var b=this.t-1;b>=0;--b)a[b]=this[b];a.t=this.t;a.s=this.s}function bnpFromInt(a){this.t=1;this.s=a<0?-1:0;a>0?this[0]=a:a<-1?this[0]=a+DV:this.t=0}
function nbv(a){var b=nbi();b.fromInt(a);return b}
function bnpFromString(a,b){var c;if(b==16)c=4;else if(b==8)c=3;else if(b==256)c=8;else if(b==2)c=1;else if(b==32)c=5;else if(b==4)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var d=a.length,e=!1,g=0;--d>=0;){var h=c==8?a[d]&255:intAt(a,d);h<0?a.charAt(d)=="-"&&(e=!0):(e=!1,g==0?this[this.t++]=h:g+c>this.DB?(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}if(c==8&&(a[0]&128)!=0)this.s=-1,g>0&&(this[this.t-1]|=(1<<
this.DB-g)-1<<g);this.clamp();e&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){for(var a=this.s&this.DM;this.t>0&&this[this.t-1]==a;)--this.t}
function bnToString(a){if(this.s<0)return"-"+this.negate().toString(a);if(a==16)a=4;else if(a==8)a=3;else if(a==2)a=1;else if(a==32)a=5;else if(a==64)a=6;else if(a==4)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,d=!1,e="",g=this.t,h=this.DB-g*this.DB%a;if(g-- >0){if(h<this.DB&&(c=this[g]>>h)>0)d=!0,e=int2char(c);for(;g>=0;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,h<=0&&(h+=this.DB,--g)),c>0&&(d=!0),d&&(e+=int2char(c))}return d?e:"0"}
function bnNegate(){var a=nbi();BigInteger.ZERO.subTo(this,a);return a}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var b=this.s-a.s;if(b!=0)return b;var c=this.t,b=c-a.t;if(b!=0)return b;for(;--c>=0;)if((b=this[c]-a[c])!=0)return b;return 0}function nbits(a){var b=1,c;if((c=a>>>16)!=0)a=c,b+=16;if((c=a>>8)!=0)a=c,b+=8;if((c=a>>4)!=0)a=c,b+=4;if((c=a>>2)!=0)a=c,b+=2;a>>1!=0&&(b+=1);return b}
function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(a,b){var c;for(c=this.t-1;c>=0;--c)b[c+a]=this[c];for(c=a-1;c>=0;--c)b[c]=0;b.t=this.t+a;b.s=this.s}function bnpDRShiftTo(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s}
function bnpLShiftTo(a,b){var c=a%this.DB,d=this.DB-c,e=(1<<d)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,f;for(f=this.t-1;f>=0;--f)b[f+g+1]=this[f]>>d|h,h=(this[f]&e)<<c;for(f=g-1;f>=0;--f)b[f]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()}
function bnpRShiftTo(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var d=a%this.DB,e=this.DB-d,g=(1<<d)-1;b[0]=this[c]>>d;for(var h=c+1;h<this.t;++h)b[h-c-1]|=(this[h]&g)<<e,b[h-c]=this[h]>>d;d>0&&(b[this.t-c-1]|=(this.s&g)<<e);b.t=this.t-c;b.clamp()}}
function bnpSubTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]-a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d-=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d-=a[c],b[c++]=d&this.DM,d>>=this.DB;d-=a.s}b.s=d<0?-1:0;d<-1?b[c++]=this.DV+d:d>0&&(b[c++]=d);b.t=c;b.clamp()}
function bnpMultiplyTo(a,b){var c=this.abs(),d=a.abs(),e=c.t;for(b.t=e+d.t;--e>=0;)b[e]=0;for(e=0;e<d.t;++e)b[e+c.t]=c.am(0,d[e],b,e,0,c.t);b.s=0;b.clamp();this.s!=a.s&&BigInteger.ZERO.subTo(b,b)}function bnpSquareTo(a){for(var b=this.abs(),c=a.t=2*b.t;--c>=0;)a[c]=0;for(c=0;c<b.t-1;++c){var d=b.am(c,b[c],a,2*c,0,1);if((a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,d,b.t-c-1))>=b.DV)a[c+b.t]-=b.DV,a[c+b.t+1]=1}a.t>0&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()}
function bnpDivRemTo(a,b,c){var d=a.abs();if(!(d.t<=0)){var e=this.abs();if(e.t<d.t)b!=null&&b.fromInt(0),c!=null&&this.copyTo(c);else{c==null&&(c=nbi());var g=nbi(),h=this.s,a=a.s,f=this.DB-nbits(d[d.t-1]);f>0?(d.lShiftTo(f,g),e.lShiftTo(f,c)):(d.copyTo(g),e.copyTo(c));d=g.t;e=g[d-1];if(e!=0){var o=e*(1<<this.F1)+(d>1?g[d-2]>>this.F2:0),p=this.FV/o,o=(1<<this.F1)/o,q=1<<this.F2,n=c.t,k=n-d,j=b==null?nbi():b;g.dlShiftTo(k,j);c.compareTo(j)>=0&&(c[c.t++]=1,c.subTo(j,c));BigInteger.ONE.dlShiftTo(d,
j);for(j.subTo(g,g);g.t<d;)g[g.t++]=0;for(;--k>=0;){var l=c[--n]==e?this.DM:Math.floor(c[n]*p+(c[n-1]+q)*o);if((c[n]+=g.am(0,l,c,k,0,d))<l){g.dlShiftTo(k,j);for(c.subTo(j,c);c[n]<--l;)c.subTo(j,c)}}b!=null&&(c.drShiftTo(d,b),h!=a&&BigInteger.ZERO.subTo(b,b));c.t=d;c.clamp();f>0&&c.rShiftTo(f,c);h<0&&BigInteger.ZERO.subTo(c,c)}}}}function bnMod(a){var b=nbi();this.abs().divRemTo(a,null,b);this.s<0&&b.compareTo(BigInteger.ZERO)>0&&a.subTo(b,b);return b}function Classic(a){this.m=a}
function cConvert(a){return a.s<0||a.compareTo(this.m)>=0?a.mod(this.m):a}function cRevert(a){return a}function cReduce(a){a.divRemTo(this.m,null,a)}function cMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}function cSqrTo(a,b){a.squareTo(b);this.reduce(b)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;
function bnpInvDigit(){if(this.t<1)return 0;var a=this[0];if((a&1)==0)return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return b>0?this.DV-b:-b}function Montgomery(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}
function montConvert(a){var b=nbi();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);a.s<0&&b.compareTo(BigInteger.ZERO)>0&&this.m.subTo(b,b);return b}function montRevert(a){var b=nbi();a.copyTo(b);this.reduce(b);return b}
function montReduce(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,d=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,d,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);a.compareTo(this.m)>=0&&a.subTo(this.m,a)}function montSqrTo(a,b){a.squareTo(b);this.reduce(b)}function montMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Montgomery.prototype.convert=montConvert;
Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(a,b){if(a>4294967295||a<1)return BigInteger.ONE;var c=nbi(),d=nbi(),e=b.convert(this),g=nbits(a)-1;for(e.copyTo(c);--g>=0;)if(b.sqrTo(c,d),(a&1<<g)>0)b.mulTo(d,e,c);else var h=c,c=d,d=h;return b.revert(c)}
function bnModPowInt(a,b){var c;c=a<256||b.isEven()?new Classic(b):new Montgomery(b);return this.exp(a,c)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;
BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;
BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnClone(){var a=nbi();this.copyTo(a);return a}function bnIntValue(){if(this.s<0)if(this.t==1)return this[0]-this.DV;else{if(this.t==0)return-1}else if(this.t==1)return this[0];else if(this.t==0)return 0;return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return this.t==0?this.s:this[0]<<24>>24}function bnShortValue(){return this.t==0?this.s:this[0]<<16>>16}
function bnpChunkSize(a){return Math.floor(Math.LN2*this.DB/Math.log(a))}function bnSigNum(){return this.s<0?-1:this.t<=0||this.t==1&&this[0]<=0?0:1}function bnpToRadix(a){a==null&&(a=10);if(this.signum()==0||a<2||a>36)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=nbv(b),d=nbi(),e=nbi(),g="";for(this.divRemTo(c,d,e);d.signum()>0;)g=(b+e.intValue()).toString(a).substr(1)+g,d.divRemTo(c,d,e);return e.intValue().toString(a)+g}
function bnpFromRadix(a,b){this.fromInt(0);b==null&&(b=10);for(var c=this.chunkSize(b),d=Math.pow(b,c),e=!1,g=0,h=0,f=0;f<a.length;++f){var o=intAt(a,f);o<0?a.charAt(f)=="-"&&this.signum()==0&&(e=!0):(h=b*h+o,++g>=c&&(this.dMultiply(d),this.dAddOffset(h,0),h=g=0))}g>0&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));e&&BigInteger.ZERO.subTo(this,this)}
function bnpFromNumber(a,b,c){if("number"==typeof b)if(a<2)this.fromInt(1);else{this.fromNumber(a,c);this.testBit(a-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);for(this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(BigInteger.ONE.shiftLeft(a-1),this)}else{var c=[],d=a&7;c.length=(a>>3)+1;b.nextBytes(c);d>0?c[0]&=(1<<d)-1:c[0]=0;this.fromString(c,256)}}
function bnToByteArray(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,d,e=0;if(a-- >0){if(c<this.DB&&(d=this[a]>>c)!=(this.s&this.DM)>>c)b[e++]=d|this.s<<this.DB-c;for(;a>=0;)if(c<8?(d=(this[a]&(1<<c)-1)<<8-c,d|=this[--a]>>(c+=this.DB-8)):(d=this[a]>>(c-=8)&255,c<=0&&(c+=this.DB,--a)),(d&128)!=0&&(d|=-256),e==0&&(this.s&128)!=(d&128)&&++e,e>0||d!=this.s)b[e++]=d}return b}function bnEquals(a){return this.compareTo(a)==0}function bnMin(a){return this.compareTo(a)<0?this:a}
function bnMax(a){return this.compareTo(a)>0?this:a}function bnpBitwiseTo(a,b,c){var d,e,g=Math.min(a.t,this.t);for(d=0;d<g;++d)c[d]=b(this[d],a[d]);if(a.t<this.t){e=a.s&this.DM;for(d=g;d<this.t;++d)c[d]=b(this[d],e);c.t=this.t}else{e=this.s&this.DM;for(d=g;d<a.t;++d)c[d]=b(e,a[d]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()}function op_and(a,b){return a&b}function bnAnd(a){var b=nbi();this.bitwiseTo(a,op_and,b);return b}function op_or(a,b){return a|b}
function bnOr(a){var b=nbi();this.bitwiseTo(a,op_or,b);return b}function op_xor(a,b){return a^b}function bnXor(a){var b=nbi();this.bitwiseTo(a,op_xor,b);return b}function op_andnot(a,b){return a&~b}function bnAndNot(a){var b=nbi();this.bitwiseTo(a,op_andnot,b);return b}function bnNot(){for(var a=nbi(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a}function bnShiftLeft(a){var b=nbi();a<0?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b}
function bnShiftRight(a){var b=nbi();a<0?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b}function lbit(a){if(a==0)return-1;var b=0;(a&65535)==0&&(a>>=16,b+=16);(a&255)==0&&(a>>=8,b+=8);(a&15)==0&&(a>>=4,b+=4);(a&3)==0&&(a>>=2,b+=2);(a&1)==0&&++b;return b}function bnGetLowestSetBit(){for(var a=0;a<this.t;++a)if(this[a]!=0)return a*this.DB+lbit(this[a]);return this.s<0?this.t*this.DB:-1}function cbit(a){for(var b=0;a!=0;)a&=a-1,++b;return b}
function bnBitCount(){for(var a=0,b=this.s&this.DM,c=0;c<this.t;++c)a+=cbit(this[c]^b);return a}function bnTestBit(a){var b=Math.floor(a/this.DB);return b>=this.t?this.s!=0:(this[b]&1<<a%this.DB)!=0}function bnpChangeBit(a,b){var c=BigInteger.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c}function bnSetBit(a){return this.changeBit(a,op_or)}function bnClearBit(a){return this.changeBit(a,op_andnot)}function bnFlipBit(a){return this.changeBit(a,op_xor)}
function bnpAddTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]+a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d+=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d+=a[c],b[c++]=d&this.DM,d>>=this.DB;d+=a.s}b.s=d<0?-1:0;d>0?b[c++]=d:d<-1&&(b[c++]=this.DV+d);b.t=c;b.clamp()}function bnAdd(a){var b=nbi();this.addTo(a,b);return b}function bnSubtract(a){var b=nbi();this.subTo(a,b);return b}
function bnMultiply(a){var b=nbi();this.multiplyTo(a,b);return b}function bnSquare(){var a=nbi();this.squareTo(a);return a}function bnDivide(a){var b=nbi();this.divRemTo(a,b,null);return b}function bnRemainder(a){var b=nbi();this.divRemTo(a,null,b);return b}function bnDivideAndRemainder(a){var b=nbi(),c=nbi();this.divRemTo(a,b,c);return[b,c]}function bnpDMultiply(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()}
function bnpDAddOffset(a,b){if(a!=0){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}}function NullExp(){}function nNop(a){return a}function nMulTo(a,b,c){a.multiplyTo(b,c)}function nSqrTo(a,b){a.squareTo(b)}NullExp.prototype.convert=nNop;NullExp.prototype.revert=nNop;NullExp.prototype.mulTo=nMulTo;NullExp.prototype.sqrTo=nSqrTo;function bnPow(a){return this.exp(a,new NullExp)}
function bnpMultiplyLowerTo(a,b,c){var d=Math.min(this.t+a.t,b);c.s=0;for(c.t=d;d>0;)c[--d]=0;var e;for(e=c.t-this.t;d<e;++d)c[d+this.t]=this.am(0,a[d],c,d,0,this.t);for(e=Math.min(a.t,b);d<e;++d)this.am(0,a[d],c,d,0,b-d);c.clamp()}function bnpMultiplyUpperTo(a,b,c){--b;var d=c.t=this.t+a.t-b;for(c.s=0;--d>=0;)c[d]=0;for(d=Math.max(b-this.t,0);d<a.t;++d)c[this.t+d-b]=this.am(b-d,a[d],c,0,0,this.t+d-b);c.clamp();c.drShiftTo(1,c)}
function Barrett(a){this.r2=nbi();this.q3=nbi();BigInteger.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}function barrettConvert(a){if(a.s<0||a.t>2*this.m.t)return a.mod(this.m);else if(a.compareTo(this.m)<0)return a;else{var b=nbi();a.copyTo(b);this.reduce(b);return b}}function barrettRevert(a){return a}
function barrettReduce(a){a.drShiftTo(this.m.t-1,this.r2);if(a.t>this.m.t+1)a.t=this.m.t+1,a.clamp();this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);a.compareTo(this.r2)<0;)a.dAddOffset(1,this.m.t+1);for(a.subTo(this.r2,a);a.compareTo(this.m)>=0;)a.subTo(this.m,a)}function barrettSqrTo(a,b){a.squareTo(b);this.reduce(b)}function barrettMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Barrett.prototype.convert=barrettConvert;
Barrett.prototype.revert=barrettRevert;Barrett.prototype.reduce=barrettReduce;Barrett.prototype.mulTo=barrettMulTo;Barrett.prototype.sqrTo=barrettSqrTo;
function bnModPow(a,b){var c=a.bitLength(),d,e=nbv(1),g;if(c<=0)return e;else d=c<18?1:c<48?3:c<144?4:c<768?5:6;g=c<8?new Classic(b):b.isEven()?new Barrett(b):new Montgomery(b);var h=[],f=3,o=d-1,p=(1<<d)-1;h[1]=g.convert(this);if(d>1){c=nbi();for(g.sqrTo(h[1],c);f<=p;)h[f]=nbi(),g.mulTo(c,h[f-2],h[f]),f+=2}for(var q=a.t-1,n,k=!0,j=nbi(),c=nbits(a[q])-1;q>=0;){c>=o?n=a[q]>>c-o&p:(n=(a[q]&(1<<c+1)-1)<<o-c,q>0&&(n|=a[q-1]>>this.DB+c-o));for(f=d;(n&1)==0;)n>>=1,--f;if((c-=f)<0)c+=this.DB,--q;if(k)h[n].copyTo(e),
k=!1;else{for(;f>1;)g.sqrTo(e,j),g.sqrTo(j,e),f-=2;f>0?g.sqrTo(e,j):(f=e,e=j,j=f);g.mulTo(j,h[n],e)}for(;q>=0&&(a[q]&1<<c)==0;)g.sqrTo(e,j),f=e,e=j,j=f,--c<0&&(c=this.DB-1,--q)}return g.revert(e)}
function bnGCD(a){var b=this.s<0?this.negate():this.clone(),a=a.s<0?a.negate():a.clone();if(b.compareTo(a)<0)var c=b,b=a,a=c;var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(d<0)return b;c<d&&(d=c);d>0&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;b.signum()>0;)(c=b.getLowestSetBit())>0&&b.rShiftTo(c,b),(c=a.getLowestSetBit())>0&&a.rShiftTo(c,a),b.compareTo(a)>=0?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));d>0&&a.lShiftTo(d,a);return a}
function bnpModInt(a){if(a<=0)return 0;var b=this.DV%a,c=this.s<0?a-1:0;if(this.t>0)if(b==0)c=this[0]%a;else for(var d=this.t-1;d>=0;--d)c=(b*c+this[d])%a;return c}
function bnModInverse(a){var b=a.isEven();if(this.isEven()&&b||a.signum()==0)return BigInteger.ZERO;for(var c=a.clone(),d=this.clone(),e=nbv(1),g=nbv(0),h=nbv(0),f=nbv(1);c.signum()!=0;){for(;c.isEven();){c.rShiftTo(1,c);if(b){if(!e.isEven()||!g.isEven())e.addTo(this,e),g.subTo(a,g);e.rShiftTo(1,e)}else g.isEven()||g.subTo(a,g);g.rShiftTo(1,g)}for(;d.isEven();){d.rShiftTo(1,d);if(b){if(!h.isEven()||!f.isEven())h.addTo(this,h),f.subTo(a,f);h.rShiftTo(1,h)}else f.isEven()||f.subTo(a,f);f.rShiftTo(1,
f)}c.compareTo(d)>=0?(c.subTo(d,c),b&&e.subTo(h,e),g.subTo(f,g)):(d.subTo(c,d),b&&h.subTo(e,h),f.subTo(g,f))}if(d.compareTo(BigInteger.ONE)!=0)return BigInteger.ZERO;if(f.compareTo(a)>=0)return f.subtract(a);if(f.signum()<0)f.addTo(a,f);else return f;return f.signum()<0?f.add(a):f}
var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,
733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],lplim=67108864/lowprimes[lowprimes.length-1];
function bnIsProbablePrime(a){var b,c=this.abs();if(c.t==1&&c[0]<=lowprimes[lowprimes.length-1]){for(b=0;b<lowprimes.length;++b)if(c[0]==lowprimes[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<lowprimes.length;){for(var d=lowprimes[b],e=b+1;e<lowprimes.length&&d<lplim;)d*=lowprimes[e++];for(d=c.modInt(d);b<e;)if(d%lowprimes[b++]==0)return!1}return c.millerRabin(a)}
function bnpMillerRabin(a){var b=this.subtract(BigInteger.ONE),c=b.getLowestSetBit();if(c<=0)return!1;var d=b.shiftRight(c),a=a+1>>1;if(a>lowprimes.length)a=lowprimes.length;for(var e=nbi(),g=0;g<a;++g){e.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var h=e.modPow(d,this);if(h.compareTo(BigInteger.ONE)!=0&&h.compareTo(b)!=0){for(var f=1;f++<c&&h.compareTo(b)!=0;)if(h=h.modPowInt(2,this),h.compareTo(BigInteger.ONE)==0)return!1;if(h.compareTo(b)!=0)return!1}}return!0}
BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.fromNumber=bnpFromNumber;BigInteger.prototype.bitwiseTo=bnpBitwiseTo;BigInteger.prototype.changeBit=bnpChangeBit;BigInteger.prototype.addTo=bnpAddTo;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;
BigInteger.prototype.modInt=bnpModInt;BigInteger.prototype.millerRabin=bnpMillerRabin;BigInteger.prototype.clone=bnClone;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.byteValue=bnByteValue;BigInteger.prototype.shortValue=bnShortValue;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.toByteArray=bnToByteArray;BigInteger.prototype.equals=bnEquals;BigInteger.prototype.min=bnMin;BigInteger.prototype.max=bnMax;BigInteger.prototype.and=bnAnd;BigInteger.prototype.or=bnOr;
BigInteger.prototype.xor=bnXor;BigInteger.prototype.andNot=bnAndNot;BigInteger.prototype.not=bnNot;BigInteger.prototype.shiftLeft=bnShiftLeft;BigInteger.prototype.shiftRight=bnShiftRight;BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;BigInteger.prototype.bitCount=bnBitCount;BigInteger.prototype.testBit=bnTestBit;BigInteger.prototype.setBit=bnSetBit;BigInteger.prototype.clearBit=bnClearBit;BigInteger.prototype.flipBit=bnFlipBit;BigInteger.prototype.add=bnAdd;BigInteger.prototype.subtract=bnSubtract;
BigInteger.prototype.multiply=bnMultiply;BigInteger.prototype.divide=bnDivide;BigInteger.prototype.remainder=bnRemainder;BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;BigInteger.prototype.modPow=bnModPow;BigInteger.prototype.modInverse=bnModInverse;BigInteger.prototype.pow=bnPow;BigInteger.prototype.gcd=bnGCD;BigInteger.prototype.isProbablePrime=bnIsProbablePrime;BigInteger.prototype.square=bnSquare;
(function(a,b,c,d,e,g,h){function f(a){var b,d,e=this,g=a.length,f=0,h=e.i=e.j=e.m=0;e.S=[];e.c=[];for(g||(a=[g++]);f<c;)e.S[f]=f++;for(f=0;f<c;f++)b=e.S[f],h=h+b+a[f%g]&c-1,d=e.S[h],e.S[f]=d,e.S[h]=b;e.g=function(a){var b=e.S,d=e.i+1&c-1,g=b[d],f=e.j+g&c-1,h=b[f];b[d]=h;b[f]=g;for(var k=b[g+h&c-1];--a;)d=d+1&c-1,g=b[d],f=f+g&c-1,h=b[f],b[d]=h,b[f]=g,k=k*c+b[g+h&c-1];e.i=d;e.j=f;return k};e.g(c)}function o(a,b,c,d,e){c=[];e=typeof a;if(b&&e=="object")for(d in a)if(d.indexOf("S")<5)try{c.push(o(a[d],
b-1))}catch(g){}return c.length?c:a+(e!="string"?"\x00":"")}function p(a,b,d,e){a+="";for(e=d=0;e<a.length;e++){var g=b,f=e&c-1,h=(d^=b[e&c-1]*19)+a.charCodeAt(e);g[f]=h&c-1}a="";for(e in b)a+=String.fromCharCode(b[e]);return a}b.seedrandom=function(q,n){var k=[],j,q=p(o(n?[q,a]:arguments.length?q:[(new Date).getTime(),a,window],3),k);j=new f(k);p(j.S,a);b.random=function(){for(var a=j.g(d),b=h,f=0;a<e;)a=(a+f)*c,b*=c,f=j.g(1);for(;a>=g;)a/=2,b/=2,f>>>=1;return(a+f)/b};return q};h=b.pow(c,d);e=b.pow(2,
e);g=e*2;p(b.random(),a)})([],Math,256,6,52);function SeededRandom(){}function SRnextBytes(a){var b;for(b=0;b<a.length;b++)a[b]=Math.floor(Math.random()*256)}SeededRandom.prototype.nextBytes=SRnextBytes;function Arcfour(){this.j=this.i=0;this.S=[]}function ARC4init(a){var b,c,d;for(b=0;b<256;++b)this.S[b]=b;for(b=c=0;b<256;++b)c=c+this.S[b]+a[b%a.length]&255,d=this.S[b],this.S[b]=this.S[c],this.S[c]=d;this.j=this.i=0}
function ARC4next(){var a;this.i=this.i+1&255;this.j=this.j+this.S[this.i]&255;a=this.S[this.i];this.S[this.i]=this.S[this.j];this.S[this.j]=a;return this.S[a+this.S[this.i]&255]}Arcfour.prototype.init=ARC4init;Arcfour.prototype.next=ARC4next;function prng_newstate(){return new Arcfour}var rng_psize=256,rng_state,rng_pool,rng_pptr;
function rng_seed_int(a){rng_pool[rng_pptr++]^=a&255;rng_pool[rng_pptr++]^=a>>8&255;rng_pool[rng_pptr++]^=a>>16&255;rng_pool[rng_pptr++]^=a>>24&255;rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}
if(rng_pool==null){rng_pool=[];rng_pptr=0;var t;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=z.charCodeAt(t)&255}for(;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=t&255;rng_pptr=0;rng_seed_time()}
function rng_get_byte(){if(rng_state==null){rng_seed_time();rng_state=prng_newstate();rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(a){var b;for(b=0;b<a.length;++b)a[b]=rng_get_byte()}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;
function SHA256(a){function b(a,b){var c=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(c>>16)<<16|c&65535}function c(a,b){return a>>>b|a<<32-b}a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var h=a.charCodeAt(c);h<128?b+=String.fromCharCode(h):(h>127&&h<2048?b+=String.fromCharCode(h>>6|192):(b+=String.fromCharCode(h>>12|224),b+=String.fromCharCode(h>>6&63|128)),b+=String.fromCharCode(h&63|128))}return b}(a);return function(a){for(var b="",c=0;c<a.length*4;c++)b+="0123456789abcdef".charAt(a[c>>
2]>>(3-c%4)*8+4&15)+"0123456789abcdef".charAt(a[c>>2]>>(3-c%4)*8&15);return b}(function(a,e){var g=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,
2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],f=Array(64),o,p,q,n,k,j,l,m,s,r,u,w;a[e>>5]|=128<<24-e%32;a[(e+64>>9<<4)+15]=e;for(s=0;s<a.length;s+=16){o=h[0];p=h[1];q=h[2];n=h[3];
k=h[4];j=h[5];l=h[6];m=h[7];for(r=0;r<64;r++)f[r]=r<16?a[r+s]:b(b(b(c(f[r-2],17)^c(f[r-2],19)^f[r-2]>>>10,f[r-7]),c(f[r-15],7)^c(f[r-15],18)^f[r-15]>>>3),f[r-16]),u=b(b(b(b(m,c(k,6)^c(k,11)^c(k,25)),k&j^~k&l),g[r]),f[r]),w=b(c(o,2)^c(o,13)^c(o,22),o&p^o&q^p&q),m=l,l=j,j=k,k=b(n,u),n=q,q=p,p=o,o=b(u,w);h[0]=b(o,h[0]);h[1]=b(p,h[1]);h[2]=b(q,h[2]);h[3]=b(n,h[3]);h[4]=b(k,h[4]);h[5]=b(j,h[5]);h[6]=b(l,h[6]);h[7]=b(m,h[7])}return h}(function(a){for(var b=[],c=0;c<a.length*8;c+=8)b[c>>5]|=(a.charCodeAt(c/
8)&255)<<24-c%32;return b}(a),a.length*8))}var sha256={hex:function(a){return SHA256(a)}};
function SHA1(a){function b(a,b){return a<<b|a>>>32-b}function c(a){var b="",c,d;for(c=7;c>=0;c--)d=a>>>c*4&15,b+=d.toString(16);return b}var d,e,g=Array(80),h=1732584193,f=4023233417,o=2562383102,p=271733878,q=3285377520,n,k,j,l,m,a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):(d>127&&d<2048?b+=String.fromCharCode(d>>6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&
63|128))}return b}(a);n=a.length;var s=[];for(d=0;d<n-3;d+=4)e=a.charCodeAt(d)<<24|a.charCodeAt(d+1)<<16|a.charCodeAt(d+2)<<8|a.charCodeAt(d+3),s.push(e);switch(n%4){case 0:d=2147483648;break;case 1:d=a.charCodeAt(n-1)<<24|8388608;break;case 2:d=a.charCodeAt(n-2)<<24|a.charCodeAt(n-1)<<16|32768;break;case 3:d=a.charCodeAt(n-3)<<24|a.charCodeAt(n-2)<<16|a.charCodeAt(n-1)<<8|128}for(s.push(d);s.length%16!=14;)s.push(0);s.push(n>>>29);s.push(n<<3&4294967295);for(a=0;a<s.length;a+=16){for(d=0;d<16;d++)g[d]=
s[a+d];for(d=16;d<=79;d++)g[d]=b(g[d-3]^g[d-8]^g[d-14]^g[d-16],1);e=h;n=f;k=o;j=p;l=q;for(d=0;d<=19;d++)m=b(e,5)+(n&k|~n&j)+l+g[d]+1518500249&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=20;d<=39;d++)m=b(e,5)+(n^k^j)+l+g[d]+1859775393&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=40;d<=59;d++)m=b(e,5)+(n&k|n&j|k&j)+l+g[d]+2400959708&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=60;d<=79;d++)m=b(e,5)+(n^k^j)+l+g[d]+3395469782&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;h=h+e&4294967295;f=f+n&4294967295;o=o+k&4294967295;
p=p+j&4294967295;q=q+l&4294967295}m=c(h)+c(f)+c(o)+c(p)+c(q);return m.toLowerCase()}
var sha1={hex:function(a){return SHA1(a)}},MD5=function(a){function b(a,b){var c,d,e,f,g;e=a&2147483648;f=b&2147483648;c=a&1073741824;d=b&1073741824;g=(a&1073741823)+(b&1073741823);return c&d?g^2147483648^e^f:c|d?g&1073741824?g^3221225472^e^f:g^1073741824^e^f:g^e^f}function c(a,c,d,e,f,g,h){a=b(a,b(b(c&d|~c&e,f),h));return b(a<<g|a>>>32-g,c)}function d(a,c,d,e,f,g,h){a=b(a,b(b(c&e|d&~e,f),h));return b(a<<g|a>>>32-g,c)}function e(a,c,d,e,f,g,h){a=b(a,b(b(c^d^e,f),h));return b(a<<g|a>>>32-g,c)}function g(a,
c,d,e,f,g,h){a=b(a,b(b(d^(c|~e),f),h));return b(a<<g|a>>>32-g,c)}function h(a){var b="",c="",d;for(d=0;d<=3;d++)c=a>>>d*8&255,c="0"+c.toString(16),b+=c.substr(c.length-2,2);return b}var f=[],o,p,q,n,k,j,l,m,a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):(d>127&&d<2048?b+=String.fromCharCode(d>>6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&63|128))}return b}(a),
f=function(a){var b,c=a.length;b=c+8;for(var d=((b-b%64)/64+1)*16,e=Array(d-1),f=0,g=0;g<c;)b=(g-g%4)/4,f=g%4*8,e[b]|=a.charCodeAt(g)<<f,g++;e[(g-g%4)/4]|=128<<g%4*8;e[d-2]=c<<3;e[d-1]=c>>>29;return e}(a);k=1732584193;j=4023233417;l=2562383102;m=271733878;for(a=0;a<f.length;a+=16)o=k,p=j,q=l,n=m,k=c(k,j,l,m,f[a+0],7,3614090360),m=c(m,k,j,l,f[a+1],12,3905402710),l=c(l,m,k,j,f[a+2],17,606105819),j=c(j,l,m,k,f[a+3],22,3250441966),k=c(k,j,l,m,f[a+4],7,4118548399),m=c(m,k,j,l,f[a+5],12,1200080426),l=c(l,
m,k,j,f[a+6],17,2821735955),j=c(j,l,m,k,f[a+7],22,4249261313),k=c(k,j,l,m,f[a+8],7,1770035416),m=c(m,k,j,l,f[a+9],12,2336552879),l=c(l,m,k,j,f[a+10],17,4294925233),j=c(j,l,m,k,f[a+11],22,2304563134),k=c(k,j,l,m,f[a+12],7,1804603682),m=c(m,k,j,l,f[a+13],12,4254626195),l=c(l,m,k,j,f[a+14],17,2792965006),j=c(j,l,m,k,f[a+15],22,1236535329),k=d(k,j,l,m,f[a+1],5,4129170786),m=d(m,k,j,l,f[a+6],9,3225465664),l=d(l,m,k,j,f[a+11],14,643717713),j=d(j,l,m,k,f[a+0],20,3921069994),k=d(k,j,l,m,f[a+5],5,3593408605),
m=d(m,k,j,l,f[a+10],9,38016083),l=d(l,m,k,j,f[a+15],14,3634488961),j=d(j,l,m,k,f[a+4],20,3889429448),k=d(k,j,l,m,f[a+9],5,568446438),m=d(m,k,j,l,f[a+14],9,3275163606),l=d(l,m,k,j,f[a+3],14,4107603335),j=d(j,l,m,k,f[a+8],20,1163531501),k=d(k,j,l,m,f[a+13],5,2850285829),m=d(m,k,j,l,f[a+2],9,4243563512),l=d(l,m,k,j,f[a+7],14,1735328473),j=d(j,l,m,k,f[a+12],20,2368359562),k=e(k,j,l,m,f[a+5],4,4294588738),m=e(m,k,j,l,f[a+8],11,2272392833),l=e(l,m,k,j,f[a+11],16,1839030562),j=e(j,l,m,k,f[a+14],23,4259657740),
k=e(k,j,l,m,f[a+1],4,2763975236),m=e(m,k,j,l,f[a+4],11,1272893353),l=e(l,m,k,j,f[a+7],16,4139469664),j=e(j,l,m,k,f[a+10],23,3200236656),k=e(k,j,l,m,f[a+13],4,681279174),m=e(m,k,j,l,f[a+0],11,3936430074),l=e(l,m,k,j,f[a+3],16,3572445317),j=e(j,l,m,k,f[a+6],23,76029189),k=e(k,j,l,m,f[a+9],4,3654602809),m=e(m,k,j,l,f[a+12],11,3873151461),l=e(l,m,k,j,f[a+15],16,530742520),j=e(j,l,m,k,f[a+2],23,3299628645),k=g(k,j,l,m,f[a+0],6,4096336452),m=g(m,k,j,l,f[a+7],10,1126891415),l=g(l,m,k,j,f[a+14],15,2878612391),
j=g(j,l,m,k,f[a+5],21,4237533241),k=g(k,j,l,m,f[a+12],6,1700485571),m=g(m,k,j,l,f[a+3],10,2399980690),l=g(l,m,k,j,f[a+10],15,4293915773),j=g(j,l,m,k,f[a+1],21,2240044497),k=g(k,j,l,m,f[a+8],6,1873313359),m=g(m,k,j,l,f[a+15],10,4264355552),l=g(l,m,k,j,f[a+6],15,2734768916),j=g(j,l,m,k,f[a+13],21,1309151649),k=g(k,j,l,m,f[a+4],6,4149444226),m=g(m,k,j,l,f[a+11],10,3174756917),l=g(l,m,k,j,f[a+2],15,718787259),j=g(j,l,m,k,f[a+9],21,3951481745),k=b(k,o),j=b(j,p),l=b(l,q),m=b(m,n);return(h(k)+h(j)+h(l)+
h(m)).toLowerCase()};function parseBigInt(a,b){return new BigInteger(a,b)}function linebrk(a,b){for(var c="",d=0;d+b<a.length;)c+=a.substring(d,d+b)+"\n",d+=b;return c+a.substring(d,a.length)}function byte2Hex(a){return a<16?"0"+a.toString(16):a.toString(16)}
function pkcs1pad2(a,b){if(b<a.length+11)throw"Message too long for RSA (n="+b+", l="+a.length+")";for(var c=[],d=a.length-1;d>=0&&b>0;){var e=a.charCodeAt(d--);e<128?c[--b]=e:e>127&&e<2048?(c[--b]=e&63|128,c[--b]=e>>6|192):(c[--b]=e&63|128,c[--b]=e>>6&63|128,c[--b]=e>>12|224)}c[--b]=0;d=new SecureRandom;for(e=[];b>2;){for(e[0]=0;e[0]==0;)d.nextBytes(e);c[--b]=e[0]}c[--b]=2;c[--b]=0;return new BigInteger(c)}
function RSAKey(){this.n=null;this.e=0;this.coeff=this.dmq1=this.dmp1=this.q=this.p=this.d=null}function RSASetPublic(a,b){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16)):alert("Invalid RSA public key")}function RSADoPublic(a){return a.modPowInt(this.e,this.n)}function RSAEncrypt(a){a=pkcs1pad2(a,this.n.bitLength()+7>>3);if(a==null)return null;a=this.doPublic(a);if(a==null)return null;a=a.toString(16);return(a.length&1)==0?a:"0"+a}
RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt;function pkcs1unpad2(a,b){for(var c=a.toByteArray(),d=0;d<c.length&&c[d]==0;)++d;if(c.length-d!=b-1||c[d]!=2)return null;for(++d;c[d]!=0;)if(++d>=c.length)return null;for(var e="";++d<c.length;){var g=c[d]&255;g<128?e+=String.fromCharCode(g):g>191&&g<224?(e+=String.fromCharCode((g&31)<<6|c[d+1]&63),++d):(e+=String.fromCharCode((g&15)<<12|(c[d+1]&63)<<6|c[d+2]&63),d+=2)}return e}
function RSASetPrivate(a,b,c){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16)):alert("Invalid RSA private key")}
function RSASetPrivateEx(a,b,c,d,e,g,h,f){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16),this.p=parseBigInt(d,16),this.q=parseBigInt(e,16),this.dmp1=parseBigInt(g,16),this.dmq1=parseBigInt(h,16),this.coeff=parseBigInt(f,16)):alert("Invalid RSA private key")}
function RSAGenerate(a,b){var c=new SeededRandom,d=a>>1;this.e=parseInt(b,16);for(var e=new BigInteger(b,16);;){for(;;)if(this.p=new BigInteger(a-d,1,c),this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.p.isProbablePrime(10))break;for(;;)if(this.q=new BigInteger(d,1,c),this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.q.isProbablePrime(10))break;if(this.p.compareTo(this.q)<=0){var g=this.p;this.p=this.q;this.q=g}var g=this.p.subtract(BigInteger.ONE),
h=this.q.subtract(BigInteger.ONE),f=g.multiply(h);if(f.gcd(e).compareTo(BigInteger.ONE)==0){this.n=this.p.multiply(this.q);this.d=e.modInverse(f);this.dmp1=this.d.mod(g);this.dmq1=this.d.mod(h);this.coeff=this.q.modInverse(this.p);break}}}
function RSADoPrivate(a){if(this.p==null||this.q==null)return a.modPow(this.d,this.n);for(var b=a.mod(this.p).modPow(this.dmp1,this.p),a=a.mod(this.q).modPow(this.dmq1,this.q);b.compareTo(a)<0;)b=b.add(this.p);return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)}function RSADecrypt(a){a=this.doPrivate(parseBigInt(a,16));return a==null?null:pkcs1unpad2(a,this.n.bitLength()+7>>3)}RSAKey.prototype.doPrivate=RSADoPrivate;RSAKey.prototype.setPrivate=RSASetPrivate;
RSAKey.prototype.setPrivateEx=RSASetPrivateEx;RSAKey.prototype.generate=RSAGenerate;RSAKey.prototype.decrypt=RSADecrypt;var _RSASIGN_DIHEAD=[];_RSASIGN_DIHEAD.sha1="3021300906052b0e03021a05000414";_RSASIGN_DIHEAD.sha256="3031300d060960864801650304020105000420";var _RSASIGN_HASHHEXFUNC=[];_RSASIGN_HASHHEXFUNC.sha1=sha1.hex;_RSASIGN_HASHHEXFUNC.sha256=sha256.hex;
function _rsasign_getHexPaddedDigestInfoForString(a,b,c){b/=4;for(var a=(0,_RSASIGN_HASHHEXFUNC[c])(a),c="00"+_RSASIGN_DIHEAD[c]+a,a="",b=b-4-c.length,d=0;d<b;d+=2)a+="ff";return sPaddedMessageHex="0001"+a+c}function _rsasign_signString(a,b){var c=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),b);return this.doPrivate(parseBigInt(c,16)).toString(16)}
function _rsasign_signStringWithSHA1(a){a=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha1");return this.doPrivate(parseBigInt(a,16)).toString(16)}function _rsasign_signStringWithSHA256(a){a=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha256");return this.doPrivate(parseBigInt(a,16)).toString(16)}function _rsasign_getDecryptSignatureBI(a,b,c){var d=new RSAKey;d.setPublic(b,c);return d.doPublic(a)}
function _rsasign_getHexDigestInfoFromSig(a,b,c){return _rsasign_getDecryptSignatureBI(a,b,c).toString(16).replace(/^1f+00/,"")}function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a){for(var b in _RSASIGN_DIHEAD){var c=_RSASIGN_DIHEAD[b],d=c.length;if(a.substring(0,d)==c)return[b,a.substring(d)]}return[]}
function _rsasign_verifySignatureWithArgs(a,b,c,d){b=_rsasign_getHexDigestInfoFromSig(b,c,d);c=_rsasign_getAlgNameAndHashFromHexDisgestInfo(b);if(c.length==0)return!1;b=c[1];a=(0,_RSASIGN_HASHHEXFUNC[c[0]])(a);return b==a}function _rsasign_verifyHexSignatureForMessage(a,b){var c=parseBigInt(a,16);return _rsasign_verifySignatureWithArgs(b,c,this.n.toString(16),this.e.toString(16))}
function _rsasign_verifyString(a,b){var b=b.replace(/[ \n]+/g,""),c=this.doPublic(parseBigInt(b,16)).toString(16).replace(/^1f+00/,""),d=_rsasign_getAlgNameAndHashFromHexDisgestInfo(c);if(d.length==0)return!1;c=d[1];d=(0,_RSASIGN_HASHHEXFUNC[d[0]])(a);return c==d}RSAKey.prototype.signString=_rsasign_signString;RSAKey.prototype.signStringWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signStringWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.verifyString=_rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage=_rsasign_verifyHexSignatureForMessage;
var aes=function(){var a={Sbox:[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,
95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],ShiftRowTab:[0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11]};a.Init=
function(){a.Sbox_Inv=Array(256);for(var b=0;b<256;b++)a.Sbox_Inv[a.Sbox[b]]=b;a.ShiftRowTab_Inv=Array(16);for(b=0;b<16;b++)a.ShiftRowTab_Inv[a.ShiftRowTab[b]]=b;a.xtime=Array(256);for(b=0;b<128;b++)a.xtime[b]=b<<1,a.xtime[128+b]=b<<1^27};a.Done=function(){delete a.Sbox_Inv;delete a.ShiftRowTab_Inv;delete a.xtime};a.ExpandKey=function(b){var c=b.length,d,e=1;switch(c){case 16:d=176;break;case 24:d=208;break;case 32:d=240;break;default:alert("my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!")}for(var g=
c;g<d;g+=4){var h=b.slice(g-4,g);if(g%c==0){if(h=[a.Sbox[h[1]]^e,a.Sbox[h[2]],a.Sbox[h[3]],a.Sbox[h[0]]],(e<<=1)>=256)e^=283}else c>24&&g%c==16&&(h=[a.Sbox[h[0]],a.Sbox[h[1]],a.Sbox[h[2]],a.Sbox[h[3]]]);for(var f=0;f<4;f++)b[g+f]=b[g+f-c]^h[f]}};a.Encrypt=function(b,c){var d=c.length;a.AddRoundKey(b,c.slice(0,16));for(var e=16;e<d-16;e+=16)a.SubBytes(b,a.Sbox),a.ShiftRows(b,a.ShiftRowTab),a.MixColumns(b),a.AddRoundKey(b,c.slice(e,e+16));a.SubBytes(b,a.Sbox);a.ShiftRows(b,a.ShiftRowTab);a.AddRoundKey(b,
c.slice(e,d))};a.Decrypt=function(b,c){var d=c.length;a.AddRoundKey(b,c.slice(d-16,d));a.ShiftRows(b,a.ShiftRowTab_Inv);a.SubBytes(b,a.Sbox_Inv);for(d-=32;d>=16;d-=16)a.AddRoundKey(b,c.slice(d,d+16)),a.MixColumns_Inv(b),a.ShiftRows(b,a.ShiftRowTab_Inv),a.SubBytes(b,a.Sbox_Inv);a.AddRoundKey(b,c.slice(0,16))};a.SubBytes=function(a,c){for(var d=0;d<16;d++)a[d]=c[a[d]]};a.AddRoundKey=function(a,c){for(var d=0;d<16;d++)a[d]^=c[d]};a.ShiftRows=function(a,c){for(var d=[].concat(a),e=0;e<16;e++)a[e]=d[c[e]]};
a.MixColumns=function(b){for(var c=0;c<16;c+=4){var d=b[c+0],e=b[c+1],g=b[c+2],h=b[c+3],f=d^e^g^h;b[c+0]^=f^a.xtime[d^e];b[c+1]^=f^a.xtime[e^g];b[c+2]^=f^a.xtime[g^h];b[c+3]^=f^a.xtime[h^d]}};a.MixColumns_Inv=function(b){for(var c=0;c<16;c+=4){var d=b[c+0],e=b[c+1],g=b[c+2],h=b[c+3],f=d^e^g^h,o=a.xtime[f],p=a.xtime[a.xtime[o^d^g]]^f;f^=a.xtime[a.xtime[o^e^h]];b[c+0]^=p^a.xtime[d^e];b[c+1]^=f^a.xtime[e^g];b[c+2]^=p^a.xtime[g^h];b[c+3]^=f^a.xtime[h^d]}};return a}(),cryptico=function(){var a={};aes.Init();
a.b256to64=function(a){var c,d,e,g="",h=0,f=0,o=a.length;for(e=0;e<o;e++)d=a.charCodeAt(e),f==0?(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>2&63),c=(d&3)<<4):f==1?(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c|d>>4&15),c=(d&15)<<2):f==2&&(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c|d>>6&3),h+=1,g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d&63)),h+=1,f+=1,f==3&&
(f=0);f>0&&(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c),g+="=");f==1&&(g+="=");return g};a.b64to256=function(a){var c,d,e="",g=0,h=0,f=a.length;for(d=0;d<f;d++)c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d)),c>=0&&(g&&(e+=String.fromCharCode(h|c>>6-g&255)),g=g+2&7,h=c<<g&255);return e};a.b16to64=function(a){var c,d,e="";a.length%2==1&&(a="0"+a);for(c=0;c+3<=a.length;c+=3)d=parseInt(a.substring(c,c+3),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>
6)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d&63);c+1==a.length?(d=parseInt(a.substring(c,c+1),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d<<2)):c+2==a.length&&(d=parseInt(a.substring(c,c+2),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>2)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d&3)<<4));for(;(e.length&3)>0;)e+="=";return e};a.b64to16=function(a){var c="",
d,e=0,g;for(d=0;d<a.length;++d){if(a.charAt(d)=="=")break;v="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d));v<0||(e==0?(c+=int2char(v>>2),g=v&3,e=1):e==1?(c+=int2char(g<<2|v>>4),g=v&15,e=2):e==2?(c+=int2char(g),c+=int2char(v>>2),g=v&3,e=3):(c+=int2char(g<<2|v>>4),c+=int2char(v&15),e=0))}e==1&&(c+=int2char(g<<2));return c};a.string2bytes=function(a){for(var c=[],d=0;d<a.length;d++)c.push(a.charCodeAt(d));return c};a.bytes2string=function(a){for(var c="",d=0;d<
a.length;d++)c+=String.fromCharCode(a[d]);return c};a.blockXOR=function(a,c){for(var d=Array(16),e=0;e<16;e++)d[e]=a[e]^c[e];return d};a.blockIV=function(){var a=new SecureRandom,c=Array(16);a.nextBytes(c);return c};a.pad16=function(a){var c=a.slice(0),d=(16-a.length%16)%16;for(i=a.length;i<a.length+d;i++)c.push(0);return c};a.depad=function(a){for(a=a.slice(0);a[a.length-1]==0;)a=a.slice(0,a.length-1);return a};a.encryptAESCBC=function(b,c){var d=c.slice(0);aes.ExpandKey(d);for(var e=a.string2bytes(b),
e=a.pad16(e),g=a.blockIV(),h=0;h<e.length/16;h++){var f=e.slice(h*16,h*16+16),o=g.slice(h*16,h*16+16),f=a.blockXOR(o,f);aes.Encrypt(f,d);g=g.concat(f)}d=a.bytes2string(g);return a.b256to64(d)};a.decryptAESCBC=function(b,c){var d=c.slice(0);aes.ExpandKey(d);for(var b=a.b64to256(b),e=a.string2bytes(b),g=[],h=1;h<e.length/16;h++){var f=e.slice(h*16,h*16+16),o=e.slice((h-1)*16,(h-1)*16+16);aes.Decrypt(f,d);f=a.blockXOR(o,f);g=g.concat(f)}g=a.depad(g);return a.bytes2string(g)};a.wrap60=function(a){for(var c=
"",d=0;d<a.length;d++)d%60==0&&d!=0&&(c+="\n"),c+=a[d];return c};a.generateAESKey=function(){var a=Array(32);(new SecureRandom).nextBytes(a);return a};a.generateRSAKey=function(a,c){Math.seedrandom(sha256.hex(a));var d=new RSAKey;d.generate(c,"03");return d};a.publicKeyString=function(b){return pubkey=a.b16to64(b.n.toString(16))};a.publicKeyID=function(a){return MD5(a)};a.publicKeyFromString=function(b){var b=a.b64to16(b.split("|")[0]),c=new RSAKey;c.setPublic(b,"03");return c};a.encrypt=function(b,
c,d){var e="",g=a.generateAESKey();try{var h=a.publicKeyFromString(c);e+=a.b16to64(h.encrypt(a.bytes2string(g)))+"?"}catch(f){return{status:"Invalid public key"}}d&&(signString=cryptico.b16to64(d.signString(b,"sha256")),b+="::52cee64bb3a38f6403386519a39ac91c::",b+=cryptico.publicKeyString(d),b+="::52cee64bb3a38f6403386519a39ac91c::",b+=signString);e+=a.encryptAESCBC(b,g);return{status:"success",cipher:e}};a.decrypt=function(b,c){var d=b.split("?"),e=c.decrypt(a.b64to16(d[0]));if(e==null)return{status:"failure"};
e=a.string2bytes(e);d=a.decryptAESCBC(d[1],e).split("::52cee64bb3a38f6403386519a39ac91c::");if(d.length==3){var e=a.publicKeyFromString(d[1]),g=a.b64to16(d[2]);return e.verifyString(d[0],g)?{status:"success",plaintext:d[0],signature:"verified",publicKeyString:a.publicKeyString(e)}:{status:"success",plaintext:d[0],signature:"forged",publicKeyString:a.publicKeyString(e)}}else return{status:"success",plaintext:d[0],signature:"unsigned"}};return a}();
