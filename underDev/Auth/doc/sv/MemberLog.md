<style>
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

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="memberlog">MemberLog クラス仕様書</span>

メンバの各種要求・状態変化の時刻

## <span id="memberlog_summary">🧭 MemberLog クラス 概要</span>

- [メンバ関係状態遷移図](../specification.md#member)
- [デバイス関係状態遷移図](../specification.md#device)
- [Member関係クラス図](Member.md#member_classdiagram)

## <span id="memberlog_members">🔢 MemberLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| joiningRequest | number | Date.now() | 仮登録要求日時 | 仮登録要求をサーバ側で受信した日時 |
| approval | number | 0 | 加入承認日時 | 管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一 |
| denial | number | 0 | 加入否認日時 | 管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一 |
| loginRequest | number | 0 | 認証要求日時 | 未認証メンバからの処理要求をサーバ側で受信した日時 |
| loginSuccess | number | 0 | 認証成功日時 | 未認証メンバの認証要求が成功した最新日時 |
| loginExpiration | number | 0 | 認証有効期限 | 認証成功日時＋認証有効時間 |
| loginFailure | number | 0 | 認証失敗日時 | 未認証メンバの認証要求失敗が確定した最新日時 |
| unfreezeLogin | number | 0 | 認証無効期限 | 認証失敗日時＋認証凍結時間 |
| joiningExpiration | number | 0 | 加入有効期限 | 加入承認日時＋加入有効期間 |
| unfreezeDenial | number | 0 | 加入禁止期限 | 加入否認日時＋加入禁止期間 |

## <span id="memberlog_methods">🧱 MemberLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#memberlog_constructor) | private | コンストラクタ |  |
| [prohibitJoining()](#memberlog_prohibitjoining) | public | 「加入禁止」状態に変更する |  |

### <span id="memberlog_constructor"><a href="#memberlog_methods">🧱 MemberLog.constructor()</a></span>

#### <span id="memberlog_constructor_referrer">📞 呼出元</span>

- [Member.constructor](Member.md#Member_members)
- [Member.setMember](Member.md#Member_members)

#### <span id="memberlog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="memberlog_constructor_process">🧾 処理手順</span>

#### <span id="memberlog_constructor_returns">📤 戻り値</span>

- [MemberLog](#memberlog_members)インスタンス
### <span id="memberlog_prohibitjoining"><a href="#memberlog_methods">🧱 MemberLog.prohibitJoining()</a></span>

#### <span id="memberlog_prohibitjoining_referrer">📞 呼出元</span>

- [Member.removeMember](Member.md#Member_members)

#### <span id="memberlog_prohibitjoining_params">📥 引数</span>

- 引数無し(void)

#### <span id="memberlog_prohibitjoining_process">🧾 処理手順</span>

- joiningExpiration = 現在日時(UNIX時刻)
- unfreezeDenial = 現在日時(UNIX時刻)＋[authServerConfig](authServerConfig.md#authserverconfig_internal).prohibitedToJoin

#### <span id="memberlog_prohibitjoining_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)