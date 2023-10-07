# BulletinBoard: 掲示板機能

```mermaid

sequenceDiagram
  autonumber
  actor 参加者
  actor スタッフ
  participant 認証局

  スタッフ ->> 認証局 : 投稿(CS/GP)
  activate 認証局
  Note right of 認証局 : post()
  認証局 ->> スタッフ : 投稿結果
  deactivate 認証局

  参加者 ->> 認証局 : 受付番号、publicKey(CS/GP)
  activate 認証局
  Note right of 認証局 : delivery()
  認証局 ->> 参加者 : 掲示板情報
  deactivate 認証局

```

