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
            action: v.l.action,
            record: v.l.after || v.l.before,
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