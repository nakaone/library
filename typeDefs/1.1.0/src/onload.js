v.step = 1; // データを取得
v.data = JSON.parse(document.querySelector('[name="data"]').innerText);
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  console.log(`l.108 v.data[${v.r}].hasChild(${typeof v.data[v.r].hasChild})=${v.data[v.r].hasChild}`)
}

v.step = 2.1; // テーブル"master"の作成
v.mDef = [
  {name:'nId',type:'int'},
  {name:'name',type:'string'},
  {name:'type',type:'string'},
  {name:'choices',type:'string'}, // 当初rangeにしていたらエラー。項目名変更
  {name:'def',type:'string'},
  {name:'role',type:'string'},
  {name:'note',type:'string'},
];
v.sql = `create table master (`;
v.mDef.forEach(x => v.sql += `${x.name} ${x.type},`);
v.sql = v.sql.replace(/,$/,');');
alasql(v.sql);

v.sql = `insert into master values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].nId === "" ) continue;
  v.rSql = '';
  v.mDef.forEach(x => v.rSql += `"${v.data[v.r][x.name]}",`);
  v.sql = v.sql + `(${v.rSql.replace(/,$/,'')}),`
}
v.sql = v.sql.replace(/,$/,';');
alasql(v.sql);

v.step = 2.2; // テーブル"relation"の作成
v.rDef = [
  {name:'rId',type:'int'},  // relation特定用
  {name:'pId',type:'int'},
  {name:'cId',type:'int'},
  {name:'seq',type:'int'},
  {name:'isOpen',type:'number'}, // -1=close, 0=no child, 1=open
];
v.sql = `create table relation (`;
v.rDef.forEach(x => v.sql += `${x.name} ${x.type},`);
v.sql = v.sql.replace(/,$/,');');
alasql(v.sql);

v.sql = `insert into relation values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].pId === "" ) continue;
  v.sql += `(${v.r},`
  + `${v.data[v.r].pId || 'null'},`
  + `${v.data[v.r].cId || 'null'},`
  + `${v.data[v.r].seq || 'null'},`
  + `${v.data[v.r].hasChild?-1:0}),`;
}
v.sql = v.sql.replace(/,$/,';');
alasql(v.sql);

v.step = 3.1; // シナリオを指定。ここではauthMenuシナリオを指定
document.querySelector('[name="scenario"]').innerText = '1';
v.step = 3.2; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;
