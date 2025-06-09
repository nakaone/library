const dev = devTools();
const ctrlList = element => {
  // ナビ領域のリストは隠蔽
  document.querySelectorAll('.list').forEach(o => o.style.display = 'none');
  // クリックされたナビメニューの下の明細を表示
  element.target.parentElement.querySelector('.list').style.display = 'grid';
}

window.addEventListener('DOMContentLoaded', () => {
  const v = { whois: 'DOMContentLoaded', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 前準備
    // -------------------------------------------------------------
    // 作業日日付の設定
    document.getElementById('today').innerText = toLocale(new Date(),'yyyy/MM/dd現在');
    // 最初はリスト非表示。但し電子証憑のリストのみ表示
    document.querySelectorAll('.list').forEach(o => o.style.display = 'none');
    // クリック時イベントの定義
    document.querySelectorAll('h2').forEach(o => o.addEventListener('click',ctrlList));
    // v.getURL: aタグが無ければ追加した上で、<a>タグをhref化(URLを作成)する関数
    // 引数:Evidenceオブジェクト、戻り値:Evidence.label(string)
    v.getURL = d => {
      // labelにaタグが無ければ追加
      if( !d.label.match(/<a>/) ) d.label = `<a>${d.label}</a>`;
      // <a>をhref化
      d.label = d.label.replace('<a>',`<a href="https://drive.google.com/file/d/${d.id}"/preview" target="_blank">`);
    };
    // 交通費に合計行を追加
    alasql.fn.cv = x => {return Number(x.replaceAll(',',''))};  // 文字列化された数値を合計する独自関数を定義
    data.push({
      type:'交通費',
      "日付": toLocale(new Date(),'yyyy/MM/dd'),
      "行先": "【合計】",
      "金額": (alasql('select sum(cv(`金額`)) as s from ? where type="交通費"',[data])[0].s).toLocaleString(),
    });

    document.querySelectorAll('.list[data-type]').forEach(t => {
      v.type = t.getAttribute('data-type');
      if( v.type === '電子証憑' || v.type === '交通費' ){
        // -------------------------------------------------------------
        dev.step(2); // テーブルを作成する場合
        // -------------------------------------------------------------
        dev.step(2.1);  // 対象データを取得
        v.sql = `select * from ? where type="${v.type}" order by date;`;
        v.data = alasql(v.sql,[data]);

        if( v.type === '電子証憑' ){
          dev.step(2.2);  // colsの定義＋labelのリンク先を設定
          v.cols = [
            {name:'date', label: '取引日'},
            {name:'label', label: '摘要'},
            {name:'price', label: '価格', align:'right'},
            {name:'payby', label: '支払'},
            {name:'note', label: '備考'},
          ];
          v.data.forEach(d => {
            if( !d.date || !d.label || d.label === '不明' || !d.price || !d.payby ){
              // 要追記事項に未記入項目が有る場合、【要追記】を表示
              d.date = '【要追記】';
              if( !d.label || d.label === '不明' ) d.label = d.name; // label未設定ならファイル名を設定            
            } else {
              d.price = Number(d.price).toLocaleString();
            }
            v.getURL(d); // label内のaタグを編集
          });
        } else {
          dev.step(2.3);  // 交通費はリンクがないのでcolsの定義のみ
          v.cols = [
            {name:'日付'},
            {name:'行先'},
            {name:'経路'},
            {name:'人数', align:'right'},
            {name:'金額', align:'right'},
            {name:'備考'}
          ];
        }

        dev.step(2.4);  // tableを追加
        createTable(v.data,{cols:v.cols,parent:t});

      } else {
        // -------------------------------------------------------------
        dev.step(3); // 明細を並べる場合
        // -------------------------------------------------------------
        v.sql = `select * from ? where type="${v.type}" order by label;`;
        alasql(v.sql,[data]).forEach(d => {
          // labelにaタグが無ければ追加
          if( !d.label.match(/<a>/) ) d.label = `<a>${d.label}</a>`;
          // <a>をhref化
          d.label = d.label.replace('<a>',`<a href="https://drive.google.com/file/d/${d.id}"/preview" target="_blank">`);
          // 要素をdiv.tableに追加
          createElement({tag: 'div',html: d.label},t);
        });
      }
    });
  } catch (e) { dev.error(e); return e; }
});

//::$lib/createElement/1.2.1/core.js::
//::$lib/createTable/1.0.0/core.js::
//::$lib/devTools/1.0.0/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::