function doGet(e){
  const v = {rv:{}};
  console.log(`doGet start`);
  // html変数に値をセット
  v.template = HtmlService.createTemplateFromFile('index');
  v.template.pId = e.parameter.pId || 0;

  ['node','leaf'].forEach(x => {
    // データをシートから取得
    v[x] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e.parameter.sn || x).getDataRange().getValues();

    // データをオブジェクト化
    v.rv[x] = [];
    for( v.r=1 ; v.r<v[x].length ; v.r++ ){
      v.o = {};
      for( v.c=0 ; v.c<v[x][v.r].length ; v.c++ ){
        v.o[v[x][0][v.c]] = v[x][v.r][v.c];
      }
      v.rv[x].push(v.o);
    }
  })
  v.template.data = JSON.stringify(v.rv);

  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('TypeDefs r.2.2.0');
  console.log(`doGet end\npId=${v.template.pId}\n${JSON.stringify(v.template.data)}`);
  return v.htmlOutput;
}

/** treeGroup: シート関数。階層ラベルに従ってグループ化する
 * @param {Object} arg - class TypeDefの引数参照
 * @returns {void}
 */
function treeGroup(){
  const v = {};
  v.td = new TypeDef({
    sh: 'node',
    nId: 'id',
    lv: 'l([0-9]+)',
    base: 'origin',
    note: 'note',
    attr: ['data type','role'],
  });
  v.r = v.td.setupGroups();
}
/** TypeDef: 指定範囲のツリー構造のデータを並べ替え、グループ化する
 * 
 * **元データの制約**
 * - lvの正規表現では数値部分を"([0-9]+)"とし、必ず括弧で囲む
 * - ヘッダ行とデータ行の間には空欄不可
 * - ヘッダ行のラベルは重複不可
 * - 以下「行番号」はシート上の行番号を指す自然数
 * 
 * https://caymezon.com/gas-group-collapse-expand/#toc4
 * 
 * - class [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)
 * - class [Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja)
 * - class [Group](https://developers.google.com/apps-script/reference/spreadsheet/group?hl=ja)
 */
class TypeDef{
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

  /** analyze: シートからデータを取得してノード間の関連他を分析、メンバに格納する
   * @param {void}
   * @returns {Object} 分析結果。index.htmlへの返却用オブジェクト
   */
  analyze(){
    const v = {whois:this.constructor.name+'.analyze',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {

      // ---------------------------------------------
      // 事前準備
      // ---------------------------------------------
      v.step = 1.1; // 対象シートObjをthis.sheetに、生データをthis.rawに保存
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.arg.sh);
      this.raw = this.sheet.getDataRange().getValues();

      v.step = 1.2; // データ開始/終端行をthis.dRangeに保存
      this.dRange = [].concat(this.arg.data);
      if( this.arg.data[1] === null ){
        // データ終端行未指定の場合、取得データから設定
        this.dRange[1] = this.raw.length;
      }

      v.step = 1.3; // シート上のデータ範囲をthis.rangeに保存
      this.range = this.sheet.getRange(
        this.dRange[0], // 開始行番号
        1,  // 開始列番号
        this.dRange[1] - this.dRange[0] + 1,  // 行数
        this.raw[0].length  // 列数
      );

      v.step = 1.4; // 階層化ラベル欄を文字列の配列としてthis.labelに保存
      // ex. lv02 -> this.label[1] = 'lv02'
      // 併せてラベルと添字の換算マップもthis.mapとして作成
      // ex. 左端列がnId
      // this.map['nId']=0, this.map[0]='nId'
      this.cols = {
        header:[],  // {string[]} 欄名の配列。兼、添字->欄名参照用マップ
        label:{},   // {Object.<string,number>} 欄名->添字参照用マップ
        level:{},   // レベル欄のみ作成。レベル(自然数)<->欄名で相互参照
        lvNum: 0,   // 階層の深さ(レベル数)。0オリジン
      };
      v.rex = new RegExp(this.arg.lv);
      for( v.i=0 ; v.i<this.raw[this.arg.header-1].length ; v.i++ ){
        v.col = this.raw[this.arg.header-1][v.i];
        if( v.col.length === 0 ) continue;
        this.cols.header.push(v.col);
        this.cols.label[v.col] = v.i;
        v.m = v.col.match(v.rex);
        if( v.m ){
          this.cols.level[v.col] = v.i;
          this.cols.level[v.i] = v.col;
          this.cols.lvNum++;
        }
      }

      // ---------------------------------------------
      // this.obj,arrを作成
      // ---------------------------------------------
      v.step = 2.1; // 事前準備
      this.obj = {0:{nId:0}};
      this.arr = [];
      v.proto = JSON.stringify({    // this.objに格納されるオブジェクトの原型
        // nId〜baseはシステム用にプログラムで使用する変数名(固定)で、
        // objはシート上のカラム名で値を格納する。
        nId: null,   // {number} ノードのID。自然数
        level: null, // {number} 当該行の階層。自然数
        label: null, // {string} ノードのラベル
        //note: null,  // {string} 備考欄。不在時undefinedにするため、定義しない
        pId: null,   // {number} 親ノードのID
        seq: null,   // {number} 親ノード内での順番。自然数
        num: 0,      // {number} 子要素の数
        base: null,  // {number} 継承元ノード(基底ノード)のID
        row: 0,      // {number} シート上の行番号(自然数)
        raw: {},     // {Object<string,any>} 一行分の全ての欄の名前とその値
      });

      // v.stack {Object[]} - レベル毎に最新のnIdとseqを保持する
      v.stack = new Array(9).fill(null);
      v.stack[0] = {nId:0,seq:0}; // root(lv=0)

      v.step = 2.2; // this.rawを一行ずつ処理
      // 行番号ベース(自然数)のthis.dRangeを添字(0オリジン)に変換するため、各々-1
      for( v.r=this.dRange[0]-1 ; v.r<this.dRange[1] ; v.r++ ){

        v.step = 2.21; // 一行分のデータの原型をv.oとして作成
        v.o = JSON.parse(v.proto); //Object.assign({},v.proto);
        this.cols.header.forEach(col => {
          v.val = this.raw[v.r][this.cols.label[col]];
          if( String(v.val).length > 0 ){
            // 値(セル)が空欄では無い場合、v.o.rawにメンバを追加
            v.o.raw[col] = v.val; // いまここ：前の行のrawがクリアされていない
          }
        });

        v.step = 2.22; // nIdの設定
        v.o.nId = v.o.raw[this.arg.nId];

        v.step = 2.23; // levelとlabelの設定
        for( v.i=0 ; v.i<this.cols.lvNum ; v.i++ ){
          v.o.label = v.o.raw[this.cols.level[v.i]];
          if( v.o.label && v.o.label.length > 0 ){
            v.o.level = v.i + 1;
            v.i = this.cols.lvNum;
          }
        }
        // レベル未定(=ラベル欄に文字列が無い)行はスキップ
        if( v.o.level === null ) continue;

        v.step = 2.24; // noteの設定
        if( v.o.raw.hasOwnProperty(this.arg.note) ){
          v.o.note = v.o.raw[this.arg.note];
        }

        v.step = 2.25; // pId,seqの設定
        if( v.stack[v.o.level-1] === null ) throw new Error('level skipped.');
        v.o.pId = v.stack[v.o.level-1].nId;
        v.o.seq = ++v.stack[v.o.level-1].seq;

        v.step = 2.26; // num(子要素数)の設定、stackの更新
        if( v.stack[v.o.level] !== null ){
          // 更新前の最新ノードの子要素数にseqを代入
          this.obj[v.stack[v.o.level].nId].num = v.stack[v.o.level].seq;
        }
        v.stack[v.o.level] = {nId:v.o.nId,seq:0};
        for( v.i=v.o.level+1 ; v.i<=this.cols.lvNum ; v.i++ ){
          v.stack[v.i] = null;
        }

        v.step = 2.27; // base,row(シート上の行番号)の設定
        if( v.o.raw.hasOwnProperty(this.arg.base) ){
          v.o.base = v.o.raw[this.arg.base];
        }
        v.o.row = this.arg.header + v.r;

        v.step = 2.28; // this.obj, arrへの格納
        this.obj[v.o.nId] = v.o;
        this.arr.push(v.o);
      }

      // ---------------------------------------------
      // シート上の「グループ」をthis.groupsに格納
      // ---------------------------------------------
      v.step = 3.1; // 再帰呼出関数を定義
      v.recursive = (o,d=0) => {
        v.step = 3.11;
        if( d >= this.cols.lvNum ) throw new Error('too many depth');
        v.step = 3.12; // 子要素を抽出
        v.children = this.arr.filter(x => x.pId === o.nId).sort((a,b)=>a.seq<b.seq);
        if( v.children.length === 0 ){
          v.step = 3.13; // 子要素が存在しない場合、edRow=自行
          o.edRow = o.row;
        } else {
          v.step = 3.14; // stRow,edRowは「行番号」(≠添字)
          o.stRow = o.row + 1; // 子要素の開始行＝自要素の次行
          v.children.forEach(x => o.edRow = v.recursive(x,d+1));
          this.groups.push({st:o.stRow,ed:o.edRow,depth:d});
        }
        v.step = 3.15;
        return o.edRow;
      };

      v.step = 3.2; // トップレベルを抽出、再帰関数を呼び出し
      this.groups = [];
      this.arr.filter(x => x.pId === 0).sort((a,b)=>a.seq<b.seq)
      .forEach(x => v.recursive(x,0));

      // ---------------------------------------------
      v.step = 9; // 終了処理
      // ---------------------------------------------
      v.rv = {
        arg: this.arg,
        header: this.cols.header,
        data: this.obj,
      }
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** setupGroups: シート上で階層をグループ化する
   * @param {void}
   * @returns {void}
   */
  setupGroups(){
    const v = {whois:this.constructor.name+'.setupGroups',rv:null,step:0};
    console.log(`${v.whois} start.\nthis.groups=${stringify(this.groups)}`);
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
