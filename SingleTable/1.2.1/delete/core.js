/** 条件に該当するレコード(オブジェクト)を削除
  * @param {Object} [opt={}] - オプション
  * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
  * @returns {Object|Error} 削除されたthis.data行のオブジェクト
  * 
  * @example
  * 
  * ```
  * v.table = new SingleTable('test',{top:3});
  * v.table.delete({where:o=>o.Col1&&o.Col1==7});
  *   // -> Col1==7の行を削除。判定用変数(Col1)の存否、要確認
  * v.table.delete({where:o=>o.val&&o.val==5});
  *   // -> val==5の行を全て削除。
  * ```
  */
/* 将来的に対応を検討する項目
  - 引数をwhereのみとし、Object->Functionに変更
  - "top 3"等、先頭・末尾n行の削除
*/
delete(opt={}){
  const v = {whois:this.className+'.delete',step:0,rv:[]};
  console.log(`${v.whois} start.\nopt.where=${opt.where.toString()}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = () => true;

    v.step = 2; // 下の行から判定し、削除による行ズレの影響を回避
    for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
      v.step = 3; // 削除対象(空Objではない and 対象判定結果がtrue)
      if( Object.keys(this.data[v.i]).length === 0
        || !opt.where(this.data[v.i]) ) continue;
      v.step = 4; // this.dataからの削除
      v.rv.push(this.data.splice(v.i,1)[0]);
      v.step = 5; // this.rawからの削除
      this.raw.splice(v.i,1)[0];
      v.step = 6; // (シートが存在すれば)シートからの削除
      if( this.sheet === null ) continue;
      v.rowNum = this.top + v.i + 1;
      // 1シート複数テーブルの場合を考慮し、headerの列範囲のみ削除して上にシフト
      this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
      .deleteCells(SpreadsheetApp.Dimension.ROWS);
    }

    v.step = 7; // 終了処理
    console.log(`${v.whois} normal end. num=${v.rv.length}`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}