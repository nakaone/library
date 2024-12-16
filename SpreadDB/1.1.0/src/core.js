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

    v.step = 1.1; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      user: null, // {number|string}=null ユーザのアカウント情報。nullの場合、権限のチェックは行わない
      account: null, // {string}=null アカウント一覧のテーブル名
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: null, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: null, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
    },opt);

    v.step = 1.2; // メンバ登録：内部設定項目
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

  //::$src/genTable.js::
  //::$src/genSchema.js::
  //::$src/genColumn.js::
  //::$src/convertRow.js::
  //::$src/selectRow.js::
  //::$src/appendRow.js::
  //::$src/updateRow.js::
  //::$src/deleteRow.js::
  //::$src/getSchema.js::
}