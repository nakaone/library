/** アクティブなセル範囲の情報を取得する
 * @param {void}
 * @returns {Object|Error} 戻り値の内容はv.rawを参照のこと
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

    v.step = 2; // アクティブセル範囲の情報を一括してv.rawに取得
    v.raw = {
      primitive: {  // 値が存在すればそのままセットする項目(不在ならundefined)
        value: v.active.getValues(), // セルの値
        format: v.active.getNumberFormats(),
        formula: v.active.getFormulas(),  // 数式
        R1C1: v.active.getFormulasR1C1(), // R1C1形式の数式
        note: v.active.getNotes(), // メモ
      },
      default: {  // 値が既定値なら省略する項目
        background: [v.active.getBackgrounds(),'#ffffff'],  // 背景色
        fontColor: [v.active.getFontColors(),'#000000'],  // 文字色
        fontWeight: [v.active.getFontWeights(),'normal'],  // 太さ　[bold/normal]
        horizontalAlign: [v.active.getHorizontalAlignments(),'general'],  // 水平位置
        verticalAlign: [v.active.getVerticalAlignments(),'bottom'], // 垂直位置
      },
      // 値の計算が必要な項目
      type: [], // データ型
      link: [], // {text:"xxx",url:[string|null]}
      // 未対応項目
      border: [], // 罫線
    };

    v.step = 3; // セルごとに情報オブジェクトを作成、
    for( v.r=0 ; v.r<v.raw.primitive.value.length ; v.r++ ){

      v.step = 3.1; // 一行分のデータを格納するlineを初期化
      v.line = [];
      for( v.c=0 ; v.c<v.raw.primitive.value[v.r].length ; v.c++ ){
        v.cell = {};

        v.step = 3.2; // 値が存在すればそのままセットする項目(不在ならundefined)
        Object.keys(v.raw.primitive).forEach(x => {
          if( v.raw.primitive[x][v.r][v.c] ){
            v.cell[x] = v.raw.primitive[x][v.r][v.c];
          }
        });

        v.step = 3.3; // 値が既定値なら省略する項目
        Object.keys(v.raw.default).forEach(x => {
          v.y = v.raw.default[x][0][v.r][v.c];
          if( v.y && (v.y != v.raw.default[x][1]) ) v.cell[x] = v.y;
        });

        v.step = 3.4; // 値の計算が必要な項目 ①データ型
        v.cell.type = whichType(v.raw.primitive.value[v.r][v.c]);

        v.step = 3.5; // 値の計算が必要な項目 ②リンク
        v.l = []; // セル内のリンク文字列の配列。[{text:"xxx",url:[string|null]}]
        v.runs = v.rich[v.r][v.c].getRuns();  // リンクの存否で文字列を分割
        v.hasLink = false; // セル内にリンクが存在すればtrue
        v.rich[v.r][v.c].getRuns().forEach(x => {
          v.url = x.getLinkUrl();
          v.o = {text:x.getText()}; // 分割された文字列のオブジェクト
          if( v.url !== null ){
            // リンクが存在したらURL情報を分割文字列Objに追加
            v.o.url = v.url;
            v.hasLink = true;
          }
          v.l.push(v.o);
        });
        if( v.hasLink ) v.cell.link = v.l;

        v.step = 3.6; // 一セル分のオブジェクトを行に追加
        v.line.push(v.cell);
      }

      v.step = 3.7; // 一行分のデータをrangeに追加
      v.rv.range.push(v.line);
    }

    v.step = 4; // 終了処理
    v.rv = JSON.stringify(v.rv);
    console.log(v.whois+' normal end.\n%s',v.rv);
    return v.rv;

  } catch(e) {
    console.error(e);
    console.error("step=%s : r=%s, c=%s",v.step,v.r,v.c);
    return e;
  }
}