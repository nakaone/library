function test(){
  const v = {whois:'test',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.rv = new SingleTable({
      range: 'target',
      opt: {
        primaryKey: 'D3',
        raw: [
          ['','','タイトル','','','','',''],
          ['','','','','','','',''],
          ['','','','D3','E3','','',''],
          ['','','','','','','',''],
          ['','','5','4','','','',''],
          ['','','5','6','7','8','',''],
          ['','','4','3','hoge','fuga','',''],
          ['','','','','','','',''],
          ['','','','','','','','dummy'],
          ['','','','','','','',''],
        ]
      }
    });
    
    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

//::SingleTable::$prj/core.js::
//::$lib/convertNotation/1.0.0/core.js::
//::$lib/mergeDeeply/1.1.0/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::