/** 二つの引数が同値か判断する
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 * 
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @returns {boolean|Error}
 */
function isEqual(v1,v2){
  const v = {whois:'isEqual',rv:true,step:0};
  //console.log(`${v.whois} start.`);
  try {

    v.step = 1; // データ型が異なる ⇒ 同値では無い
    v.type = whichType(v1);
    if( v.type !== whichType(v2) )
      return false;

    v.step = 2;
    switch( v.type ){
      case 'Date':
        v.step = 2.1;
        v.rv = v1.getTime() === v2.getTime();
        break;
      case 'Function': case 'Arrow':
        v.step = 2.2;
        v.rv = v1.toString() === v2.toString();
        break;
      case 'Undefined': case 'Null': case 'NaN':
        v.step = 2.3;
        v.rv = true;
        break;
      case 'Object':
        v.step = 2.4;
        new Set([...Object.keys(v1), ...Object.keys(v2)]).forEach(key => {
          v.rv = v.rv && isEqual(v1[key],v2[key]);
        });
        break;
      case 'Array':
        v.step = 2.5;
        if( v1.length !== v2.length ){
          v.rv = false;
        } else {
          for( v.i=0 ; v.i<v1.length ; v.i++ ){
            v.rv = v.rv && isEqual(v1[v.i],v2[v.i])
          }
        }
        break;
      default:
        v.step = 2.6;
        v.rv = v1 === v2;
    }

    v.step = 3; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1=${v1}\nv2=${v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}