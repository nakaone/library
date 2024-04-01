<a name="ac0000"></a>
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


# 1 <a href="#ac0000" name="ac0001">authClient/authServerとBurgerMenuの連携</a>

[先頭](#ac0000)
<br>&gt; [authClient/authServerとBurgerMenuの連携 | [【備忘】GAS/htmlでの暗号化](#ac0006)]


表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。

連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。

## 1.1 <a href="#ac0001" name="ac0002">Google Spreadシート</a>

[先頭](#ac0000) > [authClient/authServerとBurgerMenuの連携](#ac0001)
<br>&gt; [Google Spreadシート | [インスタンス化時の引数定義](#ac0003)]


Google Spreadシートの本文

## 1.2 <a href="#ac0001" name="ac0003">インスタンス化時の引数定義</a>

[先頭](#ac0000) > [authClient/authServerとBurgerMenuの連携](#ac0001)
<br>&gt; [[Google Spreadシート](#ac0002) | インスタンス化時の引数定義]


authClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。

### 1.2.1 <a href="#ac0003" name="ac0004">共通部分</a>

[先頭](#ac0000) > [authClient/authServerとBurgerMenuの連携](#ac0001) > [インスタンス化時の引数定義](#ac0003)
<br>&gt; [共通部分 | [authClient特有部分](#ac0005)]


共通部分の本文

### 1.2.2 <a href="#ac0003" name="ac0005">authClient特有部分</a>

[先頭](#ac0000) > [authClient/authServerとBurgerMenuの連携](#ac0001) > [インスタンス化時の引数定義](#ac0003)
<br>&gt; [[共通部分](#ac0004) | authClient特有部分]


authClient特有部分本文

# 2 <a href="#ac0000" name="ac0006">【備忘】GAS/htmlでの暗号化</a>

[先頭](#ac0000)
<br>&gt; [[authClient/authServerとBurgerMenuの連携](#ac0001) | 【備忘】GAS/htmlでの暗号化]


- GAS
  - 鍵ペア生成
  - GASでの保存

### 2.1 <a href="#ac0006" name="ac0007">javascript用</a>

[先頭](#ac0000) > [【備忘】GAS/htmlでの暗号化](#ac0006)
<br>&gt; [javascript用 | [GAS用](#ac0008)]


- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ

### 2.2 <a href="#ac0006" name="ac0008">GAS用</a>

[先頭](#ac0000) > [【備忘】GAS/htmlでの暗号化](#ac0006)
<br>&gt; [[javascript用](#ac0007) | GAS用]


- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

