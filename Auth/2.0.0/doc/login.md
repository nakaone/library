# ログイン要求

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> client : ログイン要求
  activate client
  Note right of client : authClient.login1C()
  client ->> client : 鍵ペア生成、保存
  client ->> server : ID,CPkey(--/--)
  activate server
  Note right of server : authServer.login1S()
  server ->> server : パスコード生成
  server ->> property : ID,パスコード,CPkey
  property ->> server : 該当ID情報
  server ->> server : ログイン可否確認
  server ->> user : パスコード連絡メール
  server ->> client : SPkey(--/CPkey)
  deactivate server
  client ->> client : SPkeyを保存
  client ->> user : パスコード入力ダイアログ
  deactivate client
  user ->> client : パスコード入力
  activate client
  Note right of client : authClient.login2C()
  client ->> server : ID,パスコード(CSkey/SPkey)
  activate server
  Note right of server : authServer.login2S()
  server ->> property : ID
  property ->> server : 該当ID情報
  server ->> server : パスコード検証
  server ->> property : 検証結果記録
  server ->> client : 該当IDの権限(SCkey/CPkey)
  deactivate server
  client ->> client : 権限情報を保存、メニュー再描画
  client ->> user : 被要求画面(ex.受付メニュー)
  deactivate client
```

- IDは保存済の前提
- clientの鍵およびSPkeyはsessionStorageへの保存を想定<br>
  (∵当該session以外からの参照を阻止、かつ永続的な保存は望ましくない)
- 有効期間内の鍵ペアが存在したら、鍵ペア生成はスキップ
- 該当ID情報は[ユーザ情報](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)参照
- ログイン可否確認
  - 前回ログイン失敗(3回連続失敗)から一定以上の時間経過(既定値1時間)
  - パスコード再発行は上述の条件が満たされる限り認める<br>
    例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結
- 「パスコード検証」は復号・署名確認の上、以下の点をチェックする
  - パスコードが一致
  - 試行回数が一定数以下(既定値3回)
  - パスコード生成から一定時間内(既定値15分)
  - ログイン可能な権限
- パスコード入力はダイアログで行う(開発工数低減)