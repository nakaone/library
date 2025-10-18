/**
 * @typedef {Object} authClientConfig - authConfigを継承した、authClientでのみ使用する設定値
 * @prop {string} api - サーバ側WebアプリURLのID(`https://script.google.com/macros/s/(この部分)/exec`)
 * @prop {number} [timeout=300000] - サーバからの応答待機時間。これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分
 * @prop {number} [CPkeyGraceTime=600000] - CPkey期限切れまでの猶予時間。CPkey有効期間がこれを切ったら更新処理実行。既定値は10分
 *//**
 * @typedef {Object} authClientKeys - クライアント側鍵ペア
 * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
 * @prop {CryptoKey} CPkeySign - 署名用公開鍵
 * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
 * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
 *//**
 * @typedef {Object} authConfig - authClient/authServer共通で使用される設定値。,authClientConfig, authServerConfigの親クラス
 * @prop {string} [systemName="auth"] - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者名
 * @prop {string} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差。既定値は2分
 * @prop {string} [RSAbits=2048] - 鍵ペアの鍵長
 *//**
 * @typedef {Object} authIndexedDB - クライアントのIndexedDBに保存するオブジェクト,IndexedDB保存時のキー名は`authConfig.system.name`から取得
 * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時。UNIX時刻(new Date().getTime()),なおサーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く。
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} memberName - メンバ(ユーザ)の氏名(ex."田中　太郎")。加入要求確認時に管理者が申請者を識別する他で使用。
 * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
 * @prop {CryptoKey} CPkeySign - 署名用公開鍵
 * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
 * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
 * @prop {string} SPkey - サーバ公開鍵(Base64)
 * @prop {number} expireCPkey=0 - CPkeyの有効期限(無効になる日時)。未ログイン時は0
 *//**
 * @typedef {Object} authRequest - authClientからauthServerに送られる処理要求オブジェクト
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} deviceId - デバイスの識別子
 * @prop {string} requestId - 要求の識別子。UUID
 * @prop {number} timestamp - 要求日時。UNIX時刻
 * @prop {string} func - サーバ側関数名
 * @prop {any[]} arguments - サーバ側関数に渡す引数の配列
 * @prop {string} signature - クライアント側署名
 *//**
 * @typedef {Object} authRequestLog - 重複チェック用のリクエスト履歴。ScriptPropertiesに保存
 * @prop {number} [timestamp=1760757925412] - リクエストを受けたサーバ側日時
 * @prop {string} requestId - クライアント側で採番されたリクエスト識別子。UUID
 *//**
 * @typedef {Object} authResponse - authServerからauthClientに返される処理結果オブジェクト
 * @prop {number} timestamp - サーバ側処理日時。UNIX時刻
 * @prop {string} result - サーバ側処理結果。fatal/warning/normal
 * @prop {string} [message] - サーバ側からのエラーメッセージ。normal時は`undefined`
 * @prop {authRequest} request - 処理要求オブジェクト
 * @prop {any} [response] - 要求されたサーバ側関数の戻り値。fatal/warning時は`undefined`
 *//**
 * @typedef {Object} authScriptProperties - キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。
 * @prop {number} keyGeneratedDateTime - UNIX時刻
 * @prop {string} SPkey - PEM形式の公開鍵文字列
 * @prop {string} SSkey - PEM形式の秘密鍵文字列（暗号化済み）
 * @prop {authRequestLog[]} requestLog - 重複チェック用のリクエスト履歴
 * @prop {undefined} requ
 *//**
 * @typedef {Object} authServerConfig - authConfigを継承した、authServerでのみ使用する設定値
 * @prop {string} [memberList="memberList"] - memberListシート名
 * @prop {number} defaultAuthority=0 - 新規加入メンバの権限の既定値
 * @prop {number} [memberLifeTime=31536000000] - 加入有効期間(=メンバ加入承認後の有効期間)。既定値は1年
 * @prop {number} [prohibitedToJoin=259200000] - 加入禁止期間(=管理者による加入否認後、再加入申請が自動的に却下される期間)。既定値は3日
 * @prop {number} [loginLifeTime=86400000] - 認証有効時間(=ログイン成功後の有効期間、CPkeyの有効期間)。既定値は1日
 * @prop {number} [loginFreeze=600000] - 認証凍結時間(=認証失敗後、再認証要求が禁止される期間)。既定値は10分
 * @prop {number} [requestIdRetention=300000] - 重複リクエスト拒否となる時間。既定値は5分
 * @prop {Object.<string,Object>} func - サーバ側の関数マップ
 * @prop {number} func.authority - 当該関数実行のために必要となるユーザ権限,`Member.profile.authority & authServerConfig.func.authrity > 0`なら実行可とする。
 * @prop {Function} func.do - 実行するサーバ側関数
 * @prop {Object} trial - ログイン試行関係の設定値
 * @prop {number} [trial.passcodeLength=6] - パスコードの桁数
 * @prop {number} [trial.maxTrial=3] - パスコード入力の最大試行回数
 * @prop {number} [trial.passcodeLifeTime=600000] - パスコードの有効期間。既定値は10分
 * @prop {number} [trial.generationMax=5] - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
 *//**
 * @typedef {Object} decryptedRequest - cryptoServerで復号された処理要求オブジェクト
 * @prop {string} result - 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success"
 * @prop {string} [message] - エラーメッセージ。result="normal"の場合`undefined`
 * @prop {authRequest} request - ユーザから渡された処理要求
 * @prop {string} timestamp - 復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存
 *//**
 * @typedef {Object} decryptedResponse - cryptoClientで復号された処理結果オブジェクト
 * @prop {number} timestamp - cryptoClient処理日時。UNIX時刻
 * @prop {string} result - cryptoClient処理結果。fatal/warning/normal
 * @prop {string} [message] - cryptoClientからのエラーメッセージ。normal時は`undefined`
 * @prop {authRequest} request - 処理要求オブジェクト(authResponse.request)
 * @prop {any} [response] - 要求されたサーバ側関数の戻り値(authResponse.response)。fatal/warning時は`undefined`
 * @prop {Object} sv
 * @prop {number} sv.timestamp - サーバ側処理日時。UNIX時刻
 * @prop {string} sv.result - サーバ側処理結果。fatal/warning/normal
 * @prop {string} [sv.message] - サーバ側からのエラーメッセージ。normal時は`undefined`
 *//**
 * @typedef {Object} Device - メンバが使用する通信機器の情報(マルチデバイス対応)
 * @prop {string} deviceId - デバイスの識別子。UUID
 * @prop {string} CPkey - メンバの公開鍵
 * @prop {string} CPkeyUpdated - 最新のCPkeyが登録された日時
 * @prop {string} trial - ログイン試行関連情報オブジェクト(MemberTrial[])のJSON文字列
 *//**
 * @typedef {Object} encryptedRequest - authClientからauthServerに渡す暗号化された処理要求オブジェクト,ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列,memberId,deviceIdは平文
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} deviceId - デバイスの識別子
 * @prop {string} ciphertext - 暗号化した文字列
 *//**
 * @typedef {Object} encryptedResponse - authServerからauthClientに返す暗号化された処理結果オブジェクト,ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列
 * @prop {string} ciphertext - 暗号化した文字列
 *//**
 * @typedef {Object} LocalRequest - クライアント側関数からauthClientに渡すオブジェクト,func,arg共、平文
 * @prop {string} func - サーバ側関数名
 * @prop {any[]} arguments - サーバ側関数に渡す引数の配列
 *//**
 * @typedef {Object} LocalResponse - authClientからクライアント側関数に返される処理結果オブジェクト
 * @prop {string} result - 処理結果。fatal/warning/normal
 * @prop {string} [message] - エラーメッセージ。normal時は`undefined`。
 * @prop {any} [response] - 要求された関数の戻り値。fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`
 *//**
 * @typedef {Object} Member - メンバ一覧(アカウント管理表)上のメンバ単位の管理情報
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} name - メンバの氏名
 * @prop {string} log - メンバの履歴情報(MemberLog)を保持するJSON文字列
 * @prop {string} profile - メンバの属性情報(MemberProfile)を保持するJSON文字列
 * @prop {string} device - マルチデバイス対応のためのデバイス情報(MemberDevice[])を保持するJSON文字列
 * @prop {string} [note] - 当該メンバに対する備考
 *//**
 * @typedef {Object} MemberDevice - メンバが使用する通信機器の情報(マルチデバイス対応)
 * @prop {string} deviceId - デバイスの識別子。UUID
 * @prop {string} CPkey - メンバの公開鍵
 * @prop {string} CPkeyUpdated - 最新のCPkeyが登録された日時
 * @prop {string} trial - ログイン試行関連情報オブジェクト(MemberTrial[])のJSON文字列
 *//**
 * @typedef {Object} MemberLog - メンバの各種要求・状態変化の時刻
 * @prop {number} joiningRequest=0 - 加入要求日時。加入要求をサーバ側で受信した日時
 * @prop {number} approval=0 - 加入承認日時。管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一
 * @prop {number} denial=0 - 加入否認日時。管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一
 * @prop {number} loginRequest=0 - 認証要求日時。未認証メンバからの処理要求をサーバ側で受信した日時
 * @prop {number} loginSuccess=0 - 認証成功日時。未認証メンバの認証要求が成功した最新日時
 * @prop {number} loginExpiration=0 - 認証有効期限。認証成功日時＋認証有効時間
 * @prop {number} loginFailure=0 - 認証失敗日時。未認証メンバの認証要求失敗が確定した最新日時
 * @prop {number} unfreezeLogin=0 - 認証無効期限。認証失敗日時＋認証凍結時間
 * @prop {number} joiningExpiration=0 - 加入有効期限。加入承認日時＋加入有効期間
 * @prop {number} unfreezeDenial=0 - 加入禁止期限。加入否認日時＋加入禁止期間
 *//**
 * @typedef {Object} MemberProfile - メンバの属性情報(Member.profile)
 * @prop {string} 
 *//**
 * @typedef {Object} MemberTrial - ログイン試行単位の試行情報(Member.trial)
 * @prop {string} passcode - 設定されているパスコード
 * @prop {number} created - パスコード生成日時(≒パスコード通知メール発信日時)
 * @prop {MemberTrialLog[]} [log] - 試行履歴。常に最新が先頭(unshift()使用)
 *//**
 * @typedef {Object} MemberTrialLog - MemberTrial.logに記載される、パスコード入力単位の試行記録
 * @prop {string} entered - 入力されたパスコード
 * @prop {number} result - -1:恒久的エラー, 0:要リトライ, 1:パスコード一致
 * @prop {string} message - エラーメッセージ
 * @prop {number} timestamp - 判定処理日時
 */