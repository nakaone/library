/** genLog: sdbLogオブジェクトを生成
 * @param {sdbLog|null} arg - 変更履歴シートの行オブジェクト
 * @returns {sdbLog|sdbColumn[]} 変更履歴シートに追記した行オブジェクト、または変更履歴シート各項目の定義
 */
function genLog(arg=null){
  const v = {whois:'SpreadDb.genLog',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 変更履歴シートの項目定義
    v.logDef = [
      {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
      {name:'timestamp',type:'string',note:'更新日時。ISO8601拡張形式'},
      {name:'account',type:'string|number',note:'ユーザの識別子'},
      {name:'table',type:'string',note:'対象テーブル名'},
      {name:'command',type:'string',note:'操作内容(コマンド名)'},
      {name:'arg',type:'string',note:'操作関数に渡された引数'},
      {name:'result',type:'boolean',note:'true:追加・更新が成功'},
      {name:'message',type:'string',note:'エラーメッセージ'},
      {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
      {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
      {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
    ];

    if( arg === null ){

      v.step = 2; // 引数が指定されていない場合、変更履歴シート各項目の定義を返す
      v.rv = v.logDef;

    } else {

      v.step = 3; // 引数としてオブジェクトが渡された場合、その値を設定したsdbLogオブジェクトを返す
      v.rv = Object.assign({
        id: Utilities.getUuid(), // {UUID} 一意キー項目
        timestamp: toLocale(new Date()), // {string} 更新日時
        account: pv.opt.userId, // {string|number} uuid等、更新者の識別子
        // 以下、本関数呼出元で設定する項目
        table: null, // {string} 更新対象となった範囲名(テーブル名)
        command: null, // {string} 操作内容。command系内部関数名のいずれか
        arg: null, // {string} 操作関数に渡された引数
        result: null, // {boolean} true:追加・更新が成功
        message: null, // {string} エラーメッセージ
        before: null, // {JSON} 更新前の行データオブジェクト(JSON)
        after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
        diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
      },arg);

      v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
      for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);

    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}