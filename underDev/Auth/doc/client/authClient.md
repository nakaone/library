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

# <span id="/client/authClient.mjs::authClient_top">🧩 authClientクラス仕様書</span>

authClient: クライアント側中核クラス

## <a href="#/client/authClient.mjs::authClient_top"><span id="/client/authClient.mjs::authClient_prop">🔢 authClient メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authClientConfig | 必須 | authClient設定情報 |  |
| idb | Object | 必須 | IndexedDBと同期、authClient内で共有 |  |
| crypto | cryptoClient | 必須 | 暗号化・署名検証 |  |

## <a href="#/client/authClient.mjs::authClient_top"><span id="/client/authClient.mjs::authClient_func">🧱 authClient メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/authClient.mjs::authClient.initialize_top">initialize</a> | initialize: authClientインスタンス作成 |
| 2 | <a href="#/client/authClient.mjs::authClient#setIndexedDB_top">setIndexedDB</a> | setIndexedDB: IndexedDBの更新(upsert) |
| 3 | <a href="#/server/authServer.mjs::authServer#authLogger_top">authLogger</a> | authLogger: 監査ログ／エラーログを自動振り分けで出力 |
| 4 | <a href="#/server/authServer.mjs::authServer.dumpProperties_top">dumpProperties</a> | dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用) |

## <a href="#/client/authClient.mjs::authClient_top"><span id="/client/authClient.mjs::authClient_desc">🧾 authClient 概説</span></a>

クライアント側中核クラス
- 初期化の際に非同期処理が必要なため、インスタンス作成は
  `new authClient()`ではなく`authClient.initialize()`で行う
## <span id="/client/authClient.mjs::authClient.initialize_top">🧩 initialize()</span>

initialize: authClientインスタンス作成

### <a href="#/client/authClient.mjs::authClient.initialize_top"><span id="/client/authClient.mjs::authClient.initialize_func">🧱 initialize メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/authServer.mjs::authServer#authResponse_top">authResponse</a> | authResponse: authResponse型のオブジェクトを作成 |

### <a href="#/client/authClient.mjs::authClient.initialize_top"><span id="/client/authClient.mjs::authClient.initialize_desc">🧾 initialize 概説</span></a>

initialize: authClientインスタンス作成
- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す

### <a href="#/client/authClient.mjs::authClient.initialize_top"><span id="/client/authClient.mjs::authClient.initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | Object | 必須 | authClient/Server共通＋authClient専用設定情報 | ※共通/専用設定情報は事前に結合しておくこと(ex.mergeDeeply) |

### <a href="#/client/authClient.mjs::authClient.initialize_top"><span id="/client/authClient.mjs::authClient.initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authClient \| Error |  |  |
### <span id="/server/authServer.mjs::authServer#authResponse_top">🧩 authResponse()</span>

authResponse: authResponse型のオブジェクトを作成

#### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_desc">🧾 authResponse 概説</span></a>

authResponse: authResponse型のオブジェクトを作成

#### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_param">▶️ authResponse 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求オブジェクト |  |

#### <a href="#/server/authServer.mjs::authServer#authResponse_top"><span id="/server/authServer.mjs::authServer#authResponse_return">◀️ authResponse 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authResponse |  |  |
## <span id="/client/authClient.mjs::authClient#setIndexedDB_top">🧩 setIndexedDB()</span>

setIndexedDB: IndexedDBの更新(upsert)

### <a href="#/client/authClient.mjs::authClient#setIndexedDB_top"><span id="/client/authClient.mjs::authClient#setIndexedDB_desc">🧾 setIndexedDB 概説</span></a>

setIndexedDB: IndexedDBの更新(upsert)

### <a href="#/client/authClient.mjs::authClient#setIndexedDB_top"><span id="/client/authClient.mjs::authClient#setIndexedDB_param">▶️ setIndexedDB 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object.<string, string> | 必須 |  |  |

### <a href="#/client/authClient.mjs::authClient#setIndexedDB_top"><span id="/client/authClient.mjs::authClient#setIndexedDB_return">◀️ setIndexedDB 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error |  |  |
## <span id="/server/authServer.mjs::authServer#authLogger_top">🧩 authLogger()</span>

authLogger: 監査ログ／エラーログを自動振り分けで出力

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_func">🧱 authLogger メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/authClient.mjs::authClient#getIndexedDB_top">getIndexedDB</a> | getIndexedDB: IndexedDBの全てのキー・値をオブジェクト形式で取得 |
| 2 | <a href="#/server/Member.mjs::Member.unfreeze_top">unfreeze</a> | unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 |

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_desc">🧾 authLogger 概説</span></a>

authLogger: 監査ログ／エラーログを自動振り分けで出力
- 監査ログ：authAuditLog型
- エラーログ：authErrorLog型

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_param">▶️ authLogger 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | authResponse | 必須 |  |  |

### <a href="#/server/authServer.mjs::authServer#authLogger_top"><span id="/server/authServer.mjs::authServer#authLogger_return">◀️ authLogger 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authResponse |  |  |
### <span id="/client/authClient.mjs::authClient#getIndexedDB_top">🧩 getIndexedDB()</span>

getIndexedDB: IndexedDBの全てのキー・値をオブジェクト形式で取得

#### <a href="#/client/authClient.mjs::authClient#getIndexedDB_top"><span id="/client/authClient.mjs::authClient#getIndexedDB_func">🧱 getIndexedDB メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member#updateCPkey_top">updateCPkey</a> | updateCPkey: 対象メンバ・デバイスの公開鍵を更新 |

#### <a href="#/client/authClient.mjs::authClient#getIndexedDB_top"><span id="/client/authClient.mjs::authClient#getIndexedDB_desc">🧾 getIndexedDB 概説</span></a>

getIndexedDB: IndexedDBの全てのキー・値をオブジェクト形式で取得

#### <a href="#/client/authClient.mjs::authClient#getIndexedDB_top"><span id="/client/authClient.mjs::authClient#getIndexedDB_param">▶️ getIndexedDB 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | void | 必須 |  |  |

#### <a href="#/client/authClient.mjs::authClient#getIndexedDB_top"><span id="/client/authClient.mjs::authClient#getIndexedDB_return">◀️ getIndexedDB 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Object.<string, any> | this.idbに格納したIndexedDBの内容({キー:値}形式) |  |
#### <span id="/server/Member.mjs::Member#updateCPkey_top">🧩 updateCPkey()</span>

updateCPkey: 対象メンバ・デバイスの公開鍵を更新

##### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_desc">🧾 updateCPkey 概説</span></a>

updateCPkey: 対象メンバ・デバイスの公開鍵を更新

##### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_param">▶️ updateCPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

##### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_return">◀️ updateCPkey 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
### <span id="/server/Member.mjs::Member.unfreeze_top">🧩 unfreeze()</span>

unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除

#### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_desc">🧾 unfreeze 概説</span></a>

unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
- 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
- deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

#### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_param">▶️ unfreeze 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

#### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_return">◀️ unfreeze 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/authServer.mjs::authServer.dumpProperties_top">🧩 dumpProperties()</span>

dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用)

### <a href="#/server/authServer.mjs::authServer.dumpProperties_top"><span id="/server/authServer.mjs::authServer.dumpProperties_desc">🧾 dumpProperties 概説</span></a>

dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用)