<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

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
| [checkDuplicate](#authscriptproperties_checkduplicate) | public | クライアントからの重複リクエストチェック |
| [deleteProp](#authscriptproperties_deleteprop) | public | ScriptPropertiesを消去 |
| [getProp](#authscriptproperties_getprop) | public | ScriptPropertiesをインスタンス変数に格納 |
| [resetSPkey](#authscriptproperties_resetspkey) | public | SPkeyを更新、ScriptPropertiesに保存 |
| [setProp](#authscriptproperties_setprop) | public | インスタンス変数をScriptPropertiesに格納 |

## <span id="authscriptproperties_constructor">🧱 <a href="#authscriptproperties_method">authScriptProperties.constructor()</a></span>

コンストラクタ

### <span id="authscriptproperties_constructor_caller">📞 呼出元</span>

- [authServer.constructor()](authServer.md#authscriptproperties_constructor)

### <span id="authscriptproperties_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_constructor_process">🧾 処理手順</span>

- 鍵ペア未作成なら[createPassword](JSLib.md#createpassword)を使用して作成

  - [authScriptProperties](authScriptProperties.md#authscriptproperties_internal): サーバ側のScriptProperties
    | 項目名 | データ型 | 生成時 | 更新内容 |
    | :-- | :-- | :-- | :-- |
    | keyGeneratedDateTime | number | 【必須】 | **Date.now()** |
    | SPkey | string | 【必須】 | **新規作成** |
    | SSkey | string | 【必須】 | **新規作成** |
    | oldSPkey | string | 【必須】 | — |
    | oldSSkey | string | 【必須】 | — |
    | requestLog | authRequestLog[] |  | — |

### <span id="authscriptproperties_constructor_returns">📤 戻り値</span>

  - [authScriptProperties](authScriptProperties.md#authscriptproperties_internal): サーバ側のScriptProperties
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | keyGeneratedDateTime | number | 【必須】 | — |
    | SPkey | string | 【必須】 | — |
    | SSkey | string | 【必須】 | — |
    | oldSPkey | string | 【必須】 | — |
    | oldSSkey | string | 【必須】 | — |
    | requestLog | authRequestLog[] |  | — |

## <span id="authscriptproperties_checkduplicate">🧱 <a href="#authscriptproperties_method">authScriptProperties.checkDuplicate()</a></span>

クライアントからの重複リクエストチェック

### <span id="authscriptproperties_checkduplicate_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_checkduplicate_process">🧾 処理手順</span>



### <span id="authscriptproperties_checkduplicate_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authscriptproperties_deleteprop">🧱 <a href="#authscriptproperties_method">authScriptProperties.deleteProp()</a></span>

ScriptPropertiesを消去

### <span id="authscriptproperties_deleteprop_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_deleteprop_process">🧾 処理手順</span>



### <span id="authscriptproperties_deleteprop_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authscriptproperties_getprop">🧱 <a href="#authscriptproperties_method">authScriptProperties.getProp()</a></span>

ScriptPropertiesをインスタンス変数に格納

### <span id="authscriptproperties_getprop_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_getprop_process">🧾 処理手順</span>



### <span id="authscriptproperties_getprop_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authscriptproperties_resetspkey">🧱 <a href="#authscriptproperties_method">authScriptProperties.resetSPkey()</a></span>

SPkeyを更新、ScriptPropertiesに保存

### <span id="authscriptproperties_resetspkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_resetspkey_process">🧾 処理手順</span>



### <span id="authscriptproperties_resetspkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authscriptproperties_setprop">🧱 <a href="#authscriptproperties_method">authScriptProperties.setProp()</a></span>

インスタンス変数をScriptPropertiesに格納

### <span id="authscriptproperties_setprop_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authscriptproperties_setprop_process">🧾 処理手順</span>



### <span id="authscriptproperties_setprop_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |