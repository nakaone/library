# class Auth README

## TOC

1. [開発の目的](Auth.purpose.md)(現状/課題/解決案/メリット、デメリットと対策)
1. [管理局の構成](Auth.master.md)
1. [認証局の構成](Auth.gateway.md)
1. [配信局の構成](Auth.front.md)
1. [署名・暗号化処理](Auth.cryptico.md)

## 処理の流れ

```mermaid
sequenceDiagram
  autonumber
  actor mailer as メーラ
  actor browser as ブラウザ
  participant gateway as 認証局
  participant front as 配信局
  participant master as 管理局
  participant httpd as httpd

  %% 受付番号入力
  mailer ->> httpd : 事前に送信された案内メールのリンクをクリック
  httpd ->> browser : ページファイル(index.html)
  activate browser
  Note right of browser: Auth.constructor()
  Note right of browser: Auth.getEntryNo()

  browser ->> gateway : 受付番号、CPkey(平文)
  activate gateway
  Note right of gateway : auth1A()

  gateway ->> master : 受付番号、CPkey(GS/MP)
  activate master
  Note right of master : auth1B()
  master ->> front : メールアドレス、パスコード(MS/FP)
  activate front
  Note right of front : sendMail()
  front ->> mailer : パスコード
  deactivate front

  master ->> gateway : 申請登録結果(MS/GP)
  deactivate master

  gateway ->> browser : 申請登録結果、GP(平文)
  deactivate gateway
  Note right of browser : Auth.getPassCode()

  %% パスコード入力
  mailer ->> browser : パスコード入力
  browser ->> gateway : 受付番号、パスコード(CS/GP)
  activate gateway
  Note right of gateway : auth2A
  gateway ->> master : 受付番号、パスコード(GS/MP)
  activate master
  Note right of master : auth2B
  master ->> gateway : config、利用者情報(MS/GP)
  deactivate master
  gateway ->> browser : config、利用者情報、FP(MS/GP)
  deactivate gateway
  browser ->> front : 掲示板情報要求(CS/FP)
  activate front
  Note right of front : messageBoard()
  front ->> browser : 掲示板情報(FS/CP)
  deactivate front
  browser ->> browser : 初期画面表示
  deactivate browser

```

- 文中の記号は以下の通り
  - CP:利用者公開鍵(Client Public key)、CS:利用者秘密鍵(Client Secret key)
  - GP:認証局公開鍵(Gateway Public key)、GS:認証局秘密鍵(Gateway Secret key)
  - FP:配信局公開鍵(Front Public key)、FS:配信局秘密鍵(Front Secret key)
  - MP:管理局公開鍵(Master Public key)、MS:管理局秘密鍵(Master Secret key)
  - (xS/yP) = XX局秘密鍵で署名、YY局公開鍵で暗号化した、XX->YY宛の通信<br>
    例：(GS/MP) ⇒ GS(認証局秘密鍵)で署名、MP(管理局公開鍵)で暗号化
- (02) Auth.constructor() : DOMContentLoaded時、以下の処理を実行
  1. 利用者の秘密鍵(以下CSkey)・公開鍵(以下CPkey)を生成
  1. Auth.getEntryNo()を呼び出し
- (02) Auth.getEntryNo() : 受付番号入力
  1. 受付番号入力画面を表示(z-indexを最大にして他の画面を触らせない)
  1. 入力後待機画面表示、レスポンスがあったらAuth.getPassCode()を呼び出し
- (03) auth1A() : 認証申請の受付
  1. 受付番号とCPをauth1Bに送信
  1. auth1Bの申請結果を受けたらブラウザに結果を送信<br>
     申請OKの場合はGPも併せて送信
- (04) auth1B() : 認証申請の登録
  1. 受付番号とCPをシートに書き込み
  1. 正当性を検証
     - パスコードが一致
     - パスコード発行日時から1時間以内
     - 3回連続失敗後1時間以上経過
  1. 正当だった場合はパスコードを生成、シートに書き込み
  1. 配信局経由で申請者にパスコードを通知(05)
  1. 申請登録の結果をauth1Aに返す
- (08) Auth.getPassCode() : パスコード入力
  1. パスコード入力画面を表示
  1. パスコードが入力されたらauth2Aに送信
  1. auth2Aからレスポンスがあったらthisに保存、初期画面を表示
- (10) auth2A
  1. 受付番号・パスコードを管理局に送信
  1. configと利用者情報をauth2Bから受けたらFPを追加して利用者に返す
- (11) auth2B
  1. 送信された受付番号・パスコードが有効か、シートの申請登録と突合
  1. OKならconfigと利用者情報をauth2Aに返す



### 旧版

```mermaid
sequenceDiagram
  autonumber
  actor client as 参加者(client)
  participant gateway as 認証局(gateway)
  participant front as 配信局(front)
  participant main as メイン

  client ->> gateway : 事前に送信された案内メールのリンクをクリック
  gateway ->> client : 状態確認スクリプト、GPkey
  alt トークンが存在
    client ->> gateway : 存在報告(CSkey署名・GPkey暗号化)
    client ->> front : 初期画面配信要求(CSkey署名・FPkey暗号化)
    front ->> client : 初期画面
  else トークンが不在
    client ->> client : 鍵ペア生成
    client ->> gateway : 不在報告。受付番号、CPkey(GPkey暗号化)
    gateway ->> main : 受付番号,CPkey(GSkey署名・MPkey暗号化)
    main ->> main : CPkey,パスコード登録
    main ->> client : パスコード(メール)
    client ->> gateway : 受付番号、パスコード(CSkey署名・GPkey暗号化)
    gateway ->> main : 受付番号、パスコード(GSkey署名・MPkey暗号化)
    main ->> main : 正当性検証
    main ->> gateway : 検証結果、FPkey,FURL
    gateway ->> client : FPkey,FURL
    client ->> front : 初期画面配信要求(CSkey署名・FPkey暗号化)
  end
```

- clientを含め、公開鍵はsafeで保存。上図では煩雑になるためsafeとのやりとりは省略
- ⑬正当性検証の項目は以下の通り
  - パスコードが一致
  - パスコード発行日時は一時間以内
  - 3回連続失敗後1時間以上経過