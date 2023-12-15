async function range2Table(){
  const v = {whois:'range2Table',rv:null,step:0,
  style01: // 共通CSS
    `html, body{
      width: 100%;
      font-size: 16px;
      text-size-adjust: none;
    }
    body * {font-size: 1rem;}
    th, .th {
      text-align: center;
      font-weight: bold;
      color: white;
      background-color: #888;
    }
    td, .td {
      border-bottom: solid 1px #aaa;
      border-right: solid 1px #aaa;
    }
    .num, .right {text-align:right;}`,
  style02: // range2Table特有
    `div.range2Table {
      --gap: 0.1rem;
      display: grid;
      gap: var(--gap);
      font-size: 10pt;
      color: rgb(0, 0, 0);
      font-weight: normal;
      background: rgb(255, 255, 255);
      white-space: nowrap;
    }
    .range2Table > div {
      padding: var(--gap);
    }
    .range2Table .memo {border-left: solid var(--gap) #f44}`
  };
  console.log(v.whois+' start.');
  try {
    changeScreen('loading');

    v.step = 1; // アクティブセルの情報を取得
    v.r = await doGAS('getActiveCellInfo');
    v.cellInfo = JSON.parse(v.r);
    if( v.cellInfo instanceof Error ) throw v.cellInfo;

    v.step = 2; // tableの枠組み作成
    v.gtcols = '2rem';
    v.cellInfo.width.forEach(w => v.gtcols += ' max-content'
      //' calc(_px + var(--gap)*2)'.replace('_',w)
    );

    v.gtrows = '1.5rem';
    v.dom = {
      attr:{class:'range2Table'},
      style:{'grid-template-columns': v.gtcols},
      children:[{attr:{class:'th'}}]
    };

    v.step = 3; // 列記号の追加
    for( v.c=0 ; v.c<v.cellInfo.width.length ; v.c++ ){
      v.dom.children.push({
        attr:{class:'th'},
        text:convertNotation(v.c+v.cellInfo.firstColumn),
      })
    }

    v.step = 4; // 行データの追加
    for( v.r=0 ; v.r<v.cellInfo.range.length ; v.r++ ){

      v.step = 4.1; // 行番号セルを追加
      v.dom.children.push({
        attr:{class:'th'},
        text:(v.cellInfo.firstRow + v.r),
      });

      for( v.c=0 ; v.c<v.cellInfo.range[v.r].length ; v.c++ ){
        v.d = v.cellInfo.range[v.r][v.c]; // セル属性のオブジェクト

        v.step = 4.2; // セルオブジェクトv.tdを作成、v.domに追加
        v.td = {attr:{class:'td'},style:{}};
        v.dom.children.push(v.td);

        v.step = 4.3; // データ型に基づき表示形式を整える
        switch( v.d.type ){
          case 'Date':
            v.step = 4.31;
            if( !v.d.hasOwnProperty('format') ){
              v.step = 4.311;
              // フォーマット指定が無い日付型は、分秒がゼロなら日付・そうでなければ日時として文字列化
              v.d.date = new Date(v.d.value);
              v.td.text = (v.d.date.getTime() / 3600000) === Math.ceil(v.d.date.getTime() / 3600000)
              ? toLocale(v.d.date,'yyyy/MM/dd') : v.d.date.toLocaleString();
            } else {
              v.step = 4.312;
              // 前後のいずれかに'/'がつく場合、月と見做してmをMに変換
              v.m = v.d.format.match(/\/m+/);
              if( v.m ) v.d.format = v.d.format.replace(v.m[0],'/'+('M'.repeat(v.m[0].length-1)));
              v.m = v.d.format.match(/m+\//);
              if( v.m ) v.d.format = v.d.format.replace(v.m[0],('M'.repeat(v.m[0].length-1)+'/'));
              v.td.text = toLocale(new Date(v.d.value),v.d.format);
            }
            break;
          case 'Number':
            v.step = 4.32;
            v.td.text = (v.d.value || 0).toLocaleString();
            break;
          case 'Boolean':
            v.step = 4.33;
            if( v.d.validation && v.d.validation.CriteriaType === 'CHECKBOX' ){
              v.td.text = v.d.value ? '☑️' : '◻︎';
            } else {
              v.td.text = String(v.d.value);
            }
            v.td.style['text-align'] = 'center';
            break;
          default:
            v.step = 4.34;
            v.td.text = v.d.value ? String(v.d.value) : '';
        }

        v.step = 4.4; // 既定値以外の場合、スタイルを適用
        if( v.d.fontSize && v.d.fontSize !== 10 )
          v.td.style['font-size'] = v.d.fontSize + 'pt';
        if( v.d.fontColor && v.d.fontColor !== '#000000' )
          v.td.style['color'] = v.d.fontColor;
        if( v.d.fontWeight && v.d.fontWeight !== 'normal' )
          v.td.style['font-weight'] = v.d.fontWeight;
        if( v.d.background && v.d.background !== '#ffffff' )
          v.td.style['background'] = v.d.background;
        if( v.d.horizontalAlign && v.d.horizontalAlign.match(/right/) )
          v.td.style['text-align'] = 'right';
        if( v.d.wrap && v.d.wrap !== 'OVERFLOW' ){ // 折り返し無し以外
          v.td.style['white-space'] = 'normal';
          v.td.style['overflow'] = v.d.wrap === 'WRAP' ? 'auto' : 'hidden';
        }

        v.step = 4.5; // リンクを設定
        if( v.d.hasOwnProperty('link') ){
          if( !v.td.hasOwnProperty('children') ) v.td.children = [];
          if( v.d.type === 'String' && v.d.link.length > 0 ){
            v.d.link.forEach(o => {
              if( o.url ){
                v.td.children.push({
                  tag: 'a',
                  attr: {href:o.url,target:'_blank'},
                  text: o.text
                })
              } else {
                v.td.children.push({
                  tag: 'span',
                  text: o.text
                })
              }
            });
          } else {
            v.td.children.push({
              tag:'a',
              attr:{href:v.d.link[0].url,target:'_blank'},
              text:v.td.text,
            });
          }
          delete v.td.text;
        }

        v.step = 4.6; // 数式・メモ・入力規則があればポップアップを用意
        if( v.d.validation || v.d.formula || v.d.note ){
          v.msg = '';
          if( v.d.note ) v.msg += 'メモ : ' + v.d.note;
          if( v.d.formula ) v.msg += (v.msg.length > 0 ? '\n' : '') + '数式 : ' + v.d.formula;
          if( v.d.validation ){
            v.msg += (v.msg.length > 0 ? '\n' : '') + '入力規則 : '
            + v.d.validation.CriteriaType;
            if( v.d.validation.CriteriaValues.length > 0){
              v.msg += ' ' + JSON.stringify(v.d.validation.CriteriaValues);
            }
          }
          v.msg = v.msg.replaceAll(/'/g,"\\'").replaceAll(/\n/g,'\\n');
          if( !v.td.attr ) v.td.attr = {};
          v.td.attr.onclick = "alert('" + v.msg + "')";
          v.td.attr.class = ( v.td.attr.class ? (v.td.attr.class + ' ') : '' ) + 'memo';
        }
      }
    }

    v.step = 5; /* シート名とシートへのリンク、注意書きを追加
      https://docs.google.com/spreadsheets/d/18bH3p9QaRg36L0rIhcWCmopRGewyQ7MYgTcNTsJ1gIY/edit#gid=31277711
      - spreadId:18bH3p9QaRg36L0rIhcWCmopRGewyQ7MYgTcNTsJ1gIY
      - spreadName:仕訳日記帳
      - sheetId:31277711
      - sheetName:勘定科目
    */
    v.step = 5.1; // リンク用URLの作成
    v.url = 'https://docs.google.com/spreadsheets/d/'
    + v.cellInfo.spreadId // {string} スプレッド(ファイル)のID
    + '/edit#gid=' + v.cellInfo.sheetId; // {number} シートのID

    v.step = 5.2; // スプレッドシート名の作成
    v.name = v.cellInfo.spreadName // {string} スプレッドの名前
    + ' - ' + v.cellInfo.sheetName; // {string} シート名

    v.step = 5.3; // html用/md用のテンプレート
    [v.html, v.md] = [
      '出典 : <a href="_url" target="_blank">_name</a>\n\n',
      '出典 : [_name](_url)\n\n'
    ];
    [ // 利用時にコピーされる注意書き
      '左が赤線のセルは、クリックで数式/メモ/入力規則を表示',
    ].forEach(x => {
      v.html += '<p>' + x + '</p>\n';
      v.md += '- ' + x + '\n';
    });

    v.step = 5.4; // シート名と注意書きをセット
    v.rv = (v.html + '\n' + v.md + '\n').replaceAll(/_url/g,v.url).replaceAll(/_name/g,v.name);

    v.step = 5.5; // テーブルの出力
    v.rv += '<style>' + v.style01.replaceAll(/\n/g,' ').replaceAll(/ +/g,' ') + '</style>\n'
    + '<style>' + v.style02.replaceAll(/\n/g,' ').replaceAll(/ +/g,' ') + '</style>\n'
    + createElement({children:[v.dom]}).innerHTML;

    v.step = 6; // 終了処理
    //document.querySelector('textarea').value = v.rv;
    navigator.clipboard.writeText(v.rv);
    changeScreen('result');
    console.log(v.whois+' normal end.\n',v.rv);

  } catch(e) {
    console.error('%s abnormal end (step.%s)\n%s',v.whois,v.step,e.message);
    console.error(v);
    return e;
  }
}
