# 新規登録

- 新規登録では、[サーバ側のプロパティサービス](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)にIDとメアドのみ作成する。申込者名等、登録内容についてはユーザ情報の参照・編集画面を呼び出し、修正・加筆を行う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant storage
  participant client as authMenu
  participant server as authServer
  participant sheet

  user ->> client : 新規登録要求
  activate client
  Note right of client : registMail()
  alt SPkey不在
    client ->> user : ダイアログ
    user ->> client : e-mail
    client ->> server : e-mail,CPkey,updated

    sheet ->> server : ユーザ情報
    server ->> server : ①登録状況確認
    alt 登録済
      server ->> sheet : CPkey,updated
    else 未登録
      server ->> server : 新規ユーザIDを採番
      server ->> sheet : 新規ユーザとして追加
    end
    server ->> client : ユーザ情報
    client ->> client : ②クライアント側更新
  end
  client ->> user : ユーザ情報編集画面
  deactivate client
```

- ①登録状況確認
- ②クライアント側更新
  - storeUserInfo()でインスタンス変数,sessionStorageの情報を更新
  - 返されたユーザ権限に基づきメニュー再描画

<!--
  user ->> browser : メアド
  activate browser
  Note right of browser : enterIdentifyKey()
  storage ->> browser : ユーザID
  alt ユーザID保存済
    browser ->> user : ユーザIDを表示して終了
  end
  browser ->> client : メアド
  activate client
  Note right of client : registMail()
  client ->> client : (不存在なら)鍵ペア生成
  client ->> server : メアド＋CPkey＋作成日時
  activate server
  Note right of server : authServer.registMail()
  alt メアドが未登録
    server ->> server : ユーザIDを新規採番
    server ->> sheet : ユーザ情報(※1)
  else メアドが登録済
    server ->> sheet : CPkey＋作成日時
  end
  server ->> client : ユーザ情報(※2)
  deactivate server

  client ->> client : ユーザ情報更新(インスタンス変数)
  client ->> storage : ユーザ情報更新
  client ->> browser : ユーザ情報(※2)
  deactivate client
  browser ->> browser : メニュー再描画
  alt 既存メアド
    browser ->> browser : ホーム画面に遷移
  else 新規登録
    browser ->> browser : 新規登録画面に遷移
  end
  browser ->> user : 遷移先画面
  deactivate browser


- CPkeyは有効期限にかかわらず送付され、server側で更新する<br>
  - 同一userIdで異なる機器からログインする場合を想定
  - 将来的に有効期間を設定した場合、強制更新ならその検証も省略可能
- ※1(シート保存),※2(SV->CL)の「ユーザ情報」オブジェクトのメンバは以下の通り。
  | 名称 | 属性 | 内容 | loc | ses | mem | I/O | sht |
  | :-- | :-- | :-- | :--: | :--: | :--: | :--: | :--: |
  | userId | number | (新規採番された)ユーザID | ◎ | ◎ | ◎ | ◎ | ◎ |
  | created | string | ユーザID新規登録時刻(日時文字列) | × | × | × | × | ◎ |
  | email | string | ユーザの連絡先メールアドレス | × | ◎ | ◎ | × | ◎ |
  | auth | number | ユーザの権限 | × | ◎ | ◎ | ◎ | ◎ |
  | passPhrase | string | クライアント側鍵ペア生成のパスフレーズ | × | ◎ | × | × | × |
  | CSkey | object | クライアント側の秘密鍵 | × | × | ◎ | × | × |
  | CPkey | string | クライアント側の公開鍵 | × | ◎ | ◎ | × | ◎ |
  | updated | string | クライアント側公開鍵生成時刻(日時文字列) | × | ◎ | ◎ | × | ◎ |
  | SPkey | string | サーバ側の公開鍵 | × | ◎ | ◎ | ◎ | × |
  | isExist | boolean | 新規登録対象メアドが登録済ならtrue | × | × | × | ◎ | × |
  | trial | object | ログイン試行関係情報 | × | × | × | ▲ | ◎ |
- trialは以下のメンバを持つObject
  | 名称 | 属性 | 内容 | I/O |
  | :-- | :-- | :-- | :-- |
  | startAt | number | 試行開始日時(UNIX時刻) | × |
  | passcode | number | パスコード(原則数値6桁) | × |
  | log | object[] | 試行の記録。unshiftで先頭を最新にする | × |
  | <span style="margin-left:1rem">timestamp</span> | number | 試行日時(UNIX時刻) | × |
  | <span style="margin-left:1rem">entered</span> | number | 入力されたパスコード | × |
  | <span style="margin-left:1rem">result</span> | boolean | パスコードと入力値の比較結果(true:OK) | × |
  | <span style="margin-left:1rem">status</span> | string | NGの場合の理由。'OK':試行OK | × |
  | endAt | number | 試行終了日時(UNIX時刻) | × |
  | result | boolean | 試行の結果(true:OK) | ◎ |
  | unfreeze | number | ログイン連続失敗後、凍結解除される日時(UNIX時刻) | ◎ |
  - loc : localStorage
  - ses : sessionStorage
  - mem : authMenuインスタンス変数(メンバ)
  - I/O : authServer -> authMenuへ送られるオブジェクト
  - sht : シート
- 参加者が改めて参加要項からメールアドレスを入力するのは「自分のuserIdを失念した」場合を想定
- 応募締切等、新規要求ができる期間の制限は、client側でも行う(authMenuの有効期間設定を想定)
- メアドは形式チェックのみ行い、到達確認および別ソースとの突合は行わない(ex.在校生メアド一覧との突合)
- IDはstoreUserInfo関数を使用してlocal/sessionStorageでの保存を想定(∵タブを閉じても保存したい。個人情報とは言えず、特に問題ないと判断)
- 「検索結果=既存」の場合、ユーザ情報編集画面の表示も検討したが、なりすましでもe-mail入力で個人情報が表示されることになるので不適切と判断。
- 申込時に自分限定の申込情報操作のためログインすることになるので、メール到達確認はそこで行う

-->