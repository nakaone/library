detail(){
  const v = {whois:this.className+'.detail',rv:null,step:0,
    item:JSON.parse(event.target.getAttribute('data-item'))};
  console.log(`${v.whois} start. item=${JSON.stringify(v.item)}`);
  try {

    v.step = 1;
    this.detailArea = this.parent.querySelector('.screen[name="detail"] .table');
    this.detailArea.innerHTML = '';
    //v.r = createElement(,this.detailArea);

    v.step = 2;
    for( v.col in v.item){        
      createElement({
        attr:{class:'th'},
        text:v.col,
      },this.detailArea);
      createElement({
        attr:{class:'td'},
        text:v.item[v.col],
      },this.detailArea);
    }

    v.step = 9; // 終了処理
    changeScreen('detail');
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
