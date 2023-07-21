<p style="font-size:2rem;text-shadow:2px 2px 4px #888;">独自ライブラリ</p>

# ショートカット

| [component](component/README.md) | [GAS](GAS/README.md) | [console](console/README.md) | browser | [external](external/README.md) | [szLib](console/szLib/szLib.md) | [CommonJS](console/CommonJS/CommonJS.md) | [Tips](tips.html)

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

# コンポーネントの作成手順

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="641px" height="161px" viewBox="-0.5 -0.5 641 161"><defs/><g><path d="M 520 20 Q 520 20 447.87 20" fill="none" stroke="#cccccc" stroke-miterlimit="10" stroke-dasharray="3 3" pointer-events="stroke"/><path d="M 441.12 20 L 450.12 15.5 L 447.87 20 L 450.12 24.5 Z" fill="#cccccc" stroke="#cccccc" stroke-miterlimit="10" pointer-events="all"/><rect x="520" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 20px; margin-left: 521px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">README.md</div></div></div></foreignObject><text x="580" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">README.md</text></switch></g><path d="M 120 20 Q 120 20 152.13 20" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 158.88 20 L 149.88 24.5 L 152.13 20 L 149.88 15.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="0" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 20px; margin-left: 1px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">compA.html<br /><font style="font-size: 11px;">(CSS+Body+Script)</font></div></div></div></foreignObject><text x="60" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compA.html...</text></switch></g><path d="M 280 20 Q 280 20 312.13 20" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 318.88 20 L 309.88 24.5 L 312.13 20 L 309.88 15.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="160" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><path d="M 172 0 L 172 40 M 268 0 L 268 40" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 94px; height: 1px; padding-top: 20px; margin-left: 173px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">updateComponent.sh</div></div></div></foreignObject><text x="220" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">updateComponent.sh</text></switch></g><rect x="320" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 20px; margin-left: 321px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">compA.md</div></div></div></foreignObject><text x="380" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compA.md</text></switch></g><rect x="320" y="60" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 80px; margin-left: 321px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">compB.md</div></div></div></foreignObject><text x="380" y="85" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compB.md</text></switch></g><rect x="320" y="120" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 140px; margin-left: 321px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">compC.md</div></div></div></foreignObject><text x="380" y="145" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compC.md</text></switch></g><path d="M 520 20 Q 520 20 446.29 75.28" fill="none" stroke="#cccccc" stroke-miterlimit="10" stroke-dasharray="3 3" pointer-events="stroke"/><path d="M 440.89 79.33 L 445.39 70.33 L 446.29 75.28 L 450.79 77.53 Z" fill="#cccccc" stroke="#cccccc" stroke-miterlimit="10" pointer-events="all"/><path d="M 520 20 Q 520 20 444.36 133.45" fill="none" stroke="#cccccc" stroke-miterlimit="10" stroke-dasharray="3 3" pointer-events="stroke"/><path d="M 440.62 139.07 L 441.87 129.09 L 444.36 133.45 L 449.36 134.08 Z" fill="#cccccc" stroke="#cccccc" stroke-miterlimit="10" pointer-events="all"/><path d="M 120 80 Q 120 80 152.13 80" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 158.88 80 L 149.88 84.5 L 152.13 80 L 149.88 75.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="0" y="60" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 80px; margin-left: 1px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">compB.js</div></div></div></foreignObject><text x="60" y="85" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compB.js</text></switch></g><path d="M 280 80 Q 280 80 312.13 80" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 318.88 80 L 309.88 84.5 L 312.13 80 L 309.88 75.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="160" y="60" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><path d="M 172 60 L 172 100 M 268 60 L 268 100" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 94px; height: 1px; padding-top: 80px; margin-left: 173px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">jsdoc2md</div></div></div></foreignObject><text x="220" y="85" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">jsdoc2md</text></switch></g></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://www.drawio.com/doc/faq/svg-export-text-problems" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot display</text></a></switch></svg>

1. componentを原則HTML形式で作成
   1. component/prototype.htmlをcomponent/xxx.htmlとしてコピー<br>※テスト不要な場合等はjsのみも可
   1. ドキュメントをJSDoc形式で記述
1. xxx.mdを作成
   - htmlは`tools/updateComponent.sh xxx`(xxxはコンポーネントの拡張子を除いたベースファイル名)
   - jsは`jsdoc2md xxx.js > ../component/xxx.md`
1. 作成したドキュメントをcomponent/README.mdに登録
1. szLibへの登録
   1. console/szLib/template.htmlを修正
   1. console/szLib/szLib.shを実行(内容更新＋MD作成)
1. CommonJSへの登録
   1. console/CommonJS/template.htmlを修正
   1. console/CommonJS/CommonJS.shを実行(内容更新＋MD作成)

- 既存型に独自メソッドを追加する場合、'.'を'_'にした別関数として定義した上で既存型に追加する。<br>
  (∵下の例で`Array.prototype.tabulize = function(opt){〜`とすると動作はするがjsdoc2mdでMDが生成されない)
  ```
  function Array.tabulyze(opt){
    (中略)
  }
  Array.prototype.tabulize = Array.tabulyze;
  ```

1. 


# ツールの作成手順

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="481px" height="121px" viewBox="-0.5 -0.5 481 121"><defs/><g><path d="M 320 20 Q 320 20 352.13 20" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 358.88 20 L 349.88 24.5 L 352.13 20 L 349.88 15.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><path d="M 320 20 L 340 20 L 340 80 L 352.13 80" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 358.88 80 L 349.88 84.5 L 352.13 80 L 349.88 75.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="200" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="all"/><path d="M 212 0 L 212 40 M 308 0 L 308 40" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 94px; height: 1px; padding-top: 20px; margin-left: 213px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;">xxx.sh<br /><font style="font-size: 11px;">(generator.js)</font></div></div></div></foreignObject><text x="260" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">xxx.sh...</text></switch></g><rect x="30" y="80" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><rect x="20" y="70" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><rect x="10" y="60" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 80px; margin-left: 11px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: none; white-space: normal; overflow-wrap: normal;">compA.html</div></div></div></foreignObject><text x="70" y="85" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">compA.html</text></switch></g><path d="M 160 20 Q 160 20 192.13 20" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="none"/><path d="M 198.88 20 L 189.88 24.5 L 192.13 20 L 189.88 15.5 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="none"/><rect x="0" y="0" width="160" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 158px; height: 1px; padding-top: 20px; margin-left: 1px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: none; white-space: normal; overflow-wrap: normal;">xxx.template.html</div></div></div></foreignObject><text x="80" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">xxx.template.html</text></switch></g><rect x="360" y="0" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 20px; margin-left: 361px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: none; white-space: normal; overflow-wrap: normal;">xxx.html</div></div></div></foreignObject><text x="420" y="25" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">xxx.html</text></switch></g><rect x="360" y="60" width="120" height="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" pointer-events="none"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 80px; margin-left: 361px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: none; white-space: normal; overflow-wrap: normal;">xxx.md</div></div></div></foreignObject><text x="420" y="85" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="16px" text-anchor="middle">xxx.md</text></switch></g><path d="M 150 100 L 260 100 L 260 47.87" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="none"/><path d="M 260 41.12 L 264.5 50.12 L 260 47.87 L 255.5 50.12 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="none"/></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://www.drawio.com/doc/faq/svg-export-text-problems" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot display</text></a></switch></svg>

1. component配下にファイルを作成
   - 原則本体・テスト・Webアプリをまとめてhtml形式で作成
   - 時間がない場合、スクリプトのみ".js"での保存も可
1. 言語/xxx配下にxxx.shとxxx.template.yyを作成
1. xxx.shを実行。なお作成されたxxx.mdはREADMEへの登録不要

<!--
- [JavaScript](JavaScript/README.md)

# 構成

## フォルダ

GitHub/library/(language)/
- CSS : ライブラリ共通のCSSファイル(ex.szDefault.css)
- JavaScript : JavaScriptで記述されたコンポーネント<br>
  HTMLで記述され、CSS/HTML/Script/外部参照を一元管理する。
  - CSS : 親フォルダに存在するコンポーネントの内、独自CSS定義部
  - HTML : 同様に、独自HTML部
  - script : 同様に、Script部
  - external : 同様に、CSS/Scriptの外部参照
- lib : コンポーネントを取捨選択して作成された用途別ライブラリ
- node : コマンドライン(Node.js)で実行な形式のコンポーネント<br>
  ※ nodeで実行可能なら記述言語を問わず、当フォルダに集約する。

## シェルスクリプト

- clean.sh : 自動生成される不要なファイルを削除
- createLib.sh : 用途別ライブラリの作成
- createMD.sh : 指定コンポーネントのMarkdownを作成

# ライブラリ

- [localLib](lib/localLib.md) : HTMLまたはバッチ(Node.js)用ライブラリ
-->