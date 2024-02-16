/** SingleTableオブジェクトの生成
 * - 引数が二つの場合、name＋optと解釈。一つの場合はoptのみと解釈する。
 * - optで指定可能なメンバは以下の通り
 *   - name : 参照先シート名またはA1形式の範囲指定文字列
 *   - raw : シートイメージ(二次元配列)
 *   - data : オブジェクトの配列
 * - クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
 * 
 * @param {string|Object} arg1 - 参照先シート名またはA1形式の範囲指定文字列(name)、またはオプション(opt)
 * @param {Object} arg2 - オプション(opt)
 * @returns {SingleTableObj|Error}
 */
constructor(arg1,arg2){
  const v = {whois:'SingleTable.constructor',rv:null,step:0,arg:{}};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // 全引数のオブジェクト化＋既定値の設定
    if( typeof arg1 === 'string' ){ // name指定あり
      v.arg = Object.assign({name:arg1},(arg2 || {}));
    } else { // name指定なしでopt指定、または引数無し
      v.arg = arg1;
    }
    v.arg = Object.assign({name:'',raw:[],data:[],header:[]},v.arg);

    v.step = 1.2; // メンバの初期値を設定
    this.sheet = null;
    this.className = 'SingleTable';
    this.name = v.arg.name || '';
    ['header','raw','data'].forEach(x => this[x] = (v.arg[x] || []));

    v.step = 1.3; // nameから指定範囲を特定、メンバに保存
    v.m = this.name.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
    //old v.m = this.name.match(/^'*(.+?)'*!([A-Za-z]+)([0-9]*):([A-Za-z]+)([0-9]*)$/);
    if( v.m ){
      // シート名がA1形式の範囲指定文字列ならname,left/top/right/bottomを書き換え
      this.name = v.m[1];
      this.left = convertNotation(v.m[2]);
      if( v.m[3] ) this.top = Number(v.m[3]);
      this.right = convertNotation(v.m[4]);
      if( v.m[5] ) this.bottom = Number(v.m[5]);
    } else {
      this.top = this.left = 1;
      this.bottom = this.right = Infinity;
    }
    //console.log(`l.65 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}\ndata=${JSON.stringify(this.data)}\nraw=${JSON.stringify(this.raw)}`);

    v.step = 2; // sheetかdataかで処理を分岐
    this.type = (this.data.length > 0 || this.raw.length > 0 ) ? 'data' : 'sheet';
    if( this.type === 'sheet' ){
      v.r = this.prepSheet();
    } else {
      v.r = this.prepData();
    }
    if( v.r instanceof Error ) throw v.r;

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg1=${JSON.stringify(arg1)}\narg2=${JSON.stringify(arg2)}`;  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}  
