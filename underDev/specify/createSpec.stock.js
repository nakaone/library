
      const setNested = (obj, keys, value) => {
        dev.step(99.974,{obj,keys,value});
        let cur = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          if (typeof cur[keys[i]] !== 'object' || cur[keys[i]] === null) {
            cur[keys[i]] = {};
          }
          cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = value;
      }



/** Article: Markdownの単一記事(タイトル＋本文)用データオブジェクト
 * - `<!--::記事のID::-->`で他記事も埋め込み可とする
 * - アンカーのidは識別子を小文字変換したものとする
 * 
 * @class Article
 * @prop {string} [title=''] - 記事のタイトル
 * @prop {string} [icon=''] - アイコンを付ける場合に設定
 * @prop {boolean} [anchor=false] - アンカーを設定する場合に設定(`<span id="〜">`)
 * @prop {string} [link=''] - タイトルにリンクを張る場合の参照先URL
 * @prop {string} [top=''] - タイトルの前に挿入する文字列(固定メニュー等)
 * @prop {string} [middle=''] - タイトルの後・記事の前に〃
 * @prop {string} [bottom=''] - 記事の後に〃
 * @prop {string} [content=''] - 記事本文
 */
class Article {
  /**
   * @constructor
   * @param {Object} arg 
   * @returns {Article}
   */
  constructor(arg){
    this.title = arg.title ?? '';
    this.icon = arg.icon ?? '';
    this.anchor = arg.anchor ?? false;
    this.link = arg.link ?? '';
    this.top = arg.top ?? '';
    this.middle = arg.middle ?? '';
    this.bottom = arg.bottom ?? '';
    this.content = arg.content ?? '';
  }
}

/** stock: 使用の可能性が高いソースの一時保存 */
function stock(){

  /** mapDoclet: docletからdlMapを作成
   * @param {void} - 共有変数docletから作成
   * @returns {null|Error} 処理したDocletはdlMapに格納
   */
  function mapDoclet(){
    const v = {whois:`${pv.whois}.mapDoclet`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<doclet.length ; v.i++ ){
        v.d = doclet[v.i];

        dev.step(1);  // 固有パスが存在しない場合、プレースホルダを作成
        if( typeof dlMap[v.d.unique] === 'undefined' ){
          dlMap[v.d.unique] = {global:{},typedef:{}};
        }

        dev.step(1.2);  // 受け皿となるグローバル関数・クラスおよびデータ型定義を先行して作成
        switch( v.d.type ){
          case 'typedef':
          case 'interface':
            dlMap[v.d.unique].typedef[v.d.title] = v.d;
            break;
          case 'class':
          case 'function':
            dlMap[v.d.unique].global[v.d.title] = v.d;
            break;
        }
      }

      dev.step(2);
      for( v.i=0 ; v.i<doclet.length ; v.i++ ){
        v.d = doclet[v.i];
        switch( v.d.type ){
          case 'objectFunc':  // -> longname区切り記号：'#'
            dev.step(2.1);
            // typedef配下で親を探す
            v.r = getByTildePath(v.d.origin.longname,dlMap[v.d.unique].typedef);
            // 親が見つからなければエラー
            if( !v.r.obj ) throw new Error(`no parent: ${JSON.stringify(v.d.origin,null,2)}`);
            // 親定義.propertiesに追加
            v.r.obj.properties.push(v.d);
            break;
          case 'constructor': // -> longname区切り記号：無し、name === クラス名
            dev.step(2.2);
            // @constructorに対応する@classの記述がない ⇒ エラー
            if( typeof dlMap[v.d.unique].global[v.d.origin.name] === 'undefined' ){
              throw new Error(`There is no @class description corresponding to @constructor`);
            }
            dlMap[v.d.unique].global[v.d.origin.name].innerFunc.push(v.d);
            break;
          case 'method':  // -> longname区切り記号：'.'
          case 'innerFunc':  // -> longname区切り記号：'~'
            dev.step(2.3);
            // global配下で親を探す
            v.r = getByTildePath(v.d.origin.longname,dlMap[v.d.unique].global);
            // 親が見つからなければエラー
            if( !v.r.obj ) throw new Error(`no parent: ${JSON.stringify(v.d.origin,null,2)}`);
            // 親定義.innerFuncに追加
            v.r.obj.innerFunc.push(v.d);
            break;
          case 'description':  // -> longname区切り記号：無し
            dev.step(2.4);
            break;
        }
      }

      console.log(JSON.stringify(dlMap)); // debug
      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getByTildePath:パス文字列からオブジェクトを辿って値を取得
   * @param {string} path - 例: "func01~func02~arrow01"
   * @param {Object} obj  - 探索対象オブジェクト
   * @returns {{obj:any, label:string} | null}
   */
  function getByTildePath(path, obj) {
    const v = {whois:`${pv.whois}.getByTildePath`, arg:{}, rv:{obj:null,label:''}};;
    const dev = new devTools(v);
    try {

      dev.step(1);  // 引数チェック
      if ( !path || typeof path !== 'string') return null;

      dev.step(2);  // longnameを分解
      v.parts = path.replaceAll(/[\~\.]/g,'#').split('#');

      if (v.parts.length < 1){
        dev.step(3,v.parts);  // 区切り記号無し
        v.rv.label = path[0];
      } else {
        dev.step(4.1);
        v.rv.label = v.parts.at(-1);  // 最後の要素はlabel
        v.keys  = v.parts.slice(0, -1); // それ以外がpath
        dev.step(4.2);
        let cur = obj;
        for (const key of v.keys) {
          if (cur && typeof cur === 'object' && key in cur) {
            cur = cur[key];
          } else {
            return null;
          }
        }
        v.rv.obj = cur;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getDoclet: Doclet型のオブジェクトを作成、docletに追加
   * @param {Object} obj - `jsdoc -X`で配列で返されたオブジェクト
   * @param {string} unique - objが存在するファイルの固有パス
   * @returns {null|Error} 正常終了ならnull
   */
  function getDoclet(obj,unique){
    const v = {whois:`${pv.whois}.getDoclet`, arg:{obj,unique}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // Docletの型を判定
      v.type = determineType(obj);
      if( v.type instanceof Error ) throw v.type;
      if( v.type === 'unknown' ) return v.rv; // 型不明は対象外

      dev.step(2);  // 必須項目の存否チェック
      if( typeof obj.meta?.lineno === 'undefined' )
        throw new Error(`no lineno: ${obj.comment}`);
      if( typeof obj.longname === 'undefined' )
        throw new Error(`no longname: ${obj.comment}`);

      /*
      dev.step(3);  // labelを抽出
      // ①JSDoc先頭の「/**」に続く文字列
      v.m = obj.comment.split('\n')[0].match(/^\/\*\*\s*(.+)\n/);
      // ②説明文の先頭行
      v.desc = (obj.description ?? obj.classdesc ?? obj.longname)
        .split('\n')[0] ?? '(ラベル未設定)';
      // ① > (nameまたはclassなら)longname > ②
      v.label = v.m !== null ? v.m[1]
      : (v.type === 'name' || v.type === 'class' ? (obj.longname ?? v.desc) : v.desc);
      */

      dev.step(4);  // Doclet型のオブジェクトを作成
      v.doclet = {
        unique: unique,
        type: v.type,
        jsdocId: unique + obj.meta.filename + ':' + obj.meta.lineno,
        innerFunc: [],
        article: {},
        title: obj.longname.replaceAll(/~/g,'#').split('#')[0],
        label: v.label,
        description: obj.description ?? obj.classdesc ?? '',
        properties: [],
        innerList: [],
        params: [],
        returns: [],
        origin: obj,
      };

      dev.step(5);  // 属性項目についてPropList作成
      ['properties','params','returns'].forEach(x => {
        if( typeof obj[x] !== 'undefined' && Array.isArray(obj[x]) && obj[x].length > 0 ){
          for( v.i=0 ; v.i<obj[x].length ; v.i++ ){
            v.r = getPropList(obj[x][v.i],x,obj);
            if( v.r instanceof Error ) throw v.r;
            v.doclet[x].push(v.r);
          }
        }
      });

      dev.step(6);  // docletへの格納
      doclet.push(v.doclet);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** makeArticle: docletを走査、記事毎にArticleを作成
   * - 作成したArticleオブジェクトはdoclet.articleに保存
   * @param {Doclet} obj - (単一の)Doclet型オブジェクト
   * @returns {null|Error}
   */
  function makeArticle(obj) {
    const v = {whois:`${pv.whois}.makeArticle`, arg:{obj}, rv:null};
    const dev = new devTools(v);
    /**
     * @name 一覧文書の構成
     * @desc
     * 
     * - フォルダ毎に作成
     * - 並び順はフォルダ内のデータ型名順(アルファベット順)
     * 
     * 1. ヘッダ部("フォルダ名_top")
     * 2. グローバル関数・クラス一覧("フォルダ名_list")
     * 3. データ型一覧("フォルダ名_type")
     * 4. 個別データ型("フォルダ名-データ型名") ※注意：'_'ではなく'-'
     */
    /**
     * @name クラス・グローバル関数文書の構成
     * @desc
     * 
     * 1. ヘッダ部("クラス名_top")
     *    - タイトル(○○クラス仕様書、等)
     *    - ラベル(一行にまとめた説明)
     *    - 概要説明(数行程度)
     * 2. メンバ一覧("クラス名_prop")
     * 3. メソッド一覧("クラス名_func")
     * 4. 詳細説明("クラス名_desc")
     * 5. 引数("クラス名_param")
     * 6. 戻り値("クラス名_return")
     * 7. 個別メソッド("クラス名-メソッド名") ※注意：'_'ではなく'-'
     *    - innerFuncを再帰呼出
     */
    /**
     * @name データ型定義文書の構成
     * @desc
     * 
     * 1. ヘッダ部("データ型名_top")
     *    - タイトル(○○データ型仕様書、等)
     *    - ラベル(一行にまとめた説明)
     *    - データ型説明文
     * 2. メンバ一覧("クラス名_prop")
     * 3. 個別メソッド("クラス名-メソッド名") ※注意：'_'ではなく'-'
     *    - interfaceにfunctionのメンバが含まれる場合、表の外に記述
     */
    try {

      dev.step(1);  // top: タイトル、ラベル、概要説明
      obj.article.top = new Article({
        title: obj.title,
        anchor: 'top',
        content: (obj.label ? `${obj.label}\n\n` : '')
        + (obj.description ? `${obj.description}\n` : ''),
      });

      // list: グローバル関数・クラス一覧
      // type: データ型一覧
      // ※一覧文書用の欄なのでDocletからの作成は無し

      dev.step(2);  // prop: メンバ一覧

      dev.step(5);  // func
      dev.step(6);  // desc
      dev.step(7);  // param
      dev.step(8);  // returns
      dev.step(9);  // -xxx

      dev.end(obj.article);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

}

/** trash: 過去作成したソースで必要なくなったもの。備忘用 */
function trash(){
  /** makeMap: 「ファイル名＋行番号」を識別子とするマップを作成 */
  async function makeMap(list){
    const v = {whois:`${pv.whois}.makeMap`, arg:{list}, rv:{}};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<list.length ; v.i++ ){

        dev.step(1.1);  // JSDocを取得
        v.arr = await getFile(list[v.i]);
        if( v.arr instanceof Error ) throw v.arr;

        dev.step(1.2);  // 取得結果のチェック。配列で無い場合はメッセージを出してスキップ
        if( !Array.isArray(v.arr) ){
          dev.step(1.99,`not Array: ${JSON.stringify(v.arr)}`);
          continue;
        }

        dev.step(2);  // v.mapの作成
        v.arr.forEach(o => {
          // 【備忘】
          // ①"meta.code.id"は存在しない場合があるので使用を断念。
          // ②'kind:"package"'
          //   -> プロジェクトのメタ情報（name, version, description など）
          //   "meta.lineno"を持たないが、仕様書作成に使用しないのでmap登録対象外とする
          if( typeof o.meta !== 'undefined' && typeof o.meta.lineno === 'number'){
            dev.step(2.1);  // v.mapのキー文字列(ID)の作成
            v.jsdocId = `${o.meta.path ?? ''}/${o.meta.filename ?? ''}-${o.meta.lineno}`;

            if( pv.idList.includes(v.jsdocId) ){
              dev.step(2.2);  // 登録済なら結合
              o = mergeDeeply(pv.map[v.jsdocId],o);
            } else {
              dev.step(2.3);  // 未登録なら登録済IDリストに追加
              pv.idList.push(v.jsdocId);
            }

            dev.step(2.4);  // pv.mapへの登録
            pv.map[v.jsdocId] = o;
          }
        });
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** trimCommonIndent: 文字列を行単位に分割、全行に共通する先頭の空白を削除
   * 但し先頭行頭に空白が無かった場合、調査対象から除外する
   * @param {string[]} txt
   * @returns {string[]}
   */
  function trimCommonIndent(txt) {
    const v = {whois:`${pv.whois}.trimCommonIndent`, arg:{}, rv:[]};
    const dev = new devTools(v);
    try {

      dev.step(1,txt);  // 行単位に分割
      v.lines = txt.split('\n');

      dev.step(2);  // 先頭行頭が空白では無い場合、調査対象から除外
      if( !/^\s/.test(v.lines[0]) ) v.lines.slice(1);

      dev.step(3);  // 空行を除いた行の先頭空白数を調べる
      v.indents = v.lines
        .filter(line => line.trim().length > 0) // 空白行は対象外
        .map(line => line.match(/^[ \t]*/)[0].length);

      dev.step(4);  // 共通の最小インデント
      v.minIndent = Math.min(...v.indents);

      dev.step(5);  // 各行から共通インデントを削除
      v.lines.map(line => line.slice(v.minIndent));

      v.rv = v.lines.join('\n');
      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** investigate: 【開発用】jsdoc -Xで出力されたオブジェクトの内容を調査
   * @param {void}
   * @returns {Object|Error} データ型はstep 1.1参照
   * @example
   * - コンソールの内容をresult.txt等に保存
   * - "createSpec.investigate normal end"を検索
   * - result欄の内容確認(以下はサンプル)
   *   result:  [
   *     "10: typedef", // string   ※行頭数字はシンボル(関数・クラス・プロパティ)の行番号
   *     "22: interface", // string
   *     "34: global function", // string
   *     "39: inner function(func01~arrow01)", ※括弧内は親関数・クラス
   *     "40: typedef", // string
   *     "46: unknown", // string
   *     "49: typedef", // string
   *     "55: unknown", // string
   *     "65: class", // string
   *     "66: typedef", // string
   *     "77: constructor(class01)", // string
   *     "85: unknown", // string
   *     "92: method(class01#method01)", // string
   *   ], // Array
   */
  function investigate() {
    const v = {whois:`${pv.whois}.investigate`, arg:{}, rv:[]};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前処理
      // -------------------------------------------------------------
      dev.step(1.1);  // 戻り値の形式定義
      v.rv = {  
        idListLength: pv.idList.length, // 対象JSDoc要素数
        idList: pv.idList,              // 対象JSDoc要素のIDリスト
        result: [],                     // 判定結果
        kindList: [],                   // kind属性に設定されている値のリスト
        scopeList: [],                  // scope 〃
        sampleNum: 0,                   // サンプルの件数
        sample:[],                      // サンプルのダンプ
      };

      dev.step(1.2);  // 抽出条件の定義
      v.ex = {
        all: o => true,
        // ①scope:"global"
        global: o => {return typeof o.scope !== 'undefined' && o.scope === 'global'},
        // ②kind:"typedef"
        typedef: o => {return typeof o.kind !== 'undefined' && o.kind === 'typedef'},
        // ③kind:"function"
        func: o => {return typeof o.kind !== 'undefined' && o.kind === 'function'},
        // ④kind: "class"
        class: o => {return typeof o.kind !== 'undefined' && o.kind === 'class'},
        // ⑤meta.code.type:"MethodDefinition"
        method: o => o.meta?.code?.type === "MethodDefinition",
        // ⑥判定テストで「unknown」
        unknown: o => / unknown$/.test(o.result),
      }

      dev.step(1.3);  // サンプルの表示方法指定
      v.st = {
        all: o => o,  // 全属性表示
        major: o => {const rv = {}; // 主要属性のみ抽出
          ['name','description','kind','memberof','scope']
          .forEach(x => rv[x] = o[x] ?? '');
          return rv;
        },
      }

      dev.step(1.4);  // 適用条件の指定
      v.cond = v.ex.all; // 適用する抽出条件
      v.disp = v.st.all;  // サンプルの表示方法

      // -------------------------------------------------------------
      dev.step(2);  // JSDoc要素毎に検査実施
      // なおテストに伴いJSDoc要素に"jsdocId","result"メンバが追加されるので注意
      // -------------------------------------------------------------
      pv.idList.forEach(x => {

        dev.step(2.1);  // idを追加
        v.mObj = Object.assign({jsdocId:x},pv.map[x]);

        dev.step(2.2);  // 指定属性の値一覧を作成
        ['kind','scope'].forEach(p => {
          if( v.mObj.hasOwnProperty(p) && !v.rv[`${p}List`].includes(v.mObj[p]) ){
            v.rv[`${p}List`].push(v.mObj[p]);
          }
        });

        dev.step(2.3);  // 判定テスト
        v.mObj.result = v.mObj.meta.lineno + ': ';
        switch( v.mObj.kind ){
          case 'typedef':
            v.mObj.result +=  'typedef';
            break;
          case 'interface':
            v.mObj.result +=  'interface';
            break;
          case 'function':
            switch( v.mObj.scope ){
              case 'global': v.mObj.result +=  'global function'; break;
              case 'inner': v.mObj.result +=  `inner function(${v.mObj.longname})`; break;
              case 'instance': v.mObj.result +=  `method(${v.mObj.longname})`;
                break;
              default: v.mObj.result +=  `unknown`;
            }
            break;
          case 'class':
            switch( v.mObj.meta.code.type ){
              case 'ClassDeclaration': v.mObj.result +=  'class'; break;
              case 'MethodDefinition': v.mObj.result +=  `constructor(${v.mObj.longname})`; break;
              default: v.mObj.result +=  'unknown';
            }
            break;
          default: v.mObj.result +=  `unknown`;
        }
        v.rv.result.push(v.mObj.result);

        dev.step(2.4);  // 抽出条件に従ってサンプルを追加
        if( v.cond(v.mObj) ) v.rv.sample.push(v.disp(v.mObj));

      });

      dev.step(3);  // 終了処理
      // サンプル数を戻り値にセット
      v.rv.sampleNum = v.rv.sample.length;
      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** omitKeyDeep: 【開発用】指定キーを再帰的に除外した新しいオブジェクトを作成
   * @param {Object} obj - オブジェクト。dlMap等を想定
   * @param {string|string[]} keys - 除外するキー名（単数または複数）。"origin"等
   * @returns {Object}
   */
  function omitKeyDeep(obj, keys) {
    const keySet = new Set(
      Array.isArray(keys) ? keys : [keys]
    );

    const walk = value => {
      if (Array.isArray(value)) {
        return value.map(walk);
      }
      if (value === null || typeof value !== 'object') {
        return value;
      }

      return Object.fromEntries(
        Object.entries(value)
          .filter(([k]) => !keySet.has(k))
          .map(([k, v]) => [k, walk(v)])
      );
    };

    return walk(obj);
  }

}