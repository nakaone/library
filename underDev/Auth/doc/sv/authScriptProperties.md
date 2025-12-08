<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="authscriptproperties">authScriptProperties クラス仕様書</span>

サーバ側のScriptProperties

キー名は[authConfig.system.name](authConfig.md#authconfig_members)(既定値"auth")を使用

## <span id="authscriptproperties_members">🔢 authScriptProperties メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| keyGeneratedDateTime | number | <span style="color:red">必須</span> | UNIX時刻 |  |
| SPkey | string | <span style="color:red">必須</span> | PEM形式の公開鍵文字列 |  |
| SSkey | string | <span style="color:red">必須</span> | PEM形式の秘密鍵文字列(暗号化済み) |  |
| oldSPkey | string | <span style="color:red">必須</span> | cryptoServer.reset実行前にバックアップした公開鍵 |  |
| oldSSkey | string | <span style="color:red">必須</span> | cryptoServer.reset実行前にバックアップした秘密鍵 |  |
| requestLog | authRequestLog[] | [] | 重複チェック用のリクエスト履歴 |  |

## <span id="authscriptproperties_methods">🧱 authScriptProperties メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authscriptproperties_constructor) | private | コンストラクタ |  |
| [checkDuplicate()](#authscriptproperties_checkduplicate) | public | クライアントからの重複リクエストチェック |  |
| [deleteProp()](#authscriptproperties_deleteprop) | public | ScriptPropertiesを消去 | - キー名[authConfig.system.name](authConfig.md#authconfig_members)を削除 |
| [getProp()](#authscriptproperties_getprop) | public | ScriptPropertiesをインスタンス変数に格納 |  |
| [resetSPkey()](#authscriptproperties_resetspkey) | public | SPkeyを更新、ScriptPropertiesに保存 | - 緊急対応時のみ使用を想定 |
| [setProp()](#authscriptproperties_setprop) | public | インスタンス変数をScriptPropertiesに格納 |  |

### <span id="authscriptproperties_constructor"><a href="#authscriptproperties_methods">🧱 authScriptProperties.constructor()</a></span>

#### <span id="authscriptproperties_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} | ユーザ指定の設定値 |  |

#### <span id="authscriptproperties_constructor_process">🧾 処理手順</span>

- 鍵ペア未作成なら[createPassword](JSLib.md#createpassword)を使用して作成

#### <span id="authscriptproperties_constructor_returns">📤 戻り値</span>

- [authScriptProperties](#authscriptproperties_members)インスタンス
### <span id="authscriptproperties_checkduplicate"><a href="#authscriptproperties_methods">🧱 authScriptProperties.checkDuplicate()</a></span>

#### <span id="authscriptproperties_checkduplicate_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| requestId | string | <span style="color:red">必須</span> | 処理要求識別子(UUID) |  |

#### <span id="authscriptproperties_checkduplicate_process">🧾 処理手順</span>

#### <span id="authscriptproperties_checkduplicate_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)

### <span id="authscriptproperties_deleteprop"><a href="#authscriptproperties_methods">🧱 authScriptProperties.deleteProp()</a></span>

#### <span id="authscriptproperties_deleteprop_params">📥 引数</span>

- 引数無し(void)

#### <span id="authscriptproperties_deleteprop_process">🧾 処理手順</span>

#### <span id="authscriptproperties_deleteprop_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)

### <span id="authscriptproperties_getprop"><a href="#authscriptproperties_methods">🧱 authScriptProperties.getProp()</a></span>

#### <span id="authscriptproperties_getprop_params">📥 引数</span>

- 引数無し(void)

#### <span id="authscriptproperties_getprop_process">🧾 処理手順</span>

#### <span id="authscriptproperties_getprop_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)

### <span id="authscriptproperties_resetspkey"><a href="#authscriptproperties_methods">🧱 authScriptProperties.resetSPkey()</a></span>

#### <span id="authscriptproperties_resetspkey_params">📥 引数</span>

- 引数無し(void)

#### <span id="authscriptproperties_resetspkey_process">🧾 処理手順</span>

#### <span id="authscriptproperties_resetspkey_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)

### <span id="authscriptproperties_setprop"><a href="#authscriptproperties_methods">🧱 authScriptProperties.setProp()</a></span>

#### <span id="authscriptproperties_setprop_params">📥 引数</span>

- 引数無し(void)

#### <span id="authscriptproperties_setprop_process">🧾 処理手順</span>

#### <span id="authscriptproperties_setprop_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)