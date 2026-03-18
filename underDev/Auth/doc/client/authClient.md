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

# <span id="authClient_top">🧩 authClientクラス仕様書</span>

<p class="source">source: client/authClient.mjs line.39</p>クライアント側中核クラス

## <a href="#authClient_top"><span id="authClient_prop">🔢 authClient メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| cf | <a href="../client/index.md#authClientConfig">authClientConfig</a> | 必須 | authClient設定情報 |
| idb | Object | 必須 | IndexedDBと同期、authClient内で共有 |
| crypto | <a href="../client/cryptoClient.md">cryptoClient</a> | 必須 | 暗号化・署名検証 |
| _IndexedDB | IDBObjectStore | 必須 | データベース接続オブジェクトを格納する静的変数 |

## <a href="#authClient_top"><span id="authClient_func">🧱 authClient メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#authClient-constructor_top">constructor</a> | constructor |
| 2 | <a href="#authClient-_exportIfCryptoKey_top">_exportIfCryptoKey</a> | CryptoKey型のRSA鍵をIndexedDBに保存可能な文字列に変換 |
| 3 | <a href="#authClient-_importIfCryptoKey_top">_importIfCryptoKey</a> | IndexedDBに保存されたRSA鍵をCryptoKey型に変換 |
| 4 | <a href="#authClient-_withStore_top">_withStore</a> | IndexedDB操作共通ラッパ |
| 5 | <a href="#authClient-exec_top">exec</a> | ローカル関数の処理要求を処理 |
| 6 | <a href="#authClient-fetch_top">fetch</a> | サーバ側APIの呼び出し |
| 7 | <a href="#authClient-getIndexedDB_top">getIndexedDB</a> | IndexedDBの全てのキー・値をオブジェクト形式で取得 |
| 8 | <a href="#authClient-initialize_top">initialize</a> | authClientインスタンス作成 |
| 9 | <a href="#authClient-setIndexedDB_top">setIndexedDB</a> | IndexedDBの更新(upsert) |

## <a href="#authClient_top"><span id="authClient_desc">🧾 authClient 概説</span></a>

- 初期化の際に非同期処理が必要なため、インスタンス作成は
  `new authClient()`ではなく`authClient.initialize()`で行う

**インスタンス作成のサンプル**
```js
async function onLoad(){
  const v = {whois:`onLoad`, rv:null};
  dev.start(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    const auth = await authClient.initialize({
      adminMail: 'ena.kaon@gmail.com',
      adminName: 'あどみ',
      api: 'abcdefghijklmnopqrstuvwxyz',
    });

    dev.step(2);  // authインスタンスをグローバル変数と戻り値(テスト用)にセット
    globalThis.auth = auth;
    v.rv = auth;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { return dev.error(e); }
}
```

## <span id="authClient-constructor_top">🧩 constructor()</span>

constructor

### <a href="#authClient-constructor_top"><span id="authClient-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | Object | 必須 | authClient/Server共通設定情報 |

## <span id="authClient-_exportIfCryptoKey_top">🧩 _exportIfCryptoKey()</span>

CryptoKey型のRSA鍵をIndexedDBに保存可能な文字列に変換

### <a href="#authClient-_exportIfCryptoKey_top"><span id="authClient-_exportIfCryptoKey_param">▶️ _exportIfCryptoKey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| key | string | 必須 | 鍵名。"CPkeySign"等 |
| value | CryptoKey | 必須 | 鍵の内容 |

### <a href="#authClient-_exportIfCryptoKey_top"><span id="authClient-_exportIfCryptoKey_return">◀️ _exportIfCryptoKey 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| string |  |

## <span id="authClient-_importIfCryptoKey_top">🧩 _importIfCryptoKey()</span>

IndexedDBに保存されたRSA鍵をCryptoKey型に変換

### <a href="#authClient-_importIfCryptoKey_top"><span id="authClient-_importIfCryptoKey_param">▶️ _importIfCryptoKey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| key | string | 必須 | 鍵名。"CPkeySign"等 |
| value | string | 必須 | IndexedDBに保存された鍵の内容 |

### <a href="#authClient-_importIfCryptoKey_top"><span id="authClient-_importIfCryptoKey_return">◀️ _importIfCryptoKey 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| CryptoKey |  |

## <span id="authClient-_withStore_top">🧩 _withStore()</span>

IndexedDB操作共通ラッパ

### <a href="#authClient-_withStore_top"><span id="authClient-_withStore_param">▶️ _withStore 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| mode | 'readonly' \| 'readwrite' | 必須 | param {(store: IDBObjectStore)=>Promise<any>} fn |

## <span id="authClient-exec_top">🧩 exec()</span>

ローカル関数の処理要求を処理

### <a href="#authClient-exec_top"><span id="authClient-exec_desc">🧾 exec 概説</span></a>

- エラー時はErrorオブジェクト化して戻り値とする

### <a href="#authClient-exec_top"><span id="authClient-exec_param">▶️ exec 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| func | string | 必須 | サーバ側関数名 |
| arg | any[] | [ | サーバ側関数に渡す引数 |
| depth | number | 0 | 再帰呼出時の階層 |

### <a href="#authClient-exec_top"><span id="authClient-exec_return">◀️ exec 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| any \| Error | 処理結果 |

## <span id="authClient-fetch_top">🧩 fetch()</span>

サーバ側APIの呼び出し

### <a href="#authClient-fetch_top"><span id="authClient-fetch_param">▶️ fetch 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | <a href="../common/index.md#authRequest">authRequest</a> | 必須 | 処理要求 |

### <a href="#authClient-fetch_top"><span id="authClient-fetch_return">◀️ fetch 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../common/index.md#authResponse">authResponse</a> \| Error | 処理結果 |

## <span id="authClient-getIndexedDB_top">🧩 getIndexedDB()</span>

IndexedDBの全てのキー・値をオブジェクト形式で取得

### <a href="#authClient-getIndexedDB_top"><span id="authClient-getIndexedDB_param">▶️ getIndexedDB 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

### <a href="#authClient-getIndexedDB_top"><span id="authClient-getIndexedDB_return">◀️ getIndexedDB 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object.<string, any> | this.idbに格納したIndexedDBの内容({キー:値}形式) |

## <span id="authClient-initialize_top">🧩 initialize()</span>

authClientインスタンス作成

### <a href="#authClient-initialize_top"><span id="authClient-initialize_desc">🧾 initialize 概説</span></a>

- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す

### <a href="#authClient-initialize_top"><span id="authClient-initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | Object | 必須 | authClient/Server共通＋authClient専用設定情報<br>  ※共通/専用設定情報は事前に結合しておくこと(ex.mergeDeeply) |

### <a href="#authClient-initialize_top"><span id="authClient-initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| <a href="../client/authClient.md">authClient</a> \| Error |  |

## <span id="authClient-setIndexedDB_top">🧩 setIndexedDB()</span>

IndexedDBの更新(upsert)

### <a href="#authClient-setIndexedDB_top"><span id="authClient-setIndexedDB_param">▶️ setIndexedDB 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | Object.<string, string> | 必須 |  |

### <a href="#authClient-setIndexedDB_top"><span id="authClient-setIndexedDB_return">◀️ setIndexedDB 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error |  |