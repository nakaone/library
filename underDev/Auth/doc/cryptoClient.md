<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoclient">cryptoClient クラス仕様書</span>

## <span id="cryptoclient_summary">🧭 概要</span>

クライアント側の暗号化・復号処理

### 🧩 <span id="cryptoclient_internal">内部構成</span>

🔢 cryptoClient メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
|  | ❌ | string | — |  |  | 


🧱 <span id="cryptoclient_method">cryptoClient メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#cryptoclient_constructor) | private | コンストラクタ |
| [fetch](#cryptoclient_fetch) | public | 処理要求を署名・暗号化し、サーバ側に問合せを行う |

## <span id="cryptoclient_constructor">🧱 <a href="#cryptoclient_method">cryptoClient.constructor()</a></span>

コンストラクタ

### <span id="cryptoclient_constructor_caller">📞 呼出元</span>

- [authClient.constructor()](authClient.md#cryptoclient_constructor)

### <span id="cryptoclient_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | authClientの動作設定変数 | 

### <span id="cryptoclient_constructor_process">🧾 処理手順</span>



### <span id="cryptoclient_constructor_returns">📤 戻り値</span>

  - [cryptoClient](cryptoClient.md#cryptoclient_internal): クライアント側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    |  | string | 【必須】 | — |

## <span id="cryptoclient_fetch">🧱 <a href="#cryptoclient_method">cryptoClient.fetch()</a></span>

処理要求を署名・暗号化し、サーバ側に問合せを行う

### <span id="cryptoclient_fetch_caller">📞 呼出元</span>

- [authClient.exec()](authClient.md#cryptoclient_fetch)

### <span id="cryptoclient_fetch_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求 | 

### <span id="cryptoclient_fetch_process">🧾 処理手順</span>

- requestを[encryptメソッド](#cryptoclient_encrypt)で署名・暗号化
- サーバ側に問合せを実行
- 一定時間経っても無応答の場合、戻り値「無応答」を返して終了
- サーバ側からの応答が有った場合、[decryptメソッド](#cryptoclient_decrypt)で復号・署名検証
- 復号・署名検証の結果をそのまま戻り値として返して終了

### <span id="cryptoclient_fetch_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 無応答 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | **"fatal"** |
    | message | string | 【任意】 | **"no response"** |
    | request | authRequest | 【任意】 | **request** |
    | response | any | 【任意】 | — |