# <a name="d488ebac-6d7f-49c8-ae6b-04cb35508546">SpreadDb</a> rev.1.2.0

# 概要

1. スプレッドシートを凍結
1. queryで渡された操作要求を順次処理
1. 権限確認後、command系内部関数の呼び出し
1. 結果を実行結果オブジェクトに保存
1. 実行結果オブジェクトの配列を変更履歴シートに追記
1. スプレッドシートの凍結解除

![](doc/flowchart.main.webp)

- 引数

  - <details><summary>query {Object[]} 操作要求の内容</summary>
    <ul>
      <li>table {string|string[]} 操作対象テーブル名
        <blockquote>全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列</blockquote>
      </li>
      <li>command {string} 操作名
        <blockquote>全commandで使用。create/select/update/delete/append/schema</blockquote>
      </li>
      <li><details><summary>[cols] {sdbColumn[]} 新規作成シートの項目定義オブジェクトの配列</summary>
            - name {string} 項目名
        - type {string} データ型。string,number,boolean,Date,JSON,UUID
        - format {string} 表示形式。type=Dateの場合のみ指定
        - options {string} 取り得る選択肢(配列)のJSON表現<br>ex. ["未入場","既収","未収","無料"]
        - default {function} 既定値を取得する関数。引数は当該行オブジェクト<br>指定の際は必ず{〜} で囲み、return文を付与のこと。<br>ex.o => {return toLocale(new Date())}
        - primaryKey {boolean}=false 一意キー項目ならtrue
        - unique {boolean}=false primaryKey以外で一意な値を持つならtrue
        - auto_increment {bloolean|null|number|number[]}=false 自動採番項目
          - null ⇒ 自動採番しない
          - boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
          - number ⇒ 自動採番する(基数=指定値,増減値=1)
          - number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
          - object ⇒ {start:m,step:n}形式
        - suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
        - note {string} 本項目に関する備考。create table等では使用しない
        </details>
        <blockquote>command='create'のみで使用</blockquote>
      </li>
      <li>[values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
        <blockquote>command='create'のみで使用</blockquote>
      </li>
      <li>
        <details><summary>[where] {Object|Function|string} 対象レコードの判定条件</summary>
            <!--
        where {Object|Function|string} 対象レコードの判定条件
        -->
        【where句の指定方法】
        - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
        - function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
        - string
          - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。
          - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
        - その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値
        </details>
        <blockquote>command='select','update','delete'で使用</blockquote>
      </li>
      <li>
        <details><summary>[record] {Object|Function} 追加・更新する値</summary>
            <!--
        record {Object|string|Function} 更新する値
        -->
        【record句の指定方法】
        - Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
        - string ⇒ 上記Objectに変換可能なJSON文字列
        - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
          【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
        </details>
        <blockquote>command='update','append'で使用</blockquote>
      </li>
    </ul>
    </details>
  - opt {Object}={} オプション
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
- 戻り値 {Object[]} 以下のメンバを持つオブジェクトの配列
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

