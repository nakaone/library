/*
toolbox: Googleスプレッドのメニューに「道具箱」を追加

1. libraty/GAS/toolbox/toolbox.shを実行<br>
   ⇒ libraty/GAS/toolbox/toolbox.gsが生成される
2. toolbox.gsのソースをスプレッドシートに登録
   1. Apps Script > 「ファイル」を追加、スクリプトを選択
   2. 追加したスクリプト名をtoolbox.gsに変更
   3. toolbox.gsに1.で生成されたtoolbox.gsの内容をコピー&ペースト
3. 認証と権限付与<br>
   jsonRange()を実行、認証して実行権限を付与
4. トリガーを設定<br>
   Apps Script > トリガー(目覚まし時計アイコン) > トリガーを追加
   - 実行する関数：onOpen
   - 実行するデプロイ：Head
   - イベントのソース：スプレッドシート
   - イベントの種類：起動時
   - エラー通知：毎日通知を受け取る
5. シートを再起動
*/
/* コアスクリプト */
/**
 * Googleスプレッドのメニューに「道具箱」を追加
 * 
 * @param {void} - なし
 * @returns {void} なし
 * 
 * **使用方法**
 * 
 * 1. libraty/GAS/toolbox/toolbox.shを実行<br>
 *    ⇒ libraty/GAS/toolbox/toolbox.gsが生成される
 * 2. toolbox.gsのソースをスプレッドシートに登録
 *    1. Apps Script > 「ファイル」を追加、スクリプトを選択
 *    2. 追加したスクリプト名をtoolbox.gsに変更
 *    3. toolbox.gsに1.で生成されたtoolbox.gsの内容をコピー&ペースト
 * 3. 認証と権限付与<br>
 *    jsonRange()を実行、認証して実行権限を付与
 * 4. トリガーを設定<br>
 *    Apps Script > トリガー(目覚まし時計アイコン) > トリガーを追加
 *    - 実行する関数：onOpen
 *    - 実行するデプロイ：Head
 *    - イベントのソース：スプレッドシート
 *    - イベントの種類：起動時
 *    - エラー通知：毎日通知を受け取る
 * 5. シートを再起動
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱')
  .addItem("選択範囲をJSON化","jsonRange");
  // サブメニュー使用時はaddSubMenuを使用
  menu.addToUi();
}
/* コアスクリプト */
/**
 * @typedef {Object} jsonRange
 * @prop {string} spreadId - スプレッド(ファイル)のID
 * @prop {string} spreadName - スプレッドの名前
 * @prop {number} sheetId - シートのID
 * @prop {string} sheetName - シート名
 * @prop {number} firstRow - 最上行。自然数
 * @prop {number} lastRow - 最下行
 * @prop {number} firstColumn - 左端列。自然数
 * @prop {number} lastColumn - 右端列
 * @prop {string[][]} value - セルの値
 * @prop {string[][]} type - データ型
 * @prop {string[][]} format - 表示形式
 * @prop {string[][]} formula - 数式
 * @prop {string[][]} R1C1 - R1C1形式の数式
 * @prop {string[][]} note - メモ
 * @prop {string[][]} background - 背景色
 * @prop {string[][]} fontColor - 文字色
 * @prop {string[][]} fontWeight - 太さ　[bold/normal]
 * @prop {string[][]} horizontalAlign - 水平位置
 * @prop {string[][]} verticalAlign - 垂直位置
 * @prop {number[]} width - 列の幅
 * @prop {number[]} height - 行の高さ
 * @prop {void} border - 罫線。未対応
 */


/**
 * Googleスプレッド上で、選択範囲のセル情報をJSON化してmsgBoxに表示
 * 
 * 出力結果は[gSpreadTabulize](gSpreadTabulize.html)でHTML化し、HTML,MD等に貼り付け
 * 
 * @param {void}
 * @returns {jsonRange}
 */
 function jsonRange(){
  const v = {rv:{}};
  console.log('jsonRange start.');
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
  console.log('jsonRange end.');
  Browser.msgBox(v.rv);
}
/** 
 * 変数の型を判定し、型名を文字列で返す。なお引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 * 
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 * 
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 * 
 * <b>確認済戻り値一覧</b>
 * 
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 * 
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *  
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 * 
 */

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
