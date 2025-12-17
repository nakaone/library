/** authAuditLog: authServerの監査ログをシートに出力
 * @typedef {Object} authAuditLog - authServerの監査ログをシートに出力
 * @prop {string} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
 * @prop {number} duration - 処理時間ミリ秒単位
 * @prop {string} memberId - メンバの識別子メールアドレス
 * @prop {string} [deviceId] - デバイスの識別子
 * @prop {string} func - サーバ側関数名
 * @prop {string} result=normal - サーバ側処理結果"fatal","warning","normal"
 * @prop {string} note - 備考
 */
/** authClient: クライアント側中核クラス
 * @class
 * @classdesc クライアント側中核クラス
 * - 初期化の際に非同期処理が必要なため、インスタンス作成は
 *   `new authClient()`ではなく`authClient.initialize()`で行う
 * @prop {authClientConfig} cf - authClient設定情報
 * @prop {Object} idb - IndexedDBと同期、authClient内で共有
 * @prop {cryptoClient} crypto - 暗号化・署名検証
 * 
 * @example インスタンス作成のサンプル
 * ```js
 * async function onLoad(){
 *   const v = {whois:`onLoad`, rv:null};
 *   dev.start(v);
 *   try {
 * 
 *     dev.step(1);  // authClientインスタンス作成
 *     const auth = await authClient.initialize({
 *       adminMail: 'ena.kaon@gmail.com',
 *       adminName: 'あどみ',
 *       api: 'abcdefghijklmnopqrstuvwxyz',
 *     });
 * 
 *     dev.step(2);  // authインスタンスをグローバル変数と戻り値(テスト用)にセット
 *     globalThis.auth = auth;
 *     v.rv = auth;
 * 
 *     dev.end(); // 終了処理
 *     return v.rv;
 * 
 *   } catch (e) { return dev.error(e); }
 * }
 */
/** authClientConfig: クライアント側特有の設定項目
 * @typedef {Object} authClientConfig
 * @extends {authConfig}
 * @prop {string} api - サーバ側WebアプリURLのID
 *   https://script.google.com/macros/s/(この部分)/exec
 * @prop {number} timeout=300000 - サーバからの応答待機時間
 *   これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {string} storeName="config" - IndexedDBのストア名
 * @prop {number} dbVersion=1 - IndexedDBのバージョン
 */
/** authConfig: クライアント・サーバ共通設定情報
 * @class
 * @classdesc クライアント・サーバ共通設定情報
 * @prop {string} systemName="Auth" - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者氏名
 * @prop {number} allowableTimeDifference=120000 - クライアント・サーバ間通信時の許容時差既定値は2分
 * @prop {string} RSAbits=2048 - 鍵ペアの鍵長
 * @prop {Object} underDev - テスト時の設定
 * @prop {boolean} underDev.isTest=false - 開発モードならtrue
 */
/** authErrorLog: authServerのエラーログをシートに出力
 * @typedef {Object} authErrorLog - authServerのエラーログをシートに出力
 * @prop {string} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
 * @prop {string} memberId - メンバの識別子
 * @prop {string} deviceId - デバイスの識別子
 * @prop {string} result=fatal - サーバ側処理結果fatal/warning/normal
 * @prop {string} [message] - サーバ側からのエラーメッセージnormal時はundefined
 * @prop {string} [stack] - エラー発生時のスタックトレース本項目は管理者への通知メール等、シート以外には出力不可
 */
/** authIndexedDB: IndexedDBに保存する内容(=this.idb)
 * @typedef {Object} authIndexedDB - IndexedDBに保存する内容(=this.idb)
 * @prop {string} memberId='dummyMemberID' - メンバ識別子(メールアドレス。初期値は固定文字列)
 * @prop {string} memberName='dummyMemberName' - メンバの氏名(初期値は固定文字列)
 * @prop {string}　deviceId='dummyDeviceID' - サーバ側で生成(UUIDv4。初期値は固定文字列)
 * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
 * @prop {CryptoKey} CPkeySign - 署名用公開鍵
 * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
 * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
 * @prop {string} keyGeneratedDateTime - 鍵ペア生成日時(UNIX時刻)
 * @prop {string} SPkeySign=null - サーバ側署名用公開鍵
 * @prop {string} SPkeyEnc=null - サーバ側暗号化用公開鍵
 */
/** authRequest: authClientからauthServerへの処理要求(平文)
 * @typedef {Object} authRequest
 * @prop {string} memberId=this.idb.memberId - メンバの識別子
 * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子UUIDv4
 * @prop {string} memberName=this.idb.memberName - メンバの氏名管理者が加入認否判断のため使用
 * @prop {string} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
 * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
 * @prop {string} func - サーバ側関数名
 * @prop {any[]} arg=[] - サーバ側関数に渡す引数の配列
 * @prop {string} nonce=UUIDv4 - 要求の識別子UUIDv4
 */
/** authRequestLog: 重複チェック用のリクエスト履歴
 * @typedef {Object[]} authRequestLog - 重複チェック用のリクエスト履歴
 * @prop {number} timestamp=Date.now() - リクエストを受けたサーバ側日時
 * @prop {string} nonce - クライアント側で採番されたリクエスト識別子UUIDv4
 */
/** authResponse: authServerからauthClientへの処理結果(平文)
 * @typedef {Object} authResponse - authServerからauthClientへの処理結果(平文)
 * == authClient設定項目(authRequestからの転記項目)
 * @prop {string} memberId - メンバの識別子
 * @prop {string} deviceId - デバイスの識別子。UUIDv4
 * @prop {string} memberName - メンバの氏名
 * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
 * @prop {number} requestTime - 要求日時UNIX時刻
 * @prop {string} func - サーバ側関数名
 * @prop {any[]} arg - サーバ側関数に渡す引数の配列
 * @prop {string} nonce - 要求の識別子UUIDv4
 * 
 * == authServer内での追加項目
 * @prop {string} SPkeySign=this.keys.SPkeySign - サーバ側署名用公開鍵
 * @prop {string} SPkeyEnc=this.keys.SPkeyEnc - サーバ側暗号化用公開鍵
 * @prop {any} response=null - サーバ側関数の戻り値
 * @prop {number} receptTime=Date.now() - サーバ側の処理要求受付日時
 * @prop {number} responseTime=0 - サーバ側処理終了日時
 *   エラーの場合は発生日時
 * @prop {string} status="success" - サーバ側処理結果
 *   正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、
 *   致命的エラーの場合はErrorオブジェクト
 * @prop {string} message="" - メッセージ(statusの補足)
 * 
 * == authClient設定項目(authServerからの返信を受け、authClient内で追加)
 * @prop {string} decrypt="success" - クライアント側での復号処理結果
 *   "success":正常、それ以外はエラーメッセージ
 */
/** authScriptProperties: サーバ側ScriptPropertiesに保存する情報
 * @typedef {Object} authScriptProperties - サーバ側ScriptPropertiesに保存する内容
 * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時。UNIX時刻
 * @prop {string} SSkeySign - 署名用秘密鍵(PEM形式)
 * @prop {string} SPkeySign - 署名用公開鍵(PEM形式)
 * @prop {string} SSkeyEnc - 暗号化用秘密鍵(PEM形式)
 * @prop {string} SPkeyEnc - 暗号化用公開鍵(PEM形式)
 * @prop {string} oldSSkeySign - バックアップ用署名用秘密鍵(PEM形式)
 * @prop {string} oldSPkeySign - バックアップ用署名用公開鍵(PEM形式)
 * @prop {string} oldSSkeyEnc - バックアップ用暗号化用秘密鍵(PEM形式)
 * @prop {string} oldSPkeyEnc - バックアップ用暗号化用公開鍵(PEM形式)
 * @prop {string} requestLog - 重複チェック用のリクエスト履歴。{authRequestLog[]}のJSON
 */
/** authServer: サーバ側中核クラス
 * @class
 * @classdesc サーバ側中核クラス
 * @prop {authServerConfig} cf - authServer設定項目
 * @prop {cryptoServer} crypto - 暗号化・署名検証
 */
/** authServerConfig: authServer特有の設定項目
 * @typedef {Object} authServerConfig - authServer特有の設定項目
 * @extends {authConfig}
 * @prop {string} memberList="memberList" - memberListシート名
 * @prop {number} defaultAuthority=1 - 新規加入メンバの権限の既定値
 * @prop {number} memberLifeTime=31536000000 - 加入有効期間
 *   メンバ加入承認後の有効期間。既定値は1年
 * @prop {number} prohibitedToJoin=259200000 - 加入禁止期間
 *   管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日
 * @prop {number} loginLifeTime=86400000 - 認証有効時間
 *   ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日
 * @prop {number} loginFreeze=600000 - 認証凍結時間
 *   認証失敗後、再認証要求が禁止される期間。既定値は10分
 * @prop {number} requestIdRetention=300000 - 重複リクエスト拒否となる時間。既定値は5分
 * @prop {string} errorLog="errorLog" - エラーログのシート名
 * @prop {number} storageDaysOfErrorLog=604800000 - エラーログの保存日数
 *   単位はミリ秒。既定値は7日分
 * @prop {string} auditLog="auditLog" - 監査ログのシート名
 * @prop {number} storageDaysOfAuditLog=604800000 - 監査ログの保存日数
 *   単位はミリ秒。既定値は7日分
 * 
 * @prop {authServerFuncDef} func={} - サーバ側関数設定
 * 
 * ログイン試行関係の設定値
 * @prop {number} passcodeLength=6 - パスコードの桁数
 * @prop {number} maxTrial=3 - パスコード入力の最大試行回数
 * @prop {number} passcodeLifeTime=600000 - パスコードの有効期間。既定値は10分
 * @prop {number} maxTrialLog=5 - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
 * 
 * 開発関係の設定値
 * @prop {boolean} udSendPasscode=false - 開発中識別フラグパスコード通知メール送信を抑止するならtrue
 * @prop {boolean} udSendInvitation=false - 開発中の加入承認通知メール送信
 *   開発中に加入承認通知メール送信を抑止するならtrue
 */
/** authServerFuncDef: サーバ側関数設定オブジェクト
 * @typedef {Object.<string,Function|Arror>} authServerFuncDef - サーバ側関数設定 
 * @prop {number} func.authority=0 - サーバ側関数の所要権限
 *   サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限
 *   ex. authServerConfig.func.authority === 0
 * @prop {Function} func.do - 実行するサーバ側関数
 * 
 * @example サーバ側関数マップ(func)の設定例
 * 
 * - サーバ側関数(例)
 *   - commonFunc() : 誰でも実行可能なサーバ側処理(掲示板情報の提供など)。必要な権限は'0'(=0b00)
 *   - staffFunc() : 係員のみ実行可能なサーバ関数(受付処理など)。必要な権限は'2'(=0b10)
 * - 設定
 *   ```js
 *   func = {
 *     "commonFunc": {
 *         "authority": 0,
 *         "do": m => commonFunc(...m) // 引数mにはauthRequest.argを渡す
 *     },
 *     "staffFunc": {
 *         "authority": 2,
 *         "do": m => staffFunc(...m)
 *     },
 *   }
 *   ```
 * - 備考
 *   - 上の例ではauthRequest.funcとサーバ側実関数名は一致させているが、
 *     隠蔽等を目的で異なる形にしても問題ない。<br>
 *     例：`cmFunc:{authority:0,do:m=>commonFunc(...m)}`
 */
/** cryptoClient: クライアント側の暗号化・署名検証
 * @class
 * @classdesc クライアント側の暗号化・署名検証
 * @prop {authIndexedDB} idb - authClient.idb(IndexedDB)のコピー
 * @prop {string} RSAbits - RSA鍵長(=authConfig.RSAbits)
 */
/** cryptoServer: サーバ側の暗号化・署名検証
 * @class
 * @classdesc サーバ側の暗号化・署名検証
 * @prop {authServerConfig} cf - authServer設定情報
 * @prop {ScriptProperties} prop - PropertiesService.getScriptProperties()
 * @prop {authScriptProperties} keys - ScriptPropertiesに保存された鍵ペア情報
 * @prop {string[]} keyList - ScriptPropertiesに保存された項目名の一覧
 */
/** encryptedRequest: 暗号化された処理要求
 * @typedef {Object} encryptedRequest - 暗号化された処理要求
 * @prop {string} cipher - AES-256-GCMで暗号化されたauthRequest
 * @prop {string} signature - authRequestに対するRSA-PSS署名
 * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
 * @prop {string} iv - AES-GCM 初期化ベクトル
 * @prop {string} tag - AES-GCM 認証タグ
 * @prop {Object} meta - メタ情報
 * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
 * @prop {string} meta.sym - 使用した共通鍵方式"AES-256-GCM"
 * @prop {boolean} meta.signOnly - 暗号化せず署名のみで送信する場合true
 */
/** encryptedResponse: 暗号化された処理結果
 * @typedef {Object} encryptedResponse - 暗号化された処理結果
 * @prop {string} cipher - 暗号化した文字列
 * @prop {string} signature - authResponseに対するRSA-PSS署名
 * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
 * @prop {string} iv - AES-GCM 初期化ベクトル
 * @prop {string} tag - AES-GCM 認証タグ
 * @prop {Object} meta - メタ情報
 * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
 */
/** Member: メンバ情報をGoogle Spread上で管理
 * @class
 * @classdesc メンバ情報をGoogle Spread上で管理
 * @prop {string} memberId="dummyMemberID" - メンバの識別子(メールアドレス)
 * @prop {string} name="dummyMemberName" - メンバの氏名
 * @prop {string} status="未加入" - メンバの状態
 *   未加入,未審査,審査済,加入中,加入禁止
 * @prop {MemberLog} log=new MemberLog() - メンバの履歴情報。シート上はJSON
 * @prop {MemberProfile} profile=new MemberProfile() - メンバの属性情報。シート上はJSON
 * @prop {MemberDevice[]} device=[] - デバイス情報
 *   マルチデバイス対応のため配列。シート上はJSON
 * @prop {string} note='' - 当該メンバに対する備考
 */
/** MemberDevice: メンバが使用する通信機器の情報
 * @typedef {Object} MemberDevice - メンバが使用する通信機器の情報
 * @prop {string} deviceId - デバイスの識別子。UUID
 * @prop {string} status=未認証 - デバイスの状態未認証,認証中,試行中,凍結中
 * @prop {string} CPkeySign - デバイスの署名用公開鍵
 * @prop {string} CPkeyEnc - デバイスの暗号化用公開鍵
 * @prop {number} CPkeyUpdated=Date.now() - 最新のCPkeyが登録された日時
 * @prop {MemberTrial[]} trial=[] - ログイン試行関連情報オブジェクトシート上はJSON文字列
 */
/** MemberLog: メンバの各種要求・状態変化の時刻
 * @typedef {Object} MemberLog - メンバの各種要求・状態変化の時刻
 * @prop {number} joiningRequest=Date.now() - 仮登録要求日時仮登録要求をサーバ側で受信した日時
 * @prop {number} approval=0 - 加入承認日時
 *   管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一
 * @prop {number} denial=0 - 加入否認日時
 *   管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一
 * @prop {number} loginRequest=0 - 認証要求日時
 *   未認証メンバからの処理要求をサーバ側で受信した日時
 * @prop {number} loginSuccess=0 - 認証成功日時
 *   未認証メンバの認証要求が成功した最新日時
 * @prop {number} loginExpiration=0 - 認証有効期限
 *   認証成功日時＋認証有効時間
 * @prop {number} loginFailure=0 - 認証失敗日時
 *   未認証メンバの認証要求失敗が確定した最新日時
 * @prop {number} unfreezeLogin=0 - 認証無効期限
 *   認証失敗日時＋認証凍結時間
 * @prop {number} joiningExpiration=0 - 加入有効期限
 *   加入承認日時＋加入有効期間
 * @prop {number} unfreezeDenial=0 - 加入禁止期限
 *   加入否認日時＋加入禁止期間
 */
/** MemberProfile: メンバの属性情報
 * @typedef {Object} MemberProfile - メンバの属性情報
 * @prop {number} authority - メンバの持つ権限
 *   authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す
 */
/** MemberTrial: ログイン試行情報の管理・判定
 * @typedef {Object} MemberTrial - ログイン試行情報の管理・判定
 * @prop {string} passcode - 設定されているパスコード最初の認証試行で作成
 * @prop {number} created=Date.now() - パスコード生成日時≒パスコード通知メール発信日時
 * @prop {MemberTrialLog[]} log=[] - 試行履歴常に最新が先頭(unshift()使用)
 *   保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。
 */
/** MemberTrialLog: パスコード入力単位の試行記録
 * @typedef {Object} MemberTrialLog - パスコード入力単位の試行記録
 * @prop {string} entered - 入力されたパスコード
 * @prop {boolean} result - 試行結果正答：true、誤答：false
 * @prop {number} timestamp=Date.now() - 判定処理日時
 */