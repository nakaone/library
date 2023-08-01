
function qrcode(selector,opt){
  const v = {rv:null};
  console.log('qrcode start.');
  try {
    v.element = document.querySelector(selector);
    v.element.innerHTML = '';
    v.opt = {
      text: '(undefined)',
      width: 200,
      height: 200,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel : QRCode.CorrectLevel.H,
    };
    if( typeof opt === 'string' ){
      v.opt.text = opt;
    } else {
      v.opt = Object.assign(v.opt,opt);
    }
    console.log(v.opt);
    const qr = new QRCode(v.element,v.opt);
    console.log('qrcode end.');
    return v.rv;
  } catch(e){
    v.rv.stack = e.stack; return v.rv;
  }
}