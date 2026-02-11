# 🧩 PropListクラス仕様書

PropList

## 🧾 概説

属性一覧表示用のオブジェクトを作成

## 🧾 概説

属性一覧表示用のオブジェクトを作成
PropList: 属性一覧に表示する項目

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| list | object[] | 必須 | 項目一覧 |  |
| list.name | string | 必須 | 項目名 |  |
| list.type | string | 必須 | データ型。複数なら' | 'で区切って並記 |  |
| list.value | string | 必須 | 要否/既定値。「必須」「任意」または既定値 |  |
| list.desc | string | 必須 | 1行の簡潔な項目説明 |  |
| list.note | string | 必須 | 備考 |  |
| opt | Object | 必須 | オプション。内容はconstructorのparam参照 |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| doclet | DocletColDef | 必須 | Docletの項目定義オブジェクト |  |
| opt | Object | {} | オプション |  |
| opt.lang | string | ロケール | ラベルに使用する言語(ex.'ja-JP') |  |
| opt.label | Object | 任意 | 項目のメンバ名->Markdown作成時のラベル文字列への変換マップ | 既定値に統合するので、変更・追加項目のみ指定すれば可。
  例：valueを「要否/既定値」から「値」に変更 ⇒ {value:'値'}
  　　独自項目'foo'を追加 ⇒ {foo:'ダミー'} |
| opt.order | string | ['name','type','value','desc','note'] | 項目の並び順 | 記載されていない項目はMarkdownで表を作成する際、非表示になる。
  既定値を置換するので、変更する場合は全項目を指定する。
  例：value,noteは表示不要、独自項目fooを追加 ⇒ ['name','type','desc','foo'] |
| opt.value | Object | 任意 | 項目の値->Markdown作成時の表示への変換マップ |  |

## 📤 戻り値

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| PropList \| Object \| Error | 処理対象属性が無い場合は{} |  |