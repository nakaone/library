this.sheet = this.spread.getSheetByName(this.sheetName);

// 操作対象シート不在の場合、raw/dataから作成
if( this.sheet === null ){
  if( this.data.length > 0 ){ v.step = 2.1; // 引数に行オブジェクト配列が存在

    v.step = 2.11; // 項目一覧(this.header)の作成  
    if( this.cols.length > 0 ){
      // 項目定義が存在
      this.header = this.cols.map(x => x.name);
    } else {
      // 項目定義が不在
      v.step = 4.1; // 項目一覧をthis.headerに作成
      v.obj = {};
      this.data.forEach(x => Object.assign(v.obj,x));
      this.header = Object.keys(v.obj);
    }

    v.step = 2.12; // シートイメージをthis.rawに作成
    this.raw.push(this.header);
    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      v.row = [];
      for( v.j=0 ; v.j<this.header.length ; v.j++ ){
        v.row[v.j] = this.data[v.i][this.header[v.j]] || '';
      }
      this.raw.push(v.row);
    }

    v.step = 2.13; // 新規シートの作成とデータのセット
    this.sheet = this.spread.insertSheet();
    this.sheet.setName(this.sheetName);
    this.sheet.getRange(1,1,this.raw.length,this.header.length).setValues(this.raw);

  } else if( this.raw.length > 0 ){ v.step = 2.2; // 引数にシートイメージが存在

    v.step = 2.21; // ヘッダ行の空白セルに'ColN'を補完、項目一覧をthis.headerに作成
    for( v.i=0 ; v.i<this.raw[0].length ; v.i++ ){
      if( this.raw[0][v.i] === '' ) this.raw[0][v.i] = 'Col' + (v.i+1);
      this.header.push(this.raw[0][v.i]);
    }

    v.step = 2.22; // 行オブジェクト(this.data)を作成
    for( v.i=1 ; v.i<this.raw.length ; v.i++ ){
      v.obj = {};
      for( v.j=0 ; v.j<this.header.length ; v.j++ ){
        if( this.raw[v.i][v.j] ){
          v.obj[this.header[v.j]] = this.raw[v.i][v.j];
        }
      }
      if( Object.keys(v.obj).length > 0 ){  // 有効な項目があれば登録(空行はスキップ)
        this.data.push(v.obj);
      }
    }

    v.step = 2.23; // 新規シートの作成とデータのセット
    this.sheet = this.spread.insertSheet();
    this.sheet.setName(this.sheetName);
    this.sheet.getRange(1,1,this.raw.length,this.header.length).setValues(this.raw);

  } else { v.step = 2.3; // シートも行オブジェクトもシートイメージも無し ⇒ エラー
    throw new Error(`Couldn't find heet "${this.sheetName}" and no data, no raw.`);
  }
}
