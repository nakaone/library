<!--【onload時処理】-->

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant sheet
  actor admin

  user ->> server : 表示要求(URL)
  alt URLクエリにIDが存在
    server ->> client : document.cookie=ID
  end
  client ->> client : インスタンス生成
  alt IDが存在
    client ->> user : メンバ用サイト
  else
    client ->> user : 一般公開サイト
  end
```

1. インスタンス生成
   1. BurgerMenuインスタンス生成
      1. AuthインスタンスをBurgerMenuのインスタンスメンバとして生成(以下Burger.auth)
      1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)
   1. Authインスタンス生成
      1. cookieにIDがあるか確認
         - cookieにIDが保存されていたらインスタンスのメンバ(以下Auth.ID)として保存
         - 保存されていなければ`Auth.ID=未定(null)`

- この段階では「IDが特定されているかどうか」のみ判定