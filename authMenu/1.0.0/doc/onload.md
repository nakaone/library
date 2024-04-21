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
    Note right of client : authMenu.constructor()
    client ->> client : インスタンス生成
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client

    user ->>+ client : ID入力
    Note right of client : enterUserId()
    client ->> client : storageに保存(storeUserInfo)
    client ->>- user : メンバ用画面
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)については、「[クエリ文字列の受取](#receiving_query_string)」の項を参照。
- 「インスタンス生成」での処理内容
  1. ユーザ情報を取得、不足分は既定値を設定
     - 引数、HTML埋込情報、sessionStorage、localStorageのユーザ情報を取得
     - IDを特定(引数>HTML埋込>session>local。いずれにも無ければnull)
     - IDが特定されるならauthを一般公開->参加者に変更
  1. 親要素を走査してナビゲーションを作成(アイコン、ナビ領域、背景)
- 図中の`enterUserId()`は、`new authMenu()`の引数として渡された関数

<!--
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. authMenu.constructor()
     1. AuthインスタンスをauthMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)

[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。

    user ->> client : ID入力
    activate client
    Note right of client : enterUserId()
    client ->> user : メンバ用サイト
    deactivate client

-->