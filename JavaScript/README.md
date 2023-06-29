<p style="font-size:2rem">独自ライブラリ：JavaScript</p>

# 仕様書

- [jsLib](../lib/jsLib.md): HTMLまたはバッチ(Node.js)用ライブラリ

# コンポーネントの運用

## 開発・運用方針

1. CSS, HTML, JavaScript, Doc, Testの一元管理
2. オンラインツール、バッチも同一ファイルから使用・作成可能

### 課題

1. メニューなど、一つの機能はCSS/HTML/Scriptから成るが、一元管理がしにくい<br>
   ドキュメント・テスト(仕様・スクリプト)は特に散逸しやすい
1. MarkDownで出力できない(できるはずだが試行錯誤でめげた)
1. Mermaid等の拡張機能をJSDocに入れることは困難
1. JSDocの@typeDefの記述は一箇所だが、参照は多くの場合入力・出力の2箇所、またはそれ以上になる
1. JSDocの出力ファイルが多く、管理が煩雑(README.mdからの参照が複雑)

### 対応

- VueライクにCSS/HTML/Scriptを一つのファイルにまとめる
- 文書は基本JSDocで残す。JSDocで表現しにくい図(Mermaid等)はMarkDownで記述可能にする
- テスト仕様およびツールも同一ファイルに残す
- 「表示モード」を設定、以下のように制御する
  - Doc : JSDoc + 補足説明を表示
  - Test : テスト用画面を表示。consoleでテストする場合は割愛
  - App : オンラインツール画面を表示
- ソース修正時は"update.js"を実行し、ライブラリおよび単体実行用(Node.js)ファイルを更新

### 補足

- 他コンポーネントで定義したオブジェクトへの参照が定義できないが、これは暫定的に補足説明に追記することで対応

## コンポーネントの作成

### 通常手順

1. JavaScriptフォルダで、参考となるコンポーネントをコピー
   - 全体版：textContent.html
   - 限定版：analyzeArg.html
1. `<script type="text/javascript" class="core">`内部にスクリプトとJSDocを記載

#### テスト

以下のテスト仕様書・テストスクリプト・テストデータは`<script class="test">`内部に記述する。

1. テスト仕様書を`xxxTest()`のJSDocに記述
1. テストデータを準備、`xxxTest()`にテストスクリプトを記述
1. 開発者コンソールでテスト。画面が必要な場合、`<doc class="test">`内に記述

### Webアプリ

通常に加え、Web画面用の記述を追加

- CSS: `<style type="text/css" class="webApp">`
- HTML: `<div class="webApp">`
- Script: `<script type="text/javascript" class="webApp">`

### 単体実行可能形式(コマンド)

通常に加え、単体実行可能形式用の記述を追加

```
<script type="text/javascript" class="main">
if( typeof window === 'undefined' ){
  // 事前処理：引数チェック、既定値の設定
  v.argv = analyzeArg();
  if(v.argv.hasOwnProperty('stack')) throw v.argv;

  // ファイルの読み込み、textContentの呼び出し
  v.fs = require('fs');
  v.content = v.fs.readFileSync(v.argv.opt.i,'utf-8');
  v.rv = textContent(v.content,v.argv.val);
  if( v.rv.hasOwnProperty('stack') ) throw v.rv;

  // 結果の書き出し
  v.content = v.fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  
}
</script>
```

※ `script.core`,`script.main`を抽出・結合して単体実行可能形式のJSファイルを作成

### ページ(CSS/HTML/Script統合)

通常に加え、ページ用のCSS/HTML/Scriptの記述を追加

- CSS: `<style type="text/css" class="page">`
- HTML: `<div name="xxx" class="page">`
- Script: `<script type="text/javascript" class="page">`

※ `script.core`,`.page`を抽出・結合し、本ページを利用するHTMLに追加


# ライブラリの運用

## ライブラリの作成

1. createLib.shでどのコンポーネントをどのライブラリに組み込むか指定<br>
   ※createLibでは複数ライブラリを一括更新
1. `./createLib.sh`を実行。

## ライブラリの使用

lnコマンドでシンボリックリンクを必要な箇所に作成する。