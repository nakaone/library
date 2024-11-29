/** save: スプレッドシートの内容を分析し、オブジェクトとして返す
 * @param arg {string}=null - スプレッドシートID
 * @return {Object}
 * 
 * - GAS公式 Class [SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app?hl=ja)
 * - GAS公式 Class [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)
 * - GAS公式 Class [Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja)
 */
static save(arg={}){
  const v = {whois:this.constructor.name+'.save',step:0,rv:{}};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 1; // 事前準備
    v.spread = arg.SpreadId ? SpreadsheetApp.openById(arg.SpreadId) : SpreadsheetApp.getActiveSpreadsheet();

    v.step = 2; // フォルダ・ファイル関連、スプレッドシート関連情報を収集
    v.file = DriveApp.getFileById(v.spread.getId());

    v.step = 2.1; // 関数定義
    v.getSpread = () => {
      v.SpreadObject = {
        // フォルダ・ファイル関連情報
        Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
          v.folder = v.file.getParents().next();
          v.folderNames = [];
          while (v.folder) {
            v.folderNames.unshift(v.folder.getName());
            v.parents = v.folder.getParents();
            v.folder = v.parents.hasNext() ? v.parents.next() : null;
          }
          return v.folderNames;
        })(),
        Description: v.file.getDescription(), // ファイルの説明文
        DateCreated: toLocale(v.file.getDateCreated()), // ファイル作成日時
        LastUpdated: toLocale(v.file.getLastUpdated()),
        Size: v.file.getSize(),

        // スプレッドシート関連情報
        Id: v.spread.getId(),
        Name: v.spread.getName(),
        NamedRange: (()=>{  // 名前付き範囲
          v.a = []; v.spread.getNamedRanges().forEach(o => {
            v.r = o.getRange();
            v.a.push({
              Name: o.getName(),
              sheetName: v.r.getSheet().getName(),
              Range: v.r.getA1Notation(),
            });
          }); return v.a;
        })(),
        Owner: v.spread.getOwner().getEmail(),
        SpreadsheetLocale: v.spread.getSpreadsheetLocale(), // 言語/地域
        SpreadsheetTimeZone: v.spread.getSpreadsheetTimeZone(), // スプレッドシートのタイムゾーン
        Url: v.spread.getUrl(),
        Viewers: (()=>{  // 閲覧者とコメント投稿者のリスト
          v.a = [];
          v.spread.getViewers().forEach(x => v.a.push(x.getEmail()));
          return v.a;
        })(),

        SavedDateTime: toLocale(new Date()),  // 本メソッド実行日時
        Sheets: [], // シート情報
      };
      return v.SpreadObject;
    };

    v.step = 2.2; // 関数を実行し、結果をv.rvに格納
    v.rv = v.getSpread();

    v.step = 3; // シート関連情報を収集
    // v.attributes: シート関連情報の属性一覧
    v.attributes = ['SheetId','ColumnWidth','RowHeight','FrozenColumns','FrozenRows','A1Notation','Backgrounds','DataValidations','Values','DisplayValues','FontColorObjects','FontFamilies','FontLines','FontSizes','FontStyles','FontWeights','Formulas','FormulasR1C1','HorizontalAlignments','MergedRanges','Notes','TextDirections','TextRotations','VerticalAlignments'];

    v.step = 3.1; // 関数定義
    v.getSheet = (sheet) => {
      v.dr = sheet.getDataRange();
      v.SheetObject = {
        Name: sheet.getName(),
        SheetId: sheet.getSheetId(),
        ColumnWidth: (()=>{
          v.a = [];
          for( v.i=1 ; v.i<=sheet.getLastColumn() ; v.i++ ){
            v.a.push(sheet.getColumnWidth(v.i));
          }
          return v.a;
        })(),
        RowHeight: (()=>{
          v.a = [];
          for( v.i=1 ; v.i<=sheet.getLastRow() ; v.i++ ){
            v.a.push(sheet.getRowHeight(v.i));
          }
          return v.a;
        })(),
        FrozenColumns: sheet.getFrozenColumns(),  // 固定列数
        FrozenRows: sheet.getFrozenRows(),  // 固定行数


        A1Notation: v.dr.getA1Notation(),
        Backgrounds: v.dr.getBackgrounds(),
        //Borders: JSON.stringify(v.dr.getBorder()),
        DataValidations: (()=>{
          v.dv = v.dr.getDataValidations();
          v.r = [];
          for( v.i=0 ; v.i<v.dv.length ; v.i++ ){
            v.row = [];
            for( v.j=0 ; v.j<v.dv[v.i].length ; v.j++ ){
              if( v.dv[v.i][v.j] === null ){
                v.row.push(null);
              } else {
                v.a = {
                  AllowInvalid: v.dv[v.i][v.j].getAllowInvalid(),
                  CriteriaType: JSON.parse(JSON.stringify(v.dv[v.i][v.j].getCriteriaType())),
                  CriteriaValues: JSON.parse(JSON.stringify(v.dv[v.i][v.j].getCriteriaValues())),
                  HelpText: v.dv[v.i][v.j].getHelpText(),
                };
                v.row.push(v.a);
              }
            }
            v.r.push(v.row);
          }
          return v.r;
        })(),
        Values: v.dr.getValues(),
        DisplayValues: v.dr.getDisplayValues(),
        FontColorObjects: (()=>{
          v.fc = v.dr.getFontColorObjects();
          for( v.i=0 ; v.i<v.fc.length ; v.i++ ){
            for( v.j=0 ; v.j<v.fc[v.i].length ; v.j++ ){
              v.fc[v.i][v.j] = v.fc[v.i][v.j].asRgbColor().asHexString();
            }
          }
          return v.fc;
        })(),
        FontFamilies: v.dr.getFontFamilies(),
        FontLines: v.dr.getFontLines(), // セルの線のスタイル。'underline','line-through','none'など
        FontSizes: v.dr.getFontSizes(),
        FontStyles: v.dr.getFontStyles(), // フォントスタイル。'italic'または'normal'
        FontWeights: v.dr.getFontWeights(),
        Formulas: v.dr.getFormulas(),
        FormulasR1C1: v.dr.getFormulasR1C1(),
        HorizontalAlignments: v.dr.getHorizontalAlignments(),
        MergedRanges: (()=>{  // 結合セル
          v.r = [];
          v.dr.getMergedRanges().forEach(x => v.r.push(x.getA1Notation()));
          return v.r;
        })(),
        Notes: v.dr.getNotes(),
        TextDirections: (()=>{  // セルの方向
          v.td = v.dr.getTextDirections();
          for( v.i=0 ; v.i<v.td.length ; v.i++ ){
            for( v.j=0 ; v.j<v.td[v.i].length ; v.j++ ){
              if( v.td[v.i][v.j] ) v.td[v.i][v.j] = JSON.stringify(v.td[v.i][v.j]);
            }
          }
          return v.td;
        })(),
        TextRotations: (()=>{ // テキストの回転
          v.tr = v.dr.getTextRotations();
          for( v.i=0 ; v.i<v.tr.length ; v.i++ ){
            for( v.j=0 ; v.j<v.tr[v.i].length ; v.j++ ){
              if( v.tr[v.i][v.j] ){
                v.tr[v.i][v.j] = {
                  Degrees: v.tr[v.i][v.j].getDegrees(), // 標準のテキストの向きと現在のテキストの向きとの間の角度
                  Vertical: v.tr[v.i][v.j].isVertical(),  // テキストが縦方向に積み重ねられている場合は true
                };
              }
            }
          }
          return v.tr;
        })(),
        VerticalAlignments: v.dr.getVerticalAlignments(),
        WrapStrategies: (()=>{  // テキストの折り返し
          v.ws = v.dr.getWrapStrategies();
          for( v.i=0 ; v.i<v.ws.length ; v.i++ ){
            for( v.j=0 ; v.j<v.ws[v.i].length ; v.j++ ){
              if( v.ws[v.i][v.j] ){
                v.ws[v.i][v.j] = JSON.stringify(v.ws[v.i][v.j]).replaceAll('"','');
              }
            }
          }
          return v.ws;
        })(),
      };
      return v.SheetObject;
    };

    v.step = 3.2; // 対象シートを選択
    if(!arg.sheets) arg.sheets = [];
    if( arg.sheets.length === 0 ){
      v.sheets = v.spread.getSheets();
    } else {
      v.sheets = [];
      arg.sheets.forEach(x => v.sheets.push(v.spread.getSheetByName(x)));
    }
    v.sheets.forEach(x => v.rv.Sheets.push(v.getSheet(x)));

    v.step = 4; // GDのルートフォルダに保存
    v.filename = arg.filename || `${v.rv.Name}.${toLocale(new Date(),'yyyyMMdd-hhmmss')}.json`;
    DriveApp.createFile(v.filename, JSON.stringify(v.rv), MimeType.PLAIN_TEXT);

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return JSON.stringify(v.rv);
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}