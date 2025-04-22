const dev = devTools();
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('道具箱');
  menu.addItem('スプレッドシートの属性情報出力','saveSpread');
  menu.addItem('表示中のシートの属性情報出力','getActiveSheet');
  menu.addSubMenu(
    ui.createMenu("選択範囲をHTML化")
    .addItem('行列記号を付ける','range2html1')
    .addItem('行列記号を付けない','range2html2')
  );
  menu.addSubMenu(
    ui.createMenu("GAS Utilities")
    .addItem('全てのトリガーを削除','deleteAllTriggers')
  );
  menu.addSeparator();
  menu.addItem('GDファイル一覧','gdFileList');
  menu.addToUi();
}

//// メニュー(onOpen)から呼ばれる関数群 ///////////////////////////////////////////////

function saveSpread(){
  const sp = new SpreadProperties();
  return sp.saveSpread('saveSpread') // 自分自身の関数名を引数とする
}
function getActiveSheet(){
  const sp = new SpreadProperties();
  const rv = sp.getSheet();
  const ui = SpreadsheetApp.getUi();
  ui.alert(`Sheet "${rv.Name}"`,JSON.stringify(rv), ui.ButtonSet.OK);
}
function range2html1(){ // 選択範囲をHTML化 > 行列記号を付ける
  const sp = new SpreadProperties();
  showSidebar({result:sp.range2html({guide:true})});
}
function range2html2(){ // 選択範囲をHTML化 > 行列記号を付けない
  const sp = new SpreadProperties();
  showSidebar({result:sp.range2html({guide:false})});
}
function deleteAllTriggers() {  // 全てのトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  Logger.log('全てのトリガーが削除されました。');
}
function gdFileList() { // 本スプレッドシートが存在するフォルダ内のファイル一覧出力
  showSidebar({result:GoogleDrive()});
}

//// ライブラリ ///////////////////////////////////////////////

// ----- "SpreadProperties"で使用 ----------------------
/** 列記号<->列番号(数値)の相互変換
 * @param {string|number} arg - 列記号または列番号(自然数)
 */
function convertNotation(arg){
  const v = {rv:null,map: new Map([
    // 26進数 -> 列記号
    ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
    ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
    ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
    ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
    ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
    ['p','Z'],
    // 列記号 -> 26進数
    ['A',1],['B',2],['C',3],['D',4],['E',5],
    ['F',6],['G',7],['H',8],['I',9],['J',10],
    ['K',11],['L',12],['M',13],['N',14],['O',15],
    ['P',16],['Q',17],['R',18],['S',19],['T',20],
    ['U',21],['V',22],['W',23],['X',24],['Y',25],
    ['Z',26],
  ])};
  try {

    if( typeof arg === 'number' ){
      v.step = 1; // 数値の場合
      // 1未満はエラー
      if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
      v.rv = '';
      v.str = (arg-1).toString(26); // 26進数に変換
      // 26進数 -> 列記号に変換
      for( v.i=0 ; v.i<v.str.length ; v.i++ ){
        v.rv += v.map.get(v.str.slice(v.i,v.i+1));
      }
    } else if( typeof arg === 'string' ){
      v.step = 2; // 文字列の場合
      arg = arg.toUpperCase();
      v.rv = 0;
      for( v.i=0 ; v.i<arg.length ; v.i++ )
        v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
    } else {
      v.step = 3; // 数値でも文字列でもなければエラー
      throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
    }

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = 'convertNotation: ' + e.message;
    return e;
  }
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
function GoogleDrive(arg={}) {
  const pv = {whois: 'GoogleDrive',cols:[  // シートの項目定義
    {name:'id', type:'string', note:'', primaryKey:true},
    {name:'name', type:'string', note:''},
    {name:'mime', type:'string', note:'ファイルのMIMEタイプ'},
    {name:'desc', type:'string', note:'ファイルの説明'},
    {name:'url', type:'string', note:'ファイルを開く際に使用するURL'},
    {name:'download', type:'string', note:'ファイルをダウンロードする際に使用するURL'},
    {name:'viewers', type:'string[]', note:'閲覧者・コメント投稿者のリスト'},
    {name:'editors', type:'string[]', note:'編集者(e-mail)のリスト'},
    {name:'created', type:'string', note:'ファイルの作成日付。拡張ISO8601形式の文字列 '},
    {name:'updated', type:'string', note:'ファイルの最終更新日付。拡張ISO8601形式の文字列 '},
    {name:'isDeleted', type:'string', note:'削除済ならtrue', default: '()=>{return false}'},
  ]};
  const v = { whois: `${pv.whois}.main`, rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数をメンバに格納
    // -------------------------------------------------------------
    v.r = constructor(arg);
    if( v.r instanceof Error ) throw v.r;

    // フォルダ内の全てのファイルを取得。但し子フォルダ内は取得対象外
    v.r = listFiles(pv.folder);
    if( v.r instanceof Error ) throw v.r;

    // listシートの内容を取得、ファイル一覧と比較してシートを更新し、結果を行オブジェクトの配列として返す
    v.r = updateList(v.r,pv.data);
    if( v.r instanceof Error ) throw v.r;
    v.rv = JSON.stringify(v.r);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(arg) {
    const v = { whois: `${pv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // メンバ設定、Google Driveシート・フォルダ取得
      // -------------------------------------------------------------
      dev.step(1.1);  // メンバ設定
      v.default = {
        root: 'current',
        children: false,
        type: null,
        table: 'list',
        json: true,
      };
      for( let k in v.default ){
        pv[k] = arg[k] || v.default[k]
      }

      dev.step(1.2);  // 本スプレッドシートのIDを取得
      pv.spread = SpreadsheetApp.getActiveSpreadsheet();
      pv.spreadId = pv.spread.getId();

      dev.step(1.3);  // 親フォルダを取得
      v.parent = DriveApp.getFileById(pv.spreadId).getParents();
      pv.folderId = v.parent.next().getId();
      pv.folder = DriveApp.getFolderById(pv.folderId);

      // -------------------------------------------------------------
      dev.step(2);  // シート情報
      // -------------------------------------------------------------
      dev.step(2.1);  // 対象シート作成
      v.r = SpreadDb([
        {command: 'create', table: pv.table, cols: pv.cols,},
        {command: 'select', table: pv.table, where:true}, // 全件抽出
      ], { userId: 'Administrator' });
      if (v.r instanceof Error) return v.r;
      pv.data = v.r[1].result;  // シート上に保存されているデータ
      dev.dump(pv.data,79);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function listFiles(folder) {
    const v = { whois: `${pv.whois}.listFiles`, rv: []};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // フォルダ内のファイルを取得
      v.files = folder.getFiles();

      dev.step(2);  // 各ファイルの情報をオブジェクト化
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
        v.rv.push(v.obj);
        dev.dump(v.obj,99);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function updateList(drive,table) {
    const v = { whois: `${pv.whois}.updateList`, rv: null, drive:[],table:[],query:[]};
    dev.start(v.whois, [...arguments]);
    try {
      /*
      drive - Google Drive上のファイル情報
      table - listシートに記録されたファイル情報

      drive有・table有 : 作成・更新日時が異なったらdriveの値で更新
      drive有・table無 : tableにdriveの行オブジェクトを追加
      drive無・table有 : table.isDeletedにtrueをセット
      */

      // -------------------------------------------------------------
      dev.step(1); // 事前準備
      // -------------------------------------------------------------
      v.drive = JSON.parse(JSON.stringify(drive));
      v.table = JSON.parse(JSON.stringify(table));

      // -------------------------------------------------------------
      dev.step(2); // Google Drive上のファイル情報を順次反映
      // -------------------------------------------------------------
      for( v.i=0 ; v.i<v.drive.length ; v.i++ ){
        v.idx = v.table.findIndex(x => x.id === v.drive[v.i].id);
        if( v.idx < 0){
          dev.step(2.1);  // drive有・table無 : tableにdriveの行オブジェクトを追加
          v.query.push({
            command: 'append',
            table: pv.table,
            set: v.drive[v.i],
          });
        } else if( new Date(drive[v.i].created).getTime() !== new Date(table[v.indexOf].created).getTime()
          || new Date(drive[v.i].updated).getTime() !== new Date(table[v.indexOf].updated).getTime() ){
          dev.step(2.2); // drive有・table有 : 作成・更新日時が異なったらdriveの値で更新
          v.query.push({
            command: 'update',
            table: pv.table,
            where: {id: v.drive[v.i].id},
            set: {created:v.drive[v.i].created, updated:v.drive[v.i].updated},
          });
          dev.step(2.3);  // driveにも存在する要素はtableから削除
          v.table.splice(v.idx,1);
        }
      }

      dev.step(2.4); // fdrive無・table有 : table.isDeletedにtrueをセット
      v.table.forEach(x => {
        v.query.push({
          command: 'update',
          table: pv.table,
          where: {id: x.id},
          set: {isDeleted: true},
        })
      });
      dev.dump(v.query,175);

      // -------------------------------------------------------------
      dev.step(3);  // listシートを更新
      // -------------------------------------------------------------
      dev.step(3.1);  // 更新後のlistシートを取得
      v.query.push({command: 'select', table: pv.table, where:()=>true});
      dev.step(3.2);  // 更新実行
      v.r = SpreadDb(v.query, { userId: 'Administrator' });
      if (v.r instanceof Error) return v.r;
      v.rv = v.r[v.query.length-1].result;  // シート上に保存されているデータ
      dev.dump(v.r[v.query.length-1],194);
      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

}
/** 二つの引数が同値か判断する
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @param {Object|boolean} opt - オプション。v1,v2でデータ型が異なる場合の判定方法を指定
 * @param {string} opt.force=null - v1,v2に強制するデータ型(ex.v1='9-5-1965',v2='1965/9/5',opt.force='date'->true)
 *   'string','number','bigint','boolean','undefined','symbol','function','null','date','object','array'
 * @param {boolean} opt.string_number=true - trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
 * @param {boolean} opt.string_bigint=true - trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
 * @param {boolean} opt.string_boolean=true - trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
 * @param {boolean} opt.string_undefined=true - trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
 * @param {boolean} opt.string_function=true - trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
 * @param {boolean} opt.string_null=true - trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
 * @param {boolean} opt.string_date=true - trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
 * @param {boolean} opt.number_bigint=true - trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
 * @param {boolean} opt.number_date=true - trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
 * @param {boolean} opt.bigint_date=true - trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
 * @returns {boolean|Error}
 *
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 * - `opt.strict = false`はスプレッドシートに保存されていた内容との比較での利用を想定
 */
function isEqual(v1=undefined,v2=undefined,opt={}){
  const v = {whois:'isEqual',rv:true,step:0,
  };
  try {

    // -------------------------------------------
    // 1. 事前準備
    // -------------------------------------------
    v.step = 1.1; // v.types: typeofの戻り値の内、objectを除いたもの
    v.types = ['string','number','bigint','boolean','undefined','symbol','function'];
    v.typeAll = [...v.types,'null','date','object','array'];

    v.step = 1.2; // データ型判定関数の定義
    // typeofの戻り値の内 string,number,bigint,boolean,undefined,symbol,function はそのまま
    // objectは null,date,array,objectに分けて文字列として返す
    // 引数:データ型判定対象変数、戻り値:v.typeallに列挙された文字列
    v.which = x => {
      if( x === null ) return 'null';
      if( v.types.indexOf(typeof x) >= 0 ) return typeof x;
      if( Array.isArray(x) ) return 'array';
      return isNaN(new Date(x)) ? 'object' : 'date';
    };

    v.step = 1.3; // オプションに既定値を設定
    v.opt = Object.assign({
      force: null,
      string_number: true, // trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
      string_bigint: true, // trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
      string_boolean: true, // trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
      string_undefined: true, // trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
      string_function: true, // trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
      string_null: true, // trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
      string_date: true, // trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
      number_bigint: true, // trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
      number_date: true, // trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
      bigint_date: true, // trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
    },opt);

    v.step = 1.4; // オプションの適用マップ(v.map)を作成
    // v1,v2でデータ型が異なる場合の判定方法として、次項(step.1.5)で定義する判定式を
    // 適用する場合はtrueを、適用しない場合(=厳密比較する場合)はfalseを設定する。
    // なおデータ型がv1,v2で不一致の場合はオプションの真偽値をセットするが、
    // 一致する場合は必ず判定式が適用されるようtrueをセットしておく。
    v.map = {};
    v.typeAll.forEach(x => {
      v.map[x] = {};
      // `x === y` ⇒ データ型が一致する場合はtrue、不一致はfalseをセット
      v.typeAll.forEach(y => v.map[x][y] = x === y);
    });
    // オプションの指定値をセット
    for( v.prop in v.opt ){
      v.m = v.prop.match(/^([a-z]+)_([a-z]+)$/);
      if( v.m ) v.map[v.m[1]][v.m[2]] = v.map[v.m[2]][v.m[1]] = v.opt[v.prop];
    }

    v.step = 1.5; // 比較対象のデータ型に基づいた判定式の定義
    v.f01 = (x,y) => x === y;  // ①厳密比較
    v.f02 = (x,y) => x == y;   // ②緩い比較
    v.f03 = (x,y) => {try{return BigInt(x) === BigInt(y)}catch{return false}};  // ③BigInt
      // BigInt(Infinity) -> The number Infinity cannot be converted to a BigInt because it is not an integer
      // これを回避するためtry〜catchとする
    v.f04 = (x,y) => String(x).toLowerCase() === String(y).toLowerCase(); //Boolean(x) === Boolean(y),  // ④Boolean
    v.f05 = (x,y) => String(x) === String(y);  // ⑤String
    v.f06 = (x,y) => x.toString() === y.toString();  // ⑥toString()
    v.f07 = (x,y) => {try{return new Date(x).getTime() === new Date(y).getTime()}catch{return false}};  // ⑦getTime()
      // new Date(Infinity) -> Invalid Date
      // これを回避するためtry〜catchとする
    v.f08 = (x,y) => new Date(Number(x)).getTime() === new Date(Number(y)).getTime();  // ⑧getTime(num)

    v.step = 1.6; // デシジョンテーブルの定義
    // 比較対象のデータ型毎に、どの比較方法を採用するかを定義する
    // ex. v.dt['string','number'] ⇒ v.f02(②緩い比較)で同一かを判定
    v.dt = {
      "string":{"string":v.f01,"number":v.f02,"bigint":v.f03,"boolean":v.f04,"undefined":v.f05,"function":v.f06,"null":v.f04,"date":v.f07},
      "number":{"string":v.f02,"number":v.f01,"bigint":v.f03,"date":v.f07},
      "bigint":{"string":v.f03,"number":v.f03,"bigint":v.f01,"date":v.f07},
      "boolean":{"string":v.f04,"boolean":v.f01},
      "undefined":{"string":v.f05,"undefined":v.f01},
      "symbol":{"symbol":v.f06},
      "function":{"string":v.f06,"function":v.f06},
      "null": {"string":v.f04,"null":v.f01},
      "date": {"string":v.f07,"number":v.f07,"bigint":v.f08,"date":v.f07},
      "object": {"object":(x,y)=>{
        // 直下のメンバが不一致ならfalseを返す(孫要素以降は不問)
        if(JSON.stringify(Object.keys(x).sort()) !== JSON.stringify(Object.keys(y).sort())) return false;
        // 個々のメンバを再帰呼出
        for( let m in x ) if( isEqual(x[m],y[m],v.opt) === false ) return false;
        return true;
      }},
      "array": {"array":(x,y)=>{
        // 要素の個数が不一致ならfalseを返す(孫要素以降は不問)
        if( x.length !== y.length ) return false;
        // 個々のメンバを再帰呼出
        for( let i=0 ; i<x.length ; i++ ) if( isEqual(x[i],y[i],v.opt) === false ) return false;
        return true;
      }},
    };

    // -------------------------------------------
    v.step = 2; // 判定式を選択、結果を返す
    // -------------------------------------------
    // データ型の組み合わせパターンで判定式が定義されていればそれに基づき判定。
    // 未定義なら「false固定」としてfalseを返す。
    v.t1 = v.opt.force || v.which(v1); v.t2 = v.opt.force || v.which(v2);
    v.f = v.map[v.t1][v.t2] ? v.dt[v.t1][v.t2] : v.f01;
    //console.log(`t1:${v.t1}, t2:${v.t2}, f: ${v.f}`);
    return v.f(v1,v2);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1(${typeof v1})=${typeof v1 === 'object' ? JSON.stringify(v1) : v1}`
    + `\nv2(${typeof v2})=${typeof v2 === 'object' ? JSON.stringify(v2) : v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** showSidebar: 処理結果をサイドバーのtextareaに表示
 * @param {Object} arg
 * @param {string} arg.result - 表示する処理結果
 * @param {string} [arg.content] - サイドバーのhtml
 */
function showSidebar(arg={}){ //
  if( !arg.content ){
    arg.content = [`<!DOCTYPE html><html><head><base target="_top"><script>`
    , `function copyToClipboard() {`
    , `  const result = document.getElementById('result').value; //innerText;`
    , `  navigator.clipboard.writeText(result).then(() => {`
    , `    alert('クリップボードにコピーしました: ' + result);`
    , `  }).catch(err => {`
    , `    console.error('コピーに失敗しました: ', err);`
    , `  });`
    , `}`
    , `</script></head><body>`
    , `  <h1>処理結果</h1>`
    , `  <button onclick="copyToClipboard()">コピー</button><br><hr>`
    , `  <textarea id="result">::result::</textarea>`
    , `</body>`
    , `</html>`].join('\n');
  }
  arg.content = arg.content.replace('::result::',arg.result);
  console.log(`l.67 arg=${JSON.stringify(arg)}`)
  const html = HtmlService.createHtmlOutput(arg.content).setTitle('処理結果');
  SpreadsheetApp.getUi().showSidebar(html);
}
/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 */
function SpreadDb(query = [], opt = {}) {
  /** main: SpreadDb主処理 */
  const pv = { whois: 'SpreadDb', rv: [], log: [] };  // 擬似メンバ変数としてSpreadDb内で共有する値
  const v = { whois: `${pv.whois}.main`, step: 0 };
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1.1);
    if (!Array.isArray(query)) query = [query];  // 配列可の引数は配列に統一

    dev.step(1.2); // メンバに引数・初期値をセット
    v.r = constructor(query, opt);
    if (v.r instanceof Error) throw v.r;

    dev.step(2); // スプレッドシートのロックを取得
    v.lock = LockService.getDocumentLock();

    for (v.tryNo = pv.opt.maxTrial; v.tryNo > 0; v.tryNo--) {

      dev.step(3); // スプレッドシートのロック
      if (v.lock.tryLock(pv.opt.interval)) {

        dev.step(4); // クエリを順次処理
        for (v.i = 0; v.i < pv.query.length; v.i++) {
          dev.step(5); // クエリのメンバに既定値設定
          v.r = objectizeColumn('sdbQuery');
          if (v.r instanceof Error) throw v.r;
          pv.query[v.i] = Object.assign(v.r, pv.query[v.i], { userId: pv.opt.userId });

          dev.step(6); // クエリの実行
          v.r = doQuery(pv.query[v.i]);
          if (v.r instanceof Error) throw v.r;
        }

        dev.step(7); // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.r = objectizeColumn('sdbQuery');
        if (v.r instanceof Error) throw v.r;
        v.r = appendRow(Object.assign(v.r, {
          table: pv.opt.log,
          set: pv.log,
          result: [],
        }));
        if (v.r instanceof Error) throw v.r;

        dev.step(8); // ロック解除
        v.lock.releaseLock();
        v.tryNo = -1; // maxTrial回ロック失敗時(=0)と判別するため、負数をセット
      }
    }

    dev.step(9); // ロックができたか判定、不能時はエラー
    if (v.tryNo === 0) throw new Error("Could not Lock");

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) {
    dev.error(e);
    return e;
  }
  /** appendRow: 領域に新規行を追加
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.set=[] - 追加する行オブジェクト
   * @returns {null|Error}
   *
   * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
   */
  function appendRow(query) {
    const v = { whois: `${pv.whois}.appendRow`, step: 0, rv: null, target: [] };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      // 1. 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.setの存否判定
      if (!Object.hasOwn(query, 'set')) query.qSts = `No set`;  // query.setが不存在

      dev.step(1.3);
      // ①一行分のシートイメージ ⇒ any[] ⇒ 二次元配列化
      // ②一行分の行オブジェクト ⇒ Object ⇒ 配列化
      // ③複数行分のシートイメージ ⇒ any[][] ⇒ 行オブジェクトに変換
      // ④複数行分の行オブジェクト ⇒ Object[] ⇒ そのまま使用
      // ⑤上記以外 ⇒ エラー
      if (Array.isArray(query.set)) {
        dev.step(1.31); // 配列の長さ0
        if (query.set.length === 0) query.qSts = `Empty set`;
        if (whichType(query.set[0], 'Object')) {
          dev.step(1.32); // ④ ⇒ そのまま使用
        } else {
          if (Array.isArray(query.set[0])) {
            dev.step(1.33); // ③ ⇒ 行オブジェクトに変換
            v.r = convertRow(query.set);
            if (v.r instanceof Error) throw v.r;
            query.set = v.r.obj;
          } else {
            dev.step(1.34);  // ① ⇒ 二次元配列化
            query.set = [query.set];
          }
        }
      } else {
        if (whichType(query.set, 'Object')) {
          dev.step(1.35); // ② ⇒ 配列化
          query.set = [query.set];
        } else {
          dev.step(1.36); // ⑤ ⇒ エラー
          query.qSts = `Invalid set`;
        }
      }

      dev.step(2);
      if (query.qSts === 'OK') {
        // ------------------------------------------------
        // 2. 追加レコードをシートイメージに展開
        // ------------------------------------------------
        for (v.i = 0; v.i < query.set.length; v.i++) {

          dev.step(2.1); // 1レコード分のログを準備
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;

          dev.step(2.2); // auto_increment項目に値を設定
          // ※ auto_increment設定はuniqueチェックに先行
          for (v.ai in v.table.schema.auto_increment) {
            if (!query.set[v.i][v.ai]) { // 値が未設定だった場合は採番実行
              v.table.schema.auto_increment[v.ai].current += v.table.schema.auto_increment[v.ai].step;
              query.set[v.i][v.ai] = v.table.schema.auto_increment[v.ai].current;
            }
          }

          dev.step(2.3); // 既定値の設定
          for (v.dv in v.table.schema.defaultRow) {
            if (!query.set[v.i][v.dv]) {
              query.set[v.i][v.dv] = v.table.schema.defaultRow[v.dv](query.set[v.i]);
            }
          }

          dev.step(2.4); // 追加レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (v.table.schema.unique[v.unique].indexOf(query.set[v.i][v.unique]) >= 0) {
              // 登録済の場合はエラーとして処理
              v.log.rSts = 'Duplicate';
              v.log.diff[v.unique] = query.set[v.i][v.unique]; // diffに{unique項目名:重複値}を保存
            } else {
              // 未登録の場合v.table.sdbSchema.uniqueに値を追加
              v.table.schema.unique[v.unique].push(query.set[v.i][v.unique]);
            }
          }

          dev.step(2.5); // 主キーの値をpKeyにセット
          // 主キーがauto_incrementまたはdefaultで設定される可能性があるため、pKeyセットはこれらの後工程
          v.log.pKey = query.set[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 正当性チェックOKの場合の処理
          if (v.log.rSts === 'OK') {

            dev.step(2.61); // シートイメージに展開して登録
            v.row = [];
            for (v.j = 0; v.j < v.table.header.length; v.j++) {
              v.a = query.set[v.i][v.table.header[v.j]];
              v.row[v.j] = v.a;
            }
            v.target.push(v.row);

            dev.step(2.62); // v.table.valuesへの追加
            v.table.values.push(query.set[v.i]);

            dev.step(2.63); // ログに追加レコード情報を記載
            v.log.diff = JSON.stringify(query.set[v.i]);
          }

          dev.step(2.7); // 成否に関わらず戻り値に保存
          query.result.push(v.log);
        }

        dev.step(2.8); // 追加成功行数をnumにセット
        query.num = query.result.filter(x => x.rSts === 'OK').length || 0;

        // ------------------------------------------------
        dev.step(3); // 対象シートへの展開
        // ------------------------------------------------
        dev.step(3.1); // 対象シートにsetValues
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.table.rownum + 2,
            1,
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
        dev.step(3.2); // v.table.rownumの書き換え
        v.table.rownum += v.target.length;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** constructor: 擬似メンバの値設定、変更履歴テーブルの準備 */
  function constructor(query, opt) {
    const v = { whois: `${pv.whois}.constructor`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 擬似メンバに値を設定
      Object.assign(pv, {
        query: query,
        opt: Object.assign({
          userId: 'guest', // {string} ユーザの識別子
          userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
          log: 'log', // {string}='log' 更新履歴テーブル名
          maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
          interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
          guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
          adminId: 'Administrator', // {string} 管理者として扱うuserId
          additionalPrimaryKey: // {string} createTableで主キー無指定時に追加設定される主キー項目名
            { name: 'rowId', type: 'UUID', note: '主キー', primaryKey: true, default: () => Utilities.getUuid() },
          sdbQuery: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)', default: () => toLocale(new Date()) },
            { name: 'userId', type: 'string|number', note: 'ユーザ識別子(uuid等)', default: () => pv.opt.userId },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列。未設定の場合は主処理でUUIDを設定', default: () => Utilities.getUuid() },
            { name: 'table', type: 'string', note: '操作対象テーブル名', default: () => '' },
            { name: 'command', type: 'string', note: '操作名', default: () => '' },
            { name: 'cols', type: 'sdbColumn[]', note: '新規作成シートの項目定義オブジェクトの配列', default: () => [] },
            { name: 'where', type: 'Object|Function|string', note: '対象レコードの判定条件', default: () => null },
            { name: 'set', type: 'Object|string|Function', note: '追加・更新する値', default: () => [] },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果', default: () => 'OK' },
            { name: 'num', type: 'number', note: '変更された行数', default: () => 0 },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果', default: () => [] },
          ],
          sdbTable: [
            { name: 'name', type: 'string', note: 'テーブル名(範囲名)' },
            { name: 'account', type: 'string', note: '更新者のuserId(識別子)', default: () => pv.opt.userId },
            { name: 'sheet', type: 'Sheet', note: 'スプレッドシート内の操作対象シート(ex."master"シート)' },
            { name: 'schema', type: 'sdbSchema', note: 'シートの項目定義', default: () => objectizeColumn('sdbSchema') },
            { name: 'values', type: 'Object[]', note: '行オブジェクトの配列。{項目名:値,..} 形式', default: () => [] },
            { name: 'header', type: 'string[]', note: '項目名一覧(ヘッダ行)', default: () => [] },
            { name: 'notes', type: 'string[]', note: 'ヘッダ行のメモ', default: () => [] },
            { name: 'colnum', type: 'number', note: 'データ領域の列数', default: () => 0 },
            { name: 'rownum', type: 'number', note: 'データ領域の行数(ヘッダ行は含まず)', default: () => 0 },
          ],
          sdbSchema: [
            { name: 'cols', type: 'sdbColumn[]', note: '項目定義オブジェクトの配列', default: () => [] },
            { name: 'primaryKey', type: 'string', note: '一意キー項目名' },
            { name: 'unique', type: 'Object.<string, any[]>', note: 'primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名', default: () => new Object() },
            { name: 'auto_increment', type: 'Object.<string,Object>', note: 'auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名', default: () => new Object() },
            { name: 'defaultRow', type: 'Object|function', note: '既定値項目で構成されたオブジェクト。appendの際のプロトタイプ', default: () => new Object() },
          ],
          sdbColumn: [ // sdbColumnの属性毎にname,type,noteを定義
            { name: 'name', type: 'string', note: '項目名' },
            { name: 'type', type: 'string', note: 'データ型。string,number,boolean,Date,JSON,UUID' },
            { name: 'format', type: 'string', note: '表示形式。type=Dateの場合のみ指定' },
            { name: 'options', type: 'number|string|boolean|Date', note: '取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]' },
            { name: 'default', type: 'number|string|boolean|Date', note: '既定値' },
            { name: 'primaryKey', type: 'boolean', note: '一意キー項目ならtrue' },
            { name: 'unique', type: 'boolean', note: 'primaryKey以外で一意な値を持つならtrue' },
            {
              name: 'auto_increment', type: 'null|bloolean|number|number[]', note: '自動採番項目'
                + '\n// null ⇒ 自動採番しない'
                + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
                + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
                + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
            },
            { name: 'suffix', type: 'string', note: '"not null"等、上記以外のSQLのcreate table文のフィールド制約' },
            { name: 'note', type: 'string', note: '本項目に関する備考。create table等では使用しない' },
          ],
          sdbLog: [
            { name: 'logId', type: 'UUID', primaryKey: true, default: () => Utilities.getUuid() },
            { name: 'timestamp', type: 'string', note: '更新日時' },
            { name: 'userId', type: 'string', note: 'ユーザ識別子' },
            { name: 'queryId', type: 'string', note: 'クエリ・結果突合用識別子' },
            { name: 'table', type: 'string', note: '対象テーブル名' },
            { name: 'command', type: 'string', note: '操作内容(コマンド名)' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'pKey', type: 'string', note: '変更したレコードのprimaryKey' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果' },
            { name: 'diff', type: 'JSON', note: '差分情報。{項目名：[更新前,更新後]}形式' },
          ],
          sdbResult: [
            { name: 'pKey', type: 'string', note: '処理対象レコードの識別子' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果', default: () => 'OK' },
            { name: 'diff', type: 'Object', note: '当該レコードの変更点', default: () => new Object() },
          ],
          sdbMain: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)' },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列' },
            { name: 'table', type: 'string|string[]', note: '操作対象テーブル名' },
            { name: 'command', type: 'string', note: '操作名' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果' },
          ],
        }, opt),
        spread: SpreadsheetApp.getActiveSpreadsheet(), // スプレッドシートオブジェクト
        table: {}, // スプレッドシート上の各テーブル(領域)の情報
      });

      // 変更履歴テーブルのsdbTable準備
      dev.step(2); // 変更履歴用のクエリを作成
      v.r = objectizeColumn('sdbQuery');
      if (v.r instanceof Error) throw v.r;
      v.query = Object.assign(v.r, {
        userId: pv.opt.adminId,
        table: pv.opt.log,
        command: 'create',
        cols: pv.opt.sdbLog,
      });

      dev.step(3); // 変更履歴のテーブル管理情報を作成
      v.r = genTable(v.query);
      if (v.r instanceof Error) throw v.r;

      dev.step(4); // 変更履歴のシートが不在なら作成
      if (pv.table[pv.opt.log].sheet === null) {
        v.r = createTable(v.query);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** convertRow: シートイメージと行オブジェクトの相互変換
   * @param {any[][]|Object[]} data - 行データ。シートイメージか行オブジェクトの配列
   * @param {string[]} [header]=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用
   * @returns {Object}
   *
   * - 戻り値のオブジェクト
   *   - raw {any[][]} シートイメージ
   *   - obj {Object[]} 行オブジェクトの配列
   *   - header {string} ヘッダ行
   */
  function convertRow(data = [], header = []) {
    const v = { whois: pv.whois + '.convertRow', step: 0, rv: { raw: [], obj: data, header: header } };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1, `data=${JSON.stringify(data.slice(0, 2))}\nheader=${JSON.stringify(header)}`);

      if (data.length > 0) {

        dev.step(1); // ヘッダ未定義の場合、dataがシートイメージなら先頭行、行オブジェクトならメンバ名から作成
        // シートイメージの先頭行を使用する場合、createで主キー項目を追加(unshift)する場合に元データの先頭行も変化してしまうのでシャローコピーする
        if (v.rv.header.length === 0) {
          v.rv.header = Array.isArray(data[0]) ? [...data[0]] : [...new Set(data.flatMap(d => Object.keys(d)))];
        }

        if (Array.isArray(data[0])) { // dataがシートイメージの場合
          dev.step(2); // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
          v.rv.obj = [];
          for (v.i = 1; v.i < data.length; v.i++) {
            v.o = {};
            for (v.j = 0; v.j < data[v.i].length; v.j++) {
              if (data[v.i][v.j] || data[v.i][v.j] === 0 || data[v.i][v.j] === false) {
                v.o[data[0][v.j]] = data[v.i][v.j];
              }
            }
            v.rv.obj.push(v.o);
          }
        }

        dev.step(3); // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
        for (v.i = 0; v.i < v.rv.obj.length; v.i++) {
          v.arr = [];
          for (v.j = 0; v.j < v.rv.header.length; v.j++) {
            v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]]);
          }
          v.rv.raw.push(v.arr);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** createTable: 新規にシートを作成
   * @param {sdbQuery} query
   * @returns {null|Error}
   */
  function createTable(query) {
    const v = { whois: `${pv.whois}.createTable`, step: 0, rv: [], convertRow: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // 既定値設定
      if (!query.set) query.set = [];
      dev.step(1.2);  // テーブル管理情報をv.tableに保存
      v.table = pv.table[query.table];
      dev.step(1.3);  // 引数を保存
      query.arg = toString({ cols: query.cols });
      dev.step(1.4);  // シートが既に存在
      if (v.table.sheet !== null) query.qSts = 'Already Exist';

      if (query.qSts === 'OK') {
        dev.step(2); // 主キーが存在しない場合は追加
        if (!v.table.schema.cols.find(x => x.primaryKey === true)) {
          v.unique = v.table.schema.cols.find(x => x.unique === true);
          if (v.unique) {
            // ユニーク項目が存在している場合、主キーに昇格
            v.unique.primaryKey = true;
            v.table.schema.primaryKey = v.unique.name;
          } else {
            // ユニーク項目が不存在の場合は追加
            // schema.colsにopt.additionalPrimaryKeyを追加
            v.table.schema.cols.unshift(pv.opt.additionalPrimaryKey);
            // schema.primaryKeyに主キー項目名を設定
            v.table.schema.primaryKey = pv.opt.additionalPrimaryKey.name;
            // schema.uniqueに主キー項目名の空配列を設定
            v.table.schema.unique[pv.opt.additionalPrimaryKey.name] = [];
            // schema.defaultRowに主キー項目を追加
            v.table.schema.defaultRow[pv.opt.additionalPrimaryKey.name] = pv.opt.additionalPrimaryKey.default;
            // table.header先頭に主キー項目名を追加
            v.table.header.unshift(pv.opt.additionalPrimaryKey.name);
            // table.notes先頭に設定内容を追加
            v.r = genColumn(pv.opt.additionalPrimaryKey);
            if (v.r instanceof Error) throw v.r;
            v.table.notes.unshift(v.r.note);
            // table.colnumを+1
            v.table.colnum++;
          }
        }

        // ----------------------------------------------
        dev.step(3); // シートが存在しない場合、新規追加
        // ----------------------------------------------
        dev.step(3.1); // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(query.table);

        dev.step(3.2); // ヘッダ行・メモのセット
        v.headerRange = v.table.sheet.getRange(1, 1, 1, v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1, v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定

        dev.step(3.3); // 初期データの追加
        if (query.set.length > 0) {
          v.rv = appendRow(query);  // 初期データを追加した場合、戻り値はappendRowの戻り値とする
          if (v.rv instanceof Error) throw v.rv;

          dev.step(3.4);  // 初期レコードに重複が有った場合、qStsも"Duplicate"セット
          if (query.result.map(x => x.rSts).includes('Duplicate')) query.qSts = 'Duplicate';
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.where - 削除対象の指定
   * @returns {null|Error}
   */
  function deleteRow(query) {
    const v = { whois: `${pv.whois}.deleteRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在

      dev.step(1.3); // 該当レコードかの判別用関数を作成
      query.arg = toString(query.where); // 更新履歴記録用にwhereを文字列化
      query.where = functionalyze({ table: query.table, data: query.where });
      if (query.where instanceof Error) throw query.where;

      if (query.qSts === 'OK') {
        dev.step(2); // 対象レコードか、後ろから一件ずつチェック
        // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
        // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
        for (v.i = v.table.values.length - 1; v.i >= 0; v.i--) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (query.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // 1レコード分のログオブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          query.result.push(v.log);

          dev.step(2.3); // 削除レコードのunique項目をv.table.schema.uniqueから削除
          // v.table.schema.auto_incrementは削除の必要性が薄いので無視
          // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
          for (v.unique in v.table.schema.unique) { // unique項目を順次チェック
            if (v.table.values[v.i][v.unique]) {  // 対象レコードの当該unique項目が有意な値
              // unique項目一覧(配列)から対象レコードの値の位置を探して削除
              v.idx = v.table.schema.unique[v.unique].indexOf(v.table.values[v.i][v.unique]);
              if (v.idx >= 0) v.table.schema.unique[v.unique].splice(v.idx, 1);
            }
          }

          dev.step(2.4); // diffに削除レコード情報を記載
          v.log.diff = JSON.stringify(v.table.values[v.i]);

          dev.step(2.5); // 主キーの値をpKeyにセット
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 削除成功件数をインクリメント
          query.num++;

          dev.step(2.7); // v.table.valuesから削除
          v.table.values.splice(v.i, 1);

          dev.step(2.8); // シートのセルを削除
          v.range = v.table.sheet.deleteRow(v.i + 2); // 添字->行番号で+1、ヘッダ行分で+1

          dev.step(2.9); // v.table.rownumを書き換え
          v.table.rownum -= 1;

        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** doQuery: 単体クエリの実行、変更履歴の作成 */
  function doQuery(query) {
    const v = { whois: `${pv.whois}.doQuery`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------
      // 1. 事前準備
      // -------------------------------------------------
      if (!query.table || typeof query.table !== 'string') {
        dev.step(1.1);  // 必須パラメータの存否・形式確認：query.table
        query.qSts = 'No Table name';
      } else if (!query.command || ['create', 'select', 'update', 'append', 'delete', 'schema'].includes(query.command) !== true) {
        dev.step(1.2);  // 必須パラメータの存否・形式確認：query.command
        query.qSts = 'No command';
      } else {
        dev.step(1.3); // 操作対象のテーブル管理情報を準備
        if (!Object.hasOwn(pv.table, query.table)) {
          dev.step(1.4); // 未作成なら作成
          v.r = genTable(query);
          if (v.r instanceof Error) throw v.r;
        } else if (query.command !== 'create' && pv.table[query.table].sheet === null) {
          dev.step(1.5); // テーブル管理情報が存在しているがシートは不在の場合、create以外はエラー
          query.qSts = 'No Table';
        }
      }

      // -------------------------------------------------
      // 2. 実行権限の確認とcommand系メソッドの実行
      // -------------------------------------------------
      if (query.qSts === 'OK') { // エラーの場合は後続処理をスキップ

        // -------------------------------------------------
        dev.step(2.1); // ユーザの操作対象シートに対する権限を取得
        // -------------------------------------------------
        v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : (pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query.table] || '')  // ゲスト(userId指定無し)
            : (pv.opt.userAuth[query.table] || ''));  // 通常ユーザ

        // -------------------------------------------------
        dev.step(2.2); // 呼出先メソッド設定
        // -------------------------------------------------
        if (v.allow.includes('o')) {

          // o(=own set only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
          // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
          // 自分のread/write(select,update)およびschemaのみ実行可。append/deleteは実行不可
          // ∵新規登録(append)はシステム管理者の判断が必要。また誤ってdeleteした場合はappendが必要なのでこれも不可
          // 'o'の場合、where句はuserId固定とする(Object,function,JSON他は不可)

          switch (query.command) {
            case 'scheme':
              dev.step(2.211);  // command=schema
              v.isOK = true;
              v.func = getSchema;
              break;
            case 'select':
            case 'update':
              dev.step(2.212);  // command=select/update
              if (!isEqual(pv.opt.userId, query.where)) {
                dev.step(2.213);  // where句はuserId固定、かつ要一致
                // 非プリミティブ型なら指定方法がNG、プリミティブ型なら無権限と判断
                query.qSts = (typeof query.where === 'object' || typeof query.where === 'function')
                  ? 'Invalid where clause' : 'No Authority';
                v.isOK = false;
              } else {
                dev.step(2.214);  // select/updateでプリミティブ型の値が一致しているならOKと判断
                query.where = pv.opt.userId;
                v.isOK = true;
              }
              v.func = query.command === 'select' ? selectRow : updateRow;
              break;
            default:
              dev.step(2.215);
              v.isOK = false;
          }

        } else {

          dev.step(2.22);  // 'o'以外の場合の呼出先メソッドを設定
          switch (query.command) {
            case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
            case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
            case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
            case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
            case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
            case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
            default: v.isOK = false;
          }
        }

        dev.step(2.3); // 無権限ならqStsにエラーコードをセット
        if (v.isOK === false && query.qSts === 'OK') query.qSts = 'No Authority';

        // -------------------------------------------------
        dev.step(2.4); // メソッドの実行
        // -------------------------------------------------
        // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
        if (query.qSts === 'OK') {

          dev.step(2.41);  // メソッド実行
          v.r = v.func(query);
          if (v.r instanceof Error) {
            dev.step(2.42); // command系メソッドからエラーオブジェクトが帰ってきた場合はqSts=message
            query.qSts = v.r.message;
            throw v.r;
          }
        }
      }

      // -------------------------------------------------
      // 3. 戻り値と変更履歴シート追記イメージの作成
      // -------------------------------------------------
      dev.step(3.1); // 戻り値オブジェクトを作成
      v.r = objectizeColumn('sdbMain');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbMain.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.r[v.map[v.j]] = query[v.map[v.j]];
      }
      pv.rv.push(v.r);

      // クエリ単位の実行結果を変更履歴シートへ追記
      dev.step(3.21); // クエリ単位の実行結果オブジェクトを作成
      v.r = objectizeColumn('sdbLog');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbLog.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.val = query[v.map[v.j]];
        if (v.val || v.val === 0 || v.val === false) {
          v.r[v.map[v.j]] = toString(v.val);
        }
      }
      dev.step(3.211); // ユーザIDをセット
      v.r.userId = pv.opt.userId;
      dev.step(3.213); // 配列に追加
      pv.log.push(v.r);

      dev.step(3.22); // レコード単位の実行結果を変更履歴シートへ追記
      if (['create', 'append', 'update', 'delete'].includes(query.command)) {
        for (v.j = 0; v.j < query.result.length; v.j++) {

          dev.step(9.1); // レコード単位の実行結果オブジェクトを作成
          v.r = objectizeColumn('sdbLog');
          if (v.r instanceof Error) throw v.r;

          dev.step(9.2); // 配列に追加
          pv.log.push(Object.assign(v.r, {
            queryId: query.queryId,
            pKey: query.result[v.j].pKey,
            rSts: query.result[v.j].rSts,
            diff: toString(query.result[v.j].diff),
          }));
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
   * @param {Object} arg
   * @param {sdbTable} [arg.table] - 呼出元で処理対象としているテーブル
   * @param {Object|function|string} arg.data - 関数化するオブジェクトor文字列
   * @returns {function}
   *
   * - update/delete他、引数でdataを渡されるメソッドで使用
   * - 引数のデータ型により以下のように処理分岐
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - string
   *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
   *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   */
  function functionalyze(arg = null) {
    const v = { whois: `${pv.whois}.functionalyze`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 引数の型チェック＋変換
      if (typeof arg === 'function') {
        dev.step(1.1); // 引数が関数ならそのまま使用
        dev.end();
        return arg;
      } else if (typeof arg === 'string') {
        arg = { data: arg, table: null };
      } else if (!whichType(arg, 'Object') || !Object.hasOwn(arg, 'data')) {
        throw new Error(`Invalid Argument`);
      }

      switch (typeof arg.data) {
        case 'function': dev.step(2);  // 関数指定ならそのまま利用
          v.rv = arg.data;
          break;
        case 'object': dev.step(3);
          v.keys = Object.keys(arg.data);
          if (v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value')) {
            dev.step(3.1); // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o', `return isEqual(o['${arg.data.key}'],'${arg.data.value}')`);
          } else {
            dev.step(3.2); // {キー項目名:値}形式での指定の場合
            v.c = [];
            for (v.j = 0; v.j < v.keys.length; v.j++) {
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg.data[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o', `return (${v.c.join(' && ')})`);
          }
          break;
        case 'string': dev.step(4);
          v.fx = arg.data.match(/^function\s*\w*\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if (v.fx || v.ax) {
            dev.step(4.1); // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g, ''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g, ' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
            break;
          }
        // 関数では無い文字列の場合はdefaultで処理するため、breakの記述は省略
        default:
          dev.step(5); // 関数ではない文字列、またはfunction/object/string以外の型はprimaryKeyの値指定と看做す
          if (arg.table !== null && pv.table[arg.table].schema.primaryKey) {
            if (typeof arg.data === 'string') arg.data = `"${arg.data}"`;
            v.rv = new Function('o', `return isEqual(o['${pv.table[arg.table].schema.primaryKey}'],${arg.data})`);
          } else {
            throw new Error(`Invalid Argument`);
          }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {Object|Error}
   *
   * - auto_incrementの記載ルール
   *   - null ⇒ 自動採番しない
   *   - boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
   *   - number ⇒ 自動採番する(基数=指定値,増減値=1)
   *   - number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
   *
   * - 戻り値のオブジェクト
   *   - column {sdbColumn}
   *   - note {string[]} メモ用の文字列
   */
  function genColumn(arg = {}) {
    const v = { whois: `${pv.whois}.genColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      // ------------------------------------------------
      dev.step(1); // 項目定義情報(rv.column)の準備
      // ------------------------------------------------
      if (typeof arg === 'object') {
        dev.step(1.1); // 引数がオブジェクト(=sdbColumn)ならそのまま採用
        v.rv.column = arg;
        v.rv.note = {};
      } else {  // 文字列で与えられたらオブジェクトに変換

        dev.step(1.2); // コメントの削除
        arg = arg.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');

        dev.step(1.3);
        // JSON文字列ならparse、それ以外はname属性と判断
        v.r = (arg => { try { return JSON.parse(arg) } catch { return null } })(arg);
        if (v.r === null) {
          // JSON文字列ではない場合、項目名と看做す
          v.rv.column = v.rv.note = { name: arg.trim() };
        } else {
          // JSON文字列ならオブジェクト化
          v.rv.column = v.r;
          v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
        }
      }

      // ------------------------------------------------
      dev.step(2); // シートのメモに記載する文字列を作成
      // ------------------------------------------------
      if (typeof v.rv.note === 'object') {
        // 元々シート上にメモが存在していた場合、step.1.4でオリジナルが保存されているので'string'
        v.rv.note = JSON.stringify(v.rv.column, (k, v) => typeof v === 'function' ? v.toString() : v, 2);
      }

      // ------------------------------------------------
      // default,auto_increment項目の準備
      // ------------------------------------------------
      dev.step(3); // defaultを関数に変換
      if (v.rv.column.default) {
        dev.step(3.1);
        v.r = functionalyze(v.rv.column.default);
        if (v.r instanceof Error) throw v.r;
        v.rv.column.default = v.r;
      }
      if (v.rv.column.default instanceof Error) throw v.rv.column.default;

      dev.step(4); // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => { return { obj: { start: x[0], step: (x[1] || 1) }, str: JSON.stringify(x) } },  // [start,step]形式
        Number: x => { return { obj: { start: x, step: 1 }, str: x } },  // startのみ数値で指定
        Object: x => { return { obj: x, str: JSON.stringify(x) } }, // {start:m,step:n}形式
        Null: x => { return { obj: false, str: 'false' } }, // auto_incrementしない
        Boolean: x => { return x ? { obj: { start: 1, step: 1 }, str: 'true' } : { obj: false, str: 'false' } }, // trueは[1,1],falseはauto_incrementしない
      };
      if (v.rv.column.auto_increment) {
        dev.step(3.1);
        if (typeof v.rv.column.auto_increment === 'string') {
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        }
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        // 開始値はstart+stepになるので、予め-stepしておく
        v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
        v.rv.note.auto_increment = v.acObj.str;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param table {sdbTable} - 対象テーブルのsdbTableオブジェクト
   * @returns {void}
   */
  function genSchema(table) {
    const v = { whois: `${pv.whois}.genSchema`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -----------------------------------------------
      dev.step(2); // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if (table.schema.cols.length === 0) {
        if (table.notes.length > 0) {
          dev.step(2.1); // シートにメモが存在していた場合、その内容から作成
          for (v.i = 0; v.i < table.notes.length; v.i++) {
            v.r = genColumn(table.notes[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
          }
        } else {
          dev.step(2.2); // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for (v.i = 0; v.i < table.header.length; v.i++) {
            v.r = genColumn(table.header[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
            table.notes.push(v.r.note);
          }
        }
      } else if (table.notes.length === 0) {
        dev.step(2.3); // 項目定義オブジェクトが渡された場合、notesのみを作成
        for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
          v.r = genColumn(table.schema.cols[v.i]);
          if (v.r instanceof Error) throw v.r;
          table.notes.push(v.r.note);
        }
      }

      // -----------------------------------------------
      dev.step(3); // table.schema.cols以外のメンバ作成
      // -----------------------------------------------
      for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
        dev.step(3.1); // primaryKey
        if (Object.hasOwn(table.schema.cols[v.i], 'primaryKey') && table.schema.cols[v.i].primaryKey === true) {
          table.schema.primaryKey = table.schema.cols[v.i].name;
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.2); // unique
        if (Object.hasOwn(table.schema.cols[v.i], 'unique') && table.schema.cols[v.i].unique === true) {
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.3); // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if (table.schema.cols[v.i].auto_increment && table.schema.cols[v.i].auto_increment !== false) {
          table.schema.auto_increment[table.schema.cols[v.i].name] = table.schema.cols[v.i].auto_increment;
          table.schema.auto_increment[table.schema.cols[v.i].name].current = table.schema.auto_increment[table.schema.cols[v.i].name].start;
        }

        dev.step(3.4); // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
        if (table.schema.cols[v.i].default) {
          table.schema.defaultRow[table.schema.cols[v.i].name] = table.schema.cols[v.i].default;
        }
      }

      // ------------------------------------------------
      dev.step(4); // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      table.values.forEach(vObj => {
        dev.step(4.1); // unique項目の値を洗い出し
        Object.keys(table.schema.unique).forEach(unique => {
          if (vObj[unique]) {
            if (table.schema.unique[unique].indexOf(vObj[unique]) < 0) {
              table.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });

        dev.step(4.2); // auto_increment項目の値を洗い出し
        Object.keys(table.schema.auto_increment).forEach(ai => {
          v.c = table.schema.auto_increment[ai].current;
          v.s = table.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if ((v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v)) {
            table.schema.auto_increment[ai].current = v.v;
          }
        });
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genTable: pv.table(sdbTable)を生成
   * @param query {sdbQuery}
   * @param query.table {string} - シート名
   * @param [query.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [query.set] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|null} シート不存在ならnull
   */
  function genTable(query) {
    const v = { whois: `${pv.whois}.genTable`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(2); // テーブルのプロトタイプを作成、初期化＋既定値設定
      v.r = objectizeColumn('sdbTable');
      if (v.r instanceof Error) throw v.r;
      pv.table[query.table] = v.table = Object.assign(v.r, {
        name: query.table, // {string} テーブル名(範囲名)
        sheet: pv.spread.getSheetByName(query.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      });

      dev.step(3); // シートの存否確認
      if (v.table.sheet === null) {

        if (query.command !== 'create') {
          // select, append, update, delete, schema の
          // create以外のコマンドの場合、対象テーブル未作成はエラー
          query.qSts = 'No Table';
        } else {

          dev.step(4); // シート不在なら引数から項目定義を作成
          if (query.cols && query.cols.length > 0) {
            dev.step(4.1); // 引数に項目定義オブジェクトが存在
            v.table.schema.cols = query.cols;
            v.table.header = query.cols.map(x => x.name);
          } else {
            if (query.set && query.set.length > 0) {
              dev.step(4.2); // 引数に項目定義オブジェクトが不存在だが初期データは存在
              v.r = convertRow(query.set);
              if (v.r instanceof Error) throw v.r;
              v.table.header = v.r.header;
            } else {
              dev.step(4.3); // 項目定義も初期データも無いならエラー
              query.qSts = 'No cols and data';
            }
          }

          dev.step(4.4); // 項目数・データ行数の設定
          v.table.colnum = v.table.header.length;
          v.table.rownum = 0;

          // 尚v.table.notes(項目定義メモ)は設定不要
          // ∵ step.6のgenSchema経由genColumnでcolsから作成される

        }
      } else {

        dev.step(5); // シートが存在するならシートから各種情報を取得
        dev.step(5.1); // シートイメージを読み込み
        v.getDataRange = v.table.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        dev.step(5.2); // シートイメージからヘッダ行・行オブジェクトを作成
        v.r = convertRow(v.getValues);
        if (v.r instanceof Error) throw v.r;

        dev.step(5.3); // ヘッダ・データの設定
        v.table.header = v.r.header;
        v.table.values = v.r.obj;
        v.table.colnum = v.table.header.length;
        v.table.rownum = v.table.values.length;

        dev.step(5.4); // ヘッダ行のメモ(項目定義メモ)を取得
        v.table.notes = v.getDataRange.getNotes()[0];

      }

      dev.step(6); // スキーマをインスタンス化
      if (query.qSts === 'OK') {
        v.r = genSchema(v.table);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {sdbQuery} query
   * @param {string} query.table - 取得対象テーブル名。テーブルと構造情報の対応を明確にするため、複数テーブル指定不可
   * @returns {null|Error}
   *
   * - sdbResult.pKeyは空欄、rStsはOK固定、diffにsdbColumnをセット
   */
  function getSchema(query) {
    const v = { whois: `${pv.whois}.getSchema`, step: 0, rv: [] };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // テーブル管理情報を項目毎にresultにセット
      v.cols = pv.table[query.table].schema.cols;
      for (v.i = 0; v.i < v.cols.length; v.i++) {
        query.result.push(v.cols[v.i]);
      }

      dev.step(2); // 項目数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** objectizeColumn: 項目定義メタ情報(JSDoc)からオブジェクトを生成
   * @param arg {Object[]|string} 文字列の場合、pv.opt以下に定義されているメンバ(typedef)と看做す
   * @param arg.name {string} 生成するオブジェクト内のメンバ名
   * @param arg.default {string|function} メンバ名にセットする値(functionalyzeの引数)
   * @returns {Object} 生成されたオブジェクト
   */
  function objectizeColumn(arg) {
    const v = { whois: `${pv.whois}.objectizeColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 文字列ならpv.opt以下に定義されているメンバ、それ以外は配列化
      v.arg = typeof arg === 'string' ? pv.opt[arg] : (Array.isArray(arg) ? arg : [arg]);

      dev.step(2);
      for (v.i = 0; v.i < v.arg.length; v.i++) {
        if (Object.hasOwn(v.arg[v.i], 'default') && v.arg[v.i].default) {
          dev.step(3);
          v.func = functionalyze(v.arg[v.i].default);
          if (v.func instanceof Error) throw v.func;
          v.rv[v.arg[v.i].name] = v.func();
        } else {
          dev.step(4); // 既定値の指定が無い場合はnullとする
          v.rv[v.arg[v.i].name] = null;
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** selectRow: テーブルから該当行を抽出
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|function} query.where - 対象レコード判定条件
   * @returns {null|Error}
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(query) {
    const v = { whois: `${pv.whois}.selectRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 抽出条件をquery.argにセット
      query.arg = toString(query.where);

      dev.step(2); // 判定条件を関数に統一
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(3); // 行オブジェクトを順次走査、該当行を戻り値に追加
      v.table = pv.table[query.table];
      for (v.i = 0; v.i < v.table.values.length; v.i++) {
        if (v.where(v.table.values[v.i])) {
          query.result.push(v.table.values[v.i]);
        }
      }

      dev.step(4); // 抽出行数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** 関数・オブジェクトを文字列化 */
  function toString(arg) {
    if (typeof arg === 'function') return arg.toString().replaceAll(/\n/g, '');
    if (arg !== null && typeof arg === 'object') return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: テーブルの既存行の内容を更新
   * @param {Object} query
   * @param {sdbTable} query.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} query.where - 対象レコードの判定条件
   * @param {Object|Function|string} query.set - 更新する値
   * @returns {null|Error}
   */
  function updateRow(query) {
    const v = {
      whois: `${pv.whois}.updateRow`, step: 0, rv: null,
      top: Infinity, left: Infinity, right: 0, bottom: 0
    }; // 更新範囲の行列番号
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在
      query.arg = { where: toString(query.where) };  // 変更履歴シート記録用に文字列化
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(1.3); // query.setの存否判定、引数setの処理
      if (Object.hasOwn(query, 'set') && query.set) {
        query.arg.set = toString(query.set);
        // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
        // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
        v.r = (query => {
          if (whichType(query, 'Object')) return query;  // Objectならそのまま返す
          try { return JSON.parse(query) } catch { return null } // JSONならObjectを、それ以外の文字列はnullを返す
        })(query.set);
        if (v.r !== null) { // query.setがObjectかJSONだった場合
          v.set = () => { return v.r }; // Objectを返す関数とする
        } else { // query.setがObjectでもJSONでもない文字列だった場合
          // 更新する値を導出する関数を作成
          v.set = functionalyze({ table: query.table, data: query.set });
          if (v.set instanceof Error) throw v.set;
        }

        dev.step(1.4); // 更新履歴記録用に文字列化
        query.arg = JSON.stringify(query.arg);

        dev.step(1.5); // 配列a1がa2の部分集合かどうかを判断する関数を用意
        // 更新対象項目がテーブルの項目名リストに全て入っているかの判断で使用(step.3.2)
        v.isSubset = (a1, a2) => {
          for (let element of a1)
            if (!a2.includes(element)) return false;
          return true;
        };

      } else {
        query.qSts = `No set`;
      }

      if (query.qSts === 'OK') {
        // ------------------------------------------------
        dev.step(2); // table.valuesを更新、ログ作成
        // ------------------------------------------------
        for (v.i = 0; v.i < v.table.values.length; v.i++) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (v.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.set(v.table.values[v.i]);

          dev.step(2.3); // 更新対象項目が項目名リストに存在しない場合はエラー
          // 本来事前チェックを行うべき項目だが、setをfunctionで指定していた場合
          // レコード毎に更新対象項目が変動する可能性があるため、レコード毎にチェック
          if (!v.isSubset(Object.keys(v.rObj), v.table.header)) {
            query.qSts = `Undefined Column`;
            break;
          }

          dev.step(2.4); // レコード単位の更新履歴オブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];
          query.result.push(v.log);

          dev.step(2.5); // v.before(更新前の行オブジェクト),after,diffの初期値を用意
          [v.before, v.after] = [v.table.values[v.i], {}];

          dev.step(2.6); // 項目毎に値が変わるかチェック
          v.table.header.forEach(x => {
            if (Object.hasOwn(v.rObj, x) && !isEqual(v.before[x], v.rObj[x])) {
              dev.step(6.1); // 変更指定項目かつ値が変化していた場合
              v.after[x] = v.rObj[x]; // afterは変更後の値
              v.log.diff[x] = [v.before[x], v.rObj[x]];  // diffは[変更前,変更後]の配列
              dev.step(6.2); // 更新対象範囲の見直し
              v.colNo = v.table.header.findIndex(y => y === x);
              v.left = Math.min(v.left, v.colNo);
              v.right = Math.max(v.right, v.colNo);
            } else {
              dev.step(6.3); // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          });

          dev.step(2.7); // 更新レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (Object.hasOwn(v.log.diff, v.unique)) {
              // 変更後の値がschema.uniqueに登録済の場合はDuplicate
              if (v.table.schema.unique[v.unique].indexOf(v.after[v.unique]) >= 0) {  // いまここ：全部Duplicate判定
                dev.step(7.1); // 登録済の場合はエラー
                v.log.rSts = 'Duplicate';
              } else {
                dev.step(7.2); // 未登録の場合、table.sdbSchema.uniqueから変更前の値を削除して変更後の値を追加
                v.idx = v.table.schema.unique[v.unique].findIndex(x => x === v.before[v.unique]);
                v.table.schema.unique[v.unique].splice(v.idx, 1);
                v.table.schema.unique[v.unique].push(v.after[v.unique]);
              }
            }
          }

          dev.step(2.8); // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
          if (v.log.rSts === 'OK') {
            query.num++;
            v.top = Math.min(v.top, v.i);
            v.bottom = Math.max(v.bottom, v.i);
            v.table.values[v.i] = v.after;
          }
        }

        // ------------------------------------------------
        dev.step(3); // 対象シート・更新履歴に展開
        // ------------------------------------------------
        dev.step(3.1); // シートイメージ(二次元配列)作成
        v.target = [];
        for (v.i = v.top; v.i <= v.bottom; v.i++) {
          v.row = [];
          for (v.j = v.left; v.j <= v.right; v.j++) {
            v.row.push(v.table.values[v.i][v.table.header[v.j]]);
          }
          v.target.push(v.row);
        }

        dev.step(3.2); // シートに展開
        // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
        // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.top + 2,  // +1(添字->行番号)+1(ヘッダ行)
            v.left + 1,  // +1(添字->行番号)
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
}
/** SpreadProperties: Google Spreadにおいて、各種属性を取得・保存する */
class SpreadProperties {
  /** @constructor
   * @param {Object} arg
   * @param {number} arg.elapsLimit=300000 - 一処理当たりの制限時間(5分)
   * @param {number} arg.executionLimit=100 - 処理を分割した場合の最大処理数
   * @returns {SpreadProperties}
   */
  constructor(arg){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1.1; // 引数に既定値設定
      if( typeof arg === 'string' ) arg = {SpreadId:arg};
      v.arg = Object.assign({
        SpreadId: SpreadsheetApp.getActiveSpreadsheet().getId(),  // {string} 本ソースをコンテナバインドしているスプレッドシートのIDを既定値とする
        propKey: 'SpreadProperties', // {string} ScriptPropertyのキー名
        elapsLimit: 300000, // {number}=300000 一処理当たりの制限時間(5分)
        executionLimit: 100, // {number}=100 処理を分割した場合の最大処理数
      },arg);
      Object.keys(v.arg).forEach(x => this[x] = v.arg[x]);

      v.step = 1.2; // メンバの既定値設定
      this.conf = { // {Object} 進捗状況。処理未完の場合、PropertyServiceに保存
        start: Date.now(),  // {number} saveSpread開始日時(UNIX時刻)
        complete: false, // {boolean} 完了したらtrue
        count: 0, // {number} 実行回数。処理時間が5分を超え、分割実行の都度インクリメント
        SpreadId: this.SpreadId, // {string} セーブ対象のスプレッドシートのID
        sheetList: [], // {string[]} セーブ対象スプレッドシートのシート名一覧
        propList: [], // {string[]} 出力するシート属性名の一覧。ex.Values ,Notes
        next:{sheet:0,prop:0,row:0}, // {Object} 次に処理対象となるsheetList,propList,行の添字(0オリジン)
        fileId: null // {string} 出力先ファイル(zip)のファイルID
      }
      this.spread = null; // {Spreadsheet} 対象のスプレッドシートオブジェクト
      this.srcFile = null; // {File} 対象スプレッドシートのファイルオブジェクト。spreadProperties()で設定
      this.folder = null; // {Folder} 対象スプレッドシートが存在するフォルダオブジェクト。spreadProperties()で設定
      this.sheet = null; // {Sheet} 現在処理中のシートオブジェクト
      this.sheetName = null; // {string} 現在処理中のシート名
      this.range = null; // {Range} sheetの内、データが存在する範囲(getDataRange())
      this.propName = null; // {string} 現在処理中の属性名
      this.dstFile = null; // {File} 分析結果を保存するJSON(zip)のファイルオブジェクト。saveSpread()で設定
      this.data = {}; // {Object} 分析結果のオブジェクト。{getSpreadの結果＋getPropの結果}
      this.overLimit = false; // {boolean} 処理時間(elapsLimit)を超えたらtrue

      /* sheetProperties {Object.<string,function>} : シートの各属性情報取得関数群
        * 各関数の引数: arg {Object}
        * - [src] {Object[][]} this.scan()に渡す二次元の属性情報。
        *   ex. arg.src = this.range.getFontColorObjects()
        * - [dst] {Object[][]} this.scan()に渡す前回処理結果
        *   前回途中で処理が中断した場合、続きを追加できるようにscanに渡す
        * - [func] {function} this.scan()に渡す個別セルの属性情報取得関数
        */
      v.step = 1.3;
      this.sheetProperties = { // シートの各属性情報取得関数群
        // 1.シート単位の属性
        Name: {get:arg=>{return this.sheet.getName()}},
        SheetId: {get:arg=>{return this.sheet.getSheetId()}},
        A1Notation: {get:arg=>{return this.range.getA1Notation()}},
        ColumnWidth: {
          get:arg=>{
            v.max = this.sheet.getLastColumn();
            v.a = new Array(v.max);
            for( v.i=0 ; v.i<v.max ; v.i++ ){
              v.w = this.sheet.getColumnWidth(v.i+1);
              v.a[v.i] = v.w !== this.sheetProperties.ColumnWidth.default ? v.w : '';
            }
            return v.a;
          },
          default:100,
        },
        /* 実行時間が非常に長いので無効化
        RowHeight: arg=>{
          v.a = this.data.Sheets.find(x => x.Name === this.sheetName).RowHeight || [];
          v.max = this.sheet.getLastRow();
          while( this.conf.next.row < v.max && this.overLimit === false ){
            // 一行分のデータを作成
            v.a.push(this.sheet.getRowHeight(this.conf.next.row+1));
            // カウンタを調整
            this.conf.next.row++;
            // 制限時間チェック
            if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
          }
          v.ratio = Math.round((this.conf.next.row/v.max)*10000)/100;
          console.log(`scan: ${this.sheetName}.RowHeight row=${this.conf.next.row}(${v.ratio}%) end.`);
          return v.a;
        },*/
        FrozenColumns: {get:arg=>{return this.sheet.getFrozenColumns()}},  // 固定列数
        FrozenRows: {get:arg=>{return this.sheet.getFrozenRows()}},  // 固定行数

        // 2.セル単位の属性
        // 2.1.値・数式・メモ
        DisplayValues: {
          get:arg=>{return this.range.getDisplayValues()},
          default:'',
          css:arg=>{return {text:arg.replaceAll(/\n/g,'<br>')}},
        },
        Values: {get:arg=>{return this.range.getValues()},default:''},
        FormulasR1C1: {
          get:arg=>{return this.range.getFormulasR1C1()},
          default:'',
          css: arg=>{return {attr:{title:[arg]}}},
        },
        Formulas: {
          get:arg=>{return this.range.getFormulas()},
          default:'',
          css: arg=>{return {attr:{title:[arg]}}},
        },
        Notes: {
          get:arg=>{return this.range.getNotes()},
          default:'',
          css: arg=>{return {attr:{title:[arg]}}},
        },
        // 2.2.セルの背景色、罫線
        Backgrounds: {
          get:arg=>{
            v.a = this.range.getBackgrounds();
            if( !arg.dst.hasOwnProperty('Backgrounds') )
              arg.dst.Backgrounds = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.Backgrounds,
              func: o => {return o},
              default: this.sheetProperties.Backgrounds.default,
            });
            return this.scan(arg);
          },
          default:'#ffffff',
          css:arg=>{return {style:{background:arg}}},
        },
        //Borders: JSON.stringify(v.dr.getBorder()),
        FontColorObjects: {
          get:arg=>{
            // asHexString()の戻り値は#aarrggbbなので注意
            // https://developers.google.com/apps-script/reference/base/rgb-color.html?hl=ja#asHexString()
            v.a = this.range.getFontColorObjects();
            if( !arg.dst.hasOwnProperty('FontColorObjects') )
              arg.dst.FontColorObjects = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontColorObjects,
              func: o => {return o.asRgbColor().asHexString()},
              default: this.sheetProperties.FontColorObjects.default,
            });
            return this.scan(arg);
          },
          default:'#ff000000',
          css:arg=>{return {style:{'color':arg}}},
        },
        // 2.3.フォント、上下左右寄せ、折り返し、回転
        FontFamilies: {
          get:arg=>{
            v.a = this.range.getFontFamilies();
            if( !arg.dst.hasOwnProperty('FontFamilies') )
              arg.dst.FontFamilies = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontFamilies,
              func: o => {return o},
              default: this.sheetProperties.FontFamilies.default,
            });
            return this.scan(arg);
          },
          default:'arial,sans,sans-serif',
          css: arg=>{return {style:{'font-family':arg}}},
        },
        FontLines: { // セルの線のスタイル。'underline','line-through','none'
          get:arg=>{
            v.a = this.range.getFontLines();
            if( !arg.dst.hasOwnProperty('FontLines') )
              arg.dst.FontLines = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontLines,
              func: o => {return o},
              default: this.sheetProperties.FontLines.default,
            });
            return this.scan(arg);
          },
          default:'none',
          css: arg=>{return {style:{'text-decoration-line':arg}}},
        },
        FontSizes: {
          get:arg=>{
            v.a = this.range.getFontSizes()
            if( !arg.dst.hasOwnProperty('FontSizes') )
              arg.dst.FontSizes = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontSizes,
              func: o => {return o},
              default: this.sheetProperties.FontSizes.default,
            });
            return this.scan(arg);
          },
          default:10,
          css: arg=>{return {style:{'font-size':arg+'pt'}}},
        },
        FontStyles: { // フォントスタイル。'italic'または'normal'
          get:arg=>{
            v.a = this.range.getFontStyles();
            if( !arg.dst.hasOwnProperty('FontStyles') )
              arg.dst.FontStyles = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontStyles,
              func: o => {return o},
              default: this.sheetProperties.FontStyles.default,
            });
            return this.scan(arg);
          },
          default:'normal',
          css: arg=>{return {style:{'font-style':arg}}},
        },
        FontWeights: {  // normal, bold, 900, etc. https://developer.mozilla.org/ja/docs/Web/CSS/font-weight
          get:arg=>{
            v.a = this.range.getFontWeights()
            if( !arg.dst.hasOwnProperty('FontWeights') )
              arg.dst.FontWeights = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.FontWeights,
              func: o => {return o},
              default: this.sheetProperties.FontWeights.default,
            });
            return this.scan(arg);
          },
          default:'normal',
          css: arg=>{return {style:{'font-weight':arg}}},
        },
        HorizontalAlignments: {
          get:arg=>{
            v.a = this.range.getHorizontalAlignments();
            if( !arg.dst.hasOwnProperty('HorizontalAlignments') )
              arg.dst.HorizontalAlignments = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.HorizontalAlignments,
              func: o => {return o},
              default: this.sheetProperties.HorizontalAlignments.default,
            });
            return this.scan(arg);
          },
          default:'general',
          css: arg=>{return {style:{'text-align':arg.replace('general-','')}}},
        },
        VerticalAlignments: {
          get:arg=>{
            v.a = this.range.getVerticalAlignments();
            if( !arg.dst.hasOwnProperty('VerticalAlignments') )
              arg.dst.VerticalAlignments = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.VerticalAlignments,
              func: o => {return o},
              default: this.sheetProperties.VerticalAlignments.default,
            });
            return this.scan(arg);
          },
          default:'bottom',
          css: arg=>{return {style:{'vertical-align':arg}}},
        },
        WrapStrategies: {  // テキストの折り返し
          get:arg=>{
            v.a = this.range.getWrapStrategies();
            if( !arg.dst.hasOwnProperty('WrapStrategies') )
              arg.dst.WrapStrategies = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.WrapStrategies,
              func: o => {return JSON.stringify(o).replaceAll('"','')},
              default: this.sheetProperties.WrapStrategies.default,
            });
            return this.scan(arg);
          },
          default:null,
          // html化の際はtdのCSSで「word-break: break-all(全て折り返し)」指定しているので、css関数は定義しない
        },
        TextDirections: {  // 文章方向
          // https://developer.mozilla.org/ja/docs/Web/CSS/text-decoration-line
          // LEFT_TO_RIGHT	Enum	文章方向（左から右へ）。
          // RIGHT_TO_LEFT	Enum	文章方向が右から左。
          get:arg=>{
            v.a = this.range.getTextDirections();
            if( !arg.dst.hasOwnProperty('TextDirections') )
              arg.dst.TextDirections = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            if( !arg.dst.hasOwnProperty('TextDirections') ) arg.dst.TextDirections = [];
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.TextDirections,
              func: o => {return JSON.stringify(o).replaceAll('"','')},
              default: this.sheetProperties.TextDirections.default,
            });
            return this.scan(arg);
          },
          default:null,
          // htmlへの反映は未対応
        },
        // 2.4.その他
        MergedRanges: {get:arg=>{  // 結合セル
          v.a = [];
          this.range.getMergedRanges().forEach(x => v.a.push(x.getA1Notation()));
          return v.a;
        }},
        DataValidations: {
          get:arg=>{
            v.a = this.range.getDataValidations();
            if( !arg.dst.hasOwnProperty('DataValidations') )
              arg.dst.DataValidations = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
            arg = Object.assign(arg,{
              src: v.a,
              dst: arg.dst.DataValidations,
              func: o => {return { // セルの処理関数
                AllowInvalid: o.getAllowInvalid(),
                CriteriaType: JSON.parse(JSON.stringify(o.getCriteriaType())),
                CriteriaValues: JSON.parse(JSON.stringify(o.getCriteriaValues())),
                HelpText: o.getHelpText(),
              }},
              default: this.sheetProperties.DataValidations.default,
            });
            return this.scan(arg);
          },
          default:null,
          // htmlへの反映は未対応
        },
      };

      // --------------------------------------------------
      v.step = 2; // 進捗管理(this.conf)のセット
      // --------------------------------------------------
      v.step = 2.1; // confをPropertyから取得
      v.ScriptProperties = PropertiesService.getScriptProperties().getProperty(this.propKey);
      if( v.ScriptProperties !== null ){ // 2回目以降の実行時(タイマー起動)

        this.conf = JSON.parse(v.ScriptProperties);
        this.spread = SpreadsheetApp.openById(this.conf.SpreadId);
        this.srcFile = DriveApp.getFileById(this.conf.SpreadId);

        v.step = 2.2; // 作業用ファイルの内容をthis.dataに読み込み
        this.dstFile = DriveApp.getFileById(this.conf.fileId);
        v.unzip = Utilities.unzip(this.dstFile.getBlob());
        this.data = JSON.parse(v.unzip[0].getDataAsString('UTF-8'));
        this.dstFile.setTrashed(true); // 現在のzipをゴミ箱に移動

      } else {  // 強制停止、または初回実行時

        if( arg === false ){ // 強制停止

          v.step = 2.3;
          throw new Error(`次回処理の強制停止指示があったため、処理を終了します`);

        } else {  // 初回実行時

          v.step = 2.41; // 入力元のスプレッドシート・ファイル
          this.spread = SpreadsheetApp.openById(this.conf.SpreadId);
          this.srcFile = DriveApp.getFileById(this.conf.SpreadId);

          v.step = 2.42; // this.dataにスプレッドシート関連情報をセット
          this.data = this.spreadProperties();

          v.step = 2.43; // シート名一覧(this.conf.sheetList)の作成、this.data.Sheetsに初期値設定
          this.spread.getSheets().forEach(x => this.conf.sheetList.push(x.getSheetName()));
          this.conf.sheetList.forEach(x => this.data.Sheets.push({Name:x}));

          v.step = 2.44; // 取得する属性一覧(this.conf.propList)の作成
          this.conf.propList = Object.keys(this.sheetProperties);

        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** spreadProperties: フォルダ・ファイル関連、スプレッドシート関連の属性情報取得
   * @param {void}
   * @returns {Object.<string,string>} 属性名：値形式
   */
  spreadProperties(){
    const v = {whois:this.constructor.name+'.spreadProperties',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      this.srcFile = DriveApp.getFileById(this.spread.getId());
      v.rv = {
        // フォルダ・ファイル関連情報
        Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
          v.folderNames = [];
          v.folder = this.srcFile.getParents().next();
          while (v.folder) {
            v.folderNames.unshift(v.folder.getName());
            v.parents = v.folder.getParents();
            v.folder = v.parents.hasNext() ? v.parents.next() : null;
          }
          return v.folderNames;
        })(),
        Description: this.srcFile.getDescription(), // ファイルの説明文
        DateCreated: toLocale(this.srcFile.getDateCreated()), // ファイル作成日時
        LastUpdated: toLocale(this.srcFile.getLastUpdated()),
        Size: this.srcFile.getSize(),

        // スプレッドシート関連情報
        Id: this.spread.getId(),
        Name: this.spread.getName(),
        NamedRange: (()=>{  // 名前付き範囲
          v.a = []; this.spread.getNamedRanges().forEach(o => {
            v.r = o.getRange();
            v.a.push({
              Name: o.getName(),
              sheetName: v.r.getSheet().getName(),
              Range: v.r.getA1Notation(),
            });
          }); return v.a;
        })(),
        Owner: this.spread.getOwner().getEmail(),
        SpreadsheetLocale: this.spread.getSpreadsheetLocale(), // 言語/地域
        SpreadsheetTimeZone: this.spread.getSpreadsheetTimeZone(), // スプレッドシートのタイムゾーン
        Url: this.spread.getUrl(),
        Viewers: (()=>{  // 閲覧者とコメント投稿者のリスト
          v.a = [];
          this.spread.getViewers().forEach(x => v.a.push(x.getEmail()));
          return v.a;
        })(),

        SavedDateTime: toLocale(new Date(this.conf.start)),  // 本メソッド実行日時
        Sheets: [], // シート情報
      };

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** scan: 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化
   * @param arg {Object}
   * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
   * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
   * @param arg.func {function} - セルに設定する値を導出する関数
   * @param [arg.default] {any} - セルの既定値。存在する場合のみ指定
   */
  scan(arg){
    const v = {whois:this.constructor.name+'.scan',step:0,rv:null};
    try {

      while( this.conf.next.row < arg.src.length && this.overLimit === false ){
        if( arg.src[this.conf.next.row] ){
          // 一行分のデータを作成
          for( v.i=0 ; v.i<arg.src[this.conf.next.row].length ; v.i++ ){
            if( !arg.src[this.conf.next.row][v.i] ) continue;  // null等なら処理対象外
            v.r = arg.func(arg.src[this.conf.next.row][v.i]);
            if( !arg.hasOwnProperty('default') || arg.default !== v.r ){
              arg.dst[this.conf.next.row][v.i] = v.r;
            }
          }
        }
        // カウンタを調整
        this.conf.next.row++;
        // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }
      v.ratio = Math.round((this.conf.next.row/arg.src.length)*10000)/100;

      v.step = 9; // 終了処理
      console.log(`scan: ${this.sheetName}.${this.propName} row=${this.conf.next.row}(${v.ratio}%) end.`);
      return arg.dst;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
      + `\narg=${JSON.stringify(arg)}`
      + `\nthis.conf.next=${JSON.stringify(this.conf.next)}`
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getSheet: 指定されたシートの属性情報を取得
   * @param arg {string}=this.spread.getActiveSheet() - 取得対象となるシート名。未指定の場合表示中のシート
   * @returns {void} this.data.Sheet[取得対象シート名]
   */
  getSheet(arg=null){
    const v = {whois:this.constructor.name+'.getSheet',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${arg}`);
    try {

      this.sheetName = arg === null ? this.spread.getActiveSheet().getName() : arg;
      this.conf.next = {sheet:this.conf.sheetList.findIndex(x => x === this.sheetName),prop:0,row:0};
      this.sheet = this.spread.getSheetByName(this.sheetName);
      this.range = this.sheet.getDataRange();
      while( this.conf.next.prop < this.conf.propList.length && this.overLimit === false ){
        v.step = 4.1; // 属性毎の情報取得
        this.propName = this.conf.propList[this.conf.next.prop];
        console.log(`${this.sheetName}.${this.propName} start.`
        + ` (sheet=${this.conf.next.sheet+1}/${this.conf.sheetList.length},`
        + ` prop=${this.conf.next.prop+1}/${this.conf.propList.length})`);
        v.step = 4.2; // 引数を作成
        v.arg = {sheet:this.sheet,range: this.range,dst:this.data.Sheets.find(x => x.Name === this.sheetName)};
        if( !v.arg.dst ) v.arg.dst = this.data.Sheets[this.sheetName] = {};

        v.step = 4.3; // 属性取得の実行
        v.r = this.sheetProperties[this.conf.propList[this.conf.next.prop]].get(v.arg);
        if( v.r instanceof Error ) throw v.r;
        this.data.Sheets.find(x => x.Name === this.sheetName)[this.propName] = v.r;
        v.step = 4.4; // カウンタを調整
        if(!this.overLimit){
          this.conf.next.prop++;
          this.conf.next.row = 0;
        }
        v.step = 4.5; // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }

      v.step = 9; // 終了処理
      v.rv = this.data.Sheets.find(x => x.Name === this.sheetName);
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** range2html: 選択範囲をHTML化
   * @param arg {Object}
   * @param arg.guide {boolean}=false - 行列記号を付ける場合はtrue
   * @returns {Object}
   */
  range2html(arg){
    const v = {whois:this.constructor.name+'.range2html',step:0,rv:null,className:'x'+Utilities.getUuid()};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1.1; // 引数の既定値設定
      v.arg = Object.assign({guide:false},arg);

      v.step = 1.2; // 現在のシート・選択範囲をメンバに保存
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      console.log(this.sheet.getName())
      this.range = this.sheet.getActiveRange();
      v.A1Notation = this.range.getA1Notation();

      v.step = 1.3; // 選択範囲をv.top/left/right/bottomに【添字ベース】で保存
      v.m = v.A1Notation.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
      v.top = Number(v.m[2]) - 1;
      v.left = convertNotation(v.m[1]) - 1;
      v.right = v.m[3] === '' ? v.left : (convertNotation(v.m[3]) - 1);
      v.bottom = v.m[4] === '' ? v.top : (Number(v.m[4]) - 1);
      v.colnum = v.right - v.left + 1;
      v.rownum = v.bottom - v.top + 1;

      v.step = 1.4; // シートから情報取得
      v.sheet = this.getSheet(this.sheet.getName());

      v.step = 2; // v.element: セル毎の情報オブジェクトを作成
      // - tag {string} : htmlのタグ。ex.'td'
      // - attr {Object.<string,string>} 属性。ex.{'colspan':2}
      // - style {Object.<string,string>} セル特有のCSS。ex.{'font-color':'#ff0000'}
      // - text {string} セルに表示する文字列
      // - children {v.element[]} 子要素の情報オブジェクト
      v.step = 2.1; // v.elementを空(null)の配列として作成
      v.element = Array.from({length:v.rownum},()=>Array.from({length:v.colnum},()=>null));

      v.step = 2.2; // 属性毎にチェック
      for( v.prop in this.sheetProperties ){
        if( this.sheetProperties[v.prop].hasOwnProperty('css') ){
          // CSSの定義が無いシートの属性はスキップ ex.Name, SheetId
          if( Array.isArray(v.sheet[v.prop][0]) ){

            v.step = 2.3; // Backgroundのように、データが二次元の場合は行×列で処理
            for( v.r=0 ; v.r<v.rownum ; v.r++ ){
              for( v.c=0 ; v.c<v.colnum ; v.c++ ){
                if( v.sheet[v.prop][v.r+v.top][v.c+v.left] ){
                  // シートの定義値優先で、既存の定義オブジェクトをマージ
                  v.element[v.r][v.c] = mergeDeeply(
                    this.sheetProperties[v.prop].css(v.sheet[v.prop][v.r+v.top][v.c+v.left]),
                    v.element[v.r][v.c]
                  );
                }
              }
            }

          } else {

            v.step = 2.4; // ColumnWidthのように、データが一次元の場合は1行目のみ設定
            for( v.c=0 ; v.c<v.colnum ; v.c++ ){
              if( v.sheet[v.prop][v.c+v.left] ){
                v.element[0][v.c] = mergeDeeply(
                  this.sheetProperties[v.prop].css(v.sheet[v.prop][v.c+v.left]),
                  v.element[0][v.c]
                );
              }
            }
          }
        }
      }

      v.step = 2.5; // attrの初期値を設定
      for( v.r=0 ; v.r<v.element.length ; v.r++ ){
        for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
          if( !v.element[v.r][v.c] ) continue;
          // セル幅を指定するクラスを設定。この段階では添字(数値)を設定、クラス文字列にはv.tdで変換
          console.log(`l.837 v.element[${v.r}][${v.c}]=${JSON.stringify(v.element[v.r][v.c])}`)
          if( !v.element[v.r][v.c].hasOwnProperty('attr') ) v.element[v.r][v.c].attr = {};
          v.element[v.r][v.c].attr = mergeDeeply({class:v.c},v.element[v.r][v.c].attr);

          // title属性はメモ＋数式なので配列として保存されている。これを文字列に変換
          if( v.element[v.r][v.c] && v.element[v.r][v.c].attr.hasOwnProperty('title'))
            v.element[v.r][v.c].attr.title = v.element[v.r][v.c].attr.title.join('\n');
        }
      }

      v.step = 2.6; // 結合セル対応
      v.sheet.MergedRanges.forEach(x => { // x:結合セル範囲のA1記法文字列

        v.step = 2.61; // 範囲を数値化
        // v.mrXXX : アクティブな範囲の右上隅を(0,0)とするアドレス
        v.m = x.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
        v.mrTop = Number(v.m[2]) - (v.top + 1);
        v.mrLeft = convertNotation(v.m[1]) - (v.left + 1);
        v.mrRight = v.m[3] === '' ? v.mrLeft : (convertNotation(v.m[3]) - (v.left+1));
        v.mrBottom = v.m[4] === '' ? v.mrTop : Number(v.m[4]) - (v.top + 1);

        v.step = 2.62; // 範囲の先頭行左端セルは残す
        v.element[v.mrTop].splice(v.mrLeft+1,(v.mrRight-v.mrLeft));
        for( v.r=v.mrTop+1 ; v.r<=v.mrBottom ; v.r++ )
          v.element[v.r].splice(v.mrLeft,(v.mrRight-v.mrLeft+1));

        v.step = 2.63; // colspan, rowspanの設定
        if( v.mrLeft < v.mrRight )
          v.element[v.mrTop][v.mrLeft].attr.colspan = v.mrRight - v.mrLeft + 1;
        if( v.mrTop < v.mrBottom )
          v.element[v.mrTop][v.mrLeft].attr.rowspan = v.mrBottom - v.mrTop + 1;
      });

      v.step = 3.1; // スタイルシートの作成
      v.html = [
        '<style type="text/css">',
        `.${v.className} `+'th,td {',
        '  position: relative;',
        '  height: 20px;',
        '  background: #ffffff;',
        '  font-size: 10pt;',
        '  border-right: solid 1px #e1e1e1;',
        '  border-bottom: solid 1px #e1e1e1;',
        '  word-break: break-all;',
        '}',
        `.${v.className} `+'th {',
        '  font-family: sans-serif;',
        '  text-align: center;',
        '  vertical-align: middle;',
        '  font-weight: 900;',
        '  background: #dddddd;',
        '  border-top: solid 1px #e1e1e1;',
        '  border-left: solid 1px #e1e1e1;',
        '  width: 50px;',
        '}',
        `.${v.className} `+'td {',
        '  width: 100px;',
        '  font-family: arial,sans,sans-serif;',
        '  vertical-align: bottom;',
        '  overflow: hidden; /* 折り返しは隠す */',
        '}',
        `.${v.className} `+'.noteIcon {',
        '  position: absolute; top:0; right: 0;',
        '  width: 0px;',
        '  height: 0px;',
        '  border-top: 4px solid black;',
        '  border-right: 4px solid black;',
        '  border-bottom: 4px solid transparent;',
        '  border-left: 4px solid transparent;',
        '}',
      ];

      v.step = 3.2; // ColumnWidth
      for( v.i=v.left ; v.i<=v.right ; v.i++ ){
        v.width = (v.sheet.ColumnWidth[v.i] || this.sheetProperties.ColumnWidth.default) + 'px';
        v.html.push(`.${v.className} td:nth-Child(${v.i-v.left+1}),`
        + ` .${v.className} td.col${v.i-v.left+1} {width: ${v.width};}`);
      }
      v.html.push('</style>');

      v.step = 4; // body部分の作成
      v.step = 4.1; // セル単位のtd要素(ソース)生成関数を定義
      v.td = o => {
        if( o === null ) return '<td></td>';
        let rv = '<td';
        if( o.hasOwnProperty('attr') ){
          if( o.attr.hasOwnProperty('title') ){
            // メモの存在を示す右上隅の黒い三角マークを追加
            o.text = '<div class="noteIcon"></div>' + (o.text||'');
          }

          // 結合セルの影響で列がズレたセルはセル幅指定用のクラスを設定
          if( o.attr.hasOwnProperty('colspan') || o.attr.hasOwnProperty('rowspan') || o.attr.class === v.c ){
            delete o.attr.class;
          } else {
            o.attr.class = `col${o.attr.class+1}`;
          }

          // tdの属性を指定
          for( let p in o.attr ) rv += ` ${p}="${o.attr[p]}"`;
        }
        if( o.hasOwnProperty('style') ){
          rv += ' style="';
          for( let p in o.style ) rv += `${p}:${o.style[p]};`
          rv += '"';
        }
        rv += `>${o.text||''}</td>`;
        return rv;
      };

      v.step = 4.2; // tableタグ内のソース作成
      v.html.push(`<table class="${v.className}"><tr>`);
      if( v.arg.guide === true ){ // 列記号の追加
        v.html.push('  <th></th>');
        for( v.c=v.left ; v.c<=v.right ; v.c++ )
          v.html.push(`  <th>${convertNotation(v.c+1)}</th>`)
        v.html.push('</tr><tr>');
      }
      for( v.r=0 ; v.r<v.element.length ; v.r++ ){
        if( v.arg.guide === true ) v.html.push(`<th>${v.top+v.r+1}</th>`) // 行番号の追加
        for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
          v.html.push('  '+v.td(v.element[v.r][v.c]))
        }
        v.html.push('</tr><tr>');
      }
      v.html.push('</tr></table>');
      v.rv = v.html.join('\n');

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;


    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getRange: 現在選択中の範囲の属性情報を取得
   * @returns {Object}
   */
  getRange(){  // いまここ作成中
    const v = {whois:this.constructor.name+'.saveSheet',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** saveSpread() : 指定スプレッドシートから各種属性情報を取得、Google Diverのスプレッドシートと同じフォルダにzip形式圧縮されたJSONとして保存
   * @param arg {string} - 呼出元の関数名
   * @returns {Object.<string,any>} 属性名：設定値形式のオブジェクト
   *
   * - 仕様は[workflowy](https://workflowy.com/#/415ca4c2d194)参照
   */
  saveSpread(arg=null){
    const v = {whois:'saveSpread',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      // --------------------------------------------------
      v.step = 4; // シート毎の情報取得
      // --------------------------------------------------
      while( this.conf.next.sheet < this.conf.sheetList.length && this.overLimit === false ){
        this.sheetName = this.conf.sheetList[this.conf.next.sheet];
        this.sheet = this.spread.getSheetByName(this.sheetName);
        this.range = this.sheet.getDataRange();
        while( this.conf.next.prop < this.conf.propList.length && this.overLimit === false ){
          v.step = 4.1; // 属性毎の情報取得
          this.propName = this.conf.propList[this.conf.next.prop];
          console.log(`${this.sheetName}.${this.propName} start.`
          + ` (sheet=${this.conf.next.sheet+1}/${this.conf.sheetList.length},`
          + ` prop=${this.conf.next.prop+1}/${this.conf.propList.length})`);
          v.step = 4.2; // 前回結果をクリア
          v.arg = {};
          //['src','dst','func'].forEach(x => delete v.arg[x]);
          v.step = 4.3; // 属性取得の実行
          v.r = this.sheetProperties[this.conf.propList[this.conf.next.prop]](v.arg);
          if( v.r instanceof Error ) throw v.r;
          this.data.Sheets.find(x => x.Name === this.sheetName)[this.propName] = v.r;
          v.step = 4.4; // カウンタを調整
          if(!this.overLimit){
            this.conf.next.prop++;
            this.conf.next.row = 0;
          }
          v.step = 4.5; // 制限時間チェック
          if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
        }
        v.step = 4.6; // カウンタを調整
        if(!this.overLimit){
          this.conf.next.sheet++;
          [this.conf.next.prop,this.conf.next.row] = [0,0]
        };
        v.step = 4.7; // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }

      // --------------------------------------------------
      v.step = 5; // this.dataの内容を作業用ファイルに書き込む
      // --------------------------------------------------
      v.step = 5.1; // 圧縮対象のファイル名に日本語が入っていると"Illegal byte sequence"になるので英文字指定
      v.blob = Utilities.newBlob(JSON.stringify(this.data),'application/json',`${this.overLimit?'uncomplete':'data'}.json`);
      v.zip = Utilities.zip([v.blob],`${this.data.Name}.${toLocale(new Date(this.conf.start),'yyyyMMdd-hhmmss')}.zip`);
      this.dstFile = this.srcFile.getParents().next().createFile(v.zip);
      this.conf.fileId = this.dstFile.getId();

      v.step = 5.2; // ScriptPropertiesを削除
      if( v.ScriptProperties ){
        PropertiesService.getScriptProperties().deleteProperty(this.propKey);
      }
      this.conf.count += 1;  // 実行回数をインクリメント
      if( this.overLimit ){  // タイムアウト時
        v.step = 5.3;
        if( this.conf.count > this.executionLimit && this.conf.complete === false ){ // 実行回数の制限を超えた場合
          throw new Error(`最大実行回数(${this.executionLimit}回)を超えたので、処理を中断しました`);
        } else {
          // ScriptPropertiesを更新
          PropertiesService.getScriptProperties().setProperty(this.propKey, JSON.stringify(this.conf));
          // 1分後に自分自身を起動するよう、タイマーをセット
          ScriptApp.newTrigger(arg).timeBased().after(1000 * 60).create();
        }
      }

      v.step = 9; // 終了処理
      v.rv = this.conf;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${JSON.stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
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