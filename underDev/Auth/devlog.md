# specify

## Markdown内のcfTableタグ再帰処理

<!--
| No | MD作成箇所 | 引用元データ | 備考 |
| :--: | :-- | :-- | :-- |
| ① | メンバ一覧 | specDef.js | 初回で確定 |
| ② | 引数 | メンバ一覧 | 2回目で確定 |
| ② | 戻り値 | メンバ一覧 | 2回目で確定 |
| ③ | 処理手順 | 引数・戻り値 | 3回目で確定 |

- cfTableが作成できない場合の戻り値をnullとし、nullならcontent=''になるよう修正(templateはそのまま)
- secondaryにmakeMDを統合。一カ所でも作成できないMDが有った場合nullを返し、nullが無くなるまでループさせる
- MarkdownDefでcfTable(template)がnullの場合はcontentにセットしない(contentは展開済文字列に限定)

- BaseDef
  - cfTable修正
    - `Invalid type` -> `invalid argument`に修正
    - `typeof BaseDef.defMap[obj.type] === 'undefined'`の場合、`unregistered type`を返すよう修正
  - replaceTags削除(MarkdownDef.evalContentに移動)
- ProjectDef
  - constructor
- ClassDef
  - makeMdの内容をconstructorに移行
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- MembersDef
  - makeMdの内容をconstructorに移行
  - 一覧系の表は「配下の要素.markdown.fixedが全部trueになったら作成」に変更
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- FieldDef
  - makeMdの内容をconstructorに移行
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- MethodsDef
  - makeMdの内容をconstructorに移行
  - 一覧系の表は「配下の要素.markdown.fixedが全部trueになったら作成」に変更
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- MethodDef
  - makeMdの内容をconstructorに移行
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- ParamsDef
  - makeMdの内容をconstructorに移行
  - 一覧系の表は「配下の要素.markdown.fixedが全部trueになったら作成」に変更
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- ReturnsDef
  - makeMdの内容をconstructorに移行
  - 一覧系の表は「配下の要素.markdown.fixedが全部trueになったら作成」に変更
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
-->
- ReturnDef
  - makeMdの内容をconstructorに移行
  - secondary
    - 子要素のsecondaryを順次呼び出し(従前)
    - 全要素が評価済ならtrue、未評価が残っている場合falseを返す
- MarkdownDef
  - メンバ
    - メンバ"{boolean} fixed=false"を追加
    - templateは削除(contentに一本化)
  - evalContent作成
    - 引数は評価対象のcontent
    - 中に"<!--%%〜%%-->"が無い場合、nullを返して終了
    - 中に"<!--%%〜%%-->"が有る場合、評価タグの数だけループ
      - 評価タグの中身を評価(eval(cfTable(..)))
      - 戻り値がErrorオブジェクト
        - `unregistered type` -> contentそのままで処理継続
        - その他 -> throw
      - 戻り値が文字列(=評価結果) -> contentを書き換え
      - 全てOK -> fixed=true
    - 戻り値は置換済のcontent
  - constructor修正
    - 引数はオブジェクトのみから文字列もOKに変更
    - 文字列で与えられた場合はcontentとして扱う
    - 「引数をメンバ変数へ設定」は従前
    - evalContent呼び出し、content書き換え
  - secondary作成
    - fixed=falseならevalContent呼び出し、content書き換え

## callerの表示

呼出元の処理手順に以下の文法で呼出先メソッドの情報を記載する事で、
①呼出先メソッドの引数・戻り値を表示可能にする
②呼出先メソッド「呼出元」リストから呼出元メソッドへのリンクを作成する

- 記述方法：`[▼aaa](bbb.md#ccc_ddd)`
  - "aaa": 呼出先の名称(任意の文字列)
  - "bbb.md": 呼出先クラス名＋".md"
  - "ccc": 呼出先クラス名.toLowerCase()
  - "ddd": 呼出先メソッド名.toLowerCase()
  - 例：`[▼監査ログ](authAuditLog.md#authauditlog_constructor)を生成`
  - "▼"が無い場合、特に追加処理無し(呼出先メソッドへのリンクを作成)
  - "▼"が有る場合、本タグの次行に呼出先メソッドの引数・戻り値を展開
  - 何れの場合も呼出先メソッドのcallerに呼出元情報を追加
    `{class:呼出元クラス名, method:呼出元メソッド名}`

- 被呼出メソッドに「呼出元」リスト追加(caller実装)
- 相互参照を容易にするため、ProjectDefにメンバ"map"を追加
  {Object} map - 小文字のクラス名から本来のクラス名への変換マップ

## その他ToDo

- 戻り値クラスのメンバ一覧表示時、クラス名とリンクを表示(ex.「項目名」の欄)
- クラス一覧出力(環境別)
- 引数・メンバ一覧も説明文追加可能に
  引数・メンバ一覧でMarkdownDef.constructor呼出時のテンプレートは
  `%%cfTable(new Params(...))%%`形式で指定すれば良い？
- メンバ一覧・引数・戻り値・処理手順のJSDoc(typedef)にcfTableタグの使用方法を追記
- implementが一種類以下の場合、環境別に分けずに"-o"フォルダ直下に全ファイル作成
- テンプレートに基づくソース作成

## ゴミ箱

- MarkdownDef.constructorの引数は文字列も受入可能に
  -> わざわざ文字列にしなくても、呼出側でMarkdownDef.templateにセットして呼び出せば良い？

# Auth

- サーバ側仕様書作成・レビュー
  - 済：cryptoServerクラス
  - 済：Memberクラス
  - authServer(クロージャ関数)仕様書のレビュー(サーバ側のフロント)
- クライアント側仕様書作成・レビュー
  - cryptoClientクラス仕様書のレビュー(cryptoServerと対になるクライアント側署名・暗号化・復号・検証機能)
  - authClientクラス仕様書のレビュー(クライアント側のフロント)
- spec.mdの再レビュー(サーバ側・クライアント側仕様変更を反映した後の、全体的な整合性チェック)
- パーツとなるクラスの実装(MemberLog,MemberProfile等)
- 主要クラス(cryptoClient/Server,authClient/Server,Member)のスケルトン作成
- テスト仕様・ツールの作成
- 主要クラスの実装