/**
 * main: SpreadDb主処理
 */
const v = {step:0,rv:[],log:[]};
const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
console.log(`${pv.whois} start.`);
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
    sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
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
        v.step = 3.1; //実行結果オブジェクト(v.queryResult)の初期化
        v.queryResult = {query:query[v.i],isErr:false,message:'',rows:null,shcema:null,log:null};

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
              Object.assign(v.queryResult,{
                isErr: true,
                message: `primaryKey未設定のテーブルには追加できません`
              });
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
        if( v.isOK ){

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
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.sdbLog.message
            });
            v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
              isErr: true,
              message: v.sdbLog.message,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

          } else {  // 戻り値がErrorオブジェクト以外

            v.step = 10; // 正常終了時実行結果設定(command系メソッドが正常終了した場合の処理)
            if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){

              v.step = 10.1; // select, schemaは結果をrow/schemaにセット
              v.queryResult[query[v.i].command === 'select' ? 'rows' : 'schema'] = v.sdbLog;
              v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                table: query[v.i].table.name,
                command: query[v.i].command,
                arg: toString(query[v.i].command === 'select' ? query[v.i].where : query[v.i].table),
                isErr: false,
                message: query[v.i].command === 'select' ? `rownum=${v.sdbLog.length}` : '',
                // before, after, diffは空欄
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

            } else {

              v.step = 10.2; // update, append, deleteは実行結果(sdbLog)をlogにセット
              v.queryResult.log = v.sdbLog;
              v.sdbLog.forEach(x => {if( x.isErr === true ){ v.queryResult.isErr = true; }});

            }
          }

        } else {

          v.step = 11; // isOKではない場合、無権限時実行結果設定
          v.msg = `シート「${query[v.i].table}」に対して'${query[v.i].command}'する権限がありません`;
          Object.assign(v.queryResult,{
            isErr: true,
            message: v.msg,
          });
          v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
            isErr: true,
            message: v.msg,
            // before, after, diffは空欄
          });
          if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
        }

        v.step = 12; // 実行結果を戻り値に追加
        v.rv.push(v.queryResult);
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
  console.log(`${pv.whois} normal end.`);
  return v.rv;

} catch(e) {
  e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
  console.error(`${e.message}\nv=${stringify(v)}`);
  return e;
}