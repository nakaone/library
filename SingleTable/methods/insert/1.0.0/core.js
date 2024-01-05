/** レコード(オブジェクト)を追加
 * 
 * - 複数行の一括追加も可
 * 
 * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
 * @returns {number|Error} 追加した行数
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * v.table.insert({B3:3,E3:1});
 *   // -> 一行追加
 * v.table.insert([{B3:2,E3:2},{C3:1,Col1:'hoge'}]);
 *   // -> 複数行追加
 * ```
 */
insert(records=[]){
  const v = {whois:this.className+'.insert',step:0,rv:[],
    r:[],left:99999999,right:-99999999};
  this.clog(1,v.whois+' start.');
  try {

    v.step = 1; // 引数がオブジェクトなら配列に変換
    if( !Array.isArray(records) ) records = [records];

    for( v.i=0 ; v.i<records.length ; v.i++ ){
      v.step = 2; // 挿入するレコード(オブジェクト)を配列化してthis.rawに追加
      v.arr = [];
      for( v.j=0 ; v.j<this.header.length ; v.j++ ){
        v.step = 3; // 空欄なら空文字列をセット
        v.cVal = records[v.i][this.header[v.j]] || '';

        if( v.cVal !== '' ){
          v.step = 4; // 追加する範囲を見直し
          v.left = v.left > v.j ? v.j : v.left;
          v.right = v.right < v.j ? v.j : v.right;
        }

        v.step = 5; // 一行分のデータ(配列)に項目の値を追加
        v.arr.push(v.cVal);
      }
      v.step = 6; // 一行分のデータをthis.raw/dataに追加
      this.clog(4,'l.428 v.arr=%s',JSON.stringify(v.arr));
      this.raw.push(v.arr);
      this.data.push(records[v.i]);
      v.rv.push(v.arr);
    }
    this.clog(4,"l.443 v.r=%s\nv.top=%s, v.bottom=%s, v.left=%s, v.right=%s",JSON.stringify(v.r),v.top,v.bottom,v.left,v.right)

    v.step = 7; // 更新範囲(矩形)のみv.rv -> v.rにコピー
    v.rv.forEach(x => v.r.push(x.slice(v.left,v.right-v.left+1)));

    v.step = 8; // シートに追加
    this.sheet.getRange(
      this.bottom+1,
      this.left+v.left,
      v.r.length,
      v.r[0].length
    ).setValues(v.r);

    v.step = 9; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}
