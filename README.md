<p style="font-size:2rem">独自ライブラリ</p>

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