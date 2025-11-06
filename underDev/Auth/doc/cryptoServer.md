<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoserver">cryptoServer クラス仕様書</span>

## <span id="cryptoserver_summary">🧭 概要</span>

サーバ側の暗号化・復号処理

- 認証サーバ ([authServer](authServer.md)) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書([cryptoClient](cryptoClient.md))と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- 暗号化ライブラリは"jsrsasign"を使用
- 以下"cf","prop","crypto","member","auditLog","errorLog","pv"はauthServer内共通のインスタンス変数

### <span id="cryptoserver_policy">設計方針</span>

- 署名→暗号化(Sign-then-Encrypt)方式に準拠
- 鍵ペアは[ScriptProperties](authScriptProperties.md)に保存("SSkey", "SPkey")
- ScriptPropertiesのキー名は"[authServerConfig](authServerConfig.md#authserverconfig_internal).system.name"に基づく
- 復号処理は副作用のない純関数構造を目指す(stateを持たない)
- 可能な範囲で「外部ライブラリ」を使用する
- timestamp検証は整数化・絶対値化してから比較する

### 🧩 <span id="cryptoserver_internal">内部構成</span>


🧱 <span id="cryptoserver_method">cryptoServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#cryptoserver_constructor) | private | コンストラクタ |

## <span id="cryptoserver_constructor">🧱 <a href="#cryptoserver_method">cryptoServer.constructor()</a></span>

コンストラクタ

### <span id="cryptoserver_constructor_caller">📞 呼出元</span>

- [authServer.constructor()](authServer.md#cryptoserver_constructor)

### <span id="cryptoserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | authServerの動作設定変数 | 

### <span id="cryptoserver_constructor_process">🧾 処理手順</span>



### <span id="cryptoserver_constructor_returns">📤 戻り値</span>

  - [cryptoServer](cryptoServer.md#cryptoserver_internal): サーバ側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |