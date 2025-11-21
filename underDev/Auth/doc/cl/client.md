<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# authクライアント側仕様書

## 実装イメージ

```html
<script type="text/javascript">
  // ライブラリ関数定義
  function devTools(){...}; // (中略)

  // authClient関係クラス定義
  class authClient{...}
  class authConfig{...}
  class authClientConfig{...} // (中略)

  // グローバル変数定義
  const dev = devTools();
  const acl = authClient({ // HTML要素のイベント対応のためグローバル領域でインスタンス化
    // プロジェクト毎の独自パラメータ
  });

  window.addEventListener('DOMContentLoaded', () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois, [...arguments]);
    try {


      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
```

## クラス一覧

| No | 名称 | 概要 |
| --: | :-- | :-- |
| 1.00 | [authConfig](authConfig.md#authconfig_members) | authClient/authServer共通設定値 |
| 1.01 | <span style="padding-left:2rem">[constructor](authConfig.md#authconfig_constructor)</span> | コンストラクタ |
| 2.00 | [authClient](authClient.md#authclient_members) | クライアント側中核クラス |
| 2.01 | <span style="padding-left:2rem">[constructor](authClient.md#authclient_constructor)</span> | コンストラクタ |
| 3.00 | [authClientConfig](authClientConfig.md#authclientconfig_members) | authClient専用の設定値 |
| 3.01 | <span style="padding-left:2rem">[constructor](authClientConfig.md#authclientconfig_constructor)</span> | コンストラクタ |
| 4.00 | [authError](authError.md#autherror_members) | auth専用エラーオブジェクト |
| 4.01 | <span style="padding-left:2rem">[constructor](authError.md#autherror_constructor)</span> | コンストラクタ |
| 5.00 | [authResponse](authResponse.md#authresponse_members) | クライアント側で復号されたサーバからの処理結果 |
| 5.01 | <span style="padding-left:2rem">[constructor](authResponse.md#authresponse_constructor)</span> | コンストラクタ |
| 6.00 | [encryptedRequest](encryptedRequest.md#encryptedrequest_members) |  |
| 6.01 | <span style="padding-left:2rem">[constructor](encryptedRequest.md#encryptedrequest_constructor)</span> | コンストラクタ |
| 7.00 | [LocalRequest](LocalRequest.md#localrequest_members) | ローカル関数からの処理要求 |
| 7.01 | <span style="padding-left:2rem">[constructor](LocalRequest.md#localrequest_constructor)</span> | コンストラクタ |
