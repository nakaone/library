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
