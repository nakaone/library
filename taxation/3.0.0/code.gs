/* =======================================================
[code.js]
  メニューおよびそこから呼ばれる関数の定義。
  build.shで末尾で各種ライブラリを組み込み、
  「証憑yyyy」のGASにcode.gsとしてコピー
======================================================= */

const dev = devTools();
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    { name: 'ファイル一覧更新', functionName: 'refreshMaster' },
    { name: "提出用HTML出力", functionName: "fileListDownload" },
  ];
  spreadsheet.addMenu("道具箱", entries);
}

/* ===============================================================
「ファイル一覧更新」関係
  refreshMaster, getFileList, determineType
「提出用HTML出力」関係
  fileListDownload, getIndexHTML
=============================================================== */

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
      'if(l2:l="不明","o",_)',	// typeが「不明」なら対象
      'if(m2:m="不明","o",_)',	// labelが「不明」なら対象
      'if(l2:l="電子証憑",_,"x")',	// typeが「電子証憑」ではないなら対象外
      'if(isblank(m2:m),"o",_)',	// typeが「電子証憑」でlabelが空欄なら対象
      'if(isblank(n2:n),"o",_)',	// typeが「電子証憑」でdateが空欄なら対象
      'if(isblank(o2:o),"o",_)',	// typeが「電子証憑」でpriceが空欄なら対象
      'if(isblank(p2:p),"o","x")',	// typeが「電子証憑」でpaybyが空欄なら対象
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
    dev.step(6.2); // mime〜isExist欄は非表示
    v.mSheet.hideColumns(v.colnum['mime'], v.colnum['isExist'] - v.colnum['mime'] + 1);
    dev.step(6.3); // isExist欄はチェックボックスに変更して幅縮小
    // チェックボックスへの変更は保留。isExist〜noteの幅を最適化
    v.mSheet.autoResizeColumns(v.colnum['isExist'], v.colnum['note'] - v.colnum['isExist'] + 1);
    dev.step(6.4); // 見出しとして1行目は固定
    v.mSheet.setFrozenRows(1);
    dev.step(6.5); // フィルタを作成、要編集行のみ表示
    // 既存フィルタがあれば削除
    if (v.mSheet.getFilter() !== null) v.mSheet.getFilter().remove();
    // フィルタを設定
    v.filter = v.mSheet.getDataRange().createFilter();
    // fill==='o'の行だけ表示
    v.filter.setColumnFilterCriteria(11, SpreadsheetApp.newFilterCriteria()
      .whenTextEqualTo('o')
      .build()
    );

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
      // 「yyyy/MM」形式は入力時日付と解釈され「yyyy/MM/dd」他に変換されてしまうため、事前にaタグで囲む
      rex: /^(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: 'AMEX', label: `<a>${x[1]}/${x[2]}</a>` }; },
    }, {
      rex: /^EF(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '恵比寿', label: `<a>${x[1]}/${x[2]}</a>` } }
    }, {
      rex: /^CK(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '上池袋', label: `<a>${x[1]}/${x[2]}</a>` } }
    }, {
      rex: /^HS(20\d{2})(\d{2})\.pdf$/,
      f: x => { return { type: '羽沢', label: `<a>${x[1]}/${x[2]}</a>` } }
    }, {
      rex: /^pension(20\d{2})(\d{2})\.pdf$$/,
      f: x => { return { type: '健保・年金', label: `<a>${x[1]}/${x[2]}</a>` } }
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
      // 電子証憑は内容が多岐にわたるため、label=「不明」としてシート上で修正
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

    dev.step(2); // いずれにも合致しない場合、type,label共「不明」を設定
    if (v.rv === null) v.rv = { type: '不明', label: '不明' };

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

/** fileListDownload : メニュー「提出用HTML出力」 */
function fileListDownload() {
  var html = HtmlService.createTemplateFromFile("download").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "作成中");
}

/** getIndexHTML : download.htmlから呼ばれ、税理士提出用のindex.htmlを生成する */
function getIndexHTML() {
  const v = { whois: 'getIndexHTML', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 事前準備
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    dev.step(2);  // masterシートの内容出力
    // -------------------------------------------------------------
    v.master = [];
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
      v.master.push(v.o);
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
      v.master.push(v.row);
    }

    // -------------------------------------------------------------
    dev.step(4);  // index.htmlシートにmaster, notesを埋め込む
    // -------------------------------------------------------------
    v.notes = []; // 「特記事項」シートから全件読み込み、セパレータ無しで結合する
    v.data = v.spread.getSheetByName('特記事項').getDataRange().getDisplayValues();
    v.data.forEach(line => v.notes.push(line.join('')));

    v.rv = HtmlService.createTemplateFromFile("index").evaluate().getContent()
    .replace(
      'id="master">',
      `id="master">const data = ${JSON.stringify(v.master,null,2)};`
    ).replace(
      'id="notes">',
      `id="notes">${v.notes.join('')};`
    );
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

/** devTools: 開発支援関係メソッド集
 * @param {Object} option
 * @param {boolean} option.start=true - 開始・終了メッセージの表示
 * @param {boolean} option.arg=true - 開始時に引数を表示
 * @param {boolean} option.step=false - step毎の進捗ログの出力
 */
function devTools(option) {
  let opt = Object.assign({ start: true, arg: true, step: false }, option);
  let seq = 0;  // 関数の呼出順
  let stack = []; // 呼出元関数情報のスタック
  return { changeOption: changeOption, check: check, dump: dump, end: end, error: error, start: start, step: step };

  /** オプションの変更 */
  function changeOption(option) {
    opt = Object.assign(opt, option);
    console.log(`devTools.changeOption result: ${JSON.stringify(opt)}`);
  }
  /** 実行結果の確認
   * - JSON文字列の場合、オブジェクト化した上でオブジェクトとして比較する
   * @param {Object} arg
   * @param {any} arg.asis - 実行結果
   * @param {any} arg.tobe - 確認すべきポイント(Check Point)。エラーの場合、エラーオブジェクトを渡す
   * @param {string} arg.title='' - テストのタイトル(ex. SpreadDbTest.delete.4)
   * @param {Object} [arg.opt] - isEqualに渡すオプション
   * @returns {boolean} - チェック結果OK:true, NG:false
   */
  function check(arg = {}) {
    /** recursive: 変数の内容を再帰的にチェック
     * @param {any} asis - 結果の値
     * @param {any} tobe - 有るべき値
     * @param {Object} opt - isEqualに渡すオプション
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (asis, tobe, opt, depth = 0, label = '') => {
      let rv;
      // JSON文字列はオブジェクト化
      asis = (arg => { try { return JSON.parse(arg) } catch { return arg } })(asis);
      // データ型の判定
      let type = String(Object.prototype.toString.call(tobe).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(tobe)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in tobe)) type = 'Arrow'; break;
      }
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in tobe) {
            rv = !Object.hasOwn(asis, mn) ? false // 該当要素が不在
              : recursive(asis[mn], tobe[mn], opt, depth + 1, mn);
          }
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < tobe.length; i++) {
            rv = (asis[i] === undefined && tobe[i] !== undefined) ? false // 該当要素が不在
              : recursive(asis[i], tobe[i], opt, depth + 1, String(i));
          }
          msg.push(`${indent}]`);
          break;
        case 'Function': case 'Arrow':
          rv = tobe(asis);  // 合格ならtrue, 不合格ならfalseを返す関数を定義
          msg.push(
            indent + (label.length > 0 ? (label + ': ') : '')
            + (rv ? asis : `[NG] (${tobe.toString()})(${asis}) -> false`)
          );
          break;
        default:
          if (tobe === undefined) {
            rv = true;
          } else {
            rv = isEqual(asis, tobe, opt);
            msg.push(
              indent + (label.length > 0 ? (label + ': ') : '')
              + (rv ? asis : `[NG] ToBe=${tobe}, AsIs=${asis}`)
            );
          }
      }
      return rv;
    }

    // 主処理
    let msg = [];
    let isOK = true;  // チェックOKならtrue

    arg = Object.assign({ msg: '', opt: {} }, arg);
    if (arg.tobe === undefined) {
      // check未指定の場合、チェック省略、結果表示のみ
      msg.push(`===== ${arg.title} Check Result : Not checked`);
    } else {
      // arg.asisとarg.tobeのデータ型が異なる場合、またはrecursiveで不一致が有った場合はエラーと判断
      if (String(Object.prototype.toString.call(arg.asis).slice(8, -1))
        !== String(Object.prototype.toString.call(arg.tobe).slice(8, -1))
        || recursive(arg.asis, arg.tobe, arg.opt) === false
      ) {
        isOK = false;
        msg.unshift(`===== ${arg.title} Check Result : Error`);
      } else {
        msg.unshift(`===== ${arg.title} Check Result : OK`);
      }
    }

    // 引数として渡されたmsgおよび結果(JSON)を先頭に追加後、コンソールに表示
    msg = `::::: Verified by devTools.check\n`
      + `===== ${arg.title} Returned Value\n`
      + JSON.stringify(arg.asis, (k, v) => typeof v === 'function' ? v.toString() : v, 2)
      + `\n\n\n${msg.join('\n')}`;
    if (isOK) console.log(msg); else console.error(msg);
    return isOK;
  }
  /** dump: 渡された変数の内容をコンソールに表示
   * - 引数には対象変数を列記。最後の引数が数値だった場合、行番号と看做す
   * @param {any|any[]} arg - 表示する変数および行番号
   * @returns {void}
   */
  function dump() {
    let arg = [...arguments];
    let line = typeof arg[arg.length - 1] === 'number' ? arg.pop() : null;
    const o = stack[stack.length - 1];
    let msg = (line === null ? '' : `l.${line} `) + `${o.label} step.${o.step}`;
    for (let i = 0; i < arg.length; i++) {
      // 対象変数が複数有る場合、Noを追記
      msg += '\n' + (arg.length > 0 ? `${i}: ` : '') + stringify(arg[i]);
    }
    console.log(msg);
  }
  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function end() {
    const o = stack.pop();
    if (opt.start) console.log(`${o.label} normal end.`);
  }
  /** error: 異常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function error(e) {
    const o = stack.pop();
    // 参考 : e.lineNumber, e.columnNumber, e.causeを試したが、いずれもundefined
    e.message = `${o.label} abnormal end at step.${o.step}\n${e.message}`;
    console.error(e.message
      + `\n-- footprint\n${o.footprint}`
      + `\n-- arguments\n${o.arg}`
    );
  }
  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} name - 関数名
   * @param {any[]} arg - start呼出元関数に渡された引数([...arguments]固定)
   */
  function start(name, arg = []) {
    const o = {
      class: '',  // nameがクラス名.メソッド名だった場合のクラス名
      name: name,
      seq: seq++,
      step: 0,
      footprint: [],
      arg: [],
    };
    o.sSeq = ('000' + o.seq).slice(-4);
    const caller = stack.length === 0 ? null : stack[stack.length - 1]; // 呼出元
    // nameがクラス名.メソッド名だった場合、クラス名をセット
    if (name.includes('.')) [o.class, o.name] = name.split('.');
    // ラベル作成。呼出元と同じクラスならクラス名は省略
    o.label = `[${o.sSeq}]` + (o.class && (!caller || caller.class !== o.class) ? o.class+'.' : '') + o.name;
    // footprintの作成
    stack.forEach(x => o.footprint.push(`${x.label}.${x.step}`));
    o.footprint = o.footprint.length === 0 ? '(root)' : o.footprint.join(' > ');
    // 引数情報の作成
    if (arg.length === 0) {
      o.arg = '(void)';
    } else {
      for (let i = 0; i < arg.length; i++) o.arg[i] = stringify(arg[i]);
      o.arg = o.arg.join('\n');
    }
    // 作成した呼出元関数情報を保存
    stack.push(o);

    if (opt.start) {  // 開始メッセージの表示指定が有った場合
      console.log(`${o.label} start.\n-- footprint\n${o.footprint}` + (opt.arg ? `\n-- arguments\n${o.arg}` : ''));
    }
  }
  /** step: 呼出元関数の進捗状況の登録＋メッセージの表示 */
  function step(step, msg = '') {
    const o = stack[stack.length - 1];
    o.step = step;
    if (opt.step) console.log(`${o.label} step.${o.step} ${msg}`);
  }
  /** stringify: 変数の内容をラベル＋データ型＋値の文字列として出力
   * @param {any} arg - 文字列化する変数
   * @returns {string}
   */
  function stringify(arg) {
    /** recursive: 変数の内容を再帰的にメッセージ化
     * @param {any} arg - 内容を表示する変数
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (arg, depth = 0, label = '') => {
      // データ型の判定
      let type = String(Object.prototype.toString.call(arg).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(arg)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in arg)) type = 'Arrow'; break;
      }
      // ラベル＋データ型＋値の出力
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in arg) recursive(arg[mn], depth + 1, mn);
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < arg.length; i++) recursive(arg[i], depth + 1, String(i));
          msg.push(`${indent}]`);
          break;
        default:
          let val = typeof arg === 'function' ? `"${arg.toString()}"` : (typeof arg === 'string' ? `"${arg}"` : arg);
          // Class Sheetのメソッドのように、toStringが効かないnative codeは出力しない
          if (typeof val !== 'string' || val.indexOf('[native code]') < 0) {
            msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}${val}(${type})`);
          }
      }
    }
    const msg = [];
    recursive(arg);
    return msg.join('\n');
  }
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

