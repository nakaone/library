/** specify: JavaScriptオブジェクトで定義した内容をMarkdownで出力
 * - グローバル関数は"global"クラスのメソッド、グローバル変数は"global"クラスのメンバとして処理
 * 
 * @example
 * 1. 定義部分(def.js)
 *    ```js
 *    console.log(JSON.stringify({  // オブジェクトで仕様を定義、JSONを標準出力に出力
 *      authAuditLog: {
 *        label: 'authServerの監査ログ',
 *        note: `
 *          - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
 *          - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力`,
 *        members: [...],
 *        methods: {
 *          constructor: {
 *            type: 'private',
 *            label: 'コンストラクタ',
 *            params: [],
 *            process: `- メンバと引数両方にある項目は、引数の値をメンバとして設定`,
 *            returns: {authAuditLog:{}},
 *          },
 *        },
 *      },
 *    }));
 *    ```
 * 2. 仕様書作成エンジン(specify.js)
 *    ```js
 *    // JSON化された定義を処理、出力先フォルダにMarkdownファイルを作成
 *    const lines = [];
 *    const rl = require('readline').createInterface({input: process.stdin});
 *    rl.on('line', x => lines.push(x)).on('close',() => {
 *      rl.close();
 *      classdef = JSON.parse(lines.join('\n'));
 *      main();
 *    });
 *    ```
 * 3. ビルダー(build.sh)
 *    ```zsh
 *    # クラス別定義
 *    node $src/doc/def.js | node $prj/tools/specify.js -o:$tmp
 *    ```
 * 
 * ■ 凡例
 * - 🔢：導出項目(定義不要)
 * - ✂️：trimIndent対象項目
 */

/**
 * @typedef {Object} BaseDef - 各定義の基底クラス
 * @prop {ProjectDef} prj - ProjectDefインスタンス
 */
class BaseDef {
  static _implements = [];  // 実装環境の一覧
  static _defMap = {};  // ClassDefのマップ

  constructor(){
    this.fixed = false; // 当該クラスの内容が確定したらtrue
  }

  static get implements(){
    return this._implements;
  }
  static set implements(arg){
    arg.forEach(imp => {
      if( !this._implements.find(x => x === imp) ){
        this._implements.push(imp);
      }
    });
  }
  static get defMap(){
    return this._defMap;
  }
  static set defMap(arg){
    this._defMap[arg.name] = arg;
  }
  /**
   * 与えられた文字列から、先頭末尾の空白行と共通インデントを削除する
   * @param {string} str - 対象文字列（複数行）
   * @returns {string} 加工後の文字列
   */
  trimIndent(str) {
    // 1. 先頭・末尾の空白行削除
    if( !str ) return '';
    const lines = str.replace(/^\s*\n+|\n+\s*$/g, '').split('\n');
    if( lines.length === 0 ) return '';

    // 2. 1行だけの場合、先頭のスペースを削除して終了
    if( lines.length === 1 ) return lines[0].trim();

    // 3. 複数行の場合、各行の共通インデント(スペース・タブ)を取得
    const indents = lines
      .filter(line => line.trim() !== '')
      .map(line => line.match(/^[ \t]*/)[0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;

    // 4. 共通インデントを削除、各行を結合した文字列を返す
    return lines.map(line => line.slice(minIndent)).join('\n');
  }
  /** cfTable: 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
   * @param {MembersDef|ParamsDef|ReturnDef} obj - 表示対象を指定するオブジェクト
   * @param {Object} [opt={}]
   * @param {Object.<string,string>} opt.header - ヘッダ行の定義
   * @param {boolean} [opt.name=true] - 「項目名」欄の表示/非表示
   * @param {boolean} [opt.type=true] - 「データ型」欄の表示/非表示
   * @param {boolean} [opt.default=true] - 「既定値」欄の表示/非表示
   * @param {boolean} [opt.desc=true] - 「説明」欄の表示/非表示
   * @param {boolean} [opt.note=true] - 「備考」欄の表示/非表示
   * @returns {string} 作成した表(Markdown)
   */
  cfTable(obj,opt={}){
    const v = {rv:[],header:Object.assign({name:'項目名',type:'データ型',
      default:'要否/既定値',desc:'説明',note:'備考'},(opt.header || {}))};
    // オプションの既定値設定
    opt = Object.assign({name:true,type:true,default:true,label:true,note:true},opt);

    // fv: 表示する値を整形して文字列化(format value)
    const fv = x => typeof x === 'string' ? x : 
      ((typeof x === 'object' || Number.isNaN(x)) ? JSON.stringify(x) : x.toLocaleString());

    // 出力項目リストを作成
    Object.keys(v.header).forEach(x => {
      if( opt[x] === false ) delete v.header[x];
    })

    // 原本のメンバリストをv.listとして取得(複数パターンもあるので配列で)
    switch( obj.constructor.name ){
      case 'MembersDef':
      case 'ParamsDef':
        // メンバ一覧または引数一覧の場合は単一の表
        v.obj = {
          header:Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(obj.list)), // {FieldDef[]}
        };
        break;
      case 'ReturnDef':
        // 未定義のデータ型の場合"unregistered type"を返して終了
        if( typeof BaseDef.defMap[obj.type] === 'undefined' ){
          return new Error('unregistered type');
        }
        v.obj = {
          header: Object.assign({},v.header),
          body: JSON.parse(JSON.stringify(BaseDef.defMap[obj.type])).members.list,
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
      default:
        return new Error('invalid argument\n'
          + JSON.stringify({constructor:obj.constructor.name,obj:obj,opt:opt},null,2));
    }

    // ヘッダ行の作成
    v.cols = Object.keys(v.obj.header);
    v.rv.push(`\n| ${v.cols.map(x => v.obj.header[x] || x).join(' | ')} |`);
    v.rv.push(`| ${v.cols.map(()=>':--').join(' | ')} |`);

    // データ行の作成
    for( v.i=0 ; v.i<v.obj.body.length ; v.i++ ){
      // 既定値欄の表示内容を作成
      v.obj.body[v.i].default = v.obj.body[v.i].default !== '' ? fv(v.obj.body[v.i].default)
      : (v.obj.body[v.i].isOpt ? '任意' : '<span style="color:red">必須</span>');
      // 一項目分のデータ行を出力
      v.rv.push(`| ${v.cols.map(x => fv(v.obj.body[v.i][x])).join(' | ')} |`);
    }

    return v.rv.join('\n');
  }
}

/**
 * @typedef {Object} ProjectDef - プロジェクト全体定義
 * @prop {Object.<string,ClassDef|MethodDef>} defs - 関数・クラスの定義集
 * @prop {Object.<string,string>} classMap - 小文字のクラス名から本来のクラス名への変換マップ
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {Object} opt - 起動時オプション
 */
class ProjectDef extends BaseDef {
  /**
   * @param {ProjectDef} arg 
   * @param {Object} [opt={}] - オプション
   * @param {string} [opt.autoOutput=true] - 二次設定後、作成したMarkdownを出力
   * @param {string} [opt.folder] - 出力先フォルダ名。無指定の場合カレントフォルダ
   * @param {boolean} [opt.makeList=true] - true:関数・クラス名一覧を作成
   */
  constructor(arg,opt={}){
    super();
    const v = {};

    // 文字列で渡された場合はオブジェクト化
    if( typeof arg === 'string' ) arg = JSON.parse(arg);
    // オプションの既定値設定
    this.opt = Object.assign({
      autoOutput: true,
      folder: '.',
      makeList: true,
    },opt);

    // 一次設定：関数・クラス定義のインスタンスを順次作成
    this.defs = {};
    Object.keys(arg.defs).forEach(x => {
      this.classMap[x.toLowerCase()] = x;
      if( arg.defs[x].hasOwnProperty('members') || arg.defs[x].hasOwnProperty('methods')){
        this.defs[x] = new ClassDef(arg.defs[x],x);
      } else {
        this.defs[x] = new MethodDef(arg.defs[x],x);
      }
    });

    // 二次設定
    v.cnt = 10; // 最大ループ回数
    while( v.cnt > 0 ){
      this.fixed = true;
      Object.keys(this.defs).forEach(x => {
        if( this.defs[x].secondary() === false ) this.fixed = false;
      });
      v.cnt -= (this.fixed ? 10 : 1);
    }

    // Markdownファイルの出力
    if( this.opt.autoOutput ) this.outputMD();
  }

  /** フォルダを作成、Markdownファイルを出力 */
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
    Object.keys(this.defs).forEach(def => {
      BaseDef.implements.forEach(x => {
        if( this.defs[def].implement.find(i => i === x) ){
          fs.writeFileSync(path.join(folder[x], `${def}.md`),
            (this.defs[def].markdown.content || '').trim(), "utf8");
        }
      });
    });
  }
}

/**
 * @typedef {Object} ClassDef - クラス・クロージャ関数定義
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} [desc=''] - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️補足説明。概要欄に記載
 * @prop {string} [summary=''] - ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義
 * @prop {Object.<string,boolean>} implement - 実装の有無(ex.['cl','sv'])
 * @prop {string} name - 🔢クラス名
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 */
class ClassDef extends BaseDef {
  /**
   * @param {ClassDef} arg 
   * @param {string} className 
   */
  constructor(arg={},className){
    super();

    this.extends = arg.extends || '';
    this.desc = arg.desc || '';
    this.note = this.trimIndent(arg.note || '');
    this.summary = this.trimIndent(arg.summary || '');
    this.members = new MembersDef(arg.members,className);
    this.methods = new MethodsDef(arg.methods,className);
    this.implement = arg.implement || [];
    this.name = className;
    this.markdown = MarkdownDef.setMd(arg.markdown);

    // 新しく出てきたimplement要素をprj.imprementsに追加登録
    BaseDef.implements = this.implement;

    // 現在作成中のClassDefをBaseDefのマップに登録
    BaseDef.defMap = this;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    const v = {lines:[]};
    this.members.secondary();
    this.methods.secondary();
    this.fixed = this.members.fixed && this.methods.fixed;

    // メンバ・メソッドとも確定したらクラス概要部分を作成
    if( this.fixed ){
      if( this.desc.length > 0 )  // 端的なクラスの説明
        v.lines = v.lines.concat(['',this.desc]);
      if( this.note.length > 0 )  // 補足説明
        v.lines = v.lines.concat(['',this.note]);
      if( this.summary.length > 0 )  // 概要
        v.lines = v.lines.concat(['',
          `## <span id="${cn}_summary">🧭 ${this.name} クラス 概要</span>`,
          '',this.summary]);
      v.lines.push(this.members.markdown.content);
      v.lines.push(this.methods.markdown.content);

      this.markdown = new MarkdownDef(Object.assign({
        title: `${this.name} クラス仕様書`,
        level: 1,
        anchor: this.name.toLowerCase(),
        link: '',
        navi: '',
        content: v.lines.join('\n'),
      },this.markdown));
    }

    return this.fixed;
  }
}

/**
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * @prop {FieldDef[]} list - 所属するメンバの配列
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
class MembersDef extends BaseDef {
  /**
   * @param {MembersDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    super();

    this.list = [];
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new FieldDef(arg.list[i],i,className);
    }
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = true;
    this.list.forEach(x => {
      if( x.secondary() === false ) this.fixed = false;
    });

    // メンバが全て確定したらメンバ一覧を作成
    if( this.fixed ){
      this.markdown = new MarkdownDef(Object.assign({
        title: `🔢 ${this.className} メンバ一覧`,
        level: 2,
        anchor: `${this.className.toLowerCase()}_members`,
        link: ``,
        navi: ``,
        content: `${this.cfTable(this)}`,
      },this.markdown));
    }

    return this.fixed;
  }
}

/**
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
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名(引数・戻り値の場合のみ)
 */
class FieldDef extends BaseDef {
  /**
   * @param {FieldDef} arg 
   * @param {number} seq 
   * @param {string} [className='']
   * @param {string} [functionName=''] 
   */
  constructor(arg,seq,className='',functionName=''){
    super();

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
    this.className = className;
    this.functionName = functionName;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = true;
    return this.fixed;
  }
}

/**
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * @prop {MethodDef[]} list - 所属するメソッドの配列
 * @prop {Object} methodMap - 小文字のメソッド名から本来のメソッド名への変換マップ
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
class MethodsDef extends BaseDef {
  /**
   * @param {MethodsDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    super();

    this.list = [];
    this.methodMap = {};
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new MethodDef(arg.list[i],className);
      this.methodMap[this.list[i].name.toLowerCase()] = this.list[i];
    }
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = true;
    this.list.forEach(x => {
      if( x.secondary() === false ) this.fixed = false;
    });

    // メソッドが全て確定したらメソッド一覧を作成
    if( this.fixed ){
      const v = {
        lines:['',`| メソッド名 | 型 | 内容 |`,'| :-- | :-- | :-- |'],
        cn: this.className.toLowerCase(),
        methodMd: [], // メソッド別詳細Markdown
      };

      this.list.forEach(x => {  // {MethodDef}
        v.methodMd.push(x.markdown.content);
        v.mn = x.name.toLowerCase();
        v.lines.push(`| ${`[${x.name}](#${v.cn}_${v.mn})`} | ${x.type} | ${x.desc}`);
      });
      
      v.lines = [...v.lines, ...v.methodMd];
      this.markdown = new MarkdownDef(Object.assign({
        title: `🧱 ${this.className} メソッド一覧`,
        level: 2,
        anchor: `${v.cn}_methods`,
        link: ``,
        navi: ``,
        content: `${v.lines.join('\n')}`,
      },this.markdown));
    }

    return this.fixed;
  }
}

/**
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
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} [className=''] - 🔢所属するクラス名(メソッドのみ)
 * @prop {CallerDef[]} caller - 🔢本関数(メソッド)の呼出元関数(メソッド)。メソッドの場合"クラス.メソッド名"
 */
/**
 * @typedef {Object} CallerDef - 呼出元関数情報
 * @prop {string} class - 呼出元クラス名
 * @prop {string} method - 呼出元メソッド名
 */
class MethodDef extends BaseDef {
  /**
   * @param {MethodDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    super();

    this.name = arg.name;
    this.type = arg.type || '';
    this.desc = arg.desc || '';
    this.note = this.trimIndent(arg.note || '');
    this.source = this.trimIndent(arg.source || '');
    this.lib = arg.lib || '';
    this.rev = arg.rev || 0;
    this.params = new ParamsDef(arg.params,className,this.name);
    this.process = this.trimIndent(arg.process || '');
    this.returns = new ReturnsDef(arg.returns,className,this.name);
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
    this.caller = [];
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = this.params.secondary() && this.returns.secondary();

    // 引数・戻り値とも確定したらメソッド概要部分を作成
    if( this.fixed ){
      const v = {
        baseLevel: 3,  // 各メソッドのレベル
        cn: this.className.toLowerCase(),
        mn: this.name.toLowerCase(),
        fn: (this.className ? this.className + '.' : '') + this.name,
      };
      v.baseAnchor = `#${v.cn}_${v.mn}`;

      v.process = new MarkdownDef({
        title: `🧾 処理手順`,
        level: v.baseLevel+1,
        anchor: v.baseAnchor + '_process',
        link: ``,
        navi: ``,
        content: `\n${this.process}`,
      });

      // メソッドのMarkdownDef.contentの作成
      this.markdown = new MarkdownDef(Object.assign({
        title: `🧱 ${v.fn}()`,
        level: v.baseLevel,
        anchor: v.baseAnchor,
        link: ``,
        navi: ``,
        content: [
          // 呼出元
          '',this.params.markdown.content,  // 引数
          '',v.process.content,  // 処理手順
          '',this.returns.markdown.content,  // 戻り値
        ].join('\n'),
      },this.markdown));
    }
    return this.fixed;
  }
}

/**
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * @prop {FieldDef[]} list - 引数
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
class ParamsDef extends BaseDef {
  /**
   * @param {ParamsDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    super();

    this.list = [];
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new FieldDef(arg.list[i],i,className);
    }
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
    this.functionName = functionName;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = true;
    this.list.forEach(x => {
      if( x.secondary() === false ) this.fixed = false;
    });

    // 引数が全て確定したら引数一覧を作成
    if( this.fixed ){
      const v = {
        cn: this.className.toLowerCase(),
        mn: this.functionName.toLowerCase(),
        fn: (this.className ? this.className + '.' : '') + this.functionName,
      };

      this.markdown = new MarkdownDef(Object.assign({
        title: `📥 引数`, //  `📥 ${v.fn}() 引数`
        level: 4,
        anchor: `${v.cn}_${v.mn}_param`,
        link: ``,
        navi: ``,
        content: (this.list.length === 0 ? `- 引数無し(void)` : `${this.cfTable(this)}`),
      },this.markdown));
    }
    return this.fixed;
  }
}

/**
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * @prop {ReturnDef[]} list - (データ型別)戻り値定義集
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
class ReturnsDef extends BaseDef {
  /**
   * @param {ReturnsDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    super();

    this.list = [];
    for( let i=0 ; i<arg.list.length ; i++ ){
      this.list[i] = new ReturnDef(arg.list[i],className,functionName);
    }
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
    this.functionName = functionName;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    this.fixed = true;
    this.list.forEach(x => {
      if( x.secondary() === false ) this.fixed = false;
    });

    // 引数が全て確定したら引数一覧を作成
    if( this.fixed ){
      const v = {
        cn: this.className.toLowerCase(),
        mn: this.functionName.toLowerCase(),
        fn: (this.className ? this.className + '.' : '') + this.functionName,
        returnMd: [], // 戻り値(データ型)別詳細Markdown
      };

      if( this.list.length === 0 ){
        v.returnMd = [`- 戻り値無し(void)`];
      } else {
        this.list.forEach(x => {
          v.returnMd.push(x.markdown.content);
        });
      }

      this.markdown = new MarkdownDef(Object.assign({
        title: `📤 戻り値`, // `📤 ${v.fn}() 戻り値`
        level: 4,
        anchor: `${v.cn}_${v.mn}_return`,
        link: ``,
        navi: ``,
        content: `${v.returnMd.join('\n')}`,
      },this.markdown));
    }

    return this.fixed;
  }
}

/**
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * @prop {string} type - 戻り値のデータ型
 * @prop {PatternDef} [default={}] - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} [patterns={}] - 特定パターンへの設定値
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
/**
 * @typedef {Object.<string,string>} PatternDef - パターンに設定する値
 * @example {name:'fuga'} ⇒ 戻り値のデータ型のメンバ'name'に'fuga'を設定
 */
class ReturnDef extends BaseDef {
  /**
   * @param {ReturnDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    super();

    this.type = arg.type || '';
    this.default = arg.default || {};
    this.patterns = arg.patterns || {};
    this.markdown = MarkdownDef.setMd(arg.markdown);
    this.className = className;
    this.functionName = functionName;
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

    // 戻り値のMarkdownDef.contentの作成
    this.markdown = new MarkdownDef(this.markdown);

    return this.markdown.fixed;
  }
}

/**
 * @typedef {Object} MarkdownDef - Markdown文書作成時の定義
 * @prop {string} [title=''] - タイトル
 * @prop {number} [level=0] - 階層。0ならタイトルに'#'を付けない
 * @prop {string} [anchor=''] - タイトルに付けるアンカー
 *   "## <span id="[anchor]">タイトル</span>"
 * @prop {string} [link=''] - タイトルに付けるリンク
 *   "## <a href="[link]">タイトル</a>"
 *   "## <span id="[anchor]"><a href="[link]">タイトル</a></span>"
 * @prop {string} [navi=''] - ナビゲーション
 * @prop {string} [content=''] - 本文のテンプレート
 */
class MarkdownDef extends BaseDef {
  /**
   * - MarkdownDefのインスタンス化はmakeMd()で行われる<br>
   *   ⇒ 二次設定が終了し、データは全て確定済
   * @param {MarkdownDef} arg - ユーザ指定
   * @returns {MarkdownDef}
   */
  constructor(arg){
    const v = {};
    super();

    this.title = arg.title || '';
    this.level = arg.level || 0;
    this.anchor = arg.anchor || '';
    this.link = arg.link || '';
    this.navi = arg.navi || '';
    this.content = arg.content || '';

    v.title = this.title;
    if( this.link.length > 0 )
      v.title = `<a href="${this.link}">${v.title}</a>`;
    if( this.anchor.length > 0 )
      v.title = `<span id="${this.anchor}">${v.title}</span>`;
    if( this.level > 0 )
      v.title = `${'#'.repeat(this.level)} ${v.title}`;

    this.content = (arg.content || `\n${v.title}\n${this.content}\n`)
    .replaceAll(/\n\n\n+/g,'\n\n');
  }
  secondary(){  /** 二次設定 */
    if( this.fixed ) return true;

  }
  evalContent(str){
    const links = [];

    // 外部リンク
    const rexF = /\[([^\]]+)\]\(([^)]+)\.md#([a-z0-9]+)_([a-z0-9]+)\)/gi;
    let m;
    while ((m = rexF.exec(this.process)) !== null) {
      // m[1]=①, m[2]=②, m[3]=③, m[4]=④
      //links.push([m[1], m[2], m[3], m[4]]);
      links.push({
        linkText: m[1],
        className: m[2],  // 参照先のクラス名(大文字含む)
        lowerCN: m[3],  // 参照先のクラス名(小文字のみ)
        methodName: '',   // 参照先のメソッド名(大文字含む)
        lowerMN: m[4], // 参照先のメソッド名(小文字のみ)
      })
    }

    // ローカルリンク
    const rexL = /\[([^\]]+)\]\(#([a-z0-9]+)_([a-z0-9]+)\)/gi;
    while ((m = rexL.exec(this.process)) !== null) {
      // m[1]=①, m[2]=②, m[3]=③, m[4]=④
      //links.push([m[1], m[2], m[3], m[4]]);
      links.push({
        linkText: m[1],
        className: this.className,  // 参照先のクラス名(大文字含む)
        lowerCN: m[2],  // 参照先のクラス名(小文字のみ)
        methodName: '',   // 参照先のメソッド名(大文字含む)
        lowerMN: m[3], // 参照先のメソッド名(小文字のみ)
      })
    }

    // 参照先メソッドのcallerにリンク元メソッドを追加
    if( links.length > 0 ){
      links.forEach(link => {
        const methods = BaseDef.defMap[link.className].methods; // 参照先クラスのメソッド(集合)
        link.methodName = methods.methodMap[lowerMN]; // 大文字を含むメソッド名
        const method = methods.link.find(x => x.name === link.methodName);
        if( typeof method !== 'undefined' ){
          if( !(method.caller.find(x => x.class === link.className && x.method === link.methodName))){
            // caller未登録なら追加登録
            caller.push({class:link.className,method:link.methodName});
          }
        }
      });
    }

  }
  /** replaceTags: テキスト内の"<!--%%〜%%-->"を評価して結果で置換
   * @param {string} str - 操作対象テキスト
   * @returns {string} 評価・置換結果
   */
  replaceTags(str){
    // 置換対象の文字列内の関数名には「this.」が付いてないので付加
    const cfTable = this.cfTable;

    const v = {str:this.trimIndent(str)};
    [...v.str.matchAll(/(\n*)(\s*)<!--%%([\s\S]*?)%%-->/g)].forEach(x => {
      // x[0]: マッチした文字列(改行＋タグ前のスペース＋式)
      // x[1]: 改行
      // x[2]: タグ前のスペース
      // x[3]: 式
      // ①式を評価
      v.result = eval(x[3]).trim();
      // ②評価結果の各行頭にタグ前のスペースを追加
      v.result = v.result.split('\n').map(l => x[2]+l).join('\n');
      v.str = v.str.replace(x[0],x[1]+v.result);
    })
    return v.str;
  }
  static setMd(arg=null){  // 文字列が渡された場合はcontentと看做す
    return arg === null ? {} : ( typeof arg === 'string' ? {content:arg} : arg);
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

import fs from "fs";
import path from "path";
import readline from "readline";

const lines = [];
const rl = readline.createInterface({ input: process.stdin });
const clog = (l,x) => console.log(`l.${l} ${JSON.stringify(x,null,2)}`);

rl.on('line', x => lines.push(x)).on('close', () => {
  const arg = analyzeArg();
  const prj = new ProjectDef(lines.join('\n'),{folder:arg.opt.o});
  delete prj.prj; // 循環参照を削除
});
