function test(){
  const v = {whois:'test',step:0,rv:null,
    // ----- 定数・ユーティリティ関数群
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName) => {  // テスト用シートの削除関数
      v.sheet = v.spread.getSheetByName(sheetName);
      if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    },
    raw2obj: sheet => { // シートイメージ(二次元配列)を行オブジェクトに変換
      v.data = JSON.parse(JSON.stringify(v.src[sheet].values));
      v.src[sheet].values = [];
      for( v.i=1 ; v.i<v.data.length ; v.i++ ){
        v.o = {};
        for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
          if( v.data[v.i][v.j] ) v.o[v.data[0][v.j]] = v.data[v.i][v.j];
        }
        v.src[sheet].values.push(v.o);
      }
    },
    // ----- テスト用ソース(サンプルデータ)
    src: {
      target: { // "target"シート
        name: 'target',
        range: 'target!c3:f',
        values: [
          ['string','boolean','date','number'],
          ['a',undefined,'1965/9/5',-1],
          ['tRue',null,'12:34',Infinity],
          ['{"a":10}',false,Date.now(),0],
          ['d',true,new Date(),1.23e+4],
        ],
        cols: null,
      },
      master: { // "master"シート
        name: 'master',
        // range指定は無し
        account: 'hoge',
        values: [
          ['タイムスタンプ','メールアドレス','申込者氏名','申込者カナ','申込者の参加','宿泊、テント','引取者氏名','参加者01氏名','参加者01カナ','参加者01所属','参加者02氏名','参加者02カナ','参加者02所属','参加者03氏名','参加者03カナ','参加者03所属','参加者04氏名','参加者04カナ','参加者04所属','参加者05カナ','参加者05氏名','参加者05所属','緊急連絡先','ボランティア募集','備考','キャンセル','authority','CPkey','entryNo','trial','editURL','entryTime','receptionist','fee00','fee01','fee02','fee03','fee04','fee05','memo'],
          ['2024/10/06 19:51:06','nakaone.kunihiro@gmail.com','島津　邦浩','シマヅ　クニヒロ','スタッフとして申込者のみ参加(おやじの会メンバ)','宿泊しない','','','','','','','','','','','','','','','','','','','','','2','jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=','1','{"passcode":920782,"created":1728874149915,"result":0,"log":[{"timestamp":1728874165893,"enterd":920782,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_ePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE','','','','','','','','',''],
          ['2024/09/15 12:47:04','via1315r@yahoo.co.jp','前田　素直','マエダ　スナオ','参加予定(宿泊なし)','宿泊しない','宿泊予定なので不要','前田　若菜','マエダ　ワカナ','1年生','','','','','','','','','','','','','9013357002','できる','食事以外でも、お手伝い出来る事があれば。','','1','','2','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_dWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo','','','','','','','','',''],
          ['2024/09/15 13:51:37','kousuke.murata4690@gmail.com','小早川　晃祐','コバヤカワ　コウスケ','参加予定(宿泊あり)','宿泊する(テントあり)','宿泊予定なので不要','小早川　涼','コバヤカワ　リョウ','6年生','','','','','','','','','','','','','','できる','','','1','','3','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_fKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk','','','','','','','','',''],
          ['2024/09/15 14:18:02','nakaone2001@gmail.com','島津　弘子','シマヅ　ヒロコ','参加予定(宿泊なし)','宿泊しない','','島津　悠奈','シマヅ　ユウナ','4年生','','','','','','','','','','','','','','','','','2','k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=','4','{"passcode":65698,"created":1729076868102,"result":0,"log":[{"timestamp":1728729400367,"enterd":119192,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_eGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI','','','','','','','','',''],
        ],
        cols: [
          {name:'タイムスタンプ',type:'Date'},
          {name:'メールアドレス',type:'string',unique:true},
          {name:'申込者氏名',type:'string'},
          {name:'申込者カナ',type:'string'},
          {name:'申込者の参加',type:'string'},
          {name:'宿泊、テント',type:'string'},
          {name:'引取者氏名',type:'string'},
          {name:'参加者01氏名',type:'string'},
          {name:'参加者01カナ',type:'string'},
          {name:'参加者01所属',type:'string'},
          {name:'参加者02氏名',type:'string'},
          {name:'参加者02カナ',type:'string'},
          {name:'参加者02所属',type:'string'},
          {name:'参加者03氏名',type:'string'},
          {name:'参加者03カナ',type:'string'},
          {name:'参加者03所属',type:'string'},
          {name:'参加者04氏名',type:'string'},
          {name:'参加者04カナ',type:'string'},
          {name:'参加者04所属',type:'string'},
          {name:'参加者05カナ',type:'string'},
          {name:'参加者05氏名',type:'string'},
          {name:'参加者05所属',type:'string'},
          {name:'緊急連絡先',type:'string'},
          {name:'ボランティア募集',type:'string'},
          {name:'備考',type:'string'},
          {name:'キャンセル',type:'string'},
          {name:'authority',type:'number'},
          {name:'CPkey',type:'string'},
          {name:'entryNo',type:'number',primaryKey:true,auto_increment:[10,1]},
          {name:'trial',type:'JSON'},
          {name:'editURL',type:'string'},
          {name:'entryTime',type:'string'},
          {name:'receptionist',type:'string'},
          {name:'fee00',type:'string'},
          {name:'fee01',type:'string'},
          {name:'fee02',type:'string'},
          {name:'fee03',type:'string'},
          {name:'fee04',type:'string'},
          {name:'fee05',type:'string'},
          {name:'memo',type:'string'},
        ],
      },
      multi: () => {  // 1シート複数テーブル用のシートを作成
        v.deleteSheet('multi');
        new SpreadDB({
          name: 'multi',
          values: [
            ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH"],
            ["※「エラー」「CF存否」欄と勘定科目増減による表記ずれをチェック","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
            ["使用科目一覧","","","","","","","貸借対照表 勘定科目・集計項目一覧","","","","","","","","","","","損益計算書 勘定科目・集計項目一覧","","","","","","","","","キャッシュ・フロー計算書 勘定科目・集計項目一覧","","","","","",""],
            ["実績","読替","BS存否","PL存否","エラー","CF存否","","大","中","小","勘定科目","一覧存否","L1","L2","L3","SQ","本籍","","大","中","勘定科目","一覧存否","L1","L2","SQ","本籍","","大","中","勘定科目","一覧存否","L1","L2","SQ"],
            ["(営外)貸倒損失","貸倒損失",-1,56,false,69,"","資産の部","","","","",1,"","","","","","売上高","","","",1,"","","","","現金または現金同等物","","","",1,"",""],
            ["事務用品費","事務用品費",-1,33,false,20,"","","流動資産","","","",1,1,"","","","","","売上高","","",1,1,"","","","","","普通預金",41,1,"",1],
            ["交際費","交際費",-1,24,false,21,"","","","","現金",56,1,1,"",1,"借","","","","売上高",22,1,1,1,"貸","","","","現金",56,1,"",2],
            ["会議費","会議費",-1,23,false,22,"","","","","小口現金",-1,1,1,"",2,"借","","","売上原価","","",1,2,"","","","","","諸口","",1,"",3],
            ["保証金","差入保証金",44,-1,false,54,"","","","","当座預金",-1,1,1,"",3,"借","","","","仕入高",-1,1,2,1,"借","","営業キャッシュフロー","","","",2,"",""],
            ["保険料","保険料",-1,37,false,23,"","","","","普通預金",41,1,1,"",4,"借","","","","仕入値引高",-1,1,2,2,"借","","","","当期利益",32,2,"",1],
            ["修繕費","修繕費",-1,31,false,24,"","","","","定期預金",-1,1,1,"",5,"借","","","","仕入割戻し高",-1,1,2,3,"借","","","","売上高",22,2,"",2],
            ["利益剰余金","利益剰余金",79,-1,false,72,"","","","","定期積金",-1,1,1,"",6,"借","","売上総利益","","","",2,"","","","","","","売掛金",23,2,"",3],
            ["前受金","前受金",63,-1,false,46,"","","","","受取手形",-1,1,1,"",7,"借","","","販売費および一般管理費","","",2,1,"","","","","","雑収入",33,2,"",4],
            ["前払金","前払金",20,-1,false,47,"","","","","売掛金",23,1,1,"",8,"借","","","","役員報酬",35,2,1,1,"借","","","","雑損失",69,2,"",5],
            ["前払費用","前払金",20,-1,false,47,"","","","","有価証券",-1,1,1,"",9,"借","","","","給料",-1,2,1,2,"借","","","販管費","","",2,1,""],
            ["前渡金","前払金",20,-1,false,47,"","","","","商品",-1,1,1,"",10,"借","","","","賞与",-1,2,1,3,"借","","","","役員報酬",35,2,1,1],
            ["受取利息","受取利息",-1,45,false,37,"","","","","製品",-1,1,1,"",11,"借","","","","退職金",-1,2,1,4,"借","","","","外注費",24,2,1,2],
            ["固定資産売却益","固定資産売却益",-1,60,false,64,"","","","","仕掛品",-1,1,1,"",12,"借","","","","法定福利費",52,2,1,5,"借","","","","地代家賃",21,2,1,3],
            ["土地","土地",38,-1,false,61,"","","","","原材料",-1,1,1,"",13,"借","","","","福利厚生費",57,2,1,6,"借","","","","事務用品費",7,2,1,4],
            ["地代家賃","地代家賃",-1,29,false,19,"","","","","貯蔵品",-1,1,1,"",14,"借","","","","販売促進費",-1,2,1,7,"借","","","","交際費",8,2,1,5],
            ["売上高","売上高",-1,6,false,12,"","","","","前払金",15,1,1,"",15,"借","","","","外注費",24,2,1,8,"借","","","","会議費",9,2,1,6],
            ["売掛金","売掛金",13,-1,false,13,"","","","","立替金",59,1,1,"",16,"借","","","","広告宣伝費",29,2,1,9,"借","","","","保険料",11,2,1,7],
            ["外注管理費","外注費",-1,20,false,18,"","","","","未収金",42,1,1,"",17,"借","","","","荷造運賃",-1,2,1,10,"借","","","","修繕費",12,2,1,8],
            ["寄付金","寄附金",-1,25,false,36,"","","","","仮払金",-1,1,1,"",18,"借","","","","会議費",9,2,1,11,"借","","","","工具器具備品",27,2,1,9],
            ["寄附金","寄附金",-1,25,false,36,"","","","","短期貸付金",-1,1,1,"",19,"借","","","","交際費",8,2,1,12,"借","","","","広告宣伝費",29,2,1,10],
            ["工具器具備品","工具器具備品",35,-1,false,25,"","","","","仮払消費税",-1,1,1,"",20,"借","","","","寄附金",25,2,1,13,"借","","","","新聞図書費",39,2,1,11],
            ["差入保証金","差入保証金",44,-1,false,54,"","","","","仮払法人税等",-1,1,1,"",21,"借","","","","旅費交通費",40,2,1,14,"借","","","","旅費交通費",40,2,1,12],
            ["広告宣伝費","広告宣伝費",-1,21,false,26,"","","","","預け金",71,1,1,"",22,"借","","","","通信費",63,2,1,15,"借","","","","水道光熱費",48,2,1,13],
            ["建物","建物",30,-1,false,62,"","","固定資産","","","",1,2,"","","","","","","新聞図書費",39,2,1,16,"借","","","","支払報酬料",37,2,1,14],
            ["建物附属設備","建物附属設備",31,-1,false,63,"","","","有形固定資産","","",1,2,1,"","","","","","地代家賃",21,2,1,17,"借","","","","支払手数料",38,2,1,15],
            ["当期利益","当期利益",-1,74,false,11,"","","","","建物",30,1,2,1,1,"借","","","","水道光熱費",48,2,1,18,"借","","","","福利厚生費",57,2,1,16],
            ["役務収益","雑収入",-1,50,false,14,"","","","","建物附属設備",31,1,2,1,2,"借","","","","修繕費",12,2,1,19,"借","","","","消耗品費",53,2,1,17],
            ["役員借入金","役員借入金",58,-1,false,68,"","","","","構築物",-1,1,2,1,3,"借","","","","消耗品費",53,2,1,20,"借","","","","通信費",63,2,1,18],
            ["役員報酬","役員報酬",-1,13,false,17,"","","","","車両運搬具",-1,1,2,1,4,"借","","","","事務用品費",7,2,1,21,"借","","","","諸会費",60,2,1,19],
            ["支払利息","支払利息",-1,52,false,38,"","","","","機械装置",-1,1,2,1,5,"借","","","","賃借料",-1,2,1,22,"借","","","","寄附金",25,2,1,20],
            ["支払報酬料","支払報酬料",-1,35,false,30,"","","","","工具器具備品",27,1,2,1,6,"借","","","","支払報酬料",37,2,1,22,"借","","","","受取利息",18,2,1,21],
            ["支払手数料","支払手数料",-1,36,false,31,"","","","","一括償却資産",-1,1,2,1,7,"借","","","","支払手数料",38,2,1,22,"借","","","","支払利息",36,2,1,22],
            ["新聞図書費","新聞図書費",-1,28,false,27,"","","","","リース資産",-1,1,2,1,8,"借","","","","保険料",11,2,1,23,"借","","","","雑費",70,2,1,23],
            ["旅費交通費","旅費交通費",-1,26,false,28,"","","","","土地",20,1,2,1,9,"借","","","","租税公課",58,2,1,24,"借","","","租税公課","","",2,2,""],
            ["普通預金","普通預金",9,-1,false,7,"","","","","減価償却累計額",54,1,2,1,10,"借","","","","諸会費",60,2,1,26,"借","","","","租税公課",58,2,2,1],
            ["未収還付法人税等","未収金",22,-1,false,50,"","","","無形固定資産","","",1,2,2,"","","","","","雑費",70,2,1,27,"借","","","","法人税等",49,2,2,2],
            ["未収収益","未収金",22,-1,false,50,"","","","","ソフトウェア",-1,1,2,2,1,"借","","","","減価償却費",55,2,1,25,"借","","","","未払法人税等",45,2,2,3],
            ["未収入金","未収金",22,-1,false,50,"","","","","特許権",-1,1,2,2,2,"借","","","","長期前払費用償却",66,2,1,25,"借","","","","法定福利費",52,2,2,4],
            ["未払法人税等","未払法人税等",70,-1,false,43,"","","","投資その他","","",1,2,3,"","","","営業利益","","","",3,"","","","","","支払・回収","","",2,3,""],
            ["未払費用","未払金",62,-1,false,51,"","","","","差入保証金",10,1,2,3,1,"借","","","営業外収益","","",3,1,"","","","","","前受金",14,2,3,1],
            ["未払金","未払金",62,-1,false,51,"","","","","保険積立金",-1,1,2,3,2,"借","","","","受取利息",18,3,1,1,"貸","","","","前払金",15,2,3,2],
            ["水道光熱費","水道光熱費",-1,30,false,29,"","","","","投資有価証券",-1,1,2,3,3,"借","","","","受取配当金",-1,3,1,2,"貸","","","","立替金",59,2,3,3],
            ["法人税、住民税及び事業税","法人税等",-1,72,false,42,"","","","","長期貸付金",-1,1,2,3,4,"借","","","","有価証券売却益",-1,3,1,3,"貸","","","","預り敷金・保証金",72,2,3,4],
            ["法人税等","法人税等",-1,72,false,42,"","","","","長期前払費用",65,1,2,3,5,"借","","","","有価証券評価益",-1,3,1,4,"貸","","","","未収金",42,2,3,5],
            ["法人税･住民税及び事業税","法人税等",-1,72,false,42,"","","","","出資金",-1,1,2,3,6,"借","","","","為替差益",-1,3,1,5,"貸","","","","未払金",46,2,3,6],
            ["法定福利費","法定福利費",-1,17,false,44,"","","","","繰延資産",-1,1,2,3,7,"借","","","","雑収入",33,3,1,6,"貸","","","","預け金",71,2,3,7],
            ["消耗品費","消耗品費",-1,32,false,33,"","","","","創立費",-1,1,2,3,8,"借","","","営業外費用","","",3,2,"","","","","","預り金",75,2,3,8],
            ["減価償却累計額","減価償却累計額",39,-1,false,59,"","","","","開業費",-1,1,2,3,9,"借","","","","支払利息",36,3,2,1,"借","","","","差入保証金",10,2,3,9],
            ["減価償却費","減価償却費",-1,41,false,58,"","","繰延資産","","","",1,3,"","","","","","","有価証券評価損",-1,3,2,2,"借","","","償却","","",2,4,""],
            ["現金","現金",6,-1,false,8,"","","","","創立費",-1,1,3,"",1,"借","","","","創立費償却",-1,3,2,3,"借","","","","長期前払費用",65,2,4,1],
            ["福利厚生費","福利厚生費",-1,18,false,32,"","","","","開業費",-1,1,3,"",2,"借","","","","開業費償却",-1,3,2,4,"借","","","","長期前払費用償却",66,2,4,2],
            ["租税公課","租税公課",-1,38,false,41,"","負債の部","","","","",2,"","","","","","","","貸倒損失",6,3,2,5,"借","","","","減価償却費",55,2,4,3],
            ["立替金","立替金",21,-1,false,48,"","","流動負債","","","",2,1,"","","","","","","雑損失",69,3,2,6,"借","","","","減価償却累計額",54,2,4,4],
            ["諸会費","諸会費",-1,39,false,35,"","","","","役員借入金",34,2,1,"",1,"貸","","経常利益","","","",4,"","","","","投資キャッシュフロー","","","",3,"",""],
            ["資本準備金","資本剰余金",78,-1,false,71,"","","","","支払手形",-1,2,1,"",2,"貸","","","特別利益","","",4,1,"","","","","","土地",20,3,"",1],
            ["資本金","資本金",77,-1,false,70,"","","","","買掛金",-1,2,1,"",3,"貸","","","","固定資産売却益",19,4,1,1,"貸","","","","建物",30,3,"",2],
            ["通信費","通信費",-1,27,false,34,"","","","","短期借入金",-1,2,1,"",4,"貸","","","","投資有価証券売却益",-1,4,1,2,"貸","","","","建物附属設備",31,3,"",3],
            ["長期借入金","長期借入金",72,-1,false,67,"","","","","未払金",46,2,1,"",5,"貸","","","","貸倒引当金戻入額",-1,4,1,3,"貸","","","","固定資産売却益",19,3,"",4],
            ["長期前払費用","長期前払費用",48,-1,false,56,"","","","","前受金",14,2,1,"",6,"貸","","","特別損失","","",4,2,"","","","フリーキャッシュフロー","","","",4,"",""],
            ["長期前払費用償却","長期前払費用償却",-1,42,false,57,"","","","","預り金",75,2,1,"",7,"貸","","","","固定資産売却損",-1,4,2,1,"借","","財務キャッシュフロー","","","",5,"",""],
            ["附属設備","建物附属設備",31,-1,false,63,"","","","","仮受金",-1,2,1,"",8,"貸","","","","固定資産除却損",-1,4,2,2,"借","","","","長期借入金",64,5,"",1],
            ["雑収入","雑収入",-1,50,false,14,"","","","","前受収益",-1,2,1,"",9,"貸","","","","投資有価証券売却損",-1,4,2,3,"借","","","","役員借入金",34,5,"",2],
            ["雑損失","雑損失",-1,57,false,15,"","","","","未払費用",-1,2,1,"",10,"貸","","税前利益","","","",5,"","","","","","","貸倒損失",6,5,"",3],
            ["雑費","雑費",-1,40,false,39,"","","","","仮受消費税",-1,2,1,"",11,"貸","","","法人税・住民税及び事業税","","",5,1,"","","","","","資本金",62,5,"",4],
            ["預け金","預け金",27,-1,false,52,"","","","","未払消費税等",-1,2,1,"",12,"貸","","","","法人税",-1,5,1,1,"借","","","","資本剰余金",61,5,"",5],
            ["預り保証金","預り敷金・保証金",73,-1,false,49,"","","","","未払法人税等",45,2,1,"",13,"貸","","","","住民税",-1,5,1,2,"借","","","","利益剰余金",13,5,"",6],
            ["預り敷金","預り敷金・保証金",73,-1,false,49,"","","固定負債","","","",2,2,"","","","","","","事業税",-1,5,1,3,"借","","期首残高","","","",6,"",""],
            ["預り敷金・保証金","預り敷金・保証金",73,-1,false,49,"","","","","長期借入金",64,2,2,"",1,"貸","","","","法人税等",49,5,1,4,"借","","期中増減","","","",7,"",""],
            ["預り金","預り金",64,-1,false,53,"","","","","預り敷金・保証金",72,2,2,"",2,"貸","","当期利益","","","",6,"","","","","期末残高","","","",8,"",""],
            ["","","","","","","","","","","退職給付引当金",-1,2,2,"",3,"貸","","","","当期利益",32,6,"",1,"借","","","","","","","",""],
            ["","","","","","","","純資産の部","","","","",3,"","","","","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","株主資本",-1,3,"","",1,"貸","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","資本金",62,3,"","",2,"貸","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","資本剰余金",61,3,"","",3,"貸","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","利益剰余金",13,3,"","",4,"貸","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","評価・換算差額等",-1,3,"","",5,"貸","","","","","","","","","","","","","","","","",""],
            ["","","","","","","","","","","新株予約権",-1,3,"","",6,"貸","","","","","","","","","","","","","","","","",""],
          ],
        });
      },
      accounts: {  // multi内「勘定科目一覧」
        name: 'accounts',
        range: 'multi!a5:f',
      },
      BS: {  // multi内「貸借対照表 勘定科目・集計項目一覧」
        name: 'BS',
        range: 'multi!h5:q',
      },
      PL: {  // multi内「損益計算書 勘定科目・集計項目一覧」
        name: 'PL',
        range: 'multi!s5:z',
      },
      CF: {  // multi内「CF計算書 勘定科目・集計項目一覧」
        name: 'CF',
        range: 'multi!ab5:ah',
      },
      append: [ // appendメソッド用の引数
        // 00: 基本
        {タイムスタンプ: toLocale(new Date()),メールアドレス: `x${Date.now()}@gmail.com`},
      ],
    },
  };
  const pattern = { // テストパターン(関数)の定義
    constructor: [  // constructor関係のテスト
      () => { // "target"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.src.target);
      },
      () => { // "master"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.src.master);
      },
      () => { // "target","master"シートを行オブジェクトから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        // シートイメージから行オブジェクトへ変換
        ['target','master'].forEach(sheet => v.raw2obj(sheet));
        new SpreadDB([v.src.target,v.src.master]);
      },
      () => { // 既存シートのスキーマ他、各種属性設定状況を確認
        // spread {Spreadsheet} スプレッドシートオブジェクト
        // name {string} テーブル名
        // range {string} A1記法の範囲指定
        // sheetName {string} シート名
        // sheet {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        // schema {sdbSchema} シートの項目定義
        //    cols {sdbColumn[]} 項目定義オブジェクトの配列
        //       name {string} 項目名
        //       type {string} データ型。string,number,boolean,Date,JSON,UUID
        //       format {string} 表示形式。type=Dateの場合のみ指定
        //       options {string} 取り得る選択肢(配列)のJSON表現。ex. ["未入場","既収","未収","無料"]
        //       default {any} 既定値
        //       primaryKey {boolean}=false 一意キー項目ならtrue
        //       unique {boolean}=false primaryKey以外で一意な値を持つならtrue
        //       auto_increment {bloolean|null|number|number[]}=false 自動採番項目。
        //         null ⇒ 自動採番しない
        //         boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
        //         number ⇒ 自動採番する(基数=指定値,増減値=1)
        //         number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
        //       suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
        //       note {string} 本項目に関する備考。create table等では使用しない
        //    primaryKey {string}='id' 一意キー項目名
        //    unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
        //    auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
        //      base {number} 基数
        //      step {number} 増減値
        //      current {number} 現在の最大(小)値。currentはsdbTableインスタンスで操作する。
        //    defaultRow {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
        // values {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        // top {number} ヘッダ行の行番号(自然数)。通常header+1
        // left {number} データ領域左端の列番号(自然数)
        // right {number} データ領域右端の列番号(自然数)
        // bottom {number} データ領域下端の行番号(自然数)
        v.r = new SpreadDB([{name:'target',range:'target!c3:f'},'master']);
        return JSON.parse(JSON.stringify(v.r.tables.target));
        //v.rv = Object.keys(v.r);
        //v.rv = {schema:v.r.target.schema,values:v.r.target.values};
      },
      () => { // pattern.4 : 既存シートのスキーマ他、各種属性設定状況を確認
        v.r = new SpreadDB('master');
        v.r = JSON.parse(JSON.stringify(v.r.tables.master));
        v.log = {};
        ['name','range','sheetName','top','left','right','bottom'].forEach(x => v.log[x] = v.r[x]);
        console.log(JSON.stringify(v.log));
        console.log(stringify(v.r.values[0]));
        // schema: ログに出力しきれないので分割
        v.log = JSON.parse(JSON.stringify(v.r.schema));
        delete v.log.cols;
        console.log(JSON.stringify(v.log));
        v.r.schema.cols.forEach(col => console.log(JSON.stringify(col)));
      },
      () => { // pattern.5 : 項目定義メモを編集、結果が反映されていることの確認
        v.r = new SpreadDB('master');
        return v.r.tables.master.schema.cols.find(x => x.name === '申込者氏名').unique;
      },
    ],
    append: [ // sdbTable.append関係のテスト
      () => { // No.0 : 最小項目
        // auto_increment - entryNo欄で確認
        // default - authority欄で確認
        //['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.append(v.src.append[0]);
      },
      () => { // No.1 : unique項目の重複エラー
        // appendするデータは都度生成しないとsdbTable.append()側の影響を受けてしまうので注意
        //['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        v.org = JSON.stringify(v.src.append[0]);
        v.r = v.sdb.tables.master.append(JSON.parse(v.org));  // 正常分を一件追加
        v.r = v.sdb.tables.master.append(
          Object.assign(JSON.parse(v.org),{'メールアドレス':'nakaone.kunihiro@gmail.com'}));
        v.r = v.sdb.tables.master.append(
          Object.assign(JSON.parse(v.org),{'メールアドレス':`x${Date.now()}@gmail.com`}));
        return {  // エラーメッセージを確認
          result : v.r[0].result,
          message: v.r[0].message
        }
      },
    ],
    update: [ // sdbTable.update()関係のテスト
      () => { // pattern.8 : updateテスト
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.update({where:'1',record:{authority:3}});
      },
    ],
    delete: [ // sdbTable.delete関係のテスト
      () => { // pattern.0 : primaryKeyで指定
        v.deleteSheet('master');  // masterシートは再作成
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.delete('2');
      },
      () => { // pattern.1 : primaryKey, {key:value}での削除
        v.sdb = new SpreadDB(v.src.master,{accunt: 'Shimazu'});
        return v.sdb.tables.master.delete([
          o => {return o['申込者カナ'].match(/コバヤカワ/) ? true : false}, // 関数型
          {'参加者01氏名':'島津　悠奈'}, // {キー項目名:値}型
          {key:'メールアドレス',value:'nakaone.kunihiro@gmail.com'},  // key-value型
          2,  // primaryKey指定
        ]);
      },
      () => { // pattern.2 : 複数テーブルシート内の「BS」から一明細を関数指定で削除
        v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
        v.sdb = new SpreadDB(v.src.BS,{accunt: 'Shimazu'});
        return v.sdb.tables.BS.delete(o=>{return o['勘定科目'] && o['勘定科目']==='現金' ? true : false});
      },
    ],
    transact: [
      () => {
        v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
        v.now = Date.now();
        v.sdb = new SpreadDB([v.src.master,v.src.accounts,v.src.BS],{
          accunt: 'Shimazu'
        });
        v.r = v.sdb.transact([
          {name:'master',action:'append',arg:{'メールアドレス':`x${v.now}@gmail.com`}},
          {name:'accounts',action:'update',arg:{where:{key:'実績',value:'(営外)貸倒損失'},record:{'読替':'テスト'}}},
          {name:'BS',action:'delete',arg:[
            
          ]},
        ],{
          getLogFrom: null,
          getLogOption: {
            cols: true,
            excludeErrors: false,
            simple: true,
          },
        });
        return v.r;
      },
    ]
  };
  console.log(`${v.whois} start.`);
  try {

    // v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
    ['target','master','log'].forEach(x => v.deleteSheet(x));

    // テスト対象を絞る場合、以下のv.st,numの値を書き換え
    v.p = 'update'; v.st = 0; v.num = 1 || pattern[v.p].length;

    for( v.i=v.st ; v.i<v.st+v.num ; v.i++ ){
      v.rv = pattern[v.p][v.i]();
      if( v.rv instanceof Error ) throw v.rv;
      console.log(`===== pattern.${v.i} end.\n${stringify(v.rv)}`);
    }

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

class SpreadDB {
  /** @constructor
   * @param tables {Object|Object[]} 対象領域情報(sdbTable.constructor()の引数オブジェクト)の配列
   * @param opt {Object}={}
   * @param opt.outputLog {boolean}=true ログ出力しないならfalse
   * @param opt.logSheetName {string}='log' 更新履歴シート名
   * @param opt.account {number|string}=null 更新者のアカウント
   * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
   * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
   * @returns {SpreadDB|Error}
   */
  constructor(tables,opt={}){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      // -------------------------------------------------------------
      // 1. 事前準備
      // -------------------------------------------------------------
      v.step = 1; // メンバの初期化
      // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
      this.spread = SpreadsheetApp.getActiveSpreadsheet();
      // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
      this.tables = {};
  
      v.step = 2; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
      v.tables = Array.isArray(tables) ? tables : [tables];
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){
        // 文字列ならname属性指定と看做す
        if(whichType(v.tables[v.i],'String')){
          v.tables[v.i] = {name: v.tables[v.i]};
        };
      }
  
      v.step = 3; // 引数「opt」の設定値をメンバとして登録
      v.opt = mergeDeeply(opt,{
        outputLog: true,
        logSheetName: 'log',
        account: null,
        maxTrial: 5,
        interval: 2500,
        values: null,
        schema: null,
      });
      Object.keys(v.opt).forEach(x => this[x] = v.opt[x]);
  
      v.step = 4; // 更新履歴を残す場合、変更履歴シートを他シートに先行して準備
      if( this.outputLog === true ){
        this.log = this.tables[this.logSheetName] = new sdbTable({
          spread: this.spread,
          name: this.logSheetName,
          cols: sdbLog.typedef(),
        });
        if( this.log instanceof Error ) throw this.log;
      } else {
        this.log = null;
      }
  
      v.step = 5; // 対象テーブルのインスタンス化
      v.tables.forEach(x => {
        // sdbTableインスタンス生成時、spreadが必要になるので追加しておく
        x.spread = this.spread;
        x.log = this.log;
        x.account = this.account;
        v.r = new sdbTable(x);
        if( v.r instanceof Error ) throw v.r;
        this.tables[x.name] = v.r;
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** transact: シートの操作
   * 
   * @param trans {Object|Object[]} - 以下のメンバを持つオブジェクト(の配列)
   * @param trans.name {string} - 更新対象範囲名
   * @param trans.action {string} - 操作内容。"append", "update", "delete"のいずれか
   * @param trans.arg {Object|Object[]} - append/update/deleteの引数
   * @param opt={} {Object} - オプション
   * @param opt.getLogFrom=null {string|number|Date} - 取得する更新履歴オブジェクトの時刻指定
   * @param opt.getLogOption={} {Object} - getLogFrom≠nullの場合、getLogメソッドのオプション
   * @returns 
   * 
   * - GAS公式 Class LockService [getDocumentLock()](https://developers.google.com/apps-script/reference/lock/lock-service?hl=ja#getDocumentLock())
   * - Qiita [GASの排他制御（ロック）の利用方法を調べた](https://qiita.com/kyamadahoge/items/f5d3fafb2eea97af42fe)
   */
  transact(trans,opt={}){
    const v = {whois:this.constructor.name+'.transact',step:0,rv:[]};
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}\nopt=${stringify(opt)}`);
    try {
  
      v.step = 1; // 事前準備
      v.step = 1.1; // 引数transを配列化
      if( !Array.isArray(trans) ) trans = [trans];
      v.step = 1.2; // オプションに既定値を設定
      v.opt = Object.assign({
        getLogFrom: null,
        getLogOption: {},
      },opt);
  
      v.step = 2; // スプレッドシートをロックして更新処理
      v.lock = LockService.getDocumentLock();
      if( v.lock.tryLock(10000) ){
  
        v.step = 2.1; // シートの更新処理
        for( v.i=0 ; v.i<trans.length ; v.i++ ){
          if( ['append','update','delete'].find(x => x === trans[v.i].action) ){
            v.r = this.tables[trans[v.i].name][trans[v.i].action](trans[v.i].arg);
            if( v.r instanceof Error ) throw v.r;
            v.rv = [...v.rv, ...v.r];
          }
        }
  
        v.step = 2.2; // 更新履歴の取得
        if( v.opt.getLogFrom !== null ){
          v.r = this.getLog(v.opt.getLogFrom,v.opt.getLogOption);
          if( v.r instanceof Error ) throw v.r;
          v.rv = {result:v.rv,data:v.r};
        }
  
        v.step = 2.3; // ロック解除
        v.lock.releaseLock();
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** getLog: 指定時刻以降の変更履歴を取得
   * @param datetime=null {string} - Date型に変換可能な日時文字列
   * @param opt={} {Object} - オプション
   * @param opt.cols=null {boolean} 各項目の定義集も返す
   * @param opt.excludeErrors=true {boolean} エラーログを除く
   * @param opt.simple=true {boolean} 戻り値のログ情報の項目を絞り込む
   * @returns {Object} {success:[],failure:[]}形式
   */
  getLog(datetime=null,opt={}){
    const v = {whois:this.constructor.name+'.delete',step:0,rv:{}};
    console.log(`${v.whois} start.\ndatetime(${whichType(datetime)})=${stringify(datetime)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {
  
      v.step = 1; // 事前準備
      v.datetime = datetime === null ? -Infinity : new Date(datetime).getTime();
      v.opt = Object.assign({
        cols: datetime === null ? true : false,
        excludeErrors: true,
        simple: true,
      },opt);
  
      v.step = 2; // 戻り値lastReferenceの設定
      v.rv.lastReference = toLocale(new Date());
  
      v.step = 3; // 戻り値colsの設定
      if( v.opt.cols ){
        v.rv.cols = {};
        for( v.table in this.tables ){
          v.rv.cols[v.table] = this.tables[v.table].schema.cols;
        }
      }
  
      v.step = 4; // 戻り値logの設定
      v.rv.log = [];
      for( v.i=0 ; v.i<this.log.values.length ; v.i++ ){
        v.l = this.log.values[v.i];
        if( new Date(v.l.timestamp).getTime() > v.datetime ){
          if( v.l.result === false && v.opt.excludeErrors === true ) continue;
          if( v.opt.simple ){
            v.rv.log.push({
              range: v.l.range,
              action: v.l.before ? (v.l.after ? 'update' : 'delete') : 'append',
              record: v.l.before && !v.l.after ? v.l.before : v.l.after,
            });
          } else {
            v.rv.log.push(v.l);
          }
        }
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbTable: シート上の対象範囲(テーブル) */
class sdbTable {
  /** @constructor
   * @param arg {Object}
   * @param arg.spread {SpreadSheet} - スプレッドシート
   * @param arg.name {string} - 範囲名。スプレッドシート内で一意
   * @param [arg.range] {string} - 対象データ範囲のA1記法。省略時はnameを流用、セル範囲指定は無しと看做す
   * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns
   */
  constructor(arg){
    const v = {whois:'sdbTable.constructor',step:0,rv:null,
      getDataRange:null, getValues:null, getNotes:null,
      colNo: arg => { // 列記号を列番号に変換
        let rv=0;
        for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
          rv = rv * 26 + s.charCodeAt(i) - b;
        }
        return rv;
      },
    };
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {
  
      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      this.spread = arg.spread; // || SpreadsheetApp.getActiveSpreadsheet();
      this.name = arg.name; // {string} テーブル名
      this.range = arg.range || arg.name; // {string} A1記法の範囲指定
      this.log = arg.log || null; // {sdbTable} 変更履歴シート
      this.account = arg.account || null; // {string} 更新者のアカウント
      this.sheetName = null; // {string} シート名。this.rangeから導出
      this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      this.schema = null; // {sdbSchema[]} シートの項目定義
      this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
      this.top = null; // {number} ヘッダ行の行番号(自然数)。データ領域は次行から。
      this.left = null; // {number} データ領域左端の列番号(自然数)
      this.right = null; // {number} データ領域右端の列番号(自然数)
      this.bottom = null; // {number} データ領域下端の行番号(自然数)
  
  
      // ----------------------------------------------
      v.step = 2; // 引数name,rangeから対象範囲絞り込み
      // ----------------------------------------------
      // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
      // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る
      v.m = this.range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
      if( v.m ){  // rangeがA1記法で指定された場合
        this.sheetName = v.m[1];
        this.left = v.m[2] ? v.colNo(v.m[2]) : 1;
        this.top = v.m[3] ? Number(v.m[3]) : 1;
        this.right = v.m[4] ? v.colNo(v.m[4]) : Infinity;
        this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
        if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
        if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
      } else {    // rangeが非A1記法 ⇒ range=シート名
        this.sheetName = this.range;
        this.top = this.left = 1;
        this.bottom = this.right = Infinity;
      }
  
      // ----------------------------------------------
      v.step = 3; // this.schemaの作成
      // ----------------------------------------------
      v.schemaArg = { // sdbSchema用の引数
        cols: arg.cols || null,
        header: null,
        notes: null,
        values: arg.values || null,
      };
      this.sheet = this.spread.getSheetByName(this.sheetName);
      if( this.sheet !== null ){
  
        v.step = 3.11; // シートイメージの読み込み
        v.getDataRange = this.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();
  
        v.step = 3.12; // 範囲絞り込み(未確定)。A1記法とデータ範囲のどちらか小さい方
        this.right = Math.min(this.right, v.getValues[0].length);
        this.bottom = Math.min(this.bottom, v.getValues.length);
  
        v.step = 3.13; // ヘッダ行のシートイメージ(項目一覧)
        v.schemaArg.header = v.getValues[this.top-1].slice(this.left-1,this.right);
  
        v.step = 3.14; // 項目定義メモの読み込み
        v.schemaArg.notes = this.sheet.getRange(this.top,this.left,1,this.right-this.left+1).getNotes()[0];
  
      } else {
  
        v.step = 3.21; // シートも項目定義も初期データも無いならエラー
        if( !arg.cols && !arg.values ){
          throw new Error(`シートも項目定義も初期データも存在しません`);
        }
        v.step = 3.22; // arg.valuesがシートイメージなら先頭行をheaderとする
          if( arg.values && Array.isArray(arg.values[0]) ){
          v.schemaArg.header = arg.values[0];
        }
      }
  
      v.step = 3.3; // スキーマをインスタンス化、右端列番号の確定
      this.schema = new sdbSchema(v.schemaArg);
      if( this.schema instanceof Error ) throw this.schema;
      this.right = this.left - 1 + this.schema.cols.length;
  
      // ----------------------------------------------
      v.step = 4; // this.valuesの作成
      // ----------------------------------------------
      v.step = 4.1; // シートイメージから行オブジェクトへ変換関数を定義
      v.convert = o => { // top,left,right,bottomは全てシートベースの行列番号(自然数)で計算
        // 先頭〜末尾の途中に全項目が空欄の行があれば、空オブジェクトを作成するが、
        // 末尾行以降の全項目空欄行はスキップする
        v.obj = []; v.flag = false;
        for( v.i=o.bottom-1 ; v.i>=o.top ; v.i-- ){
          v.o = {};
          for( v.j=o.left-1 ; v.j<o.right ; v.j++ ){
            if( o.data[v.i][v.j] ){
              v.o[o.data[o.top-1][v.j]] = o.data[v.i][v.j];
              v.flag = true;
            }
          }
          if( v.flag === true ) v.obj.unshift(v.o);
        }
        return v.obj;
      }
  
      if( this.sheet === null ){
        if( arg.values ){
          if( whichType(arg.values[0],'Object') ){
            v.step = 4.2; // シート不在で初期データが行オブジェクト
            this.values = arg.values;
          } else {
            v.step = 4.3; // シート不在で初期データがシートイメージ
            this.values = v.convert({
              data  : arg.values,
              top   : 1,  // シート上に展開した場合の先頭行番号
              left  : 1,  // 同、左端列番号
              right : arg.values[0].length,
              bottom: arg.values.length,
            });
          }
        } else {
          v.step = 4.4; // シート不在で初期データ無し
          this.values = [];
        }
      } else {
        v.step = 4.5; // シートが存在
        this.values = v.convert({
          data  : v.getValues,
          top   : this.top,
          left  : this.left,
          right : this.right,
          bottom: this.bottom,
        });
      }
      v.step = 4.6; // 末尾行番号の確定
      this.bottom = this.top + this.values.length;
      vlog(this,['name','top','left','right','bottom','values'],v)
  
      // ----------------------------------------------
      v.step = 5; // シート未作成の場合、追加
      // ----------------------------------------------
      if( this.sheet === null ){
  
        v.step = 5.1; // this.schema.colsからヘッダ行作成
        v.sheetImage = [this.schema.cols.map(x => x.name)];
  
        v.step = 5.2; // this.valuesをシートイメージに変換
        for( v.i=0 ; v.i<this.values.length ; v.i++ ){
          v.row = [];
          for( v.j=0 ; v.j<v.sheetImage[0].length ; v.j++ ){
            v.row[v.j] = this.values[v.i][v.sheetImage[0][v.j]]
          }
          v.sheetImage.push(v.row);
        }
  
        v.step = 5.3; // シートの追加
        this.sheet = this.spread.insertSheet();
        this.sheet.setName(this.sheetName);
  
        v.step = 5.4; // シートイメージのセット
        this.sheet.getRange(
          this.top,
          this.left,
          this.bottom - this.top + 1,
          this.right - this.left + 1
        ).setValues(v.sheetImage);
  
        v.step = 5.5; // 項目定義メモの追加
        v.notes = [];
        this.schema.cols.forEach(x => {
          v.r = x.getNote();
          if( v.r instanceof Error ) throw v.r;
          v.notes.push(v.r);
        });
        this.sheet.getRange(this.top,this.left,1,v.notes.length).setNotes([v.notes]);
      }
  
      // ------------------------------------------------
      v.step = 6; // unique,auto_incrementの作成
      // ------------------------------------------------
      v.step = 6.1; // unique項目の値を洗い出し
      this.values.forEach(vObj => {
        Object.keys(this.schema.unique).forEach(unique => {
          if( vObj[unique] ){
            if( this.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
              this.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });
  
        v.step = 6.2; // auto_increment項目の値を洗い出し
        Object.keys(this.schema.auto_increment).forEach(ai => {
          v.c = this.schema.auto_increment[ai].current;
          v.s = this.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
            this.schema.auto_increment[ai].current = v.v;
          }
        });
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** append: 領域に新規行を追加
   * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
   * @returns {sdbLog[]}
   */
  append(record){
    const v = {whois:'sdbTable.append',step:0,rv:[]};
    console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      if( !Array.isArray(record)) record = [record];
      v.target = [];  // 対象領域のシートイメージを準備
      v.log = []; // 更新履歴のシートイメージを準備
  
      // ------------------------------------------------
      v.step = 2; // 追加レコードをシートイメージに展開
      // ------------------------------------------------
      v.header = this.schema.cols.map(x => x.name);
      for( v.i=0 ; v.i<record.length ; v.i++ ){
  
        v.logObj = new sdbLog({account: this.account,range: this.name});
  
        v.step = 2.1; // auto_increment項目の設定
        // ※ auto_increment設定はuniqueチェックに先行
        for( v.ai in this.schema.auto_increment ){
          if( !record[v.i][v.ai] ){
            this.schema.auto_increment[v.ai].current += this.schema.auto_increment[v.ai].step;
            record[v.i][v.ai] = this.schema.auto_increment[v.ai].current;
          }
        }
  
        v.step = 2.2; // 既定値の設定
        record[v.i] = Object.assign({},this.schema.defaultRow,record[v.i]);
  
        v.step = 2.3; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in this.schema.unique ){
          if( this.schema.unique[v.unique].indexOf(record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.logObj.result = false;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.logObj.message = v.logObj.message === null ? [] : v.logObj.message.split('\n');
            v.logObj.message.push(`${v.unique}欄の値「${record[v.i][v.unique]}」が重複しています`);
            v.logObj.message = v.logObj.message.join('\n');
          } else {
            // 未登録の場合this.sdbSchema.uniqueに値を追加
            this.schema.unique[v.unique].push(record[v.i][v.unique]);
          }
        }
  
        v.step = 2.4; // 正当性チェックOKの場合の処理
        if( v.logObj.result ){
          v.step = 2.41; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<v.header.length ; v.j++ ){
            v.row[v.j] = record[v.i][v.header[v.j]];
          }
          v.target.push(v.row);
  
          v.step = 2.42; // this.valuesへの追加
          this.values.push(record[v.i]);
  
          v.step = 2.43; // ログに追加レコード情報を記載
          v.logObj.after = v.logObj.diff = JSON.stringify(record[v.i]);
        }
  
        v.step = 2.5; // 成否に関わらずログ出力対象に保存
        v.log.push(v.logObj);
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // 対象シートへの展開
      if( v.target.length > 0 ){
        this.sheet.getRange(
          this.bottom+1,
          this.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
      // this.sdbTable.bottomの書き換え
      this.bottom += v.target.length;
  
      v.step = 3.2; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( this.log !== null ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** update: 領域に新規行を追加
   * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
   * @param {Object|Function|any} trans.where - 対象レコードの判定条件
   * @param {Object|Function} trans.record - 更新する値
   * @returns {sdbLog[]}
   * 
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  update(trans=[]){
    const v = {whois:'sdbTable.update',step:0,rv:[],log:[],target:[],
      top:Infinity,left:Infinity,right:0,bottom:0,
      header: this.schema.cols.map(x => x.name), // 項目一覧
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
      if( !Array.isArray(trans)) trans = [trans];
  
      // 対象となる行オブジェクト判定式の作成
      for( v.i=0 ; v.i<trans.length ; v.i++ ){
  
        v.step = 1.1; // where,recordの存否確認
        v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
        if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
        if( !trans[v.i].record ) throw new Error(v.msg.replace('_','更新データ(record)'));
  
        v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
        v.where = this.functionalize(trans[v.i].where);
        if( v.where instanceof Error ) throw v.where;
  
        v.step = 1.3; // recordがオブジェクトなら関数化
        v.record = typeof trans[v.i].record === 'function' ? trans[v.i].record
        : new Function('o',`return ${JSON.stringify(trans[v.i].record)}`);
  
        // 対象レコードか一件ずつチェック
        for( v.j=0 ; v.j<this.values.length ; v.j++ ){
  
          v.step = 2.1; // 対象外判定ならスキップ
          if( v.where(this.values[v.j]) === false ) continue;
  
          v.step = 2.2; // 更新履歴オブジェクトを作成
          v.logObj = new sdbLog({account:this.account,range:this.name,
            before:JSON.parse(JSON.stringify(this.values[v.j])),after:{},diff:{}});
  
          v.step = 2.3; // v.after: 更新指定項目のみのオブジェクト
          v.after = v.record(this.values[v.j]);
  
          v.step = 2.4; // シート上の項目毎にチェック
          v.header.forEach(x => {
            if( v.after.hasOwnProperty(x) && !isEqual(v.logObj.before[x],v.after[x]) ){
              v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
              v.logObj.after[x] = v.logObj.diff[x] = v.after[x];
              v.colNo = v.header.findIndex(y => y === x);
              v.left = Math.min(v.left,v.colNo);
              v.right = Math.max(v.right,v.colNo);
            } else {
              v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.logObj.after[x] = v.logObj.before[x];
            }
          })
  
          v.step = 2.5; // 更新レコードの正当性チェック(unique重複チェック)
          for( v.unique in this.schema.unique ){
            if( this.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
              v.step = 2.51; // 登録済の場合はエラーとして処理
              v.logObj.result = false;
              // 複数項目のエラーメッセージに対応するため場合分け
              v.logObj.message = (v.logObj.message === null ? '' : '\n')
              + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
            } else {
              v.step = 2.52; // 未登録の場合this.sdbSchema.uniqueに値を追加
              this.schema.unique[v.unique].push(trans[v.i][v.unique]);
            }
          }
    
          v.step = 2.6; // 正当性チェックOKの場合の処理
          if( v.logObj.result ){
            v.top = Math.min(v.top, v.j);
            v.bottom = Math.max(v.bottom, v.j);
            this.values[v.j] = v.logObj.after;          
          }
    
          v.step = 2.7; // 成否に関わらずログ出力対象に保存
          ['before','after','diff'].forEach(x => {if(v.logObj[x]) v.logObj[x] = JSON.stringify(v.logObj[x])});
          v.log.push(v.logObj);
        }
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(this.values[v.i][v.header[v.j]] || null);
        }
        v.target.push(v.row);
      }
  
      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 ){
        this.sheet.getRange(
          v.top + 2,  // +1(添字->行番号) +1(ヘッダ行分)
          v.left + 1,  // +1(添字->行番号)
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
  
      v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( this.log !== null ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** delete: 領域から指定行を物理削除
   * @param {Object|Function|any} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   * 
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  delete(where){
    const v = {whois:'sdbTable.delete',step:0,rv:[],log:[],where:[]};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
      // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(where)) where = [where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<where.length ; v.i++ ){
        where[v.i] = this.functionalize(where[v.i]);
        if( where[v.i] instanceof Error ) throw where[v.i];
      }
      v.step = 1.3; // 引数argのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 2; // 対象レコードか一件ずつチェック
      for( v.i=this.values.length-1 ; v.i>=0 ; v.i-- ){
  
        v.step = 2.1; // 対象外判定ならスキップ
        if( v.cond(this.values[v.i]) === false ) continue;
        console.log(`l.1099 this.values[${v.i}]=${stringify(this.values[v.i])}`)
  
        v.step = 2.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:this.account,range:this.name,
          before:JSON.stringify(this.values[v.i])});
        v.logObj.diff = v.logObj.before;
        v.log.push(v.logObj);
  
        v.step = 2.3; // 削除レコードのunique項目をthis.schema.uniqueから削除
        // this.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in this.schema.unique ){
          if( this.values[v.i][v.unique] ){
            v.idx = this.schema.unique[v.unique].indexOf(this.values[v.i][v.unique]);
            if( v.idx >= 0 ) this.schema.unique[v.unique].splice(v.idx,1);
          }
        }
  
        v.step = 2.4; // this.valuesから削除
        this.values.splice(v.i,1);
  
        v.step = 2.5; // シートのセルを削除
        v.range = this.sheet.getRange(
          v.i + 2,  // +1(添字->行番号) +1(ヘッダ行分)
          this.left,
          1,
          this.right - this.left + 1,
        );
        v.range.deleteCells(SpreadsheetApp.Dimension.ROWS);
  
        v.step = 2.6; // this.bottomを書き換え
        this.bottom = this.bottom - 1;
  
      }
  
      v.step = 3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( v.log.length > 0 ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** functionalize: where句のオブジェクト・文字列を関数化(update/deleteで使用) */
  functionalize(arg){
    const v = {whois:'sdbTable.functionalize',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
  
      switch( typeof arg ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg;
          break;
        case 'object':
          v.step = 2.2;
          v.keys = Object.keys(arg);
          if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
            v.step = 2.3; // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o',`return isEqual(o['${arg.key}'],'${arg.value}')`);
          } else {
            v.step = 2.4; // {キー項目名:値}形式での指定の場合
            v.c = [];
            for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o',`return (${v.c.join(' && ')})`);
          }
          break;
        default: v.step = 2.5; // primaryKeyの値指定
          v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
class sdbSchema {
  /** @constructor
   * @param arg {Object}
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {sdbSchema|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbSchema.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 事前準備
      v.arg = mergeDeeply(arg,{cols:null,header:null,notes:null,values:null});

      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(this.cols)の作成
      // -----------------------------------------------
      v.step = 2.1; // v.cols: sdbColumns.constructor()への引数
      if( Array.isArray(v.arg.notes) && v.arg.notes.join('').length > 0 ){
        v.cols = v.arg.notes;
      } else if( v.arg.cols !== null ){
        v.cols = v.arg.cols;
      } else if( Array.isArray(v.arg.header) && v.arg.header.join('').length > 0 ){
        v.cols = v.arg.header;
      } else if( v.arg.values !== null ){
        // 行オブジェクトの配列から項目名リストを作成
        v.obj = {};
        v.arg.values.forEach(o => Object.assign(v.obj,o));
        v.cols = Object.keys(v.obj);
      } else {
        throw new Error('必要な引数が指定されていません');
      }

      v.step = 2.2; // this.colsにsdbColumnsインスタンスを項目毎に生成
      this.cols = [];
      v.cols.forEach(o => {
        v.r = new sdbColumn(o);
        if( v.r instanceof Error ) throw v.r;
        this.cols.push(v.r);
      })

      // -----------------------------------------------
      v.step = 3; // this.cols以外のメンバ作成
      // -----------------------------------------------
      this.primaryKey = null;
      this.unique = {};
      this.auto_increment = {};
      this.defaultRow = {};
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<this.cols.length ; v.i++ ){

        v.step = 3.1; // primaryKey
        if( v.bool(this.cols[v.i].primaryKey) === true ){
          this.primaryKey = this.cols[v.i].name;
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( v.bool(this.cols[v.i].unique) === true ){
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( this.cols[v.i].auto_increment !== false ){
          this.auto_increment[this.cols[v.i].name] = this.cols[v.i].auto_increment;
          this.auto_increment[this.cols[v.i].name].current = this.auto_increment[this.cols[v.i].name].base;
        }

        v.step = 3.4; // default
        if( String(this.cols[v.i].default).toLowerCase() !== 'null' ){
          this.defaultRow[this.cols[v.i].name] = this.cols[v.i].default;
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbColumn: 項目定義オブジェクト */
class sdbColumn {

  static typedef(){return [
    {name:'name',type:'string',note:'項目名'},
    {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
    {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
    {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
    {name:'default',type:'number|string|boolean|Date',note:'既定値'},
    {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
    {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
    {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
      + '\n// null ⇒ 自動採番しない'
      + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
      + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
      + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
    },
    {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
    {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
  ]};

  /** @constructor
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbColumn.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
      if( whichType(arg,'String') ) arg = this.str2obj(arg);
      if( arg instanceof Error ) throw arg;

      v.step = 2; // メンバに格納
      sdbColumn.typedef().map(x => x.name).forEach(x => {
        this[x] = arg.hasOwnProperty(x) ? arg[x] : null;
      });

      v.step = 3; // auto_incrementをオブジェクトに変換
      if( this.auto_increment !== null && String(this.auto_increment).toLowerCase() !== 'false' ){
        switch( whichType(this.auto_increment) ){
          case 'Array': this.auto_increment = {
            base: this.auto_increment[0],
            step: this.auto_increment[1],
          }; break;
          case 'Number': this.auto_increment = {
            base: Number(this.auto_increment),
            step: 1,
          }; break;
          default: this.auto_increment = {
            base: 1,
            step: 1,
          };
        }
      } else {
        this.auto_increment = false;
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** str2obj: 項目定義メモの文字列(または項目名)から項目定義オブジェクトを作成
   * @param arg {string} 項目定義メモの文字列、または項目名
   * @returns {Object} 項目定義オブジェクト
   */
  str2obj(arg){
    const v = {whois:'sdbColumn.str2obj',step:0,rv:null,
      rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
      isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // コメントの削除
      arg = arg.replace(v.rex,'');

      v.step = 2; // JSONで定義されていたらそのまま採用
      v.rv = v.isJSON(arg);

      if( v.rv === null ){
        v.step = 3; // 非JSON文字列だった場合、改行で分割
        v.lines = arg.split('\n');

        v.step = 4; // 一行毎に属性の表記かを判定
        v.rv = {};
        v.lines.forEach(prop => {
          v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
          if( v.m ) v.rv[v.m[1]] = v.m[2];
        });

        v.step = 5; // 属性項目が無ければ項目名と看做す
        if( Object.keys(v.rv).length === 0 ){
          v.rv = {name:arg.trim()};
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** getNote: 項目定義メモの文字列を作成
   * @param opt {Object}
   * @param opt.undef=true {boolean} - 未定義の項目もコメントとして記載
   * @param opt.defined=false {boolean} - 定義済項目もデータ型・説明文をコメントとして記載
   * @returns {string} 項目定義メモの文字列
   */
  getNote(opt={}){
    const v = {whois:'sdbColumn.getNote',step:0,rv:[],prop:{}};
    console.log(`${v.whois} start.\nthis=${stringify(this)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {

      v.step = 1; // オプションの既定値を設定
      v.opt = Object.assign({undef:true,defined:false},opt);

      v.step = 2; // 項目定義の属性を順次チェック
      v.typedef = sdbColumn.typedef();
      for( v.i=0 ; v.i<v.typedef.length ; v.i++ ){
        v.typedef[v.i] = Object.assign({type:'',note:''},v.typedef[v.i]);
        if( this[v.typedef[v.i].name] !== null ){
          // auto_incrementは配列型で記載されるよう変換
          v.val = v.typedef[v.i].name === 'auto_increment' && whichType(this.auto_increment,'Object')
          ? JSON.stringify([this.auto_increment.base,this.auto_increment.step]) : this[v.typedef[v.i].name];
          v.l = `${v.typedef[v.i].name}: ${v.val}`
            + ( v.opt.defined ? ` // {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}` : '');
        } else if( v.opt.undef ){
          // 説明文をコメントとして出力する場合
          v.l = `// ${v.typedef[v.i].name}:undefined {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}`;
        }
        v.rv.push(v.l);
      }

      v.step = 9; // 終了処理
      v.rv = v.rv.join('\n');
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbLog: 更新履歴オブジェクトを管理、生成 */
class sdbLog {

  /** colDefs: 更新履歴シートの項目定義。sdbLog.colsDefs()で外部から参照可 */
  static typedef(){return [
    {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
    {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
    {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
    {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
    {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
    {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
    {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.before||null},
    {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.after||null},
    {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',default:(o={})=>o.diff||null},
  ]};

  /** @constructor
   * @param arg {Object}
   * @param arg.account {string|number} - 更新者の識別子
   * @param arg.range {string} - 更新対象となった範囲名(テーブル名)
   * @param arg.result {boolean} - true:追加・更新が成功
   * @param arg.message {string} - エラーメッセージ
   * @param arg.before {JSON} - 更新前の行データオブジェクト
   * @param arg.after {JSON} - 更新後の行データオブジェクト
   * @param arg.diff {JSON} - 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
   * @returns {sdbLog|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbLog.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1;
      sdbLog.typedef().forEach(col => this[col.name] = col.default(arg));

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}


/** 二つの引数が同値か判断する
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @param {Object|boolean} opt - オプション。v1,v2でデータ型が異なる場合の判定方法を指定
 * @param {string} opt.force=null - v1,v2に強制するデータ型(ex.v1='9-5-1965',v2='1965/9/5',opt.force='date'->true)
 *   'string','number','bigint','boolean','undefined','symbol','function','null','date','object','array'
 * @param {boolean} opt.string_number=true - trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
 * @param {boolean} opt.string_bigint=true - trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
 * @param {boolean} opt.string_boolean=true - trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
 * @param {boolean} opt.string_undefined=true - trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
 * @param {boolean} opt.string_function=true - trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
 * @param {boolean} opt.string_null=true - trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
 * @param {boolean} opt.string_date=true - trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
 * @param {boolean} opt.number_bigint=true - trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
 * @param {boolean} opt.number_date=true - trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
 * @param {boolean} opt.bigint_date=true - trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
 * @returns {boolean|Error}
 * 
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 * - `opt.strict = false`はスプレッドシートに保存されていた内容との比較での利用を想定
 */
function isEqual(v1=undefined,v2=undefined,opt={}){
  const v = {whois:'isEqual',rv:true,step:0,
  };
  try {

    // -------------------------------------------
    // 1. 事前準備
    // -------------------------------------------
    v.step = 1.1; // v.types: typeofの戻り値の内、objectを除いたもの
    v.types = ['string','number','bigint','boolean','undefined','symbol','function'];
    v.typeAll = [...v.types,'null','date','object','array'];

    v.step = 1.2; // データ型判定関数の定義
    // typeofの戻り値の内 string,number,bigint,boolean,undefined,symbol,function はそのまま
    // objectは null,date,array,objectに分けて文字列として返す
    // 引数:データ型判定対象変数、戻り値:v.typeallに列挙された文字列
    v.which = x => {
      if( x === null ) return 'null';
      if( v.types.indexOf(typeof x) >= 0 ) return typeof x;
      if( Array.isArray(x) ) return 'array';
      return isNaN(new Date(x)) ? 'object' : 'date';
    };

    v.step = 1.3; // オプションに既定値を設定
    v.opt = Object.assign({
      force: null,
      string_number: true, // trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
      string_bigint: true, // trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
      string_boolean: true, // trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
      string_undefined: true, // trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
      string_function: true, // trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
      string_null: true, // trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
      string_date: true, // trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
      number_bigint: true, // trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
      number_date: true, // trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
      bigint_date: true, // trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
    },opt);

    v.step = 1.4; // オプションの適用マップ(v.map)を作成
    // v1,v2でデータ型が異なる場合の判定方法として、次項(step.1.5)で定義する判定式を
    // 適用する場合はtrueを、適用しない場合(=厳密比較する場合)はfalseを設定する。
    // なおデータ型がv1,v2で不一致の場合はオプションの真偽値をセットするが、
    // 一致する場合は必ず判定式が適用されるようtrueをセットしておく。
    v.map = {};
    v.typeAll.forEach(x => {
      v.map[x] = {};
      // `x === y` ⇒ データ型が一致する場合はtrue、不一致はfalseをセット
      v.typeAll.forEach(y => v.map[x][y] = x === y);
    });
    // オプションの指定値をセット
    for( v.prop in v.opt ){
      v.m = v.prop.match(/^([a-z]+)_([a-z]+)$/);
      if( v.m ) v.map[v.m[1]][v.m[2]] = v.map[v.m[2]][v.m[1]] = v.opt[v.prop];
    }

    v.step = 1.5; // 比較対象のデータ型に基づいた判定式の定義
    v.f01 = (x,y) => x === y;  // ①厳密比較
    v.f02 = (x,y) => x == y;   // ②緩い比較
    v.f03 = (x,y) => {try{return BigInt(x) === BigInt(y)}catch{return false}};  // ③BigInt
      // BigInt(Infinity) -> The number Infinity cannot be converted to a BigInt because it is not an integer
      // これを回避するためtry〜catchとする
    v.f04 = (x,y) => String(x).toLowerCase() === String(y).toLowerCase(); //Boolean(x) === Boolean(y),  // ④Boolean
    v.f05 = (x,y) => String(x) === String(y);  // ⑤String
    v.f06 = (x,y) => x.toString() === y.toString();  // ⑥toString()
    v.f07 = (x,y) => {try{return new Date(x).getTime() === new Date(y).getTime()}catch{return false}};  // ⑦getTime()
      // new Date(Infinity) -> Invalid Date
      // これを回避するためtry〜catchとする
    v.f08 = (x,y) => new Date(Number(x)).getTime() === new Date(Number(y)).getTime();  // ⑧getTime(num)

    v.step = 1.6; // デシジョンテーブルの定義
    // 比較対象のデータ型毎に、どの比較方法を採用するかを定義する
    // ex. v.dt['string','number'] ⇒ v.f02(②緩い比較)で同一かを判定
    v.dt = {
      "string":{"string":v.f01,"number":v.f02,"bigint":v.f03,"boolean":v.f04,"undefined":v.f05,"function":v.f06,"null":v.f04,"date":v.f07},
      "number":{"string":v.f02,"number":v.f01,"bigint":v.f03,"date":v.f07},
      "bigint":{"string":v.f03,"number":v.f03,"bigint":v.f01,"date":v.f07},
      "boolean":{"string":v.f04,"boolean":v.f01},
      "undefined":{"string":v.f05,"undefined":v.f01},
      "symbol":{"symbol":v.f06},
      "function":{"string":v.f06,"function":v.f06},
      "null": {"string":v.f04,"null":v.f01},
      "date": {"string":v.f07,"number":v.f07,"bigint":v.f08,"date":v.f07},
      "object": {"object":(x,y)=>{
        // 直下のメンバが不一致ならfalseを返す(孫要素以降は不問)
        if(JSON.stringify(Object.keys(x).sort()) !== JSON.stringify(Object.keys(y).sort())) return false;
        // 個々のメンバを再帰呼出
        for( let m in x ) if( isEqual(x[m],y[m],v.opt) === false ) return false;
        return true;
      }},
      "array": {"array":(x,y)=>{
        // 要素の個数が不一致ならfalseを返す(孫要素以降は不問)
        if( x.length !== y.length ) return false;
        // 個々のメンバを再帰呼出
        for( let i=0 ; i<x.length ; i++ ) if( isEqual(x[i],y[i],v.opt) === false ) return false;
        return true;
      }},
    };

    // -------------------------------------------
    v.step = 2; // 判定式を選択、結果を返す
    // -------------------------------------------
    // データ型の組み合わせパターンで判定式が定義されていればそれに基づき判定。
    // 未定義なら「false固定」としてfalseを返す。
    v.t1 = v.opt.force || v.which(v1); v.t2 = v.opt.force || v.which(v2);
    v.f = v.map[v.t1][v.t2] ? v.dt[v.t1][v.t2] : v.f01;
    //console.log(`t1:${v.t1}, t2:${v.t2}, f: ${v.f}`);
    return v.f(v1,v2);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1(${typeof v1})=${typeof v1 === 'object' ? JSON.stringify(v1) : v1}`
    + `\nv2(${typeof v2})=${typeof v2 === 'object' ? JSON.stringify(v2) : v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg - 変換元の日時
 * @param {string} [format='yyyy-MM-ddThh:mm:ss.nnnZ'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function toLocale(arg,format='yyyy-MM-ddThh:mm:ss.nnnZ'){
  const v = {rv:format};
  try {

    let dObj = whichType(arg,'Date') ? arg : new Date(arg);
    //dObj = String(Object.prototype.toString.call(arg).slice(8,-1)) !== 'Date' ? arg : new Date(arg);

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.local = { // 地方時ベース
      y: dObj.getFullYear(),
      M: dObj.getMonth()+1,
      d: dObj.getDate(),
      h: dObj.getHours(),
      m: dObj.getMinutes(),
      s: dObj.getSeconds(),
      n: dObj.getMilliseconds(),
      Z: Math.abs(dObj.getTimezoneOffset())
    }
    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    v.step = 2; // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}
/** vlog: デバッグ用コンソール出力
 * @param {Object} o - 出力対象Object
 * @param {string|string[]} m - メンバ名
 * @param {number|Object} l=null - 数値なら行番号、Objectならwhois,stepをメンバに持つ変数('v'を想定)
 * @returns {void}
 * 
 * - ver.1.1.0 2024/09/12
 *   - v以外の変数(ex.this)でもstep表示を可能に(lにObjectを追加)
 *   - 階層化オブジェクトメンバの指定を可能に(v.convの追加)
 */
const vlog = (o,m,l=null) => {
  // return; // デバッグ用。本番時はコメントを外す
  const v = {
    lType: whichType(l),  // 引数lのデータ型
    conv: (o,s) => {s.split('.').forEach(x => o = o[x]);return o},
  };

  switch( v.lType ){
    case 'Object': v.whois = l.whois; v.step = l.step; v.line = null; break;
    case 'Null'  : // Numberと同じ
    case 'Number': v.whois = o.whois; v.step = o.step; v.line = l; break;
  }
  v.msg = new Date().toLocaleTimeString()
    + (v.whois ? ` ${v.whois}` : '')
    + (v.step ? ` step.${v.step}` : '')
    + (v.line ? ` l.${v.line}` : '');

  if( whichType(m,'string') ) m = [m];
  m.forEach(str => {
    v.val = v.conv(o,str);
    v.msg += `\n${str}(${whichType(v.val)})=${stringify(v.val)}`
  });

  console.log(v.msg);
}
/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}

