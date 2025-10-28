<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [cryptoClient](cryptoClient.md) | [cryptoServer](cryptoServer.md) | [Member](Member.md) | [データ型](typedef.md) | [内発処理](internalProcessing.md)

</div>

# cryptoServer クラス仕様書

## <a name="summary">🧭 概要</a>

- 認証サーバ (`authServer`) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書(`cryptoClient`)と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- 暗号化ライブラリは `jsrsasign` を使用。

### <a name="policy">設計方針</a>

- 署名→暗号化(Sign-then-Encrypt)方式に準拠
- 鍵ペアは `ScriptProperties` に保存(`SSkey`, `SPkey`)
- `ScriptProperties`のキー名は`authConfig.system.name`に基づく
- 復号処理は副作用のない純関数構造を目指す(stateを持たない)
- 可能な範囲で「外部ライブラリ」を使用する
- timestamp検証は整数化・絶対値化してから比較する

### 🧩 <a name="internal">内部構成</a>

- 項目名末尾に「()」が付いているのはメソッド<br>
  (static:クラスメソッド、public:外部利用可、private:内部専用)

| 項目名 | データ型 | 内容 |
| :-- | :-- | :-- |
| cf | [authServerConfig](typedef.md#authserverconfig) | 動作設定変数(config) |
| sp | [authScriptProperties](typedef#authscriptproperties) | ScriptPropertiesに格納された設定値 |
| pv | Object | 汎用authServer内共有変数 |
| pv.member | [Member](typedef#member) | 処理対象メンバのMemberインスタンス |
| pv.audit | [authAuditLog](typedef#authauditlog) | 監査ログオブジェクト |
| pv.error | [authErrorLog](typedef#autherrorlog) | エラーログオブジェクト |
| [constructor()](#constructor) | private | コンストラクタ |
| [decrypt()](#decrypt) | public | authClient->authServerのメッセージを復号＋署名検証 |
| [encrypt()](#encrypt) | public | authServer->authClientのメッセージを暗号化＋署名 |
| [reset()](#reset) | static | 緊急時、サーバ側鍵ペアを変更 |

## <a name="constructor" href="#internal">🧱 constructor()</a>

### <a name="constructor-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | config | ❌ | [authServerConfig](typedef.md#authserverconfig) | — | 動作設定変数(config) |
| 2 | props | ❌ | [authScriptProperties](typedef.md#authscriptproperties) | — | ScriptPropertiesの内容 |

### <a name="constructor-returns">📤 戻り値</a>

- [cryptoServer](#internal)

### <a name="constructor-process">🧾 処理手順</a>

- ScriptPropertiesを取得、未作成なら作成
- ScriptPropertiesのキー名は`authConfig.system.name`、データは`authScriptProperties`をJSON化した文字列
- ScriptPropertiesが存在したらオブジェクト化してインスタンス変数'pv'に内容を保存
- pv.SPkey/SSkey未作成なら作成、ScriptPropertiesに保存

## <a name="decrypt" href="#internal">🧱 decrypt()</a>

authClient->authServerのメッセージを復号＋署名検証。<br>
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

### <a name="decrypt-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | string|[encryptedRequest](typedef.md#encryptedrequest) | — | クライアント側からの暗号化された処理要求 |

### <a name="decrypt-returns">📤 戻り値</a>

- [decryptedRequest](typedef.md#decryptedrequest)
- 戻り値決定のデシジョンテーブルは以下の通り。
  No | 署名 | 復号 | 時差 | result | message | response
  :--: | :-- | :-- | :-- | :-- | :-- | :--
  0.1 | — | — | — | fatal | Invalid string | —
  0.2 | — | — | — | warning | maybe CPkey | request文字列
  1 | 一致 | 成功 | 誤差内 | normal | — | authRequest
  2 | 一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
  3 | 一致 | 失敗 | — | fatal | decrypt failed | —
  4 | 不一致 | 成功 | 誤差内 | warning | Signature unmatch | authRequest
  5 | 不一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
  6 | 不一致 | 失敗 | — | fatal | decrypt failed | —

  - 「時差」：`abs(Date.now() - request.timestamp) > allowableTimeDifference` ⇒ 誤差超
  - No.4は加入申請(SPkey取得済・CPkey未登録)時を想定

### <a name="decrypt-process">🧾 処理手順</a>

1. 入力データ型判定
  - 引数(JSON文字列)のオブジェクト化を試行、成功したらステップ2に移行
  - オブジェクト化に失敗し、かつCPkey文字列として不適切なら戻り値No.0.1を返して終了
  - オブジェクト化に失敗し、かつCPkey文字列として適切なら戻り値No.0.2を返して終了
2. 入力検証
  - memberId, deviceId, cipherText がすべて存在しない場合<br>
    ⇒ `{result:'fatal',message:'[memberId|deviceId|cipherText] not specified'}`を返して終了
3. メンバの状態確認
  - Member.getMember()でメンバ情報取得
  - Member.judgeStatus()で状態判定、戻り値(`decryptedRequest.status`)にセット
4. 署名検証・復号試行・時差判定
  - 復号・署名検証直後に `authRequest.timestamp` と `Date.now()` の差を算出し、
    `authConfig.allowableTimeDifference` を超過した場合、`throw new Error('Timestamp difference too large')` を実行。<br>
    処理結果は `{result:'fatal', message:'Timestamp difference too large'}`。
  - 「[戻り値](#decrypt-returns)」記載のデシジョンテーブルで判定(No.1〜6)、decryptedRequest各メンバの値を設定

## <a name="encrypt" href="#internal">🧱 encrypt()</a>

authServer->authClientのメッセージを暗号化＋署名

### <a name="encrypt-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | response | ❌ | [authResponse](typedef.md#authresponse) | — | 暗号化対象オブジェクト |

### <a name="encrypt-returns">📤 戻り値</a>

- [encryptedResponse](typedef.md#encryptedresponse)

### <a name="encrypt-process">🧾 処理手順</a>

- authResponse.signatureは省略せず明示的に含める
- 暗号化順序は Sign-then-Encrypt
- 復号側(cryptoClient)では「Decrypt-then-Verify」

## <a name="reset" href="#internal">🧱 reset()</a>

緊急時、サーバ側鍵ペアを変更

### <a name="reset-param">📥 引数</a>

無し

### <a name="reset-returns">📤 戻り値</a>

無し

### <a name="reset-process">🧾 処理手順</a>

- SPkey/SSkeyを更新、ScriptPropertiesに保存
- 本メソッドはシステム管理者がGAS編集画面から実行することを想定

## <a name="security">🔐 セキュリティ仕様</a>

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
| **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | `SSkey`/`SPkey` は ScriptProperties に格納し、Apps Script内でのみ参照可 |

## <a name="outputLog">🗒️ ログ出力仕様</a>

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | [authRequestLog](typedef.md#authrequestlog)記載項目 |
| errorLog | Spreadsheet(authServerConfig.errorLog) | [authErrorLog](typedef.md#autherrorlog)記載項目 |
| auditLog | Spreadsheet(authServerConfig.auditLog) | [authAuditLog](typedef.md#authauditlog)記載項目 |

### ログ出力のタイミング

| ログ種別 | タイミング | 理由 |
| :-- | :-- | :-- |
| **auditLog** | decrypt 完了時 / encrypt 完了時 | 認証イベントとして記録。finallyまたはreturn前に出力 |
| **errorLog** | decrypt / encrypt の途中で fatal 発生時 | 原因箇所特定用。catch句内に記載 |
| **requestLog** | decrypt 開始時 | 重複チェック(リプレイ防止)用。ScriptPropertiesに短期保存 |
