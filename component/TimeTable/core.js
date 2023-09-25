/**
 * @classdesc タイムテーブルの表示
 */
class TimeTable {

  /** Resource: 必要資材型定義
   * @typedef Resource
   * @prop {string} name - 資材名
   * @prop {number} [quantity] - 数量
   * @prop {string} [unit] - 単位
   * @prop {string} [procure] - 調達方法
   * @prop {number} [budget] - 予算
   * @prop {string} [note] - 備考
   */

  /** Task: 作業項目型定義
   * 開始・終了時刻はbaseの日付。翌日以降にまたがる場合、+24n時間する
   * @typedef Task
   * @prop {string} st - 開始時刻。constructorでTimeLineに変換
   * @prop {string} ed - 終了時刻。constructorでTimeLineに変換
   * @prop {string} label - タスク名称
   * @prop {string} [summary=''] - 作業概要
   * @prop {number} mode - 表示モード。options.valueとの論理積>0のタスクのみ表示
   * @prop {string} [PIC=''] - 担当者名
   * @prop {string} [location=''] - 場所
   * @prop {string} [note] - 備考。htmlで記述
   * @prop {string[]} [pending=[]] - 懸念点、残課題事項
   * @prop {Resource[]} [resources=[]] - 必要な物
   * 以下はconstructor内で追加される導出項目
   * @prop {number} id - 0からの連番(this.tasksの添字)
   */

  /** ドロップダウンオプション(作業班)
   * @typedef DropDownOpt
   * @prop {string} label - ラベル
   * @prop {number} value - 表示制御フラグ
   */

  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'TimeTable.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        base: '', // {string} - 基準日。yyyy/MM/dd形式
        baseObj: null, // {Date} - 基準日の日付オブジェクト
        baseArr: [], // {number[]} - 基準日の[y,M,d]
        span: 10 * 60 * 1000, // 時刻目盛の最小単位。既定値は10分(ミリ秒表記)
        options: [],  // ドロップダウンの選択肢(select内のoption)
        tasks: [], // {Task[]} - 開始・終了時刻順に並べたタスク配列

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TimeTable共通部分 */ `
          .TimeTable[name="wrapper"] {
            display: none;
            z-index: 0;
            --taskHeight: 1.8rem;
          }
          .TimeTable[name="wrapper"].act {
            display: block;
          }
          .TimeTable .red {
            color: red;
          }`,
          /* テーブル領域 */`
          .TimeTable .table {
            margin: 1rem 0px;
            display: grid;
            grid-template-columns: repeat(var(--colNum), 0.5rem) 1fr;
            grid-template-rows: 1rem 3rem repeat(var(--rowNum), var(--taskHeight));
          }
          .TimeTable .table .date {
            grid-row: 1 / 2;
            white-space: nowrap;
            padding-left: 0.3rem;
          }
          .TimeTable .table .time {
            grid-row: 2 / 3;
            font-size: 0.8rem;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            transform-origin: center;
            z-index: 1;
          }
          .TimeTable .table .task {
            margin: 1.2rem 0rem 0.3rem 0rem;
            box-sizing: border-box;
            border: solid 1px #666;
            background-color: #ccc;
            z-index: 1;
          }
          .TimeTable .table .label {
            white-space: nowrap;
            vertical-align: middle;
            z-index: 2;
          }
          .TimeTable .table .zone {
            grid-row: 3 / calc(var(--rowNum) + 3);
            background: #eee;
          }`,
          /* 詳細情報 */`
          .TimeTable .detail {
            display: grid;
            gap: 0.2rem;
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
          }
          .TimeTable .detail button {
            grid-column: 1 / 3;
            margin: 1rem 2rem 0rem 2rem;
            font-size: 1.4rem;
            padding: 0.5rem auto;
          }`,
        ],
        html:[
          {attr:{class:'control'},children:[{tag:'select'}]},
          {attr:{class:'table'}},
          {attr:{class:'detail'}},
        ],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、フレーム部分のHTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // DOMをメンバとして登録
      this.table = this.wrapper.querySelector('.table');
      this.select = this.wrapper.querySelector('.control select');
      this.detail = this.wrapper.querySelector('.detail');

      v.step = 3; // プルダウンを設定
      this.options.forEach(x => {
        this.select.appendChild(createElement(
          {tag:'option',attr:{value:x.value},text:x.label},
        ))
      });

      v.step = 4; // base文字列からbaseObj, baseArrを作成
      this.baseObj = new Date(this.base);
      if( isNaN(this.baseObj.getTime()) )
        throw new Error('"'+this.base+'" is invalid datetime.');
      this.baseArr = [
        this.baseObj.getFullYear(),
        this.baseObj.getMonth(),
        this.baseObj.getDate()
      ];

      v.step = 5; // タスクの初期値を設定
      for( v.i=0 ; v.i<this.tasks.length ; v.i++ ){
        this.tasks[v.i].st = this.objectizeTime(this.tasks[v.i].st);
        if( this.tasks[v.i].st instanceof Error )
          throw new Error('"' + JSON.stringify(this.tasks[v.i]) + '" is invalid start time.');
        this.tasks[v.i].ed = this.objectizeTime(this.tasks[v.i].ed);
        if( this.tasks[v.i].ed instanceof Error )
          throw new Error('"' + JSON.stringify(this.tasks[v.i]) + '" is invalid end time.');
        this.tasks[v.i].summary = this.tasks[v.i].summary || '';
        this.tasks[v.i].PIC = this.tasks[v.i].PIC || '';
        this.tasks[v.i].location = this.tasks[v.i].location || '';
        this.tasks[v.i].pending = this.tasks[v.i].pending || [];
        this.tasks[v.i].resources = this.tasks[v.i].resources || [];
        this.tasks[v.i].note = this.tasks[v.i].note || '';
      }

      v.step = 6; // 開始時刻・終了時刻順にソート
      this.tasks = this.tasks.sort(
        (a,b) => a.st.unix === b.st.unix
        ? (a.ed.unix <= b.ed.unix ? -1 : 1)
        : (a.st.unix < b.st.unix ? -1 : 1)
      );

      for( v.i=0 ; v.i<this.tasks.length ; v.i++ ){
        this.tasks[v.i].id = v.i; // idは連番で採番
      }

      v.step = 7; // イベント定義、初期画面表示
      this.select.addEventListener('change',this.drawGantt);
      v.rv = this.drawGantt();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 8; // 終了処理
      console.log(v.whois+' normal end.',this);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** TimeLine: タイムラインオブジェクト型定義
   * @typedef TimeLine - タイムラインオブジェクト
   * @prop {Date} obj - 日時オブジェクト
   * @prop {number} unix - 日時オブジェクトのUNIX時刻
   * @prop {string} dateStr - 表示用日付文字列。M/dd(日〜土)形式
   * @prop {string} timeStr - 表示用時刻文字列。hh:mm形式
   */

  /** 時刻文字列をオブジェクトに変換
   * @param {string} arg - 時刻文字列
   * @returns {TimeLine|Error}
   */
  objectizeTime = (arg) => {
    const v = {whois:'TimeTable.objectizeTime',step:0,rv:{}};
    console.log(v.whois+' start.',arg);
    try {

      v.step = 1; // 引数をDate型に変換
      v.m = arg.match(/^([0-9]+):([0-9]+)$/);
      if( v.m === null )
        throw new Error('"'+arg+'" is invalid time string.');

      v.step = 2;
      v.d = new Date(...this.baseArr,v.m[1],v.m[2]);
      if( isNaN(v.d.getTime()) )
        throw new Error('"'+arg+'" is invalid time string.');

      v.step = 3; // 戻り値の作成
      v.rv = {
        obj: v.d,
        unix: v.d.getTime(),
        dateStr: //v.d.getFullYear()
          //+ '/' + ('0'+(v.d.getMonth()+1)).slice(-2)
          (v.d.getMonth() + 1)
          + '/' + ('0'+v.d.getDate()).slice(-2)
          + '(' + ['日','月','火','水','木','金','土'][v.d.getDay()] + ')',
        timeStr: ('0'+v.d.getHours()).slice(-2)
          + ':' + ('0'+v.d.getMinutes()).slice(-2),
      };

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** ガントチャートを描画
   * @param {void}
   * @returns {null|Error}
   */
  drawGantt = () => {
    const v = {whois:'TimeTable.drawGantt',step:0,rv:null,
      tasks:[],t:{raw:[],list:[],map:{}}};
      /* v.t : タイムライン関係
        {TimeLine[]} raw - 出力対象タスクの開始・終了時刻。重複あり、順序不問
        {TimeLine[]} list - rawの重複を削除、時刻順にソート
        {Object.<string, number>} map - UNIX時刻から何番目の時刻か(listの添字)を引用 */
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 前処理
      v.step = 1.1; // 表示領域のクリア
      this.table.innerHTML = '';
      this.detail.innerHTML = '';
      v.step = 1.2; // 表示モードをプルダウンから取得
      v.flag = Number(this.select.selectedOptions[0].value);
      //console.log('v.flag=%s',v.flag);

      v.step = 2; // 表示対象となるタスクを抽出
      this.tasks.forEach(x => {
        if( (v.flag & x.mode) > 0 ){
          v.t.raw.push(x.st);
          v.t.raw.push(x.ed);
          v.tasks.push(x);
        }
      });

      v.step = 3; // タイムライン関係情報を整理
      v.step = 3.1; // v.t.rawを時刻順にソート
      v.t.raw = v.t.raw.sort((a,b) => a.unix < b.unix ? -1 : 1);
      v.step = 3.2; // 時刻の重複を削除
      v.lastUnix = 0;
      v.listIndex = 0;
      for( v.i=0 ; v.i<v.t.raw.length ; v.i++ ){
        if( v.lastUnix < v.t.raw[v.i].unix ){
          v.lastUnix = v.t.raw[v.i].unix;
          v.t.list[v.listIndex] = v.t.raw[v.i];
          v.t.map[v.t.raw[v.i].unix] = v.listIndex;
          v.listIndex++;
        }
      }
      //console.log(v.t);
      v.step = 3.3; // テーブル領域の列数をセット
      document.documentElement.style.setProperty('--rowNum',v.tasks.length);
      document.documentElement.style.setProperty('--colNum',v.t.list.length*2);

      v.step = 4; // 時刻(タイムライン)と補助線を表示
      v.currentDate = '';
      for( v.i=0 ; v.i<v.t.list.length ; v.i++ ){
        v.step = 4.1; // 日付の表示
        if( v.currentDate !== v.t.list[v.i].dateStr ){
          v.currentDate = v.t.list[v.i].dateStr;
          this.table.appendChild(createElement(
            {attr:{class:'date'},text:v.currentDate,
              style:{'grid-column':(v.i*2+1)+' / '+(v.i*2+2)}}
          ));
        }
        v.step = 4.2; // 時刻の表示
        this.table.appendChild(createElement(
          {attr:{class:'time'},text:v.t.list[v.i].timeStr,
            style:{'grid-column':(v.i*2+1)+' / '+(v.i*2+3)}}
        ));
        v.step = 4.3; // 帯の表示
        if( v.i %2 === 0 ){
          this.table.appendChild(createElement(
            {attr:{class:'zone'},
              style:{'grid-column':(v.i*2+2)+' / '+(v.i*2+(v.i===(v.t.list.length-1)?3:4))}}
          ));
        }
      }

      v.step = 5; // タスクを表示
      for( v.i=0 ; v.i<v.tasks.length ; v.i++ ){
        v.step = 5.1;
        v.st = v.t.map[v.tasks[v.i].st.unix] * 2 + 2;
        v.ed = v.t.map[v.tasks[v.i].ed.unix] * 2 + 2;
        v.step = 5.2; // バーチャート
        this.table.appendChild(createElement({
          attr:{class:'task'},
          style:{'grid-column': v.st + ' / ' + v.ed,
            'grid-row': (v.i + 3) + ' / ' + (v.i + 4)}
        }));
        v.step = 5.3; // ラベル
        this.table.appendChild(createElement({
          attr:{
            class:'label' + (v.tasks[v.i].pending.length === 0 ? '' : ' red'),
            name:v.tasks[v.i].id},
          text: v.tasks[v.i].label,
          event:{'click':this.showDetail},
          style:{'grid-column': v.st + ' / ' + v.ed,
            'grid-row': (v.i + 3) + ' / ' + (v.i + 4)}
        }));
      }

      v.step = 6; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** クリックされたタスクの詳細を表示する
   * @param {PointerEvent} event
   * @returns {null|Error}
   */
  showDetail = (event) => {
    const v = {whois:'TimeTable.showDetail',step:0,rv:null,note:[],pending:[],
      add:(h,d) => {
        this.detail.appendChild(createElement({attr:{class:'th'},text:h}));
        this.detail.appendChild(createElement({attr:{class:'td'},html:d}));
      },
    };
    console.log(v.whois+' start.',event);
    try {

      v.step = 1; // 前処理
      this.detail.innerHTML = '';
      v.id = Number(event.target.getAttribute('name'));
      v.dObj = this.tasks[v.id];  // 対象タスクをv.dObjに保存
      //console.log(v.id,v.dObj)

      v.step = 2.1; // 開始・終了時刻
      v.add('時間',v.dObj.st.dateStr + ' ' + v.dObj.st.timeStr
      + ' 〜 ' + v.dObj.ed.dateStr + ' ' + v.dObj.ed.timeStr)
      v.step = 2.2; // タスク名称
      v.add('項目名',v.dObj.label);
      v.step = 2.3; // 作業概要
      if( v.dObj.summary.length > 0 )
        v.add('概要',v.dObj.summary);
      v.step = 2.4; // 担当者名
      if( v.dObj.PIC.length > 0 )
        v.add('担当',v.dObj.PIC);
      v.step = 2.5; // 場所
      if( v.dObj.location.length > 0 )
        v.add('場所',v.dObj.location);
      v.step = 2.6; // 必要資機材
      if( v.dObj.resources.length > 0 ){
        v.str = '<ol>';
        v.dObj.resources.forEach(x => v.str + '<li>' + x + '</li>');
        v.str += '</ol>';
        v.add('資機材',v.str);
      }
      v.step = 2.7; // 残課題
      if( v.dObj.pending.length > 0 ){
        v.str = '<ol>';
        v.dObj.pending.forEach(x => v.str + '<li>' + x + '</li>');
        v.str += '</ol>';
        v.add('資機材',v.str);
      }
      v.step = 2.8; // 備考
      if( v.dObj.note.length > 0 )
        v.add('備考',v.dObj.note);

      v.step = 2.9; // 「閉じる」ボタン
      this.detail.appendChild(createElement(
        {tag:'button',text:'閉じる',event:{'click':
          () => {this.detail.innerHTML = ''}}}
      ));

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
}