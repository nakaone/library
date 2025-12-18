const dev = devTools();
let cnt = 0;
const t03 = () => {
  const v = {whois:'t03',arg:null,rv:null};
  dev.start(v);
  try {
    dev.step(3.1);
    cnt++;
    if(cnt>3) throw new Error('cnt>3');
    dev.end();
  } catch(e) { return dev.error(e); }
}
const t02 = () => {
  const v = {whois:'t02',arg:null,rv:null};
  dev.start(v);
  try {
    v.hoge = {fuga:[1,true]};
    dev.step(1,v.hoge);
    for( v.i=0 ; v.i<2 ; v.i++ ){
      if((v.rv = t03()) instanceof Error ) throw v.rv;
    };
    dev.end();
  } catch(e) { return dev.error(e); }
}
const t01 = (x) => {
  const v = {whois:'t01',arg:{x},rv:null};
  // vのメンバ：whois, arg, rv
  dev.start(v);
  try {
    dev.step(1.1,v);
    for( v.i=0 ; v.i<2 ; v.i++ ){
      if((v.rv = t02()) instanceof Error ) throw v.rv;
    };
    //if(Date.now()>0) throw new Error('error test');
    dev.end();
    return v.rv;
  } catch(e) { return dev.error(e); }
}
t01('abc');