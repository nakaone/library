/** typedef.js : オブジェクトとして指定されたtypedefをMarkdown/JSDocとして出力
 * @exsample
 * node typedef.js -o:$tmp/typedef
 * node typedef.js authScriptProperties > ~/Desktop/tmp/authScriptProperties.md
 */

/**
 * @typedef {Object} Item - 各項目の定義
 * @prop {string} name - 項目名
 * @prop {string} type - JavaScriptのデータ型
 * @prop {string} [desc] - 当該項目の説明
 * @prop {string} [default] - 既定値。クォーテーションも付加のこと。
 * @prop {boolean} [optional=true] - 任意項目ならfalse。defaultが設定されたら強制的にfalseに設定
 */

/**
 * @typedef {Object} DataType - データ型の定義
 * @prop {string} [type='Object'] - JavaScriptのデータ型
 * @prop {string|string[]} [desc] - 当該項目の説明、補足。配列なら箇条書きする
 * @prop {Item[]} prop - 項目
 */
const typedef = {
  authScriptProperties: {
    desc:'キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。',
    prop:[
      {name:'keyGeneratedDateTime',type:'number',desc:'UNIX時刻'},
      {name:'SPkey',type:'string',desc:'PEM形式の公開鍵文字列'},
      {name:'SSkey',type:'string',desc:'PEM形式の秘密鍵文字列（暗号化済み）'},
    ],
  }
}

/** mdBody: Markdown文書の作成 */
function mdBody(dName,obj){
  const dObj = JSON.parse(JSON.stringify(obj));
  const rv = [`\n<a name="${dName}"></a>\n`];  // 先頭の空白行

  // データ型定義に関する説明文
  if( dObj.desc ){
    if( typeof dObj.desc === 'string' ){
      rv.push(dObj.desc);
    } else {
      dObj.desc.forEach(x => rv.push(`- ${x}`));
    }
    rv.push('');
  }

  // 項目一覧の出力
  const rows = [
    ['No','項目名','任意','データ型','既定値','説明'],
    ['--:',':--',':--:',':--',':--',':--'],
  ];
  dObj.prop.forEach(o => {
    o.isOpt = o.isOpt ? '⭕' : '❌';
    o.default = o.default ? String(o.default) : '—';
    rows.push([o.num,o.name,o.isOpt,o.type,o.default,o.desc]);
  });
  rows.forEach(o => {
    rv.push(`| ${o.join(' | ')} |`);
  });

  rv.push('');  // 末尾の空白行
  return rv.join('\n');
}

/** jsdBody: JSDocの作成 */
function jsdBody(dName,obj){
  const dObj = JSON.parse(JSON.stringify(obj));
  const rv = ['/**'];

  // データ型定義に関する説明文
  dObj.type = dObj.type || 'Object';
  dObj.desc = dObj.desc ? ' - ' + [dObj.desc].join('\n * ') : '';
  dObj.prop = dObj.prop || [],
  rv.push(` * @typedef {${dObj.type}} ${dName}${dObj.desc}`);

  // 項目一覧の出力
  dObj.prop.forEach(o => {
    o.default = o.default === '' ? ''
      : (typeof o.default === 'string' ? `"${o.default}"` : String(o.default));
    o.name = o.default ? `${o.name}=${o.default}` : o.name;
    o.name = o.isOpt ? `[${o.name}]` : o.name;
    o.desc = o.desc ? ` - ${o.desc}` : o.desc;
    rv.push(` * @prop {${o.type}} ${o.name}${o.desc}`);
  });
  rv.push(' */');

  return rv.join('\n');
}
/** メイン処理 */
const fs = require("fs");
function main(){
  const arg = analyzeArg();
  //console.log(JSON.stringify(arg,null,2));

  Object.keys(typedef).forEach(x => {
    // 各項目の既定値設定
    for( let i=0 ; i<typedef[x].prop.length ; i++ ){
      typedef[x].prop[i] = Object.assign({
        num : i+1,
        isOpt: typedef[x].prop[i].default ? true : (typedef[x].prop[i].isOpt || false),
        default: '',
        desc: '',
      },typedef[x].prop[i]);
    }

    try {
      fs.writeFileSync(`${arg.opt.o}/${x}.md`, mdBody(x,typedef[x]));
      fs.writeFileSync(`${arg.opt.o}/${x}.js`, jsdBody(x,typedef[x]));
      console.log(`write end : ${x}`);
    }catch(e){
      console.log(e);
    }
  });
}
main();

/**
 * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 *
 * @example
 *
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 *
 * <caution>注意</caution>
 *
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 *
 * @param {void} - なし
 * @returns {AnalyzeArg} 分析結果のオブジェクト
 */
function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}