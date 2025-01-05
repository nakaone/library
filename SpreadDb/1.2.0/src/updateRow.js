/** updateRow: 領域に新規行を追加
 * @param {Object} arg
 * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
 * @param {Object|Function|string} arg.where - 対象レコードの判定条件
 * @param {Object|Function|string} arg.record - 更新する値
 * @returns {sdbLog[]}
 *
 * - where句の指定方法: functionalyze参照
 * - record句の指定方法
 *   - Object ⇒ {更新対象項目名:セットする値}
 *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
 *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
 */
function updateRow(arg={}){
  const v = {whois:`${pv.whois}.updateRow`,step:0,rv:[],
    top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
  };
  console.log(`${v.whois} start.`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------
    v.step = 1.1; // 引数whereの処理
    if( Object.hasOwn(arg,'where') && arg.where ){
      // 該当レコードかの判別用関数を作成
      v.where = functionalyze({table:arg.table,data:arg.where});
      if( v.where instanceof Error ) throw v.where;
    } else {
      throw new Error(`テーブル「${arg.table.name}」の更新で、対象(where)が指定されていません`);
    }

    v.step = 1.2; // 引数recordの処理
    if( Object.hasOwn(arg,'record') && arg.record ){
      // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
      // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
      v.r = (arg=>{
        if( whichType(arg,'Object')) return arg;
        try{return JSON.parse(arg)}catch{return null}
      })(arg.record);
      if( v.r !== null ){
        v.record = () => {return v.r};
      } else {
        // 更新する値を導出する関数を作成
        v.record = functionalyze({table:arg.table,data:arg.record});
        if( v.record instanceof Error ) throw v.record;
      }
    } else {
      throw new Error(`テーブル「${arg.table.name}」の更新で、更新値(record)が指定されていません`);
    }

    v.step = 1.3; // 更新履歴記録用に文字列化
    v.argStr = `{"where":"${toString(arg.where)}","record":"${toString(arg.record)}"}`;

    // ------------------------------------------------
    v.step = 2; // table.valuesを更新、ログ作成
    // ------------------------------------------------
    for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){

      v.step = 2.1; // 対象外判定ならスキップ
      if( v.where(arg.table.values[v.i]) === false ) continue;

      v.step = 2.2; // v.before(更新前の行オブジェクト),after,diffの初期値を用意
      [v.before,v.after,v.diff] = [arg.table.values[v.i],{},{}];

      v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
      v.rObj = v.record(arg.table.values[v.i]);

      v.step = 2.4; // 項目毎に値が変わるかチェック
      arg.table.header.forEach(x => {
        if( Object.hasOwn(v.rObj,x) && !isEqual(v.before[x],v.rObj[x]) ){
          v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
          v.after[x] = v.diff[x] = v.rObj[x];
          v.step = 2.42; // 更新対象範囲の見直し
          v.colNo = arg.table.header.findIndex(y => y === x);
          v.left = Math.min(v.left,v.colNo);
          v.right = Math.max(v.right,v.colNo);
        } else {
          v.step = 2.43; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
          v.after[x] = v.before[x];
        }
      });

      v.step = 2.5; // 更新履歴オブジェクトを作成
      v.log = genLog({
        table: arg.table.name,
        command: 'update',
        arg: v.argStr,
        isErr: false,
        before: v.before,
        after: v.after,
        diff: v.diff,
      });
      if( v.log instanceof Error ) throw v.log;

      v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
      for( v.unique in arg.table.schema.unique ){
        if( arg.table.schema.unique[v.unique].indexOf(v.where[v.unique]) >= 0 ){
          v.step = 2.61; // 登録済の場合はエラーとして処理
          v.log.isErr = true;
          // 複数項目のエラーメッセージに対応するため場合分け
          v.log.message = (v.log.message === null ? '' : '\n')
          + `${v.unique}欄の値「${v.where[v.unique]}」が重複しています`;
        } else {
          v.step = 2.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
          arg.table.schema.unique[v.unique].push(v.where[v.unique]);
        }
      }

      v.step = 2.7; // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
      if( v.log.isErr === false ){
        v.top = Math.min(v.top, v.i);
        v.bottom = Math.max(v.bottom, v.i);
        arg.table.values[v.i] = v.after;
      }

      v.step = 2.8; // 成否に関わらずログ出力対象に保存
      v.rv.push(v.log);
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    v.step = 3.1; // シートイメージ(二次元配列)作成
    v.target = [];
    for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
      v.row = [];
      for( v.j=v.left ; v.j<=v.right ; v.j++ ){
        v.row.push(arg.table.values[v.i][arg.table.header[v.j]] || null);
      }
      v.target.push(v.row);
    }

    v.step = 3.2; // シートに展開
    // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
    // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
    if( v.target.length > 0 || (v.target.length === 1 && v.target[0].length === 0) ){
      arg.table.sheet.getRange(
        v.top +2,  // +1(添字->行番号)+1(ヘッダ行)
        v.left +1,  // +1(添字->行番号)
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
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