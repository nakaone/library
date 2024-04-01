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

<p class="title"><a name="top">modifyMD</a></p>

MarkDown文書の見出しを採番、TOC/足跡リストを作成・追加

# pipeでの使用方法

`node pipe.js -(オプション):(値)`を起動

```
cat $test/test.md | awk 1 \
| node $mod/pipe.js -footprint:'false' > $test/result.md
```

オプションについてはJSDoc参照

<details><summary>参考：build.sh内でpipe.js生成ソース</summary>

```
# 2.1 pipe処理部分の記述
cat << EOS > $mod/pipe.js
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(modifyMD(lines.join('\n'),analyzeArg().opt));
});
EOS
# 2.2 modifyMD(core.js)
cat $mod/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
# 2.3 その他ライブラリ
cat $lib/analyzeArg/1.1.0/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
cat $lib/stringify/1.1.1/core.js | awk 1 >> $mod/pipe.js
cat $lib/whichType/1.0.1/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
```

</details>

# <a name="jsdoc" href="#top">仕様(JSDoc)</a>

<a name="modifyMD"></a>

## modifyMD(arg, [opt]) ⇒ <code>string</code>
MarkDown文書の見出しを採番、TOC/足跡リストを作成・追加

**Kind**: global function  
**Returns**: <code>string</code> - 加工済のMarkDown文書  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | <code>string</code> |  | MarkDown文書の内容 |
| [opt] | <code>Object</code> | <code>{}</code> | オプション |
| [opt.number] | <code>boolean</code> | <code>true</code> | タイトルにナンバリングするならtrue |
| [opt.link] | <code>boolean</code> | <code>false</code> | タイトルに親へのリンクを張るならtrue |
| [opt.footprint] | <code>boolean</code> | <code>true</code> | 足跡リストを作成するならtrue |
| [opt.TOC] | <code>boolean</code> | <code>true</code> | TOCを追加するならtrue |
| [opt.maxJump] | <code>number</code> | <code>10</code> | 何段階の飛び級を許すか |



# <a name="source" href="#top">プログラムソース</a>

<!-- タイトル(第一レベル)が存在しない場合、ラベルをタイトルとして設定 -->
```
/** MarkDown文書の見出しを採番、TOC/足跡リストを作成・追加
 * @param {string} arg - MarkDown文書の内容
 * @param {Object} [opt={}] - オプション
 * @param {boolean} [opt.number=true] - タイトルにナンバリングするならtrue
 * @param {boolean} [opt.link=false] - タイトルに親へのリンクを張るならtrue
 * @param {boolean} [opt.footprint=true] - 足跡リストを作成するならtrue
 * @param {boolean} [opt.TOC=true] - TOCを追加するならtrue
 * @param {number} [opt.maxJump=10] - 何段階の飛び級を許すか
 * @returns {string} 加工済のMarkDown文書
 */
function modifyMD(arg,opt={}){
  const v = {whois:'modifyMD',rv:'',step:0,seq:1,stack:[],
    root:{id:0,parent:0,number:[],children:[],level:0,title:'',content:''},
    lastObj:[], // 各レベル-1の末尾Obj
    recursive:(pId,func) => {
      const pObj = v.stack.find(x=>x.id===pId);
      func(pObj);
      pObj.children.forEach(cId=>v.recursive(cId,func));
    },
    // aタグのname属性を生成
    naming:(obj) => {return 'ac' + ('000'+obj.id).slice(-4)},
    genArticle:(lv,title)=>{
      const pObj = v.lastObj[lv-1];
      return {
        id: v.seq++,
        parent: pObj.id,
        number: [...pObj.number, pObj.children.length+1],
        children: [],
        level: lv,
        title: title,
        content: '',
      };
    },
  };
  console.log(`${v.whois} start.\nopt=${stringify(opt)}`);
  try {

    v.step = 1.1; // 既定値の設定
    opt = Object.assign({
      number: true,    // タイトルにナンバリングするならtrue
      link: false,     // タイトルに親へのリンクを張るならtrue
      footprint: true, // 足跡リストを作成するならtrue
      TOC: true,       // TOCを追加するならtrue
      maxJump: 10,     // 何段階の飛び級を許すか
    },opt);
    for( v.x in opt ){
      if( typeof opt[v.x] === 'string' ){
        if( isNaN(opt[v.x]) ){
          opt[v.x] = opt[v.x].toLowerCase() === 'true' ? true : false;
        } else {
          opt[v.x] = Number(opt[v.x]);
        }
      }
    }

    v.step = 1.2; // 章Objの用意
    v.parent = v.root;
    v.current = v.root;
    v.stack[0] = v.root;
    // style, ヘッダ・全体のタイトル部分はルートに格納
    v.lastObj = [v.root];

    v.step = 1.3; // modifyMD加工済文書なら元文書に戻す
    v.m = arg.match(/<!-- modifyMD original document ([\s\S]+?)-->/);
    if( v.m ) arg = v.m[1].trim();

    v.step = 2; // 各行の処理
    v.lines = arg.split('\n');
    for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
      v.step = 2.1;
      v.m = v.lines[v.i].match(/^(#+) +(.+?)$/);
      if( v.m === null ){
        v.step = 2.2; // タイトル行以外
        v.current.content += v.lines[v.i] + '\n';
      } else {  // タイトル行
        v.last = v.current.level; // 一つ前の章のレベルを保存

        v.step = 2.3; // 新記事を生成
        v.current = v.genArticle(v.m[1].length,v.m[2]);
        v.stack[v.current.id] = v.current;

        v.step = 2.4; // 前記事とレベルが変わった場合、親要素とlastObjを変更
        if( v.last !== v.current.level ){
          v.parent = v.lastObj[v.current.level - 1];
          // 自レベル以降の子孫をクリア
          v.lastObj.splice(v.current.level,v.lastObj.length);
        }
        v.step = 2.5; // 親要素のchildrenに登録
        v.parent.children.push(v.current.id);
        for( v.j=0 ; v.j<opt.maxJump ; v.j++ ){
          // 飛び級用にmaxJump世代先まで自要素をセット
          v.lastObj[v.current.level+v.j] = v.current;
        }
      }
    }

    v.step = 3; // 導出項目の計算
    v.recursive(v.root.id,(obj)=>{
      const w = {};
      v.step = 3.1; // aタグのname属性
      obj.name = v.naming(obj);
      v.step = 3.2; // 足跡リスト用の親・兄弟配列
      obj.ancestor = [];
      w.parent = v.stack.find(x=>x.id===obj.parent);
      obj.sibling = obj.id > 0 ? w.parent.children : []; // ルートは兄弟無し
      v.step = 3.3;
      while(w.parent.level > 0){
        obj.ancestor.unshift(w.parent.id);
        w.parent = v.stack.find(x=>x.id===w.parent.parent);
      }
    });

    v.step = 4; // 整形しながら出力
    v.rv = `<!-- modifyMD original document \n${arg}\n-->\n` // 元文書バックアップ
    + `<a name="${v.naming(v.root)}"></a>\n${v.root.content}\n`;
    if( opt.TOC ){ // TOCを追加
      v.toc = '# 目次\n\n';
      v.stack.forEach(x => {
        v.lv = Number(x.level);
        if( v.lv > 0 ){
          v.toc += ('   '.repeat(v.lv-1))
          + `1. <a href="#${x.name}">${x.title}</a>\n`  
        }
      });
      v.rv += v.toc + '\n';
    }
    v.recursive(v.root.id,(obj)=>{

      // ルートは出力しない
      if( obj.level === 0 ) return;
      const pObj = v.stack.find(x=>x.id===obj.parent);

      v.step = 4.1; // タイトル行
      v.rv += `${'#'.repeat(obj.level)} `
      // 連番文字列
      + (opt.number ? obj.number.join('.') + ' ' : '')
      // aタグ、タイトル
      + (opt.link
        ? `<a href="#${pObj.name}" name="${obj.name}">${obj.title}</a>`
        : `${obj.title}<a name="${obj.name}"></a>`) + '\n\n'

      if( opt.footprint ){
        v.step = 4.2; // 足跡リスト
        v.footprint = `[先頭](#${v.naming(v.root)})`;
        obj.ancestor.forEach(id => {
          let o = v.stack.find(x=>x.id===id);
          v.footprint += (' > ' + `[${o.title}](#${o.name})`);
        });
        v.footprint += '\n';

        v.step = 4.3; // 兄弟へのリンク
        v.menu = '';
        obj.sibling.forEach(id => {
          let o = v.stack.find(x=>x.id===id);
          v.menu += (v.menu.length > 0 ? ' | ' : '')
          + (o.id === obj.id ? o.title : `[${o.title}](#${o.name})`);
        });
        v.rv += `${v.footprint}<br>&gt; [${v.menu}]\n\n`;
      }

      v.step = 4.4; // 本文
      v.rv += obj.content;
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(e.message);
    return e;
  }
}
```


# <a name="revision_history" href="#top">改版履歴</a>

- rev.1.0.0 : 2024/04/01 初版
