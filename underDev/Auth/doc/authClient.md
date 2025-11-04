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

### 🧩 <span id="authclient_internal">内部構成</span>

🔢 authClient メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| cf | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | 動作設定変数(config) |  | 
| crypto | ❌ | [cryptoClient](cryptoClient.md#cryptoclient_internal) | — | 暗号化・復号用インスタンス |  | 
| idb | ❌ | [authIndexedDB](authIndexedDB.md#authindexeddb_internal) | — | IndexedDB共有用 | IndexedDBの内容をauthClient内で共有 | 


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
| config | ❌ | [authClientConfig](authClientConfig.md#authclientconfig_internal) | — | authClientの動作設定変数 | 

### <span id="authclient_constructor_returns">📤 戻り値</span>

- [authClient](authClient.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | cf | authClientConfig | [必須] | — |
  | crypto | cryptoClient | [必須] | — |
  | idb | authIndexedDB | [必須] | — |

### <span id="authclient_constructor_process">🧾 処理手順</span>

- 本クラスのメンバとして存在する引数のメンバはauthClient内共有用の変数"cf"に保存(存在しない引数のメンバは廃棄)
- "crypto"に[cryptoClient](cryptoClient.md#cryptoclient_constructor)を生成、鍵ペアを準備
- "idb"に[authIndexedDB](authIndexedDB.md#authindexeddb_constructor)を生成、IndexedDBの内容を取得
- idb.deviceId未採番なら採番(UUID)
- idb.SPkey未取得ならサーバ側に要求
- 更新した内容はIndexedDBに書き戻す
- SPkey取得がエラーになった場合、SPkey以外は書き戻す
- IndexedDBの内容はauthClient内共有用変数"pv"に保存
- サーバ側から一定時間レスポンスが無い場合、{result:'fatal',message:'No response'}を返して終了

```mermaid
sequenceDiagram

  actor user
  participant localFunc
  %%participant clientMail
  %%participant cryptoClient
  participant IndexedDB
  participant authClient
  participant authServer
  %%participant memberList
  %%participant cryptoServer
  %%participant serverFunc
  %%actor admin

  %% IndexedDB格納項目のメンバ変数化 ----------
  alt IndexedDBのメンバ変数化が未了
    IndexedDB->>+authClient: 既存設定値の読み込み(authIndexedDB)
    authClient->>authClient: メンバ変数に保存、鍵ペア未生成なら再生成
    alt 鍵ペア未生成
      authClient->>IndexedDB: authIndexedDB
    end
    alt メールアドレス(memberId)未設定
      authClient->>user: ダイアログ表示
      user->>authClient: メールアドレス
    end
    alt メンバの氏名(memberName)未設定
      authClient->>user: ダイアログ表示
      user->>authClient: メンバ氏名
    end
    alt SPkey未入手
      authClient->>+authServer: CPkey(平文の文字列)

      %% 以下2行はauthServer.responseSPkey()の処理内容
      authServer->>authServer: 公開鍵か形式チェック、SPkeyをCPkeyで暗号化
      authServer->>authClient: encryptedResponse(CPkeyで暗号化されたSPkey)

      alt 待機時間内にauthServerから返信有り
        authClient->>authClient: encryptedResponseをCSkeyで復号、メンバ変数に平文で保存
      else 待機時間内にauthServerから返信無し
        authClient->>localFunc: エラーオブジェクトを返して終了
      end
    end
    authClient->>-IndexedDB: メンバ変数を元に書き換え
  end
```

## <span id="authclient_checkcpkey">🧱 <a href="#authclient_method">authClient.checkCPkey()</a></span>

CPkey残有効期間をチェック

### <span id="authclient_checkcpkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_checkcpkey_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authclient_checkcpkey_process">🧾 処理手順</span>



## <span id="authclient_enterpasscode">🧱 <a href="#authclient_method">authClient.enterPasscode()</a></span>

パスコード入力ダイアログを表示

### <span id="authclient_enterpasscode_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_enterpasscode_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authclient_enterpasscode_process">🧾 処理手順</span>



## <span id="authclient_exec">🧱 <a href="#authclient_method">authClient.exec()</a></span>

ローカル関数からの要求受付

ローカル関数からの要求を受けてauthServerに問合せを行う

### <span id="authclient_exec_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_exec_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authclient_exec_process">🧾 処理手順</span>



## <span id="authclient_setupenvironment">🧱 <a href="#authclient_method">authClient.setupEnvironment()</a></span>

SPkey入手等、authClient動作環境整備

### <span id="authclient_setupenvironment_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_setupenvironment_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authclient_setupenvironment_process">🧾 処理手順</span>



## <span id="authclient_showmessage">🧱 <a href="#authclient_method">authClient.showMessage()</a></span>

メッセージをダイアログで表示

### <span id="authclient_showmessage_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclient_showmessage_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): クライアント側auth中核クラス
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | result | string | normal | — |
  | message | string | [任意] | — |
  | request | authRequest | [任意] | — |
  | response | any | [任意] | — |

### <span id="authclient_showmessage_process">🧾 処理手順</span>

