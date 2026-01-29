/** specify: JavaScriptオブジェクトで定義したクラス仕様をMarkdownで出力
 * - グローバル関数は"global"クラスのメソッド、グローバル変数は"global"クラスのメンバとして処理
 * - クラスの構造
 *   - ProjectDef: プロジェクト全体定義
 *     - ClassDef: (プロジェクトに関連する)個別クラス定義
 *       - MembersDef: クラスのメンバ(インスタンス変数)
 *         - FieldDef: メンバとなる個別の変数
 *       - MethodsDef: クラスのメソッド集
 *         - MethodDef: 個々のメソッド定義
 *           - ParamsDef: 当該メソッドの引数
 *             - FieldDef: 引数となる個別の変数
 *           - ReturnsDef: 当該メソッドの戻り値
 *             - ReturnDef: (戻り値のデータ型が複数有る場合の)データ型別定義
 *
 * @example 使用方法
 * 1. クラス定義(specDef.js) : プロジェクトに関係するクラスを一括して定義
 *    ※ 詳細は各クラスのJSDoc参照
 *    ```
 *    console.log(JSON.stringify({implements:{cl:'クライアント側',sv:'サーバ側'},classdef:{
 *      authAuditLog: {
 *    // 後略
 *    ```
 * 2. 仕様書作成エンジン(specify.mjs) : 本JavaScript
 * 3. ビルダー(build.sh) : クラス定義とエンジンからMarkdown文書を作成
 *    ```zsh
 *    # クラス別定義
 *    node $src/doc/specDef.js | node $prj/tools/specify.mjs -h:$src/doc/header.md -o:$doc
 *    ```
 *    起動時オプション
 *    - o: 出力先フォルダ
 *    - h: 共通ヘッダファイル
 *    - l: リスト一覧出力先フォルダ
 *
 * ■ 次期開発項目
 * - implementが一種類以下の場合、環境別に分けずに"-o"フォルダ直下に全ファイル作成
 * - 一次情報で設定できない項目はcreateMdに移動
 *   table作成時に他クラスのメンバ一覧を参照するReturnsDefで問題になる可能性あり
 *
 * ■ 凡例
 * - 🔢：導出項目(定義不要)
 * - ✂️：trimIndent対象項目
 */
/* テンプレート
  ClassName: {
    extends: '', // {string} 親クラス名
    desc: '', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``, // {string} ✂️補足説明。概要欄に記載
    summary: ``,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: [], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      //{name:'',type:'string',desc:'',note:''},
      // label(項目名), default, isOpt
    ]},

    methods: {list:[
      {
        name: 'constructor', // {string} 関数(メソッド)名
        type: 'private', // {string} 関数(メソッド)の分類
        desc: 'コンストラクタ', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
          - メンバに以下を設定
            %% this.cfTable({
              type:'authError',
              patterns:{
                'func不正':{
                  message:'"invalid func"'
                }
              }
            },{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
        `,

        returns: {list:[
          {type:'ClassName'}, // コンストラクタは自データ型名
          { // 対比表形式
            type: 'ClassName',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
            },
          },
          // null/Error等、定義外のデータ型の場合"template:''"を追加
          // 定義外以外でも一覧不要なら"template:''"を追加
          //{type:'null', desc:'正常終了時',template:''},
          //{type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
    ]},
  },
*/

/** BaseDef - 各定義の基底クラス
 * // メンバ
 * @typedef {Object} BaseDef - 各定義の基底クラス
 * @prop {string} [ClassName=''] - 所属するクラス名。ex.'authAuditLog'
 * @prop {string} classname - 🔢小文字のクラス名。ex.'authauditLog'
 * @prop {string} [MethodName=''] - 所属するメソッド名。ex.'log'
 * @prop {string} methodname - 🔢所属するメソッド名。ex.'log'
 * @prop {string} [anchor] - アンカーを付ける場合の文字列。ex.'authauditlog_constructor_params'
 *    クラス名・メソッド名はClassName,MethodName(小文字)、セクション名は'XxxDef'->'xxx'
 * @prop {string} [title=''] - Markdown化した時のタイトル行。anchor,link設定済
 * @prop {string} [template=''] - embed展開前のテンプレート。constructorでセット、以降不変
 * @prop {string} [content=''] - 🔢embedを展開後の本文。embed展開終了時にセット
 * @prop {boolean} [fixed=false] - 🔢インスタンスの値が確定したらtrue
 *
 * // ゲッター・セッター ※以下はspecify全体の共有変数として定義
 * @prop {string[]} [implement=[]] - 実装環境の一覧。空配列なら全てグローバル。ex.`["cl","sv"]`
 * @prop {Object.<string,ClassDef|MethodDef>} defs - ClassDefのマッピングオブジェクト
 * - defs
 *   - defs[クラス名]                   -> ClassDef
 *   - defs[クラス名].members           -> MembersDef
 *   - defs[クラス名].members[項目名]    -> FieldDef
 *   - defs[クラス名].methods           -> MethodsDef
 *   - defs[クラス名].methods[メソッド名] -> MethodDef
 *   - ※クラス名・メソッド名は大文字を含む正式名だけでなく、小文字のみのアンカー名でもアクセス可とする
 * @prop {string[]} classList - 定義されたクラス名一覧
 *
 * // メソッド
 * @prop {Function} article - タイトル行＋内容の作成
 * @prop {Function} cfTable - メンバ一覧および対比表の作成
 * @prop {Function} createMd - 当該インスタンスのMarkdownを作成
 *   - this.content === '' ならthis.templateを評価、未作成のcontentが無ければthis.contentにセット
 *   - this.contentを返して終了
 * @prop {Function} evaluate - "%%〜%%"の「〜」を評価(eval)して置換
 *   - 一箇所でも評価できなかった場合は空文字列を返す
 * @prop {Function} trimIndent - 先頭・末尾の空白行、共通インデントの削除
 */
class BaseDef {

  constructor(arg,parent={}){
    const v = { whois: `${this.constructor.name}.BaseDef.constructor`, rv: null, arg:{arg,parent}};
    dev.start(v);
    try {
      this.ClassName = arg.ClassName || parent.ClassName || '';
      this.classname = this.ClassName.toLowerCase();
      this.MethodName = arg.MethodName || parent.MethodName || '';
      this.methodname = this.MethodName.toLowerCase();
      this.anchor = arg.anchor || (this.classname ? this.classname
        + (this.methodname ? '_' + this.methodname : '') : '');
      this.title = arg.title || '';
      this.template = arg.template || '';
      this.content = arg.content || '';
      this.fixed = false;

      dev.end(); // 終了処理
    } catch (e) { return dev.error(e); }
  }

  static _implements = [];  // 実装環境の一覧
  static get implements(){
    return this._implements;
  }
  static set implements(arg){
    arg.forEach(imp => {
      // 未登録の場合のみ登録
      if( !this._implements.find(x => x === imp) ){
        this._implements.push(imp);
      }
    });
  }

  static _defs = {};  // ClassDefのマッピングオブジェクト
  static get defs(){
    return this._defs;
  }
  static set defs(arg){
    this._defs[arg.ClassName] = this._defs[arg.classname] = arg;
  }

  static _classList = []; // クラス一覧
  static get classList(){
    return this._classList;
  }
  static set classList(arg){
    this._classList = Object.keys(arg);
  }

  /** article: タイトルと本文から記事を作成
   * @param {Object} [arg={}]
   * @param {string} title - タイトル。constructorでアンカー・リンク等が付加される
   * @param {number} [level=0] - 階層。0ならタイトルに'#'を付けない
   * @param {string} [anchor=''] - タイトルに付けるアンカー
   *   "## <span id="[anchor]">タイトル</span>"
   * @param {string} [link=''] - タイトルに付けるリンク
   *   "## <a href="[link]">タイトル</a>"
   *   "## <span id="[anchor]"><a href="[link]">タイトル</a></span>"
   * @param {string} [navi=''] - ナビゲーション
   * @param {string} [body=''] - 本文
   * @param {Object} [opt={}]
   * @param {boolean} [opt.force=false] - trueなら本文空文字列でも作成
   * @returns {string} 作成した記事(Markdown)
   */
  article(arg={},opt={}){
    const v = {whois:`${this.constructor.name}.article`, arg:{arg,opt}, rv: null};
    dev.start(v);
    try {

      dev.step(1);  // 既定値設定
      v.default = {title:'',level:0,anchor:'',link:'',navi:'',body:''};
      Object.keys(v.default).forEach(x => v[x] = arg[x] || v.default[x]);
      v.opt = Object.assign({force:false,},opt);

      dev.step(2);  // タイトル行・ナビの作成
      if( v.link.length > 0 )
        v.title = `<a href="${v.link}">${v.title}</a>`;
      if( v.anchor.length > 0 )
        v.title = `<span id="${v.anchor}">${v.title}</span>`;
      if( v.level > 0 )
        v.title = `${'#'.repeat(v.level)} ${v.title}`;
      if( v.navi.length > 0 )
        v.title += v.navi;

      if( v.body.length > 0 || opt.force ){
        v.title += '\n\n' + v.body;
      }

      v.rv = v.title;
      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }

  }

  /** cfTable: 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
   * @param {MembersDef|ParamsDef|ReturnDef} obj - 表示対象を指定するオブジェクト
   * @param {Object} [opt={}]
   * @param {Object.<string,string>} [opt.header=null] - ヘッダ行の定義
   *   {メンバ名(英数):項目名(日本語)}形式。指定された場合、既定値を置換
   *   既定値：{name:'項目名',type:'データ型',
      default:'要否/既定値',desc:'説明',note:'備考'}
   * @param {number} [opt.indent=0] - 表の前のインデント桁数
   * @returns {string|Error} 作成した表(Markdown)
   * - not fixed: 引用元が未作成
   * - その他: システムエラー
   */
  cfTable(obj,opt={}){
    const v = { whois: `${this.constructor.name}.cfTable`, rv:[],
      arg:{obj,opt},header:{}};
    dev.start(v);
    try {

      dev.step(1);  // オプションの既定値設定
      if( typeof opt.indent === 'undefined' ) opt.indent = 0;
      v.header = opt.hasOwnProperty('header') ? opt.header :
      {name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明',note:'備考'}

      dev.step(2);  // fv: 表示する値を整形して文字列化(format value)
      const fv = x => {
        return typeof x === 'undefined' ? '—' : (
          typeof x === 'string' ? x : (
            (typeof x === 'object' || Number.isNaN(x))
            ? JSON.stringify(x) : x.toLocaleString()
          )
        );
      };

      // 原本のメンバリストをv.listとして取得(複数パターンもあるので配列で)
      if( obj.hasOwnProperty('list') ){
        dev.step(4);  // メンバ一覧・引数一覧の場合({list:FieldDef[]}形式)
        v.obj = {  // header,bodyをv.objにセット
          header:Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(obj.list)), // {FieldDef[]}
        };
      } else if( BaseDef.classList.includes(obj.type) ){
        dev.step(5.1);  // obj.typeのデータ型が定義(予定)
          // ⇒ 対比表の場合({type:クラス名}形式)
        obj = Object.assign({default:{}},obj);  // defaultを追加

        dev.step(5.2);  // ClassDef未作成の場合
        if( typeof BaseDef.defs[obj.type] === 'undefined' ){
          throw new Error(`not fixed: "${obj.type}"`);
        }

        dev.step(5.3);  // header,bodyをv.objにセット
        v.obj = {
          header: Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(BaseDef.defs[obj.type])).members.list,
        };

        dev.step(5.4);  // default,patternsの値をv.obj.bodyにセット
        v.patternList = Object.keys(obj.patterns || {}); // 特定データ型内のパターン。ex.["正常終了","警告終了"]
        for( v.i=0 ; v.i<v.patternList.length ; v.i++ ){
          dev.step(5.5);
          v.pn = v.patternList[v.i]; // パターン名
          v.po = obj.patterns[v.pn];  // パターンのオブジェクト
          v.cn = `_Col${v.i}`;  // カラム名

          dev.step(5.6);  // header：仮項目名として"_ColN"を、ラベルにパターン名を設定
          v.obj.header[v.cn] = v.pn;  // パターン名をヘッダに追加

          dev.step(5.7);  // body：「pattern > default > 指定無し('—')」の順に項目の値を設定
          v.obj.body.forEach(col => {
            col[v.cn] = v.po[col.name] ? `**${v.po[col.name]}**`
            : (obj.default[col.name] ? obj.default[col.name] : '—');
          })
        }
      }

      // v.obj.header/bodyを基にテーブル作成
      if( v.hasOwnProperty('obj' )){
        dev.step(6);  // ヘッダ行の作成
        v.cols = Object.keys(v.obj.header);
        v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(x => v.obj.header[x] || x).join(' | ')} |`);
        v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(()=>':--').join(' | ')} |`);

        dev.step(7);  // データ行の作成
        for( v.i=0 ; v.i<v.obj.body.length ; v.i++ ){
          // 既定値欄の表示内容を作成
          v.obj.body[v.i].default = v.obj.body[v.i].default !== '' ? fv(v.obj.body[v.i].default)
          : (v.obj.body[v.i].isOpt ? '任意' : '<span style="color:red">必須</span>');
          // 一項目分のデータ行を出力
          v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(x => fv(v.obj.body[v.i][x])).join(' | ')} |`);
        }

        v.rv = v.rv.join('\n');
      } else {
        dev.step(8);  // v.objが無い場合(=データ型が定義されていない場合)はテーブル作成しない
        v.rv = '';
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** evaluate: "%%〜%%"の「〜」を評価(eval)して置換
   * @param {string} str - 評価対象の文字列
   * @returns {string} 評価結果。一箇所でも評価できなかった場合は空文字列
   */
  evaluate(str){
    // 置換対象の文字列内の関数名には「this.」が付いてないので付加
    //const cfTable = this.cfTable;
    const v = { whois: `${this.constructor.name}.evaluate`,rv:'',arg:{str}};
    dev.start(v);
    try {

      mainBlock: {
        dev.step(1);  // 評価箇所が無い場合はそのまま返す
        v.str = this.trimIndent(str);
        if( v.str instanceof Error ) throw v.str;
        v.list = [...v.str.matchAll(/(\n*)(\s*)%%([\s\S]*?)%%/g)];
        if( v.list.length === 0 ) break mainBlock;

        v.list.forEach(x => {
          // x[0]: マッチした文字列(改行＋タグ前のスペース＋式)
          // x[1]: 改行
          // x[2]: タグ前のスペース
          // x[3]: 式
          // ①式を評価
          dev.step(2.1);
          v.result = eval(x[3]);
          // cfTableの戻り値がErrorの場合
          if( v.result instanceof Error ){
            dev.step(2.2);
            throw v.result;
          } else {
            dev.step(2.3);  // ②評価結果の各行頭にタグ前のスペースを追加
            v.result = v.result.split('\n').map(l => x[2]+l).join('\n');
            v.str = v.str.replace(x[0],x[1]+v.result);
          }
        });
      }

      v.rv = v.str;
      dev.end(); // 終了処理
      return v.rv;

    } catch(e) { return dev.error(e); }
  }

  /**
   * 与えられた文字列から、先頭末尾の空白行と共通インデントを削除する
   * @param {string} str - 対象文字列（複数行）
   * @returns {string} 加工後の文字列
   */
  trimIndent(str) {
    const v = { whois: `${this.constructor.name}.trimIndent`, rv: '', arg:{str:str}};
    dev.start(v);
    try {

      mainBlock: {
        dev.step(1);  // 先頭・末尾の空白行削除
        if( !str ) break mainBlock;

        const lines = str.replace(/^\n+/,'').replace(/[\s\n]+$/,'').split('\n');
        if( lines.length === 0 ) break mainBlock;

        dev.step(2);  // 1行だけの場合、先頭のスペースを削除して終了
        if( lines.length === 1 ){
          v.rv = lines[0].trim();
          break mainBlock;
        }

        dev.step(3);  // 複数行の場合、各行の共通インデント(スペース・タブ)を取得
        const indents = lines
          .filter(line => line.length > 0 ) // 空白行は飛ばす
          .map(line => line.match(/^\s*/)[0].length); // 行頭空白桁数をカウント
        const minIndent = indents.length ? Math.min(...indents) : 0;

        dev.step(4);  // 共通インデントを削除、各行を結合した文字列を返す
        v.rv = lines.map(line => line.slice(minIndent)).join('\n');
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}

/** ProjectDef - プロジェクト全体定義
 * @typedef {Object} ProjectDef - プロジェクト全体定義
 * // メンバ
 * @prop {Object.<string, ClassDef>} classdef - クラス・クロージャ関数定義集
 * @prop {Object.<string, string>} implements - 実装環境コード・名称
 * @prop {Object} [opt={}] - オプション
 * @prop {string} [opt.autoOutput=true] - 指示タグの展開後、作成したMarkdownを出力
 * @prop {string} [opt.header] - クラス別ファイルの共通ヘッダファイル名
 * @prop {string} [opt.folder] - 出力先フォルダ名。無指定の場合カレントフォルダ
 * @prop {string} [opt.list] - クラス一覧出力先フォルダ名。無指定の場合folderと同じ
 * @prop {boolean} [opt.makeList=true] - true:関数・クラス名一覧を作成
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * @prop {Function} outputMD - フォルダを作成、Markdownファイルを出力
 */
class ProjectDef extends BaseDef {
  /**
   * @param {ProjectDef} arg - ユーザ指定
   * @param {Object} [opt={}] - オプション
   * @param {string} [opt.autoOutput=true] - 指示タグの展開後、作成したMarkdownを出力
   * @param {string} [opt.folder] - 出力先フォルダ名。無指定の場合カレントフォルダ
   * @param {boolean} [opt.makeList=true] - true:関数・クラス名一覧を作成
   */
  constructor(arg={},opt={}){
    super(arg);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,opt},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1.1); // 文字列で渡された場合はオブジェクト化
      if( typeof arg === 'string' ) arg = JSON.parse(arg);

      dev.step(1.2); // オプションの既定値設定
      this.opt = Object.assign({
        autoOutput: true,
        header: '',
        folder: '.',
        makeList: true,
      },opt);
      this.opt.list = opt.list || this.opt.folder;

      dev.step(1.3); // 実装環境一覧
      this.implements = arg.implements || {};

      dev.step(1.4); // クラス名一覧
      BaseDef.classList = arg.classdef;

      dev.step(2); // 関数・クラス定義のインスタンスを順次作成
      this.classdef = {};
      Object.keys(arg.classdef).forEach(x => {
        arg.classdef[x].ClassName = x;
        this.classdef[x] = new ClassDef(arg.classdef[x]);
      });

      dev.step(3); // 指示タグの展開(%%〜%%のeval)
      v.cnt = 10; // 最大ループ回数
      while( v.cnt > 0 ){
        v.fixed = true;
        Object.keys(this.classdef).forEach(x => {
          v.md = this.classdef[x].createMd();
          if( v.md instanceof Error )
            v.fixed = false;
        });
        v.cnt -= (v.fixed ? 10 : 1);
      }

      dev.step(4); // Markdownファイルの出力
      if( this.opt.autoOutput ) this.outputMD();

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** outputMD: フォルダを作成、Markdownファイルを出力
   * @param {void}
   * @returns {void}
   */
  outputMD(){
    const v = {whois:`${this.constructor.name}.outputMD`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1); // 指定されたフォルダが存在しない場合に作成
      if (!fs.existsSync(this.opt.folder)) {
        fs.mkdirSync(this.opt.folder, { recursive: true });
      }

      dev.step(2); // 指定フォルダ以下のファイル・フォルダを全部削除
      for (const entry of fs.readdirSync(this.opt.folder)) {
        const target = path.join(this.opt.folder, entry);
        fs.rmSync(target, { recursive: true, force: true });
      }

      dev.step(3); // implement毎にフォルダを作成
      const folder = {};
      BaseDef.implements.forEach(x => {
        folder[x] = path.join(this.opt.folder,x);
        fs.mkdirSync(path.join(folder[x]));
      });

      dev.step(4); // 共通ヘッダの読み込み
      let header = '';
      if( this.opt.header !== '' ){
        header = fs.readFileSync(this.opt.header)
      }

      dev.step(5); // ClassDef毎にファイルを作成
      const list = {};  // 環境別クラス一覧
      Object.keys(this.classdef).forEach(def => {
        BaseDef.implements.forEach(x => {
          if( !list.hasOwnProperty(x) ) list[x] = [];
          if( this.classdef[def].implement.find(i => i === x) ){
            fs.writeFileSync(path.join(folder[x], `${def}.md`),
              header + (this.classdef[def].content || '').trim()
              .replaceAll(/\n\n\n+/g,'\n\n'), "utf8");
            // クラス一覧に追加
            list[x].push(this.classdef[def]);
          }
        });
      });

      dev.step(6); // クラス一覧を出力
      BaseDef.implements.forEach(x => {
        const content = ['| No | 名称 | 概要 |','| --: | :-- | :-- |'];
        v.cnt = 1;
        for( v.i=0 ; v.i<list[x].length ; v.i++ ){
          v.class = list[x][v.i];
          // クラス行出力
          content.push(`| ${(v.i+1)+'.00'} | ${
            `[${v.class.name}](${v.class.name}.md#${v.class.name.toLowerCase()}_members)`
          } | ${v.class.desc} |`);
          // メソッド行出力
          for( v.j=0 ; v.j<v.class.methods.list.length ; v.j++ ){
            v.method = v.class.methods.list[v.j];
            content.push(`| ${(v.i+1)+'.'+('0'+(v.j+1)).slice(-2)} | ${
            `<span style="padding-left:2rem">[${v.method.name}](${v.class.name}.md#${v.class.name.toLowerCase()}_${v.method.name.toLowerCase()})</span>`
            } | ${v.method.desc} |`)
          }
        }
        fs.writeFileSync(path.join(this.opt.list, `${x}.list.md`),content.join('\n'),"utf8");
      });

      dev.end();  // 終了処理
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** ClassDef - クラス・クロージャ関数定義
 * @typedef {Object} ClassDef - クラス・クロージャ関数定義
 * // メンバ
 * @prop {string} name - 🔢クラス名
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} [desc=''] - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️補足説明。概要欄に記載
 * @prop {string} [summary=''] - ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
 * @prop {string[]} implement - 実装の有無(ex.['cl','sv'])
 * @prop {string} [title=''] - 🔢Markdown化した時のタイトル行
 * @prop {string} [template=''] - 🔢embed展開前のテンプレート
 * @prop {string} [content=''] - 🔢embedを展開後の本文
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義集
 * @prop {Object.<string,MethodDef>} 🔢method - メソッド定義(マップ)
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 *   - this.content === '' なら
 *     - this.templateを評価、未作成のcontentが無ければthis.contentにセット
 *     - this.members, this.methodsのcreateMd()を呼び出し、this.contentに追加
 *   - this.contentを返して終了
 *
 * @example this.template初期値
 * ※ 出力時不要な改行は削除するので内容有無は不問
 * ※ 改行(\n)、バッククォータ(`)は要エスケープに注意
 * ```
 * %% this.desc %%
 *
 * %% this.trimIndent(this.note) %%
 *
 * %% this.summary.length === 0 ? '' : \`## <span id="${this.anchor}_summary">🧭 ${this.name} クラス 概要</span>\\n\\n${this.summary}\` %%
 * ```
 */
class ClassDef extends BaseDef {
  constructor(arg={}){
    super(arg);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1.1);
      this.name = this.ClassName;
      this.extends = arg.extends || '';
      this.desc = arg.desc || '';
      this.note = this.trimIndent(arg.note || '');
      this.summary = this.trimIndent(arg.summary || '');
      if( this.summary.length > 0 ){  // クラス概要欄
        this.summary = this.article({
          title: `🧭 ${this.name} クラス 概要`,
          level: 2,
          anchor: this.anchor+'_summary',
          link: '',
          navi: '',
          body: this.summary,
        });
      }
      this.implement = arg.implement || [];

      dev.step(1.2); // BaseDef再設定項目
      this.title = this.article({
        title: `${this.name} クラス仕様書`,
        level: 1,
        anchor: this.anchor,
        link: '',
        navi: '',
        body: '',
      });

      this.template = this.evaluate(this.trimIndent(arg.template || `
        %% this.desc %%

        %% this.note %%

        %% this.summary %%
      `));

      dev.step(2.1); // 新しく出てきたimplement要素をprj.imprementsに追加登録
      BaseDef.implements = this.implement;

      dev.step(2.2); // 現在作成中のClassDefをBaseDefのマップに登録
      BaseDef.defs = this;

      dev.step(3); // 子要素のインスタンス作成
      this.members = new MembersDef(arg.members,this);
      this.method = {};
      this.methods = new MethodsDef(arg.methods,this);

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // MembersDef, MethodsDef のcreateMDを呼び出す(ClassDef特有)
        v.members = this.members.createMd();
        v.methods = this.methods.createMd();
        if( v.members instanceof Error || v.methods instanceof Error )
          throw new Error('not fixed');

        dev.step(3); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',this.template,
          '',v.members,
          '',v.methods,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** MembersDef - クラスの内部変数の定義
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * // メンバ
 * @prop {FieldDef[]} [list=[]] - 所属するメンバの配列
 * @prop {string} table - 🔢メンバ一覧のMarkdown
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * - 無し
 *
 * @example this.template初期値
 * ```
 * %% this.cfTable(BaseDef.defs["${this.ClassName}"].members) %%
 * ```
 */
class MembersDef extends BaseDef {
  constructor(arg={},classdef){
    super(arg,classdef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,classdef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1); // 子要素のインスタンス作成
      this.list = [];
      for( let i=0 ; i<arg.list.length ; i++ ){
        this.list[i] = new FieldDef(arg.list[i],i,this);
      }

      dev.step(2); // BaseDef再設定項目
      this.anchor += '_members';
      this.title = this.article({
        title: `🔢 ${this.ClassName} メンバ一覧`,
        level: 2,
        anchor: this.anchor,
        link: '',
        navi: '',
        body: '',
      });
      this.template = this.trimIndent(arg.template ||
        `%% BaseDef.defs["${this.ClassName}"].members.table %%`);

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // メンバ一覧の作成
        if( this.list.length === 0 ){
          this.table = '- メンバ無し';
        } else {
          v.r = this.cfTable(this);
          if( v.r instanceof Error ) throw v.r;
          this.table = v.r;
        }
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error ) throw v.template;

        dev.step(3); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.template,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** FieldDef - メンバの定義(Schema.columnDef上位互換)
 * @typedef {Object} FieldDef - メンバの定義(Schema.columnDef上位互換)
 * // メンバ
 * @prop {string} name - 項目(引数)名。原則英数字で構成(システム用)
 * @prop {string} [type='string'] - データ型。'|'で区切って複数記述可
 * @prop {string} [label=''] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @prop {string[]} [alias=[]] - 複数タイプのCSVを統一フォーマットで読み込む際のnameの別名
 * @prop {string} [desc=''] - 端的なメンバの説明(詳細はnoteに記述)
 * @prop {string} [note=''] - ✂️備考
 * @prop {string} [default=''] - 既定値
 *   テーブル定義(columnDef)の場合、行オブジェクトを引数とするtoString()化された文字列も可
 * @prop {boolean} [isOpt=false] - 必須項目ならfalse。defaultが定義されていた場合は強制的にtrue
 * @prop {string} [printf=null] - 表示整形用関数。行オブジェクトを引数とするtoString()化された文字列
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * - 無し
 */
class FieldDef extends BaseDef {
  /**
   * @param {FieldDef} arg
   * @param {number} [seq=0] - 親要素内の定義順
   * @param {ParamsDef|MembersDef} parent - FieldDefのインスタンス化を呼び出す親要素
   */
  constructor(arg,seq,parent){
    super(arg,parent);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,seq,parent},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1);
      this.name = arg.name || '';

      dev.step(2);  // 他クラス定義へのリンクを追加
      this.type = (arg.type || 'string').split('|').map(x => {
        v.type = x.trim();
        if( BaseDef.classList.includes(v.type) ){
          v.link = `[${v.type}](${v.type}.md#${v.type.toLowerCase()}_members)`;
          x = x.replace(v.type,v.link);
        }
        return x;
      }).join('\\|');

      dev.step(3);
      this.label = arg.label || '';
      this.alias = arg.alias || [];
      this.desc = arg.desc || '';
      this.note = this.trimIndent(arg.note || '');
      this.default = arg.default || '';
      this.isOpt = this.default !== '' ? true : (arg.isOpt || false);
      this.printf = arg.printf || null;
      this.seq = seq;

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }
}

/** MethodsDef - クラスのメソッド集
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * // メンバ
 * @prop {MethodDef[]} list - 所属するメソッドの配列
 * @prop {string} table - 🔢メソッド一覧のMarkdown
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 *   - this.content === '' なら
 *     - this.templateを評価、未作成のcontentが無ければthis.contentにセット
 *     - this.listのcreateMd()を呼び出し、this.contentに追加
 *     - 途中でthis.list[x].createMd()から空文字列が返ったら中断
 *   - this.contentを返して終了
 *
 * @example this.template初期値(this.listはembeds要素が無いのでconstructorで作成可能)
 * ```js
 * this.template(文字列) = "['',`| メソッド名 | 型 | 内容 |`,'| :-- | :-- | :-- |',
 *   this.list.map(x=>{`| ${x.name} | ${x.type} | ${x.label} |`}))
 * ].join('\n')"
 * ```
 */
class MethodsDef extends BaseDef {
  constructor(arg={},classdef){
    super(arg,classdef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,classdef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1); // 子要素のインスタンス作成
      this.list = arg.list || [];
      for( v.i=0 ; v.i<this.list.length ; v.i++ ){
        v.o = new MethodDef(Object.assign(this.list[v.i],
          {MethodName:this.list[v.i].name}),this);
        // ClassDef.methodとlistにMethodDef登録
        this.list[v.i]
        = classdef.method[v.o.MethodName]
        = classdef.method[v.o.methodname]
        = v.o;
      }

      dev.step(2); // タイトルの作成
      this.title = this.article({
        title: `🧱 ${this.ClassName} メソッド一覧`,
        level: 2,
        anchor: `${classdef.anchor}_methods`,
        link: '',
        navi: '',
        body: '',
      });

      dev.step(3); // メソッド一覧とテンプレートの作成
      v.lines = ['','| メソッド名 | 分類 | 内容 | 備考 |',
        '| :-- | :-- | :-- | :-- |'];
      this.list.forEach(x => v.lines.push(`| ${
        `[${x.name}()](#${classdef.anchor}_${x.name.toLowerCase()})`
      } | ${x.type} | ${x.desc} | ${x.note} |`));
      this.table = v.lines.join('\n');
      this.template = this.trimIndent(arg.template ||
        `%% BaseDef.defs["${this.ClassName}"].methods.table %%`);

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // 子要素(個別メソッド)のMarkdown作成
        for( v.i=0,v.rv=null,v.methods=[] ; v.i<this.list.length ; v.i++ ){
          v.r = this.list[v.i].createMd();
          if( v.r instanceof Error ) v.rv = v.r;
          v.methods.push(v.r);
        }
        if( v.rv instanceof Error ) throw v.rv;

        dev.step(3); // テンプレートのMarkdown作成
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error ) throw v.template;

        dev.step(4); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.template,
          '',...v.methods,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** MethodDef - 関数・アロー関数・メソッド定義
 * @typedef {Object} MethodDef - 関数・アロー関数・メソッド定義
 * // メンバ
 * @prop {string} name - 関数(メソッド)名
 * @prop {string} [type=''] - 関数(メソッド)の分類
 *   public/private, static, async, get/set, accessor, etc
 * @prop {string} [desc=''] - 端的な関数(メソッド)の説明。ex.'コンストラクタ'
 * @prop {string} [note=''] - ✂️注意事項。Markdownで記載
 * @prop {string} [source=''] - ✂️想定するソースコード
 * @prop {string[]} [lib=[]] - 本関数(メソッド)で使用する外部ライブラリ
 * @prop {number} [rev=0] - 本メソッド仕様書の版数
 * @prop {ParamsDef} params - 引数
 * @prop {string} process - ✂️処理手順。Markdownで記載
 * @prop {ReturnsDef} returns - 戻り値の定義(パターン別)
 * @prop {Object.<number,ReturnDef>} return - 🔢戻り値のマップ。メンバ名は戻り値のデータ型
 * @prop {Object[]} [referrer=[]] - 🔢本関数(メソッド)の呼出元関数(メソッド)
 * @prop {string} referrer.class - 🔢呼出元クラス名
 * @prop {string} referrer.method - 🔢呼出元メソッド名
 *
 * - listで個々のメソッドを定義、MethodDefインスタンスはmemberに登録
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 *
 * @example this.templateサンプル
 * ※ 出力時不要な改行は削除するので内容有無は不問
 * ```
 * %% this.article(this.note) %%
 * %% this.article(this.sorce) %%
 * %% this.params.createMd() %%
 * %% this.evaluate(this.process) %%
 * %% this.returns.createMd() %%
 * ```
 *
 * @example this.processサンプル
 * 「異常テスト」の場合、authError.messageに「テスト」を表示
 * ```
 * process: `
 * - メンバと引数両方にある項目は、引数の値をメンバとして設定
 * - テスト：[authConfig](authConfig.md#authconfig_constructor)をインスタンス化
 * %% cfTable({type:'authError',patterns:{'異常テスト':{message:'テスト'}}},{indent:2}) %%
 * `,
 * ```
 */
class MethodDef extends BaseDef {
  constructor(arg={},methodsdef){
    super(arg,methodsdef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,methodsdef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1);
      this.name = arg.name;
      this.type = arg.type || '';
      this.desc = arg.desc || '';
      this.note = this.trimIndent(arg.note || '');
      this.source = this.trimIndent(arg.source || '');
      this.lib = arg.lib || '';
      this.rev = arg.rev || 0;
      this.params = new ParamsDef(arg.params,this);
      this.process = this.trimIndent(arg.process || '');
      this.return = {}; // 中身はReturnsDefインスタンス化時に設定
      this.returns = new ReturnsDef(arg.returns,this);
      this.referrer = [];

      // BaseDef再設定項目
      dev.step(2); // 個別メソッドのタイトル
      this.title = this.article({
        title: `🧱 ${this.ClassName}.${this.MethodName}()`,
        level: 3,
        anchor: this.anchor,
        link: `#${this.classname}_methods`,
        navi: '',
        body: '',
      });

      dev.step(3); // 「処理手順」をテンプレートとして作成
      this.template = arg.template ? this.trimIndent(arg.template)
      : this.article({
        title: `🧾 処理手順`,
        level: 4,
        anchor: this.anchor + '_process',
        link: '',
        navi: '',
        body: this.process,
      });

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // 呼出元の作成
        for( v.i=0,v.rv=null,v.refList=[] ; v.i<this.referrer.length ; v.i++ ){
          // ClassDef作成済かチェック
          if( typeof BaseDef.defs[this.referrer[v.i].class] === 'undefined' ){
            v.rv = new Error('not fixed');
          }
        }
        if( v.rv instanceof Error ) throw v.rv;
        v.referrer = this.referrer.length === 0 ? '' : this.article({
          title: `📞 呼出元`,
          level: 4,
          anchor: this.anchor + '_referrer',
          link: '',
          navi: '',
          body: this.referrer.map(x => `- [${
            BaseDef.defs[x.class].name
          }.${
            BaseDef.defs[x.class].method[x.method].name
          }](${
            BaseDef.defs[x.class].name
          }.md#${x.class}_members)`).join('\n'),
        })

        dev.step(3); // 引数の作成
        v.params = this.params.createMd();
        if( v.params instanceof Error ) throw v.params;

        dev.step(4); // 自分(処理手順)の作成(BaseDefと同じ)
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error ) throw v.template;

        dev.step(5); // 処理手順内のリンクを呼出先referrerにセット
        [...v.template.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].forEach(link => {
          v.m = link[2].match(/(.+)\.md#(.+)/);
          if( v.m ){
            // 外部リンクの場合
            v.m = v.m[2].split('_');
          } else {
            // ローカルリンクの場合
            v.m = v.template.split('_').map(x => x = x.replace('#',''));
          }
          v.ClassName = v.m[0];
          v.MethodName = v.m[1];
          if( typeof BaseDef.defs[v.ClassName] !== 'undefined'
            && typeof BaseDef.defs[v.ClassName].method[v.MethodName] !== 'undefined'
          ){
            BaseDef.defs[v.ClassName].method[v.MethodName].referrer.push({class:this.ClassName,method:this.MethodName});
          }
        });

        dev.step(6); // 戻り値の作成
        v.returns = this.returns.createMd();
        if( v.returns instanceof Error ) throw v.returns;

        dev.step(7); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.referrer,
          '',v.params,
          '',v.template,
          '',v.returns,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** ParamsDef - 関数(メソッド)引数定義
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * // メンバ
 * @prop {FieldDef[]} list - 引数
 * @prop {string} table - 🔢引数一覧のMarkdown
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * - 無し
 *
 * @example this.template初期値
 * ```
 * %% this.cfTable(this.defs[this.ClassName].methods[this.MethodName].params) %%
 * ```
 */
class ParamsDef extends BaseDef {
  constructor(arg={},methoddef){
    super(arg,methoddef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,methoddef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1); // 子要素のインスタンス作成
      this.list = [];
      for( let i=0 ; i<arg.list.length ; i++ ){
        this.list[i] = new FieldDef(arg.list[i],i,this);
      }

      dev.step(2); // BaseDef再設定項目
      this.anchor += '_params'
      this.title = this.article({
        title: `📥 引数`, //  `📥 ${v.fn}() 引数`
        level: 4,
        anchor: this.anchor,
        link: ``,
        navi: ``,
        body: '',
      });
      this.template = this.trimIndent(arg.template ||
        `%% BaseDef.defs["${this.ClassName
          }"].method["${this.MethodName}"].params.table %%`);

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }

  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // 引数一覧の作成
        if( this.list.length === 0 ){
          this.table = '- 引数無し(void)';
        } else {
          v.r = this.cfTable(this);
          if( v.r instanceof Error ) throw v.r;
          this.table = v.r;
        }
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error ) throw v.template;

        dev.step(3); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.template,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** ReturnsDef - 関数(メソッド)戻り値定義集
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * // メンバ
 * @prop {ReturnDef[]} list - (データ型別)戻り値定義集
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 */
class ReturnsDef extends BaseDef {
  constructor(arg={},methoddef){
    super(arg,methoddef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,methoddef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1); // 子要素のインスタンス作成
      this.list = arg.list || [];
      for( v.i=0 ; v.i<this.list.length ; v.i++ ){
        // MethodDef.returnとlistにReturnDef登録
        this.list[v.i] = methoddef.return[this.list[v.i].type]
        = new ReturnDef(this.list[v.i],this);
      }

      dev.step(2); // BaseDef再設定項目
      this.anchor += '_returns';
      this.title = this.article({
        title: `📤 戻り値`, // `📤 ${v.fn}() 戻り値`
        level: 4,
        anchor: this.anchor,
        link: ``,
        navi: ``,
        body: '',
      });
      this.template = this.list.length === 0 ? `- 戻り値無し(void)` : '';

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // 子要素(ReturnDef)のMarkdown作成
        for( v.i=0,v.rv=null,v.returns=[] ; v.i<this.list.length ; v.i++ ){
          v.r = this.list[v.i].createMd();
          if( v.r instanceof Error ) v.rv = v.r;
          v.returns.push(v.r);
        }
        if( v.rv instanceof Error ) throw v.rv;

        dev.step(3); // templateの評価
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error ) throw v.template;

        dev.step(4); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.template,
          '',...v.returns,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

/** ReturnDef - 関数(メソッド)戻り値定義
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * // メンバ
 * @prop {string} [type=''] - 戻り値のデータ型。対比表なら空文字列
 * @prop {string} [desc=''] - 本データ型に関する説明。「正常終了時」等
 * @prop {string} [note=''] - 補足説明
 * @prop {PatternDef} [default={}] - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} [patterns={}] - 特定パターンへの設定値
 * @prop {string} table - 🔢戻り値(データ型のメンバ一覧・対比表)のMarkdown
 *
 * // ゲッター・セッター
 * - 無し
 *
 * // メソッド
 * - 無し
 *
 * @example ReturnDef設定サンプル
 * - 定義されたデータ型を返す場合
 *   ```
 *   returns: {list:[
 *     {type:'LocalRequest',desc:'正常時の戻り値'},
 *     {type:'',desc:'エラー時の戻り値',
 *       template:`%% cfTable(
 *         {
 *           type:'authError',
 *           patterns:{'func不正':{message:'"invalid func"'}}
 *         },{  // オプション
 *           indent:2,  // 表のインデントは2桁
 *           header:{name:'項目名',  // BaseDef.cfTableのheaderを書き換え
 *             type:'データ型',default:'要否/既定値',desc:'説明'}
 *         }
 *        ) %%`
 *   　　},
 *   ]}
 *   ```
 * 
 * - null or Error を返す場合
 *   ```
 *   returns: {list:[
 *     {type:'null', desc:'正常終了時',template:''},
 *     {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
 *   ]},
 *   ```
 *
 * @example this.template初期値
 * ```
 * - [戻り値データ型名](当該データ型メンバへのリンク)
 *   当該データ型メンバ一覧
 * ```
 * `%% BaseDef.defs["${this.ClassName}"].method["${this.MethodName}"].return["${this.type}"].table %%`
 */
/**
 * @typedef {Object.<string,string>} PatternDef - パターンに設定する値
 * @example {name:'fuga'} ⇒ 戻り値のデータ型のメンバ'name'に'fuga'を設定
 */
class ReturnDef extends BaseDef {
  constructor(arg,returnsdef){
    super(arg,returnsdef);
    const v = {whois:`${this.constructor.name}.constructor`,arg:{arg,returnsdef},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      dev.step(1);
      this.type = arg.type || '';
      this.desc = arg.desc || '';
      this.note = arg.note || '';
      this.default = arg.default || {};
      this.patterns = arg.patterns || {};

      // BaseDef再設定項目
      // 戻り値のメンバ一覧とテンプレートの作成
      if( this.ClassName === this.type && this.MethodName === 'constructor' ){
        dev.step(2.1); // constructorの戻り値はインスタンスなのでメンバ一覧を表示しない
        this.template = `- [${this.ClassName}](#${this.ClassName.toLowerCase()}_members)インスタンス`
      } else {
        dev.step(2.2); // 通常の場合
        // データ型名とそこへのリンクを作成
        this.title = this.type === '' ? (
          this.desc === '' ? '' : `- ${this.desc}`
        ) : (
          // 定義されているデータ型はリンクをつけて表示
          (BaseDef.classList.includes(this.type)
          ? (`- [${this.type}](${this.type}.md#${
            this.type.toLowerCase()}_members)${
            this.desc === '' ? '' : ' : '+this.desc}`)
          : `- ${this.type} : ${this.desc}`)
          + (this.note ? `(${this.note})` : '')
        );
        dev.step(2.3); // 戻り値のデータ型のメンバ一覧を作成
        this.table = this.cfTable(this,{indent:2});
        this.template = arg.hasOwnProperty('template') ? arg.template :
          `%% BaseDef.defs["${this.ClassName}"].method["${
          this.MethodName}"].return["${this.type}"].table %%`;
      }

      dev.end();  // 終了処理

    } catch(e) { return dev.error(e); }
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * @param {void}
   * @returns {string|Error} 確定ならMarkdown、未確定ならError
   */
  createMd(){
    const v = {whois:`${this.constructor.name}.createMd`,arg:{},rv:null};
    dev.start(v); // 汎用変数を引数とする
    try {

      mainBlock: {
        dev.step(1); // 確定済ならcontentを返して終了
        if( this.fixed ) break mainBlock;

        dev.step(2); // テンプレートのMarkdown作成
        v.template = this.evaluate(this.template);
        if( v.template instanceof Error && !v.template.message.includes('not fixed')){
          throw v.template;
        }

        dev.step(3); // 確定済 ⇒ contentを作成して返す
        this.content = [
          this.title,
          '',v.template,
        ].join('\n');
        this.fixed = true;
      }

      v.rv = this.content;  // 終了処理
      dev.end();
      return v.rv;

    } catch(e) { return dev.error(e); }
  }
}

function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** removeDefs: 【検証用】オブジェクトからメンバ名"defs"を全て削除 */
function removeDefs(obj) {
  if (Array.isArray(obj)) {
    // 配列なら要素ごとに再帰処理
    return obj.map(removeDefs);
  } else if (obj && typeof obj === "object") {
    // オブジェクトなら新しいオブジェクトを作成
    const result = {};
    for (const key in obj) {
      if (key === "defs") continue; // defs を削除
      result[key] = removeDefs(obj[key]);
    }
    return result;
  } else {
    // プリミティブ型はそのまま
    return obj;
  }
}

/** devTools: 開発支援関係メソッド集
 * @param {Object} opt - 動作設定オプション
 * @param {string} [opt.mode='dev'] - 出力モード
 * @param {number} [opt.digit=4] - 処理順(seq)をログ出力する際の桁数
 *
 * - 出力モード
 *   | mode | エラー | 開始・終了 | dump/step |
 *   | "none" | ❌ | ❌ | ❌ | 出力無し(pipe処理等) |
 *   | "error" | ⭕ | ❌ | ❌ | エラーのみ出力 |
 *   | "normal" | ⭕ | ⭕ | ❌ | 本番用 |
 *   | "dev" | ⭕ | ⭕ | ⭕ | 開発用 |
 *
 * @example
 *
 * ```js
 * const dev = devTools();  // 本番時は devTools({mode:'normal'}) に変更
 * const t01 = (x) => {
 *   const v = {whois:'t01',arg:{x},rv:null}; // whois,arg,rvは指定推奨
 *   dev.start(v); // 汎用変数を引数とする
 *   try {
 *     dev.step(1.1,v);  // 場所を示す数値または文字列(＋表示したい変数)
 *
 *     dev.end();  // v.rvを戻り値と看做す
 *     return v.rv;
 *   } catch(e) { return dev.error(e); }
 * }
 *
 * - 変更履歴
 *   - rev.2.0.0
 *     - errorメソッドの戻り値を独自エラーオブジェクトに変更
 *     - functionInfoクラスを導入、詳細情報を追加
 *     - オプションを簡素化、出力モードに統合
 *     - 機能を簡素化
 *       - メソッドから削除：changeOption, check
 *       - dump を step に統合
 *     - stringify -> formatObject
 *   - rev.1.0.1 : 2025/07/17
 *     start/endでメッセージ表示を抑止するため、引数"rt(run time option)"を追加
 *   - rev.1.0.0 : 2025/01/26
 *     SpreadDb.1.2.0 test.jsとして作成していたのを分離
 */
function devTools(opt){
  /** functionInfo: 現在実行中の関数に関する情報 */
  class functionInfo {
    constructor(v){
      this.whois = v.whois || ''; // {string} 関数名またはクラス名.メソッド名
      this.seq = seq++; // {number} 実行順序
      this.arg = v.arg || {}; // {any} 起動時引数。{変数名：値}形式
      this.v = v || null; // {Object} 汎用変数
      this.step = v.step || '';
      this.log = [];  // {string[]} 実行順に並べたdev.step
      this.rv = v.rv || null; // {any} 戻り値

      this.start = new Date();  // {Date} 開始時刻
      this.end = 0; // {Date} 終了時刻
      this.elaps = 0; // {number} 所要時間(ミリ秒)
    }
  }

  /** szError: 独自拡張したErrorオブジェクト */
  class szError extends Error {
    constructor(fi,...e){
      super(...e);

      // 呼出元関数
      this.caller = trace.map(x => x.whois).join(' > ');

      // 独自追加項目を個別に設定(Object.keysではtraceが空欄等、壊れる)
      ['whois','step','seq','arg','rv','start','end','elaps']
      .forEach(x => this[x] = fi[x]);

      // エラーが起きた関数内でのstep実行順
      this.log = fi.log.join(', ');

    }
  }

  opt = Object.assign({mode:'dev',digit:4},opt);
  let seq = 0;  // 関数の呼出順(連番)
  const trace = []; // {functionInfo[]} 呼出元関数スタック
  let fi; // 現在処理中の関数に関する情報
  return {start,step,end,error};

  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {Object} v - 汎用変数。whois,arg,rvを含める
   */
  function start(v){
    fi = new functionInfo(v);
    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.start,'hh:mm:ss.nnn')} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} start`);
    }
    trace.push(fi); // 呼出元関数スタックに保存
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ
   * @param {number|string} label - dev.start〜end内での位置を特定するマーカー
   * @param {any} [val=null] - ダンプ表示する変数
   * @param {boolean} [cond=true] - 特定条件下でのみダンプ表示したい場合の条件
   * @example 123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
   *   dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
   *   ※ 99はデバック、0.123は行番号の意で設定
   */
  function step(label,val=null,cond=true){
    fi.step = String(label);  // stepを記録
    fi.log.push(fi.step); // fi.logにstepを追加
    // valが指定されていたらステップ名＋JSON表示
    if( opt.mode === 'dev' && val && cond ){
      console.log(`== ${fi.whois} step.${label} ${formatObject(val)}`);
    }
  }

  /** end: 正常終了時処理 */
  function end(){
    // 終了時に確定する項目に値設定
    finisher(fi);

    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.end,'hh:mm:ss.nnn')} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} normal end`);
      if( fi.seq === 0 ){
        console.log(`\tstart: ${toLocale(fi.start)
        }\n\tend  : ${toLocale(fi.end)
        }\n\telaps: ${fi.elaps}`);
      }
    }

    trace.pop();  // 呼出元関数スタックから削除
    fi = trace[trace.length-1];
  }

  /** finisher: end/error共通の終了時処理 */
  function finisher(fi){
    // 終了時に確定する項目に値設定
    fi.end = new Date();
    fi.elaps = `${fi.end - fi.start} msec`;
  }
  /** error: エラー時処理 */
  function error(e){

    // 終了時に確定する項目に値設定
    finisher(fi);
    fi.start = toLocale(fi.start);  // エラーログ出力時はISO8601拡張形式
    fi.end = toLocale(fi.end);

    // 独自エラーオブジェクトを作成
    const rv = e.constructor.name === 'szError' ? e : new szError(fi,e);

    // ログ出力：エラーが発生した関数でのみ出力
    if( opt.mode !== 'none' && fi.seq === rv.seq ){
      console.error(rv);
    }

    trace.pop();  // 呼出元関数スタックから削除
    fi = trace[trace.length-1] || {seq: -1};

    return rv;
  }

  /** ログ出力用時刻文字列整形 */
  function toLocale(date,opt='yyyy-MM-ddThh:mm:ss.nnnZ'){
    const v = {rv:opt,dObj:date};
    if( typeof date === 'string' ) return date;

    v.local = { // 地方時ベース
      y: v.dObj.getFullYear(),
      M: v.dObj.getMonth()+1,
      d: v.dObj.getDate(),
      h: v.dObj.getHours(),
      m: v.dObj.getMinutes(),
      s: v.dObj.getSeconds(),
      n: v.dObj.getMilliseconds(),
      Z: Math.abs(v.dObj.getTimezoneOffset())
    }

    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }
    return v.rv;
  }

  /**
   * オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する
   * @param {any} obj - 整形対象のオブジェクトまたは配列
   * @param {number} indentLevel - 現在のインデントレベル
   * @returns {string} 整形された文字列
   */
  function formatObject(obj, indentLevel = 0) {
    const indent = '  '.repeat(indentLevel); // インデント文字列

    if (obj === null) {
      return `${indent}null // null`;
    }

    const type = typeof obj;

    // プリミティブ型 (number, string, boolean, null, undefined)
    if (type !== 'object' && type !== 'function') {
      // 文字列は二重引用符で囲む
      const value = type === 'string' ? `"${obj}"` : obj;
      return `${indent}${value}, // ${type}`;
    }

    // 関数 (function)
    if (type === 'function') {
      // 関数は文字列化してデータ型を表示しない
      // toLocalISOString の例から、関数の値は引用符なしで表示します
      return `${indent}${obj.toString()},`;
    }

    // オブジェクト型 (Array, Object)

    // Array の場合
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${indent}[ /* Array, length 0 */ ], // object`;
      }

      const elements = obj.map(item =>
        // Arrayの要素は名前がないため、インデントと値のみを返す
        formatObject(item, indentLevel + 1)
      ).join('\n');

      // Arrayの要素はカンマではなく改行で区切ります
      return `${indent}[\n${elements}\n${indent}], // Array`;
    }

    // 標準の Object の場合
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return `${indent}{ /* Object, empty */ }, // object`;
    }

    const members = keys.map(key => {
      const value = obj[key];
      const memberType = typeof value;
      const nextIndent = '  '.repeat(indentLevel + 1);

      // オブジェクト/配列/関数は再帰呼び出し
      if (memberType === 'object' && value !== null || memberType === 'function') {
        // 複合型の場合は、キーと値の開始のみを記載
        const formattedValue = formatObject(value, indentLevel + 1);
        return `${nextIndent}${key}:${formattedValue}`;
      }

      // プリミティブ型は一行で表示
      const formattedValue = memberType === 'string' ? `"${value}"` : value;
      return `${nextIndent}${key}:${formattedValue}, // ${memberType}`;
    }).join('\n');

    return `${indent}{\n${members}\n${indent}}`;
  }
}

import fs from "fs";
import path from "path";
import readline from "readline";

const lines = [];
const dev = devTools({mode:'none'});
const rl = readline.createInterface({ input: process.stdin });

rl.on('line', x => lines.push(x)).on('close', () => {
  const v = {whois:`main`,arg:{},rv:null};
  dev.start(v); // 汎用変数を引数とする
  try {

    dev.step(1); 
    v.arg = analyzeArg();
    dev.step(2); 
    v.prj = new ProjectDef(lines.join('\n'),{
      folder:v.arg.opt.o,header:v.arg.opt.h,list:v.arg.opt.l});

    dev.end();  // 終了処理
    //clog(9999,removeDefs(prj));

  } catch(e) { return dev.error(e); }
});
