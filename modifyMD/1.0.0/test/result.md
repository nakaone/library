l.98 v.stack=[{"id":"0","parent":"0","number":[],"children":["1"],"level":"0","title":"","content":"<style>\n/* -- library/CSS/1.3.0/core.css ------ */\nhtml, body{\n  width: 100%;\n  margin: 0;\n  /*font-size: 4vw;*/\n  text-size-adjust: none; /* https://gotohayato.com/content/531/ */\n}\n</style>\n<p class=\"title\">class Auth</p>\n\n「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。\n\n","name":"article000000","ancestor":[],"sibling":[]},{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]},{"id":"2","parent":"1","number":["2"],"children":[],"level":"2","title":"Google Spreadシート","content":"\nGoogle Spreadシートの本文\n\n","name":"article000002","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]},{"id":"3","parent":"1","number":["1","2"],"children":["4","5"],"level":"2","title":"インスタンス化時の引数定義","content":"\nauthClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。\n\n","name":"article000003","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]},{"id":"4","parent":"3","number":["1","3"],"children":[],"level":"3","title":"共通部分","content":"\n共通部分の本文\n\n","name":"article000004","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]},{"id":"3","parent":"1","number":["1","2"],"children":["4","5"],"level":"2","title":"インスタンス化時の引数定義","content":"\nauthClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。\n\n","name":"article000003","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]}],"sibling":["4","5"]},{"id":"5","parent":"3","number":["1","2","2"],"children":[],"level":"3","title":"authClient特有部分","content":"\nauthClient特有部分本文\n\n","name":"article000005","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]},{"id":"3","parent":"1","number":["1","2"],"children":["4","5"],"level":"2","title":"インスタンス化時の引数定義","content":"\nauthClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。\n\n","name":"article000003","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]}],"sibling":["4","5"]},{"id":"6","parent":"1","number":["1","2","3"],"children":["7","8"],"level":"2","title":"【備忘】GAS/htmlでの暗号化","content":"\n- GAS\n  - 鍵ペア生成\n  - GASでの保存\n\n","name":"article000006","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]},{"id":"7","parent":"6","number":["1","4"],"children":[],"level":"3","title":"javascript用","content":"\n- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)\n\njavascript 鍵ペア ライブラリ\n\n","name":"article000007","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]},{"id":"6","parent":"1","number":["1","2","3"],"children":["7","8"],"level":"2","title":"【備忘】GAS/htmlでの暗号化","content":"\n- GAS\n  - 鍵ペア生成\n  - GASでの保存\n\n","name":"article000006","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]}],"sibling":["7","8"]},{"id":"8","parent":"6","number":["1","2","3","2"],"children":[],"level":"3","title":"GAS用","content":"\n- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)\n- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)\n","name":"article000008","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]},{"id":"6","parent":"1","number":["1","2","3"],"children":["7","8"],"level":"2","title":"【備忘】GAS/htmlでの暗号化","content":"\n- GAS\n  - 鍵ペア生成\n  - GASでの保存\n\n","name":"article000006","ancestor":[{"id":"1","parent":"0","number":["1"],"children":["2","3","6"],"level":"1","title":"authClient/authServerとBurgerMenuの連携","content":"\n表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。\n\n連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。\n\n","name":"article000001","ancestor":[],"sibling":["1"]}],"sibling":["2","3","6"]}],"sibling":["7","8"]}]
<a name="article000000"></a>
<style>
/* -- library/CSS/1.3.0/core.css ------ */
html, body{
  width: 100%;
  margin: 0;
  /*font-size: 4vw;*/
  text-size-adjust: none; /* https://gotohayato.com/content/531/ */
}
</style>
<p class="title">class Auth</p>

「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。


#  <a href="#undefined" name="#article000001">authClient/authServerとBurgerMenuの連携</a>


[undefined](#undefined)


表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。

連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。

##  <a href="#undefined" name="#article000002">Google Spreadシート</a>

[authClient/authServerとBurgerMenuの連携](#article000001)
[undefined](#undefined) | [undefined](#undefined) | [undefined](#undefined)


Google Spreadシートの本文

## 2 <a href="#undefined" name="#article000003">インスタンス化時の引数定義</a>

[authClient/authServerとBurgerMenuの連携](#article000001)
[undefined](#undefined) | [undefined](#undefined) | [undefined](#undefined)


authClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。

### 3 <a href="#undefined" name="#article000004">共通部分</a>

[authClient/authServerとBurgerMenuの連携](#article000001) > [インスタンス化時の引数定義](#article000003)
[undefined](#undefined) | [undefined](#undefined)


共通部分の本文

### 2.2 <a href="#undefined" name="#article000005">authClient特有部分</a>

[authClient/authServerとBurgerMenuの連携](#article000001) > [インスタンス化時の引数定義](#article000003)
[undefined](#undefined) | [undefined](#undefined)


authClient特有部分本文

## 2.3 <a href="#undefined" name="#article000006">【備忘】GAS/htmlでの暗号化</a>

[authClient/authServerとBurgerMenuの連携](#article000001)
[undefined](#undefined) | [undefined](#undefined) | [undefined](#undefined)


- GAS
  - 鍵ペア生成
  - GASでの保存

### 4 <a href="#undefined" name="#article000007">javascript用</a>

[authClient/authServerとBurgerMenuの連携](#article000001) > [【備忘】GAS/htmlでの暗号化](#article000006)
[undefined](#undefined) | [undefined](#undefined)


- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ

### 2.3.2 <a href="#undefined" name="#article000008">GAS用</a>

[authClient/authServerとBurgerMenuの連携](#article000001) > [【備忘】GAS/htmlでの暗号化](#article000006)
[undefined](#undefined) | [undefined](#undefined)


- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

