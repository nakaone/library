/** 関数他を含め、オブジェクトを文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 * 
 * @param {Object} obj - 文字列化対象オブジェクト
 * @returns {string}
 */
function stringify(obj){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {};
    switch( whichType(arg) ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = arg.toString(); break;
      case 'BigInt':
        w.rv = parseInt(arg); break;
      case 'Undefined':
        w.rv = 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(obj));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
