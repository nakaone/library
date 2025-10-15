# authServer 関数 仕様書

## 概要

authServerは、クライアント（authClient）からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

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
  participant serverFunc
  %%actor admin



  authClient->>localFunc: authClientインスタンス生成
  Note over authClient,authServer: ■■ 要求前準備 ■■
  localFunc->>+authClient: 処理要求(LocalRequest)
  authClient->>cryptoClient: 署名・暗号化要求(LocalRequest)
  cryptoClient->>authClient: encryptedRequest
  Note right of authClient: メイン処理

  loop リトライ試行
    authClient->>+authServer: 処理要求(encryptedRequest)
    Note right of authServer: メイン処理
    authServer->>cryptoServer:復号要求(encryptedRequest)
    cryptoServer->>authServer: decryptedRequest
    alt 復号成功(decryptedRequest.result === "success")
      authServer->>authServer: 状態確認(Member.getStatus(memberId[deviceId]))
      alt 応答タイムアウト内にレスポンス無し
        authClient->>authClient: 処理結果=「システムエラー」
        authClient->>authClient: リトライ(loop)停止
      else 応答タイムアウト内にレスポンスあり
        alt result="warning"
          authServer->>authClient: 処理結果=authResponse(result="warning")
          authClient->>authClient: inCaseOfWarning()を呼び出し
        else result="normal"
          authServer->>-authClient: 処理結果=authResponse.response
          authClient->>authClient: リトライ(loop)停止
        end
      end
    else 復号失敗(decryptResult.result === "success")
      authServer->>authClient: responseSPkeyを実行、クライアント側にSPkeyを提供
    end
  end
  authClient->>-localFunc: 処理結果
```


## メイン処理

■ 入力 : encryptedRequest

<!--::$tmp/encryptedRequest.md::-->

■ 出力 : encryptedResponse

<!--::$tmp/encryptedResponse.md::-->

■ ScriptProperties

<!--::$tmp/authScriptProperties.md::-->

■ `memberList`シート

<!--::$tmp/Member.md::-->

## responseSPkey(arg)
- クライアントから送られた文字列がCPkeyと推定される場合に、SPkeyを暗号化して返却。

## セキュリティ制約

## エラーハンドリング
