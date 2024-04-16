<a name="storeUserInfo"></a>

## storeUserInfo(programId, [opt]) ⇒ <code>void</code>
sessionStorage/localStorageのユーザ情報を更新する

①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| programId | <code>string</code> | <code>null</code> | configObjを保存するstorage上のキー文字列 |
| [opt] | <code>Object</code> |  |  |
| [opt.userId] | <code>number</code> | <code></code> | URLクエリ文字列等、決まったユーザIDを指定する場合に使用 |
| [opt.CSSselector] | <code>string</code> | <code>null</code> | userIdを保持するHTML上の要素を特定するCSSセレクタ文字列 |
| [opt.public] | <code>number</code> | <code>1</code> | ユーザIDの特定で権限が昇格する場合、変更前の権限(一般公開用権限) |
| [opt.member] | <code>number</code> | <code>2</code> | ユーザIDの特定で権限が昇格する場合、変更後の権限(参加者用権限) |

**Example**  
**実行結果(例)**

- localStorage : ユーザIDのみ。以下は`programId='camp2024'`の場合の例。
  | Key | Value |
  | :-- | :-- |
  | camp2024 | 123 |
- sessionStorage : ユーザID＋ユーザ権限
  | Key | Value |
  | :-- | :-- |
  | camp2024 | {"userId":123,"auth":1} |

**HTMLへのユーザIDの埋め込み**

応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
以下のようにHTMLにIDが埋め込まれて返される。

1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
   ```
   https://script.google.com/macros/s/AK〜24yz/exec?id=123
   ```
2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
   ```
   <div style="display:none" name="userId"><?= userId ?></div>
   ```
3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
   ```
   function doGet(e){
     const template = HtmlService.createTemplateFromFile('index');
     template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
     const htmlOutput = template.evaluate();
     htmlOutput.setTitle(config.programId);  // ここではclient側と共通のconfigで名称を指定
     return htmlOutput;
   }
   ```
4. `opt.CSSselector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
