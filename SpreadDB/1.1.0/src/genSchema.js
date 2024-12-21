/** genSchema: sdbSchemaオブジェクトを生成
 * @param arg {Object} - 対象テーブルのschemaオブジェクト
 * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
 * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
 * @param [arg.notes] {string[]} - 項目定義メモの配列
 * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
 * @returns {Object|Error}
 *
 * - 戻り値のオブジェクト
 *   - schema {sdbSchema}
 *   - notes {string[]} ヘッダ行に対応したメモ
 */
function genSchema(arg){
  const v = {whois:`${pv.whois}.genSchema`,step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    // ----------------------------------------------
    v.step = 1; // メンバの初期化、既定値設定
    // ----------------------------------------------
    v.rv = {
      schema: {
        cols: arg.cols || [], // {sdbColumn[]} 項目定義オブジェクトの配列
        primaryKey: 'id', // {string}='id' 一意キー項目名
        unique: {}, // {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
        auto_increment: {}, // {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
          // auto_incrementのメンバ : base {number} 基数, step {number} 増減値, current {number} 現在の最大(小)値
        defaultRow: {}, // {Object.<string,function>} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
      },
      notes: arg.notes || [], // ヘッダ行に対応したメモ
    };

    // -----------------------------------------------
    v.step = 2; // 項目定義オブジェクト(cols)の作成
    // -----------------------------------------------
    if( v.rv.schema.cols.length === 0 ){
      if( v.rv.notes.length > 0 ){
        v.step = 2.1; // シートにメモが存在していた場合、その内容から作成
        for( v.i=0 ; v.i<v.rv.notes.length ; v.i++ ){
          v.r = genColumn(v.rv.notes[v.i]);
          if( v.r instanceof Error ) throw v.r;
          v.rv.schema.cols.push(v.r.column);
        }
      } else {
        v.step = 2.2; // シートにメモが無かった場合、ヘッダ行の項目名から作成
        for( v.i=0 ; v.i<arg.header.length ; v.i++ ){
          v.r = genColumn(arg.header[v.i]);
          if( v.r instanceof Error ) throw v.r;
          v.rv.schema.cols.push(v.r.column);
          v.rv.notes.push(v.r.note);
        }
      }
    } else if( v.rv.notes.length === 0 ){
      v.step = 2.3; // 項目定義オブジェクトが渡された場合、notesのみを作成
      for( v.i=0 ; v.i<arg.cols.length ; v.i++ ){
        v.r = genColumn(arg.cols[v.i]);
        if( v.r instanceof Error ) throw v.r;
        v.rv.notes.push(v.r.note);
      }
    }

    // -----------------------------------------------
    v.step = 3; // v.rv.schema.cols以外のメンバ作成
    // -----------------------------------------------
    v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
      let rv={"true":true,"false":false}[String(arg).toLowerCase()];
      return typeof rv === 'boolean' ? rv : null
    };
    for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
      v.step = 3.1; // primaryKey
      if( v.bool(v.rv.schema.cols[v.i].primaryKey) === true ){
        v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
        v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
      }

      v.step = 3.2; // unique
      if( v.bool(v.rv.schema.cols[v.i].unique) === true ){
        v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
      }

      v.step = 3.3; // auto_increment
      // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
      if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
        v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
        v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].base;
      }

      v.step = 3.4; // default
      if( v.rv.schema.cols[v.i].default ){
        v.rv.schema.defaultRow[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].default;
      }
    }

    // ------------------------------------------------
    v.step = 4; // unique,auto_incrementの洗い出し
    // ------------------------------------------------
    arg.values.forEach(vObj => {
      v.step = 4.1; // unique項目の値を洗い出し
      Object.keys(v.rv.schema.unique).forEach(unique => {
        if( vObj[unique] ){
          if( v.rv.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
            v.rv.schema.unique[unique].push(vObj[unique]);
          } else {
            throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
          }
        }
      });

      v.step = 4.2; // auto_increment項目の値を洗い出し
      Object.keys(v.rv.schema.auto_increment).forEach(ai => {
        v.c = v.rv.schema.auto_increment[ai].current;
        v.s = v.rv.schema.auto_increment[ai].step;
        v.v = Number(vObj[ai]);
        if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
          v.rv.schema.auto_increment[ai].current = v.v;
        }
      });
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}