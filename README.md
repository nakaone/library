<p style="font-size:2rem;text-shadow:2px 2px 4px #888;">独自ライブラリ</p>

<details><summary>今後の改訂案</summary>

- browser/component/consoleに分ける必要はない<br>
  - 一つのcoreでwebAppやconsoleが有ったり無かったりして、管理が煩雑
- ビルダの処理が想定以上にコンポーネントにより幅があり、一律updateComponent.shでは処理しきれない
- 無理に一つのhtmlにする必要はない

⇒ コンポーネント毎にフォルダを作成、以下に役割毎のファイルを作成する

```
/library/component/zeimu
┣ readme.md(.html) - 仕様書
┣ webApp.html - サンプル、Webアプリ
┣ core.js - コアとなるスクリプト
┣ GAS.js - コアとなるスクリプト(GAS側の処理)
┣ GASLib.js - GAS.jsから参照するGASライブラリ
┣ console.js - コンソール実行形式(使用するコンポーネントは参照する)
┣ update.sh/js - Markdown等の文書、Webアプリ(SPA)、コンソール実行形式の更新
┣ xxx.html - Webアプリ(ライブラリ埋込版)
┣ xxx.js - コンソール実行形式(ライブラリ埋込版)
┣ doc/ - readmdから参照する仕様書(部分)
┃ ┣ GAS.md - jsdoc2md GAS.js の出力結果
┃ ┗ GASLib.md - jsdoc2md GASLib.js の出力結果
┗ ref/ - 画像等、使用する外部ファイル
```

</details>

# ショートカット

| [component](component/README.md) | [GAS](GAS/README.md) | [console](console/README.md) | browser | [external](external/README.md) | [szLib](console/szLib/szLib.md) | [CommonJS](console/CommonJS/CommonJS.md) | [Tips](console/tips/tips.html)

## webアプリ

| 名称 | 概要 |
| :-- | :-- |
| [cryptico](external/cryptico.html) | 鍵ペアの生成 |
| [gSpreadTabulize](component/gSpreadTabulize.html) | GAS関数jsonRangeの出力からHTMLのテーブルを作成 |
| [mergeDeeply](component/mergeDeeply.html) | オブジェクトのプロパティを再帰的にマージ |
| [querySelector](component/querySelector.html) | HTMLの指定CSSセレクタの内容を抽出 |
| [webScanner](component/webScanner.html) | QRコードや文書をスキャン |

# 開発・運用方針

1. ドキュメントはJSDocでソースに埋め込む
1. テスト仕様・ツールもソースと同一のコンポーネントに保存する
1. CSS, HTML, JavaScriptは一つのコンポーネントにまとめる
1. 実際に使用するツールは埋め込むべきコンポーネントを指定するテンプレートから生成する

<details><summary>方針の背景になる考え方</summary>

## 課題

1. メニューなど、一つの機能はCSS/HTML/Scriptから成るが、一元管理がしにくい<br>
   ドキュメント・テスト(仕様・スクリプト)は特に散逸しやすい
1. MarkDownで出力できない(できるはずだが試行錯誤でめげた)
1. Mermaid等の拡張機能をJSDocに入れることは困難
1. JSDocの@typeDefの記述は一箇所だが、参照は多くの場合入力・出力の2箇所、またはそれ以上になる
1. JSDocの出力ファイルが多く、管理が煩雑(README.mdからの参照が複雑)

## 対応

- VueライクにCSS/HTML/Scriptを一つのファイルにまとめる
- 文書は基本JSDocで残す。JSDocで表現しにくい図(Mermaid等)はMarkDownで記述可能にする
- テスト仕様およびツールも同一ファイルに残す
- 「表示モード」を設定、以下のように制御する
  - Doc : JSDoc + 補足説明を表示
  - Test : テスト用画面を表示。consoleでテストする場合は割愛
  - App : オンラインツール画面を表示
- ソース修正時は"update.js"を実行し、ライブラリおよび単体実行用(Node.js)ファイルを更新

## 補足

- 他コンポーネントで定義したオブジェクトへの参照が定義できないが、これは暫定的に補足説明に追記することで対応

</details>

# フォルダ・ファイル構成

- archive：旧版保存用。継承する機能が作成されたら削除
- browser：ブラウザ(html)で使用。
  - README.MD：GASフォルダ配下の目録
  - xxx：
    - xxx.sh：generator.jsを使用し、xxx.yyを生成するツール
    - xxx.template.yy：componentを埋め込むテンプレート。拡張子(yy)はhtml,js,gs等
    - xxx.md：jsdoc2mdで生成されたドキュメント
    - xxx.yy：xxx.shによって生成された成果物
  - szLib.js：ブラウザでの動作確認のため、ブラウザで使用する全コンポーネントを集めたライブラリ
  - szLib.css：共通CSS(console,GASには無し)
- component：xxx.html, xxx.js, xxx.css等。言語不問。未テストは".js"のまま保存
  - szLib.css：共通CSS
  - CommonJS.js：コンソールでの動作確認のため、コンソールで使用する全コンポーネントを集めたライブラリ
  - GASLib.js：GASでの動作確認のため、GASで使用する全コンポーネントを集めたライブラリ
- console：コンソール(Node.js)で使用。配下の構成はbrowserと同じ
  - CommonJS.js：component/CommonJS.jsのハードリンク
  - szLib/：szLib.js作成用フォルダ。中のszLib.sh実行でszLib.jsが更新される
  - CommonJS/：CommonJS.js作成用フォルダ。中のCommonJS.sh実行でCommonJS.jsが更新される
- external：外部から導入したライブラリ
- GAS：Google Apps Scriptで使用。配下の構成はbrowserと同じ
- tools：libraryの運用で使用するツール類
  - embedComponent.js：テンプレートに指定componentを埋め込む
- README.MD：運用手順等、library横断の情報とGAS/console/htmlへのリンクを記載

## 注意事項

- componentにはszLib.jsを置かない<br>
  ∵szLibには更新対象となる自分自身のソースも含まれるので宣言が二重になる
- tools直下の更新に必要なツールは他のライブラリを参照せず、またハードリンクも行わない<br>
  ∵ツール自身や参照先ライブラリの更新に使用すると、ツール自身が更新されてしまい動作が不安定になる場合がある
- [参考]ハードリンクされているファイルを探す：`find . -samefile console/szLib/szLib.js`
