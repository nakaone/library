/** genSchema: sdbSchemaオブジェクトを生成
 * @param table {sdbTable} - 対象テーブルのsdbTableオブジェクト
 * @returns {void}
 */
function genSchema(table){
  const v = {whois:`${pv.whois}.genSchema`,step:0,rv:null};
  try {

    v.fId = `: table=${table.name}`;
    console.log(`${v.whois} start${v.fId}`);

    // -----------------------------------------------
    v.step = 2; // 項目定義オブジェクト(cols)の作成
    // -----------------------------------------------
    if( table.schema.cols.length === 0 ){
      if( table.notes.length > 0 ){
        v.step = 2.1; // シートにメモが存在していた場合、その内容から作成
        for( v.i=0 ; v.i<table.notes.length ; v.i++ ){
          v.r = genColumn(table.notes[v.i]);
          if( v.r instanceof Error ) throw v.r;
          table.schema.cols.push(v.r.column);
        }
      } else {
        v.step = 2.2; // シートにメモが無かった場合、ヘッダ行の項目名から作成
        for( v.i=0 ; v.i<table.header.length ; v.i++ ){
          v.r = genColumn(table.header[v.i]);
          if( v.r instanceof Error ) throw v.r;
          table.schema.cols.push(v.r.column);
          table.notes.push(v.r.note);
        }
      }
    } else if( table.notes.length === 0 ){
      v.step = 2.3; // 項目定義オブジェクトが渡された場合、notesのみを作成
      for( v.i=0 ; v.i<table.schema.cols.length ; v.i++ ){
        v.r = genColumn(table.schema.cols[v.i]);
        if( v.r instanceof Error ) throw v.r;
        table.notes.push(v.r.note);
      }
    }

    // -----------------------------------------------
    v.step = 3; // table.schema.cols以外のメンバ作成
    // -----------------------------------------------
    for( v.i=0 ; v.i<table.schema.cols.length ; v.i++ ){
      v.step = 3.1; // primaryKey
      if( Object.hasOwn(table.schema.cols[v.i],'primaryKey') && table.schema.cols[v.i].primaryKey === true ){
        table.schema.primaryKey = table.schema.cols[v.i].name;
        table.schema.unique[table.schema.cols[v.i].name] = [];
      }
      // 主キーがないテーブルはエラー
      if( !table.schema.primaryKey ) throw new Error('No Primary Key');

      v.step = 3.2; // unique
      if( Object.hasOwn(table.schema.cols[v.i],'unique') && table.schema.cols[v.i].unique === true ){
        table.schema.unique[table.schema.cols[v.i].name] = [];
      }

      v.step = 3.3; // auto_increment
      // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
      if( table.schema.cols[v.i].auto_increment && table.schema.cols[v.i].auto_increment !== false ){
        table.schema.auto_increment[table.schema.cols[v.i].name] = table.schema.cols[v.i].auto_increment;
        table.schema.auto_increment[table.schema.cols[v.i].name].current = table.schema.auto_increment[table.schema.cols[v.i].name].start;
      }

      v.step = 3.4; // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
      if( table.schema.cols[v.i].default ){
        table.schema.defaultRow[table.schema.cols[v.i].name] = table.schema.cols[v.i].default;
      }
    }

    // ------------------------------------------------
    v.step = 4; // unique,auto_incrementの洗い出し
    // ------------------------------------------------
    table.values.forEach(vObj => {
      v.step = 4.1; // unique項目の値を洗い出し
      Object.keys(table.schema.unique).forEach(unique => {
        if( vObj[unique] ){
          if( table.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
            table.schema.unique[unique].push(vObj[unique]);
          } else {
            throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
          }
        }
      });

      v.step = 4.2; // auto_increment項目の値を洗い出し
      Object.keys(table.schema.auto_increment).forEach(ai => {
        v.c = table.schema.auto_increment[ai].current;
        v.s = table.schema.auto_increment[ai].step;
        v.v = Number(vObj[ai]);
        if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
          table.schema.auto_increment[ai].current = v.v;
        }
      });
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end${v.fId}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}