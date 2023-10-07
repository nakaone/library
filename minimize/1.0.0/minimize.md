lastUpdate: 2023年 7月22日 土曜日 23時58分46秒 JST

## Functions

<dl>
<dt><a href="#minimize">minimize(str, opt)</a> ⇒ <code>string</code></dt>
<dd><p>ソースから指定形式のコメントを削除</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#minimizeArg">minimizeArg</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="minimize"></a>

## minimize(str, opt) ⇒ <code>string</code>
ソースから指定形式のコメントを削除

**Kind**: global function  
**Returns**: <code>string</code> - コメントを削除したソース  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | 操作対象となるソース |
| opt | [<code>minimizeArg</code>](#minimizeArg) | コメント形式の指定 |

<a name="minimizeArg"></a>

## minimizeArg : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [jsdoc] | <code>boolean</code> | <code>false</code> | trueならJSDoc形式(/**〜*／)のコメントを削除する |
| [js] | <code>boolean</code> | <code>false</code> | trueならJavaScript形式(/*〜*／,／／)のコメントを削除する |
| [css] | <code>boolean</code> | <code>false</code> | trueならCSS形式(/*〜*／)のコメントを削除する |
| [html] | <code>boolean</code> | <code>false</code> | trueならHTML形式(<!--〜--＞)のコメントを削除する |
| [all] | <code>boolean</code> | <code>false</code> | trueなら上記全てのコメントを削除する |


## source

```
/* コアScript */
/**
 * @typedef {Object} minimizeArg
 * @prop {boolean} [jsdoc=false] - trueならJSDoc形式(/**〜*／)のコメントを削除する
 * @prop {boolean} [js=false] - trueならJavaScript形式(/*〜*／,／／)のコメントを削除する
 * @prop {boolean} [css=false] - trueならCSS形式(/*〜*／)のコメントを削除する
 * @prop {boolean} [html=false] - trueならHTML形式(<!--〜--＞)のコメントを削除する
 * @prop {boolean} [all=false] - trueなら上記全てのコメントを削除する
 */

/**
 * ソースから指定形式のコメントを削除
 * @param {string} str - 操作対象となるソース
 * @param {minimizeArg} opt - コメント形式の指定
 * @returns {string} コメントを削除したソース
 */
function minimize(str,opt={}){
  const v = {
    rv:str,
    rex:{
      jsdoc: /\s*?\/\*\*[\s\S]+?\*\/\s*?/g,
      js: /\s*\/\/.+\n/g,
      css: /\s*?\/\*[\s\S]+?\*\/\s*?/g,
      html: /\s*?<!\-\-[\s\S]+?\-\->\s*?/g,
    },
  };
  console.log('minimize start.');
  try {

    v.opt = Object.assign({
      jsdoc:false,
      js: false,
      css: false,
      html: false,
      all: false,
    },opt);
    console.log('opt='+JSON.stringify(v.opt));

    if( v.opt.jsdoc || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.jsdoc,'');
    }
    if( v.opt.js || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.css,'');
      v.rv = v.rv.replaceAll(v.rex.js,'\n');
    }
    if( v.opt.css || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.css,'');
    }
    if( v.opt.html || v.opt.all ){
      v.rv = v.rv.replaceAll(v.rex.html,'');
    }

    // 複数の改行は一つに    
    v.rv = v.rv.replaceAll(/\n+/g,'\n');

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('minimize end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
```
