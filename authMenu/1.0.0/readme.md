<!-- modifyMD original document 
<style>
/* -----------------------------------------------
  library/CSS/1.3.0/core.css
----------------------------------------------- */
html, body{
  width: 100%;
  margin: 0;
  /*font-size: 4vw;*/
  text-size-adjust: none; /* https://gotohayato.com/content/531/ */
}
body * {
  font-size: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.num, .right {text-align:right;}
.screen {padding: 1rem;} /* SPAでの切替用画面 */
.title { /* Markdown他でのタイトル */
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}

/* --- テーブル -------------------------------- */
.table {display:grid}
th, .th, td, .td {
  margin: 0.2rem;
  padding: 0.2rem;
}
th, .th {
  background-color: #888;
  color: white;
}
td, .td {
  border-bottom: solid 1px #aaa;
  border-right: solid 1px #aaa;
}

/* --- 部品 ----------------------------------- */
.triDown { /* 下向き矢印 */
  --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}

/* --- 部品：待機画面 --------------------------- */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(204,204,204, 0.2);
  border-right: 1.1em solid rgba(204,204,204, 0.2);
  border-bottom: 1.1em solid rgba(204,204,204, 0.2);
  border-left: 1.1em solid #cccccc;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<p class="title">class authMenu</p>

# 機能概要

htmlからdata-menu属性を持つ要素を抽出、ハンバーガーメニューを作成する。

またHTML上のメニュー(SPAの機能)毎に許容権限を設定し、ユーザ毎に認証することで、表示制御を可能にする。

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="726px" height="271px" viewBox="-0.5 -0.5 726 271"><defs/><g><g><path d="M 328.2 270 L 370.2 78 L 514.2 78 L 472.2 270 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><path d="M 328.2 234 L 370.2 42 L 514.2 42 L 472.2 234 Z" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g><path d="M 466.2 30 L 472.2 0 L 514.2 0 L 508.2 30 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 78px; height: 1px; padding-top: 25px; margin-left: 778px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.icon</font></div></div></div></foreignObject><text x="817" y="29" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.icon</text></switch></g></g><g><path d="M 364.2 198 L 400.2 30 L 508.2 30 L 472.2 198 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 238px; height: 1px; padding-top: 190px; margin-left: 608px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">nav</font></div></div></div></foreignObject><text x="727" y="194" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">nav</text></switch></g></g><g><rect x="388.2" y="204" width="36" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 58px; height: 1px; padding-top: 355px; margin-left: 648px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.back</font></div></div></div></foreignObject><text x="677" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.back</text></switch></g></g><g><rect x="370.2" y="246" width="72" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 425px; margin-left: 618px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><span style="font-size: 20px;">.wrapper</span></div></div></div></foreignObject><text x="677" y="429" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.wrapper</text></switch></g></g><g><rect x="0" y="0" width="253.2" height="258" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 420px; height: 1px; padding-top: 7px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.menu.screen name="wrapper"</font></div></div></div></foreignObject><text x="2" y="19" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.menu.screen name="wrapper"</text></switch></g></g><g><rect x="7.2" y="24" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 47px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c11',label:'掲示板',func:'board'"</font></div></div></div></div></foreignObject><text x="14" y="59" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="72" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 127px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c21',label:'入会申込',href:'https://〜'"</font></div></div></div></div></foreignObject><text x="14" y="139" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="120" width="240" height="132" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 207px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c30',label:'Information'</font></div></div></div></div></foreignObject><text x="14" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="156" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 267px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c31',label:'会場案内図'</font></div></div></div></div></foreignObject><text x="26" y="279" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="204" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 347px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c32',label:'タイムテーブル'</font></div></div></div></div></foreignObject><text x="26" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="580.2" y="3" width="144" height="234" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g/><g><rect x="616.2" y="33" width="108" height="150" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><rect x="622.2" y="39" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 85px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> 掲示板</font></div></div></div></foreignObject><text x="1039" y="89" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> 掲示板</text></switch></g></g><g><rect x="622.2" y="66" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 130px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">入会申込</font></div></div></div></foreignObject><text x="1039" y="134" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">入会申込</text></switch></g></g><g><rect x="622.2" y="93" width="102" height="84" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 162px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> Information</font></div></div></div></foreignObject><text x="1039" y="174" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> Information</text></switch></g></g><g><rect x="628.2" y="117" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 215px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">会場案内図</font></div></div></div></foreignObject><text x="1049" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">会場案内図</text></switch></g></g><g><rect x="628.2" y="147" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 265px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">タイムテーブル</font></div></div></div></foreignObject><text x="1049" y="269" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">タイムテーブル</text></switch></g></g><g/><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><path d="M 697.2 9 L 721.2 9" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 18 L 721.2 18" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 27 L 721.2 27" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 274.2 72 L 310.2 130.5 L 274.2 189 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g><g><path d="M 532.2 70.5 L 568.2 129 L 532.2 187.5 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g></g></svg>

本クラスは**Google SpreadのGASにデプロイし、SPAとして使用する**ことを想定しているため、'camp2024'等の**呼出元**で以下の作業を行う。

1. caller/index.htmlの作成
   1. body部での要素定義
   1. authMenuの適用値設定
   1. グローバル変数、local/sessionStorageでのユーザ情報保存(※1)
   1. class authMenu(=authMenu/client.js)の組み込み(※2)
1. caller/server.gs
   1. authServerの適用値設定
   1. documentPropertiesでのサーバ・ユーザ情報保存(※1)
   1. authServer(=authMenu/server.js)の組み込み(※2)

なお以下2点は自動的に行う。
- ※1 : 「〜情報保存」は、システム側で自動的に処理(作業は発生しない)
- ※2 : 呼出元のbuild.shで自動処理。記述方法は「フォルダ構成、ビルド手順」を参照。

# 使用方法

## body部での要素定義

<a name="receiving_query_string"></a>

### クエリ文字列の受取

以下は`https://script.google.com/〜4yz/exec?id=XXX`として、変数`id`でユーザIDを渡している例。

サーバ側でクエリ文字列を受け取り、HTML内の変数`userId`にセット。

```
function doGet(e){
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = e.parameter.id;  // ここ!!
  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('camp2024');
  return htmlOutput;
}
```

クライアント側では`<?= userId ?>`で値を取得。

```
<div style="display:none" name="userId"><?= userId ?></div>
```

以下、querySelector等で適宜参照する。

### メニュー要素の定義

- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="authMenu screen" name="wrapper">
    <div data-menu="id:'イベント情報'">
      <div data-menu="id:'掲示板',func:'dispBoard'"></div>
      <div data-menu="id:'実施要領'">
        <!--：：$tmp/実施要領.html：：--＞ ※ embedRecursivelyのプレースホルダは一行で記述
      </div>
    </div>
  </div>
(中略)
```

下位の階層を持つ場合、自分自身の表示内容は持たせない(以下はNG)

```
<div data-menu="id:'お知らせ'">
!!NG!! <p>お知らせのページです</p>
  <div data-menu="id:'掲示板'">〜</div>
  <div data-menu="id:'注意事項'">〜</div>
</div>
```

「お知らせ」は「掲示板」「注意事項」のブランチとして扱われるので、「&lt;p&gt;お知らせのページです&lt;/p&gt;」というお知らせページ自身の表示内容は定義不可。

### data-menu属性に設定する文字列

タグのallowとその人の権限(auth)の論理積>0ならメニューを表示する。

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} id - 【必須】メニューID
- {string} [label] - メニュー化する時の名称。省略時はidを使用
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はauthMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  authMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new authMenu({auth:1})の一般参加者は非表示、
  >     new authMenu({auth:2})のスタッフは表示となる。
- {string} [from='1970/1/1'] - メニュー有効期間の開始日時。Dateオブジェクトで処理可能な日時文字列で指定
- {string} [to='9999/12/31'] - メニュー有効期間の終了日時

注意事項

- func, hrefは排他。両方指定された場合はfuncを優先する
- func, href共に指定されなかった場合、SPAの画面切替指示と見なし、idの画面に切り替える
- href指定の場合、タグ内の文字列は無視される(下例2行目の「テスト」)
  ```
  <div data-menu="id:'c41',label:'これはOK',href:'https://〜'"></div>
  <div data-menu="id:'c41',label:'これはNG',href:'https://〜'">テスト</div>
  ```
- 以下例ではシステム管理者(auth=8)は両方表示されるが、一般ユーザ(auth=1)にはシステム設定は表示されない
  ```
  <div data-menu="allow:9">利用案内</div>
  <div data-menu="allow:8">システム設定</div>
  (中略)
  <script>
    const auth = new Auth(...);  // 利用権限を取得。一般ユーザ:1, 管理者:8
    const menu = new authMenu();
  ```
- ユーザ権限は一般公開部分は`auth=1`とし、auth=0は使用しない(∵0⇒誰も見えない)。以降**権限が大きくなるにつれて大きな数字を使用**する
- 申込フォームのように申込期限がある場合、同一IDで下の例のように設定する。
  ```
  <!-- 申込開始前 〜2024/03/31 --＞
  <div data-menu="id:'entryForm',to:'2024/04/01 00:00:00'">
    「まだお申し込みいただけません」
  </div>

  <!-- 申込期間内 2024/04/01〜07 --＞
  <div data-menu="id:'entryForm',from:'2024/04/01',to:'2024/04/08 00:00:00'">
    申込フォーム
  </div>

  <!-- 申込終了後 2024/04/08〜 --＞
  <div data-menu="id:'entryForm',from:'2024/04/08'">
    「申込は終了しました」
  </div>
  ```
- メニュー生成時点で有効期限を判断、同一IDが複数存在する場合はいずれか一つのDIVのみ残して残りを削除してメニューを生成する。

## authMenuの適用値設定

インスタンス生成時の引数はそのまま**authMenuメンバ変数**となる。

以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。

1. 「**太字**」はインスタンス生成時、必須指定項目
1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット

- wrapper='.authMenu.screen[name="wrapper"]' {string|HTMLElement} 作成対象のdata-menuを全て含む親要素。CSSセレクタかHTMLElementで指定。
- func {Object.<string,Function>} メニューから実行する関数を集めたライブラリ
- home {string} ホーム画面として使用するメニューの識別子。無指定の場合、wrapper直下でdata-menu属性を持つ最初の要素
- initialSubMenu=true {boolean} サブメニューの初期状態。true:開いた状態、false:閉じた状態
- css {string} authMenu専用CSS
- toggle {Arrow} 【*内部*】ナビゲーション領域の表示/非表示切り替え
- showChildren {Arrow} 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え

### インスタンス生成時の処理フロー

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> server : 表示要求(URL)
  activate server
  Note right of server : doGet()
  rect rgba(0, 255, 255, 0.1)
    server ->> client : HTML(object)+ID
    activate client
    deactivate server
    Note right of client : authMenu.constructor()
    client ->> client : インスタンス生成
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client

    user ->>+ client : ID入力
    Note right of client : enterUserId()
    client ->> client : storageに保存(storeUserInfo)
    client ->>- user : メンバ用画面
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)については、「[クエリ文字列の受取](#receiving_query_string)」の項を参照。
- 「インスタンス生成」での処理内容
  1. ユーザ情報を取得、不足分は既定値を設定
     - 引数、HTML埋込情報、sessionStorage、localStorageのユーザ情報を取得
     - IDを特定(引数>HTML埋込>session>local。いずれにも無ければnull)
     - IDが特定されるならauthを一般公開->参加者に変更
  1. 親要素を走査してナビゲーションを作成(アイコン、ナビ領域、背景)
- 図中の`enterUserId()`は、`new authMenu()`の引数として渡された関数

<!--
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. authMenu.constructor()
     1. AuthインスタンスをauthMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)

[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。

    user ->> client : ID入力
    activate client
    Note right of client : enterUserId()
    client ->> user : メンバ用サイト
    deactivate client

--＞

### scriptサンプル

```
window.addEventListener('DOMContentLoaded',() => {
  const v = {whois:'DOMContentLoaded',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // userId,authをセット
    v.config = storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2.1; // 使用するクラスのインスタンス化
    v.auth = new authMenu();
    v.step = 2.2;
    v.menu = new authMenu({func:{
      enterId:()=>{
        console.log('enterId start.');
        const v = window.prompt('受付番号を入力してください');
        if( v.match(/^[0-9]+/) ){
          v.r = storeUserInfo(v);
          if( v.r instanceof Error ) throw v.r;
          //this.auth = 2; -> thisはwindowになる
          console.log(this);
          //this.genNavi(2); -> thisはwindowになる
        }
      }
    }});

    v.step = 99; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    alert(e.message);
  }
});
```

## グローバル変数、local/sessionStorageのユーザ情報保存

`onClick`や`addEventListener`から呼ばれる関数にauthMenuインスタンスを渡す必要があるため、**authMenuのインスタンスはグローバル変数として定義**する。

```
<script type="text/javascript">
const g = {};
(中略)
window.addEventListener('DOMContentLoaded',() => {
  g.menu = new authMenu({...});
  (後略)
});
</script>
```

- localStorage : `"authMenu"(固定) : ユーザID(初期値null)`
- sessionStorage : `"authMenu"(固定)`
  1. {number} userId=null - ユーザID
  1. {string} email='' - 連絡先メールアドレス
  1. {number} created=null - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} passPhrase=createPassword() - クライアント側鍵ペア生成の際のパスフレーズ
  1. {number} auth=1 - ユーザの権限
  1. {number} unfreeze=null - ログイン連続失敗後、凍結解除される日時(UNIX時刻)
  1. {string} SPkey=null - サーバ側公開鍵
- グローバル変数
  1. {string} programId - authMenuを呼び出すプロジェクト(関数)名
  1. {Object} CSkey - クライアント側の秘密鍵
  1. {string} CPkey - クライアント側の公開鍵

**注意事項**

1. local/sessionStorageに`authMenu`キーがない場合、作成
1. グローバル変数にCS/CPkeyがない場合、作成

※ sessionStorageに秘密鍵を保存することができないため、鍵ペアはonload時に生成し、グローバル変数として保持する

## authServerの適用値設定

1. {Object.<string>:<Function>} func={} - 使用する関数を集めたオブジェクト
1. {number} loginRetryInterval=3,600,000(60分) - 前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
1. {number} numberOfLoginAttempts=3 - ログイン失敗になるまでの試行回数
1. {number} loginGraceTime=900,000(15分) - パスコード生成からログインまでの猶予時間(ミリ秒)
1. {number} userLoginLifeTime=86,400,000(24時間) - クライアント側ログイン(CPkey)有効期間
1. {string} masterSheet='master' - 参加者マスタのシート名
1. {string} primatyKeyColumn='userId' - 主キーとなる項目名。主キーは数値で設定
1. {string} emailColumn='email' - e-mailを格納する項目名

## documentPropertiesのサーバ・ユーザ情報保存

- DocumentProperties : `"authServer"(固定)`
  1. {string} passPhrase - サーバ側鍵ペア生成の際のパスフレーズ
  1. {Object} SCkey - サーバ側秘密鍵
  1. {string} SPkey - サーバ側公開鍵
- DocumentProperties : `(ユーザID)`
  1. {number} userId - ユーザID
  1. {string} email - e-mail
  1. {number} created - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} CPKey - ユーザの公開鍵
  1. {number} auth - ユーザの権限
  1. {Object[]} log - ログイン試行のログ。unshiftで保存、先頭を最新にする
     1. {number} startAt - 試行開始日時(UNIX時刻)
     1. {number} passcode - パスコード(原則数値6桁)
     1. {Object[]} trial - 試行。unshiftで保存、先頭を最新にする
        1. {number} timestamp - 試行日時(UNIX時刻)
        1. {number} entered - 入力されたパスコード
        1. {boolean} result - パスコードと入力値の比較結果(true:OK)
        1. {string} message='' - NGの場合の理由。OKなら空文字列
     1. {number} endAt - 試行終了日時(UNIX時刻)
     1. {boolean} result - 試行の結果(true:OK)

# 機能別処理フロー

窃取したIDでの操作を防止するため、clientで有効期間付きの鍵ペアを生成し、依頼元の信頼性を確保する(CSkey, CPkey : clientの秘密鍵・公開鍵)。

また何らかの手段でCPkeyが窃取されて操作要求が行われた場合、処理結果の暗号化で結果受領を阻止するため、server側も鍵ペアを使用する(SSkey, SPkey : serverの秘密鍵・公開鍵)。

以降の図中で`(XSkey/YPkey)`は「X側の秘密鍵で署名、Y側の公開鍵で暗号化する」の意味。

## 新規ユーザ登録

新規登録では、[サーバ側のプロパティサービス](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)にIDとメアドのみ作成する。申込者名等、登録内容についてはユーザ情報の参照・編集画面を呼び出し、修正・加筆を行う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> client : メアド
  activate client
  Note right of client : authMenu.registMail()
  alt sessionにuserId保存済
    client ->> user : userIdをダイアログで表示して終了
  end
  client ->> client : 鍵ペア生成、sessionStorageに保存
  client ->> server : メアド＋CPkey
  activate server
  Note right of server : authServer.registMail()
  property ->> server : userIdマップ
  alt マップにメアドが存在
    server ->> property : userId
    property ->> server : ユーザ情報
    alt CPkeyが不一致
      server ->> property : ユーザ情報(CPkey更新)
    end
    server ->> client : userId
    client ->> user : userIdをダイアログで表示
  else マップにメアドが不在
    server ->> server : userIdを新規採番
    server ->> property : userIdマップ
    server ->> property : userId,メアド,CPkey
    server ->> client : 検索結果＋ユーザ情報＋SPkey
    deactivate server
    client ->> client : userIdをlocal/sessionに、SPkeyをsessionに保存
    client ->> user : 新規登録画面表示
  end
  deactivate client
```

- 参加者が改めて参加要項からメールアドレスを入力するのは「自分のuserIdを失念した」場合を想定
- メアド入力欄は募集要項の一部とし、userId(受付番号)がlocalStrageに存在する場合は表示しない
- 応募締切等、新規要求ができる期間の制限は、client側でも行う(authMenuの有効期間設定を想定)
- メアドは形式チェックのみ行い、到達確認および別ソースとの突合は行わない(ex.在校生メアド一覧との突合)
- ユーザはログインを行わないので、サーバ側のプロパティサービスにID/auth等のユーザ情報は保存しない。
- IDはstoreUserInfo関数を使用してlocal/sessionStorageでの保存を想定(∵タブを閉じても保存したい。個人情報とは言えず、特に問題ないと判断)
- 「検索結果=既存」の場合、ユーザ情報編集画面の表示も検討したが、なりすましでもe-mail入力で個人情報が表示されることになるので不適切と判断。
- 申込時に自分限定の申込情報操作のためログインすることになるので、メール到達確認はそこで行う

## ログイン要求

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant caller
  participant login
  participant server
  participant property

  caller ->> login : 呼び出し(userId,処理名)
  activate login
  Note right of login : authMenu.login()
  alt 鍵ペアが無効
    login ->> login : 鍵ペア再生成＋sessionに保存
  end

  login ->> server : userId,CPkey(SPkey/--)
  activate server
  Note right of server : authServer.login1S()
  server ->> property : userId
  property ->> server  : ユーザ情報
  server ->> server : 実行権限確認(※1)
  alt 実行権限確認結果がOK or NG
    server ->> login : OK or NG
    login ->> caller : OK or NG
  end

  server ->> server : パスコード・要求ID生成(※2)
  server ->> property : パスコード,要求ID,要求時刻
  server ->> user : パスコード連絡メール
  server ->> login : OK＋要求ID
  deactivate server
  login ->> user : パスコード入力ダイアログ

  user ->> login : パスコード入力
  login ->> server : userId,パスコード＋要求ID(CS/SP)
  activate server
  Note right of server : authServer.login2S()
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : パスコード検証(※3)
  server ->> property : 検証結果記録
  server ->> login : OK or NG
  deactivate server
  login ->> caller : OK or NG
  deactivate login
```

- ※1 : 実行権限確認<br>
  | 実行権限 | CPkey | 凍結 | 結論 |
  | :-- | :-- | :-- | :-- |
  | 無し | — | — | NG (no permission) |
  | 有り | 有効 | — | OK |
  | 有り | 無効 | true | NG (lockout) |
  | 有り | 無効 | false | 以降の処理を実施 |
  - 実行権限 : authServer内関数毎の所要権限 & ユーザ権限 > 0 ? 有り : 無し
  - CPkey : ① and ② ? 有効 : 無効<br>
  ①送られてきたCPkeyがユーザ毎のプロパティサービスに保存されたCPkeyと一致<br>
  ②ユーザ毎のプロパティサービスに保存されたCPkeyが有効期限内
  - 凍結 : 前回ログイン失敗(3回連続失敗)から一定時間内 ? true : false
- ※2 : パスコード・要求ID生成
  - パスコードは数値6桁(既定値)
  - 要求IDはuserIdと要求時刻(UNIX時刻)を連結した文字列のMD5(or CRC32)をbase64化
- ※3 : 「パスコード検証」は復号・署名確認の上、以下の点をチェックする
  - 復号可能且つ署名が一致
  - 送付されたパスコード・要求IDがプロパティサービスのそれと一致
  - 試行回数が一定数以下(既定値3回)
  - パスコード生成から一定時間内(既定値15分)
  - ログイン可能な権限
- パスコード再発行は凍結中以外認めるが、再発行前の失敗は持ち越す。<br>
  例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結

## ユーザ情報の参照・編集

シートの操作(CRUD)は、管理者が事前に`{操作名:実行関数}`の形でソースに埋め込んで定義する。<br>
例：`{lookup:(arg)=>data.find(x=>x.id==arg.id)}`

userは要求時に操作名を指定し、その実行結果を受け取る。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  participant sheet

  user ->> client : 操作要求
  activate client
  client ->> client : ログイン要求
  alt ログインNG
    client ->> user : エラー
  end
  
  client ->> server : ID,引数(CSkey/SPkey)
  activate server
  Note right of server : authServer.operation(xxx)
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : 引数を復号
  alt 復号不可
    server ->> client : エラーメッセージ
    client ->> user : ダイアログを出して終了
  end

  server ->> sheet : 操作名(xxx)に対応する関数呼び出し
  sheet ->> server : 関数(xxx)の処理結果
  server ->> client : 操作結果(SSkey/CPkey)
  deactivate server
  client ->> client : 復号＋署名検証、画面生成
  client ->> user : 結果表示画面
  deactivate client
```

シートの操作(CRUD)は権限と有効期間の確認が必要なため、以下のようなオブジェクト(ハッシュ)を管理者がソースに埋め込む(configとして定義する)ことで行う。

```
config.operations = {
  lookup : {  // {string} 操作名
    auth : 0, // {number} 操作を許可する権限フラグの論理和
    from : null, // {string} 有効期間を設定する場合、開始日時文字列
    to : null, // {string} 同、終了日時文字列
    func: // {Arrow|Function} 操作を定義する関数
      (data,id) => data.find(x => x.id === id),
  },
  list : {...},
  update : {...},
  ...
}
```

## 権限設定、変更

権限を付与すべきかは個別に判断する必要があるため、システム化せず、管理者がソース(`authServer.changeAuth()`)を直接編集、GASコンソール上で実行する。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> admin : 権限要求
  admin ->>+ server : 権限設定状況確認
  Note right of server : authServer.listAuth()
  server ->>- admin : 権限設定リスト
  admin ->>+ server : ソース修正、実行
  Note right of server : authServer.changeAuth()
  server ->> property : 権限変更
  server ->>- admin : 権限設定リスト
```

# フォルダ構成、ビルド手順

クライアント(ブラウザ)側の"class authMenu"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

- archves : アーカイブ
- doc/ : readme.mdの各記事のソース集
  - proto.md : readme.mdのプロトタイプ
  - xxx.md : readme.mdに埋め込む各記事のソース
- src/ : プログラムソース
  - config.common.js : client/server共通config
  - config.client.js : client特有のconfig
  - config.server.js : server特有のconfig
  - authMenu.js : class authMenuのテンプレート
  - authServer.js : class authServerのテンプレート
  - authXxxx.yyyy.js : class authMenu/Server各メソッドのソース
- test/ : テスト用
- build.sh : client/server全体のビルダ
- index.html : クライアント側のソース
- server.gs : サーバ側のソース
- initialize.gs : サーバ側初期化処理のソース
- readme.md : doc配下を統合した、client/server全体の仕様書

# 仕様(JSDoc)

* [authMenu](#authMenu)
    * [new authMenu(arg)](#new_authMenu_new)
    * [.storeUserInfo(userId)](#authMenu+storeUserInfo) ⇒ <code>void</code>
    * [.genNavi(wrapper, navi)](#authMenu+genNavi) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_authMenu_new"></a>

## new authMenu(arg)

| Param | Type |
| --- | --- |
| arg | <code>Object</code> | 

<a name="authMenu+storeUserInfo"></a>

## authMenu.storeUserInfo(userId) ⇒ <code>void</code>
sessionStorage/localStorageのユーザ情報を更新する

①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。

**Kind**: instance method of [<code>authMenu</code>](#authMenu)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> | 決まったユーザIDを指定する場合に指定 |

**Example**  
**実行結果(例)**

- localStorage : ユーザIDのみ。以下は例。
  | Key | Value |
  | :-- | :-- |
  | authMenu | 123 |
- sessionStorage : ユーザID＋ユーザ権限
  | Key | Value |
  | :-- | :-- |
  | authMenu | {"userId":123,"auth":1} |

**HTMLへのユーザIDの埋め込み**

応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
以下のようにHTMLにIDが埋め込まれて返される。

1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
   ```
   https://script.google.com/macros/s/AK〜24yz/exec?id=123
   ```
2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
   ```
   <div style="display:none" name="userId"><?= userId ?></div>
   ```
3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
   ```
   function doGet(e){
     const template = HtmlService.createTemplateFromFile('index');
     template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
     const htmlOutput = template.evaluate();
     htmlOutput.setTitle('camp2024');
     return htmlOutput;
   }
   ```
4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
<a name="authMenu+genNavi"></a>

## authMenu.genNavi(wrapper, navi) ⇒ <code>null</code> \| <code>Error</code>
親要素を走査してナビゲーションを作成

**Kind**: instance method of [<code>authMenu</code>](#authMenu)  

| Param | Type | Description |
| --- | --- | --- |
| wrapper | <code>HTMLElement</code> | body等の親要素。 |
| navi | <code>HTMLElement</code> | nav等のナビゲーション領域 |

**Kind**: global function  
**Returns**: <code>Object</code> - 分岐先処理での処理結果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> |  |
| func | <code>string</code> | <code>null</code> | 分岐先処理名 |
| arg | <code>string</code> | <code>null</code> | 分岐先処理に渡す引数オブジェクト |

# テクニカルメモ

## GAS/htmlでの暗号化

#### 手順

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant sheet
  actor admin

  Note right of server : authServer.constructor()
  server ->> server : server鍵ペア生成


```

- server鍵ペア生成


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

#### javascript用

- Node.jsスタイルで書かれたコードをブラウザ上で動くものに変換 : [ざっくりbrowserify入門](https://qiita.com/fgkm/items/a362b9917fa5f893c09a)
- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ


#### GAS用

GASでは鍵ペア生成はできない ⇒ openssl等で作成し、プロパティサービスに保存しておく。

- stackoverflow[Generate a public / private Key RSA with Apps Scripts](https://stackoverflow.com/questions/51989469/generate-a-public-private-key-rsa-with-apps-scripts)

また、GASでは署名する方法はあるが、暗号化および署名検証の方法が見つからない

- 

- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

鍵ペア生成できそうなのはcrypticoのみ。但しGASライブラリは無いし、requireしなければならない。

- [Google Apps Scriptでrequire()してみる](https://qiita.com/fossamagna/items/7c65e249e1e5ecad51ff)

1. main.jsの`function callHello()`を`global.callHello = function () {`に修正
1. `browserify main.js -o bundle.js`

失敗。GAS側は予め鍵を保存するよう方針転換。

- [.DERと .PEMという拡張子は鍵の中身じゃなくて、エンコーディングを表している](https://qiita.com/kunichiko/items/12cbccaadcbf41c72735#der%E3%81%A8-pem%E3%81%A8%E3%81%84%E3%81%86%E6%8B%A1%E5%BC%B5%E5%AD%90%E3%81%AF%E9%8D%B5%E3%81%AE%E4%B8%AD%E8%BA%AB%E3%81%98%E3%82%83%E3%81%AA%E3%81%8F%E3%81%A6%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%92%E8%A1%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B)

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

# プログラムソース

<details><summary>client.js</summary>

```
class authMenu {
/**
 * @constructor
 * @param {Object} arg 
 * @returns {authMenu|Error}
 */
constructor(arg={}){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1.1; // 引数と既定値からメンバの値を設定
    v.r = this.#setProperties(arg);
    if( v.r instanceof Error ) throw v.r;

    v.step = 1.2; // sessionStorage/localStorageのユーザ情報を更新
    v.r = this.storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2; // アイコン、ナビ、背景の作成
    v.step = 2.1; // アイコンの作成
    this.icon = createElement({
      attr:{class:'icon'},
      event:{click:this.toggle},
      children:[{
        tag:'button',
        children:[{tag:'span'},{tag:'span'},{tag:'span'}],
      }]
    },this.wrapper);
    v.step = 2.2; // ナビゲータの作成
      this.navi = createElement({
      tag:'nav',
    },this.wrapper);
    v.step = 2.3; // ナビゲータ背景の作成
      this.back = createElement({
      attr:{class:'back'},
      event:{click:this.toggle},
    },this.wrapper);

    v.step = 3; // 親要素を走査してナビゲーションを作成
    v.rv = this.genNavi();
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 9; // 終了処理
    v.r = this.changeScreen();
    if( v.r instanceof Error ) throw v.r;
    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** constructorの引数と既定値からthisの値を設定
 * 
 * @param {Object} arg - constructorに渡された引数オブジェクト
 * @returns {null|Error}
 * 
 * @desc
 * 
 * ### <a id="authMenu_memberList">authMenuクラスメンバ一覧</a>
 * 
 * 1. 「**太字**」はインスタンス生成時、必須指定項目
 * 1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
 * 1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット
 * 
 * - wrapper='.authMenu[name="wrapper"] {string|HTMLElement}<br>
 *   メニュー全体を囲む要素。body不可
 * - icon {HTMLElement} : 【*内部*】メニューアイコンとなるHTML要素
 * - navi {HTMLElement} : 【*内部*】ナビ領域となるHTML要素
 * - back {HTMLElement} : 【*内部*】ナビ領域の背景となるHTML要素
 * - userId {number} : ユーザID。this.storeUserInfoで設定
 * - auth=1 {number} : ユーザ(クライアント)の権限
 * - userIdSelector='[name="userId"]' {string}<br>
 *   URLクエリ文字列で与えられたuserIdを保持する要素のCSSセレクタ
 * - publicAuth=1 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更前の権限(一般公開用権限)
 * - memberAuth=2 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更後の権限(参加者用権限)
 * - allow=2**32-1 {number}<br>
 *   data-menuのauth(開示範囲)の既定値
 * - func={} {Object.<string,function>}<br>
 *   メニューから呼び出される関数。ラベルはdata-menu属性の`func`に対応させる。
 * - **home** {string|Object.<number,string>}<br>
 *   文字列の場合、ホーム画面とするdata-menu属性のid。<br>
 *   ユーザ権限別にホームを設定するなら`{auth:スクリーン名(.screen[name])}`形式のオブジェクトを指定。<br>
 *   例(auth=1:一般公開,2:参加者,4:スタッフ)⇒`{1:'実施要領',2:'参加者パス',4:'スタッフの手引き'}`
 * - initialSubMenu=true {boolean}<br>
 *   サブメニューの初期状態。true:開いた状態、false:閉じた状態
 * - css {string} : authMenu専用CSS。書き換えする場合、全文指定すること(一部変更は不可)
 * - toggle {Arrow} : 【*内部*】ナビゲーション領域の表示/非表示切り替え
 * - showChildren {Arror} : 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え
 * - changeScreen {Arror} : 【*内部*】this.homeの内容に従って画面を切り替え
 */
#setProperties(arg){
  const v = {whois:this.constructor.name+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 既定値の定義
    v.default = {
      wrapper: `.${this.constructor.name}[name="wrapper"]`, // {string|HTMLElement}
      userId: null,
      auth: 1, // ユーザ権限の既定値
      userIdSelector: '[name="userId"]',
      publicAuth: 1,
      memberAuth: 2,
      allow: 2 ** 32 - 1, // data-menuのauth(開示範囲)の既定値
      func: {}, // {Object.<string,function>} メニューから呼び出される関数
      home: null,
      initialSubMenu: true, // サブメニューの初期状態。true:開いた状態、false:閉じた状態
    };
    v.default.css = `/* authMenu専用CSS
        authMenu共通変数定義
        --text: テキストおよびハンバーガーアイコンの線の色
        --maxIndex: ローディング画面優先なので、最大値2147483647-1
      */
      .authMenu {
        --text : #000;
        --fore : #fff;
        --back : #ddd;
        --debug : rgba(255,0,0,1);
        --iconSize : 100px;
        --maxIndex : 2147483646;
        --navWidth : 0.7;
      }
      /* ハンバーガーアイコン
        icon周囲にiconSizeの40%程度の余白が必要なのでtop,rightを指定
      */
      .authMenu .icon {
        display : flex;
        justify-content : flex-end;
        place-items : center;
        position : absolute;
        top : calc(var(--iconSize) * 0.4);
        right : calc(var(--iconSize) * 0.4);
        width : var(--iconSize);
        height : var(--iconSize);
        z-index : var(--maxIndex);
      }
      .authMenu .icon > button {
        place-content : center center;
        display : block;
        margin : 0;
        padding : 0px;
        box-sizing : border-box;
        width : calc(var(--iconSize) * 0.7);
        height : calc(var(--iconSize) * 0.7);
        border : none;
        background : rgba(0,0,0,0);
        position : relative;
        box-shadow : none;
      }
      .authMenu .icon button span {
        display : block;
        width : 100%;
        height : calc(var(--iconSize) * 0.12);
        border-radius : calc(var(--iconSize) * 0.06);
        position : absolute;
        left : 0;
        background : var(--text);
        transition : top 0.24s, transform 0.24s, opacity 0.24s;
      }
      .authMenu .icon button span:nth-child(1) {
        top : 0;
      }
      .authMenu .icon button span:nth-child(2) {
        top : 50%;
        transform : translateY(-50%);
      }
      .authMenu .icon button span:nth-child(3) {
        top : 100%;
        transform : translateY(-100%);
      }
      .authMenu .icon button span.is_active:nth-child(1) {
        top : 50%;
        transform : translateY(-50%) rotate(135deg);
      }
      .authMenu .icon button span.is_active:nth-child(2) {
        transform : translate(50%, -50%);
        opacity : 0;
      }
      .authMenu .icon button span.is_active:nth-child(3) {
        top : 50%;
        transform : translateY(-50%) rotate(-135deg);
      }
      /* ナビゲーション領域 */
      .authMenu nav {
        display : none;
      }
      .authMenu nav.is_active {
        display : block;
        margin : 0 0 0 auto;
        font-size : 1rem;
        position : absolute;
        top : calc(var(--iconSize) * 1.8);
        right : 0;
        width : calc(100% * var(--navWidth));
        height : var(--iconSize);
        z-index : var(--maxIndex);
      }
      .authMenu nav ul {
        margin : 0rem 0rem 1rem 0rem;
        padding : 0rem 0rem 0rem 0rem;
        background-color : var(--back);
      }
      .authMenu nav ul ul { /* 2階層以降のulにのみ適用 */
        display : none;
      }
      .authMenu nav ul ul.is_open {
        display : block;
        border-top : solid 0.2rem var(--fore);
        border-left : solid 0.7rem var(--fore);
      }
      .authMenu nav li {
        margin : 0.6rem 0rem 0.3rem 0.5rem;
        padding : 0.5rem 0rem 0rem 0rem;
        list-style : none;
        background-color : var(--back);
      }
      .authMenu nav li a {
        color : var(--text);
        text-decoration : none;
        font-size: 1.5rem;
      },
      /* 背景 */
      .authMenu .back {
        display : none;
      }
      .authMenu .back.is_active {
        display : block;
        position : absolute;
        top : 0;
        right : 0;
        width : 100vw;
        height : 100vh;
        z-index : calc(var(--maxIndex) - 1);
        background : rgba(100,100,100,0.8);
      }
    `;
    v.default.toggle = () => {
      // ナビゲーション領域の表示/非表示切り替え
      document.querySelector(`.${this.constructor.name} nav`).classList.toggle('is_active');
      document.querySelector(`.${this.constructor.name} .back`).classList.toggle('is_active');
      document.querySelectorAll(`.${this.constructor.name} .icon button span`)
      .forEach(x => x.classList.toggle('is_active'));        
    };
    v.default.showChildren = (event) => {
      // ブランチの下位階層メニュー表示/非表示切り替え
      event.target.parentNode.querySelector('ul').classList.toggle('is_open');
      let m = event.target.innerText.match(/^([▶️▼])(.+)/);
      const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
      event.target.innerText = text;  
    };
    v.default.changeScreen = (arg=null) => {
      // this.homeの内容に従って画面を切り替える
      if( arg === null ){
        // 変更先画面が無指定 => ホーム画面を表示
        arg = typeof this.home === 'string' ? this.home : this.home[this.auth];
      }
      return changeScreen(arg);
    }

    v.step = 2; // 引数と既定値から設定値のオブジェクトを作成
    v.arg = mergeDeeply(arg,v.default);
    if( v.arg instanceof Error ) throw v.arg;

    v.step = 3; // メンバに設定値をコピー
    for( v.x in v.arg ) this[v.x] = v.arg[v.x];

    v.step = 4; // wrapperが文字列(CSSセレクタ)ならHTMLElementに変更
    if( typeof this.wrapper === 'string' ){
      this.wrapper = document.querySelector(this.wrapper);
    }
    v.step = 5; // authMenu専用CSSが未定義なら追加
    if( !document.querySelector(`style[name="${this.constructor.name}"]`) ){
      v.styleTag = document.createElement('style');
      v.styleTag.setAttribute('name',this.constructor.name);
      v.styleTag.textContent = this.css;
      document.head.appendChild(v.styleTag);
    }
    v.step = 6; // 待機画面が未定義ならbody直下に追加
    if( !document.querySelector('body > div[name="loading"]') ){
      v.r = createElement({
        attr:{name:'loading',class:'loader screen'},
        text:'loading...'
      },'body');
    }

    v.step = 7; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** sessionStorage/localStorageのユーザ情報を更新する
 * 
 * ①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
 * ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
 * localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。
 * 
 * @param {number} userId=null - 決まったユーザIDを指定する場合に指定
 * @returns {void}
 * 
 * @example
 * 
 * **実行結果(例)**
 * 
 * - localStorage : ユーザIDのみ。以下は例。
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | 123 |
 * - sessionStorage : ユーザID＋ユーザ権限
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | {"userId":123,"auth":1} |
 * 
 * **HTMLへのユーザIDの埋め込み**
 * 
 * 応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
 * 以下のようにHTMLにIDが埋め込まれて返される。
 * 
 * 1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
 *    ```
 *    https://script.google.com/macros/s/AK〜24yz/exec?id=123
 *    ```
 * 2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
 *    ```
 *    <div style="display:none" name="userId"><?= userId ?></div>
 *    ```
 * 3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
 *    ```
 *    function doGet(e){
 *      const template = HtmlService.createTemplateFromFile('index');
 *      template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
 *      const htmlOutput = template.evaluate();
 *      htmlOutput.setTitle('camp2024');
 *      return htmlOutput;
 *    }
 *    ```
 * 4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
 * 
 */
storeUserInfo(userId=null){
  const v = {whois:'storeUserInfo',rv:null,step:0,html:null,arg:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // オプションの既定値をセット

    v.step = 2.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:this.publicAuth};
    v.step = 2.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? Number(v.r) : null;
    v.step = 2.3; // HTMLに埋め込まれたuserIdを取得
    v.dom = document.querySelector(this.userIdSelector);
    if( v.dom !== null ){
      v.r = v.dom.innerText;
      v.html = v.r.length > 0 ? Number(v.r) : null;  
    }
    v.step = 2.4; // 引数で渡されたuserIdを取得
    if( userId !== null ) v.arg = Number(userId);

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === this.publicAuth ){
      v.session.auth = this.memberAuth;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.session.userId);
    v.step = 3.3; // メンバに保存
    this.userId = v.session.userId;
    this.auth = v.session.auth;

    v.step = 4; // 終了処理
    v.rv = v.session;
    console.log(`${v.whois} normal end.\n`
    +`v.session=${JSON.stringify(v.session)}\nv.local=${v.local}\nv.html=${v.html}\nv.arg=${v.arg}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // ===================================
  // メニュー関係(旧BurgerMenu)
  // ===================================
/** data-menu属性の文字列をオブジェクトに変換
 * authMenu専用として、以下の制限は許容する
 * - メンバ名は英小文字に限定
 * - カンマは区切記号のみで、id,label,func,hrefの値(文字列)内には不存在
 * 
 * @param {string} arg - data-menuにセットされた文字列
 * @returns {Object|null|Error} 引数がnullまたは空文字列ならnullを返す
 */
#objectize(arg){
  const v = {whois:this.constructor.name+'.objectize',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // nullまたは空文字列にはnullを返す
    if( !arg || arg.length === 0 ) return null;

    v.step = 2; // カンマで分割
    v.p = arg.split(',');

    v.step = 3; // 各値をオブジェクト化
    for( v.i=0 ; v.i<v.p.length ; v.i++ ){
      v.m = v.p[v.i].match(/^([a-z]+):['"]?(.+?)['"]?$/);
      if( v.m ){
        v.rv[v.m[1]] = v.m[2];
      } else {
        throw new Error('data-menuの設定値が不適切です\n'+arg);
      }
    }

    v.step = 4.1; // idの存否チェック
    if( !v.rv.hasOwnProperty('id') )
      throw new Error('data-menuの設定値にはidが必須です\n'+arg);
    v.step = 4.2; // ラベル不在の場合はidをセット
    if( !v.rv.hasOwnProperty('label') )
      v.rv.label = v.rv.id;
    v.step = 4.3; // allowの既定値設定
    v.rv.allow = v.rv.hasOwnProperty('allow') ? Number(v.rv.allow) : this.allow;
    v.step = 4.4; // func,href両方有ればhrefを削除
    if( v.rv.hasOwnProperty('func') && v.rv.hasOwnProperty('href') )
      delete v.rv.href;
    v.step = 4.5; // from/toの既定値設定
    v.rv.from = v.rv.hasOwnProperty('from')
      ? new Date(v.rv.from).getTime() : 0;  // 1970/1/1(UTC)
    v.rv.to = v.rv.hasOwnProperty('to')
      ? new Date(v.rv.from).getTime() : 253402182000000; // 9999/12/31(UTC)

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** 親要素を走査してナビゲーションを作成
 * @param {HTMLElement} wrapper - body等の親要素。
 * @param {HTMLElement} navi - nav等のナビゲーション領域
 * @returns {null|Error}
 */
genNavi(wrapper=this.wrapper,navi=this.navi,depth=0){
  const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
  console.log(`${v.whois} start.`);
  try {

    if( depth === 0 ){
      v.step = 1.1; // sessionStorageからユーザ権限を読み取り
      v.r = sessionStorage.getItem(this.constructor.name);
      if( !v.r ) throw new Error(`sessionStorageに${this.constructor.name}キーが存在しません`);
      this.auth = JSON.parse(v.r).auth;

      v.step = 1.2; // navi領域をクリア
      navi.innerHTML = '';
    }

    // 子要素を順次走査し、data-menuを持つ要素をnaviに追加
    for( v.i=0 ; v.i<wrapper.childElementCount ; v.i++ ){
      v.d = wrapper.children[v.i];

      // wrapper内のdata-menu属性を持つ要素に対する処理
      v.step = 2.1; // data-menuを持たない要素はスキップ
      v.attr = this.#objectize(v.d.getAttribute(`data-menu`));
      if( v.attr instanceof Error ) throw v.attr;
      if( v.attr === null ) continue;

      v.step = 2.2; // screenクラスが無ければ追加
      v.class = v.d.className.match(/screen/);
      if( !v.class ) v.d.classList.add('screen'); 
      v.step = 2.3; // nameが無ければ追加
      v.name = v.d.getAttribute('name');
      if( !v.name ){
        v.name = v.attr.id;
        v.d.setAttribute('name',v.name);
      }

      // navi領域への追加が必要か、判断
      v.step = 3.1; // 実行権限がない機能・画面はnavi領域に追加しない
      if( (this.auth & v.attr.allow) === 0 ) continue;
      v.step = 3.2; // 有効期間外の場合はnavi領域に追加しない
      if( v.now < v.attr.from || v.attr.to < v.now ) continue;

      v.step = 4; // navi領域にul未設定なら追加
      if( navi.tagName !== 'UL' ){
        v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
        if( v.r instanceof Error ) throw v.r;
        navi = v.r;
      }

      v.step = 5; // メニュー項目(li)の追加
      v.li = {tag:'li',children:[{
        tag:'a',
        text:v.attr.label,
        attr:{class:this.constructor.name,name:v.attr.id},
      }]};
      v.hasChild = false;
      if( v.attr.hasOwnProperty('func') ){
        v.step = 5.1; // 指定関数実行の場合
        Object.assign(v.li.children[0],{
          attr:{href:'#',name:v.attr.func},
          event:{click:(event)=>{
            this.toggle();  // メニューを閉じる
            this.func[event.target.name](event); // 指定関数の実行
            this.genNavi(); // メニュー再描画
          }},
        });
      } else if( v.attr.hasOwnProperty('href') ){
        v.step = 5.2; // 他サイトへの遷移指定の場合
        Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
        Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
      } else {
        v.step = 5.3; // その他(=画面切替)の場合
        // 子孫メニューがあるか確認
        if( v.d.querySelector(`[data-menu]`) ){
          v.step = 5.33; // 子孫メニューが存在する場合
          v.hasChild = true; // 再帰呼出用のフラグを立てる
          Object.assign(v.li.children[0],{
            // 初期がサブメニュー表示ならclassにis_openを追加
            attr:{class:(this.initialSubMenu ? 'is_open' : '')},
            // '▼'または'▶︎'をメニューの前につける
            text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
            event: {click:this.showChildren}
          });
        } else { // 子孫メニューが存在しない場合
          v.step = 5.33; // nameを指定して画面切替
          Object.assign(v.li.children[0],{
            event:{click:(event)=>{
              this.changeScreen(event.target.getAttribute('name'));
              this.toggle();
            }}
          });
        }
      }

      v.step = 5.4; // navi領域にliを追加
      v.r = createElement(v.li,navi);
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.5; // 子要素にdata-menuが存在する場合、再帰呼出
      if( v.hasChild ){
        v.r = this.genNavi(v.d,v.r,depth+1);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 6; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

}
```

</details>

<details><summary>server.gs</summary>

```
/** サーバ側の認証処理を分岐させる
 * @param {number} userId 
 * @param {string} func - 分岐先処理名
 * @param {string} arg - 分岐先処理に渡す引数オブジェクト
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{}};
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 既定値をwに登録
/** authServerの適用値を設定
 * 
 * これら設定値はプロジェクトにより異なるため、
 * プロジェクト毎に適宜ソースを修正して使用すること。
 * 
 * @param {number|null} userId 
 * @returns {null}
 * 
 * 1. propertyName='authServer' {string}<br>
 *    プロパティサービスのキー名
 * 1. loginRetryInterval=3,600,000(60分) {number}<br>
 *    前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
 * 1. numberOfLoginAttempts=3 {number}<br>
 *    ログイン失敗になるまでの試行回数
 * 1. loginGraceTime=900,000(15分) {number}<br>
 *    パスコード生成からログインまでの猶予時間(ミリ秒)
 * 1. userLoginLifeTime=86,400,000(24時間) {number}<br>
 *    クライアント側ログイン(CPkey)有効期間
 * 1. masterSheet='master' {string}<br>
 *    参加者マスタのシート名
 * 1. primatyKeyColumn='userId' {string}<br>
 *    主キーとなる項目名。主キーは数値で設定
 * 1. emailColumn='email' {string}<br>
 *    e-mailを格納するシート上の項目名
 */
w.func.setProperties = function(){
  const v = {whois:w.whois+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 適用値をセット
    w.propertyName = 'authServer';
    w.loginRetryInterval = 3600000;
    w.numberOfLoginAttempts = 3;
    w.loginGraceTime = 900000;
    w.userLoginLifeTime = 86400000;
    w.masterSheet = 'master';
    w.primatyKeyColumn ='userId';
    w.emailColumn = 'email';

    v.step = 2; // 鍵ペア不存在なら生成
    v.prop = PropertiesService.getDocumentProperties().getProperty(w.propertyName);
    if( v.prop === null ){
      v.prop = {passPhrase:createPassword(16)};
      v.prop.SCkey = cryptico.generateRSAKey(v.prop.passPhrase,1024);
      v.prop.SPkey = cryptico.publicKeyString(v.prop.SCkey);
      PropertiesService.getDocumentProperties().setProperty(w.propertyName,v.prop);
    }
    console.log(v.prop);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.setProperties(arg);
if( w.rv instanceof Error ) throw w.rv;

    if( userId === null ){ // userIdが不要な処理
      if( ['registMail'].find(x => x === func) ){
        w.step = 1; // userId未定でも可能な処理 ⇒ 一般公開用
/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    v.step = 3; // 既登録メアドでは無いか確認
    v.m = v.master.data.find(x => x[w.emailColumn] === email);
    if( v.m ) throw new Error(`"${email}" has already registrated.`);

    v.step = 4; // 新規userIdを採番
    if( v.master.data.length === 0 ){
      v.rv = 1;
    } else {
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 5; // シートに登録
    v.r = v.master.insert([{
      userId:v.rv,
      email:email,
      created:toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')
    }]);
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.registMail(arg);
if( w.rv instanceof Error ) throw w.rv;
      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {  // userIdが必要な処理
      if( ['login1S'].find(x => x === func) ){
        w.step = 3; // ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object}
 * 
 * @example
 * 
 * サーバ側に鍵ペアが存在しない場合は自動生成してプロパティサービスに保存
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`w.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`w.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    // userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois);
    if( v.RSA === null ){
      v.step = 1.1;
      v.bits = 1024;  // ビット長
      v.RSA.passPhrase = createPassword(16); // 16桁のパスワードを自動生成
      v.step = 1.2; // 秘密鍵の生成
      v.RSA.privateKey = cryptico.generateRSAKey(v.RSA.passPhrase, v.bits);
      v.step = 1.3; // 公開鍵の生成
      v.RSA.publicKey = cryptico.publicKeyString(v.RSA.privateKey);
      PropertiesService.getDocumentProperties().setProperty(w.whois,v.RSA);
    }

    v.step = 2; // クライアント側情報の取得
    v.client = PropertiesService.getDocumentProperties().getProperty(userId);

    if( v.client === null ){
      v.step = 3; // クライアント側情報未登録 ⇒ 空オブジェクトを返す
      v.client = {
        userId: userId,
        email: '',
        created: Date.now(),
        publicKeyID: '',
        authority: 2,
        log: [],
      };
      PropertiesService.getDocumentProperties().setProperty(userId,v.client);
    } else {
      v.step = 4; // クライアント側情報登録済
      v.step = 4.1; // 引数の復元
      v.decrypt = cryptico.decrypt(arg,v.RSA.privateKey);
      console.log(`v.decrypt=${stringify(v.decrypt)}`);
      v.step = 4.2; // 署名の検証
      v.decrypt.publicKeyID = cryptico.publicKeyID(v.decrypt.publicKeyString);
      v.decrypt.verify = v.client.publicKeyID === v.decrypt.publicKeyID;
      v.step = 4.3; // 有効期間の確認。　※親関数のvalidityPeriodを使用
      v.decrypt.validityPeriod = (v.client.created + w.validityPeriod) < Date.now();
      v.step = 4.3; // 戻り値をオブジェクト化
      v.rv = v.decrypt.status === 'success' && v.decrypt.verify && v.decrypt.validityPeriod
      ? JSON.parse(v.decrypt.plaintext)
      : new Error(`cryptico.decrypt error.`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    console.log(`type = ${typeof v.rv}\npassPhrase="${v.rv.passPhrase}\npublicKey="${v.rv.publicKey}"`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
w.r = w.func.verifySignature(userId,arg);
if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
```

</details>

# 改版履歴

- rev 1.0.0 : 2024/04/20
  - "class authMenu(rev 1.2.0)"および作成途中の"class Auth(rev 2.0.0)"を統合
  - "storeUserInfo(rev 1.0.0)"を吸収
-->
<a name="ac0000"></a>
<style>
/* -----------------------------------------------
  library/CSS/1.3.0/core.css
----------------------------------------------- */
html, body{
  width: 100%;
  margin: 0;
  /*font-size: 4vw;*/
  text-size-adjust: none; /* https://gotohayato.com/content/531/ */
}
body * {
  font-size: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.num, .right {text-align:right;}
.screen {padding: 1rem;} /* SPAでの切替用画面 */
.title { /* Markdown他でのタイトル */
  font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}

/* --- テーブル -------------------------------- */
.table {display:grid}
th, .th, td, .td {
  margin: 0.2rem;
  padding: 0.2rem;
}
th, .th {
  background-color: #888;
  color: white;
}
td, .td {
  border-bottom: solid 1px #aaa;
  border-right: solid 1px #aaa;
}

/* --- 部品 ----------------------------------- */
.triDown { /* 下向き矢印 */
  --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}

/* --- 部品：待機画面 --------------------------- */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(204,204,204, 0.2);
  border-right: 1.1em solid rgba(204,204,204, 0.2);
  border-bottom: 1.1em solid rgba(204,204,204, 0.2);
  border-left: 1.1em solid #cccccc;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<p class="title">class authMenu</p>


# 目次

1. <a href="#ac0001">機能概要</a>
1. <a href="#ac0002">使用方法</a>
   1. <a href="#ac0003">body部での要素定義</a>
      1. <a href="#ac0004">クエリ文字列の受取</a>
      1. <a href="#ac0005">メニュー要素の定義</a>
      1. <a href="#ac0006">data-menu属性に設定する文字列</a>
   1. <a href="#ac0007">authMenuの適用値設定</a>
      1. <a href="#ac0008">インスタンス生成時の処理フロー</a>
      1. <a href="#ac0009">scriptサンプル</a>
   1. <a href="#ac0010">グローバル変数、local/sessionStorageのユーザ情報保存</a>
   1. <a href="#ac0011">authServerの適用値設定</a>
   1. <a href="#ac0012">documentPropertiesのサーバ・ユーザ情報保存</a>
1. <a href="#ac0013">機能別処理フロー</a>
   1. <a href="#ac0014">新規ユーザ登録</a>
   1. <a href="#ac0015">ログイン要求</a>
   1. <a href="#ac0016">ユーザ情報の参照・編集</a>
   1. <a href="#ac0017">権限設定、変更</a>
1. <a href="#ac0018">フォルダ構成、ビルド手順</a>
1. <a href="#ac0019">仕様(JSDoc)</a>
   1. <a href="#ac0020">new authMenu(arg)</a>
   1. <a href="#ac0021">authMenu.storeUserInfo(userId) ⇒ <code>void</code></a>
   1. <a href="#ac0022">authMenu.genNavi(wrapper, navi) ⇒ <code>null</code> \| <code>Error</code></a>
1. <a href="#ac0023">テクニカルメモ</a>
   1. <a href="#ac0024">GAS/htmlでの暗号化</a>
         1. <a href="#ac0025">手順</a>
         1. <a href="#ac0026">javascript用</a>
         1. <a href="#ac0027">GAS用</a>
1. <a href="#ac0028">プログラムソース</a>
1. <a href="#ac0029">改版履歴</a>

# 1 機能概要<a name="ac0001"></a>

[先頭](#ac0000) > 機能概要


htmlからdata-menu属性を持つ要素を抽出、ハンバーガーメニューを作成する。

またHTML上のメニュー(SPAの機能)毎に許容権限を設定し、ユーザ毎に認証することで、表示制御を可能にする。

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="726px" height="271px" viewBox="-0.5 -0.5 726 271"><defs/><g><g><path d="M 328.2 270 L 370.2 78 L 514.2 78 L 472.2 270 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><path d="M 328.2 234 L 370.2 42 L 514.2 42 L 472.2 234 Z" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g><path d="M 466.2 30 L 472.2 0 L 514.2 0 L 508.2 30 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 78px; height: 1px; padding-top: 25px; margin-left: 778px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.icon</font></div></div></div></foreignObject><text x="817" y="29" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.icon</text></switch></g></g><g><path d="M 364.2 198 L 400.2 30 L 508.2 30 L 472.2 198 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 238px; height: 1px; padding-top: 190px; margin-left: 608px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">nav</font></div></div></div></foreignObject><text x="727" y="194" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">nav</text></switch></g></g><g><rect x="388.2" y="204" width="36" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 58px; height: 1px; padding-top: 355px; margin-left: 648px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.back</font></div></div></div></foreignObject><text x="677" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.back</text></switch></g></g><g><rect x="370.2" y="246" width="72" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 425px; margin-left: 618px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><span style="font-size: 20px;">.wrapper</span></div></div></div></foreignObject><text x="677" y="429" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.wrapper</text></switch></g></g><g><rect x="0" y="0" width="253.2" height="258" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 420px; height: 1px; padding-top: 7px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.menu.screen name="wrapper"</font></div></div></div></foreignObject><text x="2" y="19" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.menu.screen name="wrapper"</text></switch></g></g><g><rect x="7.2" y="24" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 47px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c11',label:'掲示板',func:'board'"</font></div></div></div></div></foreignObject><text x="14" y="59" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="72" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 127px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c21',label:'入会申込',href:'https://〜'"</font></div></div></div></div></foreignObject><text x="14" y="139" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="120" width="240" height="132" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 207px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c30',label:'Information'</font></div></div></div></div></foreignObject><text x="14" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="156" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 267px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c31',label:'会場案内図'</font></div></div></div></div></foreignObject><text x="26" y="279" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="204" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 347px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c32',label:'タイムテーブル'</font></div></div></div></div></foreignObject><text x="26" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="580.2" y="3" width="144" height="234" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g/><g><rect x="616.2" y="33" width="108" height="150" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><rect x="622.2" y="39" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 85px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> 掲示板</font></div></div></div></foreignObject><text x="1039" y="89" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> 掲示板</text></switch></g></g><g><rect x="622.2" y="66" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 130px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">入会申込</font></div></div></div></foreignObject><text x="1039" y="134" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">入会申込</text></switch></g></g><g><rect x="622.2" y="93" width="102" height="84" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 162px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> Information</font></div></div></div></foreignObject><text x="1039" y="174" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> Information</text></switch></g></g><g><rect x="628.2" y="117" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 215px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">会場案内図</font></div></div></div></foreignObject><text x="1049" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">会場案内図</text></switch></g></g><g><rect x="628.2" y="147" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 265px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">タイムテーブル</font></div></div></div></foreignObject><text x="1049" y="269" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">タイムテーブル</text></switch></g></g><g/><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><path d="M 697.2 9 L 721.2 9" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 18 L 721.2 18" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 27 L 721.2 27" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 274.2 72 L 310.2 130.5 L 274.2 189 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g><g><path d="M 532.2 70.5 L 568.2 129 L 532.2 187.5 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g></g></svg>

本クラスは**Google SpreadのGASにデプロイし、SPAとして使用する**ことを想定しているため、'camp2024'等の**呼出元**で以下の作業を行う。

1. caller/index.htmlの作成
   1. body部での要素定義
   1. authMenuの適用値設定
   1. グローバル変数、local/sessionStorageでのユーザ情報保存(※1)
   1. class authMenu(=authMenu/client.js)の組み込み(※2)
1. caller/server.gs
   1. authServerの適用値設定
   1. documentPropertiesでのサーバ・ユーザ情報保存(※1)
   1. authServer(=authMenu/server.js)の組み込み(※2)

なお以下2点は自動的に行う。
- ※1 : 「〜情報保存」は、システム側で自動的に処理(作業は発生しない)
- ※2 : 呼出元のbuild.shで自動処理。記述方法は「フォルダ構成、ビルド手順」を参照。

# 2 使用方法<a name="ac0002"></a>

[先頭](#ac0000) > 使用方法


## 2.1 body部での要素定義<a name="ac0003"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > body部での要素定義


<a name="receiving_query_string"></a>

### 2.1.1 クエリ文字列の受取<a name="ac0004"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [body部での要素定義](#ac0003) > クエリ文字列の受取


以下は`https://script.google.com/〜4yz/exec?id=XXX`として、変数`id`でユーザIDを渡している例。

サーバ側でクエリ文字列を受け取り、HTML内の変数`userId`にセット。

```
function doGet(e){
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = e.parameter.id;  // ここ!!
  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('camp2024');
  return htmlOutput;
}
```

クライアント側では`<?= userId ?>`で値を取得。

```
<div style="display:none" name="userId"><?= userId ?></div>
```

以下、querySelector等で適宜参照する。

### 2.1.2 メニュー要素の定義<a name="ac0005"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [body部での要素定義](#ac0003) > メニュー要素の定義


- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="authMenu screen" name="wrapper">
    <div data-menu="id:'イベント情報'">
      <div data-menu="id:'掲示板',func:'dispBoard'"></div>
      <div data-menu="id:'実施要領'">
        <!--：：$tmp/実施要領.html：：--> ※ embedRecursivelyのプレースホルダは一行で記述
      </div>
    </div>
  </div>
(中略)
```

下位の階層を持つ場合、自分自身の表示内容は持たせない(以下はNG)

```
<div data-menu="id:'お知らせ'">
!!NG!! <p>お知らせのページです</p>
  <div data-menu="id:'掲示板'">〜</div>
  <div data-menu="id:'注意事項'">〜</div>
</div>
```

「お知らせ」は「掲示板」「注意事項」のブランチとして扱われるので、「&lt;p&gt;お知らせのページです&lt;/p&gt;」というお知らせページ自身の表示内容は定義不可。

### 2.1.3 data-menu属性に設定する文字列<a name="ac0006"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [body部での要素定義](#ac0003) > data-menu属性に設定する文字列


タグのallowとその人の権限(auth)の論理積>0ならメニューを表示する。

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} id - 【必須】メニューID
- {string} [label] - メニュー化する時の名称。省略時はidを使用
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はauthMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  authMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new authMenu({auth:1})の一般参加者は非表示、
  >     new authMenu({auth:2})のスタッフは表示となる。
- {string} [from='1970/1/1'] - メニュー有効期間の開始日時。Dateオブジェクトで処理可能な日時文字列で指定
- {string} [to='9999/12/31'] - メニュー有効期間の終了日時

注意事項

- func, hrefは排他。両方指定された場合はfuncを優先する
- func, href共に指定されなかった場合、SPAの画面切替指示と見なし、idの画面に切り替える
- href指定の場合、タグ内の文字列は無視される(下例2行目の「テスト」)
  ```
  <div data-menu="id:'c41',label:'これはOK',href:'https://〜'"></div>
  <div data-menu="id:'c41',label:'これはNG',href:'https://〜'">テスト</div>
  ```
- 以下例ではシステム管理者(auth=8)は両方表示されるが、一般ユーザ(auth=1)にはシステム設定は表示されない
  ```
  <div data-menu="allow:9">利用案内</div>
  <div data-menu="allow:8">システム設定</div>
  (中略)
  <script>
    const auth = new Auth(...);  // 利用権限を取得。一般ユーザ:1, 管理者:8
    const menu = new authMenu();
  ```
- ユーザ権限は一般公開部分は`auth=1`とし、auth=0は使用しない(∵0⇒誰も見えない)。以降**権限が大きくなるにつれて大きな数字を使用**する
- 申込フォームのように申込期限がある場合、同一IDで下の例のように設定する。
  ```
  <!-- 申込開始前 〜2024/03/31 -->
  <div data-menu="id:'entryForm',to:'2024/04/01 00:00:00'">
    「まだお申し込みいただけません」
  </div>

  <!-- 申込期間内 2024/04/01〜07 -->
  <div data-menu="id:'entryForm',from:'2024/04/01',to:'2024/04/08 00:00:00'">
    申込フォーム
  </div>

  <!-- 申込終了後 2024/04/08〜 -->
  <div data-menu="id:'entryForm',from:'2024/04/08'">
    「申込は終了しました」
  </div>
  ```
- メニュー生成時点で有効期限を判断、同一IDが複数存在する場合はいずれか一つのDIVのみ残して残りを削除してメニューを生成する。

## 2.2 authMenuの適用値設定<a name="ac0007"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > authMenuの適用値設定


インスタンス生成時の引数はそのまま**authMenuメンバ変数**となる。

以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。

1. 「**太字**」はインスタンス生成時、必須指定項目
1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット

- wrapper='.authMenu.screen[name="wrapper"]' {string|HTMLElement} 作成対象のdata-menuを全て含む親要素。CSSセレクタかHTMLElementで指定。
- func {Object.<string,Function>} メニューから実行する関数を集めたライブラリ
- home {string} ホーム画面として使用するメニューの識別子。無指定の場合、wrapper直下でdata-menu属性を持つ最初の要素
- initialSubMenu=true {boolean} サブメニューの初期状態。true:開いた状態、false:閉じた状態
- css {string} authMenu専用CSS
- toggle {Arrow} 【*内部*】ナビゲーション領域の表示/非表示切り替え
- showChildren {Arrow} 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え

### 2.2.1 インスタンス生成時の処理フロー<a name="ac0008"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [authMenuの適用値設定](#ac0007) > インスタンス生成時の処理フロー


```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> server : 表示要求(URL)
  activate server
  Note right of server : doGet()
  rect rgba(0, 255, 255, 0.1)
    server ->> client : HTML(object)+ID
    activate client
    deactivate server
    Note right of client : authMenu.constructor()
    client ->> client : インスタンス生成
    alt IDが存在
      client ->> user : メンバ用サイト
    else
      client ->> user : 一般公開サイト
    end
    deactivate client

    user ->>+ client : ID入力
    Note right of client : enterUserId()
    client ->> client : storageに保存(storeUserInfo)
    client ->>- user : メンバ用画面
  end
```

- 水色の部分はhtmlのonload時処理
- 表示要求に対するserverからの戻り値(ID)については、「[クエリ文字列の受取](#receiving_query_string)」の項を参照。
- 「インスタンス生成」での処理内容
  1. ユーザ情報を取得、不足分は既定値を設定
     - 引数、HTML埋込情報、sessionStorage、localStorageのユーザ情報を取得
     - IDを特定(引数>HTML埋込>session>local。いずれにも無ければnull)
     - IDが特定されるならauthを一般公開->参加者に変更
  1. 親要素を走査してナビゲーションを作成(アイコン、ナビ領域、背景)
- 図中の`enterUserId()`は、`new authMenu()`の引数として渡された関数

<!--
- 「インスタンス生成」の処理内容
  1. authClient.constructor()
     1. localStorageにIDがあるか確認<br>
        不存在または不一致なら、serverから戻されたIDをlocalStorageに保存
  1. authMenu.constructor()
     1. AuthインスタンスをauthMenuのインスタンスメンバとして生成(以下Burger.auth)
     1. Burger.auth.IDの値に従ってAuthメニュー描画(メニューアイコン、nav領域)

[HtmlOutput.appendUntrusted()](https://developers.google.com/apps-script/reference/html/html-output?hl=ja#appenduntrustedaddedcontent)を使用して、HTMLの要素として返す。

    user ->> client : ID入力
    activate client
    Note right of client : enterUserId()
    client ->> user : メンバ用サイト
    deactivate client

-->

### 2.2.2 scriptサンプル<a name="ac0009"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [authMenuの適用値設定](#ac0007) > scriptサンプル


```
window.addEventListener('DOMContentLoaded',() => {
  const v = {whois:'DOMContentLoaded',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // userId,authをセット
    v.config = storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2.1; // 使用するクラスのインスタンス化
    v.auth = new authMenu();
    v.step = 2.2;
    v.menu = new authMenu({func:{
      enterId:()=>{
        console.log('enterId start.');
        const v = window.prompt('受付番号を入力してください');
        if( v.match(/^[0-9]+/) ){
          v.r = storeUserInfo(v);
          if( v.r instanceof Error ) throw v.r;
          //this.auth = 2; -> thisはwindowになる
          console.log(this);
          //this.genNavi(2); -> thisはwindowになる
        }
      }
    }});

    v.step = 99; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    alert(e.message);
  }
});
```

## 2.3 グローバル変数、local/sessionStorageのユーザ情報保存<a name="ac0010"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > グローバル変数、local/sessionStorageのユーザ情報保存


`onClick`や`addEventListener`から呼ばれる関数にauthMenuインスタンスを渡す必要があるため、**authMenuのインスタンスはグローバル変数として定義**する。

```
<script type="text/javascript">
const g = {};
(中略)
window.addEventListener('DOMContentLoaded',() => {
  g.menu = new authMenu({...});
  (後略)
});
</script>
```

- localStorage : `"authMenu"(固定) : ユーザID(初期値null)`
- sessionStorage : `"authMenu"(固定)`
  1. {number} userId=null - ユーザID
  1. {string} email='' - 連絡先メールアドレス
  1. {number} created=null - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} passPhrase=createPassword() - クライアント側鍵ペア生成の際のパスフレーズ
  1. {number} auth=1 - ユーザの権限
  1. {number} unfreeze=null - ログイン連続失敗後、凍結解除される日時(UNIX時刻)
  1. {string} SPkey=null - サーバ側公開鍵
- グローバル変数
  1. {string} programId - authMenuを呼び出すプロジェクト(関数)名
  1. {Object} CSkey - クライアント側の秘密鍵
  1. {string} CPkey - クライアント側の公開鍵

**注意事項**

1. local/sessionStorageに`authMenu`キーがない場合、作成
1. グローバル変数にCS/CPkeyがない場合、作成

※ sessionStorageに秘密鍵を保存することができないため、鍵ペアはonload時に生成し、グローバル変数として保持する

## 2.4 authServerの適用値設定<a name="ac0011"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > authServerの適用値設定


1. {Object.<string>:<Function>} func={} - 使用する関数を集めたオブジェクト
1. {number} loginRetryInterval=3,600,000(60分) - 前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
1. {number} numberOfLoginAttempts=3 - ログイン失敗になるまでの試行回数
1. {number} loginGraceTime=900,000(15分) - パスコード生成からログインまでの猶予時間(ミリ秒)
1. {number} userLoginLifeTime=86,400,000(24時間) - クライアント側ログイン(CPkey)有効期間
1. {string} masterSheet='master' - 参加者マスタのシート名
1. {string} primatyKeyColumn='userId' - 主キーとなる項目名。主キーは数値で設定
1. {string} emailColumn='email' - e-mailを格納する項目名

## 2.5 documentPropertiesのサーバ・ユーザ情報保存<a name="ac0012"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > documentPropertiesのサーバ・ユーザ情報保存


- DocumentProperties : `"authServer"(固定)`
  1. {string} passPhrase - サーバ側鍵ペア生成の際のパスフレーズ
  1. {Object} SCkey - サーバ側秘密鍵
  1. {string} SPkey - サーバ側公開鍵
- DocumentProperties : `(ユーザID)`
  1. {number} userId - ユーザID
  1. {string} email - e-mail
  1. {number} created - ユーザ側鍵ペアの作成日時(UNIX時刻)。有効期間検証に使用
  1. {string} CPKey - ユーザの公開鍵
  1. {number} auth - ユーザの権限
  1. {Object[]} log - ログイン試行のログ。unshiftで保存、先頭を最新にする
     1. {number} startAt - 試行開始日時(UNIX時刻)
     1. {number} passcode - パスコード(原則数値6桁)
     1. {Object[]} trial - 試行。unshiftで保存、先頭を最新にする
        1. {number} timestamp - 試行日時(UNIX時刻)
        1. {number} entered - 入力されたパスコード
        1. {boolean} result - パスコードと入力値の比較結果(true:OK)
        1. {string} message='' - NGの場合の理由。OKなら空文字列
     1. {number} endAt - 試行終了日時(UNIX時刻)
     1. {boolean} result - 試行の結果(true:OK)

# 3 機能別処理フロー<a name="ac0013"></a>

[先頭](#ac0000) > 機能別処理フロー


窃取したIDでの操作を防止するため、clientで有効期間付きの鍵ペアを生成し、依頼元の信頼性を確保する(CSkey, CPkey : clientの秘密鍵・公開鍵)。

また何らかの手段でCPkeyが窃取されて操作要求が行われた場合、処理結果の暗号化で結果受領を阻止するため、server側も鍵ペアを使用する(SSkey, SPkey : serverの秘密鍵・公開鍵)。

以降の図中で`(XSkey/YPkey)`は「X側の秘密鍵で署名、Y側の公開鍵で暗号化する」の意味。

## 3.1 新規ユーザ登録<a name="ac0014"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0013) > 新規ユーザ登録


新規登録では、[サーバ側のプロパティサービス](#332-%E3%83%A6%E3%83%BC%E3%82%B6%E6%83%85%E5%A0%B1)にIDとメアドのみ作成する。申込者名等、登録内容についてはユーザ情報の参照・編集画面を呼び出し、修正・加筆を行う。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> client : メアド
  activate client
  Note right of client : authMenu.registMail()
  alt sessionにuserId保存済
    client ->> user : userIdをダイアログで表示して終了
  end
  client ->> client : 鍵ペア生成、sessionStorageに保存
  client ->> server : メアド＋CPkey
  activate server
  Note right of server : authServer.registMail()
  property ->> server : userIdマップ
  alt マップにメアドが存在
    server ->> property : userId
    property ->> server : ユーザ情報
    alt CPkeyが不一致
      server ->> property : ユーザ情報(CPkey更新)
    end
    server ->> client : userId
    client ->> user : userIdをダイアログで表示
  else マップにメアドが不在
    server ->> server : userIdを新規採番
    server ->> property : userIdマップ
    server ->> property : userId,メアド,CPkey
    server ->> client : 検索結果＋ユーザ情報＋SPkey
    deactivate server
    client ->> client : userIdをlocal/sessionに、SPkeyをsessionに保存
    client ->> user : 新規登録画面表示
  end
  deactivate client
```

- 参加者が改めて参加要項からメールアドレスを入力するのは「自分のuserIdを失念した」場合を想定
- メアド入力欄は募集要項の一部とし、userId(受付番号)がlocalStrageに存在する場合は表示しない
- 応募締切等、新規要求ができる期間の制限は、client側でも行う(authMenuの有効期間設定を想定)
- メアドは形式チェックのみ行い、到達確認および別ソースとの突合は行わない(ex.在校生メアド一覧との突合)
- ユーザはログインを行わないので、サーバ側のプロパティサービスにID/auth等のユーザ情報は保存しない。
- IDはstoreUserInfo関数を使用してlocal/sessionStorageでの保存を想定(∵タブを閉じても保存したい。個人情報とは言えず、特に問題ないと判断)
- 「検索結果=既存」の場合、ユーザ情報編集画面の表示も検討したが、なりすましでもe-mail入力で個人情報が表示されることになるので不適切と判断。
- 申込時に自分限定の申込情報操作のためログインすることになるので、メール到達確認はそこで行う

## 3.2 ログイン要求<a name="ac0015"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0013) > ログイン要求


```mermaid
sequenceDiagram
  autonumber
  actor user
  participant caller
  participant login
  participant server
  participant property

  caller ->> login : 呼び出し(userId,処理名)
  activate login
  Note right of login : authMenu.login()
  alt 鍵ペアが無効
    login ->> login : 鍵ペア再生成＋sessionに保存
  end

  login ->> server : userId,CPkey(SPkey/--)
  activate server
  Note right of server : authServer.login1S()
  server ->> property : userId
  property ->> server  : ユーザ情報
  server ->> server : 実行権限確認(※1)
  alt 実行権限確認結果がOK or NG
    server ->> login : OK or NG
    login ->> caller : OK or NG
  end

  server ->> server : パスコード・要求ID生成(※2)
  server ->> property : パスコード,要求ID,要求時刻
  server ->> user : パスコード連絡メール
  server ->> login : OK＋要求ID
  deactivate server
  login ->> user : パスコード入力ダイアログ

  user ->> login : パスコード入力
  login ->> server : userId,パスコード＋要求ID(CS/SP)
  activate server
  Note right of server : authServer.login2S()
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : パスコード検証(※3)
  server ->> property : 検証結果記録
  server ->> login : OK or NG
  deactivate server
  login ->> caller : OK or NG
  deactivate login
```

- ※1 : 実行権限確認<br>
  | 実行権限 | CPkey | 凍結 | 結論 |
  | :-- | :-- | :-- | :-- |
  | 無し | — | — | NG (no permission) |
  | 有り | 有効 | — | OK |
  | 有り | 無効 | true | NG (lockout) |
  | 有り | 無効 | false | 以降の処理を実施 |
  - 実行権限 : authServer内関数毎の所要権限 & ユーザ権限 > 0 ? 有り : 無し
  - CPkey : ① and ② ? 有効 : 無効<br>
  ①送られてきたCPkeyがユーザ毎のプロパティサービスに保存されたCPkeyと一致<br>
  ②ユーザ毎のプロパティサービスに保存されたCPkeyが有効期限内
  - 凍結 : 前回ログイン失敗(3回連続失敗)から一定時間内 ? true : false
- ※2 : パスコード・要求ID生成
  - パスコードは数値6桁(既定値)
  - 要求IDはuserIdと要求時刻(UNIX時刻)を連結した文字列のMD5(or CRC32)をbase64化
- ※3 : 「パスコード検証」は復号・署名確認の上、以下の点をチェックする
  - 復号可能且つ署名が一致
  - 送付されたパスコード・要求IDがプロパティサービスのそれと一致
  - 試行回数が一定数以下(既定値3回)
  - パスコード生成から一定時間内(既定値15分)
  - ログイン可能な権限
- パスコード再発行は凍結中以外認めるが、再発行前の失敗は持ち越す。<br>
  例：旧パスコードで2回連続失敗、再発行後の1回目で失敗したら凍結

## 3.3 ユーザ情報の参照・編集<a name="ac0016"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0013) > ユーザ情報の参照・編集


シートの操作(CRUD)は、管理者が事前に`{操作名:実行関数}`の形でソースに埋め込んで定義する。<br>
例：`{lookup:(arg)=>data.find(x=>x.id==arg.id)}`

userは要求時に操作名を指定し、その実行結果を受け取る。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  participant sheet

  user ->> client : 操作要求
  activate client
  client ->> client : ログイン要求
  alt ログインNG
    client ->> user : エラー
  end
  
  client ->> server : ID,引数(CSkey/SPkey)
  activate server
  Note right of server : authServer.operation(xxx)
  server ->> property : userId
  property ->> server : ユーザ情報
  server ->> server : 引数を復号
  alt 復号不可
    server ->> client : エラーメッセージ
    client ->> user : ダイアログを出して終了
  end

  server ->> sheet : 操作名(xxx)に対応する関数呼び出し
  sheet ->> server : 関数(xxx)の処理結果
  server ->> client : 操作結果(SSkey/CPkey)
  deactivate server
  client ->> client : 復号＋署名検証、画面生成
  client ->> user : 結果表示画面
  deactivate client
```

シートの操作(CRUD)は権限と有効期間の確認が必要なため、以下のようなオブジェクト(ハッシュ)を管理者がソースに埋め込む(configとして定義する)ことで行う。

```
config.operations = {
  lookup : {  // {string} 操作名
    auth : 0, // {number} 操作を許可する権限フラグの論理和
    from : null, // {string} 有効期間を設定する場合、開始日時文字列
    to : null, // {string} 同、終了日時文字列
    func: // {Arrow|Function} 操作を定義する関数
      (data,id) => data.find(x => x.id === id),
  },
  list : {...},
  update : {...},
  ...
}
```

## 3.4 権限設定、変更<a name="ac0017"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0013) > 権限設定、変更


権限を付与すべきかは個別に判断する必要があるため、システム化せず、管理者がソース(`authServer.changeAuth()`)を直接編集、GASコンソール上で実行する。

```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant property
  actor admin

  user ->> admin : 権限要求
  admin ->>+ server : 権限設定状況確認
  Note right of server : authServer.listAuth()
  server ->>- admin : 権限設定リスト
  admin ->>+ server : ソース修正、実行
  Note right of server : authServer.changeAuth()
  server ->> property : 権限変更
  server ->>- admin : 権限設定リスト
```

# 4 フォルダ構成、ビルド手順<a name="ac0018"></a>

[先頭](#ac0000) > フォルダ構成、ビルド手順


クライアント(ブラウザ)側の"class authMenu"とサーバ(GAS)側の"class authServer"に分かれるが、一体管理のためソースは一元管理する。

- archves : アーカイブ
- doc/ : readme.mdの各記事のソース集
  - proto.md : readme.mdのプロトタイプ
  - xxx.md : readme.mdに埋め込む各記事のソース
- src/ : プログラムソース
  - config.common.js : client/server共通config
  - config.client.js : client特有のconfig
  - config.server.js : server特有のconfig
  - authMenu.js : class authMenuのテンプレート
  - authServer.js : class authServerのテンプレート
  - authXxxx.yyyy.js : class authMenu/Server各メソッドのソース
- test/ : テスト用
- build.sh : client/server全体のビルダ
- index.html : クライアント側のソース
- server.gs : サーバ側のソース
- initialize.gs : サーバ側初期化処理のソース
- readme.md : doc配下を統合した、client/server全体の仕様書

# 5 仕様(JSDoc)<a name="ac0019"></a>

[先頭](#ac0000) > 仕様(JSDoc)


* [authMenu](#authMenu)
    * [new authMenu(arg)](#new_authMenu_new)
    * [.storeUserInfo(userId)](#authMenu+storeUserInfo) ⇒ <code>void</code>
    * [.genNavi(wrapper, navi)](#authMenu+genNavi) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_authMenu_new"></a>

## 5.1 new authMenu(arg)<a name="ac0020"></a>

[先頭](#ac0000) > [仕様(JSDoc)](#ac0019) > new authMenu(arg)


| Param | Type |
| --- | --- |
| arg | <code>Object</code> | 

<a name="authMenu+storeUserInfo"></a>

## 5.2 authMenu.storeUserInfo(userId) ⇒ <code>void</code><a name="ac0021"></a>

[先頭](#ac0000) > [仕様(JSDoc)](#ac0019) > authMenu.storeUserInfo(userId) ⇒ <code>void</code>

sessionStorage/localStorageのユーザ情報を更新する

①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。

**Kind**: instance method of [<code>authMenu</code>](#authMenu)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> | 決まったユーザIDを指定する場合に指定 |

**Example**  
**実行結果(例)**

- localStorage : ユーザIDのみ。以下は例。
  | Key | Value |
  | :-- | :-- |
  | authMenu | 123 |
- sessionStorage : ユーザID＋ユーザ権限
  | Key | Value |
  | :-- | :-- |
  | authMenu | {"userId":123,"auth":1} |

**HTMLへのユーザIDの埋め込み**

応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
以下のようにHTMLにIDが埋め込まれて返される。

1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
   ```
   https://script.google.com/macros/s/AK〜24yz/exec?id=123
   ```
2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
   ```
   <div style="display:none" name="userId"><?= userId ?></div>
   ```
3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
   ```
   function doGet(e){
     const template = HtmlService.createTemplateFromFile('index');
     template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
     const htmlOutput = template.evaluate();
     htmlOutput.setTitle('camp2024');
     return htmlOutput;
   }
   ```
4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
<a name="authMenu+genNavi"></a>

## 5.3 authMenu.genNavi(wrapper, navi) ⇒ <code>null</code> \| <code>Error</code><a name="ac0022"></a>

[先頭](#ac0000) > [仕様(JSDoc)](#ac0019) > authMenu.genNavi(wrapper, navi) ⇒ <code>null</code> \| <code>Error</code>

親要素を走査してナビゲーションを作成

**Kind**: instance method of [<code>authMenu</code>](#authMenu)  

| Param | Type | Description |
| --- | --- | --- |
| wrapper | <code>HTMLElement</code> | body等の親要素。 |
| navi | <code>HTMLElement</code> | nav等のナビゲーション領域 |

**Kind**: global function  
**Returns**: <code>Object</code> - 分岐先処理での処理結果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>number</code> | <code></code> |  |
| func | <code>string</code> | <code>null</code> | 分岐先処理名 |
| arg | <code>string</code> | <code>null</code> | 分岐先処理に渡す引数オブジェクト |

# 6 テクニカルメモ<a name="ac0023"></a>

[先頭](#ac0000) > テクニカルメモ


## 6.1 GAS/htmlでの暗号化<a name="ac0024"></a>

[先頭](#ac0000) > [テクニカルメモ](#ac0023) > GAS/htmlでの暗号化


#### 6.1.1 手順<a name="ac0025"></a>

[先頭](#ac0000) > [テクニカルメモ](#ac0023) > [GAS/htmlでの暗号化](#ac0024) > 手順


```mermaid
sequenceDiagram
  autonumber
  actor user
  participant client
  participant server
  participant sheet
  actor admin

  Note right of server : authServer.constructor()
  server ->> server : server鍵ペア生成


```

- server鍵ペア生成


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

#### 6.1.2 javascript用<a name="ac0026"></a>

[先頭](#ac0000) > [テクニカルメモ](#ac0023) > [GAS/htmlでの暗号化](#ac0024) > javascript用


- Node.jsスタイルで書かれたコードをブラウザ上で動くものに変換 : [ざっくりbrowserify入門](https://qiita.com/fgkm/items/a362b9917fa5f893c09a)
- [Javascriptで公開鍵ペア生成・暗号化/復号をしてみた](https://qiita.com/poruruba/items/272bdc8f539728d5b076)

javascript 鍵ペア ライブラリ


#### 6.1.3 GAS用<a name="ac0027"></a>

[先頭](#ac0000) > [テクニカルメモ](#ac0023) > [GAS/htmlでの暗号化](#ac0024) > GAS用


GASでは鍵ペア生成はできない ⇒ openssl等で作成し、プロパティサービスに保存しておく。

- stackoverflow[Generate a public / private Key RSA with Apps Scripts](https://stackoverflow.com/questions/51989469/generate-a-public-private-key-rsa-with-apps-scripts)

また、GASでは署名する方法はあるが、暗号化および署名検証の方法が見つからない

- 

- [GASでトークン等を保存しておけるプロパティサービスについてまとめてみた](https://qiita.com/zumi0/items/85ca400d57f60728a7c7)
- [GASのプロパティサービス(プロパティストア)とは？3種類の各特徴と使い分け方まとめ](https://auto-worker.com/blog/?p=7829)

鍵ペア生成できそうなのはcrypticoのみ。但しGASライブラリは無いし、requireしなければならない。

- [Google Apps Scriptでrequire()してみる](https://qiita.com/fossamagna/items/7c65e249e1e5ecad51ff)

1. main.jsの`function callHello()`を`global.callHello = function () {`に修正
1. `browserify main.js -o bundle.js`

失敗。GAS側は予め鍵を保存するよう方針転換。

- [.DERと .PEMという拡張子は鍵の中身じゃなくて、エンコーディングを表している](https://qiita.com/kunichiko/items/12cbccaadcbf41c72735#der%E3%81%A8-pem%E3%81%A8%E3%81%84%E3%81%86%E6%8B%A1%E5%BC%B5%E5%AD%90%E3%81%AF%E9%8D%B5%E3%81%AE%E4%B8%AD%E8%BA%AB%E3%81%98%E3%82%83%E3%81%AA%E3%81%8F%E3%81%A6%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%92%E8%A1%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B)

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

# 7 プログラムソース<a name="ac0028"></a>

[先頭](#ac0000) > プログラムソース


<details><summary>client.js</summary>

```
class authMenu {
/**
 * @constructor
 * @param {Object} arg 
 * @returns {authMenu|Error}
 */
constructor(arg={}){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1.1; // 引数と既定値からメンバの値を設定
    v.r = this.#setProperties(arg);
    if( v.r instanceof Error ) throw v.r;

    v.step = 1.2; // sessionStorage/localStorageのユーザ情報を更新
    v.r = this.storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2; // アイコン、ナビ、背景の作成
    v.step = 2.1; // アイコンの作成
    this.icon = createElement({
      attr:{class:'icon'},
      event:{click:this.toggle},
      children:[{
        tag:'button',
        children:[{tag:'span'},{tag:'span'},{tag:'span'}],
      }]
    },this.wrapper);
    v.step = 2.2; // ナビゲータの作成
      this.navi = createElement({
      tag:'nav',
    },this.wrapper);
    v.step = 2.3; // ナビゲータ背景の作成
      this.back = createElement({
      attr:{class:'back'},
      event:{click:this.toggle},
    },this.wrapper);

    v.step = 3; // 親要素を走査してナビゲーションを作成
    v.rv = this.genNavi();
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 9; // 終了処理
    v.r = this.changeScreen();
    if( v.r instanceof Error ) throw v.r;
    console.log(`${v.whois} normal end.`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** constructorの引数と既定値からthisの値を設定
 * 
 * @param {Object} arg - constructorに渡された引数オブジェクト
 * @returns {null|Error}
 * 
 * @desc
 * 
 * ### <a id="authMenu_memberList">authMenuクラスメンバ一覧</a>
 * 
 * 1. 「**太字**」はインスタンス生成時、必須指定項目
 * 1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
 * 1. その他はconstructorの引数で指定可、指定が無い項目は既定値をセット
 * 
 * - wrapper='.authMenu[name="wrapper"] {string|HTMLElement}<br>
 *   メニュー全体を囲む要素。body不可
 * - icon {HTMLElement} : 【*内部*】メニューアイコンとなるHTML要素
 * - navi {HTMLElement} : 【*内部*】ナビ領域となるHTML要素
 * - back {HTMLElement} : 【*内部*】ナビ領域の背景となるHTML要素
 * - userId {number} : ユーザID。this.storeUserInfoで設定
 * - auth=1 {number} : ユーザ(クライアント)の権限
 * - userIdSelector='[name="userId"]' {string}<br>
 *   URLクエリ文字列で与えられたuserIdを保持する要素のCSSセレクタ
 * - publicAuth=1 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更前の権限(一般公開用権限)
 * - memberAuth=2 {number}<br>
 *   ユーザIDの特定で権限が昇格する場合、変更後の権限(参加者用権限)
 * - allow=2**32-1 {number}<br>
 *   data-menuのauth(開示範囲)の既定値
 * - func={} {Object.<string,function>}<br>
 *   メニューから呼び出される関数。ラベルはdata-menu属性の`func`に対応させる。
 * - **home** {string|Object.<number,string>}<br>
 *   文字列の場合、ホーム画面とするdata-menu属性のid。<br>
 *   ユーザ権限別にホームを設定するなら`{auth:スクリーン名(.screen[name])}`形式のオブジェクトを指定。<br>
 *   例(auth=1:一般公開,2:参加者,4:スタッフ)⇒`{1:'実施要領',2:'参加者パス',4:'スタッフの手引き'}`
 * - initialSubMenu=true {boolean}<br>
 *   サブメニューの初期状態。true:開いた状態、false:閉じた状態
 * - css {string} : authMenu専用CSS。書き換えする場合、全文指定すること(一部変更は不可)
 * - toggle {Arrow} : 【*内部*】ナビゲーション領域の表示/非表示切り替え
 * - showChildren {Arror} : 【*内部*】ブランチの下位階層メニュー表示/非表示切り替え
 * - changeScreen {Arror} : 【*内部*】this.homeの内容に従って画面を切り替え
 */
#setProperties(arg){
  const v = {whois:this.constructor.name+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 既定値の定義
    v.default = {
      wrapper: `.${this.constructor.name}[name="wrapper"]`, // {string|HTMLElement}
      userId: null,
      auth: 1, // ユーザ権限の既定値
      userIdSelector: '[name="userId"]',
      publicAuth: 1,
      memberAuth: 2,
      allow: 2 ** 32 - 1, // data-menuのauth(開示範囲)の既定値
      func: {}, // {Object.<string,function>} メニューから呼び出される関数
      home: null,
      initialSubMenu: true, // サブメニューの初期状態。true:開いた状態、false:閉じた状態
    };
    v.default.css = `/* authMenu専用CSS
        authMenu共通変数定義
        --text: テキストおよびハンバーガーアイコンの線の色
        --maxIndex: ローディング画面優先なので、最大値2147483647-1
      */
      .authMenu {
        --text : #000;
        --fore : #fff;
        --back : #ddd;
        --debug : rgba(255,0,0,1);
        --iconSize : 100px;
        --maxIndex : 2147483646;
        --navWidth : 0.7;
      }
      /* ハンバーガーアイコン
        icon周囲にiconSizeの40%程度の余白が必要なのでtop,rightを指定
      */
      .authMenu .icon {
        display : flex;
        justify-content : flex-end;
        place-items : center;
        position : absolute;
        top : calc(var(--iconSize) * 0.4);
        right : calc(var(--iconSize) * 0.4);
        width : var(--iconSize);
        height : var(--iconSize);
        z-index : var(--maxIndex);
      }
      .authMenu .icon > button {
        place-content : center center;
        display : block;
        margin : 0;
        padding : 0px;
        box-sizing : border-box;
        width : calc(var(--iconSize) * 0.7);
        height : calc(var(--iconSize) * 0.7);
        border : none;
        background : rgba(0,0,0,0);
        position : relative;
        box-shadow : none;
      }
      .authMenu .icon button span {
        display : block;
        width : 100%;
        height : calc(var(--iconSize) * 0.12);
        border-radius : calc(var(--iconSize) * 0.06);
        position : absolute;
        left : 0;
        background : var(--text);
        transition : top 0.24s, transform 0.24s, opacity 0.24s;
      }
      .authMenu .icon button span:nth-child(1) {
        top : 0;
      }
      .authMenu .icon button span:nth-child(2) {
        top : 50%;
        transform : translateY(-50%);
      }
      .authMenu .icon button span:nth-child(3) {
        top : 100%;
        transform : translateY(-100%);
      }
      .authMenu .icon button span.is_active:nth-child(1) {
        top : 50%;
        transform : translateY(-50%) rotate(135deg);
      }
      .authMenu .icon button span.is_active:nth-child(2) {
        transform : translate(50%, -50%);
        opacity : 0;
      }
      .authMenu .icon button span.is_active:nth-child(3) {
        top : 50%;
        transform : translateY(-50%) rotate(-135deg);
      }
      /* ナビゲーション領域 */
      .authMenu nav {
        display : none;
      }
      .authMenu nav.is_active {
        display : block;
        margin : 0 0 0 auto;
        font-size : 1rem;
        position : absolute;
        top : calc(var(--iconSize) * 1.8);
        right : 0;
        width : calc(100% * var(--navWidth));
        height : var(--iconSize);
        z-index : var(--maxIndex);
      }
      .authMenu nav ul {
        margin : 0rem 0rem 1rem 0rem;
        padding : 0rem 0rem 0rem 0rem;
        background-color : var(--back);
      }
      .authMenu nav ul ul { /* 2階層以降のulにのみ適用 */
        display : none;
      }
      .authMenu nav ul ul.is_open {
        display : block;
        border-top : solid 0.2rem var(--fore);
        border-left : solid 0.7rem var(--fore);
      }
      .authMenu nav li {
        margin : 0.6rem 0rem 0.3rem 0.5rem;
        padding : 0.5rem 0rem 0rem 0rem;
        list-style : none;
        background-color : var(--back);
      }
      .authMenu nav li a {
        color : var(--text);
        text-decoration : none;
        font-size: 1.5rem;
      },
      /* 背景 */
      .authMenu .back {
        display : none;
      }
      .authMenu .back.is_active {
        display : block;
        position : absolute;
        top : 0;
        right : 0;
        width : 100vw;
        height : 100vh;
        z-index : calc(var(--maxIndex) - 1);
        background : rgba(100,100,100,0.8);
      }
    `;
    v.default.toggle = () => {
      // ナビゲーション領域の表示/非表示切り替え
      document.querySelector(`.${this.constructor.name} nav`).classList.toggle('is_active');
      document.querySelector(`.${this.constructor.name} .back`).classList.toggle('is_active');
      document.querySelectorAll(`.${this.constructor.name} .icon button span`)
      .forEach(x => x.classList.toggle('is_active'));        
    };
    v.default.showChildren = (event) => {
      // ブランチの下位階層メニュー表示/非表示切り替え
      event.target.parentNode.querySelector('ul').classList.toggle('is_open');
      let m = event.target.innerText.match(/^([▶️▼])(.+)/);
      const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
      event.target.innerText = text;  
    };
    v.default.changeScreen = (arg=null) => {
      // this.homeの内容に従って画面を切り替える
      if( arg === null ){
        // 変更先画面が無指定 => ホーム画面を表示
        arg = typeof this.home === 'string' ? this.home : this.home[this.auth];
      }
      return changeScreen(arg);
    }

    v.step = 2; // 引数と既定値から設定値のオブジェクトを作成
    v.arg = mergeDeeply(arg,v.default);
    if( v.arg instanceof Error ) throw v.arg;

    v.step = 3; // メンバに設定値をコピー
    for( v.x in v.arg ) this[v.x] = v.arg[v.x];

    v.step = 4; // wrapperが文字列(CSSセレクタ)ならHTMLElementに変更
    if( typeof this.wrapper === 'string' ){
      this.wrapper = document.querySelector(this.wrapper);
    }
    v.step = 5; // authMenu専用CSSが未定義なら追加
    if( !document.querySelector(`style[name="${this.constructor.name}"]`) ){
      v.styleTag = document.createElement('style');
      v.styleTag.setAttribute('name',this.constructor.name);
      v.styleTag.textContent = this.css;
      document.head.appendChild(v.styleTag);
    }
    v.step = 6; // 待機画面が未定義ならbody直下に追加
    if( !document.querySelector('body > div[name="loading"]') ){
      v.r = createElement({
        attr:{name:'loading',class:'loader screen'},
        text:'loading...'
      },'body');
    }

    v.step = 7; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** sessionStorage/localStorageのユーザ情報を更新する
 * 
 * ①本関数の引数、②HTMLに埋め込まれたユーザ情報、③sessionStorage、④localStorageから
 * ユーザ情報が取得できないか試行、①>②>③>④の優先順位で最新の情報を特定し、
 * localStorageにはユーザIDのみ、sessionStorageにはユーザID＋権限を保存する。
 * 
 * @param {number} userId=null - 決まったユーザIDを指定する場合に指定
 * @returns {void}
 * 
 * @example
 * 
 * **実行結果(例)**
 * 
 * - localStorage : ユーザIDのみ。以下は例。
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | 123 |
 * - sessionStorage : ユーザID＋ユーザ権限
 *   | Key | Value |
 *   | :-- | :-- |
 *   | authMenu | {"userId":123,"auth":1} |
 * 
 * **HTMLへのユーザIDの埋め込み**
 * 
 * 応募後の登録内容確認メールのように、URLのクエリ文字列でユーザIDが与えられた場合、
 * 以下のようにHTMLにIDが埋め込まれて返される。
 * 
 * 1. クエリ文字列が埋め込まれたURL(末尾の`id=123`)
 *    ```
 *    https://script.google.com/macros/s/AK〜24yz/exec?id=123
 *    ```
 * 2. doGet関数で返すHTMLファイルに予め埋込用の要素を定義
 *    ```
 *    <div style="display:none" name="userId"><?= userId ?></div>
 *    ```
 * 3. 要求時、クエリ文字列を埋め込んだHTMLを返す<br>
 *    ```
 *    function doGet(e){
 *      const template = HtmlService.createTemplateFromFile('index');
 *      template.userId = e.parameter.id;  // 'userId'がHTML上の変数、末尾'id'がクエリ文字列の内容
 *      const htmlOutput = template.evaluate();
 *      htmlOutput.setTitle('camp2024');
 *      return htmlOutput;
 *    }
 *    ```
 * 4. `opt.userIdSelector='div[name="userId"]'`を指定して本関数を実行、HTMLからユーザIDを取得
 * 
 */
storeUserInfo(userId=null){
  const v = {whois:'storeUserInfo',rv:null,step:0,html:null,arg:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // オプションの既定値をセット

    v.step = 2.1; // sessionStorageからユーザ情報を取得
    v.r = sessionStorage.getItem(this.constructor.name);
    v.session = v.r ? JSON.parse(v.r) : {userId:null,auth:this.publicAuth};
    v.step = 2.2; // localStorageからユーザ情報を取得
    v.r = localStorage.getItem(this.constructor.name);
    v.local = v.r ? Number(v.r) : null;
    v.step = 2.3; // HTMLに埋め込まれたuserIdを取得
    v.dom = document.querySelector(this.userIdSelector);
    if( v.dom !== null ){
      v.r = v.dom.innerText;
      v.html = v.r.length > 0 ? Number(v.r) : null;  
    }
    v.step = 2.4; // 引数で渡されたuserIdを取得
    if( userId !== null ) v.arg = Number(userId);

    v.step = 2.1; // userIdの特定
    // 優先順位は`arg > html > session > local`
    v.session.userId = v.arg !== null ? v.arg
    : ( v.html !== null ? v.html
    : ( v.session.userId !== null ? v.session.userId
    : ( v.local !== null ? v.local : null)));
    v.step = 2.2; // userIdが特定され且つauthが最低の場合は参加者(auth=2)に昇格
    if( v.session.userId !== null && v.session.auth === this.publicAuth ){
      v.session.auth = this.memberAuth;
    }

    v.step = 3.1; // sessionStorageへの保存
    sessionStorage.setItem(this.constructor.name,JSON.stringify(v.session));
    v.step = 3.2; // localStorageへの保存
    localStorage.setItem(this.constructor.name,v.session.userId);
    v.step = 3.3; // メンバに保存
    this.userId = v.session.userId;
    this.auth = v.session.auth;

    v.step = 4; // 終了処理
    v.rv = v.session;
    console.log(`${v.whois} normal end.\n`
    +`v.session=${JSON.stringify(v.session)}\nv.local=${v.local}\nv.html=${v.html}\nv.arg=${v.arg}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // ===================================
  // メニュー関係(旧BurgerMenu)
  // ===================================
/** data-menu属性の文字列をオブジェクトに変換
 * authMenu専用として、以下の制限は許容する
 * - メンバ名は英小文字に限定
 * - カンマは区切記号のみで、id,label,func,hrefの値(文字列)内には不存在
 * 
 * @param {string} arg - data-menuにセットされた文字列
 * @returns {Object|null|Error} 引数がnullまたは空文字列ならnullを返す
 */
#objectize(arg){
  const v = {whois:this.constructor.name+'.objectize',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // nullまたは空文字列にはnullを返す
    if( !arg || arg.length === 0 ) return null;

    v.step = 2; // カンマで分割
    v.p = arg.split(',');

    v.step = 3; // 各値をオブジェクト化
    for( v.i=0 ; v.i<v.p.length ; v.i++ ){
      v.m = v.p[v.i].match(/^([a-z]+):['"]?(.+?)['"]?$/);
      if( v.m ){
        v.rv[v.m[1]] = v.m[2];
      } else {
        throw new Error('data-menuの設定値が不適切です\n'+arg);
      }
    }

    v.step = 4.1; // idの存否チェック
    if( !v.rv.hasOwnProperty('id') )
      throw new Error('data-menuの設定値にはidが必須です\n'+arg);
    v.step = 4.2; // ラベル不在の場合はidをセット
    if( !v.rv.hasOwnProperty('label') )
      v.rv.label = v.rv.id;
    v.step = 4.3; // allowの既定値設定
    v.rv.allow = v.rv.hasOwnProperty('allow') ? Number(v.rv.allow) : this.allow;
    v.step = 4.4; // func,href両方有ればhrefを削除
    if( v.rv.hasOwnProperty('func') && v.rv.hasOwnProperty('href') )
      delete v.rv.href;
    v.step = 4.5; // from/toの既定値設定
    v.rv.from = v.rv.hasOwnProperty('from')
      ? new Date(v.rv.from).getTime() : 0;  // 1970/1/1(UTC)
    v.rv.to = v.rv.hasOwnProperty('to')
      ? new Date(v.rv.from).getTime() : 253402182000000; // 9999/12/31(UTC)

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** 親要素を走査してナビゲーションを作成
 * @param {HTMLElement} wrapper - body等の親要素。
 * @param {HTMLElement} navi - nav等のナビゲーション領域
 * @returns {null|Error}
 */
genNavi(wrapper=this.wrapper,navi=this.navi,depth=0){
  const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
  console.log(`${v.whois} start.`);
  try {

    if( depth === 0 ){
      v.step = 1.1; // sessionStorageからユーザ権限を読み取り
      v.r = sessionStorage.getItem(this.constructor.name);
      if( !v.r ) throw new Error(`sessionStorageに${this.constructor.name}キーが存在しません`);
      this.auth = JSON.parse(v.r).auth;

      v.step = 1.2; // navi領域をクリア
      navi.innerHTML = '';
    }

    // 子要素を順次走査し、data-menuを持つ要素をnaviに追加
    for( v.i=0 ; v.i<wrapper.childElementCount ; v.i++ ){
      v.d = wrapper.children[v.i];

      // wrapper内のdata-menu属性を持つ要素に対する処理
      v.step = 2.1; // data-menuを持たない要素はスキップ
      v.attr = this.#objectize(v.d.getAttribute(`data-menu`));
      if( v.attr instanceof Error ) throw v.attr;
      if( v.attr === null ) continue;

      v.step = 2.2; // screenクラスが無ければ追加
      v.class = v.d.className.match(/screen/);
      if( !v.class ) v.d.classList.add('screen'); 
      v.step = 2.3; // nameが無ければ追加
      v.name = v.d.getAttribute('name');
      if( !v.name ){
        v.name = v.attr.id;
        v.d.setAttribute('name',v.name);
      }

      // navi領域への追加が必要か、判断
      v.step = 3.1; // 実行権限がない機能・画面はnavi領域に追加しない
      if( (this.auth & v.attr.allow) === 0 ) continue;
      v.step = 3.2; // 有効期間外の場合はnavi領域に追加しない
      if( v.now < v.attr.from || v.attr.to < v.now ) continue;

      v.step = 4; // navi領域にul未設定なら追加
      if( navi.tagName !== 'UL' ){
        v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
        if( v.r instanceof Error ) throw v.r;
        navi = v.r;
      }

      v.step = 5; // メニュー項目(li)の追加
      v.li = {tag:'li',children:[{
        tag:'a',
        text:v.attr.label,
        attr:{class:this.constructor.name,name:v.attr.id},
      }]};
      v.hasChild = false;
      if( v.attr.hasOwnProperty('func') ){
        v.step = 5.1; // 指定関数実行の場合
        Object.assign(v.li.children[0],{
          attr:{href:'#',name:v.attr.func},
          event:{click:(event)=>{
            this.toggle();  // メニューを閉じる
            this.func[event.target.name](event); // 指定関数の実行
            this.genNavi(); // メニュー再描画
          }},
        });
      } else if( v.attr.hasOwnProperty('href') ){
        v.step = 5.2; // 他サイトへの遷移指定の場合
        Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
        Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
      } else {
        v.step = 5.3; // その他(=画面切替)の場合
        // 子孫メニューがあるか確認
        if( v.d.querySelector(`[data-menu]`) ){
          v.step = 5.33; // 子孫メニューが存在する場合
          v.hasChild = true; // 再帰呼出用のフラグを立てる
          Object.assign(v.li.children[0],{
            // 初期がサブメニュー表示ならclassにis_openを追加
            attr:{class:(this.initialSubMenu ? 'is_open' : '')},
            // '▼'または'▶︎'をメニューの前につける
            text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
            event: {click:this.showChildren}
          });
        } else { // 子孫メニューが存在しない場合
          v.step = 5.33; // nameを指定して画面切替
          Object.assign(v.li.children[0],{
            event:{click:(event)=>{
              this.changeScreen(event.target.getAttribute('name'));
              this.toggle();
            }}
          });
        }
      }

      v.step = 5.4; // navi領域にliを追加
      v.r = createElement(v.li,navi);
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.5; // 子要素にdata-menuが存在する場合、再帰呼出
      if( v.hasChild ){
        v.r = this.genNavi(v.d,v.r,depth+1);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 6; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

}
```

</details>

<details><summary>server.gs</summary>

```
/** サーバ側の認証処理を分岐させる
 * @param {number} userId 
 * @param {string} func - 分岐先処理名
 * @param {string} arg - 分岐先処理に渡す引数オブジェクト
 * @returns {Object} 分岐先処理での処理結果
 */
function authServer(userId=null,func=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{}};
  console.log(`${w.whois} start.`);
  try {

    w.step = 1; // 既定値をwに登録
/** authServerの適用値を設定
 * 
 * これら設定値はプロジェクトにより異なるため、
 * プロジェクト毎に適宜ソースを修正して使用すること。
 * 
 * @param {number|null} userId 
 * @returns {null}
 * 
 * 1. propertyName='authServer' {string}<br>
 *    プロパティサービスのキー名
 * 1. loginRetryInterval=3,600,000(60分) {number}<br>
 *    前回ログイン失敗(3回連続失敗)から再挑戦可能になるまでの時間(ミリ秒)
 * 1. numberOfLoginAttempts=3 {number}<br>
 *    ログイン失敗になるまでの試行回数
 * 1. loginGraceTime=900,000(15分) {number}<br>
 *    パスコード生成からログインまでの猶予時間(ミリ秒)
 * 1. userLoginLifeTime=86,400,000(24時間) {number}<br>
 *    クライアント側ログイン(CPkey)有効期間
 * 1. masterSheet='master' {string}<br>
 *    参加者マスタのシート名
 * 1. primatyKeyColumn='userId' {string}<br>
 *    主キーとなる項目名。主キーは数値で設定
 * 1. emailColumn='email' {string}<br>
 *    e-mailを格納するシート上の項目名
 */
w.func.setProperties = function(){
  const v = {whois:w.whois+'.setProperties',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 適用値をセット
    w.propertyName = 'authServer';
    w.loginRetryInterval = 3600000;
    w.numberOfLoginAttempts = 3;
    w.loginGraceTime = 900000;
    w.userLoginLifeTime = 86400000;
    w.masterSheet = 'master';
    w.primatyKeyColumn ='userId';
    w.emailColumn = 'email';

    v.step = 2; // 鍵ペア不存在なら生成
    v.prop = PropertiesService.getDocumentProperties().getProperty(w.propertyName);
    if( v.prop === null ){
      v.prop = {passPhrase:createPassword(16)};
      v.prop.SCkey = cryptico.generateRSAKey(v.prop.passPhrase,1024);
      v.prop.SPkey = cryptico.publicKeyString(v.prop.SCkey);
      PropertiesService.getDocumentProperties().setProperty(w.propertyName,v.prop);
    }
    console.log(v.prop);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.setProperties(arg);
if( w.rv instanceof Error ) throw w.rv;

    if( userId === null ){ // userIdが不要な処理
      if( ['registMail'].find(x => x === func) ){
        w.step = 1; // userId未定でも可能な処理 ⇒ 一般公開用
/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {string} email - 要求があったユーザのe-mail
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(email){
  const v = {whois:w.whois+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // masterシートを読み込み
    v.master = new SingleTable(w.masterSheet);

    v.step = 3; // 既登録メアドでは無いか確認
    v.m = v.master.data.find(x => x[w.emailColumn] === email);
    if( v.m ) throw new Error(`"${email}" has already registrated.`);

    v.step = 4; // 新規userIdを採番
    if( v.master.data.length === 0 ){
      v.rv = 1;
    } else {
      v.exist = v.master.data.map(x => x[w.primatyKeyColumn]);
      v.rv = Math.max(...v.exist) + 1;
    }

    v.step = 5; // シートに登録
    v.r = v.master.insert([{
      userId:v.rv,
      email:email,
      created:toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn')
    }]);
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${w.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nemail=${email}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.registMail(arg);
if( w.rv instanceof Error ) throw w.rv;
      } else {
        w.step = 2; // 該当処理なし
        w.rv = null;
      }
    } else {  // userIdが必要な処理
      if( ['login1S'].find(x => x === func) ){
        w.step = 3; // ログインは不要な処理
        // ⇒ 参加者用メニュー(応募情報(自分の個人情報)修正を除く)

        //:x:$src/server.login1S.js::

      } else if( ['login2S','operation'].find(x => x === func) ){
        // ログインしないと操作不可の処理
        // ⇒ 応募情報修正、スタッフ用メニュー

        w.step = 4; // クライアント側の署名検証＋引数のオブジェクト化
/** クライアント側の署名を検証、引数を復号してオブジェクト化する
 * @param {number} userId - ユーザID
 * @param {string} arg - クライアント側での暗号化＋署名結果(文字列)
 * @returns {Object}
 * 
 * @example
 * 
 * サーバ側に鍵ペアが存在しない場合は自動生成してプロパティサービスに保存
 * 
 * ** 注意事項 **
 * 
 * 他のauthServerメソッドは`w.func.xxx`として定義するが、
 * 本メソッドはユーザに使用させないシステム的なメソッドのため、
 * funcではなく`w.initialize`として定義する。
 * 
 * **戻り値の形式**
 * 
 * - {Object|Error} rv
 *   - passPhrase {string} パスフレーズ
 *   - privateKey {Object} RSA形式の秘密鍵
 *   - publicKey {string} RSA形式の公開鍵
 * 
 * **参考：パスフレーズ・秘密鍵・公開鍵の一括保存はできない**
 * 
 * `{passPhrase:〜,privateKey:〜,publicKey:〜}`のように一括して保存しようとすると、以下のエラーが発生。
 * 
 * ```
 * You have exceeded the property storage quota.
 * Please remove some properties and try again.
 * ```
 * 
 * 原因は[プロパティ値のサイズ](https://developers.google.com/apps-script/guides/services/quotas?hl=ja)が超過したため。
 * ⇒ max 9KB/値なので、パスフレーズ・公開鍵・秘密鍵は別々のプロパティとして保存が必要
 */
w.func.verifySignature = function(userId=null,arg=null){
  const v = {whois:w.whois+'.verifySignature',rv:{},step:0};
  console.log(`${v.whois} start.`);
  try {

    // userId, argは共に必須
    if( userId === null ) throw new Error(`${v.whois} Error: no userId.`);
    if( arg === null ) throw new Error(`${v.whois} Error: no arg.`);

    v.step = 1; // サーバ側鍵ペアの取得・生成　※親関数のwhoisを使用
    v.RSA = PropertiesService.getDocumentProperties().getProperty(w.whois);
    if( v.RSA === null ){
      v.step = 1.1;
      v.bits = 1024;  // ビット長
      v.RSA.passPhrase = createPassword(16); // 16桁のパスワードを自動生成
      v.step = 1.2; // 秘密鍵の生成
      v.RSA.privateKey = cryptico.generateRSAKey(v.RSA.passPhrase, v.bits);
      v.step = 1.3; // 公開鍵の生成
      v.RSA.publicKey = cryptico.publicKeyString(v.RSA.privateKey);
      PropertiesService.getDocumentProperties().setProperty(w.whois,v.RSA);
    }

    v.step = 2; // クライアント側情報の取得
    v.client = PropertiesService.getDocumentProperties().getProperty(userId);

    if( v.client === null ){
      v.step = 3; // クライアント側情報未登録 ⇒ 空オブジェクトを返す
      v.client = {
        userId: userId,
        email: '',
        created: Date.now(),
        publicKeyID: '',
        authority: 2,
        log: [],
      };
      PropertiesService.getDocumentProperties().setProperty(userId,v.client);
    } else {
      v.step = 4; // クライアント側情報登録済
      v.step = 4.1; // 引数の復元
      v.decrypt = cryptico.decrypt(arg,v.RSA.privateKey);
      console.log(`v.decrypt=${stringify(v.decrypt)}`);
      v.step = 4.2; // 署名の検証
      v.decrypt.publicKeyID = cryptico.publicKeyID(v.decrypt.publicKeyString);
      v.decrypt.verify = v.client.publicKeyID === v.decrypt.publicKeyID;
      v.step = 4.3; // 有効期間の確認。　※親関数のvalidityPeriodを使用
      v.decrypt.validityPeriod = (v.client.created + w.validityPeriod) < Date.now();
      v.step = 4.3; // 戻り値をオブジェクト化
      v.rv = v.decrypt.status === 'success' && v.decrypt.verify && v.decrypt.validityPeriod
      ? JSON.parse(v.decrypt.plaintext)
      : new Error(`cryptico.decrypt error.`
      + `\nstatus="${v.decrypt.status}"`
      + `\nplaintext="${v.decrypt.plaintext}"`
      + `\nsignature="${v.decrypt.signature}"`
      + `\npublicKeyString="${v.decrypt.publicKeyString}"`
      + `\npublicKeyID="${v.decrypt.publicKeyID}"`
      + `\nverify="${v.decrypt.verify}"`
      + `\nvalidityPeriod="${v.decrypt.validityPeriod}"`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    console.log(`type = ${typeof v.rv}\npassPhrase="${v.rv.passPhrase}\npublicKey="${v.rv.publicKey}"`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    return e;
  }
}
w.r = w.func.verifySignature(userId,arg);
if( w.r instanceof Error ) throw w.r;

        switch( func ){
          case 'login2S': w.step = 4 + ':login2S';
            //:x:$src/server.login2S.js::
            break;
          // 後略
          //:x:$src/server.listAuth.js::
          //:x:$src/server.changeAuth.js::
          //:x:$src/server.operation.js::
        }
      } else {
        w.step = 5; // 該当処理なし
        w.rv = null;
      }
    }

    w.step = 6; // 終了処理
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さない
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\nfunc=${func}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}
```

</details>

# 8 改版履歴<a name="ac0029"></a>

[先頭](#ac0000) > 改版履歴


- rev 1.0.0 : 2024/04/20
  - "class authMenu(rev 1.2.0)"および作成途中の"class Auth(rev 2.0.0)"を統合
  - "storeUserInfo(rev 1.0.0)"を吸収
