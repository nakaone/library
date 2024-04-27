/** authMenu用の既定値をセットしてdoGASを呼び出し */
async doGAS(func,...args){
  return await doGAS('authServer',this.userId,func,...args);
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

/** this.homeの内容に従って画面を切り替える */ 
changeScreen(arg=null){
  console.log(this.constructor.name+`.changeScreen start.`
  + `\nthis.home=${stringify(this.home)}(${typeof this.home})`
  + `\nthis.user.auth=${this.user.auth}`);
  if( arg === null ){
    // 変更先画面が無指定 => ホーム画面を表示
    arg = typeof this.home === 'string' ? this.home : this.home[this.user.auth];
  }
  return changeScreen(arg);
}
