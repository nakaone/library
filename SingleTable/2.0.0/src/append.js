/** append: 領域に新規行を追加
 * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
 * @returns {Object} {success:[],failure:[]}形式
 */
append(records){
  const v = {whois:this.constructor.name+'.append',step:0,rv:{success:[],failure:[],log:[]},
    cols:[],sheet:[]};
  console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------
    // 引数がオブジェクトなら配列に変換
    if( !Array.isArray(records) ) records = [records];

    // ------------------------------------------------
    v.step = 2; // 追加レコードを順次チェック
    // ------------------------------------------------
    for( v.i=0 ; v.i<records.length ; v.i++ ){

      v.step = 2.1; // ログオブジェクトのプロトタイプ生成
      v.log = {
        uuid: Utilities.getUuid(),
        timestamp: toLocale(new Date()),
        account: this.account,
        range: this.range,
        result: true,
        message: [],
        diff: JSON.stringify(records[v.i]),
      };
      vlog(v,['log'],v);

      v.step = 2.2; // pkey or uniqueの単一値チェック
      this.unique.cols.forEach(col => {
        console.log(`l.399 this.unique.map[${col}]=${stringify(this.unique.map[col])}, records[${v.i}]=${stringify(records[v.i])}`);
        if( records[v.i].hasOwnProperty(col) ){
          if( this.unique.map[col].indexOf(records[v.i][col]) >= 0 ){
            v.log.message.push(`unique error: col="${col}", value="${records[v.i][col]}"`);
          }
        }
      });
      vlog(v,['log'],v);

      v.step = 2.3; // auto_increment属性の項目について採番
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

      v.step = 2.4; // エラー有無によって変わる値の設定
      if( v.log.message.length === 0 ){ // エラーが無かった場合

        v.step = 2.41; // 追加する行オブジェクトに既定値を補足(this.defaultObjの値をセット)
        Object.assign(records[v.i],this.defaultObj);

        v.step = 2.42; // ログオブジェクトに結果設定
        v.log.result = true;
        v.log.after = JSON.stringify(records[v.i]);

        v.step = 2.43; // 追加するレコードをシートイメージ(二次元配列)に追加
        for( v.j=0,v.row=[] ; v.j<this.header.length ; v.j++ ){
          v.row.push(records[v.i][this.header[v.j]] || null);
        }
        v.sheet.push(v.row);

        v.step = 2.44; // 戻り値への格納
        v.rv.success.push(records[v.i]);

      } else { // エラーが有った場合

        v.step = 2.45; // ログオブジェクトに結果設定
        v.log.result = false;

        v.step = 2.46; // 戻り値への格納
        v.rv.failure.push(records[v.i]);
      }

      v.step = 2.5; // エラーの有無にかかわらず、ログに追加
      v.rv.log.push(v.log);
    }
    vlog(v,['rv','log'],v);

    // ------------------------------------------------
    v.step = 3; // 正常レコードのシートへの追加
    // ------------------------------------------------
    if( v.sheet.length > 0 ){
      v.step = 3.1; // テーブルに排他制御をかける
      v.lock = LockService.getDocumentLock();
      v.cnt = this.maxTrial;
      while( v.cnt > 0 ){
        if( v.lock.tryLock(this.interval) ){

          v.step = 3.2; // 追加実行
          vlog(v,['cnt','sheet'],v);
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
          v.step = 3.4; // 排他できなかった場合、試行回数を-1
          v.cnt--;
        }
      }

      v.step = 3.5; // リトライしても排他不能だった場合の処理
      if( v.cnt === 0 ){
        // 成功レコードを全て失敗に変更
        v.rv.failure = [...v.rv.success,...v.rv.failure];
        v.rv.success = [];

        v.rv.log.forEach(log => {
          log.result = false;
          log.message.push(`lock error`);
          delete log.after;
        });
        throw new Error(`could not get lock ${this.maxTrial} times.`);
      }

      v.step = 3.6; // this.data/rawに追加
      // ※シートへの書き込み後に実行のこと
      this.data = [...this.data,...v.rv.success];
      this.raw = [...this.raw,...v.sheet];
    }


    // ------------------------------------------------
    v.step = 4; // ログに記録
    // ------------------------------------------------
    v.rv.log.forEach(log => {

      v.step = 4.1; // エラーメッセージを配列から文字列に変換
      if( log.message.length === 0 ){
        delete log.message;
      } else {
        log.message = log.message.join('\n');
      }
      log.result = log.result ? 'OK' : 'NG';

      v.step = 4.2; // オブジェクトからシートイメージに変換
      v.row = [];
      this.log.header.forEach(col => {
        // log.result(boolean) === false だと空欄になる。∵falseと判定されているため
        // [falsyな値](https://mosa-architect.gitlab.io/frontend-techs/js/variable/falsy-values.html)
        // 0: 数字のゼロ
        // "": 長さゼロの文字列
        // false: booleanのfalse
        // null: null(明示的なnull)
        // undefined: 未定義(または何も代入されていない状態)
        // NaN: 数字ではない
        if( log[col] ){
          v.value = log[col];
        } else {
          if( log[col] === 0 ) v.value = '0';
          else if( log[col] === '' ) v.value = '';
          else if( log[col] === false ) v.value = 'false';
          else if( log[col] === null ) v.value = 'null';
          else if( log[col] === undefined ) v.value = 'undefined';
          else if( isNaN(log[col]) ) v.value = 'NaN';
          else v.value = null;
        }
        v.row.push(v.value);
      });
      v.tmp = log; vlog(v,['tmp','row'],v);

      v.step = 4.3; // ログに行追加
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