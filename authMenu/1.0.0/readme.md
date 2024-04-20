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

# 使用方法

## body内部の設定

- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="BurgerMenu screen" name="wrapper">
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
  関数名と実際の関数はBurgerMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  BurgerMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new BurgerMenu({auth:1})の一般参加者は非表示、
  >     new BurgerMenu({auth:2})のスタッフは表示となる。
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
    const menu = new BurgerMenu();
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

## script部の設定

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
    v.auth = new authClient();
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

### インスタンス生成時の引数

インスタンス生成時の引数はそのまま**authMenuメンバ**となる。

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

## ストレージ/プロパティサービス、グローバル変数

# 機能別処理フロー

## インスタンス化時

## 新規ユーザ登録

## ログイン要求

## ユーザ情報の参照・編集

## 権限設定、変更

# フォルダ構成

# 仕様(JSDoc)

# プログラムソース

# 改版履歴

- rev 1.0.0 : 2024/04/20
  - "class BurgerMenu rev 1.2.0"および作成途中の"class authClient/Server 2.0.0"を統合
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
   1. <a href="#ac0003">body内部の設定</a>
      1. <a href="#ac0004">data-menu属性に設定する文字列</a>
   1. <a href="#ac0005">script部の設定</a>
      1. <a href="#ac0006">scriptサンプル</a>
      1. <a href="#ac0007">インスタンス生成時の引数</a>
   1. <a href="#ac0008">ストレージ/プロパティサービス、グローバル変数</a>
1. <a href="#ac0009">機能別処理フロー</a>
   1. <a href="#ac0010">インスタンス化時</a>
   1. <a href="#ac0011">新規ユーザ登録</a>
   1. <a href="#ac0012">ログイン要求</a>
   1. <a href="#ac0013">ユーザ情報の参照・編集</a>
   1. <a href="#ac0014">権限設定、変更</a>
1. <a href="#ac0015">フォルダ構成</a>
1. <a href="#ac0016">仕様(JSDoc)</a>
1. <a href="#ac0017">プログラムソース</a>
1. <a href="#ac0018">改版履歴</a>

# 1 機能概要<a name="ac0001"></a>

[先頭](#ac0000) > 機能概要


htmlからdata-menu属性を持つ要素を抽出、ハンバーガーメニューを作成する。

またHTML上のメニュー(SPAの機能)毎に許容権限を設定し、ユーザ毎に認証することで、表示制御を可能にする。

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="726px" height="271px" viewBox="-0.5 -0.5 726 271"><defs/><g><g><path d="M 328.2 270 L 370.2 78 L 514.2 78 L 472.2 270 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><path d="M 328.2 234 L 370.2 42 L 514.2 42 L 472.2 234 Z" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g><path d="M 466.2 30 L 472.2 0 L 514.2 0 L 508.2 30 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 78px; height: 1px; padding-top: 25px; margin-left: 778px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.icon</font></div></div></div></foreignObject><text x="817" y="29" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.icon</text></switch></g></g><g><path d="M 364.2 198 L 400.2 30 L 508.2 30 L 472.2 198 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" stroke-miterlimit="10" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 238px; height: 1px; padding-top: 190px; margin-left: 608px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">nav</font></div></div></div></foreignObject><text x="727" y="194" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">nav</text></switch></g></g><g><rect x="388.2" y="204" width="36" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 58px; height: 1px; padding-top: 355px; margin-left: 648px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.back</font></div></div></div></foreignObject><text x="677" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.back</text></switch></g></g><g><rect x="370.2" y="246" width="72" height="18" fill="none" stroke="none" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 425px; margin-left: 618px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><span style="font-size: 20px;">.wrapper</span></div></div></div></foreignObject><text x="677" y="429" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">.wrapper</text></switch></g></g><g><rect x="0" y="0" width="253.2" height="258" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 420px; height: 1px; padding-top: 7px; margin-left: 2px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.menu.screen name="wrapper"</font></div></div></div></foreignObject><text x="2" y="19" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.menu.screen name="wrapper"</text></switch></g></g><g><rect x="7.2" y="24" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 47px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c11',label:'掲示板',func:'board'"</font></div></div></div></div></foreignObject><text x="14" y="59" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="72" width="240" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 127px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c21',label:'入会申込',href:'https://〜'"</font></div></div></div></div></foreignObject><text x="14" y="139" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="7.2" y="120" width="240" height="132" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 398px; height: 1px; padding-top: 207px; margin-left: 14px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c30',label:'Information'</font></div></div></div></div></foreignObject><text x="14" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="156" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 267px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c31',label:'会場案内図'</font></div></div></div></div></foreignObject><text x="26" y="279" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="14.4" y="204" width="177.6" height="42" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-width="0.6" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 294px; height: 1px; padding-top: 347px; margin-left: 26px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">.data-menu</font><div><font style="font-size: 20px;">="id:'c32',label:'タイムテーブル'</font></div></div></div></div></foreignObject><text x="26" y="359" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">.data-menu...</text></switch></g></g><g><rect x="580.2" y="3" width="144" height="234" fill="#b3b3b3" stroke="none" pointer-events="all"/></g><g/><g><rect x="616.2" y="33" width="108" height="150" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><rect x="622.2" y="39" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 85px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> 掲示板</font></div></div></div></foreignObject><text x="1039" y="89" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> 掲示板</text></switch></g></g><g><rect x="622.2" y="66" width="102" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 130px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">入会申込</font></div></div></div></foreignObject><text x="1039" y="134" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">入会申込</text></switch></g></g><g><rect x="622.2" y="93" width="102" height="84" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 168px; height: 1px; padding-top: 162px; margin-left: 1039px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;"> Information</font></div></div></div></foreignObject><text x="1039" y="174" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px"> Information</text></switch></g></g><g><rect x="628.2" y="117" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 215px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">会場案内図</font></div></div></div></foreignObject><text x="1049" y="219" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">会場案内図</text></switch></g></g><g><rect x="628.2" y="147" width="96" height="24" fill="#cccccc" stroke="#ffffff" stroke-width="1.2" pointer-events="all"/></g><g><g transform="translate(-0.5 -0.5)scale(0.6)"><switch><foreignObject pointer-events="none" width="167%" height="167%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe flex-start; width: 158px; height: 1px; padding-top: 265px; margin-left: 1049px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 20px;">タイムテーブル</font></div></div></div></foreignObject><text x="1049" y="269" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">タイムテーブル</text></switch></g></g><g/><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><rect x="694.2" y="3" width="30" height="30" fill="rgb(255, 255, 255)" stroke="none" pointer-events="all"/></g><g><path d="M 697.2 9 L 721.2 9" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 18 L 721.2 18" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 697.2 27 L 721.2 27" fill="none" stroke="#999999" stroke-width="3.6" stroke-miterlimit="10" pointer-events="stroke"/></g><g><path d="M 274.2 72 L 310.2 130.5 L 274.2 189 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g><g><path d="M 532.2 70.5 L 568.2 129 L 532.2 187.5 Z" fill="#e6e6e6" stroke="none" pointer-events="all"/></g></g></svg>

# 2 使用方法<a name="ac0002"></a>

[先頭](#ac0000) > 使用方法


## 2.1 body内部の設定<a name="ac0003"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > body内部の設定


- 表示部は&lt;div data-menu&gt;の階層内で定義する。<br>
  階層外の要素はメニューで選択しても表示されない。
- data-menu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <p class="title">校庭キャンプ2024</p>
  <div class="BurgerMenu screen" name="wrapper">
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

### 2.1.1 data-menu属性に設定する文字列<a name="ac0004"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [body内部の設定](#ac0003) > data-menu属性に設定する文字列


タグのallowとその人の権限(auth)の論理積>0ならメニューを表示する。

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} id - 【必須】メニューID
- {string} [label] - メニュー化する時の名称。省略時はidを使用
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はBurgerMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [allow=2^32-1] - 開示範囲。<br>
  BurgerMenuインスタンス生成時のユーザ権限(auth)との論理積>0なら表示する。
  > ex: 一般参加者1、スタッフ2として
  >     data-menu="allow:2"とされた要素は、
  >     new BurgerMenu({auth:1})の一般参加者は非表示、
  >     new BurgerMenu({auth:2})のスタッフは表示となる。
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
    const menu = new BurgerMenu();
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

## 2.2 script部の設定<a name="ac0005"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > script部の設定


### 2.2.1 scriptサンプル<a name="ac0006"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [script部の設定](#ac0005) > scriptサンプル


```
window.addEventListener('DOMContentLoaded',() => {
  const v = {whois:'DOMContentLoaded',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // userId,authをセット
    v.config = storeUserInfo();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2.1; // 使用するクラスのインスタンス化
    v.auth = new authClient();
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

### 2.2.2 インスタンス生成時の引数<a name="ac0007"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > [script部の設定](#ac0005) > インスタンス生成時の引数


インスタンス生成時の引数はそのまま**authMenuメンバ**となる。

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

## 2.3 ストレージ/プロパティサービス、グローバル変数<a name="ac0008"></a>

[先頭](#ac0000) > [使用方法](#ac0002) > ストレージ/プロパティサービス、グローバル変数


# 3 機能別処理フロー<a name="ac0009"></a>

[先頭](#ac0000) > 機能別処理フロー


## 3.1 インスタンス化時<a name="ac0010"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0009) > インスタンス化時


## 3.2 新規ユーザ登録<a name="ac0011"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0009) > 新規ユーザ登録


## 3.3 ログイン要求<a name="ac0012"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0009) > ログイン要求


## 3.4 ユーザ情報の参照・編集<a name="ac0013"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0009) > ユーザ情報の参照・編集


## 3.5 権限設定、変更<a name="ac0014"></a>

[先頭](#ac0000) > [機能別処理フロー](#ac0009) > 権限設定、変更


# 4 フォルダ構成<a name="ac0015"></a>

[先頭](#ac0000) > フォルダ構成


# 5 仕様(JSDoc)<a name="ac0016"></a>

[先頭](#ac0000) > 仕様(JSDoc)


# 6 プログラムソース<a name="ac0017"></a>

[先頭](#ac0000) > プログラムソース


# 7 改版履歴<a name="ac0018"></a>

[先頭](#ac0000) > 改版履歴


- rev 1.0.0 : 2024/04/20
  - "class BurgerMenu rev 1.2.0"および作成途中の"class authClient/Server 2.0.0"を統合

