/** 新規追加
 *
 * - IDはSymbol.for(UNIX時刻)で採番
 * - サーバ側はIDがSymbolなら新規と判断、新規IDを自動採番する
 * - 変更点：this.idMap, detail.cols.key
 *
 * ```mermaid
 * sequenceDiagram
 *   autonumber
 *
 *   Activate client
 *   Note right of client: append()
 *   client ->> client: 新規(全項目未設定)画面表示
 *   client ->> client: this.source.rawにid=nullで登録
 *   Note right of client: update()
 *   client ->> server: id:null,data
 *
 *   Activate server
 *   Note right of server: update()
 *   server ->> server: id=nullなら自動採番
 *   server ->> insert: id:new,data
 *
 *   Activate insert
 *   insert ->> server: 1(追加された行数)
 *   Deactivate insert
 *
 *   server ->> client: id:new,data
 *   Deactivate server
 *   client ->> client: this.source.rawのid修正
 *   Deactivate client
 * ```
 *
 * - 凡例
 *   - client: SingleTableClient
 *   - server: SingleTableServer。アプリ毎に別名になるので注意(ex.tipsServer)
 *   - insert: SingleTable.insertメソッド
 * - 複数クライアントでの同時追加によるIDの重複を避けるため、採番〜更新が最短になるようSingleTableServerで自動採番する
 *   - SingleTableServer冒頭でSingleTableインスタンスを生成しており、その時点の最新が取得できる
 *   - serverで「SingleTableインスタンス生成〜insert実行」に別クライアントから追加処理行われるとIDの重複が発生するが、回避不能なので諦める
 * - ②:this.source.rawにid(this.source.primaryKey)=nullの行があれば、それを書き換える(追加はしない)
 * - ④:自動採番用の関数は、serverに持たせておく(ex. tipsServer)
 * - ④:`id != null`ならそれを採用する(client側で適切な採番が行われたと看做す)
 *
 * @param {void}
 * @returns {null|Error}
 */
async append(){
  const v = {whois:this.className+'.append',rv:null,step:0,obj:{}};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // this.source.rawに空Objを追加
    v.obj[this.source.primaryKey] = null;
    this.source.raw.push(v.obj);

    v.step = 2; // 追加した空Objを編集画面に表示
    v.r = this.detailView(null,'edit');
    if( v.r instanceof Error ) throw v.r;

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}