/** 劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書き
 * @param {Object} dest
 * @param {Object} opt
 * @returns {null|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(opt) | 劣後(dest) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [A+B] | 配列は置換ではなく結合。但し重複不可 |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 */
function deepcopy(dest,opt){
  const v = {whois:this.className+'.deepcopy',rv:null,step:0};
  this.clog(1,v.whois+' start.');
  try {

    Object.keys(opt).forEach(x => {
      v.step = 1;
      if( !dest.hasOwnProperty(x) ){
        v.step = 2;
        // コピー先に存在しなければ追加
        dest[x] = opt[x];
      } else {
        if( whichType(dest[x]) === 'Object' && whichType(opt[x]) === 'Object' ){
          v.step = 3; // 両方オブジェクト -> メンバをマージ
          v.rv = this.deepcopy(dest[x],opt[x]);
          if( v.rv instanceof Error ) throw v.rv;
        } else if( whichType(dest[x]) === 'Array' && whichType(opt[x]) === 'Array'  ){
          v.step = 4; // 両方配列 -> 配列をマージ
          // Setで配列要素の重複を排除しているが、
          // 配列要素が配列型・オブジェクト型の場合は重複する(中身もマージされない)
          dest[x] = [...new Set([...dest[x],...opt[x]])];
          //dest[x] = dest[x].concat(opt[x]);
          ////console.log(dest[x],opt[x]);
        } else {
          v.step = 5; // 両方オブジェクトでも両方配列でもない場合、optの値でdestの値を置換
          dest[x] = opt[x];
        }
      }
    });

    v.step = 6; // 終了処理
    this.clog(2,v.whois+' normal end. result=%s',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
    return e;
  }
}
