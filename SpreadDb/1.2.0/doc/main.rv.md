rv {Object[]} 以下のメンバを持つオブジェクトの配列

- query {Object} 引数として渡されたqueryのコピー
- isErr {boolean}=false 正常終了ならfalse<br>一つのqueryで複数の処理を指示した場合(ex.複数レコードの追加)、いずれか一つでもエラーになればisErrはtrueとなる。
- message {string} エラーメッセージ。isErr==trueの場合のみ。
- row {Object[]}=null selectの該当行オブジェクトの配列。該当無しの場合、row.length===0
- schema {Object.<string,sdbColumn[]>} schemaで取得した{テーブル名：項目定義オブジェクトの配列}形式のオブジェクト
  <!--::$doc/typedef.sdbColumn.md::-->
- log {sdbLog[]} 更新履歴。update,deleteで該当無しの場合、log.length===0
  <!--::$doc/typedef.sdbLog.md::-->
