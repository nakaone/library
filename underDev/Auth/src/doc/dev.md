# auth開発・システム関係仕様書

## クラス・メソッド プロトタイプ

```js
/**
 * @class
 * @classdesc
 * @prop {string} fuga - ダミー
 */
export class authProto {

  static _XXX = null;

  /**
   * @constructor
   * @param {string} arg - 引数
   */
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

  /**
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
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

- build0006: 処理要求の暗号化
  - cryptoClient.constructor(), .encrypt()のみ作成
  - authClient.cryptoメンバ作成(@constructor)
  - localRequestクラスを作成、authClient.execメソッドに組み込み
- === いまここ =====
- build0005: 初回HTMLロード時処理
  - 仕様書修正
    - specification.md
      - 暗号化・署名方式
        - requestId -> nonce
        - replay cache -> authScriptProperties.requestLog(TTL管理)
      - I/O項目対応表
    - authRequest
    - encryptedRequest
    - authResponse
    - encryptedResponse
    - authClient
    - cryptoClient
    - cryptoServer
  - ソース作成
    - specDefを元にJSDocを追記　◀いまここ
    - サーバ側ダミークラス作成
      - authResponse
      - authServer
      - authServerConfig
      - cryptoServer
      - Member
  - b0005.test.mjs作成
  - 【保留】[bug] cryptoClient:"Error: Error: not fixed: "encryptedRequest""
    原因不明。cryptoClient.encrypt(), cryptoServer.encrypt()で発生。
    両方ともリンクは出来ており、実害は無いため対応保留。
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