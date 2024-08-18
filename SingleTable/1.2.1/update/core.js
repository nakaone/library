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
  * @param {Object|Function} set - セットする{項目名:値}、または行オブジェクトを引数にセットする{項目名:値}を返す関数
  * @param {Object} [opt={}] - オプション
  * @param {Function} [opt.where=()=>true] - レコードを引数として、条件に合致する場合trueを返す関数
  * @param {string} [opt.key] - whereを指定せず「キー項目と値を指定、合致すれば更新」とする場合のキー項目名
  * @param {any} [opt.value] - 同、キー項目の値
  * @returns {UpdateResult[]|Error} 更新結果を格納した配列
  * 
  * @example
  * 
  * ```
  * v.table = new SingleTable('test!B3:E');
  * // B3欄が4のレコードについて、Col1に'hoge'・E3に'fuga'をセットする
  * v.table.update({Col1:'hoge',E3:'fuga'},{where:o=>o.B3&&o.B3==4});  // 戻り値 -> [{
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
  * // entryNo=7について、memo欄に"test content"をセット
  * v.table.update({memo:'test content'},{key:'entryNo',value:7})
  * ```
  */
update(set,opt={}){
  const v = {whois:this.className+'.update',step:0,rv:[],
    // top〜rightは更新する場合の対象領域(行/列番号。自然数)
    top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
  console.log(`${v.whois} start.\nset=${typeof set === 'function' ? set.toString() : stringify(set)}\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('where') )
      opt.where = o => o[opt.key] == opt.value;

    v.step = 2; // 1行ずつ差分をチェックしながら処理結果を保存
    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i])){
        v.step = 2.1; // 「空Objではない かつ 対象判定結果がtrue」なら更新対象
        v.r = { // {UpdateResult} - 更新結果オブジェクトを作成
          old: Object.assign({},this.data[v.i]),
          new: this.data[v.i],
          diff: {},
          row: this.top + 1 + v.i,
          left: Infinity, right: -Infinity,  // 変更があった列番号の範囲
        };

        v.step = 2.2; // 更新後の値をv.diffに格納
        v.diff = whichType(set) === 'Object' ? set : set(this.data[v.i]);

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

        v.step = 3; // いずれかの項目で更新後に値が変わった場合
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

    v.step = 4; // 更新が有ったら、シート上の更新対象領域をthis.rawで書き換え
    if( v.rv.length > 0 ){
      v.step = 4.1; // 更新対象領域のみthis.rawから矩形に切り出し
      v.data = (()=>{
        let rv = [];
        this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
          rv.push(l.slice(v.left-this.left,v.right-this.left+1));
        });
        return rv;
      })();
      v.step = 4.2; // データ渡しかつシート作成指示無しを除き、シートを更新
      if( this.sheet !== null ){
        this.sheet.getRange(
          v.top,
          v.left,
          v.bottom-v.top+1,
          v.right-v.left+1
        ).setValues(v.data);
      }
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end. num=${v.rv.length}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
    console.error(`${e.message}\nv=${JSON.stringify(v)}`,set,opt);
    return e;
  }
}
