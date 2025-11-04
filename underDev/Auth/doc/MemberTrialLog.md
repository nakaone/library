<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="membertriallog">MemberTrialLog クラス仕様書</span>

## <span id="membertriallog_summary">🧭 概要</span>

パスコード入力単位の試行記録

### <span id="membertriallog_policy">設計方針</span>

- [状態遷移図](Member.md#member_policy_statediagram)
- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="membertriallog_internal">内部構成</span>

🔢 MemberTrialLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| entered | ❌ | string | — | 入力されたパスコード |  | 
| result | ❌ | boolean | — | 試行結果 | 正答：true、誤答：false | 
| timestamp | ⭕ | number | Date.now() | 判定処理日時 |  | 


🧱 <span id="membertriallog_method">MemberTrialLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#membertriallog_constructor) | private | コンストラクタ |

## <span id="membertriallog_constructor">🧱 <a href="#membertriallog_method">MemberTrialLog.constructor()</a></span>

コンストラクタ

### <span id="membertriallog_constructor_caller">📞 呼出元</span>

- [MemberTrial.loginAttempt()](MemberTrial.md#membertriallog_constructor)

### <span id="membertriallog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| entered | ❌ | string | — | 入力されたパスコード | 
| result | ❌ | boolean | — | 試行結果 | 

### <span id="membertriallog_constructor_process">🧾 処理手順</span>

- this.entered = entered
- this.result = result
- this.timestamp = Date.now()

### <span id="membertriallog_constructor_returns">📤 戻り値</span>

  - [MemberTrialLog](MemberTrialLog.md#membertriallog_internal): パスコード入力単位の試行記録
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | entered | string | 【必須】 | — |
    | result | boolean | 【必須】 | — |
    | timestamp | number | Date.now() | — |