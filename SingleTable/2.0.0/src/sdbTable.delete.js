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
  const v = {whois:'sdbTable.delete',step:0,rv:[],log:[],
    target:[],  // 削除対象行番号の配列。ex. [1,3,10]
    header: this.schema.cols.map(x => x.name), // 項目一覧
  };
  console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
  try {

    // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
    // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
    
    v.step = 1; // 事前準備 : 引数を配列化
    if( !Array.isArray(where)) where = [where];

    // ------------------------------------------------
    // 削除対象行の添字(行番号)リストをv.targetに作成
    // ------------------------------------------------
    for( v.i=0 ; v.i<where.length ; v.i++ ){
    
      v.step = 2; // whereがオブジェクトまたは文字列指定なら関数化
      v.where = typeof where[v.i] === 'function' ? where[v.i]
      : new Function('o','return isEqual(' + ( typeof where[v.i] === 'object'
        ? `o['${where[v.i].key}'],'${where[v.i].value}'`
        : `o['${this.schema.primaryKey}'],'${where[v.i]}'`
      ) + ');');

      v.step = 3; // 対象レコードか一件ずつチェック
      for( v.j=0 ; v.j<this.values.length ; v.j++ ){

        v.step = 3.1; // 対象外判定ならスキップ
        if( v.where(this.values[v.j]) === false ) continue;

        v.step = 3.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:this.account,range:this.name,
          before:JSON.parse(JSON.stringify(this.values[v.j]))});
        v.logObj.diff = v.logObj.before;

        v.step = 3.3; // 削除レコードのunique項目をthis.schema.uniqueから削除
        // this.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in this.schema.unique ){
          if( this.values[v.j][v.unique] ){
            v.idx = this.schema.unique[v.unique].indexOf(this.values[v.j][v.unique]);
            if( v.idx >= 0 ) this.schema.unique[v.unique].splice(v.idx,1);
          }
        }
  
        v.step = 3.4; // ログ出力対象に保存、削除対象添字リストに追加
        v.log.push(v.logObj);
        v.target.push(v.j);
      }
    }

    // ------------------------------------------------
    // 降順に並び替え後、順次削除実行
    // ------------------------------------------------
    v.step = 4.1; // 降順に並べ換え
    v.target = v.target.sort((a,b) => (a > b ? -1 : 1));

    for( v.i=0 ; v.i<v.target.length ; v.i++ ){

      v.step = 4.2; // this.valuesから削除
      this.values.splice(v.target[v.i],1);

      v.step = 4.3; // シートのセルを削除
      this.sheet.getRange(
        v.target[v.i] + 2,  // +1(添字->行番号) +1(ヘッダ行分)
        this.left,
        1,
        this.right - this.left + 1,
      ).deleteCells(SpreadsheetApp.Dimension.ROWS);

      v.step = 4.4; // this.bottomを書き換え
      this.bottom = this.bottom - 1;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}