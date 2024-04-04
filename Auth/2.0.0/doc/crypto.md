# 【備忘】GAS/htmlでの暗号化

- GASで返したhtml上でcookieの保存はできない
  ```
  <script type="text/javascript">
  document.cookie = 'camp2024=10';  // NG
  document.cookie = 'pKey=abcdefg'; // NG
  sessionStorage.setItem("camp2024", "value-sessionStorage"); // OK
  localStorage.setItem("camp2024", "value-localStorage"); // OK
  ```
- sessionStorage, localStorageへの保存はonload時もOK

- GAS
  - 鍵ペア生成
  - GASでの保存
  - 

## javascript用

- Node.jsスタイルで書かれたコードをブラウザ上で動くものに変換 : [ざっくりbrowserify入門](https://qiita.com/fgkm/items/a362b9917fa5f893c09a)
- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ


## GAS用

- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

```
function getTest(){
  //スクリプトプロパティを取得し、ログ出力 -> 1度ファイルを閉じた後でも出力される
  console.log(PropertiesService.getScriptProperties().getProperty('TEST1'));
  console.log(PropertiesService.getDocumentProperties().getProperty('TEST2'));
  console.log(PropertiesService.getDocumentProperties().getProperty('TEST3'));
}

function setTest() {
  //PropertiesServiceでスクリプトプロパティをセット
  PropertiesService.getScriptProperties().setProperty('TEST1','テスト1です');
  PropertiesService.getDocumentProperties().setProperty('TEST2','テスト2です');
  PropertiesService.getDocumentProperties().setProperty('TEST3',{a:10});
  //スクリプトプロパティを取得し、ログ出力
  console.log(PropertiesService.getScriptProperties().getProperty('TEST1'));
  console.log(PropertiesService.getDocumentProperties().getProperty('TEST2'));
  console.log(PropertiesService.getDocumentProperties().getProperty('TEST3'));
}
```