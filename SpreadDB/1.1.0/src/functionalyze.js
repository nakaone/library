/** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
 * @param {Object|function|string} arg - 関数化するオブジェクトor文字列
 * @returns {function}
 *
 * - update/delete他、引数でwhereを渡されるメソッドで使用
 * - 引数のデータ型により以下のように処理分岐
 *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
 *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
 *   - string
 *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
 *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
 */
function functionalyze(arg){
  const v = {whois:`${pv.whois}.functionalyze`,step:0,rv:null};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    switch( typeof arg ){
      case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
        v.rv = arg;
        break;
      case 'object': v.step = 2.2;
        v.keys = Object.keys(arg);
        if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
          v.step = 2.3; // {key:〜,value:〜}形式での指定の場合
          v.rv = new Function('o',`return isEqual(o['${arg.key}'],'${arg.value}')`);
        } else {
          v.step = 2.4; // {キー項目名:値}形式での指定の場合
          v.c = [];
          for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
            v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg[v.keys[v.j]]}')`);
          }
          v.rv = new Function('o',`return (${v.c.join(' && ')})`);
        }
        break;
      case 'string': v.step = 2.3;
        v.fx = arg.match(/^function\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
        v.ax = arg.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
        if( v.fx || v.ax ){
          v.step = 2.31; // function文字列
          v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g,''); // 引数部分
          v.a = v.a.length > 0 ? v.a.split(',') : [];
          v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g,' ').trim(); // 論理部分
          v.rv = new Function(...v.a, v.b);
        } else {
          v.step = 2.32; // 関数ではない文字列はprimaryKeyの値指定と看做す
          v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
        }
        break;
      default: throw new Error(`引数の型が不適切です`);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}