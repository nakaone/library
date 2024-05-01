/** storeUserInfo: インスタンス変数やstorageに保存したユーザ情報を更新
 * 
 * 
 * 1. 本関数の引数オブジェクト
 * 1. インスタンス変数
 * 1. sessionStorage
 * 1. localStorage
 * 1. HTMLに埋め込まれたユーザ情報
 * 
 * ユーザ情報を取得し、①>②>③>④>⑤の優先順位で最新の情報を特定、各々の内容を更新する。
 * 
 * | 名称 | 属性 | 内容 | loc | ses | mem | I/O | sht |
 * | :-- | :-- | :-- | :--: | :--: | :--: | :--: | :--: |
 * | userId | number | (新規採番された)ユーザID | ◎ | ◎ | ◎ | ◎ | ◎ |
 * | created | string | ユーザID新規登録時刻(日時文字列) | × | ◎ | ◎ | × | ◎ |
 * | email | string | ユーザの連絡先メールアドレス | × | ◎ | ◎ | × | ◎ |
 * | auth | number | ユーザの権限 | × | ◎ | ◎ | ◎ | ◎ |
 * | passPhrase | string | クライアント側鍵ペア生成のパスフレーズ | × | ◎ | ◎ | × | × |
 * | CSkey | object | クライアント側の秘密鍵 | × | × | ◎ | × | × |
 * | CPkey | string | クライアント側の公開鍵 | × | ◎ | ◎ | × | ◎ |
 * | updated | string | クライアント側公開鍵生成時刻(日時文字列) | × | ◎ | ◎ | × | ◎ |
 * | SPkey | string | サーバ側の公開鍵 | × | ◎ | ◎ | ◎ | × |
 * | isExist | boolean | 新規登録対象メアドが登録済ならtrue | × | × | × | ◎ | × |
 * | trial | object | ログイン試行関係情報 | × | × | × | ▲ | ◎ |
 * 
 * - インスタンス変数には関数実行結果を除く全項目を持たせ、他の格納場所のマスタとして使用する
 * - sessionStorageはインスタンス変数のバックアップとして、保持可能な全項目を持たせる
 * - ユーザ情報に関するインスタンス変数(メンバ)は、他のインスタンス変数(設定項目)と区別するため、
 *   `this.user`オブジェクトに上記メンバを持たせる
 * 
 * 
 * @param {object} arg={} - 特定の値を設定する場合に使用 
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
storeUserInfo(arg={}){
  const v = {whois:this.constructor.name+'.storeUserInfo',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    // -------------------------------------
    // 各格納場所から現在の保存内容を取得
    // -------------------------------------
    v.step = 1.1; //インスタンス変数
    v.user = this.hasOwnProperty('user') ? this.user : {};
    if( Object.keys(v.user).length === 0 ){
      // メンバが存在しない場合、全項目nullの初期オブジェクトを作成
      ['userId','created','email','auth','passPhrase','CSkey',
      'CPkey','updated','SPkey'].forEach(x => v.user[x]=null);
    }
    v.step = 1.2; // sessionStorage
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {};
    v.step = 1.3; // localStorage
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? {userId:Number(v.r)} : {};
    v.step = 1.4; // HTMLに埋め込まれたユーザ情報(ID)
    v.dom = document.querySelector(this.userIdSelector);
    v.html = (v.dom !== null && v.dom.innerText.length > 0)
      ? {userId:Number(v.r)} :{};

    // -------------------------------------
    // 各格納場所のユーザ情報をv.rvに一元化
    // -------------------------------------
    v.step = 2.1; // 優先順位に沿ってユーザ情報を統合
    // 優先順位は`html < local < session < user < arg`
    v.rv = Object.assign(v.html,v.local,v.session,v.user,arg);

    v.step = 2.2; // 鍵ペア・秘密鍵が存在しなければ作成
    if( v.rv.passPhrase === null || v.rv.CSkey === null ){
      if( v.rv.passPhrase === null ){
        v.rv.passPhrase = createPassword(this.passPhraseLength);
        v.rv.updated = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn');
      }
      v.rv.CSkey = cryptico.generateRSAKey(v.rv.passPhrase,(this.RSAkeyLength));
      v.rv.CPkey = cryptico.publicKeyString(v.rv.CSkey);
    }

    v.step = 2.3; // ユーザ権限の設定
    if( v.rv.auth === null ){
      // ユーザIDが未設定 ⇒ 一般公開用
      v.rv.auth = this.publicAuth;
    } else if( v.rv.auth === this.publicAuth ){
      // ユーザIDが設定済だが権限が一般公開用 ⇒ 参加者用に修正
      v.rv.auth = this.memberAuth;
    }

    // -------------------------------------
    // 各格納場所の値を更新
    // -------------------------------------
    v.step = 3.3; // インスタンス変数(メンバ)への保存
    this.user = v.rv;
    v.step = 3.2; // sessionStorageへの保存
    Object.keys(v.user).filter(x => x !== 'CSkey').forEach(x => {
      if( v.rv.hasOwnProperty(x) && v.rv[x] ){
        v.session[x] = v.rv[x];
      }
    });
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.1; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.rv.userId);

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}\nv.rv=${v.rv}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}