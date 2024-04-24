/** authClientからの登録要求を受け、IDを返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @param {number} arg.updated - 公開鍵更新日時(UNIX時刻)
 * @returns {number|Error} 採番されたuserId
 */
w.func.registMail = function(arg){
  const v = {whois:w.whois+'.registMail',rv:null,step:0,
    max:(w.prop.userIdStartNumber - 1),
    prop:PropertiesService.getDocumentProperties(),
  };
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(arg.email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    // DocumentPropertiesにメアドが登録済か確認
    console.log(`l.132 w.prop=${stringify(w.prop)}`);
    if( w.prop.map.hasOwnProperty(arg.email) ){
      // メアドが登録済の場合

      v.step = 2.1; // ユーザの公開鍵を更新
      v.rv = w.prop[w.prop.map[arg.email]];
      v.rv.updated = arg.updated;
      v.rv.CPkey = arg.CPkey;
      v.prop.setProperty(w.prop.map[arg.email],v.rv);

      v.step = 2.2; // 戻り値用にユーザ情報を補完
      v.rv.isExit = true;
      v.rv.SPkey = w.prop.SPkey;

    } else {
      // メアドが未登録の場合

      v.step = 3.1; // 既登録userIdの最大値を検索
      Object.keys(w.prop.map).forEach(x => {
        if( w.prop.map[x] > v.max ) v.max = w.prop.map[x];
      });

      v.step = 3.2; // プロパティサービス用ユーザ情報オブジェクトを作成
      v.rv = {
        userId  : v.max + 1,
        created : Date.now(),
        updated : arg.updated,
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
      }

      v.step = 3.3; // プロパティサービスに保存
      v.step = 3.31; // email -> userId マップ
      w.prop.map[arg.email] = v.rv.userId;
      console.log(`l.180 w.prop=${stringify(w.prop)}`)
      v.prop.setProperties(w.prop);
      v.step = 3.32; // ユーザ情報
      v.prop.setProperty(v.rv.userId,v.rv);

      v.step = 3.4; // シートに追加
      v.master = new SingleTable(w.prop.masterSheet);
      v.r = v.master.insert([{
        userId: v.rv.userId,
        created: toLocale(new Date(v.rv.created),'yyyy/MM/dd hh:mm:ss.nnn'),
        email: v.rv.email,
        auth: v.rv.auth,
      }]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 3.5; // 戻り値用にユーザ情報を補完
      v.rv.isExist = false;
      v.rv.SPkey = w.prop.SPkey;
    }

    v.step = 4; // 終了処理
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