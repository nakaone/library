- "authTrial","authTrialLog","Device" ⇒ "MemberTrial","MemberTrialLog","MemberDevice"に名称変更
  ∵「メンバ情報(Member)の一部項目」であり、MemberProfileとも整合した命名に。
- プログラム間でやりとりされるオブジェクトを整理
- サーバ->クライアント側への返信も暗号化(なんとなく平文で送るイメージだった)
- サーバ・クライアントとも「署名＋暗号化」と「署名検証＋復号」の両方の機能を併せ持つクラスとして、"decryptRequest"⇒"cryptoServer","encryptRequest"⇒"cryptoClient"に名称変更。

<!-- 以下は既述のため割愛
- 本文書はMarkdownで書かれています。画像へのリンク(`![画像名](リンク先)`)は無視してください。
- 以下の仕様に基づき、「関数群」「添付書類」にある関数を作成する予定ですが、今回は本仕様のレビューをお願いします。記述が無い・論理矛盾・不足している点や使用するツールの推薦をお願いします。
- 開発スピード・安定稼働を重視し多少のリスクは許容しますが、重大なセキュリティホールは指摘してください。
- GASライブラリは使えなくなる場合も有るため、CDNのように「ダウンロードして埋め込む」という選択肢がとれる範囲でお願いします。
- 「ライブラリ」欄に記載された機能は過去に使用実績があるため、特に問題無ければそれを流用します。
-->

<!-- 以下は次回以降にお願いします。今回だけで指摘事項は結構あると思うので。
- 関数・メソッドについて概要・入出力が未記載または不適切な場合、指摘の上作成願います
- 時間経過と共に仕様が一部変わっています。不適切な部分があれば指摘願います
-->

---

総説

ブラウザ(クライアント)とGAS(サーバ)の間で認証された通信を行う。

 要求仕様

- 本システムは限られた人数のサークルや小学校のイベント等での利用を想定する。<br>
  よってセキュリティ上の脅威は極力排除するが、恒久性・安全性より導入時の容易さ・技術的ハードルの低さ、運用の簡便性を重視する。
- サーバ側(以下authServer)はスプレッドシートのコンテナバインドスクリプト、クライアント側(以下authClient)はHTMLのJavaScript
- サーバ側・クライアント側とも鍵ペアを使用
- 原則として通信は受信側公開鍵で暗号化＋発信側秘密鍵で署名
- クライアントの識別(ID)はメールアドレスで行う

 用語

- SPkey, SSkey：サーバ側の公開鍵(Server side Public key)と秘密鍵(Server side Secret key)
- CPkey, CSkey：クライアント側の公開鍵(Client side Public key)と秘密鍵(Client side Secret key)
- パスフレーズ：クライアント側鍵ペア作成時のキー文字列。JavaScriptで自動的に生成
- パスワード：運用時、クライアント(人間)がブラウザ上で入力する本人確認用の文字列
- パスコード：二段階認証実行時、サーバからクライアントに送られる6桁※の数字<br>
  ※既定値。実際の桁数はauthConfig.trial.passcodeLengthで規定

 暗号化・署名方式、運用

- 署名方式 : RSA-PSS
- 暗号化方式 : RSA-OAEP
- ハッシュ関数 : SHA-256以上
- 許容時差±120秒※以内
  ※既定値。実際の桁数はauthConfig.cryptoServer.allowableTimeDifferenceで規定
- 順序は「暗号化->署名」ではなく「署名->暗号化」で行う
  1. クライアントがデータをJSON化
  2. 自身の秘密鍵で署名（署名→暗号化）
  3. サーバの公開鍵で暗号化
  4. サーバは復号後、クライアント公開鍵(memberList.CPkey)で署名を検証
- パスワードの生成は「ライブラリ > createPassword」を使用
- パスコードのメール送信は「ライブラリ > sendMail」を使用
- CPkeyの有効期限が切れた場合、以下の手順で更新する
  1. クライアント側から古いCPkeyで署名された要求を受信
  2. サーバ側で署名検証の結果、期限切れを確認
    - memberList.trial[0].CPkeyUpdateUntilに「現在日時＋authConfig.cryptoServer.loginLifeTime」をセット
    - クライアント側に通知
  3. クライアント側でCPkeyを更新、新CPkeyで再度リクエスト
  4. サーバ側でauthConfig.cryptoServer.loginLifeTimeを確認、期限内ならmemberList.CPkeyを書き換え。期限切れなら加入処理同様、adminによる個別承認を必要とする。
  5. 以降は未ログイン状態で要求が来た場合として処理を継続

 処理手順

 localFuncからの処理要求時

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant memberList
  participant cryptoServer
  %%participant serverFunc
  %%actor admin

  authClient->>localFunc: authClientインスタンス生成
  localFunc->>+authClient: 処理要求(LocalRequest)
  authClient->>cryptoClient: 署名・暗号化要求(authRequest)
  cryptoClient->>authClient: encryptedRequest

  loop リトライ試行
    authClient->>+authServer: 処理要求(encryptedRequest)
    authServer->>cryptoServer: 復号・検証要求(encryptedRequest)
    cryptoServer->>authServer: decryptedRequest
    authServer->>authServer: ①サーバ内処理(decryptedRequest->authResponse)
    alt authResponse.result !== 'fatal'
      authServer->>cryptoServer: 署名・暗号化要求(authResponse)
      cryptoServer->>authServer: encryptedResponse
    end

    alt 応答タイムアウト内にレスポンス無し
      authClient->>localFunc: エラー通知(LocalResponse.result="fatal")
    else 応答タイムアウト内にレスポンスあり
      authServer->>-authClient: encryptedResponse

      authClient->>cryptoClient: 復号・検証要求(encryptedResponse)
      cryptoClient->>authClient: decryptedResponse

      alt decryptedResponse.result === 'fatal'
        authClient->>localFunc: エラー通知(LocalResponse.result="fatal")
      else
        authClient->>authClient: ②decryptedResponse.sv.resultによる分岐処理
        authClient->>-localFunc: 処理結果(LocalResponse)
      end
    end
  end
```

- `localFunc`とは、クライアント側(ブラウザ)内で動作するJavaScriptの関数を指す
- ①サーバ内処理
  - decryptedRequestを入力としてメイン処理またはメソッドを実行、結果を
- ②decryptedResponse.resultによる分岐処理
  - decryptedResponse.result === 'normal' ⇒ LocalResponseの作成
  - decryptedResponse.result === 'warning' ⇒
    1. authClient.inCaseOfWarning(decryptedResponse)を実行
    2. 1.の結果が'fatal'の場合、「リトライ試行」のループから脱出
- 「リトライ試行」は応答タイムアウト内にauthServerからレスポンスが来なかった場合、停止する<br>
  ※`fetch timeout`を使用。許容時間は`authConfig.allowableTimeDifference`

 データ格納方法と形式

- スプレッドシート以外で日時を文字列として記録する場合はISO8601拡張形式の文字列(`yyyy-MM-ddThh:mm:ss.nnn+09:00`)
- 日時を数値として記録する場合はUNIX時刻(new Date().getTime())
- スプレッドシート(memberList)については[Memberクラス仕様書](Member.md)参照

 動作設定変数(config)

- クラスとして定義
- 時間・期間の単位はミリ秒

 authConfig

<a name="authConfig"></a>

- authClient/authServer共通で使用される設定値。
- authClientConfig, authServerConfigの親クラス

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | systemName | ⭕ | string | auth | システム名 |
| 2 | adminMail | ❌ | string | — | 管理者のメールアドレス |
| 3 | adminName | ❌ | string | — | 管理者名 |
| 4 | allowableTimeDifference | ⭕ | string | 120000 | クライアント・サーバ間通信時の許容時差。既定値：2分 |
| 5 | RSAbits | ⭕ | string | 2048 | 鍵ペアの鍵長 |

 authServerConfig

<a name="authServerConfig"></a>

authConfigを継承した、authServerで使用する設定値

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberList | ⭕ | string | memberList | memberListシート名 |
| 2 | defaultAuthority | ❌ | number | — | 新規加入メンバの権限の既定値 |
| 3 | memberLifeTime | ⭕ | number | 31536000000 | メンバ加入承認後の有効期間。既定値：1年 |
| 4 | loginLifeTime | ⭕ | number | 86400000 | ログイン成功後の有効期間(=CPkeyの有効期間)。既定値：1日 |
| 5 | func | ❌ | Object.<string,Object> | — | サーバ側の関数マップ |
| 6 | func.authority | ❌ | number | — | 当該関数実行のために必要となるユーザ権限,`Member.profile.authority & authServerConfig.func.authrity > 0`なら実行可とする。 |
| 7 | func.do | ❌ | Function|Arrow | — | 実行するサーバ側関数 |
| 8 | trial | ❌ | Object | — | ログイン試行関係の設定値 |
| 9 | trial.passcodeLength | ⭕ | number | 6 | パスコードの桁数 |
| 10 | trial.freezing | ⭕ | number | 3600000 | 連続失敗した場合の凍結期間。既定値：1時間 |
| 11 | trial.maxTrial | ⭕ | number | 3 | パスコード入力の最大試行回数 |
| 12 | trial.passcodeLifeTime | ⭕ | number | 600000 | パスコードの有効期間。既定値：10分 |
| 13 | trial.generationMax | ⭕ | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数。既定値：5世代 |

 authClientConfig

<a name="authClientConfig"></a>

authConfigを継承した、authClientで使用する設定値

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | x | ❌ | string | — | サーバ側WebアプリURLのID(`https://script.google.com/macros/s/(この部分)/exec`) |

 データ型(typedef)

 LocalRequest

<a name="LocalRequest"></a>

- クライアント側関数からauthClientに渡すオブジェクト
- func,arg共、平文

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | func | ❌ | string | — | サーバ側関数名 |
| 2 | arguments | ❌ | any[] | — | サーバ側関数に渡す引数の配列 |

 authRequest

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

 encryptedRequest

<a name="encryptedRequest"></a>

- authClientからauthServerに渡す暗号化された処理要求オブジェクト
- ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列
- memberId,deviceIdは平文

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string | — | デバイスの識別子 |
| 3 | ciphertext | ❌ | string | — | 暗号化した文字列 |

 decryptedRequest

<a name="decryptedRequest"></a>

cryptoServerで復号された処理要求オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string | — | 処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success" |
| 2 | message | ⭕ | string | — | エラーメッセージ。result="normal"の場合`undefined` |
| 3 | request | ❌ | authRequest | — | ユーザから渡された処理要求 |
| 4 | timestamp | ❌ | string | — | 復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存 |

 authResponse

<a name="authResponse"></a>

authServerからauthClientに返される処理結果オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ❌ | number | — | サーバ側処理日時。UNIX時刻 |
| 2 | result | ❌ | string | — | サーバ側処理結果。fatal/warning/normal |
| 3 | message | ⭕ | string | — | サーバ側からのエラーメッセージ。normal時は`undefined` |
| 4 | request | ❌ | authRequest | — | 処理要求オブジェクト |
| 5 | response | ⭕ | any | — | 要求されたサーバ側関数の戻り値。fatal/warning時は`undefined` |

 encryptedResponse

<a name="encryptedResponse"></a>

- authServerからauthClientに返す暗号化された処理結果オブジェクト
- ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | ciphertext | ❌ | string | — | 暗号化した文字列 |

 decryptedResponse

<a name="decryptedResponse"></a>

cryptoClientで復号された処理結果オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | timestamp | ❌ | number | — | cryptoClient処理日時。UNIX時刻 |
| 2 | result | ❌ | string | — | cryptoClient処理結果。fatal/warning/normal |
| 3 | message | ⭕ | string | — | cryptoClientからのエラーメッセージ。normal時は`undefined` |
| 4 | request | ❌ | authRequest | — | 処理要求オブジェクト(authResponse.request) |
| 5 | response | ⭕ | any | — | 要求されたサーバ側関数の戻り値(authResponse.response)。fatal/warning時は`undefined` |
| 6 | sv | ❌ | Object | — |  |
| 7 | sv.timestamp | ❌ | number | — | サーバ側処理日時。UNIX時刻 |
| 8 | sv.result | ❌ | string | — | サーバ側処理結果。fatal/warning/normal |
| 9 | sv.message | ⭕ | string | — | サーバ側からのエラーメッセージ。normal時は`undefined` |

 LocalResponse

<a name="LocalResponse"></a>

authClientからクライアント側関数に返される処理結果オブジェクト

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | result | ❌ | string | — | 処理結果。fatal/warning/normal |
| 2 | message | ⭕ | string | — | エラーメッセージ。normal時は`undefined`。 |
| 3 | response | ⭕ | any | — | 要求された関数の戻り値。fatal/warning時は`undefined`。`JSON.parse(authResponse.response)` |

 クラス・関数定義

- [authClient](doc/authClient.md) 関数 仕様書
- [authServer](doc/authServer.md) 関数 仕様書
- [Member](doc/Member.md) クラス 仕様書
- [cryptoServer](doc/cryptoServer.md) 関数 仕様書
- [cryptoClient](doc/cryptoClient.md) 関数 仕様書

# 添付書類

以下は別ファイル(Markdown)として作成済みの仕様書。

---
**cryptoClient.md**
---

### 概要

本仕様書は、クライアント側でサーバへ安全に処理要求を送信するための関数
`cryptoClient` の設計および関連構成について記述する。\
サーバ側仕様書（cryptoServer）と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。

------------------------------------------------------------------------

### 1. 基本方針

-   暗号化・署名には **Web Crypto API** を使用。
-   鍵ペアは **署名用（RSA-PSS）** と **暗号化用（RSA-OAEP）**
    の2種類を生成し、それぞれ非エクスポータブル（`exportable: false`）として
    **IndexedDB** に保存。
-   IndexedDB の store 名および keyPath は `authConfig.system.name`
    に基づく。
-   クライアント側公開鍵（CPkey）は
    `authConfig.loginLifeTime`（既定：1日）で有効期限管理。
-   暗号化・署名時に利用するハッシュ関数は **SHA-256** 以上を使用。

------------------------------------------------------------------------

### 2. 鍵ペア管理仕様

#### 2.1 鍵種別と用途

  鍵名        | アルゴリズム   | 用途    | 保存先
  :-- | :-- | :-- | :--
  CPkey-sign | RSA-PSS      | 署名    | IndexedDB
  CPkey-enc  | RSA-OAEP     | 暗号化  | IndexedDB

#### 2.2 鍵生成時パラメータ

``` js
{
  name: "RSA-PSS",
  modulusLength: authConfig.RSA.bits,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: "SHA-256",
  extractable: false,
  keyUsages: ["sign", "verify"]
}
```

暗号化鍵は `name: "RSA-OAEP"`、`keyUsages: ["encrypt", "decrypt"]`
とする。

#### 2.3 有効期限管理

-   IndexedDB に保存された鍵のメタ情報に作成日時・有効期限を保持。
-   有効期限が切れた場合は自動再生成。
-   サーバ側で署名検証時に期限切れが検知された場合、`updateCPkey`
    が呼ばれ更新処理を行う。

------------------------------------------------------------------------

### 3. 関数仕様

#### 3.1 cryptoClient

``` js
/**
 * @function cryptoClient
 * @desc クライアント側関数からサーバへの処理要求を暗号化・署名し、結果を返す。
 * @param {authRequest} request - サーバへの処理要求オブジェクト
 * @returns {Promise<Object>} 暗号化済み要求オブジェクト（envelope形式）
 */
```

#### 3.2 内部構造

  メソッド          役割
  ----------------- -----------------------------------------------------
  `init()`          鍵ペアの存在確認。なければ生成してIndexedDBに格納。
  `updateCPkey()`   サーバ要求による公開鍵更新処理。
  `exec()`          ローカル関数からの処理要求受付。署名＋暗号化実施。

------------------------------------------------------------------------

### 4. 処理フロー

1.  **初期化 (`init`)**
    -   IndexedDB を開く。鍵ペアが存在しない場合、RSA-PSS と RSA-OAEP
        を生成。
    -   生成した鍵をメンバ変数に保持し、IndexedDB に保存。
2.  **署名 (`sign`)**
    -   `request`
        オブジェクト（authRequest型）をJSON化し、RSA-PSS署名を付与。
3.  **暗号化 (`encrypt`)**
    -   署名付きペイロードを RSA-OAEP により暗号化。
    -   暗号文は Base64 エンコードし、以下のような構造で送信：

``` json
{
  "envelope": {
    "memberId": "user@example.com",
    "ciphertext": "BASE64_ENCRYPTED_PAYLOAD"
  }
}
```

4.  **公開鍵更新 (`updateCPkey`)**
    -   サーバから「期限切れ通知」を受信した場合、CPkey を再生成。
    -   新CPkey は再署名されサーバに登録依頼を送信。

------------------------------------------------------------------------

### 5. 暗号・署名パラメータ

  区分     アルゴリズム   ハッシュ   鍵長                  備考
  -------- -------------- ---------- --------------------- -----------------
  署名     RSA-PSS        SHA-256    authConfig.RSA.bits   鍵用途: sign
  暗号化   RSA-OAEP       SHA-256    authConfig.RSA.bits   鍵用途: encrypt

------------------------------------------------------------------------

### 6. 関連型定義

#### 6.1 authRequest

  プロパティ   型        内容
  ------------ --------- --------------------------------
  memberId     string    メンバ識別子（メールアドレス）
  requestId    string    要求識別子（UUID）
  timestamp    number    要求日時（UNIX時刻）
  func         string    サーバ側関数名
  arguments    any\[\]   関数引数
  signature    string    クライアント署名

#### 6.2 authResponse

  プロパティ   型       内容
  ------------ -------- --------------------------
  requestId    string   要求識別子（UUID）
  timestamp    number   処理日時（UNIX時刻）
  status       string   処理結果（null＝成功）
  response     string   関数の戻り値(JSON文字列)

------------------------------------------------------------------------

### 7. 補助関数

#### createPassword()

長さ・文字種指定に基づき、ランダムなパスワードを生成。

``` js
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){ ... }
```

------------------------------------------------------------------------

### 8. 懸念点・今後の検討

-   Web Crypto API
    の鍵管理は非同期であるため、IndexedDB操作のラッパ関数化が望ましい。\
-   鍵用途を明確化するため、署名鍵・暗号化鍵を分離して管理。\
-   CPkey
    の自動更新フローは、`authTrial.updateCPkey()`と統一設計が必要。\
-   `authConfig` のRSA設定はサーバ・クライアント共通クラス化を検討。

------------------------------------------------------------------------

© 2025 Authentication System Design Draft

---
**cryptoServer.md**
---

### ■ 概要
認証サーバ (`authServer`) から独立した復号・署名検証処理モジュール。
クライアントから送信された暗号文を安全に復号・検証し、結果を構造化オブジェクトとして返す。
暗号化ライブラリは `jsrsasign` を使用。

---

### ■ 設計方針
- 他システムでも利用可能な汎用API関数とする
- 署名→暗号化（Sign-then-Encrypt）方式に準拠
- 鍵ペアは `ScriptProperties` に保存（`SSkey`, `SPkey`）
- 鍵の更新は `refresh()` メソッドで実施（緊急対応のみ）
- 復号処理は副作用のない純関数構造を目指す（stateを持たない）

---

### ■ 関数定義
```js
/**
 * @function cryptoServer
 * @description クライアントからの暗号化要求を復号・署名検証し、結果を返す。
 * @param {Object} arg - 復号要求パラメータ
 * @param {string} arg.memberId - メンバ識別子（平文）
 * @param {string} arg.ciphertext - Base64エンコードされた暗号化JSON文字列
 * @returns {Object} result - 処理結果
 */
```

---

### ■ 戻り値構造
```js
{
  timestamp: "2025/10/08 22:45:00",
  result: "success" | "warning" | "fatal",
  message: "詳細メッセージ",
  request?: { ... }, // 復号済みJSON（成功時）
  detail?: { ... }   // 補足情報・再試行データ
}
```

---

### ■ 処理手順

| 手順 | 処理内容 | 結果・対応 |
|------|-----------|-------------|
| **① 入力検証** | `memberId`, `ciphertext` が存在し、文字列型であり、Base64形式か確認 | 不正入力 → `fatal` |
| **② メンバ存在確認** | `memberList` に該当メンバが存在するか | 不存在 → `fatal` + 管理者通知 |
| **③ 復号処理** | `SSkey` により `ciphertext` を復号 | 失敗 → `fatal` + 管理者通知 |
| **④ JSON構造検証** | 復号結果がJSONで、`timestamp`, `signature`, `func`, `requestId` 等を含むか確認 | 欠損 → `fatal` |
| **⑤ タイムスタンプ検証** | サーバ時刻との差が `authConfig.allowableSkew` を超過しないか | 超過 → `fatal` |
| **⑥ リプレイ検知** | `requestId` がキャッシュ済みか確認 | 重複 → `fatal` |
| **⑦ 署名検証** | `memberList[memberId].CPkey` で署名を検証 | 失敗 → `fatal` |
| **⑧ アカウント有効性確認** | 承認済・有効期間内か | 期限切れ → `warning` |
| **⑨ 署名有効期限確認** | `CPkey` の有効期限をチェック | 切れ → `warning` + 更新誘導 |
| **⑩ セッション状態確認** | ログイン済みか・有効期間内か確認 | 未ログイン → `authTrial()` 実行 |
| **⑪ 正常処理** | 全て通過 | `result = "success"` |

- 復号できなかった場合、公開鍵文字列として適切か判定、適切ならwarningとする

---

### ■ 例外・共通処理

| 対象 | 処理 | 備考 |
|------|------|------|
| **全 fatal ケース** | `adminMail` 宛に通知（スロットリング付き） | 同一memberId連続通知は抑止 |
| **ログ出力** | `memberId`, `result`, `message`, `timestamp` のみ | 機密情報（平文・署名）は除外 |
| **環境情報収集** | `IP`, `UserAgent` 等を匿名化して `rv.detail` に格納 | |
| **再試行誘導** | `warning` の場合は `detail.nextAction` に再試行手順を付与 | |

---

### ■ 関連設定項目

| 設定名 | 意味 | 例 |
|--------|------|----|
| `authConfig.allowableSkew` | タイムスタンプ許容差(ms) | `5 * 60 * 1000` |
| `authConfig.loginLifeTime` | ログイン有効期間(ms) | `60 * 60 * 1000` |
| `authConfig.replayCacheTTL` | リプレイ検知キャッシュ保持(ms) | `10 * 60 * 1000` |
| `authConfig.mailThrottle` | 管理者通知抑止時間(ms) | `60 * 1000` |
| `memberList.trial.CPkeyUpdateUntil` | クライアント鍵更新期限 | `Date(ms)` |

---

### ■ 想定戻り値例

#### ✅ 正常ケース
```js
{
  timestamp: "2025/10/08 22:45:00",
  result: "success",
  message: "Decryption and verification passed",
  request: { func: "getData", args: [123], requestId: "abc123", timestamp: 1696789200000 }
}
```

#### ⚠️ 署名期限切れ（CPkey更新誘導）
```js
{
  result: "warning",
  message: "CPkey expired",
  detail: { nextAction: "requestKeyUpdate", retryAfter: "2025-10-09T00:00:00Z" }
}
```

#### ❌ リプレイ検出
```js
{
  result: "fatal",
  message: "Duplicate requestId detected",
  detail: { requestId: "abc123" }
}
```

---

### ■ セキュリティ設計ポイント

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ（TTL付き）で検出・拒否 |
| **タイミング攻撃** | 定数時間比較（署名・ハッシュ照合）を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | `SSkey`/`SPkey` は ScriptProperties に格納し、Apps Script内でのみ参照可 |

---

### ■ 改良点まとめ（前版との差分）

| 区分 | 改良内容 |
|------|-----------|
| **入力検証強化** | Base64・JSON構造検証を追加 |
| **リプレイ検知** | `requestId` キャッシュを導入 |
| **ログ管理** | 機密データ除外・匿名化強化 |
| **メール通知制御** | スパム防止のスロットリング追加 |
| **関数純化** | グローバル依存を減らし関数単体テスト可能化 |

---

### ■ 今後の拡張案
- RSA→ECCへの切替対応（パフォーマンス・鍵サイズ改善）
- AES-GCM等による改ざん検知付き共通鍵暗号化併用
- memberListを外部KVS化（セキュア・スケーラブル運用）

---

© 2025 Auth System Design Team

---
**Member.md**
---

### 概要

- Member は サーバ側 でメンバ情報を一元的に管理するクラスです。
- 加入・ログイン・パスコード試行・デバイス別CPkey管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。

### 状態遷移

```mermaid
stateDiagram-v2
  [*] --> 未加入
  未加入 --> 審査中 : 加入要求
  審査中 --> 加入中 : 承認
  審査中 --> [*] : 否認
  state 加入中 {
    [*] --> 未ログイン
    未ログイン --> ログイン試行中 : ログイン要求
    ログイン試行中 --> ログイン中 : 成功
    ログイン試行中 --> ログイン試行中 : 失敗(回数制限内)
    ログイン中 --> ログイン期限切れ
    ログイン期限切れ --> [*]
    ログイン試行中 --> 凍結中 : 失敗(回数制限超)
    凍結中 --> [*]
  }
  加入中 --> 加入期限切れ
  加入期限切れ --> [*]
```

| No | 状態 | 説明・判定方法 |
| --: | :-- | :-- |
| 1 | 未加入 | memberListに存在しない<br>memberList.memberIdに無い |
| 2 | 審査中 | 管理者承認待ち<br>!memberList.accepted && !memberList.reportResult |
| 3 | 加入中 | 有効メンバ。期限内であれば認証可能<br>0 < memberList.accepted && Date.now() < memberList.expire |
| 4 | &emsp;未ログイン | 当該デバイスでは有効なCPkeyが未発行、または期限切れの状態<br>（他デバイスではログイン中であってもよい）<br>memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime < Date.now() |
| 5 | &emsp;ログイン試行中 | 認証用パスコードを発行済みで、結果が未確定<br>Date.now() < memberList.memberId[deviceId].trial[0].created + authConfig.passcodeLifeTime |
| 6 | &emsp;ログイン中 | 認証が成功し、権限が必要な処理も要求できる状態<br>Date.now() <= memberList.memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime |
| 7 | &emsp;ログイン期限切れ | CPキーの有効期限が切れて再作成が必要な状態<br>memberList.memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime < Date.now() |
| 8 | &emsp;凍結中 | 制限回数内に認証が成功せず、試行できない状態<br>Date.now() < memberList.memberId[deviceId].trial[0].freezingUntil |
| 9 | 加入期限切れ | メンバ加入承認後の有効期間が切れた状態<br>memberList.expire < Date.now() |

### 状態遷移時にセットすべき変数

| 状態 | 更新されるプロパティ | 更新内容 |
| :-- | :-- | :-- |
| 審査中 → 加入中 | accepted, expire | 承認日時、承認後の有効期限を設定 |
| 加入中 → 未ログイン | device[].trial | 認証試行履歴を初期化（空配列） |
| 未ログイン → ログイン試行中 | device[].trial[0].passcode, created | 新しいパスコードを生成し記録 |
| ログイン試行中 → ログイン中 | device[].CPkey, CPkeyUpdated | クライアントから送信されたCPkeyを登録 |
| ログイン中 → ログイン期限切れ | device[].CPkeyUpdated | 期限切れ判定により更新なし。再生成を要求 |
| ログイン試行中 → 凍結中 | device[].trial[0].freezingUntil | 現在時刻＋freezingをセット |
| 加入中 → 加入期限切れ | expire | 判定のみ。更新なし |

### データ型定義

#### Member

<a name="Member"></a>

メンバ一覧(アカウント管理表)上のメンバ単位の管理情報

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 2 | name | ❌ | string | — | メンバの氏名 |
| 3 | accepted | ❌ | string | — | 加入が承認されたメンバには承認日時を設定 |
| 4 | reportResult | ❌ | string | — | 「加入登録」処理中で結果連絡メールを送信した日時 |
| 5 | expire | ❌ | string | — | 加入承認の有効期間が切れる日時 |
| 6 | profile | ❌ | string | — | メンバの属性情報(MemberProfile)を保持するJSON文字列 |
| 7 | device | ❌ | string | — | マルチデバイス対応のためのデバイス情報(MemberDevice)を保持するJSON文字列 |
| 8 | note | ⭕ | string | — | 当該メンバに対する備考 |

#### authTrialLog

<a name="MemberTrialLog"></a>

MemberTrial.logに記載される、パスコード入力単位の試行記録

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | entered | ❌ | string | — | 入力されたパスコード |
| 2 | result | ❌ | number | — | -1:恒久的エラー, 0:要リトライ, 1:パスコード一致 |
| 3 | message | ❌ | string | — | エラーメッセージ |
| 4 | timestamp | ❌ | number | — | 判定処理日時 |

#### MemberTrial

<a name="MemberTrial"></a>

ログイン試行単位の試行情報(Member.trial)

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | passcode | ❌ | string | — | 設定されているパスコード |
| 2 | created | ❌ | number | — | パスコード生成日時(≒パスコード通知メール発信日時) |
| 3 | freezingUntil | ❌ | number | — | 凍結解除日時。最大試行回数を超えたら現在日時を設定 |
| 4 | CPkeyUpdateUntil | ❌ | number | — | CPkey更新処理中の場合、更新期限をUNIX時刻でセット |
| 5 | log | ⭕ | MemberTrialLog[] |  | 試行履歴。常に最新が先頭(unshift()使用) |

#### MemberProfile

<a name="MemberProfile"></a>

メンバの属性情報(Member.profile)

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 |  | ❌ | string | — |  |

#### MemberDevice

<a name="MemberDevice"></a>

メンバが使用する通信機器の情報(マルチデバイス対応)

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | deviceId | ❌ | string | — | デバイスの識別子。UUID |
| 2 | CPkey | ❌ | string | — | メンバの公開鍵 |
| 3 | CPkeyUpdated | ❌ | string | — | 最新のCPkeyが登録された日時 |
| 4 | trial | ❌ | string | — | ログイン試行関連情報オブジェクト(MemberTrial[])のJSON文字列 |

### クラス・メソッド定義

- メンバ加入承認はadminがシート上で行う

#### constructor()

```js
/**
 * Member クラス
 * @class
 * @description memberListの1行をもとに、メンバ情報と状態を管理する。
 */
class Member {

  /**
   * @constructor
   * @param {Object} arg
   * @param {string} arg.sheetName - memberListのシート名
   * @param {string} arg.memberId - メンバ識別子(メールアドレス)
   * @param {Object} [opt] - オプション(authConfig)
   * @description 指定されたmemberIdの情報を取得し、状態を解析してプロパティに展開する。
   */
  constructor(arg, opt) {}
}
```

#### getStatus(): メンバの現在状態を判定する

```js
/**
 * メンバの現在状態を判定する
 * @param {void}
 * @returns {string} 現在の状態を返す（例："未加入"、"ログイン中"など）
 */
```

#### register(): 新規メンバを登録する

```js
/**
 * 新規メンバを登録する
 * @param {string} name - メンバ名
 * @param {string} memberId - メールアドレス
 * @param {MemberProfile} profile - 初期権限・属性情報
 * @returns {Object} 登録結果
 */
```

#### createPasscode(): パスコード生成処理

```js
/**
 * パスコード生成処理
 * @param {string} deviceId
 * @returns {MemberTrial} 新しい認証試行情報
 */
```

#### verifyPasscode(): 入力されたパスコードを検証する

```js
/**
 * 入力されたパスコードを検証する
 * @param {string} deviceId
 * @param {string} entered - 入力パスコード
 * @param {number} timestamp - 判定時刻
 * @returns {MemberTrialLog} 判定結果
 */
```

#### updateCPkey(): CPkey更新処理（クライアント送信に基づく）

```js
  /**
   * CPkey更新処理（クライアント送信に基づく）
   * @param {string} deviceId
   * @param {string} newCPkey
   * @returns {boolean} 登録結果
   */
```

#### maintenance(): 加入期限・CPkey期限などの定期チェックを行う

| 区分             | 処理内容                                                                                                   | 対象・目的                  |
| :------------- | :----------------------------------------------------------------------------------------------------- | :--------------------- |
| 🕐 **期限管理**    | - `memberList.expire` を過ぎたメンバを「加入期限切れ」にする<br>- `device[].CPkeyUpdated` が `loginLifeTime` 超過ならCPkeyを無効化 | 加入期限・CPkeyの有効期限切れの自動処理 |
| 🧊 **凍結解除**    | - `trial[].freezingUntil < Date.now()` なら凍結状態を解除                                                       | 認証試行失敗による凍結期間終了後の自動解除  |
| 🧹 **履歴整理**    | - `trial.log`の古い履歴を`generationMax`超過分だけ削除<br>- 不要デバイス（長期間非アクティブ）を削除                                    | データ肥大化防止、整合性維持         |
| 🧭 **整合性補正**   | - CPkeyが存在しないのに`ログイン中`判定されているデバイスを修正<br>- profile.authorityが空の場合は`authConfig.defaultAuthority`で補完      | データ不整合の自動修復            |
| ✉️ **通知系（任意）** | - 期限切れ/凍結/更新要求などが発生した場合に管理者やユーザへメール通知                                                                  | 運用支援・エラー検知             |

```js
/**
 * @method maintenance
 * @desc memberList全体をスキャンし、期限切れ・凍結解除・整合性補正などを行う。
 * @param {Object} [opt] - 実行オプション
 * @param {boolean} [opt.notify=true] - 処理結果を管理者へ通知するか
 * @param {boolean} [opt.cleanup=true] - 不要データ(旧trial,期限切れdevice)を削除するか
 * @returns {Object} - 実行結果サマリ { cleaned: number, expired: number, unfrozen: number, notified: number }
 */
```

---
**authClient.md**
---

- クロージャ関数として定義

### 概要

### メイン処理

- classのconstructor()に相当するメイン処理部分
- 鍵ペアの準備：IndexedDBから鍵ペアを取得、authClientのメンバ変数に格納。<br>
  IndexedDBに鍵ペアが無い場合は新たに生成し、生成時刻と共に保存
- IndexedDBからメールアドレスを取得、存在しなければダイアログから入力
- IndexedDBからメンバの氏名を取得、存在しなければダイアログから入力
- SPkey未取得ならサーバ側に要求
- 更新した内容はIndexedDBに書き戻す
- SPkey取得がエラーになった場合、SPkey以外は書き戻す

```js
/**
 * @param {void}
 * @returns {Object.<string,Function>} 使用可能なメソッド
 */
```

### 要求前準備

- authServer.responseによる分岐の前に、decrypt成否による分岐を既述

```mermaid
%% 要求前準備

sequenceDiagram
  actor user
  participant localFunc
  %%participant clientMail
  %%participant cryptoClient
  participant IndexedDB
  participant authClient
  participant authServer
  %%participant memberList
  %%participant cryptoServer
  %%participant serverFunc
  %%actor admin

  %% IndexedDB格納項目のメンバ変数化 ----------
  alt IndexedDBのメンバ変数化が未了
    IndexedDB->>+authClient: 既存設定値の読み込み、メンバ変数に保存
    Note right of authClient: メイン処理
    alt (クライアント側鍵ペア未作成or前回作成から1日以上経過)and前回作成から30分以上経過
      authClient->>authClient: 鍵ペア生成、生成日時設定
    end
    alt メールアドレス(memberId)未設定
      authClient->>user: ダイアログ表示
      user->>authClient: メールアドレス
    end
    alt メンバの氏名(memberName)未設定
      authClient->>user: ダイアログ表示
      user->>authClient: メンバ氏名
    end
    alt SPkey未入手
      authClient->>+authServer: CPkey(平文)
      Note right of authServer: responseSPkey()
      %% 以下2行はauthServer.responseSPkey()の処理内容
      authServer->>authServer: 公開鍵か形式チェック、SPkeyをCPkeyで暗号化
      authServer->>authClient: CPkeyで暗号化されたSPkey
      alt 待機時間内にauthServerから返信有り
        authServer->>-authClient: SPkeyをCSkeyで復号、メンバ変数に平文で保存
      else 待機時間内にauthServerから返信無し
        authClient->>user: エラーメッセージをダイアログ表示
        authClient->>localFunc: エラーオブジェクトを返して終了
      end
    end
    authClient-->>-IndexedDB: メンバ変数を元に書き換え
  end
```

### authIndexedDB

<a name="authIndexedDB"></a>

- クライアントのIndexedDBに保存するオブジェクト
- IndexedDB保存時のキー名は`authConfig.system.name`から取得

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | keyGeneratedDateTime | ❌ | number | — | 鍵ペア生成日時。UNIX時刻(new Date().getTime()),なおサーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く。 |
| 2 | memberId | ❌ | string | — | メンバの識別子(=メールアドレス) |
| 3 | profile | ❌ | Object | — | メンバの属性 |
| 4 | profile.memberName | ❌ | string | — | メンバ(ユーザ)の氏名(ex."田中　太郎")。加入要求確認時に管理者が申請者を識別する他で使用。 |
| 5 | CSkeySign | ❌ | CryptoKey | — | 署名用秘密鍵 |
| 6 | CPkeySign | ❌ | CryptoKey | — | 署名用公開鍵 |
| 7 | CSkeyEnc | ❌ | CryptoKey | — | 暗号化用秘密鍵 |
| 8 | CPkeyEnc | ❌ | CryptoKey | — | 暗号化用公開鍵 |
| 9 | SPkey | ❌ | string | — | サーバ公開鍵(Base64) |
| 10 | ApplicationForMembership | ⭕ | number | -1 | 加入申請実行日時。未申請時は-1 |
| 11 | expireAccount | ⭕ | number | -1 | 加入承認の有効期間が切れる日時。未加入時は-1 |
| 12 | expireCPkey | ⭕ | number | -1 | CPkeyの有効期限。未ログイン時は-1 |


### joining() : 加入要求

- 加入申請済かどうかで、以下の①②に分岐<br>
  `IndexedDB.ApplicationForMembership < 0 ⇒ 未申請`
- 加入未申請だった場合
  - 加入要求(`func="membershipRequest"`)としてCPkeyとmemberId(メールアドレス)をSPkeyで暗号化してサーバ側に送信する
  - 待機時間を超えたらError
  - IndexedDBに加入申請日時を記録
  - 処理要求中フラグ=false
- 加入申請済だった場合
  - 加入審査結果問合せ(`func="examinationResultInquiry"`)をサーバ側に送信
  - 加入可否に関わらずIndexedDB・メンバ変数のアカウント有効期限・CPkey有効期限をサーバ側の戻り値で更新
  - 加入NGだった場合はリトライするかダイアログで意思確認

```js
/**
 * @param {void}
 * @returns {null|Error}
 */
```

### requestLogin() : ログイン要求

- authServer.loginTrialに`{func:"loginRequest"}`を送信


<!-- 以降、未チェック -->

### request() : 処理要求

### inCaseOfWarning() : authResponse.result==warningだった場合の処理

authResponse.messageに従い、accountExpired/updateCPkey/loginに処理分岐

### accountExpired() : アカウント有効性確認(アカウント有効期限切れ対応)

### updateCPkey() : 署名有効期限確認(CPkey有効期限切れ対応)

1. 鍵ペアを再作成し、改めて送信
2. CPkey再登録・ログイン終了後、改めて要求を送信

### login() : セッション状態確認(未ログイン)

1. ダイアログを表示、authServerからのパスコード通知メールを待って入力
2. パスコードをauthServerに送信

### reset() : IndexedDBに格納されている情報を再作成

メールアドレス入力ミスの場合を想定。

- 鍵ペアの再作成
- ダイアログからメールアドレス入力。入力済のメールアドレスがあれば、流用も許容

---
**authServer.md**
---

### 🧭 概要

authServerは、クライアント（authClient）からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

### 概要

- 「■■　〜　■■」は別項で詳説
- authClient, authServer 横の「xxx()」ラベルはそれぞれのメソッド名

```mermaid
sequenceDiagram
  %%actor user
  participant localFunc
  %%participant clientMail
  participant cryptoClient
  %%participant IndexedDB
  participant authClient
  participant authServer
  %%participant memberList
  participant cryptoServer
  participant serverFunc
  %%actor admin

  authClient->>localFunc: authClientインスタンス生成
  Note over authClient,authServer: ■■ 要求前準備 ■■
  localFunc->>+authClient: 処理要求(LocalRequest)
  authClient->>cryptoClient: 署名・暗号化要求(LocalRequest)
  cryptoClient->>authClient: encryptedRequest
  Note right of authClient: メイン処理

  loop リトライ試行
    authClient->>+authServer: 処理要求(encryptedRequest)
    Note right of authServer: メイン処理
    authServer->>cryptoServer:復号要求(encryptedRequest)
    cryptoServer->>authServer: decryptedRequest
    alt 復号成功(decryptedRequest.result === "success")
      authServer->>authServer: 状態確認(Member.getStatus(memberId[deviceId]))
      alt 応答タイムアウト内にレスポンス無し
        authClient->>authClient: 処理結果=「システムエラー」
        authClient->>authClient: リトライ(loop)停止
      else 応答タイムアウト内にレスポンスあり
        alt result="warning"
          authServer->>authClient: 処理結果=authResponse(result="warning")
          authClient->>authClient: inCaseOfWarning()を呼び出し
        else result="normal"
          authServer->>-authClient: 処理結果=authResponse.response
          authClient->>authClient: リトライ(loop)停止
        end
      end
    else 復号失敗(decryptResult.result === "success")
      authServer->>authClient: responseSPkeyを実行、クライアント側にSPkeyを提供
    end
  end
  authClient->>-localFunc: 処理結果
```

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
| 3 | accepted | ❌ | string | — | 加入が承認されたメンバには承認日時を設定 |
| 4 | reportResult | ❌ | string | — | 「加入登録」処理中で結果連絡メールを送信した日時 |
| 5 | expire | ❌ | string | — | 加入承認の有効期間が切れる日時 |
| 6 | profile | ❌ | string | — | メンバの属性情報(MemberProfile)を保持するJSON文字列 |
| 7 | device | ❌ | string | — | マルチデバイス対応のためのデバイス情報(MemberDevice)を保持するJSON文字列 |
| 8 | note | ⭕ | string | — | 当該メンバに対する備考 |


#### 主な責務
1. 暗号化リクエストの復号・署名検証（cryptoServer）
2. 重複リクエスト防止（requestIdの短期キャッシュ）
3. メンバ状態管理（Memberクラス連携）
4. サーバ関数実行およびレスポンスの暗号化返却

#### セキュリティ要件
- requestIdの再利用禁止
- CPkey/SPkeyペアの有効期限管理
- 署名検証の失敗時は即座に処理中断

#### 通信形式
- クライアント→サーバ: JSON文字列をRSA-OAEP暗号化＋署名付与
- サーバ→クライアント: authResponse(JSON)をクライアントCPkeyで暗号化

---

### 📤 入力項目（authClient → authServer）

| 項目名 | 型 | 必須 | 説明 |
| :-- | :-- | :-- | :-- |
| requestId | string | ○ | リクエスト一意識別子。再送防止用。 |
| ciphertext | string | ○ | 暗号化済みのリクエストデータ。 |
| signature | string | ○ | クライアント秘密鍵で署名した署名文字列。 |
| memberId | string | ○ | メンバの識別子（メールアドレス）。 |
| deviceId | string | ○ | デバイスの識別子。 |
| timestamp | number | ○ | クライアント送信時のUNIX時刻。リプレイ攻撃防止。 |

---

### 📥 出力項目（authServer → authClient）

| 項目名 | 型 | 説明 |
| :-- | :-- | :-- |
| result | "success" / "warning" / "error" | 処理結果のステータス |
| message | string | 補足メッセージ（ユーザ通知やデバッグ用） |
| response | any | 呼出先関数の戻り値（暗号化済みJSON文字列） |
| requestId | string | 対応するリクエストID（照合用） |

---

### 🧩 内部構成

#### 内部依存クラス・モジュール

| クラス / モジュール | 主な責務 |
| :-- | :-- |
| Properties | ScriptPropertiesのCRUDを抽象化。キーprefix管理とTTL管理を行う。 |
| Member | メンバ状態判定・更新処理。スプレッドシート行の読み書きを担当。 |
| MemberTrial | ログイン試行情報の履歴管理・失敗回数制御。 |
| cryptoServer() | リクエスト復号・署名検証。authResponseのベース生成。 |
| encryptResponse() | クライアントのCPkeyを用いた応答暗号化。 |

---

### 🔄 状態遷移と呼出マップ

| No | 状態 | 要求内容 | 呼出メソッド |
| --: | :-- | :-- | :-- |
| 1 | 未加入 | 加入要求 | membershipRequest() |
| 2 | 審査中 | 加入審査結果問合せ | examinationResultInquiry() |
| 3 | 加入中 | — | — |
| 4 | 未ログイン | ログイン要求 | logInRequest() |
| 5 | ログイン試行中 | 入力されたパスコードの通知 | loginTrial() |
| 6 | ログイン中 | サーバ側関数の呼び出し | callFunction() |
| 7 | ログイン期限切れ | ログイン要求 | logInRequest() |
| 8 | 凍結中 | 無権限実行可関数なら呼出 | — |
| 9 | 加入期限切れ | 無権限実行可関数なら呼出 | — |

> 状態判定は Member クラスの getStatus() で取得。
> 状態遷移後、必要に応じて Member.updateStatus() を呼び出してmemberListを更新。
> 状態名は「未加入」「審査中」「加入中」「未ログイン」「ログイン中」など Member.md に準拠。

---

### 🧱 メソッド概要

#### setupEnvironment()
- 初期環境の整備を行う。GAS初回実行時の権限確認処理も含む。

#### responseSPkey(arg)
- クライアントから送られた文字列がCPkeyと推定される場合に、SPkeyを暗号化して返却。

#### membershipRequest(memberId, CPkey)
- 新規メンバ加入要求を登録。管理者へメール通知。

#### notifyAcceptance()
- 加入結果を通知。未通知のメンバのみ対象。

#### examinationResultInquiry(memberId)
- 審査結果を返却。CPkey有効期限や加入期限を含む。

#### loginTrial(memberId)
- ログイン要求を処理し、試行結果をMemberTrialに記録。

#### inCaseOfWarning()
- 各種期限切れなどの警告を分類し、適切なレスポンス生成。

#### callFunction()
- authServerConfig.funcを参照し、該当関数を実行。

---

### ⏰ メンテナンス処理

- 定期トリガーで呼び出される `maintenance()` にて以下を実施:
  - CPkey有効期限切れの検出と更新通知
  - 凍結解除日時到来の解除処理
  - 加入期限切れメンバの無効化

---

### 🔐 セキュリティ仕様

| 項目 | 内容 |
| :-- | :-- |
| リプレイ防止 | requestIdの一時保存（TTL 5分） |
| タイミング攻撃対策 | 定数時間比較関数 compareConstantTime(a,b) を使用 |
| 鍵管理 | CPkey: memberList.device[].CPkey に保存。<br>SPkey: ScriptProperties内のみ保持。 |
| 署名方式 | RSA-PSS（SHA-256） |
| 暗号化方式 | RSA-OAEP（SHA-256） |
| 有効期限 | CPkey: 30分〜1時間、SPkey: 1日 |

---

### 🧾 エラーハンドリング仕様

| 種別 | 内容 | authResponse.result | 備考 |
| :-- | :-- | :-- | :-- |
| ValidationError | 不正な入力・形式エラー | "error" | messageに入力箇所を示す |
| AuthError | 認証失敗・署名不一致 | "error" | 再試行不可 |
| ExpireWarning | 鍵またはアカウント期限切れ | "warning" | 更新誘導付き応答 |
| SystemError | 内部例外・想定外エラー | "error" | ログ送信＋空応答返却 |

---

### 🗒️ ログ出力仕様

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | requestId, memberId, timestamp |
| errorLog | Spreadsheetまたはログシート | 発生日時, memberId, errorMessage, stackTrace |
| auditLog | Spreadsheet | 処理種別, 成功／警告／失敗, 対象メンバID |

---

### 💬 改訂要約
> **Ans-20251013-01**
> authServerは認証通信の中核であるため、「通信仕様」「セキュリティ仕様」「ログ・保守仕様」を明確に区分。
> 本改訂により、I/O定義・エラーポリシー・定期保守の3章を追加し、クライアント／サーバ間の仕様整合性を確保。
