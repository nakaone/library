/** updateRow: 領域に新規行を追加
 * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
 * @param {Object|Function|any} trans.where - 対象レコードの判定条件
 * @param {Object|Function} trans.record - 更新する値
 * @returns {sdbLog[]}
 *
 * - where句の指定方法
 *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
 *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
 *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
 * - record句の指定方法
 *   - Object ⇒ {更新対象項目名:セットする値}
 *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
 *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
 */
function updateRow(trans=[]){
  const v = {whois:'sdbTable.updateRow',step:0,rv:[],log:[],target:[],
    top:Infinity,left:Infinity,right:0,bottom:0,argument:JSON.stringify(trans),
    header: pv.schema.cols.map(x => x.name), // 項目一覧
  };
  console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------

    if( !Array.isArray(trans)) trans = [trans];

    // 対象となる行オブジェクト判定式の作成
    for( v.i=0 ; v.i<trans.length ; v.i++ ){

      v.step = 1.1; // where,recordの存否確認
      v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
      if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
      if( !trans[v.i].record ) throw new Error(v.msg.replace('_','更新データ(record)'));

      v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
      v.where = pv.functionalize(trans[v.i].where);
      if( v.where instanceof Error ) throw v.where;

      v.step = 1.3; // recordがオブジェクトなら関数化
      v.record = typeof trans[v.i].record === 'function' ? trans[v.i].record
      : new Function('o',`return ${JSON.stringify(trans[v.i].record)}`);

      // 対象レコードか一件ずつチェック
      for( v.j=0 ; v.j<pv.values.length ; v.j++ ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( v.where(pv.values[v.j]) === false ) continue;

        v.step = 2.2; // v.before: 更新前の行オブジェクトのコピー
        [v.before,v.after,v.diff] = [Object.assign({},pv.values[v.j]),{},{}];

        v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
        v.rObj = v.record(pv.values[v.j]);

        v.step = 2.4; // シート上の項目毎にチェック
        v.header.forEach(x => {
          if( Object.hasOwn(v.rObj,x) && !isEqual(v.before[x],v.rObj[x]) ){
            v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
            v.after[x] = v.diff[x] = v.rObj[x];
            v.colNo = v.header.findIndex(y => y === x);
            v.left = Math.min(v.left,v.colNo);
            v.right = Math.max(v.right,v.colNo);
          } else {
            v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
            v.after[x] = v.before[x];
          }
        })

        v.step = 2.5; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:pv.account,range:pv.name,
          action:'update',argument:v.argument,before:v.before,after:v.after,diff:v.diff});

        v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in pv.schema.unique ){
          if( pv.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
            v.step = 2.61; // 登録済の場合はエラーとして処理
            v.logObj.result = false;
            // 複数項目のエラーメッセージに対応するため場合分け
            v.logObj.message = (v.logObj.message === null ? '' : '\n')
            + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
          } else {
            v.step = 2.62; // 未登録の場合pv.sdbSchema.uniqueに値を追加
            pv.schema.unique[v.unique].push(trans[v.i][v.unique]);
          }
        }

        v.step = 2.7; // 正当性チェックOKの場合の処理
        if( v.logObj.result === true ){
          v.top = Math.min(v.top, v.j);
          v.bottom = Math.max(v.bottom, v.j);
          pv.values[v.j] = v.after;
        }

        v.step = 2.8; // 成否に関わらずログ出力対象に保存
        v.log.push(v.logObj);
      }
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    v.step = 3.1; // シートイメージ(二次元配列)作成
    for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
      v.row = [];
      for( v.j=v.left ; v.j<=v.right ; v.j++ ){
        v.row.push(pv.values[v.i][v.header[v.j]] || null);
      }
      v.target.push(v.row);
    }
    vlog(v,['target','top','left'],1022)

    v.step = 3.2; // シートに展開
    // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
    // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
    if( v.target.length > 0 ){
      pv.sheet.getRange(
        pv.top + v.top +1,  // +1(添字->行番号)
        pv.left + v.left,
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
    }

    v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
    if( pv.log !== null && v.log.length > 0 ){
      v.r = pv.log.append(v.log);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    v.rv = v.log;
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}