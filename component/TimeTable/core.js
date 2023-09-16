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
  constructor(parent,data,opt={}){
    const v = {whois:'TimeTable.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        data: data,
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
          }
          .TimeTable {
            display: none;
          }
          .TimeTable .table {
            display: grid;
            grid-template-columns: 4rem repeat(20, 0.5rem) repeat(77, 1fr)
          }
          .TimeTable .st, .TimeTable .ed {
            grid-column: 1 / 2;
            margin: auto 0.5rem auto auto;
            padding: 0.3rem 0;
            font-size: 0.8rem;
          }
          .TimeTable .label {
            border-left: solid 4px #666;
            padding-left: 2px;
            z-index: 2;
          }
          .TimeTable .line:nth-child(2n) {
            grid-column: 2 / 99;
            background-color: #eee;
            z-index: 1;
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
        ],
      },
    };
    console.log(v.whois+' start.',parent,data,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;
      
      v.step = 2; // DOMをメンバとして登録
      this.table = this.wrapper.querySelector('.table');
      this.select = this.wrapper.querySelector('.control select');

      v.step = 3; // プルダウンを設定
      this.options.forEach(x => {
        this.select.appendChild(createElement(
          {tag:'option',attr:{value:x.value},text:x.label},
        ))
      });

      v.step = 4; // 開始時刻順にソート
      this.data = data;
      this.data.list = this.data.list.sort((a,b) => a.st < b.st ? -1 : 1);
      console.log(this.data);

      v.step = 5; // 起算オブジェクト(this.base)の計算
      // this.base.date: {number[]} - 起算点年月日を[y, M, d]形式にした配列
      this.base = {date:this.data.base.match(/\d{4}\/\d{2}\/\d{2}/)[0].split('/')};
      this.base.date[1] -= 1;  // 月は0オリジンなので修正
      // this.base.time: {number} - (時刻を含む)起算点のUNIX時刻
      this.base.time = new Date(
        ...this.base.date,
        ...this.data.base.match(/\d{2}:\d{2}/)[0].split(':')
      ).getTime();
      console.log('this.base=%s',JSON.stringify(this.base));

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

  /**
   * @returns {null|Error}
   */
  calc = (tm) => { // 時刻tmのgrid-rowとラベルを返す
    const dObj = new Date(...this.base.date, ...tm.split(':'));
    return {
      row: (dObj.getTime() - this.base.time) / this.data.span,
      label: ('0'+dObj.getHours()).slice(-2)
        + ':' + ('0'+dObj.getMinutes()).slice(-2)
    };
  }

  drawTable = () => {
    const v = {whois:'TimeTable.drawTable',step:0,rv:null,list:[],line:[]};
    console.log(v.whois+' start.',this.data);
    try {

      v.step = 1; // 前処理
      this.table.innerHTML = '';

      v.step = 2; // 表示対象フラグを取得
      v.flag = Number(this.wrapper.querySelector('select').selectedOptions[0].value);
      console.log('v.flag=%s',v.flag);

      v.step = 3; // 表示対象となるタスクを抽出
      this.data.list.forEach(x => {
        if( (v.flag & x.tag) > 0 ) v.list.push(x);
      });
      console.log('v.list=%s',JSON.stringify(v.list));

      v.step = 4; // タスクを表示
      for( v.i=0 ; v.i<v.list.length ; v.i++ ){
        v.step = 4.1; // 表示レベルを計算
        v.list[v.i].level = 0;
        for( v.j=0 ; v.j<v.i ; v.j++ ){
          if( v.list[v.j].ed >= v.list[v.i].st ){
            // 先行するタスクの終了時刻が表示対象タスクの開始時刻以後の場合
            // 表示レベルを上げる(右にシフトして表示するようにする)
            v.list[v.i].level = v.list[v.j].level + 1;
          }
        }

        v.step = 4.2; // 開始・終了時刻を表示
        v.st = this.calc(v.list[v.i].st);
        v.ed = this.calc(v.list[v.i].ed);
        this.table.appendChild(createElement({
          attr:{class:'st'},
          text:v.st.label,
          style:{'grid-row': (v.st.row * 2 + 1) + ' / ' + (v.st.row * 2 + 3)},
        }));
        this.table.appendChild(createElement({
          attr:{class:'ed'},
          text:v.ed.label,
          style:{'grid-row': (v.ed.row * 2 + 1) + ' / ' + (v.ed.row * 2 + 3)},
        }));

        v.step = 4.3; // ラベルを表示
        this.table.appendChild(createElement({
          attr:{class:'label'},
          text:v.list[v.i].label,
          style:{
            'grid-column': (v.list[v.i].level + 2) + ' / 99',
            'grid-row': (v.st.row * 2 + 2) + ' / ' + (v.ed.row * 2 + 2),
          },
        }));
        // 「上に」補助線を引く要素のgrid-rowを保存
        v.line.push(v.st.row * 2 + 2);
        v.line.push(v.ed.row * 2 + 2);

      }

      v.step = 5; // 補助線を表示
      console.log(JSON.stringify(v.line));
      v.line = [...new Set(v.line)];
      console.log(JSON.stringify(v.line));
      v.line.sort((a,b)=>{return a < b ? -1 : 1});  // 重複を排除してソート
      console.log(JSON.stringify(v.line));
      for( v.i=1 ; v.i<v.line.length ; v.i++ ){
        this.table.appendChild(createElement({
          attr:{class:'line'},
          style:{'grid-row':v.line[v.i-1]+' / '+v.line[v.i]},
        }));

      }

      v.step = 6;
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
}