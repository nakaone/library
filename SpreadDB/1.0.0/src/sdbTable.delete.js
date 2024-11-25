/** delete: 領域から指定行を物理削除
 * @param {Object|Function|any} where=[] - 対象レコードの判定条件
 * @returns {sdbLog[]}
 *
 * - where句の指定方法
 *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
 *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
 *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
 */
delete(where){
  const v = {whois:'sdbTable.delete',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
  console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
  try {

    // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
    // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する

    v.step = 1.1; // 事前準備 : 引数を配列化
    if( !Array.isArray(where)) where = [where];

    v.step = 1.2; // 該当レコードかの判別用関数を作成
    for( v.i=0 ; v.i<where.length ; v.i++ ){
      where[v.i] = this.functionalize(where[v.i]);
      if( where[v.i] instanceof Error ) throw where[v.i];
    }
    v.step = 1.3; // 引数argのいずれかに該当する場合trueを返す関数を作成
    v.cond = o => {let rv = false;where.forEach(w => {if(w(o)) rv=true});return rv};

    v.step = 2; // 対象レコードか一件ずつチェック
    for( v.i=this.values.length-1 ; v.i>=0 ; v.i-- ){

      v.step = 2.1; // 対象外判定ならスキップ
      if( v.cond(this.values[v.i]) === false ) continue;

      v.step = 2.2; // 更新履歴オブジェクトを作成
      v.logObj = new sdbLog({account:this.account,range:this.name,
        action:'delete',argument:v.argument,before:this.values[v.i]});
      v.logObj.diff = v.logObj.before;
      v.log.push(v.logObj);

      v.step = 2.3; // 削除レコードのunique項目をthis.schema.uniqueから削除
      // this.schema.auto_incrementは削除の必要性が薄いので無視
      // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
      for( v.unique in this.schema.unique ){
        if( this.values[v.i][v.unique] ){
          v.idx = this.schema.unique[v.unique].indexOf(this.values[v.i][v.unique]);
          if( v.idx >= 0 ) this.schema.unique[v.unique].splice(v.idx,1);
        }
      }

      v.step = 2.4; // this.valuesから削除
      this.values.splice(v.i,1);

      v.step = 2.5; // シートのセルを削除
      v.range = this.sheet.getRange(
        this.top + v.i + 1,  // +1(添字->行番号)
        this.left,
        1,
        this.right - this.left + 1,
      );
      v.range.deleteCells(SpreadsheetApp.Dimension.ROWS);

      v.step = 2.6; // this.bottomを書き換え
      this.bottom = this.bottom - 1;

    }

    v.step = 3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
    if( this.log !== null && v.log.length > 0 ){
      v.r = this.log.append(v.log);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    v.rv = v.log;
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}