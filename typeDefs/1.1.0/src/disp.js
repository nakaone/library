function disp(pId=0,depth=0,row=[]){
  const v = {whois:'disp',rv:null,step:0,row:row};
  console.log(`${v.whois} start.`);
  try {

    if( depth > 10 ) throw new Error('too many depth');

    v.step = 1; // 子要素をseq順に取得
    v.sql = `select * from relation`
    + ` inner join primitive on relation.cId === primitive.id`
    + ` where relation.pId=${pId} order by relation.seq`;
    v.children = alasql(v.sql);
    console.log(`l.257 v.children=${stringify(v.children)}`);

    v.step = 2; // 子要素を順次追加
    for( v.i=0 ; v.i<v.children.length ; v.i++ ){
      v.step = 2.1; // 項目名の前の表示/非表示制御
      v.c = {tag:'td',children:[]};
      if( v.children[v.i].isOpen !== 0 ){ // 子要素が有る場合
        v.c.children.push({
          tag:'span',
          attr:{name:v.children[v.i].rId},
          text:v.children[v.i].isOpen>0?'▼':'▶',
          event:{click:()=>toggle()},
          style:{marginLeft:`${depth}rem`}
        });
        v.c.children.push({tag:'span',text:(v.children[v.i].name||'')});
      } else {
        v.c.children.push({tag:'span',text:(v.children[v.i].name||''),style:{marginLeft:`${depth}rem`}});
      }
      v.step = 2.2; // 項目名以外を一行分作成
      v.row.push({tag:'tr',children:[
        {tag:'td',text:v.children[v.i].id,style:{textAlign:'right'}},
        v.c,
        {tag:'td',html:(v.children[v.i].type||'')},
        {tag:'td',html:(v.children[v.i].range||'')},
        {tag:'td',html:(v.children[v.i].role||'')},
        {tag:'td',html:(v.children[v.i].note||'')},
      ]});

      v.step = 2.2; // 子要素のisOpenなら再帰呼出
      if( v.children[v.i].isOpen > 0 ){
        v.r = disp(v.children[v.i].id,depth+1,v.row);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 3; // tbodyの内容を描画
    if( depth === 0 ){
      document.querySelector('tbody').innerHTML = '';
      createElement(v.row,'tbody');
    }

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
