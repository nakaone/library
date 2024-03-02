/** 表示中の内容をシート・オブジェクトから削除
 * @param {void} - 削除対象はthis.currentで特定するので引数不要
 * @returns {null|Error}
 */
async delete(){
  const v = {whois:this.className+'.delete',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    // 確認メッセージの表示、キャンセルされたら終了
    if( window.confirm(`元に戻せませんが、削除しますか？`) ){
      changeScreen('loading');
      v.step = 1; // this.source.rawから削除
      v.index = this.source.raw.findIndex(x => x[this.source.primaryKey] === this.current);
      v.delObj = this.source.raw.splice(v.index,1)[0];

      v.step = 2; // シートからの削除
      if( whichType(this.source,'Object') ){
        v.step = 2.1; // データシートの更新
        // doGAS引数(this.sourceに設定されている配列)
        // 0:サーバ側関数名。"tipsServer"固定
        // 1:シート名。"tips"固定
        // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
        // 3〜:分岐先処理への引数。list->不要,
        //   update->3:pKey項目名,4:データObj,5:採番関数,
        //   delete->3:pKey項目名,4:pKey値
        v.arg = [...this.source.delete];
        v.arg[4] = this.current; // 削除対象オブジェクトをセット
        v.r = await doGAS(...v.arg);
        if( v.r instanceof Error ) throw v.r;

        v.step = 2.2; // ログシートの更新
        if( whichType(this.registLog,'AsyncFunction') ){
          v.r = await this.registLog(v.delObj);
          if( v.r instanceof Error ) throw v.r;
        }
      }

      v.step = 3; // 削除時の終了処理
      alert(`${this.source.primaryKey}=${stringify(this.current)}を削除しました`);
      this.current = null;
      this.listView({reload:true}); // 強制再読込、一覧画面に遷移
    } else {
      v.step = 4;
      alert('削除は取り消されました')
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    alert(e.message);
    return e;
  }
}