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
