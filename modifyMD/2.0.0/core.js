/** modifyMD: Markdown文書からTOCを作成 */
function modifyMD(arg){
  const v = {whois:'modifyMD',step:0,rv:[],marker:'<!--modifyMD:TOC-->'};
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 章題が付いている行のみ抽出
    v.title = [];
    arg.forEach(l => {
      v.m = l.match(/^(#+)\s+.+?name="(.+?)"[^>]*?>(.+?)<\/a>(.*)$/);
      if( v.m ){
        v.title.push(
          '  '.repeat(v.m[1].length-1)
          + `- [${v.m[3]}](#${v.m[2]})${v.m[4]}`
        );
      }
    });

    v.step = 9; // 終了処理
    v.rv = arg.join('\n').replace(v.marker,v.title.join('\n'));
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v,null,2)}`);
    return e;
  }
}
