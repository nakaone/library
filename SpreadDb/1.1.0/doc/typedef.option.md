- userId {string}='guest' ユーザの識別子
  > 指定する場合、必ずuserAuthも併せて指定
- userAuth {Object.<string,string>}={} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
  > r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可<br>
  > o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。<br>
  > また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可<br>
  > read/writeは自分のみ可、delete/schemaは実行不可
- log {string}='log' 更新履歴テーブル名
  > nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈
- maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数
- interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)
- guestAuth {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
- adminId {string}='Administrator' 管理者として扱うuserId
  > 管理者は全てのシートの全権限を持つ