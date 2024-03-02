/** 編集画面の表示内容でシート・オブジェクトを更新
 * - this.source.primaryKeyを参照し、更新後の値はdetail画面から取得するので引数不要
 * - 新規の場合、this.current=null
 *
 * @param {void} - 更新内容は画面から取得するので引数不要
 * @returns {null|Error}
 */
async update(){
  const v = {whois:this.className+'.update',rv:null,step:0,
  msgBefore:'',msgAfter:'',diff:[],after:{}};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 事前準備
    changeScreen('loading');
    // 対象行オブジェクトをv.beforeに取得
    v.before = this.source.raw.find(x => x[this.source.primaryKey] === this.current);

    v.step = 2; // 編集可能な欄(.box)について、編集後の値を取得
    v.str = '[name="detail"] [name="table"] [name="_1"] .box';
    this.detail.cols.forEach(col => {
      v.step = '2:' + col;
      if( col.hasOwnProperty('edit') ){ // detail.colsでeditを持つもののみ対象
        v.x = this.wrapper.querySelector(v.str.replace('_1',col.name)).value;
        if( v.before[col.name] !== v.x ) // 値が変化したメンバのみ追加
          v.after[col.name] = v.x;
      }
    })

    v.step = 3; // ログ出力時の比較用に加工前のデータを保存
    v.diff = [Object.assign({},v.before),Object.assign({},v.after)];

    if( Object.keys(v.after).length > 0 ){
      v.step = 4; // 修正された項目が存在した場合の処理

      //v.msgBefore = v.msgAfter = '';
      for( v.key in v.after ){
        v.step = 4.1; // 修正箇所表示用メッセージの作成
        v.msgBefore += `\n${v.key} : ${stringify(v.before[v.key])}`;
        v.msgAfter += `\n${v.key} : ${stringify(v.after[v.key])}`;
        v.step = 4.2; // this.source.rawの修正
        v.before[v.key] = v.after[v.key];
      }
      v.msg = `${this.source.primaryKey}="${v.before[this.source.primaryKey]}"について、以下の変更を行いました。\n`
      + `--- 変更前 ------${v.msgBefore}\n\n--- 変更後 ------${v.msgAfter}`;

      v.step = 4.3; // v.afterは更新された項目のみでidを持たないので、追加
      v.after[this.source.primaryKey] = this.current;

      v.step = 4.4; // シートデータの場合、シートの修正・ログ出力
      if( whichType(this.source,'Object') ){  // 元データがシート
        v.step = 4.5; // データシートの更新
        // doGAS引数(this.sourceに設定されている配列)
        // 0:サーバ側関数名。"tipsServer"固定
        // 1:シート名。"tips"固定
        // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
        // 3〜:分岐先処理への引数。list->不要,
        //   update->3:pKey項目名,4:データObj,5:採番関数,
        //   delete->3:pKey項目名,4:pKey値
        v.arg = [...this.source.update];
        v.arg[4] = v.after; // 更新対象オブジェクトをセット
        v.r = await doGAS(...v.arg);
        if( v.r instanceof Error ) throw v.r;

        v.step = 4.6; // 新規作成でid=nullだった場合、採番されたIDをセット
        if( v.before[this.source.primaryKey] === null ){
          this.current = v.before[this.source.primaryKey]
          = v.diff[1][this.source.primaryKey] = v.r[this.source.primaryKey];
        }

        v.step = 4.7; // ログシートの更新
        if( whichType(this.registLog,'AsyncFunction') ){
          v.r = await this.registLog(...v.diff);
          if( v.r instanceof Error ) throw v.r;
        }
      }

      v.step = 4.8; // 編集画面から参照画面に変更
      this.detailView(this.current,'view');

    } else {
      v.step = 5; // 修正された項目が存在しない場合の処理
      v.msg = `変更箇所がありませんでした`;
      // 変更箇所がない場合、参照画面に遷移せず編集続行
    }

    v.step = 6; // 終了処理
    alert(v.msg);
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