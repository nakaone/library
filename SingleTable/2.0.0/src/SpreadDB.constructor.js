/** @constructor
 * @param tables {Object|Object[]} 対象領域情報(sdbTable.constructor()の引数オブジェクト)の配列
 * @param opt {Object}={}
 * @param opt.outputLog {boolean}=true ログ出力しないならfalse
 * @param opt.logSheetName {string}='log' 更新履歴シート名
 * @param opt.account {number|string}=null 更新者のアカウント
 * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
 * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
 * @returns {SpreadDB|Error}
 */
constructor(tables,opt={}){
  const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    // -------------------------------------------------------------
    // 1. 事前準備
    // -------------------------------------------------------------
    v.step = 1; // サブクラスの定義
    //::$src/sdbTable.js::
    //::$src/sdbSchema.js::
    //::$src/sdbColumn.js::

    v.step = 2; // メンバの初期化
    // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
    this.spread = SpreadsheetApp.getActiveSpreadsheet();
    // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
    this.tables = {};

    v.step = 3; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
    v.tables = Array.isArray(tables) ? tables : [tables];

    v.step = 4; // 引数「opt」の設定値をメンバとして登録
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

    v.step = 5; // 更新履歴を残す場合、作成対象テーブルリストに更新履歴シートを追加
    if( this.outputLog === true ){
      // 作成対象テーブルリストに更新履歴が入っていないか確認、入ってなければリストに追加
      if( v.tables.map(x => x.name).indexOf(this.logSheetName) < 0 ){
        v.tables.push({
          name: this.logSheetName,
          cols: [  // 更新履歴シートの項目定義
            {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
            {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
            {name:'account',type:'string|number',note:'更新者の識別子'},
            {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
            {name:'result',type:'boolean',note:'true:追加・更新が成功'},
            {name:'message',type:'string',note:'エラーメッセージ'},
            {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
            {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
            {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
          ],
        });
      }
    }

    v.step = 6; // 対象テーブルのインスタンス化

    v.tables.forEach(x => {
      // sdbTableインスタンス生成時、spreadが必要になるので追加しておく
      x.spread = this.spread;
      v.r = new sdbTable(x);
      if( v.r instanceof Error ) throw v.r;
      this.tables[x.name] = v.r;
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