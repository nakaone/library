/** 文書内の挿入指示文字列を指示ファイルの内容で置換(パス指定では変数使用可)
 * - [仕様書](https://workflowy.com/#/e2875147a15f)
 * @param {string} content - 処理対象テキスト
 * @param {Object.<string:string>} opt - 「::〜::」で指定されるパス名内の変数'$xxx'を置換
 * @param {number} [opt.maxDepth=10] - 最深階層(無限ループ抑止)
 * @param {string} [opt.encoding='utf-8'] - 入力ファイルのエンコード
 * @param {number} [opt.depth=0] - 現在処理中の文書の階層
 * @param {number} [opt.parentLevel=0] - 挿入指定文字列が置かれた位置の親要素のレベル
 * @param {boolean} [opt.useRoot=false] - 子文書ルート使用指定<br>
 * @param {string} [opt.prefix=''] - 行頭の空白文字列(インデント)
 *   - true : 子文書のルート要素を使用する<br>
 *   - false : 子文書のルート要素は使用しない(呼出元の要素をルート要素として扱う)
 * @returns {string}
 */
function embedRecursively(content,opt={}){
  const v = {whois:'embedRecursively',rv:'',step:0,fs:require('fs'),
    titleEx: /^(#+)\s+(.+)$/, // タイトル行の正規表現定義
    repEx: /^(.*?)(<!--|\/\/|\/\*)::(.+)::.*/,  // 置換対象文字列の正規表現定義
  };
  try {

    v.step = 1; // 事前準備
    v.step = 1.1; // 引数について既定値の設定
    if( !opt.hasOwnProperty('maxDepth') ) opt.maxDepth = 10;
    if( !opt.hasOwnProperty('encoding') ) opt.encoding = 'utf-8';
    if( !opt.hasOwnProperty('depth') ) opt.depth = 0;
    if( !opt.hasOwnProperty('parentLevel') ) opt.parentLevel = 0;
    if( !opt.hasOwnProperty('useRoot') ) opt.useRoot = false;
    if( !opt.hasOwnProperty('prefix') ) opt.prefix = '';

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
            useRoot:false,
            prefix: (opt.prefix || '') + v.embed[1],
          });
          v.step = 3.2; // 「::(パス)::」か「::(メモ[+])::(パス)::」形式か判定
          v.m1 = v.embed[3].match(/^(.+?)::(.+)$/);
          if( v.m1 ){
            v.step = 3.21; //「::(メモ[+])::(パス)::」形式
            v.path = v.m1[2];
            v.opt.useRoot = v.m1[1].match(/\+$/) ? true : false;
          } else {
            v.step = 3.22; // ファイルパスのみの指定
            v.path = v.embed[3];
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
          v.rv += opt.prefix + v.r;
        } else {
          v.step = 4; // 非タイトル・非挿入指定行
          v.rv += (opt.prefix + v.line).trimEnd() + '\n';
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
