/**
 * @classdesc 参加者数の集計(total number of perticipants)
 */
class TNoPerticipants {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,auth,opt={}){
    const v = {whois:'TNoPerticipants.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        auth: auth, // 認証局のURL

        // メンバとして持つHTMLElementの定義
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        wrapper: null, // {HTMLElement} ラッパー
        wrapperSelector: null, // {string} ラッパーのCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義

        // CSS/HTML定義
        css:[
          /* TNoPerticipants共通部分 */ `
          .TNoPerticipants {
            margin: 1rem;
            width: calc(100% - 2rem);
            display: grid;
            row-gap: 1rem;
            grid-template-columns: 1fr;
          }
          .TNoPerticipants.hide {
            display: none;
          }
          .TNoPerticipants .right {
            text-align: right;
          }
          .TNoPerticipants .group {
            display: grid;
            grid-template-areas:
              "a1   b1   c1   d1"
              "a2a6 b2b4 c2   d2"
              "a2a6 b2b4 c3   d3"
              "a2a6 b2b4 c4   d4"
              "a2a6 b5c5 b5c5 d5"
              "a2a6 b6c6 b6c6 d6"
              "a7c7 a7c7 a7c7 d7"
              "a8c8 a8c8 a8c8 d8";
            grid-template-rows: repeat(8, 1.5rem);
            grid-template-columns: repeat(3, 4rem) 5rem;
            gap: 0.2rem;
          }
          .TNoPerticipants .person {
            display: grid;
            grid-template-areas:
              "a1   b1   c1   d11 d12 d13 d14 d15 d16 d17 d18 d19 d10"
              "a2a6 b2b4 c2   d21 d22 d23 d24 d25 d26 d27 d28 d29 d20"
              "a2a6 b2b4 c3   d31 d32 d33 d34 d35 d36 d37 d38 d39 d30"
              "a2a6 b2b4 c4   d41 d42 d43 d44 d45 d46 d47 d48 d49 d40"
              "a2a6 b5c5 b5c5 d51 d52 d53 d54 d55 d56 d57 d58 d59 d50"
              "a2a6 b6c6 b6c6 d61 d62 d63 d64 d65 d66 d67 d68 d69 d60"
              "a7c7 a7c7 a7c7 d71 d72 d73 d74 d75 d76 d77 d78 d79 d70"
              "a8c8 a8c8 a8c8 d81 d82 d83 d84 d85 d86 d87 d88 d89 d80";
            grid-template-rows: repeat(8, 1.5rem);
            grid-template-columns: repeat(3, 4rem) repeat(10, 5rem);
            gap: 0.2rem;
          }
          `,
        ],
        html:[
          {attr:{class:'group'},children:[
            {attr:{class:'th'},style:{'grid-area':'a1'},text:'取消'},
            {attr:{class:'th'},style:{'grid-area':'b1'},text:'宿泊'},
            {attr:{class:'th'},style:{'grid-area':'c1'},text:'テント'},
            {attr:{class:'th'},style:{'grid-area':'d1'},text:'口数'},
            {attr:{class:'th'},style:{'grid-area':'a2a6'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'a7c7'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'a8c8'},text:'合計'},
            {attr:{class:'th'},style:{'grid-area':'b2b4'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'b5c5'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'b6c6'},text:'小計'},
            {attr:{class:'th'},style:{'grid-area':'c2'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'c3'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'c4'},text:'小計'},
          ]},
          {attr:{class:'person'},children:[
            {attr:{class:'th'},style:{'grid-area':'a1'},text:'取消'},
            {attr:{class:'th'},style:{'grid-area':'b1'},text:'宿泊'},
            {attr:{class:'th'},style:{'grid-area':'c1'},text:'テント'},
            {attr:{class:'th'},style:{'grid-area':'a2a6'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'a7c7'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'a8c8'},text:'合計'},
            {attr:{class:'th'},style:{'grid-area':'b2b4'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'b5c5'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'b6c6'},text:'小計'},
            {attr:{class:'th'},style:{'grid-area':'c2'},text:'あり'},
            {attr:{class:'th'},style:{'grid-area':'c3'},text:'なし'},
            {attr:{class:'th'},style:{'grid-area':'c4'},text:'小計'},
            {attr:{class:'th'},style:{'grid-area':'d11'},text:'1年'},
            {attr:{class:'th'},style:{'grid-area':'d12'},text:'2年'},
            {attr:{class:'th'},style:{'grid-area':'d13'},text:'3年'},
            {attr:{class:'th'},style:{'grid-area':'d14'},text:'4年'},
            {attr:{class:'th'},style:{'grid-area':'d15'},text:'5年'},
            {attr:{class:'th'},style:{'grid-area':'d16'},text:'6年'},
            {attr:{class:'th'},style:{'grid-area':'d17'},text:'卒業生'},
            {attr:{class:'th'},style:{'grid-area':'d18'},text:'未就学児'},
            {attr:{class:'th'},style:{'grid-area':'d19'},text:'保護者'},
            {attr:{class:'th'},style:{'grid-area':'d10'},text:'合計'},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      // tdの追加
      for( v.i=2 ; v.i<9 ; v.i++ ){
        this.wrapper.querySelector('.group').appendChild(createElement(
          {attr:{class:'td right'},style:{'grid-area':'d'+v.i},children:[
            {tag:'span',attr:{name:'a'+v.i},text:'0'},
            {tag:'span',attr:{name:'b'+v.i},text:' / 0'},
          ]}
        ));
      }
      for( v.i=20 ; v.i<90 ; v.i++ ){
        this.wrapper.querySelector('.person').appendChild(createElement(
          {attr:{class:'td right'},style:{'grid-area':'d'+(('0'+v.i).slice(-2))},children:[
            {tag:'span',attr:{name:'a'+(('0'+v.i).slice(-2))},text:'0'},
            {tag:'span',attr:{name:'b'+(('0'+v.i).slice(-2))},text:' / 0'},
          ]}
        ));
      }

      v.step = 4; // 終了処理
      this.close();
      console.log(v.whois+' normal end.',this);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }

  /**
   * @returns {null|Error}
   */
  build = async() => {
    const v = {whois:'TNoPerticipants.build',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1';
      /*
      v.rv = await this.auth.fetch('getTNoParticipants',{
        entryNo: this.auth.entryNo.value,
        publicKey: this.auth.RSA.pKey,
      },3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        alert(v.rv.message);
        return null;
      }*/
      v.rv = JSON.parse('{"isErr":false,"message":"","stack":"","result":[["entryNo","キャンセル","宿泊、テント","申込者の参加","参加者01所属","参加者02所属","参加者03所属","参加者04所属","参加者05所属","fee00","fee01","fee02","fee03","fee04","fee05"],[1,"キャンセル","宿泊する(テントあり)","参加予定(宿泊なし)","1年生","3年生","","","","既収","未収","","","",""],[2,"キャンセル","宿泊しない","参加予定(宿泊なし)","2年生","","","","","","","","","",""],[3,"キャンセル","宿泊しない","不参加","3年生","","","","","","","","","",""],[4,"","宿泊する(テントなし)","参加予定(宿泊あり)","4年生","","","","","既収","未収","","","",""],[5,"","宿泊する(テントなし)","参加予定(宿泊あり)","5年生","","","","","","","","","",""],[6,"","宿泊する(テントなし)","参加予定(宿泊あり)","6年生","","","","","","","","","",""],[7,"","宿泊しない","参加予定(宿泊なし)","卒業生","","","","","","","","","",""],[8,"","宿泊する(テントなし)","参加予定(宿泊あり)","未就学児","","","","","","","","","",""],[9,"","宿泊する(テントあり)","不参加","保護者","","","","","","","","","",""],[10,"","宿泊する(テントなし)","参加予定(宿泊あり)","1年生","","","","","","","","","",""],[11,"","宿泊する(テントなし)","参加予定(宿泊あり)","2年生","","","","","","","","","",""],[12,"","宿泊しない","参加予定(宿泊なし)","3年生","","","","","","","","","",""],[13,"","宿泊しない","参加予定(宿泊なし)","4年生","","","","","","","","","",""],[14,"","宿泊する(テントなし)","参加予定(宿泊あり)","5年生","","","","","","","","","",""],[15,"","宿泊する(テントあり)","不参加","6年生","","","","","","","","","",""],[16,"","宿泊する(テントなし)","参加予定(宿泊あり)","卒業生","","","","","既収","既収","","","",""],[17,"","宿泊する(テントあり)","参加予定(宿泊なし)","未就学児","","","","","","","","","",""],[18,"","宿泊する(テントあり)","参加予定(宿泊なし)","保護者","","","","","","","","","",""],[19,"","宿泊する(テントなし)","参加予定(宿泊あり)","1年生","","","","","","","","","",""],[20,"","宿泊する(テントなし)","不参加","2年生","","","","","","","","","",""],[21,"","宿泊する(テントあり)","参加予定(宿泊あり)","3年生","","","","","","","","","",""],[22,"","宿泊する(テントなし)","参加予定(宿泊あり)","4年生","","","","","","","","","",""],[23,"","宿泊する(テントあり)","参加予定(宿泊なし)","5年生","","","","","","","","","",""],[24,"","宿泊する(テントなし)","参加予定(宿泊あり)","6年生","","","","","","","","","",""],[25,"","宿泊する(テントなし)","参加予定(宿泊あり)","卒業生","","","","","","","","","",""],[26,"","宿泊しない","参加予定(宿泊なし)","未就学児","保護者","","","","","","","","",""],[27,"","宿泊する(テントあり)","参加予定(宿泊あり)","5年生","","","","","","","","","",""],[28,"","宿泊する(テントなし)","参加予定(宿泊あり)","保護者","","","","","","","","","",""],[29,"","宿泊しない","参加予定(宿泊なし)","卒業生","","","","","","","","","",""],[30,"","宿泊する(テントあり)","参加予定(宿泊あり)","6年生","3年生","","","","","","","","",""],[31,"","宿泊する(テントなし)","参加予定(宿泊あり)","2年生","","","","","","","","","",""],[32,"","宿泊する(テントなし)","参加予定(宿泊あり)","3年生","","","","","","","","","",""],[33,"","宿泊する(テントあり)","参加予定(宿泊あり)","2年生","卒業生","卒業生","","","","","","","",""],[34,"","宿泊する(テントなし)","参加予定(宿泊あり)","3年生","","","","","","","","","",""],[35,"","宿泊する(テントなし)","参加予定(宿泊あり)","2年生","保護者","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""]]}');

      // 取得したデータをrawテーブルに格納
      alasql(`create table raw (
        id INT, cancel string, tent string, 
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
      //console.log('raw\n',JSON.stringify(alasql('select * from raw')));

      /* m01: 申込単位のマスタテーブル
        id      受付番号
        cancel  0:キャンセル無し、1:キャンセル
        stay    0:宿泊しない、1:宿泊する
        tent    0:テント無し、1:テントあり
        member  参加登録人数
        enter   入場済み人数
        isEnter 0:全員未入場、1:参加者の誰かが入場済
        memNN   参加者の所属
        feeNN   '未入場','無料','未収','既収','退場済'
      */
      v.sql = "select id"
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
        /* 作業用クエリg00の定義 */

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
      v.m01 = alasql(v.sql);
      console.log(v.m01);

      /* g01: グループ単位の集計
        cancel  0:キャンセル無し、1:キャンセル
        stay    0:宿泊しない、1:宿泊する
        tent    0:テント無し、1:テントあり
        member  参加登録口数
        enter   入場済口数
      */
      v.sql = //"select * from ? where cancel > 0";
      "select cancel, stay, tent, count(*) as member, sum(isEnter) as enter from ?"
      + " group by cancel, stay, tent"
      ;
      v.g01 = alasql(v.sql,[v.m01]);
      console.log(v.g01);
      v.rv = {group:v.g01};


      v.step = 3; // 終了処理
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

  /**
   * @returns {null|Error}
   */
  template = () => {
    const v = {whois:'TNoPerticipants.template',step:0,rv:null};
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