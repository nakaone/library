/** 関数で定義された項目を再帰的に検索し、実数化
 * @param {Object} obj - 関数を含む、実数化対象オブジェクト。例：
 * @param {Object} row - 関数に渡す、行オブジェクト(シート上の1行分のデータ)
 * @param {number} depth=0 - 呼出の階層。デバッグ用
 * @returns {Object} 実数化済のオブジェクト
 * @example
 * ```
 * realize({tag:'p',text:x=>x.title},{id:10,title:'fuga'})
 * ⇒ {tag:'p',text:'fuga'}
 * ```
 */
realize(obj,row,depth=0){
  const v = {whois:this.className+'.realize',rv:{},step:0};
  //console.log(`${v.whois} start. depth=${depth}\nobj=${stringify(obj)}\nrow=${stringify(row)}`);
  try {

    for( v.prop in obj ){
      v.step = v.prop;
      switch( whichType(obj[v.prop]) ){
        case 'Object':
          v.rv[v.prop] = this.realize(obj[v.prop],row,depth+1);
          break;
        case 'Function': case 'Arrow':
          v.rv[v.prop] = obj[v.prop](row);
          break;
        case 'Array':
          v.rv[v.prop] = [];
          obj[v.prop].forEach(x => v.rv[v.prop].push(this.realize(x,row,depth+1)));
          break;
        default:
          v.rv[v.prop] = obj[v.prop];
      }
    }

    v.step = 9; // 終了処理
    //console.log(`${v.whois} normal end.\nrv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nobj=${stringify(obj)}\nrow=${stringify(row)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
