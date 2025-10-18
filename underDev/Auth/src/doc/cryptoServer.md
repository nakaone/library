# 🔐 cryptoServer クラス 仕様書

## 🧭 概要

- 認証サーバ (`authServer`) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書（`cryptoClient`）と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- `cryptoServer.encrypt()`形式での使用を想定し、メソッドはstaticとする
- 暗号化ライブラリは `jsrsasign` を使用。

## ■ 設計方針

- 署名→暗号化（Sign-then-Encrypt）方式に準拠  
- 鍵ペアは `ScriptProperties` に保存（`SSkey`, `SPkey`）
- `ScriptProperties`のキー名は`authConfig.system.name`に基づく
- 復号処理は副作用のない純関数構造を目指す（stateを持たない）

## 🧩 内部依存クラス・モジュール

### authScriptProperties

<!--::$tmp/authScriptProperties.md::-->

### Member

<!--::$tmp/Member.md::-->

## 🧱 decrypt()メソッド

- authClient->authServerのメッセージを復号＋署名検証
- クライアントから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
- 復号・署名検証直後に `authRequest.timestamp` と `Date.now()` の差を算出し、  
  `authConfig.allowableTimeDifference` を超過した場合、`throw new Error('Timestamp difference too large')` を実行。<br>
  処理結果は `{result:'fatal', message:'Timestamp difference too large'}`。
- 本関数はauthServerから呼ばれるため、fatalエラーでも戻り値を返す

### 📤 入力項目

#### `encryptedRequest`

<!--::$tmp/encryptedRequest.md::-->

#### 参考：`authRequest`

- 復号化されたcipherTextの中身

<!--::$tmp/authRequest.md::-->

### 📥 出力項目

#### `decryptedRequest`

<!--::$tmp/decryptedRequest.md::-->

#### 参考：`authRequest`

<!--::$tmp/authRequest.md::-->


### 処理概要

- memberId,deviceId,cipherTextが全て存在
  - memberListシートからmemberId,deviceIdが合致するMemberオブジェクトの取得を試行
  - Memberオブジェクトの取得成功 ⇒ 登録済メンバ<br>
    ※以下、取得したMemberオブジェクトでdeviceIdが一致するものを`Member`と呼称
    - 加入期限内(`Date.now() < Member.expire`)
      - CPkey有効期限内(`Date.now() < Member.CPkeyUpdated + authConfig.loginLifeTime`)
        - cipherTextのSSkeyでの復号成功、authRequestを取得
          - `authRequest.signature`と署名とMemberList.CPkeyが全て一致
            -`{result:'normal',response:authRequest}`を返して終了
          - `authRequest.signature`と署名とMemberList.CPkeyのいずれかが不一致
            - `{result:'fatal',message:'Signature unmatch'}`を返して終了
        - cipherTextのSSkeyでの復号失敗
          - `{result:'fatal',message:'decrypt failed'}`を返して終了
      - CPkey有効期限外
        - `{result:'warning',message:'CPkey has expired'}`を返して終了
    - 加入期限切れ
      - `{result:'warning',message:'Membership has expired'}`を返して終了
  - Memberオブジェクトの取得不成功 ⇒ 新規加入要求
    - memberId(=メールアドレス)がメールアドレスとして適切
      - cipherTextのSSkeyでの復号を試行
      - cipherTextのSSkeyでの復号成功、authRequestを取得
        - `authRequest.signature`と署名が一致
          - `{result:'warning',message:'Member registerd'}`を返して終了
        - `authRequest.signature`と署名が不一致
          - `{result:'fatal',message:'Signature unmatch'}`を返して終了
      - cipherTextのSSkeyでの復号失敗
          - `{result:'fatal',message:'decrypt failed'}`を返して終了
    - memberId(=メールアドレス)がメールアドレスとして不適切
      - `{result:'fatal',message:'Invalid mail address'}`を返して終了
- memberId,deviceId,cipherTextのいずれかが欠落
  - `{result:'fatal',message:'[memberId|deviceId|cipherText] not specified'}`を返して終了

## 🧱 encrypt()メソッド

- authServer->authClientのメッセージを暗号化＋署名

### 📤 入力項目

#### authResponse

<!--::$tmp/authResponse.md::-->

### 📥 出力項目

#### encryptedResponse

<!--::$tmp/decryptedRequest.md::-->

### 処理概要

## ⏰ メンテナンス処理

## 🔐 セキュリティ仕様

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ（TTL付き）で検出・拒否 |
| **タイミング攻撃** | 定数時間比較（署名・ハッシュ照合）を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | `SSkey`/`SPkey` は ScriptProperties に格納し、Apps Script内でのみ参照可 |

## 🧾 エラーハンドリング仕様

## 🗒️ ログ出力仕様

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | requestId, memberId, timestamp |
| errorLog | Spreadsheetまたはログシート | 発生日時, memberId, errorMessage, stackTrace |
| auditLog | Spreadsheet | 処理種別, 成功／警告／失敗, 対象メンバID |

