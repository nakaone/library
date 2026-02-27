<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
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

[総説](readme.md) | [共通仕様](common/index.md) | [クライアント側仕様](client/index.md) | [サーバ側仕様](server/index.md) | [開発仕様](dev.md)

</div>

<p class="l1">"auth"開発・システム関係仕様書</p>

| [変更履歴](#log) | [フォルダ構成](#folder) | [build.sh](#build) | [GCP Prj作成](#GCP) | [GASデプロイ](#GASdeploy) |

# <span id="log">変更履歴</span>

- build0010: SPkey取得
  - authClientでauthRequest(SPkey要求)作成
  - authServerで受信、内容確認
  - authServerでauthResponse作成
  - authClientで受信、内容確認、格納

<!--
[bug] Markdownからexampleが抜けている
[bug] データ型にリンクが付けられていない
  Schema.types {Object.<string, TypeDef>} ⇒ TypeDefにリンクが未設定
[bug] DocletTree.mapにおかしなキーがある
  "/common/config.mjs::config
  - 複数のライブラリを使用可能にするため、第一レベルはアプリ名とする
  - 秘匿情報はここで設定せず、アプリ側で追加・修正する", // string
[bug] _withStore引数の説明が意味不明
[bug] exec引数anyの要否/既定値欄が'['のみで意味不明
[bug] getIndexedDB引数の項目名が空欄

[warn] exec()のラベル・概説の内容が全く同じ。概説は削除した方がベター
[warn] ラベル冒頭のクラス・関数名は削除した方がベター
[warn] authClient.constructorのラベルが"constructor"だけなら削除した方がベター
[warn] 「constructor 概説」の内容が"constructor"だけなら削除した方がベター


-->

=== いまここ =========================================
- build0009: 仕様書とソースの一体化<br>
  specDef.js + specify.mjs では仕様書とソース(JSDoc)の乖離で管理工数・不一致が増大<br>
  ⇒ createSpec.mjsでソースはJSDocに一本化する。
  - src/client
    - □ authClient.mjs: 出力内容確認
    - □ cryptoClient.mjs: 出力内容確認
    - □ localFunc.mjs: 出力内容確認
    - □ onLoad.mjs: 出力内容確認
  - src/common
    - □ authConfig.mjs: 出力内容確認
    - □ config.mjs: 出力内容確認
  - src/server
    - □ authServer.mjs: 出力内容確認
    - □ cryptoServer.mjs: 出力内容確認
    - □ Member.mjs: 出力内容確認
    - □ onOpen.mjs: 出力内容確認
    - □ serverFunc.mjs: 出力内容確認
  - tools.mjs: 出力内容確認
    - □ config.mjs: いる？
  - □ src/common/specDef.js: 不足分を反映
- build0008: 初回HTMLロード時処理
  - authClient動作確認
  - config構成見直し(20260118_configブランチ)
  - authServer.setupEnvironment(menu21)
    - [bug] authConfig.typedef step.1.1 : Error: argument "obj" must be object.
    - [bug] authConfig.columndef step.3 : Error: "response" is invalid type.
    - [bug]authConfig.typedef step.1.2 : Error: cols must be array of length 1 or greater.
    - [bug]authServer.constructor step.1.2 : Error: "func" is not specified.
    - [bug]cryptoServer.constructor step.2
      TypeError: Cannot read properties of undefined (reading 'getProperty')
    - [bug]cryptoServer.generateKeys step.1 : ReferenceError: crypto is not defined
    - ReferenceError: navigator is not defined @ jsrsasign.gs:197
    - [bug] this.cf.RSAbitsが参照できない
      - jsrsasign仕様に変更
      - cryptoServerソース修正
    - cryptoServer.initialize: サーバ側鍵ペア生成結果を出力
    - menu21見直し
  - authServer.resetSPkey実装
    - [bug]Member.constructor step.2.5
      TypeError: Cannot read properties of undefined (reading 'func')
    - [bug]Member.constructor step.2.7
      Error: unregistered member access
  - authServer.dumpProperties実装
    - Uncaught SyntaxError
      : Failed to execute 'write' on 'Document'
      : Identifier 'config' has already been declared
    - Webアプリ（GAS）のデプロイ・キャッシュ問題
  - authClient.execでSPkey取得
    - [bug]authClient.initialize step.1
      ReferenceError: authClientConfig is not defined
    - IndexedDBクリアボタン追加(clearAuthEnvironment)
  - authServer.setupEnvironment(menu21)
- build0007: 疎結合⇒密結合<br>
  従来の開発内容を密結合方式を前提に書き換え
  - doGet追加、authServer/Client修正
  - フォルダ構成修正(src/common追加、src/doc削除)
  - config.js追加(authConfig必須パラメータ)
  - schemaDefにSchemaクラス適用
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

# <span id="folder">フォルダ構成</span>

- 🔁 : buildの都度クリア・再作成されるフォルダ

```
.
├── archives        // バックアップファイル(Git対象外)
├── deploy          // 🔁ブラウザ・GASに実装するソースファイル集
├── doc             // 🔁仕様書集
├── src
│   ├── client      // クライアント側ソースファイル集
│   ├── common      // クライアント側ソースファイル集
│   ├── doc         // 仕様書(原本・パーツ)
│   │   ├── appsscript.json  // clasp用設定ファイル(控)
│   │   ├── .clasp.json      // clasp用設定ファイル(控)
│   │   ├── jsrsasign-all-min.js  // RSAライブラリ
│   │   ├── *.md    // 各種仕様書(パーツ埋込前のprototype)
│   │   └── *.svg   // 仕様書に使用する図表
│   └── server      // サーバ側ソースファイル集
├── tmp             // 🔁build.shで使用する一時ファイル置き場
└── tools
    ├── archives.sh // バックアップファイルを作成(除、archives/,tmp/)
    ├── build.sh    // ソース・仕様書を作成
    └── mdTable.sh  // クリップボードのTSVからMarkdownの表を作成
```

# <span id="build">build.sh</span>

## ソース関係生成手順

![](img/dev.build.source.svg)

## 仕様書関係生成手順

![](img/dev.build.doc.svg)

# <span id="GCP">GCP プロジェクト作成手順（Apps Script / Cloud Logging 用）</span>

Apps Script（GAS）で WebApp を開発し、`console.log()` 等のログを **Cloud Logging** で確認することを目的としています。

---

## 前提

- Google アカウントを所持していること
- Google Apps Script プロジェクトを既に作成済みであること
- クレジットカード登録は **不要**（無料枠内）

---

## 手順概要

1. GCP プロジェクトを新規作成
2. Apps Script プロジェクトと GCP プロジェクトを紐付け
3. Cloud Logging でログを確認
4. （任意）ログのエクスポート

---

## 手順1：GCP プロジェクトを新規作成

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

## 手順2：Apps Script と GCP プロジェクトを紐付け

### 2-1. Apps Script エディタを開く

1. https://script.google.com/ にアクセス
2. 対象の Apps Script プロジェクトを開く

### 2-2. GCP プロジェクトを変更

1. 右上の **歯車アイコン（⚙ プロジェクトの設定）** をクリック
2. 「**Google Cloud Platform（GCP）プロジェクト**」欄を探す
3. 「**プロジェクトを変更**」をクリック
4. 手順1で作成した GCP プロジェクトを選択
5. 保存

⚠️ これで **デフォルト GCP プロジェクトから切り離されます**

---

## 手順3：Cloud Logging を有効化（初回のみ）

通常は自動で有効になりますが、ログが出ない場合は以下を確認します。

1. GCP コンソールでプロジェクトを選択
2. 左メニュー → **Logging** → **ログエクスプローラ**
3. 初回アクセス時は API 有効化を求められるので承認

---

## 手順4：GAS のログを確認する

### 4-1. WebApp 実行ログを見る

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

## 手順5：GAS 側のログ出力例

```js
function doPost(e) {
  console.log("doPost called");
  console.log(JSON.stringify(e.postData));
  return ContentService.createTextOutput("ok");
}
```

このログは **Cloud Logging に自動送信** されます。

---

## 補足1：GCP プロジェクト数の制限

- 無料で **複数プロジェクト作成可能**
- 明確な「3つまで」等の制限はなし
- 個人利用・OSS用途なら実質無制限

---

## 補足2：GCP を使わずにログを見る方法は？

| 方法 | 状況 |
|----|----|
| Apps Script「実行」画面 | WebApp では **ほぼ見えない** |
| Logger.log | 新エディタでは非推奨 |
| Cloud Logging | **唯一の安定解** |

➡️ **OSS化・第三者利用を考えるなら Cloud Logging 前提が現実的**

---

## 補足3：ログをローカルに保存したい場合

完全自動DLは不可ですが、以下は可能：

- Cloud Logging → CSV / JSON エクスポート
- BigQuery / Cloud Storage 連携（上級）

---

## まとめ

- clasp + WebApp 開発では **GCP プロジェクト作成は事実上必須**
- 一度設定すれば以後は意識不要
- README にこの手順を入れておくと利用者が詰まらない

# <span id="GASdeploy">GASデプロイ</span>

1. 「デプロイ > 新しいデプロイ」
2. 開発中：「デプロイ > デプロイをテスト」
   - ウェブアプリの開発はこの画面のURLで行う
   - エンドポイントもこちらのURLを使用する
3. 本番時：「デプロイ > デプロイを管理」
   - 鉛筆アイコンから「バージョン：新バージョン」を選択してデプロイ
   - エンドポイントはデプロイを管理画面のURLに書き換え
