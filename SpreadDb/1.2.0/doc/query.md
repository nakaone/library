<ul>
  <li>table {string|string[]} 操作対象テーブル名
    <blockquote>全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列</blockquote>
  </li>
  <li>command {string} 操作名
    <blockquote>全commandで使用。create/select/update/delete/append/schema</blockquote>
  </li>
  <li><details><summary>[cols] {sdbColumn[]} 新規作成シートの項目定義オブジェクトの配列</summary>
    <!--::$doc/sdbColumn.md::-->
    </details>
    <blockquote>command='create'のみで使用</blockquote>
  </li>
  <li>[values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
    <blockquote>command='create'のみで使用</blockquote>
  </li>
  <li>
    <details><summary>[where] {Object|Function|string} 対象レコードの判定条件</summary>
    <!--::$doc/where.md::-->
    </details>
    <blockquote>command='select','update','delete'で使用</blockquote>
  </li>
  <li>
    <details><summary>[record] {Object|Function} 追加・更新する値</summary>
    <!--::$doc/record.md::-->
    </details>
    <blockquote>command='update','append'で使用</blockquote>
  </li>
</ul>