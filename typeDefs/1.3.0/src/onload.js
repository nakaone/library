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
+ '`ref` string,'
+ '`role` string,'
+ '`note` string,'
+ '`isOpen` int default 0)'; // -1=close, 0=no child, 1=open
alasql(v.sql);

v.step = 2.2; // テーブル"master"のデータをセット
v.numType = x =>  // SQLの数値欄。空欄(typeof string)ならNULL、数値はそのまま追加
  (typeof v.data[v.r][x] === 'string' ? 'NULL' : v.data[v.r][x]) + ',';
v.strType = x =>  // SQLの文字列欄。ダブルクォーテーションで囲む
  `"${v.data[v.r][x]}",`;
  //(v.data[v.r][x] === '' ? '""' : `"${v.data[v.r][x]}"`) + ',';
v.sql = `insert into master values `;
for( v.r=0 ; v.r<v.data.length ; v.r++ ){
  if( v.data[v.r].pId === "" && v.data[v.r].nName !== "root")
    continue;  // ルート以外でpIdが空欄の行は飛ばす
  v.sql += `(${v.r+2},`;  // rowNoはシート上の行番号と合わせるため+2
  ['pId','lId','nId']
  .forEach(x => v.sql += v.numType(x));
  ['nName','type','range','default','ref','role','note']
  .forEach(x => v.sql += v.strType(x));
  v.sql += '0),'; // isOpenは既定値'0'
}
alasql(v.sql.replace(/,$/,';'));

v.step = 2.3; // ①引用先(lId>0)のnId未設定 且つ ②引用元に子要素が存在 だと
// dispで親要素から呼出される際、pIdにセットされるnIdが不明になってエラー発生
// 【例】authMenu.constructorの内部でsessionStorageを参照する場合
//     (authMenu.constructor > 内部参照 > sessionStorage)
//     行53 nId:53, nName:sessionStorage
//     行99 lId:53, nId:空欄, nName:空欄
// 行99のlIdにsessionStorageのnId(53)を設定、nName〜noteが空欄ならnIdは未設定
// これを回避するため、上記①、②を満たす場合は引用先のnIdにrowNoを設定する。
v.sql = `select m1.* from master as m1`
//`select m1.rowNo,m1.lId,m1.nId as m1Id,m2.pId,m2.nId as m2Id from master as m1`
+ ` inner join master as m2 on m1.lId = m2.pId`
+ ` where not m1.nId and m1.nId != 0` // "nId is null"は左記のように記述
  // 参考 AlaSQL "Is Null where clause not working"
  //        https://github.com/AlaSQL/alasql/issues/458
+ ` group by m1.rowNo`;
alasql(v.sql).forEach(x => alasql(`update master set nId=rowNo where rowNo=${x.rowNo}`));

v.step = 2.4; // 引用先行の空欄が引用元行の該当欄で埋まる場合、値を引用
v.sql = 'select * from master where lId>0';
v.list = alasql(v.sql);
for( v.r=0 ; v.r<v.list.length ; v.r++ ){
  // 引用元行の情報を取得
  v.lRow = alasql(`select * from master where nId=${v.list[v.r].lId}`)[0];
  v.sql = 'update master set '
  + `\`nName\` = "${v.list[v.r].nName || v.lRow.nName}",`
  + `\`type\` = "${v.list[v.r].type || v.lRow.type}",`
  + `\`range\` = "${v.list[v.r].range || v.lRow.range}",`
  + `\`default\` = "${v.list[v.r].default || v.lRow.default}",`
  + `\`ref\` = "${v.list[v.r].ref || v.lRow.ref}",`
  + `\`role\` = "${v.list[v.r].role || v.lRow.role}",`
  + `\`note\` = "${v.list[v.r].note || v.lRow.note}"`
  + ` where rowNo=${v.list[v.r].rowNo}`;
  alasql(v.sql);
}

v.step = 2.5; // isOpenのセット
v.step = 2.51; // 子要素を持つ場合
v.sql = 'select pId,count(*) as cnt'
+ ' from master where pId>=0 group by pId';
alasql(v.sql).forEach(x => alasql(
  `update master set isOpen = -1 where nId=${x.pId}`));
v.step = 2.52; // 引用元が子要素を持つ引用先
v.sql = 'select m1.rowNo as rowNo'
+ ' from master as m1'
+ ` inner join master as m2 on m1.lId = m2.nId`
+ ` where m1.isOpen = 0 and m2.isOpen = -1`;
alasql(v.sql).forEach(x => alasql(
  `update master set isOpen = -1 where rowNo=${x.rowNo}`));

v.step = 3; // ツリーの描画
v.r = disp();
if( v.r instanceof Error ) throw v.r;
