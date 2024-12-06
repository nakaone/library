/** scan: 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化
 * @param arg {Object}
 * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
 * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
 * @param arg.func {function} - セルに設定する値を導出する関数
 */
scan(arg){
  const v = {whois:this.constructor.name+'.scan',step:0,rv:null};
  try {

    // 処理結果が未作成ならソースと同じ形の二次元配列を作成
    if( !arg.hasOwnProperty('dst') ){
      arg.dst = [];
      for( v.i=0 ; v.i<arg.src.length ; v.i++ ){
        arg.dst.push(new Array(arg.src[v.i].length));
      }
    }

    while( this.conf.next.row < arg.src.length && this.overLimit === false ){
      if( arg.src[v.i] ){
        // 一行分のデータを作成
        for( v.j=0 ; v.j<arg.src[v.i].length ; v.j++ ){
          if( arg.src[v.i][v.j] ){
            arg.dst[v.i][v.j] = arg.func(arg.src[v.i][v.j]);
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
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
