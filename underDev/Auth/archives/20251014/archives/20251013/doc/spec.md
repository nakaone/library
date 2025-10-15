# 総説

ブラウザ(クライアント)とGAS(サーバ)の間で認証された通信を行う。

## 要求仕様

- 本システムは限られた人数のサークルや小学校のイベント等での利用を想定する。<br>
  よってセキュリティ上の脅威は極力排除するが、恒久性・安全性より導入時の容易さ・技術的ハードルの低さ、運用の簡便性を重視する。
- サーバ側(以下authServer)はスプレッドシートのコンテナバインドスクリプト、クライアント側(以下authClient)はHTMLのJavaScript
- サーバ側・クライアント側とも鍵ペアを使用
- 原則として通信は受信側公開鍵で暗号化＋発信側秘密鍵で署名
- クライアントの識別(ID)はメールアドレスで行う

## 用語

- SPkey, SSkey：サーバ側の公開鍵(Server side Public key)と秘密鍵(Server side Secret key)
- CPkey, CSkey：クライアント側の公開鍵(Client side Public key)と秘密鍵(Client side Secret key)
- パスフレーズ：クライアント側鍵ペア作成時のキー文字列。JavaScriptで自動的に生成
- パスワード：運用時、クライアント(人間)がブラウザ上で入力する本人確認用の文字列
- パスコード：二段階認証実行時、サーバからクライアントに送られる6桁※の数字<br>
  ※既定値。実際の桁数はauthConfig.trial.passcodeLengthで規定

## 暗号化・署名方式、運用

- 署名方式 : RSA-PSS
- 暗号化方式 : RSA-OAEP
- ハッシュ関数 : SHA-256以上
- 許容時差±120秒※以内
  ※既定値。実際の桁数はauthConfig.decryptRequest.allowableTimeDifferenceで規定
- 順序は「暗号化->署名」ではなく「署名->暗号化」で行う
  1. クライアントがデータをJSON化
  2. 自身の秘密鍵で署名（署名→暗号化）
  3. サーバの公開鍵で暗号化
  4. サーバは復号後、クライアント公開鍵(memberList.CPkey)で署名を検証
- パスワードの生成は「ライブラリ > createPassword」を使用
- パスコードのメール送信は「ライブラリ > sendMail」を使用
- CPkeyの有効期限が切れた場合、以下の手順で更新する
  1. クライアント側から古いCPkeyで署名された要求を受信
  2. サーバ側で署名検証の結果、期限切れを確認
    - memberList.trial[0].CPkeyUpdateUntilに「現在日時＋authConfig.decryptRequest.loginLifeTime」をセット
    - クライアント側に通知
  3. クライアント側でCPkeyを更新、新CPkeyで再度リクエスト
  4. サーバ側でauthConfig.decryptRequest.loginLifeTimeを確認、期限内ならmemberList.CPkeyを書き換え。期限切れなら加入処理同様、adminによる個別承認を必要とする。
  5. 以降は未ログイン状態で要求が来た場合として処理を継続

# 処理手順

## 概要

- 「■■　〜　■■」は別項で詳説
- authClient, authServer 横の「xxx()」ラベルはそれぞれのメソッド名

![処理概要](img/summary.svg)

<details><summary>source</summary>

```mermaid
<!--::$doc/summary.mermaid::-->
```

</details>

## 要求前準備

![処理概要](img/preparation.svg)

<details><summary>source</summary>

```mermaid
<!--::$doc/preparation.mermaid::-->
```

</details>

# データ格納方法と形式

- スプレッドシート以外で日時を文字列として記録する場合はISO8601拡張形式の文字列(`yyyy-MM-ddThh:mm:ss.nnn+09:00`)
- 日時を数値として記録する場合はUNIX時刻(new Date().getTime())
- スプレッドシート(memberList)については[Memberクラス仕様書](Member.md)参照

## authScriptProperties

<!--::$tmp/authScriptProperties.md::-->

## authIndexedDB

<!--::$tmp/authIndexedDB.md::-->

## Member

<!--::$tmp/Member.md::-->

# データ型(typedef)

- クラスとして定義
- 時間・期間の単位はミリ秒

## データの流れと型

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant encryptRequest
  participant IndexedDB
  participant authClient
  participant authServer
  participant memberList
  participant decryptRequest
  participant serverFunc
  %%actor admin

  rect rgba(209, 247, 221, 1)
    Note over authClient, authServer: 環境構築・起動時
    authClient->>authClient: authClientConfig型(ソース埋込)
    IndexedDB->>authClient: authIndexedDB型
    authServer->>authServer: authServerConfig型(ソース埋込)
    ScriptProperties->>authServer: authScriptProperties型
  end

  rect rgba(248, 231, 247, 1)
    Note over authClient, authServer: 処理要求時

    localFunc->>authClient: 任意
    IndexedDB->>authClient: IndexedDB
    authClient->>encryptRequest: ①
    encryptRequest->>authClient: encryptedRequest型
    authClient->>authServer: authRequest型

    authServer->>decryptRequest: authRequest型
    memberList->>authServer: memberList型
    decryptRequest->>authServer: decryptedRequest型
    authServer->>serverFunc: 任意

    authServer->>authClient: authResponse型
    authClient->>localFunc: 任意
  end
```

## authConfig

<!--::$tmp/authConfig.md::-->

## authServerConfig

<!--::$tmp/authServerConfig.md::-->

## authClientConfig

<!--::$tmp/authClientConfig.md::-->

## authRequest

<!--::$tmp/authRequest.md::-->

## decryptedRequest

<!--::$tmp/decryptedRequest.md::-->

## authResponse

<!--::$tmp/authResponse.md::-->

# クラス・関数定義

- [authClient](doc/authClient.md) 関数 仕様書
- [authServer](doc/authServer.md) 関数 仕様書
- [Member](doc/Member.md) クラス 仕様書
- [decryptRequest](doc/decryptRequest.md) 関数 仕様書
- [encryptRequest](doc/encryptRequest.md) 関数 仕様書
