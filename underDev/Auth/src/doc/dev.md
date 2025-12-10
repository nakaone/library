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



## 変更履歴

- build0002: Jest用意
  - JestからauthClient.execに発行、そのまま返す
- build0001: 仕様書作成(α版)
  - 2025.12.09 とりあえず版完成、ChatGPTレビュー済