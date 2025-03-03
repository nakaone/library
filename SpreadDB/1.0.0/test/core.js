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
        v.sdb = new SpreadDB(v.src.master,{account: 'Shimazu'});
        return v.sdb.tables.master.delete([
          o => {return o['申込者カナ'].match(/コバヤカワ/) ? true : false}, // 関数型
          {'参加者01氏名':'島津　悠奈'}, // {キー項目名:値}型
          {key:'メールアドレス',value:'nakaone.kunihiro@gmail.com'},  // key-value型
          2,  // primaryKey指定
        ]);
      },
      () => { // pattern.2 : 複数テーブルシート内の「BS」から一明細を関数指定で削除
        v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
        v.sdb = new SpreadDB(v.src.BS,{account: 'Shimazu'});
        return v.sdb.tables.BS.delete(o=>{return o['勘定科目'] && o['勘定科目']==='現金' ? true : false});
      },
    ],
    transact: [
      () => {
        v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
        v.now = Date.now();
        v.sdb = new SpreadDB([v.src.master,v.src.accounts,v.src.BS],{account:'Shimazu'});
        v.r = v.sdb.transact([
          {name:'master',action:'append',arg:{'メールアドレス':`x${v.now}@gmail.com`}},
          {name:'accounts',action:'update',arg:{where:{key:'実績',value:'(営外)貸倒損失'},record:{'読替':'テスト①'}}},
          {name:'BS',action:'update',arg:{where:{'勘定科目':'現金'},record:{'小':'テスト②'}}},
          //{name:'BS',action:'delete',arg:o=>{return o['勘定科目'].match(/現金/) ? true : false}}, // Cannot read properties of undefined (reading 'match')
          {name:'BS',action:'delete',arg:{'勘定科目':'現金'}},
        ],{
          getLogFrom: 0,
          getLogOption: {
            cols: true,
            excludeErrors: false,
            simple: true,
          },
        });
        // 実行結果
        console.log(`v.r members = ${Object.keys(v.r)}\nv.r.data members = ${Object.keys(v.r.data)}`)
        if( v.r.hasOwnProperty('data') ){
          console.log(`v.r.data.lastReference=${v.r.data.lastReference}`);
          for( v.cols in v.r.data.cols ){
            console.log(`v.r.data.cols.${v.cols}=${JSON.stringify(v.r.data.cols[v.cols])}`)
          }
          console.log(`v.r.data.log=${JSON.stringify(v.r.data.log)}`);
          return v.r.result;
        } else {
          return v.r;
        }
      },
    ],
    save: [
      ()=>{ // No.0 : テストシート
        return SpreadDB.save();
      },
      ()=>{ // No.1 : マイドライブ > projects > kawazanyo > 0.10.0 > kz.0.10.0 のコピー
        //return SpreadDB.save({SpreadId:'1YxHCS_UAQoQ3ElsJFs817vxLZ4xA_GLLGndEEm0hZWY',sheets:['kz標準']}) // Exceeded maximum execution time
        return SpreadDB.save({SpreadId:'1YxHCS_UAQoQ3ElsJFs817vxLZ4xA_GLLGndEEm0hZWY',sheets:['仕様']})
      },
      ()=>{ // No.2 : kz.0.10.0がフルだとタイムアウト ⇒ 選択されたシートの値のみ

      },
    ],
  };
  console.log(`${v.whois} start.`);
  try {

    // v.src.multi(); // 一シート複数テーブルテスト用の「multi」シートを作成
    ['target','master','log'].forEach(x => v.deleteSheet(x));

    // テスト対象を絞る場合、以下のv.st,numの値を書き換え
    v.p = 'save'; v.st = 0; v.num = 1 || pattern[v.p].length;

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