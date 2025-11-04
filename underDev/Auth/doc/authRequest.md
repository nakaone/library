<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authrequest">authRequest クラス仕様書</span>

## <span id="authrequest_summary">🧭 概要</span>

暗号化前の処理要求

authClientからauthServerに送られる、暗号化前の処理要求オブジェクト

### 🧩 <span id="authrequest_internal">内部構成</span>

🔢 authRequest メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| deviceId | ❌ | string | — | デバイスの識別子 |  | 
| signature | ❌ | string | — | クライアント側署名 |  | 
| requestId | ❌ | string | — | 要求の識別子 | UUID | 
| timestamp | ❌ | number | — | 要求日時 | UNIX時刻 | 
| func | ❌ | string | — | サーバ側関数名 |  | 
| arguments | ❌ | any[] | — | サーバ側関数に渡す引数の配列 |  | 


🧱 <span id="authrequest_method">authRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authrequest_constructor) | private | コンストラクタ |

## <span id="authrequest_constructor">🧱 <a href="#authrequest_method">authRequest.constructor()</a></span>

コンストラクタ

### <span id="authrequest_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authrequest_constructor_process">🧾 処理手順</span>



### <span id="authrequest_constructor_returns">📤 戻り値</span>

- [authRequest](authRequest.md#internal): 暗号化前の処理要求
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | [必須] | — |
  | deviceId | string | [必須] | — |
  | signature | string | [必須] | — |
  | requestId | string | [必須] | — |
  | timestamp | number | [必須] | — |
  | func | string | [必須] | — |
  | arguments | any[] | [必須] | — |