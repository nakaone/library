# 🧩 authConfigクラス仕様書

authConfig

## 🧾 概説

クライアント・サーバ共通設定情報

## 🔢 メンバ一覧

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | "auth" | システム名 |  |
| adminMail | string | 必須 | 管理者のメールアドレス |  |
| adminName | string | 必須 | 管理者氏名 |  |
| allowableTimeDifference | number | 120000 | クライアント・サーバ間通信時の許容時差既定値は2分 |  |
| RSAbits | string | 2048 | 鍵ペアの鍵長 |  |
| maxDepth | number | 10 | 再帰呼出時の最大階層 |  |
| underDev | Object | 必須 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

## 📥 引数

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | authConfig | 必須 | 設定情報(既定値からの変更部分) |  |