/**
 * @typedef {object} AnalyzePath - パス文字列から構成要素を抽出したオブジェクト
 * @prop {string} full - 引数の文字列(フルパス)
 * @prop {string} path - ファイル名を除いたパス文字列
 * @prop {string} file - ファイル名
 * @prop {string} base - 拡張子を除いたベースファイル名
 * @prop {string} suffix - 拡張子
 */
/**
 * @desc パス名文字列から構成要素を抽出
 * @param {string} arg - パス文字列
 * @returns {AnalyzePath}　構成要素を抽出したオブジェクト
 * @example
 * 
 * ```
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/",
 *   "file":"JavaScript",
 *   "base":"JavaScript",
 *   "suffix":""
 * }
 * 
 * "./analyzePath.html" ⇒ {
 *   "path":"./",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.hoge.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.hoge.html",
 *   "base":"analyzePath.hoge",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.fuga" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.fuga",
 *   "base":"analyzePath",
 *   "suffix":"fuga"
 * }
 * 
 * "https://qiita.com/analyzePath.html" ⇒ {
 *   "path":"https://qiita.com/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * ```
 */

function analyzePath(arg){
  console.log('===== analyzePath start.');
  const v = {rv:{}};
  try {

    v.m1 = arg.match(/^(.*)\/([^\/]+)$/);
    if( v.m1 ){
      v.rv.path = v.m1[1] + '/';
      v.rv.file = v.m1[2];
    } else {
      v.rv.path = '';
      v.rv.file = arg;
    }
    v.m2 = v.rv.file.match(/^(.+)\.([^\.]+?)$/);
    if( v.m2 ){
      v.rv.base = v.m2[1];
      v.rv.suffix = v.m2[2];
    } else {
      v.rv.base = v.rv.file;
      v.rv.suffix = '';
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzePath end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
