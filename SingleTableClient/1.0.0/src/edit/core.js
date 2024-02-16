edit(){
  const v = {whois:this.className+'.edit',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1;
    this.editArea = this.parent.querySelector('.screen[name="edit"] .table');
    this.editArea.innerHTML = '';

    v.step = 2;
    for( v.col in v.item){        
      createElement({
        attr:{class:'th'},
        text:v.col,
      },this.editArea);
      createElement({
        attr:{class:'td'},
        text:v.item[v.col],
      },this.editArea);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
