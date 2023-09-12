/**
 * @classdesc 参加者数の集計(total number of perticipants)
 */
class TNoPerticipants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} auth - class Authのインスタンス。データ取得等で使用
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,auth,opt={}){
    const v = {whois:'TNoPerticipants.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        auth: auth,
        colLabel: ['A','B','C','D','E'],  // 列記号
        colCond: ['stay=1 and tent=1','stay=1 and tent=0','stay=1','stay=0','stay<99'],
        rowLabel: ['申込単位','1年生','2年生','3年生',
          '4年生','5年生','6年生','在校生計',
          '卒業生','未就学児','保護者','関係者計','総計'],
        rowCond: ['',"mem='1年生'","mem='2年生'","mem='3年生'",
          "mem='4年生'","mem='5年生'","mem='6年生'","mem like '%年生'",
          "mem='卒業生'","mem='未就学児'","mem='保護者'",
          "mem='卒業生' or mem='未就学児' or mem='保護者'","mem<>'dummy'"],

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TNoPerticipants共通部分 */ `
          .TNoPerticipants[name="wrapper"] {
            display: none;
          }
          .TNoPerticipants[name="wrapper"].act {
            display: block;
          }
          .TNoPerticipants .control {
            padding: 1rem;
          }
          .TNoPerticipants select {
            margin-right: 2rem;
          }
          .TNoPerticipants .table {
            margin: 1rem;
            display: grid;
            grid-template-columns: 6rem repeat(5, 4rem);
            gap: 0.2rem;
          }
          .TNoPerticipants .td {
            text-align: right;
          }
          .TNoPerticipants .color {
            background: #8ff;
          }
          .TNoPerticipants li li {
            font-size: 0.8rem;
          }`,
        ],
        html:[
          {attr:{class:'control'},children:[
            // 母集団
            {tag:'label',text:'母集団：'},
            {tag:'select',attr:{name:'population'},event:{'change':this.setValues},children:[
              {tag:'option',attr:{value:'auth<>2'},text:'応募者'},
              {tag:'option',attr:{value:'auth=1 or auth=3 or auth=5'},text:'当選者'},
              {tag:'option',attr:{value:'auth=0 or auth=4'},text:'落選者'},
              {tag:'option',attr:{value:'auth=2 or auth=5'},text:'スタッフ'},
            ]},
            // 状態
            {tag:'label',text:'抽出条件：'},
            {tag:'select',attr:{name:'status'},event:{'change':this.setValues},children:[
              {tag:'option',attr:{value:"fee<>''"},text:'全件'},
              {tag:'option',attr:{value:"fee='未入場'"},text:'未入場'},
              {tag:'option',attr:{value:"fee<>'未入場'"},text:'入場済'},
            ]},
            {tag:'ol',children:[
              {tag:'li',text:'「母集団」は集計対象範囲を指します。',children:[
                {tag:'ul',children:[
                  {tag:'li',text:'応募者：募集に応募している人。おやじの会メンバを除く'},
                  {tag:'li',text:'当選者：応募締切前は応募者と同じ。締切後は当選した人'},
                  {tag:'li',text:'落選者：応募締切前はゼロ、締切後は落選した人'},
                  {tag:'li',text:'スタッフ：おやじの会メンバまたは応募者のうち手伝い可の人'},
                ]},
              ]},
              {tag:'li',text:'「抽出条件」は母集団からの抽出条件を指します。',children:[
                {tag:'ul',children:[
                  {tag:'li',text:'全件：条件を設定せず、母集団全体を対象とする'},
                  {tag:'li',text:'未入場：イベント当日、当選者のうち受付を済ませていない人'},
                  {tag:'li',text:'入場済：イベント当日、当選者のうち受付を済ませた人'}

                ]},
              ]},
              {tag:'li',text:'「申込単位」のみ応募口数での集計、他は人数ベース'},
            ]},
          ]},
          {attr:{class:'table'},children:[
            {attr:{class:'th'},style:{'grid-column':'1 / 2','grid-row':'1 / 2'},text:'宿泊'},
            {attr:{class:'th'},style:{'grid-column':'2 / 5','grid-row':'1 / 2'},text:'あり'},
            {attr:{class:'th'},style:{'grid-column':'5 / 6','grid-row':'1 / 3'},text:'なし'},
            {attr:{class:'th'},style:{'grid-column':'6 / 7','grid-row':'1 / 3'},text:'参加計'},
            {attr:{class:'th'},style:{'grid-column':'1 / 2','grid-row':'2 / 3'},text:'テント'},
            {attr:{class:'th'},style:{'grid-column':'2 / 3','grid-row':'2 / 3'},text:'あり'},
            {attr:{class:'th'},style:{'grid-column':'3 / 4','grid-row':'2 / 3'},text:'なし'},
            {attr:{class:'th'},style:{'grid-column':'4 / 5','grid-row':'2 / 3'},text:'宿泊計'},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // テーブル領域(td部分)の追加
      for( v.r=0 ; v.r<this.rowLabel.length ; v.r++ ){
        // 右端のラベル項目
        this.wrapper.querySelector('.table').appendChild(createElement(
          {attr:{class:'th'},text:this.rowLabel[v.r]}
        ));
        // 値項目
        for( v.c=0 ; v.c<this.colLabel.length ; v.c++ ){
          this.wrapper.querySelector('.table').appendChild(createElement(
            {attr:{class:'td '
              + this.colLabel[v.c]+('0'+v.r).slice(-2) // セルアドレス
              + ((v.r === 0 || v.r === 7 || v.r > 10) ? ' color' : '')
            }}
          ));
        }
      }

      v.step = 3; // 待機画面の用意
      this.LoadingIcon = new LoadingIcon(this.parent);
      if( v.rv instanceof Error ) throw this.LoadingIcon;
      this.LoadingIcon.show(); 

      v.step = 4; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',this);
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
    const v = {whois:'TNoPerticipants.build',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // 最新の人数を管理局から取得
      v.rv = await this.auth.fetch('getTNoParticipants',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }

      v.step = 2; // raw: 取得したデータをそのままテーブルに格納
      alasql(`create table raw (
        id INT, auth INT, cancel string, tent string, 
        mem00 string, mem01 string, mem02 string, 
        mem03 string, mem04 string, mem05 string, 
        fee00 string, fee01 string, fee02 string, 
        fee03 string, fee04 string, fee05 string
      )`);
      for( v.i=1 ; v.i<v.rv.result.length ; v.i++ ){
        v.l = v.rv.result[v.i];
        if( String(v.l[0]).length > 0 ){
          v.sql = 'insert into raw values '
          + JSON.stringify(v.l).replace('[','(').replace(']',')');
          alasql(v.sql);
        }
      }
      console.log('raw\n',JSON.stringify(alasql('select * from raw')));

      v.step = 3; // おやじの会コアスタッフ(auth=2)のダミーメンバは消去
      v.sql = "update raw"
      + " set mem01='', mem02='', mem03='', mem04='', mem05=''"
      + ", tent='宿泊する(テントなし)'"
      + " where auth=2";
      alasql(v.sql);

      v.step = 4; /* this.master: 申込単位のマスタテーブルを作成
        id      受付番号
        auth
        cancel  0:キャンセル無し、1:キャンセル
        stay    0:宿泊しない、1:宿泊する
        tent    0:テント無し、1:テントあり
        member  参加登録人数
        enter   入場済み人数
        isEnter 0:全員未入場、1:参加者の誰かが入場済
        memNN   参加者の所属
        feeNN   '未入場','無料','未収','既収','退場済'
      */
      v.sql = "select id, auth"
        /* cancel: キャンセル */
        + ", case when g00.cancel = '' then 0 else 1 end as cancel"
        /* stay,tent: 宿泊、テント */
        + ", case when g00.cancel = '' and g00.tent like '宿泊する%' then 1 else 0 end as stay"
        + ", case when g00.cancel = '' and g00.tent like '%あり%' then 1 else 0 end as tent"
        /* member: 参加登録人数 */
        + ", case when g00.cancel<>'' then 0"
        + " else m00 + m01 + m02 + m03 + m04 + m05 end as member"
        /* enter: 入場済人数 */
        + ", case when g00.cancel<>'' then 0"
        + " else f00 + f01 + f02 + f03 + f04 + f05 end as enter"
        /* isEnter: 入場済フラグ */
        + ", case when g00.cancel<>'' then 0"
        + " when (f00 + f01 + f02 + f03 + f04 + f05) > 0 then 1 else 0 end as isEnter"
        /* 参加者属性 */
        + ", case when g00.mem01 = '不参加' then '' else '保護者' end as mem00"
        + ", mem01, mem02, mem03, mem04, mem05"
        + ", fee00, fee01, fee02, fee03, fee04, fee05"

        + " from (select *"
        /* 参加人数カウント用 */
        + `,
        case when mem00 = '不参加' then 0 else 1 end as m00,
        case when mem01 = '' then 0 else 1 end as m01,
        case when mem02 = '' then 0 else 1 end as m02,
        case when mem03 = '' then 0 else 1 end as m03,
        case when mem04 = '' then 0 else 1 end as m04,
        case when mem05 = '' then 0 else 1 end as m05
        `
        /* 入場者数カウント用 */
        + `,
        case when fee00 = '' or fee00 = '未入場' then 0 else 1 end as f00,
        case when fee01 = '' or fee01 = '未入場' then 0 else 1 end as f01,
        case when fee02 = '' or fee02 = '未入場' then 0 else 1 end as f02,
        case when fee03 = '' or fee03 = '未入場' then 0 else 1 end as f03,
        case when fee04 = '' or fee04 = '未入場' then 0 else 1 end as f04,
        case when fee05 = '' or fee05 = '未入場' then 0 else 1 end as f05
        `
        + 'from raw) as g00';
      this.master = alasql(v.sql);
      console.log('master',this.master);

      v.step = 5; /* this.group: グループ単位の集計用マスタを作成
        auth    
        cancel  0:キャンセル無し、1:キャンセル
        stay    0:宿泊しない、1:宿泊する
        tent    0:テント無し、1:テントあり
        member  参加登録口数
        enter   入場済口数
      */
      v.sql = "select auth, cancel, stay, tent"
      + ", count(*) as member, sum(isEnter) as enter"
      + " from ? group by auth, cancel, stay, tent"
      ;
      this.group = alasql(v.sql,[this.master]);
      console.log('group',this.group);

      v.step = 6; /* this.person: 個人単位の集計用マスタを作成
        id      受付番号
        auth
        cancel  0:キャンセル無し、1:キャンセル
        stay    0:宿泊しない、1:宿泊する
        tent    0:テント無し、1:テントあり
        mem     '1年生'〜'6年生','卒業生','未就学児','保護者'
        sts     '未入場','無料','未収','既収','退場済'
      */
      v.template = "select id, auth, cancel, stay, tent"
      + ", mem0X as mem"
      + ", case"
      + " when fee0X = '' then '未入場'"
      + " else fee0X"
      + " end as fee"
      + " from ? where mem0X<>''";
      v.sql = v.template.replaceAll(/X/g,'0');
      for( v.i=1 ; v.i<6 ; v.i++ ){
        v.sql += ' union ' + v.template.replaceAll(/X/g,String(v.i));
      }
      this.person = alasql(v.sql,[this.master,this.master,this.master,this.master,this.master,this.master]);
      console.log('person',this.person);

      v.step = 7; // データをセット
      v.rv = this.setValues();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 8; // 終了処理
      this.open();  // 画面表示
      this.LoadingIcon.hide();  // 待機画面をクローズ
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  

  /** 指定条件に応じた集計結果を表示
   * @param {void}
   * @returns {null|Error}
   */
  setValues = () => {
    const v = {whois:'TNoPerticipants.setValues',step:0,rv:null,
      cond: {
        // テーブル領域の各列の抽出条件
        A: 'stay=1 and tent=1',
        B: 'stay=1 and tent=0',
        C: 'stay=1',
        D: 'stay=0',
        E: 'stay<99', // 全件対象
        // テーブル領域の各行の抽出条件
        1: "mem='1年生'",
        2: "mem='2年生'",
        3: "mem='3年生'",
        4: "mem='4年生'",
        5: "mem='5年生'",
        6: "mem='6年生'",
        7: "mem like '%年生'",  // 在校生計
        8: "mem='卒業生'",
        9: "mem='未就学児'",
        10: "mem='保護者'",
        11: "mem='卒業生' or mem='未就学児' or mem='保護者'", // 関係者計
        12: "mem<>''",  // 総計
      },
      // SQLテンプレート
      group: "select sum(member) as s00, sum(enter) as s01 from ?"
      + " where (_C) and (_P)",
      person: "select count(*) as cnt from ?"
      + " where (_R) and (_C) and (_P) and (_S)",
    };
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 母集団、抽出条件欄の値を取得、SQLテンプレートに反映
      v.population = this.wrapper.querySelector('.control [name="population"]').value;
      v.status = this.wrapper.querySelector('.control [name="status"]');
      v.group = v.group.replace('_P',v.population);
      v.person = v.person.replace('_P',v.population).replace('_S',v.status.value);

      v.step = 2; // グループの集計
      for( v.c=0 ; v.c<this.colCond.length ; v.c++ ){
        v.sql = v.group.replace('_C',this.colCond[v.c]);
        v.rv = alasql(v.sql,[this.group])[0];
        console.log(JSON.stringify(v.rv));
        v.sts = v.status.selectedOptions[0].innerText;
        v.val = v.sts === '全件' ? v.rv.s00
        : ( v.sts === '入場済' ? v.rv.s01 : (v.rv.s00 - v.rv.s01));
        this.wrapper.querySelector('.table .'+this.colLabel[v.c]+'00')
        .innerText = v.val;
      }

      v.step = 3; // 個人単位の集計
      for( v.r=1 ; v.r<this.rowCond.length ; v.r++ ){
        for( v.c=0 ; v.c<this.colCond.length ; v.c++ ){
          v.sql = v.person.replace('_R',this.rowCond[v.r])
          .replace('_C',this.colCond[v.c]);
          v.rv = alasql(v.sql,[this.person])[0];
          this.wrapper.querySelector('.table .'+this.colLabel[v.c]+('0'+v.r).slice(-2)).innerText = v.rv.cnt;
        }
      }

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }  


  /** 親要素内を表示 */
  open = () => {
    this.wrapper.classList.add('act');
  }

  /** 親要素内を隠蔽 */
  close = () => {
    this.wrapper.classList.remove('act');
  }
}