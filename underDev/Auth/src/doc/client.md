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

<!--::$tmp/list.md::-->