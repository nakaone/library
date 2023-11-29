/* コアスクリプト */
/**
 * Googleスプレッドのメニューに「道具箱」を追加
 *
 * @param {void} - なし
 * @returns {void} なし
 *
 * **使用方法**
 *
 * 1. ライブラリの追加
 *    1. シートのメニュー「拡張機能 > Apps Script」
 *    1. 「マイドライブ > prototype > toolbox」をライブラリとして追加
 *       - 「ライブラリ」で「＋」をクリック
 *       - スクリプトID：10YTe3Ft96Q1eMzJl3fqGqlLoqjW9ypGx97S3jC7hQcxbcAuVXBn2nOMK
 *       - バージョン：HEAD(開発モード)
 *       - ID：toolbox
 * 1. onOpenのソースをtoolbox.gsに登録
 *    1. Apps Script > 「ファイル」を追加、スクリプトを選択
 *    1. 追加したスクリプト名をtoolbox.gsに変更
 *    1. toolbox.gsに以下のonOpen(), initialize()をコピー&ペースト
 * 1. 認証と権限付与<br>
 *    initialize()を実行、認証して実行権限を付与
 * 1. トリガーを設定<br>
 *    Apps Script > トリガー(目覚まし時計アイコン) > トリガーを追加
 *    - 実行する関数：onOpen
 *    - 実行するデプロイ：Head
 *    - イベントのソース：スプレッドシート
 *    - イベントの種類：起動時
 *    - エラー通知：毎日通知を受け取る
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  .addItem("選択範囲をJSON化","jsonRange");
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}

function initialize(){
  const v = {rv:{}};
  console.log('initialize start.');
  // アクティブなセル範囲
  v.spread = SpreadsheetApp.getActiveSpreadsheet();
  v.sheet = v.spread.getActiveSheet();
  v.active = v.sheet.getActiveRange();
  v.rv = {
    spreadId: v.spread.getId(),  // スプレッド(ファイル)のID
    spreadName: v.spread.getName(), // スプレッドの名前
    sheetId: v.sheet.getSheetId(),  // シートのID
    sheetName: v.sheet.getSheetName(),  // シート名
    firstRow: v.active.getRow(),  // 最上行。自然数
    lastRow: v.active.getLastRow(), // 最下行
    firstColumn: v.active.getColumn(),  // 左端列。自然数
    lastColumn: v.active.getLastColumn(), // 右端列
    value: v.active.getValues(), // セルの値
    type: [], // データ型
    format: v.active.getNumberFormats(),
    formula: v.active.getFormulas(),  // 数式
    R1C1: v.active.getFormulasR1C1(), // R1C1形式の数式
    note: v.active.getNotes(), // メモ
    background: v.active.getBackgrounds(),  // 背景色
    fontColor: v.active.getFontColors(),  // 文字色
    fontWeight: v.active.getFontWeights(),  // 太さ　[bold/normal]
    horizontalAlign: v.active.getHorizontalAlignments(),  // 水平位置
    verticalAlign: v.active.getVerticalAlignments(), // 垂直位置
    width: [],  // 列の幅
    height: [], // 行の高さ
    border: [], // 罫線。未対応
  }

  // データ型
  for( v.r=0 ; v.r<v.rv.value.length ; v.r++ ){
    v.l = [];
    for( v.c=0 ; v.c<v.rv.value[v.r].length ; v.c++ ){
      v.l.push(whichType(v.rv.value[v.r][v.c]));
    }
    v.rv.type.push(v.l);
  }

  // 列・行の幅
  for( v.c=v.rv.firstColumn ; v.c<=v.rv.lastColumn ; v.c++ ){
    v.rv.width.push(v.sheet.getColumnWidth(v.c));
  }
  for( v.r = v.rv.firstRow ; v.r<=v.rv.lastRow ; v.r++ ){
    v.rv.height.push(v.sheet.getRowHeight(v.r));
  }

  // 改行は<br>に置換
  v.rv = JSON.stringify(v.rv).replaceAll('\\n','<br>');

  console.log(v.rv);
  console.log('initialize end.');
  Browser.msgBox(v.rv);
}
