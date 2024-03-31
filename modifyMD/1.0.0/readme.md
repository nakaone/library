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

# pipeでの使用方法

1. build.sh内でpipe.jsを生成
1. 挿入元ファイルに挿入指示文字列を記入
1. `node pipe.js -(変数名):(パス)`を起動

詳細はJSDocのexample参照

# <a name="jsdoc" href="#top">仕様(JSDoc)</a>



# <a name="source" href="#top">プログラムソース</a>

<!-- タイトル(第一レベル)が存在しない場合、ラベルをタイトルとして設定 -->
```
/** MarkDown文書のタイトルからTOC/足跡リストを作成・追加
 * - タイトル行にaタグ追加
 * - 足跡リストを作成
 * - TOCを作成
 * 
 * 1レベルずつ動くとは限らない
 * ①急に上がった ⇒ 問題なし
 * ②急に下がった ⇒ 直前の上位ノードの子として、上位ノード＋1レベルに変更して処理
 * 
 * opt.title='<p class="title">' -> タイトル。この直後にTOCを挿入
 * 
 * {
 *   level: 1〜6
 *   prefix: 1.2.3等の文字列
 *   title: 元々のタイトル
 *   parent: 親ノードへのローカルリンク文字列
 *   footprint: 足跡リスト
 *   content: 子ノード出現以前の本文
 *   children: 子孫ノード。再帰
 * }
 */
function modifyMD(arg,opt={}){
  const v = {whois:'modifyMD',rv:'',step:0,seq:1,noname:'(no name)',
    root:{id:0,parent:null,number:[0],children:[],level:0,title:'',content:''},
    lastObj:[], // 各レベル-1の末尾Obj
    recursive:(pObj,func) => {
      func(pObj);
      pObj.children.forEach(cObj=>v.recursive(cObj,func));
    },
    // aタグのname属性を生成
    naming:(obj) => {return 'chapter_' + obj.number.join('_');},
    genChap:(lv,title)=>{return {
      id: v.seq++,
      parent: v.parent,
      number: [...v.parent.number, v.parent.children.length],
      children: [],
      level: lv, //v.m[1].length,
      title: title, //v.m[2],
      content: '',
    };},
  };
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 既定値の設定
    opt.addNumber = opt.addNumber || true; // false;

    v.step = 1.2; // 章Objの用意
    v.root.parent = v.root;
    v.parent = v.root;
    // style, ヘッダ・全体のタイトル部分
    v.root.children.push(v.genChap(1,'先頭'));
    v.current = v.root.children[0];
    v.lastObj = [v.root, v.current];

    v.step = 2; // 各行の処理
    v.lines = arg.split('\n');
    for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
      v.step = 2.1;
      v.m = v.lines[v.i].match(/^(#+) +(.+?)$/);
      if( v.m === null ){
        v.step = 2.2; // タイトル行以外
        v.current.content += v.lines[v.i] + '\n';
      } else {  // タイトル行
        v.step = 2.3;
        v.last = v.current.level; // 一つ前の章のレベルを保存
        v.current = v.genChap(v.m[1].length,v.m[2]);

        v.step = 2.4;
        if( v.last !== v.current.level ){
          v.parent = v.lastObj[v.current.level - 1];
          // 子孫をクリア
          v.lastObj.splice(v.current.level+1,v.lastObj.length);
        }
        v.step = 2.5;
        v.parent.children.push(v.current);
        v.lastObj[v.current.level] = v.current;
      }
    }

    v.step = 3;
    v.recursive(v.root,(obj)=>{
      const w = {};
      v.step = 3.1; // aタグのname属性
      obj.name = v.naming(obj);
      v.step = 3.2; // 足跡リスト用の親・兄弟配列
      obj.ancestor = [];
      w.parent = obj.parent;
      v.step = 3.3;
      while(w.parent.level > 0){
        obj.ancestor.unshift(w.parent);
        w.parent = w.parent.parent;
      }
      v.step = 3.4;
      obj.sibling = obj.parent.children;
    });

    v.step = 4; // 整形しながら出力
    v.recursive(v.root,(obj)=>{
      // ルートは出力しない
      if( obj.level === 0 ) return;

      v.step = 4.1; // タイトル行
      v.rv += `${'#'.repeat(obj.level)} `
      // 連番文字列
      + (opt.addNumber ? obj.number.slice(1).join('.') + ' ' : '')
      // aタグ、タイトル
      + `<a href="#${obj.parent.name}" name="#${obj.name}">${obj.title}</a>\n\n`

      v.step = 4.2; // 足跡リスト
      v.footprint = '';
      obj.ancestor.forEach(o => {
        v.footprint += (v.footprint.length > 0 ? ' > ' : '')
        + `[${o.title}](#${o.name})`
      });
      v.footprint += '\n';

      v.step = 4.3; // 兄弟へのリンク
      v.menu = '';
      obj.sibling.forEach(o => {
        v.menu += (v.menu.length > 0 ? ' | ' : '')
        + (o.id === obj.id ? o.title : `[${o.title}](#${o.name})`);
      });
      v.rv += v.footprint + v.menu + '\n\n';

      v.step = 4.4; // 本文
      v.rv += obj.content;
    });

    v.step = 9; // 終了処理
    //console.log(`${v.whois} normal end.`);
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

- rev.1.0.0 : 2024/03/29 初版
