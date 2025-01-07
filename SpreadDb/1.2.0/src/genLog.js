/** genLog: sdbLogオブジェクトを生成
 * @param {sdbLog|null} arg - 変更履歴シートの行オブジェクト
 * @returns {sdbLog|sdbColumn[]} 変更履歴シートに追記した行オブジェクト、または変更履歴シート各項目の定義
 */
function genLog(arg=null){
  const v = {whois:`${pv.whois}.genLog`,step:0,rv:null,
    idStr: 'arg='+(arg===null?'null':`${arg.table}.${arg.command}`)};
  console.log(`${v.whois} start. ${v.idStr}`);
  try {

    v.step = 1; // 変更履歴シートの項目定義
    v.logDef = [
      {name:'timestamp',type:'string',note:'更新日時'},
      {name:'userId',type:'string|number',note:'ユーザ識別子'},
      {name:'queryId',type:'string',note:'クエリ・結果突合用識別子'},
      {name:'table',type:'string',note:'対象テーブル名'},
      {name:'command',type:'string',note:'操作内容(コマンド名)'},
      {name:'arg',type:'string',note:'操作関数に渡された引数'},
      {name:'ErrCD',type:'string',note:'エラーコード'},
      {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
      {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
      {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
    ];

    if( arg === null ){

      v.step = 2; // 引数が指定されていない場合、変更履歴シート各項目の定義を返す
      v.rv = v.logDef;

    } else {

      v.step = 3; // 引数としてオブジェクトが渡された場合、その値を設定したsdbLogオブジェクトを返す
      // シートへの追加だけなら必要な項目にdefault設定しておけば良いが、
      // 呼出元への戻り値としても使用するので、ここで既定値設定を行う。
      v.rv = Object.assign({
        timestamp: toLocale(new Date()), // {string} 更新日時
        userId: pv.opt.userId, // {string|number} uuid等、更新者の識別子
        // 以下、本関数呼出元で設定する項目
        queryId: null, // {string} SpreadDb呼出元で設定する、クエリ・結果突合用文字列
        table: null, // {string} 更新対象となった範囲名(テーブル名)
        command: null, // {string} 操作内容。command系内部関数名のいずれか
        arg: null, // {string} 操作関数に渡された引数
        ErrCD: null, // {string} エラーコード
        before: null, // {JSON} 更新前の行データオブジェクト(JSON)
        after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
        diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
      },arg);

      v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
      for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);

    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end. ${v.idStr}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}