/* =======================================================
[report.js]
  提出用HTML(report.html)のJavaScript部分。
  build.shでreport.htmlに組み込み、「証憑yyyy」のGASにコピー
======================================================= */

const dev = devTools();
const db = LocalDb(cf);

const ctrlList = element => {
  // 現在の表示/非表示を保存
  const d = element.target.parentElement.querySelector('[data-type]').style.display;
  // ナビ領域のリストは隠蔽
  document.querySelectorAll('[data-type]').forEach(o => o.style.display = 'none');
  // クリックされたナビメニューの下の明細を表示
  element.target.parentElement.querySelector('[data-type]').style.display = d === 'none' ? '' : 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  const v = { whois: 'DOMContentLoaded', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 前準備
    // -------------------------------------------------------------
    dev.step(1.1);  // 作業日日付の設定
    document.getElementById('today').innerText = toLocale(data.created,'yyyy/MM/dd現在');
    dev.step(1.2);  // シートから出力されたdataのRDBへの保存
    data.tables.forEach(table => {
      v.sql = `drop table if exists \`${table.name}\`;`
      + `create table \`${table.name}\`;`
      + `insert into \`${table.name}\` select * from ?;`;
      v.r = db.exec(v.sql,[table.data]);
    });
    // ナビ領域のリストは隠蔽
    document.querySelectorAll('[data-type]').forEach(o => o.style.display = 'none');

    // -------------------------------------------------------------
    dev.step(2);  // masterテーブル作成
    // -------------------------------------------------------------
    v.sql =
    // PDFファイルの存在を前提とする電子証憑・参考・返済明細でisExist=falseは予め削除。
    // 但し特記事項は元々ファイルの存在を前提としないので、削除しない。
    'delete from `記入用`'
    + ' where `type`<>"特記事項" and `isExist`<>"TRUE";'
    // masterテーブルを初期化
    + 'drop table if exists `master`;'
    + 'create table `master`;'
    // files,記入用テーブルからmasterを作成
    + 'insert into `master` select'
    + ' `files`.`id` as `id`'
    + ', `files`.`name` as `name`'
    + ', case'  // 「記入用」シート未記載(=自動判別可能PDF)にtypeを設定
    +   ' when `記入用`.`type` is null'
    +   ' then identifyType(`files`.`name`)'
    +   ' else `記入用`.`type`'
    + ' end as `type`'
    + ', `記入用`.`date` as `date`'
    + ', `記入用`.`label` as `label`'
    + ', `記入用`.`price` as `price`'
    + ', `記入用`.`payby` as `payby`'
    + ', `記入用`.`note` as `note`'
    + ' from `files` full outer join `記入用`'
    + ' on `files`.`id`=`記入用`.`id`;'
    // typeが空欄(=記入用シートでの記入漏れ)の場合「不明」を設定
    + 'update `master` set `type`="不明" where `type`="";'
    // type=対象外はmasterから削除
    + 'delete from `master` where `type`="対象外";'
    // 交通費をmasterテーブルに追加
    + 'insert into `master` select "交通費" as type, * from `交通費` order by date;';
    v.r = db.exec(v.sql);
    if( v.r instanceof Error ) throw v.r;

    // -------------------------------------------------------------
    dev.step(3);  // リンク(a href)文字列作成用関数pfMapの定義
    // リンクはcf.classDef(証憑分類に関する定義)のprintf関数に基づき生成。
    // printfにmasterの行オブジェクトを渡し、{項目名:リンク用HTML文字列}を取得、
    // これをmasterの行オブジェクトに上書きする。
    // -------------------------------------------------------------
    dev.step(3.1);  // pfMap {Object.<string,Function>}
    // リンクを含む表示用HTML文字列生成関数。メンバ名は記事(data-type)名。
    // 引数：{Object} o - masterテーブルの行オブジェクト
    // 戻り値：{
    //   項目名 : HTML文字列,
    //   sortKey : 記事の内容作成時、並び順の基準となる文字列
    // }
    v.pfMap = {}; // {type名:当該typeに適用する関数}
    for( [v.key, v.obj] of Object.entries(cf.classDef) ){
      v.pfMap[v.key] = new Function('o',(
        v.obj.colnum === 0 ? /* テーブル型の記事 */ `
          const rv = {};
          cf.classDef['${v.key}'].cols.forEach(col => {
            if(col.printf) rv[col.name]=col.printf(o);
          });
          rv.sortKey = cf.classDef['${v.key}'].orderBy(o);
          return rv;
        ` : /* 箇条書き型の記事 */ (
          cf.classDef[v.key].rex instanceof RegExp
          ? /* ファイル名からtypeを自動判別可能な場合 */ `
            const m = o.name.match(cf.classDef['${v.key}'].rex);
            return {
              label: cf.classDef['${v.key}'].printf(o,m),
              sortKey: cf.classDef['${v.key}'].orderBy(o,m),
            };
          ` : /* ファイル名からtypeを自動判別不能な場合 */ `
            return {
              label:cf.classDef['${v.key}'].printf(o),
              sortKey:cf.classDef['${v.key}'].orderBy(o),
            };
          `
        )
      ));
    }
    dev.dump(v.pfMap);

    dev.step(3.2);  // master上にリンク文字列セット＋sortKey設定
    v.master = db.exec('select * from `master`;')
    if( v.master instanceof Error ) throw v.master;
    v.master.forEach(o => {
      dev.dump(o);
      o = Object.assign(o,v.pfMap[o.type](o));
    });
    v.sql = 'delete from `master`;insert into `master` select * from ?;';
    v.r = db.exec(v.sql,[v.master]);
    if( v.r instanceof Error ) throw v.r;


    // -------------------------------------------------------------
    dev.step(4);  // 記事(data-type)毎に内容を作成
    // -------------------------------------------------------------
    document.querySelectorAll('[data-type]').forEach(node => {

      dev.step(4.1);  // データの抽出
      v.type = node.getAttribute('data-type');
      v.sql = 'select * from `master`'
      + ` where \`type\`="${v.type}"`
      + ` order by \`sortKey\`;`;
      v.list = db.exec(v.sql);
      if( v.list instanceof Error ) throw v.list;
      dev.dump(v.type,v.list);

      dev.step(4.2);  // 内容の追加
      if( cf.classDef[v.type].colnum > 0 ){ // 箇条書き型
        dev.step(4.2);  // styleの指定
        node.style.gridTemplateColumns = `repeat(${cf.classDef[v.type].colnum}, 1fr)`;
        v.list.forEach(item => {
          node.appendChild(createElement({html:item.label}));
        });
      } else {  // テーブル型
        v.r = createTable({
          name: v.type,
          cols: cf.classDef[v.type].cols,
          data: v.list,
        },{parent:node});
        if( v.r instanceof Error ) throw v.r;
      }

      dev.step(4.3);  // 開閉制御
      node.parentElement.addEventListener('click',ctrlList);
    });

    // -------------------------------------------------------------
    dev.step(5);  // 未分類証憑が無ければ記事を隠蔽
    // -------------------------------------------------------------
    if( db.exec('select count(*) as num from `master` where `type`="不明"')[0].num === 0 ){
      document.getElementById('notFilled').style.display = 'none';
    }

  } catch (e) { dev.error(e); return e; }
});