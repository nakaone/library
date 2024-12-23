/** genColumn: sdbColumnオブジェクトを生成
 * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
 * @returns {sdbColumn|Error}
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
function genColumn(arg={}){
  const v = {whois:`${pv.whois}.genColumn`,step:0,rv:{},
    typedef:[ // sdbColumnの属性毎にname,type,noteを定義
      {name:'name',type:'string',note:'項目名'},
      {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
      {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
      {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
      {name:'default',type:'number|string|boolean|Date',note:'既定値'},
      {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
      {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
      {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
        + '\n// null ⇒ 自動採番しない'
        + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
        + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
        + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
      },
      {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
      {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
    ],
    rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
  };
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${JSON.stringify(arg)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // rv.columnの準備
    // ------------------------------------------------
    if( typeof arg === 'object' ){
      v.step = 1.1; // 引数がオブジェクト(=sdbColumn)ならそのまま採用
      v.rv.column = arg;
      v.rv.note = {};
    } else {  // 文字列で与えられたらオブジェクトに変換

      v.step = 1.2; // コメントの削除、一行毎に分割
      v.lines = arg.replace(v.rex,'').split('\n');

      v.step = 1.3; // 一行毎に属性の表記かを判定
      v.rv.column = {};
      v.lines.forEach(prop => {
        v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+?)["']?$/);
        if( v.m ) v.rv.column[v.m[1]] = v.m[2];
      });

      v.step = 1.4; 
      if( Object.keys(v.rv.column).length === 0 ){
        // 属性項目が無ければ項目名と看做す
        v.rv.column = {name:arg.trim()};
        v.rv.note = {};
      } else {
        // 属性項目があればシート上のメモの文字列と看做す
        v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
      }
    }

    // ------------------------------------------------
    v.step = 2; // rv.column各メンバの値をチェック・整形
    // ------------------------------------------------
    v.step = 2.1; // 'null'はnullに変換
    Object.keys(v.rv.column).forEach(x => {
      if( v.rv.column[x] === 'null' ){
        v.rv.column[x]=null;
      } else if( whichType(v.rv.note,'Object') ){
        v.rv.note[x] = v.rv.column[x];
      }
    });

    v.step = 2.2; // defaultを関数に変換
    if( v.rv.column.default ){
      v.rv.column.default = functionalyze(v.rv.column.default);
    }
    if( v.rv.column.default instanceof Error ) throw v.rv.column.default;

    v.step = 2.3; // auto_incrementをオブジェクトに変換
    v.ac = {
      Array: x => {return {obj:{start:x[0],step:(x[1]||1)},str:JSON.stringify(x)}},  // [start,step]形式
      Number: x => {return {obj:{start:x,step:1},str:x}},  // startのみ数値で指定
      Object: x => {return {obj:x, str:JSON.stringify(x)}}, // {start:m,step:n}形式
      Null: x => {return {obj:false, str:'false'}}, // auto_incrementしない
      Boolean: x => {return x ? {obj:{start:1,step:1}, str:'true'} : {obj:false, str:'false'}}, // trueは[1,1],falseはauto_incrementしない
    };
    if( v.rv.column.auto_increment ){
      if( typeof v.rv.column.auto_increment === 'string' )
        v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
      v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
      v.rv.column.auto_increment = v.acObj.obj;
      // 開始値はstart+stepになるので、予め-stepしておく
      v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
      v.rv.note.auto_increment = v.acObj.str;
    }

    // ------------------------------------------------
    v.step = 3; // シートのメモに記載する文字列を作成
    // ------------------------------------------------
    if( typeof v.rv.note === 'object' ){
      v.x = [];
      v.typedef.map(x => x.name).forEach(x => {
        if( Object.hasOwn(v.rv.note,x) ){
          v.x.push(`${x}: "${v.rv.note[x]}"`);
        }
      });
      v.rv.note = v.x.join('\n');
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}