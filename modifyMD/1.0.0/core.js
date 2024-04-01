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
  const v = {whois:'modifyMD',rv:'',step:0,seq:1,stack:[],
    root:{id:0,parent:0,number:[],children:[],level:0,title:'',content:''},
    lastObj:[], // 各レベル-1の末尾Obj
    recursive:(pId,func) => {
      const pObj = v.stack.find(x=>x.id===pId);
      func(pObj);
      pObj.children.forEach(cId=>v.recursive(cId,func));
    },
    // aタグのname属性を生成
    //naming:(obj) => {return 'chapter_' + obj.number.join('_');},
    naming:(obj) => {return 'article' + ('00000'+obj.id).slice(-6)},
    genChap:(lv,title)=>{
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
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 既定値の設定
    opt.addNumber = opt.addNumber || true; // false;

    v.step = 1.2; // 章Objの用意
    v.parent = v.root;
    v.current = v.root;
    v.stack[0] = v.root;
    // style, ヘッダ・全体のタイトル部分はルートに格納
    v.lastObj = [v.root];

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
        v.stack[v.current.id] = v.current;

        v.step = 2.4;
        if( v.last !== v.current.level ){
          v.parent = v.lastObj[v.current.level - 1];
          // 子孫をクリア
          v.lastObj.splice(v.current.level+1,v.lastObj.length);
        }
        v.step = 2.5;
        v.parent.children.push(v.current.id);
        v.lastObj[v.current.level] = v.current;
      }
    }

    v.step = 3; // 導出項目の計算
    v.recursive(v.root.id,(obj)=>{
      //console.log(`l.82 obj=${stringify(obj)}`);
      const w = {};
      v.step = 3.1; // aタグのname属性
      obj.name = v.naming(obj);
      v.step = 3.2; // 足跡リスト用の親・兄弟配列
      obj.ancestor = [];
      w.parent = v.stack.find(x=>x.id===obj.parent);
      obj.sibling = obj.id > 0 ? w.parent.children : []; // ルートは兄弟無し
      v.step = 3.3;
      while(w.parent.level > 0){
        obj.ancestor.unshift(w.parent);
        w.parent = v.stack.find(x=>x.id===w.parent.parent);
      }
    });
    console.log(`l.98 v.stack=${stringify(v.stack)}`);

    v.step = 4; // 整形しながら出力
    v.rv = `<a name="${v.naming(v.root)}"></a>\n${v.root.content}\n`;
    v.recursive(v.root.id,(obj)=>{
      //console.log(`l.103 obj=${stringify(obj)}`);

      // ルートは出力しない
      if( obj.level === 0 ) return;

      v.step = 4.1; // タイトル行
      v.rv += `${'#'.repeat(obj.level)} `
      // 連番文字列
      + (opt.addNumber ? obj.number.join('.') + ' ' : '')
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
