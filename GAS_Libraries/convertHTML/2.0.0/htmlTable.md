## Functions

<dl>
<dt><a href="#convertNotation">convertNotation(arg)</a></dt>
<dd><p>列記号&lt;-&gt;列番号(数値)の相互変換</p>
</dd>
<dt><a href="#createElement">createElement(arg, [parent])</a> ⇒ <code>HTMLElement</code> | <code>Error</code></dt>
<dd><p>HTMLElementを生成する</p>
</dd>
<dt><a href="#toLocale">toLocale(dObj, [format])</a> ⇒ <code>string</code></dt>
<dd><p>日時を指定形式の文字列にして返す</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CEDefObj">CEDefObj</a></dt>
<dd></dd>
</dl>

<a name="convertNotation"></a>

## convertNotation(arg)
列記号<->列番号(数値)の相互変換

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> \| <code>number</code> | 列記号または列番号(自然数) |

<a name="createElement"></a>

## createElement(arg, [parent]) ⇒ <code>HTMLElement</code> \| <code>Error</code>
HTMLElementを生成する

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | [<code>CEDefObj</code>](#CEDefObj) \| [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) |  | 生成するHTMLElementの定義 |
| [parent] | <code>HTMLElement</code> \| <code>string</code> | <code></code> | 本関数内部で親要素への追加まで行う場合に指定 |

<a name="toLocale"></a>

## toLocale(dObj, [format]) ⇒ <code>string</code>
日時を指定形式の文字列にして返す

**Kind**: global function  
**Returns**: <code>string</code> - 指定形式に変換された文字列。無効な日付なら長さ0の文字列  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dObj | <code>Date</code> |  | 日付型オブジェクト |
| [format] | <code>string</code> | <code>&quot;&#x27;yyyy/MM/dd&#x27;&quot;</code> | 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n |

**Example**  
```
"1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
"1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
"1965/9/5"[hh:mm] ⇒ "00:00"
"1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
"1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
"1977-03-04"[hh:mm] ⇒ "09:00"
1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
1688189258262[hh:mm] ⇒ "14:27"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
"Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
"12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
"12:34"[yyyy-MM-dd] ⇒ ""
"12:34"[hh:mm] ⇒ ""
```
<a name="CEDefObj"></a>

## CEDefObj
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [tag] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | タグ |
| [attr] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | タグの属性(ex.src, class) |
| [style] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | 適用するCSS。ラベルは通常のCSSと同じ。 |
| [event] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | イベント名：関数Objのオブジェクト。ex. {click:()=>{〜}} |
| [text] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerTextにセットする文字列 |
| [html] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | innerHTMLにセットする文字列 |
| [children] | [<code>Array.&lt;CEDefObj&gt;</code>](#CEDefObj) | <code>[]</code> | 子要素 |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | クラスメンバにする場合、メンバ名となる文字列 |


## source

```
<!DOCTYPE html>
<!-- ----------------------------------------------
道具箱 > 「選択範囲をHTML化」サイドバー画面＋スクリプト
----------------------------------------------- -->
<html>
  <head>
    <base target="_top">
    <?!= HtmlService.createHtmlOutputFromFile('clientLib').getContent(); ?>
  </head>
  <body>
    <div>
      <button onclick="genHtml()">実行</button>
    </div>
    <div>
      <textarea></textarea>
    </div>
  </body>
</html>
<script>
async function genHtml(){
  const v = {whois:'genHtml',rv:null,step:0};
  console.log(v.whois+' start.');
  try {

    v.step = 1; // アクティブセルの情報を取得
    v.cellInfo = JSON.parse(await doGAS('getCellInfo'));
    if( v.cellInfo instanceof Error ) throw v.cellInfo;
    console.log(v.cellInfo);

    v.step = 2; // tableの枠組み作成
    v.dom = createElement({children:[
      {tag:'table',children:[
        {tag:'thead',children:[{tag:'tr'}]},
        {tag:'tbody'}
      ]}
    ]});
    if( v.dom instanceof Error ) throw v.dom;
    v.thead = v.dom.querySelector('thead tr');
    v.tbody = v.dom.querySelector('tbody');

    v.step = 3; // 列記号の追加
    for( v.c=v.cellInfo.firstColumn ; v.c<=v.cellInfo.lastColumn ; v.c++ ){
      v.thead.appendChild(createElement({tag:'th',text:convertNotation(v.c)}));
    }

    v.step = 4; // 行データの追加
    for( v.r=0 ; v.r<v.cellInfo.value.length ; v.r++ ){
      v.tr = {tag:'tr',children:[{tag:'th',attr:{class:'num'},text:(v.cellInfo.firstRow + v.r)}]};
      for( v.c=0 ; v.c<v.cellInfo.value[v.r].length ; v.c++ ){
        v.type = v.cellInfo.type[v.r][v.c];
        v.value = v.cellInfo.value[v.r][v.c];
        v.td = {tag:'td',attr:{}};
        if( v.type === 'Number' ){
          v.td.attr.class = 'num';
          v.td.text = v.value.toLocaleString();
        } else if( v.type === 'Date' ){
          v.format = v.cellInfo.format[v.r][v.c].replaceAll('"','');
          // 前後のいずれかに'/'がつく場合、月と見做して大文字に変換
          v.m = v.format.match(/\/m+/);
          console.log(v.m);
          if( v.m ) v.format = v.format.replace(v.m[0],'/'+('M'.repeat(v.m[0].length-1)));
          v.m = v.format.match(/m+\//);
          console.log(v.m);
          if( v.m ) v.format = v.format.replace(v.m[0],('M'.repeat(v.m[0].length-1)+'/'));
          v.td.text = toLocale(new Date(v.value),v.format);
          console.log('l.55 value=%s, type=%s, format=%s locale=%s',v.value,v.type,v.format,v.td.text);
        } else {
          v.td.text = v.value;
        }
        v.tr.children.push(v.td);
      }
      v.tbody.appendChild(createElement(v.tr));
    }

    v.rv = v.dom.innerHTML;
    document.querySelector('textarea').value = v.rv;
    console.log(v.whois+' normal end.\n',v.rv);

  } catch(e) {
    console.error(e,v);
    return e;
  }
}

/** 列記号<->列番号(数値)の相互変換
  * @param {string|number} arg - 列記号または列番号(自然数)
  */
function convertNotation(arg){
  const v = {rv:null,map: new Map([
    // 26進数 -> 列記号
    ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
    ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
    ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
    ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
    ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
    ['p','Z'],
    // 列記号 -> 26進数
    ['A',1],['B',2],['C',3],['D',4],['E',5],
    ['F',6],['G',7],['H',8],['I',9],['J',10],
    ['K',11],['L',12],['M',13],['N',14],['O',15],
    ['P',16],['Q',17],['R',18],['S',19],['T',20],
    ['U',21],['V',22],['W',23],['X',24],['Y',25],
    ['Z',26],
  ])};
  try {

    if( typeof arg === 'number' ){
      v.step = 1; // 数値の場合
      // 1未満はエラー
      if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
      v.rv = '';
      v.str = (arg-1).toString(26); // 26進数に変換
      // 26進数 -> 列記号に変換
      for( v.i=0 ; v.i<v.str.length ; v.i++ ){
        v.rv += v.map.get(v.str.slice(v.i,v.i+1));
      }
    } else if( typeof arg === 'string' ){
      v.step = 2; // 文字列の場合
      arg = arg.toUpperCase();
      v.rv = 0;
      for( v.i=0 ; v.i<arg.length ; v.i++ )
        v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
    } else {
      v.step = 3; // 数値でも文字列でもなければエラー
      throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
    }

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = 'convertNotation: ' + e.message;
    return e;
  }
}

/**
  * @typedef CEDefObj - createElementに渡すオブジェクト形式
  * @prop {string} [tag='div'] - タグ
  * @prop {Object.<string, string>} [attr={}] - タグの属性(ex.src, class)
  * @prop {Object.<string, string>} [style={}] - 適用するCSS。ラベルは通常のCSSと同じ。
  * @prop {Object.<string, string>} [event={}] - イベント名：関数Objのオブジェクト。ex. {click:()=>{〜}}
  * @prop {string} [text=''] - innerTextにセットする文字列
  * @prop {string} [html=''] - innerHTMLにセットする文字列
  * @prop {CEDefObj[]} [children=[]] - 子要素
  * @prop {string} [name=''] - クラスメンバにする場合、メンバ名となる文字列
  */
/** HTMLElementを生成する
  * @param {CEDefObj|CEDefObj[]} arg - 生成するHTMLElementの定義
  * @param {HTMLElement|string} [parent=null] - 本関数内部で親要素への追加まで行う場合に指定
  * @returns {HTMLElement|Error}
  */
function createElement(arg,parent=null){
  const v = {whois:'BasePage.createElement',rv:[],step:0};
  //console.log(v.whois+' start.',arg);
  try {
    v.step = 1.1; // 引数を強制的に配列化
    v.isArr = Array.isArray(arg); // 引数が配列ならtrue。戻り値にも使用するので保存
    if( !v.isArr ) arg = [arg];
    v.step = 1.2; // 親要素の特定
    if( parent !== null ){
      v.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
    }


    for( v.i = 0 ; v.i<arg.length ; v.i++ ){
      v.step = 2; // 既定値の設定
      v.def = {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[],name:''};
      Object.assign(v.def,(typeof arg[v.i] === 'string' ? {tag:arg} : arg[v.i]))

      v.step = 3; // HTMLElementを生成、v.objとする
      v.obj = document.createElement(v.def.tag);

      v.step = 4; // HTMLElementの属性を定義
      for( v.j in v.def.attr ){
        v.obj.setAttribute(v.j,v.x = v.def.attr[v.j]);
      }

      v.step = 5; // 論理属性を定義(ex.checked)
      for( v.j in v.def.logical ){
        if( v.def.logical[v.j] ){
          v.obj.setAttribute(v.j,v.def.logical[v.j]);
        }
      }

      v.step = 6; // style属性の定義
      for( v.j in v.def.style ){
        if( v.j.match(/^\-\-/) ){ // CSS変数
          v.obj.style.setProperty(v.j,v.def.style[v.j]);
        } else {
          v.obj.style[v.j] = v.def.style[v.j];
        }
      }

      v.step = 7; // イベントの定義
      for( v.j in v.def.event ){
        v.obj.addEventListener(v.j,v.def.event[v.j],false);
      }

      v.step = 8; // 内部文字列(html or text)
      if( v.def.html.length > 0 ){
        v.obj.innerHTML = v.def.html;
      } else {
        v.obj.innerText = v.def.text;
      }

      v.step = 9; // 子要素の追加(parentは指定しない)
      for( v.j=0 ; v.j<v.def.children.length ; v.j++ ){
        v.obj.appendChild(this.createElement(v.def.children[v.j]));
      }

      v.step = 10; // 戻り値への登録
      v.rv.push(v.obj);

      v.step = 11; // 親要素への追加
      if( parent !== null ){
        v.parent.appendChild(v.obj);
      }

      v.step = 12; // メンバとして、また切替画面として登録
      if( v.def.name.length > 0 ){
        this[v.def.name] = v.obj;
        this.screenList[v.def.name] = v.obj;
      }
    }

    v.step = 12; // 配列で渡されたら配列で、オブジェクトならオブジェクトを返す
    v.rv = v.isArr ? v.rv : v.rv[0];
    //console.log(v.whois+' normal end.\n',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** 日時を指定形式の文字列にして返す
 * @param {Date} dObj - 日付型オブジェクト
 * @param {string} [format='yyyy/MM/dd'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function toLocale(dObj,format='yyyy/MM/dd'){
  const v = {rv:format,l:{ // 地方時ベース
    y: dObj.getFullYear(),
    M: dObj.getMonth()+1,
    d: dObj.getDate(),
    h: dObj.getHours(),
    m: dObj.getMinutes(),
    s: dObj.getSeconds(),
    n: dObj.getMilliseconds()
  }};
  try {

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.step = 2; // 日付文字列作成
    for( v.x in v.l ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.l[v.x]).slice(-v.m[0].length)
          : String(v.l[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}
</script>
```
