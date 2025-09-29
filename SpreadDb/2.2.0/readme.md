# 仕様書

- [JSDoc](doc/index.html)

# 更新履歴

- rev.2.2.0 : 2025/09/28
  - upsert, getSchemaを追加実装
  - create table時のprimary key対応追加
  - AlaSQLとの競合回避のため、一部項目名変更(tables->tableMap, cols->colMap)

- rev.2.1.0 : 2025/09/18
  - schemaのデータ型を修正

- rev.2.0.0 : 2025/08/20
  - AlaSQL使用を前提に全面改定

- rev.1.2.0 : 2025/01/04〜01/26
  - 設計思想を「クエリ単位に必要な情報を付加して実行、結果もクエリに付加」に変更
  - 変更履歴を「クエリの実行結果」と「(クエリ内の)レコードの実行結果」の二種類のレコードレイアウトを持つように変更
  - エラー発生時、messageではなくエラーコードで返すよう変更
  - 1つの処理要求(query)で複数レコードを対象とする場合、一レコードでもエラーが発生したらエラーに
  - 変更履歴シートのUUIDは削除
  - workflowyで作成した使用をmarkdown化する機能を追加
  - queryにSpreadDb呼出元での突合用項目"queryId"を追加
  
- rev.1.1.0 : 2024/12/27
  - 上・左余白不可、複数テーブル/シート不可に変更(∵ロジックが複雑で保守性低下)
    - テーブル名とシート名が一致
    - 左上隅のセルはA1に固定
  - 「更新履歴」の各項目の並び・属性他について、シート上の変更は反映されない(システム側で固定)
  - 各シートの権限チェックロジックを追加(opt.account)
  - クロージャを採用(append/update/deleteをprivate関数化)
    - select文を追加(従来のclass方式ではインスタンスから直接取得)
    - インスタンスを返す方式から、指定された操作(query)の結果オブジェクトを返すように変更
  - getSchemaメソッドを追加
  - 旧版のgetLogは廃止(select文で代替)
- 仕様の詳細は[workflowy](<a href="https://workflowy.com/#/4e03d2d2c266)参照">https://workflowy.com/#/4e03d2d2c266)参照</a>
