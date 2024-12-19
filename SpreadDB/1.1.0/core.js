/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 * 
 * - rev.1.0.0 -> rev.1.1.0 変更点
 *   - 上・左余白不可、複数テーブル/シート不可に変更(∵ロジックが複雑で保守性低下)
 *     - テーブル名とシート名が一致
 *     - 左上隅のセルはA1に固定
 *   - 「更新履歴」の各項目の並び・属性他について、シート上の変更は反映されない(システム側で固定)
 *   - 各シートの権限チェックロジックを追加(opt.account)
 *   - クロージャを採用(append/update/deleteをprivate関数化)
 *     - select文を追加(従来のclass方式ではインスタンスから直接取得)
 *     - インスタンスを返す方式から、指定された操作(query)の結果オブジェクトを返すように変更
 *   - getSchemaメソッドを追加
 *   - 旧版のgetLogは廃止(select文で代替)
 * - 仕様の詳細は[workflowy](https://workflowy.com/#/4e03d2d2c266)参照
 */
function SpreadDb(query=[],opt={}){
  const v = {step:0,rv:[],log:[]};
  const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
  console.log(`${pv.whois} start.`);
  try {
  
    v.step = 1.1; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      user: null, // {number|string}=null ユーザのアカウント情報。nullの場合、権限のチェックは行わない
      account: null, // {string}=null アカウント一覧のテーブル名
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
      guestAuthority: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
    },opt);
  
    v.step = 1.2; // メンバ登録：内部設定項目
    Object.assign(pv,{
      spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
      sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
      table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
      log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
    });
  
    v.step = 2; // 変更履歴テーブルが無ければ作成
    pv.table[pv.opt.log] = createTable({
      name: pv.opt.log,
      cols: genLog(), // sdbLog各項目の定義集
    });
  
    v.step = 3; // queryを順次処理処理
  
    if( !Array.isArray(query) ) query = [query];  // queryを配列化
    v.lock = LockService.getDocumentLock(); // スプレッドシートのロックを取得
  
    for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
      if( v.lock.tryLock(pv.opt.interval) ){
  
        v.step = 3.1; // ロック成功、シートの更新処理開始
        for( v.i=0 ; v.i<query.length ; v.i++ ){
  
          v.step = 3.11; // 戻り値、ログの既定値を設定
          v.queryResult = {query:query[v.i],isErr:false,message:'',data:null,log:null};
        
          v.step = 3.12; // 管理者かどうかをv.isAdmin(boolean)にセット
          // 判定条件：AdminIdとuserIdの両方が指定されており、かつ一致
          v.isAdmin = Object.hasOwn(pv.opt,'AdminId')
            && pv.opt.user !== null
            && Object.hasOwn(pv.opt.user,'id')
            && pv.opt.user.id !== null
            && pv.opt.AdminId === pv.opt.user.id;
          console.log(`l.304 v.isAdmin=${v.isAdmin}`)
  
          v.step = 3.13; // ユーザの操作対象シートに対する権限をv.allowにセット
          v.allow = v.isAdmin ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : ( (pv.opt.user !== null && Object.hasOwn(pv.opt.user,'authority'))
          ? pv.opt.user.authority[query[v.i].table] // 通常ユーザは指定テーブルの権限
          : pv.opt.guestAuthority[query[v.i].table] );  // ゲストはゲスト用権限。通常ユーザでも指定無しならゲスト扱い
          console.log(`l.311 v.allow=${v.allow}`)
        
          v.step = 3.2; // 処理内容を元に、必要とされる権限が与えられているか確認
          if( v.allow.includes('o') ){
        
            v.step = 3.21;
            // o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
            // また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
            //read/writeは自分のみ可、delete/schemaは実行不可
            query[v.i].arg.where = pv.opt.user.id;  // 自レコードのみ対象に限定
            switch( query[v.i].command ){
              case 'select': v.isOK = true; v.func = selectRow; break;
              case 'update': v.isOK = true; v.func = updateRow; break;
              default: v.isOK = false;
            }
        
          } else {
        
            v.step = 3.22;
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
        
          // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
          if( v.isOK ){
            //v.step = 3.6; // テーブル名のみでテーブル管理情報を必要としないgenSchema以外のメソッドにはテーブル管理情報を追加
            // genSchemaはテーブル管理情報を作成する関数なので、引数としてのテーブル管理情報は不要
            //if( query[v.i] instanceof Object ) query[v.i].arg.table = pv.table[query[v.i].table];
        
            v.step = 3.3; // 処理実行
            v.result = v.func(query[v.i].arg);
            console.log(`l.350 v.result=${v.result}`)
            if( v.result instanceof Error ){
        
              v.step = 3.31; // selectRow, updateRow他のcommand系メソッドでエラー発生
              // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
              Object.assign(v.queryResult,{
                isErr: true,
                message: v.result.message
              });
              v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                result: false,
                message: v.result.message,
                // before, after, diffは空欄
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
        
            } else {
        
              v.step = 3.32; // command系メソッドが正常終了した場合の処理
              if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){
                v.step = 3.321; // select, schemaは結果をdataにセット
                v.queryResult.data = v.result;
                v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                  result: true,
                  // messageは空欄
                  // before, diffは空欄、afterに出力件数をセット
                  after: query[v.i].command === 'select' ? `rownum=${v.result.length}` : null,
                });
                if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
              } else {
                v.step = 3.322; // update, append, deleteは実行結果(sdbLog)をlogにセット
                v.queryResult.log = v.result;
              }
            }
        
          } else {
        
            v.step = 3.4; // isOKではない場合
            v.msg = `シート「${query[v.i].table}」に対して'${query[v.i].command}'する権限がありません`;
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.msg,
            });
            v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
              result: false,
              message: v.msg,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
          }
          
          v.step = 3.5; // 実行結果を戻り値に追加
          v.rv.push(v.queryResult);
        }
  
        v.step = 3.6; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        console.log(`l.407 v.rv=${JSON.stringify(v.rv)}`)
        v.r = appendRow({
          table: pv.table[pv.opt.log],
          record: v.rv.log
        });
        if( v.r instanceof Error ) throw v.r;
  
        v.step = 3.7; // ロック解除
        v.lock.releaseLock();
        v.tryNo = 0;
      }
    }
  
    v.step = 9; // 終了処理
    console.log(`${pv.whois} normal end.`);
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
   */
  function appendRow(arg){
    const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[]};
    console.log(`${v.whois} start.`);
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
          result: true,
          //message, before, after, diffは後工程で追加
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
          arg.record[v.i][v.dv] = arg.table.schema.deleteRow[v.dv](arg.record[v.i]);
        }
  
        v.step = 2.4; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(arg.record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.log.result = false;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.log.message = v.log.message === null ? [] : v.log.message.split('\n');
            v.log.message.push(`${v.unique}欄の値「${arg.record[v.i][v.unique]}」が重複しています`);
            v.log.message = v.log.message.join('\n');
          } else {
            // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.record[v.i][v.unique]);
          }
        }
  
        v.step = 2.5; // 正当性チェックOKの場合の処理
        if( v.log.result ){
  
          v.step = 2.51; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<arg.table.header.length ; v.j++ ){
            v.row[v.j] = arg.record[v.i][arg.table.header[v.j]];
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
      console.log(`${v.whois} normal end.`);
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
    const v = {whois:pv.whois+'.convertRow',step:0,rv:{}};
    console.log(`${v.whois} start.`);
    try {
  
      if( Array.isArray(data)[0] ){
        v.step = 1; // シートイメージ -> 行オブジェクト
        v.rv.raw = data;
        v.rv.obj = [];
        v.rv.header = data[0];
        for( v.i=0 ; v.i<data.length ; v.i++ ){
          v.o = {};
          for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
            if( data[v.i][v.j] ){
              v.o[data[0][v.j]] = data[v.i][v.j];
            }
          }
          v.rv.obj.push(v.o);
        }
      } else {
        v.step = 2; // 行オブジェクト -> シートイメージ
        v.rv.raw = [];
        v.rv.obj = data;
        v.rv.header = Object.keys(data[0]);
        for( v.map={},v.i=0 ; v.i<v.rv.header ; v.i++ ){
          v.map[v.rv.header[v.i]] = v.i;
        }
        for( v.i=0 ; v.i<data.length ; v.i++ ){
          v.arr = [];
          for( v.j in data[v.i] ){
            if( v.map[v.j] === undefined ){
              // 未登録の項目があれば追加
              v.map[v.j] = v.rv.header.length;
              v.rv.header.push(v.j);
            }
            v.arr[v.map[v.j]] = data[v.i][v.j];
          }
        }
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
   * @param {string} arg.name - テーブル名
   * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
   * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
   * @returns {sdbLog}
   */
  function createTable(arg){
    const v = {whois:`${pv.whois}.createTable`,step:0,rv:[]};
    console.log(`${v.whois} start. arg.name=${arg.name}`);
    try {
  
      v.step = 1.1; // 一件分のログオブジェクトを作成
      v.log = genLog({
        table: arg.name,
        command: 'create',
        arg: arg.cols,
        result: true,
        after: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
        // before, diffは空欄
      });
      if( v.log instanceof Error ) throw v.log;
  
      v.step = 1.2; // sdbTableのプロトタイプ作成
      pv.table[arg.name] = v.table = {
        name: arg.name, // {string} テーブル名(範囲名)
        account: pv.opt.user ? pv.opt.user.id : null, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };
  
      // ----------------------------------------------
      // テーブル管理情報の作成
      // ----------------------------------------------
  
      if( arg.cols ){ // 項目定義情報が存在する場合
  
        v.step = 2; // 項目定義が存在する場合
        v.table.header = arg.cols.map(x => x.name);
        v.table.colnum = v.table.header.length;
  
        if( arg.values ){
  
          v.step = 3; // 項目定義と初期データの両方存在 ⇒ 項目の並びを指定してconvertRow
          v.convertRow = convertRow(arg.values,v.table.header);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.values = v.convertRow.obj;
          v.table.rownum = v.convertRow.raw.length;
  
        } else {
  
          v.step = 4; // 項目定義のみ存在 ⇒ values, rownumは取得不能なので既定値のまま
          v.convertRow = null;
  
        }
  
      } else { // 項目定義情報が存在しない場合
  
        if( arg.values ){
  
          v.step = 5; // 項目定義不在で初期データのみ存在の場合
          v.convertRow = convertRow(arg.values);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.values = v.convertRow.obj;
          v.table.header = v.convertRow.header;
          v.table.colnum = v.table.header.length;
          v.table.rownum = v.convertRow.raw.length;
  
        } else {
          v.step = 6; // シートも項目定義も初期データも無いならエラー
          throw new Error(`シートも項目定義も初期データも存在しません`);
        }
      }
  
      v.step = 7; // スキーマをインスタンス化
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
      v.step = 8; // シートが存在しない場合、新規追加
      // ----------------------------------------------
      v.step = 8.1; // シートの追加
      v.table.sheet = pv.spread.insertSheet();
      v.table.sheet.setName(arg.name);
  
      v.step = 8.2; // シートイメージのセット
      v.data = [v.table.header, ...(v.convertRow === null ? [] : v.convertRow.raw)];
      v.table.sheet.getRange(1,1,v.data.length,v.table.colnum).setValues(v.data);
      v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
  
      v.step = 8.3; // 項目定義メモの追加
      v.table.sheet.getRange(1,1,1,v.table.colnum).setNotes([v.table.notes]);
  
      v.step = 9; // 終了処理
      v.rv = [v.log];
      console.log(`${v.whois} normal end.`);
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
   * @param {Object|Function|any} any.where - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  function deleteRow(arg){
    const v = {whois:`${pv.whois}.deleteRow`,step:0,rv:[],whereStr:[]};
    console.log(`${v.whois} start.`);
    try {
  
      // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(arg.where)) arg.where = [arg.where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<arg.where.length ; v.i++ ){
        v.whereStr[v.i] = toString(arg.where[v.i]); // 更新履歴記録用にwhereを文字列化
        arg.where[v.i] = determineApplicable(arg.where[v.i]);
        if( arg.where[v.i] instanceof Error ) throw arg.where[v.i];
      }
  
      v.step = 1.3; // 複数あるwhereのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;arg.where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 2; // 対象レコードか、後ろから一件ずつチェック
      for( v.i=arg.table.values.length-1 ; v.i>=0 ; v.i-- ){
  
        v.step = 2.1; // 対象外判定ならスキップ
        if( v.cond(arg.table.values[v.i]) === false ) continue;
  
        v.step = 2.2; // 一件分のログオブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'delete',
          arg: v.whereStr[v.i],
          result: true,
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
        v.range = arg.table.sheet.deleteRow(v.i+1);
  
        v.step = 2.6; // arg.table.bottomを書き換え
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
  /** determineApplicable: オブジェクト・文字列を基にwhere句の条件に該当するか判断する関数を作成
   * @param {Object|function|any} arg - where句で渡された内容
   * @returns {function}
   *
   * - update/delete他、引数でwhereを渡されるメソッドで使用
   */
  function determineApplicable(arg){
    const v = {whois:`${pv.whois}.determineApplicable`,step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      switch( typeof arg ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg;
          break;
        case 'object':
          v.step = 2.2;
          v.keys = Object.keys(arg);
          if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
            v.step = 2.3; // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o',`return isEqual(o['${arg.key}'],'${arg.value}')`);
          } else {
            v.step = 2.4; // {キー項目名:値}形式での指定の場合
            v.c = [];
            for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o',`return (${v.c.join(' && ')})`);
          }
          break;
        default: v.step = 2.5; // primaryKeyの値指定
          v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
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
    const v = {whois:'SpreadDb.genColumn',step:0,rv:{column:{},note:null},
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
      str2obj: (arg) => {
        const v = {whois:`${pv.whois}.genColumn.str2obj`,step:0,rv:null,
          rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
          isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
        };
        try {
  
          v.step = 1; // コメントの削除
          arg = arg.replace(v.rex,'');
  
          v.step = 2; // JSONで定義されていたらそのまま採用
          v.rv = v.isJSON(arg);
  
          if( v.rv === null ){
            v.step = 3; // 非JSON文字列だった場合、改行で分割
            v.lines = arg.split('\n');
  
            v.step = 4; // 一行毎に属性の表記かを判定
            v.rv = {};
            v.lines.forEach(prop => {
              v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+?)["']?$/);
              if( v.m ) v.rv[v.m[1]] = v.m[2];
            });
  
            v.step = 5; // 属性項目が無ければ項目名と看做す
            if( Object.keys(v.rv).length === 0 ){
              v.rv = {name:arg.trim()};
            }
          }
  
          v.step = 9; // 終了処理
          return v.rv;
  
        } catch(e) {
          e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
          console.error(`${e.message}\nv=${stringify(v)}`);
          return e;
        }
      },
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
      if( whichType(arg,'String') ){
        arg = v.str2obj(arg);
        if( arg instanceof Error ) throw arg;
        v.rv.note = arg;
      }
  
      v.step = 2; // メンバに格納
      v.typedef.map(x => x.name).forEach(x => {
        v.rv.column[x] = arg.hasOwnProperty(x) ? arg[x] : null;
      });
  
      v.step = 3; // defaultを関数に変換
      if( v.rv.column.default !== null && typeof v.rv.column.default === 'string' ){
        v.rv.column.default = new Function('o',v.rv.column.default);
      }
  
      v.step = 4; // auto_incrementをオブジェクトに変換
      if( v.rv.column.auto_increment !== null && String(v.rv.column.auto_increment).toLowerCase() !== 'false' ){
        switch( whichType(v.rv.column.auto_increment) ){
          case 'Array': v.rv.column.auto_increment = {
            base: v.rv.column.auto_increment[0],
            step: v.rv.column.auto_increment[1],
          }; break;
          case 'Number': v.rv.column.auto_increment = {
            base: Number(v.rv.column.auto_increment),
            step: 1,
          }; break;
          default: v.rv.column.auto_increment = {
            base: 1,
            step: 1,
          };
        }
      } else {
        v.rv.column.auto_increment = false;
      }
  
      v.step = 4; // メモの文字列を作成
      if( v.rv.note === null ){
        v.x = [];
        for( v.a in v.rv.column ){
          v.l = `${v.a}: "${v.rv.column[v.a]}"`;
          v.c = v.typedef.find(x => x.name === v.a);
          if( v.c.hasOwnProperty('note') ) v.l += ` // ${v.c.note}`;
          v.x.push(v.l);
        }
        v.rv.note = v.x.join('\n');
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
  /** genLog: sdbLogオブジェクトを生成
   * @param {sdbLog|null} arg - 変更履歴シートの行オブジェクト
   * @returns {sdbLog|sdbColumn[]} 変更履歴シートに追記した行オブジェクト、または変更履歴シート各項目の定義
   */
  function genLog(arg=null){
    const v = {whois:'SpreadDb.genLog',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // 変更履歴シートの項目定義
      v.logDef = [
        {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
        {name:'timestamp',type:'string',note:'更新日時。ISO8601拡張形式'},
        {name:'account',type:'string|number',note:'ユーザの識別子'},
        {name:'table',type:'string',note:'対象テーブル名'},
        {name:'command',type:'string',note:'操作内容(コマンド名)'},
        {name:'arg',type:'string',note:'操作関数に渡された引数'},
        {name:'result',type:'boolean',note:'true:追加・更新が成功'},
        {name:'message',type:'string',note:'エラーメッセージ'},
        {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
        {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
        {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
      ];
      
      if( arg === null ){
        v.step = 2; // 引数が指定されていない場合、変更履歴シート各項目の定義を返す
        v.rv = v.logDef;
      } else {
        v.step = 3; // 引数としてオブジェクトが渡された場合、その値を設定したsdbLogオブジェクトを返す
        v.rv = Object.assign({
          id: Utilities.getUuid(), // {UUID} 一意キー項目
          timestamp: toLocale(new Date()), // {string} 更新日時
          account: pv.opt.user.id, // {string|number} uuid等、更新者の識別子
          // 以下、本関数呼出元で設定する項目
          table: null, // {string} 更新対象となった範囲名(テーブル名)
          command: null, // {string} 操作内容。command系内部関数名のいずれか
          arg: null, // {string} 操作関数に渡された引数
          result: null, // {boolean} true:追加・更新が成功
          message: null, // {string} エラーメッセージ
          before: null, // {JSON} 更新前の行データオブジェクト(JSON)
          after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
          diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
        },arg);
  
        v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
        for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);
  
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
            // auto_incrementのメンバ : base {number} 基数, step {number} 増減値, current {number} 現在の最大(小)値
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
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
        v.step = 3.1; // primaryKey
        if( v.bool(v.rv.schema.cols[v.i].primaryKey) === true ){
          v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }
  
        v.step = 3.2; // unique
        if( v.bool(v.rv.schema.cols[v.i].unique) === true ){
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }
  
        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].base;
        }
  
        v.step = 3.4; // default
        if( String(v.rv.schema.cols[v.i].default).toLowerCase() !== 'null' ){
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
   * @returns {sdbTable|Error}
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
        account: pv.opt.user ? pv.opt.user.id : null, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };
  
  
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
      console.log(`${v.whois} normal end.`);
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
    console.log(`${v.whois} start.`);
    try {
  
      if( typeof arg === 'string' ) arg = [arg];
      arg.forEach(x => v.rv.push(pv.table[x].schema));
  
      v.step = 9; // 終了処理
      v.rv = v.log;
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
   * @returns {Object[]} 該当行オブジェクト
   *
   * - where句の指定方法
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  function selectRow(arg){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[]};
    console.log(`${v.whois} start.`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      // 判定条件を関数に統一
      v.where = determineApplicable(arg.where);
      if( v.where instanceof Error ) throw v.where;
  
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){
        if( v.where(arg.table.values[v.i]) ){
          v.rv.push(arg.table.values[v.i]);
        }
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
  /** 関数・オブジェクトを文字列化 */
  function toString(arg){
    if( typeof arg === 'function' ) return arg.toString();
    if( typeof arg === 'object' ) return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: 領域に新規行を追加
   * @param {Object} any
   * @param {sdbTable} any.table - 操作対象のテーブル管理情報
   * @param {Object|Object[]} any.query
   * @param {Object|Function|any} any.query.where - 対象レコードの判定条件。配列可
   * @param {Object|Function|any} any.query.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  function updateRow(any){
    const v = {whois:`${pv.whois}.updateRow`,step:0,rv:[],
      top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(arg.query.where)) arg.query.where = [arg.query.where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<arg.query.where.length ; v.i++ ){
        v.queryStr = toString(arg.query[v.i].where); // 更新履歴記録用に文字列化
        arg.query[v.i].where = determineApplicable(arg.query[v.i].where);
        if( arg.query[v.i].where instanceof Error ) throw arg.query[v.i].where;
      }
  
      v.step = 1.3; // 複数あるwhereのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;arg.query.where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 1.4; // 更新する値を導出する関数を作成
      // object: {欄名:値}のオブジェクト
      // string: 引数'o'を行オブジェクトとし、上述のobjectを返す関数のソース部分
      for( v.i=0 ; v.i<arg.query.record.length ; v.i++ ){
        v.recordStr[v.i] = toString(arg.query.record[v.i]); // 更新履歴記録用に文字列化
        arg.query.record[v.i] = typeof arg.query.record[v.i] === 'function' ? arg.query.record[v.i]
        : new Function('o',(typeof arg.query.record[v.i] === 'string'
          ? arg.query.record[v.i] : JSON.stringify(arg.query.record[v.i])));
      }
  
      v.step = 2; // 対象となる行オブジェクト判定式の作成
      for( v.i=0 ; v.i<arg.query.length ; v.i++ ){
  
        v.step = 2.1; // where,recordの存否確認
        v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(arg.query[v.i].where)})`;
        if( !arg.query[v.i].where.where ) throw new Error(v.msg.replace('_','位置指定(where)'));
        if( !arg.query[v.i].where.record ) throw new Error(v.msg.replace('_','更新データ(record)'));
  
        v.step = 2.2; // 該当レコードかの判別用関数を作成
        v.queryStr = toString(arg.query[v.i].query); // 更新履歴記録用に文字列化
        arg.query[v.i].where = determineApplicable(arg.query[v.i].where);
        if( arg.query[v.i].where instanceof Error ) throw arg.query[v.i].where;
  
        v.step = 2.3; // 更新する値を導出する関数を作成
        // object: {欄名:値}のオブジェクト
        // string: 引数'o'を行オブジェクトとし、上述のobjectを返す関数のソース部分
        arg.query.record[v.i] = typeof arg.query.record[v.i] === 'function'
        ? arg.query.record[v.i] // 関数ならそのまま
        : new Function('o',(typeof arg.query.record[v.i] === 'string'
        ? arg.query.record[v.i] // 文字列なら導出関数のソース
        : JSON.stringify(arg.query.record[v.i])));  // オブジェクトならそのまま返す関数
  
  
        // 対象レコードか一件ずつチェック
        for( v.j=0 ; v.j<arg.table.values.length ; v.j++ ){
  
          v.step = 3.1; // 対象外判定ならスキップ
          if( v.where(arg.table.values[v.j]) === false ) continue;
  
          v.step = 3.2; // v.before: 更新前の行オブジェクトのコピー
          [v.after,v.diff] = [{},{}];
  
          v.step = 3.3; // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.record(arg.table.values[v.j]);
  
          v.step = 3.4; // シート上の項目毎にチェック
          arg.table.header.forEach(x => {
            if( v.rObj.hasOwnProperty(x) && !isEqual(v.before[x],v.rObj[x]) ){
              v.step = 3.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
              v.after[x] = v.diff[x] = v.rObj[x];
              v.step = 3.42; // 更新対象範囲の見直し
              v.colNo = arg.table.header.findIndex(y => y === x);
              v.left = Math.min(v.left,v.colNo);
              v.right = Math.max(v.right,v.colNo);
            } else {
              v.step = 3.43; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          })
  
          v.step = 3.5; // 更新履歴オブジェクトを作成
          v.log = genLog({
            table: arg.table.name,
            command: 'update',
            arg: v.queryStr,
            result: true,
            before: arg.table.values[v.i],
            after: v.after,
            diff: v.diff,
          });
          if( v.log instanceof Error ) throw v.log;
          v.rv.push(v.log);
    
          v.step = 3.6; // 更新レコードの正当性チェック(unique重複チェック)
          for( v.unique in arg.table.schema.unique ){
            if( arg.table.schema.unique[v.unique].indexOf(arg.query[v.i].where[v.unique]) >= 0 ){
              v.step = 3.61; // 登録済の場合はエラーとして処理
              v.log.result = false;
              // 複数項目のエラーメッセージに対応するため場合分け
              v.log.message = (v.log.message === null ? '' : '\n')
              + `${v.unique}欄の値「${arg.query[v.i].where[v.unique]}」が重複しています`;
            } else {
              v.step = 3.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
              arg.table.schema.unique[v.unique].push(arg.query[v.i].where[v.unique]);
            }
          }
  
          v.step = 3.7; // 正当性チェックOKの場合の処理
          if( v.log.result === true ){
            v.top = Math.min(v.top, v.j);
            v.bottom = Math.max(v.bottom, v.j);
            arg.table.values[v.j] = v.after;
          }
  
          v.step = 2.8; // 成否に関わらずログ出力対象に保存
          v.rv.push(v.log);
        }
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
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
      if( v.target.length > 0 ){
        arg.table.sheet.getRange(
          v.top +1,  // +1(添字->行番号)
          v.left,
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
}

