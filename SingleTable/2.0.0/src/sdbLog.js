/** sdbLog: 更新履歴オブジェクトを管理、生成 */
const sdbLog = class {

  /** colDefs: 更新履歴シートの項目定義。sdbLog.colsDefs()で外部から参照可 */
  static typedef(){return [
    {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
    {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
    {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
    {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
    {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.result||true},
    {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
    {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.before||null},
    {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.after||null},
    {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',default:(o={})=>o.diff||null},
  ]};
  
  /** @constructor
   * @param arg {Object}
   * @param arg.account {string|number} - 更新者の識別子
   * @param arg.range {string} - 更新対象となった範囲名(テーブル名)
   * @param arg.result {boolean} - true:追加・更新が成功
   * @param arg.message {string} - エラーメッセージ
   * @param arg.before {JSON} - 更新前の行データオブジェクト
   * @param arg.after {JSON} - 更新後の行データオブジェクト
   * @param arg.diff {JSON} - 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
   * @returns {sdbLog|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbLog.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1;
      sdbLog.typedef().forEach(col => this[col.name] = col.default(arg));

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

}