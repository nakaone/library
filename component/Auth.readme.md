# class Auth README

## TOC

1. [開発の目的](Auth.purpose.md)(現状/課題/解決案/メリット、デメリットと対策)
1. [管理局の構成](Auth.master.md)
1. [認証局の構成](Auth.gateway.md)
1. [配信局の構成](Auth.front.md)
1. [署名・暗号化処理](Auth.cryptico.md)

## sequence

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