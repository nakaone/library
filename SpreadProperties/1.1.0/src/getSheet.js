/** getSheet: 指定されたシートの属性情報を取得
 * @param arg {string}=this.spread.getActiveSheet() - 取得対象となるシート名。未指定の場合表示中のシート
 * @returns {void} this.data.Sheet[取得対象シート名]
 */
getSheet(arg=null){
  const v = {whois:this.constructor.name+'.getSheet',step:0,rv:null};
  console.log(`${v.whois} start.\narg=${arg}`);
  try {

    //this.conf.next = {sheet:this.conf.sheetList.findIndex(x => x === arg),prop:0,row:0};
    this.conf.next = {prop:0,row:0};
    this.sheetName = arg || this.spread.getActiveSheet().getName();
    this.sheet = this.spread.getSheetByName(this.sheetName);
    this.range = this.sheet.getDataRange();
    while( this.conf.next.prop < this.conf.propList.length && this.overLimit === false ){
      v.step = 4.1; // 属性毎の情報取得
      this.propName = this.conf.propList[this.conf.next.prop];
      console.log(`${this.sheetName}.${this.propName} start.`
      + ` (sheet=${this.conf.next.sheet+1}/${this.conf.sheetList.length},`
      + ` prop=${this.conf.next.prop+1}/${this.conf.propList.length})`);
      v.step = 4.2; // 前回結果をクリア
      v.arg = {};
      v.step = 4.3; // 属性取得の実行
      v.r = this.sheetProperties[this.conf.propList[this.conf.next.prop]](v.arg);
      if( v.r instanceof Error ) throw v.r;
      this.data.Sheets.find(x => x.Name === this.sheetName)[this.propName] = v.r;
      v.step = 4.4; // カウンタを調整
      if(!this.overLimit){
        this.conf.next.prop++;
        this.conf.next.row = 0;
      }
      v.step = 4.5; // 制限時間チェック
      if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
    }

    v.step = 9; // 終了処理
    v.rv = this.data.Sheets.find(x => x.Name === this.sheetName);
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}