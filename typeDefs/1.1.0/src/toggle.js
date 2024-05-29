function toggle(){
  const v = {whois:'toggle',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.id = event.target.getAttribute('name');
    v.obj = alasql(`select * from relation where rId=${v.id}`)[0];
    console.log(`v.obj.isOpen(${typeof v.obj.isOpen})=${v.obj.isOpen}`)
    alasql(`update relation set isOpen=${v.obj.isOpen < 0 ? 1 : -1} where rId=${v.id}`);

    v.r = disp();
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
