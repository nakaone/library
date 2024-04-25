/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {string} arg.updated - 公開鍵更新日時(日時文字列)
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(arg){
  const v = {whois:w.whois+'.registMail',step:0,
    rv: {userId:null,auth:null,SPkey:w.prop.SPkey,isExist:null},
  };
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(arg.email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // メアドの登録状況を取得
    v.master = new SingleTable(w.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 3; // メアドが登録済か確認、登録済ならシートのユーザ情報を保存
    v.sheet = null;
    for( v.i=0 ; v.i<v.master.data.length ; v.i++ ){
      if( v.master.data[v.i][w.prop.emailColumn] === arg.email ){
        v.sheet = v.master.data[v.i];
        break;
      }
    }

    if( v.sheet !== null ){
      v.step = 4; // メアドが登録済の場合

      if( v.sheet.CPkey !== arg.CPkey ){
        v.step = 4.1; // ユーザの公開鍵を更新
        v.r = v.master.update([{CPkey:arg.CPkey,updated:arg.updated}]);
        if( v.r instanceof Error ) throw v.r;
      }

      v.step = 4.2; // フラグを更新
      v.rv.isExit = true;

    } else {
      v.step = 5; // メアドが未登録の場合

      v.step = 5.1; // userIdの最大値を取得
      if( v.master.data.length === 0 ){
        v.max = w.prop.userIdStartNumber - 1;
      } else {
        v.map = v.master.data.map(x=>x[w.prop.primatyKeyColumn]);
        v.max = Math.max(...v.map);
      }

      v.step = 5.2; // シートに初期値を登録
      v.sheet = {
        userId  : v.max + 1,
        created : toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn'),
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
        updated : arg.updated,
        trial   : '{}',
      };
      v.r = v.master.insert([v.sheet]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.3; // フラグを更新
      v.rv.isExist = false;
    }

    v.step = 6; // 戻り値用にユーザ情報の項目を調整
    Object.keys(v.rv).forEach(x => {
      if( v.rv[x] === null ) v.rv[x] = v.sheet[x];
    })

    v.step = 7; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.registMail(arg);
if( w.rv instanceof Error ) throw w.rv;