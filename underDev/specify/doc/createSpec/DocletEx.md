# 🧩 DocletExクラス仕様書

DocletEx

## 🧾 概説

DocletEx: jsdocから出力されるDocletに情報を付加したもの

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| id | string | 必須 | 固有パス＋longname |  |
| unique | string | 必須 | ソースファイルの固有パス | 固有パス：複数フォルダ対象時、フルパスから共通のパスを除いた部分
  unique = 'client/test.js' -> 'client/' ※最後に'/'が付く
  unique = 'test.js' -> '/' ※直下の場合'/' |
| docletType | string | 必須 | Docletの種類。下記「docletTypeの判定ロジック」参照 |  |
| label | string | 必須 | 1行で簡潔に記述された概要説明 | ① `／** `に続く文字列
  ② description, classdesc があれば先頭行
  ③ longname
  ※ 上記に該当が無い場合、「(ラベル未設定)」 |
| properties | PropList | 任意 | メンバ一覧 |  |
| params | PropList | 任意 | 引数。クラスの場合はconstructorの引数 |  |
| returns | PropList | [] | 戻り値 |  |
| parent | string |  | 親要素のDocletEx.id |  |
| children | string[] | [] | 子要素(メソッド・内部関数)のDocletEx.id | # docletTypeの判定ロジック

以下第一レベルがdocletTypeとする文字列

- typedef
  kind === 'typedef'
- interface
  kind === 'interface'
- class
  kind === 'class'
  && (meta.code.type === "ClassDeclaration" || "ClassExpression")
- constructor
  kind === 'class'
  && meta?.code?.type === "MethodDefinition"
  && /＠constructor\b/.test(doclet.comment || "")
- method
  kind === "function"
  && meta?.code?.type === "MethodDefinition"
  && scope === "instance" または "static"
- function(グローバル関数) ※アロー関数を含む
  kind === 'function'
  && scope === 'global'
- innerFunc(関数内関数) ※アロー関数を含む
  kind === 'function'
  && scope === 'inner'
- description(説明文(＠name))
  meta.code が空
  && meta.code.nameがundefined(プラグインや拡張を考慮する場合には必要)
  && kindがtypedef/interface 以外
  && nameが存在
- objectFunc(interface内function定義)　※書き方に関しては冒頭の記述例参照<br>
  なおあくまでinterfaceなので、関数と同時にpropertiesも含む
  kind === 'function'
  && scope === 'instance'
- unknown(上記で判定不能) |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | Doclet | 必須 |  |  |
| unique | string | / |  |  |