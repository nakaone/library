v.step = 1; // データを取得
v.data = JSON.parse(document.querySelector('[name="data"]').innerText);

v.step = 2; // テーブル"master"の作成
v.step = 2.1; // create
v.sql = 'create table master ('
+ '`rowNo` int,'
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
  v.sql += `(${v.r+2},`;  // シート上の行番号
  ['pId','lId','nId']
  .forEach(x => v.sql += v.numType(x));
  ['nName','type','range','default','role','note']
  .forEach(x => v.sql += v.strType(x));
  v.sql += '0),'; // isOpen
}
alasql(v.sql.replace(/,$/,';'));

v.step = 2.3; // 引用先行の空欄が引用元行の該当欄で埋まる場合、値を引用
v.sql = 'select * from master where lId>0';
v.list = alasql(v.sql);
for( v.r=0 ; v.r<v.list.length ; v.r++ ){
  // 引用元行の情報を取得
  v.lRow = alasql(`select * from master where nId=${v.list[v.r].lId}`)[0];
  v.sql = 'update master set '
  + `\`nId\` = ${v.list[v.r].nId || v.lRow.nId || 0},`
  + `\`nName\` = "${v.list[v.r].nName || v.lRow.nName}",`
  + `\`type\` = "${v.list[v.r].type || v.lRow.type}",`
  + `\`range\` = "${v.list[v.r].range || v.lRow.range}",`
  + `\`default\` = "${v.list[v.r].default || v.lRow.default}",`
  + `\`role\` = "${v.list[v.r].role || v.lRow.role}",`
  + `\`note\` = "${v.list[v.r].note || v.lRow.note}"`
  + ` where rowNo=${v.list[v.r].rowNo}`;
  alasql(v.sql);
}

v.step = 2.4; // isOpenのセット
v.step = 2.41; // 子要素を持つ場合
v.sql = 'select pId,count(*) as cnt'
+ ' from master where pId>=0 group by pId';
alasql(v.sql).forEach(x => alasql(
  `update master set isOpen = -1 where nId=${x.pId}`));
v.step = 2.42; // 引用元が子要素を持つ引用先
v.sql = 'select m1.rowNo as rowNo'
+ ' from master as m1'
+ ` inner join master as m2 on m1.lId = m2.nId`
+ ` where m1.isOpen = 0 and m2.isOpen = -1`;
alasql(v.sql).forEach(x => alasql(
  `update master set isOpen = -1 where rowNo=${x.rowNo}`));

v.step = 3; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;
