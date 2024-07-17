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
 * **制約事項**
 * 
 * - ヘッダ行のラベルは重複不可
 * - 「行番号」「列番号」はシート上の行/列番号を指す【自然数】
 * - 'nId','base'はシート上の必須項目
 * - 階層化ラベル欄は空欄にする。または先頭に'label'とのみ表記(他の文字列だと属性項目と解釈される)
 * - 'sys'は予約語なのでラベルには使用不可
 * 
 * **メンバ変数**
 * 
 * - this.arg {Object} 既定値設定後の引数
 * - this.sheet {Sheet} 対象シートオブジェクト
 * - this.range {Range} 対象シートオブジェクト全体のRangeオブジェクト(getDataRange)
 * - this.header {Object[]} ヘッダ項目の情報
 *   - name {string} ヘッダ項目名の文字列(ex.'note')
 *   - type {string} SQLで項目を作成する場合の属性(ex.'int primary key')
 * - this.arr {Object[]} 行単位のデータオブジェクトの配列
 *   - === シート上の項目 =================
 *   - nId {number} ノードのID。自然数
 *   - label {string} ノードのラベル
 *   - base {number[]} シート上は文字列。継承元ノード(基底ノード)のID
 *   - xxxx {any} その他任意項目(role,note等)
 *   - === システムで付加される項目 =================
 *   - sys {Object}
 *     - level {number} 当該行の階層。自然数
 *     - pId {number} 親ノードのID
 *     - seq {number} 親ノード内での順番。自然数
 *     - path {number[]} ルート〜自要素までのnId
 *     - num {number} 子要素の数
 *     - row {number} シート上の行番号
 *     - own {number[]} 自分の子要素のnIdの配列
 *     - base {number[]} base(文字列)を分割、継承元nIdの配列。自要素を含む
 *     - ref {Object[]} 自分＋継承元ノードの子要素。含、無効な子要素
 *       - nId {number} 継承元ノード(含、自要素)のnId
 *       - children {number[]} 継承元ノード(含、自要素)の子要素のnIdの配列
 *     - children {Object[]} 自分＋継承元ノードの「有効な」子要素
 *       - nId {number} 子要素のnId
 *       - base {number} 継承元ノードのnId。自ノードの場合、自分のnId
 * - this.obj {Object} 構造化した行単位のデータオブジェクト
 * - this.groups {Object[]} シート上でグループ化を行うための、グループ化単位の情報
 *   - st {number} グループ化開始行番号
 *   - ed {number} グループ化終端行番号
 *   - depth {number} グループの深さ。0オリジン
 * 
 * **参考資料**
 * 
 * - 【GAS】スプレッドシートの行列グループ化・解除・折りたたみ・展開機能まとめ [行のグループ化](https://caymezon.com/gas-group-collapse-expand/#toc4)
 * - class [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)
 * - class [Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja)
 * - class [Group](https://developers.google.com/apps-script/reference/spreadsheet/group?hl=ja)
 */
class TypeDefServer{
  constructor(arg={}){
    const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 引数の既定値設定
      this.arg = Object.assign({
        sheetName: 'master', // {string} シート名
        header   : 1,        // {number} ヘッダ行番号
        left     : 1,        // {number} 左端列番号
        right    : null,     // {number} 右端列番号。nullならgetDataRangeから設定
        top      : 2,        // {number} データ範囲の開始行番号
        bottom   : null,     // {number} データ範囲の終端行番号。nullならgetDataRangeから設定
        attr     : {},       // {Object.<string,string>} 任意に追加される属性項目。項目名:SQL(create)の属性
        add      : 'bottom', // {string} baseに自要素が無く、子要素が有った場合の追加先。top or bottom
      },arg);

      v.step = 2; // 分析の実行
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
    const v = {whois:this.constructor.name+'.analyze',step:0,rv:{}};
    console.log(`${v.whois} start.`);
    try {

      (()=>{  v.step = 1; // 事前準備

        v.step = 1.1; // 設定値をコピー
        // インスタンス生成後にシートを変更・再読込が行われる可能性を排除できないので、
        // this.argはインスタンス生成時の状態を保存するためコピーを使用する。
        v.arg = Object.assign({},this.arg);

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
        // v.rawのヘッダ行より前の行は削除
        v.raw.splice(0,v.arg.header-1);
        for( v.r=0 ; v.r<v.raw.length ; v.r++ ){
          // 右端列より右の列は削除
          v.raw[v.r].splice(v.arg.right);
          // v.rawの左端列より左の列は削除
          v.raw[v.r].splice(0,v.arg.left-1);
        }
        
        /* ヘッダ行の'label'〜次の項目までの空欄はカラム名=レベル番号に変更
           階層化ラベル欄は'label'または空欄
            fm: 階層化ラベル欄の開始位置。不要部分削除後の添字(0オリジン)
            to: 階層化ラベル欄の終端位置 */
        this.header = [
          {name:'nId',type:'int'},
          {name:'label',type:'string'},
          {name:'base',type:'string'},
          {name:'sys',type:'json'}
        ];
        v.fm = v.to = null; // 階層化ラベル欄の開始/終了位置(添字なので0オリジン)
        v.header = JSON.parse(JSON.stringify(v.raw[0]).replaceAll(/label/g,''));
        for( v.c=v.l=0 ; v.c<v.header.length ; v.c++ ){
          if( v.header[v.c].length === 0 ){ // 空欄 ⇒ 階層化ラベル欄
            if( v.fm === null ) v.fm = v.c;
            v.to = v.c;
          } else {  // 非空欄 ⇒ 定義された属性ならthis.headerに追加
            if( v.arg.attr[v.header[v.c]] ){
              this.header.push({
                name: v.header[v.c],
                type: v.arg.attr[v.header[v.c]],
              });
            }
          }
        }
      })();

      (()=>{  v.step = 2; // this.arrを作成

        v.step = 2.1; // 事前準備
        this.arr = [];  // {Object[]} Objectはv.protoの各項目からsysを除いたもの
        v.proto = JSON.stringify({    // v.obj,arrに格納されるオブジェクトの原型
          nId: null,   // {number} ノードのID。自然数
          label: null, // {string} ノードのラベル
          base: '',  // {number} 継承元ノード(基底ノード)のID
          sys: {
            level: null, // {number} 当該行の階層。自然数
            pId: null,   // {number} 親ノードのID
            seq: null,   // {number} 親ノード内での順番。自然数
            path: [],    // {number[]} ルート〜自要素までのnId
            num: 0,      // {number} 子要素の数
            row: 0,      // {number} シート上の行番号(自然数)
            own: [],     // {number[]} 自分の子要素の配列
            base: [],    // {number[]} base(文字列)を分割、継承元nIdの配列
            ref:[],      // {Object[]} 自分＋継承元ノードの子要素。含、無効な子要素
            children:[], // {Object[]} 自分＋継承元ノードの「有効な」子要素
          }
        });

        // v.stack {Object[]} - レベル毎に最新のnIdとseqを保持する
        v.stack = new Array(9).fill(null);
        v.stack[0] = {nId:0,seq:0}; // root(lv=0)

        v.obj = {0:{nId:0}};
        for( v.r=1 ; v.r<v.raw.length ; v.r++ ){
          v.o = JSON.parse(v.proto);

          // 行(一次元配列)をオブジェクト化
          for( v.c=0 ; v.c<v.raw[v.r].length ; v.c++ ){
            v.val = v.raw[v.r][v.c];
            if( v.val || v.val === 0 ){ // 空欄ではない場合
              if( v.fm <= v.c && v.c <= v.to ){  // 階層化ラベル欄
                v.o.label = v.val;
                v.o.sys.level = v.c - v.fm + 1;
              } else {  // ラベル欄以外
                v.o[v.header[v.c]] = v.val;
              }
            }
          }
          // レベル未定(=ラベル欄に文字列が無い)行はスキップ
          if( v.o.sys.level === null ) continue;

          v.step = 2.25; // pId,seqの設定
          if( v.stack[v.o.sys.level-1] === null ) throw new Error('level skipped.');
          v.o.sys.pId = v.stack[v.o.sys.level-1].nId;
          v.o.sys.seq = ++v.stack[v.o.sys.level-1].seq;
  
          v.step = 2.26; // num(子要素数)の設定、stackの更新
          if( v.stack[v.o.sys.level] !== null ){
            // 更新前の最新ノードの子要素数にseqを代入
            v.obj[v.stack[v.o.sys.level].nId].sys.num = v.stack[v.o.sys.level].seq;
          }
          v.stack[v.o.sys.level] = {nId:v.o.nId,seq:0};
          for( v.i=v.o.sys.level+1 ; v.i<=(v.to-v.fm+1) ; v.i++ ){
            v.stack[v.i] = null;
          }
  
          v.step = 2.27; // row(シート上の行番号)の設定
          v.o.sys.row = v.arg.header + v.r;

          v.step = 2.28; // v.obj, arrへの格納
          v.obj[v.o.nId] = v.o;
          this.arr.push(v.o);
        }
      })();

      (()=>{  v.step = 3; // シート上の「グループ」をthis.groupsに格納
        v.step = 3.1; // 再帰呼出関数を定義
        v.recursive = (o,d=0,path) => {
          const w = {};
          v.step = 3.11;
          if( d > (v.to - v.fm + 1) ) throw new Error('too many depth');
          v.step = 3.12; // 子要素を抽出
          v.children = this.arr.filter(x => x.sys.pId === o.nId).sort((a,b)=>a.seq<b.seq);

          v.step = 3.13; // システム項目の設定
          o.sys.own = v.children.map(x => x.nId);
          o.sys.path = path.concat([o.nId]);
          o.sys.base = JSON.parse(`[${o.base}]`);
          if( o.sys.base.findIndex(x => x === o.nId) < 0 ){
            // baseに自nId未登録ならarg.addに従って追加
            if( v.arg.add === 'bottom' ){
              o.sys.base.push(o.nId);
            } else {
              o.sys.base.unshift(o.nId);
            }
          }

          if( v.children.length === 0 ){
            v.step = 3.14; // 子要素が存在しない場合、edRow=自行
            w.edRow = o.sys.row;
          } else {
            v.step = 3.15; // stRow,edRowは「行番号」(≠添字)
            w.stRow = o.sys.row + 1; // 子要素の開始行＝自要素の次行
            v.children.forEach(x => w.edRow = v.recursive(x,d+1,o.sys.path));
            this.groups.push({st:w.stRow,ed:w.edRow,depth:d});
          }

          v.step = 3.16; // 終了処理
          return w.edRow;
        };
  
        v.step = 3.2; // トップレベルを抽出、再帰関数を呼び出し
        this.groups = [];
        this.arr.filter(x => x.sys.pId === 0).sort((a,b)=>a.seq<b.seq)
        .forEach(x => v.recursive(x,0,[0]));
      })();

      (()=>{  v.step = 4; /* this.arrに継承元の情報を反映、childrenを作成
        自分の子要素の設定ルール
        nId < 0 ⇒ 継承元ノードの-nIdを削除
        nId >= 0
          baseが空欄またはbaseが複数または継承元ノードのいずれにも一致しない ⇒ 追加子要素
          baseが単一かつ継承元ノードの子要素のいずれかに一致
          ⇒ 当該要素の属性項目のみを置換する。孫要素は引き継ぐ
          　※孫要素を引き継がない場合、継承元ノードの子要素を削除し、追加子要素を定義
        整理すると nId>=0 の場合は通常と同じ取扱となる。
        */

        v.step = 4.1; // 事前準備
        v.attrCols = Object.keys(v.arg.attr); // 属性項目名の一覧を作成
        v.obj = {}; // v.objを再設定
        this.arr.forEach(o => v.obj[o.nId] = o);

        v.step = 4.2; // this.arrを基に、空欄を継承元ノードの値で補完
        for( v.i=0 ; v.i<this.arr.length ; v.i++ ){
          v.o = this.arr[v.i];
          for( v.j=0 ; v.j<v.o.sys.base.length ; v.j++ ){
            v.step = 4.2; // 継承元ノード毎の処理
            v.bId = v.o.sys.base[v.j] = Number(v.o.sys.base[v.j]);
            if( v.bId < 0 ) continue; // 削除指定の場合スキップ
            v.step = 4.3; // 空欄があれば継承元の値で補完
            v.attrCols.forEach(x => {
              if((v.obj[v.bId][x] || v.obj[v.bId][x] === 0) && (!v.o[x] && v.o[x] !== 0)){
                v.o[x] = v.obj[v.bId][x];
              }
            });
            v.step = 4.4; // refへの追加
            v.o.sys.ref.push({nId:v.bId,children:v.obj[v.bId].sys.own});
            v.step = 4.5; // childrenへの追加
            v.obj[v.bId].sys.own.forEach(x => {
              // 循環参照していればエラー
              if( v.o.sys.path.findIndex(i => i === x) >= 0 ){
                throw new Error(`circular reference. nId=${x}`);
              }
              // 削除要素ではない(-nIdがbaseに無い)なら追加
              if( v.o.sys.base.findIndex(i => i === -x) < 0 ){
                v.o.sys.children.push({nId:x,base:v.bId});
              }
            });
          }
        }
      })();

      // ---------------------------------------------
      v.step = 9; // 終了処理
      // ---------------------------------------------
      v.rv = {
        arg   : v.arg,
        header: this.header,
        arr   : this.arr,
      };
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
