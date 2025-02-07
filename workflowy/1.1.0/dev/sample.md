{"id":"X000000","children":["X000001","d4369fcf4044","X000329","X000338","X000347","X000399","X000758","X000918","X000957","X000997"],"depth":1,"text":"GitHub Library","link":[],"note":"","href":[],"parent":null}
{"id":"X000001","children":["X000002","X000006","X000049","X000098","X000101","X000123","X000170","X000173"],"depth":2,"text":"Auth 1.1.0","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000002","children":["X000003","X000004","X000005"],"depth":3,"text":"概要","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"X000003","children":[],"depth":4,"text":"おおまかな流れ","link":[],"note":"![](doc/summary.svg)","href":[],"parent":"X000002"}
{"id":"X000004","children":[],"depth":4,"text":"処理要求の流れ","link":[],"note":"![](doc/query.svg)","href":[],"parent":"X000002"}
{"id":"X000005","children":[],"depth":4,"text":"新規登録の流れ","link":[],"note":"![](doc/registration.svg)","href":[],"parent":"X000002"}
{"id":"X000006","children":["X000007","X000015","X000021","X000033","X000041","X000042","X000048"],"depth":3,"text":"authClient","link":[],"note":"classとするとグローバルに呼び出すのが困難になるため、クロージャとする。\n但しクエリ呼び出しの都度CPkey他の設定値の変更を回避するため、onLoad時に変数として保存、クエリ実行時にはrequestメソッドを呼び出す形で運用する。","href":[],"parent":"X000001"}
{"id":"X000007","children":["X000008","X000009","X000010","X000011","X000012","X000013","X000014"],"depth":4,"text":"cv - authClientのメンバ(client variables)","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000008","children":[],"depth":5,"text":"opt {Object} authClientのオプション設定","link":[],"note":"mirrorを除く起動時引数\"[option](#6e19dabbd5cc)\"に、引数での未定義項目に既定値を設定した物","href":["6e19dabbd5cc"],"parent":"X000007"}
{"id":"X000009","children":[],"depth":5,"text":"userId {string} ユーザ識別子","link":[],"note":"ゲストの場合はundefined","href":[],"parent":"X000007"}
{"id":"X000010","children":[],"depth":5,"text":"email {string} ユーザの連絡先メールアドレス","link":[],"note":"","href":[],"parent":"X000007"}
{"id":"X000011","children":[],"depth":5,"text":"CSkey {Object} クライアント側秘密鍵","link":[],"note":"","href":[],"parent":"X000007"}
{"id":"X000012","children":[],"depth":5,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"","href":[],"parent":"X000007"}
{"id":"X000013","children":[],"depth":5,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000007"}
{"id":"X000014","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/e6693b2cc4bd\">mirror</a> {mirrorDef[]} ローカル側にミラーを保持するテーブルの定義","link":[["<a href=\"https://workflowy.com/#/e6693b2cc4bd\">mirror</a>","e6693b2cc4bd","mirror"]],"note":"","href":[],"parent":"X000007"}
{"id":"X000015","children":["X000016","X000020"],"depth":4,"text":"main: authClient主処理","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000016","children":["6e19dabbd5cc",[]],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000015"}
{"id":"6e19dabbd5cc","children":["X000017","X000018","X000019",[]],"depth":6,"text":"option {Object} <a href=\"https://workflowy.com/#/3c211d58f127\">authClient/Server共通オプション</a>に以下のメンバを加えた物","link":[["<a href=\"https://workflowy.com/#/3c211d58f127\">authClient/Server共通オプション</a>","3c211d58f127","authClient/Server共通オプション"]],"note":"","href":[],"parent":"X000016"}
{"id":"X000017","children":[],"depth":7,"text":"saveUserId {boolean}=true userIdをlocalStorageに保存するか否か","link":[],"note":"","href":[],"parent":"6e19dabbd5cc"}
{"id":"X000018","children":[],"depth":7,"text":"saveEmail {boolean}=false e-mailをlocalStorageに保存するか否か","link":[],"note":"","href":[],"parent":"6e19dabbd5cc"}
{"id":"X000019","children":[[]],"depth":7,"text":"mirror {<a href=\"https://workflowy.com/#/53d27b6201fa\">mirrorDef</a>[]} ローカル側にミラーを保持するテーブルの定義","link":[["<a href=\"https://workflowy.com/#/53d27b6201fa\">mirrorDef</a>","53d27b6201fa","mirrorDef"]],"note":"","href":[],"parent":"6e19dabbd5cc"}
{"id":"X000020","children":[],"depth":5,"text":"戻り値 - authClientオブジェクト","link":[],"note":"","href":[],"parent":"X000015"}
{"id":"X000021","children":["X000022","X000031","X000032"],"depth":4,"text":"constructor() : メンバの値設定、クエリのプロトタイプ作成","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000022","children":["X000023","X000024","X000025","X000026","X000027","X000028","X000029","X000030"],"depth":5,"text":"処理概要","link":[],"note":"","href":[],"parent":"X000021"}
{"id":"X000023","children":[],"depth":6,"text":"引数の型チェック＋変換","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000024","children":[],"depth":6,"text":"メンバ(cv)に引数を保存、未指定分には既定値を設定","link":[],"note":"[authClient/authServer共通オプション](#3c211d58f127)は引数で上書きしない","href":["3c211d58f127"],"parent":"X000022"}
{"id":"X000025","children":[],"depth":6,"text":"URLクエリパラメータからuserId, e-mailの取得を試行、取得できたらメンバおよびlocalStorageに保存","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000026","children":[],"depth":6,"text":"localStorageからuserId, e-mailの取得を試行、取得できたらメンバに保存","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000027","children":[],"depth":6,"text":"クライアント側鍵ペア未生成なら生成、メンバに保存","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000028","children":[],"depth":6,"text":"要求(クエリ)のプロトタイプを作成","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000029","children":[],"depth":6,"text":"opt.crondが指定されていたらセット","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000030","children":[],"depth":6,"text":"opt.mirrorが指定されていたらauthServerにテーブル管理情報を要求、createTableメソッドでテーブルを作成","link":[],"note":"","href":[],"parent":"X000022"}
{"id":"X000031","children":[],"depth":5,"text":"引数 : <a href=\"https://workflowy.com/#/f96870e08d4a\">mainの引数</a>がそのまま渡される","link":[["<a href=\"https://workflowy.com/#/f96870e08d4a\">mainの引数</a>","f96870e08d4a","mainの引数"]],"note":"","href":[],"parent":"X000021"}
{"id":"X000032","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"X000021"}
{"id":"X000033","children":["X000034","X000040"],"depth":4,"text":"request() : authServerに要求を送信","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000034","children":["X000035"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000033"}
{"id":"X000035","children":["X000036","X000037","X000038","X000039"],"depth":6,"text":"query {Object|Object[]} <a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>の内、「■」で示された以下メンバ","link":[["<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>","accf9448cecc","authQuery"]],"note":"","href":[],"parent":"X000034"}
{"id":"X000036","children":[],"depth":7,"text":"■table {string} 操作対象テーブル名","link":[],"note":"","href":[],"parent":"X000035"}
{"id":"X000037","children":[],"depth":7,"text":"■command {string} 操作名","link":[],"note":"commandの種類は下表の通り。\n\"rwdos\"とは\"Read/Write/Delete/Own/Schema\"の頭文字。管理者のみ実行可能な\"c\"(createTable)と特殊権限\"o\"を加えてシート毎のアクセス制御を行う。\n\n内容 | command | rwdos\n:-- | :-- | :-- \nテーブル生成 | create | c\n参照 | select | r\n更新 | update | rw\n追加 | append/insert | w\nテーブル管理情報取得 | schema | s","href":[],"parent":"X000035"}
{"id":"X000038","children":[],"depth":7,"text":"■[where] {Object|Function|string} 対象レコードの判定条件","link":[],"note":"command='select','update','delete'で使用\n\n- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値\n- その他(Object,function,string以外) ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"X000035"}
{"id":"X000039","children":[],"depth":7,"text":"■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値","link":[],"note":"command='update','append'で使用\n\n- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}\n- string ⇒ 上記Objectに変換可能なJSON文字列\n- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数\n  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}","href":[],"parent":"X000035"}
{"id":"X000040","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>}","link":[["<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>","accf9448cecc","authQuery"]],"note":"","href":[],"parent":"X000033"}
{"id":"X000041","children":[],"depth":4,"text":"dialog() : email/パスコード入力ダイアログの表示・入力","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000042","children":["X000043","X000045"],"depth":4,"text":"syncTable() : authServer(SpreadDb.getSchema)の<a href=\"https://workflowy.com/#/f76eb797d345\">戻り値</a>を基にローカルDBにテーブルを作成、同期する","link":[["<a href=\"https://workflowy.com/#/f76eb797d345\">戻り値</a>","f76eb797d345","戻り値"]],"note":"","href":[],"parent":"X000006"}
{"id":"X000043","children":["X000044"],"depth":5,"text":"処理概要","link":[],"note":"","href":[],"parent":"X000042"}
{"id":"X000044","children":[],"depth":6,"text":"ローカルに指定テーブル","link":[],"note":"","href":[],"parent":"X000043"}
{"id":"X000045","children":["X000046"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000042"}
{"id":"X000046","children":["X000047"],"depth":6,"text":"arg {Object[]}","link":[],"note":"","href":[],"parent":"X000045"}
{"id":"X000047","children":[],"depth":7,"text":"","link":[],"note":"","href":[],"parent":"X000046"}
{"id":"X000048","children":[],"depth":4,"text":"syncDb() : authServerの更新結果をローカル側DBに反映","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000049","children":["X000050","X000059","X000082","X000090","X000091","X000097"],"depth":3,"text":"authServer","link":[],"note":"単一機能の提供のため、クロージャとする。","href":[],"parent":"X000001"}
{"id":"X000050","children":["X000051","X000052","X000053","X000054","X000055","X000056","X000057","X000058"],"depth":4,"text":"sv - authServerのメンバ(server variables)","link":[],"note":"server variables","href":[],"parent":"X000049"}
{"id":"X000051","children":[],"depth":5,"text":"query {authQuery} 処理要求","link":[],"note":"起動時は引数\"query\"のコピー、以降は各メソッドにより情報を付加","href":[],"parent":"X000050"}
{"id":"X000052","children":[],"depth":5,"text":"opt {Object} authClientのオプション設定","link":[],"note":"起動時引数\"[option</a>\"＋<a href=\"https://workflowy.com/#/3c211d58f127\">authClient/Server共通オプション](#83ede73058e8)。共通オプションは引数で上書きしない","href":["83ede73058e8"],"parent":"X000050"}
{"id":"X000053","children":[],"depth":5,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000050"}
{"id":"X000054","children":[],"depth":5,"text":"SSkey {Object} サーバ側秘密鍵","link":[],"note":"DocumentProperties.SSkeyを`RSAKey.parse(DP.SSkey)`で復元した物","href":[],"parent":"X000050"}
{"id":"X000055","children":[],"depth":5,"text":"account {Object} accountsシートから抽出したユーザ情報(行オブジェクト)","link":[],"note":"","href":[],"parent":"X000050"}
{"id":"X000056","children":[],"depth":5,"text":"device {Object} devicesシートから抽出したユーザ情報(行オブジェクト)","link":[],"note":"","href":[],"parent":"X000050"}
{"id":"X000057","children":[],"depth":5,"text":"typedefs {Object.&lt;string, <a href=\"https://workflowy.com/#/b9bea3e5ffc9\">sdbColumn</a>[]&gt;} オブジェクトの項目定義集","link":[["<a href=\"https://workflowy.com/#/b9bea3e5ffc9\">sdbColumn</a>","b9bea3e5ffc9","sdbColumn"]],"note":"","href":[],"parent":"X000050"}
{"id":"X000058","children":[],"depth":5,"text":"DocumentProperties {<a href=\"https://developers.google.com/apps-script/reference/properties/properties-service?hl=ja\">PropertiesService</a>} ドキュメントプロパティ本体","link":[],"note":"","href":[],"parent":"X000050"}
{"id":"X000059","children":["X000060","X000081"],"depth":4,"text":"main: authServer主処理","link":[],"note":"","href":[],"parent":"X000049"}
{"id":"X000060","children":["X000061","83ede73058e8",[]],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000059"}
{"id":"X000061","children":["X000062","X000063","X000064","X000065","X000066","X000067","X000068","X000069","X000070","X000071"],"depth":6,"text":"query {Object} <a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>の内、「■」または「□」で示された以下メンバ","link":[["<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>","accf9448cecc","authQuery"]],"note":"ユーザ側にCS/SPkeyが有った場合、暗号化＋署名","href":[],"parent":"X000060"}
{"id":"X000062","children":[],"depth":7,"text":"■table {string} 操作対象テーブル名","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000063","children":[],"depth":7,"text":"■command {string} 操作名","link":[],"note":"commandの種類は下表の通り。\n\"rwdos\"とは\"Read/Write/Delete/Own/Schema\"の頭文字。管理者のみ実行可能な\"c\"(createTable)と特殊権限\"o\"を加えてシート毎のアクセス制御を行う。\n\n内容 | command | rwdos\n:-- | :-- | :-- \nテーブル生成 | create | c\n参照 | select | r\n更新 | update | rw\n追加 | append/insert | w\nテーブル管理情報取得 | schema | s","href":[],"parent":"X000061"}
{"id":"X000064","children":[],"depth":7,"text":"■[where] {Object|Function|string} 対象レコードの判定条件","link":[],"note":"command='select','update','delete'で使用\n\n- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値\n- その他(Object,function,string以外) ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"X000061"}
{"id":"X000065","children":[],"depth":7,"text":"■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値","link":[],"note":"command='update','append'で使用\n\n- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}\n- string ⇒ 上記Objectに変換可能なJSON文字列\n- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数\n  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}","href":[],"parent":"X000061"}
{"id":"X000066","children":[],"depth":7,"text":"□timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000067","children":[],"depth":7,"text":"□userId {string|number}=\"guest\" ユーザ識別子(uuid等)","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000068","children":[],"depth":7,"text":"□queryId {string}=UUID クエリ・結果突合用文字列","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000069","children":[],"depth":7,"text":"□[email] {string} ユーザのメールアドレス","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000070","children":[],"depth":7,"text":"□[CPkey] {string} ユーザの公開鍵","link":[],"note":"","href":[],"parent":"X000061"}
{"id":"X000071","children":[],"depth":7,"text":"□[passcode] {number|string} 入力されたパスコード","link":[],"note":"開発時はauthClient/authServerへの引数として扱う(∵自動テスト用)。リリース時には引数として与えるのは不可とする\n\n- authClientへの引数：ダイアログから入力されたパスコードの代替。配列可\n- authServerへの引数：乱数で発生させるパスコードの代替","href":[],"parent":"X000061"}
{"id":"83ede73058e8","children":["X000072","X000073","X000074","X000075","X000076","X000077","X000078","X000079","X000080",[]],"depth":6,"text":"option {Object} <a href=\"https://workflowy.com/#/3c211d58f127\">authClient/Server共通オプション</a>に以下のメンバを加えた物","link":[["<a href=\"https://workflowy.com/#/3c211d58f127\">authClient/Server共通オプション</a>","3c211d58f127","authClient/Server共通オプション"]],"note":"","href":[],"parent":"X000060"}
{"id":"X000072","children":[],"depth":7,"text":"DocPropName {string}=\"authServer\" DocumentPropertiesの項目名","link":[],"note":"","href":[],"parent":"83ede73058e8"}
{"id":"X000073","children":[],"depth":7,"text":"sdbOption {<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>} SpreadDbのオプション","link":[["<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>","a4a26014ccb3","sdbOption"]],"note":"","href":[],"parent":"83ede73058e8"}
{"id":"X000074","children":[],"depth":7,"text":"accountsTableName {string}='accounts' <a href=\"https://workflowy.com/#/2f8a77eb6f10\">アカウント管理シート</a>の名前","link":[["<a href=\"https://workflowy.com/#/2f8a77eb6f10\">アカウント管理シート</a>","2f8a77eb6f10","アカウント管理シート"]],"note":"","href":[],"parent":"83ede73058e8"}
{"id":"X000075","children":[],"depth":7,"text":"devicesTableName {string}='devices' <a href=\"https://workflowy.com/#/ae550a40dc50\">デバイス管理シート</a>の名前","link":[["<a href=\"https://workflowy.com/#/ae550a40dc50\">デバイス管理シート</a>","ae550a40dc50","デバイス管理シート"]],"note":"","href":[],"parent":"83ede73058e8"}
{"id":"X000076","children":[],"depth":7,"text":"guestAccount {<a href=\"https://workflowy.com/#/2f8a77eb6f10\">accounts</a>}={} ゲストのアカウント管理設定","link":[["<a href=\"https://workflowy.com/#/2f8a77eb6f10\">accounts</a>","2f8a77eb6f10","accounts"]],"note":"既定値はアカウント管理シートの既定値を流用","href":[],"parent":"83ede73058e8"}
{"id":"X000077","children":[],"depth":7,"text":"guestDevice {<a href=\"https://workflowy.com/#/ae550a40dc50\">devices</a>}={} ゲストのデバイス管理設定","link":[["<a href=\"https://workflowy.com/#/ae550a40dc50\">devices</a>","ae550a40dc50","devices"]],"note":"既定値はデバイス管理シートの既定値を流用","href":[],"parent":"83ede73058e8"}
{"id":"X000078","children":[],"depth":7,"text":"newAccount {<a href=\"https://workflowy.com/#/2f8a77eb6f10\">accounts</a>}={} 新規登録者のアカウント管理設定","link":[["<a href=\"https://workflowy.com/#/2f8a77eb6f10\">accounts</a>","2f8a77eb6f10","accounts"]],"note":"既定値はアカウント管理シートの既定値を流用","href":[],"parent":"83ede73058e8"}
{"id":"X000079","children":[],"depth":7,"text":"newDevice {<a href=\"https://workflowy.com/#/ae550a40dc50\">devices</a>}={} 新規登録者のデバイス管理設定","link":[["<a href=\"https://workflowy.com/#/ae550a40dc50\">devices</a>","ae550a40dc50","devices"]],"note":"既定値はデバイス管理シートの既定値を流用","href":[],"parent":"83ede73058e8"}
{"id":"X000080","children":[],"depth":7,"text":"validitySpan {number}=1,209,600,000(2週間) アカウントの有効期間","link":[],"note":"","href":[],"parent":"83ede73058e8"}
{"id":"X000081","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>}","link":[["<a href=\"https://workflowy.com/#/accf9448cecc\">authQuery</a>","accf9448cecc","authQuery"]],"note":"","href":[],"parent":"X000059"}
{"id":"X000082","children":["X000083","X000088","X000089"],"depth":4,"text":"constructor() : メンバの値設定、accounts/devicesシートの準備","link":[],"note":"","href":[],"parent":"X000049"}
{"id":"X000083","children":["X000084","X000085","X000086","X000087"],"depth":5,"text":"処理概要","link":[],"note":"","href":[],"parent":"X000082"}
{"id":"X000084","children":[],"depth":6,"text":"引数の型チェック＋変換","link":[],"note":"","href":[],"parent":"X000083"}
{"id":"X000085","children":[],"depth":6,"text":"メンバ(sv)に引数を保存、未指定分には既定値を設定","link":[],"note":"[authClient/authServer共通オプション](#3c211d58f127)は引数で上書きしない","href":["3c211d58f127"],"parent":"X000083"}
{"id":"X000086","children":[],"depth":6,"text":"DocumentPropertiesからSS/SPkeyを取得。未生成なら生成、DocumentPropertiesに保存","link":[],"note":"","href":[],"parent":"X000083"}
{"id":"X000087","children":[],"depth":6,"text":"accounts/devicesシートが未作成なら追加","link":[],"note":"","href":[],"parent":"X000083"}
{"id":"X000088","children":[],"depth":5,"text":"引数 : <a href=\"https://workflowy.com/#/6f1ce86a8fb5\">mainの引数</a>がそのまま渡される","link":[["<a href=\"https://workflowy.com/#/6f1ce86a8fb5\">mainの引数</a>","6f1ce86a8fb5","mainの引数"]],"note":"","href":[],"parent":"X000082"}
{"id":"X000089","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"X000082"}
{"id":"X000090","children":[],"depth":4,"text":"functionalyze() : オブジェクト・関数文字列から既定値を導出する関数を作成","link":[],"note":"objectizeColumn()のdefaultを関数化する。","href":[],"parent":"X000049"}
{"id":"X000091","children":["X000092","X000096"],"depth":4,"text":"objectizeColumn() : <a href=\"https://workflowy.com/#/b9bea3e5ffc9\">項目定義メタ情報</a>(JSDoc)からオブジェクトを生成","link":[["<a href=\"https://workflowy.com/#/b9bea3e5ffc9\">項目定義メタ情報</a>","b9bea3e5ffc9","項目定義メタ情報"]],"note":"","href":[],"parent":"X000049"}
{"id":"X000092","children":["X000093"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000091"}
{"id":"X000093","children":["X000094","X000095"],"depth":6,"text":"arg {<a href=\"https://workflowy.com/#/b9bea3e5ffc9\">sdbColumn</a>[]|string} 文字列の場合、sv.opt以下に定義されているメンバ(typedef)と看做す","link":[["<a href=\"https://workflowy.com/#/b9bea3e5ffc9\">sdbColumn</a>","b9bea3e5ffc9","sdbColumn"]],"note":"","href":[],"parent":"X000092"}
{"id":"X000094","children":[],"depth":7,"text":"name {string} 生成するオブジェクト内のメンバ名","link":[],"note":"","href":[],"parent":"X000093"}
{"id":"X000095","children":[],"depth":7,"text":"default {string|function} メンバ名にセットする値(functionalyzeの引数)","link":[],"note":"","href":[],"parent":"X000093"}
{"id":"X000096","children":[],"depth":5,"text":"戻り値 {Object} 生成されたオブジェクト","link":[],"note":"","href":[],"parent":"X000091"}
{"id":"X000097","children":[],"depth":4,"text":"registUser() : ユーザ管理情報を生成、シートに追加","link":[],"note":"","href":[],"parent":"X000049"}
{"id":"X000098","children":["X000099","X000100"],"depth":3,"text":"DocumentProperties","link":[],"note":"プロパティ名はauthServer.option.DocPropNameで指定","href":[],"parent":"X000001"}
{"id":"X000099","children":[],"depth":4,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000098"}
{"id":"X000100","children":[],"depth":4,"text":"SSkey {string} サーバ側秘密鍵","link":[],"note":"復元は`RSAKey.parse(v.r.sKey)`で行う","href":[],"parent":"X000098"}
{"id":"X000101","children":["2f8a77eb6f10","ae550a40dc50","X000122"],"depth":3,"text":"使用シートおよび項目定義","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"2f8a77eb6f10","children":["X000102","X000103","X000104","X000105","X000106","X000107","X000108","X000109",[]],"depth":4,"text":"accounts - アカウント管理シートの項目","link":[],"note":"","href":[],"parent":"X000101"}
{"id":"X000102","children":[],"depth":5,"text":"userId {string|number}='guest' ユーザ識別子(primaryKey)","link":[],"note":"default:101(0〜100はシステム用に留保), primaryKey","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000103","children":[],"depth":5,"text":"note {string}='' アカウント情報(備考)","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000104","children":[],"depth":5,"text":"validityStart {string}=Date.now() 有効期間開始日時(ISO8601文字列)","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000105","children":[],"depth":5,"text":"validityEnd {string}=validityStart+opt.validitySpan 有効期間終了日時(ISO8601文字列)","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000106","children":[],"depth":5,"text":"authority {JSON}={} シート毎のアクセス権限。<code>{シート名:rwdos文字列}</code> 形式、既定値はアクセス権無し","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000107","children":[],"depth":5,"text":"created {string}=Date.now() ユーザ登録日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000108","children":[],"depth":5,"text":"updated {string}=Date.now() 最終更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"X000109","children":[],"depth":5,"text":"deleted {string}='' 論理削除日時","link":[],"note":"","href":[],"parent":"2f8a77eb6f10"}
{"id":"ae550a40dc50","children":["X000110","X000111","X000112","X000113","X000114","X000115","X000116","X000117","X000118","X000119","X000120","X000121",[]],"depth":4,"text":"devices - デバイス管理シートの項目","link":[],"note":"複数デバイスでの単一アカウントの使用を可能にするため「account.userId(1) : device.userId(n)」で作成","href":[],"parent":"X000101"}
{"id":"X000110","children":[],"depth":5,"text":"userId {string|number}='guest' ユーザ識別子","link":[],"note":"not null","href":[],"parent":"ae550a40dc50"}
{"id":"X000111","children":[],"depth":5,"text":"email {string}=opt.adminMail ユーザのメールアドレス(unique)","link":[],"note":"primaryKey","href":[],"parent":"ae550a40dc50"}
{"id":"X000112","children":[],"depth":5,"text":"name {string}='ゲスト' ユーザの氏名","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000113","children":[],"depth":5,"text":"phone {string}=''ユーザの電話番号","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000114","children":[],"depth":5,"text":"address {string}='' ユーザの住所","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000115","children":[],"depth":5,"text":"note {string}='' ユーザ情報(備考)","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000116","children":[],"depth":5,"text":"CPkey {string}='' クライアント側公開鍵","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000117","children":[],"depth":5,"text":"CPkeyExpiry {string}='' CPkey有効期限(ISO8601拡張形式)","link":[],"note":"期限内に適切な暗号化・署名された要求はOKとする","href":[],"parent":"ae550a40dc50"}
{"id":"X000118","children":[],"depth":5,"text":"trial {<a href=\"https://workflowy.com/#/aaab38c8e75d\">authTrial</a>} ログイン試行情報","link":[["<a href=\"https://workflowy.com/#/aaab38c8e75d\">authTrial</a>","aaab38c8e75d","authTrial"]],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000119","children":[],"depth":5,"text":"created {string}=Date.now() ユーザ登録日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000120","children":[],"depth":5,"text":"updated {string}=Date.now() 最終更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000121","children":[],"depth":5,"text":"deleted {string}='' 論理削除日時","link":[],"note":"","href":[],"parent":"ae550a40dc50"}
{"id":"X000122","children":[],"depth":4,"text":"log - SpreadDbのアクセスログシート","link":[],"note":"詳細はSpreadDb.[sdbLog](#dab8cfcec9d8)参照","href":["dab8cfcec9d8"],"parent":"X000101"}
{"id":"X000123","children":["accf9448cecc","X000139","3c211d58f127","53d27b6201fa","b9bea3e5ffc9"],"depth":3,"text":"typedefs","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"accf9448cecc","children":["X000124","X000125","X000126","X000127","X000128","X000129","X000130","X000131","X000132","X000133","X000134","X000135","X000136","X000137","X000138",[]],"depth":4,"text":"authQuery {Object[]} 操作要求の内容","link":[],"note":"- ■：authClientへの引数、□：authServerへの引数(authClientでの追加項目)、〇：authServerでの追加項目\n- SpreadDbの[sdbQuery](#1e80990a7c63)からの差分項目\n  - 削除項目：cols, arg\n  - 追加項目：email, CPkey, passcode, SPkey, status\n- command=\"delete\"(物理削除)は使用不可とし、論理削除で対応<br>(万一のハッキング時のリスク軽減)","href":["1e80990a7c63"],"parent":"X000123"}
{"id":"X000124","children":[],"depth":5,"text":"■table {string} 操作対象テーブル名","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000125","children":[],"depth":5,"text":"■command {string} 操作名","link":[],"note":"commandの種類は下表の通り。\n\"rwdos\"とは\"Read/Write/Delete/Own/Schema\"の頭文字。管理者のみ実行可能な\"c\"(createTable)と特殊権限\"o\"を加えてシート毎のアクセス制御を行う。\n\n内容 | command | rwdos\n:-- | :-- | :-- \nテーブル生成 | create | c\n参照 | select | r\n更新 | update | rw\n追加 | append/insert | w\nテーブル管理情報取得 | schema | s","href":[],"parent":"accf9448cecc"}
{"id":"X000126","children":[],"depth":5,"text":"■[where] {Object|Function|string} 対象レコードの判定条件","link":[],"note":"command='select','update','delete'で使用\n\n- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値\n- その他(Object,function,string以外) ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"accf9448cecc"}
{"id":"X000127","children":[],"depth":5,"text":"■[set] {Object|Object[]|string|string[]|Function} 追加・更新する値","link":[],"note":"command='update','append'で使用\n\n- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}\n- string ⇒ 上記Objectに変換可能なJSON文字列\n- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数\n  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}","href":[],"parent":"accf9448cecc"}
{"id":"X000128","children":[],"depth":5,"text":"□queryId {string}=UUID クエリ・結果突合用文字列","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000129","children":[],"depth":5,"text":"□timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000130","children":[],"depth":5,"text":"□userId {string|number}=\"guest\" ユーザ識別子(uuid等)","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000131","children":[],"depth":5,"text":"□CPkey {string} ユーザの公開鍵","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000132","children":[],"depth":5,"text":"□[email] {string} ユーザのメールアドレス","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000133","children":[],"depth":5,"text":"□[passcode] {number|string} 入力されたパスコード","link":[],"note":"開発時はauthClient/authServerへの引数として扱う(∵自動テスト用)。リリース時には引数として与えるのは不可とする\n\n- authClientへの引数：ダイアログから入力されたパスコードの代替。配列可\n- authServerへの引数：乱数で発生させるパスコードの代替","href":[],"parent":"accf9448cecc"}
{"id":"X000134","children":[],"depth":5,"text":"〇SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000135","children":[],"depth":5,"text":"〇qSts {string} クエリ単位の実行結果","link":[],"note":"正常終了なら\"OK\"。エラーコードは以下の通り。\n- create : \"Already Exist\", \"No Cols and Data\"\n- その他 : \"No Table\"","href":[],"parent":"accf9448cecc"}
{"id":"X000136","children":[],"depth":5,"text":"〇num {number} 変更された行数","link":[],"note":"append:追加行数、update:変更行数、select:抽出行数、schema:0(固定)","href":[],"parent":"accf9448cecc"}
{"id":"X000137","children":[],"depth":5,"text":"〇result {<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>[]} レコード単位の実行結果","link":[["<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>","d2f620e47c51","sdbResult"]],"note":"","href":[],"parent":"accf9448cecc"}
{"id":"X000138","children":[],"depth":5,"text":"〇status {string} authServerの実行結果","link":[],"note":"必要に応じてauthClientで追加変更","href":[],"parent":"accf9448cecc"}
{"id":"X000139","children":["X000140","X000141","X000142","X000146",[]],"depth":4,"text":"authTrial {Object} ログイン試行関連情報","link":[],"note":"","href":[],"parent":"X000123"}
{"id":"X000140","children":[],"depth":5,"text":"passcode {number} 設定されたパスコード","link":[],"note":"","href":[],"parent":"X000139"}
{"id":"X000141","children":[],"depth":5,"text":"datetime {string} パスコード通知メール送信日時","link":[],"note":"パスコード要求(client)>要求受領(server)>パスコード生成>通知メール送信の内、メール送信日時","href":[],"parent":"X000139"}
{"id":"X000142","children":["X000143","X000144","X000145"],"depth":5,"text":"log {Object[]} 試行履歴情報","link":[],"note":"","href":[],"parent":"X000139"}
{"id":"X000143","children":[],"depth":6,"text":"dt {string} パスコード検証日時(Date Time)","link":[],"note":"","href":[],"parent":"X000142"}
{"id":"X000144","children":[],"depth":6,"text":"pc {number} ユーザが入力したパスコード(PassCode)","link":[],"note":"","href":[],"parent":"X000142"}
{"id":"X000145","children":[],"depth":6,"text":"st {number} ステータス(STatus)","link":[],"note":"","href":[],"parent":"X000142"}
{"id":"X000146","children":[],"depth":5,"text":"thawing {string}='1970/01/01' 凍結解除日時","link":[],"note":"","href":[],"parent":"X000139"}
{"id":"3c211d58f127","children":["X000147","X000148","X000149","X000150","X000151","X000152","X000153","X000154","X000155","X000156",[]],"depth":4,"text":"commonOption {Object} authClient/authServer共通オプション","link":[],"note":"以下は共通性維持のため、authClient/authServer起動時オプションでの変更は不可とする。<br>変更が必要な場合、build前のソースで変更する。","href":[],"parent":"X000123"}
{"id":"X000147","children":[],"depth":5,"text":"tokenExpiry {number}=600,000(10分) トークンの有効期間(ミリ秒)","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000148","children":[],"depth":5,"text":"passcodeDigit {number}=6  パスコードの桁数","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000149","children":[],"depth":5,"text":"passcodeExpiry {number}=600,000(10分) パスコードの有効期間(ミリ秒)","link":[],"note":"メール送信〜受領〜パスコード入力〜送信〜確認処理終了までの時間。通信に係る時間も含む。不正防止のため、始点/終点ともサーバ側で時刻を設定する。","href":[],"parent":"3c211d58f127"}
{"id":"X000150","children":[],"depth":5,"text":"maxTrial {number}=3 パスコード入力の最大試行回数","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000151","children":[],"depth":5,"text":"validityExpiry {number}=86,400,000(1日) ログイン有効期間(ミリ秒)","link":[],"note":"有効期間を超えた場合は再ログインを必要とする","href":[],"parent":"3c211d58f127"}
{"id":"X000152","children":[],"depth":5,"text":"maxDevices {number}=5 単一アカウントで使用可能なデバイスの最大数","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000153","children":[],"depth":5,"text":"freezing {number}=3600000 連続失敗した場合の凍結期間。ミリ秒。既定値1時間","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000154","children":[],"depth":5,"text":"bits {number}=2048 RSA鍵ペアの鍵長","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000155","children":[],"depth":5,"text":"adminMail {string} 管理者のメールアドレス","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"X000156","children":[],"depth":5,"text":"adminName {string} 管理者名","link":[],"note":"","href":[],"parent":"3c211d58f127"}
{"id":"53d27b6201fa","children":["X000157","X000158","X000159",[]],"depth":4,"text":"mirrorDef {Object} ミラーリングするテーブルの定義","link":[],"note":"crond.set(), crond.clear()共通","href":[],"parent":"X000123"}
{"id":"X000157","children":[],"depth":5,"text":"name {string} テーブル名","link":[],"note":"","href":[],"parent":"53d27b6201fa"}
{"id":"X000158","children":[],"depth":5,"text":"func {function} ジョブ本体","link":[],"note":"","href":[],"parent":"53d27b6201fa"}
{"id":"X000159","children":[],"depth":5,"text":"interval {number}=300000 実行間隔(ミリ秒)","link":[],"note":"","href":[],"parent":"53d27b6201fa"}
{"id":"b9bea3e5ffc9","children":["X000160","X000161","X000162","X000163","X000164","X000165","X000166","X000167","X000168","X000169",[]],"depth":4,"text":"sdbColumn {Object} 項目の構造情報","link":[],"note":"= 項目定義メタ情報(JSDoc)","href":[],"parent":"X000123"}
{"id":"X000160","children":[],"depth":5,"text":"name {string} 項目名","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000161","children":[],"depth":5,"text":"type {string} データ型。string,number,boolean,Date,JSON,UUID","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000162","children":[],"depth":5,"text":"format {string} 表示形式。type=Dateの場合のみ指定","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000163","children":[],"depth":5,"text":"options {string} 取り得る選択肢(配列)のJSON表現","link":[],"note":"ex. [\"未入場\",\"既収\",\"未収\",\"無料\"]","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000164","children":[],"depth":5,"text":"default {function} 既定値を取得する関数。引数は当該行オブジェクト","link":[],"note":"指定の際は必ず<code>{〜}</code> で囲み、return文を付与のこと。\nex.<code>o => {return toLocale(new Date())}</code>","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000165","children":[],"depth":5,"text":"primaryKey {boolean}=false 一意キー項目ならtrue","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000166","children":[],"depth":5,"text":"unique {boolean}=false primaryKey以外で一意な値を持つならtrue","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000167","children":[],"depth":5,"text":"auto_increment {bloolean|null|number|number[]}=false 自動採番項目","link":[],"note":"null ⇒ 自動採番しない\nboolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない\nnumber ⇒ 自動採番する(基数=指定値,増減値=1)\nnumber[] ⇒ 自動採番する(基数=添字0,増減値=添字1)\nobject ⇒ {start:m,step:n}形式","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000168","children":[],"depth":5,"text":"suffix {string} \"not null\"等、上記以外のSQLのcreate table文のフィールド制約","link":[],"note":"","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000169","children":[],"depth":5,"text":"note {string} 本項目に関する備考","link":[],"note":"ローカル側のcreate table等では使用しない","href":[],"parent":"b9bea3e5ffc9"}
{"id":"X000170","children":["X000171","X000172"],"depth":3,"text":"その他","link":[],"note":"用語解説、注意事項、更新履歴、他","href":[],"parent":"X000001"}
{"id":"X000171","children":[],"depth":4,"text":"【参考】SpreadDbのエラーコード","link":[],"note":"| No | 設定項目 | コード | 発生箇所 | 原因 |\n| --: | :-- | :-- | :-- | :-- |\n| 1 | qSts | No Authority | doQuery | 指定されたテーブル操作の権限が無い |\n| 2 | qSts | No command | doQuery | query.commandが無い、または文字列では無い |\n| 3 | qSts | No Table name | doQuery | query.tableが無い、または文字列では無い |\n| 4 | qSts | Invalid where clause | doQuery | (権限\"o\"で)where句の値がプリミティブ型ではない |\n| 5 | qSts | No Table | doQuery<br>genTable | (create以外で)対象テーブルが無い |\n| 6 | qSts | No cols and data | genTable | createで項目定義も初期データも無い |\n| 7 | qSts | Already Exist | createTable | シートが既に存在している |\n| 8 | qSts | Duplicate | createTable | 初期レコード内に重複が存在 |\n| 9 | qSts | Empty set | createTable<br>appendRow | query.setが不在、または配列の長さが0 |\n| 10 | qSts | Invalid set | appendRow | query.setが非配列なのに要素がオブジェクトではない |\n| 11 | qSts | No set | appendRow<br>updateRow | queryにメンバ\"set\"が不在 |\n| 12 | qSts | No where | deleteRow<br>updateRow | where句がqueryに無い |\n| 13 | qSts | Undefined Column | updateRow | 更新対象項目がテーブルに無い |\n| 14 | qSts | その他 | doQuery | エラーオブジェクトのmessage |\n| 15 | rSts | Duplicate | appendRow<br>updateRow | unique項目に重複した値を入れようとした |\n| 16 | Error | Invalid Argument | functionalyze | 不適切な引数 |\n| 17 | Error | Could not Lock | main | 規定回数以上シートのロックに失敗した |","href":[],"parent":"X000170"}
{"id":"X000172","children":[],"depth":4,"text":"更新履歴","link":[],"note":"","href":[],"parent":"X000170"}
{"id":"X000173","children":[],"depth":3,"text":"テスト仕様","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"d4369fcf4044","children":["922be86d118e","a9f01a749b53","250e0f646160","5a75202c3db4","235f8a9e77af","56eaf36cc785","d154b1fe324f"],"depth":2,"text":"SpreadDb 1.2.0","link":[],"note":"\"SpreadDb\"はGoogle Spread上のシートを記憶領域とし、参照・更新・削除およびテーブル構造情報取得を実現するライブラリ。\n\nなおパラメータで利用者の権限とシート毎のアクセス権を付与することでアクセス制御を行えるようにする。","href":[],"parent":"X000000"}
{"id":"922be86d118e","children":["3eca2504fb57","X000174","X000177"],"depth":3,"text":"主処理","link":[],"note":"","href":[],"parent":"d4369fcf4044"}
{"id":"3eca2504fb57","children":[],"depth":4,"text":"概要","link":[],"note":"1. スプレッドシートを凍結\n1. queryで渡された操作要求を順次処理\n1. 権限確認後、command系内部関数の呼び出し\n1. command系関数内で結果をqueryに追記\n1. queryの配列を変更履歴シートに追記\n1. スプレッドシートの凍結解除","href":[],"parent":"922be86d118e"}
{"id":"X000174","children":["X000175","X000176"],"depth":4,"text":"引数","link":[],"note":"","href":[],"parent":"922be86d118e"}
{"id":"X000175","children":[],"depth":5,"text":"query {<a href=\"https://workflowy.com/#/7f3649978774\">sdbRequest</a>[]} 操作要求、またはその配列","link":[["<a href=\"https://workflowy.com/#/7f3649978774\">sdbRequest</a>","7f3649978774","sdbRequest"]],"note":"","href":[],"parent":"X000174"}
{"id":"X000176","children":[],"depth":5,"text":"opt {<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>}={} 起動時オプション","link":[["<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>","a4a26014ccb3","sdbOption"]],"note":"","href":[],"parent":"X000174"}
{"id":"X000177","children":[],"depth":4,"text":"戻り値 {<a href=\"https://workflowy.com/#/b03c5ccd2f8f\">sdbMain</a>[]}","link":[["<a href=\"https://workflowy.com/#/b03c5ccd2f8f\">sdbMain</a>","b03c5ccd2f8f","sdbMain"]],"note":"エラーコードについては「[エラーの種類](#60cbb24d684c)」参照","href":["60cbb24d684c"],"parent":"922be86d118e"}
{"id":"a9f01a749b53","children":["0f493fed5cc9","e65032ddce65","X000186","6d09e5d0363d","a8e56dd4e3c7","74c07b6144cd","f783913fe275","X000214","X000215"],"depth":3,"text":"内部関数 - 非command系","link":[],"note":"","href":[],"parent":"d4369fcf4044"}
{"id":"0f493fed5cc9","children":["X000178","X000181"],"depth":4,"text":"constructor() : 擬似メンバの値設定、変更履歴テーブルの準備","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000178","children":["X000179","X000180"],"depth":5,"text":"引数","link":[],"note":"主処理と同じ。","href":[],"parent":"0f493fed5cc9"}
{"id":"X000179","children":[],"depth":6,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>[]} 操作要求、またはその配列","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"","href":[],"parent":"X000178"}
{"id":"X000180","children":[],"depth":6,"text":"opt {<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>}={} 起動時オプション","link":[["<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>","a4a26014ccb3","sdbOption"]],"note":"","href":[],"parent":"X000178"}
{"id":"X000181","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"0f493fed5cc9"}
{"id":"e65032ddce65","children":["X000182","X000185"],"depth":4,"text":"convertRow() : シートイメージと行オブジェクトの相互変換","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000182","children":["X000183","X000184"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"e65032ddce65"}
{"id":"X000183","children":[],"depth":6,"text":"data {any[][]|Object[]} 行データ。シートイメージか行オブジェクトの配列","link":[],"note":"","href":[],"parent":"X000182"}
{"id":"X000184","children":[],"depth":6,"text":"[header] {string[]}=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用","link":[],"note":"","href":[],"parent":"X000182"}
{"id":"X000185","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/01ee6b06c8a6\">sdbConvertRow</a>}","link":[["<a href=\"https://workflowy.com/#/01ee6b06c8a6\">sdbConvertRow</a>","01ee6b06c8a6","sdbConvertRow"]],"note":"","href":[],"parent":"e65032ddce65"}
{"id":"X000186","children":["X000187","X000189"],"depth":4,"text":"doQuery() : 単体クエリの実行、変更履歴の作成","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000187","children":["X000188"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000186"}
{"id":"X000188","children":[],"depth":6,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"","href":[],"parent":"X000187"}
{"id":"X000189","children":[],"depth":5,"text":"戻り値 {void}","link":[],"note":"","href":[],"parent":"X000186"}
{"id":"6d09e5d0363d","children":["X000190","X000194"],"depth":4,"text":"functionalize() : オブジェクト・文字列を基にObject/stringを関数化","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000190","children":["X000191"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"6d09e5d0363d"}
{"id":"X000191","children":["X000192","X000193"],"depth":6,"text":"arg","link":[],"note":"","href":[],"parent":"X000190"}
{"id":"X000192","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>} 呼出元で処理対象としているテーブル","link":[["<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>","976403e08f0e","sdbTable"]],"note":"","href":[],"parent":"X000191"}
{"id":"X000193","children":[],"depth":7,"text":"data {Object|function|string} 関数化するオブジェクトor文字列","link":[],"note":"引数のデータ型により以下のように処理分岐\n\n- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"X000191"}
{"id":"X000194","children":[],"depth":5,"text":"戻り値 {function}","link":[],"note":"","href":[],"parent":"6d09e5d0363d"}
{"id":"a8e56dd4e3c7","children":["X000195","X000197"],"depth":4,"text":"genColumn() : sdbColumnオブジェクトを生成","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000195","children":["X000196"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"a8e56dd4e3c7"}
{"id":"X000196","children":[],"depth":6,"text":"arg {string|<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>} シート上のメモの文字列またはsdbColumn","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"X000195"}
{"id":"X000197","children":["X000198","X000199"],"depth":5,"text":"戻り値 {Object}","link":[],"note":"","href":[],"parent":"a8e56dd4e3c7"}
{"id":"X000198","children":[],"depth":6,"text":"column {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>} 項目の定義情報","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"X000197"}
{"id":"X000199","children":[],"depth":6,"text":"note {string} シート上のメモの文字列","link":[],"note":"","href":[],"parent":"X000197"}
{"id":"74c07b6144cd","children":["X000200","X000202"],"depth":4,"text":"genSchema() : sdbSchemaオブジェクトを生成","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000200","children":["X000201"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"74c07b6144cd"}
{"id":"X000201","children":[],"depth":6,"text":"arg {<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>}","link":[["<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>","976403e08f0e","sdbTable"]],"note":"","href":[],"parent":"X000200"}
{"id":"X000202","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/2609271977a8\">sdbGenSchema</a>}","link":[["<a href=\"https://workflowy.com/#/2609271977a8\">sdbGenSchema</a>","2609271977a8","sdbGenSchema"]],"note":"","href":[],"parent":"74c07b6144cd"}
{"id":"f783913fe275","children":["X000203","X000213"],"depth":4,"text":"genTable() : sdbTableオブジェクトを生成","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000203","children":["X000204","X000209"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"f783913fe275"}
{"id":"X000204","children":["X000205","X000206","X000207","X000208"],"depth":6,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"sdbQueryの内、必要なのは以下のメンバ","href":[],"parent":"X000203"}
{"id":"X000205","children":[],"depth":7,"text":"table {string} テーブル名","link":[],"note":"","href":[],"parent":"X000204"}
{"id":"X000206","children":[],"depth":7,"text":"[cols] {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>[]} - 新規作成シートの項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"X000204"}
{"id":"X000207","children":[],"depth":7,"text":"[set] {Object[]|Array[]} - 新規作成シートに書き込む初期値","link":[],"note":"行オブジェクトの配列、またはシートイメージ(プリミティブ型二次元配列)","href":[],"parent":"X000204"}
{"id":"X000208","children":[],"depth":7,"text":"qSts {string} クエリ単位の実行結果","link":[],"note":"","href":[],"parent":"X000204"}
{"id":"X000209","children":["X000210","X000211","X000212"],"depth":6,"text":"arg {Object}","link":[],"note":"","href":[],"parent":"X000203"}
{"id":"X000210","children":[],"depth":7,"text":"name {string} - テーブル名","link":[],"note":"","href":[],"parent":"X000209"}
{"id":"X000211","children":[],"depth":7,"text":"[cols] {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>[]} - 新規作成シートの項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"X000209"}
{"id":"X000212","children":[],"depth":7,"text":"[values] {Object[]|Array[]} - 新規作成シートに書き込む初期値","link":[],"note":"行オブジェクトの配列、またはシートイメージ(プリミティブ型二次元配列)","href":[],"parent":"X000209"}
{"id":"X000213","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>}","link":[["<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>","976403e08f0e","sdbTable"]],"note":"","href":[],"parent":"f783913fe275"}
{"id":"X000214","children":[],"depth":4,"text":"objectizeColumn() : 項目定義メタ情報(JSDoc)からオブジェクトを生成","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"X000215","children":[],"depth":4,"text":"toString() : 関数・オブジェクトを文字列化","link":[],"note":"","href":[],"parent":"a9f01a749b53"}
{"id":"250e0f646160","children":["288276ee622d","77304ebfbc33","30d4aa5c9fd7","701a78c34e0a","a8ac2d5e7372","206036f40579"],"depth":3,"text":"内部関数 - command系","link":[],"note":"","href":[],"parent":"d4369fcf4044"}
{"id":"288276ee622d","children":["X000216","X000221","X000222"],"depth":4,"text":"appendRow() : テーブルに新規行を追加","link":[],"note":"","href":[],"parent":"250e0f646160"}
{"id":"X000216","children":["X000217"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"288276ee622d"}
{"id":"X000217","children":["X000218","X000219","X000220"],"depth":6,"text":"arg {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"sdbQueryの内、必要なのは以下のメンバ","href":[],"parent":"X000216"}
{"id":"X000218","children":[],"depth":7,"text":"table {string} 操作対象テーブル名","link":[],"note":"","href":[],"parent":"X000217"}
{"id":"X000219","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/58dde3944536\">set</a> {Object|Object[]} 追加する行オブジェクト","link":[["<a href=\"https://workflowy.com/#/58dde3944536\">set</a>","58dde3944536","set"]],"note":"","href":[],"parent":"X000217"}
{"id":"X000220","children":[],"depth":7,"text":"result {<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>} レコード単位に追加結果を格納","link":[["<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>","d2f620e47c51","sdbResult"]],"note":"","href":[],"parent":"X000217"}
{"id":"X000221","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"288276ee622d"}
{"id":"X000222","children":[],"depth":5,"text":"エラーコード","link":[],"note":"- Duplicate: unique項目に重複した値を設定。diffに<code>{項目名:重複値}</code> 形式で記録","href":[],"parent":"288276ee622d"}
{"id":"77304ebfbc33","children":["X000223","X000224"],"depth":4,"text":"createTable() : データから新規テーブルを生成","link":[],"note":"管理者のみ実行可。初期データが有った場合、件数を変更履歴シートafter欄に記載","href":[],"parent":"250e0f646160"}
{"id":"X000223","children":[],"depth":5,"text":"引数 {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"","href":[],"parent":"77304ebfbc33"}
{"id":"X000224","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"77304ebfbc33"}
{"id":"30d4aa5c9fd7","children":["X000225","X000229"],"depth":4,"text":"deleteRow() : テーブルから条件に合致する行を削除","link":[],"note":"","href":[],"parent":"250e0f646160"}
{"id":"X000225","children":["X000226"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"30d4aa5c9fd7"}
{"id":"X000226","children":["X000227","X000228"],"depth":6,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"","href":[],"parent":"X000225"}
{"id":"X000227","children":[],"depth":7,"text":"table {string} 操作対象のテーブル名","link":[],"note":"","href":[],"parent":"X000226"}
{"id":"X000228","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/741ee9383b92\">where</a> {Object|Function|string} 対象レコードの判定条件","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">where</a>","741ee9383b92","where"]],"note":"","href":[],"parent":"X000226"}
{"id":"X000229","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"30d4aa5c9fd7"}
{"id":"701a78c34e0a","children":["X000230","f76eb797d345","X000232"],"depth":4,"text":"getSchema() : 指定されたテーブルの構造情報を取得","link":[],"note":"","href":[],"parent":"250e0f646160"}
{"id":"X000230","children":["X000231"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"701a78c34e0a"}
{"id":"X000231","children":[],"depth":6,"text":"arg {string|string[]} 取得対象テーブル名","link":[],"note":"","href":[],"parent":"X000230"}
{"id":"f76eb797d345","children":[[]],"depth":5,"text":"戻り値 {Object.&lt;string,<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>[]&gt;} {テーブル名：項目定義オブジェクトの配列}形式","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"701a78c34e0a"}
{"id":"X000232","children":[],"depth":5,"text":"変更履歴シートへの記録","link":[],"note":"","href":[],"parent":"701a78c34e0a"}
{"id":"a8ac2d5e7372","children":["X000233","X000237"],"depth":4,"text":"selectRow() : テーブルから条件に合致する行を抽出","link":[],"note":"","href":[],"parent":"250e0f646160"}
{"id":"X000233","children":["X000234"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"a8ac2d5e7372"}
{"id":"X000234","children":["X000235","X000236"],"depth":6,"text":"arg {Object|Object[]}","link":[],"note":"","href":[],"parent":"X000233"}
{"id":"X000235","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>} 操作対象のテーブル管理情報","link":[["<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>","976403e08f0e","sdbTable"]],"note":"","href":[],"parent":"X000234"}
{"id":"X000236","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/741ee9383b92\">where</a> {Object|Function|string} 対象レコードの判定条件","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">where</a>","741ee9383b92","where"]],"note":"","href":[],"parent":"X000234"}
{"id":"X000237","children":[],"depth":5,"text":"戻り値 {Object[]} 該当行オブジェクトの配列","link":[],"note":"","href":[],"parent":"a8ac2d5e7372"}
{"id":"206036f40579","children":["X000238","X000243"],"depth":4,"text":"updateRow() : テーブルを更新","link":[],"note":"","href":[],"parent":"250e0f646160"}
{"id":"X000238","children":["X000239"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"206036f40579"}
{"id":"X000239","children":["X000240","X000241","X000242"],"depth":6,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>}","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"同一テーブルでも複数の条件で更新する場合、SpreadDb.arg.query自体を別オブジェクトで用意する","href":[],"parent":"X000238"}
{"id":"X000240","children":[],"depth":7,"text":"table {string} 操作対象のテーブル名","link":[],"note":"","href":[],"parent":"X000239"}
{"id":"X000241","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/741ee9383b92\">where</a> {Object|Function|string} 対象レコードの判定条件","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">where</a>","741ee9383b92","where"]],"note":"","href":[],"parent":"X000239"}
{"id":"X000242","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/58dde3944536\">set</a> {Object|string|Function} 更新する値","link":[["<a href=\"https://workflowy.com/#/58dde3944536\">set</a>","58dde3944536","set"]],"note":"","href":[],"parent":"X000239"}
{"id":"X000243","children":[],"depth":5,"text":"戻り値 {null|Error}","link":[],"note":"","href":[],"parent":"206036f40579"}
{"id":"5a75202c3db4","children":["fa77053faee2","1e80990a7c63","976403e08f0e","7b012b226f8e","df5b3c98954e","dab8cfcec9d8","a4a26014ccb3","d2f620e47c51","X000308","b03c5ccd2f8f"],"depth":3,"text":"typedefs","link":[],"note":"","href":[],"parent":"d4369fcf4044"}
{"id":"fa77053faee2","children":["X000244","X000245","X000246","X000247","X000248","X000249","X000250"],"depth":4,"text":"擬似メンバ\"pv\"","link":[],"note":"pv = private variables","href":[],"parent":"5a75202c3db4"}
{"id":"X000244","children":[],"depth":5,"text":"whois {string} 'SpreadDb'固定","link":[],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000245","children":[],"depth":5,"text":"rv {sdbMain[]} 戻り値。クエリ毎の実行結果の配列","link":[],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000246","children":[],"depth":5,"text":"log {sdbLog[]} 変更履歴シートへの追記イメージ","link":[],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000247","children":[],"depth":5,"text":"query {<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>[]} 処理要求","link":[["<a href=\"https://workflowy.com/#/1e80990a7c63\">sdbQuery</a>","1e80990a7c63","sdbQuery"]],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000248","children":[],"depth":5,"text":"opt {<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>} 起動時オプション","link":[["<a href=\"https://workflowy.com/#/a4a26014ccb3\">sdbOption</a>","a4a26014ccb3","sdbOption"]],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000249","children":[],"depth":5,"text":"spread {<a href=\"https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja\">Spread</a>} スプレッドシートオブジェクト","link":[],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"X000250","children":[],"depth":5,"text":"table {Object.&lt;string,<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>&gt;} スプレッドシート上の各テーブル(領域)の情報","link":[["<a href=\"https://workflowy.com/#/976403e08f0e\">sdbTable</a>","976403e08f0e","sdbTable"]],"note":"","href":[],"parent":"fa77053faee2"}
{"id":"1e80990a7c63","children":["X000251","X000252","X000253","X000254","X000255","X000256","X000257",[]],"depth":4,"text":"sdbQuery {Object[]} 操作要求の内容","link":[],"note":"■：引数で渡される項目、□：主処理でcommand系メソッド呼出前に設定される項目、〇：command系メソッドで設定される項目","href":[],"parent":"5a75202c3db4"}
{"id":"X000251","children":[],"depth":5,"text":"query {<a href=\"https://workflowy.com/#/7f3649978774\">[o]sdbRequest</a>[]} 処理要求","link":[["<a href=\"https://workflowy.com/#/7f3649978774\">[o]sdbRequest</a>","7f3649978774","[o]sdbRequest"]],"note":"","href":[],"parent":"1e80990a7c63"}
{"id":"X000252","children":[[]],"depth":5,"text":"□timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"1e80990a7c63"}
{"id":"X000253","children":[],"depth":5,"text":"□userId {string|number}=<a href=\"https://workflowy.com/#/5554e1d6a61d\">opt.userId</a> ユーザ識別子(uuid等)","link":[["<a href=\"https://workflowy.com/#/5554e1d6a61d\">opt.userId</a>","5554e1d6a61d","opt.userId"]],"note":"","href":[],"parent":"1e80990a7c63"}
{"id":"X000254","children":[],"depth":5,"text":"〇arg {string} 操作関数に渡された引数(データ)","link":[],"note":"createならcols、select/update/deleteならwhere、append/schemaなら空白。\ncreate/appendの追加レコード情報、selectの抽出レコード等はrecordで確認する運用を想定","href":[],"parent":"1e80990a7c63"}
{"id":"X000255","children":[[]],"depth":5,"text":"□qSts {string} クエリ単位の実行結果","link":[],"note":"正常終了なら\"OK\"。エラーコードは[エラーの種類](#60cbb24d684c)参照。","href":["60cbb24d684c"],"parent":"1e80990a7c63"}
{"id":"X000256","children":[],"depth":5,"text":"〇num {number} 変更された行数","link":[],"note":"create: 初期値の行数、append:追加行数、update:変更行数、delete:削除行数、select:抽出行数、schema:0(固定)","href":[],"parent":"1e80990a7c63"}
{"id":"X000257","children":[],"depth":5,"text":"〇result {<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>[]} レコード単位の実行結果","link":[["<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>","d2f620e47c51","sdbResult"]],"note":"","href":[],"parent":"1e80990a7c63"}
{"id":"976403e08f0e","children":["X000258","X000259","X000260","X000261","X000262","X000263","X000264","X000265","X000266",[]],"depth":4,"text":"sdbTable {Object} テーブルの管理情報","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000258","children":[],"depth":5,"text":"name {string} テーブル名(範囲名)","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000259","children":[],"depth":5,"text":"account {string} 更新者のアカウント(識別子)","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000260","children":[],"depth":5,"text":"sheet {<a href=\"https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja\">Sheet</a>} スプレッドシート内の操作対象シート(ex.\"master\"シート)","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000261","children":[],"depth":5,"text":"schema {<a href=\"https://workflowy.com/#/7b012b226f8e\">sdbSchema</a>} シートの項目定義","link":[["<a href=\"https://workflowy.com/#/7b012b226f8e\">sdbSchema</a>","7b012b226f8e","sdbSchema"]],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000262","children":[],"depth":5,"text":"values {Object[]} 行オブジェクトの配列。<code>{項目名:値,..}</code> 形式","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000263","children":[],"depth":5,"text":"header {string[]} 項目名一覧(ヘッダ行)","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000264","children":[],"depth":5,"text":"notes {string[]} ヘッダ行のメモ","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000265","children":[],"depth":5,"text":"colnum {number} データ領域の列数","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"X000266","children":[],"depth":5,"text":"rownum {number} データ領域の行数(ヘッダ行は含まず)","link":[],"note":"","href":[],"parent":"976403e08f0e"}
{"id":"7b012b226f8e","children":["X000267","X000268","X000269","X000270","X000274",[]],"depth":4,"text":"sdbSchema {Object} テーブルの構造情報","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000267","children":[],"depth":5,"text":"cols {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>[]} 項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"","href":[],"parent":"7b012b226f8e"}
{"id":"X000268","children":[],"depth":5,"text":"primaryKey {string}='id' 一意キー項目名","link":[],"note":"","href":[],"parent":"7b012b226f8e"}
{"id":"X000269","children":[],"depth":5,"text":"unique {Object.&lt;string, any[]&gt;} primaryKeyおよびunique属性項目の管理情報","link":[],"note":"メンバ名はprimaryKey/uniqueの項目名","href":[],"parent":"7b012b226f8e"}
{"id":"X000270","children":["X000271","X000272","X000273"],"depth":5,"text":"auto_increment {Object.&lt;string,Object&gt;} auto_increment属性項目の管理情報","link":[],"note":"メンバ名はauto_incrementの項目名","href":[],"parent":"7b012b226f8e"}
{"id":"X000271","children":[],"depth":6,"text":"start {number} 開始値","link":[],"note":"","href":[],"parent":"X000270"}
{"id":"X000272","children":[],"depth":6,"text":"step {number} 増減値","link":[],"note":"","href":[],"parent":"X000270"}
{"id":"X000273","children":[],"depth":6,"text":"current {number} 現在の最大(小)値","link":[],"note":"currentはsdbTableインスタンスで操作する。","href":[],"parent":"X000270"}
{"id":"X000274","children":[],"depth":5,"text":"defaultRow {Object.&lt;string,function&gt;} 項目名：既定値算式で構成されたオブジェクト。appendの際のプロトタイプ","link":[],"note":"","href":[],"parent":"7b012b226f8e"}
{"id":"df5b3c98954e","children":["X000275","X000276","X000277","X000278","X000279","X000280","X000281","X000282","X000283","X000284",[]],"depth":4,"text":"sdbColumn {Object} 項目の構造情報","link":[],"note":"= シート上のメモの文字列","href":[],"parent":"5a75202c3db4"}
{"id":"X000275","children":[],"depth":5,"text":"name {string} 項目名","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000276","children":[],"depth":5,"text":"type {string} データ型。string,number,boolean,Date,JSON,UUID","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000277","children":[],"depth":5,"text":"format {string} 表示形式。type=Dateの場合のみ指定","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000278","children":[],"depth":5,"text":"options {string} 取り得る選択肢(配列)のJSON表現","link":[],"note":"ex. [\"未入場\",\"既収\",\"未収\",\"無料\"]","href":[],"parent":"df5b3c98954e"}
{"id":"X000279","children":[],"depth":5,"text":"default {function} 既定値を取得する関数。引数は当該行オブジェクト","link":[],"note":"指定の際は必ず<code>{〜}</code> で囲み、return文を付与のこと。\nex.<code>o => {return toLocale(new Date())}</code>","href":[],"parent":"df5b3c98954e"}
{"id":"X000280","children":[],"depth":5,"text":"primaryKey {boolean}=false 一意キー項目ならtrue","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000281","children":[],"depth":5,"text":"unique {boolean}=false primaryKey以外で一意な値を持つならtrue","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000282","children":[],"depth":5,"text":"auto_increment {bloolean|null|number|number[]}=false 自動採番項目","link":[],"note":"null ⇒ 自動採番しない\nboolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない\nnumber ⇒ 自動採番する(基数=指定値,増減値=1)\nnumber[] ⇒ 自動採番する(基数=添字0,増減値=添字1)\nobject ⇒ {start:m,step:n}形式","href":[],"parent":"df5b3c98954e"}
{"id":"X000283","children":[],"depth":5,"text":"suffix {string} \"not null\"等、上記以外のSQLのcreate table文のフィールド制約","link":[],"note":"","href":[],"parent":"df5b3c98954e"}
{"id":"X000284","children":[],"depth":5,"text":"note {string} 本項目に関する備考","link":[],"note":"ローカル側のcreate table等では使用しない","href":[],"parent":"df5b3c98954e"}
{"id":"dab8cfcec9d8","children":["X000285","X000286","X000287","X000288","X000289","X000290","X000291","X000292","X000293","X000294","X000295","X000296",[]],"depth":4,"text":"sdbLog {Object} 変更履歴オブジェクト","link":[],"note":"| command | 権限 | status | ratio | record欄 | 備考 |\n| :-- | :--: | :-- | :-- | :-- | :-- |\n| create | — | Already Exist<br>No Cols and Data | — | [sdbColumn](#df5b3c98954e) | 管理者のみ実行可 |\n| select | r | No Table | 抽出失敗/対象 | — | 「対象なのに失敗」は考慮しない |\n| update | rw | No Table | 更新失敗/対象 | {sts:[OK|Duplicate],diff:{項目名:[更新前,更新後]}} |  |\n| append | w | No Table | 追加失敗/対象 | {sts:[OK|Duplicate],diff:追加行Obj} |  |\n| delete | d | No Table | 削除失敗/対象 | — | 「対象なのに失敗」は考慮しない |\n| schema | s | No Table | — | [sdbColumn](#df5b3c98954e) |  |\n\n- command系メソッドはstatus,num,recordを返す\n- command系メソッドは、成功件数が0件でも「正常終了」とし、status=\"OK\"とする\n- 戻り値がErrorオブジェクトの場合、status=\"System\",record=Error.messageとする\n- record欄は、実際は上記Objの【配列】のJSON文字列とする\n\n以下、既定値は[genLog()](#6fb9aba6d9f9)で設定される値","href":["df5b3c98954e","df5b3c98954e","6fb9aba6d9f9"],"parent":"5a75202c3db4"}
{"id":"X000285","children":[],"depth":5,"text":"logId {string}=Utilities.getUuid() 変更履歴レコードの識別子","link":[],"note":"primaryKey, default:UUID","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000286","children":[],"depth":5,"text":"timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)","link":[],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000287","children":[],"depth":5,"text":"userId {string}=<a href=\"https://workflowy.com/#/5554e1d6a61d\">opt.userId</a> ユーザ識別子(uuid等)","link":[["<a href=\"https://workflowy.com/#/5554e1d6a61d\">opt.userId</a>","5554e1d6a61d","opt.userId"]],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000288","children":[],"depth":5,"text":"queryId {string}=null SpreadDb呼出元で設定する、クエリ・結果突合用文字列","link":[],"note":"未設定の場合、メソッド呼び出し前にgenLogでUUIDを設定","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000289","children":[],"depth":5,"text":"table {string}=null 対象テーブル名","link":[],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000290","children":[],"depth":5,"text":"command {string}=null 操作内容(コマンド名)","link":[],"note":"設定内容は「[commandの種類とrwdos文字列によるアクセス制御](#0055bda95f77)」参照","href":["0055bda95f77"],"parent":"dab8cfcec9d8"}
{"id":"X000291","children":[],"depth":5,"text":"[<a href=\"https://workflowy.com/#/741ee9383b92\">data</a>] {Object|Function|string} 操作関数に渡された引数(データ)","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">data</a>","741ee9383b92","data"]],"note":"createならcols、select/update/deleteならwhere、append/schemaなら空白。\ncreate/appendの追加レコード情報、selectの抽出レコード等はrecordで確認する運用を想定","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000292","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/a0484ae4e8cb\">qSt</a>s {string} クエリ単位の実行結果","link":[["<a href=\"https://workflowy.com/#/a0484ae4e8cb\">qSt</a>","a0484ae4e8cb","qSt"]],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000293","children":[],"depth":5,"text":"num {number} 変更された行数","link":[],"note":"create: 初期値の行数、append:追加行数、update:変更行数、delete:削除行数、select:抽出行数、schema:0(固定)","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000294","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/6d2c404bdbd8\">pKey</a> {string} 変更したレコードのprimaryKey","link":[["<a href=\"https://workflowy.com/#/6d2c404bdbd8\">pKey</a>","6d2c404bdbd8","pKey"]],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000295","children":[],"depth":5,"text":"rSts {string} レコード単位でのエラーコード","link":[],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"X000296","children":[],"depth":5,"text":"diff {Object} 当該レコードの変更点","link":[],"note":"","href":[],"parent":"dab8cfcec9d8"}
{"id":"a4a26014ccb3","children":["X000297","X000298","X000299","X000300","X000301","X000302","X000303","X000304",[]],"depth":4,"text":"sdbOption {Object} オプション","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000297","children":[[]],"depth":5,"text":"userId {string}='guest' ユーザの識別子","link":[],"note":"指定する場合、必ずuserAuthも併せて指定","href":[],"parent":"a4a26014ccb3"}
{"id":"X000298","children":[],"depth":5,"text":"userAuth {Object.&lt;string,string&gt;}={} テーブル毎のアクセス権限。<code>{シート名:rwdos文字列}</code> 形式","link":[],"note":"r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可\n\no(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。\nまた検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可\nread/writeは自分のみ可、delete/schemaは実行不可","href":[],"parent":"a4a26014ccb3"}
{"id":"X000299","children":[],"depth":5,"text":"log {string}='log' 変更履歴テーブル名","link":[],"note":"nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈","href":[],"parent":"a4a26014ccb3"}
{"id":"X000300","children":[],"depth":5,"text":"maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数","link":[],"note":"","href":[],"parent":"a4a26014ccb3"}
{"id":"X000301","children":[],"depth":5,"text":"interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)","link":[],"note":"","href":[],"parent":"a4a26014ccb3"}
{"id":"X000302","children":[],"depth":5,"text":"guestAuth {Object.&lt;string,string&gt;}={} ゲストに付与する権限。<code>{シート名:rwdos文字列}</code> 形式","link":[],"note":"","href":[],"parent":"a4a26014ccb3"}
{"id":"X000303","children":[],"depth":5,"text":"adminId {string}='Administrator' 管理者として扱うuserId","link":[],"note":"管理者は全てのシートの全権限を持つ","href":[],"parent":"a4a26014ccb3"}
{"id":"X000304","children":[],"depth":5,"text":"additionalPrimaryKey {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>} createTableで主キー無指定時に追加設定される主キー項目名","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"既定値は`{name:'rowId',type:'UUID',note:'主キー',primaryKey:true,default:()=>Utilities.getUuid()}`","href":[],"parent":"a4a26014ccb3"}
{"id":"d2f620e47c51","children":["X000305","X000306","X000307",[]],"depth":4,"text":"sdbResult {Object} レコード単位の実行結果","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000305","children":[[]],"depth":5,"text":"pKey {string} 処理対象レコードの識別子","link":[],"note":"","href":[],"parent":"d2f620e47c51"}
{"id":"X000306","children":[],"depth":5,"text":"rSts {string}='OK' レコード単位での実行結果","link":[],"note":"append/updateで重複エラー時は\"Duplicate\"","href":[],"parent":"d2f620e47c51"}
{"id":"X000307","children":[],"depth":5,"text":"diff {Object} 当該レコードの変更点","link":[],"note":"create : 初期値として追加した行オブジェクト\nselect : 抽出された行オブジェクト\nappend : 追加された行オブジェクト。Duplicateエラーの場合、重複項目と値\nupdate : 変更点。{変更された項目名:[変更前,変更後]}\ndelete : 削除された行オブジェクト\nschema : 提供された項目定義(sdbColumn[])","href":[],"parent":"d2f620e47c51"}
{"id":"X000308","children":["X000309","X000310","X000311","X000312","X000313","X000314",[]],"depth":4,"text":"SpreadDb_query {Object} SpreadDbへの処理要求","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000309","children":[[]],"depth":5,"text":"■[queryId] {string} SpreadDb呼出元で設定する、クエリ・結果突合用文字列","link":[],"note":"未設定の場合は主処理でUUIDを設定","href":[],"parent":"X000308"}
{"id":"X000310","children":[[]],"depth":5,"text":"■table {string} 操作対象テーブル名","link":[],"note":"全commandで使用","href":[],"parent":"X000308"}
{"id":"X000311","children":[],"depth":5,"text":"■command {string} 操作名","link":[],"note":"全commandで使用。「[commandの種類とrwdos文字列によるアクセス制御](#0055bda95f77)」参照","href":["0055bda95f77"],"parent":"X000308"}
{"id":"X000312","children":[],"depth":5,"text":"■[cols] {<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>[]} 新規作成シートの項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/df5b3c98954e\">sdbColumn</a>","df5b3c98954e","sdbColumn"]],"note":"command='create'のみで使用","href":[],"parent":"X000308"}
{"id":"X000313","children":[],"depth":5,"text":"■[<a href=\"https://workflowy.com/#/741ee9383b92\">where</a>] {Object|Function|string} 対象レコードの判定条件","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">where</a>","741ee9383b92","where"]],"note":"command='select','update','delete'で使用","href":[],"parent":"X000308"}
{"id":"X000314","children":[],"depth":5,"text":"■[<a href=\"https://workflowy.com/#/58dde3944536\">set</a>] {Object|Object[]|string|string[]|Function} 追加・更新する値","link":[["<a href=\"https://workflowy.com/#/58dde3944536\">set</a>","58dde3944536","set"]],"note":"command='create','update','append'で使用","href":[],"parent":"X000308"}
{"id":"b03c5ccd2f8f","children":[[],"X000315","X000316","X000317","X000318","X000319","X000320","X000321","X000322"],"depth":4,"text":"SpreadDb {Object} 主処理(=SpreadDb)の実行結果オブジェクト","link":[],"note":"","href":[],"parent":"5a75202c3db4"}
{"id":"X000315","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/bf9d7d1a97d2\">timestamp</a> {string} 更新日時(ISO8601拡張形式)","link":[["<a href=\"https://workflowy.com/#/bf9d7d1a97d2\">timestamp</a>","bf9d7d1a97d2","timestamp"]],"note":"","href":[],"parent":"b03c5ccd2f8f"}
{"id":"X000316","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/e0188bfade27\">queryId</a> {string} SpreadDb呼出元で設定する、クエリ・結果突合用文字列","link":[["<a href=\"https://workflowy.com/#/e0188bfade27\">queryId</a>","e0188bfade27","queryId"]],"note":"未設定の場合は主処理でUUIDを設定","href":[],"parent":"b03c5ccd2f8f"}
{"id":"X000317","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/cd1ba8419dfc\">table</a> {string|string[]} 操作対象テーブル名","link":[["<a href=\"https://workflowy.com/#/cd1ba8419dfc\">table</a>","cd1ba8419dfc","table"]],"note":"全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列","href":[],"parent":"b03c5ccd2f8f"}
{"id":"X000318","children":[],"depth":5,"text":"command {string} 操作名","link":[],"note":"全commandで使用。「[commandの種類とrwdos文字列によるアクセス制御](#0055bda95f77)」参照","href":["0055bda95f77"],"parent":"b03c5ccd2f8f"}
{"id":"X000319","children":[],"depth":5,"text":"[<a href=\"https://workflowy.com/#/741ee9383b92\">data</a>] {Object|Function|string} 操作関数に渡された引数(データ)","link":[["<a href=\"https://workflowy.com/#/741ee9383b92\">data</a>","741ee9383b92","data"]],"note":"createならcols、select/update/deleteならwhere、append/schemaなら空白。\ncreate/appendの追加レコード情報、selectの抽出レコード等はrecordで確認する運用を想定","href":[],"parent":"b03c5ccd2f8f"}
{"id":"X000320","children":[],"depth":5,"text":"qSts {string} クエリ単位の実行結果","link":[],"note":"正常終了なら\"OK\"。エラーコードは[エラーの種類](#60cbb24d684c)参照","href":["60cbb24d684c"],"parent":"b03c5ccd2f8f"}
{"id":"X000321","children":[],"depth":5,"text":"num {number} 変更された行数","link":[],"note":"create: 初期値の行数、append:追加行数、update:変更行数、delete:削除行数、select:抽出行数、schema:0(固定)","href":[],"parent":"b03c5ccd2f8f"}
{"id":"X000322","children":[],"depth":5,"text":"result {<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>[]} レコード単位の実行結果","link":[["<a href=\"https://workflowy.com/#/d2f620e47c51\">sdbResult</a>","d2f620e47c51","sdbResult"]],"note":"","href":[],"parent":"b03c5ccd2f8f"}
{"id":"235f8a9e77af","children":["741ee9383b92","58dde3944536"],"depth":3,"text":"variables","link":[],"note":"複数属性が定義され、内容によって意味が変わる変数の解説","href":[],"parent":"d4369fcf4044"}
{"id":"741ee9383b92","children":[[]],"depth":4,"text":"where {Object|Function|string} 対象レコードの判定条件","link":[],"note":"- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。<code>{〜}</code> で囲みreturn文を付与。\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値\n- その他(Object,function,string以外) ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"235f8a9e77af"}
{"id":"58dde3944536","children":[[]],"depth":4,"text":"set {Object|Object[]|string|Function} 更新する値","link":[],"note":"set句の指定方法\n- Object ⇒ create/appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}\n- string ⇒ 上記Objectに変換可能なJSON文字列\n- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数\n  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}","href":[],"parent":"235f8a9e77af"}
{"id":"56eaf36cc785","children":["2df536ff0f8d","0055bda95f77","X000323","X000324","X000325"],"depth":3,"text":"用語解説、注意事項","link":[],"note":"","href":[],"parent":"d4369fcf4044"}
{"id":"2df536ff0f8d","children":[],"depth":4,"text":"関数での抽出条件・値の指定時の制約","link":[],"note":"default(sdbColumn), where, record(update他)では関数での指定を可能にしている。\nこれらをセル・メモで保存する場合、文字列に変換する必要があるが、以下のルールで対応する。\n\n- 引数は行オブジェクトのみ(引数は必ず一つ)\n- 関数に復元する場合`new Function('o',[ロジック部分文字列])`で関数化\n  - 必ず\"{〜}\"で囲み、return文を付ける\n- コメントは`//〜`または`/*〜*/`で指定。無指定の場合、前行の続きと看做す\n- 関数は一行で記述する(複数行は不可)","href":[],"parent":"56eaf36cc785"}
{"id":"0055bda95f77","children":[[]],"depth":4,"text":"commandの種類とrwdos文字列によるアクセス制御","link":[],"note":"commandの種類は下表の通り。\n\"rwdos\"とは\"Read/Write/Delete/Own/Schema\"の頭文字。管理者のみ実行可能な\"c\"(createTable)と特殊権限\"o\"を加えてシート毎のアクセス制御を行う。\n\n内容 | command | rwdos\n:-- | :-- | :-- \nテーブル生成 | create | c\n参照 | select | r\n更新 | update | rw\n追加 | append/insert | w\n削除 | delete | d\nテーブル管理情報取得 | schema | s","href":[],"parent":"56eaf36cc785"}
{"id":"X000323","children":[],"depth":4,"text":"特殊権限'o'","link":[],"note":"イベント申込情報等、本人以外の参照・更新を抑止するためのアクセス権限。\n\n- 自分のread/write(select,update)およびschemaのみ実行可。append/deleteは実行不可<br>\n  ∵新規登録(append)はシステム管理者の判断が必要。また誤ってdeleteした場合はappendが必要なのでこれも不可\n- o(=own set only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。\n- 対象テーブルはユーザ識別子項目をprimaryKeyとして要設定\n- 検索条件(where句)もprimaryKeyの値のみ指定可(Object,function,JSON他は不可)\n\n【旧仕様】\n- `userAuth:{シート名:o}`が指定された場合、当該シートのprimaryKey=userIdとなっているレコードのみ'r','w'可と看做す。\n- 'o'指定でselect/updateする場合、where句は無視され自情報に対する処理要求と看做す\n  ex. userId=2の人がuserId=1の人の氏名の更新を要求 ⇒ userId=2の氏名が更新される\n  ```\n  SpreadDb(\n    {table:'camp2024',command:'update',where:1,record:{'申込者氏名':'テスト'}},\n    {userId:2,userAuth:{camp2024:'o'}}\n  ); // -> userId=2の氏名が「テスト」に\n  ```","href":[],"parent":"56eaf36cc785"}
{"id":"X000324","children":[],"depth":4,"text":"クエリのエラーとレコードのエラー","link":[],"note":"- クエリのエラー\n  - 指定テーブルへのアクセス権が無い等、クエリ単位で発生するエラー\n  - \n  - command系メソッド内で予期せぬエラーが発生した場合(=戻り値がErrorオブジェクト)も該当<br>この場合、エラーコードにはError.messageがセットされる\n  - 主処理で判定\n  - SpreadDbの戻り値オブジェクトのErrCDに設定(sdbMain.ErrCD)\n  - エラーの種類\n    - No PrimaryKey: 権限\"o\"でappend先のテーブルに主キーが設定されていない\n    - No Authority: 対象テーブルに対するアクセス権が無い\n\n- レコードのエラー\n  - unique指定の有る項目に重複値を設定しようとした等、レコード単位で発生するエラー\n  - command系メソッドで判定(append, update, delete)\n  - 個別レコードのログオブジェクトのErrCDに設定(sdbLog.ErrCD = sdbMain.log.ErrCD)\n  - エラーの種類\n    - append\n      - Duplicate: unique項目に重複した値を設定。diffに{項目名:重複値} 形式で記録\n    - update\n    - delete","href":[],"parent":"56eaf36cc785"}
{"id":"X000325","children":["X000326","X000327","X000328",[]],"depth":4,"text":"エラーの種類","link":[],"note":"| No | 設定項目 | コード | 発生箇所 | 原因 |\n| --: | :-- | :-- | :-- | :-- |\n| 1 | qSts | No Authority | doQuery | 指定されたテーブル操作の権限が無い |\n| 2 | qSts | No command | doQuery | query.commandが無い、または文字列では無い |\n| 3 | qSts | No Table name | doQuery | query.tableが無い、または文字列では無い |\n| 4 | qSts | Invalid where clause | doQuery | (権限\"o\"で)where句の値がプリミティブ型ではない |\n| 5 | qSts | No Table | doQuery<br>genTable | (create以外で)対象テーブルが無い |\n| 6 | qSts | No cols and data | genTable | createで項目定義も初期データも無い |\n| 7 | qSts | Already Exist | createTable | シートが既に存在している |\n| 8 | qSts | Duplicate | createTable | 初期レコード内に重複が存在 |\n| 9 | qSts | Empty set | createTable<br>appendRow | query.setが不在、または配列の長さが0 |\n| 10 | qSts | Invalid set | appendRow | query.setが非配列なのに要素がオブジェクトではない |\n| 11 | qSts | No set | appendRow<br>updateRow | queryにメンバ\"set\"が不在 |\n| 12 | qSts | No where | deleteRow<br>updateRow | where句がqueryに無い |\n| 13 | qSts | Undefined Column | updateRow | 更新対象項目がテーブルに無い |\n| 14 | qSts | その他 | doQuery | エラーオブジェクトのmessage |\n| 15 | rSts | Duplicate | appendRow<br>updateRow | unique項目に重複した値を入れようとした |\n| 16 | Error | Invalid Argument | functionalyze | 不適切な引数 |\n| 17 | Error | Could not Lock | main | 規定回数以上シートのロックに失敗した |","href":[],"parent":"56eaf36cc785"}
{"id":"X000326","children":[],"depth":5,"text":"fatal error : ソース修正が必要な致命的エラー","link":[],"note":"SpreadDbからの戻り値はErrorオブジェクト。変更履歴シートには残らない。","href":[],"parent":"X000325"}
{"id":"X000327","children":[],"depth":5,"text":"warning error : データや権限の状態により発生するエラー","link":[],"note":"ソース修正は不要。SpreadDbからの戻り値は通常のオブジェクト。変更履歴シートに残る。","href":[],"parent":"X000325"}
{"id":"X000328","children":[],"depth":5,"text":"command系と非command系メソッドのエラー取扱の違い","link":[],"note":"command系は他関数からの被呼出メソッドのため、エラーをqStsに持たせるだけで実行停止につながるErrorオブジェクトは返さない。\n非command系はこの制約が無いため、通常通りErrorオブジェクトを返す。Errorオブジェクトの扱いはcommand系メソッドで吸収する。","href":[],"parent":"X000325"}
{"id":"d154b1fe324f","children":[],"depth":3,"text":"更新履歴","link":[],"note":"- rev.1.2.0 : 2025/01/04〜01/26\n  - 設計思想を「クエリ単位に必要な情報を付加して実行、結果もクエリに付加」に変更\n  - 変更履歴を「クエリの実行結果」と「(クエリ内の)レコードの実行結果」の二種類のレコードレイアウトを持つように変更\n  - エラー発生時、messageではなくエラーコードで返すよう変更\n  - 1つの処理要求(query)で複数レコードを対象とする場合、一レコードでもエラーが発生したらエラーに\n  - 変更履歴シートのUUIDは削除\n  - workflowyで作成した使用をmarkdown化する機能を追加\n  - queryにSpreadDb呼出元での突合用項目\"queryId\"を追加\n  \n- rev.1.1.0 : 2024/12/27\n  - 上・左余白不可、複数テーブル/シート不可に変更(∵ロジックが複雑で保守性低下)\n    - テーブル名とシート名が一致\n    - 左上隅のセルはA1に固定\n  - 「更新履歴」の各項目の並び・属性他について、シート上の変更は反映されない(システム側で固定)\n  - 各シートの権限チェックロジックを追加(opt.account)\n  - クロージャを採用(append/update/deleteをprivate関数化)\n    - select文を追加(従来のclass方式ではインスタンスから直接取得)\n    - インスタンスを返す方式から、指定された操作(query)の結果オブジェクトを返すように変更\n  - getSchemaメソッドを追加\n  - 旧版のgetLogは廃止(select文で代替)\n- 仕様の詳細は[workflowy](<a href=\"https://workflowy.com/#/4e03d2d2c266)参照\">https://workflowy.com/#/4e03d2d2c266)参照</a>","href":[],"parent":"d4369fcf4044"}
{"id":"X000329","children":["X000330","X000334","X000335","X000336","X000337"],"depth":2,"text":"class DebugTools","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000330","children":["X000331","X000332","X000333"],"depth":3,"text":"メンバ","link":[],"note":"","href":[],"parent":"X000329"}
{"id":"X000331","children":[],"depth":4,"text":"step : 関数・メソッド内の進捗状況管理番号","link":[],"note":"","href":[],"parent":"X000330"}
{"id":"X000332","children":[],"depth":4,"text":"seq : 実行された関数・メソッドの通番管理","link":[],"note":"","href":[],"parent":"X000330"}
{"id":"X000333","children":[],"depth":4,"text":"mode : debug, verbose, etc","link":[],"note":"","href":[],"parent":"X000330"}
{"id":"X000334","children":[],"depth":3,"text":"step() : stepを書き換える","link":[],"note":"","href":[],"parent":"X000329"}
{"id":"X000335","children":[],"depth":3,"text":"log() : 指定された変数の内容を出力する","link":[],"note":"","href":[],"parent":"X000329"}
{"id":"X000336","children":[],"depth":3,"text":"constructor()","link":[],"note":"","href":[],"parent":"X000329"}
{"id":"X000337","children":[],"depth":3,"text":"ゴミ箱","link":[],"note":"class DebugTools {\n  /**\n   * @param {Object} arg\n   * @param {string} arg.class=null - クラス名\n   * @param {string} arg.mode='debug'\n   */\n  constructor(arg){\n    this.step = 0;\n    this.seq = 0;\n    this.mode = arg.mode || 'debug';\n  }\n  step(arg){\n    this.step = arg;\n  }\n\n  /*\n  recursive(v,depth=0){\n    switch( this.whichType(v) ){\n      case 'Object':\n\n      case 'Array':\n    }\n  }\n  */\n  /**\n   * \n   * @param {Array|Array[]} arg \n   * @param {any} arg[0] - 変数。JSON.stringifyの第一引数\n   * @param {string[]}=null - JSON.stringfityの第二引数\n   * @param {number}=2 - JSON.stringifyの第三引数\n   * @returns \n   */\n  log(arg){\n    const v = {whois:<a href=\"http://this.constructor.name\">this.constructor.name</a>+'.log',step:0,rv:null};\n\n    if( !Array.isArray(arg[0]) ) arg = [arg];  // 配列可の引数は配列に統一\n\n    this.msg = [\n      (arg.class === null ? '' : arg.class + '.') + this.log.caller,\n    ];\n    for( v.i=0 ; v.i<arg.length ; v.i++ ){\n      //this.recursive(arg[v.i]);\n    }\n\n    v.step = 9; // 終了処理\n    return this.msg.join('\\n');\n  }\n  \n  whichType(){\n    let rv = String(Object.prototype.toString.call(arg).slice(8,-1));\n    switch(rv){\n      case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;\n      case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;\n    }\n    return rv;\n  }\n}","href":[],"parent":"X000329"}
{"id":"X000338","children":["X000339","X000340","X000344","X000345","X000346"],"depth":2,"text":"表記上の注意事項","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000339","children":[],"depth":3,"text":"バージョン番号は「抜本的見直し.インタフェース変更.デバッグ(インタフェース変更無し)」で採番","link":[],"note":"","href":[],"parent":"X000338"}
{"id":"X000340","children":["X000341","X000342","X000343"],"depth":3,"text":"typedefの命名規則(原則)","link":[],"note":"","href":[],"parent":"X000338"}
{"id":"X000341","children":[],"depth":4,"text":"当該オブジェクトを戻り値とする関数名","link":[],"note":"ex. SpreadDb","href":[],"parent":"X000340"}
{"id":"X000342","children":[],"depth":4,"text":"メソッドの場合、当該メソッドの戻り値をクラス名(略称可)＋メソッド名で命名","link":[],"note":"ex. sdbConstructor","href":[],"parent":"X000340"}
{"id":"X000343","children":[],"depth":4,"text":"引数オブジェクトに命名する場合、関数名＋'_'＋引数名","link":[],"note":"ex. sdbConstructor_query","href":[],"parent":"X000340"}
{"id":"X000344","children":[],"depth":3,"text":"","link":[],"note":"","href":[],"parent":"X000338"}
{"id":"X000345","children":[],"depth":3,"text":"記憶領域(localStorage/DocumentProperties)は引数化、引数はメンバ化、メンバは内部変数化し、メソッド内では内部変数のみ使用","link":[],"note":"","href":[],"parent":"X000338"}
{"id":"X000346","children":[],"depth":3,"text":"「記憶領域⊆引数⊆メンバ⊆内部変数」なので、記憶領域/引数/メンバ/内部変数には差分のみ記載","link":[],"note":"","href":[],"parent":"X000338"}
{"id":"X000347","children":["X000348","X000358","X000376","X000377"],"depth":2,"text":"encryptedQuery 2.0.0","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000348","children":["X000349","X000350","X000351","X000352","X000353","X000354","X000355","X000356","X000357"],"depth":3,"text":"ユーザ一覧","link":[],"note":"","href":[],"parent":"X000347"}
{"id":"X000349","children":[],"depth":4,"text":"userId {string|number} ユーザ識別子(primaryKey)","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000350","children":[],"depth":4,"text":"name {string} ユーザの氏名","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000351","children":[],"depth":4,"text":"email {string} ユーザのメールアドレス(unique)","link":[],"note":"複数アカウントでの同一メアド共有は不許可","href":[],"parent":"X000348"}
{"id":"X000352","children":[],"depth":4,"text":"phone {string} ユーザの電話番号","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000353","children":[],"depth":4,"text":"address {string} ユーザの住所","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000354","children":[],"depth":4,"text":"note {string} 備考","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000355","children":[],"depth":4,"text":"created {string} ユーザ登録日時","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000356","children":[],"depth":4,"text":"updated {string} 最終更新日時","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000357","children":[],"depth":4,"text":"deleted {string} 論理削除日時","link":[],"note":"","href":[],"parent":"X000348"}
{"id":"X000358","children":["X000359","X000360","X000361","X000362","X000363","X000370","X000371","X000372","X000373","X000374","X000375"],"depth":3,"text":"状態管理","link":[],"note":"ユーザに関する情報の内、ユーザに閲覧・編集させない項目","href":[],"parent":"X000347"}
{"id":"X000359","children":[],"depth":4,"text":"userId {string|number} ユーザ識別子(primaryKey)","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000360","children":[],"depth":4,"text":"note {string} 備考","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000361","children":[],"depth":4,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000362","children":[],"depth":4,"text":"authority {JSON} シート毎のアクセス権限。<code>{シート名:rwdos文字列}</code> 形式","link":[],"note":"r:read, a:append, u:update, d:delete, o:own only(自IDのみ参照・変更可)","href":[],"parent":"X000358"}
{"id":"X000363","children":["X000364","X000365","X000366"],"depth":4,"text":"trial {JSON} ログイン試行関連情報","link":[],"note":"新規試行開始時にクリア","href":[],"parent":"X000358"}
{"id":"X000364","children":[],"depth":5,"text":"passcode {number} 設定されたパスコード","link":[],"note":"","href":[],"parent":"X000363"}
{"id":"X000365","children":[],"depth":5,"text":"datetime {string} パスコード通知メール送信日時","link":[],"note":"パスコード要求(client)>要求受領(server)>パスコード生成>通知メール送信の内、メール送信日時","href":[],"parent":"X000363"}
{"id":"X000366","children":["X000367","X000368","X000369"],"depth":5,"text":"log {Object[]} 試行履歴情報","link":[],"note":"","href":[],"parent":"X000363"}
{"id":"X000367","children":[],"depth":6,"text":"t {string} パスコード検証日時","link":[],"note":"","href":[],"parent":"X000366"}
{"id":"X000368","children":[],"depth":6,"text":"v {number} ユーザが入力したパスコード","link":[],"note":"","href":[],"parent":"X000366"}
{"id":"X000369","children":[],"depth":6,"text":"c {number} エラーコード","link":[],"note":"01: アカウント凍結中(凍結解除後、再試行可)\n02: ログイン権限無し(authorityが空オブジェクト)\n03: CPkey有効期限切れ\n04: CPkey有効期間内なのに署名と登録CPkeyが一致しない\n05: パスコード有効期限切れ\n06: パスコード有効期限内なのにパスコード不一致\n99: その他(システムエラー他)","href":[],"parent":"X000366"}
{"id":"X000370","children":[],"depth":4,"text":"unfreezing {string} 凍結解除日時。通常undefined、凍結時にメンバ追加","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000371","children":[],"depth":4,"text":"expiry {string} CPkey有効期限","link":[],"note":"期限内に適切な暗号化・署名された要求はOKとする","href":[],"parent":"X000358"}
{"id":"X000372","children":[],"depth":4,"text":"lastSync {string} 前回同期日時","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000373","children":[],"depth":4,"text":"created {string} ユーザ登録日時","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000374","children":[],"depth":4,"text":"updated {string} 最終更新日時","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000375","children":[],"depth":4,"text":"deleted {string} 論理削除日時","link":[],"note":"","href":[],"parent":"X000358"}
{"id":"X000376","children":[],"depth":3,"text":"class eqTrial","link":[],"note":"","href":[],"parent":"X000347"}
{"id":"X000377","children":["X000378"],"depth":3,"text":"class encryptedQueryServer","link":[],"note":"","href":[],"parent":"X000347"}
{"id":"X000378","children":["X000379","X000392","X000396"],"depth":4,"text":"front()","link":[],"note":"","href":[],"parent":"X000377"}
{"id":"X000379","children":["X000380","X000381","X000384","X000385","X000386","X000387","X000388","X000389","X000390","X000391"],"depth":5,"text":"概要","link":[],"note":"以下の各条件をtry〜catchで囲む","href":[],"parent":"X000378"}
{"id":"X000380","children":[],"depth":6,"text":"userIdが登録されている","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000381","children":["X000382","X000383"],"depth":6,"text":"引数に<code>CPkey</code> が平文で存在する","link":[],"note":"⇒ パスコード通知メール発行要求","href":[],"parent":"X000379"}
{"id":"X000382","children":[],"depth":7,"text":"前回パスコード通知メール発行から10分未満","link":[],"note":"⇒ 何もしない","href":[],"parent":"X000381"}
{"id":"X000383","children":[],"depth":7,"text":"前回凍結期間から60分未満","link":[],"note":"ここまで来るのは当然に「前回パスコード通知メール発行から10分以上経過」","href":[],"parent":"X000381"}
{"id":"X000384","children":[],"depth":6,"text":"tokenがSSkeyで復号可能","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000385","children":[],"depth":6,"text":"tokenの署名がシートに登録されているCPkeyと一致","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000386","children":[],"depth":6,"text":"シートに登録されているCPkeyが有効期限内","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000387","children":[],"depth":6,"text":"要求内容がauthority","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000388","children":[],"depth":6,"text":"要求内容がgetLog","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000389","children":[],"depth":6,"text":"要求内容がappend or update or delete","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000390","children":[],"depth":6,"text":"シート上のauthorityで権限あり","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000391","children":[],"depth":6,"text":"","link":[],"note":"","href":[],"parent":"X000379"}
{"id":"X000392","children":["X000393"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000378"}
{"id":"X000393","children":["X000394","X000395"],"depth":6,"text":"arg {Object}","link":[],"note":"","href":[],"parent":"X000392"}
{"id":"X000394","children":[],"depth":7,"text":"userId {string}","link":[],"note":"","href":[],"parent":"X000393"}
{"id":"X000395","children":[],"depth":7,"text":"request","link":[],"note":"","href":[],"parent":"X000393"}
{"id":"X000396","children":["X000397","X000398"],"depth":5,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000378"}
{"id":"X000397","children":[],"depth":6,"text":"result {boolean} true:成功","link":[],"note":"","href":[],"parent":"X000396"}
{"id":"X000398","children":[],"depth":6,"text":"message {string} エラーメッセージ","link":[],"note":"","href":[],"parent":"X000396"}
{"id":"X000399","children":["X000400","X000418","X000492","X000589","X000744","X000754","X000755"],"depth":2,"text":"[old]encryptedQuery 2.0.0","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000400","children":["X000401","X000406"],"depth":3,"text":"開発の動機","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000401","children":["X000402","X000404","X000405"],"depth":4,"text":"要改善点","link":[],"note":"","href":[],"parent":"X000400"}
{"id":"X000402","children":["X000403"],"depth":5,"text":"レスポンスが遅い","link":[],"note":"","href":[],"parent":"X000401"}
{"id":"X000403","children":[],"depth":6,"text":"全データを暗号化した上で授受しているため(?)","link":[],"note":"","href":[],"parent":"X000402"}
{"id":"X000404","children":[],"depth":5,"text":"複数シートにまたがる更新ができない(しづらい)","link":[],"note":"ex.参加者リストに追加時に参加者数集計シートも併せて更新等(シート関数を噛ませると遅くなるので、参加者リスト更新と同時に参加者数集計シートも更新しておきたい)","href":[],"parent":"X000401"}
{"id":"X000405","children":[],"depth":5,"text":"シート毎に権限設定ができない","link":[],"note":"ex.掲示板シートはOKだが参加者リストは参照不可にする、等","href":[],"parent":"X000401"}
{"id":"X000406","children":["X000407","X000408","X000409","X000410","X000411","X000412","X000413","X000414","X000415","X000416"],"depth":4,"text":"追加・変更する点","link":[],"note":"","href":[],"parent":"X000400"}
{"id":"X000407","children":[],"depth":5,"text":"暗号化対象を全データからトークンのみに変更","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000408","children":[],"depth":5,"text":"clientに仮想シート(≒テーブル)を持たせ、server(Spread Sheet)と同期させる","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000409","children":[],"depth":5,"text":"同期をとるために授受するデータを、全件から前回同期後に変更された部分のみに変更","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000410","children":[],"depth":5,"text":"auth機能を追加","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000411","children":[],"depth":5,"text":"callbackに加え、テーブルのCRUDに特化したメソッドを用意","link":[],"note":"※CRUDのみだとbulkMailのような「サーバ側で抽出結果を基に行う」処理ができなくなるため、callbackは残す","href":[],"parent":"X000406"}
{"id":"X000412","children":[],"depth":5,"text":"一回のリクエストで複数テーブルのCRUDに対応","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000413","children":[],"depth":5,"text":"更新結果は専用のシート(\"log\"シート)に追記していく","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000414","children":[],"depth":5,"text":"テーブル毎に「参照のみ」「参照＋更新」権限を設定可能にする","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000415","children":[],"depth":5,"text":"掲示板等、自動同期機能を追加","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000416","children":["X000417"],"depth":5,"text":"機能を簡素化","link":[],"note":"","href":[],"parent":"X000406"}
{"id":"X000417","children":[],"depth":6,"text":"pKeyを必須とし、更新対象はこれで特定可能にする","link":[],"note":"","href":[],"parent":"X000416"}
{"id":"X000418","children":["X000419","X000471","X000474","X000486"],"depth":3,"text":"class encryptedQuery","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000419","children":["X000420","X000421","X000422","X000423","X000424","X000425","X000426","X000427","X000428",[]],"depth":4,"text":"メンバ","link":[],"note":"encryptedQueryClient/Server共通の既定値","href":[],"parent":"X000418"}
{"id":"X000420","children":[],"depth":5,"text":"validityPeriod {number}=1日 最終ログイン日時からのログイン有効期間","link":[],"note":"ログインは基本的にセッション有効期間とするが、有効期間を超えた場合は再ログインを必要とする","href":[],"parent":"X000419"}
{"id":"X000421","children":[],"depth":5,"text":"graceTime {number}=10分 メール送信〜パスコード確認処理終了までの猶予時間(ミリ秒)","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000422","children":[],"depth":5,"text":"passcodeValidityPeriod {number}=600000(10分) パスコードの有効期間。ミリ秒","link":[],"note":"メール送信〜受領〜パスコード入力〜送信〜確認処理終了までの時間。通信に係る時間も含む。不正防止のため、始点/終点ともサーバ側で時刻を設定する。","href":[],"parent":"X000419"}
{"id":"X000423","children":[],"depth":5,"text":"maxTrial {number}=3 パスコード入力の最大試行回数","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000424","children":[],"depth":5,"text":"passcodeDigit {number}=6  パスコードの桁数","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000425","children":[],"depth":5,"text":"freezing {number}=3600000 連続失敗した場合の凍結期間。ミリ秒。既定値1時間","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000426","children":[],"depth":5,"text":"syncInterval {number}=0 自動更新する場合の間隔(ミリ秒)。0なら自動更新しない","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000427","children":[],"depth":5,"text":"bits {number}=1024 鍵長","link":[],"note":"","href":[],"parent":"X000419"}
{"id":"X000428","children":["X000429","X000454","X000467"],"depth":5,"text":"tables {Object} {領域名:定義Obj}形式のテーブル構成定義","link":[],"note":"①使用可能なデータ型はAlaSQL\"<a href=\"https://github.com/AlaSQL/alasql/wiki/Data%20types\">Data </a><a href=\"https://github.com/AlaSQL/alasql/wiki/Data%20types\">Type</a><a href=\"https://github.com/AlaSQL/alasql/wiki/Data%20types\">s</a>\"に準拠\n②ユーザのe-mail等、unique属性が付加された項目はクライアント側でのappend/update時にチェック\n③append時に既定値を設定したい場合、defaultで指定","href":[],"parent":"X000419"}
{"id":"X000429","children":["X000430"],"depth":6,"text":"accounts {Object} アカウント一覧","link":[],"note":"","href":[],"parent":"X000428"}
{"id":"X000430","children":["X000431","X000432","X000433","X000434","X000435","X000436","X000437","X000438","X000439","X000440","X000449","X000450","X000451","X000452","X000453",[]],"depth":7,"text":"definition {Object[]} 項目定義","link":[],"note":"","href":[],"parent":"X000429"}
{"id":"X000431","children":[],"depth":8,"text":"システム項目 : 更新があってもログに出力しない","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000432","children":[],"depth":8,"text":"uuid {string} ユーザの主キー","link":[],"note":"{label:'uuid',type:'uuid',suffix:'primary key'}","href":[],"parent":"X000430"}
{"id":"X000433","children":[],"depth":8,"text":"name {string} ユーザ名","link":[],"note":"{label:'name',type:'text',default:'(未設定)'}","href":[],"parent":"X000430"}
{"id":"X000434","children":[],"depth":8,"text":"email {string} ユーザのメールアドレス","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000435","children":[],"depth":8,"text":"phone {string} 連絡先電話番号","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000436","children":[],"depth":8,"text":"role {string} ユーザの役割(=setup()で定義された付与するアクセス権限)","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000437","children":[],"depth":8,"text":"CPkey {string} ユーザの公開鍵","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000438","children":[],"depth":8,"text":"lastSync {string} 最終同期日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000439","children":[],"depth":8,"text":"lastLogin {string} 最終ログイン日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000440","children":["X000441","X000442","X000443","X000444"],"depth":8,"text":"trial {Object} ログイン試行関係情報","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000441","children":[],"depth":9,"text":"passcode {number} 最新のパスコード","link":[],"note":"","href":[],"parent":"X000440"}
{"id":"X000442","children":[],"depth":9,"text":"created {string} パスコード生成日時","link":[],"note":"=最終パスコード通知メール送信日時","href":[],"parent":"X000440"}
{"id":"X000443","children":[],"depth":9,"text":"lastTrial {string} 最終パスコード通知メール送信日時","link":[],"note":"","href":[],"parent":"X000440"}
{"id":"X000444","children":["X000445","X000446","X000447","X000448"],"depth":9,"text":"log {Object[]} ログイン試行のログ","link":[],"note":"unshiftで常に0が最新、新規パスコード生成時にクリア。","href":[],"parent":"X000440"}
{"id":"X000445","children":[],"depth":10,"text":"timestamp {string} パスコード入力日時。クライアント側で設定","link":[],"note":"","href":[],"parent":"X000444"}
{"id":"X000446","children":[],"depth":10,"text":"entered {number} ユーザが入力したパスコード","link":[],"note":"","href":[],"parent":"X000444"}
{"id":"X000447","children":[],"depth":10,"text":"status {number} 試行結果","link":[],"note":"0: パスコード新規発行\n1: ログイン成功\n2: パスコード不一致(再試行可)\n4: パスコード不一致(再試行不可、凍結に移行)\n5: ログイン権限無し\n6: アカウント凍結中\n7: 不適切な署名\n8: その他(システムエラー他。エラーメッセージ参照)","href":[],"parent":"X000444"}
{"id":"X000448","children":[],"depth":10,"text":"message {string} エラーメッセージ","link":[],"note":"","href":[],"parent":"X000444"}
{"id":"X000449","children":[],"depth":8,"text":"begin {string} アカウントの有効期間開始日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000450","children":[],"depth":8,"text":"end {string} アカウントの有効期間終了日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000451","children":[],"depth":8,"text":"create {string} アカウント生成日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000452","children":[],"depth":8,"text":"update {string} アカウント更新日時","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000453","children":[],"depth":8,"text":"delete {string} アカウント削除日時(論理削除)","link":[],"note":"","href":[],"parent":"X000430"}
{"id":"X000454","children":["X000455"],"depth":6,"text":"log {Object} 更新履歴","link":[],"note":"","href":[],"parent":"X000428"}
{"id":"X000455","children":["X000456","X000457","X000458","X000459","X000460","X000461","X000462","X000463","X000464","X000465","X000466",[]],"depth":7,"text":"definition {Object[]} 項目定義","link":[],"note":"","href":[],"parent":"X000454"}
{"id":"X000456","children":[],"depth":8,"text":"timestamp {string} 更新日時","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000457","children":[],"depth":8,"text":"uuid {string} 更新者のuuid","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000458","children":[],"depth":8,"text":"result {number} front()の処理結果。<a href=\"https://workflowy.com/#/078054b626eb\">result</a>参照","link":[["<a href=\"https://workflowy.com/#/078054b626eb\">result</a>","078054b626eb","result"]],"note":"","href":[],"parent":"X000455"}
{"id":"X000459","children":[],"depth":8,"text":"message {string} エラーメッセージ。エラー発生時以外は空白","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000460","children":[],"depth":8,"text":"branch {string} 要求された処理名。append/update/delete等","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000461","children":[],"depth":8,"text":"arg {string} 要求された処理に渡した引数オブジェクトのJSON","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000462","children":[],"depth":8,"text":"rv {string} 要求された処理から返された値。Object/ArrayならJSON化","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000463","children":[],"depth":8,"text":"table {string} 更新対象となった範囲名(テーブル名)","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000464","children":[],"depth":8,"text":"before {string} 更新前の行データオブジェクト(JSON)","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000465","children":[],"depth":8,"text":"after {string} 更新後の行データオブジェクト(JSON)","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000466","children":[],"depth":8,"text":"diff {string} 差分情報。{差分項目名：[更新前,更新後],...}形式","link":[],"note":"","href":[],"parent":"X000455"}
{"id":"X000467","children":["X000468","X000469","X000470"],"depth":6,"text":"その他(ユーザ定義シート) {Object[]}","link":[],"note":"クライアント側のcreate tableで使用する各項目の定義","href":[],"parent":"X000428"}
{"id":"X000468","children":[],"depth":7,"text":"label {string} 項目名","link":[],"note":"","href":[],"parent":"X000467"}
{"id":"X000469","children":[],"depth":7,"text":"type {string} データ型","link":[],"note":"","href":[],"parent":"X000467"}
{"id":"X000470","children":[],"depth":7,"text":"suffix {string} \"not null\"等の制約、他","link":[],"note":"","href":[],"parent":"X000467"}
{"id":"X000471","children":["X000472"],"depth":4,"text":"constructor()","link":[],"note":"","href":[],"parent":"X000418"}
{"id":"X000472","children":["X000473"],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000471"}
{"id":"X000473","children":[],"depth":6,"text":"config, arg, 既定値(v.default)をマージ、メンバとしてthisに保存","link":[],"note":"","href":[],"parent":"X000472"}
{"id":"X000474","children":["X000475","X000477","X000480"],"depth":4,"text":"encToken()","link":[],"note":"","href":[],"parent":"X000418"}
{"id":"X000475","children":["X000476"],"depth":5,"text":"注意事項","link":[],"note":"","href":[],"parent":"X000474"}
{"id":"X000476","children":[],"depth":6,"text":"自局の秘密鍵、相手局の公開鍵はメンバとして保存済の前提(this.sKey, this.pKey)","link":[],"note":"","href":[],"parent":"X000475"}
{"id":"X000477","children":["X000478","X000479"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000474"}
{"id":"X000478","children":[],"depth":6,"text":"sKey {Object} 自局の秘密鍵","link":[],"note":"","href":[],"parent":"X000477"}
{"id":"X000479","children":[],"depth":6,"text":"pKey {string} 相手局の公開鍵","link":[],"note":"","href":[],"parent":"X000477"}
{"id":"X000480","children":["X000481","X000482","X000483","X000484","X000485"],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000474"}
{"id":"X000481","children":[],"depth":6,"text":"基となるオブジェクトを作成","link":[],"note":"","href":[],"parent":"X000480"}
{"id":"X000482","children":[],"depth":6,"text":"Obj -&gt; JSON(JSON.stringify)","link":[],"note":"","href":[],"parent":"X000480"}
{"id":"X000483","children":[],"depth":6,"text":"JSON -&gt; BASE64(await this.encB64)","link":[],"note":"","href":[],"parent":"X000480"}
{"id":"X000484","children":[],"depth":6,"text":"BASE64 -&gt; 暗号化・署名(cryptico.encrypt)","link":[],"note":"","href":[],"parent":"X000480"}
{"id":"X000485","children":[],"depth":6,"text":"暗号文 -&gt; URLセーフ(encodeURIComponent)","link":[],"note":"","href":[],"parent":"X000480"}
{"id":"X000486","children":["X000487"],"depth":4,"text":"decToken()","link":[],"note":"","href":[],"parent":"X000418"}
{"id":"X000487","children":["X000488","X000489","X000490","X000491"],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000486"}
{"id":"X000488","children":[],"depth":6,"text":"URLセーフ -&gt; 暗号文(decodeURIComponent)","link":[],"note":"","href":[],"parent":"X000487"}
{"id":"X000489","children":[],"depth":6,"text":"暗号文 -&gt; BASE64(cryptico.decrypt)","link":[],"note":"","href":[],"parent":"X000487"}
{"id":"X000490","children":[],"depth":6,"text":"BASE64 -&gt; JSON(await this.decB64)","link":[],"note":"","href":[],"parent":"X000487"}
{"id":"X000491","children":[],"depth":6,"text":"JSON -&gt; Obj(JSON.parse)","link":[],"note":"","href":[],"parent":"X000487"}
{"id":"X000492","children":["X000493","X000495"],"depth":3,"text":"クライアント側の構成","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000493","children":["X000494"],"depth":4,"text":"localStorage","link":[],"note":"sessionStorageはオンメモリと寿命が変わらないため、使用しない","href":[],"parent":"X000492"}
{"id":"X000494","children":[],"depth":5,"text":"uuid {string} 利用者識別子","link":[],"note":"同一メアドでの複数アカウント利用も考えられるので、識別子はe-mailとは別に設定可能とする","href":[],"parent":"X000493"}
{"id":"X000495","children":["X000496","X000508","X000518","X000528","X000544","X000553","X000565","X000579","X000580","X000581","X000585","X000587"],"depth":4,"text":"class encryptedQueryClient extends encryptedQuery","link":[],"note":"","href":[],"parent":"X000492"}
{"id":"X000496","children":["X000497","X000498","X000499","X000500","X000501","X000502","X000503","X000504","X000505","X000506"],"depth":5,"text":"メンバ(インスタンス変数)","link":[],"note":"本項は導出項目のみ。CL/SV共通[メンバ</a>、constructtorの<a href=\"https://workflowy.com/#/10d03345527e\">引数 ](#7567bf629d85)は除く。","href":["7567bf629d85"],"parent":"X000495"}
{"id":"X000497","children":[],"depth":6,"text":"uuid {number} 利用者識別子","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000498","children":[],"depth":6,"text":"lastSync {string}='1970-01-01' 前回同期日時。初期値はundefined","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000499","children":[],"depth":6,"text":"lastLogin {string}='1970-01-01' 前回ログイン日時","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000500","children":[],"depth":6,"text":"lastRequest {string}='1970-01-01' 前回パスコード通知メール発行要求日時","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000501","children":[],"depth":6,"text":"thawing {string}='1970-01-01' 凍結解除日時","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000502","children":[],"depth":6,"text":"keyGenerate {string} クライアント側鍵ペアの生成日時","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000503","children":[],"depth":6,"text":"CSkey {Object} クライアント側秘密鍵","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000504","children":[],"depth":6,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000505","children":[],"depth":6,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000506","children":["X000507"],"depth":6,"text":"tables {Object} {領域名:以下メンバを持つオブジェクト}形式","link":[],"note":"","href":[],"parent":"X000496"}
{"id":"X000507","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/561b163cd0d7\">クライアント側テーブル用データ</a>","link":[["<a href=\"https://workflowy.com/#/561b163cd0d7\">クライアント側テーブル用データ</a>","561b163cd0d7","クライアント側テーブル用データ"]],"note":"","href":[],"parent":"X000506"}
{"id":"X000508","children":["X000509","X000512"],"depth":5,"text":"constructor()","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000509","children":["X000510","X000511"],"depth":6,"text":"引数 : 以下のメンバを持つオブジェクト","link":[],"note":"","href":[],"parent":"X000508"}
{"id":"X000510","children":[],"depth":7,"text":"prjName {string}='encryptedQuery' localStorageのキー名","link":[],"note":"","href":[],"parent":"X000509"}
{"id":"X000511","children":[],"depth":7,"text":"api {string} サーバ側WebAPIのURL","link":[],"note":"","href":[],"parent":"X000509"}
{"id":"X000512","children":["X000513","X000514","X000515","X000516","X000517"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000508"}
{"id":"X000513","children":[],"depth":7,"text":"uuidの特定","link":[],"note":"if( URLクエリ文字列にID指定あり ){\n  idにURLクエリ文字列のID指定を設定\n} else if( localStorageにIDが存在 ){\n  idにlocalStorageのIDを設定\n} else {\n  for( 試行回数(this.maxTrial)=0 ; 0≦試行回数<3 ; 試行回数++ ){\n    id入力ダイアログを表示\n    if( 入力されたidが適切な形式 ) 試行回数=-1\n  }\n  if( 試行回数 === -1 ){\n    idに入力されたidを設定\n  } else {\n    this.thawingに凍結解除日時を設定\n  }\n}","href":[],"parent":"X000512"}
{"id":"X000514","children":[],"depth":7,"text":"引数・既定値からメンバを設定","link":[],"note":"","href":[],"parent":"X000512"}
{"id":"X000515","children":[],"depth":7,"text":"クライアント側鍵ペアの作成","link":[],"note":"v.step = 1.1; // 鍵ペアの作成\nv.password = createPassword();\nif( v.password instanceof Error ) throw v.password;\nv.key = cryptico.generateRSAKey(v.password,this.bits);\n\nv.step = 1.2; // メンバ変数に格納\nthis.keyGenerate = Date.now();\nthis.CPkey = cryptico.publicKeyString(v.key);\nthis.CSkey = JSON.stringify(v.key.toJSON()),  // 文字列化された秘密鍵","href":[],"parent":"X000512"}
{"id":"X000516","children":[],"depth":7,"text":"SPkey未入手ならauthorize呼び出し","link":[],"note":"","href":[],"parent":"X000512"}
{"id":"X000517","children":[],"depth":7,"text":"this.tablesに基づき各種テーブルを作成","link":[],"note":"","href":[],"parent":"X000512"}
{"id":"X000518","children":["X000519","X000526","X000527"],"depth":5,"text":"authorize() : サーバ側のauth1/2を呼び出し、一連のログイン関係処理を行う","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000519","children":["X000520","X000521","X000522"],"depth":6,"text":"概要","link":[],"note":"// パスコード通知メール発行要求\nif( idが凍結中 ){\n  throw new Error('現在凍結中です')\n} else if( 前回のパスコード通知メール発行要求日時(lastRequest)から10分以上経過 ){\n  サーバ側にパスコード通知メール発行要求(v.eq.request(auth1))\n  lastRequestに現在日時設定\n}\n\n// パスコード入力\nfor( 適正形式=false,試行回数=0 ; 0≦試行回数<3 ; 試行回数++ ){\n  パスコード入力画面表示\n  パスコード入力\n  if( 適正形式(数値) ){\n    r = パスコード確認要求(auth2)\n    if( r = 正常終了 ){\n      初期画面表示\n      試行回数=-1\n    } else {\n      if( 恒久的エラー(ex.権限無し、CPkey不一致) ){\n        throw new Error(r.message)\n      }\n      // 非恒久的エラー(再試行可能なエラー)：パスコード不一致\n    }\n  }\n}\nif( 試行回数 != -1 ){\n  throw new Error('試行回数を超えたので凍結します')\n}","href":[],"parent":"X000518"}
{"id":"X000520","children":[],"depth":7,"text":"パスコード通知メール発行要求","link":[],"note":"if( idが凍結中 ){  ※ this.thawing > Date.now()\n  throw new Error('現在凍結中です')\n} else if( 前回のパスコード通知メール発行要求日時から10分以上経過 ){\n  // this.lastRequest + this.passcodeValidityPeriod < Date.now()\n  サーバ側にパスコード通知メール発行要求(v.eq.front(auth1))\n  lastRequestに現在日時設定\n}","href":[],"parent":"X000519"}
{"id":"X000521","children":[],"depth":7,"text":"パスコード入力","link":[],"note":"for( 適正形式=false,試行回数=0 ; 0≦試行回数<3 ; 試行回数++ ){\n  パスコード入力画面表示\n  パスコード入力\n  if( 適正形式(数値) ){\n    r = パスコード確認要求(auth2)\n    if( r = 正常終了 ){\n      試行回数=-1\n    } else {\n      if( 恒久的エラー(ex.権限無し、CPkey不一致) ){\n        throw new Error(r.message)\n      }\n      // 非恒久的エラー(再試行可能なエラー)：パスコード不一致\n    }\n  }\n}\nif( 試行回数 != -1 ){\n  throw new Error('試行回数を超えたので凍結します')\n}","href":[],"parent":"X000519"}
{"id":"X000522","children":["X000523","X000524","X000525"],"depth":7,"text":"this.tablesに初期テーブルデータをセット","link":[],"note":"auth2正常終了時の戻り値.tablesをメンバとして保存","href":[],"parent":"X000519"}
{"id":"X000523","children":[],"depth":8,"text":"<a href=\"https://workflowy.com/#/561b163cd0d7\">クライアント側初期テーブル用データ</a>の構成","link":[["<a href=\"https://workflowy.com/#/561b163cd0d7\">クライアント側初期テーブル用データ</a>","561b163cd0d7","クライアント側初期テーブル用データ"]],"note":"","href":[],"parent":"X000522"}
{"id":"X000524","children":[],"depth":8,"text":"this.tablesに基づきcreate tableを実行","link":[],"note":"accounts.trial, logテーブルは作成対象外。","href":[],"parent":"X000522"}
{"id":"X000525","children":[],"depth":8,"text":"auth2の<a href=\"https://workflowy.com/#/5ed89bf06f52\">戻り値</a>に基づきデータをセット","link":[["<a href=\"https://workflowy.com/#/5ed89bf06f52\">戻り値</a>","5ed89bf06f52","戻り値"]],"note":"","href":[],"parent":"X000522"}
{"id":"X000526","children":[],"depth":6,"text":"引数 : 無し","link":[],"note":"","href":[],"parent":"X000518"}
{"id":"X000527","children":[],"depth":6,"text":"戻り値 : null | Error","link":[],"note":"","href":[],"parent":"X000518"}
{"id":"X000528","children":["X000529","X000538","X000541","X000543"],"depth":5,"text":"request() : encryptedQueryServer.front()に対して処理要求を行う","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000529","children":["X000530","X000531","X000534","X000535","X000536","X000537"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000528"}
{"id":"X000530","children":[],"depth":7,"text":"tokenの作成、暗号化(this.encToken)","link":[],"note":"","href":[],"parent":"X000529"}
{"id":"X000531","children":["X000532","X000533"],"depth":7,"text":"encryptedQueryServer.front()への<a href=\"https://workflowy.com/#/dd958d471b6a\">引数</a>を作成","link":[["<a href=\"https://workflowy.com/#/dd958d471b6a\">引数</a>","dd958d471b6a","引数"]],"note":"","href":[],"parent":"X000529"}
{"id":"X000532","children":[],"depth":8,"text":"request()への引数＋メンバからtokenを作成","link":[],"note":"","href":[],"parent":"X000531"}
{"id":"X000533","children":[],"depth":8,"text":"syncにはtrueを設定","link":[],"note":"this.syncIntervaleの値に関わらず、処理要求時は更新","href":[],"parent":"X000531"}
{"id":"X000534","children":[],"depth":7,"text":"doPostでfront()を呼び出し、<a href=\"https://workflowy.com/#/72b8e229c963\">戻り値</a>を取得","link":[["<a href=\"https://workflowy.com/#/72b8e229c963\">戻り値</a>","72b8e229c963","戻り値"]],"note":"","href":[],"parent":"X000529"}
{"id":"X000535","children":[],"depth":7,"text":"戻り値のtokenを復号(this.decToken)、SPkey未定ならthis.SPkeyに保存","link":[],"note":"","href":[],"parent":"X000529"}
{"id":"X000536","children":[],"depth":7,"text":"戻り値のlogを基にテーブルを更新(this.syncTables呼び出し)","link":[],"note":"","href":[],"parent":"X000529"}
{"id":"X000537","children":[],"depth":7,"text":"戻り値のdataを呼出元関数に返す","link":[],"note":"","href":[],"parent":"X000529"}
{"id":"X000538","children":["X000539","X000540"],"depth":6,"text":"引数","link":[],"note":"以下のメンバを持つオブジェクト。参考：encryptedQueryServer.front()の[引数](#dd958d471b6a)","href":["dd958d471b6a"],"parent":"X000528"}
{"id":"X000539","children":[],"depth":7,"text":"branch {string} 要求処理名。ex.\"auth1\"","link":[],"note":"","href":[],"parent":"X000538"}
{"id":"X000540","children":[],"depth":7,"text":"data {string} 要求処理(メソッド)に渡す引数オブジェクトのJSON","link":[],"note":"","href":[],"parent":"X000538"}
{"id":"X000541","children":["X000542"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000528"}
{"id":"X000542","children":[],"depth":7,"text":"data {Object} 要求処理結果。平文","link":[],"note":"","href":[],"parent":"X000541"}
{"id":"X000543","children":[],"depth":6,"text":"v.1.0.0 source","link":[],"note":"/** request: クライアント->サーバ側への処理要求\n * \n * @param {string|Object} arg - サーバ側で分岐処理を行うコールバック関数に渡す引数\n * @returns \n */\nasync request(arg=this.CPkey){\n  const v = {whois:<a href=\"http://this.constructor.name\">this.constructor.name</a>+'.request',step:0,rv:null};\n  console.log(`${v.whois} start.\\narg(${whichType(arg)})=${stringify(arg)}`);\n  try {\n\n    // -------------------------------------------------\n    // step.1 : 問合せ先URL(WebAPI+param)を作成\n    // -------------------------------------------------\n\n    v.step = 1.1; // 平文か暗号文か判定。サーバ側公開鍵取得済なら暗号文とする。\n    v.isPlain = this.SPkey === null ? true : false;\n    vlog(v,'isPlain');\n\n    v.step = 1.2; // responseで署名検証のためにIDが必要なので付加し、JSON化\n    v.json = JSON.stringify({id:this.clientId,arg:arg});\n    vlog(v,'json');\n\n    v.step = 1.3; // base64化\n    v.b64 = await this.encB64(v.json);\n    vlog(v,'b64');\n\n    v.step = 1.4; // 暗号化\n    if( v.isPlain ){\n      v.str = v.b64;\n    } else {\n      v.enc = cryptico.encrypt(v.b64,this.SPkey,this.CSkey);\n      vlog(v,'enc');\n      if( v.enc.status !== 'success' ) throw new Error('encrypt failed.');\n      v.str = v.enc.cipher;\n    }\n\n    v.step = 1.5; // URLセーフ化\n    v.param = encodeURIComponent(v.str);\n    vlog(v,'param');\n\n    v.step = 1.6; // WebAPI+paramでURL作成\n    v.url = `${this.url}?${v.isPlain ? this.pUP : this.eUP}=${v.param}`;\n    vlog(v,'url');\n\n\n    // -------------------------------------------------\n    // step.2 : サーバ側に問合せ実行、結果検証\n    // -------------------------------------------------\n\n    v.step = 2.1; // 問合せの実行、ネットワークエラーなら弾く\n    v.r = await fetch(v.url,{\n      method: 'GET',\n      headers: {\n        \"Accept\": \"application/json\",\n        \"Content-Type\": \"text/plain\",\n      }\n    });\n    vlog(v,'r');\n    if( !v.r.ok ) throw new Error(`[fetch error] status=${v.r.status}`);\n\n    v.step = 2.2; // オブジェクト化\n    v.obj = await v.r.json();\n    vlog(v,'obj');\n\n    v.step = 2.3; // 分岐先関数では無く、response()で起きたエラーの場合はthrow\n    // ※分岐先関数でのエラーは本関数(response)の戻り値として本関数呼出元に返す\n    if( v.obj.isOK === false ){\n      throw new Error(v.obj.message);\n    }\n\n    v.step = 2.4;\n    v.res = v.obj.rv;\n    vlog(v,'res');\n\n\n    // -------------------------------------------------\n    // step.3 : 呼出元への戻り値の作成(結果の復号、署名検証)\n    // -------------------------------------------------\n\n    v.step = 3.1; // decrypt\n    v.dec = cryptico.decrypt(v.res,this.CSkey);\n    if( v.dec.status !== 'success' ){\n      throw new Error(`decrypt failed.\\n${stringify(v.dec)}`);\n    }\n\n    v.step = 3.2; // 署名検証、SPkeyが無ければ保存\n    if( v.dec.publicKeyString !== this.SPkey ){\n      if( this.SPkey === null ){\n        this.conf.SPkey = this.SPkey = v.dec.publicKeyString;\n        // sessionStorageに保存\n        sessionStorage.setItem(this.storageKey,JSON.stringify(this.conf));\n      } else {\n        throw new Error('サーバ側の署名が不正です');\n      }\n    }\n\n    v.step = 3.3; // base64 -> JSON\n    v.json = await this.decB64(v.dec.plaintext);\n\n    v.step = 3.4; // JSON -> Object\n    v.rv = this.objectizeJSON(v.json);\n    if( v.rv === null ){\n      throw new Error(`invalid JSON\\n${stringify(v.json)}`);\n    }\n\n\n    v.step = 9; // 終了処理\n    console.log(`${v.whois} normal end.\\nv.rv=${stringify(v.rv)}`);\n    return v.rv;\n\n  } catch(e) {\n    e.message = `${v.whois} abnormal end at step.${v.step}\\n${e.message}`;\n    console.error(`${e.message}\\nv=${stringify(v)}`);\n    return e;\n  }\n}","href":[],"parent":"X000528"}
{"id":"X000544","children":["X000545","X000550","X000552"],"depth":5,"text":"syncTables() : サーバ側テーブルの更新情報をローカルに反映","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000545","children":["X000546","X000547","X000548","X000549"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000544"}
{"id":"X000546","children":[],"depth":7,"text":"引数を順次走査","link":[],"note":"","href":[],"parent":"X000545"}
{"id":"X000547","children":[],"depth":7,"text":"①before, after両方存在 ⇒ diffを基に更新処理","link":[],"note":"","href":[],"parent":"X000545"}
{"id":"X000548","children":[],"depth":7,"text":"②before不存在 & after存在 ⇒ afterを追加","link":[],"note":"","href":[],"parent":"X000545"}
{"id":"X000549","children":[],"depth":7,"text":"③before存在 & after不存在 ⇒ 対象を削除","link":[],"note":"","href":[],"parent":"X000545"}
{"id":"X000550","children":["X000551"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000544"}
{"id":"X000551","children":[],"depth":7,"text":"request()の戻り値オブジェクトの<a href=\"https://workflowy.com/#/764e6d8b282a\">log {Object[]} 前回同期日時以降の\"log\"シート行データのJSON</a>","link":[["<a href=\"https://workflowy.com/#/764e6d8b282a\">log {Object[]} 前回同期日時以降の\"log\"シート行データのJSON</a>","764e6d8b282a","log {Object[]} 前回同期日時以降の\"log\"シート行データのJSON"]],"note":"","href":[],"parent":"X000550"}
{"id":"X000552","children":[],"depth":6,"text":"戻り値 : null | Error","link":[],"note":"","href":[],"parent":"X000544"}
{"id":"X000553","children":["X000554","X000558","X000562"],"depth":5,"text":"append() : 新規レコードを追加","link":[],"note":"サーバ側(シート)にpKeyが存在していた場合はエラーが返る","href":[],"parent":"X000495"}
{"id":"X000554","children":["X000555","X000556","X000557"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000553"}
{"id":"X000555","children":[],"depth":7,"text":"行オブジェクトの未定義項目に既定値を設定","link":[],"note":"type='uuid'である項目へのUUID採番を含む","href":[],"parent":"X000554"}
{"id":"X000556","children":[],"depth":7,"text":"クライアント側の対象テーブルにinsertを実行","link":[],"note":"ユーザのe-mail等、unique属性が付加された項目に重複した値が無いかチェック","href":[],"parent":"X000554"}
{"id":"X000557","children":[],"depth":7,"text":"request()でサーバ側のシートに追加要求","link":[],"note":"{branch:'append',data:insertしたデータオブジェクト}","href":[],"parent":"X000554"}
{"id":"X000558","children":["X000559"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000553"}
{"id":"X000559","children":["X000560","X000561"],"depth":7,"text":"arg {Object[]}","link":[],"note":"","href":[],"parent":"X000558"}
{"id":"X000560","children":[],"depth":8,"text":"range {string} 範囲名","link":[],"note":"","href":[],"parent":"X000559"}
{"id":"X000561","children":[],"depth":8,"text":"data {Object[]} 追加する行オブジェクトの配列","link":[],"note":"","href":[],"parent":"X000559"}
{"id":"X000562","children":["X000563","X000564"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000553"}
{"id":"X000563","children":[],"depth":7,"text":"success {Object[]} 追加された行オブジェクト","link":[],"note":"","href":[],"parent":"X000562"}
{"id":"X000564","children":[],"depth":7,"text":"failure {Object[]} 追加に失敗した行オブジェクト","link":[],"note":"失敗が無い場合でも空配列として作成","href":[],"parent":"X000562"}
{"id":"X000565","children":["X000566","X000569","X000576"],"depth":5,"text":"update() : 既存レコードを更新","link":[],"note":"サーバ側(シート)にpKeyが存在していない場合はエラーが返る","href":[],"parent":"X000495"}
{"id":"X000566","children":["X000567","X000568"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000565"}
{"id":"X000567","children":[],"depth":7,"text":"クライアント側の対象テーブルにupdateを実行","link":[],"note":"","href":[],"parent":"X000566"}
{"id":"X000568","children":[],"depth":7,"text":"request()でサーバ側のシートに更新要求","link":[],"note":"{branch:'update',data:insertしたデータオブジェクト}","href":[],"parent":"X000566"}
{"id":"X000569","children":["X000570"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000565"}
{"id":"X000570","children":["X000571","X000572","X000575"],"depth":7,"text":"arg {Object[]}","link":[],"note":"","href":[],"parent":"X000569"}
{"id":"X000571","children":[],"depth":8,"text":"range {string} 範囲名","link":[],"note":"","href":[],"parent":"X000570"}
{"id":"X000572","children":["X000573","X000574"],"depth":8,"text":"selector {Object} 更新箇所の特定情報","link":[],"note":"","href":[],"parent":"X000570"}
{"id":"X000573","children":[],"depth":9,"text":"key {string} キーとなる項目名","link":[],"note":"","href":[],"parent":"X000572"}
{"id":"X000574","children":[],"depth":9,"text":"value {any} キーの値","link":[],"note":"","href":[],"parent":"X000572"}
{"id":"X000575","children":[],"depth":8,"text":"data {Object} 更新対象項目のオブジェクト","link":[],"note":"","href":[],"parent":"X000570"}
{"id":"X000576","children":["X000577","X000578"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000565"}
{"id":"X000577","children":[],"depth":7,"text":"success {Object[]} 追加された行オブジェクト","link":[],"note":"","href":[],"parent":"X000576"}
{"id":"X000578","children":[],"depth":7,"text":"failure {Object[]} 追加に失敗した行オブジェクト","link":[],"note":"失敗が無い場合でも空配列として作成","href":[],"parent":"X000576"}
{"id":"X000579","children":[],"depth":5,"text":"delete() : 既存レコードを物理削除","link":[],"note":"サーバ側(シート)にpKeyが不存在の場合はエラーが返る","href":[],"parent":"X000495"}
{"id":"X000580","children":[],"depth":5,"text":"synchronize() : サーバ側のテーブルと同期させる","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000581","children":["X000582"],"depth":5,"text":"deamon() : 定期的に指定された処理を行う","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000582","children":["X000583","X000584"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000581"}
{"id":"X000583","children":[],"depth":7,"text":"proc","link":[],"note":"","href":[],"parent":"X000582"}
{"id":"X000584","children":[],"depth":7,"text":"interval","link":[],"note":"","href":[],"parent":"X000582"}
{"id":"X000585","children":["X000586"],"depth":5,"text":"encB64() : 日本語文字列を含め、base64にエンコード","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000586","children":[],"depth":6,"text":"source","link":[],"note":"/** encB64: 日本語文字列を含め、base64にエンコード\n  * @param {string} parts - 変換する日本語文字列\n  * @returns {string} base64エンコード文字列\n  * \n  * - Qiita [JavaScriptでBase64エンコード・デコード](<a href=\"https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06\">https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06</a>)\n  * - Zenn [URLセーフなBase64エンコーディングとデコーディング](<a href=\"https://zenn.dev/jusanz/articles/d6cec091d45657\">https://zenn.dev/jusanz/articles/d6cec091d45657</a>)\n  * \n  * @example\n  * \n  * ```\n  * v.str = 'これはテスト用文字列です';\n  * v.enc = await base64Encode(v.str);\n  * v.dec = await base64Decode(v.enc);\n  * console.log(`str=${v.str}\\nenc=${v.enc}\\ndec=${v.dec}`);\n  * ```\n  */\n\nencB64(...parts){\n  return new Promise(resolve => {\n    const reader = new FileReader();\n    reader.onload = () => {\n      const offset = reader.result.indexOf(\",\") + 1;\n      resolve(reader.result.slice(offset));\n    };\n    reader.readAsDataURL(new Blob(parts));\n  });\n}","href":[],"parent":"X000585"}
{"id":"X000587","children":["X000588"],"depth":5,"text":"decB64() : base64を日本語文字列にデコード","link":[],"note":"","href":[],"parent":"X000495"}
{"id":"X000588","children":[],"depth":6,"text":"source","link":[],"note":"/** decB64: base64を日本語文字列にデコード\n  * @param {string} text - base64文字列\n  * @param {string} charset='UTF-8'\n  * @returns {string} 復号された日本語文字列\n  * \n  * - Qiita [JavaScriptでBase64エンコード・デコード](<a href=\"https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06\">https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06</a>)\n  * \n  * @example\n  * \n  * ```\n  * v.str = 'これはテスト用文字列です';\n  * v.enc = await base64Encode(v.str);\n  * v.dec = await base64Decode(v.enc);\n  * console.log(`str=${v.str}\\nenc=${v.enc}\\ndec=${v.dec}`);\n  * ```\n  */\ndecB64(text, charset='UTF-8') {\n  return fetch(`data:text/plain;charset=${charset};base64,` + text)\n  .then(response => response.text());\n}","href":[],"parent":"X000587"}
{"id":"X000589","children":["X000590","X000594","X000602","X000721"],"depth":3,"text":"サーバ側の構成","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000590","children":["X000591","X000592","X000593"],"depth":4,"text":"DocumentPropertiesの構成","link":[],"note":"項目名'config'とし、以下のメンバを持つオブジェクトとして定義","href":[],"parent":"X000589"}
{"id":"X000591","children":[],"depth":5,"text":"keyGenerate {string} サーバ側鍵ペアの生成日時","link":[],"note":"","href":[],"parent":"X000590"}
{"id":"X000592","children":[],"depth":5,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000590"}
{"id":"X000593","children":[],"depth":5,"text":"SSkey {string} 文字列化したサーバ側秘密鍵","link":[],"note":"","href":[],"parent":"X000590"}
{"id":"X000594","children":["X000595","X000601"],"depth":4,"text":"doPost()","link":[],"note":"","href":[],"parent":"X000589"}
{"id":"X000595","children":["X000596","X000597","X000598","X000599","X000600"],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000594"}
{"id":"X000596","children":[],"depth":6,"text":"POSTされたJSONをオブジェクト化(v.params)","link":[],"note":"","href":[],"parent":"X000595"}
{"id":"X000597","children":[],"depth":6,"text":"DocumentPropertiesの設定情報を取得、オブジェクト化(v.config)","link":[],"note":"","href":[],"parent":"X000595"}
{"id":"X000598","children":[],"depth":6,"text":"encryptedQueryServerのインスタンスを作成(v.eq)","link":[],"note":"","href":[],"parent":"X000595"}
{"id":"X000599","children":[],"depth":6,"text":"v.eq.dispatch()にv.paramsを渡し、結果をv.rvとして取得","link":[],"note":"","href":[],"parent":"X000595"}
{"id":"X000600","children":[],"depth":6,"text":"v.rvを呼出元に返す","link":[],"note":"","href":[],"parent":"X000595"}
{"id":"X000601","children":[],"depth":5,"text":"v.1.0.0 source","link":[],"note":"function doGet(e){\n  const v = {whois:'doGet',step:0,rv:{}};\n  console.log(`${v.whois} start.\\ne.parameter=${stringify(e.parameter)}`);\n  try {\n\n    v.step = 1.1; // URLクエリ文字列未設定なら導通テストと看做す\n    if( Object.keys(e.parameter).length === 0 ){\n      v.rv = {status:-1,message:'ping test'};\n      return ContentService\n      .createTextOutput(JSON.stringify(v.rv,null,2))\n      .setMimeType(ContentService.MimeType.JSON);\n    }\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 1.2; // 設定情報を取得\n    v.conf = JSON.parse(PropertiesService.getDocumentProperties().getProperty('config'));\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 1.3; // ユーザ情報を取得\n    v.master = new SingleTable(v.conf.master.sheetName);\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 2; // 暗号化通信用インスタンス作成\n    v.eq = new encryptedQuery({\n      isClient: false,\n      storageKey: v.conf.sys.storageKey,\n      master: v.master,\n      IDcol: 'entryNo',\n      CPcol: 'CPkey',\n      upv: v.conf.sys.upv,\n      passcodeValidityPeriod: v.conf.sys.auth.passcodeValidityPeriod,\n    });\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 3.1; // 処理分岐用関数を定義。以下はencryptedQuery.response()からv.branchに渡される引数の内容\n    // @param {Object} arg\n    // @param {Boolean} arg.isPlain - true:平文、false:暗号文\n    // @param {SingleTable} arg.master - ユーザ情報のシートオブジェクト\n    // @param {Object.<string,any>} arg.user - master内の該当ユーザの情報\n    // @param {number|string} <a href=\"http://arg.id\">arg.id</a> - ユーザを特定する値\n    // @param {Object} arg.arg - encryptedQuery.request()に渡された、分岐先関数の引数\n    // @param {number} arg.expire - クライアント側鍵の有効期間。既定値48時間\n    v.branch = (arg) => {\n      console.log(`v.branch start.\\narg(${whichType(arg)})=${stringify(arg)}`);\n      if( arg.isPlain === true ){ // 平文で渡された⇒パスコード通知メール発行要求\n        //v.rv = auth1({entryNo:<a href=\"http://arg.id\">arg.id</a>,CPkey:arg.arg},v.master);\n        v.rv = auth1({\n          CPkey: arg.arg,\n          mail: v.conf.sys.passcodeNotification,\n          entryNo: <a href=\"http://arg.id\">arg.id</a>,\n          master: v.master,\n          user: arg.user,\n          conf: v.conf.sys.auth,\n          sheet: v.conf.master.cols,\n        });\n      } else {\n        //引数が暗号化されていた場合の分岐処理\n        if( arg.arg.func === 'bulkMail' ){\n          // 他で利用する可能性もあるので、スタッフ一覧はdoGet内で取得\n          v.staff = new SingleTable(v.conf.staff.sheetName);\n          v.rv = bulkMail(Object.assign({\n            to: 'スタッフ',\n            subject: '校庭キャンプ2024に関するお知らせ',\n            type: 'plain',\n            body: 'これはテストです',\n            name: '下北沢小おやじの会',\n            replyTo: v.conf.sys.staffML,\n            hold: true, // 下書きとして保存(即時送信はしない)\n            master: v.master,   // 参加者マスタ\n            staff: v.staff,     // スタッフマスタ\n          },arg.arg));\n        } else if( arg.arg.func === 'updateParticipant' ) {\n          v.r = arg.master.update(arg.arg.data,{key:'entryNo',value:arg.arg.entryNo});\n          v.rv = v.r instanceof Error\n          ? {isOK:false,message:v.rv.message}\n          : {isOK:true,data:arg.master.data};\n        } else {\n          v.rv = auth2({\n            passcode: arg.arg,\n            entryNo: <a href=\"http://arg.id\">arg.id</a>,\n            master: v.master,\n            user: arg.user,\n            conf: v.conf.sys.auth,\n            sheet: v.conf.master.cols,\n          });  \n        }\n\n        //if( !isNaN(arg) ){ v.r = auth2(arg); }\n        //else if( arg === 'get' ){ v.r = v.eq.master.data; }\n        //else if( arg.hasOwnProperty('id') && arg.hasOwnProperty('data') )\n        //{ v.r = v.eq.master.update(<a href=\"http://arg.id\">arg.id</a>,arg.data)}\n        //else { v.r = new Error('invalid function type.')}\n        //v.rv = {arg:arg,isPlain:isPlain}; // テスト用ダミー\n      }\n      return v.rv;\n    };\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 3.2; // 処理分岐用関数を実行\n    v.rv = v.eq.response(e.parameter,v.branch);\n    console.log(`${v.whois} step ${v.step} end.`);\n\n    v.step = 9; // 終了処理\n    console.log(`${v.whois} normal end.\\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);\n\n  } catch(e) {\n    e.message = `${v.whois} abnormal end at step.${v.step}\\n${e.message}`;\n    console.error(`${e.message}\\nv=${stringify(v)}`);\n    v.rv = {status:-1,message:e.message};\n  } finally {\n    return ContentService\n    .createTextOutput(JSON.stringify(v.rv,null,2))\n    .setMimeType(ContentService.MimeType.JSON);\n  }\n}","href":[],"parent":"X000594"}
{"id":"X000602","children":["X000603","X000607","X000633","X000658","X000670","X000688","X000699","X000713","X000717","X000719"],"depth":4,"text":"class encryptedQueryServer extends encryptedQuery","link":[],"note":"","href":[],"parent":"X000589"}
{"id":"X000603","children":["X000604","X000605","X000606"],"depth":5,"text":"メンバ","link":[],"note":"本項は導出項目のみ。CL/SV共通[メンバ</a>、constructorの<a href=\"https://workflowy.com/#/0f40403814ce\">引数](#7567bf629d85)は除く。","href":["7567bf629d85"],"parent":"X000602"}
{"id":"X000604","children":[],"depth":6,"text":"uuid {string} 要求元のユーザ識別子","link":[],"note":"","href":[],"parent":"X000603"}
{"id":"X000605","children":[],"depth":6,"text":"user {Object} 要求元アカウントのユーザ情報オブジェクト","link":[],"note":"","href":[],"parent":"X000603"}
{"id":"X000606","children":[],"depth":6,"text":"tables {Object} 範囲名をメンバ名とする複数テーブル情報のオブジェクト","link":[],"note":"","href":[],"parent":"X000603"}
{"id":"X000607","children":["X000608","X000614","X000632"],"depth":5,"text":"constructor()","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000608","children":["X000609","X000610","X000611","X000612","X000613"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000607"}
{"id":"X000609","children":[],"depth":7,"text":"config, arg, 既定値(v.default)をマージ、メンバとしてthisに保存(super())","link":[],"note":"","href":[],"parent":"X000608"}
{"id":"X000610","children":[],"depth":7,"text":"accountsシートが未作成なら作成(⇒<a href=\"https://workflowy.com/#/2913661920c7\">定義</a>)","link":[["<a href=\"https://workflowy.com/#/2913661920c7\">定義</a>","2913661920c7","定義"]],"note":"","href":[],"parent":"X000608"}
{"id":"X000611","children":[],"depth":7,"text":"logシートが未作成なら作成(⇒<a href=\"https://workflowy.com/#/3dccb0fdd2b4\">定義</a>)","link":[["<a href=\"https://workflowy.com/#/3dccb0fdd2b4\">定義</a>","3dccb0fdd2b4","定義"]],"note":"","href":[],"parent":"X000608"}
{"id":"X000612","children":[],"depth":7,"text":"tablesで定義されているテーブルをSingleTableインスタンスとしてメンバ化","link":[],"note":"logは以下の理由によりSingleTableではなく単純なシートオブジェクトとして保持\n1. appendのみでCRUDなし\n2. 空行対応他、多様性に配慮必要なし","href":[],"parent":"X000608"}
{"id":"X000613","children":[],"depth":7,"text":"サーバ側鍵ペアが未生成なら作成、DocumentPropertiesに保存","link":[],"note":"v.step = 1.1; // 鍵ペアの作成\nv.password = createPassword();\nif( v.password instanceof Error ) throw v.password;\nv.key = cryptico.generateRSAKey(v.password,this.bits);\n\nv.step = 1.2; // オブジェクトv.configに各種設定値をセット\nv.config = {\nkeyGenerate: Date.now(),\nSPkey: cryptico.publicKeyString(v.key),\nSSkey: JSON.stringify(v.key.toJSON()),  // 文字列化された秘密鍵\n};\n\nv.step = 2; // DocumentPropertiesへの保存\nPropertiesService.getDocumentProperties().setProperty('config',JSON.stringify(v.config));","href":[],"parent":"X000608"}
{"id":"X000614","children":["X000615","X000616","X000617","X000618","X000624","X000628","X000631",[]],"depth":6,"text":"引数 : 以下のメンバを持つオブジェクト","link":[],"note":"","href":[],"parent":"X000607"}
{"id":"X000615","children":[],"depth":7,"text":"config {Object} DocumentPropertiesに保存されていた内容","link":[],"note":"","href":[],"parent":"X000614"}
{"id":"X000616","children":[],"depth":7,"text":"accountSheetName {string}='accounts' ユーザ情報のシート名","link":[],"note":"","href":[],"parent":"X000614"}
{"id":"X000617","children":[],"depth":7,"text":"logSheetName{string}='log' ログのシート名","link":[],"note":"","href":[],"parent":"X000614"}
{"id":"X000618","children":["X000619","X000620","X000621","X000622","X000623",[]],"depth":7,"text":"tables {Object} 範囲名をメンバ名とする複数テーブル情報のオブジェクト","link":[],"note":"","href":[],"parent":"X000614"}
{"id":"X000619","children":[],"depth":8,"text":"range {string} 対象データ範囲のA1記法。1シート1テーブルとなっていない場合、範囲を特定するために使用。1シート1テーブルならシート名","link":[],"note":"","href":[],"parent":"X000618"}
{"id":"X000620","children":[],"depth":8,"text":"pKey {string}='uuid' 一意キー項目名。ログ等、追加のみで書き換えを前提としない場合以外は必須。複合キーは不可","link":[],"note":"","href":[],"parent":"X000618"}
{"id":"X000621","children":[],"depth":8,"text":"CPkey {string}='CPkey' CPkeyを格納する欄名。accountシート用","link":[],"note":"","href":[],"parent":"X000618"}
{"id":"X000622","children":[],"depth":8,"text":"trial {string}='trial' 試行情報を格納する欄名","link":[],"note":"","href":[],"parent":"X000618"}
{"id":"X000623","children":[],"depth":8,"text":"role {string}='role' 役割を格納する欄名","link":[],"note":"","href":[],"parent":"X000618"}
{"id":"X000624","children":["X000625","X000626","X000627"],"depth":7,"text":"mail {Object} パスコード通知メール関係の定義","link":[],"note":"","href":[],"parent":"X000614"}
{"id":"X000625","children":[],"depth":8,"text":"subject {string}='パスコード通知'","link":[],"note":"","href":[],"parent":"X000624"}
{"id":"X000626","children":[],"depth":8,"text":"body {string}='パスコードは以下の通りです\\n\\n::passcode::' - メール本文(非html)。パスコード設定箇所は`::passcode::`をプレースホルダとする","link":[],"note":"","href":[],"parent":"X000624"}
{"id":"X000627","children":[],"depth":8,"text":"sender {string} メール送信者名","link":[],"note":"","href":[],"parent":"X000624"}
{"id":"X000628","children":["X000629","X000630"],"depth":7,"text":"branch {Object} 分岐先関数の定義","link":[],"note":"ex.{append:{func:()=>{..},auth:{admin:true,guest:false}}\nappend/update/deleteはargで無指定ならメソッドをconstructorでセット(arg優先)","href":[],"parent":"X000614"}
{"id":"X000629","children":[],"depth":8,"text":"func {Function} 分岐先関数","link":[],"note":"","href":[],"parent":"X000628"}
{"id":"X000630","children":[],"depth":8,"text":"auth {Object} role毎に分岐先関数実行に必要な権限の有無を定義","link":[],"note":"","href":[],"parent":"X000628"}
{"id":"X000631","children":[],"depth":7,"text":"role {string} user.func毎に定義された、テーブルへのアクセス権限","link":[],"note":"{役割名:{範囲名:権限},..}のJSON。以下は例\nrole = {\n  admin: {auth1:true, auth2:true, boardRead:true,boardWrite:true...},\n  guest: {auth1:true, auth2:true, boardRead:true,boardWrite:false,...},\n}\n【旧版】\nrole = {\n  admin: {accounts:'rw',log:'rw',board:'rw',summary:'rw'},\n  staff: {accounts: 'rw',log:'rw',board:'rw',summary:'r'},\n  supporter: {log:'w',board:'rw',summary:'r'},\n  participant: {board:'r',summary:'r'},\n  guest: {board:'r'},\n}","href":[],"parent":"X000614"}
{"id":"X000632","children":[],"depth":6,"text":"戻り値 : Error or インスタンス","link":[],"note":"","href":[],"parent":"X000607"}
{"id":"X000633","children":["X000634","X000643","X000652"],"depth":5,"text":"front() : encryptedQueryClientからの要求に基づく処理を行い、結果を戻す","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000634","children":["X000635","X000636","X000637","X000640","X000641","X000642"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000633"}
{"id":"X000635","children":[],"depth":7,"text":"ユーザ情報を取得、メンバに格納(<a href=\"http://this.id\">this.id</a>, this.user)","link":[],"note":"","href":[],"parent":"X000634"}
{"id":"X000636","children":[],"depth":7,"text":"暗号化されていた場合は復号(this.decToken)","link":[],"note":"","href":[],"parent":"X000634"}
{"id":"X000637","children":["X000638","X000639"],"depth":7,"text":"実行権限のチェック","link":[],"note":"※[result](#078054b626eb)参照","href":["078054b626eb"],"parent":"X000634"}
{"id":"X000638","children":[],"depth":8,"text":"accountsシート登録情報に基づくチェック","link":[],"note":"","href":[],"parent":"X000637"}
{"id":"X000639","children":[],"depth":8,"text":"token有りの場合のチェック","link":[],"note":"","href":[],"parent":"X000637"}
{"id":"X000640","children":[],"depth":7,"text":"分岐先関数を呼び出し","link":[],"note":"","href":[],"parent":"X000634"}
{"id":"X000641","children":[],"depth":7,"text":"戻り値Objに分岐先関数の処理結果、lastSync以降の差分を設定","link":[],"note":"","href":[],"parent":"X000634"}
{"id":"X000642","children":[],"depth":7,"text":"返信用<a href=\"https://workflowy.com/#/43b4edef5965\">token</a>の作成(this.encToken)","link":[["<a href=\"https://workflowy.com/#/43b4edef5965\">token</a>","43b4edef5965","token"]],"note":"token.responseTimeの追加設定、token.lastSyncの更新","href":[],"parent":"X000634"}
{"id":"X000643","children":["X000644","X000645","X000650","X000651",[]],"depth":6,"text":"引数","link":[],"note":"以下のメンバを持つオブジェクト","href":[],"parent":"X000633"}
{"id":"X000644","children":[],"depth":7,"text":"uuid {string} accountsシート上の主キー","link":[],"note":"","href":[],"parent":"X000643"}
{"id":"X000645","children":["X000646","X000647","X000648","X000649",[]],"depth":7,"text":"token {string} 以下のメンバを持つオブジェクトを暗号化＋署名した文字列。未認証の場合undefined","link":[],"note":"","href":[],"parent":"X000643"}
{"id":"X000646","children":[],"depth":8,"text":"requestTime {number} クライアント側での発信時刻(UNIX時刻)","link":[],"note":"","href":[],"parent":"X000645"}
{"id":"X000647","children":[],"depth":8,"text":"responseTime {number} サーバ側での返信時刻(UNIX時刻)","link":[],"note":"","href":[],"parent":"X000645"}
{"id":"X000648","children":[],"depth":8,"text":"branch {string} 要求処理名(=this.branchのラベル)。ex.\"auth1\"","link":[],"note":"","href":[],"parent":"X000645"}
{"id":"X000649","children":[],"depth":8,"text":"lastSync {number} 前回同期日時","link":[],"note":"","href":[],"parent":"X000645"}
{"id":"X000650","children":[],"depth":7,"text":"data {string} 要求処理(メソッド)に渡す引数オブジェクトのJSON","link":[],"note":"","href":[],"parent":"X000643"}
{"id":"X000651","children":[],"depth":7,"text":"sync {boolean} trueならlastSync以降の差分を要求","link":[],"note":"","href":[],"parent":"X000643"}
{"id":"X000652","children":["X000653","X000654","X000655","X000656","X000657",[]],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000633"}
{"id":"X000653","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/43b4edef5965\">token</a> {Object}","link":[["<a href=\"https://workflowy.com/#/43b4edef5965\">token</a>","43b4edef5965","token"]],"note":"","href":[],"parent":"X000652"}
{"id":"X000654","children":[[]],"depth":7,"text":"result {number}","link":[],"note":"0: 正常(エラー項目無し)\n\n// accountシート登録情報に基づくチェック\n2^ 0 =    1: uuidがユーザ一覧(accountシート)に不存在\n2^ 1 =    2: メールアドレス未登録\n2^ 2 =    4: roleが未登録\n2^ 3 =    8: 指定分岐先関数の実行権限無し\n2^ 4 =   16: アカウント凍結中\n2^ 5 =   32: 有効期間始期未登録\n2^ 6 =   64: 有効期間終期未登録\n2^ 7 =  128: アカウントの有効期間外\n2^ 8 =  256: 要求処理(arg.token.branch)の実行権限無し\n\n// 以下、token有りの場合\n2^16 =  65,536: 復号失敗(SPkeyが不適切)\n2^17 = 131,072: CPkeyが未登録\n2^18 = 262,144: 不適切な署名(CPkey不一致)\n2^19 = 524,228: 最終ログイン日時から一定以上経過(lastLogin+validPeriod>Date.now())\n　※クライアント側鍵ペアの有効期間チェックは本項で代替する","href":[],"parent":"X000652"}
{"id":"X000655","children":[],"depth":7,"text":"message {string} エラーメッセージ","link":[],"note":"","href":[],"parent":"X000652"}
{"id":"X000656","children":[],"depth":7,"text":"data {Object} 要求処理メソッドからの戻り値(JSON)。結果コード等を含む","link":[],"note":"","href":[],"parent":"X000652"}
{"id":"X000657","children":[[]],"depth":7,"text":"log {Object[]} 前回同期日時以降の<a href=\"https://workflowy.com/#/3dccb0fdd2b4\">\"log\"シート</a>行データのJSON","link":[["<a href=\"https://workflowy.com/#/3dccb0fdd2b4\">\"log\"シート</a>","3dccb0fdd2b4","\"log\"シート"]],"note":"","href":[],"parent":"X000652"}
{"id":"X000658","children":["X000659","X000665","X000667"],"depth":5,"text":"auth1() : パスコードメールを送信","link":[],"note":"クライアント側の処理はencryptedQueryClient.authorize()「[概要](#a4a6dbaf2b81)」参照","href":["a4a6dbaf2b81"],"parent":"X000602"}
{"id":"X000659","children":["X000660","X000661","X000662","X000663","X000664"],"depth":6,"text":"概要","link":[],"note":"front()でアカウント登録や実行権限のチェックは済んでいるので、auth1でのチェックはパスコード有効期限のみ行う。","href":[],"parent":"X000658"}
{"id":"X000660","children":[],"depth":7,"text":"前回パスコード発行後、パスコードの有効期間(passcodeValidityPeriod)以内なら以降の処理はスキップ","link":[],"note":"","href":[],"parent":"X000659"}
{"id":"X000661","children":[],"depth":7,"text":"パスコード生成","link":[],"note":"this.user[v.sheet.trial].passcode = Math.floor(Math.random() * (10 ** v.conf.passcodeDigit));\nthis.user[v.sheet.trial].created = v.now;","href":[],"parent":"X000659"}
{"id":"X000662","children":[],"depth":7,"text":"メール送信","link":[],"note":"v.draft = GmailApp.createDraft(\n  this.user[v.mail.recipient], // 宛先\n  v.mail.subject, // ex.'[連絡]校庭キャンプ2024 パスコード',\n  v.mail.body.replaceAll(/::passcode::/g,\n    ('0'.repeat(v.conf.passcodeDigit)+this.user[v.sheet.trial].passcode).slice(-v.conf.passcodeDigit)),\n  {name: v.mail.sender}, // ex.'下北沢小おやじの会'。HTMLメールならhtmlBody要素で追加指定\n);\nGmailApp.getDraft(v.draft.getId()).send();\nconsole.log(v.whois+'.'+v.step+': Mail Remaining Daily Quota:'\n  + MailApp.getRemainingDailyQuota());","href":[],"parent":"X000659"}
{"id":"X000663","children":[],"depth":7,"text":"accountsシートの試行情報(trial)を書き換え","link":[],"note":"v.dObj = {};\nv.dObj[v.sheet.trial] = JSON.stringify(this.user[v.sheet.trial]);\nv.dObj[v.sheet.CPkey] = arg.CPkey;\nv.dObj[v.sheet.auth] = this.user[v.sheet.auth];\nvlog(v,'dObj');\nv.r = arg.master.update(v.dObj,{where:o=>o[<a href=\"http://v.sheet.id\">v.sheet.id</a>]==v.entryNo});\nvlog(v,'r');\nif( v.r instanceof Error ) throw v.r;","href":[],"parent":"X000659"}
{"id":"X000664","children":[],"depth":7,"text":"logへの記録","link":[],"note":"","href":[],"parent":"X000659"}
{"id":"X000665","children":["X000666"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000658"}
{"id":"X000666","children":[],"depth":7,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"","href":[],"parent":"X000665"}
{"id":"X000667","children":["X000668","X000669"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000658"}
{"id":"X000668","children":[],"depth":7,"text":"result {number}","link":[],"note":"0: 処理成功(パスコード通知メールを新規発行)\n1: 処理成功(パスコード通知メールは10分以内なので発行省略)\n9: システム、その他エラー。message参照","href":[],"parent":"X000667"}
{"id":"X000669","children":[],"depth":7,"text":"message {string} エラーメッセージ。正常終了ならundefined","link":[],"note":"","href":[],"parent":"X000667"}
{"id":"X000670","children":["X000671","X000678","X000680","X000687"],"depth":5,"text":"auth2() : 入力されたパスコードの検証","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000671","children":["X000672","X000675","X000676","X000677"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000670"}
{"id":"X000672","children":["X000673","X000674"],"depth":7,"text":"パスコードの検証","link":[],"note":"","href":[],"parent":"X000671"}
{"id":"X000673","children":[],"depth":8,"text":"パスコードの有効期間内","link":[],"note":"","href":[],"parent":"X000672"}
{"id":"X000674","children":[],"depth":8,"text":"パスコードが一致","link":[],"note":"","href":[],"parent":"X000672"}
{"id":"X000675","children":[],"depth":7,"text":"クライアント側初期テーブル用データの作成","link":[],"note":"trialはクライアント側に渡さないよう削除。logシートは授受対象外","href":[],"parent":"X000671"}
{"id":"X000676","children":[],"depth":7,"text":"accountsシートのtrial,lastSyncの書き換え","link":[],"note":"","href":[],"parent":"X000671"}
{"id":"X000677","children":[],"depth":7,"text":"logへの記録","link":[],"note":"","href":[],"parent":"X000671"}
{"id":"X000678","children":["X000679"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000670"}
{"id":"X000679","children":[],"depth":7,"text":"passcode {number} クライアント側で入力されたパスコード","link":[],"note":"","href":[],"parent":"X000678"}
{"id":"X000680","children":["X000681","X000682","X000683",[]],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000670"}
{"id":"X000681","children":[],"depth":7,"text":"result {number}","link":[],"note":"0: 処理成功(パスコード一致)\n1: パスコード生成から10分以上経過、もう一度auth1からやり直し\n2: パスコード不一致(再試行可)\n3: パスコード不一致(再試行不可、凍結に移行)\n9: システム、その他エラー。message参照","href":[],"parent":"X000680"}
{"id":"X000682","children":[],"depth":7,"text":"message {string} エラーメッセージ。正常終了ならundefined","link":[],"note":"","href":[],"parent":"X000680"}
{"id":"X000683","children":["X000684","X000685","X000686",[]],"depth":7,"text":"tables {Object} クライアント側初期テーブル用データの作成","link":[],"note":"{領域名:以下メンバを持つオブジェクト}形式","href":[],"parent":"X000680"}
{"id":"X000684","children":[],"depth":8,"text":"constructor()の引数Obj.<a href=\"https://workflowy.com/#/752c37c55bd4\">tables</a>","link":[["<a href=\"https://workflowy.com/#/752c37c55bd4\">tables</a>","752c37c55bd4","tables"]],"note":"","href":[],"parent":"X000683"}
{"id":"X000685","children":[],"depth":8,"text":"header {string[]} ヘッダ項目名のリスト。空欄不可","link":[],"note":"","href":[],"parent":"X000683"}
{"id":"X000686","children":[],"depth":8,"text":"data {Object[]} 行データオブジェクトの一次元配列","link":[],"note":"","href":[],"parent":"X000683"}
{"id":"X000687","children":[],"depth":6,"text":"v.1.0.0 source","link":[],"note":"/** auth2: 入力されたパスコードを検証、正当なら全ユーザ情報を返す\n * @param {Object} arg\n * ----- auth2特有設定 -----\n * @param {string|number} arg.passcode - 入力されたパスコード\n * ----- auth1,2共通 -----\n * @param {number} arg.entryNo - ユーザID\n * @param {SingleTable} arg.master - ユーザ情報シートのオブジェクト\n * @param {Object.<string,any>} arg.user - ユーザ情報\n * @param {Object} arg.conf - 設定値\n * @param {number} [arg.conf.bits=1024] - RSA鍵長。クライアント/サーバ両方に適用\n * @param {number} [arg.conf.maxTrial=3] - 最大試行回数(パスコード入力)\n * @param {number} [arg.conf.passcodeValidityPeriod=600000] - パスコードの有効期間。ミリ秒\n * @param {number} [arg.conf.expire=172800000] - クライアント側鍵の有効期間。既定値48時間\n * @param {number} [arg.conf.freezing=3600000] - 連続失敗した場合の凍結期間。ミリ秒。既定値1時間\n * @param {number} [arg.conf.authFlag=2] - auth1/auth2を実行可能な権限フラグ\n * @param {number} [arg.conf.passcodeDigit=6] - パスコードの桁数\n * @param {Object} arg.sheet - シート関係情報\n * @param {string} <a href=\"http://arg.sheet.id\">arg.sheet.id</a>='entryNo' - ユーザを特定するキーの欄名\n * @param {string} arg.sheet.CPkey='CPkey' - CPkeyを格納する欄名\n * @param {string} arg.sheet.trial='trial' - 試行情報を格納する欄名\n * @param {string} arg.sheet.auth='authority' - ユーザ権限を格納する欄名\n * \n * \n * \n * @param {string|number} arg.entryNo - ユーザID\n * @param {string|number} arg.passcode - 入力されたパスコード\n * @param {number} arg.expire - 有効期間(ミリ秒)\n * @param {SingleTable} master - ユーザ情報シートのオブジェクト\n * @returns \n * \n * なおIDに該当するユーザがシートに登録されているかは、前段階のencryptedQuery.response()内で検証されているため割愛。\n * \n * **パスコード正当性判断基準**\n * \n * - パスコード生成から10分以内\n * - パスコードが正しい\n * \n * **戻り値のデータ形式**\n * \n * - rv {Object}\n *   - status {number} 1:正当 0:不当だが再試行可 -1〜-8:不当、再試行不可 -9:システムエラー\n *   - message {string} エラーメッセージ(エラー時のみ)\n *   - header {string[]} 欄名の一覧\n *   - data {Object.<string,any>} 全ユーザ情報(master全行の{欄名:値})\n */\nfunction auth2(arg){\n  const v = {whois:'auth2',step:0,rv:{status:1},entryNo:Number(arg.entryNo),now:Date.now()};\n  console.log(`${v.whois} start.\\narg=${stringify(arg)}`);\n  try {\n\n    v.step = 1; // パスコードの形式検証\n    if( isNaN(arg.passcode) ){\n      v.rv.status = 0;\n      v.rv.message = 'パスコードが数値ではありません';\n    } else {\n      v.passcode = Number(arg.passcode);\n      vlog(v,'passcode');\n\n      v.step = 2; // 有効期限の検証\n      arg.user[arg.sheet.trial] = JSON.parse(arg.user[arg.sheet.trial]);\n      vlog(arg.user,'trial',v);\n      if( (v.now - arg.user[arg.sheet.trial].created) > arg.conf.passcodeValidityPeriod ){\n        v.rv.status = -2;\n        v.rv.message = `パスコードの有効期限(${Math.round(arg.conf.passcodeValidityPeriod/60000)}分)が切れています`\n      } else {\n        v.step = 3; // パスコードの一致検証\n        if( arg.user[arg.sheet.trial].passcode === v.passcode ){\n          // OKの場合、スタッフ名簿とarg.masterシート全件を戻り値に追加\n          v.staff = new SingleTable('スタッフ名簿');\n          Object.assign(v.rv,{\n            status: 1,\n            header: arg.master.header,\n            data: JSON.parse(JSON.stringify(arg.master.data)),\n            staff: JSON.parse(JSON.stringify(v.staff.data)),\n            expire: v.now + arg.expire,\n          });\n          v.rv.data.forEach(x => delete x.trial); // trial情報は削除\n        } else {\n          v.step = 4; // 再試行可否判断\n          v.rv.message = 'パスコードが一致しませんでした';\n          if( arg.user[arg.sheet.trial].result <= arg.conf.maxTrial ){\n            v.rv.status = 0;\n          } else {\n            v.rv.status = -3;\n            v.rv.message += `\\n連続${arg.conf.maxTrial}回パスコード不一致のため、アカウントが凍結されます。`\n            + `\\nシステム管理者に凍結解除を依頼するか、${Math.round(arg.conf.freezing/60000)}分以上の間隔を置いて再試行してください。`;\n          }\n        }\n      }\n    }\n    vlog(v,'rv');\n\n    (()=>{  v.step = 5; // シートのtrial欄を更新\n\n      v.step = 5.1; // trial情報を更新\n      arg.user[arg.sheet.trial].result = v.rv.status > 0 ? 0 : (arg.user[arg.sheet.trial].result + 1);\n      arg.user[arg.sheet.trial].log.unshift({\n        timestamp: v.now,\n        enterd   : arg.passcode,\n        status   : v.rv.status,\n      });\n\n      v.step = 5.2; // シートの試行情報を書き換え\n      v.dObj = {};\n      v.dObj[arg.sheet.trial] = JSON.stringify(arg.user[arg.sheet.trial]);\n      v.r = arg.master.update(v.dObj,{where:o=>o[<a href=\"http://arg.sheet.id\">arg.sheet.id</a>]==v.entryNo});\n      if( v.r instanceof Error ) throw v.r;\n\n    })();\n\n    v.step = 9; // 終了処理\n    console.log(`${v.whois} normal end.\\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);\n\n  } catch(e) {\n    v.rv.status = -9; // システムエラーは status = -9\n    v.rv.message = e.message;\n    e.message = `${v.whois} abnormal end at step.${v.step}\\n${e.message}`;\n    console.error(`${e.message}\\nv=${stringify(v)}`);\n  } finally {\n    return v.rv;\n  }\n}","href":[],"parent":"X000670"}
{"id":"X000688","children":["X000689","X000692","X000696"],"depth":5,"text":"append() : シートに新規レコードを追加","link":[],"note":"更新系の処理は以下の手順で行う。\n①ローカル側に対象と更新データを渡す\n②対象と更新データをサーバ側に投げる(requestを呼び出す)\n③サーバ側更新結果をローカルのDBに反映","href":[],"parent":"X000602"}
{"id":"X000689","children":["X000690","X000691"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000688"}
{"id":"X000690","children":[],"depth":7,"text":"対象テーブルにSingleTable.insert()を実行","link":[],"note":"","href":[],"parent":"X000689"}
{"id":"X000691","children":[],"depth":7,"text":"logへの記録","link":[],"note":"","href":[],"parent":"X000689"}
{"id":"X000692","children":["X000693"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000688"}
{"id":"X000693","children":["X000694","X000695"],"depth":7,"text":"arg {Object[]}","link":[],"note":"","href":[],"parent":"X000692"}
{"id":"X000694","children":[],"depth":8,"text":"range {string} 範囲名","link":[],"note":"","href":[],"parent":"X000693"}
{"id":"X000695","children":[],"depth":8,"text":"data{Object[]} 追加する行オブジェクトの配列","link":[],"note":"","href":[],"parent":"X000693"}
{"id":"X000696","children":["X000697","X000698"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000688"}
{"id":"X000697","children":[],"depth":7,"text":"success {Object[]} 追加された行オブジェクト","link":[],"note":"","href":[],"parent":"X000696"}
{"id":"X000698","children":[],"depth":7,"text":"failure {Object[]} 追加に失敗した行オブジェクト","link":[],"note":"失敗が無い場合でも空配列として作成","href":[],"parent":"X000696"}
{"id":"X000699","children":["X000700","X000703","X000710"],"depth":5,"text":"update() : シートの既存レコードを更新","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000700","children":["X000701","X000702"],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000699"}
{"id":"X000701","children":[],"depth":7,"text":"対象テーブルにSingleTable.update()を実行","link":[],"note":"","href":[],"parent":"X000700"}
{"id":"X000702","children":[],"depth":7,"text":"logへの記録","link":[],"note":"","href":[],"parent":"X000700"}
{"id":"X000703","children":["X000704"],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000699"}
{"id":"X000704","children":["X000705","X000706","X000709"],"depth":7,"text":"arg {Object[]}","link":[],"note":"","href":[],"parent":"X000703"}
{"id":"X000705","children":[],"depth":8,"text":"range {string} 範囲名","link":[],"note":"","href":[],"parent":"X000704"}
{"id":"X000706","children":["X000707","X000708"],"depth":8,"text":"selector {Object} 更新箇所の特定情報","link":[],"note":"","href":[],"parent":"X000704"}
{"id":"X000707","children":[],"depth":9,"text":"key {string} キーとなる項目名","link":[],"note":"","href":[],"parent":"X000706"}
{"id":"X000708","children":[],"depth":9,"text":"value {any} キーの値","link":[],"note":"","href":[],"parent":"X000706"}
{"id":"X000709","children":[],"depth":8,"text":"data {Object} 更新対象項目のオブジェクト","link":[],"note":"","href":[],"parent":"X000704"}
{"id":"X000710","children":["X000711","X000712"],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000699"}
{"id":"X000711","children":[],"depth":7,"text":"success {Object[]} 更新された行オブジェクト","link":[],"note":"","href":[],"parent":"X000710"}
{"id":"X000712","children":[],"depth":7,"text":"failure {Object[]} 更新に失敗した行オブジェクト","link":[],"note":"","href":[],"parent":"X000710"}
{"id":"X000713","children":["X000714","X000715","X000716"],"depth":5,"text":"delete() : シートの既存レコードを物理削除","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000714","children":[],"depth":6,"text":"概要","link":[],"note":"","href":[],"parent":"X000713"}
{"id":"X000715","children":[],"depth":6,"text":"引数","link":[],"note":"","href":[],"parent":"X000713"}
{"id":"X000716","children":[],"depth":6,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000713"}
{"id":"X000717","children":["X000718"],"depth":5,"text":"encB64() : 日本語文字列を含め、base64にエンコード","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000718","children":[],"depth":6,"text":"source","link":[],"note":"/** encB64: 日本語文字列を含め、base64にエンコード\n  * @param {string} parts - 変換する日本語文字列\n  * @returns {string} base64エンコード文字列\n  */\nencB64(text){\n  return Utilities.base64Encode(text, Utilities.Charset.UTF_8);\n}","href":[],"parent":"X000717"}
{"id":"X000719","children":["X000720"],"depth":5,"text":"decB64() : base64を日本語文字列にデコード","link":[],"note":"","href":[],"parent":"X000602"}
{"id":"X000720","children":[],"depth":6,"text":"source","link":[],"note":"/** decB64: base64を日本語文字列にデコード\n  * @param {string} text - base64文字列\n  * @param {string} charset='UTF-8'\n  * @returns {string} 復号された日本語文字列\n  */\ndecB64(text, charset='UTF-8') {\n  return Utilities.newBlob(Utilities.base64Decode(text, Utilities.Charset.UTF_8)).getDataAsString();\n}","href":[],"parent":"X000719"}
{"id":"X000721","children":["X000722","X000723","X000724","X000725","X000726","X000727","X000728","X000729","X000730","X000731","X000732","X000739","X000740","X000741","X000742","X000743"],"depth":4,"text":"アカウント管理シート(user)の構成","link":[],"note":"","href":[],"parent":"X000589"}
{"id":"X000722","children":[],"depth":5,"text":"userId {string|number} ユーザ識別子(primaryKey)","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000723","children":[],"depth":5,"text":"name {string} ユーザの氏名","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000724","children":[],"depth":5,"text":"email {string} ユーザのメールアドレス(unique)","link":[],"note":"複数アカウントでの同一メアド共有は不許可","href":[],"parent":"X000721"}
{"id":"X000725","children":[],"depth":5,"text":"phone {string} ユーザの電話番号","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000726","children":[],"depth":5,"text":"contact {string} ユーザの住所","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000727","children":[],"depth":5,"text":"note {string} 備考","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000728","children":[],"depth":5,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000729","children":[],"depth":5,"text":"CPkeyGenerated {string} クライアント側鍵ペアの生成日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000730","children":[],"depth":5,"text":"authority {JSON} シート毎のアクセス権限。<code>{シート名:raud文字列}</code> 形式","link":[],"note":"r:read, a:append, u:update, d:delete","href":[],"parent":"X000721"}
{"id":"X000731","children":[],"depth":5,"text":"lastRequest {string} 前回パスコード通知メール発行要求日時","link":[],"note":"パスコード要求(client)>要求受領(server)>パスコード生成>通知メール送信の内、メール送信日時","href":[],"parent":"X000721"}
{"id":"X000732","children":["X000733","X000734","X000738"],"depth":5,"text":"trial {JSON} ログイン試行関連情報","link":[],"note":"新規試行開始時にクリア","href":[],"parent":"X000721"}
{"id":"X000733","children":[],"depth":6,"text":"passcode {number} 設定されたパスコード","link":[],"note":"","href":[],"parent":"X000732"}
{"id":"X000734","children":["X000735","X000736","X000737"],"depth":6,"text":"log {Object[]} 試行履歴情報","link":[],"note":"","href":[],"parent":"X000732"}
{"id":"X000735","children":[],"depth":7,"text":"t {string} パスコード検証日時","link":[],"note":"","href":[],"parent":"X000734"}
{"id":"X000736","children":[],"depth":7,"text":"v {number} ユーザが入力したパスコード","link":[],"note":"","href":[],"parent":"X000734"}
{"id":"X000737","children":[],"depth":7,"text":"c {number} エラーコード","link":[],"note":"01: アカウント凍結中(凍結解除後、再試行可)\n02: ログイン権限無し(authorityが空オブジェクト)\n03: CPkey有効期限切れ\n04: CPkey有効期間内なのに署名と登録CPkeyが一致しない\n05: パスコード有効期限切れ\n06: パスコード有効期限内なのにパスコード不一致\n99: その他(システムエラー他)","href":[],"parent":"X000734"}
{"id":"X000738","children":[],"depth":6,"text":"freeze {string} 凍結解除日時。通常undefined、凍結時にメンバ追加","link":[],"note":"","href":[],"parent":"X000732"}
{"id":"X000739","children":[],"depth":5,"text":"lastLogin {string} 前回ログイン日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000740","children":[],"depth":5,"text":"lastSync {string} 前回同期日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000741","children":[],"depth":5,"text":"created {string} ユーザ登録日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000742","children":[],"depth":5,"text":"updated {string} 最終更新日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000743","children":[],"depth":5,"text":"deleted {string} 論理削除日時","link":[],"note":"","href":[],"parent":"X000721"}
{"id":"X000744","children":["X000745"],"depth":3,"text":"class encryptedQueryToken","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000745","children":["X000746","X000747","X000749","X000750"],"depth":4,"text":"メンバ","link":[],"note":"","href":[],"parent":"X000744"}
{"id":"X000746","children":[],"depth":5,"text":"userId {string|number} ユーザ識別子","link":[],"note":"公開鍵交換後は暗号化＋署名する","href":[],"parent":"X000745"}
{"id":"X000747","children":["X000748"],"depth":5,"text":"request {Object}","link":[],"note":"","href":[],"parent":"X000745"}
{"id":"X000748","children":[],"depth":6,"text":"CPkey {string} クライアント側公開鍵","link":[],"note":"SPkeyは最初の復号時に署名として取得","href":[],"parent":"X000747"}
{"id":"X000749","children":[],"depth":5,"text":"response {Object} SpreadDBの<a href=\"https://workflowy.com/#/a05bf5f0f7c2\">戻り値</a>","link":[["<a href=\"https://workflowy.com/#/a05bf5f0f7c2\">戻り値</a>","a05bf5f0f7c2","戻り値"]],"note":"","href":[],"parent":"X000745"}
{"id":"X000750","children":["X000751","X000752","X000753"],"depth":5,"text":"ぼつ","link":[],"note":"","href":[],"parent":"X000745"}
{"id":"X000751","children":[],"depth":6,"text":"SPkey {string} サーバ側公開鍵","link":[],"note":"","href":[],"parent":"X000750"}
{"id":"X000752","children":[],"depth":6,"text":"lastSync {string}='1970-01-01' 前回同期日時。初期値はundefined","link":[],"note":"要、サーバ側管理(なりすまし抑止)","href":[],"parent":"X000750"}
{"id":"X000753","children":[],"depth":6,"text":"keyGenerate {string} クライアント側鍵ペアの生成日時","link":[],"note":"要、サーバ側管理(なりすまし抑止)","href":[],"parent":"X000750"}
{"id":"X000754","children":[],"depth":3,"text":"","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000755","children":["X000756"],"depth":3,"text":"ゴミ箱","link":[],"note":"","href":[],"parent":"X000399"}
{"id":"X000756","children":["X000757"],"depth":4,"text":"setup() : DocumentPropertiesに当該Prjで使用する設定情報をセット","link":[],"note":"上記「DocumentPropertiesの構成」に記載した項目の他、encryptedQuery以外のクラス・関数で使用する項目を含む。","href":[],"parent":"X000755"}
{"id":"X000757","children":[],"depth":5,"text":"【未完】source","link":[],"note":"/** setup: DocumentPropertiesに設定情報を保存\n * - 【プロジェクト毎にソースを修正】して使用のこと\n * - Qiita [crypticoでPure JavaScriptによる公開鍵暗号を用いるメモ](<a href=\"https://qiita.com/miyanaga/items/8692d0742a49fb37a6da\">https://qiita.com/miyanaga/items/8692d0742a49fb37a6da</a>)\n */\nfunction setup(){\n  const v = {whois:'setup',step:0,rv:null,conf:{}};\n  console.log(`${v.whois} start.`);\n  try {\n\n    // step.1 各種設定値をv.configにセット\n\n    v.step = 1.1; // 鍵ペアの作成\n    v.password = createPassword();\n    if( v.password instanceof Error ) throw v.password;\n    v.bits = 1024;\n    v.key = cryptico.generateRSAKey(v.password,v.bits);\n\n    v.step = 1.2; // オブジェクトv.configに各種設定値をセット\n    v.config = {\n      keyGenerate: Date.now(),\n      keyLength: v.bits,\n      SPkey: cryptico.publicKeyString(v.key),\n      SSkey: JSON.stringify(v.key.toJSON()),  // 文字列化された秘密鍵\n    };\n\n    v.step = 2; // DocumentPropertiesへの保存\n    PropertiesService.getDocumentProperties().setProperty('config',JSON.stringify(v.config));\n\n    v.step = 3; // 保存内容の確認、終了処理\n    console.log(`${v.whois} normal end.\\n${PropertiesService.getDocumentProperties().getProperty('config')}`);\n\n  } catch(e) {\n    e.message = `${v.whois} abnormal end at step.${v.step}\\n${e.message}`;\n    console.error(`${e.message}\\nv=${stringify(v)}`);\n  }\n}","href":[],"parent":"X000756"}
{"id":"X000758","children":["X000759","X000809","X000814","X000830","X000837","X000877","X000915"],"depth":2,"text":"[旧版]SpreadDB 1.1.0","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000759","children":["X000760","X000767","X000777","X000786","X000797"],"depth":3,"text":"typeDefs","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000760","children":["X000761","X000762","X000763"],"depth":4,"text":"メンバ(pv)","link":[],"note":"","href":[],"parent":"X000759"}
{"id":"X000761","children":[],"depth":5,"text":"whois {string} 'SpreadDb'固定","link":[],"note":"","href":[],"parent":"X000760"}
{"id":"X000762","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/83fc9661f4ca\">opt {Object}</a> 起動時オプション。<code><a href=\"http://pv.opt.xxx\">pv.opt.xxx</a></code> として保存","link":[["<a href=\"https://workflowy.com/#/83fc9661f4ca\">opt {Object}</a> 起動時オプション。<code><a href=\"http://pv.opt.xxx\">pv.opt.xxx</a>","83fc9661f4ca","opt {Object}</a> 起動時オプション。<code><a href=\"http://pv.opt.xxx\">pv.opt.xxx"]],"note":"","href":[],"parent":"X000760"}
{"id":"X000763","children":["X000764","X000765","X000766"],"depth":5,"text":"内部設定項目(optと同列に配置)","link":[],"note":"","href":[],"parent":"X000760"}
{"id":"X000764","children":[],"depth":6,"text":"spread {Spread} スプレッドシートオブジェクト","link":[],"note":"","href":[],"parent":"X000763"}
{"id":"X000765","children":[],"depth":6,"text":"table {Object.&lt;string,<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>&gt;} スプレッドシート上の各テーブル(領域)の情報","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000763"}
{"id":"X000766","children":[],"depth":6,"text":"log {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>[]}=[] 更新履歴シートオブジェクト","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000763"}
{"id":"X000767","children":["X000768","X000769","X000770","X000771","X000772","X000773","X000774","X000775","X000776",[]],"depth":4,"text":"sdbTable {Object} テーブルの管理情報","link":[],"note":"","href":[],"parent":"X000759"}
{"id":"X000768","children":[],"depth":5,"text":"name {string} テーブル名(範囲名)","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000769","children":[],"depth":5,"text":"account {string} 更新者のアカウント(識別子)","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000770","children":[],"depth":5,"text":"sheet {<a href=\"https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja\">Sheet</a>} スプレッドシート内の操作対象シート(ex.\"master\"シート)","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000771","children":[],"depth":5,"text":"schema {<a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>} シートの項目定義","link":[["<a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>","1807783e0064","sdbSchema"]],"note":"","href":[],"parent":"X000767"}
{"id":"X000772","children":[],"depth":5,"text":"values {Object[]} 行オブジェクトの配列。<code>{項目名:値,..}</code> 形式","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000773","children":[],"depth":5,"text":"header {string[]} 項目名一覧(ヘッダ行)","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000774","children":[],"depth":5,"text":"notes {string[]} ヘッダ行のメモ","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000775","children":[],"depth":5,"text":"colnum {number} データ領域の列数","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000776","children":[],"depth":5,"text":"rownum {number} データ領域の行数(ヘッダ行は含まず)","link":[],"note":"","href":[],"parent":"X000767"}
{"id":"X000777","children":["X000778","X000779","X000780","X000781","X000785",[]],"depth":4,"text":"sdbSchema {Object} テーブルの構造情報","link":[],"note":"","href":[],"parent":"X000759"}
{"id":"X000778","children":[],"depth":5,"text":"cols {<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>[]} 項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000777"}
{"id":"X000779","children":[],"depth":5,"text":"primaryKey {string}='id' 一意キー項目名","link":[],"note":"","href":[],"parent":"X000777"}
{"id":"X000780","children":[],"depth":5,"text":"unique {Object.&lt;string, any[]&gt;} primaryKeyおよびunique属性項目の管理情報","link":[],"note":"メンバ名はprimaryKey/uniqueの項目名","href":[],"parent":"X000777"}
{"id":"X000781","children":["X000782","X000783","X000784"],"depth":5,"text":"auto_increment {Object.&lt;string,Object&gt;} auto_increment属性項目の管理情報","link":[],"note":"メンバ名はauto_incrementの項目名","href":[],"parent":"X000777"}
{"id":"X000782","children":[],"depth":6,"text":"start {number} 開始値","link":[],"note":"","href":[],"parent":"X000781"}
{"id":"X000783","children":[],"depth":6,"text":"step {number} 増減値","link":[],"note":"","href":[],"parent":"X000781"}
{"id":"X000784","children":[],"depth":6,"text":"current {number} 現在の最大(小)値","link":[],"note":"currentはsdbTableインスタンスで操作する。","href":[],"parent":"X000781"}
{"id":"X000785","children":[],"depth":5,"text":"defaultRow {Object|function} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ","link":[],"note":"","href":[],"parent":"X000777"}
{"id":"X000786","children":["X000787","X000788","X000789","X000790","X000791","X000792","X000793","X000794","X000795","X000796",[]],"depth":4,"text":"sdbColumn {Object} 項目の構造情報","link":[],"note":"","href":[],"parent":"X000759"}
{"id":"X000787","children":[],"depth":5,"text":"name {string} 項目名","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000788","children":[],"depth":5,"text":"type {string} データ型。string,number,boolean,Date,JSON,UUID","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000789","children":[],"depth":5,"text":"format {string} 表示形式。type=Dateの場合のみ指定","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000790","children":[],"depth":5,"text":"options {string} 取り得る選択肢(配列)のJSON表現","link":[],"note":"ex. [\"未入場\",\"既収\",\"未収\",\"無料\"]","href":[],"parent":"X000786"}
{"id":"X000791","children":[],"depth":5,"text":"default {function} 既定値を取得する関数。引数は当該行オブジェクト","link":[],"note":"指定の際は必ず<code>{〜}</code> で囲み、return文を付与のこと。\nex.<code>o => {return toLocale(new Date())}</code>","href":[],"parent":"X000786"}
{"id":"X000792","children":[],"depth":5,"text":"primaryKey {boolean}=false 一意キー項目ならtrue","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000793","children":[],"depth":5,"text":"unique {boolean}=false primaryKey以外で一意な値を持つならtrue","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000794","children":[],"depth":5,"text":"auto_increment {bloolean|null|number|number[]}=false 自動採番項目","link":[],"note":"null ⇒ 自動採番しない\nboolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない\nnumber ⇒ 自動採番する(基数=指定値,増減値=1)\nnumber[] ⇒ 自動採番する(基数=添字0,増減値=添字1)\nobject ⇒ {start:m,step:n}形式","href":[],"parent":"X000786"}
{"id":"X000795","children":[],"depth":5,"text":"suffix {string} \"not null\"等、上記以外のSQLのcreate table文のフィールド制約","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000796","children":[],"depth":5,"text":"note {string} 本項目に関する備考。create table等では使用しない","link":[],"note":"","href":[],"parent":"X000786"}
{"id":"X000797","children":["X000798","X000799","X000800","X000801","X000802","X000803","X000804","X000805","X000806","X000807","X000808",[]],"depth":4,"text":"sdbLog {Object} 更新履歴オブジェクト","link":[],"note":"行頭[〜]はシート上の列番号＋列記号","href":[],"parent":"X000759"}
{"id":"X000798","children":[],"depth":5,"text":"[01A] id {UUID}=Utilities.getUuid() 一意キー項目","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000799","children":[],"depth":5,"text":"[02B] timestamp {string}=toLocale(new Date()) 更新日時","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000800","children":[],"depth":5,"text":"[03C] account {string|number} uuid等、更新者の識別子","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000801","children":[],"depth":5,"text":"[04D] range {string} 更新対象テーブル名","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000802","children":[],"depth":5,"text":"[05E] action {string} 操作内容。command系内部関数名のいずれか","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000803","children":[],"depth":5,"text":"[06F] argument {string} 操作関数に渡された引数","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000804","children":[],"depth":5,"text":"[07G] isErr {boolean} true:追加・更新が失敗","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000805","children":[],"depth":5,"text":"[08H] message {string} エラーメッセージ","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000806","children":[],"depth":5,"text":"[09I] before {JSON} 更新前の行データオブジェクト(JSON)","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000807","children":[],"depth":5,"text":"[10J] after {JSON} 更新後の行データオブジェクト(JSON)","link":[],"note":"selectの場合はここに格納","href":[],"parent":"X000797"}
{"id":"X000808","children":[],"depth":5,"text":"[11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式","link":[],"note":"","href":[],"parent":"X000797"}
{"id":"X000809","children":["X000810","X000811","X000813"],"depth":3,"text":"概要","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000810","children":[],"depth":4,"text":"スプレッドシートを凍結","link":[],"note":"","href":[],"parent":"X000809"}
{"id":"X000811","children":["X000812"],"depth":4,"text":"queryで渡された操作要求を順次処理","link":[],"note":"","href":[],"parent":"X000809"}
{"id":"X000812","children":[],"depth":5,"text":"権限確認後、<a href=\"https://workflowy.com/#/a4ffcd522269\">command系内部関数</a>の呼び出し","link":[["<a href=\"https://workflowy.com/#/a4ffcd522269\">command系内部関数</a>","a4ffcd522269","command系内部関数"]],"note":"","href":[],"parent":"X000811"}
{"id":"X000813","children":[],"depth":4,"text":"スプレッドシートの凍結解除","link":[],"note":"","href":[],"parent":"X000809"}
{"id":"X000814","children":["X000815","X000822"],"depth":3,"text":"引数","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000815","children":["X000816","X000817","X000818","X000819","X000820","X000821",[]],"depth":4,"text":"query {Object[]} 操作要求の内容","link":[],"note":"以下、行頭の「crudas」はコマンドの種類により必要となるパラメータ。'r'はselect(read)","href":[],"parent":"X000814"}
{"id":"X000816","children":[],"depth":5,"text":"table {string|string[]} 操作対象テーブル名","link":[],"note":"全commandで使用。command='schema'の場合、取得対象テーブル名またはその配列","href":[],"parent":"X000815"}
{"id":"X000817","children":[],"depth":5,"text":"command {string} 操作名","link":[],"note":"全commandで使用。create/select/update/delete/append/schema","href":[],"parent":"X000815"}
{"id":"X000818","children":[],"depth":5,"text":"cols {<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>[]} - 新規作成シートの項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"command='create'のみで使用","href":[],"parent":"X000815"}
{"id":"X000819","children":[],"depth":5,"text":"values {Object[]|Array[]} - 新規作成シートに書き込む初期値","link":[],"note":"command='create'のみで使用","href":[],"parent":"X000815"}
{"id":"X000820","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where</a> {Object|Function|string} 対象レコードの判定条件","link":[["<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where</a>","cde13ea2b6d2","where"]],"note":"command='select','update','delete'で使用","href":[],"parent":"X000815"}
{"id":"X000821","children":[],"depth":5,"text":"<a href=\"https://workflowy.com/#/18ae7059355f\">record</a> {Object|Function} 追加・更新する値","link":[["<a href=\"https://workflowy.com/#/18ae7059355f\">record</a>","18ae7059355f","record"]],"note":"command='update','append'で使用","href":[],"parent":"X000815"}
{"id":"X000822","children":["X000823","X000824","X000825","X000826","X000827","X000828","X000829",[]],"depth":4,"text":"opt {Object}={} オプション","link":[],"note":"","href":[],"parent":"X000814"}
{"id":"X000823","children":[],"depth":5,"text":"userId {string}='guest' ユーザの識別子","link":[],"note":"指定する場合、必ずuserAuthも併せて指定","href":[],"parent":"X000822"}
{"id":"X000824","children":[],"depth":5,"text":"userAuth {Object.&lt;string,string&gt;}={} テーブル毎のアクセス権限。<code>{シート名:rwdos文字列}</code> 形式","link":[],"note":"r:select(read), w:write, d:delete, s:schema, o:own only(指定シートのprimaryKeyがuserIdと一致するレコードのみ参照・変更可。削除不可)。追加はwがあれば可\n\no(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。\nまた検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可\nread/writeは自分のみ可、delete/schemaは実行不可","href":[],"parent":"X000822"}
{"id":"X000825","children":[],"depth":5,"text":"log {string}='log' 更新履歴テーブル名","link":[],"note":"nullの場合、ログ出力は行わない。領域名 > A1記法 > シート名の順に解釈","href":[],"parent":"X000822"}
{"id":"X000826","children":[],"depth":5,"text":"maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数","link":[],"note":"","href":[],"parent":"X000822"}
{"id":"X000827","children":[],"depth":5,"text":"interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)","link":[],"note":"","href":[],"parent":"X000822"}
{"id":"X000828","children":[],"depth":5,"text":"guestAuth {Object.&lt;string,string&gt;} ゲストに付与する権限。<code>{シート名:rwdos文字列}</code> 形式","link":[],"note":"","href":[],"parent":"X000822"}
{"id":"X000829","children":[],"depth":5,"text":"adminId {string}='Administrator' 管理者として扱うuserId","link":[],"note":"管理者は全てのシートの全権限を持つ","href":[],"parent":"X000822"}
{"id":"X000830","children":["X000831","X000832","X000833","X000834","X000835","X000836"],"depth":3,"text":"戻り値 {Object[]} 以下のメンバを持つオブジェクトの配列","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000831","children":[],"depth":4,"text":"query {Object} 引数として渡された<a href=\"https://workflowy.com/#/ceffd9e40da5\">query</a>のコピー","link":[["<a href=\"https://workflowy.com/#/ceffd9e40da5\">query</a>","ceffd9e40da5","query"]],"note":"","href":[],"parent":"X000830"}
{"id":"X000832","children":[],"depth":4,"text":"isErr {boolean}=false 正常終了ならfalse","link":[],"note":"一つのqueryで複数の処理を指示した場合(ex.複数レコードの追加)、いずれか一つでもエラーになればisErrはtrueとなる。","href":[],"parent":"X000830"}
{"id":"X000833","children":[],"depth":4,"text":"message {string} エラーメッセージ。isErr==trueの場合のみ。","link":[],"note":"","href":[],"parent":"X000830"}
{"id":"X000834","children":[],"depth":4,"text":"row {Object[]}=null selectの該当行オブジェクトの配列","link":[],"note":"該当無しの場合、row.length===0","href":[],"parent":"X000830"}
{"id":"X000835","children":[],"depth":4,"text":"schema {Object.&lt;string,<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>[]&gt;} schemaで取得した{テーブル名：項目定義オブジェクトの配列}形式のオブジェクト","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000830"}
{"id":"X000836","children":[],"depth":4,"text":"log {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>[]} 更新履歴","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"update,deleteで該当無しの場合、log.length===0","href":[],"parent":"X000830"}
{"id":"X000837","children":["X000838","X000845","X000852","X000862","X000868","X000873","X000874"],"depth":3,"text":"内部関数 - 非command系","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000838","children":["X000839","X000842"],"depth":4,"text":"constructor() : メンバの初期値設定、更新履歴の準備","link":[],"note":"","href":[],"parent":"X000837"}
{"id":"X000839","children":["X000840","X000841"],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000838"}
{"id":"X000840","children":[],"depth":6,"text":"メンバの初期値設定","link":[],"note":"","href":[],"parent":"X000839"}
{"id":"X000841","children":[],"depth":6,"text":"「更新履歴」の準備","link":[],"note":"","href":[],"parent":"X000839"}
{"id":"X000842","children":["X000843","X000844"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000838"}
{"id":"X000843","children":[],"depth":6,"text":"<a href=\"https://workflowy.com/#/ceffd9e40da5\">query {Object} 操作要求の内容</a>","link":[["<a href=\"https://workflowy.com/#/ceffd9e40da5\">query {Object} 操作要求の内容</a>","ceffd9e40da5","query {Object} 操作要求の内容"]],"note":"","href":[],"parent":"X000842"}
{"id":"X000844","children":[],"depth":6,"text":"<a href=\"https://workflowy.com/#/83fc9661f4ca\">opt {Object}={} オプション</a>","link":[["<a href=\"https://workflowy.com/#/83fc9661f4ca\">opt {Object}={} オプション</a>","83fc9661f4ca","opt {Object}={} オプション"]],"note":"","href":[],"parent":"X000842"}
{"id":"X000845","children":["X000846","X000851"],"depth":4,"text":"genTable() : <a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>オブジェクトを生成","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000837"}
{"id":"X000846","children":["X000847",[]],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000845"}
{"id":"X000847","children":["X000848","X000849","X000850"],"depth":6,"text":"arg {Object}","link":[],"note":"","href":[],"parent":"X000846"}
{"id":"X000848","children":[],"depth":7,"text":"name {string} - テーブル名","link":[],"note":"","href":[],"parent":"X000847"}
{"id":"X000849","children":[],"depth":7,"text":"[cols] {<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>[]} - 新規作成シートの項目定義オブジェクトの配列","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000847"}
{"id":"X000850","children":[],"depth":7,"text":"[values] {Object[]|Array[]} - 新規作成シートに書き込む初期値","link":[],"note":"","href":[],"parent":"X000847"}
{"id":"X000851","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>}","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000845"}
{"id":"X000852","children":["X000853","X000859"],"depth":4,"text":"genSchema() : <a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>オブジェクトを生成","link":[["<a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>","1807783e0064","sdbSchema"]],"note":"","href":[],"parent":"X000837"}
{"id":"X000853","children":["X000854"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000852"}
{"id":"X000854","children":["X000855","X000856","X000857","X000858"],"depth":6,"text":"arg {Object}","link":[],"note":"","href":[],"parent":"X000853"}
{"id":"X000855","children":[],"depth":7,"text":"cols {sdbColumn[]} - 項目定義オブジェクトの配列","link":[],"note":"","href":[],"parent":"X000854"}
{"id":"X000856","children":[],"depth":7,"text":"header {string[]} - ヘッダ行のシートイメージ(=項目名一覧)","link":[],"note":"","href":[],"parent":"X000854"}
{"id":"X000857","children":[],"depth":7,"text":"notes {string[]} - 項目定義メモの配列","link":[],"note":"","href":[],"parent":"X000854"}
{"id":"X000858","children":[],"depth":7,"text":"values {Object[]} - 初期データとなる行オブジェクトの配列","link":[],"note":"","href":[],"parent":"X000854"}
{"id":"X000859","children":["X000860","X000861"],"depth":5,"text":"戻り値 {Object}","link":[],"note":"","href":[],"parent":"X000852"}
{"id":"X000860","children":[],"depth":6,"text":"schema {<a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>}","link":[["<a href=\"https://workflowy.com/#/1807783e0064\">sdbSchema</a>","1807783e0064","sdbSchema"]],"note":"","href":[],"parent":"X000859"}
{"id":"X000861","children":[],"depth":6,"text":"notes {string[]} ヘッダ行に対応したメモ","link":[],"note":"","href":[],"parent":"X000859"}
{"id":"X000862","children":["X000863","X000865"],"depth":4,"text":"genColumn(): <a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>オブジェクトを生成","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000837"}
{"id":"X000863","children":["X000864"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000862"}
{"id":"X000864","children":[],"depth":6,"text":"arg {string|<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>} シート上のメモの文字列またはsdbColumn","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000863"}
{"id":"X000865","children":["X000866","X000867"],"depth":5,"text":"戻り値 {Object}","link":[],"note":"","href":[],"parent":"X000862"}
{"id":"X000866","children":[],"depth":6,"text":"column {<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>} 項目の定義情報","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000865"}
{"id":"X000867","children":[],"depth":6,"text":"note {string} シート上のメモの文字列","link":[],"note":"","href":[],"parent":"X000865"}
{"id":"X000868","children":["X000869","X000870","X000872"],"depth":4,"text":"genLog() : <a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>オブジェクトを生成","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000837"}
{"id":"X000869","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000868"}
{"id":"X000870","children":["X000871"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000868"}
{"id":"X000871","children":[],"depth":6,"text":"arg {Object.&lt;string,any&gt;} sdbLogに個別設定するメンバ名と値","link":[],"note":"","href":[],"parent":"X000870"}
{"id":"X000872","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>}","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000868"}
{"id":"X000873","children":[],"depth":4,"text":"convertRow() : シートイメージと行オブジェクトの相互変換","link":[],"note":"","href":[],"parent":"X000837"}
{"id":"X000874","children":["X000875","X000876"],"depth":4,"text":"functionalize() : where句のオブジェクト・文字列を関数化","link":[],"note":"","href":[],"parent":"X000837"}
{"id":"X000875","children":[],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000874"}
{"id":"X000876","children":[],"depth":5,"text":"戻り値","link":[],"note":"","href":[],"parent":"X000874"}
{"id":"X000877","children":["X000878","X000881","X000888","X000896","X000903","X000910",[]],"depth":3,"text":"内部変数 - command系","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000878","children":["X000879","X000880"],"depth":4,"text":"createTable() : データから新規テーブルを生成","link":[],"note":"管理者のみ実行可","href":[],"parent":"X000877"}
{"id":"X000879","children":[],"depth":5,"text":"引数 : genTable()の<a href=\"https://workflowy.com/#/4976c8818628\">引数</a>","link":[["<a href=\"https://workflowy.com/#/4976c8818628\">引数</a>","4976c8818628","引数"]],"note":"","href":[],"parent":"X000878"}
{"id":"X000880","children":[],"depth":5,"text":"戻り値 {sdbLog}","link":[],"note":"","href":[],"parent":"X000878"}
{"id":"X000881","children":["X000882","X000883","X000887"],"depth":4,"text":"selectRow() : テーブルから条件に合致する行を抽出","link":[],"note":"","href":[],"parent":"X000877"}
{"id":"X000882","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000881"}
{"id":"X000883","children":["X000884"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000881"}
{"id":"X000884","children":["X000885","X000886"],"depth":6,"text":"arg {Object|Object[]}","link":[],"note":"","href":[],"parent":"X000883"}
{"id":"X000885","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>} 操作対象のテーブル管理情報","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000884"}
{"id":"X000886","children":[[]],"depth":7,"text":"where {Object|Function|string} 対象レコードの判定条件","link":[],"note":"- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新\n- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新\n- string\n  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。<code>{〜}</code> で囲みreturn文を付与。\n  - その他 ⇒ 項目定義で\"primaryKey\"を指定した項目の値\n- その他(Object,function,string以外) ⇒ 項目定義で\"primaryKey\"を指定した項目の値","href":[],"parent":"X000884"}
{"id":"X000887","children":[],"depth":5,"text":"戻り値 {Object[]} 該当行オブジェクト","link":[],"note":"抽出された行オブジェクトはafterに出力。セルの最大文字数は50,000なので、呼出元には抽出結果(行オブジェクトの配列)afterをJSON.parseして戻す","href":[],"parent":"X000881"}
{"id":"X000888","children":["X000889","X000890","X000895"],"depth":4,"text":"updateRow() : テーブルを更新","link":[],"note":"","href":[],"parent":"X000877"}
{"id":"X000889","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000888"}
{"id":"X000890","children":["X000891"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000888"}
{"id":"X000891","children":["X000892","X000893","X000894"],"depth":6,"text":"arg {Object}","link":[],"note":"argの配列は使用しない。同一テーブルでも複数の条件で更新する場合、SpreadDb.arg.query自体を別オブジェクトで用意する","href":[],"parent":"X000890"}
{"id":"X000892","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>} 操作対象のテーブル管理情報","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000891"}
{"id":"X000893","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where {Object|Function|string} 対象レコードの判定条件</a>","link":[["<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where {Object|Function|string} 対象レコードの判定条件</a>","cde13ea2b6d2","where {Object|Function|string} 対象レコードの判定条件"]],"note":"","href":[],"parent":"X000891"}
{"id":"X000894","children":[[]],"depth":7,"text":"record {Object|string|Function} 更新する値","link":[],"note":"record句の指定方法\n- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}\n- string ⇒ 上記Objectに変換可能なJSON文字列\n- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数\n  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}","href":[],"parent":"X000891"}
{"id":"X000895","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>[]}","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000888"}
{"id":"X000896","children":["X000897","X000898","X000902"],"depth":4,"text":"appendRow() : テーブルに新規行を追加","link":[],"note":"","href":[],"parent":"X000877"}
{"id":"X000897","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000896"}
{"id":"X000898","children":["X000899"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000896"}
{"id":"X000899","children":["X000900","X000901"],"depth":6,"text":"arg {Object|Object[]}","link":[],"note":"","href":[],"parent":"X000898"}
{"id":"X000900","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>} 操作対象のテーブル管理情報","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000899"}
{"id":"X000901","children":[],"depth":7,"text":"record {Object|Object[]} 追加する行オブジェクト","link":[],"note":"","href":[],"parent":"X000899"}
{"id":"X000902","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>[]}","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000896"}
{"id":"X000903","children":["X000904","X000905","X000909"],"depth":4,"text":"deleteRow() : テーブルから条件に合致する行を削除","link":[],"note":"","href":[],"parent":"X000877"}
{"id":"X000904","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000903"}
{"id":"X000905","children":["X000906"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000903"}
{"id":"X000906","children":["X000907","X000908"],"depth":6,"text":"arg {Object|Object[]}","link":[],"note":"","href":[],"parent":"X000905"}
{"id":"X000907","children":[],"depth":7,"text":"table {<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>} 操作対象のテーブル管理情報","link":[["<a href=\"https://workflowy.com/#/20e32e8d7cef\">sdbTable</a>","20e32e8d7cef","sdbTable"]],"note":"","href":[],"parent":"X000906"}
{"id":"X000908","children":[],"depth":7,"text":"<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where {Object|Function|string} 対象レコードの判定条件</a>","link":[["<a href=\"https://workflowy.com/#/cde13ea2b6d2\">where {Object|Function|string} 対象レコードの判定条件</a>","cde13ea2b6d2","where {Object|Function|string} 対象レコードの判定条件"]],"note":"","href":[],"parent":"X000906"}
{"id":"X000909","children":[],"depth":5,"text":"戻り値 {<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>[]}","link":[["<a href=\"https://workflowy.com/#/527c4b49ce41\">sdbLog</a>","527c4b49ce41","sdbLog"]],"note":"","href":[],"parent":"X000903"}
{"id":"X000910","children":["X000911","X000912","X000914"],"depth":4,"text":"getSchema() : 指定されたテーブルの構造情報を取得","link":[],"note":"","href":[],"parent":"X000877"}
{"id":"X000911","children":[],"depth":5,"text":"概要","link":[],"note":"","href":[],"parent":"X000910"}
{"id":"X000912","children":["X000913"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000910"}
{"id":"X000913","children":[],"depth":6,"text":"arg {string|string[]} 取得対象テーブル名","link":[],"note":"","href":[],"parent":"X000912"}
{"id":"X000914","children":[],"depth":5,"text":"戻り値 {Object.&lt;string,<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>[]&gt;} {テーブル名：項目定義オブジェクトの配列}形式","link":[["<a href=\"https://workflowy.com/#/c32e233a6008\">sdbColumn</a>","c32e233a6008","sdbColumn"]],"note":"","href":[],"parent":"X000910"}
{"id":"X000915","children":["X000916","X000917"],"depth":3,"text":"注意事項","link":[],"note":"","href":[],"parent":"X000758"}
{"id":"X000916","children":[],"depth":4,"text":"関数での抽出条件・値の指定時の制約","link":[],"note":"default(sdbColumn), where, record(update他)では関数での指定を可能にしている。\nこれらをセル・メモで保存する場合、文字列に変換する必要があるが、以下のルールで対応する。\n\n- 引数は行オブジェクトのみ(引数は必ず一つ)\n- 関数に復元する場合`new Function('o',[ロジック部分文字列])で関数化\n  - 必ず\"{〜}\"で囲み、return文を付ける","href":[],"parent":"X000915"}
{"id":"X000917","children":[],"depth":4,"text":"権限によるアクセス制限(rwdos)","link":[],"note":"r:read, w:write, d:delete, o:own, s:schema + c:createの略。コマンド毎に以下の権限が必要になる。\n\ncreate(c): テーブル生成。管理者のみ実行可\nselect(r): 参照\nupdate(rw): 更新\nappend(w): 追加\ndelete(d): 削除\nschema(s): テーブル管理情報の取得\n\n特殊権限'o' : イベント申込情報等、本人以外の参照・更新を抑止するためのアクセス権限。\n- `userAuth:{シート名:o}`が指定された場合、当該シートのprimaryKey=userIdとなっているレコードのみ'r','w'可と看做す。\n- 'o'指定が有るシートのアクセス権として'rwds'が指定されていても'o'のみ指定されたと看做す\n- 'o'指定でselect/updateする場合、where句は無視され自情報に対する処理要求と看做す\n  ex. userId=2の人がuserId=1の人の氏名の更新を要求 ⇒ userId=2の氏名が更新される\n  SpreadDb(\n    {table:'camp2024',command:'update',where:1,record:{'申込者氏名':'テスト'}},\n    {userId:2,userAuth:{camp2024:'o'}}\n  ); // -> userId=2の氏名が「テスト」に","href":[],"parent":"X000915"}
{"id":"X000918","children":["X000919","X000940"],"depth":2,"text":"workflowy : workflowy(OPML)をmarkdown文書に変換","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000919","children":["X000920","X000933"],"depth":3,"text":"1.0.0","link":[],"note":"","href":[],"parent":"X000918"}
{"id":"X000920","children":["X000921","X000926"],"depth":4,"text":"typedefs","link":[],"note":"","href":[],"parent":"X000919"}
{"id":"X000921","children":["X000922","X000925"],"depth":5,"text":"opmlXML {Object} require('xml-js').xml2json()によるopml処理により生成されるオブジェクト","link":[],"note":"<a href=\"https://www.npmjs.com/package/xml-js\">https://www.npmjs.com/package/xml-js</a>","href":[],"parent":"X000920"}
{"id":"X000922","children":["X000923"],"depth":6,"text":"declaration {Object}","link":[],"note":"","href":[],"parent":"X000921"}
{"id":"X000923","children":["X000924"],"depth":7,"text":"attributes {Object}","link":[],"note":"","href":[],"parent":"X000922"}
{"id":"X000924","children":[],"depth":8,"text":"version {string} XMLバージョン","link":[],"note":"","href":[],"parent":"X000923"}
{"id":"X000925","children":[],"depth":6,"text":"elements {Object[]} head,body他の子要素","link":[],"note":"","href":[],"parent":"X000921"}
{"id":"X000926","children":["X000927","X000928","X000929","X000930"],"depth":5,"text":"opmlObj {Object} opmlの一行分のオブジェクト","link":[],"note":"","href":[],"parent":"X000920"}
{"id":"X000927","children":[],"depth":6,"text":"type {string} \"element\"固定","link":[],"note":"","href":[],"parent":"X000926"}
{"id":"X000928","children":[],"depth":6,"text":"name {string} タグ名。\"outline\"のみ対象とする","link":[],"note":"","href":[],"parent":"X000926"}
{"id":"X000929","children":[],"depth":6,"text":"elements {opmlObj[]} 子要素となるOPML一行分のオブジェクト","link":[],"note":"","href":[],"parent":"X000926"}
{"id":"X000930","children":["X000931","X000932"],"depth":6,"text":"attributes {Object}","link":[],"note":"","href":[],"parent":"X000926"}
{"id":"X000931","children":[],"depth":7,"text":"text {striing} 表題のinnerHTML","link":[],"note":"- 逆参照は\"n Backlinks\"","href":[],"parent":"X000930"}
{"id":"X000932","children":[],"depth":7,"text":"_note {string} ノートのinnerHTML","link":[],"note":"- 改行は'\\n'","href":[],"parent":"X000930"}
{"id":"X000933","children":["X000934","X000937","X000939"],"depth":4,"text":"テスト用サンプル","link":[],"note":"","href":[],"parent":"X000919"}
{"id":"X000934","children":["X000935","X000936"],"depth":5,"text":"No.1","link":[],"note":"No.1のノート\n- 項目1\n- 項目2","href":[],"parent":"X000933"}
{"id":"X000935","children":[],"depth":6,"text":"No.1.1","link":[],"note":"ノート内で[リンク](#a0376dbc8b20)を張ってみた","href":["a0376dbc8b20"],"parent":"X000934"}
{"id":"X000936","children":[[]],"depth":6,"text":"No.1.2","link":[],"note":"","href":[],"parent":"X000934"}
{"id":"X000937","children":["X000938"],"depth":5,"text":"No.2。<b>太文字</b>と<span class=\"colored c-red\">赤文字</span>を使用","link":[],"note":"","href":[],"parent":"X000933"}
{"id":"X000938","children":[],"depth":6,"text":"<a href=\"https://workflowy.com/#/a0376dbc8b20\">No.1.2</a>","link":[["<a href=\"https://workflowy.com/#/a0376dbc8b20\">No.1.2</a>","a0376dbc8b20","No.1.2"]],"note":"","href":[],"parent":"X000937"}
{"id":"X000939","children":[],"depth":5,"text":"No.3 h1指定","link":[],"note":"","href":[],"parent":"X000933"}
{"id":"X000940","children":["X000941","X000945","X000946","X000947","X000950"],"depth":3,"text":"1.1.0","link":[],"note":"","href":[],"parent":"X000918"}
{"id":"X000941","children":["X000942","X000944"],"depth":4,"text":"workflowy主処理(main)","link":[],"note":"","href":[],"parent":"X000940"}
{"id":"X000942","children":["X000943"],"depth":5,"text":"引数","link":[],"note":"","href":[],"parent":"X000941"}
{"id":"X000943","children":[],"depth":6,"text":"option {<a href=\"https://workflowy.com/#/63c52c5262e3\">workflowy_option</a>} workflowyの動作設定用オプション指定","link":[["<a href=\"https://workflowy.com/#/63c52c5262e3\">workflowy_option</a>","63c52c5262e3","workflowy_option"]],"note":"","href":[],"parent":"X000942"}
{"id":"X000944","children":[],"depth":5,"text":"戻り値 {Function} markdown,sampleをメソッドとするクロージャ","link":[],"note":"","href":[],"parent":"X000941"}
{"id":"X000945","children":[],"depth":4,"text":"markdown() : OPML形式のテキストをマークダウンに変換","link":[],"note":"","href":[],"parent":"X000940"}
{"id":"X000946","children":[],"depth":4,"text":"sample() : ","link":[],"note":"","href":[],"parent":"X000940"}
{"id":"X000947","children":["X000948"],"depth":4,"text":"typedefs","link":[],"note":"","href":[],"parent":"X000940"}
{"id":"X000948","children":["X000949",[]],"depth":5,"text":"workflowy_option {Object} workflowyの動作設定用オプション指定","link":[],"note":"","href":[],"parent":"X000947"}
{"id":"X000949","children":[],"depth":6,"text":"mdHeader {number}=3 body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定","link":[],"note":"","href":[],"parent":"X000948"}
{"id":"X000950","children":["X000951","X000952"],"depth":4,"text":"readme","link":[],"note":"","href":[],"parent":"X000940"}
{"id":"X000951","children":[],"depth":5,"text":"使用方法","link":[],"note":"`node pipe.js markdown n`\n\n\"markdown\"は固定。nはヘッダとして扱う階層(2 -> h1,h2を作成、以下はliタグで処理)\n\n```\ncat $test/SpreadDb.opml | awk 1 | node $prj/pipe.js markdown 3 > $test/<a href=\"http://SpreadDb.md\">SpreadDb.md</a>\n```","href":[],"parent":"X000950"}
{"id":"X000952","children":["X000953","X000956"],"depth":5,"text":"更新履歴","link":[],"note":"","href":[],"parent":"X000950"}
{"id":"X000953","children":["X000954","X000955"],"depth":6,"text":"1.1.0 2025/02/07","link":[],"note":"","href":[],"parent":"X000952"}
{"id":"X000954","children":[],"depth":7,"text":"他プログラムの要素も参照可能に","link":[],"note":"ex. AuthからSpreadDbのtypedefを参照可能に","href":[],"parent":"X000953"}
{"id":"X000955","children":[],"depth":7,"text":"参照先要素を参照元以下に展開","link":[],"note":"","href":[],"parent":"X000953"}
{"id":"X000956","children":[],"depth":6,"text":"1.0.0 2025/01/30 - 初版","link":[],"note":"","href":[],"parent":"X000952"}
{"id":"X000957","children":["X000958","X000983","X000985","X000996"],"depth":2,"text":"saveSpread() : 指定スプレッドシートから各種属性情報を取得、Google Diverのスプレッドシートと同じフォルダにzip形式圧縮されたJSONとして保存","link":[],"note":"本関数はGASの制約「実行時間は6分以内」に係る場合があるので、処理が5分を超えた段階で終了し、自関数をタイマー起動するよう設定","href":[],"parent":"X000000"}
{"id":"X000958","children":["X000959"],"depth":3,"text":"概要","link":[],"note":"","href":[],"parent":"X000957"}
{"id":"X000959","children":["X000960","X000965","X000966","X000967","X000974"],"depth":4,"text":"変数'v'に設定情報や属性情報取得関数を定義","link":[],"note":"","href":[],"parent":"X000958"}
{"id":"X000960","children":["X000961","X000962","X000963","X000964"],"depth":5,"text":"属性情報","link":[],"note":"","href":[],"parent":"X000959"}
{"id":"X000961","children":[],"depth":6,"text":"propKey {string}='saveSpread' ScriptPropertyのキー名","link":[],"note":"本関数実行時に一意に特定される必要があるため、対象シート名や実行日時等を含まない固定文字列を設定","href":[],"parent":"X000960"}
{"id":"X000962","children":[],"depth":6,"text":"start {number}=Date.now() saveSpread開始日時(UNIX時刻)","link":[],"note":"","href":[],"parent":"X000960"}
{"id":"X000963","children":[],"depth":6,"text":"elapsLimit {number}=300000 一処理当たりの制限時間(5分)","link":[],"note":"","href":[],"parent":"X000960"}
{"id":"X000964","children":[],"depth":6,"text":"executionLimit {number}=100 処理を分割した場合の最大処理数","link":[],"note":"","href":[],"parent":"X000960"}
{"id":"X000965","children":[],"depth":5,"text":"getSpread() : フォルダ・ファイル関連、スプレッドシート関連情報を取得","link":[],"note":"","href":[],"parent":"X000959"}
{"id":"X000966","children":[],"depth":5,"text":"scan() : 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化","link":[],"note":"","href":[],"parent":"X000959"}
{"id":"X000967","children":["X000968"],"depth":5,"text":"getProp {Object.&lt;string,function&gt;} : シートの各属性情報取得関数群","link":[],"note":"","href":[],"parent":"X000959"}
{"id":"X000968","children":["X000969","X000970","X000971","X000972","X000973"],"depth":6,"text":"各関数の引数: arg {Object}","link":[],"note":"","href":[],"parent":"X000967"}
{"id":"X000969","children":[],"depth":7,"text":"sheet {Sheet} 処理対象とするシートオブジェクト","link":[],"note":"","href":[],"parent":"X000968"}
{"id":"X000970","children":[],"depth":7,"text":"dr {Range} sheetの内、データが存在する範囲(getDataRange())","link":[],"note":"","href":[],"parent":"X000968"}
{"id":"X000971","children":[],"depth":7,"text":"[src] {Object[][]} v.scan()に渡す二次元の属性情報。","link":[],"note":"ex. arg.src = arg.dr.getFontColorObjects()","href":[],"parent":"X000968"}
{"id":"X000972","children":[],"depth":7,"text":"[dst] {Object[][]} v.scan()に渡す前回処理結果","link":[],"note":"前回途中で処理が中断した場合、続きを追加できるようにscanに渡す","href":[],"parent":"X000968"}
{"id":"X000973","children":[],"depth":7,"text":"[func] {function} v.scan()に渡す個別セルの属性情報取得関数","link":[],"note":"","href":[],"parent":"X000968"}
{"id":"X000974","children":["X000975","X000976","X000977","X000978","X000979","X000980","X000981","X000982"],"depth":5,"text":"その他変数vの主要メンバ","link":[],"note":"※横断的に使用するもののみ列挙","href":[],"parent":"X000959"}
{"id":"X000975","children":[],"depth":6,"text":"conf {Object} 進捗状況。処理未完の場合、<a href=\"https://workflowy.com/#/89875a6cf5f6\">PropertyService</a>に保存","link":[["<a href=\"https://workflowy.com/#/89875a6cf5f6\">PropertyService</a>","89875a6cf5f6","PropertyService"]],"note":"","href":[],"parent":"X000974"}
{"id":"X000976","children":[],"depth":6,"text":"spread {Spreadsheet} 対象のスプレッドシートオブジェクト","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000977","children":[],"depth":6,"text":"srcFile {File} 対象のスプレッドシートのファイルオブジェクト","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000978","children":[],"depth":6,"text":"dstFile {File} 分析結果を保存するJSON(zip)のファイルオブジェクト","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000979","children":[],"depth":6,"text":"data {Object} 分析結果のオブジェクト","link":[],"note":"{getSpreadの結果＋getPropの結果}","href":[],"parent":"X000974"}
{"id":"X000980","children":[],"depth":6,"text":"sheetName {string} 現在処理中のシート名","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000981","children":[],"depth":6,"text":"propName {string} 現在処理中の属性名","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000982","children":[],"depth":6,"text":"folder {Folder} 処理対象スプレッドシートが存在するフォルダオブジェクト","link":[],"note":"","href":[],"parent":"X000974"}
{"id":"X000983","children":["X000984"],"depth":3,"text":"引数","link":[],"note":"","href":[],"parent":"X000957"}
{"id":"X000984","children":[],"depth":4,"text":"arg {string|boolean} セーブ対象スプレッドシートのIDまたはfalse(強制停止)","link":[],"note":"","href":[],"parent":"X000983"}
{"id":"X000985","children":["X000986","X000987","X000988","X000989","X000990","X000991","X000995",[]],"depth":3,"text":"PropertyService","link":[],"note":"","href":[],"parent":"X000957"}
{"id":"X000986","children":[],"depth":4,"text":"complete {boolean} 完了したらtrue","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000987","children":[],"depth":4,"text":"count {number} 実行回数","link":[],"note":"処理時間が5分を超え、分割実行の都度インクリメント","href":[],"parent":"X000985"}
{"id":"X000988","children":[],"depth":4,"text":"SpreadId {string} セーブ対象のスプレッドシートのID","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000989","children":[],"depth":4,"text":"sheetList {string[]} セーブ対象スプレッドシートのシート名一覧","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000990","children":[],"depth":4,"text":"propList {string[]} 出力するシート属性名の一覧。ex.<code>Values</code> ,<code>Notes</code> ","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000991","children":["X000992","X000993","X000994"],"depth":4,"text":"next {Object} 次に処理対象となるsheetList,propListの添字","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000992","children":[],"depth":5,"text":"sheet {number} sheetList内で次に処理対象とするシート名の添字","link":[],"note":"","href":[],"parent":"X000991"}
{"id":"X000993","children":[],"depth":5,"text":"prop {number} propList内で次に処理対象とする属性名の添字","link":[],"note":"","href":[],"parent":"X000991"}
{"id":"X000994","children":[],"depth":5,"text":"row {number} 次に処理対象とする行番号(0オリジン)","link":[],"note":"","href":[],"parent":"X000991"}
{"id":"X000995","children":[],"depth":4,"text":"fileId {string} 出力先ファイル(zip)のファイルID","link":[],"note":"","href":[],"parent":"X000985"}
{"id":"X000996","children":[],"depth":3,"text":"戻り値 {<a href=\"https://workflowy.com/#/89875a6cf5f6\">PropertyService</a>} ※completeで完了しているか判断","link":[["<a href=\"https://workflowy.com/#/89875a6cf5f6\">PropertyService</a>","89875a6cf5f6","PropertyService"]],"note":"","href":[],"parent":"X000957"}
{"id":"X000997","children":["X000998","X001009","X001020","X001027"],"depth":2,"text":"embedRecursively 1.2.0","link":[],"note":"","href":[],"parent":"X000000"}
{"id":"X000998","children":["X000999","X001003","X001004","X001005"],"depth":3,"text":"はじめに","link":[],"note":"","href":[],"parent":"X000997"}
{"id":"X000999","children":["X001000","X001001","X001002"],"depth":4,"text":"開発の動機","link":[],"note":"","href":[],"parent":"X000998"}
{"id":"X001000","children":[],"depth":5,"text":"core.jsとpipe.jsの一本化","link":[],"note":"","href":[],"parent":"X000999"}
{"id":"X001001","children":[],"depth":5,"text":"JavsScriptソースのclass挿入時、メソッドの1行目の空白が無視されるバグ修正","link":[],"note":"","href":[],"parent":"X000999"}
{"id":"X001002","children":[],"depth":5,"text":"挿入指定文字列前のインデントを有効化","link":[],"note":"","href":[],"parent":"X000999"}
{"id":"X001003","children":[],"depth":4,"text":"呼出元の挿入指示文字列","link":[],"note":"- 「::(パス)::」 ⇒ 該当部分をパスで指定されたファイルの内容で置換\n- 「::(メモ[+])::(パス)::」 ⇒ 子文書の内容についてのメモ。あくまで備忘であり、使用されない。<br>\n  末尾に'+'が無い場合、子文書のルート要素を削除する。<br>\n  '+'が有った場合、子文書のルート要素を挿入場所の1レベル下の要素として挿入する。\n\n「ルート要素」とは、被挿入文書の最高レベルの章題が単一だった場合、その章題。\n複数だった場合はルート要素とは看做さない。","href":[],"parent":"X000998"}
{"id":"X001004","children":[],"depth":4,"text":"使用例","link":[],"note":"1. 挿入指定文字列でメモ有り・子文書ルート指定あり\n<!--::test11+::$test/<a href=\"http://ooChild.md\">ooChild.md</a>::-->\n\n2. 挿入指定文字列でメモ有り・子文書ルート指定なし\n<!--::test21::$test/<a href=\"http://ooChild.md\">ooChild.md</a>::-->\n\n3. 挿入指定文字列でメモなし・子文書ルート指定あり\n<!--::+::$test/<a href=\"http://ooChild.md\">ooChild.md</a>::-->\n\n4. 挿入指定文字列でパスのみ指定\n<!--::$test/<a href=\"http://ooChild.md\">ooChild.md</a>::-->","href":[],"parent":"X000998"}
{"id":"X001005","children":["X001006","X001007"],"depth":4,"text":"変更履歴","link":[],"note":"","href":[],"parent":"X000998"}
{"id":"X001006","children":[],"depth":5,"text":"rev 1.0.0 2024/03/29 初版","link":[],"note":"","href":[],"parent":"X001005"}
{"id":"X001007","children":["X001008"],"depth":5,"text":"rev 1.1.0 2024/04/08","link":[],"note":"","href":[],"parent":"X001005"}
{"id":"X001008","children":[],"depth":6,"text":"ルート要素削除指定、レベルシフト指定を追加","link":[],"note":"","href":[],"parent":"X001007"}
{"id":"X001009","children":["X001010","X001015"],"depth":3,"text":"処理概要","link":[],"note":"","href":[],"parent":"X000997"}
{"id":"X001010","children":["X001011","X001012","X001013","X001014"],"depth":4,"text":"事前準備","link":[],"note":"","href":[],"parent":"X001009"}
{"id":"X001011","children":[],"depth":5,"text":"引数の既定値設定","link":[],"note":"","href":[],"parent":"X001010"}
{"id":"X001012","children":[],"depth":5,"text":"階層を判定、一定以上なら処理中断","link":[],"note":"","href":[],"parent":"X001010"}
{"id":"X001013","children":[],"depth":5,"text":"処理対象テキストを行毎に分割、v.lineに格納","link":[],"note":"","href":[],"parent":"X001010"}
{"id":"X001014","children":[],"depth":5,"text":"ルート要素の有無、レベルを判定","link":[],"note":"","href":[],"parent":"X001010"}
{"id":"X001015","children":["X001016","X001018","X001019"],"depth":4,"text":"処理対象テキストを一行毎に処理","link":[],"note":"","href":[],"parent":"X001009"}
{"id":"X001016","children":["X001017"],"depth":5,"text":"MD文書のタイトル行だった場合(ex. ## hoge)","link":[],"note":"","href":[],"parent":"X001015"}
{"id":"X001017","children":[],"depth":6,"text":"親文書の挿入箇所のレベルに\"#\"の数を加えてタイトル行として出力","link":[],"note":"","href":[],"parent":"X001016"}
{"id":"X001018","children":[],"depth":5,"text":"挿入指定行だった場合(ex. //::hoge.js::)","link":[],"note":"","href":[],"parent":"X001015"}
{"id":"X001019","children":[],"depth":5,"text":"いずれでもない場合","link":[],"note":"","href":[],"parent":"X001015"}
{"id":"X001020","children":["X001021","X001022"],"depth":3,"text":"引数","link":[],"note":"","href":[],"parent":"X000997"}
{"id":"X001021","children":[],"depth":4,"text":"content {string} 処理対象テキスト","link":[],"note":"","href":[],"parent":"X001020"}
{"id":"X001022","children":["X001023","X001024","X001025","X001026"],"depth":4,"text":"opt","link":[],"note":"","href":[],"parent":"X001020"}
{"id":"X001023","children":[],"depth":5,"text":"maxDepth {number}=10 最深階層(無限ループ防止)","link":[],"note":"","href":[],"parent":"X001022"}
{"id":"X001024","children":[],"depth":5,"text":"encoding {string}='utf-8' 入力ファイルのエンコード","link":[],"note":"","href":[],"parent":"X001022"}
{"id":"X001025","children":[],"depth":5,"text":"parentLevel {number}=0 挿入指定文字列が置かれた位置の親要素のレベル","link":[],"note":"","href":[],"parent":"X001022"}
{"id":"X001026","children":[],"depth":5,"text":"useRoot {boolean}=false 子文書ルート使用指定","link":[],"note":"true : 子文書のルート要素を使用する\nfalse : 子文書のルート要素は使用しない(呼出元の要素をルート要素として扱う)","href":[],"parent":"X001022"}
{"id":"X001027","children":[],"depth":3,"text":"戻り値 {string} 埋込後の処理対象テキスト","link":[],"note":"","href":[],"parent":"X000997"}
