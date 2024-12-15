/** appendRow: 領域に新規行を追加
 * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
 * @returns {sdbLog[]}
 */
function appendRow(record){
  const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[],argument:JSON.stringify(record)};
  console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------
    if( !Array.isArray(record)) record = [record];
    v.target = [];  // 対象領域のシートイメージを準備
    v.log = []; // 更新履歴のシートイメージを準備

    // ------------------------------------------------
    v.step = 2; // 追加レコードをシートイメージに展開
    // ------------------------------------------------
    v.header = pv.schema.cols.map(x => x.name);
    for( v.i=0 ; v.i<record.length ; v.i++ ){

      v.logObj = new sdbLog({account: pv.account,range: pv.name,
        action:'append',argument:v.argument});

      v.step = 2.1; // auto_increment項目の設定
      // ※ auto_increment設定はuniqueチェックに先行
      for( v.ai in pv.schema.auto_increment ){
        if( !record[v.i][v.ai] ){
          pv.schema.auto_increment[v.ai].current += pv.schema.auto_increment[v.ai].step;
          record[v.i][v.ai] = pv.schema.auto_increment[v.ai].current;
        }
      }

      v.step = 2.2; // 既定値の設定
      record[v.i] = Object.assign({},pv.schema.defaultRow,record[v.i]);

      v.step = 2.3; // 追加レコードの正当性チェック(unique重複チェック)
      for( v.unique in pv.schema.unique ){
        if( pv.schema.unique[v.unique].indexOf(record[v.i][v.unique]) >= 0 ){
          // 登録済の場合はエラーとして処理
          v.logObj.result = false;
          // 複数項目のエラーメッセージに対応するため配列化を介在させる
          v.logObj.message = v.logObj.message === null ? [] : v.logObj.message.split('\n');
          v.logObj.message.push(`${v.unique}欄の値「${record[v.i][v.unique]}」が重複しています`);
          v.logObj.message = v.logObj.message.join('\n');
        } else {
          // 未登録の場合pv.sdbSchema.uniqueに値を追加
          pv.schema.unique[v.unique].push(record[v.i][v.unique]);
        }
      }

      v.step = 2.4; // 正当性チェックOKの場合の処理
      if( v.logObj.result ){
        v.step = 2.41; // シートイメージに展開して登録
        v.row = [];
        for( v.j=0 ; v.j<v.header.length ; v.j++ ){
          v.row[v.j] = record[v.i][v.header[v.j]];
        }
        v.target.push(v.row);

        v.step = 2.42; // pv.valuesへの追加
        pv.values.push(record[v.i]);

        v.step = 2.43; // ログに追加レコード情報を記載
        v.logObj.after = v.logObj.diff = JSON.stringify(record[v.i]);
      }

      v.step = 2.5; // 成否に関わらずログ出力対象に保存
      v.log.push(v.logObj);
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    v.step = 3.1; // 対象シートへの展開
    if( v.target.length > 0 ){
      pv.sheet.getRange(
        pv.bottom+1,
        pv.left,
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
    }
    // pv.sdbTable.bottomの書き換え
    pv.bottom += v.target.length;

    v.step = 3.2; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
    if( pv.log !== null ){
      v.r = pv.log.append(v.log);
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