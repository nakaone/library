<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authclientkeys">authClientKeys クラス仕様書</span>

## <span id="authclientkeys_summary">🧭 概要</span>

RSA鍵ペアの生成

### 🧩 <span id="authclientkeys_internal">内部構成</span>

🔢 authClientKeys メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CSkeySign | ❌ | CryptoKey | — | 署名用秘密鍵 |  | 
| CPkeySign | ❌ | CryptoKey | — | 署名用公開鍵 |  | 
| CSkeyEnc | ❌ | CryptoKey | — | 暗号化用秘密鍵 |  | 
| CPkeyEnc | ❌ | CryptoKey | — | 暗号化用公開鍵 |  | 


🧱 <span id="authclientkeys_method">authClientKeys メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authclientkeys_constructor) | private | コンストラクタ |

## <span id="authclientkeys_constructor">🧱 <a href="#authclientkeys_method">authClientKeys.constructor()</a></span>

コンストラクタ

### <span id="authclientkeys_constructor_param">📥 引数</span>


- 無し(void)

### <span id="authclientkeys_constructor_process">🧾 処理手順</span>

- [createPassword](JSLib.md#createpassword)でパスワード生成
- [cf.RSAbits](authConfig.md#authconfig_internal)を参照、新たな鍵ペア生成

### <span id="authclientkeys_constructor_returns">📤 戻り値</span>

  - [authClientKeys](authClientKeys.md#authclientkeys_internal): RSA鍵ペアの生成
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | CSkeySign | CryptoKey | 【必須】 | — |
    | CPkeySign | CryptoKey | 【必須】 | — |
    | CSkeyEnc | CryptoKey | 【必須】 | — |
    | CPkeyEnc | CryptoKey | 【必須】 | — |