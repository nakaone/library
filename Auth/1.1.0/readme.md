===== [fatal] hrefs only: リンク有るのにアンカー未定義の項目
f76eb797d345: 戻り値
a4a26014ccb3: sdbOption
dab8cfcec9d8: sdbLog
1e80990a7c63: sdbQuery
d2f620e47c51: sdbResult

# Auth 1.1.0

## 概要

### おおまかな流れ

![](doc/summary.svg)

### 処理要求の流れ

![](doc/query.svg)

### 新規登録の流れ

![](doc/registration.svg)

## authClient

classとするとグローバルに呼び出すのが困難になるため、クロージャとする。

### cv - authClientのメンバ(client variables)

- query {authQuery} 処理要求<br>
	起動時は引数"query"のコピー、以降は各メソッドにより情報を付加
- opt {Object} authClientのオプション設定<br>
	起動時引数"[option](#6e19dabbd5cc)"に、引数での未定義項目に既定値を設定した物
- userId {string} ユーザ識別子<br>
	ゲストの場合はundefined
- email {string} ユーザの連絡先メールアドレス
- CSkey {Object} クライアント側秘密鍵
- CPkey {string} クライアント側公開鍵
- SPkey {string} サーバ側公開鍵

### 主処理(main)

- 引数
	- query {Object} [authQuery](#accf9448cecc)の内、「■」で示された以下メンバ
		- ■table {string} 操作対象テーブル名
		- ■command {string} 操作名<br>
			commandの種類は下表の通り。
			"rwdos"とは"Read/Write/Delete/Own/Schema"の頭文字。管理者のみ実行可能な"c"(createTable)と特殊権限"o"を加えてシート毎のアクセス制御を行う。
			
			内容 | command | rwdos
			:-- | :-- | :-- 
			テーブル生成 | create | c
			参照 | select | r
			更新 | update | rw
			追加 | append/insert | w
			テーブル管理情報取得 | schema | s
		- ■[where] {Object|Function|string} 対象レコードの判定条件<br>
			command='select','update','delete'で使用
			
			- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
			- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
			- string
			  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。
			  - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
			- その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値
		- ■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値<br>
			command='update','append'で使用
			
			- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
			- string ⇒ 上記Objectに変換可能なJSON文字列
			- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
			  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
	- <a name="6e19dabbd5cc">option {Object} [authClient/Server共通オプション</a>に以下のメンバを加えた物](#3c211d58f127)
		- saveLocalStorage {Object} localStorageに保存するか否か
			- userId {boolean}=true
			- email {boolean}=false
		- crond {[cron](#53d27b6201fa)[]} 起動する定期実行ジョブ
- 戻り値 {[authQuery](#accf9448cecc)}

### dialog() : email/パスコード入力ダイアログの表示・入力

### request() : authServerに要求を送信

### createTable() : authServer(SpreadDb.getSchema)の[戻り値](#f76eb797d345)を基にローカルDBにテーブルを作成

### syncDb() : authServerの更新結果をローカル側DBに反映

## authServer

単一機能の提供のため、クロージャとする。

### sv - authServerのメンバ(server variables)

server variables
- query {authQuery} 処理要求<br>
	起動時は引数"query"のコピー、以降は各メソッドにより情報を付加
- opt {Object} authClientのオプション設定<br>
	起動時引数"[option](#83ede73058e8)"に、引数での未定義項目に既定値を設定した物
- SPkey {string} サーバ側公開鍵
- SSkey {Object} サーバ側秘密鍵<br>
	DocumentProperties.SSkeyを`RSAKey.parse(DP.SSkey)`で復元した物
- account {Object} accountsシートから抽出したユーザ情報(行オブジェクト)
- device {Object} devicesシートから抽出したユーザ情報(行オブジェクト)

### 主処理(main)

- 引数
	- query {Object} [authQuery](#accf9448cecc)の内、「■」または「□」で示された以下メンバ<br>
		ユーザ側にCS/SPkeyが有った場合、暗号化＋署名
		- ■table {string} 操作対象テーブル名
		- ■command {string} 操作名<br>
			commandの種類は下表の通り。
			"rwdos"とは"Read/Write/Delete/Own/Schema"の頭文字。管理者のみ実行可能な"c"(createTable)と特殊権限"o"を加えてシート毎のアクセス制御を行う。
			
			内容 | command | rwdos
			:-- | :-- | :-- 
			テーブル生成 | create | c
			参照 | select | r
			更新 | update | rw
			追加 | append/insert | w
			テーブル管理情報取得 | schema | s
		- ■[where] {Object|Function|string} 対象レコードの判定条件<br>
			command='select','update','delete'で使用
			
			- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
			- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
			- string
			  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。
			  - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
			- その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値
		- ■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値<br>
			command='update','append'で使用
			
			- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
			- string ⇒ 上記Objectに変換可能なJSON文字列
			- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
			  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
		- □timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)
		- □userId {string|number}="guest" ユーザ識別子(uuid等)
		- □queryId {string}=UUID クエリ・結果突合用文字列
		- □[email] {string} ユーザのメールアドレス
		- □[CPkey] {string} ユーザの公開鍵
		- □[passcode] {number|string} 入力されたパスコード<br>
			開発時はauthClient/authServerへの引数として扱う(∵自動テスト用)。リリース時には引数として与えるのは不可とする
			
			- authClientへの引数：ダイアログから入力されたパスコードの代替。配列可
			- authServerへの引数：乱数で発生させるパスコードの代替
	- <a name="83ede73058e8">option {Object} [authClient/Server共通オプション</a>に以下のメンバを加えた物](#3c211d58f127)
		- DocPropName {string}="authServer" DocumentPropertiesの項目名
		- sdbOption {[sdbOption](#a4a26014ccb3)} SpreadDbのオプション
		- accountsTableName {string}='accounts' [アカウント管理シート](#2f8a77eb6f10)の名前
		- devicesTableName {string}='devices' [デバイス管理シート](#ae550a40dc50)の名前
		- guestAccount {[accounts](#2f8a77eb6f10)}={} ゲストのアカウント管理設定<br>
			既定値はアカウント管理シートの既定値を流用
		- guestDevice {[devices](#ae550a40dc50)}={} ゲストのデバイス管理設定<br>
			既定値はデバイス管理シートの既定値を流用
		- newAccount {[accounts](#2f8a77eb6f10)}={} 新規登録者のアカウント管理設定<br>
			既定値はアカウント管理シートの既定値を流用
		- newDevice {[devices](#ae550a40dc50)}={} 新規登録者のデバイス管理設定<br>
			既定値はデバイス管理シートの既定値を流用
		- validitySpan {number}=1,209,600,000(2週間) アカウントの有効期間
- 戻り値 {[authQuery](#accf9448cecc)}

### registUser() : ユーザ管理情報を生成、シートに追加

## DocumentProperties

プロパティ名はauthServer.option.DocPropNameで指定

### SPkey {string} サーバ側公開鍵

### SSkey {string} サーバ側秘密鍵

復元は`RSAKey.parse(v.r.sKey)`で行う

## 使用シートおよび項目定義

### <a name="2f8a77eb6f10">accounts - アカウント管理シートの項目</a>

- userId {string|number}='guest' ユーザ識別子(primaryKey)<br>
	default:101(0〜100はシステム用に留保), primaryKey
- note {string}='' アカウント情報(備考)
- validityStart {string}=Date.now() 有効期間開始日時(ISO8601文字列)
- validityEnd {string}=validityStart+opt.validitySpan 有効期間終了日時(ISO8601文字列)
- authority {JSON} シート毎のアクセス権限。<code>{シート名:rwdos文字列}</code> 形式<br>
	既定値はアカウント管理シート・デバイス管理シートの自レコードのみ参照・更新可
- created {string}=Date.now() ユーザ登録日時(ISO8601拡張形式)
- updated {string}=Date.now() 最終更新日時(ISO8601拡張形式)
- deleted {string}='' 論理削除日時

### <a name="ae550a40dc50">devices - デバイス管理シートの項目</a>

複数デバイスでの単一アカウントの使用を可能にするため「account.userId(1) : device.userId(n)」で作成
- userId {string|number}='guest' ユーザ識別子<br>
	not null
- email {string}=opt.adminMail ユーザのメールアドレス(unique)<br>
	primaryKey
- name {string}='ゲスト' ユーザの氏名
- phone {string}=''ユーザの電話番号
- address {string}='' ユーザの住所
- note {string}='' ユーザ情報(備考)
- CPkey {string}='' クライアント側公開鍵
- CPkeyExpiry {string}='' CPkey有効期限<br>
	期限内に適切な暗号化・署名された要求はOKとする
- created {string}=Date.now() ユーザ登録日時(ISO8601拡張形式)
- updated {string}=Date.now() 最終更新日時(ISO8601拡張形式)
- deleted {string}='' 論理削除日時

### log - SpreadDbのアクセスログシート

詳細はSpreadDb.[sdbLog](#dab8cfcec9d8)参照

## typedefs

### <a name="accf9448cecc">authQuery {Object[]} 操作要求の内容</a>

- ■：authClientへの引数、□：authServerへの引数(authClientでの追加項目)、〇：authServerでの追加項目
- SpreadDbの[sdbQuery](#1e80990a7c63)からの差分項目
  - 削除項目：cols, arg
  - 追加項目：email, CPkey, passcode, SPkey, status
- command="delete"(物理削除)は使用不可とし、論理削除で対応<br>(万一のハッキング時のリスク軽減)
- ■table {string} 操作対象テーブル名
- ■command {string} 操作名<br>
	commandの種類は下表の通り。
	"rwdos"とは"Read/Write/Delete/Own/Schema"の頭文字。管理者のみ実行可能な"c"(createTable)と特殊権限"o"を加えてシート毎のアクセス制御を行う。
	
	内容 | command | rwdos
	:-- | :-- | :-- 
	テーブル生成 | create | c
	参照 | select | r
	更新 | update | rw
	追加 | append/insert | w
	テーブル管理情報取得 | schema | s
- ■[where] {Object|Function|string} 対象レコードの判定条件<br>
	command='select','update','delete'で使用
	
	- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
	- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
	- string
	  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。
	  - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
	- その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値
- ■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値<br>
	command='update','append'で使用
	
	- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
	- string ⇒ 上記Objectに変換可能なJSON文字列
	- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
	  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
- □timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)
- □userId {string|number}="guest" ユーザ識別子(uuid等)
- □queryId {string}=UUID クエリ・結果突合用文字列
- □[email] {string} ユーザのメールアドレス
- □[CPkey] {string} ユーザの公開鍵
- □[passcode] {number|string} 入力されたパスコード<br>
	開発時はauthClient/authServerへの引数として扱う(∵自動テスト用)。リリース時には引数として与えるのは不可とする
	
	- authClientへの引数：ダイアログから入力されたパスコードの代替。配列可
	- authServerへの引数：乱数で発生させるパスコードの代替
- 〇SPkey {string} サーバ側公開鍵
- 〇qSts {string} クエリ単位の実行結果<br>
	正常終了なら"OK"。エラーコードは以下の通り。
	- create : "Already Exist", "No Cols and Data"
	- その他 : "No Table"
- 〇num {number} 変更された行数<br>
	append:追加行数、update:変更行数、select:抽出行数、schema:0(固定)
- 〇result {[sdbResult](#d2f620e47c51)[]} レコード単位の実行結果
- 〇status {string} authServerの実行結果<br>
	必要に応じてauthClientで追加変更

### authTrial {Object} ログイン試行関連情報

- passcode {number} 設定されたパスコード
- datetime {string} パスコード通知メール送信日時<br>
	パスコード要求(client)>要求受領(server)>パスコード生成>通知メール送信の内、メール送信日時
- log {Object[]} 試行履歴情報
	- dt {string} パスコード検証日時(Date Time)
	- pc {number} ユーザが入力したパスコード(PassCode)
	- st {number} ステータス(STatus)
- thawing {string}='1970/01/01' 凍結解除日時

### <a name="3c211d58f127">commonOption {Object} authClient/authServer共通オプション</a>

以下は共通性維持のため、authClient/authServer起動時オプションでの変更は不可とする。<br>変更が必要な場合、build前のソースで変更する。
- tokenExpiry {number}=600,000(10分) トークンの有効期間(ミリ秒)
- passcodeDigit {number}=6  パスコードの桁数
- passcodeExpiry {number}=600,000(10分) パスコードの有効期間(ミリ秒)<br>
	メール送信〜受領〜パスコード入力〜送信〜確認処理終了までの時間。通信に係る時間も含む。不正防止のため、始点/終点ともサーバ側で時刻を設定する。
- maxTrial {number}=3 パスコード入力の最大試行回数
- validityExpiry {number}=86,400,000(1日) ログイン有効期間(ミリ秒)<br>
	有効期間を超えた場合は再ログインを必要とする
- maxDevices {number}=5 単一アカウントで使用可能なデバイスの最大数
- freezing {number}=3600000 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
- bits {number}=2048 RSA鍵ペアの鍵長
- adminMail {string} 管理者のメールアドレス
- adminName {string} 管理者名

### <a name="53d27b6201fa">cron {Object} 定期実行ジョブの引数</a>

crond.set(), crond.clear()共通
- name {string} ジョブを特定する名称
- func {function} ジョブ本体
- interval {number} 実行間隔(ミリ秒)

## その他

用語解説、注意事項、更新履歴、他

### 【参考】SpreadDbのエラーコード

| No | 設定項目 | コード | 発生箇所 | 原因 |
| --: | :-- | :-- | :-- | :-- |
| 1 | qSts | No Authority | doQuery | 指定されたテーブル操作の権限が無い |
| 2 | qSts | No command | doQuery | query.commandが無い、または文字列では無い |
| 3 | qSts | No Table name | doQuery | query.tableが無い、または文字列では無い |
| 4 | qSts | Invalid where clause | doQuery | (権限"o"で)where句の値がプリミティブ型ではない |
| 5 | qSts | No Table | doQuery<br>genTable | (create以外で)対象テーブルが無い |
| 6 | qSts | No cols and data | genTable | createで項目定義も初期データも無い |
| 7 | qSts | Already Exist | createTable | シートが既に存在している |
| 8 | qSts | Duplicate | createTable | 初期レコード内に重複が存在 |
| 9 | qSts | Empty set | createTable<br>appendRow | query.setが不在、または配列の長さが0 |
| 10 | qSts | Invalid set | appendRow | query.setが非配列なのに要素がオブジェクトではない |
| 11 | qSts | No set | appendRow<br>updateRow | queryにメンバ"set"が不在 |
| 12 | qSts | No where | deleteRow<br>updateRow | where句がqueryに無い |
| 13 | qSts | Undefined Column | updateRow | 更新対象項目がテーブルに無い |
| 14 | qSts | その他 | doQuery | エラーオブジェクトのmessage |
| 15 | rSts | Duplicate | appendRow<br>updateRow | unique項目に重複した値を入れようとした |
| 16 | Error | Invalid Argument | functionalyze | 不適切な引数 |
| 17 | Error | Could not Lock | main | 規定回数以上シートのロックに失敗した |

### 更新履歴
