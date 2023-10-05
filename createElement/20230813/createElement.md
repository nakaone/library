lastUpdate: 2023年 8月 8日 火曜日 15時44分17秒 JST

## Functions

<dl>
<dt><a href="#createElement">createElement(arg)</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>HTMLの要素を生成</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#createElementDef">createElementDef</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="createElement"></a>

## createElement(arg) ⇒ <code>HTMLElement</code>
HTMLの要素を生成

**Kind**: global function  
**Returns**: <code>HTMLElement</code> - 生成された要素  

| Param | Type | Description |
| --- | --- | --- |
| arg | [<code>createElementDef</code>](#createElementDef) \| <code>string</code> | 生成する要素の定義 |

<a name="createElementDef"></a>

## createElementDef : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tag | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | タグ名 |
| [attr] | <code>Object.&lt;string, string&gt;</code> |  | タグに設定する属性。ex.attr:{name:'hoge'} |
| [logical] | <code>Object.&lt;string, boolean&gt;</code> |  | 論理属性(ex.disabled)。trueなら追加 |
| [style] | <code>Object.&lt;string, string&gt;</code> |  | 〃スタイル。ex.style:{display:'none'} |
| [event] | <code>Object.&lt;string, string&gt;</code> |  | 〃イベント。ex.event:{onclick:()=>{〜}} |
| [text] | <code>string</code> |  | タグ内にセットする文字列 |
| [html] | <code>string</code> |  | タグ内にセットするhtml文字列 |
| [children] | [<code>Array.&lt;createElementDef&gt;</code>](#createElementDef) |  | 子要素の配列 |


## source

```
/* コアスクリプト */
/**
 * @typedef {Object} createElementDef
 * @prop {string} tag='div' - タグ名
 * @prop {Object.<string,string>} [attr] - タグに設定する属性。ex.attr:{name:'hoge'}
 * @prop {Object.<string,boolean>} [logical] - 論理属性(ex.disabled)。trueなら追加
 * @prop {Object.<string,string>} [style] - 〃スタイル。ex.style:{display:'none'}
 * @prop {Object.<string,string>} [event] - 〃イベント。ex.event:{onclick:()=>{〜}}
 * @prop {string} [text] - タグ内にセットする文字列
 * @prop {string} [html] - タグ内にセットするhtml文字列
 * @prop {createElementDef[]} [children] - 子要素の配列
 */

/**
 * HTMLの要素を生成
 * @param {createElementDef|string} arg - 生成する要素の定義
 * @returns {HTMLElement} 生成された要素
 */
function createElement(arg={}){
  const v = {rv:null,arg:{}};
  //console.log('createElement start.');

  // 既定値の設定
  v.arg = mergeDeeply(
    {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[]},
    (typeof arg === 'string' ? {tag:arg} : arg));
  //console.log(v.arg);

  v.rv = document.createElement(v.arg.tag);
  for( v.i in v.arg.attr ){ // 属性の設定
    v.rv.setAttribute(v.i,v.x = v.arg.attr[v.i]);
  }
  for( v.i in v.arg.logical ){  // 論理属性の設定
    if( v.arg.logical[v.i] ){
      v.rv.setAttribute(v.i,true);
    }
  }
  for( v.i in v.arg.style ){ // スタイルの設定
    if( v.i.match(/^\-\-/) ){ // CSS変数の場合
      v.rv.style.setProperty(v.i,v.arg.style[v.i]);
    } else {
      v.rv.style[v.i] = v.arg.style[v.i];
    }
    //console.log(v.i,v.arg.style[v.i],v.rv.style);
  }
  for( v.i in v.arg.event ){ // イベントの設定
    v.rv.addEventListener(v.i,v.arg.event[v.i],false);
    //console.log(v.i,v.arg.event[v.i],v.rv);
  }
  if( v.arg.html.length > 0 ){
    v.rv.innerHTML = v.arg.html;
  } else {
    v.rv.innerText = v.arg.text;  // 内部文字列
  }
  for( v.i=0 ; v.i<v.arg.children.length ; v.i++ ){
    // 子要素の追加
    v.rv.appendChild(createElement(v.arg.children[v.i]));
  }
  //console.log('createElement end.',v.rv);
  return v.rv;
}
```
