/** updateRow: 領域に新規行を追加
 * @param {Object} any
 * @param {sdbTable} any.table - 操作対象のテーブル管理情報
 * @param {Object|Object[]} any.query
 * @param {Object|Function|any} any.query.where - 対象レコードの判定条件。配列可
 * @param {Object|Function|any} any.query.record - 更新する値
 * @returns {sdbLog[]}
 *
 * - where句の指定方法
 *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
 *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
 *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
 * - record句の指定方法
 *   - Object ⇒ {更新対象項目名:セットする値}
 *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
 *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
 */
function updateRow(any){
  const v = {whois:'sdbTable.updateRow',step:0,rv:[],
    top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
  };
  console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
  try {

    v.step = 1.1; // 事前準備 : 引数を配列化
    if( !Array.isArray(arg.query.where)) arg.query.where = [arg.query.where];

    v.step = 1.2; // 該当レコードかの判別用関数を作成
    for( v.i=0 ; v.i<arg.query.where.length ; v.i++ ){
      v.queryStr = toString(arg.query[v.i].where); // 更新履歴記録用に文字列化
      arg.query[v.i].where = determineApplicable(arg.query[v.i].where);
      if( arg.query[v.i].where instanceof Error ) throw arg.query[v.i].where;
    }

    v.step = 1.3; // 複数あるwhereのいずれかに該当する場合trueを返す関数を作成
    v.cond = o => {let rv = false;arg.query.where.forEach(w => {if(w(o)) rv=true});return rv};

    v.step = 1.4; // 更新する値を導出する関数を作成
    // object: {欄名:値}のオブジェクト
    // string: 引数'o'を行オブジェクトとし、上述のobjectを返す関数のソース部分
    for( v.i=0 ; v.i<arg.query.record.length ; v.i++ ){
      v.recordStr[v.i] = toString(arg.query.record[v.i]); // 更新履歴記録用に文字列化
      arg.query.record[v.i] = typeof arg.query.record[v.i] === 'function' ? arg.query.record[v.i]
      : new Function('o',(typeof arg.query.record[v.i] === 'string'
        ? arg.query.record[v.i] : JSON.stringify(arg.query.record[v.i])));
    }

    v.step = 2; // 対象となる行オブジェクト判定式の作成
    for( v.i=0 ; v.i<arg.query.length ; v.i++ ){

      v.step = 2.1; // where,recordの存否確認
      v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(arg.query[v.i].where)})`;
      if( !arg.query[v.i].where.where ) throw new Error(v.msg.replace('_','位置指定(where)'));
      if( !arg.query[v.i].where.record ) throw new Error(v.msg.replace('_','更新データ(record)'));

      v.step = 2.2; // 該当レコードかの判別用関数を作成
      v.queryStr = toString(arg.query[v.i].query); // 更新履歴記録用に文字列化
      arg.query[v.i].where = determineApplicable(arg.query[v.i].where);
      if( arg.query[v.i].where instanceof Error ) throw arg.query[v.i].where;

      v.step = 2.3; // 更新する値を導出する関数を作成
      // object: {欄名:値}のオブジェクト
      // string: 引数'o'を行オブジェクトとし、上述のobjectを返す関数のソース部分
      arg.query.record[v.i] = typeof arg.query.record[v.i] === 'function'
      ? arg.query.record[v.i] // 関数ならそのまま
      : new Function('o',(typeof arg.query.record[v.i] === 'string'
      ? arg.query.record[v.i] // 文字列なら導出関数のソース
      : JSON.stringify(arg.query.record[v.i])));  // オブジェクトならそのまま返す関数


      // 対象レコードか一件ずつチェック
      for( v.j=0 ; v.j<arg.table.values.length ; v.j++ ){

        v.step = 3.1; // 対象外判定ならスキップ
        if( v.where(arg.table.values[v.j]) === false ) continue;

        v.step = 3.2; // v.before: 更新前の行オブジェクトのコピー
        [v.after,v.diff] = [{},{}];

        v.step = 3.3; // v.rObj: 更新指定項目のみのオブジェクト
        v.rObj = v.record(arg.table.values[v.j]);

        v.step = 3.4; // シート上の項目毎にチェック
        arg.table.header.forEach(x => {
          if( v.rObj.hasOwnProperty(x) && !isEqual(v.before[x],v.rObj[x]) ){
            v.step = 3.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
            v.after[x] = v.diff[x] = v.rObj[x];
            v.step = 3.42; // 更新対象範囲の見直し
            v.colNo = arg.table.header.findIndex(y => y === x);
            v.left = Math.min(v.left,v.colNo);
            v.right = Math.max(v.right,v.colNo);
          } else {
            v.step = 3.43; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
            v.after[x] = v.before[x];
          }
        })

        v.step = 3.5; // 更新履歴オブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'update',
          arg: v.queryStr,
          result: true,
          before: arg.table.values[v.i],
          after: v.after,
          diff: v.diff,
        });
        if( v.log instanceof Error ) throw v.log;
        v.rv.push(v.log);
  
        v.step = 3.6; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(arg.query[v.i].where[v.unique]) >= 0 ){
            v.step = 3.61; // 登録済の場合はエラーとして処理
            v.log.result = false;
            // 複数項目のエラーメッセージに対応するため場合分け
            v.log.message = (v.log.message === null ? '' : '\n')
            + `${v.unique}欄の値「${arg.query[v.i].where[v.unique]}」が重複しています`;
          } else {
            v.step = 3.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.query[v.i].where[v.unique]);
          }
        }

        v.step = 3.7; // 正当性チェックOKの場合の処理
        if( v.log.result === true ){
          v.top = Math.min(v.top, v.j);
          v.bottom = Math.max(v.bottom, v.j);
          arg.table.values[v.j] = v.after;
        }

        v.step = 2.8; // 成否に関わらずログ出力対象に保存
        v.rv.push(v.log);
      }
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    v.step = 3.1; // シートイメージ(二次元配列)作成
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
    if( v.target.length > 0 ){
      arg.table.sheet.getRange(
        v.top +1,  // +1(添字->行番号)
        v.left,
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}