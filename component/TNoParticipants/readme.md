## 処理概要

```mermaid
sequenceDiagram
  autonumber
  actor browser as ブラウザ
  participant gateway as 認証局
  participant master as 管理局

  activate browser
  Note right of browser : TNoParticipants.build()
  browser ->> gateway : 要求(CS/GP)
  activate gateway
  Note right of gateway : getTNoParticipants()
  gateway ->> master : 受付番号、範囲名(GS/MP)
  activate master
  Note right of master : getNamedRangeData()
  master ->> master : シートからデータ取得
  master ->> gateway : 範囲のデータ
  deactivate master
  gateway ->> browser : 範囲のデータ
  deactivate gateway
  deactivate browser
```

- 文中の記号は以下の通り
  - CK:共通鍵(Common Key)
  - CP:利用者公開鍵(Client Public key)、CS:利用者秘密鍵(Client Secret key)
  - GP:認証局公開鍵(Gateway Public key)、GS:認証局秘密鍵(Gateway Secret key)
  - FP:配信局公開鍵(Front Public key)、FS:配信局秘密鍵(Front Secret key)
  - MP:管理局公開鍵(Master Public key)、MS:管理局秘密鍵(Master Secret key)
  - (xS/yP) = XX局秘密鍵で署名、YY局公開鍵で暗号化した、XX->YY宛の通信<br>
    例：(GS/MP) ⇒ GS(認証局秘密鍵)で署名、MP(管理局公開鍵)で暗号化
