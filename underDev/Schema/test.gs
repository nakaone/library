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
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @param {string} opt.array - 配列の扱いを指定
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
 * - set: priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): 【既定値】priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1.1);  // 引数チェック
    if( pri instanceof Error ) throw pri;
    if( sub instanceof Error ) throw sub;

    dev.step(1.2);  // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'str';

    if( v.isObj(pri) && v.isObj(sub) ){
      dev.step(2); // sub,pri共にハッシュの場合
      v.rv = {};
      dev.step(2.1); // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          dev.step(2.2); // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            dev.step(2.21); // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            dev.step(2.22); // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          dev.step(2.3); // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      dev.step(3); // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          dev.step(3.1);  // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          dev.step(3.2);  // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          dev.step(3.3);
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
          dev.step(3.4);
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      dev.step(4); // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
    }

    dev.end(); // 終了処理
    return v.rv;

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

const config = {
  schema: {
    dbName: 'camp2025',
    tableDef: {
      master: {
        colDef:[
          {name:'タイムスタンプ',type:'string'},
          {name:'メールアドレス',type:'string'},
          {name:'申込者氏名',type:'string'},
          {name:'申込者カナ',type:'string'},
          {name:'申込者の参加',type:'string'},
          {name:'宿泊、テント',type:'string'},
          {name:'引取者氏名',type:'string'},
          {name:'参加者01氏名',type:'string'},
          {name:'参加者01カナ',type:'string'},
          {name:'参加者01所属',type:'string'},
          {name:'参加者02氏名',type:'string'},
          {name:'参加者02カナ',type:'string'},
          {name:'参加者02所属',type:'string'},
          {name:'参加者03氏名',type:'string'},
          {name:'参加者03カナ',type:'string'},
          {name:'参加者03所属',type:'string'},
          {name:'参加者04氏名',type:'string'},
          {name:'参加者04カナ',type:'string'},
          {name:'参加者04所属',type:'string'},
          {name:'参加者05氏名',type:'string'},
          {name:'参加者05カナ',type:'string'},
          {name:'参加者05所属',type:'string'},
          {name:'緊急連絡先',type:'string'},
          {name:'ボランティア募集',type:'string'},
          {name:'備考',type:'string'},
          {name:'キャンセル',type:'string'},
        ],
      },
    },
    tableMap: {master:{def:'master'}},
    custom: {},
  },
};

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
 * @property {string|string[]} [unique] - 主キー以外で値の重複が無い項目名。複数の場合は配列で指定
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

/** Schema: シート・RDB・IndexedDB・CSV/TSVで扱うデータベース構造定義のユーティリティ集
 * - schema変更時には変更点のみexpandに渡す運用を想定(都度全体を渡さない)、クロージャ関数とする
 * @param {schemaDef} schema - DB構造定義オブジェクト(引数用)
 * @returns {schemaDefEx} DB構造定義オブジェクト(戻り値用)
 */
function Schema(schema) {
  const pv = { whois: 'Schema', schema: {},
    schemaDef:  // schemaDefEx形式の既定値。但しoriginal,created,expandはメソッド内で追加
      '{"dbName":"","note":"","tableDef":{},"tableMap":{},"custom":{}}',
    tableDef: // tableDefEx形式の既定値
      '{"def":"","data":[],"note":"","primaryKey":[],"unique":[],"colDef":[],'
      + '"top":1,"left":1,"startingRowNumber":2,"name":"","header":[],"colMap":{}}',
    columnDef:  // columnDefEx形式の既定値
      '{"name":"","seq":0,"note":"","label":"","type":"string","alias":[],"default":null,"printf":null}',
  };

  /**
   * - pv.schemaを変更前、引数schemaを修正点、v.schemaを作業用とし、最後にpv.schema=v.schemaとする
   * @param {schemaDef} schema
   * @returns {schemaDefEx}
   */
  function expand(schema) {
    const v = { whois: `${pv.whois}.expand`, rv: null, schema:{}};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // schema全体の処理
      // -------------------------------------------------------------

      dev.step(1.1);  // 「引数 > pv.schema > 既定値」の優先順位で値を設定
      v.schema = mergeDeeply(schema,mergeDeeply(pv.schema,JSON.parse(pv.schemaDef)));
      if( v.schema instanceof Error ) throw v.schema;

      dev.step(1.2);  // 過去のoriginalが存在していればマージして再設定
      v.schema.original = JSON.stringify(typeof pv.schema.original !== 'undefined'
      ? mergeDeeply(JSON.parse(pv.schema.original),schema) : schema);

      dev.step(1.3);  // 引数にもpv.schemaにも依存しない項目の設定
      v.schema.created = toLocale(new Date());
      v.schema.expand = expand;

      dev.step(1.4);  // customを関数化
      // 既に関数化されていた場合(再作成の場合)、何もしない
      for( v.fn in v.schema.custom ){
        if( typeof v.schema.custom[v.fn] !== 'function' )
          v.schema.custom[v.fn] = new Function('return '+v.schema.custom[v.fn])();
      }

      // -------------------------------------------------------------
      dev.step(2); // table毎の処理
      // -------------------------------------------------------------
      for( [v.name,v.table] of Object.entries(v.schema.tableMap) ){

        dev.step(2.1);  // テーブル構造定義名・テーブル名が省略されていた場合は設定
        if( !v.table.def ) v.table.def = v.name;
        if( !v.table.name ) v.table.name = v.name;

        dev.step(2.2);  // 「引数 > pv.schema > 既定値」の優先順位で値を設定
        v.table = mergeDeeply(v.table,mergeDeeply(v.schema.tableDef[v.table.def],JSON.parse(pv.tableDef)));

        dev.step(2.3);  // 初期データの行オブジェクト化
        if( typeof v.table.data === 'string' && v.table.data !== '' ){
          // CSV/TSVを行オブジェクトに変換
          v.table.data = parseCSVorTSV(v.table.data);
          // データ型に従って値変換
          v.table.data.forEach(x => {
            for( v.i=0 ; v.i<v.table.colDef.length ; v.i++ ){
              switch( v.table.colDef[v.i].type ){
                case 'number':
                  x[v.table.colDef[v.i].name] = Number(x[v.table.colDef[v.i].name]);
                  break;
                case 'boolean':
                  x[v.table.colDef[v.i].name] = x[v.table.colDef[v.i].name] === '' ? ''
                  : (String(x[v.table.colDef[v.i].name]).toLowerCase() === 'true' ? true : false);
                  break;
                default:
                  break;
              }
            }
          });
          // RowNumber不在ならRowNumberを追加
          if( v.table.startingRowNumber > 0 && typeof v.table.data[0].RowNumber === 'undefined' ){
            for( v.i=0 ; v.i<v.table.data.length ; v.i++ ){
              v.table.data[v.i].RowNumber = v.i + v.table.startingRowNumber;
            }
          }
        }

        dev.step(2.4);  // primaryKeyが文字列なら配列化
        if( typeof v.table.primaryKey === 'string' ) v.table.primaryKey = [v.table.primaryKey];
        if( typeof v.table.unique === 'string' ) v.table.unique = [v.table.unique];

        // -------------------------------------------------------------
        dev.step(3); // column毎の処理
        // -------------------------------------------------------------
        for( v.c=0 ; v.c<v.table.colDef.length ; v.c++ ){

          dev.step(3.1);  // 未定義項目に既定値設定
          v.colObj = Object.assign({},JSON.parse(pv.columnDef),v.table.colDef[v.c]);

          dev.step(3.2);  // default,printfを関数化
          ['default','printf'].forEach(x => {
            if( v.colObj[x] !== null && typeof v.colObj[x] !== 'function' )
              v.colObj[x] = new Function('return '+v.colObj[x])();
          });

          dev.step(3.3);  // seq,labelの設定、tableMap.headerへの登録
          v.colObj.seq = v.c;
          if( !v.colObj.label ) v.colObj.label = v.colObj.name;
          v.table.header.push(v.colObj.label);

          dev.step(3.4);  // 項目マップに登録
          // キーは①項目名(name)、②ラベル(label)、③別名(alias)、④出現順(数字)
          v.keys = Array.from(new Set([
            v.colObj.name,
            v.colObj.label,
            ...v.colObj.alias,
            v.c
          ]));
          v.keys.forEach(x => v.table.colMap[x] = v.colObj);

        }

        dev.step(2.4);  // table毎の処理：作成したtableをschemaに登録して終了
        v.schema.tableMap[v.name] = v.table;
      }

      dev.end(); // 終了処理
      pv.schema = v.schema;
      return pv.schema;

    } catch (e) { dev.error(e); return e; }
  }

  /**
   * CSV/TSV 文字列をオブジェクトの配列に変換する
   * - 区切り文字を自動判定（カンマ or タブ）
   * - ダブルクォートあり/なし両対応
   * - RFC4180 準拠（"" は "）
   *
   * @param {string} text - CSV/TSV 文字列
   * @param {object} [options]
   * @param {boolean} [options.headers=true] 1行目をヘッダ行として使うか
   * @param {boolean} [options.trim=true] フィールドの前後空白を削除するか
   * @returns {Object[] | string[][]}
   */
  function parseCSVorTSV(text, options = {}) {
    const { headers = true, trim = true } = options;

    if (typeof text !== "string") throw new TypeError("text must be a string");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 除去

    // --- 区切り文字を自動判定 ---
    const firstLine = text.split(/\r?\n/)[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const delimiter = tabCount > commaCount ? "\t" : ",";

    const rows = [];
    let cur = "";
    let row = [];
    let inQuotes = false;
    let i = 0;

    while (i < text.length) {
      const ch = text[i];

      if (ch === '"') {
        if (!inQuotes) {
          inQuotes = true;
          i++;
          continue;
        } else {
          if (i + 1 < text.length && text[i + 1] === '"') {
            cur += '"'; // エスケープされた "
            i += 2;
            continue;
          } else {
            inQuotes = false;
            i++;
            continue;
          }
        }
      }

      if (!inQuotes && ch === delimiter) {
        row.push(trim ? cur.trim() : cur);
        cur = "";
        i++;
        continue;
      }

      if (!inQuotes && (ch === "\n" || ch === "\r")) {
        row.push(trim ? cur.trim() : cur);
        rows.push(row);
        row = [];
        cur = "";

        if (ch === "\r" && text[i + 1] === "\n") i++;
        i++;
        continue;
      }

      cur += ch;
      i++;
    }

    row.push(trim ? cur.trim() : cur);
    rows.push(row);

    if (!headers) return rows;

    const headerRow = rows.shift() || [];
    return rows.map(r => {
      const obj = {};
      for (let j = 0; j < headerRow.length; j++) {
        const key = headerRow[j] || `col${j}`;
        obj[key] = r[j] !== undefined ? r[j] : "";
      }
      return obj;
    });
  }

  // -------------------------------------------------------------
  // メイン処理
  // -------------------------------------------------------------
  dev.start(pv.whois, [...arguments]);
  try {

    dev.step(1);
    pv.rv = expand(schema);
    if( pv.rv instanceof Error ) throw pv.rv;

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}

const dev = devTools();
const test = () => {
  const r = Schema(config.schema);
  console.log(JSON.stringify(r,null,2));
}
