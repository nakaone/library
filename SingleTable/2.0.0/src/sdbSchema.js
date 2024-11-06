/** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
this.sdbSchema = class {
  /** @constructor
   * @param arg {Object}
   * @param [arg.cols] {Object.<string,any>[]} - 項目定義オブジェクトの配列
   * @param [arg.values] {string[]} - 行オブジェクトの配列
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @returns
   */
  constructor(arg={}){
    const v = {whois:'sdbSchema.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 事前準備
      v.arg = mergeDeeply(arg,{cols:null,values:null,notes:null});

      v.step = 2; // 項目定義オブジェクト(this.cols)の作成
      v.step = 2.1; // v.cols: sdbColumns.constructor()への引数
      if( v.arg.notes !== null ){
        v.cols = v.arg.notes;
      } else if( v.arg.cols !== null ){
        v.cols = v.arg.cols;
      } else if( v.arg.values !== null ){
        // 行オブジェクトの配列から項目名リストを作成
        v.obj = {};
        v.arg.values.forEach(o => Object.assign(v.obj,o));
        v.cols = Object.keys(v.obj);
      } else {
        throw new Error('必要な引数が指定されていません');
      }

      v.step = 2.2; // this.colsにsdbColumnsインスタンスを項目毎に生成
      this.cols = [];
      v.cols.forEach(o => {
        v.r = new sdbColumn(o);
        if( v.r instanceof Error ) throw v.r;
        this.cols.push(v.r);
      })

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  getSchema(){
    const v = {whois:'sdbSchema.getSchema',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** getNext: auto_increment項目の次の値を取得 */
  getNext(arg){
    const v = {whois:'sdbSchema.getNext',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** isUnique: unique項目で、引数が登録済か判定 */
  getNext(arg){
    const v = {whois:'sdbSchema.getNext',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

}