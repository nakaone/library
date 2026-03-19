<p id="top" class="l1">"auth"クライアント側仕様書</p>
<div class="submenu">

[実装イメージ](#implement) | [分岐先決定手順](#procedure) | [関数・クラス](#funclassList) | [データ型](#typedefList)

</div>

# <a href="#top"><span id="implement">実装イメージ</span></a>

```html
<input type="text" id="testval" value="設定値" />
<button onclick="getValue()">実行</button>
<div id="testResult"></div>

<script type="text/javascript">
  // ライブラリ関数定義
  function devTools(){...}; // (中略)

  // authClient関係クラス定義
  class authClient{...}
  class authConfig{...}
  class authClientConfig{...} // (中略)

  // グローバル変数定義
  const dev = devTools();
  const config = {...}; // authClient/Server共通設定情報
  let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

  // 処理要求を発行するローカル関数
  function getValue(){
    try {
      const request = document.getElementById('testval').value;

      // サーバ側関数'trans01'にrequestを渡して処理要求
      const response = auth.exec('trans01',request);
      if( response instance of Error ) throw resopnse;

      document.getElementById('testResult').innerText = response;

    } catch(e) { dev.error(e); return e; }
  }

  // onLoad処理は"async"で宣言
  window.addEventListener('DOMContentLoaded', async () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // IndexedDBからの読み込み等、非同期処理を実行
      auth = await authClient.initialize({
        // プロジェクト毎の独自パラメータ
      });

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
```

# <a href="#top"><span id="procedure">クライアント側処理分岐先決定手順</span></a>

<!--::$src/doc/decisionTable.client.md::-->
