# <a name="d488ebac-6d7f-49c8-ae6b-04cb35508546">SpreadDb</a> rev.1.1.0

- [SpreadDb](#d488ebac-6d7f-49c8-ae6b-04cb35508546) rev.1.1.0
  - [概要](#726e2e5a-6be6-df18-acfa-3f73f91ef7f1)
  - [メンバ](#1afe004e-f22b-569f-1bc6-d2930948e979)
  - [引数](#52628041-f45a-f621-6883-3088a580542b)
  - [戻り値](#f2453d3b-59c3-5008-8f6b-b0e45ef23594)
  - [内部関数 - 非command系](#252d1755-0fdc-aa53-bbda-f5dcf05deaef)
    - [constructor](#09870987-01ad-48b3-810c-f2d292f2fb5b)() : メンバの初期値設定、更新履歴の準備
      - [引数](#1f04d940-6884-819a-956c-921763e531ea)
      - [戻り値](#0e2570f7-932c-f77e-5a74-4e6f3284e349)
    - [genTable](#5549d99d-f8fd-a54a-0617-f96160ce4d28)() : sdbTableオブジェクトを生成
    - [genSchema](#805f567f-0df3-063f-abb7-32ae4f274b30)() : sdbSchemaオブジェクトを生成
    - [genColumn](#d4bbd901-20cd-8a9d-fc95-a8ac9ae41163)() : sdbColumnオブジェクトを生成
    - [genLog](#400007bb-07a5-47f4-0757-4302270834ca)() : sdbLogオブジェクトを生成
    - [convertRow](#9a995d12-3590-3102-84f6-426abe9b6e88)() : シートイメージと行オブジェクトの相互変換
    - [functionalize](#5fc49311-21b1-e6db-2a73-f56d54cf80c5)() :  where句のオブジェクト・文字列を関数化
  - [内部関数 - command系](#f8072377-142a-714b-bed3-5242d99bf8a4)
    - [createTable](#fe8db1fd-ecac-e11b-bbc0-e0380cab2895)() : データから新規テーブルを生成
    - [selectRow](#23baa473-c62c-c42a-b072-c9fad50c888b)() : テーブルから条件に合致する行を抽出
    - [updateRow](#fda2d5d4-b66e-1ae8-52a9-6a971bb88c9d)() : テーブルを更新
    - [appendRow](#9ecd8e07-bc7b-a5da-63bc-5a01d2803a37)() : テーブルに新規行を追加
    - [deleteRow](#bacd444b-ae87-6170-0ed5-c7861db25648)() : テーブルから条件に合致する行を削除
    - [getSchema](#dd3826fa-6096-30aa-2836-59b34bb6d7bc)() : 指定されたテーブルの構造情報を取得
  - [注意事項](#e298081f-47f9-7918-58d1-f572d1ef5859)
  - [typedefs](#4b6d1866-70ca-43a0-88ef-b64656d0a153)
    - [sdbTable](#4633fb93-038b-44db-b927-a0f5815265de)
    - [sdbSchema](#e83945a7-e3e0-440f-b293-6de0c27aa556)
    - [sdbColumn](#e23eb4c4-ab0d-4776-8038-775f6b018fc6)
    - [sdbLog](#c8640a48-efb0-4999-8b78-e10dd39f16fc)

## <a name="726e2e5a-6be6-df18-acfa-3f73f91ef7f1">概要</a>

1. スプレッドシートを凍結
1. queryで渡された操作要求を順次処理
1. 権限確認後、command系内部関数の呼び出し
1. スプレッドシートの凍結解除

## <a name="1afe004e-f22b-569f-1bc6-d2930948e979">メンバ</a>

- whois {string} 'SpreadDb'固定
- opt {Object} 起動時オプション。pv.opt.xxx として保存
  - userId {string}='guest' ユーザの識別子<br>指定する場合、必ずuserAuthも併せて指定
  - userAuth {Object.<string,string>}={} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式<br>r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可<br>o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。<br>また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可<br>read/writeは自分のみ可、delete/schemaは実行不可
  - log {string}='log' 更新履歴テーブル名<br>nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈
  - maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数
  - interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)
  - guestAuth {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
  - adminId {string}='Administrator' 管理者として扱うuserId<br>管理者は全てのシートの全権限を持つ
- spread {Spread} スプレッドシートオブジェクト
- table {Object.<string,[sdbTable](#4633fb93-038b-44db-b927-a0f5815265de)>} スプレッドシート上の各テーブル(領域)の情報
  - name {string} テーブル名(範囲名)
  - account {string} 更新者のアカウント(識別子)
  - sheet {[Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)} スプレッドシート内の操作対象シート(ex."master"シート)
  - schema {sdbSchema} シートの項目定義
      - cols {sdbColumn[]} 項目定義オブジェクトの配列
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
    - primaryKey {string}='id' 一意キー項目名
    - unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報<br>メンバ名はprimaryKey/uniqueの項目名
    - auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報<br>メンバ名はauto_incrementの項目名
      - start {number} 開始値
      - step {number} 増減値
      - current {number} 現在の最大(小)値<br>currentはsdbTableインスタンスで操作する。
    - defaultRow {Object|function} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
  - values {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
  - header {string[]} 項目名一覧(ヘッダ行)
  - notes {string[]} ヘッダ行のメモ
  - colnum {number} データ領域の列数
  - rownum {number} データ領域の行数(ヘッダ行は含まず)
- log {[sdbLog](#c8640a48-efb0-4999-8b78-e10dd39f16fc)[]}=[] 更新履歴シートオブジェクト
  - [01A] id {UUID}=Utilities.getUuid() 一意キー項目
  - [02B] timestamp {string}=toLocale(new Date()) 更新日時
  - [03C] account {string|number} uuid等、更新者の識別子
  - [04D] range {string} 更新対象テーブル名
  - [05E] action {string} 操作内容。command系内部関数名のいずれか
  - [06F] argument {string} 操作関数に渡された引数
  - [07G] isErr {boolean} true:追加・更新が失敗
  - [08H] message {string} エラーメッセージ
  - [09I] before {JSON} 更新前の行データオブジェクト(JSON)
  - [10J] after {JSON} 更新後の行データオブジェクト(JSON)<br>selectの場合はここに格納
  - [11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式

## <a name="52628041-f45a-f621-6883-3088a580542b">引数</a>

- query {Object[]} 操作要求の内容<br>以下、行頭の「crudas」はコマンドの種類により必要となるパラメータ。'r'はselect(read)
  - table {string|string[]} 操作対象テーブル名<br>全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列
  - command {string} 操作名<br>全commandで使用。create/select/update/delete/append/schema
  - [cols] {[sdbColumn](#e23eb4c4-ab0d-4776-8038-775f6b018fc6)[]} - 新規作成シートの項目定義オブジェクトの配列<br>command='create'のみで使用
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
  - [values] {Object[]|Array[]} - 新規作成シートに書き込む初期値<br>command='create'のみで使用
  - [where] {Object|Function|string} 対象レコードの判定条件<br>command='select','update','delete'で使用<br>
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
  - [record] {Object|Function} 追加・更新する値<br>command='update','append'で使用<br>
      <!--
    record {Object|string|Function} 更新する値
    -->
    【record句の指定方法】
    - Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
    - string ⇒ 上記Objectに変換可能なJSON文字列
    - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
      【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
- opt {Object}={} オプション
  - userId {string}='guest' ユーザの識別子<br>指定する場合、必ずuserAuthも併せて指定
  - userAuth {Object.<string,string>}={} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式<br>r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可<br>o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。<br>また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可<br>read/writeは自分のみ可、delete/schemaは実行不可
  - log {string}='log' 更新履歴テーブル名<br>nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈
  - maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数
  - interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)
  - guestAuth {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
  - adminId {string}='Administrator' 管理者として扱うuserId<br>管理者は全てのシートの全権限を持つ

## <a name="f2453d3b-59c3-5008-8f6b-b0e45ef23594">戻り値</a>

rv {Object[]} 以下のメンバを持つオブジェクトの配列

- query {Object} 引数として渡されたqueryのコピー
- isErr {boolean}=false 正常終了ならfalse<br>一つのqueryで複数の処理を指示した場合(ex.複数レコードの追加)、いずれか一つでもエラーになればisErrはtrueとなる。
- message {string} エラーメッセージ。isErr==trueの場合のみ。
- row {Object[]}=null selectの該当行オブジェクトの配列。該当無しの場合、row.length===0
- schema {Object.<string,sdbColumn[]>} schemaで取得した{テーブル名：項目定義オブジェクトの配列}形式のオブジェクト
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
- log {sdbLog[]} 更新履歴。update,deleteで該当無しの場合、log.length===0
  - [01A] id {UUID}=Utilities.getUuid() 一意キー項目
  - [02B] timestamp {string}=toLocale(new Date()) 更新日時
  - [03C] account {string|number} uuid等、更新者の識別子
  - [04D] range {string} 更新対象テーブル名
  - [05E] action {string} 操作内容。command系内部関数名のいずれか
  - [06F] argument {string} 操作関数に渡された引数
  - [07G] isErr {boolean} true:追加・更新が失敗
  - [08H] message {string} エラーメッセージ
  - [09I] before {JSON} 更新前の行データオブジェクト(JSON)
  - [10J] after {JSON} 更新後の行データオブジェクト(JSON)<br>selectの場合はここに格納
  - [11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式

## <a name="252d1755-0fdc-aa53-bbda-f5dcf05deaef">内部関数 - 非command系</a>

### <a name="09870987-01ad-48b3-810c-f2d292f2fb5b">constructor</a>() : メンバの初期値設定、更新履歴の準備

メンバの初期値設定および「更新履歴」シートの準備を行う

#### <a name="1f04d940-6884-819a-956c-921763e531ea">引数</a>

- query {Object} 操作要求の内容
  - table {string|string[]} 操作対象テーブル名<br>全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列
  - command {string} 操作名<br>全commandで使用。create/select/update/delete/append/schema
  - [cols] {[sdbColumn](#e23eb4c4-ab0d-4776-8038-775f6b018fc6)[]} - 新規作成シートの項目定義オブジェクトの配列<br>command='create'のみで使用
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
  - [values] {Object[]|Array[]} - 新規作成シートに書き込む初期値<br>command='create'のみで使用
  - [where] {Object|Function|string} 対象レコードの判定条件<br>command='select','update','delete'で使用<br>
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
  - [record] {Object|Function} 追加・更新する値<br>command='update','append'で使用<br>
      <!--
    record {Object|string|Function} 更新する値
    -->
    【record句の指定方法】
    - Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
    - string ⇒ 上記Objectに変換可能なJSON文字列
    - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
      【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
- opt {Object}={} オプション
  - userId {string}='guest' ユーザの識別子<br>指定する場合、必ずuserAuthも併せて指定
  - userAuth {Object.<string,string>}={} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式<br>r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可<br>o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。<br>また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可<br>read/writeは自分のみ可、delete/schemaは実行不可
  - log {string}='log' 更新履歴テーブル名<br>nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈
  - maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数
  - interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)
  - guestAuth {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
  - adminId {string}='Administrator' 管理者として扱うuserId<br>管理者は全てのシートの全権限を持つ

#### <a name="0e2570f7-932c-f77e-5a74-4e6f3284e349">戻り値</a>

{null|Error}

### <a name="5549d99d-f8fd-a54a-0617-f96160ce4d28">genTable</a>() : sdbTableオブジェクトを生成



### <a name="805f567f-0df3-063f-abb7-32ae4f274b30">genSchema</a>() : sdbSchemaオブジェクトを生成



### <a name="d4bbd901-20cd-8a9d-fc95-a8ac9ae41163">genColumn</a>() : sdbColumnオブジェクトを生成



### <a name="400007bb-07a5-47f4-0757-4302270834ca">genLog</a>() : sdbLogオブジェクトを生成



### <a name="9a995d12-3590-3102-84f6-426abe9b6e88">convertRow</a>() : シートイメージと行オブジェクトの相互変換



### <a name="5fc49311-21b1-e6db-2a73-f56d54cf80c5">functionalize</a>() :  where句のオブジェクト・文字列を関数化




## <a name="f8072377-142a-714b-bed3-5242d99bf8a4">内部関数 - command系</a>

### <a name="fe8db1fd-ecac-e11b-bbc0-e0380cab2895">createTable</a>() : データから新規テーブルを生成

管理者のみ実行可

### <a name="23baa473-c62c-c42a-b072-c9fad50c888b">selectRow</a>() : テーブルから条件に合致する行を抽出



### <a name="fda2d5d4-b66e-1ae8-52a9-6a971bb88c9d">updateRow</a>() : テーブルを更新



### <a name="9ecd8e07-bc7b-a5da-63bc-5a01d2803a37">appendRow</a>() : テーブルに新規行を追加



### <a name="bacd444b-ae87-6170-0ed5-c7861db25648">deleteRow</a>() : テーブルから条件に合致する行を削除



### <a name="dd3826fa-6096-30aa-2836-59b34bb6d7bc">getSchema</a>() : 指定されたテーブルの構造情報を取得




## <a name="e298081f-47f9-7918-58d1-f572d1ef5859">注意事項</a>

1. 関数での抽出条件・値の指定時の制約

   default(sdbColumn), where, record(update他)では関数での指定を可能にしている。
   これらをセル・メモで保存する場合、文字列に変換する必要があるが、以下のルールで対応する。

   - 引数は行オブジェクトのみ(引数は必ず一つ)
   - 関数に復元する場合`new Function('o',[ロジック部分文字列])で関数化
     - 必ず"{〜}"で囲み、return文を付ける

1. 権限によるアクセス制限(rwdos)
   r:read, w:write, d:delete, o:own, s:schema + c:createの略。コマンド毎に以下の権限が必要になる。

   - create(c): テーブル生成。管理者のみ実行可
   - select(r): 参照
   - update(rw): 更新
   - append(w): 追加
   - delete(d): 削除
   - schema(s): テーブル管理情報の取得

   特殊権限'o' : イベント申込情報等、本人以外の参照・更新を抑止するためのアクセス権限。

   - `userAuth:{シート名:o}`が指定された場合、当該シートのprimaryKey=userIdとなっているレコードのみ'r','w'可と看做す。
   - 'o'指定が有るシートのアクセス権として'rwds'が指定されていても'o'のみ指定されたと看做す
   - 'o'指定でselect/updateする場合、where句は無視され自情報に対する処理要求と看做す
     ex. userId=2の人がuserId=1の人の氏名の更新を要求 ⇒ userId=2の氏名が更新される
     SpreadDb(
       {table:'camp2024',command:'update',where:1,record:{'申込者氏名':'テスト'}},
       {userId:2,userAuth:{camp2024:'o'}}
     ); // -> userId=2の氏名が「テスト」に

## <a name="4b6d1866-70ca-43a0-88ef-b64656d0a153">typedefs</a>

### <a name="4633fb93-038b-44db-b927-a0f5815265de">sdbTable</a>

- name {string} テーブル名(範囲名)
- account {string} 更新者のアカウント(識別子)
- sheet {[Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)} スプレッドシート内の操作対象シート(ex."master"シート)
- schema {sdbSchema} シートの項目定義
  - cols {sdbColumn[]} 項目定義オブジェクトの配列
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
  - primaryKey {string}='id' 一意キー項目名
  - unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報<br>メンバ名はprimaryKey/uniqueの項目名
  - auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報<br>メンバ名はauto_incrementの項目名
    - start {number} 開始値
    - step {number} 増減値
    - current {number} 現在の最大(小)値<br>currentはsdbTableインスタンスで操作する。
  - defaultRow {Object|function} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
- values {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
- header {string[]} 項目名一覧(ヘッダ行)
- notes {string[]} ヘッダ行のメモ
- colnum {number} データ領域の列数
- rownum {number} データ領域の行数(ヘッダ行は含まず)

### <a name="e83945a7-e3e0-440f-b293-6de0c27aa556">sdbSchema</a>

- cols {sdbColumn[]} 項目定義オブジェクトの配列
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
- primaryKey {string}='id' 一意キー項目名
- unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報<br>メンバ名はprimaryKey/uniqueの項目名
- auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報<br>メンバ名はauto_incrementの項目名
  - start {number} 開始値
  - step {number} 増減値
  - current {number} 現在の最大(小)値<br>currentはsdbTableインスタンスで操作する。
- defaultRow {Object|function} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ

### <a name="e23eb4c4-ab0d-4776-8038-775f6b018fc6">sdbColumn</a>

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

### <a name="c8640a48-efb0-4999-8b78-e10dd39f16fc">sdbLog</a>

- [01A] id {UUID}=Utilities.getUuid() 一意キー項目
- [02B] timestamp {string}=toLocale(new Date()) 更新日時
- [03C] account {string|number} uuid等、更新者の識別子
- [04D] range {string} 更新対象テーブル名
- [05E] action {string} 操作内容。command系内部関数名のいずれか
- [06F] argument {string} 操作関数に渡された引数
- [07G] isErr {boolean} true:追加・更新が失敗
- [08H] message {string} エラーメッセージ
- [09I] before {JSON} 更新前の行データオブジェクト(JSON)
- [10J] after {JSON} 更新後の行データオブジェクト(JSON)<br>selectの場合はここに格納
- [11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式


