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
  const v = {whois:'SpreadDb.genColumn',step:0,rv:{column:{},note:null},
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
    str2obj: (arg) => {
      const v = {whois:`${pv.whois}.genColumn.str2obj`,step:0,rv:null,
        rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
        isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
      };
      try {

        v.step = 1; // コメントの削除
        arg = arg.replace(v.rex,'');

        v.step = 2; // JSONで定義されていたらそのまま採用
        v.rv = v.isJSON(arg);

        if( v.rv === null ){
          v.step = 3; // 非JSON文字列だった場合、改行で分割
          v.lines = arg.split('\n');

          v.step = 4; // 一行毎に属性の表記かを判定
          v.rv = {};
          v.lines.forEach(prop => {
            v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+?)["']?$/);
            if( v.m ) v.rv[v.m[1]] = v.m[2];
          });

          v.step = 5; // 属性項目が無ければ項目名と看做す
          if( Object.keys(v.rv).length === 0 ){
            v.rv = {name:arg.trim()};
          }
        }

        v.step = 9; // 終了処理
        return v.rv;

      } catch(e) {
        e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
        console.error(`${e.message}\nv=${stringify(v)}`);
        return e;
      }
    },
  };
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
    if( whichType(arg,'String') ){
      arg = v.str2obj(arg);
      if( arg instanceof Error ) throw arg;
      v.rv.note = arg;
    }

    v.step = 2; // メンバに格納
    v.typedef.map(x => x.name).forEach(x => {
      v.rv.column[x] = arg.hasOwnProperty(x) ? arg[x] : null;
    });

    v.step = 3; // defaultを関数に変換
    v.rv.column.default = ( v.rv.column.default !== null
      && typeof v.rv.column.default === 'string'
      && v.rv.column.default !== 'null'
      && v.rv.column.default !== 'undefined'
    ) ? new Function('o',v.rv.column.default) : null;

    v.step = 4; // auto_incrementをオブジェクトに変換
    if( v.rv.column.auto_increment !== null && String(v.rv.column.auto_increment).toLowerCase() !== 'false' ){
      switch( whichType(v.rv.column.auto_increment) ){
        case 'Array': v.rv.column.auto_increment = {
          base: v.rv.column.auto_increment[0],
          step: v.rv.column.auto_increment[1],
        }; break;
        case 'Number': v.rv.column.auto_increment = {
          base: Number(v.rv.column.auto_increment),
          step: 1,
        }; break;
        default: v.rv.column.auto_increment = {
          base: 1,
          step: 1,
        };
      }
    } else {
      v.rv.column.auto_increment = false;
    }

    v.step = 4; // メモの文字列を作成
    if( v.rv.note === null ){
      v.x = [];
      for( v.a in v.rv.column ){
        v.l = `${v.a}: "${v.rv.column[v.a]}"`;
        v.c = v.typedef.find(x => x.name === v.a);
        if( v.c.hasOwnProperty('note') ) v.l += ` // ${v.c.note}`;
        v.x.push(v.l);
      }
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