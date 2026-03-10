<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [authServer](authServer.md) | authServer: サーバ側中核クラス |
| [cryptoServer](cryptoServer.md) | cryptoServer: サーバ側の暗号化・署名検証 |
| [Member](Member.md) |  |

# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [authAuditLog](#authAuditLog) | authAuditLog: authServerの監査ログをシートに出力 |
| 2 | [authErrorLog](#authErrorLog) | authErrorLog: authServerのエラーログをシートに出力 |
| 3 | [authRequestLog](#authRequestLog) | authRequestLog: 重複チェック用のリクエスト履歴 |
| 4 | [authScriptProperties](#authScriptProperties) | authScriptProperties: サーバ側ScriptPropertiesに保存する情報 |
| 5 | [authServerConfig](#authServerConfig) | this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加 |
| 6 | [authServerFuncDef](#authServerFuncDef) | authServerFuncDef: サーバ側関数設定オブジェクト |
| 7 | [MemberDevice](#MemberDevice) | MemberDevice: メンバが使用する通信機器の情報 |
| 8 | [MemberLog](#MemberLog) | MemberLog: メンバの各種要求・状態変化の時刻 |
| 9 | [MemberProfile](#MemberProfile) | MemberProfile: メンバの属性情報 |
| 10 | [MemberTrial](#MemberTrial) | MemberTrial: ログイン試行情報の管理・判定 |
| 11 | [MemberTrialLog](#MemberTrialLog) | MemberTrialLog: パスコード入力単位の試行記録 |

# 個別データ型定義


## <a href="#typedefList"><span id="authAuditLog">"authAuditLog" データ型定義</span></a>

authAuditLog: authServerの監査ログをシートに出力

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時(ISO8601拡張形式) |  |
| duration | number | 必須 | 処理時間(ms) |  |
| memberId | string | 必須 | メンバの識別子(メールアドレス) |  |
| deviceId | string | 任意 | デバイスの識別子(UUIDv4) |  |
| func | string | 必須 | サーバ側関数名 |  |
| result | string | 'success' | サーバ側処理結果 |  |
| note | string | 任意 | 備考 |  |


## <a href="#typedefList"><span id="authErrorLog">"authErrorLog" データ型定義</span></a>

authErrorLog: authServerのエラーログをシートに出力

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時ISO8601拡張形式の文字列 |  |
| memberId | string | 必須 | メンバの識別子 |  |
| deviceId | string | 必須 | デバイスの識別子 |  |
| result | string | fatal | サーバ側処理結果fatal/warning/normal |  |
| message | string | 任意 | サーバ側からのエラーメッセージnormal時はundefined |  |
| stack | string | 任意 | エラー発生時のスタックトレース本項目は管理者への通知メール等、シート以外には出力不可 |  |


## <a href="#typedefList"><span id="authRequestLog">"authRequestLog" データ型定義</span></a>

authRequestLog: 重複チェック用のリクエスト履歴

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | number | Date.now() | リクエストを受けたサーバ側日時 |  |
| nonce | string | 必須 | クライアント側で採番されたリクエスト識別子UUIDv4 |  |


## <a href="#typedefList"><span id="authScriptProperties">"authScriptProperties" データ型定義</span></a>

authScriptProperties: サーバ側ScriptPropertiesに保存する情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| keyGeneratedDateTime | number | 必須 | 鍵ペア生成日時。UNIX時刻 |  |
| SSkeySign | string | 必須 | 署名用秘密鍵(PEM形式) |  |
| SPkeySign | string | 必須 | 署名用公開鍵(PEM形式) |  |
| SSkeyEnc | string | 必須 | 暗号化用秘密鍵(PEM形式) |  |
| SPkeyEnc | string | 必須 | 暗号化用公開鍵(PEM形式) |  |
| oldSSkeySign | string | 必須 | バックアップ用署名用秘密鍵(PEM形式) |  |
| oldSPkeySign | string | 必須 | バックアップ用署名用公開鍵(PEM形式) |  |
| oldSSkeyEnc | string | 必須 | バックアップ用暗号化用秘密鍵(PEM形式) |  |
| oldSPkeyEnc | string | 必須 | バックアップ用暗号化用公開鍵(PEM形式) |  |
| requestLog | string | 必須 | 重複チェック用のリクエスト履歴。{authRequestLog[]}のJSON |  |


## <a href="#typedefList"><span id="authServerConfig">"authServerConfig" データ型定義</span></a>

this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberList | string | "memberList" | memberListシート名 |  |
| defaultAuthority | number | 1 | 新規加入メンバの権限の既定値 |  |
| memberLifeTime | number | 31536000000 | 加入有効期間 | メンバ加入承認後の有効期間。既定値は1年 |
| prohibitedToJoin | number | 259200000 | 加入禁止期間 | 管理者による加入否認後、再加入申請���自動的に却下される期間。既定値は3日 |
| loginLifeTime | number | 86400000 | 認証有効時間 | ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日 |
| loginFreeze | number | 600000 | 認証凍結時間 | 認証失敗後、再認証要求が禁止される期間。既定値は10分 |
| requestIdRetention | number | 300000 | 重複リクエスト拒否となる時間。既定値は5分 |  |
| errorLog | string | "errorLog" | エラーログのシート名 |  |
| storageDaysOfErrorLog | number | 604800000 | エラーログの保存日数 | 単位はミリ秒。既定値は7日分 |
| auditLog | string | "auditLog" | 監査ログのシート名 |  |
| storageDaysOfAuditLog | number | 604800000 | 監査ログの保存日数 | 単位はミリ秒。既定値は7日分 |
| func | authServerFuncDef | {} | サーバ側関数設定 | ログイン試行関係の設定値 |
| passcodeLength | number | 6 | パスコードの桁数 |  |
| maxTrial | number | 3 | パスコード入力の最大試行回数 |  |
| passcodeLifeTime | number | 600000 | パスコードの有効期間。既定値は10分 |  |
| maxTrialLog | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代 | 開発関係の設定値 |
| udSendPasscode | boolean | false | 開発中識別フラグパスコード通知メール送信を抑止するならtrue |  |
| udSendInvitation | boolean | false | 開発中の加入承認通知メール送信 | 開発中に加入承認通知メール送信を抑止するならtrue |
| typeDef | schemaDef | 必須 | データ型定義 |  |


## <a href="#typedefList"><span id="authServerFuncDef">"authServerFuncDef" データ型定義</span></a>

authServerFuncDef: サーバ側関数設定オブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func.authority | number | 0 | サーバ側関数の所要権限 | サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限
  ex. authServerConfig.func.authority === 0 |
| func.do | function | 必須 | 実行するサーバ側関数 |  |


## <a href="#typedefList"><span id="MemberDevice">"MemberDevice" データ型定義</span></a>

MemberDevice: メンバが使用する通信機器の情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| deviceId | string | UUIDv4 | デバイスの識別子 |  |
| status | string | "UC" | デバイスの状態 | 未認証 : UC(uncertified)
  認証中 : LI(log in)
  試行中 : TR(tring)
  凍結中 : FR(freezed) |
| CPkeySign | string | 必須 | デバイスの署名用公開鍵 |  |
| CPkeyEnc | string | 必須 | デバイスの暗号化用公開鍵 |  |
| CPkeyUpdated | number | Date.now() | 最新のCPkeyが登録された日時 |  |
| trial | MemberTrial[] | [ | ログイン試行関連情報。オブジェクトシート上はJSON文字列 |  |


## <a href="#typedefList"><span id="MemberLog">"MemberLog" データ型定義</span></a>

MemberLog: メンバの各種要求・状態変化の時刻

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| joiningRequest | number | Date.now() | 仮登録要求日時仮登録要求をサーバ側で受信した日時 |  |
| approval | number | 0 | 加入承認日時 | 管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一 |
| denial | number | 0 | 加入否認日時 | 管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一 |
| loginRequest | number | 0 | 認証要求日時 | 未認証メンバからの処理要求をサーバ側で受信した日時 |
| loginSuccess | number | 0 | 認証成功日時 | 未認証メンバの認証要求が成功した最新日時 |
| loginExpiration | number | 0 | 認証有効期限 | 認証成功日時＋認証有効時間 |
| loginFailure | number | 0 | 認証失敗日時 | 未認証メンバの認証要求失敗が確定した最新日時 |
| unfreezeLogin | number | 0 | 認証無効期限 | 認証失敗日時＋認証凍結時間 |
| joiningExpiration | number | 0 | 加入有効期限 | 加入承認日時＋加入有効期間 |
| unfreezeDenial | number | 0 | 加入禁止期限 | 加入否認日時＋加入禁止期間 |


## <a href="#typedefList"><span id="MemberProfile">"MemberProfile" データ型定義</span></a>

MemberProfile: メンバの属性情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| authority | number | 必須 | メンバの持つ権限 | authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す |


## <a href="#typedefList"><span id="MemberTrial">"MemberTrial" データ型定義</span></a>

MemberTrial: ログイン試行情報の管理・判定

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| passcode | string | 必須 | 設定されているパスコード最初の認証試行で作成 | 初期値はauthServerConfig.passcodeLengthで指定された桁数の数値 |
| created | number | Date.now() | パスコード生成日時≒パスコード通知メール発信日時 |  |
| log | MemberTrialLog[] | [ | 試行履歴常に最新が先頭(unshift()使用) | 保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。 |


## <a href="#typedefList"><span id="MemberTrialLog">"MemberTrialLog" データ型定義</span></a>

MemberTrialLog: パスコード入力単位の試行記録

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| entered | number | 必須 | 入力されたパスコード |  |
| result | boolean | 必須 | 試行結果正答：true、誤答：false |  |
| timestamp | number | Date.now() | 判定処理日時 |  |