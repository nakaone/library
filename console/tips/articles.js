/* 
1. 基本的に新しい記事が上に来るようにする
1. contentの中の"`"は"\`"に置換する(content終了記号と誤解される)
1. URLクエリで`/tips.html?id=xxxx`(xxxxは記事のID)とすると直接記事を呼び出せる
1. createdの秒以下は入力しない(∵ここから導出されるIDは分未満切捨で自動計算)
1. refが一つもないならテンプレート内のオブジェクトは削除
▼▼▼▼▼▼▼▼▼▼▼ テンプレートここから
{ // =====================================================================
  title: "",
  created: "2023// :",
  tag: [],
  ref: [{
    site: "",
    title: "",
    url:"",
  }], article:
  // =====================================================================
`
`},
▲▲▲▲▲▲▲▲▲▲▲ テンプレートここまで
*/
function getArticles(){
  return [
{ // =====================================================================
  title: "検証：CSSは動的に追加した要素にも適用される",
  created: "2023/7/21 17:25",
  tag: ['html','css','element'],
  ref: [], article:
  // =====================================================================
`結論：読み込み時点で不在で動的に追加した要素にも、事前に定義されていたCSSは適用される。

<details><summary>検証したソース</summary>

\`\`\`html
<!DOCTYPE html><html lang="ja">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <meta http-equiv="Content-Script-Type" content="text/javascript">
  <title>CSS適用テスト</title>
  <style>
    #scanner {
      background-color: aqua;
      width: 80vw;
      height: 80vw;
      padding: 10vw;
    }
    #scanner .video {
      background-color: brown;
      width: 80%;
      height: 80%;
    }
  </style>
</head>

<body>
  <button onclick="addDiv()">add</button>
  <button onclick="delDiv()">del</button>
  <div id="test"></div>
</body>
<script>
const addDiv = () => {
  const e1 = document.createElement('div');
  e1.id = 'scanner';

  const e2 = document.createElement('div');
  e2.className = 'video';

  e1.appendChild(e2);
  document.getElementById('test').appendChild(e1);
}

const delDiv = () => {
  document.getElementById('scanner').remove();
}
</script>
</html>
\`\`\`

</details>

`},{ // =====================================================================
  title: "Android開発者画面の参照方法",
  created: "2023/7/21 17:30",
  tag: ['Android','開発','USB','デバッグ','debug'],
  ref: [], article:
  // =====================================================================
`[chrome://inspect/#devices](chrome://inspect/#devices)を開く

- [Android実機で Chrome の開発者ツールを開く＆デバッグする方法](https://pisuke-code.com/android-use-chrome-devtools/)
- Android側でのUSB接続許可：[Android デバイスで USB デバッグを有効にする](https://www.embarcadero.com/starthere/xe5-2/mobdevsetup/android/ja/enabling_usb_debugging_on_an_android_device.html)
`},{ // =====================================================================
  title: "「Google の審査プロセスを完了していません」の対応",
  created: "2023/7/21 17:19",
  tag: ['Google Cloud','OAuth','エラー','err'],
  ref: [], article:
  // =====================================================================
`Google Cloud > APIとサービス > OAuth同意画面 > 公開ステータス

「テスト」となっている場合、「アプリを公開」をクリック
`},{ // =====================================================================
  title: "GASで実行したスクリプトのログ参照方法",
  created: "2023/7/21 15:42",
  tag: ['GAS','ログ','Google Cloud Console'],
  ref: [{
    site: "",
    title: "Google Apps Scriptでトリガー実行（doGet,doPost）のログを表示するにはGCPプロジェクトに紐付ける必要があるらしい",
    url:"https://ryjkmr.com/google-apps-script-console-log/",
  }], article:
  // =====================================================================
`GASのdoPostはconsole.logを入れたとしてもGASのExecutions上でログが取得できない。これを参照する方法。

- ログの設定
  - GCPでの作業
    - 新規プロジェクトの作成
      - GCPコンソールのプロジェクト選択欄で「新しいプロジェクト」を選択
      - 「プロジェクトの選択」画面で「新しいプロジェクト」を選択
      - 「新しいプロジェクト」画面でプロジェクト名を付けて「作成」をクリック<br>
        \`プロジェクト名：EventStaff  場所：組織なし\`
    - 0Auth同意
      - APIとサービス > 0Auth同意画面
      - 0Auth同意画面で「User Type : 外部」を設定して「作成」
      - アプリ登録の編集①0Auth同意画面<br>
        公開ステータスの「テスト」の下にある「アプリを公開」 > 「本番環境にPUSHしますか？」で確認<br>
        他は以下の3項目だけ設定
        \`\`\`
        アプリ名：EventStaff
        ユーザーサポートメール：shimokitasho.oyaji@gmail.com
        デベロッパーの連絡先：同上
        \`\`\`
      - アプリ登録の編集②スコープ：特に設定なし
      - アプリ登録の編集③テストユーザ：特に設定なし
      - アプリ登録の編集④概要：特に設定なし
    - コンソール他で表示されるプロジェクト番号をコピー
  - GASでの作業
    - Apps Scriptコンソール > プロジェクトの設定(歯車) > プロジェクトを変更
    - 拡張機能 > Apps Script
    - GASのプロジェクト設定で「プロジェクト番号」をペースト、「プロジェクトの変更」をクリック
    - GCPプロジェクト画面で「プロジェクトを変更」をクリック
    - 改めてデプロイ(新規)を実行
- ログの参照
  - https://console.cloud.google.com/logs/
  - GCPダッシュボード > モニタリング > 「→[モニタリング]に移動」 > 画面右上のLOGGING<br>
    GASコンソール「実行数」から「Cloudのログ」を選択しても表示されない
`},{ // =====================================================================
  title: "JSDocの作り方",
  created: "2023/7/21 15:29",
  tag: ['JSDoc','Documentation','jsdoc-to-markdown','jsdoc2md'],
  ref: [], article:
  // =====================================================================
`[JSDoc使い方メモ](https://qiita.com/opengl-8080/items/a36679f7926f4cac0a81)

\`/** \`の直後に動作概要を記述可能だが、関数定義の前に記述する必要がある(以下はNG)

\`\`\`
function getSheetData(sheetName='マスタ',spreadId){  /** 指定シートから全データ取得
 * @param {string} sheetName - 取得対象シート名
(後略)
\`\`\`

戻り値が複雑な場合、以下の形式で記述。

\`\`\`
/**
 * 以下の3つの要因に基づいて重さを計算します:
 * <ul>
 * <li>送った項目
 * <li>受け取った項目
 * <li>タイムスタンプ
 * </ul>
 */
\`\`\`

documentationが\`@link\`に未対応のため、リンクは\`<a href="〜">...</a>\`で記述する。

出力はGASディレクトリに移動、出力先を指定して\`jsdoc -r szLib -d ../doc/szLib\`のように実行する。

<details><summary>[不採用] Documentation.js</summary>

documentation build -f md Agency.js --markdown-toc-max-depth=2 > Agency.md

[JsDocをもとにドキュメントを自動生成する](https://qiita.com/yuma84/items/e34e800cbd0b7632f85f)
[Using documentation on the command line](https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md)

</details>

<details><summary>[不採用] JSDocによる一括作成</summary>

\`\`\`
cd ~/Desktop/GitHub/EventStaff/
rm -rf ./doc/*

cd GAS
jsdoc -r auth -d ../doc/auth
jsdoc -r broad -d ../doc/broad
jsdoc -r delivery -d ../doc/delivery
jsdoc -r master -d ../doc/master
jsdoc -r post -d ../doc/post
jsdoc -r szLib -d ../doc/szLib

cd ..
jsdoc js/EventStaff.js -d doc/EventStaff
jsdoc js/library.js -d doc/library
\`\`\`

悪い点
- 生成されるのがHTMLのため、githubにアップするとHTMLのソースが表示される!!

</details>

[採用] jsdoc-to-markdown

例：\`jsdoc2md Agency.js > Agency2.md\`

良い点
- 1関数1項目で、説明もparamもreturnsもその配下にまとまっている<br>
　⇒ 他のMDに移植しやすい(レベルの置換が簡単)
- Documentation.jsのようなobjectをMDNの解説ページにリンクさせる等、余計なリンクがない
- ローカルリンクはaタグを使っている。D.jsのようにリスト型では無いので、複数ソースを一つのMDにまとめても問題なし

悪い点
- TOCがタグだらけ。見づらい
- returnsがparamより先に来ていて違和感がある
- 理由は分からないが、string, object等の型名毎にcodeタグが付いてくる
`},{ // =====================================================================
  title: "GAS：APIのURLを固定する",
  created: "2023/7/21 15:19",
  tag: ['GAS','API','URL','固定'],
  ref: [{
    site: "",
    title: "GoogleAppsScript(GAS)を固定URLでデプロイする方法",
    url:"https://codeaid.jp/gas-deploy/",
  }], article:
  // =====================================================================
`予め「新しいデプロイ」で「公開URL」を作成。これが固定URLとなる

1. ソース修正後「新しいデプロイ」で新バージョンを作成
1. 「デプロイの管理」で「公開URL」を選択
1. 右上の鉛筆マークをクリックして編集モードに
1. バージョン欄で作成された新バージョンを選択
1. 説明欄に「公開URL」を設定

なお適宜不要なバージョンはアーカイブする。
`},{ // =====================================================================
  title: "mac標準httpdのSSL通信化(https対応)",
  created: "2023/7/21 14:30",
  tag: ['Apache','httpd','mac OS標準','SSL','https'],
  ref: [{
    site: "",
    title: "Macに最初から入っているApacheでSSL通信する環境を整えた",
    url:"https://www.karakaram.com/mac-apache-ssl/",
  }], article:
  // =====================================================================
`# 事前確認：httpd-ssl.confの存在

\`\`\`
cd /etc/apache2 
% ls 
extra		magic		original	users
httpd.conf	mime.types	other
% vi httpd.conf
-------------------------
# Secure (SSL/TLS) connections 
#Include /private/etc/apache2/extra/httpd-ssl.conf
# 
# Note: The following must must be present to support
#       starting without SSL on platforms with no /dev/random equivalent
#       but a statically compiled-in mod_ssl.
# 
-------------------------
:/httpd-ssl.conf
-------------------------
% ls /private/etc/apache2/extra
httpd-autoindex.conf		httpd-mpm.conf
httpd-dav.conf			httpd-multilang-errordoc.conf
httpd-default.conf		httpd-ssl.conf <-- ちゃんとあった
httpd-info.conf			httpd-userdir.conf
httpd-languages.conf		httpd-vhosts.conf
httpd-manual.conf		proxy-html.conf
\`\`\`

# 実作業

1. サーバ秘密鍵を作成する
2. 証明書署名要求(CSR)を作成する
3. 自己署名証明書(CRT)を作成する
4. 秘密鍵と証明書を Apache から参照できる場所に設置
5. Apache が SSL 設定ファイルを読み込めるようにする
6. Apache を再起動して動作確認

`},{ // =====================================================================
  title: "mac OS標準Apache httpdの起動と終了",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','起動','停止'],
  ref: [], article:
  // =====================================================================
`
\`\`\`
% which httpd   # httpdがインストールされているパスの確認
/usr/sbin/httpd
% which apachectl #apachectlがインストールされているパスの確認
/usr/sbin/apachectl
% /usr/sbin/httpd -version  # httpdのバージョン
Server version: Apache/2.4.56 (Unix)
Server built:   Apr 15 2023 04:26:33
% sudo /usr/sbin/apachectl start  # httpdの起動
Password:
/System/Library/LaunchDaemons/org.apache.httpd.plist: service already loaded
Load failed: 37: Operation already in progress
% sudo /usr/sbin/apachectl stop # httpdの停止
\`\`\`
`},{ // =====================================================================
  title: "DocumentRootの確認",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','DocumentRoot'],
  ref: [], article:
  // =====================================================================
`
\`\`\`
% cd /etc/apache2 # httpd.confの格納場所
% ls -la
total 88
drwxr-xr-x   9 root  wheel    288  6 15 19:08 .
drwxr-xr-x  79 root  wheel   2528  7 20 18:17 ..
drwxr-xr-x  14 root  wheel    448  6 15 19:08 extra
-rw-r--r--   1 root  wheel  21648  6 15 19:08 httpd.conf
-rw-r--r--   1 root  wheel  13064  6 15 19:08 magic
-rw-r--r--   1 root  wheel  61118  6 15 19:08 mime.types
drwxr-xr-x   4 root  wheel    128  6 15 19:08 original
drwxr-xr-x   4 root  wheel    128  6 15 19:08 other
drwxr-xr-x   2 root  wheel     64  6 15 19:08 users
% vi httpd.conf # 以降viの画面
-------------------------
# DocumentRoot: The directory out of which you will serve your
# documents. By default, all requests are taken from this directory, but
# symbolic links and aliases may be used to point to other locations.
# 
DocumentRoot "/Library/WebServer/Documents"  <-- ここ
-------------------------
:/DocumentRoot
-------------------------
% cd /Library/WebServer/Documents # 現状の内容確認(2023/7/20)
% ls 
css		index.html	js
img		index.html.en	src
\`\`\`
`},{ // =====================================================================
  title: "MacのLocalhostで起動中のサーバにAndroidスマートフォンからアクセスする",
  created: "2023/07/21 08:00",
  tag: ['Apache','httpd','mac OS標準','スマホ','開発'],
  ref: [{
    site: "",
    title:"MacのLocalhostで起動中のサーバにAndroidスマートフォンからアクセスする",
    url:"https://knmts.com/as-a-engineer-38/",
  }], article:
  // =====================================================================
`通常は\`http://localhost/\`または\`http://127.0.0.1/\`。

\`\`\`
% ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
  options=6463<RXCSUM,TXCSUM,TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
  ether 0c:e4:41:e8:71:85 
  inet6 fe80::4b8:8c63:f0e5:60cb%en0 prefixlen 64 secured scopeid 0xc 
  inet6 2404:7a80:2301:2b00:1014:c9e8:5021:1907 prefixlen 64 autoconf secured 
  inet6 2404:7a80:2301:2b00:6d66:9e73:e45d:1308 prefixlen 64 autoconf temporary 
  inet 192.168.1.7 netmask 0xffffff00 broadcast 192.168.1.255
  nat64 prefix 2001:260:306:b:: prefixlen 96
  nd6 options=201<PERFORMNUD,DAD>
  media: autoselect
  status: active
\`\`\`
`}]}