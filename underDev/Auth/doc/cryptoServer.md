# 🔐 cryptoServer クラス 仕様書

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

<a name="authScriptProperties"></a>

キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | keyGeneratedDateTime | ❌ | number |  | UNIX時刻 |
| 2 | SPkey | ❌ | string |  | PEM形式の公開鍵文字列 |
| 3 | SSkey | ❌ | string |  | PEM形式の秘密鍵文字列(暗号化済み) |
| 4 | oldSPkey | ❌ | string |  | cryptoServer.reset実行前にバックアップした公開鍵 |
| 5 | oldSSkey | ❌ | string |  | cryptoServer.reset実行前にバックアップした秘密鍵 |
| 6 | requestLog | ⭕ | authRequestLog[] |  | 重複チェック用のリクエスト履歴 |

### authRequestLog

<a name="authRequestLog"></a>

重複チェック用のリクエスト履歴。ScriptPropertiesに保存

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ⭕ | number | Date.now() | リクエストを受けたサーバ側日時 |
| 2 | requestId | ❌ | string |  | クライアント側で採番されたリクエスト識別子。UUID |

### Member

<a name="Member"></a>

メンバ一覧(アカウント管理表)上のメンバ単位の管理情報

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 2 | name | ❌ | string |  | メンバの氏名 |
| 3 | status | ⭕ | string | 未加入 | メンバの状態。未加入,未審査,審査済,加入中,加入禁止 |
| 4 | log | ⭕ | string | new MemberLog() | メンバの履歴情報(MemberLog)を保持するJSON文字列 |
| 5 | profile | ⭕ | string | new MemberProfile() | メンバの属性情報(MemberProfile)を保持するJSON文字列 |
| 6 | device | ❌ | string |  | マルチデバイス対応のためのデバイス情報(MemberDevice[])を保持するJSON文字列 |
| 7 | note | ⭕ | string |  | 当該メンバに対する備考 |

## 🧱 constructor()

- 引数は`authServerConfig`
- ScriptPropertiesを取得、未作成なら作成
- ScriptPropertiesのキー名は`authConfig.system.name`、データは`authScriptProperties`をJSON化した文字列
- ScriptPropertiesが存在したらオブジェクト化してインスタンス変数'pv'に内容を保存
- pv.SPkey/SSkey未作成なら作成、ScriptPropertiesに保存

### authServerConfig

<a name="authServerConfig"></a>

authConfigを継承した、authServerでのみ使用する設定値

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberList | ⭕ | string | memberList | memberListシート名 |
| 2 | defaultAuthority | ⭕ | number | 1 | 新規加入メンバの権限の既定値 |
| 3 | memberLifeTime | ⭕ | number | 31536000000 | 加入有効期間(=メンバ加入承認後の有効期間)。既定値は1年 |
| 4 | prohibitedToJoin | ⭕ | number | 259200000 | 加入禁止期間(=管理者による加入否認後、再加入申請が自動的に却下される期間)。既定値は3日 |
| 5 | loginLifeTime | ⭕ | number | 86400000 | 認証有効時間(=ログイン成功後の有効期間、CPkeyの有効期間)。既定値は1日 |
| 6 | loginFreeze | ⭕ | number | 600000 | 認証凍結時間(=認証失敗後、再認証要求が禁止される期間)。既定値は10分 |
| 7 | requestIdRetention | ⭕ | number | 300000 | 重複リクエスト拒否となる時間。既定値は5分 |
| 8 | errorLog | ⭕ | string | errorLog | エラーログのシート名 |
| 9 | storageDaysOfErrorLog | ⭕ | number | 604800000 | 監査ログの保存日数。単位はミリ秒。既定値は7日分 |
| 10 | auditLog | ⭕ | string | auditLog | 監査ログのシート名 |
| 11 | storageDaysOfAuditLog | ⭕ | number | 604800000 | 監査ログの保存日数。単位はミリ秒。既定値は7日分 |
| 12 | func | ❌ | Object.<string,Object> |  | サーバ側の関数マップ<br>例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}} |
| 13 | func.authority | ⭕ | number | 0 | サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限,`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。 |
| 14 | func.do | ❌ | Function |  | 実行するサーバ側関数 |
| 15 | trial | ❌ | Object |  | ログイン試行関係の設定値 |
| 16 | trial.passcodeLength | ⭕ | number | 6 | パスコードの桁数 |
| 17 | trial.maxTrial | ⭕ | number | 3 | パスコード入力の最大試行回数 |
| 18 | trial.passcodeLifeTime | ⭕ | number | 600000 | パスコードの有効期間。既定値は10分 |
| 19 | trial.generationMax | ⭕ | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代 |
| 20 | underDev.sendPasscode | ⭕ | boolean | false | 開発中、パスコード通知メール送信を抑止するならtrue |
| 21 | underDev.sendInvitation | ⭕ | boolean | false | 開発中、加入承認通知メール送信を抑止するならtrue |

### authConfig

<a name="authConfig"></a>

- authClient/authServer共通で使用される設定値。
- authClientConfig, authServerConfigの親クラス

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | systemName | ⭕ | string | auth | システム名 |
| 2 | adminMail | ❌ | string |  | 管理者のメールアドレス |
| 3 | adminName | ❌ | string |  | 管理者名 |
| 4 | allowableTimeDifference | ⭕ | number | 120000 | クライアント・サーバ間通信時の許容時差。既定値は2分 |
| 5 | RSAbits | ⭕ | string | 2048 | 鍵ペアの鍵長 |
| 6 | underDev | ❌ | Object |  | テスト時の設定 |
| 7 | underDev.isTest | ⭕ | boolean | false | 開発モードならtrue |

## 🧱 decrypt()メソッド

- authClient->authServerのメッセージを復号＋署名検証
- クライアントから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
- 復号・署名検証直後に `authRequest.timestamp` と `Date.now()` の差を算出し、
  `authConfig.allowableTimeDifference` を超過した場合、`throw new Error('Timestamp difference too large')` を実行。<br>
  処理結果は `{result:'fatal', message:'Timestamp difference too large'}`。
- 本関数はauthServerから呼ばれるため、fatalエラーでも戻り値を返す
- fatal/warning分岐を軽量化するため、Signature検証統一関数を導入(以下は例)
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

### 📤 入力項目

#### encryptedRequest

<a name="encryptedRequest"></a>

- authClientからauthServerに送られる、暗号化された処理要求オブジェクト
- ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列
- memberId,deviceIdは平文

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string |  | デバイスの識別子 |
| 3 | ciphertext | ❌ | string |  | 暗号化した文字列 |

#### 参考：authRequest

- 復号化されたcipherTextの中身

<a name="authRequest"></a>

authClientからauthServerに送られる、暗号化前の処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string |  | デバイスの識別子 |
| 3 | signature | ❌ | string |  | クライアント側署名 |
| 4 | requestId | ❌ | string |  | 要求の識別子。UUID |
| 5 | timestamp | ❌ | number |  | 要求日時。UNIX時刻 |
| 6 | func | ❌ | string |  | サーバ側関数名 |
| 7 | arguments | ❌ | any[] |  | サーバ側関数に渡す引数の配列 |

### 📥 出力項目

#### decryptedRequest

<a name="decryptedRequest"></a>

encryptedRequestをcryptoServerで復号した処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string |  | 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal" |
| 2 | message | ⭕ | string |  | エラーメッセージ。result="normal"の場合`undefined` |
| 3 | request | ❌ | authRequest |  | ユーザから渡された処理要求 |
| 4 | timestamp | ❌ | number |  | 復号処理実施日時 |
| 5 | status | ❌ | string |  | Member.deviceが空ならメンバの、空で無ければデバイスのstatus |

### 処理概要

1. 入力検証
  - memberId, deviceId, cipherText がすべて存在しない場合<br>
    ⇒ `{result:'fatal',message:'[memberId|deviceId|cipherText] not specified'}`を返して終了
2. メンバの状態確認
  - Member.getMember()でメンバ情報取得
  - Member.judgeStatus()で状態判定、戻り値(`decryptedRequest.status`)にセット
3. 署名検証・復号試行・時差判定
  - 以下のデシジョンテーブルで判定、decryptedRequest各メンバの値を設定<br>
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

<a name="authResponse"></a>

authServerからauthClientに返される、暗号化前の処理結果オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ⭕ | number | Date.now() | サーバ側処理日時。UNIX時刻 |
| 2 | result | ⭕ | string | normal | サーバ側処理結果。fatal/warning/normal |
| 3 | message | ⭕ | string |  | サーバ側からの(エラー)メッセージ |
| 4 | request | ⭕ | authRequest |  | 処理要求オブジェクト |
| 5 | response | ⭕ | any |  | 要求されたサーバ側関数の戻り値。fatal/warning時は`undefined` |

### 📥 出力項目

#### encryptedResponse

<a name="decryptedRequest"></a>

encryptedRequestをcryptoServerで復号した処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string |  | 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal" |
| 2 | message | ⭕ | string |  | エラーメッセージ。result="normal"の場合`undefined` |
| 3 | request | ❌ | authRequest |  | ユーザから渡された処理要求 |
| 4 | timestamp | ❌ | number |  | 復号処理実施日時 |
| 5 | status | ❌ | string |  | Member.deviceが空ならメンバの、空で無ければデバイスのstatus |

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

<a name="authRequestLog"></a>

重複チェック用のリクエスト履歴。ScriptPropertiesに保存

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ⭕ | number | Date.now() | リクエストを受けたサーバ側日時 |
| 2 | requestId | ❌ | string |  | クライアント側で採番されたリクエスト識別子。UUID |

### authAuditLog

<a name="authAuditLog"></a>

authServerの監査ログ

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ⭕ | string | Date.now() | 要求日時。ISO8601拡張形式の文字列 |
| 2 | duration | ❌ | number |  | 処理時間。ミリ秒単位 |
| 3 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 4 | deviceId | ⭕ | string |  | デバイスの識別子 |
| 5 | func | ⭕ | string |  | サーバ側関数名 |
| 6 | result | ⭕ | string |  | サーバ側処理結果。fatal/warning/normal |
| 7 | note | ❌ | string |  | 備考 |

### authErrorLog

<a name="authErrorLog"></a>

authServerのエラーログ

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ❌ | string |  | 要求日時。ISO8601拡張形式の文字列 |
| 2 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 3 | deviceId | ⭕ | string |  | デバイスの識別子 |
| 4 | result | ⭕ | string |  | サーバ側処理結果。fatal/warning/normal |
| 5 | message | ⭕ | string |  | サーバ側からのエラーメッセージ。normal時は`undefined` |
| 6 | stackTrace | ⭕ | string |  | エラー発生時のスタックトレース。本項目は管理者への通知メール等、シート以外には出力不可 |

## 外部ライブラリ

- ソース先頭(グローバル領域)に`const dev=devTools()`を挿入

<details><summary>createPassword</summary>

```js
/** 長さ・文字種指定に基づき、パスワードを生成
 *
 * @param {number} [len=16] - パスワードの長さ
 * @param {Object} opt
 * @param {boolean} [opt.lower=true] - 英小文字を使うならtrue
 * @param {boolean} [opt.upper=true] - 英大文字を使うならtrue
 * @param {boolean} [opt.symbol=true] - 記号を使うならtrue
 * @param {boolean} [opt.numeric=true] - 数字を使うならtrue
 * @returns {string}
 */
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,',
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```

</details>

<details><summary>devTools</summary>

```js
/** devTools: 開発支援関係メソッド集
 * @param {Object} option
 * @param {boolean} option.start=true - 開始・終了メッセージの表示
 * @param {boolean} option.arg=true - 開始時に引数を表示
 * @param {boolean} option.step=false - step毎の進捗ログの出力
 */
function devTools(option) {
  let opt = Object.assign({ start: true, arg: true, step: false }, option);
  let seq = 0;  // 関数の呼出順
  let stack = []; // 呼出元関数情報のスタック
  return { changeOption: changeOption, check: check, dump: dump, end: end, error: error, start: start, step: step };

  /** オプションの変更 */
  function changeOption(option) {
    opt = Object.assign(opt, option);
    console.log(`devTools.changeOption result: ${JSON.stringify(opt)}`);
  }
  /** 実行結果の確認
   * - JSON文字列の場合、オブジェクト化した上でオブジェクトとして比較する
   * @param {Object} arg
   * @param {any} arg.asis - 実行結果
   * @param {any} arg.tobe - 確認すべきポイント(Check Point)。エラーの場合、エラーオブジェクトを渡す
   * @param {string} arg.title='' - テストのタイトル(ex. SpreadDbTest.delete.4)
   * @param {Object} [arg.opt] - isEqualに渡すオプション
   * @returns {boolean} - チェック結果OK:true, NG:false
   */
  function check(arg = {}) {
    /** recursive: 変数の内容を再帰的にチェック
     * @param {any} asis - 結果の値
     * @param {any} tobe - 有るべき値
     * @param {Object} opt - isEqualに渡すオプション
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (asis, tobe, opt, depth = 0, label = '') => {
      let rv;
      // JSON文字列はオブジェクト化
      asis = (arg => { try { return JSON.parse(arg) } catch { return arg } })(asis);
      // データ型の判定
      let type = String(Object.prototype.toString.call(tobe).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(tobe)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in tobe)) type = 'Arrow'; break;
      }
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in tobe) {
            rv = !Object.hasOwn(asis, mn) ? false // 該当要素が不在
              : recursive(asis[mn], tobe[mn], opt, depth + 1, mn);
          }
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < tobe.length; i++) {
            rv = (asis[i] === undefined && tobe[i] !== undefined) ? false // 該当要素が不在
              : recursive(asis[i], tobe[i], opt, depth + 1, String(i));
          }
          msg.push(`${indent}]`);
          break;
        case 'Function': case 'Arrow':
          rv = tobe(asis);  // 合格ならtrue, 不合格ならfalseを返す関数を定義
          msg.push(
            indent + (label.length > 0 ? (label + ': ') : '')
            + (rv ? asis : `[NG] (${tobe.toString()})(${asis}) -> false`)
          );
          break;
        default:
          if (tobe === undefined) {
            rv = true;
          } else {
            rv = isEqual(asis, tobe, opt);
            msg.push(
              indent + (label.length > 0 ? (label + ': ') : '')
              + (rv ? asis : `[NG] ToBe=${tobe}, AsIs=${asis}`)
            );
          }
      }
      return rv;
    }

    // 主処理
    let msg = [];
    let isOK = true;  // チェックOKならtrue

    arg = Object.assign({ msg: '', opt: {} }, arg);
    if (arg.tobe === undefined) {
      // check未指定の場合、チェック省略、結果表示のみ
      msg.push(`===== ${arg.title} Check Result : Not checked`);
    } else {
      // arg.asisとarg.tobeのデータ型が異なる場合、またはrecursiveで不一致が有った場合はエラーと判断
      if (String(Object.prototype.toString.call(arg.asis).slice(8, -1))
        !== String(Object.prototype.toString.call(arg.tobe).slice(8, -1))
        || recursive(arg.asis, arg.tobe, arg.opt) === false
      ) {
        isOK = false;
        msg.unshift(`===== ${arg.title} Check Result : Error`);
      } else {
        msg.unshift(`===== ${arg.title} Check Result : OK`);
      }
    }

    // 引数として渡されたmsgおよび結果(JSON)を先頭に追加後、コンソールに表示
    msg = `::::: Verified by devTools.check\n`
      + `===== ${arg.title} Returned Value\n`
      + JSON.stringify(arg.asis, (k, v) => typeof v === 'function' ? v.toString() : v, 2)
      + `\n\n\n${msg.join('\n')}`;
    if (isOK) console.log(msg); else console.error(msg);
    return isOK;
  }
  /** dump: 渡された変数の内容をコンソールに表示
   * - 引数には対象変数を列記。最後の引数が数値だった場合、行番号と看做す
   * @param {any|any[]} arg - 表示する変数および行番号
   * @returns {void}
   */
  function dump() {
    let arg = [...arguments];
    let line = typeof arg[arg.length - 1] === 'number' ? arg.pop() : null;
    const o = stack[stack.length - 1];
    let msg = (line === null ? '' : `l.${line} `)
      + `::dump::${o.label}.${o.step}`;
    for (let i = 0; i < arg.length; i++) {
      // 対象変数が複数有る場合、Noを追記
      msg += '\n' + (arg.length > 0 ? `${i}: ` : '') + stringify(arg[i]);
    }
    console.log(msg);
  }
  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示
   * @param {Object} rt - end実行時に全体に優先させるオプション指定(run time option)
   */
  function end(rt={}) {
    const localOpt = Object.assign({},opt,rt);
    const o = stack.pop();
    if (localOpt.start) console.log(`${o.label} normal end.`);
  }
  /** error: 異常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function error(e) {
    const o = stack.pop();
    // 参考 : e.lineNumber, e.columnNumber, e.causeを試したが、いずれもundefined
    e.message = `[Error] ${o.label}.${o.step}\n${e.message}`;
    console.error(e.message
      + `\n-- footprint\n${o.footprint}`
      + `\n-- arguments\n${o.arg}`
    );
  }
  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} name - 関数名
   * @param {any[]} arg - start呼出元関数に渡された引数([...arguments]固定)
   * @param {Object} rt - start実行時に全体に優先させるオプション指定(run time option)
   */
  function start(name, arg = [], rt={}) {
    const localOpt = Object.assign({},opt,rt);
    const o = {
      class: '',  // nameがクラス名.メソッド名だった場合のクラス名
      name: name,
      seq: seq++,
      step: 0,
      footprint: [],
      arg: [],
    };
    o.sSeq = ('000' + o.seq).slice(-4);
    const caller = stack.length === 0 ? null : stack[stack.length - 1]; // 呼出元
    // nameがクラス名.メソッド名だった場合、クラス名をセット
    if (name.includes('.')) [o.class, o.name] = name.split('.');
    // ラベル作成。呼出元と同じクラスならクラス名は省略
    o.label = `[${o.sSeq}]` + (o.class && (!caller || caller.class !== o.class) ? o.class+'.' : '') + o.name;
    // footprintの作成
    stack.forEach(x => o.footprint.push(`${x.label}.${x.step}`));
    o.footprint = o.footprint.length === 0 ? '(root)' : o.footprint.join(' > ');
    // 引数情報の作成
    if (arg.length === 0) {
      o.arg = '(void)';
    } else {
      for (let i = 0; i < arg.length; i++) o.arg[i] = stringify(arg[i]);
      o.arg = o.arg.join('\n');
    }
    // 作成した呼出元関数情報を保存
    stack.push(o);

    if (localOpt.start) {  // 開始メッセージの表示指定が有った場合
      console.log(`${o.label} start.\n-- footprint\n${o.footprint}`
        + (localOpt.arg ? `\n-- arguments\n${o.arg}` : ''));
    }
  }
  /** step: 呼出元関数の進捗状況の登録＋メッセージの表示 */
  function step(step, msg = '') {
    const o = stack[stack.length - 1];
    o.step = step;
    if (opt.step) console.log(`${o.label} step.${o.step} ${msg}`);
  }
  /** stringify: 変数の内容をラベル＋データ型＋値の文字列として出力
   * @param {any} arg - 文字列化する変数
   * @returns {string}
   */
  function stringify(arg) {
    /** recursive: 変数の内容を再帰的にメッセージ化
     * @param {any} arg - 内容を表示する変数
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (arg, depth = 0, label = '') => {
      // データ型の判定
      let type = String(Object.prototype.toString.call(arg).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(arg)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in arg)) type = 'Arrow'; break;
      }
      // ラベル＋データ型＋値の出力
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in arg) recursive(arg[mn], depth + 1, mn);
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < arg.length; i++) recursive(arg[i], depth + 1, String(i));
          msg.push(`${indent}]`);
          break;
        default:
          let val = typeof arg === 'function' ? `"${arg.toString()}"` : (typeof arg === 'string' ? `"${arg}"` : arg);
          // Class Sheetのメソッドのように、toStringが効かないnative codeは出力しない
          if (typeof val !== 'string' || val.indexOf('[native code]') < 0) {
            msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}${val}(${type})`);
          }
      }
    }
    const msg = [];
    recursive(arg);
    return msg.join('\n');
  }
}
```

</details>

<details><summary>toLocale</summary>

```js
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg=null - 変換元の日時。nullなら現在日時
 * @param {Object} opt - オプション。文字列型ならformat指定と看做す
 * @param {boolean} opt.verbose=false - falseなら開始・終了時のログ出力を抑止
 * @param {string} opt.format='yyyy-MM-ddThh:mm:ss.nnnZ' - 日時を指定する文字列
 *   年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @param {boolean} opt.undecimber=false - "yyyy/13"を期末日として変換するならtrue
 * @param {string} opt.fyEnd="3/31" - 期末日。opt.undecimber=trueなら必須。"\d+\/\d+"形式
 * @param {string} opt.errValue='empty' - 変換不能時の戻り値。※不測のエラーはErrorオブジェクト。
 *   empty:空文字列, error:Errorオブジェクト, null:null値, arg:引数argを無加工で返す
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * - arg無指定なら現在日時と看做す
 * - optが文字列ならformatと看做す
 * - 「yyyy/13」は期末日に置換
 * - 和暦なら西暦に変換
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */
function toLocale(arg=null,opt={}) {
  const v = { whois: 'toLocale', rv: null,
    wareki:{  // 元号の開始年定義
      '明治':1867,'大正':1911,'昭和':1925,'平成':1988,'令和':2018,
      M:1867,T:1911,S:1925,H:1988,R:2018,
    },
    errValues:{ // 変換不能時の戻り値定義
      empty:'',
      error:new Error(`Couldn't convert "${arg}" to date.`),
      null: null,
      arg: arg,
    }
  };
  opt = Object.assign({
    verbose: false,
    format: 'yyyy-MM-ddThh:mm:ss.nnnZ',
    undecimber : false,
    fyEnd: '03/31',
    errValue: 'empty'
  },( typeof opt === 'string' ? {format:opt} : opt));
  dev.start(v.whois, [...arguments], {start:opt.verbose});
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 処理対象をDate型に変換
    // -------------------------------------------------------------
    if( arg === null ){
      dev.step(1.1);  // 無指定なら現在日時
      v.dObj = new Date();
    } else if( whichType(arg,'Date') ){
      dev.step(1.2);  // 日付型はそのまま採用
      v.dObj = arg;
    } else {
      dev.step(1.3);  // その他。和暦は修正(時分秒は割愛)した上でDate型に
      arg = String(arg).replace(/元/,'1');
      v.m = arg.match(/^([^\d]+)(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
      if( v.m ){
        dev.step(1.4);  // 和暦
        v.dObj = new Date(
          v.wareki[v.m[1]] + Number(v.m[2]),
          Number(v.m[3]) - 1,
          Number(v.m[4])
        );
      } else {
        dev.step(1.5);  // その他
        v.dObj = opt.undecimber // trueなら「yyyy/13」は期末日に置換
          ? new Date(arg.replace(/^(\d+)\/13$/,"$1/"+opt.fyEnd))
          : new Date(arg);
      }
      dev.step(1.6);  // 無効な日付ならエラー値を返して終了
      if( isNaN(v.dObj.getTime()) ) return v.errValues[opt.errValue];
    }

    // -------------------------------------------------------------
    dev.step(2);  // 戻り値(文字列)の作成
    // -------------------------------------------------------------
    v.rv = opt.format;  // 戻り値の書式(テンプレート)
    v.local = { // 地方時ベース
      y: v.dObj.getFullYear(),
      M: v.dObj.getMonth()+1,
      d: v.dObj.getDate(),
      h: v.dObj.getHours(),
      m: v.dObj.getMinutes(),
      s: v.dObj.getSeconds(),
      n: v.dObj.getMilliseconds(),
      Z: Math.abs(v.dObj.getTimezoneOffset())
    }
    dev.step(2.1);  // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    dev.step(2.2);// 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    dev.end({start:opt.verbose}); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
```

</details>

<details><summary>whichType</summary>

```js
/** 変数の型を判定
 *
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
```

</details>

<!--
## 🧱 proto()

### 概要

### 📤 入力項目

### 📥 出力項目
-->
