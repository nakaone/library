/*+ szConf定義
szConfは以下の3種類を包含したもの。
1. szLib(本ソース)で使用する項目(whois,log,environment)
2. (szLibの使用を前提とする)GASLibで使用する項目(現状なし)
3. (szLib/GASLibの使用を前提とする)アプリケーションで使用する項目
    (public, role, Auth, etc.)

1についてはszLibのソース内で定義。
2,3についてはGASLib「config」シートで定義する。
+*/

let szConf = {  // 以降の処理を行うため、最低限のパラメータを設定
  whois: 'szLib',
  log: {
    range: 9, // 出力ログの範囲指定(適宜変更可)
      // 出力する種類(後掲log.type)の値を合計したもの。
      // ex. 必須＋開始＋終了＋異常 ⇒ 1+2+4+8 = 15
    variable: false,  // 開始or正常終了時にarg/rvを表示するならtrue
    // 以下、ログの種類を定義する定数。変更不可
    must: 1,      // 必須出力ログ
    start: 2,     // 開始ログ
    normal: 4,    // 正常終了
    abnormal: 8,  // 異常終了
    detail: 16,   // 詳細
    debug: 32     // デバッグ用
  },
  environment : (()=>{  // 実行環境(browser/node/GAS)
    return typeof window !== 'undefined'
    ? 'browser': ( // windowオブジェクトが存在すればブラウザ
      typeof process === 'undefined'
      ? 'GAS'   // processオブジェクトが存在しなければGAS
      : 'node'  // processオブジェクトが存在すればNode(バッチ)
    )
  })(),

};
if( szConf.environment === 'node' )  exports.szConf = szConf;

function getSzConf(arg){
  return {...szConf,...arg};
}
if( szConf.environment === 'node' )  exports.getSzConf = getSzConf;

/** szLog: コンソールにログを適宜加工して出力
 * <ul>
 * <li>内部関数を使用する場合、最初にv.whoisの値を内部関数名に変更、最後に戻す<br>
 * 異常終了ログのエラーが起きた関数(自関数)かの判断は
 * 「e.stackに現れる最初のatの関数名がv.whoisに含まれるか」で行なっているが、
 * 最初のatの関数名は内部関数名となるため、v.whoisの値も内部関数名としておく必要があるため。
 * </ul>
 * @param {(string|any[])} arg - 関数名とログの種類。種類の既定値は必須or開始or終了ログ(7)<br>
 * 文字列の場合は関数名とみなし種類は既定値を適用する。<br>
 * 配列の場合、第一引数を関数名、第二引数をログの種類と見做す。
 * @param {any} obj - console.logに出力する内容。複数可<br>
 * エラーの場合、argの直後(objの最初)にエラーオブジェクトを渡す(ex.`szLog('analyzePath',e,v);`)
 * @returns {void} なし
 */
function szLog(arg,...obj){
  let v = {whois:szConf.whois+'.szLog'};
  try {
    // 1.引数を処理して関数名とログの種類をセット
    v.step = '1';
    if( typeof arg === 'string' ){
      v = {whois:arg,type:7}; // 7:必須or開始or終了ログ
    } else {
      v = {whois:arg[0],type:(arg[1] || 7)};
    }

    // 2.範囲外のログは出力せずに終了
    v.step = '2';
    if( (v.type & szConf.log.range) === 0 ) return;

    // 3.日時文字列＋関数名の作成
    //   szLogはgetJPDateTimeからも呼ばれるので、自前で作成
    v.tObj = new Date();
    v.msg = (v.tObj.toLocaleString('ja-JP')
    + '.' + ('00'+v.tObj.getMilliseconds()).slice(-3))
    .replace(/(\D)(\d)(\D)/g,'$10$2$3').replace(/(\D)(\d)(\D)/g,'$10$2$3')
    + ' ' + v.whois;

    // 4.ログの種類によって処理分岐
    switch(v.type){
      case szConf.log.start: // a.開始ログ。obj = arg
        v.step = '4a';
        if( szConf.log.variable ){
          console.log(v.msg+' start.\narg=',(obj || '(no objument)'));
        } else {
          console.log(v.msg+' start.');
        }
        break;
      case szConf.log.normal: // b.正常終了ログ。obj = rv
        v.step = '4b';
        if( szConf.log.variable ){
          console.log(v.msg+' normal end.\nrv=',(obj || '(void)'));
        } else {
          console.log(v.msg+' normal end.');
        }
        break;
      case szConf.log.abnormal: // c.異常終了ログ。obj = e
        v.step = '4c';
        v.msg += ' abnormal end.';
        // 自関数でのエラーはエラーオブジェクトも表示して詳細に、
        // 呼出先関数でのエラーはその時の変数の状態のみ表示するよう
        // エラー箇所を特定して処理を分岐させる
        const e = obj[0];  // 残余引数の最初がエラーオブジェクト
        // s: e.stackからエラーを起こした関数名を引用(最初のatの関数名)
        //const s = e.stack.match(/\s+at\s+(?:Object|Function)\.(\S+?)\s/);
        let s = e.stack.match(/\s+at\s+(\S+?)\s/)[1].split('.');
        s = s[s.length-1];
        // w: 最初のatの関数名がv.whoisに存在するかチェック
        const w = v.whois.match(new RegExp(s[1]));
        if( w !== null ){
          // 自関数内でのエラー：関数内変数＋エラーオブジェクト
          //console.error(v.msg+'\ne=',obj[0],'\nv=',obj[1]);
          console.error(v.msg+'\n'+obj[0].stack,'\nv=',obj[1]);
        } else {
          // 呼出先関数内でのエラー：呼出元関数内変数のみ表示
          console.error(v.msg+'\nv=',obj[1]);
        }
        break;
      default: // d.必須ログ、詳細ログ
        v.step = '3d';
        console.log(v.msg,...obj);
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n',e);
  }
}
if( szConf.environment === 'node' )  exports.szLog = szLog;
/*+====================
szLogのテストはszCatchのテストで代用
====================+*/

/** szCatch: catch節でのエラーオブジェクト処理
 * @param {object} e - エラーオブジェクト
 * @param {object} v - エラー時点の関数内変数オブジェクト
 * @returns {object} 独自メンバを付加したエラーオブジェクト
 * <ul>
 * <li> trace {string[]} - 発生先->呼出元の順に格納された関数名(whois)
 * <li> (関数名) {object} - 関数内変数オブジェクト
 * </ul>
 */
function szCatch(e,v){
  szLog([v.whois,szConf.log.abnormal],e,v); // 異常終了ログを出力
  return e;  // 戻り値をエラーオブジェクトとする
}
if( szConf.environment === 'node' )  exports.szCatch = szCatch;
/*+== szCatch ==================
const szCatchTest = () => {
  const testData = [
    [new ReferenceError('szCatchTest Error01'),{whois:'szCatchTest',a:10,b:true}],
  ];
  for( let i=0 ; i<testData.length ; i++ ){
    console.log(szCatch(...testData[i]));
  }
}
szCatchTest();
====================+*/

/** szFinally: 全関数で実行する終末処理
 * @param {object} v - 呼出元の内部変数をまとめたオブジェクト
 * @returns {object} - 呼出元の戻り値
 */
function szFinally(v){
  return v.rv;
}

/** getJPDateTime: 指定日時文字列を作成
 * @param {any} dt - 作成する日時の指定。省略時は現在時刻
 * @param {string} locale - 作成する形式
 * @returns {string} 指定形式＋ミリ秒の日時文字列
 * なおゼロパディングして2桁に整形するためには、replace【×2】が必要。<br>
 * ∵隣接する箇所と重複があると置換対象から外れる(下例の2日の部分)<br>
 * ex. '2022/1/2 3:04:5.678'.replace(/(\D)(\d)(\D)/g,'$10$2$3')<br>
 *     ⇒ '2022/01/2 03:04:05.678'
 */
function getJPDateTime(dt=null,locale='ja-JP'){
  const v = {whois:szConf.whois+'.getJPDateTime'}; // 関数名。開始/終了宣言等で使用
  try {
    szLog([v.whois,szConf.log.start],dt,locale); // 開始ログを出力

    v.tObj = dt === null ? new Date() : new Date(dt);
    v.rv = (v.tObj.toLocaleString(locale)
    + '.' + ('00'+v.tObj.getMilliseconds()).slice(-3) )
    .replace(/(\D)(\d)(\D)/g,'$10$2$3').replace(/(\D)(\d)(\D)/g,'$10$2$3');
  
    szLog([v.whois,szConf.log.normal],v.rv);  // 正常終了ログを出力
  } catch(e) {
    v.rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return szFinally(v);
  }
}
if( szConf.environment === 'node' )  exports.getJPDateTime = getJPDateTime;
/*+== getJPDateTime ==================
const getJPDateTimeTest = () => {
  console.log('getJPDateTimeTest start.');
  const testData = [
    '1900/1/1',
    new Date('2001/1/1'),
  ];
  for( let i=0 ; i<testData.length ; i++ ){
    console.log('rv='+getJPDateTime(testData[i]));
  }
}
getJPDateTimeTest();
====================+*/


/** extractJSDoc: テキストからJSDocを抽出し、オブジェクトに変換
 * @param {string[]} arg - 一行ごとに分割されたテキスト
 * @returns {object[]} 以下のJSDocオブジェクトの配列
 * <ul>
 * <li> label {string} - 概要。descの最初の一行[1]
 * <li> name {string} - 関数名。概要が「hoge: 〜」の形式の場合、hogeをセット
 * <li> desc {string|propObj[]} - 説明文。概要とパラメータを除いた部分。
 * <li> パラメータ名 {string|propObj[]} - 各パラメータの設定値
 * <li> source {string[]} - JSDoc部以降、次のJSDoc部になるまでのソース
 * param {object} arg - note ->param:'{object} arg - note'
 * </ul>
 * desc/パラメータ名の「propObj」とは、paramやreturns、説明文中の<ul>で
 * 「{型} 変数名 - 説明」または「変数名 {型} - 説明」形式の文字列を
 * 以下の形式のオブジェクトに変換したもの
 * <ul>
 * <li> name {string} - 変数名
 * <li> type {string} - 型
 * <li> num {string} - 「[0,1]」のように記述された出現回数
 * <li> desc {string} - 説明文。上記以外の部分
 * </ul>
 * <pre>
 * label: setTestData: debugModeに従ってszConfに値を設定
 * </pre>
 */
const sample01 = { // extraJSDocの入出力サンプル

// ■ 入力サンプル
// /** setTestData: debugModeに従ってszConfに値を設定
//  * 詳細説明がここに入ります。
//  * @param {number} debugMode - 0:通常, 1:スタッフ, 2:参加者
//  * @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType
//  * @returns {void} なし
//  * @returns {object} テスト用ダミー。本番時要削除
//  * 中段の詳細説明
//  * <ul>
//  * <li> hoge {string} - ほげ
//  * <li> fuga {object} - ふが
//  * <ul>
//  * <li> fuga.aaa {number} - ふがのメンバ
//  * </ul>
//  * </ul>
//  * 末尾の詳細説明
//  */
//   後略

/* ■ 出力サンプル
{
  "label": "setTestData: debugModeに従ってszConfに値を設定",
  "param": [
    {"type": "number","name": "debugMode","desc": "0:通常, 1:スタッフ, 2:参加者","num": null}
  ],
  "returns": [
    {"type": "void","name": "なし","desc": "","num": null},
    {"type": "object","name": "テスト用ダミー。本番時要削除","desc": "","num": null}
  ],
  "typedef": [
    {
      "type": "{ prop1: string, prop2: string, prop3?: number ",
      "name": "}",
      "desc": "SpecialType",
      "num": null
    }
  ],
  "desc": [
    "詳細説明がここに入ります。",
    "中段の詳細説明",
    {
      "start": "<ul>",
      "inner": [
        {"type": "hoge","name": "string","desc": "ほげ","num": null},
        {"type": "fuga","name": "object","desc": "ふが","num": null},
        {
          "start": "<ul>",
          "inner": [
            {"type": "fuga.aaa","name": "number","desc": "ふがのメンバ","num": null}
          ],
          "end": "</ul>"
        }
      ],
      "end": "</ul>"
    },
    "末尾の詳細説明"
  ],
  "source": [
    "  setTestData = (debugMode) => {",
    "    console.log('Auth.setTestData start. debugMode='+debugMode);",
    // 後略
  ]
}
*/
}

const extractJSDoc = (arg) => {
  // v: 内部で使用する各種変数。エラー時に参照しやすいよう一元化
  const v = {whois:szConf.whois+'.extractJSDoc'}; // 関数名。開始/終了宣言等で使用
  // rv: 戻り値。Errorの場合は書き換えるのでletで宣言
  let rv = [];
  szLog([v.whois,szConf.log.start],arg); // 開始ログを出力
  try {

    // parseOpt: [内部関数]insideJSDocから呼ばれ、JSON文字列部分を還元
    const parseOpt = (o) => {
      const v = {whois:szConf.whois+'.extractJSDoc.parseOpt'};
      let rv = null;
      try {
        szLog([v.whois,szConf.log.start],o); // 開始ログを出力

        if( (typeof o === 'object') && o.inner ){
          for( v.i=0 ; v.i<o.inner.length ; v.i++ ){
            if( typeof o.inner[v.i] === 'string' ){
              if( o.inner[v.i].match(/^\{\".+\":.+\}$/) ){
                o.inner[v.i] = JSON.parse(o.inner[v.i]);
              }
            } else {
              o.inner[v.i] = parseOpt(o.inner[v.i]);
              if( o.inner[v.i] instanceof Error ) throw o.inner[v.i];
            }
          }
        }
        rv = o;

        szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
      } catch(e) {
        rv = szCatch(e,v);  // szCatch: catch節の標準処理
      } finally {
        return rv;
      }
    }

    // analyzeOpt: [内部関数]insideJSDocから呼ばれ、オプション行を分析構造化
    const analyzeOpt = (str) => {
      const v = {whois:szConf.whois+'.extractJSDoc.analyzeOpt'};
      let rv = {};
      try {
        szLog([v.whois,szConf.log.start],str); // 開始ログを出力

        // 出現回数
        v.m1 = str.match(/^(.*)\[(.+?)\](.*)$/);
        rv.num = v.m1 ? v.m1[2] : '(未定義)';
        str = v.m1 ? v.m1[1] + v.m1[3] : str;

        // 「{型} 説明」：@returnsの場合
        // 「{型} 変数名 - 説明」：@param
        v.m2 = str.match(/^\s*{(.+?)}\s*(\S+)\s*([\-:]?)\s*(.*)$/);
        // 「変数名 {型} - 説明」：説明の中の<li>で使用
        v.m3 = str.match(/^\s*(\S+)\s*{(.+?)}\s*([\-:]?)\s*(.*)$/);
        if( !v.m2 && !v.m3 )  return str;

        if( v.m2 ){
          rv.type = v.m2[1];
          rv.name = v.m2[3].length > 0 ? v.m2[2] : '';
          rv.desc = v.m2[3].length > 0 ? v.m2[4].trim() : v.m2[2];
        } else {
          rv.type = v.m3[1];
          rv.name = v.m3[2];
          rv.desc = v.m3[4].trim();
        }

        szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
      } catch(e) {
        rv = szCatch(e,v);  // szCatch: catch節の標準処理
      } finally {
        return rv;
      }
    }

    // insideJSDoc: [内部関数]JSDoc内部を構造化
    const insideJSDoc = (obj) => {
      const v = {whois:szConf.whois+'.extractJSDoc.insideJSDoc'};
      let rv = {label:'',desc:[],source:[]};
      try {
        szLog([v.whois,szConf.log.start],obj); // 開始ログを出力

        obj.inner.forEach(x => {
          v.x = x;
          // 1.行頭＊を削除
          v.step = '1';
          v.m = x.match(/^ *\* ?(.+)$/);
          if( v.m ) x = v.m[1];

          // 2.@パラメータか判定
          v.step = '2';
          v.m = x.match(/^.*?@([a-zA-Z]+) (.+)$/);
          if( v.m ){  // 2.1.@パラメータ行の場合
            v.step = '2.1';
            v.label = v.m[1].toLowerCase();
            if( rv[v.label] === undefined ) rv[v.label] = [];
            if((v.r=analyzeOpt(v.m[2])) instanceof Error) throw v.r;
            rv[v.label].push(v.r);
          } else {  // 2.2.それ以外の行は説明
            v.step = '2.2';
            x = x.trimEnd();  // 末尾の空白を削除
            // 先頭'<li>'ならオプションとして構造化
            v.m = x.match(/^\s*<(?:li|LI)> *(.*)$/);
            if( v.m ){
              // 後工程②で構造化するので文字列で保存...①
              if((v.r=analyzeOpt(v.m[1])) instanceof Error) throw v.r;
              x = JSON.stringify(analyzeOpt(v.r));
            }
            rv.desc.push(x);
          }
        });

        // 3.先頭行はラベル。「〜: 〜」なら前半の〜を関数名とする
        v.step = '3';
        rv.label = rv.desc.shift().trim();
        v.m = rv.label.match(/^([a-zA-Z0-9 ]+)\s*:\s*(.*)$/);
        rv.name = v.m ? v.m[1].trim() : '';
        rv.label = v.m ? v.m[2].trim() : rv.label;
        // 説明文に'<ul>〜</ul>'があれば構造化
        if( (rv.desc = structuralize(
          rv.desc,
          '<(?:ol|OL|ul|UL)>',  // (?:〜) : パターンのグループ
          '<\\/(?:ol|OL|ul|UL)>',
        )) instanceof Error ){
          throw rv.desc;
        } else {
          // 後工程②：①でJSON化した文字列を還元する
          rv.desc.forEach(o => {
            if((o = parseOpt(o)) instanceof Error) throw o;
          });
        }

        szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
      } catch(e) {
        rv = szCatch(e,v);  // szCatch: catch節の標準処理
      } finally {
        return rv;
      }
    }

    // 読み込んだファイルを構造化
    v.stStr = '\\/\\*\\* *';  // "/** "
    v.edStr = ' *\\*\\/';     // " */"
    v.structured = structuralize(arg,v.stStr,v.edStr);
    if( v.structured instanceof Error ) throw v.structured;

    // JSDoc部分を抽出
    v.num = -1;
    for( v.i=0 ; v.i<v.structured.length ; v.i++ ){
      if( typeof v.structured[v.i] === 'object' ){
        // JSDoc部「/** 〜 */」の内部
        v.num++;
        if((v.r = insideJSDoc(v.structured[v.i])) instanceof Error) throw v.r;
        rv[v.num] = v.r;
      } else if( v.num > -1 ){
        // それ以外はソース。最初のJSDoc部より前の部分は廃棄
        rv[v.num].source.push(v.structured[v.i]);
      }
    }

    // ソース部分の整形
    for( v.i=0 ; v.i<rv.length ; v.i++ ){
      // ソースがない関数は飛ばす
      if( rv[v.i].source.length === 0 ) continue;
      v.arr = rv[v.i].source;
      // 文頭の空白行を削除
      while( v.arr.length > 0 ){
        if( v.arr[0].match(/^\s*$/) ){
          v.arr.shift();
        } else {
          break;
        }
      }
      // 文末の空白行を削除
      while( v.arr.length > 0 ){
        if( v.arr[v.arr.length-1].match(/^\s*$/) ){
          v.arr.pop();
        } else {
          break;
        }
      }
    }

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.extractJSDoc = extractJSDoc;

/** getFilelistRecursively: 指定フォルダ以下のファイル名を再帰的に取得
 * <br>
 * 参考：[nodejsで動作する 指定ディレクトリ配下のファイルを再帰的に取得、一覧化]{@link https://nodachisoft.com/common/jp/article/jp000169/}
 * @param {string} targetpath - 探索する対象のパス
 * @param {number} [depth=-1] - 探索する深さ(<0)。無指定なら制限なし
 * @returns {string[]} 取得したファイルの絶対パス
 */
const getFilelistRecursively = (targetpath, depth = -1) => {
  const v = {whois:szConf.whois+'.getFilelistRecursively'}; // 関数名。開始/終了宣言等で使用
  let rv = [];
  try {
    szLog([v.whois,szConf.log.start],targetpath,depth); // 開始ログを出力

    v.fs = require('fs');
    v.dirs = v.fs.readdirSync(targetpath);
    v.dirs.forEach(file => {
      v.filepath = targetpath + "/" + file;
      if ( v.fs.lstatSync(v.filepath).isDirectory()) {
        if ( depth == 0 ) return rv;
        rv = rv.concat( getFilelistRecursively(v.filepath, depth - 1));
      } else {
        rv.push(v.filepath);
      }
    });

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.getFilelistRecursively = getFilelistRecursively;

/** jsdo2md: extractJSDocで出力したJSDoc ObjectをMarddownに変換
 * @param {object[]} arg - extractJSDocで出力したJSDoc Object
 * @param {string} arg.name - 関数名
 * @param {string} arg.label - 概要
 * @param {propObj[]} arg.param - 引数。propObjは後述(sample01参照)
 * @param {propObj[]} arg.returns - 戻り値
 * @param {(string[]|propObj[])} arg.other - その他パラメータ
 * @param {(string[]|structuredObj[])} arg.desc - 説明文。structuredObjは後述
 * @param {string[]} arg.source - JSDoc出現以降、次のJSDoc出現までのソース
 * @param {number} lv - Markdownで、ラベルのレベル(ex. 2 -> ## ラベル)
 * @param {string} prefix - アンカー前の文字列。複数ファイル同一関数名使用時の曖昧性回避
 * @returns {rvObj[]} 変換したMarkdownのソース
 *
 * propObj: 変数の属性を整理したオブジェクト
 * <ul>
 * <li> name {string} - 変数名
 * <li> type {string} - 属性
 * <li> num {string} - 出現回数
 * <li> desc {string} - 変数の説明
 * </ul>
 *
 * structuredObj: structuralize()の出力オブジェクト。
 * <ul>
 * <li> start {string} - 開始タグの正規表現にマッチした文字列
 * <li> inner {(string|propObj|structuredObj)[]} - 文字列またはpropObjまたは再帰的な子要素
 * <li> end {string} - 終了タグの正規表現にマッチした文字列
 * </ul>
 *
 * rvObj: 戻り値に設定するオブジェクト
 * <ul>
 * <li> list {string[]} - 関数名のリスト
 * <li> source {string} - 全体のソース
 * <li> data {object[]} - 以下の要素を持つオブジェクトの配列
 * <ul>
 * <li> name {string} - 関数名
 * <li> location {string} - ローカルリンクする場合のアンカー文字列
 * <li>
 * </ul>
 * </ul>
 */
const jsdo2md = (arg,lv=2,prefix='') => {
  // v: 内部で使用する各種変数。エラー時に参照しやすいよう一元化
  const v = {whois:szConf.whois+'.jsdo2md'}; // 関数名。開始/終了宣言等で使用
  // rv: 戻り値。Errorの場合は書き換えるのでletで宣言
  let rv = {list:[],source:'',data:[]};
  try {
    szLog([v.whois,szConf.log.start],arg,lv,prefix); // 開始ログを出力

    const propObj = (obj) => {
      const v = {whois:szConf.whois+'.jsdo2md.propObj'};
      let rv = null;
      try {
        szLog([v.whois,szConf.log.start],obj); // 開始ログを出力

        rv = 'No | 変数名 | 型 | 回数 | 説明\n'
        + '--: | :-- | :-- | :--: | :--\n';
        for( v.i=0 ; v.i<obj.length ; v.i++ ){
          rv += String(v.i+1)
              + ' | ' + obj[v.i].name
              + ' | ' + obj[v.i].type
              + ' | ' + obj[v.i].num
              + ' | ' + obj[v.i].desc
              + '\n';
        }
        rv += '\n';

        szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
      } catch(e) {
        rv = szCatch(e,v);  // szCatch: catch節の標準処理
      } finally {
        return rv;
      }
    }

    const structuredObj = (obj) => {
      const v = {whois:szConf.whois+'.jsdo2md.structuredObj'};
      let rv = '';
      try {
        szLog([v.whois,szConf.log.start],obj); // 開始ログを出力

        for( v.i=0 ; v.i<obj.length ; v.i++ ){
          if( typeof obj[v.i] === 'object' ){
            if( obj[v.i].start ){
              rv += obj[v.i].start + '\n';
              for( v.j=0 ; v.j<obj[v.i].inner.length ; v.j++ ){
                v.r = structuredObj(obj[v.i].inner[v.j]);
                if( v.r instanceof Error ) throw v.r;
                rv += v.r;
              }
              rv += obj[v.i].end + '\n\n';
            } else {
              v.r = propObj(obj[v.i]);
              if( v.r instanceof Error ) throw v.r;
              rv += v.r;
            }
          } else {
            rv += obj[v.i] + '  \n';
          }
        }
        rv += '\n';

        szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
      } catch(e) {
        rv = szCatch(e,v);  // szCatch: catch節の標準処理
      } finally {
        return rv;
      }
    }

    v.rex = /name|label|param|returns|return|desc|source/;
    for( v.i=0 ; v.i<arg.length ; v.i++ ){
      v.rv = {};
      v.rv.name = arg[v.i].name || '';  // 関数名が未定なら空文字列を設定
      v.rv.label = arg[v.i].label;
      v.rv.header = v.rv.name.length > 0
        ? v.rv.name + ': ' + v.rv.label
        : v.rv.label;
      v.rv.location = prefix + '-' + arg[v.i].name;
      // param,returns以外で指定されているパラメータのリストを作成
      v.rv.map = Object.keys(arg[v.i]);
      v.list = v.rv.map.filter(x => x.match(v.rex) === null);

      // 関数名リストに追加
      rv.list.push(v.rv.name);

      // タイトル行
      v.rv.source = '###### '.slice(-lv-1)
      + v.rv.header
      + '<a name="' + v.rv.location + '"></a>\n\n';

      // param:引数
      if( arg[v.i].param ){
        v.r = propObj(arg[v.i].param);
        if( v.r instanceof Error ) throw v.r;
        v.rv.source += '<b>■ 引数</b>\n\n' + v.r;
      }

      // returns:戻り値
      if( arg[v.i].returns || arg[v.i].return ){
        v.r = propObj(arg[v.i].returns || arg[v.i].return);
        if( v.r instanceof Error ) throw v.r;
        v.rv.source += '<b>■ 戻り値</b>\n\n'
        + propObj(arg[v.i].returns || arg[v.i].return);
      }

      // その他パラメータ
      v.list.forEach(x => {
        v.rv.source += '<b>■ ' + x + '</b>\n\n';
        v.r = propObj(arg[v.i][x]);
        if( v.r instanceof Error ) throw v.r;
        v.rv.source += v.r;
      });

      // 説明
      if( arg[v.i].desc && arg[v.i].desc.length > 0 ){
        v.r = structuredObj(arg[v.i].desc);
        if( v.r instanceof Error ) throw v.r;
        v.rv.source += '<b>■ 説明</b>\n\n' + v.r + '\n\n';
      }

      // ソース
      if( arg[v.i].source ){
        v.rv.source += '<details><summary>source</summary>\n\n```\n'
        + arg[v.i].source.join('\n') + '\n```\n\n</details>\n\n';
      }

      rv.source += v.rv.source;
      rv.data.push(v.rv);
    }

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.jsdo2md = jsdo2md;

/** objectize: 階層形式の二次元配列をオブジェクト化
 * @param {Array.any[]} arr - シートの二次元配列。先頭行はヘッダ(固定)
 * @param {number|string} stCol - 分類の開始列番号(自然数)、または項目名
 * @param {number|string} edCol - 分類の終了列番号(自然数)、または項目名
 * @param {string|string[]} [valid] - データとして取得したい項目名。省略すると分類範囲列以外の全項目。
 * 文字列の場合は単一と見做し、戻り値もオブジェクトではなく当該項目の値となる。
 * なお「rowNumberYYYYMMDD」が指定された場合、当該項目の添字をセットする(ヘッダ=0,データ=1〜)
 * ※末尾の「YYYYMMDD」は項目名の重複回避のためのサフィックスなので、数値の並びなら適宜変更可
 * @returns {Object.<string, any>} 変換結果
 * @example 
 * 
 * lv01   | lv02  | lv03  | value | note
 * :--    | :--   | :--   | :--   |
 * public |       |       |       | 
 *        | inter |       | 30000 | 定期配信の間隔
 *        |       | inter | 30000 | NGのサンプル
 * なお上の最下行のように階層が飛ぶことはNG(lv01:あり/lv02:なし/lv03:ありはNG)。
 * 
 * objectize(arr,1,3) ⇒ {public:{inter:{value:30000,note:'定期配信の間隔'}}}
 * objectize(arr,'lv01','lv03','value') ⇒ {public:{inter:30000}}}
 * objectize(arr,'lv01','lv03','rowNumber20230302')
 * ⇒ {public:{inter:{value:30000,note:'定期配信の間隔',rowNumber20230302:2}}}}
 * 
 */
/*+
const objectizeTest = () => {
  //const c = szSheet('TEST');
  //console.log(JSON.stringify(c.objectize(1,1,'value')));
  console.log('szConf='+JSON.stringify(szConf));
  const c = szSheet({sheetName:'config',headerRow:2});
  //console.log('objectizeTest: '+JSON.stringify(c.objectize(1,3)));
  //console.log('objectizeTest: '+JSON.stringify(c.objectize(1,3,'value')));
  console.log('objectizeTest: '+JSON.stringify(c.objectize('lv01','lv03','value')));
  //console.log('objectizeTest: '+JSON.stringify(c.objectize('lv01','lv03',['value','rowNumber20230302'])));
}
+*/
function objectize(arr,stCol,edCol,valid){
  const v = {whois:szConf.whois+'.objectize',rv:{}}; // 関数名。開始/終了宣言等で使用
  try {
    szLog([v.whois,szConf.log.start],arr,stCol,edCol,valid); // 開始ログを出力

    // 1.事前準備
    // 1.1.操作対象表(二次元配列)のバックアップ
    v.step = '1.1';
    v.arr = JSON.parse(JSON.stringify(arr));  // 破壊しないようコピー
    // 1.2.分類列範囲の設定
    v.step = '1.2';
    if( typeof stCol === 'number' ){
      v.stCol = stCol - 1;  // ループで回すために添字化(0オリジン)
    } else {  // 文字列指定の場合
      v.stCol = v.arr[0].findIndex(x => x == stCol );
    }
    if( typeof edCol === 'number' ){
      v.edCol = edCol;      // 終了位置は「未満」用にマイナスなし
    } else {  // 文字列指定の場合
      v.edCol = v.arr[0].findIndex(x => x == edCol ) + 1;
    }
    // 1.3.取得したい列名を配列に格納
    v.step = '1.3';
    v.valid = valid || [];
    if( typeof valid === 'string' ){
      v.valid = [valid];
    }
    // valid指定なしの場合、分類範囲列以外の全項目を追加
    if( v.valid.length === 0 ){
      for( v.i=0 ; v.i<v.arr[0].length ; v.i++ ){
        if( v.i<v.stCol || v.edCol <= v.i ){
          v.valid.push(v.arr[0][v.i]);
        }
      }
    }
    // 1.4.行番号を取得するか判断、取得なら各行末尾に行番号欄を追加
    for( v.i=0 ; v.i<v.valid.length ; v.i++ ){
      if( v.valid[v.i].match(/rowNumber[0-9]+/) ){
        v.arr[0].push(v.valid[v.i]);
        for( v.j=1 ; v.j<v.arr.length ; v.j++ )
          v.arr[v.j].push(v.j);
        break;
      }
    }
    // 1.5.項目名->添字のインデックスをmapとして作成
    v.map = {};
    for( v.i=0 ; v.i<v.arr[0].length ; v.i++ ){
      v.map[v.arr[0][v.i]] = v.i;
    }

    // 2.内部関数の定義
    // 分類列範囲の開始〜終了(親〜子)を順次舐め、子があれば再起呼出
    v.step = '2';
    recursive = (
      stack,  // 一行分の配列
      col,    // 処理対象となる分類列のstack上の添字
      vObj,   // メンバに設定するデータ(variable object)
      pObj    // 格納するオブジェクト(parent object)
    ) => {
      let rv = null;  // 戻り値。正常終了ならnull
      try {
        // 2.1.格納先オブジェクトにメンバ未登録なら空オブジェクトを作成
        v.step = '2.1';
        //console.log('v.i='+v.i+', stack['+col+']='+stack[col]+', vObj='+JSON.stringify(vObj)+', pObj='+JSON.stringify(pObj));
        if( typeof pObj[stack[col]] === 'undefined' )
          pObj[stack[col]] = {};
        v.step = '2.2';
        if( col === (v.edCol - 1) || String(stack[col+1]).length === 0 ){
          // 2.2a.子分類がないなら値を格納
          // ※子分類がない＝処理対象が分類列右端または右横の分類列が空白
          v.step = '2.2a';
          pObj[stack[col]] = vObj;
        } else {
          // 2.2b.子分類があるなら再起呼出
          v.step = '2.2b';
          const r = recursive(stack,col+1,vObj,pObj[stack[col]]);
          if( r instanceof Error ) throw r;
        }
        rv = null;
      } catch(e) {
        console.error('objectize.recursive Error.\n',e);
        rv = e;
      } finally {
        return rv;
      }
    };

    // 以降、一行ずつ処理
    v.lastRow = v.arr[1];  // データ領域の先頭行を前行の初期値とする
    for( v.i=1 ; v.i<v.arr.length ; v.i++ ){
      // 3.分類列範囲の上位が空欄なら前行の値をコピー
      v.step = '3';
      for( v.j=v.stCol ; v.j<v.edCol ; v.j++ ){
        if( String(v.arr[v.i][v.j]).length === 0 ){
          // 分類列範囲の上位が未設定なら前行の設定値をコピー
          v.arr[v.i][v.j] = v.lastRow[v.j];
        } else {
          // 分類列範囲の上位が設定されてたら以降はスキップ
          break;
        }
      }
      v.lastRow = [...v.arr[v.i]];

      // 4.分類列範囲外を出力用にオブジェクト化
      // 4.1.取得項目名：値となるオブジェクトを作成
      v.step = '4.1';
      v.vObj = {};
      for( v.j=0 ; v.j<v.valid.length ; v.j++ ){
        v.a = v.arr[v.i][v.map[v.valid[v.j]]];
        if( typeof v.a !== undefined && String(v.a).length > 0 ){
          v.vObj[v.valid[v.j]] = v.a;
        }
      }
      // 4.2.有効なデータ項目が無ければ以降の処理をスキップ
      v.step = '4.2';
      v.b = Object.keys(v.vObj);
      if( v.b.length === 0 ) continue;
      // 4.3.データ項目が一つだけなら値として設定
      v.step = '4.3';
      if( v.valid.length === 1 && v.b.length === 1 ){
        v.vObj = v.vObj[v.b[0]];
      }

      // 5.戻り値となるオブジェクトにvObjを追加
      v.step = '5';
      v.r = recursive(v.arr[v.i],v.stCol,v.vObj,v.rv);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = '6'; // 終了処理    
    szLog([v.whois,szConf.log.normal],v.rv);  // 正常終了ログを出力
  } catch(e) {
    v.rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return szFinally(v);
  }
}
if( szConf.environment === 'node' )  exports.objectize = objectize;

/** structuralizeObj: structuralize()の戻り値
 * @typedef {object} structuralizeObj
 * @prop start {string[]} - match(stStr)の結果
 * @prop inner {string|structuralizeObj[]} - 囲まれた部分の文字列または子要素
 * @prop end {string[]} - match(edStr)の結果
 */
/** structuralize: テキストを開始/終了タグを基に構造化
 * @example <caption>引数</caption>
 * stStr = '<[div|DIV].*?>'  
 * edStr = '</[div|DIV]>'
 * content = `あいうえお
 * <div class="a">
 *   <div class="b">かきくけこ</div>
 *   <p>さしすせそ</p>
 *   <div class="c">たちつてと</div>
 *   なにぬねの
 * </div>
 * はひふへほ`
 * parent = undefined(最初に呼ばれるときは定義不要)
 * 
 * @example <caption>戻り値</caption>
 * rv = [
 *   'あいうえお',
 *   { start: '<div class="a">',
 *     inner: [
 *       {start: '<div class="b">',inner: ['かきくけこ'],end: '</div>'},
 *       '<p>さしすせそ</p>', //開始・終了タグにマッチしない場合、文字列として扱う
 *       {start: '<div class="c">',inner: ['たちつてと'],end: '</div>'},
 *       'なにぬねの'],
 *     end: '</div>'},
 *   'はひふへほ'
 * ]
 * 
 * @param {string|string[]} content - 処理対象テキスト。
 * 配列の場合、破壊されるのでコピーを渡すこと。
 * @param {string} stStr - 開始タグの正規表現<br>
 * 注意：'＼'は2つ重ねる ex.「／＊〜＊／」⇒'＼＼／＼＼＊〜＼＼＊＼＼／'
 * @param {string} edStr - 終了タグの正規表現
 * @param {object} parent - 処理結果を保存するオブジェクト。
 * 再帰呼出時のみ必要で、外部から呼ぶ際には設定不要。
 * @returns {string[]|structuralizeObj[]}
 */
const structuralize = (content,stStr,edStr,parent={start:null,inner:[]}) => {
  const v = {whois:szConf.whois+'.structuralize',step:'0'};
  let rv = null;  // 戻り値。Errorの場合は書き換えなのでletで宣言
  try {
    szLog([v.whois,szConf.log.start],content,stStr,edStr,parent); // 開始ログを出力
  
    // 1.事前処理
    // 1.1.contentが文字列なら行単位に分割
    v.step = '1.1'
    v.content = (typeof content !== 'string') ? content : content.split('\n');

    // 1.2.「キーより前(前部)・キー・キーより後(後部)」とするRegExp作成
    v.step = '1.2';
    if( stStr.match(/\^/) ){
      // 開始キーに'^'が含まれる⇒前部のマッチパターンはつけない
      v.stStr = stStr;
      if( stStr.match(/\$/) ){
        // stEnd: 開始キーに'^','$'が含まれるかの変数(End=「端」)
        //    '^'あり ⇒ 2^0, '$'あり ⇒ 2^1 の和
        v.stEnd = 3;  // '^'あり, '$'あり
        // 開始キーに'$'が含まれる⇒後部のマッチパターンはつけない
      } else {
        v.stEnd = 2;  // '^'あり, '$'なし
        // 開始キーに'$'が含まれない⇒後部のマッチパターンをつける
        v.stStr += '(.*)$';
      }
    } else {
      // 開始キーに'^'が含まれない⇒前部のマッチパターンをつける
      v.stStr = '^(.*?)' + stStr;
      if( stStr.match(/\$/) ){
        v.stEnd = 1;  // '^'なし, '$'あり
      } else {
        v.stEnd = 0;  // '^'なし, '$'なし
        v.stStr += '(.*)$';
      }
    }
    if( edStr.match(/\^/) ){
      v.edStr = edStr;
      if( edStr.match(/\$/) ){
        v.edEnd = 3;
      } else {
        v.edEnd = 2;
        v.edStr += '(.*)$';
      }
    } else {
      v.edStr = '^(.*?)' + edStr;
      if( edStr.match(/\$/) ){
        v.edEnd = 1;
      } else {
        v.edEnd = 0;
        v.edStr += '(.*)$';
      }
    }
    v.stExp = new RegExp(v.stStr);
    v.edExp = new RegExp(v.edStr);

    // 2.内部関数の定義
    // 2.1.マッチした行をキー前部・キー部・キー後部に分離
    // ※本関数はv.stTrans/edTransから呼ばれる
    v.separate = (arr,end) => {
      v.step = 'separate';
      const whois = v.whois;  // 内部関数の名前に変更
      v.whois = 'v.separate';
      let r = null;  // キー(arr)がマッチしていなかったらnull
      if( arr ){
        r = {prefix:'',suffix:''};
        if( (end & 2) === 0 && arr[1].length > 0 ){
          r.prefix = arr[1];
          arr.shift();
        }
        const l = arr.length - 1;
        if( (end & 1) === 0 && arr[l].length > 0 ){
          r.suffix = arr[l];
          arr.pop();
        }
        r.key = [arr.shift()]; // match[0]を保存した上で削除
        if( (end & 2) === 0 ){ // '^(.*?)'を追加していた場合
          arr.shift();         // '^(.*?)'分(キー前部)を削除
        }
        if( (end & 1) === 0 ){ // '(.*)$'を追加していた場合
          arr.pop();           // '(.*)$'分(キー後部)を削除
        }
        r.key = [r.key[0],...arr];
      }
      v.whois = whois;  // 元の関数名に戻す
      return r;
    }

    // 2.2.開始キーを見つけた場合の処理
    v.stTrans = () => {
      v.step = 'stTrans';
      const whois = v.whois;
      v.whois = 'v.stTrans';
      // 先頭前部をparent.innerに追加
      if( v.stMatch.prefix.length > 0 ){
        parent.inner.push(v.stMatch.prefix);
      }
      // 子要素childを作成、先頭をchild.startに保存
      const child = {start:v.stMatch.key,inner:[]};
      // 先頭行を先端後部に置換して再帰呼出
      if( v.stMatch.suffix.length === 0 ){
        v.content.shift();  // 後部がなければ終了(対象行削除)
      } else {
        v.content[0] = v.stMatch.suffix;
      }
      v.res = structuralize(v.content,stStr,edStr,child);
      if( v.res instanceof Error )  throw v.res;
      // 再起呼出の結果をparent.innerに追加
      parent.inner.push(v.res);
      v.whois = whois;
    }

    // 2.3.終了キーを見つけた場合の処理
    v.edTrans = () => {
      v.step = 'edTrans';
      const whois = v.whois;
      v.whois = 'v.edTrans';
      // 終端前部はparent.innerに追加
      if( v.edMatch.prefix.length > 0 ){
        parent.inner.push(v.edMatch.prefix);
      }
      // 終端キー文字列を保存
      parent.end = v.edMatch.key;
      // 先頭行は終端後部に置換
      if( v.edMatch.suffix.length === 0 ){
        v.content.shift();
      } else {
        v.content[0] = v.edMatch.suffix;
      }
      v.whois = whois;
    }

    // 3.ファイルの中身を一行ずつ処理
    v.lineNum = -1;
    while( parent.end === undefined && v.content.length > 0 ){
      // 3.1.マッチした行をキー前部・キー部・キー後部に分離
      v.step = '3.1.st';
      v.stMatch = v.separate(v.content[0].match(v.stExp),v.stEnd);
      v.step = '3.1.ed';
      v.edMatch = v.separate(v.content[0].match(v.edExp),v.edEnd);

      // 3.2.キーの存否によって処理分岐
      if( !v.stMatch ){
        if( !v.edMatch ){ // 00: 先頭・終端ともにアンマッチ
          v.step = '3.2.00';
          // 文字列として保存して先頭行削除
          parent.inner.push(v.content.shift());
        } else {  // 01: 先頭アンマッチ、終端はマッチ
          v.step = '3.2.01';
          v.edTrans();
        }
      } else {
          if( !v.edMatch ){  // 10: 先頭はマッチ、終端はアンマッチ
            v.step = '3.2.10';
            v.stTrans();
        } else {  // 11: 先頭・終端ともにマッチ
          v.step = '3.2.11';
          // 開始前部と終了前部の長さを比較、どちらが先に出現したか判断
          if( v.stMatch.prefix.length < v.edMatch.prefix.length ){
            v.step = '3.2.11a';
            v.stTrans();  // 11a: 開始が先なら開始処理
          } else {
            v.step = '3.2.11b';
            v.edTrans();  // 11b: 終了が先なら終了処理
          }
        }
      }
    }

    // 4.戻り値の設定。再起呼出でない場合、innerのみを戻り値とする
    v.step = '4';
    rv = parent.start === null ? parent.inner : parent;

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.structuralize = structuralize;

/** readfile: 指定テキストファイルを読み込み、行毎に分割
 * @param {string} arg - ファイル名
 * @returns {string} ファイルの内容(行毎の分割はなし)
 */
const readfile = (arg) => {
  // v: 内部で使用する各種変数。エラー時に参照しやすいよう一元化
  const v = {whois:szConf.whois+'.readfile'}; // 関数名。開始/終了宣言等で使用
  // rv: 戻り値。Errorの場合は書き換えるのでletで宣言
  let rv = null;
  try {
    szLog([v.whois,szConf.log.start],arg); // 開始ログを出力

    v.fs = require('fs');
    rv = v.fs.readFileSync(arg,'utf-8');
    //rv = v.content.split('\n');

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.readfile = readfile;

/**
 * @typedef {object} szTreeObj - szTreeの戻り値
 * @prop {any[]} keys - ヘッダ行(ヘッダ部)の一次元配列
 * @prop {string} stColName - 分類開始列の項目名
 * @prop {number} stColNum - 分類開始列の添字(≧0)
 * @prop {string} edColName - 分類終了列の項目名
 * @prop {number} edColNum - 分類終了列の添字(≧0)
 * @prop {string[]} valid - 取得対象となった列名の配列
 * @prop {Object.<string,object|any>} tree - 階層化した項目名：値のオブジェクト。
 * 取得項目が単一ならオブジェクトでは無く、当該項目の値
 * @prop {object} members - メンバ・メソッドへの参照
 * ※以下は行単位のデータの配列
 * @prop {any[][]} raw - 分類列の欠損を埋めた状態の行データの配列
 * @prop {string[]} path - 行単位に分類列の文字列をタブで結合した文字列。分類列範囲全項目空白の場合はnull
 * @prop {Object.<string,any>[]} value - 行単位に分類列以外の項目の値を保持
 * @prop {Object.<string,number[]>} label - 項目名->添字のインデックス。項目名は重複があるので配列形式
 * ※以下はメソッド
 * @prop {function} search - メソッド。項目名'key'の値がvalueである行Objを全て検索
 * @prop {function} nearest - メソッド。ベースノードの最寄の指定ノードを検索
 */
/** szTree: ツリー構造を持つ二次元配列の検索
 * @desc <caption>シート作成上の注意</caption>
 * <ol>
 * <li>子孫を持つノードは値を持っていてはならない(下表の"a","aa")
 * <li>分類列範囲において階層を飛ばしてはならない(下表の最下行。lv01,03:ありで中間のlv02:なしはNG)
 * </ol>
 * @param {any[]} [arg.keys] - ヘッダ行(ヘッダ部)の一次元配列。未定義の場合、rawの先頭行をヘッダ行と見做す
 * @param {any[][]} arg.raw - データ部の二次元配列
 * @param {number|string} arg.stCol - 分類の開始列番号(≧0)、または項目名
 * @param {number|string} arg.edCol - 分類の終了列番号(≧0)、または項目名
 * @param {string|string[]} [arg.valid] - データとして取得したい項目名。省略すると分類範囲列以外の全項目。
 * 文字列の場合は単一と見做し、戻り値もオブジェクトではなく当該項目の値となる。
 * 
 * @returns {szTreeObj} 変換結果
 * @example 
 * 
 * lv01 | lv02 | lv03 | value | note
 * :--  | :--  | :--  | --:   | :--
 * a    |      |      |       | 
 *      | aa   |      |       | aa_note
 *      |      | aaa  | 1     | 
 *      |      | aab  | 2     | 
 * b    |      |      | 3     | b_note
 *      |      | ba   | 4     | NGのサンプル(実際は削除して実行)
 * 
 * const c = szSheet('TEST');
 * const raw = JSON.parse(JSON.stringify(c.raw));
 * raw.splice(0,1);　※データ部のみ抽出
 * szLib.szTree({keys:c.keys,raw:raw,stCol:'lv01',edCol:'lv03',valid:'value'});
 * ⇒ {  ※メソッドは省略
 *   "keys":["lv01","lv02","lv03","value","note"],
 *   "raw":[
 *     ["a","","","",""],
 *     ["a","aa","","","aa_note"],
 *     ["a","aa","aaa",1,""],
 *     ["a","aa","aab",2,""],
 *     ["b","","",3,""]
 *   ],
 *   "path":["a","a\taa","a\taa\taaa","a\taa\taab","b"],
 *   "value":[{},{},{"value":1},{"value":2},{"value":3}],
 *   "label":{"a":[0],"aa":[1],"aaa":[2],"aab":[3],"b":[4]},
 *   "tree":{"a":{"aa":{"aaa":1,"aab":2}},"b":3},
 *   "stColNum":0,
 *   "edColNum":2,
 *   "stColName":"lv01",
 *   "edColName":"lv03",
 *   "valid":["value"],
 *   "members":{(略)}
 * }
 */
/*+
※本テストはシートを取得するためGASLibで実行
const szTreeTest = () => {
  //console.log('szConf='+JSON.stringify(szConf));
  const c = szSheet({sheetName:'config',headerRow:2});
  const raw = JSON.parse(JSON.stringify(c.raw));
  raw.splice(0,2);
  //const r = szLib.szTree({keys:c.keys,raw:raw,stCol:'lv01',edCol:'lv03',value:['value','note']});
  const r = szLib.szTree({keys:c.keys,raw:raw,stCol:'lv01',edCol:'lv03',value:'value'});
  //["keys","raw","path","value","label","tree","stColNum","edColNum","stColName","edColName","valid"].forEach(x => console.log(x+' = '+JSON.stringify(r[x])));
  //console.log('search01: path='+JSON.stringify(r.path)+'\n\n-> '+JSON.stringify(r.search(['Agent','sendOver'])));
  //console.log('search02: path='+JSON.stringify(r.path)+'\n\n-> '+JSON.stringify(r.search(['Agent','sendOver'],{value:/^.+$/})));
  //console.log('search03: path='+JSON.stringify(r.path)+'\n\n-> '+JSON.stringify(r.search(['Agent','sendOver'],{value:/^$/})));

  r10 = r.nearest({path:['Agent','sendOver'],value:{value:/^$/}},{path:['Agent','account']});
  console.log('search10: '+JSON.stringify(r10.value.value));  // sendOver未定義->Agent0->shimokitasho.oyaji
  r11 = r.nearest({path:['Agent','sendOver'],value:{value:/^.+$/}},{path:['Agent','account']});
  console.log('search11: '+JSON.stringify(r11.value.value));  // sendOver定義済->Agent1->nakaone.kunihiro
}
+*/
function szTree(arg){
  const v = {whois:szConf.whois+'.szTree',arg:arg,rv:{
    keys:arg.keys,raw:arg.raw,path:[],value:[],label:{},tree:{}}};
  try {
    szLog([v.whois,szConf.log.start],arg); // szTree開始ログ

    // 1.事前準備
    v.step = '1.1'; // ヘッダ行未定義の場合はrawの先頭行
    if( typeof arg.keys === 'undefined' ){
      v.rv.keys = v.rv.raw.splice(0,1);
    }
    v.step = '1.2'; // 分類列範囲の設定
    v.rv.stColNum = typeof arg.stCol === 'number' ? arg.stCol
      : v.arg.keys.findIndex(x => x == arg.stCol );
    v.rv.edColNum = typeof arg.edCol === 'number' ? arg.edCol
      : v.arg.keys.findIndex(x => x == arg.edCol );
    if( v.rv.stColNum > v.rv.edColNum ){  // st>edなら交換
      [v.rv.stColNum,v.rv.edColNum] = [v.rv.edColNum,v.rv.stColNum];
    }
    v.rv.stColName = v.rv.keys[v.rv.stColNum];
    v.rv.edColName = v.rv.keys[v.rv.edColNum];

    v.step = '1.3'; // 取得したい列名を配列に格納
    v.rv.valid = arg.valid || [];
    if( typeof arg.valid === 'string' ){
      v.rv.valid = [arg.valid];
    }
    v.step = '1.4'; // valid指定なしの場合、分類範囲列以外の全項目を追加
    if( v.rv.valid.length === 0 ){
      for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
        if( v.i<v.rv.stColNum || v.rv.edColNum < v.i ){
          v.rv.valid.push(v.rv.keys[v.i]);
        }
      }
    }
    v.step = '1.5'; // 項目名->添字のインデックスをmapとして作成
    v.map = {};
    for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
      v.map[v.rv.keys[v.i]] = v.i;
    }

    // 2.内部関数の定義
    // 分類列範囲の開始〜終了(親〜子)を順次舐め、子があれば再起呼出
    recursive = (
      stack,  // 一行分の配列
      col,    // 処理対象となる分類列のstack上の添字
      vObj,   // メンバに設定するデータ(variable object)
      pObj    // 格納するオブジェクト(parent object)
    ) => {
      let rv = null;  // 戻り値。正常終了ならnull
      try {
        v.step = '2.1'; // 格納先オブジェクトにメンバ未登録なら空オブジェクトを作成
        if( typeof pObj[stack[col]] === 'undefined' ){
          pObj[stack[col]] = {};
        }
        v.step = '2.2';
        if( col < v.rv.edColNum && String(stack[col+1]).length > 0 ){
          v.step = '2.2a'; // 子分類があるなら再起呼出
          const r = recursive(stack,col+1,vObj,pObj[stack[col]]);
          if( r instanceof Error ) throw r;
        } else {
          v.step = '2.2b';  // 分類列範囲右端または子分類がないなら値を格納
          // ※子分類がない＝処理対象右横の分類列が空白
          pObj[stack[col]] = vObj;
        }
        rv = null;
      } catch(e) {
        console.error('szTree.recursive Error.\n',e);
        rv = e;
      } finally {
        return rv;
      }
    };

    v.step = '3'; // 以降、一行ずつ処理
    v.lastRow = v.rv.raw[0];  // データ領域の先頭行を前行の初期値とする
    for( v.i=0 ; v.i<v.rv.raw.length ; v.i++ ){
      v.step = '3.1'; // 分類列範囲がすべて空白の場合、ブランチ・ノードのいずれでもないので以降の処理はスキップ
      if( v.rv.raw[v.i].slice(v.rv.stColNum,v.rv.edColNum+1).join('').length === 0 )
        continue;

      v.step = '3.2'; // 分類列範囲の上位が空欄なら前行の値をコピー
      for( v.j=v.rv.stColNum ; v.j<=v.rv.edColNum ; v.j++ ){
        if( String(v.rv.raw[v.i][v.j]).length === 0 ){
          // 分類列範囲の上位が未設定なら前行の設定値をコピー
          v.rv.raw[v.i][v.j] = v.lastRow[v.j];
        } else {
          // 分類列範囲の上位が設定されてたら以降はスキップ
          break;
        }
      }
      v.lastRow = v.rv.raw[v.i];

      v.step = '3.3'; // pathを追加
      v.rv.path[v.i] = v.rv.raw[v.i]
        .slice(v.rv.stColNum,v.rv.edColNum+1)
        .join('\t') // 分類列範囲をタブ区切りで結合
        .match(/^(.*?)\t*$/)[1];  // 末尾のタブは削除

      v.step = '3.4'; // labelを追加
      for( v.j=v.rv.edColNum ; v.j>=v.rv.stColNum ; v.j-- ){
        if( String(v.rv.raw[v.i][v.j]).length > 0 ){
          break;
        }
      }
      if( typeof v.rv.label[v.rv.raw[v.i][v.j]] === 'undefined' ){
        v.rv.label[v.rv.raw[v.i][v.j]] = [];
      }
      v.rv.label[v.rv.raw[v.i][v.j]].push(v.i);

      // 以降、分類列範囲外を出力用にオブジェクト化
      v.step = '3.5'; // 取得項目名：値となるオブジェクトを作成
      v.vObj = {};
      for( v.j=0 ; v.j<v.rv.valid.length ; v.j++ ){
        v.a = v.rv.raw[v.i][v.map[v.rv.valid[v.j]]];
        if( typeof v.a !== undefined && String(v.a).length > 0 ){
          v.vObj[v.rv.valid[v.j]] = v.a;
        }
      }
      v.rv.value[v.i] = {...v.vObj};

      v.step = '3.6'; // 有効なデータ項目が無ければ以降の処理をスキップ
      v.b = Object.keys(v.vObj);
      if( v.b.length === 0 ) continue;
      v.step = '3.7'; // データ項目が一つだけなら値として設定
      if( v.rv.valid.length === 1 && v.b.length === 1 ){
        v.vObj = v.vObj[v.b[0]];
      }

      v.step = '3.8'; // 戻り値となるオブジェクトにvObjを追加
      v.r = recursive(v.rv.raw[v.i],v.rv.stColNum,v.vObj,v.rv.tree);
      if( v.r instanceof Error ) throw v.r;
    }


    // 4.メソッドの定義
    /**
     * @typedef {object} szTreeSearch - szTree.search()の戻り値
     * @prop {Object.<string, any>} obj - 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)
     * @prop {number} dataNum - data上の添字
     * @prop {number} rawNum - raw上の添字
     * @prop {number} rowNum - スプレッドシート上の行番号
     */
    /** search: 項目名'key'の値がvalueである行Objを全て検索
     * @param {string[]} path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @returns {szTreeSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.1 search';
    v.rv.search = (path,value) => {return ((p,path,value)=>{
      const v = {whois:p.whois+'.search',rv:[]};
      try {
        // path検索の正規表現を生成
        v.rex = new RegExp([...path].join('\\t(\\S+\\t)*'));
        for( v.i=0 ; v.i<p.path.length ; v.i++ ){
          // ノードで無ければスキップ
          if( p.path[v.i] === null ) continue;  
          // pathがマッチするか判定
          if( String(p.path[v.i]).match(v.rex) ){
            // value指定が無ければ候補に入れる
            if( typeof value === 'undefined' ){
              v.flag = true;
            } else {
              v.flag = false;
              for( v.x in value ){
                v.flag = false;
                // 比較対象となる値がない場合、空欄(空文字列)
                v.str = typeof p.value[v.i][v.x] === 'undefined' ? '' : String(p.value[v.i][v.x]);
                // マッチするなら値条件に合致と判断
                if( v.str.match(value[v.x]) ) v.flag = true;
              }
            }
            if( v.flag ){
              v.rv.push({num:v.i,raw:p.raw[v.i],path:p.path[v.i],value:p.value[v.i]});
            }
          }
        }
      } catch(e) {
        v.rv = szCatch(e,v);
      } finally {
        return szFinally(v);
      }
    })(v.rv.members,path,value)};  // search終了

    /** nearest: ベースノードの最寄の指定ノードを検索
     * @param {object} base
     * @param {string[]} base.path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [base.value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @param {object} destination
     * @param {string[]} destination.path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [destination.value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @returns {szTreeSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.2 nearest';
    v.rv.nearest = (base,destination) => {return ((p,base,destination)=>{
      const v = {whois:p.whois+'.nearest',rv:{degree:Infinity}};
      try {
        v.basenode = p.search(base.path,base.value);
        if( v.basenode.length !== 1 ){
          throw new Error('ベースノードが特定できません');
        }

        v.destination = p.search(destination.path,destination.value);

        for( v.i=0 ; v.i<v.destination.length ; v.i++ ){
          v.base = v.basenode[0].path.split('\t');
          v.dest = v.destination[v.i].path.split('\t');
          while( v.base.length > 0 && v.dest.length > 0 && v.base[0] == v.dest[0] ){
            v.base.shift();
            v.dest.shift();
          }
          v.destination[v.i].degree = v.base.length + v.dest.length;
          if( v.rv.degree > v.destination[v.i].degree ){
            v.rv = v.destination[v.i];
          }
        }
      } catch(e) {
        v.rv = szCatch(e,v);
      } finally {
        return szFinally(v);
      }
    })(v.rv.members,base,destination)};  // nearest終了

    v.step = '4.3'; // メソッドへの受渡用のメンバ変数のオブジェクトを作成
    const members = {whois:v.whois};
    Object.keys(v.rv).forEach(x => members[x] = v.rv[x]);
    v.rv.members = members;

    szLog([v.whois,szConf.log.normal],v.rv);  // szTree正常終了ログ
  } catch(e) {
    v.rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return szFinally(v);
  }
}

/** writefile: 指定テキストファイルを読み込み、行毎に分割
 * @param {string} arg - ファイル名
 * @returns {void} なし(null)
 */
const writefile = (filename,content) => {
  // v: 内部で使用する各種変数。エラー時に参照しやすいよう一元化
  const v = {whois:szConf.whois+'.writefile'}; // 関数名。開始/終了宣言等で使用
  // rv: 戻り値。Errorの場合は書き換えるのでletで宣言
  let rv = null;
  try {
    szLog([v.whois,szConf.log.start],filename,content); // 開始ログを出力

    v.fs = require('fs');
    v.content = v.fs.writeFileSync(filename,content,'utf-8');

    szLog([v.whois,szConf.log.normal],rv);  // 正常終了ログを出力
  } catch(e) {
    rv = szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return rv;
  }
}
if( szConf.environment === 'node' )  exports.writefile = writefile;