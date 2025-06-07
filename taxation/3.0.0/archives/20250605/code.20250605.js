/* 要改善ポイント
1. typeが引き継がれない(determineTypeから機械的に導出された値で手動設定値が上書きされる)
2. 列の幅を最適化
3. 「criteria=trueでフィルタして編集を」のメッセージを追加
*/

const dev = devTools();
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    { name: 'ファイル一覧更新', functionName: 'refreshMaster'},
    { name: "ファイル一覧出力", functionName: "fileListDownload" },
  ];
  spreadsheet.addMenu("道具箱", entries);
}

/** refreshMaster : メニュー「ファイル一覧更新」 */
function refreshMaster() {
  const v = { whois: 'refreshMaster', rv: null, cols:[
    'id','name','type','mime','desc','url','viewers','editors','created','updated','isExist','date','abstract','price','payby','note'
  ]};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 既存masterシートの内容をv.masterに読み込み
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.raw = v.spread.getSheetByName('master').getDataRange().getValues();
    v.master = {};
    for( v.r=1 ; v.r<v.raw.length ; v.r++ ){  // ヘッダ行(0行目)は飛ばす
      v.o = {};
      for( v.c=0 ; v.c<v.cols.length ; v.c++ ){
        v.o[v.cols[v.c]] = v.raw[v.r][v.c];
      }
      v.o.isExist = false;  // isExistはこの時点で一度クリア
      v.master[v.o.id] = v.o;
    }
    dev.dump(v.master,32);

    // ------------------------------------------------------------------
    dev.step(2); // フォルダのファイル一覧をv.currentに読み込み、v.masterに反映
    // ------------------------------------------------------------------
    v.current = getFileList();
    for( v.id in v.current ){
      v.master[v.id] = Object.assign((v.master[v.id] || {}),v.current[v.id]);
    }
    dev.dump(v.master,41);

    // ------------------------------------------------------------------
    dev.step(3); // シート「master」の名前を「previous」に変更
    // ------------------------------------------------------------------
    v.pSheet = v.spread.getSheetByName('previous');
    if( v.pSheet ){ // 既存のシート「previous」は削除
      v.spread.deleteSheet(v.pSheet);
    }
    v.pSheet = v.spread.getSheetByName('master');
    v.pSheet.setName('previous');

    // ------------------------------------------------------------------
    dev.step(4); // シート「master」を新規作成、v.masterを書き出し
    // ------------------------------------------------------------------
    v.mSheet = v.spread.insertSheet('master');
    v.data = [v.cols];
    for( v.id in v.master ){
      v.row = [];
      for( v.i=0 ; v.i<v.cols.length ; v.i++ ){
        v.row.push(v.master[v.id][v.cols[v.i]] || '');
      }
      v.data.push(v.row);
    }
    v.mSheet.getRange(1,1,v.data.length,v.cols.length).setValues(v.data);

    // ------------------------------------------------------------------
    dev.step(5);  // シート「master」を見やすく変更
    // ------------------------------------------------------------------
    dev.step(5.1); // name(ファイル名)欄の幅は入力内容に合わせる
    v.mSheet.autoResizeColumn(2);
    dev.step(5.2); // mime〜updated欄は非表示
    v.mSheet.hideColumns(4,7);
    dev.step(5.3); // isExist欄はチェックボックスに変更して幅縮小
    dev.step(5.4); // 見出しとして1行目は固定
    v.mSheet.setFrozenRows(1);
    dev.step(5.5); // フィルタを作成、type=不明 or type=電子証憑 and date=空欄のみ表示
    // 判断条件をQ列に設定
    v.mSheet.getRange('Q1').setValue('criteria');
    v.mSheet.getRange('Q2').setValue('=arrayformula(if(isblank(A2:A),"",if(C2:C="不明",true,if(C2:C="電子証憑",if(L2:L="",true,false),false))))');
    // 既存フィルタがあれば削除
    if( v.mSheet.getFilter() !== null ) v.mSheet.getFilter().remove();
    // フィルタを設定
    v.mSheet.getDataRange().createFilter()
    /*
    // 判断条件をQ列に設定
    v.mSheet.getRange('Q1').setValue('criteria');
    v.mSheet.getRange('Q2').setValue('=arrayformula(if(isblank(A2:A),"",if(C2:C="不明",true,if(C2:C="電子証憑",if(L2:L="",true,false),false))))');
    // 既存フィルタがあれば削除
    if( v.mSheet.getFilter() !== null ) v.mSheet.getFilter().remove();
    // フィルタを設定
    v.mSheet.getDataRange().createFilter().setColumnFilterCriteria(17,
      SpreadsheetApp.newFilterCriteria()
      .whenBooleanIs(true) // TRUEの場合
      .build()
    );


    v.filter = v.mSheet.getFilter();
    v.formula = `=or(c:c="不明",and(c:c="電子証憑",l:l=""))`;
    v.criteria = SpreadsheetApp.newFilterCriteria().whenFormulaSatisfied(v.formula).build();
    v.filter.setColumnFilterCriteria(1, v.criteria);
    */


    dev.step(5.6); // previousシートは非表示
    v.pSheet.hideSheet();

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

function fileListDownload() {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
}

/** getFileList : カレントディレクトリ直下のファイル一覧を取得
 * - 取得項目は自動取得項目のみ、手動追加項目は戻り値に含めない
 */
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
      type: '',
      mime: v.file.getMimeType(),
      desc: v.file.getDescription(),  // 説明
      url: v.file.getUrl(), // ファイルを開くURL
      //download : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
      viewers : [], // {string[]} 閲覧者・コメント投稿者のリスト
      editors : [], // {string[]} 編集者(e-mail)のリスト
      created : toLocale(v.file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
      updated : toLocale(v.file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
      isExist: true,
    };
    // 証憑種別
    v.obj.type = determineType(v.obj.name).type;
    // Userからe-mailを抽出
    // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
    v.file.getViewers().forEach(x => v.obj.viewers.push(x.getEmail()));
    v.file.getEditors().forEach(x => v.obj.editors.push(x.getEmail()));
    // 指定日時以前に作成されたファイルを出力(old.json作成用)
    if( v.file.getDateCreated().getTime() < v.base ){
      v.rv[v.obj.id] = v.obj;
    }
  }

  return v.rv;
}

/** determineType : ファイル名から証憑種別を識別。該当無しの場合「不明」とする
 * @param {string} filename - 証憑のファイル名
 * @returns {Object} - 識別結果のオブジェクト。メンバ"type"は共通、他メンバは証憑種別により変化
 */
function determineType(filename) {
  const v = { whois: 'determineType', rv: null, list:[{
    rex:/^Amazon.+ 注文番号 (\d{3}\-\d{7}\-\d{7})\.pdf$/,
    f:x=>{return {type:'電子証憑',store:'Amazon',orderId:x[1]}}
  },{
    rex:/^RC\d{9}\.pdf$/,
    f:x=>{return {type:'電子証憑',store:'モノタロウ'}}
  },{
    rex:/^(20\d{2})(\d{2})(\d{2})_400_000\.pdf$/,
    f:x=>{return {type:'YFP税務顧問報酬',year:x[1],month:x[2]};}
  },{
    rex:/^(20\d{2})(\d{2})(\d{2})_400_003\.pdf$/,
    f:x=>{return {type:'YFP記帳代行報酬',year:x[1],month:x[2]};}
  },{
    rex:/^(20\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'AMEX',year:x[1],month:x[2]};},
  },{
    rex:/^EF(20\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'恵比寿',year:x[1],month:x[2]}}
  },{
    rex:/^CK(20\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'上池袋',year:x[1],month:x[2]}}
  },{
    rex:/^HS(20\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'羽沢',year:x[1],month:x[2]}}
  },{
    rex:/^MUFG(\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'MUFG通帳',noteNumber:x[1],page:x[2]}}
  },{
    rex:/^SMBC(\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'SMBC通帳',noteNumber:x[1],page:x[2]}}
  },{
    rex:/^note(20\d{2})(\d{2})\.pdf$/,
    f:x=>{return {type:'確証貼付ノート',fy:x[1],page:x[2]}}
  },{
    rex:/^pension(20\d{2})(\d{2})\.pdf$$/,
    f:x=>{return {type:'健保・年金',year:x[1],month:x[2]}}
  }]};
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1); // 証憑種別を判定する正規表現が該当するか順次テスト
    for( v.i=0 ; v.i<v.list.length && v.rv === null ; v.i++ ){
      v.m = filename.match(v.list[v.i].rex);
      if( v.m ) v.rv = v.list[v.i].f(v.m);
    }

    if( v.rv === null ) v.rv = {type:'不明'};

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}