/**
 * @typedef {Object} SingleTableObject
 * === クラス共通
 * @prop {string} className - クラス名(=SingleTable)
 * @prop {number} [logMode=0] - 0:エラーログ、1:終了ログ、2:開始ログ、4:実行時ログ、以上の論理和
 * @prop {Function} clog - ログモードを判断してコンソールにログを出力
 * @prop {Function} deepcopy - 劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書き
 * 
 * === SingleTable 特有メンバ
 * @prop {string} name - シート名またはA1形式の範囲指定文字列
 * @prop {Spreadsheet} sheet - シートオブジェクト
 * @prop {any[][]} raw - 指定シート上の有効データ(二次元配列)
 * @prop {string[]} header - ヘッダ行(項目名欄の並び)
 * @prop {number} top - ヘッダ行の行番号(自然数)
 * @prop {number} left - データ領域左端の列番号(自然数)
 * @prop {number} right - データ領域右端の列番号(自然数)
 * @prop {number} bottom - データ領域下端の行番号(自然数)
 * @prop {Array.Object.<string, any>} data - 項目名：値をメンバとするオブジェクトの配列
 * 
 * === SingleTable 特有メソッド
 * @prop {Function} convertNotation - 列記号<->列番号(数値)の相互変換
 * @prop {Function} select - 条件に該当するレコード(オブジェクト)を抽出
 * @prop {Function} update - 条件に該当するレコード(オブジェクト)を更新
 * @prop {Function} insert - レコード(オブジェクト)を追加
 * @prop {Function} delete - 条件に該当するレコード(オブジェクト)を削除
 */

/** スプレッドシートに対して参照・変更・削除を行う
 * 
 * - 原則「1シート1テーブル」で運用する
 *   ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
 *   複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
 * - 表の結合には対応しない(join機能は実装しない)
 * - データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
 * 
 * #### 参考
 * - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
 */
class SingleTable {
  /** @constructor
 * @param {string} name - 参照先シート名またはA1形式の範囲指定文字列
 * @param {Object} opt - オプション。内容はSingleTableオブジェクト定義を参照
 */
constructor(name,opt={}){
  this.className = 'SingleTable';
  this.logMode = 7;
  const v = {whois:this.className+'.constructor',
    default:{ // メンバの既定値定義
      sheet: null,
      name: name,
      header: [],
      top:1, left:1, bottom:Infinity, right:Infinity,
      data: [],
    },
    dataRange: null,  // {Range} 空白セルを含むデータの存在する範囲
  };
  this.clog(1,v.whois+' start.');
  try {

    v.step = 1.1; // シート名がA1形式の範囲指定文字列なら引数name,optを書き換え
    v.m = name.match(/^'*(.+?)'*!([A-Za-z]+)([0-9]*):([A-Za-z]+)([0-9]*)$/);
    if( v.m ){
      name = v.m[1];
      console.log('l.292 name=%s, opt=%s',name,JSON.stringify(opt));
      opt = Object.assign(opt,{
        left: this.convertNotation(v.m[2]),
        top: Number(v.m[3]),
        right: this.convertNotation(v.m[4]),
      });
      if( v.m[5] ) opt.bottom = Number(v.m[5]);
      console.log('l.298 name=%s, opt=%s',name,JSON.stringify(opt));
    }

    v.step = 1.2; // メンバの既定値を設定
    v.default.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    v.rv = this.deepcopy(this,v.default);
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 1.3; // 指定値をメンバに反映
    v.rv = this.deepcopy(this,opt);
    if( v.rv instanceof Error ) throw v.rv;

    v.step = 1.4; // 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
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

    v.step = 2; // シート上でのデータ有効範囲の確定
    // ヘッダ行番号以下の有効範囲(行)をv.rawに取得、先頭行で左右の空白セル以外の部分をヘッダ行と見なす
    // ヘッダ行の中に存在する空白セルは有効な列と見なし、ラベルを自動採番する
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

    v.step = 3; // 確定した有効範囲内のデータをthis.raw/dataに保存
    // this.rawにはヘッダ行の他、有効範囲内の空白行、空白セルも含まれる
    // this.dataはヘッダ行なし、有効範囲内の空白行は含むが空白セルは除外される
    //   ∵シート上の行位置とオブジェクトの位置を対応可能にするため
    this.raw = [];
    v.bottom = -1;
    for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
      [v.arr, v.obj] = [[],{}];
      // 有効なデータが存在する行ならフラグを立てる(v.isValid=true)
      for( v.c=this.left-1 ; v.c<this.right ; v.c++ ){
        v.arr.push(v.raw[v.r][v.c]);
        if( v.raw[v.r][v.c] !== '' ){
          // 末尾から辿って最初の有効行ならv.bottomに保存
          if( v.bottom < 0 ) v.bottom = v.r;
          v.obj[v.raw[0][v.c]] = v.raw[v.r][v.c];
        }
      }
      // 末尾の空白行を除き、this.raw/data配列に追加
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

  /** ログモードを判断してコンソールにログを出力
 * - クラスでの使用が前提。メンバthis.logModeと引数typeの論理積>0ならログ出力
 * 
 * @param {string[]} msg - 出力するメッセージの配列
 * @param {number} [type=3] - メッセージの種類。0:エラーログ、1:終了ログ、2:開始ログ、4:実行時ログ
 * @returns {void}
 */
clog(type=3,...msg){
  //console.log('clog: logMode=%s, type=%s, and=%s, msg=%s',this.logMode,type,(this.logMode & type),JSON.stringify(msg));
  if( !Array.isArray(msg) ) msg = [msg];
  if( (this.logMode & type) > 0 ) console.log(...msg);
}

  /** 劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書き
 * @param {Object} dest
 * @param {Object} opt
 * @returns {null|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(opt) | 劣後(dest) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [A+B] | 配列は置換ではなく結合。但し重複不可 |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 */
deepcopy(dest,opt){
  const v = {whois:this.className+'.deepcopy',rv:null,step:0};
  this.clog(1,v.whois+' start.');
  try {

    Object.keys(opt).forEach(x => {
      v.step = 1;
      if( !dest.hasOwnProperty(x) ){
        v.step = 2;
        // コピー先に存在しなければ追加
        dest[x] = opt[x];
      } else {
        if( whichType(dest[x]) === 'Object' && whichType(opt[x]) === 'Object' ){
          v.step = 3; // 両方オブジェクト -> メンバをマージ
          v.rv = this.deepcopy(dest[x],opt[x]);
          if( v.rv instanceof Error ) throw v.rv;
        } else if( whichType(dest[x]) === 'Array' && whichType(opt[x]) === 'Array'  ){
          v.step = 4; // 両方配列 -> 配列をマージ
          // Setで配列要素の重複を排除しているが、
          // 配列要素が配列型・オブジェクト型の場合は重複する(中身もマージされない)
          dest[x] = [...new Set([...dest[x],...opt[x]])];
          //dest[x] = dest[x].concat(opt[x]);
          ////console.log(dest[x],opt[x]);
        } else {
          v.step = 5; // 両方オブジェクトでも両方配列でもない場合、optの値でdestの値を置換
          dest[x] = opt[x];
        }
      }
    });

    v.step = 6; // 終了処理
    this.clog(2,v.whois+' normal end. result=%s',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
    return e;
  }
}

  /** 列記号<->列番号(数値)の相互変換
 * @param {string|number} arg - 列記号または列番号(自然数)
 */
convertNotation(arg){
  const v = {rv:null,map: new Map([
    // 26進数 -> 列記号
    ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
    ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
    ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
    ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
    ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
    ['p','Z'],
    // 列記号 -> 26進数
    ['A',1],['B',2],['C',3],['D',4],['E',5],
    ['F',6],['G',7],['H',8],['I',9],['J',10],
    ['K',11],['L',12],['M',13],['N',14],['O',15],
    ['P',16],['Q',17],['R',18],['S',19],['T',20],
    ['U',21],['V',22],['W',23],['X',24],['Y',25],
    ['Z',26],
  ])};
  try {

    if( typeof arg === 'number' ){
      v.step = 1; // 数値の場合
      // 1未満はエラー
      if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
      v.rv = '';
      v.str = (arg-1).toString(26); // 26進数に変換
      // 26進数 -> 列記号に変換
      for( v.i=0 ; v.i<v.str.length ; v.i++ ){
        v.rv += v.map.get(v.str.slice(v.i,v.i+1));
      }
    } else if( typeof arg === 'string' ){
      v.step = 2; // 文字列の場合
      arg = arg.toUpperCase();
      v.rv = 0;
      for( v.i=0 ; v.i<arg.length ; v.i++ )
        v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
    } else {
      v.step = 3; // 数値でも文字列でもなければエラー
      throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
    }

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = 'convertNotation: ' + e.message;
    return e;
  }
}

  /** 条件に該当するレコード(オブジェクト)を抽出
 * @param {Object} [opt={}] - オプション
 * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
 * @param {string[][]} [opt.orderBy=[]] - 並べ替えのキーと昇順/降順指定
 *  [['key1'(,'desc')],['key2'(,'desc')],...]
 * @returns {Array.Object.<string, any>|Error}
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * v.r = v.table.select({
 *   where: x => x.B3 && 1<x.B3 && x.B3<9,
 *   orderBy:[['B3'],['C3','desc']]
 * });
 * console.log(JSON.stringify(v.r));
 * // -> [
 *   {"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
 *   {"B3":5,"C3":6,"Col1":7,"E3":8},
 *   {"B3":5,"C3":4}
 * ]
 * ```
 * 
 * 「Col1に'g'が含まれる」という場合
 * ```
 * where: x => {return x.Col1 && String(x.Col1).indexOf('g') > -1}
 * ```
 */
select(opt={}){
  const v = {whois:this.className+'.select',step:0,rv:[]};
  this.clog(1,v.whois+' start.');
  try {
    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = () => true;
    if( !opt.hasOwnProperty('orderBy') )
      opt.orderBy = [];

    v.step = 2; // 対象となるレコードを抽出
    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      if( Object.keys(this.data[v.i]).length > 0 // 空Objではない
          && opt.where(this.data[v.i]) ) // 対象判定結果がtrue
        v.rv.push(this.data[v.i]);
    }

    v.step = 3; // 並べ替え
    //v.rv = this.orderBy(v.rv,opt.orderBy);
    v.rv.sort((a,b) => {
      for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
        [v.p, v.q] = opt.orderBy[v.i][1]
        && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
        if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
        if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
      }
      return 0;
    });

    v.step = 4; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}

  /**
 * @typedef {Object} UpdateResult
 * @prop {number} row - 変更対象の行番号(自然数)
 * @prop {Object} old - 変更前の行オブジェクト
 * @prop {Object} new - 変更後の行オブジェクト
 * @prop {Object.<string, any[]>} diff - {変更した項目名：[変更前,変更後]}形式のオブジェクト
 * @prop {number} row - 更新対象行番号(自然数)
 * @prop {number} left - 更新対象領域左端列番号(自然数)
 * @prop {number} right - 更新対象領域右端列番号(自然数)
 */
/** 条件に該当するレコード(オブジェクト)を更新
 * 
 * - 指定条件が複雑になるため、複数行の一括更新は行わない
 * 
 * @param {Function} src - 行オブジェクトを引数に、セットする{項目名:値}を返す関数
 * @param {Object} [opt={}] - オプション
 * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
 * @returns {UpdateResult[]|Error} 更新結果を格納した配列
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * // B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
 * v.table.update({
 *   func:o=>{return {Col1:'hoge',E3:'fuga'}},
 *   opt:{where:o=>o.B3&&o.B3==4}
 * });  // 戻り値 -> [{
 *   "old":{"B3":4,"C3":3,"Col1":"a","E3":"b"},
 *   "new":{"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
 *   "diff":{"Col1":["a","hoge"],"E3":["b","fuga"]},
 *   "row":7,
 *   "left":4,"right":5
 * }]
 * ```
 * 
 * 更新対象データを直接指定、また同一行の他の項目から導出してセットすることも可能。
 * 
 * ```
 * // E3欄に'a'をセットする
 * v.table.update(
 *   {E3:'a'},  // 更新対象データを直接指定
 *   {where:o=>o.B3==5&&o.C3==4}
 * )
 * // Col1欄にB3+C3の値をセットする
 * v.table.update(
 *   o=>{return {Col1:(o.B3||0)+(o.C3||0)}},  // 他項目から導出
 *   {where:o=>o.B3==5&&o.C3==4}
 * )
 * ```
 */
update(src,opt={}){
  const v = {whois:this.className+'.update',step:0,rv:[],
    // top〜rightは更新する場合の対象領域(行/列番号。自然数)
    top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
  this.clog(1,v.whois+' start.');
  try {
    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = () => true;


    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      v.step = 2; // 1行ずつ差分をチェック
      if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
        v.step = 2.1; // 「空Objではない かつ 対象判定結果がtrue」なら更新対象
        v.r = { // {UpdateResult} - 更新結果オブジェクトを作成
          old: Object.assign({},this.data[v.i]),
          new: this.data[v.i],
          diff: {},
          row: this.top + 1 + v.i,
          left: 99999999, right: -99999999,  // 変更があった列番号の範囲
        };

        v.step = 2.2; // 更新後の値をv.diffに格納
        v.diff = whichType(src) === 'Object' ? src : src(this.data[v.i]);

        v.step = 2.3; // 差分が存在する項目の洗い出し
        v.exist = false;  // 差分が存在したらtrue
        this.header.forEach(x => {
          v.step = 2.4; // 項目毎に差分判定
          if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
            v.step = 2.5; // 更新後に値が変わる場合
            v.exist = true; // 値が変わった旨、フラグを立てる
            v.r.new[x] = v.diff[x];
            v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
            v.col = this.left + this.header.findIndex(i=>i==x); // 変更があった列番号
            // 一行内で、更新があった範囲(左端列・右端列)の値を書き換え
            v.r.left = v.r.left > v.col ? v.col : v.r.left;
            v.r.right = v.r.right < v.col ? v.col : v.r.right;
          }
        });

        // いずれかの項目で更新後に値が変わった場合
        if( v.exist ){
          v.step = 3.1; // 更新対象領域を書き換え
          v.top = v.top > v.r.row ? v.r.row : v.top;
          v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
          v.left = v.left > v.r.left ? v.r.left : v.left;
          v.right = v.right < v.r.right ? v.r.right : v.right;

          v.step = 3.2; // this.raw上のデータを更新
          this.raw[v.r.row-this.top] = (o=>{
            const rv = [];
            this.header.forEach(x => rv.push(o[x]||''));
            return rv;
          })(v.r.new);

          v.step = 3.3; // ログ(戻り値)に追加
          v.rv.push(v.r);
        }
      }
    }

    v.step = 5; // シート上の更新対象領域をthis.rawで書き換え
    v.data = (()=>{ // 更新対象領域のみthis.rawから矩形に切り出し
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

    v.step = 6; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}

  /** レコード(オブジェクト)を追加
 * 
 * - 複数行の一括追加も可
 * 
 * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
 * @returns {number|Error} 追加した行数
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * v.table.insert({B3:3,E3:1});
 *   // -> 一行追加
 * v.table.insert([{B3:2,E3:2},{C3:1,Col1:'hoge'}]);
 *   // -> 複数行追加
 * ```
 */
insert(records=[]){
  const v = {whois:this.className+'.insert',step:0,rv:[],
    r:[],left:99999999,right:-99999999};
  this.clog(1,v.whois+' start.');
  try {

    v.step = 1; // 引数がオブジェクトなら配列に変換
    if( !Array.isArray(records) ) records = [records];

    for( v.i=0 ; v.i<records.length ; v.i++ ){
      v.step = 2; // 挿入するレコード(オブジェクト)を配列化してthis.rawに追加
      v.arr = [];
      for( v.j=0 ; v.j<this.header.length ; v.j++ ){
        v.step = 3; // 空欄なら空文字列をセット
        v.cVal = records[v.i][this.header[v.j]] || '';

        if( v.cVal !== '' ){
          v.step = 4; // 追加する範囲を見直し
          v.left = v.left > v.j ? v.j : v.left;
          v.right = v.right < v.j ? v.j : v.right;
        }

        v.step = 5; // 一行分のデータ(配列)に項目の値を追加
        v.arr.push(v.cVal);
      }
      v.step = 6; // 一行分のデータをthis.raw/dataに追加
      this.clog(4,'l.428 v.arr=%s',JSON.stringify(v.arr));
      this.raw.push(v.arr);
      this.data.push(records[v.i]);
      v.rv.push(v.arr);
    }
    this.clog(4,"l.443 v.r=%s\nv.top=%s, v.bottom=%s, v.left=%s, v.right=%s",JSON.stringify(v.r),v.top,v.bottom,v.left,v.right)

    v.step = 7; // 更新範囲(矩形)のみv.rv -> v.rにコピー
    v.rv.forEach(x => v.r.push(x.slice(v.left,v.right-v.left+1)));

    v.step = 8; // シートに追加
    this.sheet.getRange(
      this.bottom+1,
      this.left+v.left,
      v.r.length,
      v.r[0].length
    ).setValues(v.r);

    v.step = 9; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}

  /** 条件に該当するレコード(オブジェクト)を削除
 * @param {Object} [opt={}] - オプション
 * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
 * @returns {Array.Object.<string, any>|Error}
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * v.table.delete({where:o=>o.Col1&&o.Col1==7});
 *   // -> Col1==7の行を削除。判定用変数(Col1)の存否、要確認
 * v.table.delete({where:o=>o.val&&o.val==5});
 *   // -> val==5の行を全て削除。
 * ```
 */
delete(opt={}){
  const v = {whois:this.className+'.delete',step:0,rv:[]};
  this.clog(1,v.whois+' start.');
  try {
    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = () => true;

    for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
      v.step = 2; // 下の行から判定し、削除による行ズレの影響を回避
      if( Object.keys(this.data[v.i]).length>0 && opt.where(this.data[v.i]) ){
        v.step = 3; // 削除対象(空Objではない and 対象判定結果がtrue
        v.rowNum = this.top + v.i + 1;
        // 1シート複数テーブルの場合を考慮し、headerの列範囲のみ削除して上にシフト
        this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
        .deleteCells(SpreadsheetApp.Dimension.ROWS);
      }
    }

    v.step = 4; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}

}
