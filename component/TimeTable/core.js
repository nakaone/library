/**
 * @classdesc 参加者情報の表示・編集
 * 
 * - [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
 */
class TimeTable {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'TimeTable.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        config: {
          spanUnit: 2, // 1分当りの表示幅。px
          rowUnit: 40, // 1アイテム当りの表示高。px      
        },

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TimeTable共通部分 */ 
          ".TimeTable {"
          + '--timespan: 60;' // 対象期間(時間)。単位：分
          + '--resolution: 0.05rem;' // 1分あたりの表示幅
          + `}
          .TimeTable .wrapper {
            width: calc(var(--resolution) * var(--timesapn) + 2rem);
            padding: 1rem;
          }`,
        ],
        html:[],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // サイズ計算
      this.startTime = new Date(this.config.start);
      this.endTime   = new Date(this.config.end);
      this.spanTime  = (this.endTime.getTime() - this.startTime.getTime()) / 60000;

      this.data.forEach(x => {
        this.addSection(x);
      });

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /**
   * @returns {null|Error}
   */
  addSection = (sectionObj) => {
    const v = {whois:'TimeTable.addSection',step:0,rv:null};
    console.log(v.whois+' start.',sectionObj);
    try {

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  

  /**
   * @returns {null|Error}
   */
  template = () => {
    const v = {whois:'TimeTable.template',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  















  /** JavaScriptオブジェクト記述形式の文字列をオブジェクト化
   * 
   * ## 処理内容
   * 
   * - コメントを削除
   * - メンバ名をダブルクォーテーションで囲む
   * - 末尾にカンマがあれば削除
   * - シングルクォーテーション内にダブルクォーテーションがあればエスケープ
   * 
   * ## 注意事項
   * 
   * - ダブルクォーテーション内部のシングルクォーテーション使用は不可<br>
   *   ex."スタッフ'集合'"
   * - シングルクォーテーション内部のシングルクォーテーション使用は不可<br>
   *   ex.'ab\'cde\''
   * 
   * ## テストソース
   * 
   * {日本語:0,ひらがな:1,カタカナ:2,かナ漢字:3,全部載せAb1:4},
   * {
   *    p1:0,p2:'abc',p3:"abc",p4:'ab"c"',p5:"ab\"c\"",
   *    //NG p6:"ab'c'",
   *    //NG p7:'ab\'c\'',
   * },
   */
  objectize = (str) => {
    const v = {whois:'objectize',step:0,rv:null};
    console.log(v.whois+' start.',str);
    try {
      v.step = '1.1'; // 単一行コメントの削除
      v.rv = str.replaceAll(/[\s\t]*\/\/.*\n/g,' ');
      v.step = '1.2'; // JavaScript/CSS複数行コメントの削除
      v.rv = v.rv.replaceAll(/\/\*[\S\s]+?\*\//g,' ');
      console.log(v.whois+' step.%s\n%s',v.step,v.rv);

      v.step = '2'; // シングルクォーテーションで囲まれていた場合、ダブルクォーテーションに置換
      // 注：既に"〜"で囲まれていた場合、特に問題ないのでそのまま
      v.rv.match(/'.+?'/g).forEach(x => {
        // x1: シングルクォーテーションで囲まれた中身
        v.x1 = x.match(/^'(.*)'$/)[1];
        // ダブルクォーテーションをエスケープ
        v.x1 = v.x1.replaceAll('"','\\"');
        // ダブルクォーテーションで囲む
        v.x2 = '"' + v.x1 + '"';
        // 全体を通じて置換
        v.rv = v.rv.replaceAll(x, v.x2);
      });

      v.step = '3'; // クォーテーションで囲まれていないラベルをダブルクォーテーションで囲む
      v.label = '[A-Za-z0-9_'
      + '\u3041-\u3096' // ひらがな
      + '\u30A1-\u30FA' // かたかな
      + '々〇〻\u3400-\u9FFF\uF900-\uFAFF'  // 漢字
      + ']+';
      v.step = '3.1'; // r1: 囲まれていないラベルを区切り記号`{(,:`ごと抽出
      v.r1 = new RegExp('[\\[\\{,]\\s*'+v.label+'\\s*:\\s*','g');
      v.step = '3.2'; // r2: 区切り記号を$1,ラベルを$2にセット
      v.r2 = new RegExp('([\\[\\{,])\\s*('+v.label+')');
      console.log(v.label,v.r1,v.r2);
      v.step = '3.3';
      v.rv.match(v.r1).forEach(x => {
        v.x1 = x.match(v.r2);
        v.x2 = v.x1[1] + '"' + v.x1[2] + '":';
        v.rv = v.rv.replaceAll(x, v.x2);
      });
      console.log(v.rv);

      v.step = '4'; // 各行先頭・末尾の余白、改行を削除
      v.rv = v.rv.replaceAll(/\s*\n\s*/g,'');
      console.log(v.rv);

      v.step = '5'; // ']}'直前のカンマを削除
      v.rv = v.rv.replaceAll(/,\s*]/g,']').replaceAll(/,\s*}/g,'}');
      console.log(v.rv);

      v.step = '6'; // JSON化
      v.rv = JSON.parse(v.rv);

      v.step = '7'; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
}