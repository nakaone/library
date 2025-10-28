<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [cryptoClient](cryptoClient.md) | [cryptoServer](cryptoServer.md) | [Member](Member.md) | [データ型](typedef.md) | [内発処理](internalProcessing.md)

</div>

# authClient 内発処理

## SPkey要求

クライアント側にSPkeyが無い場合、authIndexedDBインスタンス生成時に取得

```mermaid
sequenceDiagram
  autonumber
  %%actor user
  %%participant localFunc
  %%participant clientMail
  participant cryptoClient
  participant IndexedDB
  participant authClient
  participant authServer
  %%participant Member
  participant cryptoServer
  %%participant serverFunc
  %%actor admin

  IndexedDB->>+authClient: インスタンス生成(authIndexedDB)
  authClient->>authClient: authIndexedDBを共通変数に格納

  alt SPkey未取得
    authClient->>+authServer: SPkey要求(CPkey文字列)
    authServer->>+cryptoServer: SPkey暗号化(authResponse)
    cryptoServer->>-authServer: encryptedResponse
    authServer->>authServer: 監査ログ出力
    authServer->>-authClient: encryptedResponse
    authClient->>+cryptoClient: encryptedResponse
    cryptoClient->>-authClient: decryptedResponse
    authClient->>+IndexedDB: SPkey
    IndexedDB->>IndexedDB: IndexedDBに格納
    IndexedDB->>-authClient: authIndexedDB
    authClient->>-authClient: 共通変数のSPkeyを更新
  end
```

- エラー発生時はauthServerからauthClientへの返信は行わない

### ⑤authResponse設定値

| No | 項目名 | 設定値 |
| --: | :-- | :-- |
| 1 | timestamp | サーバ側処理時刻 |
| 2 | result | normal |
| 3 | message | — |
| 4 | request | — |
| 5 | response | SPkey |

## 新規登録要求

処理要求可能なメンバとして申請、管理者に承認されたらmemberListに新規登録

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant Member
  participant cryptoServer
  %%participant serverFunc
  %%actor admin

  localFunc->>authClient: 処理要求
  authClient->>cryptoClient: 暗号化要求(LocalRequest)
  cryptoClient->>authClient: encryptedRequest

  authClient->>authServer: encryptedRequest
  authServer->>cryptoServer: encryptedRequest
  cryptoServer->>authServer: decryptedRequest

  authServer->>Member: Member.getMember(authRequest.memberId)
  Member->>authServer: メンバの状態(authResponse.response === Member)
  alt 未加入(Member.status === '未加入')

    authServer->>cryptoServer:
  end

```

## CPkey更新

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant Member
  participant cryptoServer
  %%participant serverFunc
  %%actor admin


```

## パスコード入力

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant Member
  participant cryptoServer
  %%participant serverFunc
  %%actor admin


```

## パスコード再発行

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant Member
  participant cryptoServer
  %%participant serverFunc
  %%actor admin


```
