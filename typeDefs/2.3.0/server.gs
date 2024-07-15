function doGet(e){
  const v = {rv:{}};
  console.log(`doGet start`);
  // html変数に値をセット
  v.template = HtmlService.createTemplateFromFile('index');
  v.template.rootId = e ? e.parameter.r || 0 : 0;

  v.td = new TypeDefServer();
  v.rv = v.td.analyze();
  v.template.data = JSON.stringify(v.rv);

  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('TypeDefs r.2.3.0');
  console.log(`doGet end\npId=${v.template.pId}\n${JSON.stringify(v.template.data)}`);
  return v.htmlOutput;
}

/** treeGroup: シート関数。階層ラベルに従ってグループ化する
 * Apps Script上で呼び出して実行することを想定した関数
 * @param {void}
 * @returns {void}
 */
function treeGroup(){
  const v = {};
  v.td = new TypeDefServer({attr:{type:'string',role:'string',note:'string'}});
  v.r = v.td.analyze();
  v.r.arr = v.r.arr.slice(0,20);
  console.log(JSON.stringify(v.r));
  v.r = v.td.setupGroups();
}

/** TypeDefServer: 指定範囲のツリー構造のデータを並べ替え、グループ化する
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
class TypeDefServer{
  constructor(arg={}){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      this.arg = arg; // 複数回analyzeを呼び出す場合に備えたバックアップ
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
  analyze(arg={}){
    const v = {whois:this.constructor.name+'.analyze',step:0,rv:{}};
    console.log(`${v.whois} start.`);
    try {

      (()=>{  v.step = 1; // 事前準備

        v.step = 1.1; // 引数の既定値設定
        v.arg = Object.assign({
          sheetName: 'master',  // {string} シート名
          header: 1,    // ヘッダ行番号
          left: 1,      // 左端列番号
          right: null,  // 右端列番号。nullならgetDataRangeから設定
          top: 2,       // データ範囲の開始行番号
          bottom: null, // データ範囲の終端行番号。nullならgetDataRangeから設定
          attr:{},      // 任意に追加される属性項目。項目名:SQL(create)の属性
        },this.arg,arg);

        v.step = 1.2; // 対象シートObjおよび指定範囲外を含む全範囲の生データを取得
        this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(v.arg.sheetName);
        this.range = this.sheet.getDataRange();
        v.raw = this.range.getValues();

        v.step = 1.3; // right,bottom==nullの場合、getDataRangeから値を設定
        if( v.arg.right === null ) v.arg.right = v.raw[0].length;
        if( v.arg.bottom === null ) v.arg.bottom = v.raw.length;

        v.step = 1.4; // 不要なデータ範囲を削除。0:ヘッダ行、1〜終端:データ行になる
        // データ終端行より後の行は削除
        v.raw.splice(v.arg.bottom);
        // ヘッダ次行〜データ開始前行を削除
        v.raw.splice(v.arg.header,v.arg.top-v.arg.header-1);
        // this.rawのヘッダ行より前の行は削除
        v.raw.splice(0,v.arg.header-1);
        for( v.r=0 ; v.r<v.raw.length ; v.r++ ){
          // 右端列より右の列は削除
          v.raw[v.r].splice(v.arg.right);
          // this.rawの左端列より左の列は削除
          v.raw[v.r].splice(0,v.arg.left-1);
        }
        
        /* ヘッダ行の'label'〜次の項目までの空欄はカラム名=レベル番号に変更
           階層化ラベル欄は'label'または空欄
            fm: 階層化ラベル欄の開始位置。不要部分削除後の添字(0オリジン)
            to: 階層化ラベル欄の終端位置 */
        v.rv.header = [
          {name:'nId',type:'int'},
          {name:'label',type:'string'},
          {name:'base',type:'string'},
          {name:'level',type:'int'},
          {name:'pId',type:'int'},
          {name:'seq',type:'int'},
        ];
        v.fm = v.to = null; // 階層化ラベル欄の開始/終了位置(添字なので0オリジン)
        v.header = JSON.parse(JSON.stringify(v.raw[0]).replaceAll(/label/g,''));
        for( v.c=v.l=0 ; v.c<v.header.length ; v.c++ ){
          if( v.header[v.c].length === 0 ){ // 空欄 ⇒ 階層化ラベル欄
            if( v.fm === null ) v.fm = v.c;
            v.to = v.c;
          } else {  // 非空欄 ⇒ 定義された属性ならv.rv.headerに追加
            if( v.arg.attr[v.header[v.c]] ){
              v.rv.header.push({
                name: v.header[v.c],
                type: v.arg.attr[v.header[v.c]],
              });
            }
          }
        }
      })();

      (()=>{  v.step = 2; // this.obj,arrを作成【見直し】

        v.step = 2.1; // 事前準備
        this.obj = {0:{nId:0}};
        this.arr = [];
        // v.stack {Object[]} - レベル毎に最新のnIdとseqを保持する
        v.stack = new Array(9).fill(null);
        v.stack[0] = {nId:0,seq:0}; // root(lv=0)

        v.proto = JSON.stringify({    // this.obj,arrに格納されるオブジェクトの原型
          // 1. クライアントに渡される項目
          // 1.1 シート上の予約項目
          nId: null,   // {number} ノードのID。自然数
          label: null, // {string} ノードのラベル
          base: '',  // {number} 継承元ノード(基底ノード)のID
          // 1.2 プログラム中で導出される予約項目
          level: null, // {number} 当該行の階層。自然数
          pId: null,   // {number} 親ノードのID
          seq: null,   // {number} 親ノード内での順番。自然数
          // 1.3 その他シート上の属性項目は適宜追加

          // 2. クライアントに渡されない項目(最後に削除)
          num: 0,      // {number} 子要素の数
          row: 0,      // {number} シート上の行番号(自然数)
        });

        for( v.r=1 ; v.r<v.raw.length ; v.r++ ){
          v.o = JSON.parse(v.proto);

          // 行(一次元配列)をオブジェクト化
          for( v.c=0 ; v.c<v.raw[v.r].length ; v.c++ ){
            v.val = v.raw[v.r][v.c];
            if( v.val || v.val === 0 ){ // 空欄ではない場合
              if( v.fm <= v.c && v.c <= v.to ){  // 階層化ラベル欄
                v.o.label = v.val;
                v.o.level = v.c - v.fm + 1;
              } else {  // ラベル欄以外
                v.o[v.header[v.c]] = v.val;
              }
            }
          }
          // レベル未定(=ラベル欄に文字列が無い)行はスキップ
          if( v.o.level === null ) continue;

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
          for( v.i=v.o.level+1 ; v.i<=(v.to-v.fm+1) ; v.i++ ){
            v.stack[v.i] = null;
          }
  
          v.step = 2.27; // row(シート上の行番号)の設定
          v.o.row = v.arg.header + v.r;

          v.step = 2.28; // this.obj, arrへの格納
          this.obj[v.o.nId] = v.o;
          this.arr.push(v.o);
        }
        v.rv.arr = JSON.parse(JSON.stringify(this.arr));
        v.rv.arr.forEach(o => { // クライアント側で不要な項目を削除
          delete o.num;
          delete o.row;
        });
      })();

      (()=>{  v.step = 3; // シート上の「グループ」をthis.groupsに格納
        v.step = 3.1; // 再帰呼出関数を定義
        v.recursive = (o,d=0) => {
          const w = {};
          v.step = 3.11;
          if( d > (v.to - v.fm + 1) ) throw new Error('too many depth');
          v.step = 3.12; // 子要素を抽出
          v.children = this.arr.filter(x => x.pId === o.nId).sort((a,b)=>a.seq<b.seq);
          if( v.children.length === 0 ){
            v.step = 3.13; // 子要素が存在しない場合、edRow=自行
            w.edRow = o.row;
          } else {
            v.step = 3.14; // stRow,edRowは「行番号」(≠添字)
            w.stRow = o.row + 1; // 子要素の開始行＝自要素の次行
            v.children.forEach(x => w.edRow = v.recursive(x,d+1));
            this.groups.push({st:w.stRow,ed:w.edRow,depth:d});
          }
          v.step = 3.15;
          return w.edRow;
        };
  
        v.step = 3.2; // トップレベルを抽出、再帰関数を呼び出し
        this.groups = [];
        this.arr.filter(x => x.pId === 0).sort((a,b)=>a.seq<b.seq)
        .forEach(x => v.recursive(x,0));
      })();

      // ---------------------------------------------
      v.step = 9; // 終了処理
      // ---------------------------------------------
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
