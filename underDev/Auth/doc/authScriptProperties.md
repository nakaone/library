<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authscriptproperties">authScriptProperties クラス仕様書</span>

## <span id="authscriptproperties_summary">🧭 概要</span>

サーバ側のScriptProperties

キー名は`authConfig.system.name`

### 🧩 <span id="authscriptproperties_internal">内部構成</span>

🔢 authScriptProperties メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| keyGeneratedDateTime | ❌ | number | — | UNIX時刻 |  | 
| SPkey | ❌ | string | — | PEM形式の公開鍵文字列 |  | 
| SSkey | ❌ | string | — | PEM形式の秘密鍵文字列(暗号化済み) |  | 
| oldSPkey | ❌ | string | — | cryptoServer.reset実行前にバックアップした公開鍵 |  | 
| oldSSkey | ❌ | string | — | cryptoServer.reset実行前にバックアップした秘密鍵 |  | 
| requestLog | ⭕ | authRequestLog[] | [] | 重複チェック用のリクエスト履歴 |  | 


🧱 <span id="authscriptproperties_method">authScriptProperties メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authscriptproperties_constructor) | private | コンストラクタ |

## <span id="authscriptproperties_constructor">🧱 <a href="#authscriptproperties_method">authScriptProperties.constructor()</a></span>

コンストラクタ

### <span id="authscriptproperties_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_constructor_process">🧾 処理手順</span>



### <span id="authscriptproperties_constructor_returns">📤 戻り値</span>

- [authScriptProperties](authScriptProperties.md#internal): サーバ側のScriptProperties
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | keyGeneratedDateTime | number | [必須] | — |
  | SPkey | string | [必須] | — |
  | SSkey | string | [必須] | — |
  | oldSPkey | string | [必須] | — |
  | oldSSkey | string | [必須] | — |
  | requestLog | authRequestLog[] |  | — |