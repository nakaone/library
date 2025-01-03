- table {string|string[]} 操作対象テーブル名<br>全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列
- command {string} 操作名<br>全commandで使用。create/select/update/delete/append/schema
- [cols] {[sdbColumn](#e23eb4c4-ab0d-4776-8038-775f6b018fc6)[]} - 新規作成シートの項目定義オブジェクトの配列<br>command='create'のみで使用
  <!--::$doc/typedef.sdbColumn.md::-->
- [values] {Object[]|Array[]} - 新規作成シートに書き込む初期値<br>command='create'のみで使用
- [where] {Object|Function|string} 対象レコードの判定条件<br>command='select','update','delete'で使用<br>
  <!--::$doc/variable.where.md::-->
- [record] {Object|Function} 追加・更新する値<br>command='update','append'で使用<br>
  <!--::$doc/variable.record.md::-->