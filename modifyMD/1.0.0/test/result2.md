<!-- modifyMD original document 
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

# authClient/authServerとBurgerMenuの連携

表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。

連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。

## Google Spreadシート

Google Spreadシートの本文

## インスタンス化時の引数定義

authClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。

### 共通部分

共通部分の本文

### authClient特有部分

authClient特有部分本文

# 【備忘】GAS/htmlでの暗号化

- GAS
  - 鍵ペア生成
  - GASでの保存

### javascript用

- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ

### GAS用

- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)
-->
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


# 目次

1. <a href="#ac0001">authClient/authServerとBurgerMenuの連携</a>
   1. <a href="#ac0002">Google Spreadシート</a>
   1. <a href="#ac0003">インスタンス化時の引数定義</a>
      1. <a href="#ac0004">共通部分</a>
      1. <a href="#ac0005">authClient特有部分</a>
1. <a href="#ac0006">【備忘】GAS/htmlでの暗号化</a>
      1. <a href="#ac0007">javascript用</a>
      1. <a href="#ac0008">GAS用</a>

# 1 authClient/authServerとBurgerMenuの連携<a name="ac0001"></a>


表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。

連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。

## 1.1 Google Spreadシート<a name="ac0002"></a>


Google Spreadシートの本文

## 1.2 インスタンス化時の引数定義<a name="ac0003"></a>


authClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。

### 1.2.1 共通部分<a name="ac0004"></a>


共通部分の本文

### 1.2.2 authClient特有部分<a name="ac0005"></a>


authClient特有部分本文

# 2 【備忘】GAS/htmlでの暗号化<a name="ac0006"></a>


- GAS
  - 鍵ペア生成
  - GASでの保存

### 2.1 javascript用<a name="ac0007"></a>


- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ

### 2.2 GAS用<a name="ac0008"></a>


- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

