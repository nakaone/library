/** オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す
 * @param {Array.Object.<string, any>} data - オブジェクトの配列。SingleTable.dataを想定
 * @param {string[]} cols - 分類項目(グルーピングする項目の配列)
 * @param {Object} [opt={}] - オプション
 * @param {any} [opt.empty=null] - 分類項目の値が空欄(ex.科目が空欄)の場合に設定する値
 * @param {Function} [opt.func=null] - 集計用の関数。詳細は補足参照
 * @param {boolean} [opt.classify=false] - trueなら結果の配列(v.rv.arr)に分類行を含める
 * @param {Symbol} [opt.level=Symbol('level')] - arr内オブジェクトのlevelメンバの名称を指定するシンボル。
 * @return {Object|Error} 
 * 
 * - 集計用関数に関する補足
 *   - 未指定の場合、rv.arrには分類項目(引数colsに指定した項目)のみセットして返す
 *   - rv.arr/treeとも分類項目はシステム側で自動的に追加される
 *     - 集計用関数の戻り値には、原則として分類項目を含めない
 *     - 例外的に指定した場合、戻り値では集計用関数で設定した値が優先される
 * - 戻り値の構造
 *   - opt {Object} 実際に適用されたオプションの値
 *   - tree {Object} 分析結果のオブジェクト
 *     - 分類項目の値(ex.BS)
 *       - level {number} 分類行を出力する場合、そのレベル(最高位0、引数colsの添字)
 *       - cols {Object.<string,any>} 分類項目名：その値
 *       - raw {Object[]} 該当する行オブジェクトの配列
 *       - children {Object} 下位分類のオブジェクト
 *       - value {Object.<string,any>} 集計関数が指定された場合、その結果
 *   - arr {Object[]} シートイメージ
 *   - level {Symbol} arr内オブジェクトのlevelメンバの名称を指定するシンボル
 */
function groupBy(data,cols,opt={}){
  const v = {whois:'groupBy',step:0,rv:{tree:{},arr:[]},
    target:[],  // 集計処理を行うオブジェクトのリスト
    empty:null, // 空欄の場合に設定する値
    makeSheet:(obj) => {  // ツリー構造のグルーピング結果を配列に変換
      let rv = [];
      // 分類行出力指定あり、または出力指定なしだが分類行ではない場合
      if( opt.classify || !opt.classify && obj.level === (cols.length-1)){
        const o = {...obj.cols, ...obj.value};
        if( Object.keys(o).length > 0 ){
          o[v.rv.level] = obj.level; // Symbolなので要別途追加
          rv.push(o);
        }
      }
      // 子要素があれば再帰呼出
      if( obj.hasOwnProperty('children') ){
        for( let key in obj.children ){
          rv = [...rv, ...v.makeSheet(obj.children[key])];
        }
      }
      return rv;
    },
  };
  try {

    v.step = 1; // オプションの既定値を設定
    opt.empty = opt.empty || null;
    opt.func = opt.func || null;
    opt.classify = opt.classify || false;
    opt.tree = opt.tree || false;
    opt.hasLevel = opt.level ? true : false;  // opt.levelが存在したか
    v.rv.level = opt.level || Symbol('level');
    v.rv.opt = opt;
    console.log(`l.289 opt=${JSON.stringify(opt)}`);

    v.step = 2; // グルーピング
    for( v.i=0 ; v.i<data.length ; v.i++ ){
      v.line = data[v.i]; // 処理対象とする一行分のデータ
      v.model = v.rv.tree; // データを格納するオブジェクト
      v.cols = {};
      for( v.j=0 ; v.j<cols.length ; v.j++ ){
        v.col = cols[v.j];  // グルーピングする項目名
        if( !v.line[v.col] ) v.line[v.col] = opt.empty; // 値未定の場合
        v.cols[cols[v.j]] = v.line[v.col];  // グルーピング項目のオブジェクト
        if( !v.model.hasOwnProperty(v.line[v.col])){
          // 格納するオブジェクトが未定義なら追加定義＋計算対象リスト(v.target)に追加
          v.model[v.line[v.col]]
          = {level:v.j,cols:{...v.cols},raw:[],children:{}};
          v.target.push(v.model[v.line[v.col]]);
        }
        // rawに単一オブジェクトを追加
        v.model[v.line[v.col]].raw.push(v.line);
        // [重要]格納先を子要素に変更
        v.model = v.model[v.line[v.col]].children;
      }
    }

    v.step = 3; // 指定関数で処理結果を計算
    if( typeof opt.func === 'function' ){
      for( v.i=0 ; v.i<v.target.length ; v.i++ ){
        v.target[v.i].value = opt.func(v.target[v.i].raw);
      }
    }

    v.step = 4; // グルーピング結果をシートに変換
    v.rv.arr = v.makeSheet({children:v.rv.tree});

    v.step = 5; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\ncols=${JSON.stringify(cols)}`  // 引数
    + `\ndata.length=${data.length}, opt=${JSON.stringify(opt)}`
    + `\ndata(Max.10)=${JSON.stringify(data.slice(0,10))}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}