/** doQuery: 単体クエリの実行、変更履歴の作成 */
function doQuery(query){
  const v = {whois:`${pv.whois}.doQuery`,step:0,rv:null};
  try {

    v.step = 1; // 事前準備
    v.fId = `: table=${query.table}, command=${query.command}`;
    console.log(`${v.whois} start${v.fId}`);

    v.step = 2; // 操作対象のテーブル管理情報を準備
    if( !Object.hasOwn(pv.table,query.table) ){
      v.r = genTable({name:query.table,cols:query.cols,values:query.set});
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 3; // ユーザの操作対象シートに対する権限をv.allowにセット
    v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
    : ( pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query.table] || '')  // ゲスト(userId指定無し)
    : ( pv.opt.userAuth[query.table] || ''));  // 通常ユーザ

    v.step = 4; // 呼出先メソッド設定
    if( v.allow.includes('o') ){

      // o(=own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
      // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
      //read/write/append/deleteは自分のみ可、schemaは実行不可

      v.step = 5;  // 操作対象レコードの絞り込み(検索・追加条件の変更)
      if( query.command !== 'append' ){
        v.step = 6; // select/update/deleteなら対象を自レコードに限定
        query.where = pv.opt.userId;
      } else {
        v.step = 7; // appendの場合
        v.pKey = pv.table[query.table].schema.primaryKey;
        if( !v.pKey ){
          v.step = 8; // 追加先テーブルにprimaryKeyが不在ならエラー
          query.qSts = 'No PrimaryKey';
        } else {
          v.step = 9; // 追加レコードの主キーはuserIdに変更
          if( !Array.isArray(query.record) ) query.record = [query.record];
          query.record.forEach(x => x[v.pKey] = pv.opt.userId);
        }
      }

      v.step = 10; // 'o'の場合の呼出先メソッドを設定
      switch( query.command ){
        case 'select': v.isOK = true; v.func = selectRow; break;
        case 'update': v.isOK = true; v.func = updateRow; break;
        case 'append': case 'insert': v.isOK = true; v.func = appendRow; break;
        case 'delete': v.isOK = true; v.func = deleteRow; break;
        default: v.isOK = false;
      }

    } else {

      v.step = 11;  // 'o'以外の場合の呼出先メソッドを設定
      switch( query.command ){
        case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
        case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
        case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
        case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
        case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
        case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
        default: v.isOK = false;
      }
    }

    v.step = 12; // 無権限ならqStsにエラーコードをセット
    if( v.isOK === false ) query.qSts = 'No Authority';

    v.step = 13; // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
    if( query.qSts === 'OK' ){

      // 呼出先メソッド実行
      v.step = 14; // create以外の場合、操作対象のテーブル管理情報をcommand系メソッドの引数に追加
      if( query.command !== 'create' && query.command !== 'schema' ){
        if( !pv.table[query.table] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
          pv.table[query.table] = genTable({name:query.table});
          if( pv.table[query.table] instanceof Error ) throw pv.table[query.table];
        }
      }

      v.step = 15;  // メソッド実行
      v.r = v.func(query);
      if( v.r instanceof Error ){
        v.step = 16; // command系メソッドからエラーオブジェクトが帰ってきた場合はqSts=message
        query.qSts = v.r.message;
        throw v.r;
      } else {
        v.step = 17; // 戻り値がエラーでない場合、レコード単位の実行結果をresultに保存
        query.result = v.r;
      }
    }

    v.step = 99; // 終了処理
    console.log(`${v.whois} normal end${v.fId}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois}${v.fId} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v,(key,val)=>typeof val==='function'?val.toString():val,2)}`);
    return e;
  }
}