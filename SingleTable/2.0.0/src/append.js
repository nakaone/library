/** append: 領域に新規行を追加
 * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
 * @returns {Object} {success:[],failure:[]}形式
 */
append(records){
  const v = {whois:this.constructor.name+'.append',step:0,rv:{success:[],failure:[],log:[]},
    cols:[],sheet:[]};
  console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
  try {

    v.step = 1; // 引数がオブジェクトなら配列に変換
    if( !Array.isArray(records) ) records = [records];

    v.step = 2; // 追加レコードを順次チェック
    for( v.i=0 ; v.i<records.length ; v.i++ ){

      v.log = {
        uuid: Utilities.getUuid(),
        timestamp: toLocale(new Date()),
        account: this.account,
        range: this.range,
        result: true,
        message: [],
        diff: JSON.stringify(records[v.i]),
      };

      v.step = 2.1; // pkey or uniqueの単一値チェック
      this.unique.cols.forEach(col => {
        if( records[v.i].hasOwnProperty(col) ){
          if( this.unique.map[col].indexOf(records[v.i][col]) >= 0 ){
            v.log.message.push(`unique error: col="${col}", value="${records[v.i][col]}"`);
          }
        }
      });

      v.step = 2.2; // auto_increment属性の項目について採番
      this.auto_increment.cols.forEach(col => {
        // あるべき値を計算
        v.tobe = this.auto_increment.map[col].max + this.auto_increment.map[col].val;
        if( records[v.i].hasOwnProperty(col) ){
          // 引数で指定されていた場合、計算値と引数が不一致ならエラー
          if( records[v.i][col] !== v.tobe ){
            v.log.message.push(`auto increment error: col="${col}", arg="${records[v.i][col]}", tobe="${v.tobe}"`);
          } else {
            // 計算値と引数が一致していた場合、this.auto_incrementを更新
            this.auto_increment.map[col].max = v.tobe;
          }
        } else {
          // 引数で指定されていなかった場合、項目とthis.auto_incrementを更新
          records[v.i][col] = v.tobe;
          this.auto_increment.map[col].max = v.tobe;
        }
      });


      if( v.log.message.length === 0 ){ // エラーが無かった場合

        v.step = 2.3; // defaultの値をセット
        Object.assign(records[v.i],this.defaultObj);

        v.log.result = true;
        v.log.after = JSON.stringify(records[v.i]);

        v.rv.success.push(records[v.i]);

      } else {  // エラーが有った場合

        v.log.result = false;
        v.rv.failure.push(records[v.i]);
      }
      // エラーの有無にかかわらず、ログに追加
      v.log.push(v.rv.log);
    }

    v.step = 3; // レコードの追加
    v.step = 2.5; // 追加するレコードをシートイメージ(二次元配列)に追加
    for( v.j=0,v.row=[] ; v.j<this.header.length ; v.j++ ){
      v.row.push(records[this.header[v.j]] || null);
    }
    v.sheet.push(v.row);

    v.step = 3.1; // テーブルに排他制御をかける
    v.lock = LockService.getDocumentLock();
    v.cnt = this.maxTrial;
    while( v.cnt > 0 ){
      if( v.lock.tryLock(this.interval) ){

        v.step = 3.2; // 追加実行
        this.sheet.getRange(
          this.bottom + 1,
          this.left,
          v.rv.success.length,
          this.header.length
        ).setValues(v.sheet);

        v.step = 3.3; // テーブルの排他制御を解除、末端行番号を書き換え
        v.lock.releaseLock();
        this.bottom += v.sheet.length;
        v.cnt = -1;
      } else {
        v.cnt--;
      }
    }

    // リトライしても排他不能だった場合、成功レコードを全て失敗に変更
    if( v.cnt === 0 ){

      v.rv.failure = [...v.rv.success,...v.rv.failure];
      v.rv.success = [];

      v.rv.log.forEach(log => {
        log.result = false;
        log.message.push(`lock error`);
        delete log.after;
      });
      throw new Error(`could not get lock ${this.maxTrial} times.`);
    }


    v.step = 4; // ログに記録
    v.rv.log.forEach(log => {
      // エラーメッセージを配列から文字列に変換
      if( log.message.length === 0 ){
        delete log.message;
      } else {
        log.message = log.message.join('\n');
      }

      // オブジェクトからシートイメージに変換
      v.row = [];
      this.log.header.forEach(col => {
        v.row.push(log[col] || null);
      });

      this.log.sheet.appendRow(v.row);
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}