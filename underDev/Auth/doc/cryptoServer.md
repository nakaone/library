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

<a name="authScriptProperties"></a>

キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | keyGeneratedDateTime | ❌ | number | — | UNIX時刻 |
| 2 | SPkey | ❌ | string | — | PEM形式の公開鍵文字列 |
| 3 | SSkey | ❌ | string | — | PEM形式の秘密鍵文字列（暗号化済み） |

### Member

<a name="Member"></a>

メンバ一覧(アカウント管理表)上のメンバ単位の管理情報

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | name | ❌ | string | — | メンバの氏名 |
| 3 | log | ❌ | string | — | メンバの履歴情報(MemberLog)を保持するJSON文字列 |
| 4 | profile | ❌ | string | — | メンバの属性情報(MemberProfile)を保持するJSON文字列 |
| 5 | device | ❌ | string | — | マルチデバイス対応のためのデバイス情報(MemberDevice[])を保持するJSON文字列 |
| 6 | note | ⭕ | string | — | 当該メンバに対する備考 |

## 🧱 decrypt()メソッド

- authClient->authServerのメッセージを復号＋署名検証
- クライアントから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
- 本関数はauthServerから呼ばれるため、fatalエラーでも戻り値を返す

### 📤 入力項目

#### `encryptedRequest`

<a name="encryptedRequest"></a>

- authClientからauthServerに渡す暗号化された処理要求オブジェクト
- ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列
- memberId,deviceIdは平文

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string | — | デバイスの識別子 |
| 3 | ciphertext | ❌ | string | — | 暗号化した文字列 |

#### 参考：`authRequest`

- 復号化されたcipherTextの中身

<a name="authRequest"></a>

authClientからauthServerに送られる処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string | — | デバイスの識別子 |
| 3 | requestId | ❌ | string | — | 要求の識別子。UUID |
| 4 | timestamp | ❌ | number | — | 要求日時。UNIX時刻 |
| 5 | func | ❌ | string | — | サーバ側関数名 |
| 6 | arguments | ❌ | any[] | — | サーバ側関数に渡す引数の配列 |
| 7 | signature | ❌ | string | — | クライアント側署名 |

### 📥 出力項目

#### `decryptedRequest`

<a name="decryptedRequest"></a>

cryptoServerで復号された処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string | — | 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success" |
| 2 | message | ⭕ | string | — | エラーメッセージ。result="normal"の場合`undefined` |
| 3 | request | ❌ | authRequest | — | ユーザから渡された処理要求 |
| 4 | timestamp | ❌ | string | — | 復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存 |

#### 参考：`authRequest`

<a name="authRequest"></a>

authClientからauthServerに送られる処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string | — | デバイスの識別子 |
| 3 | requestId | ❌ | string | — | 要求の識別子。UUID |
| 4 | timestamp | ❌ | number | — | 要求日時。UNIX時刻 |
| 5 | func | ❌ | string | — | サーバ側関数名 |
| 6 | arguments | ❌ | any[] | — | サーバ側関数に渡す引数の配列 |
| 7 | signature | ❌ | string | — | クライアント側署名 |


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

<a name="authResponse"></a>

authServerからauthClientに返される処理結果オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ❌ | number | — | サーバ側処理日時。UNIX時刻 |
| 2 | result | ❌ | string | — | サーバ側処理結果。fatal/warning/normal |
| 3 | message | ⭕ | string | — | サーバ側からのエラーメッセージ。normal時は`undefined` |
| 4 | request | ❌ | authRequest | — | 処理要求オブジェクト |
| 5 | response | ⭕ | any | — | 要求されたサーバ側関数の戻り値。fatal/warning時は`undefined` |

### 📥 出力項目

#### encryptedResponse

<a name="decryptedRequest"></a>

cryptoServerで復号された処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string | — | 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success" |
| 2 | message | ⭕ | string | — | エラーメッセージ。result="normal"の場合`undefined` |
| 3 | request | ❌ | authRequest | — | ユーザから渡された処理要求 |
| 4 | timestamp | ❌ | string | — | 復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存 |

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
