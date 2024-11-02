/** objectizeNote: 項目定義メモをオブジェクト化
 * @param arg {string} 項目定義メモの文字列
 * @returns {Object} 項目定義オブジェクト
 */
objectizeNote(arg){
  const v = {whois:this.constructor.name+'.objectizeNote',step:0,rv:[]};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 1; // JSON化する際、クォーテーションで囲む必要が無い項目のマップを作成
    v.quote = {};
    this.colsDef.forEach(x => {
      v.type = (x.type || '').toLowerCase();
      v.quote[x.name] = (v.type === 'number' || v.type === 'boolean') ? false : true;
    })

    v.step = 2; // 改行で分割、一行毎にチェック
    arg.split('\n').forEach(line => {
      // コメントの削除
      v.l = line.indexOf('//');
      if( v.l >= 0 ) line = line.slice(0,v.l);

      // 「項目名：値」形式の行はメンバとして追加
      v.m = line.trim().match(/^["']?([a-zA-Z0-9_\$]+)["']?\s*:\s*["']?(.+)["']?$/);
      if( v.m ){
        v.rv.push(`"${v.m[1]}":`+(v.quote[v.m[1]] ? `"${v.m[2]}"` : v.m[2]))
      }
    });

    v.step = 3; // オブジェクト化
    if( v.rv.length === 0 ) throw new Error(`invalid column definition`);
    v.rv = JSON.parse(`{${v.rv.join(',')}}`);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
