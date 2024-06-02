/** authMenu用の既定値をセットしてdoGASを呼び出し
 * 
 * @param {Object} arg - authServerのメソッドに渡す引数オブジェクト
 * @param {Object} opt
 * @param {string} opt.type - argの加工形式
 * - JSON : JSON.stringify(arg)
 * - encrypt : SPkeyで暗号化・署名は無し
 * - signature : SPkeyで暗号化・CSkeyで署名
async doGAS(func,...args){
  return await doGAS('authServer',this.userId,func,...args);
}
 */
async doGAS(arg,opt={type:'JSON'}){
  const v = {arg:JSON.stringify(arg)};
  if( opt.type === 'encrypt' || opt.type === 'signature' ){
    v.encrypt = opt.type === 'encrypt'
    ? cryptico.encrypt(v.arg,this.user.SPkey)
    : cryptico.encrypt(v.arg,this.user.SPkey,this.user.CSkey);
    if( v.encrypt.status === 'success' ){
      v.arg = v.encrypt.cipher;
    } else {
      throw new Error('encrypt failed.');
    }
  }
  return await doGAS('authServer',this.userId,v.arg);
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
