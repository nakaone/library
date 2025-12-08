<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="cryptoserver">cryptoServer クラス仕様書</span>

サーバ側の暗号化・復号処理

- 認証サーバ ([authServer](authServer.md)) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書([cryptoClient](../cl/cryptoClient.md))と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- 暗号化ライブラリは"jsrsasign"を使用
- 以下"cf","prop","crypto","member","audit","error","pv"は[authServer](authServer.md#authserver_members)内共通のインスタンス変数

## <span id="cryptoserver_summary">🧭 cryptoServer クラス 概要</span>

#### <a name="security">🔐 セキュリティ仕様</a>

- 署名→暗号化(Sign-then-Encrypt)方式に準拠
- 鍵ペアは[ScriptProperties](authScriptProperties.md)に保存("SSkey", "SPkey")
- ScriptPropertiesのキー名は"[authServerConfig](authServerConfig.md#authserverconfig_members).system.name"に基づく
- 復号処理は副作用のない純関数構造を目指す(stateを持たない)
- 可能な範囲で「外部ライブラリ」を使用する
- timestamp検証は整数化・絶対値化してから比較する

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
| **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | SSkey/SPkey は ScriptProperties に格納し、Apps Script内でのみ参照可 |

## <span id="cryptoserver_members">🔢 cryptoServer メンバ一覧</span>

- メンバ無し

## <span id="cryptoserver_methods">🧱 cryptoServer メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#cryptoserver_constructor) | private | コンストラクタ |  |
| [decrypt()](#cryptoserver_decrypt) | public | authClientからのメッセージを復号＋署名検証 | - 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す
- fatal/warning分岐を軽量化するため、Signature検証統一関数を導入(以下は実装例)
  ```js
  const verifySignature = (data, signature, pubkey) => {
    try {
      const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
      sig.init(pubkey);
      sig.updateString(data);
      return sig.verify(signature);
    } catch (e) { return false; }
  }
  ``` |
| [encrypt()](#cryptoserver_encrypt) | public | authClientへのメッセージを署名＋暗号化 | - [authResponse](authResponse.md#authresponse_members).signatureは省略せず明示的に含める
- 暗号化順序は Sign-then-Encrypt
- 復号側([cryptoClient](../cl/cryptoClient.md))では「Decrypt-then-Verify」
- 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す |
| [generateKeys()](#cryptoserver_generatekeys) | public | 新たなサーバ側鍵ペアを作成 |  |

### <span id="cryptoserver_constructor"><a href="#cryptoserver_methods">🧱 cryptoServer.constructor()</a></span>

#### <span id="cryptoserver_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authServerConfig](authServerConfig.md#authserverconfig_members) | <span style="color:red">必須</span> |  | authServerの動作設定変数 |

#### <span id="cryptoserver_constructor_process">🧾 処理手順</span>

#### <span id="cryptoserver_constructor_returns">📤 戻り値</span>

- [cryptoServer](#cryptoserver_members)インスタンス
### <span id="cryptoserver_decrypt"><a href="#cryptoserver_methods">🧱 cryptoServer.decrypt()</a></span>

#### <span id="cryptoserver_decrypt_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | string\|[encryptedRequest](encryptedRequest.md#encryptedrequest_members) | <span style="color:red">必須</span> |  | クライアント側からの暗号化された処理要求 |

#### <span id="cryptoserver_decrypt_process">🧾 処理手順</span>

1. 入力データ型判定：引数(JSON文字列)のオブジェクト化を試行
   - オブジェクト化成功の場合：次ステップへ
   - オブジェクト化失敗の場合：requestがCPkey文字列として適切か判断
     - 不適切なら戻り値「不正文字列」を返して終了
     - 適切なら戻り値「CPkey」を返して終了
2. CPkeyをシートから取得
   - memberId, deviceId, cipherText に欠落があれば戻り値「指定項目不足」を返して終了
   - memberIdから対象者のMemberインスタンスを取得、シートに無かった場合は戻り値「対象者不在」を返して終了<br>
     "member = member.[getMember](Member.md#member_getmember)(memberId)"
   - deviceIdから対象機器のCPkeyを取得。未登録なら戻り値「機器未登録」を返して終了
3. 復号
   - 復号失敗なら戻り値「復号失敗」を返して終了
4. 署名検証
   - 以下が全部一致しなかったなら戻り値「不正署名」を返して終了
     - 復号により現れた署名
     - [decryptedRequest](decryptedRequest.md#decryptedrequest_members).[request](authRequest.md#authrequest_members).signature
     - member.[device](MemberDevice.md#memberdevice_members)[n].CPkey<br>
      ※ "n"はdeviceIdから特定
5. 時差判定
   - 復号・署名検証直後に timestamp と Date.now() の差を算出し、
     [authServerConfig](authServerConfig.md#authserverconfig_members).allowableTimeDifference を超過した場合、戻り値「時差超過」を返して終了
6. 戻り値「正常終了」を返して終了
   - "request"には復号した[encryptedRequest](encryptedRequest.md#encryptedrequest_members).ciphertext(=JSON化したauthRequest)をオブジェクト化してセット
   - "status"にはdeviceId[n].statusを、deviceIdが見つからない場合はmember.statusをセット

#### <span id="cryptoserver_decrypt_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不正文字列 | CPkey | 対象者不在 | 機器未登録 | 復号失敗 | 指定項目不足 | 不正署名 | 時差超過 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — | — | — | — | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — | — | — | — | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — | — | — | — | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — | — | — | — | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — | — | — | — | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — | — | — | — | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — | — | — | — | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — | — | — | — | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | — | — | — | — | — | — | — | — |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — | — | — | — | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — | — | — | — | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("invalid string")** | **"CPkey"** | **dev.error("not exists")** | **dev.error("device not registered")** | **dev.error("decrypt failed")** | **dev.error("missing fields")** | **dev.error("invalid signature")** | **dev.error("timestamp difference too large")** | **[member.device[n]](MemberDevice.md#memberdevice_members).status or [member](Member.md#member_members).status** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — | — | — | — | — | — | — |
### <span id="cryptoserver_encrypt"><a href="#cryptoserver_methods">🧱 cryptoServer.encrypt()</a></span>

#### <span id="cryptoserver_encrypt_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| response | [authResponse](authResponse.md#authresponse_members) | <span style="color:red">必須</span> |  | 暗号化対象オブジェクト |

#### <span id="cryptoserver_encrypt_process">🧾 処理手順</span>

#### <span id="cryptoserver_encrypt_returns">📤 戻り値</span>

- [encryptedResponse](encryptedResponse.md#encryptedresponse_members)

Error: Error: not fixed: "encryptedResponse"
### <span id="cryptoserver_generatekeys"><a href="#cryptoserver_methods">🧱 cryptoServer.generateKeys()</a></span>

#### <span id="cryptoserver_generatekeys_params">📥 引数</span>

- 引数無し(void)

#### <span id="cryptoserver_generatekeys_process">🧾 処理手順</span>

#### <span id="cryptoserver_generatekeys_returns">📤 戻り値</span>

- null : 正常終了時

- Error : 異常終了時(messageはシステムメッセージ)