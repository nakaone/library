## Functions

<dl>
<dt><a href="#preProcess">preProcess(token)</a> ⇒ <code><a href="#fetchResponse">fetchResponse</a></code></dt>
<dd><p>doPostの内容を受けて処理を分岐</p>
</dd>
<dt><a href="#auth1A">auth1A(arg)</a> ⇒ <code>string</code></dt>
<dd><p>認証局での認証の第一段階</p>
</dd>
<dt><a href="#auth1B">auth1B(arg)</a> ⇒ <code>void</code></dt>
<dd><p>管理局での認証の第一段階</p>
</dd>
<dt><a href="#auth2A">auth2A(arg)</a> ⇒ <code>Object</code></dt>
<dd><p>認証局での認証の第二段階</p>
</dd>
<dt><a href="#auth2B">auth2B(arg)</a> ⇒ <code>Object</code></dt>
<dd><p>管理局での認証の第二段階</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#token">token</a> : <code>Object</code></dt>
<dd><p>doPostからpreProcessに渡されるオブジェクト</p>
</dd>
<dt><a href="#AuthArg">AuthArg</a> : <code>Object</code></dt>
<dd><p>preProcessからauth/recept1A/1B/2A/2Bに渡されるオブジェクト</p>
</dd>
<dt><a href="#fetchResponse">fetchResponse</a> : <code>Object</code></dt>
<dd><p>auth1A/1B/2A/2BからpreProcess経由で呼出元に返されるオブジェクト</p>
</dd>
</dl>

<a name="preProcess"></a>

## preProcess(token) ⇒ [<code>fetchResponse</code>](#fetchResponse)
doPostの内容を受けて処理を分岐

**Kind**: global function  
**Returns**: [<code>fetchResponse</code>](#fetchResponse) - 処理結果  

| Param | Type | Description |
| --- | --- | --- |
| token | [<code>token</code>](#token) | doPostから渡されたトークン |

<a name="auth1A"></a>

## auth1A(arg) ⇒ <code>string</code>
認証局での認証の第一段階

**Kind**: global function  
**Returns**: <code>string</code> - 認証局の公開鍵(fetchResponse.result)  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>AuthArg</code>](#AuthArg) | クライアントの受付番号、公開鍵他 |

<a name="auth1B"></a>

## auth1B(arg) ⇒ <code>void</code>
管理局での認証の第一段階

**Kind**: global function  
**Returns**: <code>void</code> - 特に無し(fetchResponse.isErrのみ必要)  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>AuthArg</code>](#AuthArg) | クライアントの受付番号、公開鍵他 |

<a name="auth2A"></a>

## auth2A(arg) ⇒ <code>Object</code>
認証局での認証の第二段階

**Kind**: global function  
**Returns**: <code>Object</code> - - fetchResponse.result={common:共通鍵,info:クライアント情報}

## 注意事項

clientからのtokenは署名されているが、認証局はclientのpublicKeyを
持たないので検証は省略し、そのまま管理局に送って管理局側で検証する。  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>AuthArg</code>](#AuthArg) | クライアントの受付番号、公開鍵他 |

<a name="auth2B"></a>

## auth2B(arg) ⇒ <code>Object</code>
管理局での認証の第二段階

**Kind**: global function  
**Returns**: <code>Object</code> - - fetchResponse.result=クライアントの登録情報  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>AuthArg</code>](#AuthArg) | クライアントの受付番号、パスコード、送信日時、公開鍵他 |

<a name="token"></a>

## token : <code>Object</code>
doPostからpreProcessに渡されるオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| fm | <code>string</code> | 発信者名(gateway/master/受付番号) |
| to | <code>string</code> | 宛先名(gateway/master) |
| md | <code>number</code> | モード。0:平文、1:共通鍵、2:RSA署名無し、3:RSA署名有り |
| ts | <code>number</code> | 発信日時(new Date().getTime()) |
| dt | <code>string</code> | 以下の要素をJSON化した上で暗号化した文字列(cipher) |
| dt.fc | <code>string</code> | 呼出先の処理名(ex."auth1A") |
| dt.arg | <code>any</code> | 呼出先の処理に渡す引数 |

<a name="AuthArg"></a>

## AuthArg : <code>Object</code>
preProcessからauth/recept1A/1B/2A/2Bに渡されるオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| fm | <code>string</code> | 発信者名(gateway/master/受付番号) |
| to | <code>string</code> | 宛先名(gateway/master) |
| md | <code>number</code> | モード。0:平文、1:共通鍵、2:RSA署名無し、3:RSA署名有り |
| ts | <code>number</code> | 発信日時(new Date().getTime()) |
| fc | <code>string</code> | 復号化済の呼出先の処理名(ex."auth1A") |
| dt | <code>any</code> | 呼出先の処理に渡す引数。復号化済のtoken.dt.arg |
| signature | <code>string</code> | 以下はpreProcessでの追加項目。署名付き暗号化だった場合、"verified" or "undefined" |
| pKey | <code>string</code> | 署名付き暗号化だった場合、署名検証で取得した発信者の公開鍵 |
| lastAccess | <code>Date</code> | 最終アクセス日時(RASシート再計算用再設定項目) |
| name | <code>string</code> | 自局名 |
| passPhrase | <code>string</code> | 自局のパスワード |
| publicKey | <code>string</code> | 自局の公開鍵 |
| masterAPI/gatewayAPI | <code>string</code> | 相手局のAPI |
| master/gateway | <code>string</code> | 相手局の公開鍵 |
| common | <code>string</code> | 共通鍵(認証局のみ) |
| random | <code>string</code> | パスコード(管理局のみ) |

<a name="fetchResponse"></a>

## fetchResponse : <code>Object</code>
auth1A/1B/2A/2BからpreProcess経由で呼出元に返されるオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| isErr | <code>boolean</code> |  | エラーならtrue |
| message | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 処理結果に対するメッセージ |
| stack | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | エラーオブジェクトのスタック |
| result | <code>any</code> |  | 処理結果 |

