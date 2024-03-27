/**
 * @classdesc htmlソースからdata-BurgerMenu属性を持つ要素を抽出、表示内容の権限の存否に従ってハンバーガーメニューを作成
 */
class BurgerMenu {
  /**
   * @constructor
   * @param {Object} arg
   * @returns {BurgerMenu|Error}
   */
  constructor(arg={}){
    this.className = 'BurgerMenu';
    const v = {whois:this.className+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
    try {
      v.step = 1; // 引数と既定値からメンバの値を設定
      v.step = 9; // 終了処理
      changeScreen(this.home);
      console.log(`${v.whois} normal end.`);
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** constructorの引数と既定値からthisの値を設定
   * @param {Object} arg - constructorに渡された引数オブジェクト
   * @returns {null|Error}
   */
  setProperties(arg){
    const v = {whois:this.className+'.setProperties',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
      v.step = 1; // commonConfigとclientConfigをマージ、既定値作成
      // 既定値とconstructorの引数をマージ
      // commonConfigでの導出項目の計算
      // clientConfigでの導出項目の計算
      // メンバとして登録
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`
      + `\narg=${stringify(arg)}`;  // 引数
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
