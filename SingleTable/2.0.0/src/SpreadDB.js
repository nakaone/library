//::$src/sdbTable.js::
//::$src/sdbSchema.js::
//::$src/sdbColumn.js::
//::$src/sdbLog.js::
class SpreadDB {

  //::$src/SpreadDB.constructor.js::

  /** transact: シートの操作
   * 
   * @param trans {Object|Object[]} - 以下のメンバを持つオブジェクト(の配列)
   * @param trans.name {string} - 更新対象範囲名
   * @param trans.action {string} - 操作内容。"append", "update", "delete"のいずれか
   * @param trans.arg {Object|Object[]} - append/update/deleteの引数
   * @param opt={} {Object} - オプション
   * @param opt.getLogFrom=null {string|number|Date} - 取得する更新履歴オブジェクトの時刻指定
   * @param opt.getLogOption={} {Object} - getLogFrom≠nullの場合、getLogメソッドのオプション
   * @returns 
   * 
   * - GAS公式 Class LockService [getDocumentLock()](https://developers.google.com/apps-script/reference/lock/lock-service?hl=ja#getDocumentLock())
   * - Qiita [GASの排他制御（ロック）の利用方法を調べた](https://qiita.com/kyamadahoge/items/f5d3fafb2eea97af42fe)
   */
  transact(trans,opt={}){
    const v = {whois:this.constructor.name+'.transact',step:0,rv:[]};
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
      if( v.lock.tryLock(10000) ){

        v.step = 2.1; // シートの更新処理
        for( v.i=0 ; v.i<trans.length ; v.i++ ){
          if( ['append','update','delete'].find(x => x === trans[v.i].action) ){
            v.r = this.tables[trans[v.i].name][trans[v.i].action](trans[v.i].arg);
            if( v.r instanceof Error ) throw v.r;
            v.rv = [...v.rv, ...v.r];
          }
        }

        v.step = 2.2; // 更新履歴の取得
        if( v.opt.getLogFrom !== null ){
          v.r = this.getLog(v.opt.getLogFrom,v.opt.getLogOption);
          if( v.r instanceof Error ) throw v.r;
          v.rv = {result:v.rv,data:v.r};
        }

        v.step = 2.3; // ロック解除
        v.lock.releaseLock();
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

  /** getLog: 指定時刻以降の変更履歴を取得
   * @param datetime=null {string} - Date型に変換可能な日時文字列
   * @param opt={} {Object} - オプション
   * @param opt.cols=null {boolean} 各項目の定義集も返す
   * @param opt.excludeErrors=true {boolean} エラーログを除く
   * @param opt.simple=true {boolean} 戻り値のログ情報の項目を絞り込む
   * @returns {Object} {success:[],failure:[]}形式
   */
  getLog(datetime=null,opt={}){
    const v = {whois:this.constructor.name+'.delete',step:0,rv:{}};
    console.log(`${v.whois} start.\ndatetime(${whichType(datetime)})=${stringify(datetime)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {

      v.step = 1; // 事前準備
      v.datetime = datetime === null ? -Infinity : new Date(datetime).getTime();
      v.opt = Object.assign({
        cols: datetime === null ? true : false,
        excludeErrors: true,
        simple: true,
      },opt);

      v.step = 2; // 戻り値lastReferenceの設定
      v.rv.lastReference = toLocale(new Date());

      v.step = 3; // 戻り値colsの設定
      if( v.opt.cols ){
        v.rv.cols = {};
        for( v.table in this.tables ){
          v.rv.cols[v.table] = this.tables[v.table].schema.cols;
        }
      }

      v.step = 4; // 戻り値logの設定
      v.rv.log = [];
      for( v.i=0 ; v.i<this.log.values.length ; v.i++ ){
        v.l = this.log.values[v.i];
        if( new Date(v.l.timestamp).getTime() > v.datetime ){
          if( v.l.result === false && v.opt.excludeErrors === true ) continue;
          if( v.opt.simple ){
            v.rv.log.push({
              range: v.l.range,
              action: v.l.before ? (v.l.after ? 'update' : 'delete') : 'append',
              record: v.l.before && !v.l.after ? v.l.before : v.l.after,
            });
          } else {
            v.rv.log.push(v.l);
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
}