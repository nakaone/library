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
    r:[],left:Infinity,right:-Infinity};
  console.log(`${v.whois} start.\nrecords=${JSON.stringify(records)}`);
  try {

    v.step = 1; // 引数がオブジェクトなら配列に変換
    if( !Array.isArray(records) ) records = [records];
    // 追加対象が0件なら処理終了
    if( records.length === 0 ) return 0;

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
      this.raw.push(v.arr);
      this.data.push(records[v.i]);
      v.rv.push(v.arr);
    }

    v.step = 7; // 更新範囲(矩形)のみv.rv -> v.rにコピー
    v.rv.forEach(x => v.r.push(x.slice(v.left,v.right+1)));

    v.step = 8; // データ渡しかつシート作成指示無しを除き、シートに追加
    if( this.sheet !== null ){
      this.sheet.getRange(
        this.bottom+1,
        this.left+v.left,
        v.r.length,
        v.r[0].length
      ).setValues(v.r);
      this.bottom += v.r.length;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end. num=${v.rv.length}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nrecords=${JSON.stringify(records)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
