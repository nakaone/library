<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="memberlog">MemberLog クラス仕様書</span>

## <span id="memberlog_summary">🧭 概要</span>

メンバの各種要求・状態変化の時刻
### <span id="memberlog_policy">設計方針</span>

- [状態遷移図](Member.md#member_policy_statediagram)
- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="memberlog_internal">内部構成</span>

🔢 MemberLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| joiningRequest | ❌ | number | — | 加入要求日時 | 加入要求をサーバ側で受信した日時 | 
| approval | ❌ | number | — | 加入承認日時 | 管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一 | 
| denial | ❌ | number | — | 加入否認日時 | 管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一 | 
| loginRequest | ❌ | number | — | 認証要求日時 | 未認証メンバからの処理要求をサーバ側で受信した日時 | 
| loginSuccess | ❌ | number | — | 認証成功日時 | 未認証メンバの認証要求が成功した最新日時 | 
| loginExpiration | ❌ | number | — | 認証有効期限 | 認証成功日時＋認証有効時間 | 
| loginFailure | ❌ | number | — | 認証失敗日時 | 未認証メンバの認証要求失敗が確定した最新日時 | 
| unfreezeLogin | ❌ | number | — | 認証無効期限 | 認証失敗日時＋認証凍結時間 | 
| joiningExpiration | ❌ | number | — | 加入有効期限 | 加入承認日時＋加入有効期間 | 
| unfreezeDenial | ❌ | number | — | 加入禁止期限 | 加入否認日時＋加入禁止期間 | 


🧱 <span id="memberlog_method">MemberLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#memberlog_constructor) | private | コンストラクタ |

## <span id="memberlog_constructor">🧱 <a href="#memberlog_method">MemberLog.constructor()</a></span>

コンストラクタ

### <span id="memberlog_constructor_caller">📞 呼出元</span>

- [Member.constructor()](Member.md#memberlog_constructor)

### <span id="memberlog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="memberlog_constructor_returns">📤 戻り値</span>

- [MemberLog](MemberLog.md#internal): メンバの各種要求・状態変化の時刻
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | joiningRequest | number | [必須] | — |
  | approval | number | [必須] | — |
  | denial | number | [必須] | — |
  | loginRequest | number | [必須] | — |
  | loginSuccess | number | [必須] | — |
  | loginExpiration | number | [必須] | — |
  | loginFailure | number | [必須] | — |
  | unfreezeLogin | number | [必須] | — |
  | joiningExpiration | number | [必須] | — |
  | unfreezeDenial | number | [必須] | — |

### <span id="memberlog_constructor_process">🧾 処理手順</span>

