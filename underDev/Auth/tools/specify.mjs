/** specify: JavaScriptオブジェクトで定義したクラス仕様をMarkdownで出力
 * 
 * ■ 凡例
 * - 🔢：導出項目(定義不要)
 * - ✂️：trimIndent対象項目
 */ 

/** BaseDef - 各定義の基底クラス
 * ===== メンバ =====
 * @typedef {Object} BaseDef - 各定義の基底クラス
 * @prop {string} [className=''] - 所属するクラス名。ex.'authAuditLog'
 * @prop {string} [methodName=''] - 所属するメソッド名。ex.'log'
 * @prop {string} [anchor] - アンカーを付ける場合の文字列。ex.'authauditlog_constructor_params'
 *    クラス名・メソッド名はclassName,methodName(小文字)、セクション名は'XxxDef'->'xxx'
 * @prop {string} [title=''] - 🔢Markdown化した時のタイトル行。anchor,link設定済
 * @prop {string} [template=''] - 🔢embed展開前のテンプレート。constructorでセット、以降不変
 * @prop {string} [content=''] - 🔢embedを展開後の本文。embed展開終了時にセット
 * 
 * ===== ゲッター・セッター ===== ※以下はspecify全体の共有変数として定義
 * @prop {string[]} [implement=[]] - 実装環境の一覧。空配列なら全てグローバル。ex.`["cl","sv"]`
 * @prop {Object.<string,ClassDef|MethodDef>} defs - ClassDefのマッピングオブジェクト
 * - defs
 *   - defs[クラス名]                   -> ClassDef
 *   - defs[クラス名].members           -> MembersDef
 *   - defs[クラス名].members[項目名]    -> FieldDef
 *   - defs[クラス名].methods           -> MethodsDef
 *   - defs[クラス名].methods[メソッド名] -> MethodDef
 *   - ※クラス名・メソッド名は大文字を含む正式名だけでなく、小文字のみのアンカー名でもアクセス可とする
 * 
 * ===== メソッド =====
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

  constructor(arg){
    this.className = arg.className || '';
    this.methodName = arg.methodName || '';
    this.anchor = arg.anchor || (this.className 
      ? this.className.toLowerCase() + (this.methodName ?
      '_' + this.methodName.toLowerCase() : '') : '');
    this.title = arg.title || '';
    this.template = arg.template || '';
    this.content = arg.content || '';
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
    this._defs[arg.name] = this._defs[arg.name.toLowerCase()] = arg;
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
    const v = Object.assign({title:'',level:0,anchor:'',link:'',navi:'',body:''},arg,
      {opt:Object.assign({force:false,},opt)});

    // タイトル行・ナビの作成
    if( v.link.length > 0 )
      v.title = `<a href="${v.link}">${v.title}</a>`;
    if( v.anchor.length > 0 )
      v.title = `<span id="${v.anchor}">${v.title}</span>`;
    if( v.level > 0 )
      v.title = `${'#'.repeat(v.level)} ${v.title}`;
    if( v.navi.length > 0 )
      v.title += v.navi;

    if( v.body.length > 0 || opt.force ){
      v.title += v.body;
    }

    return v.title;
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
   * - unregistered type: 引用元が未作成
   * - その他: システムエラー
   */
  cfTable(obj,opt={}){
    const v = {rv:[],header:{}};
    // オプションの既定値設定
    if( typeof opt.indent === 'undefined' ) opt.indent = 0;
    v.header = opt.header ? opt.header :
    {name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明',note:'備考'}

    // fv: 表示する値を整形して文字列化(format value)
    const fv = x => {
      return typeof x === 'undefined' ? '—' : (
        typeof x === 'string' ? x : (
          (typeof x === 'object' || Number.isNaN(x))
          ? JSON.stringify(x) : x.toLocaleString()
        )
      );
    };

    // 原本のメンバリストをv.listとして取得(複数パターンもあるので配列で)
    switch( obj.constructor.name ){
      case 'ReturnDef':
        // 未定義のデータ型の場合"unregistered type"を返して終了
        if( typeof BaseDef.defs[obj.type] === 'undefined' ){
          return new Error('unregistered type');
        }
        v.obj = {
          header: Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(BaseDef.defs[obj.type])).members.list,
        };
        v.patternList = Object.keys(obj.patterns || {}); // 特定データ型内のパターン。ex.["正常終了","警告終了"]
        for( v.i=0 ; v.i<v.patternList.length ; v.i++ ){
          v.pn = v.patternList[v.i]; // パターン名
          v.po = obj.patterns[v.pn];  // パターンのオブジェクト
          v.cn = `_Col${v.i}`;  // カラム名
          // header：仮項目名として"_ColN"を、ラベルにパターン名を設定
          v.obj.header[v.cn] = v.pn;  // パターン名をヘッダに追加
          // body：「pattern > default > 指定無し('—')」の順に項目の値を設定
          v.obj.body.forEach(col => {
            col[v.cn] = v.po.assign[col.name] ? `**${v.po.assign[col.name]}**`
            : (obj.default[col.name] ? obj.default[col.name] : '—');
          })
        }
        break;
      default: //case 'MembersDef' or 'ParamsDef':
        // メンバ一覧または引数一覧の場合は単一の表
        v.obj = {
          header:Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(obj.list)), // {FieldDef[]}
        };
        break;
    }

    // ヘッダ行の作成
    v.cols = Object.keys(v.obj.header);
    v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(x => v.obj.header[x] || x).join(' | ')} |`);
    v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(()=>':--').join(' | ')} |`);

    // データ行の作成
    for( v.i=0 ; v.i<v.obj.body.length ; v.i++ ){
      // 既定値欄の表示内容を作成
      v.obj.body[v.i].default = v.obj.body[v.i].default !== '' ? fv(v.obj.body[v.i].default)
      : (v.obj.body[v.i].isOpt ? '任意' : '<span style="color:red">必須</span>');
      // 一項目分のデータ行を出力
      v.rv.push(`${' '.repeat(opt.indent)}| ${v.cols.map(x => fv(v.obj.body[v.i][x])).join(' | ')} |`);
    }

    return v.rv.join('\n');
  }

  /** createMd: 当該インスタンスのMarkdownを作成
   * 子要素を作成するクラスはその処理を追加したcreateMdをオーバーライドすること
   * @param {void}
   * @returns {string} 作成したcontent
   */
  createMd(){
    const v = {};
    if( this.content === '' ){
      v.r = this.evaluate(this.template);
      this.content = v.r === '' ? '' : this.title + '\n\n' + v.r;
    }
    return this.content;
  }

  /** evaluate: "%%〜%%"の「〜」を評価(eval)して置換
   * @param {string} str - 評価対象の文字列
   * @returns {string} 評価結果。一箇所でも評価できなかった場合は空文字列
   */
  evaluate(str){
    // 置換対象の文字列内の関数名には「this.」が付いてないので付加
    const cfTable = this.cfTable;

    const v = {str:this.trimIndent(str),rv:''};
    v.list = [...v.str.matchAll(/(\n*)(\s*)%%([\s\S]*?)%%/g)];

    // 評価箇所が無い場合はそのまま返す
    if( v.list.length === 0 ) return v.str;

    v.list.forEach(x => {
      // x[0]: マッチした文字列(改行＋タグ前のスペース＋式)
      // x[1]: 改行
      // x[2]: タグ前のスペース
      // x[3]: 式
      // ①式を評価
      v.result = eval(x[3]);
      // cfTableの戻り値がErrorの場合
      if( v.result instanceof Error ){
        if( v.result.message === 'unregistered type' ){
          return '';
        } else {
          return v.result;  // その他システムエラー
        }
      } else {
        // ②評価結果の各行頭にタグ前のスペースを追加
        v.result = v.result.split('\n').map(l => x[2]+l).join('\n');
        v.str = v.str.replace(x[0],x[1]+v.result);
      }
    })
    return v.str;

  }

  /**
   * 与えられた文字列から、先頭末尾の空白行と共通インデントを削除する
   * @param {string} str - 対象文字列（複数行）
   * @returns {string} 加工後の文字列
   */
  trimIndent(str) {
    // 1. 先頭・末尾の空白行削除
    if( !str ) return '';
    const lines = str.replace(/^\n+/,'').replace(/[\s\n]+$/,'').split('\n');
    //const lines = str.replace(/^\s*\n+|\n+\s*$/g, '').split('\n');
    if( lines.length === 0 ) return '';

    // 2. 1行だけの場合、先頭のスペースを削除して終了
    if( lines.length === 1 ) return lines[0].trim();

    // 3. 複数行の場合、各行の共通インデント(スペース・タブ)を取得
    const indents = lines
      .filter(line => line.trim() !== '')
      .map(line => line.match(/^\s*/)[0].length);
      //.map(line => line.match(/^[ \t]*/)[0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;

    // 4. 共通インデントを削除、各行を結合した文字列を返す
    return lines.map(line => line.slice(minIndent)).join('\n');
  }
}

/** ProjectDef - プロジェクト全体定義
 * ===== メンバ =====
 * @typedef {Object} ProjectDef - プロジェクト全体定義
 * @prop {Object.<string, ClassDef>} classdef - クラス・クロージャ関数定義集
 * @prop {Object} [opt={}] - オプション
 * @prop {string} [opt.autoOutput=true] - 指示タグの展開後、作成したMarkdownを出力
 * @prop {string} [opt.folder] - 出力先フォルダ名。無指定の場合カレントフォルダ
 * @prop {boolean} [opt.makeList=true] - true:関数・クラス名一覧を作成
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
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
    const v = {};

    // 文字列で渡された場合はオブジェクト化
    if( typeof arg === 'string' ) arg = JSON.parse(arg);
    // オプションの既定値設定
    this.opt = Object.assign({
      autoOutput: true,
      folder: '.',
      makeList: true,
    },opt);

    // 関数・クラス定義のインスタンスを順次作成
    this.classdef = {};
    Object.keys(arg.classdef).forEach(x => {
      arg.classdef[x].className = x;
      this.classdef[x] = new ClassDef(arg.classdef[x]);
    });

    // 指示タグの展開
    v.cnt = 10; // 最大ループ回数
    while( v.cnt > 0 ){
      v.fixed = true;
      Object.keys(this.classdef).forEach(x => {
        if( this.classdef[x].createMd() === '' ) v.fixed = false;
      });
      v.cnt -= (v.fixed ? 10 : 1);
    }

    // Markdownファイルの出力
    if( this.opt.autoOutput ) this.outputMD();
  }

  /** outputMD: フォルダを作成、Markdownファイルを出力
   * @param {void}
   * @returns {void}
   */
  outputMD(){
    // 1️⃣ 指定されたフォルダが存在しない場合に作成
    if (!fs.existsSync(this.opt.folder)) {
      fs.mkdirSync(this.opt.folder, { recursive: true });
    }

    // 2️⃣ 指定フォルダ以下のファイル・フォルダを全部削除
    for (const entry of fs.readdirSync(this.opt.folder)) {
      const target = path.join(this.opt.folder, entry);
      fs.rmSync(target, { recursive: true, force: true });
    }

    // 3️⃣ implement毎にフォルダを作成
    const folder = {};
    BaseDef.implements.forEach(x => {
      folder[x] = path.join(this.opt.folder,x);
      fs.mkdirSync(folder[x]);
    });

    // 4️⃣ ClassDef毎にファイルを作成
    Object.keys(this.classdef).forEach(def => {
      BaseDef.implements.forEach(x => {
        if( this.classdef[def].implement.find(i => i === x) ){
          fs.writeFileSync(path.join(folder[x], `${def}.md`),
            (this.classdef[def].content || '').trim(), "utf8");
        }
      });
    });
  }

}

/** ClassDef - クラス・クロージャ関数定義
 * ===== メンバ =====
 * @typedef {Object} ClassDef - クラス・クロージャ関数定義
 * @prop {string} name - 🔢クラス名
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} [desc=''] - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️補足説明。概要欄に記載
 * @prop {string} [summary=''] - ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義集
 * @prop {Object.<string,MethodDef>} method - メソッド定義(マップ)
 * @prop {Object.<string,boolean>} implement - 実装の有無(ex.['cl','sv'])
 * @prop {string} [template] - Markdown出力時のテンプレート
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
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

    this.name = arg.className || '';
    this.extends = arg.extends || '';
    this.desc = arg.desc || '';
    this.note = this.trimIndent(arg.note || '');
    this.summary = this.trimIndent(arg.summary || '');
    this.implement = arg.implement || [];

    // BaseDefメンバに値設定
    this.className = this.name;
    this.methodName = '';
    this.title = this.article({
      title: `${this.name} クラス仕様書`,
      level: 1,
      anchor: this.anchor,
      link: '',
      navi: '',
      body: '',
    });
    this.template = this.trimIndent(arg.template || `
      %% this.desc %%

      %% this.trimIndent(this.note) %%

      %% this.summary.length === 0 ? '' : \`## <span id="${this.anchor}_summary">🧭 ${this.name} クラス 概要</span>\\n\\n${this.summary}\` %%
    `);

    // 新しく出てきたimplement要素をprj.imprementsに追加登録
    BaseDef.implements = this.implement;

    // 現在作成中のClassDefをBaseDefのマップに登録
    BaseDef.defs = this;

    // 子要素のインスタンス作成
    this.members = new MembersDef(arg.members,this);
    this.method = {};
    this.methods = new MethodsDef(arg.methods,this);

  }

  createMd(){ // BaseDef.createMdをオーバーライド
    const v = {};
    if( this.content === '' ){
      // ①自分(クラス概要)の作成(BaseDefと同じ)
      v.r = this.evaluate(this.template);
      if( v.r === '' ) return '';
      this.content = this.title + '\n\n' + v.r;

      // ②MembersDef, MethodsDef のcreateMDを呼び出す(ClassDef特有)
      v.members = this.members.createMd();
      if( v.members === '' ) return '';
      this.content += '\n\n' + v.members;
      v.methods = this.methods.createMd();
      if( v.methods === '' ) return '';
      this.content += '\n\n' + v.methods;
    }
    return this.content;
  }
}

/** MembersDef - クラスの内部変数の定義
 * ===== メンバ =====
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * @prop {FieldDef[]} [list=[]] - 所属するメンバの配列
 * @prop {string} table - 🔢メンバ一覧のMarkdown
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * %% this.cfTable(BaseDef.defs["${this.className}"].members) %%
 * ```
 */
class MembersDef extends BaseDef {
  constructor(arg={},classdef){
    super(arg);

    // BaseDefメンバに値設定
    this.className = classdef.className;
    this.methodName = '';
    this.title = this.article({
      title: `🔢 ${this.className} メンバ一覧`,
      level: 2,
      anchor: classdef.anchor + '_members',
      link: '',
      navi: '',
      body: '',
    });

    // 子要素のインスタンス作成
    this.list = [];
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new FieldDef(arg.list[i],i,this);
    }

    // メンバ一覧とテンプレートの作成
    this.table = this.cfTable(this);
    this.template = this.trimIndent(arg.template || `
      %% BaseDef.defs["${this.className}"].members.table %%`);

  }
}
/** FieldDef - メンバの定義(Schema.columnDef上位互換)
 * ===== メンバ =====
 * @typedef {Object} FieldDef - メンバの定義(Schema.columnDef上位互換)
 * @prop {string} name - 項目(引数)名。原則英数字で構成(システム用)
 * @prop {string} [label=''] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @prop {string[]} [alias=[]] - 複数タイプのCSVを統一フォーマットで読み込む際のnameの別名
 * @prop {string} [desc=''] - 端的なメンバの説明(詳細はnoteに記述)
 * @prop {string} [note=''] - ✂️備考
 * @prop {string} [type='string'] - データ型。'|'で区切って複数記述可
 * @prop {string} [default=''] - 既定値
 *   テーブル定義(columnDef)の場合、行オブジェクトを引数とするtoString()化された文字列も可
 * @prop {boolean} [isOpt=false] - 必須項目ならfalse。defaultが定義されていた場合は強制的にtrue
 * @prop {string} [printf=null] - 表示整形用関数。行オブジェクトを引数とするtoString()化された文字列
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 */
class FieldDef extends BaseDef {
  /**
   * @param {FieldDef} arg 
   * @param {number} seq 
   */
  constructor(arg,seq,parent){
    super(arg);

    // BaseDefメンバに値設定
    this.className = parent.className;
    this.methodName = parent.methodName;
    this.title = '';
    this.template = '';

    this.name = arg.name || '';
    this.label = arg.label || '';
    this.alias = arg.alias || [];
    this.desc = arg.desc || '';
    this.note = this.trimIndent(arg.note || '');
    this.type = arg.type || 'string';
    this.default = arg.default || '';
    this.isOpt = this.default === '' ? true : (arg.isOpt || false);
    this.printf = arg.printf || null;
    this.seq = seq;
  }
}
/** MethodsDef - クラスのメソッド集
 * ===== メンバ =====
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * @prop {MethodDef[]} list - 所属するメソッドの配列
 * @prop {string} table - 🔢メソッド一覧のMarkdown
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} methodsList - メソッド一覧をMarkdownで作成
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
    super(arg);
    const v = {};

    // BaseDefメンバに値設定
    this.className = classdef.className;
    this.methodName = '';
    this.anchor = classdef.anchor;

    // 子要素のインスタンス作成
    this.list = arg.list || [];
    for( v.i=0 ; v.i<this.list.length ; v.i++ ){
      // methodNameを設定
      this.list[v.i].methodName = this.list[v.i].name;
      // ClassDef.methodとlistにMethodDef登録
      this.list[v.i] = classdef.method[this.list[v.i].name]
      = classdef.method[this.list[v.i].name.toLowerCase()]
      = new MethodDef(this.list[v.i],this);
    }

    // タイトルの作成
    this.title = this.article({
      title: `🧱 ${this.className} メソッド一覧`,
      level: 2,
      anchor: `${classdef.anchor}_methods`,
      link: '',
      navi: '',
      body: '',
    });

    // メソッド一覧とテンプレートの作成
    v.lines = ['','| メソッド名 | 分類 | 内容 | 備考 |',
      '| :-- | :-- | :-- | :-- |'];
    this.list.forEach(x => v.lines.push(`| ${
      `[${x.name}()](#${classdef.anchor}_${x.name.toLowerCase()})`
    } | ${x.type} | ${x.desc} | ${x.note} |`));
    this.table = v.lines.join('\n');
    this.template = this.trimIndent(arg.template || 
      `%% BaseDef.defs["${this.className}"].methods.table %%`);
  }

  createMd(){ // BaseDef.createMdをオーバーライド
    const v = {};
    if( this.content === '' ){
      // ①自分(クラス概要)の作成(BaseDefと同じ)
      v.r = this.evaluate(this.template);
      if( v.r === '' ) return '';
      this.content = this.title + '\n\n' + v.r;

      // ②MembersDef, MethodsDef のcreateMDを呼び出す(ClassDef特有)
      for( v.i=0 ; v.i<this.list.length ; v.i++ ){
        v.method = this.list[v.i].createMd();
        if( v.method === '' ) return '';
        this.content += '\n\n' + v.method;
      }
    }
    return this.content;
  }
}

/** MethodDef - 関数・アロー関数・メソッド定義
 * ===== メンバ =====
 * @typedef {Object} MethodDef - 関数・アロー関数・メソッド定義
 * @prop {string} name - 関数(メソッド)名
 * @prop {string} [type=''] - 関数(メソッド)の分類
 *   public/private, static, async, get/set, accessor, etc
 * @prop {string} [desc=''] - 端的な関数(メソッド)の説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️注意事項。Markdownで記載
 * @prop {string} [source=''] - ✂️想定するソースコード
 * @prop {string[]} [lib=[]] - 本関数(メソッド)で使用する外部ライブラリ
 * @prop {number} [rev=0] - 0:未着手 1:完了 0<n<1:作成途中
 * @prop {ParamsDef} params - 引数
 * @prop {string} process - ✂️処理手順。Markdownで記載
 * @prop {ReturnsDef} returns - 戻り値の定義(パターン別)
 * @prop {Object.<number,ReturnDef>} return - 🔢戻り値のマップ。メンバ名は戻り値のデータ型
 * @prop {Object[]} [caller=[]] - 🔢本関数(メソッド)の呼出元関数(メソッド)
 * @prop {string} caller.class - 呼出元クラス名
 * @prop {string} caller.method - 呼出元メソッド名
 * 
 * - listで個々のメソッドを定義、MethodDefインスタンスはmemberに登録
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} createCaller - 呼出元一覧を作成(Markdown)「📞 呼出元」
 * 
 * @example this.template初期値
 * ※ 出力時不要な改行は削除するので内容有無は不問
 * ```
 * %% this.article(this.note) %%
 * %% this.article(this.sorce) %%
 * %% this.createCaller() %%
 * %% this.params.createMd() %%
 * %% this.evaluate(this.process) %%
 * %% this.returns.createMd() %%
 * ```
 */
class MethodDef extends BaseDef {
  constructor(arg={},methodsdef){
    super(arg);

    // BaseDefメンバに値設定
    this.className = methodsdef.className;
    this.methodName = arg.methodName;
    this.anchor = methodsdef.anchor + '_' + arg.methodName.toLowerCase();

    // 独自メンバに値設定
    this.name = arg.name;
    this.type = arg.type || '';
    this.desc = arg.desc || '';
    this.note = this.trimIndent(arg.note || '');
    this.source = this.trimIndent(arg.source || '');
    this.lib = arg.lib || '';
    this.rev = arg.rev || 0;
    this.params = new ParamsDef(arg.params,this);
    this.process = this.trimIndent(arg.process || '');
    this.return = {};
    this.returns = new ReturnsDef(arg.returns,this);
    this.caller = [];

    // 個別メソッドのタイトル
    this.title = this.article({
      title: `🧱 ${this.className}.${this.methodName}()`,
      level: 3,
      anchor: this.anchor,
      link: '',
      navi: '',
      body: '',
    });

    // 処理手順をテンプレートとして作成
    this.template = this.article({
      title: `🧾 処理手順`,
      level: 4,
      anchor: this.anchor + '_process',
      link: '',
      navi: '',
      body: '',
    }) + '\n\n' + this.trimIndent(arg.template ||
      `%% BaseDef.defs["${this.className}"].method["${this.methodName}"].process %%`);
  }

  createMd(){ // BaseDef.createMdをオーバーライド
    const v = {};
    if( this.content === '' ){
      // 引数の作成
      v.params = this.params.createMd();
      if( v.params === '' ) return '';
      
      // 自分(処理手順)の作成(BaseDefと同じ)
      v.template = this.evaluate(this.template);
      if( v.template === '' ) return '';

      // 戻り値の作成
      v.returns = this.returns.createMd();
      if( v.returns === '' ) return '';

      this.content = [
        this.title,
        '',v.params,
        '',v.template,
        '',v.returns,
      ].join('\n');
    }
    return this.content;
  }
}

/** ParamsDef - 関数(メソッド)引数定義
 * ===== メンバ =====
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * @prop {FieldDef[]} list - 引数
 * @prop {string} table - 🔢引数一覧のMarkdown
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * %% this.cfTable(this.defs[this.className].methods[this.methodName].params) %%
 * ```
 */
class ParamsDef extends BaseDef {
  constructor(arg={},methoddef){
    super(arg);

    // 子要素のインスタンス作成
    this.list = [];
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new FieldDef(arg.list[i],i,this);
    }

    // BaseDefメンバに値設定
    this.className = methoddef.className;
    this.methodName = methoddef.methodName;
    this.title = this.article({
      title: `📥 引数`, //  `📥 ${v.fn}() 引数`
      level: 4,
      anchor: `${methoddef.anchor}_params`,
      link: ``,
      navi: ``,
      body: '',
    });

    // 引数一覧とテンプレートの作成
    this.table = this.list.length === 0
      ? '- 引数無し(void)' : this.cfTable(this);
    this.template = this.trimIndent(arg.template || 
      `%% BaseDef.defs["${this.className}"].method["${this.methodName}"].params.table %%`);
  }
}

/** ReturnsDef - 関数(メソッド)戻り値定義集
 * ===== メンバ =====
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * @prop {ReturnDef[]} list - (データ型別)戻り値定義集
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 */
class ReturnsDef extends BaseDef {
  constructor(arg={},methoddef){
    super(arg);
    const v = {};

    // BaseDefメンバに値設定
    this.className = methoddef.className;
    this.methodName = methoddef.methodName;
    this.anchor = methoddef.anchor + '_returns';

    // 子要素のインスタンス作成
    this.list = arg.list || [];
    for( v.i=0 ; v.i<this.list.length ; v.i++ ){
      // MethodDef.returnとlistにReturnDef登録
      this.list[v.i] = methoddef.return[this.list[v.i].type]
      = new ReturnDef(this.list[v.i],this);
    }

    this.title = this.article({
      title: `📤 戻り値`, // `📤 ${v.fn}() 戻り値`
      level: 4,
      anchor: `${methoddef.anchor}_returns`,
      link: ``,
      navi: ``,
      body: '',
    });
    this.template = this.list.length === 0 ? `- 戻り値無し(void)` : '';
    //this.template = (this.list.length === 0 ? `- 戻り値無し(void)`
    //  : `${this.cfTable(this)}`);
  }

  createMd(){ // BaseDef.createMdをオーバーライド
    const v = {};
    if( this.content === '' ){
      // ①自分(クラス概要)の作成(BaseDefと同じ)
      v.template = this.template;
      if( v.template !== '' ){
        v.template = this.evaluate(v.template);
        if( v.template === '' ) return '';
      }
      this.content = this.title + '\n\n' + v.template;

      // ②ReturnDef のcreateMDを呼び出す(ClassDef特有)
      for( v.i=0 ; v.i<this.list.length ; v.i++ ){
        v.return = this.list[v.i].createMd();
        if( v.return === '' ) return '';
        this.content += '\n\n' + v.return;
      }
    }
    return this.content;
  }
}

/** ReturnDef - 関数(メソッド)戻り値定義
 * ===== メンバ =====
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * @prop {string} [type=''] - 戻り値のデータ型。対比表なら空文字列
 * @prop {string} [desc=''] - 本データ型に関する説明。「正常終了時」等
 * @prop {PatternDef} [default={}] - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} [patterns={}] - 特定パターンへの設定値
 * @prop {string} table - 🔢戻り値(データ型のメンバ一覧・対比表)のMarkdown
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * [${this.className}](this.defs[this.className].anchor)
 * 
 * // 戻り値データ型のメンバ一覧
 * %% this.cfTable(this.defs[this.className].methods[this.methodName].params) %%
 * // 対比表
 * %% this.cfTable(this) %%
 * ```
 */
class ReturnDef extends BaseDef {
  constructor(arg,returnsdef){
    super(arg);

    this.type = arg.type || '';
    this.desc = arg.desc || '';
    this.default = arg.default || {};
    this.patterns = arg.patterns || {};
    
    // BaseDefメンバに値設定
    this.className = returnsdef.className;
    this.methodName = returnsdef.methodName;
    this.title = this.type === '' ? (
      this.desc === '' ? '' : `- ${this.desc}`
    ) : (
      `- [${this.type}](${this.type}.md#${
        this.type.toLowerCase()}_members)${
        this.desc === '' ? '' : ' : '+this.desc}`
    );
    //this.title = `- [${this.type}](${this.type}.md#${this.type.toLowerCase()}_members)${this.desc === '' ? '' : ' : '+this.desc}`;

    // 戻り値のメンバ一覧とテンプレートの作成
    this.table = this.cfTable(this,{indent:2});
    this.template = arg.template || 
      `%% BaseDef.defs["${this.className}"].method["${this.methodName}"].return["${this.type}"].table %%`;
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

import fs from "fs";
import path from "path";
import readline from "readline";

const lines = [];
const rl = readline.createInterface({ input: process.stdin });
const clog = (l,x) => console.log(`l.${l} ${JSON.stringify(x,null,2)}`);

rl.on('line', x => lines.push(x)).on('close', () => {
  const arg = analyzeArg();
  const prj = new ProjectDef(lines.join('\n'),{folder:arg.opt.o});
  //clog(9999,removeDefs(prj));
});
