# typedef

## authClient

### ストレージ

- localStorage
  - userId {string|number}=null ユーザ識別子。nullはゲスト
- sessionStorage
  - CSkey {string} クライアント側秘密鍵
  - CPkey {string} クライアント側公開鍵
  - SPkey {string} サーバ側公開鍵

### 引数

- arg {Object}
  - userId {string|number}=null ユーザ識別子。nullはゲスト
  - query {Object}
    - table {string} 操作対象テーブル名。全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列
    - command {string} 操作名。全commandで使用。update/delete/append
    - where {Object|Function|string} 対象レコードの判定条件。command='select','update','delete'で使用
    - record {Object|Function} 追加・更新する値。command='update','append'で使用

戻り値は`null|Error`


## authServer

### 「ユーザ管理」シート

- userId {string|number} ユーザ識別子(primaryKey)。default:UUID, primaryKey
- email {string} ユーザのメールアドレス(unique)
- name {string} ユーザの氏名
- phone {string} ユーザの電話番号
- address {string} ユーザの住所
- note {string} その他ユーザ情報(備考)
- validityStart {string} 有効期間開始日時(ISO8601文字列)
- validityEnd {string} 有効期間終了日時(ISO8601文字列)
- CPkey {string} クライアント側公開鍵
- CPkeyExpiry {string} CPkey有効期限。期限内に適切な暗号化・署名された要求はOKとする
- authority {JSON} シート毎のアクセス権限。{シート名:rwdos文字列} 形式
- trial {JSON} ログイン試行関連情報。default:''。ログイン成功時にクリア
  - passcode {number} 設定されたパスコード
  - datetime {string} パスコード通知メール送信日時<br>パスコード要求(client)>要求受領(server)>パスコード生成>通知メール送信の内、メール送信日時
  - log {Object[]} 試行履歴情報
    - dt {string} パスコード検証日時
    - pc {number} ユーザが入力したパスコード
    - cd {number} エラーコード
  - thawing {string} 凍結解除日時。通常undefined、凍結時にメンバ追加
- created {string} ユーザ登録日時
- updated {string} 最終更新日時
- deleted {string} 論理削除日時

### 引数

- arg {Object}
  - [userId] {string|number} ユーザ識別子
  - [email] {string} ユーザのメールアドレス。userId, email両方指定されていない場合、ゲストと看做す
  - [token] {string} 発信時刻(UNIX時刻)を暗号化・署名した文字列。発信後tokenExpiryを超えたものは無効
  - [CPkey] {string} ユーザの公開鍵
  - query {Object|Object[]}
    - table {string} 操作対象テーブル名。全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列
    - command {string} 操作名。全commandで使用。update/delete/append
    - where {Object|Function|string} 対象レコードの判定条件。command='select','update','delete'で使用
    - record {Object|Function} 追加・更新する値。command='update','append'で使用
  - [passcode] {number} 入力されたパスコード
- opt {Object} ※pv.optとして参照可
  - DocPropKey {string}='authServer' DocumentPropertiesのプロパティ名
  - accountTableName {string}='ユーザ管理' 「ユーザ管理」シートの名前
  - tokenExpiry {number}=10分 トークンの有効期間
  - validityPeriod {number}=1日 ログイン有効期間。有効期間を超えた場合は再ログインを必要とする
  - graceTime {number}=10分 メール送信〜パスコード確認処理終了までの猶予時間(ミリ秒)
  - passcodeValidityPeriod {number}=600000(10分) パスコードの有効期間。ミリ秒。<br>メール送信〜受領〜パスコード入力〜送信〜確認処理終了までの時間。通信に係る時間も含む。不正防止のため、始点/終点ともサーバ側で時刻を設定する。
  - maxTrial {number}=3 パスコード入力の最大試行回数
  - passcodeDigit {number}=6  パスコードの桁数
  - freezing {number}=3600000 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
  - bits {number}=1024 鍵長
  - guest {UserStatus}={userId:'guest'} ゲストの権限設定
  - newcomer {UserStatus}={} 新規ユーザの権限設定

### 戻り値

- status {string} 処理結果。No Mail, Invalid SPkey, Send PC, Retry, etc.
- [response] {Object[]} 要求に対する処理結果(=SpreadDb戻り値)。Errまたはretryの場合、undefined
  - query {Object} 引数として渡されたqueryのコピー
  - isErr {boolean}=false 正常終了ならfalse。一つのqueryで複数の処理を指示した場合(ex.複数レコードの追加)、いずれか一つでもエラーになればisErrはtrueとなる。
  - message {string} エラーメッセージ。isErr==trueの場合のみ。
  - row {Object[]}=null selectの該当行オブジェクトの配列。該当無しの場合、row.length===0
  - schema {Object.<string,sdbColumn[]>} schemaで取得した{テーブル名：項目定義オブジェクトの配列}形式のオブジェクト
  - log {sdbLog[]} 更新履歴。SpreadDbの更新履歴シートの行オブジェクトの配列
    - [01A] id {UUID}=Utilities.getUuid() 一意キー項目
    - [02B] timestamp {string}=toLocale(new Date()) 更新日時
    - [03C] account {string|number} uuid等、更新者の識別子
    - [04D] range {string} 更新対象テーブル名
    - [05E] action {string} 操作内容。command系内部関数名のいずれか
    - [06F] argument {string} 操作関数に渡された引数
    - [07G] isErr {boolean} true:追加・更新が失敗
    - [08H] message {string} エラーメッセージ
    - [09I] before {JSON} 更新前の行データオブジェクト(JSON)
    - [10J] after {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
    - [11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
- [userId] {string|number} 引数にuserIdが無く、status=retryの時にシートから引用
- [SPkey] {string} サーバ側公開鍵。status=retryの時に設定

<!--
```
  SpreadDbTest append.1.1 end
===== argument
[[{"table":"AutoInc","command":"append","record":{"ラベル":"a01"}},{"table":"AutoInc","command":"append","record":{"ラベル":"a02"}},{"table":"AutoInc","command":"append","record":[{"ラベル":"a03"},{"ラベル":"a04"}]}],{"guestAuth":{"AutoInc":"w"}}]

===== return value type: Array
{
  "command": "append",
  "isErr": "false(Boolean)",
  "message": "(String)",
  "log": [
    {
      "arg": "[{\"ラベル\":\"a01\"}]",
      "isErr": false,
      "message": "null"
    }
  ],
  "logLen": 1
}
{
  "command": "append",
  "isErr": "false(Boolean)",
  "message": "(String)",
  "log": [
    {
      "arg": "[{\"ラベル\":\"a02\"}]",
      "isErr": false,
      "message": "null"
    }
  ],
  "logLen": 1
}
{
  "command": "append",
  "isErr": "false(Boolean)",
  "message": "(String)",
  "log": [
    {
      "arg": "[{\"ラベル\":\"a03\"},{\"ラベル\":\"a04\"}]",
      "isErr": false,
      "message": "null"
    },
    {
      "arg": "[{\"ラベル\":\"a03\",\"pKey\":14,\"真\":5,\"配列①\":24,\"配列②\":26,\"obj\":60,\"def関数\":\"2025-01-01T13:39:47.998+09:00\"},{\"ラベル\":\"a04\"}]",
      "isErr": false,
      "message": "null"
    }
  ],
  "logLen": 2
}
```
-->
