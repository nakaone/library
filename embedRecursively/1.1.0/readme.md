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

<p class="title"><a name="top">embedRecursively</a></p>

# pipeでの使用方法

1. build.sh内でpipe.jsを生成
1. 挿入元ファイルに挿入指示文字列を記入
1. `node pipe.js -(変数名):(パス)`を起動

詳細はJSDocのexample参照

# <a name="jsdoc" href="#top">仕様(JSDoc)</a>

<a name="embedRecursively"></a>

## embedRecursively(arg, opt) ⇒ <code>string</code>
文書内の挿入指示文字列を指示ファイルの内容で置換

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | <code>string</code> |  | 処理対象テキスト |
| opt | <code>Object.&lt;string:string&gt;</code> |  | 「::〜::」で指定されるパス名内の変数'$xxx'を置換 |
| [opt.maxDepth] | <code>number</code> | <code>10</code> | 最深階層(最大ループ回数) |
| [opt.encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 入力ファイルのエンコード |

**Example**  
- 入力内容内の挿入指示文字列
  - 「::(パス)::」 ⇒ 該当部分をパスで指定されたファイルの内容で置換
  - 「::(タイトル)::(パス)::」 ⇒ 同上。タイトルはメモとして無視される
  - 「::(>タイトル)::(パス)::」 ⇒ '>'を除いたタイトルをh1として追加
- 読み込まれた文書は一つレベルが下がる(# -> ##)

#### 入力(proto.md)

```
# 開発用メモ

<!--::フォルダ構成::$test/folder.md::-->

<!--::>プログラムソース::$test/source.txt::-->
```

#### 被参照ファイル①：./test/folder.md

```md
# フォルダ構成
- client/ : client(index.html)関係のソース
  - commonConfig.js : client/server共通config
```

#### 被参照ファイル②：./test/source.js

```javascript
function embedRecursively(arg,opt={}){
  const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
(後略)
```

#### 実行するコマンド

```bash
cat << EOS > ./test/source.txt
\`\`\`
`cat ./test/source.js`
\`\`\`
EOS
cat proto.md | awk 1 | node pipe.js -test:"./test"
```

#### 結果

```
# 開発用メモ

## フォルダ構成
- client/ : client(index.html)関係のソース
  - commonConfig.js : client/server共通config

## プログラムソース

\`\`\`
function embedRecursively(arg,opt={}){
  const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
(後略)
\`\`\`
```


# <a name="source" href="#top">プログラムソース</a>

<!-- タイトル(第一レベル)が存在しない場合、ラベルをタイトルとして設定 -->
```
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
    + `\narg=${stringify(arg)}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
```


# <a name="revision_history" href="#top">改版履歴</a>

- rev.1.0.0 : 2024/03/29 初版
