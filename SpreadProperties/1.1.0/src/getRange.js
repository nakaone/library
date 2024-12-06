/** getRange: 現在選択中の範囲の属性情報を取得
 * @returns {Object}
 */
getRange(){  // いまここ作成中
  const v = {whois:this.constructor.name+'.saveSheet',step:0,rv:null};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
