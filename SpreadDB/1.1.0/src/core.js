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

  //::$src/constructor.js::
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