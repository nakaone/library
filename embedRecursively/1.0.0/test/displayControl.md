# SPAにおける表示制御

## 募集内容確認〜申込完了までの流れ

- 記号
  - client : camp2024等のブラウザ上のプログラム
  - Auth : class authClient+authServer
  - Menu : class BurgerMenu
- 領域色
  - ピンク : ID未定(初回)表示時の処理
  - 黄色 : 応募申込開始時の処理。詳細は「[新規登録](overview.md#新規登録)」参照
  - 水色 : メアド登録完了し、申込内容記入用のログイン処理。詳細は「[ログイン要求](overview.md#ログイン要求)」参照
  - 灰色 : ログイン完了後の申込内容記入処理。詳細は「[検索・編集・更新](overview.md#検索・編集・更新)」参照

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant Auth
  participant Menu

  rect rgba(255, 0, 255, 0.2)
    client ->> Auth : URLクエリ文字列
    Auth ->> client : ID(未定なのでnull)
    client ->> Menu : ID,メニュー生成要求
    Menu ->> client : メニュー(アイコン、nav領域)
    user ->> client : 表示要求
    client ->> user : 一般公開用画面
  end

  rect rgba(255, 255, 0, 0.2)
    user ->> client : 新規登録
    client ->> Auth : 新規登録要求
    Note over user,Auth : 新規登録処理
    Auth ->> client : ID
    client ->> client : ID保存
    client ->> user : 完了通知
  end

  rect rgba(0, 255, 255, 0.2)
    user ->> client : ログイン要求
    client ->> Auth : ログイン要求
    Note over user,Auth : ログイン処理
    Auth ->> client : 権限
    client ->> client : 権限保存
    client ->> Menu : メニュー再描画
    client ->> user : メンバ用画面
  end

  rect rgba(0,0,0,0.1)
    user ->> client : 申込情報呼び出し
    client ->> Auth : ID,検索用関数
    Note over user,Auth : 検索・編集・更新処理
    client ->> user : 申込情報編集画面
    user ->> client : 申込情報編集結果
    client ->> Auth : ID,更新用関数
    Note over user,Auth : 検索・編集・更新処理
    client ->> user : 更新結果
  end
```

■作成手順

1. Google Spreadを用意、名簿(list)シートを作成
1. configに名簿シート各項目の定義を記載
1. 実装する機能・ページ毎にclient(index.html)にDIV要素を作成
1. build.shを実行、client,server(server.gs)を生成
1. index.html,server.gsをシートのApps Scriptとしてコピー、デプロイ