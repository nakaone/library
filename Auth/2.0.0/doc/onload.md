# onload時処理

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> server : 表示要求(URL)
  activate server
  Note right of server : doGet()
  rect rgba(0, 255, 255, 0.1)
    server ->> client : HTML(object)+ID
    activate client
    deactivate server
    Note right of client : authClient.constructor()
    client ->> client : インスタンス生成、IDをブラウザに保存
    Note right of client : BurgerMenu.constructor()
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)は、[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. BurgerMenu.constructor()
     1. AuthインスタンスをBurgerMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)
