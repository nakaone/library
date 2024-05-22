/** authMenu用の既定値をセットしてdoGASを呼び出し
 * 
async doGAS(func,...args){
  return await doGAS('authServer',this.userId,func,...args);
}
 */
async doGAS(arg,opt={type:'JSON'}){
  return await doGAS('authServer',this.userId,JSON.stringify(arg));
}

/** ナビゲーション領域の表示/非表示切り替え */
toggle(){
  const v = {whois:'authMenu.toggle'};
  console.log(`${v.whois} start.`);
  try {
    v.step = 1;
    document.querySelector(`.authMenu nav`).classList.toggle('is_active');
    v.step = 2;
    document.querySelector(`.authMenu .back`).classList.toggle('is_active');
    v.step = 3;
    document.querySelectorAll(`.authMenu .icon button span`)
    .forEach(x => x.classList.toggle('is_active'));        
    console.log(`${v.whois} normal end.`);
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
/** ブランチの下位階層メニュー表示/非表示切り替え */
showChildren(event){
  event.target.parentNode.querySelector('ul').classList.toggle('is_open');
  let m = event.target.innerText.match(/^([▶️▼])(.+)/);
  const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
  event.target.innerText = text;  
}
