# authClient 関数 仕様書

## 🧭 概要

authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
サーバ側処理を経てローカル側に戻された結果を復号・検証し、
処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。

## ■ 設計方針

- クロージャ関数とする

## 🧩 内部構成(クラス変数)

### authIndexedDB

<!--::$tmp/authIndexedDB.md::-->

## 🧱 メイン処理

### 概要

- classのconstructor()に相当
- 引数はauthClient内共有用の変数`pv`に保存
- `cryptoClient.constructor()`で鍵ペアの準備
- IndexedDBからメールアドレスを取得、存在しなければダイアログから入力
- IndexedDBからメンバの氏名を取得、存在しなければダイアログから入力
- deviceId未採番なら採番(UUID)
- SPkey未取得ならサーバ側に要求
- 更新した内容はIndexedDBに書き戻す
- SPkey取得がエラーになった場合、SPkey以外は書き戻す
- サーバ側から一定時間レスポンスが無い場合、`{result:'fatal',message:'No response'}`を返して終了

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
    IndexedDB->>+authClient: 既存設定値の読み込み、メンバ変数に保存
    Note right of authClient: メイン処理
    alt (クライアント側鍵ペア未作成or前回作成から1日以上経過)and前回作成から30分以上経過
      authClient->>authClient: 鍵ペア生成、生成日時設定
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

### 📤 入力項目

#### `authClientConfig`

<!--::$tmp/authClientConfig.md::-->

#### 参考：`authConfig`

<!--::$tmp/authConfig.md::-->

### 📥 出力項目

- 利用可能なメソッドのオブジェクト

## 🧱 exec()メソッド

### 概要

ローカル関数からの要求を受けてauthServerに問合せを行い、返信された処理結果に基づき適宜メソッドを呼び出す

- cryptoClient.encryptを呼び出し、`encryptedRequest`を作成
- authServerへの問合せを終了するまで繰り返し
  - 待機時間内にレスポンスあり
    - レスポンスの復号、署名検証
    - 問合せ結果による分岐
  - 待機時間内にレスポンスなし
    - LocalRequestに`{result:'fatal',message:'No response'}`をセット、呼出元ローカル関数に返して終了

### 問合せ結果による分岐

問合せ結果はメンバの状態により内容が異なる。

<!--::$doc/stateTransition.md::-->

### 📤 入力項目

#### `LocalRequest`

<!--::$tmp/LocalRequest.md::-->

### 📥 出力項目

#### `LocalResponse`

<!--::$tmp/LocalResponse.md::-->

#### 参考：`authResponse`

<!--::$tmp/authResponse.md::-->

## ⏰ メンテナンス処理

## 🔐 セキュリティ仕様

## 🧾 エラーハンドリング仕様
