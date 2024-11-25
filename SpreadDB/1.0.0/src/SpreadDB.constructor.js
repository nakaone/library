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
    v.step = 1; // メンバの初期化
    // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
    this.spread = SpreadsheetApp.getActiveSpreadsheet();
    // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
    this.tables = {};

    v.step = 2; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
    v.tables = Array.isArray(tables) ? tables : [tables];
    for( v.i=0 ; v.i<v.tables.length ; v.i++ ){
      // 文字列ならname属性指定と看做す
      if(whichType(v.tables[v.i],'String')){
        v.tables[v.i] = {name: v.tables[v.i]};
      };
    }

    v.step = 3; // 引数「opt」の設定値をメンバとして登録
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

    v.step = 4; // 更新履歴を残す場合、変更履歴シートを他シートに先行して準備
    if( this.outputLog === true ){
      this.log = this.tables[this.logSheetName] = new sdbTable({
        spread: this.spread,
        name: this.logSheetName,
        cols: sdbLog.typedef(),
      });
      if( this.log instanceof Error ) throw this.log;
    } else {
      this.log = null;
    }

    v.step = 5; // 対象テーブルのインスタンス化
    v.tables.forEach(x => {
      // sdbTableインスタンス生成時、spreadが必要になるので追加しておく
      x.spread = this.spread;
      x.log = this.log;
      x.account = this.account;
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