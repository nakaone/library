/** シートから指定有効範囲内のデータを取得
 * - 「指定有効範囲」とは、指定範囲かつデータが存在する範囲を指す。<br>
 *   例：指定範囲=C2:F ⇒ top=3, bottom=7, left=3(C列), right=6(F列)
 * 
 *   | | A | B | C | D | E | F | G | H |
 *   | :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
 *   | 1 | |  | タイトル |  |  |  |  |  |  |
 *   | 2 | |  |  |  |  |  |  |  |  |
 *   | 3 | |  | (Col1) | D3 | E3 | (Col2) |  |  |  |
 *   | 4 | |  |  |  |  |  |  |  |  |
 *   | 5 | |  | 5 | 4 |  |  |  |  |  |
 *   | 6 | |  | 5 | 6 | 7 | 8 |  |  |  |
 *   | 7 | |  | 4 | 3 | hoge | fuga |  |  |  |
 *   | 8 | |  |  |  |  |  |  |  |  |
 *   | 9 | |  |  |  |  |  |  | dummy |  |
 *   | 10 | |  |  |  |  |  |  |  |  |
 * 
 *   - 有効範囲とはデータが存在する範囲(datarange=C1:H9)
 *   - 「タイトル(C1)」「dummy(H9)」は有効範囲だが、指定範囲(C2:F)から外れるので除外
 *   - 指定範囲にデータが存在しない場合、指定有効範囲はデータが存在する範囲とする<br>
 *     ex.C2:Fだが2行目は空なのでtop=3、C列はタイトルはないがデータが存在するのでleft=3
 *   - ヘッダ行(3行目)の空白セル(C3,F3)には自動採番したコラム名を設定(Col1,Col2)
 *   - データ範囲はヘッダ行(3行目)の次の行(4行目)から始まると看做す
 *   - データ範囲内の空行(4行目)もraw/data共に入れる<br>
 *     ∵ シート上の行位置とオブジェクトの位置を対応可能にするため
 *   - 空白セルはdataには入れない(undefinedになる)<br>
 *     ex.5行目={C3:5,D3:4}(Col1,2はundef)、6行目={C3:5,D3:6,Col1:7,Col2:8}
 *   - 有効範囲は9行目(dummy)までだが、指定範囲内だと7行目までなので、bottom=7
 * 
 * @param {void}
 * @returns {void}
 */
prepSheet(){
  const v = {whois:this.className+'.prepSheet',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // シートからデータを取得、初期値設定
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.name);
    if( this.sheet instanceof Error ) throw this.sheet;

    v.step = 2; // 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
    v.dataRange = this.sheet.getDataRange();
    v.top = v.dataRange.getRow();
    v.bottom = v.dataRange.getLastRow();
    v.left = v.dataRange.getColumn();
    v.right = v.dataRange.getLastColumn();
    //console.log(`l.185 v.top=${v.top}, bottom=${v.bottom}, left=${v.left}, right=${v.right}`+`\nthis.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);
    this.top = this.top < v.top ? v.top : this.top;
    // 最終行が先頭行以上、または範囲外の場合は存在範囲に変更
    this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
    this.left = this.left < v.left ? v.left : this.left;
    this.right = this.right > v.right ? v.right : this.right;
    //console.log(`l.191 this.top=${this.top}, bottom=${this.bottom}, left=${this.left}, right=${this.right}`);

    v.step = 3; // ヘッダ行番号以下の有効範囲(行)をv.rawに取得
    v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
    v.raw = this.sheet.getRange(...v.range).getValues();
    //console.log(`l.196 v.raw=${JSON.stringify(v.raw.slice(0,10))}`);

    v.step = 4; // ヘッダ行の空白セルに'ColN'を補完
    v.colNo = 1;
    for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
      this.header.push( v.raw[0][v.i] === '' ? 'Col' + v.colNo : v.raw[0][v.i] );
      v.colNo++;
    }

    v.step = 5; // 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
    for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
      if( v.raw[v.r].join('').length > 0 ){
        this.bottom = this.top + v.r;
        break;
      }
    }

    v.step = 6; // this.raw/dataにデータをセット
    this.raw[0] = v.raw[0]; // ヘッダ行
    for( v.r=1 ; v.r<=(this.bottom-this.top) ; v.r++ ){
      this.raw.push(v.raw[v.r]);
      v.o = {};
      for( v.c=0 ; v.c<this.header.length ; v.c++ ){
        if( v.raw[v.r][v.c] !== '' ){
          v.o[this.header[v.c]] = v.raw[v.r][v.c];
        }
      }
      this.data.push(v.o);
    }

    v.step = 7; // 終了処理
    this.dump();
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}