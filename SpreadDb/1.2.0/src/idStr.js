/** idStr: オブジェクトの指定メンバの値を文字列として返す
 * @param {Object|Object[]} o - 出力対象オブジェクト
 * @param {string|string[]} m - メンバ指定文字列。オブジェクト名(ex.'o')は省略のこと
 * @returns {string}
 * 
 * @example
 * o={a:10,b:{c:'abc',d:x=>{x+10}}}, m=['a','b.d']
 * -> "a=10, b.d='x=>{x+10}'"
 */
function idStr(o,m){
  const v = {rv:[]};
  if( !Array.isArray(o) ) o = [o];
  if( !Array.isArray(m) ) m = [m];
  for( v.i=0 ; v.i<o.length ; v.i++ ){
    for( v.j=0 ; v.j<m.length ; v.j++ ){
      v.r = o[v.i];
      v.a = m[v.j].split('.');
      for( v.k=0 ; v.k<v.a.length ; v.k++ ){
        if( Object.hasOwn(v.r,v.a[v.k]) ){
          v.r = v.r[v.a[v.k]];
        } else {  // 当該プロパティが未定義の場合
          v.r = null;
          break;
        }
      }
      if( v.r !== null ) v.rv.push(`${m[v.j]}=${toString(v.r)}`);
    }
  }
  return v.rv.join(', ');
}