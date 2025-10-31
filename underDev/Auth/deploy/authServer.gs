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
    let msg = (line === null ? '' : `l.${line} `)
      + `::dump::${o.label}.${o.step}`;
    for (let i = 0; i < arg.length; i++) {
      // 対象変数が複数有る場合、Noを追記
      msg += '\n' + (arg.length > 0 ? `${i}: ` : '') + stringify(arg[i]);
    }
    console.log(msg);
  }
  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示
   * @param {Object} rt - end実行時に全体に優先させるオプション指定(run time option)
   */
  function end(rt={}) {
    const localOpt = Object.assign({},opt,rt);
    const o = stack.pop();
    if (localOpt.start) console.log(`${o.label} normal end.`);
  }
  /** error: 異常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function error(e) {
    const o = stack.pop();
    // 参考 : e.lineNumber, e.columnNumber, e.causeを試したが、いずれもundefined
    e.message = `[Error] ${o.label}.${o.step}\n${e.message}`;
    console.error(e.message
      + `\n-- footprint\n${o.footprint}`
      + `\n-- arguments\n${o.arg}`
    );
  }
  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} name - 関数名
   * @param {any[]} arg - start呼出元関数に渡された引数([...arguments]固定)
   * @param {Object} rt - start実行時に全体に優先させるオプション指定(run time option)
   */
  function start(name, arg = [], rt={}) {
    const localOpt = Object.assign({},opt,rt);
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

    if (localOpt.start) {  // 開始メッセージの表示指定が有った場合
      console.log(`${o.label} start.\n-- footprint\n${o.footprint}`
        + (localOpt.arg ? `\n-- arguments\n${o.arg}` : ''));
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
// 以下、typedefはSchema 1.1.0より引用。

/** schemaDef: DB構造定義オブジェクト (引数用)
 * @typedef {Object} schemaDef
 * @property {string} [dbName] - データベース名(IndexedDB上ではストア名)
 * @property {string} [note] - 備考
 * @property {Object.<string, tableDef>} tableDef - テーブル構造定義名をメンバ名とするテーブル構造定義
 * @property {Object.<string, Object>} tableMap - 実テーブル名をメンバ名とする実テーブルの定義
 * @property {string} [tableMap.def] - 使用するテーブル定義名。実テーブル名と定義名が一致する場合は省略可。
 * @property {string|Object[]} [tableMap.data] - テーブルに格納される初期データ
 *   - string: CSV/TSV形式。先頭行は項目名(labelの配列=header)。
 *   - Object[]: 行オブジェクトの配列
 * @property {Object.<string, string>} [custom] - AlaSQLのカスタム関数。{関数名: toString()で文字列化した関数}
 */

/** schemaDefEx: Schemaの戻り値となる拡張済DB構造定義オブジェクト
 * 引数用のschemaDefに以下を追加・変更したもの
 * @typedef {Object} schemaDefEx
 * @property {string} original - インスタンス化前の引数(schemaDef)をJSON文字列化したもの
 *   (一部文字列を関数化しているため、保存時はプリミティブ変数のみ)
 * @property {string} [created] - 作成日時。export時に使用
 * @property {Function} expand - expandSchemaメソッド(公開API)。schemaDefExを再作成
 */

// =====================================================================

/** tableDef: テーブル構造定義オブジェクト (引数用)
 * @typedef {Object} tableDef
 * @property {string} [note] - テーブルに関する備考
 * @property {string|string[]} [primaryKey] - 主キーとなる項目名。複合キーの場合は配列で指定
 * @property {columnDef[]} colDef - 項目定義(順序を考慮するためオブジェクトでは無く配列で定義)
 * @property {number} [top=1] - シート・CSVイメージ上のヘッダ行番号
 * @property {number} [left=1] - シート・CSVイメージ上の開始列番号
 * @property {number} [startingRowNumber=2] - シート上の行番号"RowNumber"を追加する場合の開始行番号。<0なら追加しない。
 */

/** tableDefEx: Schemaの戻り値となる拡張済テーブル構造定義オブジェクト
 * 引数用のtableDefに以下の項目を追加・変更したもの
 * @typedef {Object} tableDefEx
 * @property {string} name - 実テーブル名
 * @property {string[]} header - columnDef.labelの配列
 * @property {Object.<string, columnObj>} colDef - {columnDef.name: columnObj}
 */

// =====================================================================

/** columnDef: 項目定義オブジェクト (引数用)
 * @typedef {Object} columnDef
 * @property {string} name - 項目名。原則英数字で構成(システム用)
 * @property {string} [note] - 備考
 * @property {string} [label] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @property {string} [type='string'] - データ型。string / number / boolean
 * @property {string[]} [alias] - 複数タイプのCSVを統一フォーマットで読み込む際の別名リスト
 * @property {any} [default=null] - 既定値。関数の場合は引数を行オブジェクトとするtoString()化された文字列
 * @property {string} [printf=null] - 表示整形用関数。引数を行オブジェクトとするtoString()化された文字列
 */

/** columnDefEx: Schemaの戻り値となる拡張済項目定義オブジェクト
 * 引数用のcolumnDefに以下の項目を追加・変更したもの
 * @typedef {Object} columnDefEx
 * @property {number} seq - 左端を0とする列番号
 */

// =====================================================================

/** SpreadDb: シートをテーブルとして扱うGAS内部のRDB
 * - ヘッダ行は1行目に固定、左端から隙間無く項目を並べる(空白セル不可)
 * - シート上には存在しないが、テーブル上はRowNumber(シート上の行番号)を持たせる。データ部先頭は'2'
 * @namespace SpreadDb
 * @param {schemaDef} schema={tableMap:{}} - DB構造定義オブジェクト
 * @param {Object} opt - オプション
 * @returns {Object} 使用可能なメソッドのオブジェクト
 */
function SpreadDb(schema={tableMap:{}},opt={}) {
  const pv = { whois: 'SpreadDb', rv: null,
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    schema: null,
    opt: Object.assign({},opt), // 現状、オプションは未定義
    rdb: new alasql.Database(),
  };

  /** array2obj: シートイメージの二次元配列を行オブジェクトの配列に変換
   * @memberof SpreadDb
   * @param {string|number|boolean[][]} arg=[] - シートイメージの二次元配列。先頭行はヘッダ
   * @param {Object} opt - オプション
   * @param {number|null} opt.RowNumber=null - 行番号(RowNumber)追加ならヘッダ行の行番号、追加無しならnull
   * @param {Object.<string,columnDefEx>|null} opt.colMap=null - シートイメージの項目定義集
   * @returns {Object[]} 行オブジェクトの配列
   */
  function array2obj(arg=[],opt={}) {
    const v = { whois: `${pv.whois}.array2obj`, rv: []};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // オプションの既定値設定
      opt = Object.assign({RowNumber:null,colMap:null},opt);

      for (v.r = 1; v.r < arg.length; v.r++) {  // ヘッダ行(0行目)は飛ばす

        dev.step(2);  // 行オブジェクトの原型作成
        v.o = opt.RowNumber === null ? {} : {RowNumber:opt.RowNumber++};

        for( v.c=0 ; v.c<arg[0].length ; v.c++ ){

          dev.step(3);  // 項目名空欄は除外
          if( !arg[0][v.c] ) continue;

          dev.step(4);  // 項目定義上のデータ型を特定
          v.type = typeof opt.colMap[arg[0][v.c]].type === 'undefined'
          ? 'undefined' : opt.colMap[arg[0][v.c]].type;

          switch( v.type ){
            case 'number':
              dev.step(5.1);  // 数値化。なおNumber('')=0
              v.o[arg[0][v.c]] = Number(arg[v.r][v.c].replace(/,/g,''));
              // 数値項目に数値以外が入っていたらエラー
              if( isNaN(v.o[arg[0][v.c]]) ) throw v.o[arg[0][v.c]];
              break;
            case 'boolean':
              dev.step(5.2);  // 真偽値欄の空欄は未設定と看做して空文字列を設定、
              // 空文字列以外でリストに含まれる文字列はfalse、それ以外はtrueを設定
              v.o[arg[0][v.c]] = (arg[v.r][v.c] === '' ? '' : (
                ['0','false','no','ng','偽','誤','□']
                .find(x => x === arg[v.r][v.c].toLowerCase()) ? false : true
              ));
              break;
            default:
              dev.step(5.3);  // string型、またはデータ型不明はそのままセット
              v.o[arg[0][v.c]] = arg[v.r][v.c];
          }

        }

        dev.step(6);  // 行オブジェクトを戻り値に格納
        v.rv.push(v.o);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** execSQL: alasqlでSQLを実行
   * @memberof SpreadDb
   * @param {string} sql
   * @param {Array[]} arg - alasqlの第二引数
   * @returns {Object[]}
   */
  function execSQL(sql,arg=null) {
    console.log(`${pv.whois}.execSQL start.\nsql: ${sql}\narg: `
      + ( arg === null ? 'null' : `placeholder num = ${arg.length}\n`
      + arg.map(x => `record num = ${x.length}, sample=${JSON.stringify(x[0])}`).join('\n')
    ));
    return arg === null ? pv.rdb.exec(sql) : pv.rdb.exec(sql,arg);
  }

  /** exportFile: テーブルの構造及びデータをファイルとしてダウンロード
   * なおschema.tableDefが無い場合も出力自体は可能とする。
   * @memberof SpreadDb
   * @param {Object|string} arg={} - 文字列型の場合、ダウンロードファイル名と看做す
   * @param {string} arg.file='data.json' - ダウンロードファイル名
   * @param {string|string[]} arg.table=[] - 出力対象テーブル名。無指定なら全テーブル
   * @param {boolean} arg.format='JSON' - 出力形式
   *   - JSON: schemaDefに基づき、tableDef.dataに行オブジェクト化
   *   - CSV,TSV他は必要に応じて追加実装(テーブル指定が1つの場合のみ対応とする？)
   * @returns {void}
   * - 出力されるJSONの構造はschemaDef参照
   */
  function exportFile(arg={}) {
    const v = { whois: `${pv.whois}.exportFile`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // オプションの既定値設定
      arg = Object.assign({
        file: 'data.json',
        table: [],
        format: 'JSON',
      },(typeof arg === 'string' ? {file:arg} : arg));
      arg.table = Array.isArray(arg.table) ? arg.table : [arg.table];
      arg.format = arg.format.toLowerCase();  // 表記揺れ回避

      dev.step(1);  // ダウンロードする内容の作成
      v.content = JSON.parse(pv.schema.original);
      // 作成日時を付記
      v.content.created = toLocale();
      //v.content.data = {};

      dev.step(1.2);  // 各テーブルのデータをセット
      for( v.i=0 ; v.i<arg.table.length ; v.i++ ){
        v.r = execSQL(`select * from \`${arg.table[v.i]}\` order by RowNumber;`);
        if( v.r instanceof Error ) throw v.r;
        v.content.tableMap[arg.table[v.i]].data = v.r;
      }

      dev.step(1.3);  // 文字列化
      v.json = JSON.stringify(v.content);

      dev.step(2);  // HTMLをコード内で定義
      const html = HtmlService.createHtmlOutput(`
        <html>
          <head><base target="_top"></head>
          <body>
            <p>JSONファイルのダウンロードを開始しています...</p>
            <script>
              const data = ${v.json};

              // JSONとしてファイルを生成して自動ダウンロード
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${arg.file}';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);

              // ダイアログを自動的に閉じる（少し待ってから）
              setTimeout(() => {
                google.script.host.close();
              }, 1000);
            </script>
          </body>
        </html>
      `).setWidth(300).setHeight(100);

      dev.step(3);  // ダイアログの表示
      SpreadsheetApp.getUi().showModalDialog(html, 'JSONをダウンロード中');

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** hasTable: RDB(alasql)内にテーブルを持っているか確認
   * @memberof SpreadDb
   * @param {string} tableName
   * @returns {boolean}
   */
  function hasTable(tableName) {
    return tableName in pv.rdb.tableMap;
  }

  /** importGDCSV: Google Drive上のCSVからデータ取得、行オブジェクトの配列を返す
   * @memberof SpreadDb
   * @param {string} id - Google Drive上のファイルID
   * @param {Object} opt
   * @param {string} opt.table - schemaDefでテーブル定義されている場合、そのテーブル名
   *   これが指定されていた場合、メンバ名はCSV上の項目名ではなく、colNameが使用される。
   *   尚後工程(ex.行/伝票/明細番号の付与)も考えられるため、本メソッドではRDB・シートへの追加は行わない
   * @param {string} opt.encode='utf-8' - エンコード指定。MS932(Shift-JIS)等
   * @param {number} opt.header=1 - ヘッダ行番号(≧1)
   * @param {number} opt.RowNumber=1 - 過年度CSVの一括読込等、CSV毎にRowNumberを指定する場合に使用
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {Object} {header,data}
   */
  function importGDCSV(id,opt={}) {
    const v = { whois: `${pv.whois}.importGDCSV`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前準備
      // -------------------------------------------------------------
      dev.step(1.1);  // オプションの既定値設定
      opt = Object.assign({
        table:　null,
        encode:　'utf-8',
        header:　1,
        RowNumber: 1,
      },opt);

      dev.step(1.2);  // テーブル構造定義が指定されていたらtableDefにセット
      v.table = opt.table && pv.schema.tableMap.hasOwnProperty(opt.table)
        ? pv.schema.tableMap[opt.table] : null;

      // -------------------------------------------------------------
      dev.step(2);  // CSVファイルの読み込み
      // -------------------------------------------------------------
      v.text = DriveApp.getFileById(id).getBlob().getDataAsString(opt.encode);
      v.csv = Utilities.parseCsv(v.text); // parseCsvは全て文字列項目(数値他への型変換は一切無し)
      // 先頭の不要行はカット
      if( opt.header>1 ) v.csv.splice(0,opt.header-1);

      // -------------------------------------------------------------
      dev.step(3);  // 行オブジェクト化
      // -------------------------------------------------------------
      dev.step(3.1);  // 空欄等、無効な項目名は外して項目名リスト(header)を作成
      v.rv = {header:v.csv[0].filter(x => x),data:[]};

      dev.step(3.2);  // テーブル構造定義が有る場合ヘッダ行を書き換え。該当項目無しの場合、項目名は空文字列
      if( v.table !== null ){
        v.rv = {header:v.table.header,data:[]};
        for( v.c=0 ; v.c<v.csv[0].length ; v.c++ ){
          v.csv[0][v.c] = v.table.colDef.hasOwnProperty(v.csv[0][v.c])
          ? v.table.colDef[v.csv[0][v.c]].name : '';
        }
      }

      dev.step(3.3);  // 行オブジェクト化、戻り値(v.rv.data)に格納
      v.rv.data = array2obj(v.csv,{
        RowNumber: 1,
        colMap: ( v.table === null ? null : v.table.colMap ),
      });
      if( v.rv.data instanceof Error ) throw v.rv.data;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** importJSON: JSONからテーブル・シートへデータを格納する
   * @memberof SpreadDb
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void}
   */
  function importJSON(arg=[]) {
    const v = { whois: `${pv.whois}.importJSON`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      /*
      dev.step(1);  // 汎用画面にインポート用画面を作成
      cf.gpScr.innerHTML = '';
      v.r = createElement([
        {tag:'h1',text:'インポート'},
        {tag:'input',attr:{type:'file'},event:{change:e=>ldb.import(e)}},
        {tag:'textarea',attr:{colDef:60,rows:15}},
      ],cf.gpScr);


    dev.step(1);  // オプションに既定値設定
      pv.opt = Object.assign(pv.opt,arg);

      dev.step(2);
      pv.idb = await openIndexedDB();

      for( v.tableName in cf.tableDef.mappingTable){
        dev.step(3);  // rdbからテーブル名をキーとして検索
        v.existingData = await getIndexedDB(v.tableName);

        if (v.existingData) {
          dev.step(4.1);  // 存在すればrowsをJSON.parseしてpv.rdbに格納
          pv.rdb.tableMap[v.tableName] = JSON.parse(v.existingData.rows);
        } else {
          dev.step(4.2);  // 存在しなければ新規登録
          await setIndexedDB(v.tableName, '[]');
          pv.rdb.exec(`create table \`${v.tableName}\``);
        }
      }
      */

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** loadSheet: シートからRDBへデータをロードする
   * @memberof SpreadDb
   * @param {string|string[]} arg=[] - ロード対象テーブル名
   * @returns {void} 戻り値のメンバ名はcolumnDef.colName(labelではないことに注意)
   */
  function loadSheet(arg) {
    const v = { whois: `${pv.whois}.loadSheet`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.list = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.list.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次ロード
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){

        dev.step(2.1);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.table = pv.schema.tableMap[v.list[v.i]];
        v.sheet = pv.spread.getSheetByName(v.table.name);
        v.raw = v.sheet.getDataRange().getDisplayValues();

        dev.step(2.2);  // ヘッダ行が先頭に来るよう、余分な行を削除
        if( v.table.top > 1 ) v.raw.splice(0,v.table.top-1);

        dev.step(2.3);  // シートが存在する場合、内容をv.rObjに読み込み
        v.rObj = array2obj(v.raw,{RowNumber:2,colMap:v.table.colMap});
        if( v.rObj instanceof Error ) throw v.rObj;

        dev.step(2.4);  // テーブルに追加
        v.sql = `drop table if exists \`${v.list[v.i]}\`;` // 全件削除
        + `create table \`${v.list[v.i]}\`;`
        + `insert into \`${v.list[v.i]}\` select * from ?`;
        v.r = execSQL(v.sql,[v.rObj]);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** saveRDB: RDBからシートへデータを保存する
   * @memberof SpreadDb
   * @param {string|string[]} arg=[] - 保存対象テーブル名
   * @returns {void}
   */
  function saveRDB(arg=[]) {
    const v = { whois: `${pv.whois}.saveRDB`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 対象テーブルリストを作成
      v.list = Array.isArray(arg) ? arg : ( typeof arg === 'string' ? [arg] : []);
      if( v.list.length === 0 ) throw new Error('テーブル指定が不適切です');

      dev.step(2);  // 対象テーブルを順次格納
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){

        dev.step(2.1);  // 項目定義をv.colDefに格納
        v.table = pv.schema.tableMap[v.list[v.i]];
        v.colnum = v.table.header.length;

        dev.step(2.2);  // シートを取得。メイン処理で作成済なので不存在は考慮不要
        v.sheet = pv.spread.getSheetByName(v.list[v.i]);

        dev.step(2.3);  // 現状クリア：行固定解除、ヘッダを残し全データ行・列削除
        v.sheet.setFrozenRows(0);
        v.maxRows = v.sheet.getMaxRows();
        v.maxCols = v.sheet.getMaxColumns();
        if( v.maxRows > 1)
          v.sheet.deleteRows(2,v.maxRows-1);
        if( v.maxCols > v.colnum )
          v.sheet.deleteColumns(v.colnum+1, v.maxCols-v.colnum);

        dev.step(2.4);  // 対象テーブル全件取得
        v.r = execSQL(`select * from \`${v.list[v.i]}\` order by \`RowNumber\`;`);
        if( v.r instanceof Error ) throw v.r;
        if( v.r.length === 0 ) continue;  // レコード数0なら保存対象外

        dev.step(2.5);  // 行オブジェクト -> 二次元配列への変換
        v.arr = [];
        v.r.forEach(o => {
          for( v.j=0,v.l=[] ; v.j<v.colnum ; v.j++ ){
            v.l[v.j] = o[v.table.colDef[v.j].name] || '';
          }
          v.arr.push(v.l);
        });

        // シートに出力
        v.sheet.getRange(2,1,v.arr.length,v.colnum).setValues(v.arr);

        // シートの整形：1行目のみ固定化
        v.sheet.setFrozenRows(1);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** upsert: 指定されたテーブルに対して、既存のレコードがあれば更新し、なければ挿入する
   * @memberof SpreadDb
   * @param {string} tableName - 操作対象テーブル名
   * @param {Object[]} upsertRows - 挿入データの行オブジェクトの配列
   *   シートイメージを処理したい場合、事前にarray2objでオブジェクト化しておく。
   * @returns {Object} {update:[],insert:[],error:[]}
   */
  function upsert(tableName,upsertRows=[]) {
    const v = { whois: `${pv.whois}.upsert`, rv: {update:[],insert:[],error:[]}};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前準備
      // -------------------------------------------------------------
      dev.step(1.1);  // テーブル情報の存否確認
      if( pv.schema.tableMap.hasOwnProperty(tableName) ){
        v.table = pv.schema.tableMap[tableName];
      } else {
        throw new Error(`「${tableName}」は存在しません`);
      }

      dev.step(1.2);  // 挿入データが無ければ終了
      if( upsertRows.length === 0 ){
        dev.end(); // 終了処理
        return v.rv;
      }

      dev.step(1.3);  // 挿入先テーブルのRowNumberの開始値を求める
      v.r = execSQL(`select max(RowNumber) as a from \`${tableName}\`;`);
      if( v.r instanceof Error ) throw v.r;
      v.startingRowNumber = v.r[0].a ? (v.r[0].a + 1) : v.table.startingRowNumber;

      // -------------------------------------------------------------
      dev.step(2);  // データをupdate対象とinsert対象に振り分け
      // -------------------------------------------------------------
      if( v.table.primaryKey.length === 0 ){
        dev.step(2.1);  // 主キー不存在 ⇒ 全件insert
        v.updateRows = [];
        v.insertRows = upsertRows;
      } else {
        // 主キーが存在 ⇒ upsertRowsの主キーが挿入先テーブルに存在するかで振り分け

        dev.step(2.2);  // 挿入対象とデータ用テーブルを連結(SQLのON句)
        v.pColsOn = v.table.primaryKey
          .map(x => `\`upsertRows\`.\`${x}\`=\`${tableName}\`.\`${x}\``)
          .join(' and ');

        dev.step(2.3);  // upsertRows.primaryKeyが未定義ならinsert
        v.pColsWhere = v.table.primaryKey
          .map(x => `\`${tableName}\`.\`${x}\` is null`)
          .join(' and ');
        v.sql = `select * from ? as \`upsertRows\``
        + ` inner join \`${tableName}\` on ${v.pColsOn}`
        + ` where ${v.pColsWhere};`;
        v.r = execSQL(v.sql,[upsertRows]);
        if( v.r instanceof Error ) throw v.r;
        v.insertRows = v.r;

        dev.step(2.4);  // upsertRows.primaryKeyが定義済ならupdate
        v.pColsWhere = v.table.primaryKey
          .map(x => `\`${tableName}\`.\`${x}\` is not null`)
          .join(' or ');
        v.sql = `select * from ? as \`upsertRows\``
        + ` inner join \`${tableName}\` on ${v.pColsOn}`
        + ` where ${v.pColsWhere};`;
        v.r = execSQL(v.sql,[upsertRows]);
        if( v.r instanceof Error ) throw v.r;
        v.updateRows = v.r;
      }

      // -------------------------------------------------------------
      dev.step(3);  // update分の実行
      // -------------------------------------------------------------
      if( v.updateRows.length > 0 ){
        v.updateRows.forEach(row => {
          dev.step(3.1);  // set句(更新項目名=更新値)
          v.set = [];
          for( v.label in row )
            v.set.push(`\`${v.label}\`=${row[v.label]}`);

          dev.step(3.2);  // where句(pKey項目名=キー値)
          v.pKey = v.table.primaryKey.map(x => `\`${x}\`=${row[x]}`);

          dev.step(3.3);  // 一レコード分のSQLを作成、実行
          v.sql = `update \`${tableName}\` set ${v.set.join(',')} where ${v.pKey.join(' and ')};`;
          v.r = execSQL(v.sql);
          if( v.r instanceof Error ) throw v.r;

          dev.step(3.4);  // 結果を戻り値に保存
          v.rv[(v.r === 1 ? 'update' : 'error')].push(row);
        });
      }

      // -------------------------------------------------------------
      dev.step(4);  // insert分の実行
      // -------------------------------------------------------------
      if( v.insertRows.length > 0 ){
        v.insertRows.forEach(row => {
          dev.step(4.1);  // SQL文の作成と実行
          row.RowNumber = v.startingRowNumber++;
          v.sql = `insert into \`${tableName}\` ?`;
          v.r = execSQL(v.sql,[row]);
          if( v.r instanceof Error ) throw v.r;

          dev.step(4.2);  // 結果を戻り値に保存
          v.rv[(v.r === 1 ? 'insert' : 'error')].push(row);
        });
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  // SpreadDbメイン処理
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1);  // schema.tableMapを基にテーブル・シートを初期化
    pv.schema = Schema(schema);
    if( pv.schema instanceof Error ) throw pv.schema;

    for( pv.table of Object.values(pv.schema.tableMap) ){

      dev.step(1.1);  // RDBのテーブルを初期化
      // create tableの各項目用SQL文を作成
      pv.table.colDef.forEach(col => {
        // 項目名 データ型 主キーなら"not null"
        col.sql = `\`${col.name}\` ${col.type}${
          pv.table.primaryKey.includes(col.name) ? ' not null' : ''}`;
      })

      dev.step(1.2);  // テーブルの再作成
      pv.sql = `drop table if exists \`${pv.table.name}\`;`
      + `create table \`${pv.table.name}\` (${pv.table.colDef.map(x => x.sql).join(',')}${
        pv.table.primaryKey.length === 0 ? ''
        : `, primary key (${pv.table.primaryKey.map(x => '`'+x+'`').join(',')})`
      });`;
      pv.r = execSQL(pv.sql);
      if( pv.r instanceof Error ) throw pv.r;

      dev.step(1.3);  // 作成結果確認
      const { pk, columns }=pv.rdb.tables[pv.table.name];
      dev.dump({ pk, columns });

      dev.step(2);  // シートの作成
      pv.sheet = pv.spread.getSheetByName(pv.table.name);
      if( pv.sheet ){
        dev.step(2.1);  // シート作成済の場合、シートからRDBにロード
        pv.r = loadSheet(pv.table.name);
        if( pv.r instanceof Error ) throw pv.r;
      } else {
        dev.step(2.2);  // シート未作成の場合、シートを作成してヘッダ行を登録
        pv.sheet = pv.spread.insertSheet(pv.table.name);
        pv.range = pv.sheet.getRange(1, 1, 1, pv.table.header.length);
        pv.range.setValues([pv.table.header]);
        pv.noteArray = [];
        for( pv.i=0 ; pv.i<pv.table.header.length ; pv.i++ ){
          pv.noteArray.push(pv.table.colDef[pv.i].note);
        }
        pv.range.setNotes([pv.noteArray]);
        pv.sheet.autoResizeColumns(1, pv.table.header.length);  // 各列の幅を項目名の幅に調整
        pv.sheet.setFrozenRows(1); // 先頭1行を固定

        if( pv.table.data.length > 0 ){
          dev.step(2.3);  // 初期データが存在する場合、RDBに追加してシートに反映
          pv.sql = `insert into \`${pv.table.name}\` select * from ?;`;
          pv.r = execSQL(pv.sql,[pv.table.data]);
          if( pv.r instanceof Error ) throw pv.r;
          pv.r = saveRDB(pv.table.name);
          if( pv.r instanceof Error ) throw pv.r;
        }
      }
    }

    dev.step(3);  // AlaSQLカスタム関数の用意
    if( pv.schema.hasOwnProperty('custom') ){
      Object.keys(pv.schema.custom).forEach(x => alasql.fn[x] = pv.schema.custom[x]);
    }

    dev.end(); // 終了処理
    return {
      'exec': execSQL,
      'export': exportFile,
      'getSchema': ()=>pv.schema,
      'hasTable': hasTable,
      'import': importJSON,
      'importGDCSV': importGDCSV,
      'load': loadSheet,
      'save': saveRDB,
      'upsert': upsert,
    };

  } catch (e) { dev.error(e); return e; }
}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg=null - 変換元の日時。nullなら現在日時
 * @param {Object} opt - オプション。文字列型ならformat指定と看做す
 * @param {boolean} opt.verbose=false - falseなら開始・終了時のログ出力を抑止
 * @param {string} opt.format='yyyy-MM-ddThh:mm:ss.nnnZ' - 日時を指定する文字列
 *   年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @param {boolean} opt.undecimber=false - "yyyy/13"を期末日として変換するならtrue
 * @param {string} opt.fyEnd="3/31" - 期末日。opt.undecimber=trueなら必須。"\d+\/\d+"形式
 * @param {string} opt.errValue='empty' - 変換不能時の戻り値。※不測のエラーはErrorオブジェクト。
 *   empty:空文字列, error:Errorオブジェクト, null:null値, arg:引数argを無加工で返す
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * - arg無指定なら現在日時と看做す
 * - optが文字列ならformatと看做す
 * - 「yyyy/13」は期末日に置換
 * - 和暦なら西暦に変換
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
function toLocale(arg=null,opt={}) {
  const v = { whois: 'toLocale', rv: null,
    wareki:{  // 元号の開始年定義
      '明治':1867,'大正':1911,'昭和':1925,'平成':1988,'令和':2018,
      M:1867,T:1911,S:1925,H:1988,R:2018,
    },
    errValues:{ // 変換不能時の戻り値定義
      empty:'',
      error:new Error(`Couldn't convert "${arg}" to date.`),
      null: null,
      arg: arg,
    }
  };
  opt = Object.assign({
    verbose: false,
    format: 'yyyy-MM-ddThh:mm:ss.nnnZ',
    undecimber : false,
    fyEnd: '03/31',
    errValue: 'empty'
  },( typeof opt === 'string' ? {format:opt} : opt));
  dev.start(v.whois, [...arguments], {start:opt.verbose});
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 処理対象をDate型に変換
    // -------------------------------------------------------------
    if( arg === null ){
      dev.step(1.1);  // 無指定なら現在日時
      v.dObj = new Date();
    } else if( whichType(arg,'Date') ){
      dev.step(1.2);  // 日付型はそのまま採用
      v.dObj = arg;
    } else {
      dev.step(1.3);  // その他。和暦は修正(時分秒は割愛)した上でDate型に
      arg = String(arg).replace(/元/,'1');
      v.m = arg.match(/^([^\d]+)(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
      if( v.m ){
        dev.step(1.4);  // 和暦
        v.dObj = new Date(
          v.wareki[v.m[1]] + Number(v.m[2]),
          Number(v.m[3]) - 1,
          Number(v.m[4])
        );
      } else {
        dev.step(1.5);  // その他
        v.dObj = opt.undecimber // trueなら「yyyy/13」は期末日に置換
          ? new Date(arg.replace(/^(\d+)\/13$/,"$1/"+opt.fyEnd))
          : new Date(arg);
      }
      dev.step(1.6);  // 無効な日付ならエラー値を返して終了
      if( isNaN(v.dObj.getTime()) ) return v.errValues[opt.errValue];
    }

    // -------------------------------------------------------------
    dev.step(2);  // 戻り値(文字列)の作成
    // -------------------------------------------------------------
    v.rv = opt.format;  // 戻り値の書式(テンプレート)
    v.local = { // 地方時ベース
      y: v.dObj.getFullYear(),
      M: v.dObj.getMonth()+1,
      d: v.dObj.getDate(),
      h: v.dObj.getHours(),
      m: v.dObj.getMinutes(),
      s: v.dObj.getSeconds(),
      n: v.dObj.getMilliseconds(),
      Z: Math.abs(v.dObj.getTimezoneOffset())
    }
    dev.step(2.1);  // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    dev.step(2.2);// 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    dev.end({start:opt.verbose}); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
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

const dev = devTools();
function authServer(arg) {

/**
   * @typedef {Object} authConfig - authClient/authServer共通で使用される設定値。,authClientConfig, authServerConfigの親クラス
   * @prop {string} [systemName="auth"] - システム名
   * @prop {string} adminMail - 管理者のメールアドレス
   * @prop {string} adminName - 管理者氏名
   * @prop {string} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差。既定値は2分
   * @prop {string} [RSAbits=2048] - 鍵ペアの鍵長
   */
  class authConfig {
    constructor(arg){
      this.systemName = arg.systemName || 'auth';
      this.adminMail = arg.adminMail;
      this.adminName = arg.adminName;
      this.allowableTimeDifference = arg.allowableTimeDifference || 120000;
      this.RSAbits = arg.RSAbits || 2048;
    }
  }
  
  /**
   * @typedef {Object} authServerConfig - authConfigを継承した、authServerでのみ使用する設定値
   * @prop {string} [memberList="memberList"] - memberListシート名
   * @prop {number} [defaultAuthority=1] - 新規加入メンバの権限の既定値
   * @prop {number} [memberLifeTime=31536000000] - 加入有効期間(=メンバ加入承認後の有効期間)。既定値は1年
   * @prop {number} [prohibitedToJoin=259200000] - 加入禁止期間(=管理者による加入否認後、再加入申請が自動的に却下される期間)。既定値は3日
   * @prop {number} [loginLifeTime=86400000] - 認証有効時間(=ログイン成功後の有効期間、CPkeyの有効期間)。既定値は1日
   * @prop {number} [loginFreeze=600000] - 認証凍結時間(=認証失敗後、再認証要求が禁止される期間)。既定値は10分
   * @prop {number} [requestIdRetention=300000] - 重複リクエスト拒否となる時間。既定値は5分
   * @prop {string} [errorLog="errorLog"] - エラーログのシート名
   * @prop {number} [storageDaysOfErrorLog=604800000] - 監査ログの保存日数。単位はミリ秒。既定値は7日分
   * @prop {string} [auditLog="auditLog"] - 監査ログのシート名
   * @prop {number} [storageDaysOfAuditLog=604800000] - 監査ログの保存日数。単位はミリ秒。既定値は7日分
   * @prop {Object.<string,Object>} func - サーバ側の関数マップ<br>例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}}
   * @prop {number} [func.authority=0] - サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限,`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。
   * @prop {Function} func.do - 実行するサーバ側関数
   * @prop {Object} trial - ログイン試行関係の設定値
   * @prop {number} [trial.passcodeLength=6] - パスコードの桁数
   * @prop {number} [trial.maxTrial=3] - パスコード入力の最大試行回数
   * @prop {number} [trial.passcodeLifeTime=600000] - パスコードの有効期間。既定値は10分
   * @prop {number} [trial.generationMax=5] - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
   * @prop {boolean} [underDev.sendPasscode="false"] - 開発中、パスコード通知メール送信を抑止するならtrue
   * @prop {boolean} [underDev.sendInvitation="false"] - 開発中、加入承認通知メール送信を抑止するならtrue
   */
  class authServerConfig extends authConfig {
    constructor(arg){
      super(arg);
  
      this.memberList = arg.memberList || "memberList";
      this.defaultAuthority = arg.defaultAuthority || 0;
      this.memberLifeTime = arg.memberLifeTime || 31536000000;
      this.prohibitedToJoin = arg.prohibitedToJoin || 259200000;
      this.loginLifeTime = arg.loginLifeTime || 86400000;
      this.loginFreeze = arg.loginFreeze || 600000;
      this.requestIdRetention = arg.requestIdRetention || 300000;
      this.func = arg.func.authority || {};
      arg.trial = arg.trial || {};
      this.trial = {
        passcodeLength: arg.trial.passcodeLength || 6,
        maxTrial: arg.trial.maxTrial || 3,
        passcodeLifeTime: arg.trial.passcodeLifeTime || 600000,
        generationMax: arg.trial.generationMax || 5,
      };
    }
  }

  const pv = Object.assign(new authServerConfig,{whois:'authServer', rv:null});

  dev.start(pv.whois);
  try {  // メイン処理

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    dev.dump(pv);

    dev.end(); // 終了処理
    //return pv.rv;

  } catch (e) { dev.error(e); }
}
