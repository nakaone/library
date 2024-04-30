/** authClientからの要求を受け、ユーザ情報と状態を返す
 * 
 * - IDは自然数の前提、1から順に採番。
 * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
 * 
 * @param {Object} arg
 * @param {string} arg.email - 要求があったユーザのe-mail
 * @param {string} arg.CPkey - 要求があったユーザの公開鍵
 * @returns {object} 以下のメンバを持つオブジェクト
 * 1. SPkey {string} - サーバ側公開鍵
 * 1. isExist {boolean} - 既存メアドならtrue、新規登録ならfalse
 * 1. isEqual {boolean} - 引数のCPkeyがシート上のCPkeyと一致するならtrue
 * 1. isExpired {boolean} - CPkeyが有効期限切れならtrue
 * 1. data {object} - 該当ユーザのシート上のオブジェクト
 */
w.func.getUserInfo = function(arg){
  const v = {whois:w.whois+'.getUserInfo',step:0,rv:{
    SPkey:w.prop.SPkey,
    isExist:true, isEqual:true, isExpired:false, data:null,
  }};
  console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
  try {

    v.step = 1; // emailアドレスの妥当性検証
    if( checkFormat(arg.email,'email' ) === false ){
      throw new Error(`invalid e-mail address.`);
    }

    v.step = 2; // メアドの登録状況を取得
    v.master = new SingleTable(w.prop.masterSheet);
    if( v.master instanceof Error ) throw v.master;

    v.step = 3; // メアドが登録済か確認、登録済ならシートのユーザ情報を保存
    for( v.i=0 ; v.i<v.master.data.length ; v.i++ ){
      if( v.master.data[v.i][w.prop.emailColumn] === arg.email ){
        v.rv.data = v.master.data[v.i];
        break;
      }
    }

    if( v.rv.data === null ){
      v.step = 4; // メアドが未登録の場合

      v.step = 4.1; // userIdの最大値を取得
      if( v.master.data.length === 0 ){
        // 登録済が0件(シート作成直後)の場合
        v.max = w.prop.userIdStartNumber - 1;
      } else {
        v.map = v.master.data.map(x =>
          isNaN(x[w.prop.primatyKeyColumn])
          ? 0 : Number(x[w.prop.primatyKeyColumn]));
        v.max = Math.max(...v.map);
      }

      v.step = 4.2; // シートに初期値を登録
      v.rv.data = {
        userId  : v.max + 1,
        created : toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn'),
        email   : arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : arg.CPkey,
        updated : null,
        trial   : '{}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = v.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 4.3; // 存否フラグを更新
      v.rv.isExist = false;
    }

    v.step = 5; // 戻り値用にユーザ情報の項目を調整
    v.rv.isEqual = v.rv.data.CPkey === arg.CPkey;
    v.rv.isExpired = (new Date(v.rv.data.updated).getTime() + w.userLoginLifeTime) > Date.now();

    v.step = 6; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${stringify(arg)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
w.rv = w.func.getUserInfo(arg);
if( w.rv instanceof Error ) throw w.rv;