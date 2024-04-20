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
    if( v.m ) arg = v.m[1].replaceAll('--＞','-->').trim();

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
    v.rv = `<!-- modifyMD original document \n${arg.replaceAll('-->','--＞')}\n-->\n` // 元文書バックアップ
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
          v.footprint += (` > [${o.title}](#${o.name})`);
        });
        v.footprint += ` > ${obj.title}`;
        v.rv += `${v.footprint}\n\n`;
      }

      v.step = 4.4; // 本文
      v.rv += obj.content;
    });

    v.step = 9; // 終了処理
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
