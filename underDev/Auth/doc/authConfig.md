<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authconfig">authConfig クラス仕様書</span>

## <span id="authconfig_summary">🧭 概要</span>

authClient/authServer共通設定値

authClientConfig, authServerConfigの親クラス

### 🧩 <span id="authconfig_internal">内部構成</span>

🔢 authConfig メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| systemName | ⭕ | string | auth | システム名 |  | 
| adminMail | ❌ | string | — | 管理者のメールアドレス |  | 
| adminName | ❌ | string | — | 管理者氏名 |  | 
| allowableTimeDifference | ⭕ | number | 120000 | クライアント・サーバ間通信時の許容時差 | 既定値は2分 | 
| RSAbits | ⭕ | string | 2048 | 鍵ペアの鍵長 |  | 
| underDev | ❌ | Object | — | テスト時の設定 |  | 
| underDev.isTest | ⭕ | boolean | false | 開発モードならtrue |  | 


🧱 <span id="authconfig_method">authConfig メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authconfig_constructor) | private | コンストラクタ |

## <span id="authconfig_constructor">🧱 <a href="#authconfig_method">authConfig.constructor()</a></span>

コンストラクタ

### <span id="authconfig_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authconfig_constructor_process">🧾 処理手順</span>



### <span id="authconfig_constructor_returns">📤 戻り値</span>

  - [authConfig](authConfig.md#authconfig_internal): authClient/authServer共通設定値
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | systemName | string | auth | — |
    | adminMail | string | 【必須】 | — |
    | adminName | string | 【必須】 | — |
    | allowableTimeDifference | number | 120000 | — |
    | RSAbits | string | 2048 | — |
    | underDev | Object | 【必須】 | — |
    | underDev.isTest | boolean | false | — |