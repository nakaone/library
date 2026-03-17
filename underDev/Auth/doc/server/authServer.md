<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

# <span id="authServer_top">🧩 authServerクラス仕様書</span>

<p class="source">source: server/authServer.mjs line.9</p>サーバ側中核クラス

## <a href="#authServer_top"><span id="authServer_prop">🔢 authServer メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定項目 |
| cryptoLib | cryptoServer | 必須 | 暗号化・署名検証 |

## <a href="#authServer_top"><span id="authServer_func">🧱 authServer メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#authServer-constructor_top">constructor</a> | constructor |
| 2 | <a href="#authServer-authLogger_top">authLogger</a> | 監査ログ／エラーログを自動振り分けで出力 |
| 3 | <a href="#authServer-authResponse_top">authResponse</a> | authResponse型のオブジェクトを作成 |
| 4 | <a href="#authServer-dumpProperties_top">dumpProperties</a> | ScriptPropertiesの登録状況をコンソールに表示 (開発用) |
| 5 | <a href="#authServer-initialize_top">initialize</a> | authServerインスタンス作成 |
| 6 | <a href="#authServer-exec_top">exec</a> | 処理要求に対するサーバ側中核処理 |
| 7 | <a href="#authServer-resetSPkey_top">resetSPkey</a> | 緊急時、サーバ側鍵ペアを更新 |
| 8 | <a href="#authServer-setupEnvironment_top">setupEnvironment</a> | 初回実行時に必要なOAuth権限を一括取得 |

## <a href="#authServer_top"><span id="authServer_desc">🧾 authServer 概説</span></a>

サーバ側中核クラス
## <span id="authServer-constructor_top">🧩 constructor()</span>

constructor

### <a href="#authServer-constructor_top"><span id="authServer-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | authConfig | 必須 | authClient/Server共通設定値オブジェクト |
## <span id="authServer-authLogger_top">🧩 authLogger()</span>

監査ログ／エラーログを自動振り分けで出力

### <a href="#authServer-authLogger_top"><span id="authServer-authLogger_desc">🧾 authLogger 概説</span></a>

- 監査ログ：authAuditLog型<br>- エラーログ：authErrorLog型

### <a href="#authServer-authLogger_top"><span id="authServer-authLogger_param">▶️ authLogger 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| response | authResponse | 必須 |  |

### <a href="#authServer-authLogger_top"><span id="authServer-authLogger_return">◀️ authLogger 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authResponse |  |
## <span id="authServer-authResponse_top">🧩 authResponse()</span>

authResponse型のオブジェクトを作成

### <a href="#authServer-authResponse_top"><span id="authServer-authResponse_param">▶️ authResponse 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求オブジェクト |

### <a href="#authServer-authResponse_top"><span id="authServer-authResponse_return">◀️ authResponse 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authResponse |  |
## <span id="authServer-dumpProperties_top">🧩 dumpProperties()</span>

ScriptPropertiesの登録状況をコンソールに表示 (開発用)
## <span id="authServer-initialize_top">🧩 initialize()</span>

authServerインスタンス作成

### <a href="#authServer-initialize_top"><span id="authServer-initialize_desc">🧾 initialize 概説</span></a>

- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行<br>- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す

### <a href="#authServer-initialize_top"><span id="authServer-initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | authConfig | 必須 | authClient/Server共通設定値オブジェクト |

### <a href="#authServer-initialize_top"><span id="authServer-initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authServer \| Error |  |
## <span id="authServer-exec_top">🧩 exec()</span>

処理要求に対するサーバ側中核処理

### <a href="#authServer-exec_top"><span id="authServer-exec_param">▶️ exec 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#authServer-exec_top"><span id="authServer-exec_return">◀️ exec 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="authServer-resetSPkey_top">🧩 resetSPkey()</span>

緊急時、サーバ側鍵ペアを更新

### <a href="#authServer-resetSPkey_top"><span id="authServer-resetSPkey_desc">🧾 resetSPkey 概説</span></a>

- 管理者が Spread メニューから手動実行する

### <a href="#authServer-resetSPkey_top"><span id="authServer-resetSPkey_param">▶️ resetSPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

### <a href="#authServer-resetSPkey_top"><span id="authServer-resetSPkey_return">◀️ resetSPkey 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null |  |
## <span id="authServer-setupEnvironment_top">🧩 setupEnvironment()</span>

初回実行時に必要なOAuth権限を一括取得

### <a href="#authServer-setupEnvironment_top"><span id="authServer-setupEnvironment_desc">🧾 setupEnvironment 概説</span></a>

- 管理者が Spread メニューから手動実行する

### <a href="#authServer-setupEnvironment_top"><span id="authServer-setupEnvironment_param">▶️ setupEnvironment 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | Object | 必須 | adminMail設定を含むオブジェクト |

### <a href="#authServer-setupEnvironment_top"><span id="authServer-setupEnvironment_return">◀️ setupEnvironment 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null |  |