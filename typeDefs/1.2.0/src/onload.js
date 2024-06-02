v.step = 1; // データを取得
v.data = JSON.parse(document.querySelector('[name="data"]').innerText);

v.step = 2; // テーブル"master"の作成
v.step = 2.1; // create
v.sql = 'create table master ('
+ '`seq` int,'
+ '`pId` int,'
+ '`lId` int,'
+ '`nId` int,'
+ '`nName` string,'
+ '`type` string,'
+ '`range` string,'
+ '`default` string,'
+ '`role` string,'
+ '`note` string,'
+ '`isOpen` int default 0)'; // -1=close, 0=no child, 1=open
alasql(v.sql);

v.step = 2.2; // テーブル"master"のデータをセット
v.numType = x => (typeof v.data[v.r][x] === 'string' 
  ? 'NULL' : v.data[v.r][x]) + ',';
v.strType = x => (v.data[v.r][x] === '' 
  ? '""' : `"${v.data[v.r][x]}"`) + ',';
v.sql = `insert into master values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].pId === "" && v.data[v.r].nName !== "root") continue;
  v.sql += `(${v.r},`;  // seq欄
  ['pId','lId','nId']
  .forEach(x => v.sql += v.numType(x));
  ['nName','type','range','default','role','note']
  .forEach(x => v.sql += v.strType(x));
  v.sql += '0),'; // isOpen
}
alasql(v.sql.replace(/,$/,';'));

v.step = 2.3; // 引用先行の空欄が引用元行の該当欄で埋まる場合、値を引用
v.sql = 'select * from master where lId>0 and nId>0';
v.list = alasql(v.sql);
for( v.r=0 ; v.r<v.list.length ; v.r++ ){
  v.lRow = alasql(`select * from master where nId=${v.list[v.r].lId}`)[0];
  ['nName','type','range','default','role','note'].forEach(x => {
    if( v.list[v.r][x] === '' && v.lRow[x] !== '' ){
      v.sql = `update master set \`${x}\` = "${v.lRow[x]}"`
      + ` where seq=${v.list[v.r].seq}`;
      alasql(v.sql);
    }
  });
}

v.step = 2.4; // isOpenのセット
alasql('select pId,count(*) as cnt from master where pId>=0 group by pId')
.forEach(x => alasql(`update master set isOpen = -1 where nId=${x.pId}`));

v.step = 3; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;
