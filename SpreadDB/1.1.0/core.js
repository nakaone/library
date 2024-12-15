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
  const v = {step:0,rv:null};
  const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
  console.log(`${pv.whois} start.`);
  try {

    constructor(query,opt);

    v.step = 9; // 終了処理
    console.log(`${pv.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  /** transact: シートの操作
   *
   * @param trans {Object|Object[]} - 以下のメンバを持つオブジェクト(の配列)
   * @param trans.name {string} - 更新対象範囲名
   * @param trans.action {string} - 操作内容。"append", "update", "delete"のいずれか
   * @param trans.arg {Object|Object[]} - append/update/deleteの引数
   * @param opt={} {Object} - オプション
   * @param opt.getLogFrom=null {string|number|Date} - 取得する更新履歴オブジェクトの時刻指定
   * @param opt.getLogOption={} {Object} - getLogFrom≠nullの場合、getLogメソッドのオプション
   * @returns {Object|Object[]} opt.getLogForm=nullの場合、更新履歴オブジェクトの配列。≠nullの場合、{result:更新履歴オブジェクトの配列,data:getLogの戻り値}
   *
   * - GAS公式 Class LockService [getDocumentLock()](https://developers.google.com/apps-script/reference/lock/lock-service?hl=ja#getDocumentLock())
   * - Qiita [GASの排他制御（ロック）の利用方法を調べた](https://qiita.com/kyamadahoge/items/f5d3fafb2eea97af42fe)
   */
  function transact(trans,opt={}){
    const v = {whois:pv.whois+'.transact',step:0,rv:[]};
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}\nopt=${stringify(opt)}`);
    try {

      v.step = 1; // 事前準備
      v.step = 1.1; // 引数transを配列化
      if( !Array.isArray(trans) ) trans = [trans];
      v.step = 1.2; // オプションに既定値を設定
      v.opt = Object.assign({
        getLogFrom: null,
        getLogOption: {},
      },opt);

      v.step = 2; // スプレッドシートをロックして更新処理
      v.lock = LockService.getDocumentLock();

      for( v.tryNo=pv.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
        if( v.lock.tryLock(pv.interval) ){
    
          v.step = 2.1; // シートの更新処理
          for( v.i=0 ; v.i<trans.length ; v.i++ ){
            if( ['append','update','delete'].find(x => x === trans[v.i].action) ){
              v.r = pv.tables[trans[v.i].name][trans[v.i].action](trans[v.i].arg);
              if( v.r instanceof Error ) throw v.r;
              v.rv = [...v.rv, ...v.r];
            }
          }
    
          v.step = 2.2; // 更新履歴の取得
          if( v.opt.getLogFrom !== null ){
            v.r = pv.getLog(v.opt.getLogFrom,v.opt.getLogOption);
            if( v.r instanceof Error ) throw v.r;
            v.rv = {result:v.rv,data:v.r};
          }
    
          v.step = 2.3; // ロック解除
          v.lock.releaseLock();
          v.tryNo = 0;
        }
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

  /** @constructor */
  function constructor(query,opt){
    const v = {whois:`${pv.whois}.constructor`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1.1; // 起動時オプション
      pv.opt = Object.assign({
        user: null, // {number|string}=null ユーザのアカウント情報。nullの場合、権限のチェックは行わない
        account: null, // {string}=null アカウント一覧のテーブル名
        log: 'log', // {string}='log' 更新履歴テーブル名
        maxTrial: null, // number}=5 シート更新時、ロックされていた場合の最大試行回数
        interval: null, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
      },opt);
  
      v.step = 1.2; // 内部設定項目
      Object.assign(pv,{
        spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
        sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
        table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
        log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
      });
  
      v.step = 2; // 変更履歴出力指定ありなら「変更履歴」テーブル情報の既定値をpv.tableに追加
      if( pv.opt.log ){
        pv.table[pv.opt.log] = genTable({
          name: pv.opt.log,
          cols: [
            {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
            {name:'timestamp',type:'string',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
            {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
            {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
            {name:'action',type:'string',note:'操作内容。append/update/delete/getLogのいずれか',default:(o={})=>o.action||null},
            {name:'argument',type:'string',note:'操作関数に渡された引数',default:(o={})=>
              o.hasOwnProperty('argument')?(typeof o.argument === 'string' ? o.argument : JSON.stringify(o.argument)):null},
            {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
            {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
            {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.hasOwnProperty('before')?JSON.stringify(o.before):null},
            {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.hasOwnProperty('after')?JSON.stringify(o.after):null},
            {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',
              default:(o={})=>o.hasOwnProperty('diff')?JSON.stringify(o.diff):null},
          ],
        });
        if( pv.table[pv.opt.log] instanceof Error ) throw pv.table[pv.opt.log];
      }
      console.log(`l.292 pv.table[${pv.opt.log}]=${JSON.stringify(pv.table[pv.opt.log],null,2)}`);
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
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
  
  
      if( v.rv.sheet !== null ){
        // ----------------------------------------------
        v.step = 2; // シートが存在する場合の戻り値作成処理
        // ----------------------------------------------
  
        v.step = 2.1; // シートイメージから各種情報を取得
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
  
      } else {
        // ----------------------------------------------
        // シートが存在しない場合の戻り値作成処理
        // ----------------------------------------------
  
        if( arg.cols ){
  
          v.step = 3; // 項目定義が存在する場合
          v.rv.header = arg.cols.map(x => x.name);
          v.rv.colnum = v.rv.header.length;
          if( arg.values ){
            // 項目定義と初期データの両方存在 ⇒ 項目の並びを指定してconvertRow
            v.convertRow = convertRow(arg.values,v.rv.header);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.rv.values = v.convertRow.obj;
            v.rv.rownum = v.convertRow.raw.length;
          } else {
            // 項目定義のみ存在 ⇒ values, rownumは取得不能なので既定値のまま
            v.convertRow = null;
          }
  
        } else {
          if( arg.values ){
            v.step = 4; // 項目定義不在で初期データのみ存在の場合
            v.convertRow = convertRow(arg.values);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.rv.values = v.convertRow.obj;
            v.rv.header = v.convertRow.header;
            v.rv.colnum = v.rv.header.length;
            v.rv.rownum = v.convertRow.raw.length;  
          } else {
            // シートも項目定義も初期データも無いならエラー
            throw new Error(`シートも項目定義も初期データも存在しません`);            
          }
        }
  
        v.step = 5; // スキーマをインスタンス化
        v.r = genSchema({
          cols: arg.cols || null,
          header: v.rv.header,
          notes: v.rv.notes,
          values: v.rv.values,
        });
        if( v.r instanceof Error ) throw v.r;
        v.rv.schema = v.r.schema;
        v.rv.notes = v.r.notes;
  
        // ----------------------------------------------
        v.step = 6; // シートが存在しない場合、新規追加
        // ----------------------------------------------
        v.step = 6.1; // シートの追加
        v.rv.sheet = pv.spread.insertSheet();
        v.rv.sheet.setName(arg.name);
  
        v.step = 6.2; // シートイメージのセット
        v.data = [v.rv.header, ...(v.convertRow === null ? [] : v.convertRow.raw)];
        v.rv.sheet.getRange(1,1,v.data.length,v.rv.colnum).setValues(v.data);
  
        v.step = 6.3; // 項目定義メモの追加
        console.log(`l.391 v.rv.column=${JSON.stringify(v.rv.column)}\nv.rv.notes=${JSON.stringify(v.rv.notes)}`)
        v.rv.sheet.getRange(1,1,1,v.rv.colnum).setNotes([v.rv.notes]);
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
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
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
              v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
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
  
      v.step = 3; // auto_incrementをオブジェクトに変換
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
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
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
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** selectRow: テーブルから該当行を抽出
   * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
   * @returns {sdbLog[]}
   */
  function selectRow(record){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[],argument:JSON.stringify(record)};
    console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
  
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
  /** updateRow: 領域に新規行を追加
   * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
   * @param {Object|Function|any} trans.where - 対象レコードの判定条件
   * @param {Object|Function} trans.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  function updateRow(trans=[]){
    const v = {whois:'sdbTable.updateRow',step:0,rv:[],log:[],target:[],
      top:Infinity,left:Infinity,right:0,bottom:0,argument:JSON.stringify(trans),
      header: pv.schema.cols.map(x => x.name), // 項目一覧
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
      if( !Array.isArray(trans)) trans = [trans];
  
      // 対象となる行オブジェクト判定式の作成
      for( v.i=0 ; v.i<trans.length ; v.i++ ){
  
        v.step = 1.1; // where,recordの存否確認
        v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
        if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
        if( !trans[v.i].record ) throw new Error(v.msg.replace('_','更新データ(record)'));
  
        v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
        v.where = pv.functionalize(trans[v.i].where);
        if( v.where instanceof Error ) throw v.where;
  
        v.step = 1.3; // recordがオブジェクトなら関数化
        v.record = typeof trans[v.i].record === 'function' ? trans[v.i].record
        : new Function('o',`return ${JSON.stringify(trans[v.i].record)}`);
  
        // 対象レコードか一件ずつチェック
        for( v.j=0 ; v.j<pv.values.length ; v.j++ ){
  
          v.step = 2.1; // 対象外判定ならスキップ
          if( v.where(pv.values[v.j]) === false ) continue;
  
          v.step = 2.2; // v.before: 更新前の行オブジェクトのコピー
          [v.before,v.after,v.diff] = [Object.assign({},pv.values[v.j]),{},{}];
  
          v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.record(pv.values[v.j]);
  
          v.step = 2.4; // シート上の項目毎にチェック
          v.header.forEach(x => {
            if( v.rObj.hasOwnProperty(x) && !isEqual(v.before[x],v.rObj[x]) ){
              v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
              v.after[x] = v.diff[x] = v.rObj[x];
              v.colNo = v.header.findIndex(y => y === x);
              v.left = Math.min(v.left,v.colNo);
              v.right = Math.max(v.right,v.colNo);
            } else {
              v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          })
  
          v.step = 2.5; // 更新履歴オブジェクトを作成
          v.logObj = new sdbLog({account:pv.account,range:pv.name,
            action:'update',argument:v.argument,before:v.before,after:v.after,diff:v.diff});
  
          v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
          for( v.unique in pv.schema.unique ){
            if( pv.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
              v.step = 2.61; // 登録済の場合はエラーとして処理
              v.logObj.result = false;
              // 複数項目のエラーメッセージに対応するため場合分け
              v.logObj.message = (v.logObj.message === null ? '' : '\n')
              + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
            } else {
              v.step = 2.62; // 未登録の場合pv.sdbSchema.uniqueに値を追加
              pv.schema.unique[v.unique].push(trans[v.i][v.unique]);
            }
          }
  
          v.step = 2.7; // 正当性チェックOKの場合の処理
          if( v.logObj.result === true ){
            v.top = Math.min(v.top, v.j);
            v.bottom = Math.max(v.bottom, v.j);
            pv.values[v.j] = v.after;
          }
  
          v.step = 2.8; // 成否に関わらずログ出力対象に保存
          v.log.push(v.logObj);
        }
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(pv.values[v.i][v.header[v.j]] || null);
        }
        v.target.push(v.row);
      }
      vlog(v,['target','top','left'],1022)
  
      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 ){
        pv.sheet.getRange(
          pv.top + v.top +1,  // +1(添字->行番号)
          pv.left + v.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
  
      v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( pv.log !== null && v.log.length > 0 ){
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
  /** deleteRow: 領域から指定行を物理削除
   * @param {Object|Function|any} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  function deleteRow(where){
    const v = {whois:'sdbTable.deleteRow',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
      // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(where)) where = [where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<where.length ; v.i++ ){
        where[v.i] = pv.functionalize(where[v.i]);
        if( where[v.i] instanceof Error ) throw where[v.i];
      }
      v.step = 1.3; // 引数argのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 2; // 対象レコードか一件ずつチェック
      for( v.i=pv.values.length-1 ; v.i>=0 ; v.i-- ){
  
        v.step = 2.1; // 対象外判定ならスキップ
        if( v.cond(pv.values[v.i]) === false ) continue;
  
        v.step = 2.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:pv.account,range:pv.name,
          action:'delete',argument:v.argument,before:pv.values[v.i]});
        v.logObj.diff = v.logObj.before;
        v.log.push(v.logObj);
  
        v.step = 2.3; // 削除レコードのunique項目をpv.schema.uniqueから削除
        // pv.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in pv.schema.unique ){
          if( pv.values[v.i][v.unique] ){
            v.idx = pv.schema.unique[v.unique].indexOf(pv.values[v.i][v.unique]);
            if( v.idx >= 0 ) pv.schema.unique[v.unique].splice(v.idx,1);
          }
        }
  
        v.step = 2.4; // pv.valuesから削除
        pv.values.splice(v.i,1);
  
        v.step = 2.5; // シートのセルを削除
        v.range = pv.sheet.getRange(
          pv.top + v.i + 1,  // +1(添字->行番号)
          pv.left,
          1,
          pv.right - pv.left + 1,
        );
        v.range.deleteCells(SpreadsheetApp.Dimension.ROWS);
  
        v.step = 2.6; // pv.bottomを書き換え
        pv.bottom = pv.bottom - 1;
  
      }
  
      v.step = 3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( pv.log !== null && v.log.length > 0 ){
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
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {string|string[]} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   */
  function getSchema(where){
    const v = {whois:'sdbTable.getSchema',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
  
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
}

