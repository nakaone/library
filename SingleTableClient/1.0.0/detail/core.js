/** 詳細・編集画面の表示 */
detail(id=undefined,mode='view'){
  const v = {whois:this.className+'.detail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 事前準備：表示・編集対象およびモードの判定
    v.event = event || null
    if( id === undefined ){
      // 一覧表からクリックされて遷移してきた場合、対象をdata-idタグから特定
      v.id = JSON.parse(event.target.getAttribute('data-id'));
      // モードの判定。「更新」なら遷移元がbutton,aタグのはず。
      // 遷移元がDIVなら一覧表等で表示対象として選ばれて遷移してきたと解釈
      v.mode = whichType(event.target) === 'HTMLDivElement' ? 'view' : 'edit';
    } else {
      // 更新結果の表示等、呼び出されて処理を行う場合は引数を設定
      v.id = id;
      v.mode = mode;
    }
    v.step = 1.1; // 対象行オブジェクトをv.dataに取得
    v.data = this.data.find(x => x[this.primaryKey] === v.id);
    v.step = 1.2; // 操作対象のDOMを特定
    v.table = this.wrapper.querySelector('[name="detail"] [name="table"]');
    //console.log(`l.380 ${v.whois}: id=${id}, mode=${mode}, v.id=${v.id}\nv.data=${stringify(v.data)}`);

    v.step = 2; // 詳細画面に表示する項目を順次追加
    for( v.i=0 ; v.i<this.detailCols.length ; v.i++ ){
      v.col = this.detailCols[v.i];
      v.step = 2.1; // 表示不要項目はスキップ
      if( !v.col.hasOwnProperty('view') && !v.col.hasOwnProperty('edit') )
        continue;
      v.step = 2.2; // 項目の作成と既定値の設定
      v.proto = {style:{gridColumn:v.col.col||'1/13'}};
      if( v.col.hasOwnProperty('name') ) v.proto.attr = {name:v.col.name};
      v.step = 2.3; // データに項目が無い場合、空文字列をセット(例：任意入力の備考欄が空白)
      if( !v.data.hasOwnProperty(v.col.name) ) v.data[v.col.name] = '';
      v.step = 2.3; // 参照か編集かを判断し、指定値と既定値をマージ
      if( v.col.hasOwnProperty('edit') && v.mode === 'edit' ){
        v.step = 2.31; // 編集指定の場合、detailCols.editのcreateElementオブジェクトを出力
        v.td = mergeDeeply(v.col.edit, v.proto);
      } else {
        v.step = 2.32; // 参照指定の場合、または編集指定だがeditのcreateElementが無指定の場合、
        // detailCols.viewのcreateElementオブジェクトを出力
        v.td = mergeDeeply(v.col.view, v.proto);
      }
      v.step = 2.4; // 関数で指定されている項目を実数化
      v.td = this.realize(v.td,v.data);
      console.log(`l.424 v.td=${stringify(v.td,true)}`)
      v.step = 2.5; // table領域に項目を追加
      createElement(v.td,v.table);
    }

    v.step = 3; // 終了処理
    changeScreen('detail');
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}