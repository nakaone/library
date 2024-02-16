/** SingleTableClientの指示を受け、サーバ側(GAS)の単一スプレッドシートのCRUDを行う
 * 
 * - 機能的にはSingleTableの拡張だが、クラスではなく関数として定義することでSingleTableインスタンスを処理
 * - 「更新対象が不存在なら追加」等、select/update/insert/delete以外の操作はSingleTableClient側で実装すること
 * 
 * @param {string} name - 参照先シート名またはA1形式の範囲指定文字列
 * @param {string} func - 実行する機能。select/update/insert/delete
 * @param {Object} arg  - 機能を実行するに当たり必要なデータ
 */
function SingleTableServer(name,func, ...arg){
  const v = {whois:'SingleTableServer',rv:null,step:0};
  console.log(`${v.whois} start. arguments.length=${arguments.length}`);
  try {

    v.step = 1; // SingleTableオブジェクトの作成
    v.table = new SingleTable(name);
    if( v.table instanceof Error ) throw v.sheet;

    v.step = 2; // 指定機能の実行
    switch( func ){
      case 'select': v.rv = v.table.select(...arg); break;
      case 'update': v.rv = v.table.update(...arg); break;
      case 'insert': v.rv = v.table.insert(...arg); break;
      case 'delete': v.rv = v.table.delete(...arg); break;
      default:
        throw new Error('Error: Invalid function');
    }
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nname=${name}, func=${func}`
    + `\narg=${JSON.stringify(arg)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e.message;
  }
}
