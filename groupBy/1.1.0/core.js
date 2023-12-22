/** オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す
 * @param {Array.Object.<string, any>} data - オブジェクトの配列。SingleTable.dataを想定
 * @param {string[]} cols - 分類項目(グルーピングする項目の配列)
 * @param {Object} [opt={}] - オプション
 * @param {any} [opt.empty=null] - 分類項目の値が空欄(ex.科目が空欄)の場合に設定する値
 * @param {Function} [opt.func=null] - 集計用の関数。未指定(null)ならグルーピングのみ行い、ツリー構造を返す。
 * なお集計用関数の戻り値には、原則として分類項目(opt.colsに指定した項目)を含めてはならない
 * (∵システム側で自動的に追加)。
 * 例外的に指定した場合は集計用関数で設定した値が優先される。
 * @param {boolean} [classify=false] - trueなら結果の配列(v.rv.arr)に分類行を含める
 * @param {boolean} [tree=false] - trueなら戻り値にツリー構造のグルーピング結果(v.rv.tree)を含める。
 * なお集計算数未指定(opt.func=null)の場合の既定値はtrueとする。
 * @param {Symbol} [level=Symbol('level')] - arr内オブジェクトのlevelメンバの名称を指定するシンボル。
 * @return {Object|any[][]|Error} 通常はオブジェクトを、特定条件を満たす場合はシートイメージを返す。詳細はexample参照
 * 
 * @example
 * 
 * サンプルシート
 * 
 * 表 | 科目 | 本体 | 合計
 * :-- | :-- | --: | --:
 * BS | 現金 | 50000000 | 50000000
 * BS | 資本金 | 50000000 | 50000000
 * CF | 資本金 | 50000000 | 50000000
 * PL | 旅費交通費 | 340 | 340
 * BS | 現金 | -340 | -340
 * 
 * サンプルデータ
 * 
 * ```
 * [
 *   {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
 *   {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
 *   {"表":"CF","科目":"資本金","本体":50000000,"合計":50000000},
 *   {"表":"PL","科目":"旅費交通費","本体":340,"合計":340},
 *   {"表":"BS","科目":"現金","本体":-340,"合計":-340}
 * ]
 * ```
 * 
 * スクリプト
 * 
 * ```
 * v.r = groupBy(v.t.data,['表','科目'],arr=>{
 *   let rv = {'本体':0,'合計':0};
 *   for( let i=0 ; i<arr.length ; i++ ){
 *     rv['本体'] += arr[i]['本体'];
 *     rv['合計'] += arr[i]['合計'];
 *   }
 *   return rv;
 * });
 * console.log(JSON.stringify(v.r));
 * ```
 * 
 * 通常の戻り値
 * 
 * - tree 
 *   - 分類項目の値(ex.BS)
 *     - level
 *     - cols
 *     - raw
 *     - children
 *     - value
 * - arr {Object[]}
 * - level {Symbol} arr内オブジェクトのlevelメンバの名称を指定するシンボ
 * 
 * classify=trueかつlevel無指定ならarrをオブジェクトとしてarr.dataにデータを、
 * arr.levelにプログラム内で採番したシンボルを設定する。
 *     // 以下の条件を満たす場合、v.rv.arr(シートイメージ)を戻り値とする
 *     // ツリー構造のグルーピング結果は不要(opt.tree=false)
 *    // and (呼出元からv.rv.arr.levelのシンボルを渡された(opt.hasLevel=true)
 *    //   or 分類行不要の指定(opt.classify=false)なのでレベル情報が不要)
 * 
 * 結果(JSON)
 * 
 * ```
 * {
 *   "BS":{
 *     "raw":[  // 表=BSの全レコード
 *       {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
 *       {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000},
 *       {"表":"BS","科目":"現金","本体":-340,"合計":-340}
 *     ],
 *     "children":{
 *       "現金":{  // 表=BS、科目=現金
 *         "raw":[  // 表=BS、科目=現金の全レコード
 *           {"表":"BS","科目":"現金","本体":50000000,"合計":50000000},
 *           {"表":"BS","科目":"現金","本体":-340,"合計":-340}
 *         ],
 *         "children":{},
 *         "value":{"本体":49999660,"合計":49999660}  // 引数で指定した関数の処理結果
 *       },
 *       "資本金":{  // 表=BS、科目=資本金
 *         "raw":[
 *           {"表":"BS","科目":"資本金","本体":50000000,"合計":50000000}
 *         ],
 *         "children":{},
 *         "value":{"本体":50000000,"合計":50000000}
 *       }
 *     },
 *     "value":{"本体":99999660,"合計":99999660}
 *   },
 *   "CF":{
 *     "raw":[{"表":"CF","科目":"資本金","本体":50000000,"合計":50000000}],
 *     "children":{
 *       "資本金":{
 *         "raw":[{"表":"CF","科目":"資本金","本体":50000000,"合計":50000000}],
 *         "children":{},
 *         "value":{"本体":50000000,"合計":50000000}
 *       }
 *     },
 *     "value":{"本体":50000000,"合計":50000000}
 *   },
 *   "PL":{
 *     "raw":[{"表":"PL","科目":"旅費交通費","本体":340,"合計":340}],
 *     "children":{
 *       "旅費交通費":{
 *         "raw":[{"表":"PL","科目":"旅費交通費","本体":340,"合計":340}],
 *         "children":{},
 *         "value":{"本体":340,"合計":340}
 *       }
 *     },
 *     "value":{"本体":340,"合計":340}
 *   }
 * }
 * ```
 */
function groupBy(data,cols,opt={}){
  const v = {whois:'groupBy',step:0,rv:{tree:{},arr:[]},
    target:[],  // 集計処理を行うオブジェクトのリスト
    empty:null, // 空欄の場合に設定する値
    makeSheet:(obj) => {  // ツリー構造のグルーピング結果を配列に変換
      let rv = [];
      if( obj.hasOwnProperty('value') // メンバvalueが存在
        && (opt.classify // 分類行を含めて出力の指定
        // または分類行は含まない指定だが、対象が分類行ではない
        || !opt.classify && obj.level === (cols.length - 1))
      ){
        const o = {...obj.cols, ...obj.value};
        o[v.rv.level] = obj.level; // Symbolなので要別途追加
        rv.push(o);
      }
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
    opt.tree = opt.tree || opt.func === null;
    opt.hasLevel = opt.level ? true : false;  // v.rv.levelが存在したか
    v.rv.level = opt.level || Symbol('level');

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
    if( !opt.tree && (opt.hasLevel || !opt.classify) ){
      // 以下の条件を満たす場合、v.rv.arr(シートイメージ)を戻り値とする
      // ツリー構造のグルーピング結果は不要(opt.tree=false)
      // and (呼出元からv.rv.arr.levelのシンボルを渡された(opt.hasLevel=true)
      //   or 分類行不要の指定(opt.classify=false)なのでレベル情報が不要)
      return v.rv.arr;
    } else {
      if( !opt.tree ) delete v.rv.tree;
      return v.rv;
    }

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\ncols=${JSON.stringify(cols)}`
    + `\ndata.length=${data.length}, opt=${JSON.stringify(opt)}`
    + `\ndata(Max.10)=${JSON.stringify(data.slice(0,10))}`  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}