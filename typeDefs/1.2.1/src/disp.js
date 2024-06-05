function disp(pId=null,depth=0,row=[]){
  const v = {whois:'disp',rv:null,step:0,row:row};
  console.log(`${v.whois} start. pId=${pId},depth=${depth}`);
  try {

    v.step = 1.1; // 永久ループ防止
    if( depth > 10 ) return new Error('too many depth');

    v.step = 1.2; // 既定値設定
    if( pId === null )
      pId = Number(document.querySelector('[name="pId"]').innerText);

    v.step = 2; // 子要素の配列をv.childrenに作成
    v.step = 2.1; // pIdのレコードをv.pRowに取得
    v.pRow = alasql(`select * from master where nId=${pId}`)[0];

    v.step = 2.2; // 自分(pId)の子要素をv.childrenに追加
    v.sql = `pId=${pId}`;
    v.step = 2.3; // pIdのレコードにlIdが設定されていた場合、lIdの子要素を取得
    if( v.pRow.lId > 0 ) v.sql += ` or pId=${v.pRow.lId}`;

    v.step = 2.4; // masterから取得
    v.sql = `select * from master where ${v.sql}`;
    v.children = alasql(v.sql);

    v.step = 2.5; // 除外する要素(lId<0)のnIdを取得
    v.exclude = alasql('select -lId as id from ? where lId<0',[v.children]);

    v.step = 2.6; // v.childrenから除外
    v.sql = 'select children.*,exclude.id from ? as children'
    + ' left join ? as exclude on children.nId=exclude.id'
    + ' where exclude.id is null'
    + ' and not(children.lId<0)'
    + ' order by seq;';
    v.children = alasql(v.sql,[v.children, v.exclude]);


    // 子要素を順次処理
    for( v.i=0 ; v.i<v.children.length ; v.i++ ){
      v.step = 3.1; // 行データ作成前に、項目名の前の'▼':'▶'を追加
      v.name = {tag:'td',children:[]};
      if( v.children[v.i].isOpen !== 0 ){ // 子要素が有る場合
        v.name.children.push({
          tag:'span',
          attr:{name:v.children[v.i].seq},
          text:v.children[v.i].isOpen>0?'▼':'▶',
          event:{click:()=>toggle()},
          style:{marginLeft:`${depth}rem`}
        });
        v.name.children.push({tag:'span',text:(v.children[v.i].nName||'')});
      } else {
        v.name.children.push({tag:'span',text:(v.children[v.i].nName||'')
          ,style:{marginLeft:`${depth}rem`}});
      }
      v.step = 3.2; // 項目名と合わせて一行分のデータを作成
      v.row.push({tag:'tr',children:[
        {tag:'td',text:v.children[v.i].nId,style:{textAlign:'right'}},
        v.name,
        {tag:'td',html:(v.children[v.i].type||'')},
        {tag:'td',html:(v.children[v.i].range||'')},
        {tag:'td',html:(v.children[v.i].default||'')},
        {tag:'td',html:(v.children[v.i].role||'')},
        {tag:'td',html:(v.children[v.i].note||'')},
      ]});

      v.step = 3.3; // 子要素のisOpenなら再帰呼出
      if( v.children[v.i].isOpen > 0 ){
        v.r = disp(v.children[v.i].nId,depth+1,v.row);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 4; // タイトル・テーブルを描画
    if( depth === 0 ){
      // タイトルを設定
      document.querySelector('h1').innerText = v.pRow.nName;
      // tbodyの内容を描画
      document.querySelector('tbody').innerHTML = '';
      createElement(v.row,'tbody');
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
