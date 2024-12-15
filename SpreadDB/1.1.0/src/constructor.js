/** @constructor */
function constructor(query,opt){
  const v = {whois:`${pv.whois}.constructor`,step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 起動時オプション
    pv.opt = Object.assign({
      user: null, // {number|string}=null ユーザのアカウント情報。nullの場合、権限のチェックは行わない
      account: null, // {string}=null アカウント一覧のテーブル名
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: null, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: null, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
    },opt);

    v.step = 1.2; // 内部設定項目
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
        cols: [
          {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
          {name:'timestamp',type:'string',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
          {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
          {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
          {name:'action',type:'string',note:'操作内容。append/update/delete/getLogのいずれか',default:(o={})=>o.action||null},
          {name:'argument',type:'string',note:'操作関数に渡された引数',default:(o={})=>
            o.hasOwnProperty('argument')?(typeof o.argument === 'string' ? o.argument : JSON.stringify(o.argument)):null},
          {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
          {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
          {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.hasOwnProperty('before')?JSON.stringify(o.before):null},
          {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.hasOwnProperty('after')?JSON.stringify(o.after):null},
          {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',
            default:(o={})=>o.hasOwnProperty('diff')?JSON.stringify(o.diff):null},
        ],
      });
      if( pv.table[pv.opt.log] instanceof Error ) throw pv.table[pv.opt.log];
    }
    console.log(`l.292 pv.table[${pv.opt.log}]=${JSON.stringify(pv.table[pv.opt.log],null,2)}`);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}