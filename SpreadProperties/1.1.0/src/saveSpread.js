/** saveSpread() : 指定スプレッドシートから各種属性情報を取得、Google Diverのスプレッドシートと同じフォルダにzip形式圧縮されたJSONとして保存
 * @param arg {string} - 呼出元の関数名
 * @returns {Object.<string,any>} 属性名：設定値形式のオブジェクト
 * 
 * - 仕様は[workflowy](https://workflowy.com/#/415ca4c2d194)参照
 */
saveSpread(arg=null){
  const v = {whois:'saveSpread',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    // --------------------------------------------------
    v.step = 4; // シート毎の情報取得
    // --------------------------------------------------
    while( this.conf.next.sheet < this.conf.sheetList.length && this.overLimit === false ){
      this.sheetName = this.conf.sheetList[this.conf.next.sheet];
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
        //['src','dst','func'].forEach(x => delete v.arg[x]);
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
      v.step = 4.6; // カウンタを調整
      if(!this.overLimit){
        this.conf.next.sheet++;
        [this.conf.next.prop,this.conf.next.row] = [0,0]
      };
      v.step = 4.7; // 制限時間チェック
      if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
    }

    // --------------------------------------------------
    v.step = 5; // this.dataの内容を作業用ファイルに書き込む
    // --------------------------------------------------
    v.step = 5.1; // 圧縮対象のファイル名に日本語が入っていると"Illegal byte sequence"になるので英文字指定
    v.blob = Utilities.newBlob(JSON.stringify(this.data),'application/json',`${this.overLimit?'uncomplete':'data'}.json`);
    v.zip = Utilities.zip([v.blob],`${this.data.Name}.${toLocale(new Date(this.conf.start),'yyyyMMdd-hhmmss')}.zip`);
    this.dstFile = this.srcFile.getParents().next().createFile(v.zip);
    this.conf.fileId = this.dstFile.getId();

    v.step = 5.2; // ScriptPropertiesを削除
    if( v.ScriptProperties ){
      PropertiesService.getScriptProperties().deleteProperty(this.propKey);
    }
    this.conf.count += 1;  // 実行回数をインクリメント
    if( this.overLimit ){  // タイムアウト時
      v.step = 5.3;
      if( this.conf.count > this.executionLimit && this.conf.complete === false ){ // 実行回数の制限を超えた場合
        throw new Error(`最大実行回数(${this.executionLimit}回)を超えたので、処理を中断しました`);
      } else {
        // ScriptPropertiesを更新
        PropertiesService.getScriptProperties().setProperty(this.propKey, JSON.stringify(this.conf));
        // 1分後に自分自身を起動するよう、タイマーをセット
        ScriptApp.newTrigger(arg).timeBased().after(1000 * 60).create();
      }
    }

    v.step = 9; // 終了処理
    v.rv = this.conf;
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
