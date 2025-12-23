# auth開発・システム関係仕様書

## 変更履歴

- build0008: 初回HTMLロード時処理<br>
  従来の開発内容を密結合方式を前提に書き換え
  - Client/ServerAdapterクラス設計
  - Client/ServerDBクラス設計
  - 変更箇所の明確化
    - authAudit/ErrorLog
    - Member
    - authClient / authServer
    - cryptoClient / cryptoServer
  - 移行・書き換え
- build0007: 疎結合⇒密結合
  - Schemaのデータ構造検討(Schema ver.1.3.0作成)   ◀いまここ
  - 現状(typedef.js)からschema.jsへの移行
- build0006: 【中止】初回HTMLロード時処理
  - fetchはGoogleの仕様でCORSエラー発生、回避不能が判明
  - 疎結合から密結合(Google Spreadコンテナバインド方式)に方針転換
- build0005: 一連のソースを作成
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
    - specDefを元にJSDocを追記
    - サーバ側クラス作成
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

## GCP プロジェクト作成手順（Apps Script / Cloud Logging 用）

Apps Script（GAS）で WebApp を開発し、`console.log()` 等のログを **Cloud Logging** で確認することを目的としています。

---

### 前提

- Google アカウントを所持していること
- Google Apps Script プロジェクトを既に作成済みであること
- クレジットカード登録は **不要**（無料枠内）

---

### 手順概要

1. GCP プロジェクトを新規作成
2. Apps Script プロジェクトと GCP プロジェクトを紐付け
3. Cloud Logging でログを確認
4. （任意）ログのエクスポート

---

### 手順1：GCP プロジェクトを新規作成

1. 以下にアクセス  
   https://console.cloud.google.com/

2. 画面上部の **プロジェクト選択プルダウン** をクリック

3. 「**新しいプロジェクト**」をクリック

4. 以下を入力
   - **プロジェクト名**：任意（例：`auth-dev`）
   - **組織**：個人利用なら「組織なし」でOK
   - **場所**：変更不要

5. 「**作成**」をクリック

数秒でプロジェクトが作成されます。

---

### 手順2：Apps Script と GCP プロジェクトを紐付け

#### 2-1. Apps Script エディタを開く

1. https://script.google.com/ にアクセス
2. 対象の Apps Script プロジェクトを開く

#### 2-2. GCP プロジェクトを変更

1. 右上の **歯車アイコン（⚙ プロジェクトの設定）** をクリック
2. 「**Google Cloud Platform（GCP）プロジェクト**」欄を探す
3. 「**プロジェクトを変更**」をクリック
4. 手順1で作成した GCP プロジェクトを選択
5. 保存

⚠️ これで **デフォルト GCP プロジェクトから切り離されます**

---

### 手順3：Cloud Logging を有効化（初回のみ）

通常は自動で有効になりますが、ログが出ない場合は以下を確認します。

1. GCP コンソールでプロジェクトを選択
2. 左メニュー → **Logging** → **ログエクスプローラ**
3. 初回アクセス時は API 有効化を求められるので承認

---

### 手順4：GAS のログを確認する

#### 4-1. WebApp 実行ログを見る

1. GCP コンソール → **Logging → ログエクスプローラ**
2. クエリ例：

```text
resource.type="app_script_function"
```

または WebApp のみを見る場合：

```text
resource.type="app_script_function"
logName:"webapp"
```

3. `console.log()` / `console.error()` の出力が表示される

---

### 手順5：GAS 側のログ出力例

```js
function doPost(e) {
  console.log("doPost called");
  console.log(JSON.stringify(e.postData));
  return ContentService.createTextOutput("ok");
}
```

このログは **Cloud Logging に自動送信** されます。

---

### 補足1：GCP プロジェクト数の制限

- 無料で **複数プロジェクト作成可能**
- 明確な「3つまで」等の制限はなし
- 個人利用・OSS用途なら実質無制限

---

### 補足2：GCP を使わずにログを見る方法は？

| 方法 | 状況 |
|----|----|
| Apps Script「実行」画面 | WebApp では **ほぼ見えない** |
| Logger.log | 新エディタでは非推奨 |
| Cloud Logging | **唯一の安定解** |

➡️ **OSS化・第三者利用を考えるなら Cloud Logging 前提が現実的**

---

### 補足3：ログをローカルに保存したい場合

完全自動DLは不可ですが、以下は可能：

- Cloud Logging → CSV / JSON エクスポート
- BigQuery / Cloud Storage 連携（上級）

---

### まとめ

- clasp + WebApp 開発では **GCP プロジェクト作成は事実上必須**
- 一度設定すれば以後は意識不要
- README にこの手順を入れておくと利用者が詰まらない
