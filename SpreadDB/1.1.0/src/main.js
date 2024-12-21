/**
 * main: SpreadDb主処理
 */
const v = {step:0,rv:[],log:[]};
const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
console.log(`${pv.whois} start.`);
try {

  v.step = 1.1; // メンバ登録：起動時オプション
  pv.opt = Object.assign({
    userId: 'guest', // {string} ユーザの識別子
    userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
    log: 'log', // {string}='log' 更新履歴テーブル名
    maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
    interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
    guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
    adminId: 'Administrator', // {string} 管理者として扱うuserId
  },opt);

  v.step = 1.2; // メンバ登録：内部設定項目
  Object.assign(pv,{
    spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
    sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
    table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
    log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
  });

  v.step = 2; // 変更履歴テーブルのsdbTable取得。無ければ作成
  v.r = genTable({name:pv.opt.log});
  if( v.r instanceof Error ) throw v.r;
  if( v.r === null ){
    v.r = createTable({
      name: pv.opt.log,
      cols: genLog(), // sdbLog各項目の定義集
    });
    if( v.r instanceof Error ) throw v.r;
  } else {
    pv.table[pv.opt.log] = v.r;
  }

  v.step = 3; // queryを順次処理処理

  if( !Array.isArray(query) ) query = [query];  // queryを配列化
  v.lock = LockService.getDocumentLock(); // スプレッドシートのロックを取得

  for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
    if( v.lock.tryLock(pv.opt.interval) ){

      v.step = 3.1; // ロック成功、シートの更新処理開始
      for( v.i=0 ; v.i<query.length ; v.i++ ){

        v.step = 3.11; // 戻り値、ログの既定値を設定
        v.queryResult = {query:query[v.i],isErr:false,message:'',data:null,log:null};

        v.step = 3.12; // 操作対象のテーブル管理情報が無ければ作成
        if( !Object.hasOwn(pv.table,query[v.i].table) ){
          v.r = genTable({name:query[v.i].table});
          if( v.r instanceof Error ) throw v.r;
          pv.table[query[v.i].table] = v.r;
        }

        v.step = 3.13; // ユーザの操作対象シートに対する権限をv.allowにセット
        v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
        : ( pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query[v.i].table] || '')  // ゲスト(userId指定無し)
        : ( pv.opt.userAuth[query[v.i].table] || ''));  // 通常ユーザ

        v.step = 3.14; // createでテーブル名を省略した場合は補完
        if( query[v.i].command === 'create' && !Object.hasOwn(query[v.i],'table') ){
          query[v.i].table = query[v.i].arg.name;
        }

        v.step = 3.2; // 処理内容を元に、必要とされる権限が与えられているか確認
        if( v.allow.includes('o') ){

          v.step = 3.21;
          // o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
          // また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
          //read/writeは自分のみ可、delete/schemaは実行不可
          query[v.i].arg.where = pv.opt.userId;  // 自レコードのみ対象に限定
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

          v.step = 3.3; // 処理実行
          if( query[v.i].command !== 'create' ){
            // create以外の場合、操作対象のテーブル管理情報をcommand系メソッドの引数に追加
            if( !pv.table[query[v.i].table] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
              pv.table[query[v.i].table] = genTable({name:query[v.i].table});
              if( pv.table[query[v.i].table] instanceof Error ) throw pv.table[query[v.i].table];
            }
            query[v.i].arg.table = pv.table[query[v.i].table];
          }
          v.sdbLog = v.func(query[v.i].arg);

          if( v.sdbLog instanceof Error ){

            v.step = 3.31; // selectRow, updateRow他のcommand系メソッドでエラー発生
            // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.sdbLog.message
            });
            v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
              result: false,
              message: v.sdbLog.message,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

          } else {

            v.step = 3.32; // command系メソッドが正常終了した場合の処理
            if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){
              v.step = 3.321; // select, schemaは結果をdataにセット
              v.queryResult.data = v.sdbLog;
              v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                result: true,
                // messageは空欄
                // before, diffは空欄、afterに出力件数をセット
                after: query[v.i].command === 'select' ? `rownum=${v.sdbLog.length}` : null,
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
            } else {
              v.step = 3.322; // update, append, deleteは実行結果(sdbLog)をlogにセット
              v.queryResult.log = v.sdbLog;
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
      v.r = appendRow({
        table: pv.table[pv.opt.log],
        record: v.rv.map(x => x.log)[0],
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