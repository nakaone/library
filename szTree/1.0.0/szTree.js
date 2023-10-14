/* コアスクリプト */
/**
 * @typedef {object} szTreeObj - szTreeの戻り値
 * @prop {any[]} keys - ヘッダ行(ヘッダ部)の一次元配列
 * @prop {string} stColName - 分類開始列の項目名
 * @prop {number} stColNum - 分類開始列の添字(≧0)
 * @prop {string} edColName - 分類終了列の項目名
 * @prop {number} edColNum - 分類終了列の添字(≧0)
 * @prop {string[]} valid - 取得対象となった列名の配列
 * @prop {Object.<string,object|any>} tree - 階層化した項目名：値のオブジェクト。
 * 取得項目が単一ならオブジェクトでは無く、当該項目の値
 * @prop {object} members - メンバ・メソッドへの参照
 * ※以下は行単位のデータの配列
 * @prop {any[][]} raw - 分類列の欠損を埋めた状態の行データの配列
 * @prop {string[]} path - 行単位に分類列の文字列をタブで結合した文字列。分類列範囲全項目空白の場合はnull
 * @prop {Object.<string,any>} value - 行単位に分類列以外の項目の値を保持する配列
 * @prop {Object.<string,number>} label - 項目名->添字のインデックス。項目名は重複があるので配列形式
 * ※以下はメソッド
 * @prop {function} search - メソッド。項目名'key'の値がvalueである行Objを全て検索
 * @prop {function} nearest - メソッド。ベースノードの最寄の指定ノードを検索
 */
/** szTree: Googleスプレッド上でツリー構造を持つ二次元配列の検索
 *
 * 1. search: 項目名'key'の値がvalueである行Objを全て検索
 * 2. nearest: ベースノードの最寄の指定ノードを検索
 *
 * @desc <caption>シート作成上の注意</caption>
 * <ol>
 * <li>子孫を持つノードは値を持っていてはならない(下表の"a","aa")
 * <li>分類列範囲において階層を飛ばしてはならない(下表の最下行。lv01,03:ありで中間のlv02:なしはNG)
 * </ol>
 * @param {any[]} [arg.keys] - ヘッダ行(ヘッダ部)の一次元配列。未定義の場合、rawの先頭行をヘッダ行と見做す
 * @param {any[][]} arg.raw - データ部の二次元配列
 * @param {number|string} arg.stCol - 分類の開始列番号(≧0)、または項目名
 * @param {number|string} arg.edCol - 分類の終了列番号(≧0)、または項目名
 * @param {string|string[]} [arg.valid] - データとして取得したい項目名。省略すると分類範囲列以外の全項目。
 * 文字列の場合は単一と見做し、戻り値もオブジェクトではなく当該項目の値となる。
 *
 * @returns {szTreeObj} 変換結果
 * @example
 *
 * lv01 | lv02 | lv03 | value | note
 * :--  | :--  | :--  | --:   | :--
 * a    |      |      |       |
 *      | aa   |      |       | aa_note
 *      |      | aaa  | 1     |
 *      |      | aab  | 2     |
 * b    |      |      | 3     | b_note
 *      |      | ba   | 4     | NGのサンプル(実際は削除して実行)
 *
 * const c = szSheet('TEST');
 * const raw = JSON.parse(JSON.stringify(c.raw));
 * raw.splice(0,1);　※データ部のみ抽出
 * szLib.szTree({keys:c.keys,raw:raw,stCol:'lv01',edCol:'lv03',valid:'value'});
 * ⇒ {  ※メソッドは省略
 *   "keys":["lv01","lv02","lv03","value","note"],
 *   "raw":[
 *     ["a","","","",""],
 *     ["a","aa","","","aa_note"],
 *     ["a","aa","aaa",1,""],
 *     ["a","aa","aab",2,""],
 *     ["b","","",3,""]
 *   ],
 *   "path":["a","a\taa","a\taa\taaa","a\taa\taab","b"],
 *   "value":[{},{},{"value":1},{"value":2},{"value":3}],
 *   "label":{"a":[0],"aa":[1],"aaa":[2],"aab":[3],"b":[4]},
 *   "tree":{"a":{"aa":{"aaa":1,"aab":2}},"b":3},
 *   "stColNum":0,
 *   "edColNum":2,
 *   "stColName":"lv01",
 *   "edColName":"lv03",
 *   "valid":["value"],
 *   "members":{(略)}
 * }
 */
function szTree(arg){
  const v = {whois:'szTree',arg:arg,rv:{
    keys:arg.keys,raw:arg.raw,path:[],value:[],label:{},tree:{}}};
  try {

    // 1.事前準備
    v.step = '1.1'; // ヘッダ行未定義の場合はrawの先頭行
    if( typeof arg.keys === 'undefined' ){
      v.rv.keys = v.rv.raw.splice(0,1);
    }
    v.step = '1.2'; // 分類列範囲の設定
    v.rv.stColNum = typeof arg.stCol === 'number' ? arg.stCol
      : v.arg.keys.findIndex(x => x == arg.stCol );
    v.rv.edColNum = typeof arg.edCol === 'number' ? arg.edCol
      : v.arg.keys.findIndex(x => x == arg.edCol );
    if( v.rv.stColNum > v.rv.edColNum ){  // st>edなら交換
      [v.rv.stColNum,v.rv.edColNum] = [v.rv.edColNum,v.rv.stColNum];
    }
    v.rv.stColName = v.rv.keys[v.rv.stColNum];
    v.rv.edColName = v.rv.keys[v.rv.edColNum];

    v.step = '1.3'; // 取得したい列名を配列に格納
    v.rv.valid = arg.valid || [];
    if( typeof arg.valid === 'string' ){
      v.rv.valid = [arg.valid];
    }
    v.step = '1.4'; // valid指定なしの場合、分類範囲列以外の全項目を追加
    if( v.rv.valid.length === 0 ){
      for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
        if( v.i<v.rv.stColNum || v.rv.edColNum < v.i ){
          v.rv.valid.push(v.rv.keys[v.i]);
        }
      }
    }
    v.step = '1.5'; // 項目名->添字のインデックスをmapとして作成
    v.map = {};
    for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
      v.map[v.rv.keys[v.i]] = v.i;
    }

    // 2.内部関数の定義
    // 分類列範囲の開始〜終了(親〜子)を順次舐め、子があれば再起呼出
    recursive = (
      stack,  // 一行分の配列
      col,    // 処理対象となる分類列のstack上の添字
      vObj,   // メンバに設定するデータ(variable object)
      pObj    // 格納するオブジェクト(parent object)
    ) => {
      let rv = null;  // 戻り値。正常終了ならnull
      try {
        v.step = '2.1'; // 格納先オブジェクトにメンバ未登録なら空オブジェクトを作成
        if( typeof pObj[stack[col]] === 'undefined' ){
          pObj[stack[col]] = {};
        }
        v.step = '2.2';
        if( col < v.rv.edColNum && String(stack[col+1]).length > 0 ){
          v.step = '2.2a'; // 子分類があるなら再起呼出
          const r = recursive(stack,col+1,vObj,pObj[stack[col]]);
          if( r instanceof Error ) throw r;
        } else {
          v.step = '2.2b';  // 分類列範囲右端または子分類がないなら値を格納
          // ※子分類がない＝処理対象右横の分類列が空白
          pObj[stack[col]] = vObj;
        }
        rv = null;
      } catch(e) {
        console.error('szTree.recursive Error.\n'+e.stack+'\n'+JSON.stringify(v));
        rv = e;
      } finally {
        return rv;
      }
    };

    v.step = '3'; // 以降、一行ずつ処理
    v.lastRow = v.rv.raw[0];  // データ領域の先頭行を前行の初期値とする
    for( v.i=0 ; v.i<v.rv.raw.length ; v.i++ ){
      v.step = '3.1'; // 分類列範囲がすべて空白の場合、ブランチ・ノードのいずれでもないので以降の処理はスキップ
      if( v.rv.raw[v.i].slice(v.rv.stColNum,v.rv.edColNum+1).join('').length === 0 )
        continue;

      v.step = '3.2'; // 分類列範囲の上位が空欄なら前行の値をコピー
      for( v.j=v.rv.stColNum ; v.j<=v.rv.edColNum ; v.j++ ){
        if( String(v.rv.raw[v.i][v.j]).length === 0 ){
          // 分類列範囲の上位が未設定なら前行の設定値をコピー
          v.rv.raw[v.i][v.j] = v.lastRow[v.j];
        } else {
          // 分類列範囲の上位が設定されてたら以降はスキップ
          break;
        }
      }
      v.lastRow = v.rv.raw[v.i];

      v.step = '3.3'; // pathを追加
      v.rv.path[v.i] = v.rv.raw[v.i]
        .slice(v.rv.stColNum,v.rv.edColNum+1)
        .join('\t') // 分類列範囲をタブ区切りで結合
        .match(/^(.*?)\t*$/)[1];  // 末尾のタブは削除

      v.step = '3.4'; // labelを追加
      for( v.j=v.rv.edColNum ; v.j>=v.rv.stColNum ; v.j-- ){
        if( String(v.rv.raw[v.i][v.j]).length > 0 ){
          break;
        }
      }
      if( typeof v.rv.label[v.rv.raw[v.i][v.j]] === 'undefined' ){
        v.rv.label[v.rv.raw[v.i][v.j]] = [];
      }
      v.rv.label[v.rv.raw[v.i][v.j]].push(v.i);

      // 以降、分類列範囲外を出力用にオブジェクト化
      v.step = '3.5'; // 取得項目名：値となるオブジェクトを作成
      v.vObj = {};
      for( v.j=0 ; v.j<v.rv.valid.length ; v.j++ ){
        v.a = v.rv.raw[v.i][v.map[v.rv.valid[v.j]]];
        if( typeof v.a !== undefined && String(v.a).length > 0 ){
          v.vObj[v.rv.valid[v.j]] = v.a;
        }
      }
      v.rv.value[v.i] = {...v.vObj};

      v.step = '3.6'; // 有効なデータ項目が無ければ以降の処理をスキップ
      v.b = Object.keys(v.vObj);
      if( v.b.length === 0 ) continue;
      v.step = '3.7'; // データ項目が一つだけなら値として設定
      if( v.rv.valid.length === 1 && v.b.length === 1 ){
        v.vObj = v.vObj[v.b[0]];
      }

      v.step = '3.8'; // 戻り値となるオブジェクトにvObjを追加
      v.r = recursive(v.rv.raw[v.i],v.rv.stColNum,v.vObj,v.rv.tree);
      if( v.r instanceof Error ) throw v.r;
    }

    // 4.メソッドの定義
    /**
     * @typedef {object} szTreeSearch - szTree.search()の戻り値
     * @prop {Object.<string, any>} obj - 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)
     * @prop {number} dataNum - data上の添字
     * @prop {number} rawNum - raw上の添字
     * @prop {number} rowNum - スプレッドシート上の行番号
     */
    /** search: 項目名'key'の値がvalueである行Objを全て検索
     * @param {string[]} path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @returns {szTreeSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.1 search';
    v.rv.search = (path,value) => {return ((p,path,value)=>{
      const v = {whois:p.whois+'.search',rv:[]};
      try {
        // path検索の正規表現を生成
        v.rex = new RegExp([...path].join('\\t(\\S+\\t)*'));
        for( v.i=0 ; v.i<p.path.length ; v.i++ ){
          // ノードで無ければスキップ
          if( p.path[v.i] === null ) continue;
          // pathがマッチするか判定
          if( String(p.path[v.i]).match(v.rex) ){
            // value指定が無ければ候補に入れる
            if( typeof value === 'undefined' ){
              v.flag = true;
            } else {
              v.flag = false;
              for( v.x in value ){
                v.flag = false;
                // 比較対象となる値がない場合、空欄(空文字列)
                v.str = typeof p.value[v.i][v.x] === 'undefined' ? '' : String(p.value[v.i][v.x]);
                // マッチするなら値条件に合致と判断
                if( v.str.match(value[v.x]) ) v.flag = true;
              }
            }
            if( v.flag ){
              v.rv.push({num:v.i,raw:p.raw[v.i],path:p.path[v.i],value:p.value[v.i]});
            }
          }
        }
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,path,value)};  // search終了

    /** nearest: ベースノードの最寄の指定ノードを検索
     * @param {object} base
     * @param {string[]} base.path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [base.value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @param {object} destination
     * @param {string[]} destination.path - キーとなる項目名。親＞子順に並べるが、中間は省略可
     * @param {Object.<string,RegExp>} [destination.value] - 値条件。項目名：当該項目の正規表現。空文字列は/^$/、指定不要なら/^.*$/
     * @returns {szTreeSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.2 nearest';
    v.rv.nearest = (base,destination) => {return ((p,base,destination)=>{
      const v = {whois:p.whois+'.nearest',rv:{degree:Infinity}};
      try {
        v.basenode = p.search(base.path,base.value);
        if( v.basenode.length !== 1 ){
          throw new Error('ベースノードが特定できません');
        }

        v.destination = p.search(destination.path,destination.value);

        for( v.i=0 ; v.i<v.destination.length ; v.i++ ){
          v.base = v.basenode[0].path.split('\t');
          v.dest = v.destination[v.i].path.split('\t');
          while( v.base.length > 0 && v.dest.length > 0 && v.base[0] == v.dest[0] ){
            v.base.shift();
            v.dest.shift();
          }
          v.destination[v.i].degree = v.base.length + v.dest.length;
          if( v.rv.degree > v.destination[v.i].degree ){
            v.rv = v.destination[v.i];
          }
        }
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,base,destination)};  // nearest終了

    v.step = '4.3'; // メソッドへの受渡用のメンバ変数のオブジェクトを作成
    const members = {whois:v.whois};
    Object.keys(v.rv).forEach(x => members[x] = v.rv[x]);
    v.rv.members = members;

    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));  // szTree正常終了ログ
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
