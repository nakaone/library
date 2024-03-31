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

const log = (arg) => console.log(arg); // テスト用
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
/**
 * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 *
 * @example
 *
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 *
 * <caution>注意</caution>
 *
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 *
 * @param {void} - なし
 * @returns {AnalyzeArg} 分析結果のオブジェクト
 */
function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
