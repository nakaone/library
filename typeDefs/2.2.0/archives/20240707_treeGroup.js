function main(){
  const v = {};
  v.tg = new treeGroup('master');
  v.r = v.tg.setGroup();
}
/** treeGroup: 指定範囲のツリー構造のデータを並べ替え、グループ化する
 * @param {any[][]} data - シート上の元データ
 * @param {number} nId=0 - data内での自id列の添字(0オリジン)
 * @param {number} pId=1 - data内での親id列の添字(0オリジン)
 * @param {number} seq=2 - 親要素内での順番を示すseq列の添字(0オリジン)
 * @returns {any[][]} 並べ替え、グループ化した結果
 * 
 * **元データの制約**
 * - 先頭行はラベル
 * - 左端列〜labelWidthは階層化したラベル
 * - nIdは行番号-1
 * 
 * https://caymezon.com/gas-group-collapse-expand/#toc4
 * 
 * - class [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)
 * - class [Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja)
 * - class [Group](https://developers.google.com/apps-script/reference/spreadsheet/group?hl=ja)
 */
class treeGroup{
  constructor(sheetName,labelWidth=8){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\nsheetName=${sheetName}, labelWidth=${labelWidth}`);
    try {

      v.step = 1; // 事前準備
      this.labelWidth = labelWidth;
      v.step = 1.1; // 各種データの取得
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      this.range = this.sheet.getDataRange();
      this.raw = this.range.getValues();

      v.step = 2; // this.objの作成
      this.arr = [];
      this.obj = {0:{nId:0,row:this.raw[0]}};
      v.map = new Array(9).fill(null);
      v.map[0] = {nId:0,seq:0}; // root(lv=0)

      for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
        v.o = {nId:v.r,pId:null,seq:null,row:this.raw[v.r]};
        v.step = 2.1; // レベルの設定
        v.o.lv = null;
        for( v.i=0 ; v.i<labelWidth ; v.i++ ){
          if( String(v.o.row[v.i]).length > 0 ){
            v.o.lv = v.i + 1;
            continue;
          }
        }
        // ラベル欄に文字列が無い行はスキップ
        if( v.o.lv === null ) continue;

        v.step = 2.2; // pId,seqの設定
        if( v.map[v.o.lv-1] === null ) throw new Error('level skipped.');
        v.o.pId = v.map[v.o.lv-1].nId;
        v.o.seq = ++v.map[v.o.lv-1].seq;

        v.step = 2.3; // mapの更新
        v.map[v.o.lv] = {nId:v.o.nId,seq:0};
        for( v.i=v.o.lv+1 ; v.i<=labelWidth ; v.i++ ) v.map[v.i] = null;

        this.obj[v.r] = v.o;
        this.arr.push(v.o);
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  setGroup(){
    const v = {whois:this.constructor.name+'.setGroup',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 事前準備
      this.groups = [];
      this.range.shiftRowGroupDepth(-8); // 全グループ設定を削除

      v.step = 2; // 再帰呼出関数を定義
      v.recursive = (o,d=0) => {
        if( d > this.labelWidth ) throw new Error('too many depth');
        // 子要素の開始行をセット
        o.stRow = o.nId + 1;
        // 子要素を抽出
        v.children = this.arr.filter(x => x.pId === o.nId).sort((a,b)=>a.seq<b.seq);
        if( v.children.length === 0 ){
          o.stRow = o.edRow = null;
        } else {
          // stRow,edRowは「行番号」(≠添字)
          o.stRow = o.nId+2; // 次の行(+1)＋行番号(nId+1)⇒+2
          v.children.forEach(x => o.edRow = v.recursive(x,d+1));
          this.groups.push({st:o.stRow,ed:o.edRow});
        }
        return o.edRow === null ? o.nId + 1 : o.edRow;
      };

      v.step = 3; // トップレベルを抽出、再帰関数を呼び出し
      this.arr.filter(x => x.pId === 0).sort((a,b)=>a.seq<b.seq)
      .forEach(x => v.recursive(x,0));
      console.log(`l.107 this.groups=${stringify(this.groups)}`)

      v.step = 4; // グループ化実行
      this.groups.forEach(x => {
        this.sheet.getRange(x.st,1,x.ed-x.st+1).shiftRowGroupDepth(1);
      });
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

}

/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}