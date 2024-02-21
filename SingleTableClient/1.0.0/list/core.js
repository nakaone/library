/** 一覧の表示
 * - 「いずれかの項目をクリックで当該行の詳細画面に遷移」は仕様として固定
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
    v.r = await doGAS(this.getData.func, ...this.getData.args);
    if( v.r instanceof Error ) throw v.r;
    this.data = [];
    v.r.forEach(x => {if(this.population(x)) this.data.push(x)});

    v.step = 2; // 表の作成
    v.table = this.wrapper.querySelector('[name="list"] [name="table"]');
    v.step = 2.1; // thead
    for( v.c=0 ; v.c<Object.keys(this.listCols).length ; v.c++ ){
      // name属性を追加
      v.th = mergeDeeply(this.listCols[v.c].th,{attr:{name:this.listCols[v.c].col}});
      createElement(v.th,v.table);
    }
    v.step = 2.2; // tbody
    for( v.r=0 ; v.r<this.data.length ; v.r++ ){
      for( v.c=0 ; v.c<Object.keys(this.listCols).length ; v.c++ ){
        // name属性を追加
        v.td = mergeDeeply(this.listCols[v.c].td,{attr:{name:this.listCols[v.c].col},event:{}});
        // 関数を使用していれば実数化
        v.td = this.realize(v.td,this.data[v.r]);
        // 一行のいずれかの項目をクリックしたら、当該項目の詳細表示画面に遷移するよう定義
        v.td.event.click = ()=>this.detail();
        createElement(v.td,v.table);
      }
    }

    v.step = 3; // 終了処理
    changeScreen('list');
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
