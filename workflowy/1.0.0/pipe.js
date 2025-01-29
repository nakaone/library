process.stdin.resume();
process.stdin.setEncoding('utf8');
const wf = workflowy();

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(wf.sample(lines.join('\n')));
  //console.log(workflowy(lines));
});

/** workflowy: Markdown形式でエクスポートされた内容を修正 */
function workflowy(option={}){
  const convert = require('xml-js');
  const pv = { whois: 'workflowy' };
  pv.opt = Object.assign({
    mdHeader: 2,  // body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
  },option);
  return {sample:sample};

  /** sample: [開発用]xml2json(npm)動作確認用に、opml->jsonに変換
   * @param {string} arg - opml文書
   * @returns {string} 変換結果のJSON文字列
   */
  function sample(arg){
    return JSON.stringify(JSON.parse(convert.xml2json(arg)),null,2);
  }
}