/*
1. JSDocParser.parseFile の導入:
    ◦ fs.readFileSync でソースコードを直接読み込み、正規表現 を用いて @prop や @param、さらに Schema クラス特有の types ブロック（authRequest などの定義）を抽出します。
    ◦ これにより、これまで specDef.js に手動で転記していた作業が不要になります。
2. ProjectDef の変更:
    ◦ コンストラクタの引数として「解析済みJSON」ではなく 「ファイルパスの配列」 を受け取ります。
    ◦ ループ内で JSDocParser.parseFile(filePath) を呼び出し、動的に ClassDef を生成します。
3. データ型定義の自動抽出:
    ◦ authConfig.mjs 内の types: { authRequest: { cols: [...] } } などの記述から、自動的に authRequest.md などの独立したドキュメントを生成できるように generatedTypes 配列を処理しています。
このツールにより、authConfig.mjs の cols を書き換えるだけで、ソースコード・通信仕様・ドキュメントの三者が常に一致 する Single Source of Truth が実現されます。
*/

import fs from "fs";
import path from "path";

/** 
 * JSDocParser: ソースコードから JSDoc と Schema 定義を抽出する静的クラス
 */
class JSDocParser {
  /**
   * parseFile: 指定されたファイルを解析し、ClassDef 用の定義オブジェクトを返す
   * @param {string} filePath 
   */
  static parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // クラス定義の雛形
    const def = {
      ClassName: fileName,
      desc: '',
      note: '',
      members: { list: [] },
      methods: { list: [] },
      implement: ['cl', 'sv'], // 既定で両方
      generatedTypes: [] // Schema.types から抽出されるデータ型
    };

    // 1. クラス説明 (@classdesc) の抽出
    const classDesc = content.match(/@classdesc\s+([^\n*]+)/);
    if (classDesc) def.desc = classDesc[1].trim();

    // 2. メンバ変数 (@prop) の抽出
    const props = content.matchAll(/@prop\s+\{([^}]+)\}\s+([^\s-]+)\s*(?:-\s*)?([^\n]*)/g);
    for (const m of props) {
      def.members.list.push({ type: m[1], name: m[2], desc: m[3] });
    }

    // 3. Schema.types 定義の抽出 [25, 53]
    // ソース内の types: { ... } の中身を正規表現で解析
    const typesSection = content.match(/types:\s*\{([\s\S]*?)\n\s*\},/);
    if (typesSection) {
      const typeEntries = typesSection[1].matchAll(/(\w+):\s*\{desc:\s*'([^']+)'[\s\S]*?cols:\s*\[([\s\S]*?)\]/g);
      for (const entry of typeEntries) {
        const [_, typeName, typeDesc, colsContent] = entry;
        const cols = colsContent.matchAll(/name:\s*'([^']+)',\s*type:\s*'([^']+)'(?:,\s*desc:\s*'([^']+)')?/g);
        
        def.generatedTypes.push({
          ClassName: typeName,
          desc: typeDesc,
          members: { list: Array.from(cols).map(c => ({ name: c[1], type: c[2], desc: c[3] || '' })) },
          methods: { list: [] },
          implement: ['cl', 'sv']
        });
      }
    }

    // 4. メソッド情報の抽出 (@param, @returns)
    const methodBlocks = content.matchAll(/\/\*\*([\s\S]*?)\*\/\s*(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/g);
    for (const m of methodBlocks) {
      const [_, jsdoc, name] = m;
      if (name === 'constructor') continue;

      const desc = jsdoc.match(/([^*@\s][^*@\n]+)/); // 冒頭の説明文
      const params = Array.from(jsdoc.matchAll(/@param\s+\{([^}]+)\}\s+([^\s-]+)\s*(?:-\s*)?([^\n]*)/g))
                         .map(p => ({ type: p[1], name: p[2], note: p[3] }));
      const returns = Array.from(jsdoc.matchAll(/@returns\s+\{([^}]+)\}\s*([^\n]*)/g))
                          .map(r => ({ type: r[1], desc: r[2] }));

      def.methods.list.push({
        name: name,
        type: 'public',
        desc: desc ? desc[1].trim() : '',
        params: { list: params },
        returns: { list: returns }
      });
    }

    return def;
  }
}

// --- 以下、既存の BaseDef 階層 (ソース[163-224]相当) を流用・統合 ---

class BaseDef {
  constructor(arg, parent = {}) {
    this.ClassName = arg.ClassName || parent.ClassName || '';
    this.classname = this.ClassName.toLowerCase();
    this.MethodName = arg.MethodName || parent.MethodName || '';
    this.methodname = this.MethodName.toLowerCase();
    this.anchor = arg.anchor || (this.classname ? this.classname + (this.methodname ? '_' + this.methodname : '') : '');
    this.title = arg.title || '';
    this.template = arg.template || '';
    this.content = arg.content || '';
    this.fixed = false;
  }
  static _implements = [];
  static get implements() { return this._implements; }
  static set implements(arg) { arg.forEach(imp => { if (!this._implements.find(x => x === imp)) this._implements.push(imp); }); }
  static _defs = {};
  static get defs() { return this._defs; }
  static set defs(arg) { this._defs[arg.ClassName] = this._defs[arg.classname] = arg; }
  static _classList = [];
  static get classList() { return this._classList; }
  static set classList(arg) { this._classList = Object.keys(arg); }

  article(arg = {}, opt = {}) {
    let title = arg.title || '';
    if (arg.level > 0) title = '#'.repeat(arg.level) + ' ' + title;
    return title + '\n\n' + (arg.body || '');
  }

  cfTable(obj, opt = {}) {
    if (!obj.list || obj.list.length === 0) return '- 定義無し';
    const indent = ' '.repeat(opt.indent || 0);
    const header = '| 項目名 | 型 | 説明 |\n' + indent + '| :--- | :--- | :--- |';
    const rows = obj.list.map(f => `| ${f.name} | ${f.type} | ${f.desc || f.note || ''} |`).join('\n' + indent);
    return header + '\n' + indent + rows;
  }

  evaluate(str) { return str; } // 簡易化。必要に応じて[174]の正規表現版を実装
  trimIndent(str) { return str ? str.trim() : ''; }
}

/** 
 * ProjectDef: 修正の核心。ファイルリストを受け取り、JSDocParser を呼び出す [179-181]
 */
class ProjectDef extends BaseDef {
  constructor(fileList, opt = {}) {
    super({});
    this.opt = Object.assign({ folder: './doc', header: '' }, opt);
    this.classdef = {};
    
    // 実装環境の初期登録
    BaseDef.implements = ['cl', 'sv'];

    // 各ファイルを解析して ClassDef インスタンスを作成
    fileList.forEach(filePath => {
      const rawDef = JSDocParser.parseFile(filePath);
      
      // メインクラスの登録
      this.classdef[rawDef.ClassName] = new ClassDef(rawDef);
      
      // Schema.types から生成されたデータ型 (authRequest等) も個別クラスとして登録
      rawDef.generatedTypes.forEach(t => {
        this.classdef[t.ClassName] = new ClassDef(t);
      });
    });

    // クラス名一覧を BaseDef に共有
    BaseDef.classList = this.classdef;

    // Markdown 生成実行 [181]
    Object.keys(this.classdef).forEach(x => this.classdef[x].createMd());
    this.outputMD();
  }

  outputMD() {
    if (!fs.existsSync(this.opt.folder)) fs.mkdirSync(this.opt.folder, { recursive: true });
    Object.keys(this.classdef).forEach(name => {
      const def = this.classdef[name];
      const filePath = path.join(this.opt.folder, `${name}.md`);
      fs.writeFileSync(filePath, def.content, 'utf8');
      console.log(`Generated: ${filePath}`);
    });
  }
}

class ClassDef extends BaseDef {
  constructor(arg) {
    super(arg);
    this.name = arg.ClassName;
    this.desc = arg.desc || '';
    this.members = arg.members;
    this.methods = arg.methods;
    this.implement = arg.implement || [];
    BaseDef.defs = this;
  }

  createMd() {
    this.content = `# ${this.name} 仕様書\n\n${this.desc}\n\n` +
                   `## メンバ一覧\n${this.cfTable(this.members)}\n\n` +
                   `## メソッド一覧\n` + 
                   this.methods.list.map(m => `### ${m.name}()\n${m.desc}\n\n**引数:**\n${this.cfTable(m.params)}\n`).join('\n');
    this.fixed = true;
    return this.content;
  }
}

// --- メイン実行部 ---
const args = process.argv.slice(2);
const options = {
  folder: args.find(a => a.startsWith('-o:'))?.split(':')[1] || './doc',
  header: args.find(a => a.startsWith('-h:'))?.split(':')[1] || ''
};
const targetFiles = args.filter(a => !a.startsWith('-'));

if (targetFiles.length > 0) {
  new ProjectDef(targetFiles, options);
} else {
  console.log("使用法: node specify.mjs -o:出力先 ソース1.mjs ソース2.mjs ...");
}