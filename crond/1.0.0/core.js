/** crond: 定期的に実行するジョブを管理する
 * sessionが切れたらジョブを停止、管理情報も消去する
 * 
 * - crond.set({name:ジョブ名,func:ジョブ(関数),interval:実行間隔})
 * - crond.clear(取消ジョブ名 or null(全件取消))
 */
const crond = {

  /** set: 定期実行ジョブを設定
   * @param {Object} arg
   * @param {string} arg.name - ジョブを特定する名称
   * @param {function} arg.func - ジョブ本体
   * @param {number} arg.interval - 実行間隔。ミリ秒
   * @returns {void}
   */
  set: (arg) => {
    const v = {whois:'crond.set',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg,null,2)}`);
    try {

      v.step = 1; // 初期設定
      if( !this.cron ){
        this.cron = {}; // {ジョブ名:ジョブ番号}形式のオブジェクト
        // ページ遷移時には登録された定期実行ジョブを全て抹消
        window.addEventListener("beforeunload", (event) => {
          // Cancel the event as stated by the standard.
          event.preventDefault();
          // Chrome requires returnValue to be set.
          event.returnValue = "";
          crond.clear();
        });
      }

      v.step = 2; // 定期実行ジョブの登録
      this.cron[arg.name] = setInterval(arg.func,arg.interval);

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  },

  /** clear: 設定済定期実行ジョブの取消
   * @param {string} arg=null - 
   * @param {string} arg.name - ジョブを特定する名称
   * @param {function} arg.func - ジョブ本体
   * @param {number} arg.interval - 実行間隔。ミリ秒
   * @returns {void}
   */
   clear: (arg=null) => {
    const v = {whois:'crond.clear',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${arg}`);
    try {

      v.step = 1; // 取消対象ジョブのリストアップ
      v.arg = arg === null ? Object.keys(this.cron) : [arg];

      v.step = 2; // 登録取消の実行
      v.arg.forEach(x => {
        clearInterval(this.cron[x]);
        delete this.cron[x];
      })

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  },
};