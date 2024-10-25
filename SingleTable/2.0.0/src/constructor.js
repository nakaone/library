constructor(arg){
  const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}