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
 * @prop {string} 科目
 * @prop {string} 補助科目
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
 * @typedef {Object} kzData
 * @prop {number} 年度
 * @prop {string} 取引日
 * @prop {Date} date
 * @prop {string} 項目名 - 勘定科目または集計項目名
 * @prop {string} 部門
 * @prop {number} 本体
 * @prop {number} 税額
 * @prop {number} 合計
 * @prop {number} 表示順
 * @prop {number} 前年比額
 * @prop {number} 前年比率
 */
class KawaZanyo extends BasePage {
  /**
   * @constructor
   * @param {Object} raw - Googleスプレッド「仕訳日記帳」からkzData.jsとしてDLしたデータ
   * @param {account[]} raw.accounts - 勘定科目マスタ
   * @param {journal[]} raw.journals - 仕訳日記帳
   * @param {Object} opt
   * 
   * @desc
   * 
   * #### 使用するクラス変数
   * 
   * 1. this.accounts {account[]} - 勘定科目マスタ
   * 1. this.journals {journal[]} - 仕訳帳明細
   * 1. this.daifuku {daifuku[]} - 大福帳
   *    - 仕訳明細帳の借方・貸方をそれぞれ別レコードとして登録
   *    - BS/PLの分類・計算項目を追加(ex.資産の部、営業外利益)
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
    console.log(v.whois+' start.');
    try {
      v.r = super(v.def,opt);

      v.step = 1; // 勘定科目マスタ(raw.accounts)のthis.accountsへの格納
      v.r = this.genAccount(raw.accounts);
      if( v.r instanceof Error ) throw v.r;
      console.log('this.accounts=%s\nthis.account=%s',JSON.stringify(this.accounts),JSON.stringify(this.account));

      v.step = 2; // 仕訳帳明細(this.journals)のthis.journalsへの格納
      v.r = this.genJournals(raw.journals);
      if( v.r instanceof Error ) throw v.r;
      console.log('fy=%s〜%s\nthis.journals=%s',this.minFy,this.maxFy,JSON.stringify(this.journals));

      v.step = 3; // 仕訳帳データを大福帳に追加
      v.r = this.genDaifuku();
      if( v.r instanceof Error ) throw v.r;
      console.log('this.daifuku=%s',JSON.stringify(this.daifuku));
      this.dumpArea.appendChild(this.dumpObject(this.daifuku));
      this.changeScreen('dumpArea');

      /*
      v.step = 4.1; // BSの分類別金額を大福帳に追加
      v.r = this.addBS();
      if( v.r instanceof Error ) throw v.r;
      v.step = 4.2; // PLの各段階利益等、計算項目を大福帳に追加
      v.r = this.addPL();
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.1; // BSの表示
      */

      v.step = 10; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    }
  }

  /** 勘定科目マスタの作成(this.accounts,this.account)
   * 格納時、typeを追加する。
   */
  genAccount = (raw) => {
    const v = {whois:this.className+'.genAccount',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // this.accounts(複数形)：配列形式の作成
      this.accounts = [];
      [
        "select *,'B1' as type, B1*1000000 as BSseq, 0 as PLseq, 0 as CFseq from ? where B1 is not null and B2 is null and BS is null",
        "select *,'B2' as type, B1*1000000+B2*10000 as BSseq, 0 as PLseq, 0 as CFseq from ? where B1 is not null and B2 is not null and B3 is null and BS is null",
        "select *,'B3' as type, B1*1000000+B2*10000+B3*100 as BSseq, 0 as PLseq, 0 as CFseq from ? where B1 is not null and B2 is not null and B3 is not null and BS is null",
        "select *,'BA' as type, B1*1000000+B2*10000+B3*100+BS as BSseq, 0 as PLseq, 0 as CFseq from ? where BS is not null",
        "select *,'P1' as type, 0 as BSseq, P1*1000000 as PLseq, 0 as CFseq from ? where P1 is not null and P2 is null and PS is null",
        "select *,'P2' as type, 0 as BSseq, P1*1000000+P2*10000 as PLseq, 0 as CFseq from ? where P1 is not null and P2 is not null and P3 is null and PS is null",
        //"select *,'P3' as type, 0 as BSseq, P1*1000000+P2*10000+P3*100 as PLseq, 0 as CFseq from ? where P1 is not null and P2 is not null and P3 is not null and PS is null",
        "select *,'PA' as type, 0 as BSseq, P1*1000000+P2*10000+PS as PLseq, 0 as CFseq from ? where PS is not null",
        "select *,'C1' as type, 0 as BSseq, 0 as PLseq, C1*1000000 as CFseq from ? where C1 is not null and C2 is null and CS is null",
        "select *,'C2' as type, 0 as BSseq, 0 as PLseq, C1*1000000+C2*10000 as CFseq from ? where C1 is not null and C2 is not null and C3 is null and CS is null",
        //"select *,'C3' as type, 0 as BSseq, 0 as PLseq, C1*1000000+C2*10000+C3*100 as CFseq from ? where C1 is not null and C2 is not null and C3 is not null and CS is null",
        "select *,'CA' as type, 0 as BSseq, 0 as PLseq, C1*1000000+C2*10000+CS as CFseq from ? where CS is not null",
      ].forEach(sql => {
        this.accounts = this.accounts.concat(alasql(sql,[raw]));
      });

      v.step = 2; // this.account(単数形)：勘定科目名->account Objへの参照
      this.account = {};
      raw.forEach(x => {
        this.account[x['名称']] = x;
      });

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 仕訳日記帳データの作成 */
  genJournals = (raw) => {
    const v = {whois:'prototype',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      this.journals = raw;
      this.minFy = Infinity;  // 仕訳日記帳に存在する会計年度の最小値
      this.maxFy = -Infinity; // 同最大値

      // 取引日(Date型)を文字列に変換
      this.journals.forEach(x => {
        x.date = new DateEx(x['取引日']);
        x['取引日'] = x.date.toLocale();
        v.fy = x['会計年度'];
        if( v.fy < this.minFy ) this.minFy = v.fy;
        if( this.maxFy < v.fy ) this.maxFy = v.fy;
      });

      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
    

  }

  /** 大福帳の作成 */
  genDaifuku = () => {
    const v = {whois:this.className+'.genDaifuku',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 勘定科目マスタからBS/PL関係の科目のみ抽出
      v.accounts = alasql("select * from ? where type like 'B%' or type like 'P%'",[this.accounts]);

      v.step = 2.1; // 借方の抽出
      v.sql = "select `会計年度` as `年度`"
      + ", `伝票番号`"
      + ", `行番号`"
      + ", '借方' as `所属`"
      + ", `取引日`"
      + ", date"
      + ", `摘要`"
      + ", `補助摘要`"
      + ", `借方科目` as `科目`"
      + ", `借方補助` as `補助科目`"
      + ", `借方部門` as `部門`"
      + ", case when aMst.`本籍`='借' then `借方本体` else `借方本体`*-1 end as `本体`"
      + ", `借方区分` as `税区分`"
      + ", `借方税率` as `税率`"
      + ", case when aMst.`本籍`='借' then `借方税額` else `借方税額`*-1 end as `税額`"
      + ", case when aMst.`本籍`='借' then `借方合計` else `借方合計`*-1 end as `合計`"
      + ", aMst.BSsql"
      + ", aMst.PLsql"
      + ", aMst.CFsql"
      + " from ? as jMst"
      + " inner join ("
      + " select * from ?"
      + ") as aMst on jMst.`借方科目` = aMst.`名称`";
      v.kari = alasql(v.sql,[this.journals,v.accounts]);
      //v.debug = alasql("select * from ? where `名称`='資本金'",[v.accounts]);
      //console.log('v.accounts=%s',JSON.stringify(v.debug));

      v.step = 2; // 貸方の抽出
      v.kashi = alasql(v.sql.replaceAll(/借/g,'貸'),[this.journals,v.accounts]);
      //v.debug = alasql("select * from ? where `科目`='資本金'",[v.kashi]);
      //console.log('v.kashi=%s',JSON.stringify(v.debug));

      v.step = 3; // メンバ変数に格納
      this.daifuku = alasql("select * from ? order by `取引日`,`伝票番号`,`行番号`",
      [[...v.kari,...v.kashi]]);

      /*
      v.debug = alasql("select * from ? where `科目`='資本金'",[this.daifuku]);
      console.log('v.debug=%s',JSON.stringify(v.debug));
      */

      v.step = 4; // 終了処理
      console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 貸借対照表(BS)の年度✖️分類別金額計算
   *
   * {科目名＋年度:合計額, ...}形式のオブジェクトをthis.bpObjとして作成する。
   * 先行してcalcBPdetails実行済みのこと。
   */
  addBS = () => {
    const v = {whois:this.className+'.addBS',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1.1; // 勘定科目マスタからBS/PL関係の科目のみ抽出
      v.accounts = alasql("select * from ? where type like 'B%' or type like 'P%'",[this.accounts]);

      v.step = 1.2; // 分類項目と勘定科目ごとの集計を紐付け
      v.t01 = [];
      [
        // BSの大分類項目
        "select m1.type"
        + ", m1.`名称` as `分類名`"   // BS上の項目名
        + ", m2.`名称` as `所属科目`" // debug用
        + ", bp.fy, bp.val"
        + " from ? as m1"
        + " inner join ? as m2 on m1.B1=m2.B1"
        + " inner join ? as bp on m2.`名称`=bp.ac"
        + " where m1.type='B1' and m2.type='BA' and bp.val<>0",
        // BSの中分類項目
        "select m1.type"
        + ", m1.`名称` as `分類名`"   // BS上の項目名
        + ", m2.`名称` as `所属科目`" // debug用
        + ", bp.fy, bp.val"
        + " from ? as m1"
        + " inner join ? as m2 on m1.B1=m2.B1 and m1.B2=m2.B2"
        + " inner join ? as bp on m2.`名称`=bp.ac"
        + " where m1.type='B2' and m2.type='BA' and bp.val<>0",
        // BSの小分類項目
        "select m1.type"
        + ", m1.`名称` as `分類名`"   // BS上の項目名
        + ", m2.`名称` as `所属科目`" // debug用
        + ", bp.fy, bp.val"
        + " from ? as m1"
        + " inner join ? as m2 on m1.B1=m2.B1 and m1.B2=m2.B2 and m1.B3=m2.B3"
        + " inner join ? as bp on m2.`名称`=bp.ac"
        + " where m1.type='B3' and m2.type='BA' and bp.val<>0",
      ].forEach(sql => {
        v.t01 = v.t01.concat(alasql(sql,[v.accounts,v.accounts,this.bpArr]));
      });

      v.step = 2; // 分類項目×年度で集計
      v.t02 = alasql("select"
      + " `分類名` as ac"
      + ", fy"
      + ", sum(val) as val"
      + " from ?"
      + " group by `分類名`,fy"
      ,[v.t01]);
      this.bpArr = this.bpArr.concat(v.t02);

      v.step = 3; // this.bpObjへの格納
      v.o = {}; // debug用
      v.t02.forEach(x => {
        this.bpObj[x.ac+x.fy] = x.val;
        v.o[x.ac+x.fy] = x.val;
      })

      v.step = 4; // 各科目・分類項目について累計値を計算
      v.sql = "select `名称` as ac from ? as mst"
      + " inner join (select ac from ? group by ac) as bpArr"
      + " on mst.`名称`=bpArr.ac"
      + " where mst.type like 'B%'";
      v.t03 = alasql(v.sql,[v.accounts,this.bpArr]);
      console.log('v.t03=%s',JSON.stringify(v.t03));
      for( v.i=0 ; v.i<v.t03.length ; v.i++ ){
        v.ac = v.t03[v.i].ac;
        for( v.j=this.minFy ; v.j<=this.maxFy ; v.j++ ){
          this.bpObj[v.ac+v.j] = (this.bpObj[v.ac+(v.j-1)] || 0) + (this.bpObj[v.ac+v.j] || 0);
        }
      }

      v.step = 5; // 終了処理
      console.log(v.whois+' normal end.');
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
    console.log(v.whois+' start.');
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
      this.dump.appendChild(this.dumpObject(v.bpArr));
      this.changeScreen('dump');

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
      console.log(v.whois+' normal end.');
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

}