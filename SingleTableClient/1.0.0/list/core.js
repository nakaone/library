/** 一覧の表示
 * @param {void}
 * @returns {HTMLObjectElement|Error}
 * 
 * 'click':g.tips.detail はNG。無名関数で覆う必要あり
 * - [JSのクラスメソッドをonclickに設定するときにつまずいたこと]
 * (https://zenn.dev/ihashiguchi/articles/d1506331996d76)
 */
async list(){
  const v = {whois:this.className+'.list',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 一覧表示対象の取得
    changeScreen('loading');
    this.data = await doGAS('tipsServer','tips','list');
    if( this.data instanceof Error ) throw this.data;

    v.step = 2; // 表の作成
    for( v.i=0 ; v.i<this.data.length ; v.i++ ){
      createElement({
        attr:{class:'th num','data-item':JSON.stringify(this.data[v.i])},
        text:this.data[v.i].id,
        event:{'click':()=>this.detail()}
      },this.parent.querySelector('[name="list"] .table'));
      createElement({
        attr:{class:'td','data-item':JSON.stringify(this.data[v.i])},
        text:this.data[v.i].title,
        event:{'click':()=>this.detail()}
      },this.parent.querySelector('[name="list"] .table'));
    }

    v.step = 3;
    changeScreen('list');

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
