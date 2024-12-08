/** scan: 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化
 * @param arg {Object}
 * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
 * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
 * @param arg.func {function} - セルに設定する値を導出する関数
 * @param [arg.default] {any} - セルの既定値。存在する場合のみ指定
 */
scan(arg){
  const v = {whois:this.constructor.name+'.scan',step:0,rv:null};
  try {

    while( this.conf.next.row < arg.src.length && this.overLimit === false ){
      if( arg.src[this.conf.next.row] ){
        // 一行分のデータを作成
        for( v.i=0 ; v.i<arg.src[this.conf.next.row].length ; v.i++ ){
          if( !arg.src[this.conf.next.row][v.i] ) continue;  // null等なら処理対象外
          v.r = arg.func(arg.src[this.conf.next.row][v.i]);
          if( !arg.hasOwnProperty('default') || arg.default !== v.r ){
            arg.dst[this.conf.next.row][v.i] = v.r;
          }
        }
      }
      // カウンタを調整
      this.conf.next.row++;
      // 制限時間チェック
      if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
    }
    v.ratio = Math.round((this.conf.next.row/arg.src.length)*10000)/100;

    v.step = 9; // 終了処理
    console.log(`scan: ${this.sheetName}.${this.propName} row=${this.conf.next.row}(${v.ratio}%) end.`);
    return arg.dst;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
    + `\narg=${JSON.stringify(arg)}`
    + `\nthis.conf.next=${JSON.stringify(this.conf.next)}`
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
