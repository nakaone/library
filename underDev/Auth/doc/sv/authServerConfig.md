<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="authserverconfig">authServerConfig クラス仕様書</span>

authServer専用の設定値

[authConfig](authConfig.md)を継承した、authServerでのみ使用する設定値

## <span id="authserverconfig_members">🔢 authServerConfig メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberList | string | memberList | memberListシート名 |  |
| defaultAuthority | number | 1 | 新規加入メンバの権限の既定値 |  |
| memberLifeTime | number | 31,536,000,000 | 加入有効期間 | メンバ加入承認後の有効期間。既定値は1年 |
| prohibitedToJoin | number | 259,200,000 | 加入禁止期間 | 管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日 |
| loginLifeTime | number | 86,400,000 | 認証有効時間 | ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日 |
| loginFreeze | number | 600,000 | 認証凍結時間 | 認証失敗後、再認証要求が禁止される期間。既定値は10分 |
| requestIdRetention | number | 300,000 | 重複リクエスト拒否となる時間 | 既定値は5分 |
| errorLog | string | errorLog | エラーログのシート名 |  |
| storageDaysOfErrorLog | number | 604,800,000 | 監査ログの保存日数 | 単位はミリ秒。既定値は7日分 |
| auditLog | string | auditLog | 監査ログのシート名 |  |
| storageDaysOfAuditLog | number | 604,800,000 | 監査ログの保存日数 | 単位はミリ秒。既定値は7日分 |
| func | Object.<string,Object> | <span style="color:red">必須</span> | サーバ側の関数マップ | 例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}} |
| func.authority | number | <span style="color:red">必須</span> | サーバ側関数の所要権限 | サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限。<br>`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。 |
| func.do | Function | <span style="color:red">必須</span> | 実行するサーバ側関数 |  |
| trial | Object | <span style="color:red">必須</span> | ログイン試行関係の設定値 |  |
| trial.passcodeLength | number | 6 | パスコードの桁数 |  |
| trial.maxTrial | number | 3 | パスコード入力の最大試行回数 |  |
| trial.passcodeLifeTime | number | 600,000 | パスコードの有効期間 | 既定値は10分 |
| trial.generationMax | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数 | 既定値は5世代 |
| underDev.sendPasscode | boolean | false | 開発中識別フラグ | パスコード通知メール送信を抑止するならtrue |
| underDev.sendInvitation | boolean | false | 開発中の加入承認通知メール送信 | 開発中に加入承認通知メール送信を抑止するならtrue |

## <span id="authserverconfig_methods">🧱 authServerConfig メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authserverconfig_constructor) | private | コンストラクタ |  |

### <span id="authserverconfig_constructor">🧱 authServerConfig.constructor()</span>

#### <span id="authserverconfig_constructor_referrer">📞 呼出元</span>

#### <span id="authserverconfig_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authserverconfig_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authserverconfig_constructor_returns">📤 戻り値</span>

- [authServerConfig](#authserverconfig_members)インスタンス