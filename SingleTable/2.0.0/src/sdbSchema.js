/** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
class sdbSchema {
  /** @constructor
   * @param arg {Object}
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {sdbSchema|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbSchema.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 事前準備
      v.arg = mergeDeeply(arg,{cols:null,header:null,notes:null,values:null});

      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(this.cols)の作成
      // -----------------------------------------------
      v.step = 2.1; // v.cols: sdbColumns.constructor()への引数
      if( v.arg.notes !== null ){
        v.cols = v.arg.notes;
      } else if( v.arg.cols !== null ){
        v.cols = v.arg.cols;
      } else if( v.arg.header !== null ){
        v.cols = v.arg.header;
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

      // -----------------------------------------------
      v.step = 3; // this.cols以外のメンバ作成
      // -----------------------------------------------
      this.primaryKey = null;
      this.unique = {};
      this.auto_increment = {};
      this.defaultRow = {};
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<this.cols.length ; v.i++ ){

        v.step = 3.1; // primaryKey
        if( v.bool(this.cols[v.i].primaryKey) === true ){
          this.primaryKey = this.cols[v.i].name;
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( v.bool(this.cols[v.i].unique) === true ){
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( this.cols[v.i].auto_increment !== false ){
          this.auto_increment[this.cols[v.i].name] = this.cols[v.i].auto_increment;
          this.auto_increment[this.cols[v.i].name].current = this.auto_increment[this.cols[v.i].name].base;
        }

        v.step = 3.4; // default
        if( String(this.cols[v.i].default).toLowerCase() !== 'null' ){
          this.defaultRow[this.cols[v.i].name] = this.cols[v.i].default;
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}