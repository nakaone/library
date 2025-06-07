function test(){
  console.log(getFileList());
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{ name: "ファイル一覧作成", functionName: "fileListDownload" }];
  spreadsheet.addMenu("道具箱", entries);
}

function fileListDownload() {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
}

function getFileList(){
  const v = {rv:{},base:new Date().getTime()};
  // base: old.json作成用。使用時にはリスト化対象日時を指定(ex. new Date('2025/4/1'))

  // 本スプレッドシートのIDを取得
  v.spread = SpreadsheetApp.getActiveSpreadsheet();
  v.spreadId = v.spread.getId();

  // 親フォルダおよび直下のファイルを取得
  v.parent = DriveApp.getFileById(v.spreadId).getParents();
  v.folderId = v.parent.next().getId();
  v.folder = DriveApp.getFolderById(v.folderId);
  v.files = v.folder.getFiles();

  while( v.files.hasNext() ){
    v.file = v.files.next();
    v.obj = {
      id: v.file.getId(), // ID
      name: v.file.getName(), // ファイル名
      mime: v.file.getMimeType(),
      desc: v.file.getDescription(),  // 説明
      url: v.file.getUrl(), // ファイルを開くURL
      download : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
      viewers : [], // {string[]} 閲覧者・コメント投稿者のリスト
      editors : [], // {string[]} 編集者(e-mail)のリスト
      created : toLocale(v.file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
      updated : toLocale(v.file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
    };
    // Userからe-mailを抽出
    // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
    v.file.getViewers().forEach(x => v.obj.viewers.push(x.getEmail()));
    v.file.getEditors().forEach(x => v.obj.editors.push(x.getEmail()));
    // 指定日時以前に作成されたファイルを出力(old.json作成用)
    if( v.file.getDateCreated().getTime() < v.base ){
      v.rv[v.obj.id] = v.obj;
    }
  }

  return JSON.stringify(v.rv,null,2);

}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg - 変換元の日時
 * @param {string} [format='yyyy-MM-ddThh:mm:ss.nnnZ'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */
function toLocale(arg,format='yyyy-MM-ddThh:mm:ss.nnnZ'){
  const v = {rv:format};
  try {

    let dObj = whichType(arg,'Date') ? arg : new Date(arg);
    //dObj = String(Object.prototype.toString.call(arg).slice(8,-1)) !== 'Date' ? arg : new Date(arg);

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.local = { // 地方時ベース
      y: dObj.getFullYear(),
      M: dObj.getMonth()+1,
      d: dObj.getDate(),
      h: dObj.getHours(),
      m: dObj.getMinutes(),
      s: dObj.getSeconds(),
      n: dObj.getMilliseconds(),
      Z: Math.abs(dObj.getTimezoneOffset())
    }
    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    v.step = 2; // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}
/** 変数の型を判定
 *
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
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