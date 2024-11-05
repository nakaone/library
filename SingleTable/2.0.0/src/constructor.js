/** @constructor
 * @param range {string} 対象データ範囲のA1記法。1シート1テーブルとなっていない場合、範囲を特定するために使用。1シート1テーブルならシート名
 * @param opt {Object}={}
 * @param opt.outputLog {boolean}=true ログ出力しないならfalse
 * @param opt.logSheetName {string}='log' 更新履歴シート名
 * @param opt.account {number|string}=null 更新者のアカウント
 * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
 * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
 * @param opt.values {number|string|boolean|Date[][]} - 初期シートイメージ
 * @param opt.primaryKey {string} - 初期データの一意キー項目名
 * @returns {Object} setupSheet()のv.rv参照
 */
constructor(range,opt){
  const v = {whois:this.constructor.name+'.prototype',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    this.stSheet = class {
      constructor(range,opt={}){
        const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
        console.log(`${v.whois} start.\nrange=${range}\nopt=${stringify(opt)}`);
        try {

          v.step = 1; // メンバの初期化、既定値設定
          this.range = null; // {string} A1記法の範囲指定
          this.sheetName = null; // {string} シート名。this.rangeから導出
          this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
          this.schema = null; // {stSchema[]} シートの項目定義
          this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
          this.header = null; // {number} ヘッダ行の行番号(自然数)
          this.top = null; // {number} データ領域先頭の行番号(自然数)。通常header+1
          this.left = null; // {number} データ領域左端の列番号(自然数)
          this.right = null; // {number} データ領域右端の列番号(自然数)
          this.bottom = null; // {number} データ領域下端の行番号(自然数)
          this.primaryKey = null; // {string}='id' 一意キー項目名
          this.unique = null; // {Object} primaryKeyおよびunique属性が付いた項目の一覧
          this.cols = null; // {string[]} 項目名のリスト
          this.map = null; // {Object} {項目名:値リスト配列}形式
          this.auto_increment = null; // {Object} auto_increment属性が付いた項目の最大値を管理するオブジェクト
          this.cols = null; // {string[]} 項目名のリスト
          this.map = null; // {Object} 項目名をラベルとし、以下形式のオブジェクトを値とするオブジェクト
          this.max = null; // {number} 最大値
          this.val = null; // {number} 増減値
          this.defaultObj = null; // {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ

          v.step = 2; // 引数'range'から対象範囲絞り込み
          // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
          // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る可能性あり
          v.m = range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
          if( v.m ){  // rangeがA1記法で指定された場合
            this.sheetName = v.m[1];
            this.left = v.m[2] ? this.colNo(v.m[2]) : 1;
            this.top = v.m[3] ? Number(v.m[3]) : 1;
            this.right = v.m[4] ? this.colNo(v.m[4]) : Infinity;
            this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
            if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
            if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
          } else {    // rangeが非A1記法 ⇒ range=シート名
            this.sheetName = range;
            this.top = this.left = 1;
            this.bottom = this.right = Infinity;
          }

          v.step = 3; // spread読み込みテスト
          this.sheet = this.spread.getSheetByName(this.sheetName);

          v.step = 9; // 終了処理
          console.log(`${v.whois} normal end.`);
      
        } catch(e) {
          e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
          console.error(`${e.message}\nv=${stringify(v)}`);
          return e;
        }
      }

      /** colNo: 列記号を列番号に変換
       * @param {string} arg - 列番号
       * @returns {number} 列番号。自然数
       */
      colNo(arg){
        let rv=0;
        for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
          rv *= 26;
          rv += s.charCodeAt(i) - b;
        }
        return rv;
      }
    };

    this.stSchema = class {
      constructor(arg){
        const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
        console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
        try {

          this.name = null; // {string} 項目名
          this.type = null; // {string} データ型。string,number,boolean,Date,JSON,UUID
          this.format = null; // {string} 表示形式。type=Dateの場合のみ指定
          this.options = null; // {string} 取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]
          this.default = null; // {any} 既定値
          this.primaryKey = null; // {boolean}=false 一意キー項目ならtrue
          this.unique = null; // {boolean}=false primaryKey以外で一意な値を持つならtrue
          this.auto_increment = null; // {bloolean|null|number|number[]}=false 自動採番項目
            // null ⇒ 自動採番しない
            // boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
            // number ⇒ 自動採番する(基数=指定値,増減値=1)
            // number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
          this.suffix = null; // {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
          this.note = null; // {string} 本項目に関する備考。create table等では使用しない

          v.step = 9; // 終了処理
          console.log(`${v.whois} normal end.`);
      
        } catch(e) {
          e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
          console.error(`${e.message}\nv=${stringify(v)}`);
          return e;
        }
      }
    };

    this.target = new this.stSheet(range);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}