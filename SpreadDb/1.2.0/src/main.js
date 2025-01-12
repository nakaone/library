/** main: SpreadDb主処理 */
const v = {step:0,rv:[],log:[]};
const pv = {whois:'SpreadDb',jobId:0};  // 擬似メンバ変数としてSpreadDb内で共有する値
try {

  v.step = 1.1;
  if( !Array.isArray(query) ) query = [query];  // 配列可の引数は配列に統一
  v.fId = ``; // 何を対象にした処理かを特定する文字列
  console.log(`${pv.whois} start${v.fId}`);

  v.step = 1.2; // メンバに引数・初期値をセット
  v.r = constructor(query,opt);
  if( v.r instanceof Error ) throw v.r;

  v.step = 2; // スプレッドシートのロックを取得
  v.lock = LockService.getDocumentLock();

  for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){

    v.step = 3; // スプレッドシートのロック
    if( v.lock.tryLock(pv.opt.interval) ){

      v.step = 4; // クエリを順次処理
      for( v.i=0 ; v.i<pv.query.length ; v.i++ ){

        v.step = 5; // クエリのメンバに既定値設定
        v.r = objectizeColumn('sdbQuery');
        if( v.r instanceof Error ) throw v.r;
        pv.query[v.i] = Object.assign(v.r,pv.query[v.i],{userId:pv.opt.userId});

        v.step = 6; // クエリの実行
        v.r = doQuery(pv.query[v.i]);
        if( v.r instanceof Error ) throw v.r;

        // 変更履歴の保存
        v.step = 7.1; // クエリ単位の実行結果
        v.r = objectizeColumn('sdbLog');
        if( v.r instanceof Error ) throw v.r;
        v.qLog = Object.assign(v.r,pv.query[v.i]);
        v.qLog.data = pv.query[v.i].command === 'create' ? JSON.stringify(pv.query[v.i].cols) : (pv.query[v.i].where || '')
        v.log.push(v.qLog);

        v.step = 7.2; // レコード単位の実行結果
        for( v.j=0 ; v.j<query[v.i].result.length ; v.j++ ){
          v.log.push({
            queryId: v.qLog.queryId,
            pKey: query[v.i].result[v.j].pKey,
            rSts: query[v.i].result[v.j].rSts,
            diff: query[v.i].result[v.j].diff,
          });
        }
      }

      v.step = 8; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
      v.r = appendRow({
        table: pv.opt.log,
        record: v.log,
      });
      if( v.r instanceof Error ) throw v.r;

      v.step = 9; // ロック解除
      v.lock.releaseLock();
      v.tryNo = -1; // maxTrial回ロック失敗時(=0)と判別するため、負数をセット
    }
  }

  v.step = 10; // ロックができたか判定、不能時はエラー
  if( v.tryNo === 0 ) throw new Error("Couldn't Lock");

  v.step = 11; // 終了処理
  console.log(`${v.whois} normal end${v.fId}`);
  return v.rv;

} catch(e) {
  e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
  console.error(`${e.message}\nv=${JSON.stringify(v,(key,val)=>typeof val==='function'?val.toString():val,2)}`);
  return e;
}