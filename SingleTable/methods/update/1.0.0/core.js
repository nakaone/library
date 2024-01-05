/**
 * @typedef {Object} UpdateResult
 * @prop {number} row - 変更対象の行番号(自然数)
 * @prop {Object} old - 変更前の行オブジェクト
 * @prop {Object} new - 変更後の行オブジェクト
 * @prop {Object.<string, any[]>} diff - {変更した項目名：[変更前,変更後]}形式のオブジェクト
 * @prop {number} row - 更新対象行番号(自然数)
 * @prop {number} left - 更新対象領域左端列番号(自然数)
 * @prop {number} right - 更新対象領域右端列番号(自然数)
 */
/** 条件に該当するレコード(オブジェクト)を更新
 * 
 * - 指定条件が複雑になるため、複数行の一括更新は行わない
 * 
 * @param {Function} src - 行オブジェクトを引数に、セットする{項目名:値}を返す関数
 * @param {Object} [opt={}] - オプション
 * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
 * @returns {UpdateResult[]|Error} 更新結果を格納した配列
 * 
 * @example
 * 
 * ```
 * v.table = new SingleTable('test',{top:3});
 * // B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
 * v.table.update({
 *   func:o=>{return {Col1:'hoge',E3:'fuga'}},
 *   opt:{where:o=>o.B3&&o.B3==4}
 * });  // 戻り値 -> [{
 *   "old":{"B3":4,"C3":3,"Col1":"a","E3":"b"},
 *   "new":{"B3":4,"C3":3,"Col1":"hoge","E3":"fuga"},
 *   "diff":{"Col1":["a","hoge"],"E3":["b","fuga"]},
 *   "row":7,
 *   "left":4,"right":5
 * }]
 * ```
 * 
 * 更新対象データを直接指定、また同一行の他の項目から導出してセットすることも可能。
 * 
 * ```
 * // E3欄に'a'をセットする
 * v.table.update(
 *   {E3:'a'},  // 更新対象データを直接指定
 *   {where:o=>o.B3==5&&o.C3==4}
 * )
 * // Col1欄にB3+C3の値をセットする
 * v.table.update(
 *   o=>{return {Col1:(o.B3||0)+(o.C3||0)}},  // 他項目から導出
 *   {where:o=>o.B3==5&&o.C3==4}
 * )
 * ```
 */
update(src,opt={}){
  const v = {whois:this.className+'.update',step:0,rv:[],
    // top〜rightは更新する場合の対象領域(行/列番号。自然数)
    top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
  this.clog(1,v.whois+' start.');
  try {
    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = () => true;


    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      v.step = 2; // 1行ずつ差分をチェック
      if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
        v.step = 2.1; // 「空Objではない かつ 対象判定結果がtrue」なら更新対象
        v.r = { // {UpdateResult} - 更新結果オブジェクトを作成
          old: Object.assign({},this.data[v.i]),
          new: this.data[v.i],
          diff: {},
          row: this.top + 1 + v.i,
          left: 99999999, right: -99999999,  // 変更があった列番号の範囲
        };

        v.step = 2.2; // 更新後の値をv.diffに格納
        v.diff = whichType(src) === 'Object' ? src : src(this.data[v.i]);

        v.step = 2.3; // 差分が存在する項目の洗い出し
        v.exist = false;  // 差分が存在したらtrue
        this.header.forEach(x => {
          v.step = 2.4; // 項目毎に差分判定
          if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
            v.step = 2.5; // 更新後に値が変わる場合
            v.exist = true; // 値が変わった旨、フラグを立てる
            v.r.new[x] = v.diff[x];
            v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
            v.col = this.left + this.header.findIndex(i=>i==x); // 変更があった列番号
            // 一行内で、更新があった範囲(左端列・右端列)の値を書き換え
            v.r.left = v.r.left > v.col ? v.col : v.r.left;
            v.r.right = v.r.right < v.col ? v.col : v.r.right;
          }
        });

        // いずれかの項目で更新後に値が変わった場合
        if( v.exist ){
          v.step = 3.1; // 更新対象領域を書き換え
          v.top = v.top > v.r.row ? v.r.row : v.top;
          v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
          v.left = v.left > v.r.left ? v.r.left : v.left;
          v.right = v.right < v.r.right ? v.r.right : v.right;

          v.step = 3.2; // this.raw上のデータを更新
          this.raw[v.r.row-this.top] = (o=>{
            const rv = [];
            this.header.forEach(x => rv.push(o[x]||''));
            return rv;
          })(v.r.new);

          v.step = 3.3; // ログ(戻り値)に追加
          v.rv.push(v.r);
        }
      }
    }

    v.step = 5; // シート上の更新対象領域をthis.rawで書き換え
    v.data = (()=>{ // 更新対象領域のみthis.rawから矩形に切り出し
      let rv = [];
      this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
        rv.push(l.slice(v.left-this.left,v.right-this.left+1));
      });
      return rv;
    })();
    this.sheet.getRange(
      v.top,
      v.left,
      v.bottom-v.top+1,
      v.right-v.left+1
    ).setValues(v.data);

    v.step = 6; // 終了処理
    this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
    return e;
  }
}
