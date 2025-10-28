<!--::$src/common/header.md::-->

# 🔐 cryptoServer クラス 仕様書

## 要修正点

- authServer -> cryptoServer.decrypt にCPkey文字列が送られた場合はwarning

## 🧭 概要

- 認証サーバ (`authServer`) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書(`cryptoClient`)と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- `cryptoServer.encrypt()`形式での使用を想定し、メソッドはstaticとする
- 暗号化ライブラリは `jsrsasign` を使用。

## ■ 設計方針

- 署名→暗号化(Sign-then-Encrypt)方式に準拠  
- 鍵ペアは `ScriptProperties` に保存(`SSkey`, `SPkey`)
- `ScriptProperties`のキー名は`authConfig.system.name`に基づく
- 復号処理は副作用のない純関数構造を目指す(stateを持たない)
- 可能な範囲で「外部ライブラリ」を使用する
- timestamp検証は整数化・絶対値化してから比較する

## 🧩 内部依存クラス・モジュール

### authScriptProperties

<!--::$tmp/authScriptProperties.md::-->

### authRequestLog

<!--::$tmp/authRequestLog.md::-->

### Member

<!--::$tmp/Member.md::-->

## 🧱 constructor()

- 引数は`authServerConfig`
- ScriptPropertiesを取得、未作成なら作成
- ScriptPropertiesのキー名は`authConfig.system.name`、データは`authScriptProperties`をJSON化した文字列
- ScriptPropertiesが存在したらオブジェクト化してインスタンス変数'pv'に内容を保存
- pv.SPkey/SSkey未作成なら作成、ScriptPropertiesに保存

### authServerConfig

<!--::$tmp/authServerConfig.md::-->

### authConfig

<!--::$tmp/authConfig.md::-->

<a name="decrypt"></a>

## 🧱 decrypt()メソッド

authClient->authServerのメッセージを復号＋署名検証<br>
本関数はauthServerから呼ばれるため、fatalエラーでも戻り値を返す。<br>
fatal/warning分岐を軽量化するため、Signature検証統一関数を導入
<details><summary>Signature検証統一関数 実装例</summary>

```js
const verifySignature = (data, signature, pubkey) => {
  try {
    const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
    sig.init(pubkey);
    sig.updateString(data);
    return sig.verify(signature);
  } catch (e) { return false; }
}
```

</details>

- 📥 引数
  - [encryptedRequest](typedef.md#encryptedRequest)
- 📤 戻り値
  - [decryptedRequest](encryptedResponse.md#decryptedRequest)

### 戻り値

No | 署名 | 復号 | 時差 | result | message | response
:--: | :-- | :-- | :-- | :-- | :-- | :--
1 | 一致 | 成功 | 誤差内 | normal | — | authRequest
2 | 一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
3 | 一致 | 失敗 | — | fatal | decrypt failed | —
4 | 不一致 | 成功 | 誤差内 | warning | Signature unmatch | authRequest
5 | 不一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
6 | 不一致 | 失敗 | — | fatal | decrypt failed | —

- 「時差」：`abs(Date.now() - request.timestamp) > allowableTimeDifference` ⇒ 誤差超
- No.4は加入申請(SPkey取得済・CPkey未登録)時を想定


### 処理手順

1. 入力検証
  - memberId, deviceId, cipherText がすべて存在しない場合<br>
    ⇒ `{result:'fatal',message:'[memberId|deviceId|cipherText] not specified'}`を返して終了
2. メンバの状態確認
  - Member.getMember()でメンバ情報取得
  - Member.judgeStatus()で状態判定、戻り値(`decryptedRequest.status`)にセット
3. 署名検証・復号試行・時差判定
  - 復号・署名検証直後に `authRequest.timestamp` と `Date.now()` の差を算出し、  
    `authConfig.allowableTimeDifference` を超過した場合、`throw new Error('Timestamp difference too large')` を実行。<br>
    処理結果は `{result:'fatal', message:'Timestamp difference too large'}`。
  - 以下のデシジョンテーブルで判定、decryptedRequest各メンバの値を設定

#### cryptoServer.decryptの処理結果

<!--::$src/cryptoServer/decrypt.decision.md::-->

<!--
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
-->

## 🧱 encrypt()メソッド

- authServer->authClientのメッセージを暗号化＋署名
- authResponse.signatureは省略せず明示的に含める
- 暗号化順序は Sign-then-Encrypt
- 復号側(cryptoClient)では「Decrypt-then-Verify」

### 📤 入力項目

#### authResponse

<!--::$tmp/authResponse.md::-->

### 📥 出力項目

#### encryptedResponse

<!--::$tmp/decryptedRequest.md::-->

### 処理概要

## 🧱 reset()メソッド

- 緊急時、サーバ側鍵ペアを変更する
- pv.SPkey/SSkeyを更新、ScriptPropertiesに保存
- 本メソッドはシステム管理者がGAS編集画面から実行する

## ⏰ メンテナンス処理

## 🔐 セキュリティ仕様

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
| **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | `SSkey`/`SPkey` は ScriptProperties に格納し、Apps Script内でのみ参照可 |

## 🧾 エラーハンドリング仕様

## 🗒️ ログ出力仕様

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | `authRequestLog`記載項目 |
| errorLog | Spreadsheet(authServerConfig.errorLog) | `authErrorLog`記載項目 |
| auditLog | Spreadsheet(authServerConfig.auditLog) | `authAuditLog`記載項目 |

### ログ出力のタイミング

| ログ種別 | タイミング | 理由 |
| :-- | :-- | :-- |
| **auditLog** | decrypt 完了時 / encrypt 完了時 | 認証イベントとして記録。finallyまたはreturn前に出力 |
| **errorLog** | decrypt / encrypt の途中で fatal 発生時 | 原因箇所特定用。catch句内に記載 |
| **requestLog** | decrypt 開始時 | 重複チェック(リプレイ防止)用。ScriptPropertiesに短期保存 |

### authRequestLog

<!--::$tmp/authRequestLog.md::-->

### authAuditLog

<!--::$tmp/authAuditLog.md::-->

### authErrorLog

<!--::$tmp/authErrorLog.md::-->

## 外部ライブラリ

- ソース先頭(グローバル領域)に`const dev=devTools()`を挿入

<details><summary>createPassword</summary>

```js
//::$lib/createPassword/1.0.1/core.js::
```

</details>

<details><summary>devTools</summary>

```js
//::$lib/devTools/1.0.1/core.js::
```

</details>

<details><summary>toLocale</summary>

```js
//::$lib/toLocale/1.2.0/core.js::
```

</details>

<details><summary>whichType</summary>

```js
//::$lib/whichType/1.0.1/core.js::
```

</details>

<!--
## 🧱 proto()

### 概要

### 📤 入力項目

### 📥 出力項目
-->
