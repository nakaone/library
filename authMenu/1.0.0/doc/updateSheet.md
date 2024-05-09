# シート更新

## シートの更新(CRUD)を伴う処理の定義方法

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant browser
  participant client as authMenu
  participant server as authServer<br>main function
  participant method as authServer<br>internal function
  participant sheet

  client ->> server : userId,{func,arg}(SP/CS)
  activate server
  sheet ->> server : ユーザ情報(全件)
  server ->> server : 処理分岐①
  alt 実行権限なし
    server ->> client : エラー通知
    client ->> browser : エラーメッセージ
  end

  server ->>+ method : 指定関数にargを渡す
  Note right of method : updateApplication(), etc
  method ->>- server : 指定関数実行結果
  server ->> client : 指定関数実行結果
  client ->> client : 結果表示画面の生成
  client ->> browser : 結果表示画面


  deactivate server

```

- ①処理分岐：以下の全てを満たす場合、funcにarg(Object)を渡す
  1. 引数(arg)を復号、署名検証を行う
  1. userIdから当該ユーザの権限(auth)を特定、指定処理(func)の実行権限があるか確認
- updateApplication等に必要となる実行可能権限は、`setProperties()`で'allow'として予め埋め込んでおく。