<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authrequest">authRequest クラス仕様書</span>

## <span id="authrequest_summary">🧭 概要</span>

暗号化前の処理要求

authClientからauthServerに送られる、暗号化前の処理要求オブジェクト

### 🧩 <span id="authrequest_internal">内部構成</span>

🔢 authRequest メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ⭕ | string | idb.memberId | メンバの識別子 | =メールアドレス | 
| deviceId | ⭕ | string | idb.deviceId | デバイスの識別子 |  | 
| signature | ⭕ | string | idb.CPkey | クライアント側署名 |  | 
| requestId | ⭕ | string | UUID | 要求の識別子 | UUID | 
| timestamp | ⭕ | number | Date.now() | 要求日時 | UNIX時刻 | 
| func | ❌ | string | — | サーバ側関数名 |  | 
| arguments | ⭕ | any[] | [] | サーバ側関数に渡す引数の配列 |  | 


🧱 <span id="authrequest_method">authRequest メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authrequest_constructor) | private | コンストラクタ |

## <span id="authrequest_constructor">🧱 <a href="#authrequest_method">authRequest.constructor()</a></span>

コンストラクタ

### <span id="authrequest_constructor_caller">📞 呼出元</span>

- [authClient.exec()](authClient.md#authrequest_constructor)

### <span id="authrequest_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ❌ | Object | — | ユーザ指定の設定値 | 

### <span id="authrequest_constructor_process">🧾 処理手順</span>

- 引数チェック
  - arg.func未指定の場合"new Error('func is not specified')"を返して終了
- 必須項目の設定
  - "this.func = arg.func"
  - "this.arguments = arg.arguments || []"
- その他項目：メンバと引数両方にある項目はargの値をメンバにセット

### <span id="authrequest_constructor_returns">📤 戻り値</span>

  - [authRequest](authRequest.md#authrequest_internal): 暗号化前の処理要求
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | — |
    | deviceId | string | idb.deviceId | — |
    | signature | string | idb.CPkey | — |
    | requestId | string | UUID | — |
    | timestamp | number | Date.now() | — |
    | func | string | 【必須】 | — |
    | arguments | any[] | [] | — |