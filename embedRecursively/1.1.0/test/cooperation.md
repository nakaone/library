# authClient/authServerとBurgerMenuの連携

表示制御は、authClient/authServerによる権限確認機能と、それに基づいたBurgerMenuによる操作可能メニュー表示制御機能とが連携して行う。

連携は両方を呼び出すプログラム(ex.camp2024)のhtmlとconfigに所定の方法で定義することで実現する。

## Google Spreadシート

## BODYタグ内

## DOMContentLoaded(インスタンス化)

## インスタンス化時の引数定義

authClient/authServerとBurgerMenuで一部共通の値を設定する必要があるので、インスタンス化の際の引数を呼出元のconfigで設定することでこれを実現する。

### 共通部分

<!--:config.cooperation.js::-->

### authClient特有部分

<!--:config.authClient.js::-->

### authServer特有部分

<!--:config.authServer.js::-->

### BurgerMenu特有部分

<!--:config.BurgerMenu.js::-->
