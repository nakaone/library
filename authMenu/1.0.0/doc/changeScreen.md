# 画面切替

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant browser
  participant client as authMenu
  participant server as authServer
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

    client ->> server : userId,e-mail,CPkey,updated,allow
    activate server
    Note right of server : checkAuthority()
    sheet ->> server : ユーザ情報
    server ->> server : ユーザ情報取得(getUserInfo)
    alt 未登録
      server ->> server : 新規ユーザ情報作成
      server ->> sheet : 新規ユーザ情報
    end
    server ->> server : 権限有無判断
    alt 権限なし or 凍結中
      server ->> client : エラー
      client ->> client : ユーザ情報(auth)更新※1
      client ->> browser : 「権限がありません」「凍結中」
    else 権限あり
      server ->> server : ①ログイン要否判断
      alt ログイン不要
        server ->> client : OK
        client ->> browser : 要求画面表示
      else 要ログイン
        server ->> server : パスコード生成
        server ->> sheet : trial更新(パスコード)
        server ->> user : パスコード連絡メール
        server ->> client : 試行可能回数
        deactivate server

        alt 試行可能回数 = 0
          client ->> browser : 「現在凍結中」
        else 試行可能回数 > 0
          client ->> client : 鍵ペア再生成
          client ->> user : ダイアログ
          user ->> client : パスコード
          client ->> server : userId,CPkey,updated,パスコード(SP/CS)
          activate server
          Note right of server : verifyPasscode()
          sheet ->> server : ユーザ情報
          server ->> server : パスコード検証
          server ->> sheet : trial更新(検証結果)
          alt 検証OK(パスコードが一致)
            server ->> client : ユーザ情報
            server ->> sheet : CPkey,updated更新
            client ->> client : ユーザ情報更新
            client ->> browser : 要求画面
          else 検証NG(パスコードが不一致)
            server ->> client : 検証NG通知
            deactivate server
            client ->> client : 試行可能回数--
            client ->> browser : エラーメッセージ
          end
        end
      end
    end
  end
  deactivate client
```

- ※1 : 権限が無いのにサーバまで問合せが来るのは、クライアント側の権限情報が誤っている可能性があるため、念のため更新する。
- ①ログイン要否判断：いかのいずれかの場合、ログインが必要
  - パスコード生成からログインまでの猶予時間を過ぎている
  - クライアント側ログイン(CPkey)有効期限切れ
  - 引数のCPkeyがシート上のCPkeyと不一致


<!--
```mermaid
sequenceDiagram
  autonumber
  actor user
  participant browser
  participant client as authMenu
  participant server as authServer
  participant sheet

  browser ->> client : 画面要求(既定値：ホーム)
  activate client
  Note right of client : changeScreen()
  alt 権限あり(allow&auth>0)
    client ->> browser : 要求画面表示後、終了
  else 権限なし(allow&auth=0)
    alt メアド未定(this.email===null)
      client ->> user : ダイアログ
      user ->> client : e-mail
      client ->> client : ②ユーザ情報更新
    end

    client ->> server : e-mail,CPkey
    activate server
    Note right of server : getUserInfo()
    sheet ->> server : ユーザ情報
    server ->> server : ①ユーザ情報存否確認
    alt 未登録
      server ->> server : ③新規ユーザ情報作成
      server ->> sheet : 新規ユーザ情報
    end
    server ->> client : 存否確認結果＋ユーザ情報
    deactivate server
    client ->> client : ②ユーザ情報更新
    alt 権限なし
      client ->> browser : エラー表示後、終了
    else 権限あり and CP一致 and CP有効
      client ->> browser : 要求画面表示後、終了
    else 権限あり and (CP不一致 or CP無効)

      client ->> client : 鍵ペア再生成
      client ->> server : userId,CPkey,updated
      activate server
      Note right of server : sendPasscode()
      sheet ->> server : ユーザ情報
      server ->> server : ④パスコード生成
      server ->> sheet : ⑤trial,CPkey,updated
      server ->> user : パスコード連絡メール
      server ->> client : SPkey
      deactivate server

      client ->> client : ②ユーザ情報更新(CP,SP)
      client ->> user : ダイアログ
      user ->> client : パスコード

      client ->> server : userId,パスコード(SP/CS)
      activate server
      Note right of server : verifyPasscode()
      sheet ->> server : ユーザ情報
      server ->> server : ⑥パスコード検証
      server ->> sheet : ⑤trial更新(検証結果)
      alt 検証OK
        server ->> client : ユーザ情報
        client ->> client : ②ユーザ情報更新
        client ->> browser : 要求画面
      else 検証NG
        server ->> client : 検証NG通知
        deactivate server
        client ->> browser : エラーメッセージ
      end
    end
    deactivate client
  end
```
-->

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