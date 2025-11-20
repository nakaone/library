<div style="text-align: right;">

[総説](../spec.md) | [クライアント側クラス一覧](../cl/list.md) | [サーバ側クラス一覧](../sv/list.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="authconfig">authConfig クラス仕様書</span>

authClient/authServer共通設定値

[authClientConfig](authClientConfig.md), [authServerConfig](authServerConfig.md)の親クラス

## <span id="authconfig_members">🔢 authConfig メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | auth | システム名 |  |
| adminMail | string | 任意 | 管理者のメールアドレス |  |
| adminName | string | 任意 | 管理者氏名 |  |
| allowableTimeDifference | number | 120,000 | クライアント・サーバ間通信時の許容時差 | 既定値は2分 |
| RSAbits | string | 2,048 | 鍵ペアの鍵長 |  |
| underDev | Object | 任意 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

## <span id="authconfig_methods">🧱 authConfig メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authconfig_constructor) | private | コンストラクタ |  |

### <span id="authconfig_constructor">🧱 authConfig.constructor()</span>

#### <span id="authconfig_constructor_caller">📞 呼出元</span>

- [authAuditLog.constructor](authAuditLog.md#authAuditLog_members)

#### <span id="authconfig_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authconfig_constructor_returns">📤 戻り値</span>

- [authConfig](#authconfig_members)インスタンス