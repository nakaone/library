/** 
 * node querySelector.jsとして、コンソールから実行する形式
 * 
 * @example
 * 
 * node querySelector.js
 *   -i:入力ファイル名
 *   -o:出力ファイル名
 *   -f:出力形式
 *      text -> 指定CSSセレクタ文字列に適合した全要素のinnerTextを結合して出力
 *      html -> 同innerHTMLを結合して出力(既定値)
 *      content -> 同textContentを結合して出力
 *   aaa bbb ... : CSSセレクタ文字列
 *   -f: 'text'(タグ出力無し、内部テキストのみ出力。既定値)
 *       'html'(タグ出力有り。innerHTMLとして使用可)
 *       'json'(JSONとして出力)
 */

const v = {whois:'querySelector',rv:'',step:0,
  querySelector: require('./core.cjs'),
  analyzeArg: require('../../analyzeArg/1.1.0/core.cjs'),
  fs: require('fs'),
};

v.arg = v.analyzeArg();
v.arg.f = v.arg.f || 'html';

// 入力ファイルの内容を取得
v.content = v.fs.readFileSync(v.arg.opt.i,'utf-8');

v.r = v.querySelector(v.content,v.arg.val);
v.r.forEach(x => v.rv+=x[v.arg.f]);

v.fs.writeFileSync(v.arg.opt.o,v.rv,'utf-8');