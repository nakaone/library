process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(embedRecursively(lines.join('\n'),analyzeArg().opt));
});

/** 文書内の挿入指示文字列を指示ファイルの内容で置換(パス指定では変数使用可)
 * - [仕様書](https://workflowy.com/#/e2875147a15f)
 * @param {string} content - 処理対象テキスト
 * @param {Object.<string:string>} opt - 「::〜::」で指定されるパス名内の変数'$xxx'を置換
 * @param {number} [opt.maxDepth=10] - 最深階層(無限ループ抑止)
 * @param {string} [opt.encoding='utf-8'] - 入力ファイルのエンコード
 * @param {number} [opt.depth=0] - 現在処理中の文書の階層
 * @param {number} [opt.parentLevel=0] - 挿入指定文字列が置かれた位置の親要素のレベル
 * @param {boolean} [opt.useRoot=false] - 子文書ルート使用指定<br>
 *   - true : 子文書のルート要素を使用する<br>
 *   - false : 子文書のルート要素は使用しない(呼出元の要素をルート要素として扱う)
 * @returns {string}
 */
function embedRecursively(content,opt={}){
  const v = {whois:'embedRecursively',rv:'',step:0,fs:require('fs'),
    titleEx: /^(#+)\s+(.+)$/, // タイトル行の正規表現定義
    repEx: /(<!--|\/\/|\/\*)::(.+)::.*/,  // 置換対象文字列の正規表現定義
  };
  try {

    v.step = 1; // 事前準備
    v.step = 1.1; // 引数について既定値の設定
    if( !opt.hasOwnProperty('maxDepth') ) opt.maxDepth = 10;
    if( !opt.hasOwnProperty('encoding') ) opt.encoding = 'utf-8';
    if( !opt.hasOwnProperty('depth') ) opt.depth = 0;
    if( !opt.hasOwnProperty('parentLevel') ) opt.parentLevel = 0;
    if( !opt.hasOwnProperty('useRoot') ) opt.useRoot = false;

    v.step = 1.2; // 階層を判定、一定以上なら処理中断
    if( opt.depth > opt.maxDepth ) throw new Error('maxDepth over');

    v.step = 1.3;
    v.lines = content.split('\n'); // 内容文字列を行毎に分離

    v.step = 1.4; // ルート要素の有無、レベルを判定
    v.hasRoot = false; // ルート要素の有無
    v.topLevel = 0; // 子文書内の最高章レベル。0:タイトル行が存在しない
    v.map = []; // レベル毎にタイトル行の数を保存
    for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
      v.m = v.lines[v.i].match(v.titleEx);
      if( v.m ){
        v.lv = v.m[1].length;
        v.map[v.lv] = (typeof v.map[v.lv] === 'undefined' ? 1 : (v.map[v.lv] + 1));
      }
    }
    // レベル毎のタイトル行の数をチェック、トップレベル且つ出現回数1ならルート要素
    for( v.i=1 ; v.i<v.map.length ; v.i++ ){
      if( typeof v.map[v.i] === 'number' ){
        v.topLevel = v.i;
        v.hasRoot = v.map[v.topLevel] === 1;
        break;
      }
    }

    for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
      v.line = v.lines[v.i];

      v.step = 2; // タイトル行の判定・処理
      v.title = v.line.match(v.titleEx);
      if( v.title ){
        v.level = opt.parentLevel + v.title[1].length - v.topLevel + 1;
        /** 以下の全ての条件を満たす場合、タイトル行は出力しない
         * 1. 子文書である(opt.depth > 0)
         * 1. ルート要素は使用しない指定がされている(opt.useRoot === false)
         * 1. ルート要素を持つ文書である(v.hasRoot === true)
         * 1. タイトル行のレベルがトップレベル(v.title[1].length === v.topLevel)
         */
        if(!(opt.depth>0 && !opt.useRoot && v.hasRoot && v.title[1].length===v.topLevel)){
          v.rv += '#'.repeat(v.level) + ' ' + v.title[2] + '\n';
        }
      } else {
        v.step = 3; // 挿入指定行の判定・処理
        v.embed = v.line.match(v.repEx);
        if( v.embed ){
          v.step = 3.1; // 再帰呼出用optの作成
          v.opt = Object.assign({},opt,{
            depth:opt.depth+1,
            parentLevel:v.level,
            useRoot:false
          });
          v.step = 3.2; // 「::(パス)::」か「::(メモ[+])::(パス)::」形式か判定
          v.m1 = v.embed[2].match(/^(.+?)::(.+)$/);
          if( v.m1 ){
            v.step = 3.21; //「::(メモ[+])::(パス)::」形式
            v.path = v.m1[2];
            v.opt.useRoot = v.m1[1].match(/\+$/) ? true : false;
          } else {
            v.step = 3.22; // ファイルパスのみの指定
            v.path = v.embed[2];
          }
          v.step = 3.3; // パスの中の変数を実値に置換
          v.m2 = v.path.match(/\$(.+?)\//g);
          if( v.m2 ){
            v.m2.forEach(x => {
              let y = x.replaceAll(/\$/g,'').replaceAll(/\//g,'');
              v.path = v.path.replace(x,opt[y]+'/');
            });
          }
          v.step = 3.4; // 被挿入文書の読み込み
          v.child = v.fs.readFileSync(v.path,opt.encoding);
          v.step = 3.5; // 被挿入文書を再帰呼出
          v.r = embedRecursively(v.child, v.opt);
          if( v.r instanceof Error ) throw v.r;
          v.rv += v.r + '\n';
        } else {
          v.step = 4; // 非タイトル・非挿入指定行
          v.rv += v.line + '\n';
        }
      }
    }

    v.step = 9; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\npath=${v.path}\nline=${v.line}\nopt=${stringify(opt)}`;
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
