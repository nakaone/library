/** sessionStorage/localStorageのユーザ情報を更新する
 * 
 * ①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
 * ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
 * localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。
 * 
 * @param {number} userId=null - 決まったユーザIDを指定する場合に指定
 * @returns {void}
 * 
 * @example
 * 
 * **実行結果(例)**
 * 
 * - localStorage : ユーザIDのみ。以下は例。
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | 123 |
 * - sessionStorage : ユーザID＋ユーザ権限
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | {"userId":123,"auth":1} |
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
 *      htmlOutput.setTitle('camp2024');
 *      return htmlOutput;
 *    }
 *    ```
 * 4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
 * 
 */
storeUserInfo(userId=null){
  const v = {whois:'storeUserInfo',rv:null,step:0,html:null,arg:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // オプションの既定値をセット

    v.step = 2.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:1};
    v.step = 2.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? Number(v.r) : null;
    v.step = 2.3; // HTMLに埋め込まれたuserIdを取得
    v.dom = document.querySelector(this.userIdSelector);
    if( v.dom !== null ){
      v.r = v.dom.innerText;
      v.html = v.r.length > 0 ? Number(v.r) : null;  
    }
    v.step = 2.4; // 引数で渡されたuserIdを取得
    if( userId !== null ) v.arg = Number(userId);

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === this.publicAuth ){
      v.session.auth = this.memberAuth;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.session.userId);
    
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
