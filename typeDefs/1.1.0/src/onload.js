v.step = 1; // データを取得
v.data = JSON.parse(document.querySelector('[name="data"]').innerText);
console.log(`l.299 v.data=${stringify(v.data)}`);

v.step = 2.1; // テーブル'primitive'の作成
alasql(`create table primitive (id int,name string,type string, range string,role string,note string)`);
v.data.primitive.forEach(x => {
  alasql(`insert into primitive values (${x.id},"${x.name}","${x.type||''}","${x.range||''}","${x.role||''}","${x.note||''}");`);
});

v.step = 2.2; // テーブル'relation'の作成
// isOpen: -1=close, 0=no child, 1=open
alasql('create table relation (rId int,pId int,cId int,seq int,isOpen number)');
v.i = 0;
v.data.relation.forEach(x => {
  console.log(`l.299 x.hasChild(${typeof x.hasChild})="${x.hasChild}"`)
  alasql(`insert into relation values (${v.i},${x.pId},${x.cId},${x.seq},${x.hasChild==='true'?-1:0});`);
  v.i++;
});
v.rel = alasql('select * from relation;');
console.log('l.300',v.rel)

v.step = 3; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;