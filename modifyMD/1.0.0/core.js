/** MarkDown文書のタイトルからTOC/足跡リストを作成・追加
 * - タイトル行にaタグ追加
 * - 足跡リストを作成
 * - TOCを作成
 * 
 */
function modifyMD(arg){
  const v = {whois:'modifyMD',rv:null,step:0,title:[]};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1;
    v.step = 2;
    v.lines = arg.split('\n');
    for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
      if( !v.lines[v.i].match(/^#/) ) continue;
      v.title.push(v.lines[v.i]);
    }

    v.step = 9; // 終了処理
    v.rv = v.title.join('\n');
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
