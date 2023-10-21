import { BaseCommand } from "../../BaseCommand/1.0.0/core.mjs";
import pkg from '../../cdnjs/marked/9.1.2/marked.min.js';
const { marked } = pkg;

/** 
 * なお、正規表現内部のエスケープを回避するため、replaceAllのキーは単純文字列とする。
 * 
 * @example
 * 
 * node core.mjs
 *    -i: 入力ファイルのパス(input)
 *    -o: 出力ファイルのパス(output)。無指定の場合、verbose=0でコンソールに出力
 *    -r: 変換元の文字列(replace)
 *    -s: 変換先の文字列を格納したファイル(ソースファイル)のパス(source)
 *    -p: 変換時、sourceの前につけるテキスト(prefix)
 *    -x: 変換時、sourceの後につけるテキスト(suffix)
 *    -m: ソースがMarkdownの場合、htmlに 0:変換しない、1:変換する(既定値)
 */
export class nised extends BaseCommand {
  /**
   * 
   * @param {Object.<string, any>} opt 
   * @returns 
   */
  constructor(opt){
    super(opt);
    const v = {whois:'nised.constructor',rv:null,step:0};
    this.log(v.whois+' start.',opt);
    try {
  
      v.step = 1; // 入力ファイルの読み込み
      v.rv = this.readAsText(this.opt.i);
      if( v.rv instanceof Error ) throw v.rv;
      v.iText = v.rv;

      v.step = 2.1; // ソースファイルの読み込み
      v.rv = this.readAsText(this.opt.s);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 2.2; // Markdown変換指定があれば変換
      v.source = this.opt.hasOwnProperty('m') && this.opt.m > 0
      ? marked.parse(v.rv) : v.rv;

      v.step = 3; // 置換実行
      v.rex = new RegExp(this.opt.r,'g');
      v.oText = v.iText.replaceAll(v.rex,v.source);
      //v.oText = v.iText.replaceAll(this.opt.r,v.source);

      v.step = 3; // 出力
      if( this.opt.hasOwnProperty('o') ){
        v.rv = this.writeAsText(this.opt.o,v.oText);
        if( v.rv instanceof Error ) throw v.rv;
      } else {
        console.log(v.oText);
      }
      
      this.log(v.whois+' normal end.');
      return v.rv;
  
    } catch(e){
      // エラーが起きたメソッドでメッセージ出力済みなので不要
      //this.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }


}

new nised({verbose:1});
//new nised();