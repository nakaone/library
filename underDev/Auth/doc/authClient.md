<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authclient">authClient クラス仕様書</span>

## <span id="authclient_summary">🧭 概要</span>

クライアント側auth中核クラス

authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
サーバ側処理を経てローカル側に戻された結果を復号・検証し、
処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。

### <span id="authclient_policy">設計方針</span>

- クロージャ関数ではなくクラスとして作成
- 内発処理はローカル関数からの処理要求に先行して行う

### <span id="authclient_example">実装・使用例</span>

```html
<script type="text/javascript">
  // ライブラリ関数定義
  function devTools(){...}; // (中略)

  // authClient関係クラス定義
  class authClient{...}
  class authConfig{...}
  class authClientConfig{...} // (中略)

  // グローバル変数定義
  const dev = devTools();
  const acl = authClient({ // HTML要素のイベント対応のためグローバル領域でインスタンス化
    // プロジェクト毎の独自パラメータ
  });

  window.addEventListener('DOMContentLoaded', () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois, [...arguments]);
    try {


      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
```

### 🧩 <span id="authclient_internal">内部構成</span>

🔢 authClient メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| cf | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | 動作設定変数(config) |  | 
| crypto | ❌ | [cryptoClient](cryptoClient.md#cryptoclient_internal) | — | 暗号化・復号用インスタンス |  | 
| idb | ❌ | [authIndexedDB](authIndexedDB.md#authindexeddb_internal) | — | IndexedDB共有用 | IndexedDBの内容をauthClient内で共有 | 
| pv | ❌ | Object | — | authClient内共通変数 |  | 


🧱 <span id="authclient_method">authClient メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authclient_constructor) | private | コンストラクタ |
| [checkCPkey](#authclient_checkcpkey) | private | CPkey残有効期間をチェック |
| [enterPasscode](#authclient_enterpasscode) | private | パスコード入力ダイアログを表示 |
| [exec](#authclient_exec) | public | ローカル関数からの要求受付 |
| [setupEnvironment](#authclient_setupenvironment) | private | SPkey入手等、authClient動作環境整備 |
| [showMessage](#authclient_showmessage) | private | メッセージをダイアログで表示 |

## <span id="authclient_constructor">🧱 <a href="#authclient_method">authClient.constructor()</a></span>

コンストラクタ

### <span id="authclient_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ⭕ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | {}(空オブジェクト) | authClientの動作設定変数 | 

### <span id="authclient_constructor_process">🧾 処理手順</span>

- インスタンス変数の設定

  - [authClient](authClient.md#authclient_internal): クライアント側auth中核クラス
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | cf | authClientConfig | 【必須】 | **new [authClientConfig](authClientConfig.md#authclientconfig_constructor)(config)** |
    | crypto | cryptoClient | 【必須】 | **new [cryptoClient](cryptoClient.md#cryptoclient_constructor)(config)** |
    | idb | authIndexedDB | 【必須】 | **new [authIndexedDB](authIndexedDB.md#authindexeddb_constructor)(config)** |
    | pv | Object | 【必須】 | **空オブジェクト** |

### <span id="authclient_constructor_returns">📤 戻り値</span>

  - [authClient](authClient.md#authclient_internal): クライアント側auth中核クラス
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | cf | authClientConfig | 【必須】 | — |
    | crypto | cryptoClient | 【必須】 | — |
    | idb | authIndexedDB | 【必須】 | — |
    | pv | Object | 【必須】 | — |

## <span id="authclient_checkcpkey">🧱 <a href="#authclient_method">authClient.checkCPkey()</a></span>

CPkey残有効期間をチェック

### <span id="authclient_checkcpkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_checkcpkey_process">🧾 処理手順</span>



### <span id="authclient_checkcpkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authclient_enterpasscode">🧱 <a href="#authclient_method">authClient.enterPasscode()</a></span>

パスコード入力ダイアログを表示

### <span id="authclient_enterpasscode_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_enterpasscode_process">🧾 処理手順</span>



### <span id="authclient_enterpasscode_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authclient_exec">🧱 <a href="#authclient_method">authClient.exec()</a></span>

ローカル関数からの要求受付

ローカル関数からの要求を受けてauthServerに問合せを行う

### <span id="authclient_exec_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ⭕ | [authRequest[]](authRequest.md#authrequest_internal) | {} | 処理要求(スタック) | 

### <span id="authclient_exec_process">🧾 処理手順</span>



### <span id="authclient_exec_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authclient_setupenvironment">🧱 <a href="#authclient_method">authClient.setupEnvironment()</a></span>

SPkey入手等、authClient動作環境整備

### <span id="authclient_setupenvironment_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_setupenvironment_process">🧾 処理手順</span>



### <span id="authclient_setupenvironment_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authclient_showmessage">🧱 <a href="#authclient_method">authClient.showMessage()</a></span>

メッセージをダイアログで表示

### <span id="authclient_showmessage_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_showmessage_process">🧾 処理手順</span>



### <span id="authclient_showmessage_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |