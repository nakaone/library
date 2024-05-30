v.step = 1; // データを取得
v.data = JSON.parse(document.querySelector('[name="data"]').innerText);

v.step = 2.1; // テーブル"master"の作成
v.sql = `create table master (`
+ `nId int,`
+ `name string,`
+ `type string,`
+ `choices string,`
+ `def string,`
+ `role string,`
+ `note string)`;
alasql(v.sql);

v.sql = `insert into master values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].nId === "" ) continue;
  v.sql += `(${v.data[v.r].nId},`
  + `"${v.data[v.r].name}",`
  + `"${v.data[v.r].type}",`
  + `"${v.data[v.r].choices}",`
  + `"${v.data[v.r].def}",`
  + `"${v.data[v.r].role}",`
  + `"${v.data[v.r].note}"),`;
}
alasql(v.sql.replace(/,$/,';'));

v.step = 2.2; // テーブル"relation"の作成
v.sql = `create table relation (`
+ `rId int,`
+ `pId int,`
+ `cId int,`
+ `seq int,`
+ `isOpen number)`; // -1=close, 0=no child, 1=open
alasql(v.sql);

v.sql = `insert into relation values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].pId === "" ) continue;
  v.sql += `(${v.r},`
  + `${typeof v.data[v.r].pId === 'number' ? v.data[v.r].pId : 'null'},`
  + `${typeof v.data[v.r].cId === 'number' ? v.data[v.r].cId : 'null'},`
  + `${typeof v.data[v.r].seq === 'number' ? v.data[v.r].seq : 'null'},`
  + `${v.data[v.r].hasChild ? -1 : 0}),`;
}
alasql(v.sql.replace(/,$/,';'));

v.step = 3; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;
