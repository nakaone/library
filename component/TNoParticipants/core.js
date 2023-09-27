/**
 * @classdesc 参加者数の集計(total number of participants)
 */
class TNoParticipants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} auth - class Authのインスタンス。データ取得等で使用
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,auth,opt={}){
    const v = {whois:'TNoParticipants.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        auth: auth,

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TNoParticipants共通部分 */ `
          .TNoParticipants.act {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .TNoParticipants {
            display: none;
          }
          .TNoParticipants th {
            text-align: left;
          }
          .TNoParticipants .num {
            text-align: right;
          }`,
        ],
        html:[],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 3; // 待機画面の用意
      this.LoadingIcon = new LoadingIcon(this.parent);
      if( v.rv instanceof Error ) throw this.LoadingIcon;

      v.step = 4; // 終了処理
      //this.close();
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /** 非同期処理で管理局から最新の人数を取得、alasqlでテーブルを準備
   * @returns {null|Error}
   */
  build = async() => {
    const v = {whois:'TNoParticipants.build',step:0,rv:null,
      objectize: (arr) => { // 二次元配列をオブジェクト化
        const rv = [];
        for( let i=1 ; i<arr.length ; i++ ){
          if( arr[i][0] === '' ) continue;
          const o = {};
          for( let j=0 ; j<arr[i].length ; j++ )
            o[arr[0][j]] = arr[i][j];
          rv.push(o);
        }
        return rv;
      },
    };
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // 最新の人数を管理局から取得
      this.LoadingIcon.show(); 
      v.rv = await this.auth.fetch('getTNoParticipants',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      // 取得した二次元配列をオブジェクト化、クレンジング
      // メールアドレス	entryNo	authority	キャンセル	宿泊、テント	申込者の参加	参加者01〜05所属	fee00〜05
      v.step = 2.1; // オブジェクト化
      v.rv = v.objectize(v.rv.result);
      v.step = 2.2; // クレンジング
      v.rv = alasql('select * from ?'
      + ' where [メールアドレス] <> "nakaone.kunihiro@gmail.com"' // テストデータを除外
      + ' and [メールアドレス] <> "shimokitasho.oyaji@gmail.com"'
      + ' and authority<>2' // おやじコアを除外
      + ' and authority<>8' // 重複データを除外
      ,[v.rv]);
      console.log(JSON.stringify(v.rv));

      v.step = 3.1; // キャンセル/当落で申込別集計を作成
      v.cancel = alasql('select * from ('
      + ' select isCancel, isWin, count(*) as cnt'
      + ' from (select'
      + ' case when [キャンセル]<>"" then "1.キャンセル" else "2.その他" end as isCancel,'
      + ' case when authority>0 then "a.当選" else "b.落選" end as isWin'
      + ' from ?)'
      + ' group by isCancel, isWin'
      + ' union select "3.合計" as isCancel, "" as isWin, count(*) as cnt from ?)'
      + ' order by isCancel, isWin'
      ,[v.rv,v.rv]);
      //console.log("cancel=%s",JSON.stringify(v.cancel));

      v.step = 3.2; // テーブルの描画
      v.table = createElement({tag:'table'});
      v.cancel.forEach(x => {
        v.table.appendChild(createElement(
          {tag:'tr',children:[
            {tag:'td',text:x.isCancel},
            {tag:'td',text:x.isWin},
            {tag:'td',text:x.cnt,attr:{class:'num'}},
          ]}
        ));
      });
      this.wrapper.appendChild(createElement({tag:'h1',text:'申込別集計'}));
      this.wrapper.appendChild(v.table);

      v.step = 4.1; // 非キャンセルかつ当選を抽出
      v.t01 = alasql('select * from ?'
      + ' where [キャンセル]="" and authority>0'
      ,[v.rv]);
      console.log('t01',v.t01);
      v.step = 4.2; // 個人別に分割・統合
      v.t02 = alasql('select "保護者" as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [申込者の参加] like "参加予定%"'
      + ' union all select [参加者01所属] as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [参加者01所属]<>""'
      + ' union all select [参加者02所属] as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [参加者02所属]<>""'
      + ' union all select [参加者03所属] as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [参加者03所属]<>""'
      + ' union all select [参加者04所属] as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [参加者04所属]<>""'
      + ' union all select [参加者05所属] as [所属],'
      + ' case when [宿泊、テント]="宿泊する(テントあり)" then 1 else 0 end as tent,'
      + ' case when [宿泊、テント]="宿泊する(テントなし)" then 1 else 0 end as gym,'
      + ' case when [宿泊、テント] like "宿泊する%" then 1 else 0 end as stay,'
      + ' case when [宿泊、テント]="宿泊しない" then 1 else 0 end as dayuse,'
      + ' 1 as totalnum'
      + ' from ? where [参加者05所属]<>""'
      ,[v.t01,v.t01,v.t01,v.t01,v.t01,v.t01]);
      console.log('t02',v.t02);

      v.step = 4.3; // 集計表でのソート用にラベルを書き換え
      v.map = {
        '1年生':'01.1年生','2年生':'02.2年生','3年生':'03.3年生',
        '4年生':'04.4年生','5年生':'05.5年生','6年生':'06.6年生',
        '未就学児':'08.未就学児','保護者':'09.保護者','卒業生':'10.卒業生'
      }
      v.t02.forEach(x => x['所属'] = v.map[x['所属']]);

      v.step = 4.4; // クロス集計
      v.t03a = alasql('select [所属],' // 所属別
      + ' sum(tent) as [テント],'
      + ' sum(gym) as [体育館],'
      + ' sum(stay) as [宿泊計],'
      + ' sum(dayuse) as [日帰り],'
      + ' sum(totalnum) as [合計]'
      + ' from ? group by [所属]'
      ,[v.t02]);
      console.log('t03a',v.t03a);
      v.t03b = alasql('select "07.在学生計" as [所属],'
      + ' sum(tent) as [テント],'
      + ' sum(gym) as [体育館],'
      + ' sum(stay) as [宿泊計],'
      + ' sum(dayuse) as [日帰り],'
      + ' sum(totalnum) as [合計]'
      + ' from ? where [所属]<"07"'
      ,[v.t02]);
      console.log('t03b',v.t03b);
      v.t03c = alasql('select "11.関係者計" as [所属],'
      + ' sum(tent) as [テント],'
      + ' sum(gym) as [体育館],'
      + ' sum(stay) as [宿泊計],'
      + ' sum(dayuse) as [日帰り],'
      + ' sum(totalnum) as [合計]'
      + ' from ? where "08"<[所属]'
      ,[v.t02]);
      console.log('t03c',v.t03c);
      v.t03d = alasql('select "12.総合計" as [所属],'
      + ' sum(tent) as [テント],'
      + ' sum(gym) as [体育館],'
      + ' sum(stay) as [宿泊計],'
      + ' sum(dayuse) as [日帰り],'
      + ' sum(totalnum) as [合計]'
      + ' from ?'
      ,[v.t02]);
      console.log('t03d',v.t03d);
      v.t03 = v.t03a.concat(v.t03b).concat(v.t03c).concat(v.t03d)
      .sort((a,b)=>a['所属']<b['所属']?-1:1);
      console.log('t03',v.t03);

      v.step = 4.5; // テーブルの描画
      v.table = createElement({tag:'table',attr:{name:'person'},children:[
        {tag:'thead',children:[
          {tag:'tr',children:[
            {tag:'th',text:'所属',attr:{rowspan:'2'}},
            {tag:'th',text:'宿泊',attr:{colspan:'3'}},
            {tag:'th',text:'日帰り',attr:{rowspan:'2'}},
            {tag:'th',text:'合計',attr:{rowspan:'2'}},
          ]},
          {tag:'tr',children:[
            {tag:'th',text:'テント'},
            {tag:'th',text:'体育館'},
            {tag:'th',text:'宿泊計'},
          ]}
        ]},
        {tag:'tbody'}
      ]});
      v.t03.forEach(x => {
        v.table.querySelector('tbody').appendChild(createElement(
          {tag:'tr',children:[
            {tag:'th',text:x['所属']},
            {tag:'td',text:x['テント'],attr:{class:'num'}},
            {tag:'td',text:x['体育館'],attr:{class:'num'}},
            {tag:'td',text:x['宿泊計'],attr:{class:'num'}},
            {tag:'td',text:x['日帰り'],attr:{class:'num'}},
            {tag:'td',text:x['合計'],attr:{class:'num'}},
          ]}
        ));
      });
      this.wrapper.appendChild(createElement({tag:'h1',text:'参加者別集計'}));
      this.wrapper.appendChild(v.table);

      v.step = 8; // 終了処理
      //this.open();  // 画面表示
      this.LoadingIcon.hide();  // 待機画面をクローズ
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
  template = () => {
    const v = {whois:'TNoParticipants.template',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  
}