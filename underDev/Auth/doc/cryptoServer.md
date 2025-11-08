<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="cryptoserver">cryptoServer クラス仕様書</span>

## <span id="cryptoserver_summary">🧭 概要</span>

サーバ側の暗号化・復号処理

- 認証サーバ ([authServer](authServer.md)) から独立した復号・署名検証処理モジュール。
- クライアント側仕様書([cryptoClient](cryptoClient.md))と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
- 暗号化ライブラリは"jsrsasign"を使用
- 以下"cf","prop","crypto","member","auditLog","errorLog","pv"はauthServer内共通のインスタンス変数

### <span id="cryptoserver_policy">設計方針</span>

- 署名→暗号化(Sign-then-Encrypt)方式に準拠
- 鍵ペアは[ScriptProperties](authScriptProperties.md)に保存("SSkey", "SPkey")
- ScriptPropertiesのキー名は"[authServerConfig](authServerConfig.md#authserverconfig_internal).system.name"に基づく
- 復号処理は副作用のない純関数構造を目指す(stateを持たない)
- 可能な範囲で「外部ライブラリ」を使用する
- timestamp検証は整数化・絶対値化してから比較する

#### <a name="security">🔐 セキュリティ仕様</a>

| 項目 | 対策 |
|------|------|
| **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
| **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
| **ログ漏えい防止** | 復号データは一切記録しない |
| **エラー通知スパム** | メンバ単位で送信間隔を制御 |
| **鍵管理** | SSkey/SPkey は ScriptProperties に格納し、Apps Script内でのみ参照可 |

### 🧩 <span id="cryptoserver_internal">内部構成</span>


🧱 <span id="cryptoserver_method">cryptoServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#cryptoserver_constructor) | private | コンストラクタ |
| [decrypt](#cryptoserver_decrypt) | public | authClientからのメッセージを復号＋署名検証 |
| [encrypt](#cryptoserver_encrypt) | public | authClientへのメッセージを署名＋暗号化 |

## <span id="cryptoserver_constructor">🧱 <a href="#cryptoserver_method">cryptoServer.constructor()</a></span>

コンストラクタ

### <span id="cryptoserver_constructor_caller">📞 呼出元</span>

- [authServer.constructor()](authServer.md#cryptoserver_constructor)

### <span id="cryptoserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | authServerの動作設定変数 | 

### <span id="cryptoserver_constructor_process">🧾 処理手順</span>



### <span id="cryptoserver_constructor_returns">📤 戻り値</span>

  - [cryptoServer](cryptoServer.md#cryptoserver_internal): サーバ側の暗号化・復号処理
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |

## <span id="cryptoserver_decrypt">🧱 <a href="#cryptoserver_method">cryptoServer.decrypt()</a></span>

authClientからのメッセージを復号＋署名検証

- 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す
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
  ```

### <span id="cryptoserver_decrypt_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#cryptoserver_decrypt)

### <span id="cryptoserver_decrypt_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | string \| [encryptedRequest](encryptedRequest.md#encryptedrequest_internal) | — | クライアント側からの暗号化された処理要求 | 

### <span id="cryptoserver_decrypt_process">🧾 処理手順</span>

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
     - [decryptedRequest](decryptedRequest.md#decryptedrequest_internal).[request](authRequest.md#authrequest_internal).signature
     - member.[device](MemberDevice.md#memberdevice_internal)[n].CPkey<br>
      ※ "n"はdeviceIdから特定
5. 時差判定
   - 復号・署名検証直後に timestamp と Date.now() の差を算出し、
     [authServerConfig](authServerConfig.md#authserverconfig_internal).allowableTimeDifference を超過した場合、戻り値「時差超過」を返して終了
6. 戻り値「正常終了」を返して終了
   - "request"には復号した[encryptedRequest](encryptedRequest.md#encryptedrequest_internal).ciphertext(=JSON化したauthRequest)をオブジェクト化してセット
   - "status"にはdeviceId[n].statusを、deviceIdが見つからない場合はmember.statusをセット

### <span id="cryptoserver_decrypt_returns">📤 戻り値</span>

  - [decryptedRequest](decryptedRequest.md#decryptedrequest_internal): 復号済の処理要求
    | 項目名 | データ型 | 生成時 | 不正文字列 | CPkey | 対象者不在 | 機器未登録 | 復号失敗 | 指定項目不足 | 不正署名 | 時差超過 | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
    | result | string | "normal" | **"fatal"** | **"warning"** | **"fatal"** | **"fatal"** | **"fatal"** | **"fatal"** | **"fatal"** | **"fatal"** | — |
    | message | string | 【任意】 | **"invalid string"** | **"maybe CPkey"** | **"not exists"** | **"device not registered"** | **"decrypt failed"** | **"missing fields"** | **"invalid signature"** | **"timestamp difference too large"** | — |
    | request | authRequest | 【任意】 | — | **request** | — | — | — | — | — | — | **[authRequest](authRequest.md#authrequest_internal)** |
    | timestamp | number | Date.now() | — | — | — | — | — | — | — | — | — |
    | status | string | 【任意】 | — | — | — | — | — | — | — | — | **[member.device[n]](MemberDevice.md#memberdevice_internal).status or [member](Member.md#member_internal).status** |

## <span id="cryptoserver_encrypt">🧱 <a href="#cryptoserver_method">cryptoServer.encrypt()</a></span>

authClientへのメッセージを署名＋暗号化

- [authResponse](authResponse.md#authresponse_internal).signatureは省略せず明示的に含める
- 暗号化順序は Sign-then-Encrypt
- 復号側([cryptoClient](cryptoClient.md))では「Decrypt-then-Verify」
- 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す

### <span id="cryptoserver_encrypt_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| response | ❌ | [authResponse](authResponse.md#authresponse_internal) | — | 暗号化対象オブジェクト | 

### <span id="cryptoserver_encrypt_process">🧾 処理手順</span>



### <span id="cryptoserver_encrypt_returns">📤 戻り値</span>

  - [encryptedResponse](encryptedResponse.md#encryptedresponse_internal): 暗号化された処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | ciphertext | string | 【必須】 | — |