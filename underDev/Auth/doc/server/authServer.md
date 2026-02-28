<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# <span id="/server/authServer.mjs::authServer_top">🧩 authServerクラス仕様書</span>

authServer: サーバ側中核クラス

## <a href="#/server/authServer.mjs::authServer_top"><span id="/server/authServer.mjs::authServer_prop">🔢 authServer メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | <a href="../server/index.md#authServerConfig">authServerConfig</a> | 必須 | authServer設定項目 |  |
| cryptoLib | <a href="../server/cryptoServer.md">cryptoServer</a> | 必須 | 暗号化・署名検証 |  |

## <a href="#/server/authServer.mjs::authServer_top"><span id="/server/authServer.mjs::authServer_func">🧱 authServer メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/authServer.mjs::authServer#authServer#constructor_top">constructor</a> |  |
| 2 | <a href="#/server/authServer.mjs::authServer#authLogger_top">authLogger</a> | authLogger: 監査ログ／エラーログを自動振り分けで出力 |
| 3 | <a href="#/server/authServer.mjs::authServer#authResponse_top">authResponse</a> | authResponse: authResponse型のオブジェクトを作成 |
| 4 | <a href="#/server/authServer.mjs::authServer.dumpProperties_top">dumpProperties</a> | dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用) |
| 5 | <a href="#/server/authServer.mjs::authServer.initialize_top">initialize</a> | initialize: authServerインスタンス作成 |
| 6 | <a href="#/server/authServer.mjs::authServer#exec_top">exec</a> | exec: 処理要求に対するサーバ側中核処理 |
| 7 | <a href="#/server/authServer.mjs::authServer.resetSPkey_top">resetSPkey</a> | resetSPkey: 緊急時、サーバ側鍵ペアを更新 |
| 8 | <a href="#/server/authServer.mjs::authServer.setupEnvironment_top">setupEnvironment</a> | setupEnvironment: 初回実行時に必要なOAuth権限を一括取得 |

## <a href="#/server/authServer.mjs::authServer_top"><span id="/server/authServer.mjs::authServer_desc">🧾 authServer 概説</span></a>

authServer: サーバ側中核クラス<br>

サーバ側中核クラス<br>
## <span id="/server/authServer.mjs::authServer#authServer#constructor_top">🧩 constructor()</span>

### <a href="#/server/authServer.mjs::authServer#authServer#constructor_top"><span id="/server/authServer.mjs::authServer#authServer#constructor_desc">🧾 constructor 概説</span></a>

<br>

### <a href="#/server/authServer.mjs::authServer#authServer#constructor_top"><span id="/server/authServer.mjs::authServer#authServer#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | <a href="../common/authConfig.md">authConfig</a> | 必須 | authClient/Server共通設定値オブジェクト |  |
## <span id="/server/authServer.mjs::authServer#authLogger_top">🧩 authLogger()</span>

authLogger: 監査ログ／エラーログを自動振り分けで出力

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_desc">🧾 authLogger 概説</span></a>

authLogger: 監査ログ／エラーログを自動振り分けで出力
- 監査ログ：authAuditLog型
- エラーログ：authErrorLog型<br>

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_param">▶️ authLogger 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | <a href="../common/index.md#authResponse">authResponse</a> | 必須 |  |  |

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_return">◀️ authLogger 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../common/index.md#authResponse">authResponse</a> |  |  |
## <span id="/server/authServer.mjs::authServer#authResponse_top">🧩 authResponse()</span>

authResponse: authResponse型のオブジェクトを作成

### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_desc">🧾 authResponse 概説</span></a>

authResponse: authResponse型のオブジェクトを作成<br>

### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_param">▶️ authResponse 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | <a href="../common/index.md#authRequest">authRequest</a> | 必須 | 処理要求オブジェクト |  |

### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_return">◀️ authResponse 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../common/index.md#authResponse">authResponse</a> |  |  |
## <span id="/server/authServer.mjs::authServer.dumpProperties_top">🧩 dumpProperties()</span>

dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用)

### <a href="#/server/authServer.mjs::authServer.dumpProperties_top"><span id="/server/authServer.mjs::authServer.dumpProperties_desc">🧾 dumpProperties 概説</span></a>

dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用)<br>
## <span id="/server/authServer.mjs::authServer.initialize_top">🧩 initialize()</span>

initialize: authServerインスタンス作成

### <a href="#/server/authServer.mjs::authServer.initialize_top"><span id="/server/authServer.mjs::authServer.initialize_desc">🧾 initialize 概説</span></a>

initialize: authServerインスタンス作成
- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す<br>

### <a href="#/server/authServer.mjs::authServer.initialize_top"><span id="/server/authServer.mjs::authServer.initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | <a href="../common/authConfig.md">authConfig</a> | 必須 | authClient/Server共通設定値オブジェクト |  |

### <a href="#/server/authServer.mjs::authServer.initialize_top"><span id="/server/authServer.mjs::authServer.initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../server/authServer.md">authServer</a> \| Error |  |  |
## <span id="/server/authServer.mjs::authServer#exec_top">🧩 exec()</span>

exec: 処理要求に対するサーバ側中核処理

### <a href="#/server/authServer.mjs::authServer#exec_top"><span id="/server/authServer.mjs::authServer#exec_desc">🧾 exec 概説</span></a>

exec: 処理要求に対するサーバ側中核処理<br>

### <a href="#/server/authServer.mjs::authServer#exec_top"><span id="/server/authServer.mjs::authServer#exec_param">▶️ exec 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/authServer.mjs::authServer#exec_top"><span id="/server/authServer.mjs::authServer#exec_return">◀️ exec 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/authServer.mjs::authServer.resetSPkey_top">🧩 resetSPkey()</span>

resetSPkey: 緊急時、サーバ側鍵ペアを更新

### <a href="#/server/authServer.mjs::authServer.resetSPkey_top"><span id="/server/authServer.mjs::authServer.resetSPkey_desc">🧾 resetSPkey 概説</span></a>

resetSPkey: 緊急時、サーバ側鍵ペアを更新
- 管理者が Spread メニューから手動実行する<br>

### <a href="#/server/authServer.mjs::authServer.resetSPkey_top"><span id="/server/authServer.mjs::authServer.resetSPkey_param">▶️ resetSPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | void | 必須 |  |  |

### <a href="#/server/authServer.mjs::authServer.resetSPkey_top"><span id="/server/authServer.mjs::authServer.resetSPkey_return">◀️ resetSPkey 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null |  |  |
## <span id="/server/authServer.mjs::authServer.setupEnvironment_top">🧩 setupEnvironment()</span>

setupEnvironment: 初回実行時に必要なOAuth権限を一括取得

### <a href="#/server/authServer.mjs::authServer.setupEnvironment_top"><span id="/server/authServer.mjs::authServer.setupEnvironment_desc">🧾 setupEnvironment 概説</span></a>

setupEnvironment: 初回実行時に必要なOAuth権限を一括取得
- 管理者が Spread メニューから手動実行する<br>

### <a href="#/server/authServer.mjs::authServer.setupEnvironment_top"><span id="/server/authServer.mjs::authServer.setupEnvironment_param">▶️ setupEnvironment 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | 必須 | adminMail設定を含むオブジェクト |  |

### <a href="#/server/authServer.mjs::authServer.setupEnvironment_top"><span id="/server/authServer.mjs::authServer.setupEnvironment_return">◀️ setupEnvironment 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null |  |  |