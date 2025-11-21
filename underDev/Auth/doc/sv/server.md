<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# authサーバ側仕様書

## 実装イメージ

```html

```

## クラス一覧

| No | 名称 | 概要 |
| --: | :-- | :-- |
| 1.00 | [authAuditLog](authAuditLog.md#authauditlog_members) | authServerの監査ログ |
| 1.01 | <span style="padding-left:2rem">[constructor](authAuditLog.md#authauditlog_constructor)</span> | コンストラクタ |
| 2.00 | [authConfig](authConfig.md#authconfig_members) | authClient/authServer共通設定値 |
| 2.01 | <span style="padding-left:2rem">[constructor](authConfig.md#authconfig_constructor)</span> | コンストラクタ |
| 3.00 | [authError](authError.md#autherror_members) | auth専用エラーオブジェクト |
| 3.01 | <span style="padding-left:2rem">[constructor](authError.md#autherror_constructor)</span> | コンストラクタ |
| 4.00 | [authErrorLog](authErrorLog.md#autherrorlog_members) | authServerのエラーログ |
| 4.01 | <span style="padding-left:2rem">[constructor](authErrorLog.md#autherrorlog_constructor)</span> | コンストラクタ |
| 5.00 | [authRequest](authRequest.md#authrequest_members) | サーバ側で復号されたクライアントからの処理要求 |
| 5.01 | <span style="padding-left:2rem">[constructor](authRequest.md#authrequest_constructor)</span> | コンストラクタ |
| 6.00 | [authResult](authResult.md#authresult_members) | auth内メソッドの標準的な戻り値 |
| 6.01 | <span style="padding-left:2rem">[constructor](authResult.md#authresult_constructor)</span> | コンストラクタ |
| 7.00 | [authServerConfig](authServerConfig.md#authserverconfig_members) | authServer専用の設定値 |
| 7.01 | <span style="padding-left:2rem">[constructor](authServerConfig.md#authserverconfig_constructor)</span> | コンストラクタ |
| 8.00 | [encryptedRequest](encryptedRequest.md#encryptedrequest_members) |  |
| 8.01 | <span style="padding-left:2rem">[constructor](encryptedRequest.md#encryptedrequest_constructor)</span> | コンストラクタ |
