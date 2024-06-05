function toggle(){
  const v = {whois:'toggle',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.id = event.target.getAttribute('name');
    v.obj = alasql(`select * from master where rowNo=${v.id}`)[0];
    alasql(`update master set isOpen=${v.obj.isOpen < 0 ? 1 : -1} where rowNo=${v.id}`);

    v.r = disp();
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
