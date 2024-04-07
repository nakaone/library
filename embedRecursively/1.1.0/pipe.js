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

const log = (arg) => console.log(arg); // テスト用
/** 文書内の挿入指示文字列を指示ファイルの内容で置換
 * @param {string} arg - 処理対象テキスト
 * @param {Object.<string:string>} opt - 「::〜::」で指定されるパス名内の変数'$xxx'を置換
 * @param {number} [opt.maxDepth=10] - 最深階層(最大ループ回数)
 * @param {string} [opt.encoding='utf-8'] - 入力ファイルのエンコード
 * @returns {string}
 * 
 * @example
 * 
 * - 入力内容内の挿入指示文字列
 *   - 「::(パス)::」 ⇒ 該当部分をパスで指定されたファイルの内容で置換
 *   - 「::(タイトル)::(パス)::」 ⇒ 同上。タイトルはメモとして無視される
 *   - 「::(>タイトル)::(パス)::」 ⇒ '>'を除いたタイトルをh1として追加
 * - 読み込まれた文書は一つレベルが下がる(# -> ##)
 * 
 * #### 入力(proto.md)
 * 
 * ```
 * # 開発用メモ
 * 
 * <!--::フォルダ構成::$test/folder.md::-->
 * 
 * <!--::>プログラムソース::$test/source.txt::-->
 * ```
 * 
 * #### 被参照ファイル①：./test/folder.md
 * 
 * ```md
 * # フォルダ構成
 * - client/ : client(index.html)関係のソース
 *   - commonConfig.js : client/server共通config
 * ```
 * 
 * #### 被参照ファイル②：./test/source.js
 * 
 * ```javascript
 * function embedRecursively(arg,opt={}){
 *   const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
 * (後略)
 * ```
 * 
 * #### 実行するコマンド
 * 
 * ```bash
 * cat << EOS > ./test/source.txt
 * \`\`\`
 * `cat ./test/source.js`
 * \`\`\`
 * EOS
 * cat proto.md | awk 1 | node pipe.js -test:"./test"
 * ```
 * 
 * #### 結果
 * 
 * ```
 * # 開発用メモ
 * 
 * ## フォルダ構成
 * - client/ : client(index.html)関係のソース
 *   - commonConfig.js : client/server共通config
 * 
 * ## プログラムソース
 * 
 * \`\`\`
 * function embedRecursively(arg,opt={}){
 *   const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
 * (後略)
 * \`\`\`
 * ```
 */
function embedRecursively(arg,opt={}){
  const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
  try {

    v.step = 1.1; // 置換対象文字列の正規表現定義
    v.rex = /(<!--|\/\/|\/\*)::(.+)::.*/;
    v.step = 1.2; // 既定値の設定
    if( !opt.hasOwnProperty('maxDepth') ) opt.maxDepth = 10;
    if( !opt.hasOwnProperty('encoding') ) opt.encoding = 'utf-8';

    //log(`v.rex=${v.rex}\nmatch=${stringify(v.rv.match(v.rex))}\nv.rv=${v.rv}`)
    while( v.rv.match(v.rex) && v.level < opt.maxDepth ){
      v.step = 2; // 行単位に分割
      v.arr = v.rv.split('\n');
      for( v.i=0 ; v.i<v.arr.length ; v.i++ ){

        v.step = 3; // 「::〜::」が存在するか確認、無ければスキップ
        v.m0 = v.arr[v.i].match(v.rex);
        if( v.m0 === null ) continue;

        v.msg = `v.arr[${v.i}]=${v.arr[v.i]}\nv.m0=${stringify(v.m0)}\n`;

        v.step = 4; // 「::パス名::」か「::タイトル::パス名::」か判断
        v.m1 = v.m0[2].match(/^(.+?)::(.+)$/);
        v.msg += `v.m1=${stringify(v.m1)}\n`;
        v.title = v.m1 ? v.m1[1] : '';
        v.path = v.m1 ? v.m1[2] : v.m0[2];
        v.msg += `v.title=${v.title}\nv.path=${v.path}\n`;

        v.step = 5; // パスの中の変数を実値に置換
        v.m2 = v.path.match(/\$(.+?)\//g);
        v.msg += `v.m2=${stringify(v.m2)}\n`;
        if( v.m2 ){
          v.m2.forEach(x => {
            let y = x.replaceAll(/\$/g,'').replaceAll(/\//g,'');
            v.path = v.path.replace(x,opt[y]+'/');
            v.msg += `x=${x}, y=${y}, path=${v.path}\n`;
          });
        }

        v.step = 6; // 置換結果となる文字列をファイルから読み込み
        v.after = v.fs.readFileSync(v.path,opt.encoding);

        v.step = 7; // タイトルの文頭に'>'が有れば、置換後文字列にh1として追加
        v.m3 = v.title.match(/^>(.+)$/)
        if( v.m3 ){
          v.after = `# ${v.m3[1]}\n\n${v.after}`;
        }

        v.step = 8; // 再帰呼出の場合、その分タイトルのレベルを下げる
        v.lines = v.after.split('\n');
        for( v.j=0 ; v.j<v.lines.length ; v.j++ ){
          v.lines[v.j] = v.lines[v.j].replaceAll(/^#/g,'#'.repeat(v.level));
        }
        v.after = v.lines.join('\n');

        v.step = 9; // 「::〜::」部分を置換後文字列に置換
        v.arr[v.i] = v.arr[v.i].replace(v.m0[0],v.after);
        v.msg += `v.arr[${v.i}]=${v.arr[v.i]}`;

        //log(`${v.msg}\n`);
      }
      v.rv = v.arr.join('\n');
      v.level++;
    }

    v.step = 9; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
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
