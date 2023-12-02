/** アクティブなセル範囲の情報を取得する
 * @param {void} - 無し
 * @returns {Object|Error} 戻り値はexampleを参照
 * 
 * @example
 * 
 * - spreadId {string} スプレッド(ファイル)のID
 * - spreadName {string} スプレッドの名前
 * - sheetId {number} シートのID
 * - sheetName {string} シート名
 * - firstRow {number} 最上行。自然数
 * - lastRow {number} 最下行
 * - firstColumn {number} 左端列。自然数
 * - lastColumn {number} 右端列
 * - width {number[]} シート上の列の幅(px)
 * - height {number[]} シート上の行の高さ(px)
 * - range {Object[][]} セルごとの情報。該当値が無い場合はundefind
 *   - value {any} セルの値。空欄ならundefined
 *   - type {string} データ型
 *   - validation {Object} 入力規則。詳細は[Class DataValidation](https://developers.google.com/apps-script/reference/spreadsheet/data-validation?hl=ja#getCriteriaValues())参照
 *     - AllowInvalid {boolean} 入力時の検証で不合格だった場合、警告表示ならtrue、完全拒否ならfalse
 *     - CriteriaType {string} データ検証基準。出現する値については[Enum DataValidationCriteria](https://developers.google.com/apps-script/reference/spreadsheet/data-validation-criteria?hl=ja)参照。
 *     - CriteriaValues {Object[]} ルールの条件の引数の配列
 *   - formula {string} 数式
 *   - R1C1 {string} R1C1形式の数式
 *   - note {string} メモ
 *   - background {string} 背景色
 *   - format {string} 表示形式
 *   - fontSize {number} 文字サイズ。単位はpt
 *   - fontColor {string} 文字色
 *   - fontWeight {string} 太さ　[bold/normal]
 *   - horizontalAlign {string} 水平位置
 *   - verticalAlign {string} 垂直位置
 *   - wrap {string} 折り返し。OVERFLOW:折り返しなし、WRAP:折り返しあり、CLIP:切り詰め
 *   - link {Object[]} リンク
 *     - text {string} リンクが貼ってある文字列
 *     - url {string} URL
 * 
 * ```
 * {
 *   "spreadId":"18bH3p9QaRg36L0rIhcWCmopRGewyQ7MYgTcNTsJ1gIY",
 *   "spreadName":"仕訳日記帳",
 *   "sheetId":31277711,
 *   "sheetName":"勘定科目",
 *   "firstRow":4,
 *   "lastRow":5,
 *   "firstColumn":19,
 *   "lastColumn":21,
 *   "width":[32,32,127],
 *   "height":[21,21],
 *   "range":[[{           // 文字列
 *     "value":"損益計算書",
 *     "type":"String",
 *     "background":"#666666",
 *     "format":"0.###############",
 *     "fontColor":"#ffffff",
 *     "fontWeight":"bold",
 *     "horizontalAlign":"general-left",
 *     "verticalAlign":"bottom"
 *   },{                   // 数値
 *     "value":1,
 *     "type":"Number",
 *     "background":"#666666",
 *     "format":"0.###############",
 *     "fontColor":"#000000",
 *     "fontWeight":"normal",
 *     "horizontalAlign":"general-right",
 *     "verticalAlign":"bottom"
 *   },{                   // 日付
 *     "value":"2023-11-30T15:00:00.000Z",
 *     "type":"Date",
 *     "background":"#666666",
 *     "format":"m/d",
 *     "fontColor":"#ff0000",
 *     "fontWeight":"normal",
 *     "horizontalAlign":"general-right",
 *     "verticalAlign":"bottom"
 *   }],[{                 // 真偽値
 *     "value":true,
 *     "type":"Boolean",
 *     "background":"#ffffff",
 *     "format":"0.###############",
 *     "fontColor":"#000000",
 *     "fontWeight":"normal",
 *     "horizontalAlign":"general-center",
 *     "verticalAlign":"bottom"
 *   },{                   // 数式
 *     "value":"中",
 *     "type":"String",
 *     "formula":"=\"中\"",
 *     "R1C1":"=\"中\"",
 *     "background":"#ffffff",
 *     "format":"0.###############",
 *     "fontColor":"#000000",
 *     "fontWeight":"normal",
 *     "horizontalAlign":"general-left",
 *     "verticalAlign":"bottom"
 *   },{                   // リンク
 *     "value":"勘定科目",
 *     "type":"String",
 *     "note":"赤字は追加した勘定科目",
 *     "background":"#ffffff",
 *     "format":"0.###############",
 *     "fontColor":"#000000",
 *     "fontWeight":"normal",
 *     "horizontalAlign":"general-left",
 *     "verticalAlign":"bottom",
 *     "link":[{   // 「勘定科目」の内、「勘定」の部分だけリンクが貼られた場合
 *       "text":"勘定",
 *       "url":"https://advisors-freee.jp/article/category/cat-big-02/cat-small-04/14503/"
 *     },{
 *       "text":"科目"
 *     }]
 *   }]]}
 * ```
 * 
 * ```
 * {  // 空欄。valueが存在しない
 *   "type":"String",
 *   "background":"#666666",
 *   "format":"0.###############",
 *   "fontColor":"#000000",
 *   "fontWeight":"normal",
 *   "horizontalAlign":"general",
 *   "verticalAlign":"bottom"
 * }
 * ```
 * 
 * 入力規則
 * ```
 * {    // 真偽値、チェックボックス指定無し
 *   "value":true,
 *   "type":"Boolean",
 *   "background":"#ffffff",
 *   "format":"0.###############",
 *   "fontColor":"#000000",
 *   "fontWeight":"normal",
 *   "horizontalAlign":"general-center",
 *   "verticalAlign":"bottom"
 * },{  // 真偽値、チェックボックス指定あり
 *   "value":true,
 *   "type":"Boolean",
 *   "validation":{  // <-- ここが追加
 *     "AllowInvalid":true,
 *     "CriteriaType":"CHECKBOX",
 *     "CriteriaValues":[]
 *   },
 *   "background":"#ffffff",
 *   "format":"0.###############",
 *   "fontColor":"#000000",
 *   "fontWeight":"normal",
 *   "horizontalAlign":"general-center",
 *   "verticalAlign":"bottom"
 * },{  // プルダウン
 *   "type":"String",
 *   "validation":{
 *     "AllowInvalid":false,
 *     "CriteriaType":"VALUE_IN_LIST",
 *     "CriteriaValues":[["オプション 1","オプション 2"],true]
 *   },
 *   "background":"#ffffff",
 *   "format":"0.###############",
 *   "fontColor":"#000000",
 *   "fontWeight":"normal",
 *   "horizontalAlign":"general",
 *   "verticalAlign":"bottom"
 * }
 * ```
 */
function getActiveCellInfo(){
  const v = {whois:'getCellInfo',rv:[],step:0};
  console.log(v.whois+' start.');
  try {

    v.step = 1.1; // アクティブなセル範囲を取得
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getActiveSheet();
    v.active = v.sheet.getActiveRange();
    v.rich = v.active.getRichTextValues();
    v.validation = v.active.getDataValidations();
    // 未対応：結合されたセル情報 .getMergedRanges() 戻り値は{Range}

    v.step = 1.2; // シート単位の情報を戻り値にセット
    v.rv = {
      spreadId: v.spread.getId(),  // スプレッド(ファイル)のID
      spreadName: v.spread.getName(), // スプレッドの名前
      sheetId: v.sheet.getSheetId(),  // シートのID
      sheetName: v.sheet.getSheetName(),  // シート名
      firstRow: v.active.getRow(),  // 最上行。自然数
      lastRow: v.active.getLastRow(), // 最下行
      firstColumn: v.active.getColumn(),  // 左端列。自然数
      lastColumn: v.active.getLastColumn(), // 右端列
      width: [],  // シート上の列の幅(px)
      height: [], // シート上の行の高さ(px)
      range: [],  // セルごとの情報
    }

    v.step = 1.3; // 行・列の幅を戻り値にセット
    for( v.c=v.rv.firstColumn ; v.c<=v.rv.lastColumn ; v.c++ ){
      v.rv.width.push(v.sheet.getColumnWidth(v.c));
    }
    for( v.r = v.rv.firstRow ; v.r<=v.rv.lastRow ; v.r++ ){
      v.rv.height.push(v.sheet.getRowHeight(v.r));
    }

    v.step = 2; // 属性ごとに必要なデータを取得。導出が必要な属性(type,link)は関数として定義
    v.props = {
      value: v.active.getValues(), // セルの値
      type: (r,c)=>{return whichType(v.props.value[r][c])},  // データ型
      validation: (r,c)=>{if(v.validation[r][c]) return {   // 入力規則
        AllowInvalid : v.validation[r][c].getAllowInvalid(),
        CriteriaType : v.validation[r][c].getCriteriaType(),
        CriteriaValues : v.validation[r][c].getCriteriaValues(),
      }},
      formula: v.active.getFormulas(),  // 数式
      R1C1: v.active.getFormulasR1C1(), // R1C1形式の数式
      note: v.active.getNotes(), // メモ
      background: v.active.getBackgrounds(),  // 背景色
      format: v.active.getNumberFormats(),   // 表示形式
      fontSize: v.active.getFontSizes(),   // 文字サイズ
      fontColor: v.active.getFontColors(),  // 文字色
      fontWeight: v.active.getFontWeights(),  // 太さ　[bold/normal]
      horizontalAlign: v.active.getHorizontalAlignments(),  // 水平位置
      verticalAlign: v.active.getVerticalAlignments(), // 垂直位置
      wrap: v.active.getWrapStrategies(), // 折り返し
      link: (r,c) => {                                 // リンク
        v.l = []; // セル内のリンク文字列の配列。[{text:"xxx",url:[string|null]}]
        v.hasLink = false; // セル内にリンクが存在すればtrue
        v.rich[r][c].getRuns().forEach(x => {  // リンクの存否で文字列を分割
          v.url = x.getLinkUrl();
          v.obj = {text:x.getText()}; // 分割された文字列のオブジェクト
          if( v.url !== null ){
            // リンクが存在したらURL情報を分割文字列Objに追加
            v.obj.url = v.url;
            v.hasLink = true;
          }
          v.l.push(v.obj);
        });
        return v.hasLink ? v.l : undefined;
      },
    }

    v.step = 3; // 行×列で走査、セルごとの属性をv.rv.rangeに保存
    for( v.r=0 ; v.r<(v.rv.lastRow-v.rv.firstRow+1) ; v.r++ ){
      v.line = [];
      for( v.c=0 ; v.c<(v.rv.lastColumn-v.rv.firstColumn+1) ; v.c++ ){
        v.cell = {};
        Object.keys(v.props).forEach(prop => {
          v.prop = prop;  // エラー発生時の発生箇所特定用変数
          v.cell[prop] = typeof v.props[prop] === 'function'
          ? v.props[prop](v.r,v.c)
          : (v.props[prop][v.r][v.c] ? v.props[prop][v.r][v.c] : undefined);
        });
        v.line.push(v.cell);
      }
      v.rv.range.push(v.line);
    }

    v.step = 4; // 終了処理
    v.rv = JSON.stringify(v.rv);
    console.log(v.whois+' normal end.\n%s',v.rv);
    return v.rv;

  } catch(e) {
    console.error(e,v);
    return e;
  }
}




class SingleTable {
  constructor(name,opt={}){
    this.className = 'SingleTable';
    this.logMode = 7;
    const v = {whois:this.className+'.constructor',
      default:{
        sheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name),
        name: name,
        header: [],
        top:1, left:1, bottom:Infinity, right:Infinity,
        data: [],
      },
      dataRange: null,
    };
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1.1;
      v.rv = this.deepcopy(this,v.default);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.2;
      v.rv = this.deepcopy(this,opt);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.3;
      v.dataRange = this.sheet.getDataRange();
      v.top = v.dataRange.getRow();
      v.bottom = v.dataRange.getLastRow();
      v.left = v.dataRange.getColumn();
      v.right = v.dataRange.getLastColumn();
      this.clog(4,"v.top=%s, v.bottom=%s, v.left=%s, v.right=%s",v.top,v.bottom,v.left,v.right);
      this.top = this.top < v.top ? v.top : this.top;
      this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
      this.left = this.left < v.left ? v.left : this.left;
      this.right = this.right > v.right ? v.right : this.right;
      v.step = 2;
      v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
      this.clog(4,'v.range=%s',JSON.stringify(v.range));
      v.raw = this.sheet.getRange(...v.range).getValues();
      v.left = -1; v.colNo = 1;
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        if( v.raw[0][v.i] !== '' ){
          if( v.left < 0 ) v.left = v.i;
          v.right = v.i;
        } else if( v.left > -1 ){
          v.raw[0][v.i] = 'Col' + v.colNo;
          v.colNo++;
        }
      }
      this.left = v.left + 1;
      this.right = v.right + 1;
      this.clog(4,"this.top=%s, this.bottom=%s, this.left=%s, this.right=%s",this.top,this.bottom,this.left,this.right);
      v.step = 3;
      this.raw = [];
      v.bottom = -1;
      for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
        [v.arr, v.obj] = [[],{}];
        for( v.c=this.left-1 ; v.c<this.right ; v.c++ ){
          v.arr.push(v.raw[v.r][v.c]);
          if( v.raw[v.r][v.c] !== '' ){
            if( v.bottom < 0 ) v.bottom = v.r;
            v.obj[v.raw[0][v.c]] = v.raw[v.r][v.c];
          }
        }
        if( v.bottom > -1 ){
          this.raw.unshift(v.arr);
          if( v.r > 0 ) this.data.unshift(v.obj);
        }
      }
      this.header = this.raw[0];
      this.bottom = this.top + v.bottom;
      this.clog(2,v.whois+' normal end.');
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  clog(type=3,...msg){
    if( !Array.isArray(msg) ) msg = [msg];
    if( (this.logMode & type) > 0 ) console.log(...msg);
  }
  deepcopy(dest,opt){
    const v = {whois:this.className+'.deepcopy',rv:null,step:0};
    this.clog(1,v.whois+' start.');
    try {
      Object.keys(opt).forEach(x => {
        v.step = 1;
        if( !dest.hasOwnProperty(x) ){
          v.step = 2;
          dest[x] = opt[x];
        } else {
          if( whichType(dest[x]) === 'Object' && whichType(opt[x]) === 'Object' ){
            v.step = 3;
            v.rv = this.deepcopy(dest[x],opt[x]);
            if( v.rv instanceof Error ) throw v.rv;
          } else if( whichType(dest[x]) === 'Array' && whichType(opt[x]) === 'Array'  ){
            v.step = 4;
            dest[x] = [...new Set([...dest[x],...opt[x]])];
          } else {
            v.step = 5;
            dest[x] = opt[x];
          }
        }
      });
      v.step = 6;
      this.clog(2,v.whois+' normal end. result=%s',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
  convertNotation(arg){
    const v = {rv:null,map: new Map([
      ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
      ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
      ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
      ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
      ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
      ['p','Z'],
      ['A',1],['B',2],['C',3],['D',4],['E',5],
      ['F',6],['G',7],['H',8],['I',9],['J',10],
      ['K',11],['L',12],['M',13],['N',14],['O',15],
      ['P',16],['Q',17],['R',18],['S',19],['T',20],
      ['U',21],['V',22],['W',23],['X',24],['Y',25],
      ['Z',26],
    ])};
    try {
      if( typeof arg === 'number' ){
        v.step = 1;
        if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
        v.rv = '';
        v.str = (arg-1).toString(26);
        for( v.i=0 ; v.i<v.str.length ; v.i++ ){
          v.rv += v.map.get(v.str.slice(v.i,v.i+1));
        }
      } else if( typeof arg === 'string' ){
        v.step = 2;
        arg = arg.toUpperCase();
        v.rv = 0;
        for( v.i=0 ; v.i<arg.length ; v.i++ )
          v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
      } else {
        v.step = 3;
        throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
      }
      v.step = 4;
      return v.rv;
    } catch(e) {
      e.message = 'convertNotation: ' + e.message;
      return e;
    }
  }
  select(opt={}){
    const v = {whois:this.className+'.select',step:0,rv:[]};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      if( !opt.hasOwnProperty('orderBy') )
        opt.orderBy = [];
      v.step = 2;
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0
           && opt.where(this.data[v.i]) )
          v.rv.push(this.data[v.i]);
      }
      v.step = 3;
      v.rv.sort((a,b) => {
        for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
          [v.p, v.q] = opt.orderBy[v.i][1]
          && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
          if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
          if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
        }
        return 0;
      });
      v.step = 4;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  update(src,opt={}){
    const v = {whois:this.className+'.update',step:0,rv:[],
      top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        v.step = 2;
        if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
          v.step = 2.1;
          v.r = {
            old: Object.assign({},this.data[v.i]),
            new: this.data[v.i],
            diff: {},
            row: this.top + 1 + v.i,
            left: 99999999, right: -99999999,
          };
          v.step = 2.2;
          v.diff = whichType(src) === 'Object' ? src : src(this.data[v.i]);
          v.step = 2.3;
          v.exist = false;
          this.header.forEach(x => {
            v.step = 2.4;
            if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
              v.step = 2.5;
              v.exist = true;
              v.r.new[x] = v.diff[x];
              v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
              v.col = this.left + this.header.findIndex(i=>i==x);
              v.r.left = v.r.left > v.col ? v.col : v.r.left;
              v.r.right = v.r.right < v.col ? v.col : v.r.right;
            }
          });
          if( v.exist ){
            v.step = 3.1;
            v.top = v.top > v.r.row ? v.r.row : v.top;
            v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
            v.left = v.left > v.r.left ? v.r.left : v.left;
            v.right = v.right < v.r.right ? v.r.right : v.right;
            v.step = 3.2;
            this.raw[v.r.row-this.top] = (o=>{
              const rv = [];
              this.header.forEach(x => rv.push(o[x]||''));
              return rv;
            })(v.r.new);
            v.step = 3.3;
            v.rv.push(v.r);
          }
        }
      }
      v.step = 5;
      v.data = (()=>{
        let rv = [];
        this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
          rv.push(l.slice(v.left-this.left,v.right-this.left+1));
        });
        return rv;
      })();
      this.sheet.getRange(
        v.top,
        v.left,
        v.bottom-v.top+1,
        v.right-v.left+1
      ).setValues(v.data);
      v.step = 6;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  insert(records=[]){
    const v = {whois:this.className+'.insert',step:0,rv:[],
      r:[],left:99999999,right:-99999999};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !Array.isArray(records) ) records = [records];
      for( v.i=0 ; v.i<records.length ; v.i++ ){
        v.step = 2;
        v.arr = [];
        for( v.j=0 ; v.j<this.header.length ; v.j++ ){
          v.step = 3;
          v.cVal = records[v.i][this.header[v.j]] || '';
          if( v.cVal !== '' ){
            v.step = 4;
            v.left = v.left > v.j ? v.j : v.left;
            v.right = v.right < v.j ? v.j : v.right;
          }
          v.step = 5;
          v.arr.push(v.cVal);
        }
        v.step = 6;
        this.clog(4,'l.428 v.arr=%s',JSON.stringify(v.arr));
        this.raw.push(v.arr);
        this.data.push(records[v.i]);
        v.rv.push(v.arr);
      }
      this.clog(4,"l.443 v.r=%s\nv.top=%s, v.bottom=%s, v.left=%s, v.right=%s",JSON.stringify(v.r),v.top,v.bottom,v.left,v.right)
      v.step = 7;
      v.rv.forEach(x => v.r.push(x.slice(v.left,v.right-v.left+1)));
      v.step = 8;
      this.sheet.getRange(
        this.bottom+1,
        this.left+v.left,
        v.r.length,
        v.r[0].length
      ).setValues(v.r);
      v.step = 9;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  delete(opt={}){
    const v = {whois:this.className+'.delete',step:0,rv:[]};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
        v.step = 2;
        if( Object.keys(this.data[v.i]).length>0 && opt.where(this.data[v.i]) ){
          v.step = 3;
          v.rowNum = this.top + v.i + 1;
          this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
          .deleteCells(SpreadsheetApp.Dimension.ROWS);
        }
      }
      v.step = 4;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
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