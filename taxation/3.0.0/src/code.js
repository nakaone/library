const dev = devTools();
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    { name: 'ファイル一覧更新', functionName: 'refreshMaster' },
    { name: "ファイル一覧出力", functionName: "fileListDownload" },
  ];
  spreadsheet.addMenu("道具箱", entries);
}

function fileListDownload() {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
}

/** masterJSONalyze : masterシートの内容をJSON化して返す */
function masterJSONalyze() {
  const v = { whois: 'masterJSONalyze', rv: []};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 事前準備
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    dev.step(2);  // masterシートの内容出力
    // -------------------------------------------------------------
    v.data = v.spread.getSheetByName('master').getDataRange().getDisplayValues();
    for( v.r=1 ; v.r<v.data.length ; v.r++ ){
      if( !v.data[v.r][0] ) continue; // 空白行(id未設定行)は飛ばす
      // 行オブジェクトの作成
      v.row = {};
      for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
        if( v.data[v.r][v.c] !== '' ){
          v.row[v.data[0][v.c]] = v.data[v.r][v.c];
        }
      }
      // 必要な項目に絞り込んで出力
      v.o = {};
      ['id','name','type','label','date','price','payby','note'].forEach(x => {
        if( v.row[x] ) v.o[x] = v.row[x];
      });
      v.rv.push(v.o);
    }

    // -------------------------------------------------------------
    dev.step(3);  // 交通費シートの内容出力
    // -------------------------------------------------------------
    v.data = v.spread.getSheetByName('交通費').getDataRange().getDisplayValues();
    for( v.r=1 ; v.r<v.data.length ; v.r++ ){
      if( !v.data[v.r][6] ) continue; // 金額未入力は飛ばす
      // 行オブジェクトの作成
      v.row = {type:'交通費'};
      for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
        if( v.data[v.r][v.c] !== '' ){
          v.row[v.data[0][v.c]] = v.data[v.r][v.c];
        }
      }
      v.rv.push(v.row);
    }

    dev.end(); // 終了処理
    return JSON.stringify(v.rv,null,2);

  } catch (e) { dev.error(e); return e; }
}

/** refreshMaster : メニュー「ファイル一覧更新」 */
function refreshMaster() {
  const v = {
    whois: 'refreshMaster', rv: null, cols: [
      // 自動取得・設定項目(機械的に値が決定される項目)
      'id', 'name', 'mime', 'desc', 'url', 'viewers', 'editors', 'created', 'updated', 'isExist',
      // 算式一括設定項目
      'fill',
      // 既定値設定項目(determineTypeで既定値が設定され、適宜手動で修正する項目)
      'type', 'label',
      // 手動追加項目(手動で追記が必要な項目)
      'date', 'price', 'payby', 'note'
    ], colnum: {}
  };
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 既存masterシートの内容をv.masterに読み込み
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.mSheet = v.spread.getSheetByName('master');
    v.master = {};
    if (v.mSheet) {
      dev.step(1.1);  // masterシートが存在する場合、内容をv.masterに読み込み
      v.raw = v.mSheet.getDataRange().getValues();
      for (v.r = 1; v.r < v.raw.length; v.r++) {  // ヘッダ行(0行目)は飛ばす
        v.o = {};
        for (v.c = 0; v.c < v.cols.length; v.c++) {
          v.o[v.raw[0][v.c]] = v.raw[v.r][v.c];
        }
        v.o.isExist = 'x';  // isExistはこの時点で一度クリア
        delete v.o.fill;  // 記入要否欄もクリア
        v.master[v.o.id] = v.o;
      }
    } else {
      dev.step(1.2);  // masterシートが不在の場合、ヘッダ行のみで新規作成
      v.mSheet = v.spread.insertSheet('master');
      v.mSheet.getRange(1, 1, 1, v.cols.length).setValues(v.cols);
    }

    // ------------------------------------------------------------------
    dev.step(2); // フォルダのファイル一覧をv.currentに読み込み、v.masterに反映
    // ------------------------------------------------------------------
    v.current = getFileList();
    for (v.id in v.current) {
      // v.master,v.currentとも値が空白の項目は削除(∵Object.assignで有効値を空白が上書きするのを回避)
      v.mObj = v.master[v.id] || {};
      [v.mObj, v.current[v.id]].forEach(o => {
        for (v.x in o) if (o[v.x] === '') delete o[v.x];
      });
      v.master[v.id] = Object.assign(
        // 設定値は「既定値設定項目 < 既存シート < 自動取得・設定項目」順に優先する
        determineType(v.current[v.id].name),
        (v.master[v.id] || {}),
        v.current[v.id]
      );
    }

    // ------------------------------------------------------------------
    dev.step(3); // シート「master」の名前を「previous」に変更
    // ------------------------------------------------------------------
    v.pSheet = v.spread.getSheetByName('previous');
    if (v.pSheet) { // 既存のシート「previous」は削除
      v.spread.deleteSheet(v.pSheet);
    }
    v.pSheet = v.spread.getSheetByName('master');
    v.pSheet.setName('previous');

    // ------------------------------------------------------------------
    dev.step(4); // シート「master」を新規作成、v.masterを書き出し
    // ------------------------------------------------------------------
    v.mSheet = v.spread.insertSheet('master');
    v.data = [v.cols];
    for (v.id in v.master) {
      v.row = [];
      for (v.i = 0; v.i < v.cols.length; v.i++) {
        v.row.push(v.master[v.id][v.cols[v.i]] || '');
      }
      v.data.push(v.row);
    }
    v.mSheet.getRange(1, 1, v.data.length, v.cols.length).setValues(v.data);

    // ------------------------------------------------------------------
    dev.step(5);  // 項目"fill"のトップに手動追加要否の判定式をセット
    // ------------------------------------------------------------------
    v.parts = ['=arrayformula(_)',
      'if(isblank(a2:a),"",_)',	// idが空欄なら何も表示しない
      'if(l2:l="不明",true,_)',	// typeが「不明」なら対象
      'if(l2:l="電子証憑",_,false)',	// typeが「電子証憑」ではないなら対象外
      'if(m2:m="不明",true,_)',	// labelが「不明」なら対象
      'if(isblank(m2:m),true,_)',	// labelが空欄なら対象
      'if(isblank(n2:n),true,_)',	// dateが空欄なら対象
      'if(isblank(o2:o),true,_)',	// priceが空欄なら対象
      'if(isblank(p2:p),true,false)',	// paybyが空欄なら対象
    ];
    for (v.i = 1, v.formula = v.parts[0]; v.i < v.parts.length; v.i++) {
      v.formula = v.formula.replace('_', v.parts[v.i]);
    }
    // 前準備：各項目の列番号をv.colnumに用意
    v.cols.forEach(x => v.colnum[x] = (v.cols.findIndex(y => x === y) + 1));
    v.mSheet.getRange(2, v.colnum['fill']).setValue(v.formula);

    // ------------------------------------------------------------------
    dev.step(6);  // シート「master」を見やすく変更
    // ------------------------------------------------------------------
    dev.step(6.1); // name(ファイル名)欄の幅は入力内容に合わせる
    v.mSheet.autoResizeColumn(v.colnum['name']);
    dev.step(6.2); // mime〜updated欄は非表示
    v.mSheet.hideColumns(v.colnum['mime'], v.colnum['updated'] - v.colnum['mime'] + 1);
    dev.step(6.3); // isExist欄はチェックボックスに変更して幅縮小
    // チェックボックスへの変更は保留。isExist〜noteの幅を最適化
    v.mSheet.autoResizeColumns(v.colnum['isExist'], v.colnum['note'] - v.colnum['isExist'] + 1);
    dev.step(6.4); // 見出しとして1行目は固定
    v.mSheet.setFrozenRows(1);
    dev.step(6.5); // フィルタを作成、type=不明 or type=電子証憑 and date=空欄のみ表示
    // 既存フィルタがあれば削除
    if (v.mSheet.getFilter() !== null) v.mSheet.getFilter().remove();
    // フィルタを設定
    v.mSheet.getDataRange().createFilter()

    dev.step(6.6); // previousシートは非表示
    v.pSheet.hideSheet();

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

/** getFileList : カレントディレクトリ直下のファイル一覧を取得
 * - 取得項目は自動取得項目のみ、手動追加項目は戻り値に含めない
 */
function getFileList() {
  const v = { rv: {}, base: new Date().getTime() };
  // base: old.json作成用。使用時にはリスト化対象日時を指定(ex. new Date('2025/4/1'))

  // 本スプレッドシートのIDを取得
  v.spread = SpreadsheetApp.getActiveSpreadsheet();
  v.spreadId = v.spread.getId();

  // 親フォルダおよび直下のファイルを取得
  v.parent = DriveApp.getFileById(v.spreadId).getParents();
  v.folderId = v.parent.next().getId();
  v.folder = DriveApp.getFolderById(v.folderId);
  v.files = v.folder.getFiles();

  while (v.files.hasNext()) {
    v.file = v.files.next();
    v.obj = {
      id: v.file.getId(), // ID
      name: v.file.getName(), // ファイル名
      mime: v.file.getMimeType(),
      desc: v.file.getDescription(),  // 説明
      url: v.file.getUrl(), // ファイルを開くURL
      //download : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
      viewers: [], // {string[]} 閲覧者・コメント投稿者のリスト
      editors: [], // {string[]} 編集者(e-mail)のリスト
      created: toLocale(v.file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
      updated: toLocale(v.file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
      isExist: 'o',
    };
    // Userからe-mailを抽出
    // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
    v.file.getViewers().forEach(x => v.obj.viewers.push(x.getEmail()));
    v.file.getEditors().forEach(x => v.obj.editors.push(x.getEmail()));
    // 指定日時以前に作成されたファイルを出力(old.json作成用)
    if (v.file.getDateCreated().getTime() < v.base) {
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
  const v = {
    whois: 'determineType', rv: null, list: [{
      rex: /^MUFG(\d{2})\.pdf$/,
      f: x => { return { type: '通帳', label: `MUFG vol.<a>${('0' + x[1]).slice(-2)}</a>` } }
    }, {
      rex: /^SMBC(\d{2})\.pdf$/,
      f: x => { return { type: '通帳', label: `SMBC vol.<a>${('0' + x[1]).slice(-2)}</a>` } }
    }, {
      // labelの先頭のダッシュが無いと、setValue時「2025/01」が「2025/1/1」と変換されてしまう
      rex: /^(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: 'AMEX', label: `'${x[1]}/${x[2]}` }; },
    }, {
      rex: /^EF(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '恵比寿', label: `'${x[1]}/${x[2]}` } }
    }, {
      rex: /^CK(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '上池袋', label: `'${x[1]}/${x[2]}` } }
    }, {
      rex: /^HS(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '羽沢', label: `'${x[1]}/${x[2]}` } }
    }, {
      rex: /^pension(20\d{2})(\d{2})\.pdf$$/,
      f: x => { return { type: '健保・年金', label: `'${x[1]}/${x[2]}` } }
    }, {
      rex: /^note(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '確証貼付ノート', label: `p.${x[2]}` } }
    }, {
      rex: /^(20\d{2})(\d{2})(\d{2})_400_000\.pdf$/,
      f: x => { return { type: 'YFP', label: `${x[1]}/${x[2]} <a>顧問報酬</a>` }; }
    }, {
      rex: /^(20\d{2})(\d{2})(\d{2})_400_003\.pdf$/,
      f: x => { return { type: 'YFP', label: `${x[1]}/${x[2]} <a>記帳代行</a>` }; }
    }, {
      rex: /^Amazon.+ 注文番号 (\d{3}\-\d{7}\-\d{7})\.pdf$/,
      f: x => { return { type: '電子証憑', store: 'Amazon', orderId: x[1], label: '不明' } }
    }, {
      rex: /^RC\d{9}\.pdf$/,
      f: x => { return { type: '電子証憑', store: 'モノタロウ', label: '不明' } }
    }]
  };
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1); // 証憑種別を判定する正規表現が該当するか順次テスト
    for (v.i = 0; v.i < v.list.length && v.rv === null; v.i++) {
      v.m = filename.match(v.list[v.i].rex);
      if (v.m) v.rv = v.list[v.i].f(v.m);
    }

    if (v.rv === null) v.rv = { type: '不明', label: '不明' };

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

//::$lib/devTools/1.0.0/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::