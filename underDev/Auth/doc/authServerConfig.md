<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authserverconfig">authServerConfig クラス仕様書</span>

## <span id="authserverconfig_summary">🧭 概要</span>

authServer専用の設定値

authConfigを継承した、authServerでのみ使用する設定値

### 🧩 <span id="authserverconfig_internal">内部構成</span>

🔢 authServerConfig メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberList | ⭕ | string | memberList | memberListシート名 |  | 
| defaultAuthority | ⭕ | number | 1 | 新規加入メンバの権限の既定値 |  | 
| memberLifeTime | ⭕ | number | 31536000000 | 加入有効期間 | メンバ加入承認後の有効期間。既定値は1年 | 
| prohibitedToJoin | ⭕ | number | 259200000 | 加入禁止期間 | 管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日 | 
| loginLifeTime | ⭕ | number | 86400000 | 認証有効時間 | ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日 | 
| loginFreeze | ⭕ | number | 600000 | 認証凍結時間 | 認証失敗後、再認証要求が禁止される期間。既定値は10分 | 
| requestIdRetention | ⭕ | number | 300000 | 重複リクエスト拒否となる時間 | 既定値は5分 | 
| errorLog | ⭕ | string | errorLog | エラーログのシート名 |  | 
| storageDaysOfErrorLog | ⭕ | number | 604800000 | 監査ログの保存日数 | 単位はミリ秒。既定値は7日分 | 
| auditLog | ⭕ | string | auditLog | 監査ログのシート名 |  | 
| storageDaysOfAuditLog | ⭕ | number | 604800000 | 監査ログの保存日数 | 単位はミリ秒。既定値は7日分 | 
| func | ❌ | Object.<string,Object> | — | サーバ側の関数マップ | 例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}} | 
| func.authority | ❌ | number | — | サーバ側関数の所要権限 | サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限。<br>`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。 | 
| func.do | ❌ | Function | — | 実行するサーバ側関数 |  | 
| trial | ❌ | Object | — | ログイン試行関係の設定値 |  | 
| trial.passcodeLength | ⭕ | number | 6 | パスコードの桁数 |  | 
| trial.maxTrial | ⭕ | number | 3 | パスコード入力の最大試行回数 |  | 
| trial.passcodeLifeTime | ⭕ | number | 600000 | パスコードの有効期間 | 既定値は10分 | 
| trial.generationMax | ⭕ | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数 | 既定値は5世代 | 
| underDev.sendPasscode | ⭕ | boolean | false | 開発中識別フラグ | パスコード通知メール送信を抑止するならtrue | 
| underDev.sendInvitation | ⭕ | boolean | false | 開発中の加入承認通知メール送信 | 開発中に加入承認通知メール送信を抑止するならtrue | 


🧱 <span id="authserverconfig_method">authServerConfig メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authserverconfig_constructor) | private | コンストラクタ |

## <span id="authserverconfig_constructor">🧱 <a href="#authserverconfig_method">authServerConfig.constructor()</a></span>

コンストラクタ

### <span id="authserverconfig_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserverconfig_constructor_process">🧾 処理手順</span>



### <span id="authserverconfig_constructor_returns">📤 戻り値</span>

  - [authServerConfig](authServerConfig.md#authserverconfig_internal): authServer専用の設定値
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | memberList | string | memberList | — |
    | defaultAuthority | number | 1 | — |
    | memberLifeTime | number | 31536000000 | — |
    | prohibitedToJoin | number | 259200000 | — |
    | loginLifeTime | number | 86400000 | — |
    | loginFreeze | number | 600000 | — |
    | requestIdRetention | number | 300000 | — |
    | errorLog | string | errorLog | — |
    | storageDaysOfErrorLog | number | 604800000 | — |
    | auditLog | string | auditLog | — |
    | storageDaysOfAuditLog | number | 604800000 | — |
    | func | Object.<string,Object> | 【必須】 | — |
    | func.authority | number | 【必須】 | — |
    | func.do | Function | 【必須】 | — |
    | trial | Object | 【必須】 | — |
    | trial.passcodeLength | number | 6 | — |
    | trial.maxTrial | number | 3 | — |
    | trial.passcodeLifeTime | number | 600000 | — |
    | trial.generationMax | number | 5 | — |
    | underDev.sendPasscode | boolean | false | — |
    | underDev.sendInvitation | boolean | false | — |