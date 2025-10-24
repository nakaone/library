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
    authServer->>authServer: 監査ログ出力
    authServer->>+cryptoServer: authResponse
    cryptoServer->>-authServer: encryptedResponse
    authServer->>-authClient: encryptedResponse
    authClient->>+cryptoClient: encryptedResponse
    cryptoClient->>-authClient: decryptedResponse
    authClient->>+IndexedDB: SPkey
    IndexedDB->>IndexedDB: IndexedDBに格納
    IndexedDB->>-authClient: authIndexedDB
    authClient->>-authClient: 共通変数のSPkeyを更新
  end
```

## 新規登録要求

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant memberList
  participant cryptoServer
  %%participant serverFunc
  %%actor admin


```
