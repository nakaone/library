/**
 * @classdesc 参加者情報の表示・編集
 */
class TimeTable {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'TimeTable.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        span: 10 * 60 * 1000, // 時刻目盛の最小単位。既定値は10分(ミリ秒表記)
        options: [],  // スタッフグループ単位

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TimeTable共通部分 */`
          .TimeTable.act[name="wrapper"] {
            display: block;
            width: 100%;
            z-index: 0;
          }
          .TimeTable {
            display: none;
            --lineWidth: 4px;
          }
          .TimeTable .red {
            color: #f00;
          }
          .TimeTable .table {
            display: grid;
            grid-template-columns: 4rem repeat(20, calc(var(--lineWidth) * 3)) repeat(77, 1fr)
          }
          .TimeTable .time {
            grid-column: 1 / 2;
            margin: auto 0.5rem auto auto;
            padding: 0.3rem 0;
            font-size: 0.8rem;
          }
          .TimeTable .label {
            border-left: solid 4px #666;
            margin: var(--lineWidth) 0px;
            padding-left: 2px;
            z-index: 2;
          }
          .TimeTable .line:nth-child(2n) {
            grid-column: 2 / 99;
            background-color: #eee;
            z-index: 1;
          }
          .TimeTable .detail > div {
            display: grid;
            grid-template-columns: 5rem 1fr;
          }
          .TimeTable .detail .th {
            grid-column: 1 / 2;
          }
          .TimeTable .detail .td {
            grid-column: 2 / 3;
          }
          .TimeTable .detail button {
            grid-column: 1 / 3;
            margin-top: 1rem;
            font-size: 1.4rem;
            padding: 0.5rem auto;
          }`,
          /* 印刷用
          .TimeTable .line {
            grid-column: 2 / 99;
            border-top: dashed 1px #aaa;
            z-index: 1;
          }
          */
        ],
        html:[
          {attr:{class:'control'},children:[
            {tag:'select'}
          ]},
          {attr:{class:'table'}},
          {attr:{class:'detail'}},
        ],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;
      
      v.step = 2; // DOMをメンバとして登録
      this.table = this.wrapper.querySelector('.table');
      this.select = this.wrapper.querySelector('.control select');
      this.detail = this.wrapper.querySelector('.detail');

      // 98個の列に分けられたtable領域の各列の左端位置をthis.mapに格納
      this.map = [];
      for( v.i=1 ; v.i<98 ; v.i++ ){
        v.test = createElement({style:{'grid-column':(v.i + ' / ' + (v.i+1))}});
        this.table.appendChild(v.test);
        this.map.push(v.test.offsetLeft);
        v.test.remove();
      }
      //console.log('this.map=%s',JSON.stringify(this.map));

      v.step = 3; // プルダウンを設定
      this.options.forEach(x => {
        this.select.appendChild(createElement(
          {tag:'option',attr:{value:x.value},text:x.label},
        ))
      });

      v.step = 4; // 起算オブジェクト(this.base)の計算
      // this.base.date: {number[]} - 起算点年月日を[y, M, d]形式にした配列
      v.base = this.base;
      this.base = {date:v.base.match(/\d{4}\/\d{2}\/\d{2}/)[0].split('/')};
      this.base.date[1] -= 1;  // 月は0オリジンなので修正
      // this.base.time: {number} - (時刻を含む)起算点のUNIX時刻
      this.base.time = new Date(
        ...this.base.date,
        ...v.base.match(/\d{2}:\d{2}/)[0].split(':')
      ).getTime();
      //console.log('this.base=%s',JSON.stringify(this.base));

      v.step = 5; // 開始時刻・終了時刻順にソート
      this.list = this.list.sort((a,b) => a.st === b.st
        ? (a.ed <= b.ed ? -1 : 1) : (a.st < b.st ? -1 : 1));
      for( v.i=0 ; v.i<this.list.length ; v.i++ ){
        this.list[v.i].id = v.i; // IDを採番
        // 詳細表示項目が未定義なら追加
        if( !this.list[v.i].hasOwnProperty('PIC') )
          this.list[v.i].PIC = '';
        if( !this.list[v.i].hasOwnProperty('note') )
          this.list[v.i].note = [];
        if( !this.list[v.i].hasOwnProperty('remain') )
          this.list[v.i].remain = [];
        // 開始・終了時刻を文字列からオブジェクトに変換
        this.list[v.i].st = this.calc(this.list[v.i].st);
        this.list[v.i].ed = this.calc(this.list[v.i].ed);
      }

      v.step = 6; // イベント定義
      this.select.addEventListener('change',this.drawTable);

      v.step = 7; // 終了処理
      this.drawTable(); // 初期画面表示
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 時刻tmのgrid-rowとラベルを返す
   * @param {string} tm - 換算対象時刻文字列(hh:mm形式)
   * @returns {null|Error}
   */
  calc = (tm) => {
    //console.log('tm=%s',JSON.stringify(tm));
    const dObj = new Date(...this.base.date, ...tm.split(':'));
    return {
      row: (dObj.getTime() - this.base.time) / this.span,
      label: ('0'+dObj.getHours()).slice(-2)
        + ':' + ('0'+dObj.getMinutes()).slice(-2)
    };
  }

  drawTable = () => {
    const v = {whois:'TimeTable.drawTable',step:0,rv:null,
      list:[],line:[],timeline:[]};
    console.log(v.whois+' start.',this.list);
    try {

      v.step = 1; // 前処理
      this.table.innerHTML = '';

      v.step = 2; // 表示対象フラグを取得
      v.flag = Number(this.wrapper.querySelector('select').selectedOptions[0].value);
      //console.log('v.flag=%s',v.flag);

      v.step = 3; // 表示対象となるタスクを抽出
      this.list.forEach(x => {
        if( (v.flag & x.tag) > 0 ){
          v.timeline.push(x.st);
          v.timeline.push(x.ed);
          /*
          x.st = this.calc(x.st); v.timeline.push(x.st);
          x.ed = this.calc(x.ed); v.timeline.push(x.ed);
          */
          v.list.push(x);
        }
      });
      //console.log('v.list=%s',JSON.stringify(v.list));

      v.step = 4; // タイムラインと補助線を表示
      v.step = 4.1; // v.timelineを時刻順にソート
      v.timeline = v.timeline.sort((a,b) => a.row < b.row ? -1 : 1);

      v.step = 4.2; // 最初の時刻表示
      this.table.appendChild(createElement({
        attr:{class:'time'},
        text:v.timeline[0].label,
        style:{'grid-row': (v.timeline[0].row * 2 + 1) + ' / ' + (v.timeline[0].row * 2 + 3)},
      }));

      v.step = 4.3; // 2番目以降の時刻表示
      for( v.i=1 ; v.i<v.timeline.length ; v.i++ ){
        if( v.timeline[v.i-1].row === v.timeline[v.i].row ) continue;
        // 開始・終了時刻を表示
        this.table.appendChild(createElement({
          attr:{class:'time'},
          text:v.timeline[v.i].label,
          style:{'grid-row': (v.timeline[v.i].row * 2 + 1) + ' / ' + (v.timeline[v.i].row * 2 + 3)},
        }));
        // 補助線を表示
        this.table.appendChild(createElement({
          attr:{class:'line'},
          style:{'grid-row':v.timeline[v.i-1].row+' / '+v.timeline[v.i].row},
        }));
      }

      v.step = 5; // タスクを表示
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){

        v.step = 5.1; /* 表示レベルを計算
          開始〜終了時刻の重複なし => v.level = 0
          開始〜終了時刻の重複あり
            開始時刻の重複あり(=ラベルの重複あり)
              => 直近の重複イベントのラベルからgrid-columnを計算
                 v.level = 直近の重複イベントのv.level + 1
            開始時刻の重複なし(=ラベルの重複なし)
              => 重複イベント開始時刻の配列を作成、重複を排除
                 v.level = 配列の長さ
          ※重複イベント内で同一開始時刻があった場合の無用な
           レベル下げ(インデント)を排除するため、開始時刻の重複排除を行う
        */

        v.dup = []; // 表示対象イベントと開催時間が重なる先行開始イベントの配列
        v.dupStart = false; // 開始時刻が同一のイベントがあればtrue
        for( v.j=0 ; v.j<v.i ; v.j++ ){
          if( v.list[v.j].ed.row > v.list[v.i].st.row ){
            // 先行イベント終了時刻>表示対象イベント開始時刻の場合、重複イベントと看做す
            // なおconstructorで開始時刻順にソート済のため、
            // 先行イベント開始時刻<対象イベント終了時刻は考慮不要
            v.dup.unshift(v.list[v.j]);
            // 開始時刻が同一のイベントがあればtrueをセット
            if( v.list[v.j].st.row === v.list[v.i].st.row ){
              v.dupStart = true;
            }
          }
        }
        //console.log('v.dup=%s',JSON.stringify(v.dup));

        v.step = 5.2; // 重複および同一開始時刻の有無からlevelを計算
        v.gridColumn = null;
        if( v.dup.length === 0 ){
          // 開始〜終了時刻の重複なし => v.level = 0
          v.list[v.i].level = 0;
        } else {
          // 開始〜終了時刻の重複あり
          if( v.dupStart ){
            // 開始時刻の重複あり(=ラベルの重複あり)
            // => 直近の重複イベントのラベルからgrid-columnを計算
            //    v.level = 直近の重複イベントのv.level + 1

            // 直近の開始時刻重複イベントを特定、v.nearestに格納
            for( v.j=0 ; v.j<v.dup.length ; v.j++ ){
              if( v.dup[v.j].st.row === v.list[v.i].st.row ){
                v.nearest = v.dup[v.j];
                v.j = v.dup.length;
              }
            }
            v.list[v.i].level = v.nearest.level + 1;

            // 開始時刻重複イベントのoffsetRightを取得
            v.span = this.table.querySelector('.label[name="'+v.nearest.id+'"] span');
            v.offsetRight = v.span.offsetLeft + v.span.offsetWidth;
            // this.mapからoffsetRight以上の最小値を持つ要素の添字を取得、
            // v.gridColumnを設定
            for( v.j=0 ; v.j<this.map.length ; v.j++ ){
              if( this.map[v.j] > v.offsetRight ){
                v.gridColumn = (v.j+1) + ' / 99';
                //console.log('v.j=%s, v.gridColumn=%s, this.map[v.j]=%s',v.j,v.gridColumn,this.map[v.j]);
                v.j = this.map.length;
              }
            }
          } else {
            // 開始時刻の重複なし(=ラベルの重複なし)
            // => 重複イベント開始時刻の配列を作成、重複を排除
            //    v.level = 配列の長さ
            v.stMap = v.dup.map(x => x.st.row);
            v.stMap = [...new Set(v.stMap)];
            v.list[v.i].level = v.stMap.length;
          }
        }
        //console.log('level=%s',v.list[v.i].level);

        v.step = 5.3; // levelからgrid-columnを計算
        if( v.gridColumn === null ){
          v.gridColumn = (v.list[v.i].level + 2) + ' / 99';
        }

        v.step = 5.4; // this.tableにラベル要素を追加
        v.label = createElement({
          attr:{class:'label',name:v.list[v.i].id},
          event:{'click':this.showDetail},
          style:{
            'grid-column': v.gridColumn,
            'grid-row': (v.list[v.i].st.row * 2 + 2) + ' / ' + (v.list[v.i].ed.row * 2 + 2),
            'z-index': v.list[v.i].level
          },
          children:[{tag:'span',text:v.list[v.i].label}]
        });
        // 残課題があれば赤字で表示
        if( v.list[v.i].remain.length > 0 ){
          v.label.classList.add('red');
        }
        this.table.appendChild(v.label);

      }


      v.step = 6;
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  showDetail = (event) => {
    const v = {whois:'TimeTable.showDetail',step:0,rv:null,note:[],remain:[]};
    console.log(v.whois+' start.',event);
    try {

      this.detail.innerHTML = '';
      v.id = Number(event.target.parentNode.getAttribute('name'));
      v.dObj = this.list[v.id];

      v.dObj.note.forEach(x => v.note.push({tag:'li',html:x}));
      v.dObj.remain.forEach(x => v.remain.push({tag:'li',html:x}));
      this.detail.appendChild(createElement({children:[
        {attr:{class:'th'},text:'項目名'},
        {attr:{class:'td'},text:v.dObj.label},
        {attr:{class:'th'},text:'担当'},
        {attr:{class:'td'},text:(v.dObj.PIC || '(未定)')},
        {attr:{class:'th'},text:'備考'},
        {attr:{class:'td'},children:[{tag:'ol',children:v.note}]},
        {attr:{class:'th'},text:'課題'},
        {attr:{class:'td'},children:[{tag:'ol',children:v.remain}]},
        {tag:'button',text:'閉じる',event:{'click':
          () => {this.detail.innerHTML = ''}
        }}
      ]}));

      //console.log(this.list[v.id]);

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
}