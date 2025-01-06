/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 */
function SpreadDb(query=[],opt={}){
  /** main: SpreadDb主処理 */
  const v = {step:0,rv:[],log:[],idStr:`${idStr(query,['queryId','table','command'])}, ${idStr(opt,'userId')}`};
  const pv = {whois:'SpreadDb'};  // private variables: 擬似メンバ変数としてSpreadDb内で共有する値
  console.log(`${pv.whois} start: ${v.idStr}`);
  try {

    v.step = 1; // 全体事前処理
    v.step = 1.11; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      userId: 'guest', // {string} ユーザの識別子
      userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
      guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
      adminId: 'Administrator', // {string} 管理者として扱うuserId
    },opt);

    v.step = 1.12; // メンバ登録：内部設定項目
    Object.assign(pv,{
      spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
      table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
      log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
    });

    v.step = 1.2; // queryを配列化
    if( !Array.isArray(query) ) query = [query];

    v.step = 1.3; // スプレッドシートのロックを取得
    v.lock = LockService.getDocumentLock();

    v.step = 1.4; // 変更履歴テーブルのsdbTable取得。無ければ作成
    v.r = genTable({name:pv.opt.log});
    if( v.r instanceof Error ) throw v.r;
    if( v.r === null ){
      v.r = createTable({
        table: pv.opt.log,
        cols: genLog(), // sdbLog各項目の定義集
      });
      if( v.r instanceof Error ) throw v.r;
    } else {
      pv.table[pv.opt.log] = v.r;
    }

    for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){

      v.step = 2; // スプレッドシートのロック
      if( v.lock.tryLock(pv.opt.interval) ){

        for( v.i=0 ; v.i<query.length ; v.i++ ){

          v.step = 3; // 要求(query)実行準備
          v.step = 3.1; //実行結果オブジェクト(v.sdbMain)の初期化
          v.sdbMain = {
            query: query[v.i],
            ErrCD: null,
            rows:null,
            shcema:null,
            log:null,
          };

          v.step = 3.2; // createでテーブル名を省略した場合は補完
          if( query[v.i].command === 'create' && !Object.hasOwn(query[v.i],'table') ){
            query[v.i].table = query[v.i].arg.name;
          }

          v.step = 3.3; // 操作対象のテーブル管理情報を準備(無ければ作成)
          if( !Object.hasOwn(pv.table,query[v.i].table) ){
            v.r = genTable({name:query[v.i].table});
            if( v.r instanceof Error ) throw v.r;
            pv.table[query[v.i].table] = v.r;
          }

          v.step = 4; // ユーザの操作対象シートに対する権限をv.allowにセット
          v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : ( pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query[v.i].table] || '')  // ゲスト(userId指定無し)
          : ( pv.opt.userAuth[query[v.i].table] || ''));  // 通常ユーザ

          v.step = 5; // 呼出先メソッド設定
          if( v.allow.includes('o') ){

            // o(=own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
            // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
            //read/write/append/deleteは自分のみ可、schemaは実行不可

            v.step = 5.1;  // 操作対象レコードの絞り込み(検索・追加条件の変更)
            if( query[v.i].command !== 'append' ){
              v.step = 5.2; // select/update/deleteなら対象を自レコードに限定
              query[v.i].where = pv.opt.userId;
            } else {
              v.step = 5.3; // appendの場合
              v.pKey = pv.table[query[v.i].table].schema.primaryKey;
              if( !v.pKey ){
                v.step = 5.4; // 追加先テーブルにprimaryKeyが不在ならエラー
                v.sdbMain.ErrCD = 'No PrimaryKey';
              } else {
                v.step = 5.5; // 追加レコードの主キーはuserIdに変更
                if( !Array.isArray(query[v.i].record) ) query[v.i].record = [query[v.i].record];
                query[v.i].record.forEach(x => x[v.pKey] = pv.opt.userId);
              }
            }

            v.step = 5.6; // 'o'の場合の呼出先メソッドを設定
            switch( query[v.i].command ){
              case 'select': v.isOK = true; v.func = selectRow; break;
              case 'update': v.isOK = true; v.func = updateRow; break;
              case 'append': case 'insert': v.isOK = true; v.func = appendRow; break;
              case 'delete': v.isOK = true; v.func = deleteRow; break;
              default: v.isOK = false;
            }

          } else {

            v.step = 5.7;  // 'o'以外の場合の呼出先メソッドを設定
            switch( query[v.i].command ){
              case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
              case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
              case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
              case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
              case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
              case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
              default: v.isOK = false;
            }
          }

          v.step = 6; // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
          if( v.sdbMain.ErrCD === null && v.isOK === true ){

            v.step = 7; // 呼出先メソッド実行
            v.step = 7.1; // create以外の場合、操作対象のテーブル管理情報をcommand系メソッドの引数に追加
            if( query[v.i].command !== 'create' && query[v.i].command !== 'schema' ){
              if( !pv.table[query[v.i].table] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
                pv.table[query[v.i].table] = genTable({name:query[v.i].table});
                if( pv.table[query[v.i].table] instanceof Error ) throw pv.table[query[v.i].table];
              }
              query[v.i].table = pv.table[query[v.i].table];
            }

            v.step = 7.2;  // メソッド実行
            v.sdbLog = v.func(query[v.i]);

            v.step = 8;  // 戻り値がErrorオブジェクト
            if( v.sdbLog instanceof Error ){

              v.step = 9; // 異常終了時実行結果設定
              // selectRow, updateRow他のcommand系メソッドでエラー発生
              // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
              v.sdbMain.ErrCD = v.sdbLog.message;
              v.sdbMain.log = genLog({  // sdbLogオブジェクトの作成
                ErrCD: v.sdbLog.message,
                // before, after, diffは空欄
              });
              if( v.sdbMain.log instanceof Error ) throw v.sdbMain.log;

            } else {  // 戻り値がErrorオブジェクト以外

              v.step = 10; // 正常終了時実行結果設定(command系メソッドが正常終了した場合の処理)
              if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){

                v.step = 10.1; // select, schemaは結果をrow/schemaにセット
                v.sdbMain[query[v.i].command === 'select' ? 'rows' : 'schema'] = v.sdbLog;
                v.sdbMain.log = genLog({  // sdbLogオブジェクトの作成
                  table: query[v.i].table.name,
                  command: query[v.i].command,
                  arg: toString(query[v.i].command === 'select' ? query[v.i].where : query[v.i].table),
                  ErrCD: '',
                  message: query[v.i].command === 'select' ? `rownum=${v.sdbLog.length}` : '',
                  // before, after, diffは空欄
                });
                if( v.sdbMain.log instanceof Error ) throw v.sdbMain.log;

              } else {

                v.step = 10.2; // update, append, deleteは実行結果(sdbLog)をlogにセット
                v.sdbMain.log = v.sdbLog;

              }
            }

          } else {

            v.step = 11; // isOKではない場合、無権限時実行結果設定
            if( v.sdbMain.ErrCD === null ){
              v.sdbMain.ErrCD = 'No Authority';
            }
            v.sdbMain.log = genLog({  // sdbLogオブジェクトの作成
              ErrCD: v.sdbMain.ErrCD,
            });
            if( v.sdbMain.log instanceof Error ) throw v.sdbMain.log;
          }

          v.step = 12; // 実行結果を戻り値に追加
          v.rv.push(v.sdbMain);
        }

        v.step = 13; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.step = 13.1; // ログを配列化
        v.log = [];
        v.rv.forEach(x => {
          if( Array.isArray(x.log) ){
            v.log = [...v.log,...x.log];
          } else {
            v.log.push(x.log);
          }
        });
        v.step = 13.2; // 変更履歴シートに追記
        v.r = appendRow({
          table: pv.table[pv.opt.log],
          record: v.log,
        });
        if( v.r instanceof Error ) throw v.r;

        v.step = 14; // ロック解除
        v.lock.releaseLock();
        v.tryNo = 0;
      }
    }

    v.step = 9; // 終了処理
    console.log(`${pv.whois} normal end: ${v.idStr}`);
    return v.rv;

  } catch(e) {
    e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  /** appendRow: 領域に新規行を追加
   * @param {Object|Object[]} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|Object[]} arg.record=[] - 追加する行オブジェクト
   * @returns {sdbLog[]}
   *
   * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
   */
  function appendRow(arg){
    const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[]};
    console.log(`${v.whois} start: ${idStr(arg,['table.name','record'])}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      if( !Array.isArray(arg.record)) arg.record = [arg.record];
      v.target = [];  // 対象領域のシートイメージを準備

      // ------------------------------------------------
      v.step = 2; // 追加レコードをシートイメージに展開
      // ------------------------------------------------
      for( v.i=0 ; v.i<arg.record.length ; v.i++ ){

        v.step = 2.1; // 一件分のログオブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'append',
          arg: arg.record,
          // before, after, diffは後工程で追加
        });
        if( v.log instanceof Error ) throw v.log;

        v.step = 2.2; // auto_increment項目に値を設定
        // ※ auto_increment設定はuniqueチェックに先行
        for( v.ai in arg.table.schema.auto_increment ){
          if( !arg.record[v.i][v.ai] ){ // 値が未設定だった場合は採番実行
            arg.table.schema.auto_increment[v.ai].current += arg.table.schema.auto_increment[v.ai].step;
            arg.record[v.i][v.ai] = arg.table.schema.auto_increment[v.ai].current;
          }
        }

        v.step = 2.3; // 既定値の設定
        for( v.dv in arg.table.schema.defaultRow ){
          arg.record[v.i][v.dv] = arg.table.schema.defaultRow[v.dv](arg.record[v.i]);
        }

        v.step = 2.4; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(arg.record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.log.ErrCD = 'Duplicate';
            if( !v.log.diff ) v.log.diff = {};
            v.log.diff[v.unique] = arg.record[v.i][v.unique]; // diffに{unique項目名:重複値}を保存
          } else {
            // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.record[v.i][v.unique]);
          }
        }

        v.step = 2.5; // 正当性チェックOKの場合の処理
        if( !v.log.ErrCD ){

          v.step = 2.51; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<arg.table.header.length ; v.j++ ){
            v.a = arg.record[v.i][arg.table.header[v.j]];
            v.row[v.j] = (v.a && v.a !== 'null' && v.a !== 'undefined') ? v.a : '';
          }
          v.target.push(v.row);

          v.step = 2.52; // arg.table.valuesへの追加
          arg.table.values.push(arg.record[v.i]);

          v.step = 2.53; // ログに追加レコード情報を記載
          v.log.after = v.log.diff = JSON.stringify(arg.record[v.i]);
        }

        v.step = 2.6; // 成否に関わらず戻り値に保存
        v.rv.push(v.log);
      }

      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // 対象シートへの展開
      if( v.target.length > 0 ){
        arg.table.sheet.getRange(
          arg.table.rownum + 2,
          1,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
      v.step = 3.2; // arg.table.rownumの書き換え
      arg.table.rownum += v.target.length;

      v.step = 9; // 終了処理
      v.rv = v.rv;
      console.log(`${v.whois} normal end: ${v.idStr}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** convertRow: シートイメージと行オブジェクトの相互変換
   * @param {any[][]|Object[]} data - 行データ。シートイメージか行オブジェクトの配列
   * @param {string[]} [header]=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用
   * @returns {Object}
   *
   * - 戻り値のオブジェクト
   *   - raw {any[][]} シートイメージ
   *   - obj {Object[]} 行オブジェクトの配列
   *   - header {string} ヘッダ行
   */
  function convertRow(data,header=[]){
    const v = {whois:pv.whois+'.convertRow',step:0,rv:{raw:[],obj:[],header:header}};
    console.log(`${v.whois} start.`);
    try {

      if( Array.isArray(data[0]) ){ v.step = 1; // シートイメージ -> 行オブジェクト

        v.step = 1.1; // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
        for( v.i=1 ; v.i<data.length ; v.i++ ){
          v.o = {};
          for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
            if( data[v.i][v.j] ){
              v.o[data[0][v.j]] = data[v.i][v.j];
            }
          }
          v.rv.obj.push(v.o);
        }

        v.step = 1.2; // 引数headerが無ければrv.headerはシートイメージ先頭行とする
        if( header.length === 0 ){
          v.rv.header = data[0];
        }

      } else { v.step = 2; // 行オブジェクト -> シートイメージ

        v.rv.obj = data;
        if( header.length === 0 ){ // 引数headerが無ければメンバ名からrv.headerを生成
          v.rv.header = [...new Set(data.flatMap(d => Object.keys(d)))];
        }

      }

      v.step = 3; // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
      for( v.i=0 ; v.i<v.rv.obj.length ; v.i++ ){
        v.arr = [];
        for( v.j=0 ; v.j<v.rv.header.length ; v.j++ ){
          v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]] || '');
        }
        v.rv.raw.push(v.arr);
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
  /** createTable: 新規にシートを作成
   * @param {sdbTable} arg
   * @param {string} arg.table - テーブル名
   * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
   * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
   * @returns {sdbLog}
   */
  function createTable(arg){
    const v = {whois:`${pv.whois}.createTable`,step:0,rv:[],convertRow:null,
      idStr:`arg.table=${arg.table}`};
    console.log(`${v.whois} start: ${v.idStr}`);
    try {

      // ----------------------------------------------
      v.step = 1; // 事前準備
      // ----------------------------------------------
      v.step = 1.1; // 一件分のログオブジェクトを作成
      v.log = genLog({
        table: arg.table,
        command: 'create',
        arg: arg.cols,
        ErrCD: null,
        after: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
        // before, after, diffは空欄
      });
      if( v.log instanceof Error ) throw v.log;

      v.step = 1.2; // sdbTableのプロトタイプ作成
      v.table = {
        name: arg.table, // {string} テーブル名(範囲名)
        account: pv.opt.userId, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };

      // ----------------------------------------------
      v.step = 2; // テーブル管理情報の作成
      // ----------------------------------------------
      if( arg.cols ){

        v.step = 2.1; // 項目定義情報が存在する場合
        v.table.header = arg.cols.map(x => x.name);
        v.table.colnum = v.table.header.length;

      } else { // 項目定義情報が存在しない場合

        if( arg.values ){

          v.step = 2.2; // 項目定義不在で初期データのみ存在
          v.convertRow = convertRow(arg.values);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.header = v.convertRow.header;
          v.table.colnum = v.table.header.length;

        } else {

          v.step = 2.3; // シートも項目定義も初期データも無い
          throw new Error(`シートも項目定義も初期データも存在しません`);

        }
      }

      v.step = 2.4; // スキーマをインスタンス化
      v.r = genSchema({
        cols: arg.cols || null,
        header: v.table.header,
        notes: v.table.notes,
        values: v.table.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.table.schema = v.r.schema;
      v.table.notes = v.r.notes;

      // ----------------------------------------------
      v.step = 3; // シートが存在しない場合、新規追加
      // ----------------------------------------------
      if( v.table.sheet === null ){
        v.step = 3.1; // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(arg.table);

        v.step = 3.2; // ヘッダ行・メモのセット
        v.headerRange = v.table.sheet.getRange(1,1,1,v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定

        v.step = 3.3; // 初期データの追加
        if( (arg.values||[]).length > 0 ){
          if( v.convertRow === null ){
            v.convertRow = convertRow(arg.values,v.table.header);
            if( v.convertRow instanceof Error ) throw v.convertRow;
          }
          v.r = appendRow({table:v.table,record:v.convertRow.obj});
          if( v.r instanceof Error ) throw v.r;
        }
      } else {
        v.log.message = `"${v.table.name}" is already exist.`;
      }

      v.step = 9; // 終了処理
      pv.table[v.table.name] = v.table;
      v.rv = [v.log];
      console.log(`${v.whois} normal end: ${v.idStr}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {Object} any
   * @param {sdbTable} any.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} any.where - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法: functionalyze参照
   */
  function deleteRow(arg){
    const v = {whois:`${pv.whois}.deleteRow`,step:0,rv:[],whereStr:[]};
    console.log(`${v.whois} start.`);
    try {

      // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する

      v.step = 1; // 該当レコードかの判別用関数を作成
      v.whereStr = toString(arg.where); // 更新履歴記録用にwhereを文字列化
      arg.where = functionalyze({table:arg.table,data:arg.where});
      if( arg.where instanceof Error ) throw arg.where;

      v.step = 2; // 対象レコードか、後ろから一件ずつチェック
      for( v.i=arg.table.values.length-1 ; v.i>=0 ; v.i-- ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( arg.where(arg.table.values[v.i]) === false ) continue;

        v.step = 2.2; // 一件分のログオブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'delete',
          arg: v.whereStr,
          ErrCD: null,
          before: arg.table.values[v.i],
          // after, diffは空欄
        });
        if( v.log instanceof Error ) throw v.log;
        v.rv.push(v.log);

        v.step = 2.3; // 削除レコードのunique項目をarg.table.schema.uniqueから削除
        // arg.table.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in arg.table.schema.unique ){ // unique項目を順次チェック
          if( arg.table.values[v.i][v.unique] ){  // 対象レコードの当該unique項目が有意な値
            // unique項目一覧(配列)から対象レコードの値の位置を探して削除
            v.idx = arg.table.schema.unique[v.unique].indexOf(arg.table.values[v.i][v.unique]);
            if( v.idx >= 0 ) arg.table.schema.unique[v.unique].splice(v.idx,1);
          }
        }

        v.step = 2.4; // arg.table.valuesから削除
        arg.table.values.splice(v.i,1);

        v.step = 2.5; // シートのセルを削除
        v.range = arg.table.sheet.deleteRow(v.i+2); // 添字->行番号で+1、ヘッダ行分で+1

        v.step = 2.6; // arg.table.rownumを書き換え
        arg.table.rownum -= 1;

      }

      v.step = 9; // 終了処理
      v.rv = v.rv;
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
   * @param {Object} arg
   * @param {sdbTable} arg.table - 呼出元で処理対象としているテーブル
   * @param {Object|function|string} arg.data - 関数化するオブジェクトor文字列
   * @returns {function}
   *
   * - update/delete他、引数でwhereを渡されるメソッドで使用
   * - 引数のデータ型により以下のように処理分岐
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - string
   *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
   *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   */
  function functionalyze(arg=null){
    const v = {whois:`${pv.whois}.functionalyze`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 引数のチェック
      if( typeof arg === 'string' ){
        arg = {data:arg,table:null};
      } else if( !whichType(arg,'Object') || !Object.hasOwn(arg,'data')){
        throw new Error(`引数「${toString(arg)}」は適切な引数ではありません`);
      }

      switch( typeof arg.data ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg.data;
          break;
        case 'object': v.step = 2.2;
          v.keys = Object.keys(arg.data);
          if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
            v.step = 2.21; // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o',`return isEqual(o['${arg.data.key}'],'${arg.data.value}')`);
          } else {
            v.step = 2.22; // {キー項目名:値}形式での指定の場合
            v.c = [];
            for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg.data[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o',`return (${v.c.join(' && ')})`);
          }
          break;
        case 'string': v.step = 2.3;
          v.fx = arg.data.match(/^function\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if( v.fx || v.ax ){
            v.step = 2.31; // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g,''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g,' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
            break;
          }
        default:
          v.step = 2.4; // 関数ではない文字列、またはfunction/object/string以外の型はprimaryKeyの値指定と看做す
          if( arg.table !== null && arg.table.schema.primaryKey ){
            if( typeof arg.data === 'string') arg.data = `"${arg.data}"`;
            v.rv = new Function('o',`return isEqual(o['${arg.table.schema.primaryKey}'],${arg.data})`);
          } else {
            throw new Error(`引数の型が不適切です`);
          }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nrv=${toString(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   *
   * - auto_incrementの記載ルール
   *   - null ⇒ 自動採番しない
   *   - boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
   *   - number ⇒ 自動採番する(基数=指定値,増減値=1)
   *   - number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
   *
   * - 戻り値のオブジェクト
   *   - column {sdbColumn}
   *   - note {string[]} メモ用の文字列
   */
  function genColumn(arg={}){
    const v = {whois:`${pv.whois}.genColumn`,step:0,rv:{},
      idStr: 'arg=' + (typeof arg === 'string' ? arg : arg.name),
      typedef:[ // sdbColumnの属性毎にname,type,noteを定義
        {name:'name',type:'string',note:'項目名'},
        {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
        {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
        {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
        {name:'default',type:'number|string|boolean|Date',note:'既定値'},
        {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
        {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
        {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
          + '\n// null ⇒ 自動採番しない'
          + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
          + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
          + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
        },
        {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
        {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
      ],
      rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
    };
    console.log(`${v.whois} start. ${v.idStr}`);
    try {

      // ------------------------------------------------
      v.step = 1; // rv.columnの準備
      // ------------------------------------------------
      if( typeof arg === 'object' ){
        v.step = 1.1; // 引数がオブジェクト(=sdbColumn)ならそのまま採用
        v.rv.column = arg;
        v.rv.note = {};
      } else {  // 文字列で与えられたらオブジェクトに変換

        v.step = 1.2; // コメントの削除、一行毎に分割
        v.lines = arg.replace(v.rex,'').split('\n');

        v.step = 1.3; // 一行毎に属性の表記かを判定
        v.rv.column = {};
        v.lines.forEach(prop => {
          v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+?)["']?$/);
          if( v.m ) v.rv.column[v.m[1]] = v.m[2];
        });

        v.step = 1.4;
        if( Object.keys(v.rv.column).length === 0 ){
          // 属性項目が無ければ項目名と看做す
          v.rv.column = {name:arg.trim()};
          v.rv.note = {};
        } else {
          // 属性項目があればシート上のメモの文字列と看做す
          v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
        }
      }

      // ------------------------------------------------
      v.step = 2; // rv.column各メンバの値をチェック・整形
      // ------------------------------------------------
      v.step = 2.1; // 'null'はnullに変換
      v.map = {'null':null,'true':true,'false':false};
      Object.keys(v.rv.column).forEach(x => {

        v.step = 2.11; // 文字列で指定された'null','true','false'は値にする
        if( Object.hasOwn(v.map,v.rv.column[x]) ){
          v.rv.column[x] = v.map[v.rv.column[x]];
        }

        v.step = 2.12; // メモ文字列を作成する場合(=引数がメモ文字列では無かった場合)
        // かつ属性値が未定義(null)ではない場合、v.rv.columnにもメモ作成用の属性値をセット
        if( whichType(v.rv.note,'Object') && v.rv.column[x] !== null ){
          v.rv.note[x] = v.rv.column[x];
        }
      });

      v.step = 2.2; // defaultを関数に変換
      if( v.rv.column.default ){
        v.r = functionalyze(v.rv.column.default);
        if( v.r instanceof Error ) throw v.r;
        v.rv.column.default = v.r;
      }
      if( v.rv.column.default instanceof Error ) throw v.rv.column.default;

      v.step = 2.3; // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => {return {obj:{start:x[0],step:(x[1]||1)},str:JSON.stringify(x)}},  // [start,step]形式
        Number: x => {return {obj:{start:x,step:1},str:x}},  // startのみ数値で指定
        Object: x => {return {obj:x, str:JSON.stringify(x)}}, // {start:m,step:n}形式
        Null: x => {return {obj:false, str:'false'}}, // auto_incrementしない
        Boolean: x => {return x ? {obj:{start:1,step:1}, str:'true'} : {obj:false, str:'false'}}, // trueは[1,1],falseはauto_incrementしない
      };
      if( v.rv.column.auto_increment ){
        if( typeof v.rv.column.auto_increment === 'string' )
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        // 開始値はstart+stepになるので、予め-stepしておく
        v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
        v.rv.note.auto_increment = v.acObj.str;
      }

      // ------------------------------------------------
      v.step = 3; // シートのメモに記載する文字列を作成
      // ------------------------------------------------
      if( typeof v.rv.note === 'object' ){
        v.x = [];
        v.typedef.map(x => x.name).forEach(x => {
          if( Object.hasOwn(v.rv.note,x) ){
            v.x.push(`${x}: "${v.rv.note[x]}"`);
          }
        });
        v.rv.note = v.x.join('\n');
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. ${v.idStr}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genLog: sdbLogオブジェクトを生成
   * @param {sdbLog|null} arg - 変更履歴シートの行オブジェクト
   * @returns {sdbLog|sdbColumn[]} 変更履歴シートに追記した行オブジェクト、または変更履歴シート各項目の定義
   */
  function genLog(arg=null){
    const v = {whois:`${pv.whois}.genLog`,step:0,rv:null,
      idStr: 'arg='+(arg===null?'null':`${arg.table}.${arg.command}`)};
    console.log(`${v.whois} start. ${v.idStr}`);
    try {

      v.step = 1; // 変更履歴シートの項目定義
      v.logDef = [
        {name:'timestamp',type:'string',note:'更新日時'},
        {name:'userId',type:'string|number',note:'ユーザ識別子'},
        {name:'queryId',type:'string',note:'クエリ・結果突合用識別子'},
        {name:'table',type:'string',note:'対象テーブル名'},
        {name:'command',type:'string',note:'操作内容(コマンド名)'},
        {name:'arg',type:'string',note:'操作関数に渡された引数'},
        {name:'ErrCD',type:'string',note:'エラーコード'},
        {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
        {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
        {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
      ];

      if( arg === null ){

        v.step = 2; // 引数が指定されていない場合、変更履歴シート各項目の定義を返す
        v.rv = v.logDef;

      } else {

        v.step = 3; // 引数としてオブジェクトが渡された場合、その値を設定したsdbLogオブジェクトを返す
        // シートへの追加だけなら必要な項目にdefault設定しておけば良いが、
        // 呼出元への戻り値としても使用するので、ここで既定値設定を行う。
        v.rv = Object.assign({
          timestamp: toLocale(new Date()), // {string} 更新日時
          userId: pv.opt.userId, // {string|number} uuid等、更新者の識別子
          // 以下、本関数呼出元で設定する項目
          queryId: null, // {string} SpreadDb呼出元で設定する、クエリ・結果突合用文字列
          table: null, // {string} 更新対象となった範囲名(テーブル名)
          command: null, // {string} 操作内容。command系内部関数名のいずれか
          arg: null, // {string} 操作関数に渡された引数
          ErrCD: null, // {string} エラーコード
          before: null, // {JSON} 更新前の行データオブジェクト(JSON)
          after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
          diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
        },arg);

        v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
        for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);

      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. ${v.idStr}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param arg {Object} - 対象テーブルのschemaオブジェクト
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {Object|Error}
   *
   * - 戻り値のオブジェクト
   *   - schema {sdbSchema}
   *   - notes {string[]} ヘッダ行に対応したメモ
   */
  function genSchema(arg){
    const v = {whois:`${pv.whois}.genSchema`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        schema: {
          cols: arg.cols || [], // {sdbColumn[]} 項目定義オブジェクトの配列
          primaryKey: 'id', // {string}='id' 一意キー項目名
          unique: {}, // {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
          auto_increment: {}, // {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
            // auto_incrementのメンバ : start {number} 開始値, step {number} 増減値, current {number} 現在の最大(小)値
          defaultRow: {}, // {Object.<string,function>} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
        },
        notes: arg.notes || [], // ヘッダ行に対応したメモ
      };

      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if( v.rv.schema.cols.length === 0 ){
        if( v.rv.notes.length > 0 ){
          v.step = 2.1; // シートにメモが存在していた場合、その内容から作成
          for( v.i=0 ; v.i<v.rv.notes.length ; v.i++ ){
            v.r = genColumn(v.rv.notes[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
          }
        } else {
          v.step = 2.2; // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for( v.i=0 ; v.i<arg.header.length ; v.i++ ){
            v.r = genColumn(arg.header[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
            v.rv.notes.push(v.r.note);
          }
        }
      } else if( v.rv.notes.length === 0 ){
        v.step = 2.3; // 項目定義オブジェクトが渡された場合、notesのみを作成
        for( v.i=0 ; v.i<arg.cols.length ; v.i++ ){
          v.r = genColumn(arg.cols[v.i]);
          if( v.r instanceof Error ) throw v.r;
          v.rv.notes.push(v.r.note);
        }
      }

      // -----------------------------------------------
      v.step = 3; // v.rv.schema.cols以外のメンバ作成
      // -----------------------------------------------
      for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
        v.step = 3.1; // primaryKey
        if( Object.hasOwn(v.rv.schema.cols[v.i],'primaryKey') && v.rv.schema.cols[v.i].primaryKey === true ){
          v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( Object.hasOwn(v.rv.schema.cols[v.i],'unique') && v.rv.schema.cols[v.i].unique === true ){
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].start;
        }

        v.step = 3.4; // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
        if( v.rv.schema.cols[v.i].default ){
          v.rv.schema.defaultRow[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].default;
        }
      }

      // ------------------------------------------------
      v.step = 4; // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      arg.values.forEach(vObj => {
        v.step = 4.1; // unique項目の値を洗い出し
        Object.keys(v.rv.schema.unique).forEach(unique => {
          if( vObj[unique] ){
            if( v.rv.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
              v.rv.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });

        v.step = 4.2; // auto_increment項目の値を洗い出し
        Object.keys(v.rv.schema.auto_increment).forEach(ai => {
          v.c = v.rv.schema.auto_increment[ai].current;
          v.s = v.rv.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
            v.rv.schema.auto_increment[ai].current = v.v;
          }
        });
      });

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genTable: sdbTableオブジェクトを生成
   * @param arg {Object}
   * @param arg.name {string} - シート名
   * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|null} シート不存在ならnull
   */
  function genTable(arg){
    const v = {whois:`${pv.whois}.genTable`,step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        name: arg.name, // {string} テーブル名(範囲名)
        account: pv.opt.userId, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };
      if( v.rv.sheet === null ) return null;  // シート不存在ならnull

      // ----------------------------------------------
      v.step = 2; // シートから各種情報を取得
      // ----------------------------------------------

      v.step = 2.1; // シートイメージを読み込み
      v.getDataRange = v.rv.sheet.getDataRange();
      v.getValues = v.getDataRange.getValues();
      v.rv.header = JSON.parse(JSON.stringify(v.getValues[0]));
      v.r = convertRow(v.getValues);
      if( v.r instanceof Error ) throw v.r;
      v.rv.values = v.r.obj;
      v.rv.notes = v.getDataRange.getNotes()[0];
      v.rv.colnum = v.rv.header.length;
      v.rv.rownum = v.rv.values.length;

      v.step = 2.3; // スキーマをインスタンス化
      v.r = genSchema({
        cols: [], // notesを優先するので空配列を指定
        header: v.rv.header,
        notes: v.rv.notes,
        values: v.rv.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.rv.schema = v.r.schema;

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. table=${arg.name}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {string|string[]} arg - 取得対象テーブル名
   * @returns {Object.<string,sdbColumn[]>} {テーブル名：項目定義オブジェクトの配列}形式
   */
  function getSchema(arg){
    const v = {whois:`${pv.whois}.getSchema`,step:0,rv:[]};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${JSON.stringify(arg)}`);
    try {

      v.step = 1.1; // 引数のデータ型チェック
      if( !whichType(arg,'Object') || !Object.hasOwn(arg,'table') ){
        throw new Error('引数にtableが含まれていません');
      }
      v.step = 1.2; // 対象テーブル名の配列化
      v.arg = typeof arg.table === 'string' ? [arg.table]: arg.table;

      v.step = 2; // 戻り値の作成
      for( v.i=0 ; v.i<v.arg.length ; v.i++ ){
        if( !pv.table[v.arg[v.i]] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
          pv.table[v.arg[v.i]] = genTable({name:v.arg[v.i]});
          if( pv.table[v.arg[v.i]] instanceof Error ) throw pv.table[v.arg[v.i]];
        }
        v.rv.push(pv.table[v.arg[v.i]]);
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
  /** selectRow: テーブルから該当行を抽出
   * @param {Object|Object[]} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|function} arg.where - 対象レコード判定条件
   * @returns {Object[]} 該当行オブジェクトの配列
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(arg){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[]};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 判定条件を関数に統一
      v.where = functionalyze({table:arg.table,data:arg.where});
      if( v.where instanceof Error ) throw v.where;

      v.step = 2; // 行オブジェクトを順次走査、該当行を戻り値に追加
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){
        if( v.where(arg.table.values[v.i]) ){
          v.rv.push(arg.table.values[v.i]);
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nrows=${v.rv.length}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** 関数・オブジェクトを文字列化 */
  function toString(arg){
    if( typeof arg === 'function' ) return arg.toString();
    if( typeof arg === 'object' ) return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: 領域に新規行を追加
   * @param {Object} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} arg.where - 対象レコードの判定条件
   * @param {Object|Function|string} arg.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法: functionalyze参照
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  function updateRow(arg={}){
    const v = {whois:`${pv.whois}.updateRow`,step:0,rv:[],
      top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
    };
    console.log(`${v.whois} start.`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      v.step = 1.1; // 引数whereの処理
      if( Object.hasOwn(arg,'where') && arg.where ){
        // 該当レコードかの判別用関数を作成
        v.where = functionalyze({table:arg.table,data:arg.where});
        if( v.where instanceof Error ) throw v.where;
      } else {
        throw new Error(`テーブル「${arg.table.name}」の更新で、対象(where)が指定されていません`);
      }

      v.step = 1.2; // 引数recordの処理
      if( Object.hasOwn(arg,'record') && arg.record ){
        // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
        // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
        v.r = (arg=>{
          if( whichType(arg,'Object')) return arg;
          try{return JSON.parse(arg)}catch{return null}
        })(arg.record);
        if( v.r !== null ){
          v.record = () => {return v.r};
        } else {
          // 更新する値を導出する関数を作成
          v.record = functionalyze({table:arg.table,data:arg.record});
          if( v.record instanceof Error ) throw v.record;
        }
      } else {
        throw new Error(`テーブル「${arg.table.name}」の更新で、更新値(record)が指定されていません`);
      }

      v.step = 1.3; // 更新履歴記録用に文字列化
      v.argStr = `{"where":"${toString(arg.where)}","record":"${toString(arg.record)}"}`;

      // ------------------------------------------------
      v.step = 2; // table.valuesを更新、ログ作成
      // ------------------------------------------------
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( v.where(arg.table.values[v.i]) === false ) continue;

        v.step = 2.2; // v.before(更新前の行オブジェクト),after,diffの初期値を用意
        [v.before,v.after,v.diff] = [arg.table.values[v.i],{},{}];

        v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
        v.rObj = v.record(arg.table.values[v.i]);

        v.step = 2.4; // 項目毎に値が変わるかチェック
        arg.table.header.forEach(x => {
          if( Object.hasOwn(v.rObj,x) && !isEqual(v.before[x],v.rObj[x]) ){
            v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
            v.after[x] = v.diff[x] = v.rObj[x];
            v.step = 2.42; // 更新対象範囲の見直し
            v.colNo = arg.table.header.findIndex(y => y === x);
            v.left = Math.min(v.left,v.colNo);
            v.right = Math.max(v.right,v.colNo);
          } else {
            v.step = 2.43; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
            v.after[x] = v.before[x];
          }
        });

        v.step = 2.5; // 更新履歴オブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'update',
          arg: v.argStr,
          ErrCD: '',
          before: v.before,
          after: v.after,
          diff: v.diff,
        });
        if( v.log instanceof Error ) throw v.log;

        v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(v.where[v.unique]) >= 0 ){
            v.step = 2.61; // 登録済の場合はエラーとして処理
            v.log.ErrCD = 'Duplicate';
            if( !v.log.diff ) v.log.diff = {};
            v.log.diff[v.unique] = v.where[v.unique]; // diffに{unique項目名:重複値}を保存
          } else {
            v.step = 2.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(v.where[v.unique]);
          }
        }

        v.step = 2.7; // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
        if( v.log.ErrCD === null ){
          v.top = Math.min(v.top, v.i);
          v.bottom = Math.max(v.bottom, v.i);
          arg.table.values[v.i] = v.after;
        }

        v.step = 2.8; // 成否に関わらずログ出力対象に保存
        v.rv.push(v.log);
      }

      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      v.target = [];
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(arg.table.values[v.i][arg.table.header[v.j]] || null);
        }
        v.target.push(v.row);
      }

      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 || (v.target.length === 1 && v.target[0].length === 0) ){
        arg.table.sheet.getRange(
          v.top +2,  // +1(添字->行番号)+1(ヘッダ行)
          v.left +1,  // +1(添字->行番号)
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
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
  /** idStr: オブジェクトの指定メンバの値を文字列として返す
   * @param {Object} o - 出力対象オブジェクト
   * @param {string|string[]} m - メンバ指定文字列。オブジェクト名(ex.'o')は省略のこと
   * @returns {string}
   * 
   * @example
   * o={a:10,b:{c:'abc',d:x=>{x+10}}}, m=['a','b.d']
   * -> "a=10, b.d='x=>{x+10}'"
   */
  function idStr(o,m){
    const v = {rv:[]};
    if( typeof m === 'string' ) m = [m];
    for( v.i=0 ; v.i<m.length ; v.i++ ){
      v.r = o;
      v.a = m[v.i].split('.');
      for( v.j=0 ; v.j<v.a.length ; v.j++ ){
        if( Object.hasOwn(v.r,v.a[v.j]) ){
          v.r = v.r[v.a[v.j]];
        } else {  // 当該プロパティが未定義の場合
          v.r = null;
          break;
        }
      }
      if( v.r !== null ) v.rv.push(`${m[v.i]}=${toString(v.r)}`);
    }
    return v.rv.join(', ');
  }
}