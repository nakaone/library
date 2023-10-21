import fs from 'fs';

/**
 * @typedef BaseCommand
 * @prop {number} verbose - ログ出力を 0:しない 1:start/endのみ出力 2:1+結果も出力
 * @prop {string} taskName - トップシートに表示するタスク名
 */
export class BaseCommand {
  constructor(opt={}){
    const v = {whois:'BaseCommand.constructor',rv:null,step:0};
    try {
  
      this.verbose = opt.verbose || 0; // 0:ログ出力をしない
      // トップシートを出力
      this.printTop(opt.taskName || 'BaseCommand');

      v.arg = this.analyzeArg();
      this.opt = {};
      Object.keys(v.arg.opt).forEach(x => this.opt[x] = v.arg.opt[x]);
      if( v.arg.val.length > 0 ){
        if( v.arg.val.length === 1 && v.arg.val[0] === 'verbose' ){

        } else {
        this.arg = v.arg.val;

        }
      }

      this.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      this.log(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /**
   * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
   * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
   * @prop {string[]} val - スイッチを持たない引数の配列
   */
  /** コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。
   *
   * @example
   *
   * ```
   * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
   * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
   * ```
   *
   * <caution>注意</caution>
   *
   * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
   * - スイッチに該当しないものは配列`val`にそのまま格納される
   *
   * @param {void} - なし
   * @returns {AnalyzeArg} 分析結果のオブジェクト
   */

  analyzeArg = () => {
    const v = {whois:'analyzeArg',rv:{opt:{},val:[]},step:0};
    this.log(v.whois+' start.');
    try {
  
      for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
        v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
        if( v.m && v.m[1].length > 0 ){
          v.rv.opt[v.m[2]] = v.m[3];
        } else {
          v.rv.val.push(process.argv[v.i]);
        }
      }
  
      v.step = 99; // 終了処理
      this.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      this.log(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /**
   * @typedef {object} AnalyzePath - パス文字列から構成要素を抽出したオブジェクト
   * @prop {string} full - 引数の文字列(フルパス)
   * @prop {string} path - ファイル名を除いたパス文字列
   * @prop {string} file - ファイル名
   * @prop {string} base - 拡張子を除いたベースファイル名
   * @prop {string} suffix - 拡張子
   */
  /** パス名文字列から構成要素を抽出
   * @param {string} arg - パス文字列
   * @returns {AnalyzePath}　構成要素を抽出したオブジェクト
   * @example
   *
   * ```
   * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
   *   "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
   *   "file":"analyzePath.html",
   *   "base":"analyzePath",
   *   "suffix":"html"
   * }
   *
   * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
   *   "path":"/Users/ena.kaon/Desktop/GitHub/library/",
   *   "file":"JavaScript",
   *   "base":"JavaScript",
   *   "suffix":""
   * }
   *
   * "./analyzePath.html" ⇒ {
   *   "path":"./",
   *   "file":"analyzePath.html",
   *   "base":"analyzePath",
   *   "suffix":"html"
   * }
   *
   * "analyzePath.html" ⇒ {
   *   "path":"",
   *   "file":"analyzePath.html",
   *   "base":"analyzePath",
   *   "suffix":"html"
   * }
   *
   * "analyzePath.hoge.html" ⇒ {
   *   "path":"",
   *   "file":"analyzePath.hoge.html",
   *   "base":"analyzePath.hoge",
   *   "suffix":"html"
   * }
   *
   * "analyzePath.fuga" ⇒ {
   *   "path":"",
   *   "file":"analyzePath.fuga",
   *   "base":"analyzePath",
   *   "suffix":"fuga"
   * }
   *
   * "https://qiita.com/analyzePath.html" ⇒ {
   *   "path":"https://qiita.com/",
   *   "file":"analyzePath.html",
   *   "base":"analyzePath",
   *   "suffix":"html"
   * }
   *
   * ```
   */

  analyzePath = (arg) => {
    const v = {whois:'analyzePath',rv:{},step:0};
    this.log(v.whois+' start.',arg);
    try {
  
      v.m1 = arg.match(/^(.*)\/([^\/]+)$/);
      if( v.m1 ){
        v.rv.path = v.m1[1] + '/';
        v.rv.file = v.m1[2];
      } else {
        v.rv.path = '';
        v.rv.file = arg;
      }
      v.m2 = v.rv.file.match(/^(.+)\.([^\.]+?)$/);
      if( v.m2 ){
        v.rv.base = v.m2[1];
        v.rv.suffix = v.m2[2];
      } else {
        v.rv.base = v.rv.file;
        v.rv.suffix = '';
      }
  
      v.step = 99; // 終了処理
      if(this.verbose>0)
        this.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      if(this.verbose>0)
        this.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** テキストファイルの読み込み
   * @param {string} filePath - 入力ファイルのパス
   * @param {string} [encode='utf-8'] - エンコード
   * @returns {null|Error}
   * 
   * #### 参考
   * 
   * - [【Node.js】ファイルの入出力処理を行う（同期処理、Promiseによる非同期処理）](https://js.excelspeedup.com/node-fs)
   */
  readAsText = (filePath,encode='utf-8') => {
    const v = {whois:'readAsText',rv:null,step:0};
    this.log(v.whois+' start.',filePath,encode);
    try {
  
      v.rv = fs.readFileSync(filePath,encode);
  
      this.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      this.log.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** テキストファイルの書き込み
   * @param {string} filePath - 出力ファイルのパス
   * @param {string} data - 出力内容
   * @returns {null|Error}
   */
  writeAsText = (filePath,data) => {
    const v = {whois:'writeAsText',rv:null,step:0};
    this.log(v.whois+' start.',filePath,data);
    try {
  
      v.rv = fs.writeFileSync(filePath, data);
  
      this.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      this.log.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** verboseに基づきthis.logを出力 */
  log = (...arg) => {
    // this.verbose === 0 -> 出力しない
    if( this.verbose === 0 ) return;
    if( this.verbose === 1 ){
      // this.verbose === 1 -> start/endのみ出力
      console.log(arg[0]);
    } else {
      // this.verbose === 2 -> start/end+結果も出力
      console.log(arg);
    }
  }

  /** コンソール実行時、トップシートイメージを出力 */
  printTop = (name) => {
    if( this.verbose === 0 ) return null;
    const content = '\n\n\n\n'
    + '==================================================\n'
    + '  ' + name + '\n'
    + '                         ' + (new Date()) + '\n'
    + '==================================================\n\n'
    ;
    console.log(content)
  }
}