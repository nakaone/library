/** キーワード検索
 * @param {void} - 画面からキーを取得するので引数は無し
 * @returns {null|Error}
 */
search(){
  const v = {whois:this.className+'.search',rv:null,step:0,keyword:'',list:[]};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // v.keyに検索キーを取得
    this.wrapper.querySelectorAll('[name="list"] [name="control"] [name="keyword"]').forEach(x => {
      if( x.value !== '' ) v.keyword = x.value;
    });

    v.step = 2; // this.source.rawから合致する行オブジェクトをv.listに抽出
    v.func = this.list.def.elements.find(x => x.hasOwnProperty('func')).func;
    for( v.i=0 ; v.i<this.source.raw.length ; v.i++ ){
      console.log(`l.1171\nresult=${v.func(this.source.raw[v.i],v.keyword)}\nkeyword=${v.keyword}\ntitle+tag=${this.source.raw[v.i].title+this.source.raw[v.i].tag}`);
      if( v.func(this.source.raw[v.i],v.keyword) ){
        v.list.push(this.source.raw[v.i]);
      }
    }
    console.log(`l.1154\nv.func=${stringify(v.func)}\nv.list=${stringify(v.list)}`);

    v.step = 3;
    if( v.list.length === 0 ){
      alert('該当するものがありません');
    } else if( v.list.length === 1 ){
      // 結果が単一ならdetailを参照モードで呼び出し
      this.current = v.list[0][this.source.primaryKey];
      v.r = this.detailView();
    } else {
      // 結果が複数ならlistを呼び出し
      this.source.data = v.list;
      v.r = this.listView();
    }
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
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