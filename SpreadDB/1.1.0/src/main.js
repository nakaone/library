const v = {step:0,rv:[],log:[]};
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
      cols: genLog(), // sdbLog各項目の定義集
    });
    if( pv.table[pv.opt.log] instanceof Error ) throw pv.table[pv.opt.log];
  }

  v.step = 3; // queryを順次処理処理

  v.allow = pv.opt.user === null ? 'rwdos' : pv.opt.user.authority;
  if( !Array.isArray(query) ) query = [query];  // queryを配列化
  v.lock = LockService.getDocumentLock(); // スプレッドシートのロックを取得

  for( v.tryNo=pv.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
    if( v.lock.tryLock(pv.interval) ){

      v.step = 3.1; // ロック成功、シートの更新処理開始
      for( v.i=0 ; v.i<query.length ; v.i++ ){

        v.step = 3.2; // 戻り値、ログの既定値を設定
        v.queryResult = {query:query[v.i],isErr:false,message:'',data:null,log:null};

        v.step = 3.3; // pv.tableに対象シートのデータが無ければ作成
        if( !pv.table[query[v.i].table] ){
          v.r = genTable({name:query[v.i].table});
          if( v.r instanceof Error ) throw v.r;
          pv.table[query[v.i].table] = v.r;
        }

        v.step = 3.4; // v.allowに対象シートに対するユーザの権限をセット
        if( pv.opt.user === null ){
          v.allow = 'rwdos'; // nullの場合、全権限付与
        } else {
          if( Object.hasOwn(pv.opt.user.authority,query[v.i].table) ){
            v.allow = pv.opt.user.authority[query[v.i].table];
          } else {
            v.msg = `シートに対する権限が登録されていません`;
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.msg,
            });
            v.queryResult.log = genLog({  // 変更履歴シートにログ出力
              result: false,
              message: v.msg,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
          }
        }

        v.step = 3.5; // 処理内容を元に、必要とされる権限が与えられているか確認
        if( v.queryResult.isErr === false ){
          if( v.allow.includes('o') ){

            v.step = 3.51;
            // o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
            // また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
            //read/writeは自分のみ可、delete/schemaは実行不可
            v.isOK = true;
            query[v.i].arg.where = pv.opt.user.id;  // 自レコードのみ対象とする
            switch( query[v.i].command ){
              case 'select': v.func = selectRow; break;
              case 'update': v.func = updateRow; break;
              default: v.isOK = false;
            }

          } else {

            v.step = 3.52;
            switch( query[v.i].command ){
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
            v.step = 3.53; // テーブル名のみでテーブル管理情報を必要としないgenSchema以外のメソッドにはテーブル管理情報を追加
            if( query[v.i] instanceof Object ) query[v.i].arg.table = pv.table[query[v.i].table];

            v.step = 3.54; // 処理実行
            v.result = v.func(query[v.i].arg);
            if( v.result instanceof Error ){

              v.step = 3.541; // selectRow, updateRow他のcommand系メソッドでエラー発生
              // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
              Object.assign(v.queryResult,{
                isErr: true,
                message: v.result.message
              });
              v.queryResult.log = genLog({  // 変更履歴シートにログ出力
                result: false,
                message: v.result.message,
                // before, after, diffは空欄
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

            } else {

              v.step = 3.542; // command系メソッドが正常終了した場合の処理
              if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){
                // select, schemaは結果をdataにセット
                v.queryResult.data = v.result;
                v.queryResult.log = genLog({  // 変更履歴シートにログ出力
                  result: true,
                  // messageは空欄
                  // before, diffは空欄、afterに出力件数をセット
                  after: query[v.i].command === 'select' ? `rownum=${v.result.length}` : null,
                });
                if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
              } else {
                // update, append, deleteは実行結果(sdbLog)をlogにセット
                v.queryResult.log = v.result;
              }
            }

          } else {

            v.step = 3.543; // isOKではない場合
            v.msg = `シート「${query[v.i].table}」に対して'${query[v.i].command}'する権限がありません`;
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.msg,
            });
            v.queryResult.log = genLog({  // 変更履歴シートにログ出力
              result: false,
              message: v.msg,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
          }
        }
        v.step = 3.6; // 実行結果を戻り値に追加
        v.rv.push(v.queryResult);
      }

      v.step = 3.7; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
      v.r = appendRow({table:pv.table[pv.opt.log],record:v.queryResult.map(x => x.log)});
      if( v.r instanceof Error ) throw v.r;

      v.step = 3.8; // ロック解除
      v.lock.releaseLock();
      v.tryNo = 0;
    }
  }

  v.step = 9; // 終了処理
  console.log(`${pv.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
  return v.rv;

} catch(e) {
  e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
  console.error(`${e.message}\nv=${stringify(v)}`);
  return e;
}