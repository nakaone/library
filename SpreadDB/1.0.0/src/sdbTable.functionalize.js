/** functionalize: where句のオブジェクト・文字列を関数化(update/deleteで使用) */
functionalize(arg){
  const v = {whois:'sdbTable.functionalize',step:0,rv:null};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {


    switch( typeof arg ){
      case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
        v.rv = arg;
        break;
      case 'object':
        v.step = 2.2;
        v.keys = Object.keys(arg);
        if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
          v.step = 2.3; // {key:〜,value:〜}形式での指定の場合
          v.rv = new Function('o',`return isEqual(o['${arg.key}'],'${arg.value}')`);
        } else {
          v.step = 2.4; // {キー項目名:値}形式での指定の場合
          v.c = [];
          for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
            v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg[v.keys[v.j]]}')`);
          }
          v.rv = new Function('o',`return (${v.c.join(' && ')})`);
        }
        break;
      default: v.step = 2.5; // primaryKeyの値指定
        v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}