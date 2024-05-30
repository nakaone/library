function disp(pId=null,depth=0,row=[]){
  if( depth > 10 ) return new Error('too many depth'); // 永久ループ防止
  const v = {whois:'disp',rv:null,step:0,row:row};
  console.log(`${v.whois} start.`);
  try {

    if( pId === null ){
      pId = Number(document.querySelector('[name="pId"]').innerText);
    }

    v.step = 1; // ツリー(relation)から親がpIdである子要素をseq,name順に取得
    v.sql = `select * from relation`
    + ` inner join master on relation.cId === master.nId`
    + ` where relation.pId=${pId} order by relation.seq, master.name`;
    v.children = alasql(v.sql);

    v.step = 2; // 子要素を順次追加
    for( v.i=0 ; v.i<v.children.length ; v.i++ ){
      v.step = 2.1; // 行データ作成前に、項目名の前の'▼':'▶'を追加
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
      v.step = 2.2; // 項目名と合わせて一行分のデータを作成
      v.row.push({tag:'tr',children:[
        {tag:'td',text:v.children[v.i].nId,style:{textAlign:'right'}},
        v.c,
        {tag:'td',html:(v.children[v.i].type||'')},
        {tag:'td',html:(v.children[v.i].choices||'')},
        {tag:'td',html:(v.children[v.i].def||'')},
        {tag:'td',html:(v.children[v.i].role||'')},
        {tag:'td',html:(v.children[v.i].note||'')},
      ]});

      v.step = 2.2; // 子要素のisOpenなら再帰呼出
      if( v.children[v.i].isOpen > 0 ){
        v.r = disp(v.children[v.i].nId,depth+1,v.row);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 3; // tbodyの内容を描画
    if( depth === 0 ){
      document.querySelector('tbody').innerHTML = '';
      createElement(v.row,'tbody');
    }

    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
