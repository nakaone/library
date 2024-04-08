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
 *   - 「::(タイトル)(指示文字列)::(パス)::」 ⇒ 指示文字列の内容は以下
 *     - 'o'/'x' : 被挿入文書のルート要素が存在した場合、それを残置するか。<br>
 *       'o':残置、'x':除去(既定値)
 *     - [+|-][number] : シフトするレベル。既定値'+0'(+0と-0は同値)<br>
 *       ex. +1 ⇒ 一つレベルを下げる(# -> ##, ## -> ###)
 * 
 * 「被挿入文書のルート要素」とは、被挿入文書の最高レベルの章題が単一だった場合、その章題。
 * 複数だった場合はルート要素とは看做さない。
 * 
 * #### 入力(proto.md)
 * 
 * ```
 * # 開発用メモ
 * 
 * ## フォルダ構成
 * 
 * <!--::フォルダ構成x+1::$test/folder.md::-->
 * 
 * <!--::>プログラムソース::$test/source.txt::-->
 * ```
 * 
 * #### 被参照ファイル①：./test/folder.md
 * 
 * ```md
 * # フォルダの構造  ※挿入先文書は「フォルダ構成」
 * 
 * ## クライアント側
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
 * ## フォルダ構成  ※被挿入文書のタイトル(ルート要素)は除去
 * 
 * ### クライアント側  ※レベルが ## -> ### (+1)
 * 
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
  console.log(`${v.whois} start.\nopt=${stringify(opt)}`);
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
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nopt=${stringify(opt)}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
