<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md) | [JSLib](JSLib.md)

</div>

<p style="text-align:right;"><a href="classList.md">クラス一覧</a></p>

# <span id="authindexeddb">authIndexedDB クラス仕様書</span>

## <span id="authindexeddb_summary">🧭 概要</span>

クライアントのIndexedDB

authClientKeysを継承した、クライアントのIndexedDBを操作するクロージャ関数<br>メイン処理を同期的に行うため、クラスでは無くasyncクロージャ関数として定義。IndexedDB保存時のキー名は`authConfig.system.name`から取得

### 🧩 <span id="authindexeddb_internal">内部構成</span>

🔢 authIndexedDB メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ❌ | string | — | メンバの識別子 | =メールアドレス | 
| memberName | ❌ | string | — | メンバ(ユーザ)の氏名 | 例："田中　太郎"。加入要求確認時に管理者が申請者を識別する他で使用。 | 
| deviceId | ⭕ | string | UUID | デバイスの識別子 |  | 
| keyGeneratedDateTime | ⭕ | number | Date.now() | 鍵ペア生成日時 | サーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く | 
| SPkey | ❌ | string | — | サーバ公開鍵 | Base64 | 
| expireCPkey | ❌ | number | — | CPkeyの有効期限(無効になる日時) | 未ログイン時は0 | 


🧱 <span id="authindexeddb_method">authIndexedDB メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authindexeddb_constructor) | private | メイン処理(コンストラクタ相当) |
| [get](#authindexeddb_get) | private | IndexedDBの値を取得 |
| [set](#authindexeddb_set) | private | IndexedDBの値を更新(生成) |
| [reset](#authindexeddb_reset) | private | IndexedDBの値を更新(生成) |

## <span id="authindexeddb_constructor">🧱 <a href="#authindexeddb_method">authIndexedDB.constructor()</a></span>

メイン処理(コンストラクタ相当)

### <span id="authindexeddb_constructor_caller">📞 呼出元</span>

- [authClient.constructor()](authClient.md#authindexeddb_constructor)

### <span id="authindexeddb_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | 設定情報 | 

### <span id="authindexeddb_constructor_returns">📤 戻り値</span>

- [authIndexedDB](authIndexedDB.md#internal): クライアントのIndexedDB
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | [必須] | — |
  | memberName | string | [必須] | — |
  | deviceId | string | UUID | — |
  | keyGeneratedDateTime | number | Date.now() | — |
  | SPkey | string | [必須] | — |
  | expireCPkey | number | [必須] | — |

### <span id="authindexeddb_constructor_process">🧾 処理手順</span>

- IndexedDBに[authClientConfig](authClientConfig.md#authclientconfig_internal).systemNameを持つキーがあれば取得、メンバ変数に格納。
- 無ければ新規に生成し、IndexedDBに格納。
- SPkey未設定の場合、authServerにauthRequestを要求、SPkeyをセット
  - 

- authClientConfig.auditLogシートが無ければ作成
- 引数の内、authIndexedDBと同一メンバ名があればthisに設定
- 引数にnoteがあればthis.noteに設定
- timestampに現在日時を設定

## <span id="authindexeddb_get">🧱 <a href="#authindexeddb_method">authIndexedDB.get()</a></span>

IndexedDBの値を取得

### <span id="authindexeddb_get_param">📥 引数</span>


- 無し(void)

### <span id="authindexeddb_get_returns">📤 戻り値</span>

- [authIndexedDB](authIndexedDB.md#internal): クライアントのIndexedDB
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | [必須] | — |
  | memberName | string | [必須] | — |
  | deviceId | string | UUID | — |
  | keyGeneratedDateTime | number | Date.now() | — |
  | SPkey | string | [必須] | — |
  | expireCPkey | number | [必須] | — |

### <span id="authindexeddb_get_process">🧾 処理手順</span>

- 【要修正】authAuditLogに関する記述？？？
- 引数がObjectの場合：func,result,noteがあればthisに上書き
- 引数がstringの場合：this.funcにargをセット
- this.duration = Date.now() - this.timestamp
- timestampはISO8601拡張形式の文字列に変更
- シートの末尾行にauthAuditLogオブジェクトを追加
- メール通知：stackTraceは削除した上でauthConfig.adminMail宛にメール通知

## <span id="authindexeddb_set">🧱 <a href="#authindexeddb_method">authIndexedDB.set()</a></span>

IndexedDBの値を更新(生成)

### <span id="authindexeddb_set_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | [authIndexedDB](authIndexedDB.md#authindexeddb_internal) | {} | 更新(生成)値(更新対象メンバのみで可) | 

### <span id="authindexeddb_set_returns">📤 戻り値</span>

- [authIndexedDB](authIndexedDB.md#internal): クライアントのIndexedDB
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | [必須] | — |
  | memberName | string | [必須] | — |
  | deviceId | string | UUID | — |
  | keyGeneratedDateTime | number | Date.now() | — |
  | SPkey | string | [必須] | — |
  | expireCPkey | number | [必須] | — |

### <span id="authindexeddb_set_process">🧾 処理手順</span>



## <span id="authindexeddb_reset">🧱 <a href="#authindexeddb_method">authIndexedDB.reset()</a></span>

IndexedDBの値を更新(生成)

### <span id="authindexeddb_reset_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | [authIndexedDB](authIndexedDB.md#authindexeddb_internal) | {} | 更新(生成)値(更新対象メンバのみで可) | 

### <span id="authindexeddb_reset_returns">📤 戻り値</span>

- [authIndexedDB](authIndexedDB.md#internal): クライアントのIndexedDB
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | [必須] | — |
  | memberName | string | [必須] | — |
  | deviceId | string | UUID | — |
  | keyGeneratedDateTime | number | Date.now() | — |
  | SPkey | string | [必須] | — |
  | expireCPkey | number | [必須] | — |

### <span id="authindexeddb_reset_process">🧾 処理手順</span>

- 【要修正】authAuditLogに関する記述？？？
- authClientConfig.auditLogシートが無ければ作成
- 引数の内、authAuditLogと同一メンバ名があればthisに設定