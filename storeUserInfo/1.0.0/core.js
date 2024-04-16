/** sessionStorage/localStorageのユーザ情報を更新する
 * 
 * ①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
 * ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
 * localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。
 * 
 * @param {string} programId - configObjを保存するstorage上のキー文字列
 * @param {Object} [opt]
 * @param {number} [opt.userId=null] - URLクエリ文字列等、決まったユーザIDを指定する場合に使用
 * @param {string} [opt.CSSselector=null] - userIdを保持するHTML上の要素を特定するCSSセレクタ文字列
 * @param {number} [opt.public=1] - ユーザIDの特定で権限が昇格する場合、変更前の権限(一般公開用権限)
 * @param {number} [opt.member=2] - ユーザIDの特定で権限が昇格する場合、変更後の権限(参加者用権限)
 * @returns {void}
 * 
 * @example
 * 
 * **実行結果(例)**
 * 
 * - localStorage : ユーザIDのみ。以下は`programId='camp2024'`の場合の例。
 *   | Key | Value |
 *   | :-- | :-- |
 *   | camp2024 | 123 |
 * - sessionStorage : ユーザID＋ユーザ権限
 *   | Key | Value |
 *   | :-- | :-- |
 *   | camp2024 | {"userId":123,"auth":1} |
 * 
 * **HTMLへのユーザIDの埋め込み**
 * 
 * 応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
 * 以下のようにHTMLにIDが埋め込まれて返される。
 * 
 * 1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
 *    ```
 *    https://script.google.com/macros/s/AK〜24yz/exec?id=123
 *    ```
 * 2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
 *    ```
 *    <div style="display:none" name="userId"><?= userId ?></div>
 *    ```
 * 3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
 *    ```
 *    function doGet(e){
 *      const template = HtmlService.createTemplateFromFile('index');
 *      template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
 *      const htmlOutput = template.evaluate();
 *      htmlOutput.setTitle(config.programId);  // ここではclient側と共通のconfigで名称を指定
 *      return htmlOutput;
 *    }
 *    ```
 * 4. `opt.CSSselector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
 * 
 */
function storeUserInfo(programId=null,opt={}){
  const v = {whois:'storeUserInfo',rv:null,step:0,html:null,arg:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 必須引数の確認
    if( programId === null )
      throw new Error(`${v.whois} Error: no programId.`);
    v.step = 1.2; // オプションの既定値をセット
    v.opt = Object.assign({
      userId: null,
      CSSselector: null,
      public: 1,
      member: 2,
    },opt);

    v.step = 2.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(programId);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:1};
    v.step = 2.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(programId);
    v.local = v.r ? Number(v.r) : null;
    v.step = 2.3; // HTMLに埋め込まれたuserIdを取得
    if( v.opt.CSSselector !== null ){
      v.r = document.querySelector(v.opt.CSSselector).innerText;
      v.html = v.r.length > 0 ? Number(v.r) : null;  
    }
    v.step = 2.4; // 引数で渡されたuserIdを取得
    if( v.opt.userId !== null ) v.arg = Number(v.opt.userId);

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === v.opt.public ){
      v.session.auth = v.opt.member;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(programId,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(programId,v.session.userId);
    
    v.step = 4; // 終了処理
    v.rv = v.session;
    console.log(`${v.whois} normal end.\n`
    +`v.session=${JSON.stringify(v.session)}\nv.local=${v.local}\nv.html=${v.html}\nv.arg=${v.arg}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
