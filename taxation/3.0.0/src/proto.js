const ctrlList = element => {
  // ナビ領域のリストは隠蔽
  document.querySelectorAll('.list').forEach(o => o.style.display = 'none');
  // クリックされたナビメニューの下の明細を表示
  element.target.parentElement.querySelector('.list').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  const v = { whois: 'DOMContentLoaded', rv: null };

  // 作業日日付の設定
  document.getElementById('today').innerText = toLocale(new Date(),'yyyy/MM/dd現在');
  // 最初はリスト非表示。但し電子証憑のリストのみ表示
  document.querySelectorAll('.list').forEach(o => o.style.display = 'none');
  // クリック時イベントの定義
  document.querySelectorAll('h2').forEach(o => o.addEventListener('click',ctrlList));

  document.querySelectorAll('.list[data-type]').forEach(t => {
    v.sql = `select * from ? where type="${t.getAttribute('data-type')}" order by label;`;
    alasql(v.sql,[data]).forEach(d => {
      // labelにaタグが無ければ追加
      if( !d.label.match(/<a>/) ) d.label = `<a>${d.label}</a>`;
      // <a>をhref化
      d.label = d.label.replace('<a>',`<a href="https://drive.google.com/file/d/${d.id}"/preview" target="_blank">`);
      // 要素をdiv.tableに追加
      createElement({tag: 'div',html: d.label},t);
    })
  });
});

//::$lib/createElement/1.2.1/core.js::
//::$lib/devTools/1.0.0/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::