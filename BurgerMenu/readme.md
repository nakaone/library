<style scoped type="text/css">
html, body{
  width: 100%;
  margin: 0;
    text-size-adjust: none; }
body * {
  font-size: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.num, .right {text-align:right;}
.screen {padding: 1rem;} .title {   font-size: 2.4rem;
  text-shadow: 2px 2px 5px #888;
}

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

.triDown {   --bw: 50px;
  width: 0px;
  height: 0px;
  border-top: calc(var(--bw) * 0.7) solid #aaa;
  border-right: var(--bw) solid transparent;
  border-left: var(--bw) solid transparent;
  border-bottom: calc(var(--bw) * 0.2) solid transparent;
}

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


<p class="title">class BurgerMenu</p>

# 概要

## 用語解説

- ブランチ：下位の表示画面を持つ要素。下位画面のラッパーとしてのみ機能し、自らの表示画面は持てない。
- リーフ：自分自身の表示画面のみ持ち、下位画面を持たない要素。
- 遷移指定(href)：ナビで選択することで、指定サイトの表示を行う。画面は指定時の画面のまま、変化しない。
- 指定関数：ナビで選択することで、指定サイトの表示を行った上で指定された関数を実行する。

## 全体の構成

1. 表示部は&lt;div data-BurgerMenu&gt;の階層内で定義する。<br>
   階層外の要素はメニューで選択しても表示されない。

2. 下位の階層を持つ場合、自分自身の表示内容は持たせない(以下はNG)
   ```
   <div data-BurgerMenu="label:'お知らせ'">
   !!NG!! <p>お知らせのページです</p>
     <div data-BurgerMenu="label:'掲示板'">〜</div>
     <div data-BurgerMenu="label:'注意事項'">〜</div>
   </div>
   ```
   「お知らせ」は「掲示板」「注意事項」のブランチとして扱われるので、「&lt;p&gt;お知らせのページです&lt;/p&gt;」というお知らせページ自身の表示内容は定義不可。

## data-BurgerMenu属性の書き方

オブジェクトの記述に準ずる。但し短縮するため前後の"{","}"は省略する。

- {string} label - メニュー化する時の名称
- {string} [func] - メニュー選択時に実行する関数名。<br>
  関数名と実際の関数はBurgerMenuインスタンス生成時に定義。
- {string} [href] - 遷移先のURL。別タブが開かれる。
- {number} [authority] - 表示権限。<br>
  BurgerMenuインスタンス生成時のauthorityとの論理積>0なら表示する。<br>
  ex: 一般参加者1、スタッフ2として<br>
      data-BurgerMenu="authrotiry:2"とされた要素は、<br>
      new BurgerMenu({authority:1})の一般参加者は非表示、<br>
      new BurgerMenu({authority:2})のスタッフは表示となる。

## 処理の流れ

HTMLソース(≒body内部)を基に、BurgerMenu.#genNaviでソースの修正とナビゲーションの生成を行う


### サンプル

```
<body>
  <div data-BurgerMenu="label:'スタッフ'">
    <div data-BurgerMenu="label:'受付業務',func:'recept'"></div>
    <div data-BurgerMenu="label:'校内探険'">
        <img src="expedition.png" width="600px" />
    </div>
  </div>
  <div data-BurgerMenu="label:'Tips',href:'https://〜/tips.html'"></div>
</body>
```

### ソースの修正部分

- data-BurgerMenu属性を持つ要素にIDとなるclass属性を付与

```
<body>
  <div class="c1001" data-BurgerMenu="label:'スタッフ',authority:2">
    <div class="c1002" data-BurgerMenu="label:'受付業務',func:'recept'"></div>
    <div class="c1003" data-BurgerMenu="label:'校内探険'">
        <img src="expedition.png" width="600px" />
    </div>
  </div>
  <div class="c1004" data-BurgerMenu="label:'Tips',href:'https://〜/tips.html'"></div>
</body>
```

### 生成されるナビゲーション

- 通常の画面(校内探検)<br>
  ソースに付与されたIDに対応する文字列をname属性として持ち、
  クリックすると`<div class="(name属性の値)">`を持つ要素(該当画面)を開くイベントを付与
- func指定があった場合(受付業務)<br>
  name属性として「ID＋実行する関数名」を持ち、
  クリックすると該当画面を開き、指定された関数を実行するイベントを付与
- href指定があった場合(Tips)<br>
  href属性を持ち、クリックすると遷移先画面を開くイベントを付与

```
<nav>
  <ul>
    <li name="c1001">スタッフ
      <ul>
        <li><a name="c1002\trecept">受付業務</a></li>
        <li><a name="c1003">校内探検</a></li>
      </ul>
    </li>
    <li><a name="c1004" href="https://〜/tips.html">Tips</a></li>
  </ul>
</nav>
```

### data-BurgerMenu属性内「func」と関数の対応

BurgerMenuのインスタンス生成時、オプションで指定する

`func:{aaa:bbb}`：aaaはdata-BurgerMenu属性内で指定した関数名、bbbは実行する関数オブジェクトのラベル。

```
<script type="text/javascript">
v.BurgerMenu = new BurgerMenu('body',{
  authority: v.Auth.info.authority,
  home: 'c1005',  // 参加者パス画面をホームに設定(暫定)
  func: {recept:v.Reception.main},
});
</script>
```

# 仕様

## 画面遷移

<a href="_top" class="right">先頭へ</a>

## 画面構成

### 要素(DIV)構成図

<a href="_top" class="right">先頭へ</a>

### 画面上の要素の役割

<a href="_top" class="right">先頭へ</a>

<a name="BurgerMenu"></a>

## BurgerMenu
階層化された要素に基づきハンバーガーメニューを作成

**Kind**: global class  

* [BurgerMenu](#BurgerMenu)
    * [new BurgerMenu(parent, [opt])](#new_BurgerMenu_new)
    * [.change](#BurgerMenu+change) ⇒ <code>null</code> \| <code>Error</code>
    * [.dispatch](#BurgerMenu+dispatch)
    * [.toggle](#BurgerMenu+toggle) ⇒ <code>void</code>
    * [.showChildren](#BurgerMenu+showChildren)

<a name="new_BurgerMenu_new"></a>

### new BurgerMenu(parent, [opt])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parent | <code>string</code> \| <code>HTMLElement</code> |  | 親要素(wrapper)またはそのCSSセレクタ |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |

<a name="BurgerMenu+change"></a>

### burgerMenu.change ⇒ <code>null</code> \| <code>Error</code>
表示画面の変更

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> \| <code>PointerEvent</code> | クリックされたナビゲーションアイテムのイベント またはclassで定義された表示領域のID |

<a name="BurgerMenu+dispatch"></a>

### burgerMenu.dispatch
選択された関数の実行

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>PointerEvent</code> | ナビ領域で発生したイベントオブジェクト |

<a name="BurgerMenu+toggle"></a>

### burgerMenu.toggle ⇒ <code>void</code>
ナビゲーション領域の表示/非表示切り替え

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  

| Type |
| --- |
| <code>void</code> | 

<a name="BurgerMenu+showChildren"></a>

### burgerMenu.showChildren
ブランチの下位階層メニュー表示/非表示切り替え

**Kind**: instance property of [<code>BurgerMenu</code>](#BurgerMenu)  


# source

<a href="_top" class="right">先頭へ</a>

<details><summary>core.js</summary>

```
/**
 * @classdesc 階層化された要素に基づきハンバーガーメニューを作成
 */
class BurgerMenu {

  /**
   * @constructor
   * @param {string|HTMLElement} parent - 親要素(wrapper)またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {null|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'BurgerMenu.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // メンバの設定
      setupInstance(this,opt,{
        parent: parent, // {HTMLElement} 親要素(ラッパー)
        parentSelector: null, // {string} 親要素(ラッパー)のCSSセレクタ
        func: {},         // funcで指定された名称と実関数の紐付けマップ
        icon: null,       // {HTMLElement} ハンバーガーアイコン要素
        navi: null,       // {HTMLElement} ナビゲーション要素
        back: null,       // {HTMLElement} ナビゲーション背景要素
        home: null,       // ホーム画面のID
        authority: 4294967295,  // 実行権限。既定値2^32-1
        onLeave: [],      // 別ページに遷移する際に実行する関数群(dispatchで使用)
        initialSubMenu: true, // サブメニューの初期状態。true:開いた状態、false:閉じた状態
        css: [
          /* BurgerMenu共通
            --text: テキストおよびハンバーガーアイコンの線の色
            --maxIndex: ローディング画面優先なので、最大値2147483647-1
          */`
          .BurgerMenu {
            --text : #000;
            --fore : #fff;
            --back : #ddd;
            --debug : rgba(255,0,0,1);
            --iconSize : 100px;
            --maxIndex : 2147483646;
            --navWidth : 0.7;
          }`,
          /* ハンバーガーアイコン
            icon周囲にiconSizeの40%程度の余白が必要なのでtop,rightを指定
          */`
          .BurgerMenu.icon {
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
          .BurgerMenu.icon > button {
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
          .BurgerMenu.icon button span {
            display : block;
            width : 100%;
            height : calc(var(--iconSize) * 0.12);
            border-radius : calc(var(--iconSize) * 0.06);
            position : absolute;
            left : 0;
            background : var(--text);
            transition : top 0.24s, transform 0.24s, opacity 0.24s;
          }
          .BurgerMenu.icon button span:nth-child(1) {
            top : 0;
          }
          .BurgerMenu.icon button span:nth-child(2) {
            top : 50%;
            transform : translateY(-50%);
          }
          .BurgerMenu.icon button span:nth-child(3) {
            top : 100%;
            transform : translateY(-100%);
          }
          .BurgerMenu.icon button span.is_active:nth-child(1) {
            top : 50%;
            transform : translateY(-50%) rotate(135deg);
          }
          .BurgerMenu.icon button span.is_active:nth-child(2) {
            transform : translate(50%, -50%);
            opacity : 0;
          }
          .BurgerMenu.icon button span.is_active:nth-child(3) {
            top : 50%;
            transform : translateY(-50%) rotate(-135deg);
          }`,
          /* ナビゲーション領域 */`
          nav.BurgerMenu {
            display : none;
          }
          nav.BurgerMenu.is_active {
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
          nav.BurgerMenu ul {
            margin : 0rem 0rem 1rem 0rem;
            padding : 0rem 0rem 0rem 0rem;
            background-color : var(--back);
          }
          nav.BurgerMenu ul ul { /* 2階層以降のulにのみ適用 */
            display : none;
          }
          nav.BurgerMenu ul ul.is_open {
            display : block;
            border-top : solid 0.2rem var(--fore);
            border-left : solid 0.7rem var(--fore);
          }
          nav.BurgerMenu li {
            margin : 0.6rem 0rem 0.3rem 0.5rem;
            padding : 0.5rem 0rem 0rem 0rem;
            list-style : none;
            background-color : var(--back);
          }
          nav.BurgerMenu li a {
            color : var(--text);
            text-decoration : none;
            font-size: 1.5rem;
          }`,
          /* 背景 */`
          .BurgerMenu.back {
            display : none;
          }
          .BurgerMenu.back.is_active {
            display : block;
            position : absolute;
            top : 0;
            right : 0;
            width : 100vw;
            height : 100vh;
            z-index : calc(var(--maxIndex) - 1);
            background : rgba(100,100,100,0.8);
          }`,
        ],
      });

      v.step = 2.1; // アイコンの作成
      this.icon = createElement({
        attr:{class:'BurgerMenu icon'},
        event:{click:this.toggle},
        children:[{
          tag:'button',
          children:[
            {tag:'span'},{tag:'span'},{tag:'span'}
          ]
        }]
      });
      this.parent.appendChild(this.icon);
      v.step = 2.2; // ナビゲータの作成
      this.navi = createElement({
        tag:'nav',
        attr:{class:'BurgerMenu'},
      });
      this.parent.appendChild(this.navi);
      v.step = 2.3; // ナビゲータ背景の作成
      this.back = createElement({
        attr:{class:'BurgerMenu back'},
        event:{click:this.toggle},
      });
      this.parent.appendChild(this.back);

      v.step = 3; // 親要素を走査してナビゲーションを作成
      v.rv = this.#genNavi();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 4; // ホーム画面表示
      this.change(this.home);

      console.log(v.whois+' normal end.',v.rv,this);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 親要素を走査してナビゲーションを作成
   * @param {HTMLElement} parent - body等の親要素。
   * @param {HTMLElement} navi - nav等のナビゲーション領域
   * @returns {null|Error}
   */
  #genNavi = (parent=this.parent,navi=this.navi) => {
    const v = {whois:'BurgerMenu.#genNavi',step:0,rv:null,idnum:1000,
      tree:(parent,navi) => { // メニューのツリーを作成
        console.log(v.whois+' tree start:',parent,navi);
        for( let i=0 ; i<parent.childElementCount ; i++ ){
          v.step = 1; // 子要素を順次走査
          let d = parent.children[i];
          let attr = d.getAttribute('data-BurgerMenu');
          if( attr ){
            // data-BurgerMenuをもつ要素のみ以下の処理を実施

            v.step = 2; // IDを採番、クラスに保存
            v.id = 'c'+String(++v.idnum);
            d.classList.add(v.id);

            v.step = 3; // data-BurgerMenuの文字列をオブジェクト化
            let obj = (new Function('return {'+attr+'}'))();

            v.step = 4; // 実行権限がない機能・画面はナビに追加しない
            if( obj.hasOwnProperty('authority')
             && (this.authority & Number(obj.authority)) === 0 ){
              continue;
            }

            v.step = 5; // 1階層上のliタグがまだulを持っていなければ追加しておく
            let ul = navi.querySelector('ul');
            if( ul === null ){
              ul = createElement('ul');
              navi.appendChild(ul);
            }

            v.step = 6; // 1階層上のliが持つulに追加登録
            let li = null;
            if( obj.hasOwnProperty('href') ){
              v.step = 6.1;
              // 他サイトへの遷移指定の場合
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                attr:{name:v.id,href:obj.href,target:'_blank'},
                //attr:{name:obj.func,href:obj.href,target:'_blank'},
                event:{click:this.toggle},  // 遷移後メニューを閉じる
              }]});
            } else if( obj.hasOwnProperty('func') ){
              v.step = 6.2;
              // 指定関数実行の場合
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                attr: {name:v.id+'\t'+obj.func},
                //attr: {name:obj.func},
                event:{click:this.dispatch}
              }]});
            } else {
              v.step = 6.3;
              // 指定画面表示のリーフ or 子階層を持つブランチ
              // 暫定的に前者とみなし、全部作成後に子階層有無で修正
              v.step = 2.6;
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                // 暫定とわかるよう、nameには'_'をつける
                attr: {name:'_'+v.id},
                //event:{click:this.change},
              }]});
            }

            v.step = 7; // ulに自分を追加後、自分を親として再帰呼出
            ul.appendChild(li);
            v.tree(d,li);
          }
        }
      },
      branch: (li) => {  // tree内のブランチはshowChildrenに変更
        v.step = 10; // 自分自身がブランチかを判定
        // 「子要素としてul(下位階層)を持つ ⇒ ブランチ」
        // 尚「自分はulを持たないが子孫はulを持つ」は有り得ない。
        // ∵子はulが無いと保持できない
        let ul = li.querySelector(':scope > ul');
        let a = li.querySelector(':scope > a');

        let m = a.getAttribute('name').match(/^_(.+)$/);
        if( m ){
          // nameが'_'で始まる ⇒ v.treeのstep.6.3で「暫定」と判別された
          // 指定画面表示のリーフ or 子階層を持つブランチ
          // ※暫定では無い場合は処理不要(=遷移指定/指定関数実行)
          a.setAttribute('name',m[1]);
          if( ul ){
            v.step = 11;
            // ulを持つ ⇒ 子孫あり ⇒ ブランチ
            if( this.initialSubMenu ){
              // サブメニューの初期状態を開いた状態とする場合
              a.innerText = '▼' + a.innerText;
              ul.classList.add('is_open');
            } else {
              // サブメニューの初期状態を閉じた状態とする場合
              a.innerText = '▶︎' + a.innerText;
            }
            a.addEventListener('click',this.showChildren);
            // 子要素にもブランチがないか再帰呼出
            // ※直下の要素のみ対象なので':scope >'を付加
            ul.querySelectorAll(':scope > li').forEach(x => v.branch(x));
          } else {
            v.step = 12;
            // ulを持たない ⇒ 子孫なし ⇒ リーフ
            a.addEventListener('click',this.change);
            if( this.home === null ){
              v.step = 13;
              // ホーム画面未定の場合、最初のリーフをホーム画面とする
              this.home = a.getAttribute('name');
            }
          }
        }
      },
    };
    console.log(v.whois+'start.');
    try {

      // parent(body内部)の要素を再起的に全て呼び出し
      v.tree(parent,navi);

      // ブランチを検出し、イベントを設定
      this.parent.querySelectorAll('nav.BurgerMenu > ul > li')
      .forEach(x => v.branch(x));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 表示画面の変更
   * @param {string|PointerEvent} event - クリックされたナビゲーションアイテムのイベント
   * またはclassで定義された表示領域のID
   * @returns {null|Error}
   */
  change = (event=this.home) => {
    const v = {whois:'BurgerMenu.change',step:0,rv:null,
      showElement: (d) => { // 対象領域を表示
        d.style.display = '';
        if( d.parentElement.tagName.toLowerCase() !== 'body' )
          v.showElement(d.parentElement);
      },
    };
    console.log(v.whois+' start.',event);
    try {

      v.step = 1; // data-BurgerMenu属性を持つ要素を全て非表示に
      v.selector = '[data-BurgerMenu]';
      this.parent.querySelectorAll(v.selector)
      .forEach(x => x.style.display = 'none');

      v.step = 2; // 対象領域を特定
      v.selector = '.'
      + (typeof event === 'string' ? event : event.target.name)
      + v.selector;
      v.target = this.parent.querySelector(v.selector);
      // 対象領域〜body迄を表示
      v.showElement(v.target);

      // ナビゲーションから呼ばれた場合の処理
      // ※constructorから呼ばれた場合(引数が文字列の場合)は対象外
      if( typeof event !== 'string' ){
        v.step = 3; // ナビゲーションを非表示
        this.toggle();
        // 別ページに遷移する際に実行する関数群を実行
        this.onLeave.forEach(x => x());
      }

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 選択された関数の実行
   * @param {PointerEvent} event - ナビ領域で発生したイベントオブジェクト
   */
  dispatch = (event) => {
    const v = {whois:'BurgerMenu.dispatch',step:0,rv:null};
    console.log(v.whois+' start.',event);
    try {

      v.step = 1; // ナビゲーションを非表示
      this.toggle();

      v.step = 2; // 別ページに遷移する際に実行する関数群を実行
      this.onLeave.forEach(x => x());

      v.step = 3; // name属性から画面IDと選択された関数名を取得
      v.name = event.target.getAttribute('name').split('\t');

      v.step = 4; // 画面を切り替え
      this.change(v.name[0]);

      v.step = 5; // 選択された関数を実行
      console.log(this.func);
      this.func[v.name[1]]();

      v.step = 6; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** ナビゲーション領域の表示/非表示切り替え
   * @param {void}
   * @returns {void}
   */
  toggle = () => {
    const v = {whois:'BurgerMenu.toggle',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      document.querySelector('nav.BurgerMenu').classList.toggle('is_active');
      document.querySelector('.BurgerMenu.back').classList.toggle('is_active');
      document.querySelectorAll('.BurgerMenu.icon button span')
      .forEach(x => x.classList.toggle('is_active'));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** ブランチの下位階層メニュー表示/非表示切り替え */
  showChildren = (event) => {
    const v = {whois:'BurgerMenu.showChildren',step:0,rv:null};
    console.log(v.whois+' start.',event);
    try {
      event.target.parentNode.querySelector('ul').classList.toggle('is_open');
      let m = event.target.innerText.match(/^([▶️▼])(.+)/);
      const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
      event.target.innerText = text;

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}
```

</details>

<!--
<details><summary>test.js</summary>

```

```

</details>
-->

<details><summary>build.sh</summary>

```
#!/bin/sh
# -x  つけるとverbose

# ----------------------------------------------
# 1.事前準備
# ----------------------------------------------
hr="\n=======================================\n"
echo "\n$hr[BurgerMenu] build start$hr"

# 1.1 変数・ツールの定義
GitHub="/Users/ena.kaon/Desktop/GitHub"
lib="$GitHub/library"
esed="$lib/esed/1.0.0/core.js"
mod="$lib/BurgerMenu/1.0.0"
readme="$lib/BurgerMenu/readme.md"

# 1.2 .DS_storeの全削除
cd $mod
find .. -name '.DS_Store' -type f -ls -delete

# 1.3 tmpの用意
rm -rf tmp
mkdir tmp
tmp="tmp"

# 1.4 使用するクラスを最新化
#$lib/SingleTableClient/1.0.0/build.sh

## ----------------------------------------------
## 2. クライアント側(index.html)の作成
## ----------------------------------------------
## 2.1 スタイルシートの統合
#style="$tmp/client.css"
#touch $style
#list=(
#  $lib/CSS/1.3.0/core.css
#  $mod/src/css/BurgerMenu.css
#)
#for scr in ${list[@]}; do
#  cat $scr | awk 1 >> $style
#done
## 2.2 スクリプトの統合
#script="$tmp/client.js"
#touch $script
#list=(
#  $lib/mergeDeeply/1.1.0
#  $lib/stringify/1.1.1
#  $lib/isEqual/1.0.0
#  $lib/doGAS/1.0.0
#  $lib/writeClipboard/1.0.0
#  $lib/createElement/1.2.1
#  $lib/changeScreen/1.0.0
#  $lib/toLocale/1.0.0
#  $lib/whichType/1.0.1
#  $lib/SingleTableClient/1.0.0
#  $mod/src/onLoad
#)
#for scr in ${list[@]}; do
#  cat $scr/core.js | awk 1 >> $script
#done
## 2.3 プロトタイプへの組み込み
#cat $mod/src/proto/index.html | awk 1 \
#| node $esed -f:"/* ::client.css:: */" -r:$style \
#| node $esed -f:"// ::client.js::" -r:$script \
#> $mod/index.html
#
## ----------------------------------------------
## 3. サーバ側スクリプトの作成
## ----------------------------------------------
## 3.1 スクリプトの統合
#server="$tmp/server.js"
#touch $server
#list=(
#  $mod/src/doGet
#  $mod/src/BurgerMenuServer
#  $lib/SingleTable/1.2.0
#  $lib/SingleTableServer/1.0.0
#  $lib/convertNotation/1.0.0
#  $lib/stringify/1.1.1
#  $lib/whichType/1.0.1
#)
#for scr in ${list[@]}; do
#  cat $scr/core.js | awk 1 >> $server
#done
## 3.2 server.gsの作成
#cp $server $mod/server.gs

# ----------------------------------------------
# 4. 仕様書の作成
# ----------------------------------------------
# 標準CSSを用意(コメントはesedで除外)
echo "<style scoped type=\"text/css\">" > $readme
cat $lib/CSS/1.3.0/core.css | awk 1 \
| node $esed -x:"\/\*[\s\S]*?\*\/\n*" -s:"" >> $readme
echo "</style>\n\n" >> $readme

# proto/readme.mdを追加
jsdoc2md $mod/core.js > $mod/core.md
cat $mod/readme.md \
| node $esed -x:"__JSDoc" -f:$mod/core.md \
| node $esed -x:"__source" -f:$mod/core.js \
| node $esed -x:"__test" -f:$mod/test.js \
| node $esed -x:"__build" -f:$mod/build.sh \
>> $readme

#jsdoc2md $script > $tmp/client.md
#jsdoc2md $server > $tmp/server.md
#
#cat $mod/src/proto/readme.md | awk 1 \
#| node $esed -f:"<!--:: client.md ::-->" -r:$tmp/client.md \
#| node $esed -f:"<!--:: client.css ::-->" -r:$script \
#| node $esed -f:"<!--:: client.js ::-->" -r:$script \
#| node $esed -f:"<!--:: server.md ::-->" -r:$tmp/server.md \
#| node $esed -f:"<!--:: server.js ::-->" -r:$server \
#> $mod/readme.md

echo "\n$hr[BurgerMenu] build end$hr"
```

</details>

# 改版履歴

<a href="_top" class="right">先頭へ</a>

- rev.1.0.1 : 2024/03/07 
- rev.1.0.0 : 2024/01/03 初版
