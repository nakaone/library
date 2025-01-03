- cols {sdbColumn[]} 項目定義オブジェクトの配列
  <!--::$doc/typedef.sdbColumn.md::-->
- primaryKey {string}='id' 一意キー項目名
- unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報<br>メンバ名はprimaryKey/uniqueの項目名
- auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報<br>メンバ名はauto_incrementの項目名
  - start {number} 開始値
  - step {number} 増減値
  - current {number} 現在の最大(小)値<br>currentはsdbTableインスタンスで操作する。
- defaultRow {Object|function} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ