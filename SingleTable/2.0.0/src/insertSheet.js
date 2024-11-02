/** insertSheet: シートの新規作成＋項目定義メモのセット
 * @param arg {Object}
 * @param arg.sheetName {string} - 作成するシート名
 * @param arg.left=1 {number} - 左端列番号(自然数)
 * @param arg.top=1 {number} - 上端行番号(自然数)
 * @param arg.cols {Object[]} - 項目定義オブジェクトの配列
 * @param [arg.rows] {Array[]|Object[]} - 行データ
 * @returns {Sheet} 作成されたシートオブジェクト
 */
insertSheet(arg){
  const v = {whois:this.constructor.name+'.insertSheet',step:0,rv:null,range:null};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 1; // 既定値の設定
    v.arg = mergeDeeply(arg,{sheetName:null,left:1,top:1,cols:null,rows:null});
    if( v.arg instanceof Error ) throw v.arg;
    vlog(v,'arg');

    v.step = 2; // シートの存否確認、不在なら追加
    v.rv = this.spread.getSheetByName(v.arg.sheetName);
    v.addNew = v.rv === null ? true : false;
    if( v.addNew ){
      v.step = 2.1; // 新規シートを追加
      v.rv = this.spread.insertSheet();
      v.rv.setName(v.arg.sheetName);

      v.step = 2.2; // ヘッダ行の範囲をrangeとして設定
      v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);

      v.step = 2.3; // ヘッダ行に項目名をセット
      v.range.setValues([v.arg.cols.map(x => x.name)]);
    }

    v.step = 3; // 項目定義メモの存否確認、不在なら追加
    if( v.range === null )  // 既存シートならヘッダ行の範囲を取得
      v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
    v.notes = v.range.getNotes();
    if( v.notes === null ){

      v.step = 3.1; // 項目定義オブジェクトのメンバ一覧を取得
      v.colsDef = this.colsDef.map(x => x.name);

      v.step = 3.2; // 項目定義編集時の注意事項を作成
      v.colsDefNote = [''];
      this.colsDefNote.forEach(l => v.colDefNote.push('// '+l));
      v.colDefNote = v.colDefNote.join('\n');

      v.step = 3.3; // 個々の項目についてメモ(文字列)を作成
      v.notes = [];
      for( v.i=0 ; v.i<v.arg.cols.length ; v.i++ ){
        v.notes[v.i] = [];
        for( v.j=0 ; v.j<v.colsDef.length ; v.j++ ){
          if( v.arg.cols[v.i].hasOwnProperty(v.colsDef[v.j]) ){
            v.notes[v.i].push(`${v.colsDef[v.j]}: ${v.arg.cols[v.i][v.colsDef[v.j]]}`)
          }
        }
        v.notes[v.j].push(v.colDefNote);  // 注意事項を追加
        v.notes[v.j] = v.notes[v.j].join('\n');
      }
      v.range.setNotes([v.notes]);
    }

    v.step = 4; // 新規作成シートの場合、データを追加
    if( v.addNew && v.arg.rows !== null ){
      v.sheet = []; // シートイメージ
      v.header = v.arg.cols.map(x => x.name); // ヘッダ行

      v.step = 4.1; // 項目の並びが異なる可能性があるので、シートイメージの場合は行オブジェクト化
      if( whichType(v.arg.rows[0],'Object') ){
        v.step = 4.11;
        v.data = v.arg.rows;
      } else {
        v.step = 4.12;
        v.data = [];
        for( v.i=1 ; v.i<v.arg.rows.length ; v.i++ ){
          v.row = {};
          for( v.j=0 ; v.j<v.arg.rows[v.i].length ; v.j++ ){
            vlog(v,['i','j'])
            if( v.arg.rows[v.i].hasOwnProperty(v.header[v.j]) ){
              v.row[v.header[v.j]] = v.arg.rows[v.i][v.j];
            }
          }
          v.data.push(v.row);
        }
      }

      v.step = 4.2; // 行オブジェクトをシートイメージに変換
      v.data.forEach(row => {
        v.row = [];
        Object.keys(row).forEach(key => {
          v.row[v.header.indexOf(key)] = row[key];
        });
        v.sheet.push(v.row);
      });

      v.step = 4.3; // 作成したシートイメージをセット
      v.rv.getRange(v.arg.top+1,v.arg.left,v.sheet.length,v.sheet[0].length).setValues(v.sheet);
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
