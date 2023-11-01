/**
 * @typedef {Object} account
 * @prop {string} 名称 - 分類の名称
 * @prop {string} 本籍 - 借 or 貸
 * @prop {number} B1 - BS大分類の表示順
 * @prop {number} B2 - BS中分類の表示順
 * @prop {number} B3 - BS小分類の表示順
 * @prop {number} BS - BS科目の表示順。集計項目は空白
 * @prop {number} P1 - PL大分類の表示順
 * @prop {number} P2 - PL中分類の表示順
 * @prop {number} PS - PL科目の表示順。集計項目は空白
 * @prop {number} C1 - CF大分類の表示順
 * @prop {number} C2 - CF中分類の表示順
 * @prop {number} CS - CF分類の表示順。集計項目は空白
 * @prop {string} type - 勘定科目の分類。
 *    B1/2/3=BSの集計項目、BA=BSの勘定科目(BS Account)。
 *    P1/2/3=PLの集計項目、PA=PLの勘定科目(PL Account)。
 *    C1/2/3=CFの集計項目、CA=CFの勘定科目(CF Account)。
 * @prop {number} BSseq - BS上の表示順。B1*1000000+B2*10000+B3*100+BA
 * @prop {number} PLseq - PL上の表示順。P1*1000000+P2*10000+P3*100+PA
 * @prop {number} CFseq - CF上の表示順。C1*1000000+C2*10000+C3*100+CA
 */
/**
 * @typedef {Object} journal
 * @prop {number} 会計年度
 * @prop {number} 伝票番号
 * @prop {number} 行番号
 * @prop {string} 取引日 - constructorでyyyy/MM/dd形式に変換
 * @prop {DateEx} date - 取引日。constructorの追加項目
 * @prop {string} 摘要
 * @prop {string} 補助摘要
 * @prop {string} 借方科目
 * @prop {string} 借方補助 - 補助科目
 * @prop {string} 借方部門
 * @prop {number} 借方本体
 * @prop {number} 借方区分 - 税区分。課税、非課税、免税、不課税
 * @prop {number} 借方税率 - 小数表記。10% -> 0.1
 * @prop {number} 借方税額
 * @prop {number} 借方合計 - 本体＋税額
 * @prop {string} 貸方科目
 * @prop {string} 貸方補助
 * @prop {string} 貸方部門
 * @prop {number} 貸方本体
 * @prop {number} 貸方区分
 * @prop {number} 貸方税率
 * @prop {number} 貸方税額
 * @prop {number} 貸方合計
 * @prop {string} 備考
 */
/**
 * @typedef {Object} daifuku
 * @prop {number} 年度
 * @prop {number} 伝票番号
 * @prop {number} 行番号
 * @prop {string} 所属 - 借方 or 貸方
 * @prop {string} 取引日
 * @prop {Date} date
 * @prop {string} 摘要
 * @prop {string} 補助摘要
 * @prop {string} 項目名 - 勘定科目名または集計項目名
 * @prop {string} 部門
 * @prop {number} 本体
 * @prop {string} 税区分
 * @prop {number} 税率 - 小数
 * @prop {number} 税額
 * @prop {number} 合計
 * @prop {number} BSseq - BS上の表示順。B1*1000000+B2*10000+B3*100+BA
 * @prop {number} PLseq - PL上の表示順。P1*1000000+P2*10000+P3*100+PA
 * @prop {number} CFseq - CF上の表示順。C1*1000000+C2*10000+C3*100+CA
 */
/**
 * @typedef {Object} kzUnit
 * @prop {number} 年度
 * @prop {string} 項目名 - 勘定科目または集計項目名
 * @prop {number} 表示順 - BSseq, PLseq, CFseq
 * @prop {string} 部門 - 全体合計は「全部門計」
 * @prop {number} 本体
 * @prop {number} 本体前比額
 * @prop {number} 本体前比率
 * @prop {number} 税額
 * @prop {number} 税額年比額
 * @prop {number} 税額年比率
 * @prop {number} 合計
 * @prop {number} 合計年比額
 * @prop {number} 合計年比率
 */
/**
 * @classdesc
 * 
 * #### 使用するクラス変数
 * 
 * 1. this.accounts {account[]} - 勘定科目マスタ
 * 1. this.journals {journal[]} - 仕訳帳明細
 * 1. this.daifuku {daifuku[]} - 大福帳
 *    - 仕訳明細帳の借方・貸方をそれぞれ別レコードとして登録
 *    - BS/PLの分類・計算項目を追加(ex.資産の部、営業外利益)
 *    - BS用の累計は、daifuku上では行わない(単年度増減額になる)
 * 1. v.t01 {kzUnit[]} - 貸借対照表作成(クロス集計)用データ
 * 1. this.PL
 * 1. this.CF
 */
class KawaZanyo extends BasePage {
  /**
   * @constructor
   * @param {Object} raw - Googleスプレッド「仕訳日記帳」からkzData.jsとしてDLしたデータ
   * @param {account[]} raw.accounts - 勘定科目マスタ
   * @param {journal[]} raw.journals - 仕訳日記帳
   * @param {Object} opt
   */
  constructor(raw,opt={}){
    const v = {whois:'KawaZanyo.constructor',rv:null,step:0,def:{
      html: [
        {name:'dumpArea',attr:{class:'dumpArea'}},  // オブジェクト配列の内容を表示する領域
        {name:'BSarea',attr:{class:'BSarea'}},
        {name:'PLarea',attr:{class:'PLarea'}},
      ],
      css: [`
        .num {text-align:right;}
        tbody th {white-space:nowrap;}
        th.type2 {padding-left: 1rem;}
        th.type3 {padding-left: 2rem;}
        th.typeA {padding-left: 3rem;}
        td.type1 {background-color:#6bb;font-weight:bold;}
        td.type2 {background-color:#7dd;}
        td.type3 {background-color:#8ff;}
        `,/* BSarea: 貸借対照表表示領域
          - -webkit-stickyはSafari用
          - stickyの親要素にはheight指定必須
          - theadの最初のthとは行ヘッダ・列ヘッダの交差する部分

          【参考】
          - [tableの行/列ヘッダーを固定する](https://qiita.com/rokko2massy/items/83283bce06acbba7a4f0)
          - [tableのヘッダーを固定する方法2つ](https://tedate.jp/coding/how-to-fix-table-header)
        */`
        div.BSarea {overflow: scroll;height:800px;}
        .BSarea thead th {
          position: -webkit-sticky;
          position: sticky;
          z-index: 1;
          top: 0;
        }
        .BSarea thead th:first-child {
          z-index: 2;
          left: 0;
        }
        .BSarea tbody th {
          position: -webkit-sticky;
          position: sticky;
          left: 0;
          z-index: 1;
        }
      `],
    }};
    //console.log(v.whois+' start.');
    try {
      v.r = super(v.def,opt);

      v.step = 1; // 勘定科目マスタ(raw.accounts)のthis.accountsへの格納
      v.r = this.genAccount(raw.accounts);
      if( v.r instanceof Error ) throw v.r;
      //console.log('this.accounts=%s\nthis.account=%s',JSON.stringify(this.accounts),JSON.stringify(this.account));

      v.step = 2; // 仕訳帳明細(this.journals)のthis.journalsへの格納
      v.r = this.genJournals(raw.journals);
      if( v.r instanceof Error ) throw v.r;
      //console.log('fy=%s〜%s\nthis.journals=%s',this.minFy,this.maxFy,JSON.stringify(this.journals));

      v.step = 3; // 仕訳帳データを大福帳に追加
      v.r = this.genDaifuku();
      if( v.r instanceof Error ) throw v.r;

      v.step = 4.1; // BSの分類別金額をthis.BSに追加
      v.r = this.addBS();
      if( v.r instanceof Error ) throw v.r;
      this.changeScreen('BSarea');
      //console.log('this.daifuku=%s',JSON.stringify(this.daifuku));

      v.step = 4.2; // 貸借対照表のテーブルを描画
      v.r = this.crossTable(this.BS,{
        X:{member:'年度'},
        Y:{member:'項目名',sort:{key:'表示順'}},
        V:{member:'合計'},
      });
      if( v.r instanceof Error ) throw v.r;

      v.step = 10; // 終了処理
      //console.log(v.whois+' normal end.\n',v.rv);

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    }
  }

  /** 勘定科目マスタの作成(this.accounts,this.account)
   * 格納時、typeを追加する。
   */
  genAccount = (raw) => {
    const v = {whois:this.className+'.genAccount',rv:null,step:0,l1:1000000,l2:10000,l3:100};
    //console.log(v.whois+' start.',raw);
    try {

      v.step = 2; // this.accounts(複数形)：配列形式の作成
      this.accounts = [];
      for( v.i=0 ; v.i<raw.length ; v.i++ ){
        v.o = Object.assign({
          '名称':'',type:''
          ,BSseq:0,PLseq:0,CFseq:0
          ,B1:0,B2:0,B3:0,BS:0
          ,P1:0,P2:0,P3:0,PS:0
          ,C1:0,C2:0,C3:0,CS:0
        },raw[v.i]);
        if( v.o.B1 > 0 ){
          v.p = v.o.B2 === 0 ? {type:'B1',BSseq:v.o.B1*v.l1}
          : ( v.o.B3 === 0 ? {type:'B2',BSseq:v.o.B1*v.l1+v.o.B2*v.l2}
          : ( v.o.BS === 0 ? {type:'B3',BSseq:v.o.B1*v.l1+v.o.B2*v.l2+v.o.B3*v.l3}
          : {type:'BA',BSseq:v.o.B1*v.l1+v.o.B2*v.l2+v.o.B3*v.l3+v.o.BS}));
          this.accounts.push(Object.assign({},v.o,v.p));
        }
        if( v.o.P1 > 0 ){
          v.p = v.o.P2 === 0 ? {type:'P1',PSseq:v.o.P1*v.l1}
          : ( v.o.P3 === 0 ? {type:'P2',PSseq:v.o.P1*v.l1+v.o.P2*v.l2}
          : ( v.o.PS === 0 ? {type:'P3',PSseq:v.o.P1*v.l1+v.o.P2*v.l2+v.o.P3*v.l3}
          : {type:'PA',PSseq:v.o.P1*v.l1+v.o.P2*v.l2+v.o.P3*v.l3+v.o.PS}));
          this.accounts.push(Object.assign({},v.o,v.p));
        }
        if( v.o.C1 > 0 ){
          v.p = v.o.C2 === 0 ? {type:'C1',CSseq:v.o.C1*v.l1}
          : ( v.o.C3 === 0 ? {type:'C2',CSseq:v.o.C1*v.l1+v.o.C2*v.l2}
          : ( v.o.CS === 0 ? {type:'C3',CSseq:v.o.C1*v.l1+v.o.C2*v.l2+v.o.C3*v.l3}
          : {type:'CA',CSseq:v.o.C1*v.l1+v.o.C2*v.l2+v.o.C3*v.l3+v.o.CS}));
          this.accounts.push(Object.assign({},v.o,v.p));
        }
      }
      //console.log(this.accounts.slice(0,100));

      v.step = 3; // 終了処理
      //console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 仕訳日記帳データの作成 */
  genJournals = (raw) => {
    const v = {whois:this.className+'.genJournals',rv:null,step:0};
    //console.log(v.whois+' start.');
    try {

      this.journals = raw;
      this.minFy = Infinity;  // 仕訳日記帳に存在する会計年度の最小値
      this.maxFy = -Infinity; // 同最大値

      this.journals.forEach(x => {
        // データの存在する会計年度の範囲を保存
        if( x['会計年度'] < this.minFy ) this.minFy = x['会計年度'];
        if( this.maxFy < x['会計年度'] ) this.maxFy = x['会計年度'];
        // 取引日(Date型)を文字列に変換
        x.date = new DateEx(x['取引日']);
        x['取引日'] = x.date.toLocale();

        ['摘要','補助摘要'].forEach(y => x[y] = x[y] || '');
        ['借方','貸方'].forEach(y => {
          // 空欄の文字項目に空文字列を代入
          ['科目','補助','部門'].forEach(z => x[y+z] = x[y+z] || '');
          // 空欄の数値項目に0を代入
          ['本体','区分','税率','税額','合計'].forEach(z => x[y+z] = x[y+z] || 0);
        })
      });

      v.step = 99; // 終了処理
      //console.log(v.whois+' normal end.\n',this.journals);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
    

  }

  /** 大福帳の作成 */
  genDaifuku = () => {
    const v = {whois:this.className+'.genDaifuku',rv:null,step:0};
    //console.log(v.whois+' start.');
    try {

      v.step = 1; // 勘定科目マスタからBS/PL関係の科目のみ抽出
      v.accounts = alasql("select * from ? where type like 'B%' or type like 'P%'",[this.accounts]);

      v.step = 2; // 借方・貸方の抽出
      v.sql = "select jn.`会計年度` as `年度`"
      + ", jn.`伝票番号`"
      + ", jn.`行番号`"
      + ", '借方' as `所属`"
      + ", jn.`取引日`"
      + ", jn.date"
      + ", jn.`摘要`"
      + ", jn.`補助摘要`"
      + ", jn.`借方科目` as `項目名`"
      + ", jn.`借方部門` as `部門`"
      + ", case when am.`本籍`='借' then jn.`借方本体` else jn.`借方本体`*-1 end as `本体`"
      + ", jn.`借方区分` as `税区分`"
      + ", jn.`借方税率` as `税率`"
      + ", case when am.`本籍`='借' then jn.`借方税額` else jn.`借方税額`*-1 end as `税額`"
      + ", case when am.`本籍`='借' then jn.`借方合計` else jn.`借方合計`*-1 end as `合計`"
      + ", am.BSseq as BSseq"
      + ", am.PLseq as PLseq"
      + ", am.CFseq as CFseq"
      + " from ? as jn"
      + " inner join ? as am on jn.`借方科目`=am.`名称`";
      v.kari = alasql(v.sql,[this.journals,v.accounts]);
      v.kashi = alasql(v.sql.replaceAll(/借/g,'貸'),[this.journals,v.accounts]);

      v.step = 3; // メンバ変数に格納
      this.daifuku = alasql("select * from ? order by `取引日`,`伝票番号`,`行番号`",
      [[...v.kari,...v.kashi]]);

      v.step = 4; // 終了処理
      //console.log(v.whois+' normal end.',this.daifuku);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 貸借対照表(BS)の集計項目を大福帳に追加
   * @param {void}
   * @returns {kzUnit[]|Error} 追加したレコード
   */
  addBS = () => {
    const v = {whois:this.className+'.addBS',rv:[],step:0,t01:[],t03:{},t04:[]};
    //console.log(v.whois+' start.');
    try {

      v.step = 1; // 勘定科目マスタからBS関係の科目のみ抽出
      v.accounts = alasql("select * from ? where type like 'B%'",[this.accounts]);

      /** step.2 : 勘定科目・分類項目×部門×年度のレコードを持つテーブルを作成
       * v.t01 : 以下のメンバを持つオブジェクトの配列
       * @prop {number} 年度
       * @prop {string} 項目名(勘定科目、集計項目名)
       * @prop {number} 表示順(BSseq)
       * @prop {string} 部門
       * @prop {number} 本体
       * @prop {number} 税額
       * @prop {number} 合計
       */
      v.step = 2.1; // 勘定科目×部門×年度のレコードをv.t01に追加
      // 注意：文字列項目(年度・項目名)は操作不要だが、数値項目(表示順)はmaxが必要
      v.t01 = alasql("select `年度`,`項目名`,max(BSseq) as `表示順`, `部門`"
      + ", sum(`本体`) as `本体`"
      + ", sum(`税額`) as `税額`"
      + ", sum(`合計`) as `合計`"
      + " from ? where BSseq>0"
      + " group by `年度`, `項目名`, `部門`"
      ,[this.daifuku]);

      v.step = 2.2; // 勘定科目×年度(=全部門計)のレコードをv.t01に追加
      v.t02 = alasql("select `年度`,`項目名`,max(BSseq) as `表示順`"
      + ", '全部門計' as `部門`"
      + ", sum(`本体`) as `本体`"
      + ", sum(`税額`) as `税額`"
      + ", sum(`合計`) as `合計`"
      + " from ? where BSseq>0"
      + " group by `年度`, `項目名`, `部門`"
      ,[this.daifuku]);
      v.t01 = [...v.t01,...v.t02];

      v.step = 2.3; // 分類項目×部門×年度のレコードをv.t01に追加
      v.parts = ["select df.`年度`,m2.`名称` as `項目名`,max(m2.BSseq) as `表示順`"
      , ", df.`部門` as `部門`"
      , ", sum(df.`本体`) as `本体`"
      , ", sum(df.`税額`) as `税額`"
      , ", sum(df.`合計`) as `合計`"
      , " from ? as df"
      , " inner join ? as m1 on df.`項目名`=m1.`名称`"
      , " inner join ? as m2 on m1.B1=m2.B1_1"
      , " where m1.type='BA' and m2.type='_2' and df.`合計`<>0"
      , " group by df.`年度`, m2.`名称`, df.`部門`"];
      v.sql = v.parts.join('');
      [
        // 大分類項目の集計
        v.sql.replace('_1','').replace('_2','B1'),
        // 中分類項目の集計
        v.sql.replace('_1',' and m1.B2=m2.B2').replace('_2','B2'),
        // 小分類項目の集計
        v.sql.replace('_1',' and m1.B2=m2.B2 and m1.B3=m2.B3').replace('_2','B3'),
      ].forEach(sql => {
        v.t01 = v.t01.concat(alasql(sql,[this.daifuku,v.accounts,v.accounts]));
      });

      v.step = 2.4; // 分類項目×年度(=全部門計)のレコードをv.t01に追加
      v.parts[1] = ", '全部門計' as `部門`";
      v.parts[9] = " group by df.`年度`, m2.`名称`";
      v.sql = v.parts.join('');
      [
        v.sql.replace('_1','').replace('_2','B1'),
        v.sql.replace('_1',' and m1.B2=m2.B2').replace('_2','B2'),
        v.sql.replace('_1',' and m1.B2=m2.B2 and m1.B3=m2.B3').replace('_2','B3'),
      ].forEach(sql => {
        v.t01 = v.t01.concat(alasql(sql,[this.daifuku,v.accounts,v.accounts]));
      });

      v.step = 2.5; // 表示順の修正、不要項目の削除
      v.t01 = alasql("select * from ?"
      + " where `合計`<>0"
      + " order by `表示順`, `部門`, `年度`"
      ,[v.t01]);
      //this.dumpArea.appendChild(this.dumpObject(v.t01));
      //this.changeScreen('dumpArea');

      /** step.3 : 累計作業用に、v.t01から以下のオブジェクトをv.t03として作成
       * - 項目名 : ex.「普通預金」
       *   - 表示順
       *   - 部門 : 「EF」「CK」「全部門計」等
       *     - 年度 : '2011'等。
       *       - 本体 : 本体金額
       *       - 税額
       *       - 合計
       *     - 年度 : '2012'等。(後略)
       */
      v.step = 3;
      for( v.i=0 ; v.i<v.t01.length ; v.i++ ){
        v.label = v.t01[v.i]['項目名'];
        v.dep = v.t01[v.i]['部門'];
        v.fy = v.t01[v.i]['年度'];
        if( !v.t03.hasOwnProperty(v.label) )
          v.t03[v.label] = {'表示順':v.t01[v.i]['表示順']};
        if( !v.t03[v.label].hasOwnProperty(v.dep) )
          v.t03[v.label][v.dep] = {};
        v.t03[v.label][v.dep][v.t01[v.i]['年度']] = {
          '本体': v.t01[v.i]['本体'],
          '税額': v.t01[v.i]['税額'],
          '合計': v.t01[v.i]['合計'],
        };
      }

      v.step = 4; // v.t03について各項目を累計値に変更、前年比額/率を計算してthis.BSに格納
      this.BS = [];
      Object.keys(v.t03).forEach(label => {
        Object.keys(v.t03[label]).forEach(dep => {
          if( dep !== '表示順' ){ // 「表示順」が項目名直下のメンバとして入っているので除外
            v.last = {'本体':0,'税額':0,'合計':0};
            for( let fy=this.minFy ; fy<=this.maxFy ; fy++ ){
              v.current  = v.t03[label][dep][fy] || {'本体':0,'税額':0,'合計':0};
              v.o = {
                '年度': fy,
                '項目名': label,
                '表示順': v.t03[label]['表示順'],
                '部門': dep,
                '本体': v.last['本体'] + v.current['本体'],
                '本体前比額': v.current['本体'],
                '税額': v.last['税額'] + v.current['税額'],
                '税額前比額': v.current['税額'],
                '合計': v.last['合計'] + v.current['合計'],
                '合計前比額': v.current['合計'],
              };
              if( v.o['本体']> 0 ) v.o['本体前比率'] = v.o['本体'] / v.last['本体'];
              if( v.o['税額']> 0 ) v.o['税額前比率'] = v.o['税額'] / v.last['税額'];
              if( v.o['合計']> 0 ) v.o['合計前比率'] = v.o['合計'] / v.last['合計'];
              this.BS.push(v.o);
              ['本体','税額','合計'].forEach(x => v.last[x]=v.o[x]);
            }
          }
        });
      });

      v.step = 5; // PivotTable.jsにより貸借対照表を作成
      $("div.BSarea").pivotUI(this.BS,{
        rows: ["表示順","項目名"],
        cols: ["年度"],
        vals: ["合計"],
        aggregatorName: 'Integer Sum',
      },false);

      v.step = 5; // 終了処理
      //console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 損益計算書(PL)の年度✖️利益別金額計算
   *
   * {科目名＋年度:合計額, ...}形式のオブジェクトをthis.bpObjとして作成する
   * 先行してcalcBPdetails実行済みのこと。
   */
  addPL = () => {
    const v = {whois:this.className+'.calcBPdetails',rv:null,step:0};
    //console.log(v.whois+' start.');
    try {

      v.step = 1.1; // 勘定科目マスタからBS/PL関係の科目のみ抽出
      v.accounts = alasql("select * from ? where type like 'B%' or type like 'P%'",[this.accounts]);

      v.step = 1.2; // 年度毎の各種利益計算用オブジェクトを作成
      v.fyObj = {};

      v.step = 1.3; // 売上が存在する年度について、売上高のみのオブジェクトを作成
      alasql("select fy, sum(val) as val from ? where ac='売上高' group by fy",[this.bpArr]).forEach(x => {
        v.fyObj[x.fy] = {fy:x.fy,'売上高':x.val,'売上原価':0,
          '販売費および一般管理費':0,'営業外収益':0,'営業外費用':0,
          '特別利益':0,'特別損失':0,'法人税・住民税及び事業税':0,'当期利益':0
        };
      });

      v.step = 2; // BS同様、所属勘定科目の合計値から求める項目行を計算
      v.sql = "select m1.type"
      + ", m1.`名称` as `分類名`"   // PL上の項目名
      + ", m2.`名称` as `所属科目`" // debug用
      + ", bp.fy, bp.val"
      + " from ? as m1"
      + " inner join ? as m2 on m1.P1=m2.P1 and m1.P2=m2.P2"
      + " inner join ? as bp on m2.`名称`=bp.ac"
      + " where m1.type='P2' and m2.type='PA' and bp.val<>0";
      v.t02 = alasql(v.sql,[v.accounts,v.accounts,this.bpArr]);

      v.step = 3; // bpArrの計算
      v.bpArr = alasql("select"
      + " `分類名` as ac"
      + ", fy"
      + ", sum(val) as val"
      + " from ?"
      + " group by `分類名`,fy"
      ,[v.t02]);
      this.bpArr = this.bpArr.concat(v.bpArr);
      //this.dump.appendChild(this.dumpObject(v.bpArr));
      //this.dump.appendChild(this.dumpObject(v.bpArr));
      //this.changeScreen('dump');

      v.step = 4; // bpArrの値をv.fyObjに反映させる
      v.bpArr.forEach(x => {
        v.fyObj[x.fy][x.ac] = x.val;
      });

      v.step = 5; // 年度ごとの各種利益を計算
      Object.keys(v.fyObj).forEach(fy => {
        v.fyObj[fy]['売上総利益'] = v.fyObj[fy]['売上高'] - v.fyObj[fy]['売上原価'];
        v.fyObj[fy]['営業利益'] = v.fyObj[fy]['売上総利益'] - v.fyObj[fy]['販売費および一般管理費'];
        v.fyObj[fy]['経常利益'] = v.fyObj[fy]['営業利益'] + v.fyObj[fy]['営業外収益'] - v.fyObj[fy]['営業外費用'];
        v.fyObj[fy]['税前利益'] = v.fyObj[fy]['経常利益'] - v.fyObj[fy]['特別利益'] - v.fyObj[fy]['特別損失'];
        if( v.fyObj[fy]['当期利益'] === 0 )
          v.fyObj[fy]['当期利益'] = v.fyObj[fy]['税前利益'] - v.fyObj[fy]['法人税・住民税及び事業税'];
      });
      
      v.step = 6; // bpObjへの格納
      v.bpObj = {}; // debug用
      Object.keys(v.fyObj).forEach(fy => {
        Object.keys(v.fyObj[fy]).forEach(ac => {
          v.bpObj[ac+fy] = this.bpObj[ac+fy] = v.fyObj[fy][ac];
          this.bpArr.push({ac:ac,fy:fy,val:v.fyObj[fy][ac]});
        });
      });

      v.step = 7; // 終了処理
      //console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

}