/** range2html: 選択範囲をHTML化
 * @param arg {Object}
 * @param arg.guide {boolean}=false - 行列記号を付ける場合はtrue
 * @returns {Object}
 */
range2html(arg){
  const v = {whois:this.constructor.name+'.range2html',step:0,rv:null,className:'x'+Utilities.getUuid()};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 1.1; // 引数の既定値設定
    v.arg = Object.assign({guide:false},arg);

    v.step = 1.2; // 現在のシート・選択範囲をメンバに保存
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    console.log(this.sheet.getName())
    this.range = this.sheet.getActiveRange();
    v.A1Notation = this.range.getA1Notation();

    v.step = 1.3; // 選択範囲をv.top/left/right/bottomに【添字ベース】で保存
    v.m = v.A1Notation.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
    v.top = Number(v.m[2]) - 1;
    v.left = convertNotation(v.m[1]) - 1;
    v.right = v.m[3] === '' ? v.left : (convertNotation(v.m[3]) - 1);
    v.bottom = v.m[4] === '' ? v.top : (Number(v.m[4]) - 1);
    v.colnum = v.right - v.left + 1;
    v.rownum = v.bottom - v.top + 1;

    v.step = 1.4; // シートから情報取得
    v.sheet = this.getSheet(this.sheet.getName());

    v.step = 2; // v.element: セル毎の情報オブジェクトを作成
    // - tag {string} : htmlのタグ。ex.'td'
    // - attr {Object.<string,string>} 属性。ex.{'colspan':2}
    // - style {Object.<string,string>} セル特有のCSS。ex.{'font-color':'#ff0000'}
    // - text {string} セルに表示する文字列
    // - children {v.element[]} 子要素の情報オブジェクト
    v.step = 2.1; // v.elementを空(null)の配列として作成
    v.element = Array.from({length:v.rownum},()=>Array.from({length:v.colnum},()=>null));

    v.step = 2.2; // 属性毎にチェック
    for( v.prop in this.sheetProperties ){
      if( this.sheetProperties[v.prop].hasOwnProperty('css') ){
        // CSSの定義が無いシートの属性はスキップ ex.Name, SheetId
        if( Array.isArray(v.sheet[v.prop][0]) ){

          v.step = 2.3; // Backgroundのように、データが二次元の場合は行×列で処理
          for( v.r=0 ; v.r<v.rownum ; v.r++ ){
            for( v.c=0 ; v.c<v.colnum ; v.c++ ){
              if( v.sheet[v.prop][v.r+v.top][v.c+v.left] ){
                // シートの定義値優先で、既存の定義オブジェクトをマージ
                v.element[v.r][v.c] = mergeDeeply(
                  this.sheetProperties[v.prop].css(v.sheet[v.prop][v.r+v.top][v.c+v.left]),
                  v.element[v.r][v.c]
                );
              }
            }
          }

        } else {

          v.step = 2.4; // ColumnWidthのように、データが一次元の場合は1行目のみ設定
          for( v.c=0 ; v.c<v.colnum ; v.c++ ){
            if( v.sheet[v.prop][v.c+v.left] ){
              v.element[0][v.c] = mergeDeeply(
                this.sheetProperties[v.prop].css(v.sheet[v.prop][v.c+v.left]),
                v.element[0][v.c]
              );
            }
          }
        }
      }
    }

    v.step = 2.5; // attrの初期値を設定
    for( v.r=0 ; v.r<v.element.length ; v.r++ ){
      for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
        if( !v.element[v.r][v.c] ) continue;
        // セル幅を指定するクラスを設定。この段階では添字(数値)を設定、クラス文字列にはv.tdで変換
        console.log(`l.837 v.element[${v.r}][${v.c}]=${JSON.stringify(v.element[v.r][v.c])}`)
        if( !v.element[v.r][v.c].hasOwnProperty('attr') ) v.element[v.r][v.c].attr = {};
        v.element[v.r][v.c].attr = mergeDeeply({class:v.c},v.element[v.r][v.c].attr);

        // title属性はメモ＋数式なので配列として保存されている。これを文字列に変換
        if( v.element[v.r][v.c] && v.element[v.r][v.c].attr.hasOwnProperty('title'))
          v.element[v.r][v.c].attr.title = v.element[v.r][v.c].attr.title.join('\n');
      }
    }

    v.step = 2.6; // 結合セル対応
    v.sheet.MergedRanges.forEach(x => { // x:結合セル範囲のA1記法文字列

      v.step = 2.61; // 範囲を数値化
      // v.mrXXX : アクティブな範囲の右上隅を(0,0)とするアドレス
      v.m = x.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
      v.mrTop = Number(v.m[2]) - (v.top + 1);
      v.mrLeft = convertNotation(v.m[1]) - (v.left + 1);
      v.mrRight = v.m[3] === '' ? v.mrLeft : (convertNotation(v.m[3]) - (v.left+1));
      v.mrBottom = v.m[4] === '' ? v.mrTop : Number(v.m[4]) - (v.top + 1);

      v.step = 2.62; // 範囲の先頭行左端セルは残す
      v.element[v.mrTop].splice(v.mrLeft+1,(v.mrRight-v.mrLeft));
      for( v.r=v.mrTop+1 ; v.r<=v.mrBottom ; v.r++ )
        v.element[v.r].splice(v.mrLeft,(v.mrRight-v.mrLeft+1));

      v.step = 2.63; // colspan, rowspanの設定
      if( v.mrLeft < v.mrRight )
        v.element[v.mrTop][v.mrLeft].attr.colspan = v.mrRight - v.mrLeft + 1;
      if( v.mrTop < v.mrBottom )
        v.element[v.mrTop][v.mrLeft].attr.rowspan = v.mrBottom - v.mrTop + 1;
    });

    v.step = 3.1; // スタイルシートの作成
    v.html = [
      '<style type="text/css">',
      `.${v.className} `+'th,td {',
      '  position: relative;',
      '  height: 20px;',
      '  background: #ffffff;',
      '  font-size: 10pt;',
      '  border-right: solid 1px #e1e1e1;',
      '  border-bottom: solid 1px #e1e1e1;',
      '  word-break: break-all;',
      '}',
      `.${v.className} `+'th {',
      '  font-family: sans-serif;',
      '  text-align: center;',
      '  vertical-align: middle;',
      '  font-weight: 900;',
      '  background: #dddddd;',
      '  border-top: solid 1px #e1e1e1;',
      '  border-left: solid 1px #e1e1e1;',
      '  width: 50px;',
      '}',
      `.${v.className} `+'td {',
      '  width: 100px;',
      '  font-family: arial,sans,sans-serif;',
      '  vertical-align: bottom;',
      '  overflow: hidden; /* 折り返しは隠す */',
      '}',
      `.${v.className} `+'.noteIcon {',
      '  position: absolute; top:0; right: 0;',
      '  width: 0px;',
      '  height: 0px;',
      '  border-top: 4px solid black;',
      '  border-right: 4px solid black;',
      '  border-bottom: 4px solid transparent;',
      '  border-left: 4px solid transparent;',
      '}',
    ];

    v.step = 3.2; // ColumnWidth
    for( v.i=v.left ; v.i<=v.right ; v.i++ ){
      v.width = (v.sheet.ColumnWidth[v.i] || this.sheetProperties.ColumnWidth.default) + 'px';
      v.html.push(`.${v.className} td:nth-Child(${v.i-v.left+1}),`
      + ` .${v.className} td.col${v.i-v.left+1} {width: ${v.width};}`);
    }
    v.html.push('</style>');

    v.step = 4; // body部分の作成
    v.step = 4.1; // セル単位のtd要素(ソース)生成関数を定義
    v.td = o => { 
      if( o === null ) return '<td></td>';
      let rv = '<td';
      if( o.hasOwnProperty('attr') ){
        if( o.attr.hasOwnProperty('title') ){
          // メモの存在を示す右上隅の黒い三角マークを追加
          o.text = '<div class="noteIcon"></div>' + (o.text||'');
        }

        // 結合セルの影響で列がズレたセルはセル幅指定用のクラスを設定
        if( o.attr.hasOwnProperty('colspan') || o.attr.hasOwnProperty('rowspan') || o.attr.class === v.c ){
          delete o.attr.class;
        } else {
          o.attr.class = `col${o.attr.class+1}`;
        }

        // tdの属性を指定
        for( let p in o.attr ) rv += ` ${p}="${o.attr[p]}"`;
      }
      if( o.hasOwnProperty('style') ){
        rv += ' style="';
        for( let p in o.style ) rv += `${p}:${o.style[p]};`
        rv += '"';
      }
      rv += `>${o.text||''}</td>`;
      return rv;
    };

    v.step = 4.2; // tableタグ内のソース作成
    v.html.push(`<table class="${v.className}"><tr>`);
    if( v.arg.guide === true ){ // 列記号の追加
      v.html.push('  <th></th>');
      for( v.c=v.left ; v.c<=v.right ; v.c++ )
        v.html.push(`  <th>${convertNotation(v.c+1)}</th>`)
      v.html.push('</tr><tr>');
    }
    for( v.r=0 ; v.r<v.element.length ; v.r++ ){
      if( v.arg.guide === true ) v.html.push(`<th>${v.top+v.r+1}</th>`) // 行番号の追加
      for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
        v.html.push('  '+v.td(v.element[v.r][v.c]))
      }
      v.html.push('</tr><tr>');
    }
    v.html.push('</tr></table>');
    v.rv = v.html.join('\n');

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;


  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
