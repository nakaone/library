<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="membertrial">MemberTrial クラス仕様書</span>

## <span id="membertrial_summary">🧭 概要</span>

ログイン試行情報の管理・判定

### <span id="membertrial_policy">設計方針</span>

- [状態遷移図](Member.md#member_policy_statediagram)
- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="membertrial_internal">内部構成</span>

🔢 MemberTrial メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| passcode | ❌ | string | — | 設定されているパスコード | 最初の認証試行で作成 | 
| created | ⭕ | number | Date.now() | パスコード生成日時 | ≒パスコード通知メール発信日時 | 
| log | ⭕ | MemberTrialLog[] | [] | 試行履歴 | 常に最新が先頭(unshift()使用)。保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。 | 


🧱 <span id="membertrial_method">MemberTrial メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#membertrial_constructor) | private | コンストラクタ |
| [loginAttempt](#membertrial_loginattempt) | public | 入力されたパスコードの判定 |

## <span id="membertrial_constructor">🧱 <a href="#membertrial_method">MemberTrial.constructor()</a></span>

コンストラクタ

### <span id="membertrial_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | 必須項目および変更する設定値 | 

### <span id="membertrial_constructor_process">🧾 処理手順</span>

- this.passcode = [authServerConfig.trial.passcodeLength](authServerConfig.md#authserverconfig_internal)で設定された桁数の乱数
- this.created = Date.now()
- this.log = []

### <span id="membertrial_constructor_returns">📤 戻り値</span>

  - [MemberTrial](MemberTrial.md#membertrial_internal): ログイン試行情報の管理・判定
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | passcode | string | 【必須】 | — |
    | created | number | Date.now() | — |
    | log | MemberTrialLog[] |  | — |

## <span id="membertrial_loginattempt">🧱 <a href="#membertrial_method">MemberTrial.loginAttempt()</a></span>

入力されたパスコードの判定

### <span id="membertrial_loginattempt_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | ユーザが入力したパスコードを含む処理要求 | 

### <span id="membertrial_loginattempt_process">🧾 処理手順</span>

- [MemberTrialLog](MemberTrialLog.md#membertriallog_constructor)を生成、this.logの先頭に保存(unshift())
- `this.log[0].result === true`なら「正答時」を返す
- `this.log[0].result === false`で最大試行回数([maxTrial](authServerConfig.md#authserverconfig_internal))未満なら「誤答・再挑戦可」を返す
- `this.log[0].result === false`で最大試行回数以上なら「誤答・再挑戦不可」を返す
- なお、シートへの保存は呼出元で行う

### <span id="membertrial_loginattempt_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正答時 | 誤答・再挑戦可 | 誤答・再挑戦不可 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | normal | warning | fatal |
    | message | string | 【任意】 | — | — | — |
    | request | authRequest | 【任意】 | 引数"request" | 引数"request" | 引数"request" |
    | response | any | 【任意】 | — | — | — |