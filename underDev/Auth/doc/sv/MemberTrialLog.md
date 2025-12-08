<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="membertriallog">MemberTrialLog クラス仕様書</span>

パスコード入力単位の試行記録

## <span id="membertriallog_summary">🧭 MemberTrialLog クラス 概要</span>

- [メンバ関係状態遷移図](../specification.md#member)
- [デバイス関係状態遷移図](../specification.md#device)
- [Member関係クラス図](Member.md#member_classdiagram)

## <span id="membertriallog_members">🔢 MemberTrialLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| entered | string | <span style="color:red">必須</span> | 入力されたパスコード |  |
| result | boolean | <span style="color:red">必須</span> | 試行結果 | 正答：true、誤答：false |
| timestamp | number | Date.now() | 判定処理日時 |  |

## <span id="membertriallog_methods">🧱 MemberTrialLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#membertriallog_constructor) | private | コンストラクタ |  |

### <span id="membertriallog_constructor"><a href="#membertriallog_methods">🧱 MemberTrialLog.constructor()</a></span>

#### <span id="membertriallog_constructor_referrer">📞 呼出元</span>

- [Member.checkPasscode](Member.md#Member_members)
- [MemberTrial.loginAttempt](MemberTrial.md#MemberTrial_members)

#### <span id="membertriallog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| entered | string | <span style="color:red">必須</span> | 入力されたパスコード |  |
| result | boolean | <span style="color:red">必須</span> | 試行結果 |  |

#### <span id="membertriallog_constructor_process">🧾 処理手順</span>

- this.entered = entered
- this.result = result
- this.timestamp = Date.now()

#### <span id="membertriallog_constructor_returns">📤 戻り値</span>

- [MemberTrialLog](#membertriallog_members)インスタンス