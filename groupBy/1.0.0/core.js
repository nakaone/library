/** オブジェクトの配列から指定項目でグルーピング、指定関数で処理した結果を返す
 * @param {Array.Object.<string, any>} data - オブジェクトの配列。SingleTable.dataを想定
 * @param {string[]} cols - グルーピングする項目の配列
 * @param {Function} [func=null] - グルーピング結果のオブジェクトの配列を処理する関数。nullならグルーピングのみ行う
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
function groupBy(data,cols,func=null){
  const v = {whois:'groupBy',step:0,rv:{},target:[]};
  try {

    v.step = 1; // グルーピング
    for( v.i=0 ; v.i<data.length ; v.i++ ){
      v.line = data[v.i]; // 処理対象とする単一オブジェクト
      v.model = v.rv; // データを格納するオブジェクト
      for( v.j=0 ; v.j<cols.length ; v.j++ ){
        v.col = cols[v.j];  // グルーピングする項目名
        if( !v.model.hasOwnProperty(v.line[v.col])){
          // 格納するオブジェクトが未定義なら追加定義＋計算対象リスト(v.target)に追加
          v.model[v.line[v.col]] = {raw:[],children:{}};
          v.target.push(v.model[v.line[v.col]]);
        }
        // rawに単一オブジェクトを追加
        v.model[v.line[v.col]].raw.push(v.line);
        // 格納先を子要素に変更
        v.model = v.model[v.line[v.col]].children;
      }
    }

    v.step = 2; // 指定関数で処理結果を計算
    if( typeof func === 'function' ){
      for( v.i=0 ; v.i<v.target.length ; v.i++ ){
        v.target[v.i].value = func(v.target[v.i].raw);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e) {
    console.error('%s abnormal end at step.%s\n%s\n'
    + 'data=%s|ncols=%s\n'
    + 'v=%s'
    ,v.whois,v.step,e.message
    ,JSON.stringify(data),JSON.stringify(cols)
    ,JSON.stringify(v));
    return e;
  }
}