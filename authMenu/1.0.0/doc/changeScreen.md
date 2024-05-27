# 新規ユーザ登録、画面切替

「画面切替」はサーバ側に開示範囲(allow)を渡し、シート上のユーザ権限(auth)と比較することで「要求画面を表示する権限が存在するか」を確認し、クライアント側でサーバ側の確認結果に基づき画面切替を行う。

新規ユーザ登録は「応募情報表示・編集画面に切り替える」という画面切替の一般事例に「シート上にユーザ情報が存在しなければ追加」という手順を追加することで、画面切替の特殊事例として扱う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant browser
  participant client as authMenu
  participant server as authServer<br>main function
  participant method as authServer<br>internal function
  participant sheet

  browser ->> client : 画面要求(既定値：ホーム)
  activate client
  Note right of client : changeScreen()
  client ->> client : ユーザ権限、および要求画面の開示範囲(allow)を取得
  alt 権限あり(allow&auth>0)
    client ->> browser : 要求画面表示
  else 権限なし(allow&auth=0)
    alt メアド未定(this.email===null)
      client ->> user : ダイアログ
      user ->> client : e-mail
      client ->> client : ユーザ情報更新(storeUserInfo)
    end
    client ->> server : ①changeScreen.arg
    activate server
    Note right of server : func='changeScreen'
    sheet ->> server : ユーザ情報(全件)
    server ->> server : 処理分岐
    server ->> method : ②getUserInfo.arg
    activate method
    Note right of method : getUserInfo()
    alt 未登録
      method ->> method : 新規ユーザ情報作成
      method ->> sheet : 新規ユーザ情報
    end
    method ->> method : 該当ユーザ情報を変数(w.user)に保存
    method ->> server : ③getUserInfo.rv
    deactivate method

    server ->> server : パスコード要否判断 ※1
    alt ログイン不要
      server ->> server : 権限有無判断(auth&allow)
      alt 権限あり
        server ->> client : ④response='hasAuth'
        client ->> browser : 要求画面
      else 権限なし
        server ->> client : ⑤response='noAuth'
        client ->> client : ユーザ情報更新 ※2
        client ->> browser : 「権限がありません」
      else 凍結中
        server ->> client : ⑥response='freezing'
        client ->> browser : 「アカウント凍結中」
      end
    else 要ログイン
      rect rgba(192, 192, 255, 0.3)
        server ->> method : ⑦sendPasscode.arg
        activate method
        Note right of method : sendPasscode()
        method ->> method : パスコード生成
        method ->> sheet : trial更新(パスコード)
        method ->> user : w.user.email宛パスコード連絡メール送付
        method ->> server : ⑧sendPasscode.rv
        deactivate method

        server ->> client : ⑨response='passcode'
        deactivate server

        client ->> client : 鍵ペア再生成
        client ->> user : ダイアログ
        user ->> client : パスコード

        client ->> server : ⑩verifyPasscode.arg
        activate server
        Note right of server : func='verifyPasscode'
        sheet ->> server : ユーザ情報(全件)
        server ->> server : 処理分岐
        server ->> method : ⑪verifyPasscode.arg
        activate method
        Note right of method : verifyPasscode()
        method ->> method : パスコード検証
        alt 検証OK(パスコード一致)
          method ->> sheet : CPkey,updated,trial更新(検証結果)
          method ->> server : ⑫verifyPasscode.rv
          server ->> client : ⑬response='match'
          client ->> client : ユーザ情報更新、権限有無判断(auth&allow)
          alt 権限あり
            client ->> browser : 要求画面
          else 権限なし
            client ->> client : ユーザ情報更新 ※2
            client ->> browser : 「権限がありません」
          end
        else 検証NG(パスコード不一致)
          method ->> sheet : trial更新(検証結果)
          method ->> server : ⑭verifyPasscode.unmatch
          deactivate method
          server ->> client : ⑮response='unmatch'
          deactivate server
          client ->> client : 試行可能回数を-1
          client ->> browser : エラーメッセージ
        end
      end
    end
  end
  deactivate client
```

- ※1 : パスコード要否判断：いかのいずれかの場合、パスコードが必要
  - 新規ユーザ登録
  - パスコード生成からログインまでの猶予時間を過ぎている
  - クライアント側ログイン(CPkey)有効期限切れ
  - 引数のCPkeyがシート上のCPkeyと不一致
- ※2 : 権限が無いのにサーバまで問合せが来るのは、クライアント側の権限情報が誤っている可能性があるため、念のため更新する。

<iframe width="100%" height="500px" src="changeScreen.html"></iframe>
<!--
原本(Google Spread)
MyDrive > fy2024 > 2024mmdd_camp2024 > camp2024.gsheet > changeScreenシート
https://docs.google.com/spreadsheets/d/1wizrYCTnFbRpi38gJ3ZIdXtC3lV7NfEcQGkuj6-E0Jk/edit#gid=0
-->

<!--
## typedef

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
-->