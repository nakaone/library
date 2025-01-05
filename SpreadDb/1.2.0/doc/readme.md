# <a name="d488ebac-6d7f-49c8-ae6b-04cb35508546">SpreadDb</a> rev.1.2.0

# 概要

<!--::$doc/main.md::-->

# 引数

# 戻り値

# 使用例

# 内部関数 - 非command系

## genTable() : sdbTableオブジェクトを生成

## genSchema() : sdbSchemaオブジェクトを生成

## genColumn() : sdbColumnオブジェクトを生成

## genLog() : sdbLogオブジェクトを生成

## convertRow() : シートイメージと行オブジェクトの相互変換

## functionalize() : where句のオブジェクト・文字列を関数化

# 内部関数 - command系

## createTable() : データから新規テーブルを生成

## selectRow() : テーブルから条件に合致する行を抽出

## updateRow() : テーブルを更新

## appendRow() : テーブルに新規行を追加

## deleteRow() : テーブルから条件に合致する行を削除

## getSchema() : 指定されたテーブルの構造情報を取得

# typedefs

## メンバ変数

# 注意事項

# 更新履歴

- rev.1.2.0 : 2025/01/04〜
  - エラー発生時、messageではなくエラーコードで返すよう変更
  - 1つの処理要求(query)で複数レコードを対象とする場合、一レコードでもエラーが発生したらエラーに
  - 変更履歴シートのUUIDは削除