/** main: SpreadDb主処理 */
const v = {step:0,rv:[],log:[]};
const pv = {whois:'SpreadDb'};  // 擬似メンバ変数としてSpreadDb内で共有する値
try {

  if( !Array.isArray(query) ) query = [query];  // 配列可の引数は配列に統一
  v.fId = ``; // 何を対象にした処理かを特定する文字列
  console.log(`${pv.whois} start${v.fId}`);

  v.step = 1; // メンバに引数・初期値をセット
  v.r = constructor(query,opt);
  if( v.r instanceof Error ) throw v.r;

  v.step = 2; // スプレッドシートのロックを取得
  v.lock = LockService.getDocumentLock();

  for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){

    v.step = 3; // スプレッドシートのロック
    if( v.lock.tryLock(pv.opt.interval) ){

      v.step = 4; // クエリを順次処理
      for( v.i=0 ; v.i<pv.query.length ; v.i++ ){
        // クエリのメンバに既定値設定
        v.r = objectizeColumn('sdbQuery');
        if( v.r instanceof Error ) throw v.r;
        pv.query[v.i] = Object.assign(v.r,pv.query[v.i]);
        // クエリの実行
        v.r = doQuery(pv.query[v.i]);
        if( v.r instanceof Error ) throw v.r;

        // 変更履歴の保存
        // クエリ単位の実行結果
        v.r = objectizeColumn('sdbLog');
        if( v.r instanceof Error ) throw v.r;
        v.qLog = Object.assign(v.r,pv.query[v.i]);
        v.qLog.data = pv.query[v.i].command === 'create' ? pv.query[v.i].cols : (pv.query[v.i].where || '')
        // レコード単位の実行結果、1行目はクエリ単位のそれに追加
        if( query[v.i].result.length > 0 ){
          v.qLog.pKey = query[v.i].result[0].pKey;
          v.qLog.rSts = query[v.i].result[0].rSts;
          v.qLog.diff = query[v.i].result[0].diff;
        }
        v.log.push(v.qLog);
        // レコード単位の実行結果、2行目以降
        for( v.j=1 ; v.j<query[v.i].result.length ; v.j++ ){
          v.log.push({
            queryId: v.qLog.queryId,
            pKey: query[v.i].result[v.j].pKey,
            rSts: query[v.i].result[v.j].rSts,
            diff: query[v.i].result[v.j].diff,
          });
        }
      }

      v.step = 13; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
      v.r = appendRow({
        table: pv.opt.log,
        record: v.log,
      });
      if( v.r instanceof Error ) throw v.r;

      v.step = 14; // ロック解除
      v.lock.releaseLock();
      v.tryNo = -1; // maxTrial回ロック失敗時(=0)と判別するため、負数をセット
    }
  }
  if( v.tryNo === 0 ) throw new Error("Couldn't Lock");

  v.step = 9; // 終了処理
  console.log(`${v.whois} normal end${v.fId}`);
  return v.rv;

} catch(e) {
  e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
  console.error(`${e.message}\nv=${JSON.stringify(v,(key,val)=>typeof val==='function'?val.toString():val,2)}`);
  return e;
}