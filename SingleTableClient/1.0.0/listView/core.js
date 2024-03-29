/** 一覧の表示
 * - 「いずれかの項目をクリックで当該行の詳細画面に遷移」は仕様として固定
 * - 'click':g.tips.detail はNG。無名関数で覆う必要あり
 *   - [JSのクラスメソッドをonclickに設定するときにつまずいたこと](https://zenn.dev/ihashiguchi/articles/d1506331996d76)
 *
 * #### 明細(行オブジェクト)の取得・更新ロジック
 *
 * - this.source.raw.length === 0 : 引数でオブジェクトの配列を渡されていない(=シート要読込)、かつシート未読込
 *   ⇒ doGAS(this.source.list)
 * - this.source.raw.length > 0 : 引数でオブジェクトの配列を渡された、またはシート読込済
 *   - this.source.reload === true : データソースはシート(オブジェクトの配列ではない)、かつ強制再読込
 * 	   ⇒ doGAS(this.source.list)
 *   - this.source.reload === false : 引数でオブジェクトの配列を渡された、またはシート読込済で強制再読込は不要
 * 	   ⇒ 処理不要
 * 
 * @param {Object} arg={} - 「SingleTableClientメンバ一覧」のsourceオブジェクト
 * @returns {HTMLObjectElement|Error}
 */
async listView(arg={}){
  const v = {whois:this.className+'.listView',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 事前準備
    changeScreen('loading');
    v.source = mergeDeeply(arg,this.source);
    if( v.source instanceof Error ) throw v.source;
    this.source = v.source;

    v.step = 2; // データが未設定またはデータソースがシートで強制再読込指定の場合、データ取得
    if( this.source.raw.length === 0 || this.source.reload === true ){
      v.r = await doGAS(...this.source.list);
      if( v.r instanceof Error ) throw v.r;
      this.source.raw = v.r;
      this.source.data = []; // 再読込の場合に備え、一度クリア
    }

    v.step = 3; // 一覧に表示するデータの準備
    v.step = 3.1; // 表示データ未設定ならthis.source.dataにセット
    if( this.source.data.length === 0 ){
      this.source.raw.forEach(x => { // filter(関数)で母集団とするか判定
        if(this.source.filter(x)) this.source.data.push(x); // 表示対象なら保存
      });
    }
    v.step = 3.2; // 並べ替え
    v.sort = (a,b,d=0) => { // a,bは比較対象のオブジェクト(ハッシュ)
      if( d < this.source.sortKey.length ){
        if( a[this.source.sortKey[d].col] < b[[this.source.sortKey[d].col]] )
          return this.source.sortKey[d].dir ? -1 : 1;
        if( a[this.source.sortKey[d].col] > b[[this.source.sortKey[d].col]] )
          return this.source.sortKey[d].dir ? 1 : -1;
        return v.sort(a,b,d+1);
      } else {
        return 0;
      }
    }
    this.source.data.sort((a,b) => v.sort(a,b));

    v.step = 4; // 表の作成
    v.table = this.wrapper.querySelector('[name="list"] [name="table"]');
    v.table.innerHTML = '';
    v.step = 4.1; // thead
    for( v.c=0 ; v.c<this.list.cols.length ; v.c++ ){
      // name属性を追加
      v.th = mergeDeeply(this.list.cols[v.c].th,{attr:{name:this.list.cols[v.c].col}});
      createElement(v.th,v.table);
    }
    v.step = 4.2; // tbody
    for( v.r=0 ; v.r<this.source.data.length ; v.r++ ){
      for( v.c=0 ; v.c<Object.keys(this.list.cols).length ; v.c++ ){
        // name属性を追加
        v.td = mergeDeeply(this.list.cols[v.c].td,{attr:{name:this.list.cols[v.c].col},event:{}});
        // 関数を使用していれば実数化
        v.td = this.realize(v.td,this.source.data[v.r]);
        // 一行のいずれかの項目をクリックしたら、当該項目の詳細表示画面に遷移するよう定義
        v.td.event.click = ()=>this.detailView(JSON.parse(event.target.getAttribute('data-id')),'view');
        createElement(v.td,v.table);
      }
    }

    v.step = 5; // 終了処理
    changeScreen('list');
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