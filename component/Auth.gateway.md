[class Auth README](Auth.readme.md) >

<p style="font-size:2rem;text-shadow:2px 2px 4px #888;">認証局(gateway)の構成</p>

ユーザ認証および配信異常時の対応を行う。

- アカウント：メインアカウント(申込フォーム、管理局と同一のアカウント)
- シートの共有：なし(開発時のみ管理局とRASシートを共有)
- デプロイ：webアプリ(実行ユーザ：自分、アクセス可能：全員)
- シート：[RSA](#sheet.rsa), [dummy](#sheet.dummy)
- 使用するライブラリ：無し
- 使用するスクリプト/HTMLシート
  - 共通部分
    1. [lib.gs](Auth.master.md#script.lib) : ライブラリから引用したコンポーネント集
    1. [cryptico.gs](Auth.master.md#script.cryptico) : crypticoをGAS用にアレンジしたソース
    1. [toolbox.gs](Auth.master.md#script.toolbox) : 「道具箱」メニューで使用するツール集
  - 認証局独自
    1. [main.gs](#script.main) : auth1A,1B他

# シート

## RSAシート<a name="sheet.rsa"></a>

本シートは保護(アクセスは自分のみ)＋非表示設定を行う

<style type="text/css">.gSpreadTabulize div {display: grid; margin: 2px; padding: 0px 0.3rem; } .gSpreadTabulize .table {display: grid;} .gSpreadTabulize .th {background: #ccc; font-weight: bold; text-align: center;} .gSpreadTabulize .td {border-bottom: solid 1px #ccc; border-right: solid 1px #ccc;} .gSpreadTabulize .memo {background: #ff0; padding: 0.5rem; text-align: left; font-size: 0.7rem;}</style><div class="gSpreadTabulize" style="display: grid; grid-template-columns: 4rem 100fr 426fr;"><div class="th"></div><div class="th">A</div><div class="th">B</div><div class="th">1</div><div class="td" style="text-align: left; background: rgb(239, 239, 239);"><span>name<div class="memo"><strong>note:</strong>認証局なら'gateway'、配信局なら管理局configシートに登録されたfrontの添字</div></span></div><div class="td" style="text-align: left; background: rgb(239, 239, 239);"><span>gateway</span></div><div class="th">2</div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>passPhrase<div class="memo"><strong>note:</strong>自局RSAkeyのパスフレーズ</div></span></div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>m--o+&gt;ZHZ_YnBCFz</span></div><div class="th">3</div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>publicKey</span></div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>deUHmH〜s21k=</span></div><div class="th">4</div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>masterId<div class="memo"><strong>note:</strong>管理局シートのID(平文)</div></span></div><div class="td" style="text-align: left; background: rgb(255, 255, 255);"><span>10OPr_〜vnjHM</span></div></div>

公開鍵/秘密鍵を保存後、自分以外のアカウントからの表示・編集を抑止するよう設定する。

1. シートを追加、シート名は「RSA」とする。
1. 2列3行のみ残して空白セルを削除、A1「pass phrase」A2「RSA key」A3「public key」とする
1. `pages/cryptico.html`を表示。「bit length = 1024」になっていることを確認後、念の為pass phraseを再設定
1. "pass phrase","RSA key","Public key"をシートに転記
1. master-configシートの公開鍵欄に"public key"をコピー
1. RSAシートの他アカウントの編集を禁止<br>シート名「RSA」横の「▼」 > シートを保護
   - 説明：任意
   - 範囲/シート：RSAシート全体
   - 権限の設定：自分のみ編集可
1. RSAシートの他アカウントの閲覧を禁止<br>シート名「RSA」横の「▼」 > シートを非表示<br>
   ※再表示はメニューから「表示 > 非表示のシート > RSA」とする
1. master-configシートの公開鍵欄に"public key"をコピー

## dummyシート<a name="sheet.dummy"></a>

表示するシート数は0にできない。RSAシート隠蔽のために作成するダミー。

<style type="text/css">.gSpreadTabulize div {display: grid; margin: 2px; padding: 0px 0.3rem; } .gSpreadTabulize .table {display: grid;} .gSpreadTabulize .th {background: #ccc; font-weight: bold; text-align: center;} .gSpreadTabulize .td {border-bottom: solid 1px #ccc; border-right: solid 1px #ccc;} .gSpreadTabulize .memo {background: #ff0; padding: 0.5rem; text-align: left; font-size: 0.7rem;}</style><div class="gSpreadTabulize" style="display: grid; grid-template-columns: 4rem 100fr 100fr;"><div class="th"></div><div class="th">A</div><div class="th">B</div><div class="th">1</div><div class="td" style="background: rgb(255, 255, 255);"><span></span></div><div class="td" style="background: rgb(255, 255, 255);"><span></span></div><div class="th">2</div><div class="td" style="background: rgb(255, 255, 255);"><span></span></div><div class="td" style="background: rgb(255, 255, 255);"><span></span></div></div>

# スクリプト

## main.gs : auth1B,2B他<a name="script.main"></a>


