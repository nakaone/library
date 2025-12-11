<style>
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](specification.md) | [クライアント側仕様](cl/client.md) | [サーバ側仕様](sv/server.md) | [JavaScriptライブラリ](JSLib.md) | [開発](dev.md)

</div>

# auth開発・システム関係仕様書

## クラス・メソッド プロトタイプ

```js
class authProto {

  static _XXX = null;

  constructor(arg) {
    const v = {whois:`authProto.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      this.pv = {}; // クラス内共用の汎用インスタンス変数

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  prototype(arg) {
    const v = {whois:`${this.constructor.name}.prototype`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}
```

## フォルダ構成

```
.
├── __tests__       // Jestテストパターン別ソースファイル集
│   └── b0004.mjs
├── archives        // バックアップファイル(Git対象外)
├── deploy          // ブラウザ・GASに実装するソースファイル集
│   └── onLoad.mjs  // クライアント側テスト用(index.htmlのonLoad)
├── devlog.md       // 開発履歴
├── doc             // 仕様書集 ※buildの都度クリアして作成
├── node_modules    // Auth開発関係(Jest)
├── package-lock.json // Jest用設定
├── package.json      // Jest用設定
├── src
│   ├── client      // クライアント側ソースファイル集
│   ├── doc         // 仕様書(原本・パーツ) ※buildの都度、これを加工してdocに出力
│   ├── library     // ライブラリ(シンボリックリンク)
│   └── server      // サーバ側ソースファイル集
├── tmp
└── tools
    ├── archives.sh // バックアップファイルを作成(除、archives/,tmp/)
    ├── build.sh    // ソース・仕様書を作成
    ├── mdTable.sh  // クリップボードのTSVからMarkdownの表を作成
    ├── specify.mjs // クラス定義から各クラスの仕様書を作成
    └── test.sh     // Jestテストを実行
```

- test.shはtoolsをカレントディレクトリとして起動

## build.sh

### ソース関係生成手順

![](img/dev.build.source.svg)

### 仕様書関係生成手順

![](img/dev.build.doc.svg)

## 変更履歴

- build0004: authClient.initialize/setIndexedDB作成
  - 【派生】クラス・関数ソースのES Module化＋ Jest から Vitest に変更<br>
    最終成果物に合わせて関連クラス・関数は埋め込むようにしてきたが、
    Vitest(Jest)では各関数を import する必要があるためES Module化が必要。<br>
    またIndexedDBは要モック化等、各クラス・関数は別ファイル化した方が運用しやすい。<br>
    このため以下の対応を行う。
    - クラス・関数ソースにexport文追加
    - src/client/onLoad.jsはonloadのみに絞り込み
    - src/client/index.htmlにクラス・関数ソースの埋込指示追加
    - localFuncを別ファイル化
    - build.shを上の「build.sh」に合わせるよう修正
  - authClientConfigに`{storeName:'config',dbVersion:1}`を追加
  - localFuncでのauthClientインスタンス作成方法変更
  - テスト終了後、specDef.js(authClient,authIndexedDB)を修正
- build0003: authClientインスタンス作成時、authClientConfigを読み込み
  - authClientConfigの既定値が設定されるか
  - 引数を与えた場合、それが反映されるか
- build0002: Jest用意
  - JestからauthClient.execに発行、そのまま返す
- build0001: 仕様書作成(α版)
  - 2025.12.09 とりあえず版完成、ChatGPTレビュー済
