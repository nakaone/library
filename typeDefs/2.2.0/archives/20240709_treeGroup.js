function main(){
  const v = {};
  v.tg = new treeGroup({attr:['type','role']});
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
 * - 以下「行番号」はシート上の行番号を指す自然数
 * 
 * https://caymezon.com/gas-group-collapse-expand/#toc4
 * 
 * - class [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)
 * - class [Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja)
 * - class [Group](https://developers.google.com/apps-script/reference/spreadsheet/group?hl=ja)
 */
class treeGroup{
  constructor(arg={}){ //sheetName,labelWidth=8){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      // ---------------------------------------------
      // 事前準備
      // ---------------------------------------------
      v.step = 1.1; // 引数の既定値設定
      this.arg = Object.assign({
        sh: 'master',   // シート名
        nId: 'nId',     // Node IDの項目名
        lv: 'lv([0-9]+)',  // 階層化されたラベル欄。末尾の数値は階層(1から連続した自然数)
        base: 'base',   // 継承元ノードのID
        note: null,     // 備考欄の項目名
        attr: [],       // 属性の項目名
        header: 1,      // ヘッダ行番号
        data: [2,null], // データ範囲の行番号(ヘッダ次行〜末尾)
      },arg);
      this.arg.lv = new RegExp(this.arg.lv);

      v.r = this.analyze();
      if( v.r instanceof Error ) throw v.r;

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** analyze: シートからデータを取得してノード間の関連他を分析、メンバに格納する */
  analyze(){
    const v = {whois:this.constructor.name+'.analyze',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {

      // ---------------------------------------------
      // 事前準備
      // ---------------------------------------------
      v.step = 1.1; // データの取得
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.arg.sh);
      this.raw = this.sheet.getDataRange().getValues();

      v.step = 1.2; // データ終端行未指定の場合、取得データから設定
      if( this.arg.data[1] === null ){
        this.arg.data[1] = this.raw.length;
      }
      this.range = this.sheet.getRange(this.arg.data[0],1,this.arg.data[1]-this.arg.data[0]+1,this.raw[0].length);

      v.step = 1.3; // 階層化ラベル欄を文字列の配列化
      // ex. lv02 -> this.label[1] = 'lv02'
      // 併せてラベルと添字の換算マップも作成
      // ex. 左端列がnId
      // this.map['nId']=0, this.map[0]='nId'
      this.label = []; this.map = {};
      v.rex = new RegExp(this.arg.lv);
      for( v.i=0 ; v.i<this.raw[this.arg.header-1].length ; v.i++ ){
        v.label = String(this.raw[this.arg.header-1][v.i]);
        if( v.label.length === 0 ) continue;
        v.m = v.label.match(v.rex);
        if( v.m ) this.label[Number(v.m[1])-1] = v.label;
        this.map[v.label] = v.i;
        this.map[v.i] = v.label;
      }

      // ---------------------------------------------
      // this.obj,arrを作成
      // ---------------------------------------------
      v.step = 2.1; // 事前準備
      this.obj = {0:{nId:0}};
      this.arr = [];
      v.proto = { // this.objに格納されるオブジェクトの原型
        nId: null,  // {number} ノードのID。自然数
        pId: null,  // {number} 親ノードのID
        seq: null,  // {number} 親ノード内での順番。自然数
        level: null,// {number} 当該行の階層。自然数
        base: null, // {number} 継承元ノード(基底ノード)のID
        note: null, // {string} 備考欄
        attr: {},   // {Object<string,any>} 属性名とその値
        row: [],    // {any[][]} シート上の当該行のデータ
      };
      this.arg.attr.forEach(x => v.proto.attr[x] = null);

      v.map = new Array(9).fill(null);
      v.map[0] = {nId:0,seq:0}; // root(lv=0)

      v.step = 2.2; // this.rawを一行ずつ処理
      // 範囲はthis.arg.dataだが、行番号を添字に変換するため各々-1
      for( v.r=this.arg.data[0]-1 ; v.r<this.arg.data[1] ; v.r++ ){

        v.step = 2.21; // 一行分のデータの原型をv.oとして作成
        v.o = Object.assign({},v.proto,{
          row: this.raw[v.r],
        });

        v.step = 2.22; // nIdの設定
        v.o.nId = v.o.row[this.map[this.arg.nId]];

        v.step = 2.23; // レベルの設定
        for( v.i=0 ; v.i<this.label.length ; v.i++ ){
          v.lv = String(v.o.row[this.map[this.label[v.i]]]);
          if( v.lv.length > 0 ){
            v.o.level = v.i + 1;
            continue;
          }
        }
        // ラベル欄に文字列が無い行はスキップ
        if( v.o.level === null ) continue;

        v.step = 2.24; // pId,seqの設定
        if( v.map[v.o.level-1] === null ) throw new Error('level skipped.');
        v.o.pId = v.map[v.o.level-1].nId;
        v.o.seq = ++v.map[v.o.level-1].seq;

        v.step = 2.25; // mapの更新
        v.map[v.o.level] = {nId:v.o.nId,seq:0};
        for( v.i=v.o.level+1 ; v.i<=this.label.length ; v.i++ ){
          v.map[v.i] = null;
        }

        v.step = 2.26; // this.obj, arrへの格納
        this.obj[v.o.nId] = v.o;
        this.arr.push(v.o);
      }

      // ---------------------------------------------
      // シート上の「グループ」をthis.groupsに格納
      // ---------------------------------------------
      v.step = 3.1; // 再帰呼出関数を定義
      v.recursive = (o,d=0) => {
        v.step = 3.21;
        if( d > this.label.length ) throw new Error('too many depth');
        v.step = 3.22; // 子要素の開始行をセット
        o.stRow = o.nId + 1;
        v.step = 3.23; // 子要素を抽出
        v.children = this.arr.filter(x => x.pId === o.nId).sort((a,b)=>a.seq<b.seq);
        if( v.children.length === 0 ){
          v.step = 3.24; // 子要素が存在しない場合、stRow=edRow=null
          o.stRow = o.edRow = null;
        } else {
          v.step = 3.25; // stRow,edRowは「行番号」(≠添字)
          o.stRow = o.nId+2; // 次の行(+1)＋行番号(nId+1)⇒+2
          v.children.forEach(x => o.edRow = v.recursive(x,d+1));
          this.groups.push({st:o.stRow,ed:o.edRow,depth:d});
        }
        v.step = 3.26;
        return o.edRow === null ? o.nId + 1 : o.edRow;
      };

      v.step = 3.3; // トップレベルを抽出、再帰関数を呼び出し
      this.groups = [];
      this.arr.filter(x => x.pId === 0).sort((a,b)=>a.seq<b.seq)
      .forEach(x => v.recursive(x,0));

      // ---------------------------------------------
      v.step = 9; // 終了処理
      // ---------------------------------------------
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** setGroup: シート上で階層をグループ化する */
  setGroup(){
    const v = {whois:this.constructor.name+'.setGroup',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 事前準備
      this.range.shiftRowGroupDepth(-8); // 全グループ設定を削除

      v.step = 2; // グループ化実行
      this.groups.forEach(x => {
        if( x.depth < 8 ) // シート上のグループ化は8階層まで
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
