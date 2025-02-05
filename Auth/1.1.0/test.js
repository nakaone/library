/*
  authClient/Server 統合テスト
    GASの専用シートを用意、本ソースをコピペしてauthTest()を実行
*/
const dev = devTools();
const authTest = () => doTest('dev',0,1); // 引数はscenario, start, num
function doTest(sce='dev',start=0,num=1) { // sce='all'->全パターン、num=0->start以降全部、num<0->start無視して後ろから
  const v = { whois: 'doTest', rv: null, sdb: SpreadDb(), counter: 0};
  const sample = { // テスト用サンプルデータ
    '掲示板': {
      set: [
        ['timestamp', 'from', 'to', 'message'],
        ['2022-10-27T06:23:43.168Z', 'パパ', '本部', 'ご本部様\nご機嫌麗しく...'],
        ['2022-10-27T07:24:24.216Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-10-27T07:34:46.564Z', 'パパ', 'スタッフ全員', 'ぼけ'],
        ['2022-10-27T07:57:16.144Z', '(未定義)', 'スタッフ全員', 'ほれほれ'],
        ['2022-10-27T08:05:03.631Z', 'パパ', '金魚すくい担当', 'by みゆきさま'],
        ['2022-10-27T08:49:32.196Z', '屋上テラス', '射的担当', '今日も都庁がよく見える。\n特に意味はない。\nホントだよ'],
        ['2022-10-27T10:09:54.791Z', '右に空白', 'スタッフ全員', 'textareaの幅がおかしい\n'],
        ['2022-10-27T16:02:50.217Z', 'ぱぱ', '校内探検担当', '目が覚めた…\nもっかい寝よ'],
        ['2022-10-28T03:03:10.982Z', 'まま', 'カレー担当', '玉ねぎは薄切り希望'],
        ['2022-10-28T08:35:49.937Z', '嶋津', 'スタッフ全員', 'さて、名前が保存されてるかな？'],
        ['2022-10-28T08:36:15.515Z', '嶋津', 'スタッフ全員', 'されてた❤'],
        ['2022-11-01T06:15:23.668Z', '嶋津ぱぱ', '受付担当', 'トイレ行きたい\n誰か来て'],
        ['2022-11-09T04:48:51.137Z', 'ぱぱ', '校内探検担当', '下校中の小学生、\n元気だなぁ'],
        ['2022-12-06T07:11:41.330Z', 'しまづパパ', 'スタッフ全員', 'てすと'],
        ['2022-12-23T07:21:21.888Z', '嶋津ぱぱ', '校内探検担当', 'わるいごは　いねが〜\nカチャトーラには ビネガ〜'],
        ['2023-01-20T08:41:22.368Z', 'shimazu', 'スタッフ全員', 'Hello, world.'],
        ['2023-01-25T23:46:08.402Z', '半弗　値絵夢', 'スタッフ全員', 'たちつてと'],
        ['2023-01-30T06:13:30.312Z', '水戸黄門', 'スタッフ全員', '控えおろうっ！'],
        ['2023-01-31T05:42:42.836Z', '手簾戸', 'スタッフ全員', '投稿140'],
      ],
    },
  };
  const scenario = {
    dev: [{ // dev.01: 掲示板から全件取得。ローカルDB用のデータは取得するが、生成は無い
      setup: {'掲示板':'ifnot'},
      query: 'くえり',
      opt: {},
      check: [],
    }],
  }
  function setupSheet(arg,src=sample) {  // setupSheet: テストに必要なシートを準備
    /**
     * @param {Object.<string, string>} arg - {シート名：措置}形式のオブジェクト
     * @param {Object} src=sample - シート定義情報をまとめたオブジェクト
     * なお「シート名='default'」は、メンバ名が存在しないシートに対して行う措置。
     * またreadmeシートは必ず残す。
     *
     * 【措置の種類】
     * - force : 強制的に再作成
     * - ifnot : 不在なら作成、存在なら再作成しない(不在時作成。if not exist)
     * - delete: 強制削除(defaultの既定値)。存在していれば削除、再作成はしない
     * - asis  : そのまま何もしない
     */
    const v = { whois: 'setupSheet', rv: null, spread: SpreadsheetApp.getActiveSpreadsheet()};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 指定が有るシートのリストアップ
      v.specified = Object.keys(arg);
      v.i = v.specified.findIndex(x => x === 'default');
      if (v.i >= 0) v.specified.splice(v.i, 1);

      dev.step(2); // 既定値の設定
      v.arg = Object.assign({'default':'delete'},arg);

      dev.step(3); // 存在する全シートのリストアップ
      v.list = v.spread.getSheets().map(x => x.getName());

      dev.step(4); // readmeは削除対象から外す
      v.i = v.list.findIndex(x => x === 'readme');
      if (v.i >= 0) v.list.splice(v.i, 1);
      dev.dump([v.specified,v.arg,v.list],74)

      for( v.i=0 ; v.i<v.list.length ; v.i++ ){
        // シートに対する措置を特定
        v.command = v.specified.includes(v.list[v.i]) ? v.arg[v.list[v.i]] : v.arg.default;
        dev.dump([v.list[v.i],v.command],79)

        // 強制的に再作成(force)、または強制削除(delete)ならシートを削除
        if( v.command === 'force' || v.command === 'delete' ){
          v.spread.deleteSheet(v.spread.getSheetByName(v.list[v.i]));
        }
      }

      for( v.i=0 ; v.i<v.specified.length ; v.i++ ){
        // シートに対する措置を特定
        v.command = v.arg[v.specified[v.i]];

        // 強制的に再作成(force)、またはシート不存在で不在時作成(ifnot)ならシートを作成
        if( v.command === 'force' || (v.list.includes(v.specified[v.i]) === false && v.command === 'ifnot' )){
          v.r = SpreadDb({  // 対象シート作成
            command: 'create',
            table: v.specified[v.i],
            cols: (src[v.specified[v.i]].cols || null),
            set: (src[v.specified[v.i]].set || null),
          }, { userId: 'Administrator' });
          if (v.r instanceof Error) return v.r;
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  // doTest主処理
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1);  // v.scenarioListに対象シナリオ群を格納
    if (sce === 'all') {
      v.scenarioList = Object.keys(scenario);
      start = 0;
      num = 0;
      dev.changeOption({ start: false, step: false });
    } else {
      v.scenarioList = Array.isArray(sce) ? sce : [sce];
    }

    for (v.sno = 0; v.sno < v.scenarioList.length; v.sno++) {

      dev.step(2); // v.st, v.edを計算
      if (num < 0) {
        dev.step(2.1); // 指定テストパターン群の後ろからnum個
        v.st = scenario[v.scenarioList[v.sno]].length - num;
        v.ed = scenario[v.scenarioList[v.sno]].length;
      } else if (num === 0) {
        dev.step(2.2); // 指定テストパターン群全部実行
        v.st = start;
        v.ed = scenario[v.scenarioList[v.sno]].length;
      } else {
        dev.step(2.3); // startからnum個
        v.st = start;
        v.ed = start + num;
      }

      dev.step(3);
      for (v.idx = v.st; v.idx < v.ed; v.idx++) {
        v.scenario = scenario[v.scenarioList[v.sno]][v.idx];

        dev.step(3.1); // シートの準備。テスト開始時はlogシートを削除、それ以外は追記にする
        v.r = setupSheet(Object.assign(v.scenario.setup,{'log':(v.counter === 0 ? 'delete' : 'asis')}));
        if (v.r instanceof Error) throw v.r;

        dev.step(3.2); // scenarioからqueryとoptをセットしてテスト実施、NG時は中断
        if (false === dev.check({
          asis: SpreadDb(v.scenario.query,v.scenario.opt),
          tobe: (v.scenario.check || undefined),
          title: `${v.whois}.${v.scenarioList[v.sno]}.${v.idx}`,
        })) throw new Error(`check NG`);
      }
    }


    //v.rv = authClient('q','o');

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

function authClient(query,option={}) {
  const cv = { whois: 'authClient' };
  const v = { rv: null};
  dev.start(cv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(query,option);
    cv.query = {table:'accounts',command:'append'};
    v.rv = authPost(cv.query);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(arg) {
    const v = { whois: `${cv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      v.rv = {query:query,option:option};

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}

function authServer(query,option={}) {
  const sv = { whois: 'authServer' };
  const v = { rv: null };
  dev.start(sv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(query,option);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(arg) {
    const v = { whois: `${sv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      v.rv = {query:query,option:option};

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}

function authPost(arg) {
  const v = { whois: 'authPost', rv: null};
  // whois: `${pv.whois}.prototype`, rv: null};
  // whois: this.constructor.name+'.prototype', rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    v.rv = authServer(arg);

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