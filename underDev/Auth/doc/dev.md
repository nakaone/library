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
    const v = {whois:`${this.constructor.name}.constructor`, arg:{arg}, rv:null};
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
├── archives        // バックアップファイル(Git対象外)
├── deploy          // ブラウザ・GASに実装するソースファイル集
├── devlog.md       // 開発履歴
├── doc             // 仕様書集 ※buildの都度クリアして作成
├── jest.config.js  // Jestの動作設定
├── src
│   ├── library     // ライブラリ(シンボリックリンク)
│   ├── client      // クライアント側ソースファイル集
│   ├── doc         // 仕様書(原本・パーツ) ※buildの都度、これを加工してdocに出力
│   └── server      // サーバ側ソースファイル集
├── tmp
└── tools
    ├── archives.sh // バックアップファイルを作成(除、archives/,tmp/)
    ├── build.sh    // ソース・仕様書を作成
    ├── mdTable.sh  // クリップボードのTSVからMarkdownの表を作成
    ├── specify.mjs // クラス定義から各クラスの仕様書を作成
    └── test.sh     // Jestテストを実行
```

## テスト環境

- import時、ファイルのパス指定を容易にするため`src/library`を置き、そこに引用元ソースファイルのシンボリックリンクを作成する

## 変更履歴

- build0002: Jest用意
  - JestからauthClient.execに発行、そのまま返す
- build0001: 仕様書作成(α版)
  - 2025.12.09 とりあえず版完成、ChatGPTレビュー済