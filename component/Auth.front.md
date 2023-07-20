[class Auth README](Auth.readme.md) >

<p style="font-size:2rem;text-shadow:2px 2px 4px #888;">配信局(front)の構成</p>

要求者の検証を行い、メールおよび各種情報を配信する。

- アカウント：サブアカウント(申込フォーム・管理局・認証局とは異なる複数のアカウント)
- シートの共有：なし(開発時のみ管理局とRASシートを共有)
- デプロイ：webアプリ(実行ユーザ：自分、アクセス可能：全員)
- シート：[RSA](Auth.gateway.md#sheet.rsa), [dummy](Auth.gateway.md#sheet.dummy)
  - 共通部分
    1. [lib.gs](Auth.master.md#script.lib) : ライブラリから引用したコンポーネント集
    1. [cryptico.gs](Auth.master.md#script.cryptico) : crypticoをGAS用にアレンジしたソース
    1. [toolbox.gs](Auth.master.md#script.toolbox) : 「道具箱」メニューで使用するツール集
  - 認証局独自
    1. [main.gs](#script.main) : auth1A,1B他

**【注意事項】**

1. 配信局(front)は複数を想定するが、鍵ペアは同一のものを使用

# スクリプト

## main.gs : echo, broadcast他<a name="script.main"></a>


