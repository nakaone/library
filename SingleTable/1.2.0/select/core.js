/** 条件に該当するレコード(オブジェクト)を抽出
  * @param {Object} [opt={}] - オプション
  * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
  * @param {string[][]} [opt.orderBy=[]] - 並べ替えのキーと昇順/降順指定
  *  [['key1'(,'desc')],['key2'(,'desc')],...]
  * @returns {Array.Object.<string, any>|Error}
  * 
  * @example
  * 
  * ```
  * v.table = new SingleTable('test',{top:3});
  * v.r = v.table.select({
  *   where: x => x.B3 && 1<x.B3 && x.B3<9,
  *   orderBy:[['B3'],['C3','desc']]
  * });
  * console.log(JSON.stringify(v.r));
  * // -> [
  *   {"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
  *   {"B3":5,"C3":6,"Col1":7,"E3":8},
  *   {"B3":5,"C3":4}
  * ]
  * ```
  * 
  * 「Col1に'g'が含まれる」という場合
  * ```
  * where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1}
  * ```
  */
select(opt={}){
  const v = {whois:this.className+'.select',rv:[],step:0};
  console.log(`${v.whois} start.`); //\nopt.where=${opt.where.toString()}\nopt.orderBy=${JSON.stringify(opt.orderBy)}`);
  try {

    v.step = 1; // 既定値の設定
    //if( !opt.hasOwnProperty('where') )
    //  opt.where = () => true;
    if( opt.hasOwnProperty('where') ){
      if( typeof opt.where === 'string' )
        opt.where = new Function(opt.where);
    } else {
      opt.where = () => true;
    }
    if( !opt.hasOwnProperty('orderBy') )
      opt.orderBy = [];
    console.log(`l.478 opt.where [${typeof opt.where}] = '${opt.where.toString()}'`)

    v.step = 2; // 対象となるレコードを抽出
    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      if( Object.keys(this.data[v.i]).length > 0 // 空Objではない
          && opt.where(this.data[v.i]) ) // 対象判定結果がtrue
        v.rv.push(this.data[v.i]);
    }

    v.step = 3; // 並べ替え
    v.rv.sort((a,b) => {
      for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
        [v.p, v.q] = opt.orderBy[v.i][1]
        && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
        if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
        if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
      }
      return 0;
    });

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end. num=${v.rv.length}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nopt=${JSON.stringify(opt)}`;  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }

}
