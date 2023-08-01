/* コアScript */
/** 指定されたDIV要素にQRコードを作成
 * 
 * 作成時オプションについては[公式](https://github.com/davidshimjs/qrcodejs)参照。
 * 
 * @param {string} selector - QRコード作成先Div要素のCSSセレクタ
 * @param {Object|string} opt - 作成時オプション。文字列の場合、QRコードの内容
 */
function qrcode(selector,opt){
  const v = {rv:null};
  console.log('qrcode start.');
  try {
    // 前回の結果をクリア
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

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('qrcode end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    //if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
function analyzeArg(){
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    console.error('===== analyzeArg abnormal end.\n',e);
    if( typeof window !== 'undefined' ) alert(e.stack);
    v.rv.stack = e.stack; return v.rv;
  }
}
/* コンソール実行用 */
const fs = require('fs'); // ファイル操作
function onConsole(){
  console.log('qrcode.onConsole start.');
  const v = {rv:null};
  try {

    // 事前処理：引数チェック、既定値の設定
    v.argv = analyzeArg();
    console.log(v.argv)
    if(v.argv.hasOwnProperty('stack')) throw v.argv;

    v.readFile = fs.readFileSync(v.argv.opt.i,'utf-8').trim();
    v.rv = qrcode(v.readFile);
    v.writeFile = fs.writeFileSync(v.argv.opt.o,v.rv,'utf-8');  

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('qrcode.onConsole end.');
  } catch(e){
    console.error('qrcode.onConsole abnormal end.',e);
  }
}
onConsole();
