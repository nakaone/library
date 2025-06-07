/** HTMLElementを生成する
 * @param {CEDefObj|CEDefObj[]} arg - 生成するHTMLElementの定義
 * @param {HTMLElement|string} [parent=null] - 本関数内部で親要素への追加まで行う場合に指定
 * @returns {HTMLElement|Error}
 */
function createElement(arg,parent=null){
  const v = {whois:'BasePage.createElement',rv:[],step:0};
  //console.log(v.whois+' start.',arg);
  try {
    v.step = 1.1; // 引数を強制的に配列化
    v.isArr = Array.isArray(arg); // 引数が配列ならtrue。戻り値にも使用するので保存
    if( !v.isArr ) arg = [arg];
    v.step = 1.2; // 親要素の特定
    if( parent !== null ){
      v.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
    }


    for( v.i = 0 ; v.i<arg.length ; v.i++ ){
      v.step = 2; // 既定値の設定
      v.def = {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[],name:''};
      Object.assign(v.def,(typeof arg[v.i] === 'string' ? {tag:arg} : arg[v.i]))

      v.step = 3; // HTMLElementを生成、v.objとする
      v.obj = document.createElement(v.def.tag);

      v.step = 4; // HTMLElementの属性を定義
      for( v.j in v.def.attr ){
        v.obj.setAttribute(v.j,v.x = v.def.attr[v.j]);
      }

      v.step = 5; // 論理属性を定義(ex.checked)
      for( v.j in v.def.logical ){
        if( v.def.logical[v.j] ){
          v.obj.setAttribute(v.j,v.def.logical[v.j]);
        }
      }

      v.step = 6; // style属性の定義
      for( v.j in v.def.style ){
        if( v.j.match(/^\-\-/) ){ // CSS変数
          v.obj.style.setProperty(v.j,v.def.style[v.j]);
        } else {
          v.obj.style[v.j] = v.def.style[v.j];
        }
      }

      v.step = 7; // イベントの定義
      for( v.j in v.def.event ){
        v.obj.addEventListener(v.j,v.def.event[v.j],false);
      }

      v.step = 8; // 内部文字列(html or text)
      if( v.def.html.length > 0 ){
        v.obj.innerHTML = v.def.html;
      } else {
        // textareaの場合はvalueに、それ以外はinnerTextに内部文字列(text)をセット
        v.obj[v.def.tag.toLowerCase()==='textarea'?'value':'innerText'] = v.def.text;
      }

      v.step = 9; // 子要素の追加(parentは指定しない)
      for( v.j=0 ; v.j<v.def.children.length ; v.j++ ){
        v.obj.appendChild(this.createElement(v.def.children[v.j]));
      }

      v.step = 10; // 戻り値への登録
      v.rv.push(v.obj);

      v.step = 11; // 親要素への追加
      if( parent !== null ){
        v.parent.appendChild(v.obj);
      }

      v.step = 12; // メンバとして、また切替画面として登録
      if( v.def.name.length > 0 ){
        this[v.def.name] = v.obj;
        this.screenList[v.def.name] = v.obj;
      }
    }

    v.step = 12; // 配列で渡されたら配列で、オブジェクトならオブジェクトを返す
    v.rv = v.isArr ? v.rv : v.rv[0];
    //console.log(v.whois+' normal end.\n',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
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