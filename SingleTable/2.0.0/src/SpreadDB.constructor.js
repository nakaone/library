/** @constructor
 * @param table {Object|Object[]} 対象領域情報(sdbTable.constructor()の引数オブジェクト)の配列
 * @param opt {Object}={}
 * @param opt.outputLog {boolean}=true ログ出力しないならfalse
 * @param opt.logSheetName {string}='log' 更新履歴シート名
 * @param opt.account {number|string}=null 更新者のアカウント
 * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
 * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
 * @returns {SpreadDB|Error}
 */
constructor(table,opt={}){
  const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // サブクラスの定義
    //::$src/sdbTable.js::
    //::$src/sdbSchema.js::
    //::$src/sdbColumn.js::

    v.step = 2; // メンバの初期化、既定値設定
    this.spread = SpreadsheetApp.getActiveSpreadsheet(); // {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
    v.opt = mergeDeeply(opt,{
      outputLog: true,
      logSheetName: 'log',
      account: null,
      maxTrial: 5,
      interval: 2500,
      values: null,
      schema: null,
    });
    Object.keys(v.opt).forEach(x => this[x] = v.opt[x]);

    v.step = 3; // 更新履歴シートの項目定義
    // v.tables: 作成対象テーブルリスト。引数tableが単一オブジェクトなら配列に変換
    v.tables = whichType(table,'Object') ? [table] : table;
    // ログは「range=シート名」とし、範囲指定はしない(1シート占有)。
    v.logTable = v.tables.find(x => x.range === this.logSheetName);
    if( this.outputLog && !v.logTable.schema ){
      v.logTable.schema = [  // 更新履歴シートの項目定義
        {name:'id',type:'UUID',note:'ログの一意キー項目'},
        {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
        {name:'account',type:'string|number',note:'更新者の識別子'},
        {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
        {name:'result',type:'boolean',note:'true:追加・更新が成功'},
        {name:'message',type:'string',note:'エラーメッセージ'},
        {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
        {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
        {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
      ];
    }

    v.step = 4; // 対象テーブルのインスタンス化
    v.step = 4.1; // 
    if( v.opt.outputLog && v.tables.map(x => x.name).indexOf(v.opt.logSheetName) < 0){
      v.tables.push(v.opt.logSheetName);
    }
    this.tables = {};
    v.tables.forEach(x => {
      x.spread = this.spread;
      v.r = new sdbTable(x);
      if( v.r instanceof Error ) throw v.r;
      this.tables[v.r.range] = v.r;
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}