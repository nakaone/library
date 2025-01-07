function SpreadDbTest(){
  const v = {scenario:'select',start:2,num:-1,//num=0なら全部、マイナスならstart無視して後ろから
    whois:`SpreadDbTest`,step:0,rv:null,
    // ----- 定数・ユーティリティ関数群
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName=null) => {  // テスト用シートの削除関数
      /** deleteSheet: 指定されたテスト用シートを削除
       * @param {string|string[]|null} sheetName=null - string:削除対象シート名(配列可)、null:readme以外全部削除
       * @returns {void}
       */
      if( sheetName === null ){ // 全シート削除
        sheetName = v.spread.getSheets().map(x => x.getName());
      } else if( typeof sheetName === 'string' ){ // 単一のシート名指定
        sheetName = [sheetName];
      }
      sheetName.forEach(x => {
        if( x !== 'readme' ){ // readmeシートのみ削除対象外
          v.sheet = v.spread.getSheetByName(x);
          if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
        }
      });
    },
    reset: (sheetName=[]) => {  // テストの使用するシートのみ再作成
      if( !Array.isArray(sheetName) ) sheetName = [sheetName];
      for( v.i=0 ; v.i<sheetName.length ; v.i++ ){
        v.deleteSheet(sheetName[v.i]);  // シートを削除
        for( v.si in src ){ // 対象シート情報検索
          if( src[v.si].name === sheetName[v.i] ){
            v.sh = src[v.si];
            break;
          }
        }
        SpreadDb({  // 対象シート作成
          command:'create',
          table:v.sh.name,
          cols: (v.sh.cols || null),
          values: (v.sh.values || null),
        },{userId:'Administrator'});
      }
    },
  };
  const src = { // テスト用サンプルデータ
    status: { // "ユーザ管理"シート(colsのみ)
      name: 'ユーザ管理',
      cols: [
        {name:'userId',type:'string'}, // ユーザ識別子(primaryKey)
        {name:'note',type:'string'}, // 備考
        {name:'CPkey',type:'string'}, // クライアント側公開鍵
        {name:'authority',type:'JSON'}, // シート毎のアクセス権限。「シート名:rwdos文字列」形式
        {name:'trial',type:'JSON'}, // ログイン試行関連情報
        {name:'unfreezing',type:'string'}, // 凍結解除日時。通常undefined、凍結時にメンバ追加
        {name:'expiry',type:'string'}, // CPkey有効期限。期限内に適切な暗号化・署名された要求はOKとする
        {name:'lastSync',type:'string'}, // 前回同期日時
        {name:'created',type:'string'}, // ユーザ登録日時
        {name:'updated',type:'string'}, // 最終更新日時
        {name:'deleted',type:'string'}, // 論理削除日時
      ],
    },
    PL: { // "損益計算書"シート(valuesのみ、先頭ヘッダ行)
      name: '損益計算書',
      values: [
        ['大','中','勘定科目','一覧存否','L1','L2','SQ','本籍'],
        ['売上高','','','',1,'','',''],
        ['','売上高','','',1,1,'',''],
        ['','','売上高',22,1,1,1,'貸'],
        ['','売上原価','','',1,2,'',''],
        ['','','仕入高',-1,1,2,1,'借'],
        ['','','仕入値引高',-1,1,2,2,'借'],
        ['','','仕入割戻し高',-1,1,2,3,'借'],
        ['売上総利益','','','',2,'','',''],
        ['','販売費および一般管理費','','',2,1,'',''],
        ['','','役員報酬',35,2,1,1,'借'],
        ['','','給料',-1,2,1,2,'借'],
        ['','','賞与',-1,2,1,3,'借'],
        ['','','退職金',-1,2,1,4,'借'],
        ['','','法定福利費',52,2,1,5,'借'],
        ['','','福利厚生費',57,2,1,6,'借'],
        ['','','販売促進費',-1,2,1,7,'借'],
        ['','','外注費',24,2,1,8,'借'],
        ['','','広告宣伝費',29,2,1,9,'借'],
        ['','','荷造運賃',-1,2,1,10,'借'],
        ['','','会議費',9,2,1,11,'借'],
        ['','','交際費',8,2,1,12,'借'],
        ['','','寄附金',25,2,1,13,'借'],
        ['','','旅費交通費',40,2,1,14,'借'],
        ['','','通信費',63,2,1,15,'借'],
        ['','','新聞図書費',39,2,1,16,'借'],
        ['','','地代家賃',21,2,1,17,'借'],
        ['','','水道光熱費',48,2,1,18,'借'],
        ['','','修繕費',12,2,1,19,'借'],
        ['','','消耗品費',53,2,1,20,'借'],
        ['','','事務用品費',7,2,1,21,'借'],
        ['','','賃借料',-1,2,1,22,'借'],
        ['','','支払報酬料',37,2,1,22,'借'],
        ['','','支払手数料',38,2,1,22,'借'],
        ['','','保険料',11,2,1,23,'借'],
        ['','','租税公課',58,2,1,24,'借'],
        ['','','諸会費',60,2,1,26,'借'],
        ['','','雑費',70,2,1,27,'借'],
        ['','','減価償却費',55,2,1,25,'借'],
        ['','','長期前払費用償却',66,2,1,25,'借'],
        ['営業利益','','','',3,'','',''],
        ['','営業外収益','','',3,1,'',''],
        ['','','受取利息',18,3,1,1,'貸'],
        ['','','受取配当金',-1,3,1,2,'貸'],
        ['','','有価証券売却益',-1,3,1,3,'貸'],
        ['','','有価証券評価益',-1,3,1,4,'貸'],
        ['','','為替差益',-1,3,1,5,'貸'],
        ['','','雑収入',33,3,1,6,'貸'],
        ['','営業外費用','','',3,2,'',''],
        ['','','支払利息',36,3,2,1,'借'],
        ['','','有価証券評価損',-1,3,2,2,'借'],
        ['','','創立費償却',-1,3,2,3,'借'],
        ['','','開業費償却',-1,3,2,4,'借'],
        ['','','貸倒損失',6,3,2,5,'借'],
        ['','','雑損失',69,3,2,6,'借'],
        ['経常利益','','','',4,'','',''],
        ['','特別利益','','',4,1,'',''],
        ['','','固定資産売却益',19,4,1,1,'貸'],
        ['','','投資有価証券売却益',-1,4,1,2,'貸'],
        ['','','貸倒引当金戻入額',-1,4,1,3,'貸'],
        ['','特別損失','','',4,2,'',''],
        ['','','固定資産売却損',-1,4,2,1,'借'],
        ['','','固定資産除却損',-1,4,2,2,'借'],
        ['','','投資有価証券売却損',-1,4,2,3,'借'],
        ['税前利益','','','',5,'','',''],
        ['','法人税・住民税及び事業税','','',5,1,'',''],
        ['','','法人税',-1,5,1,1,'借'],
        ['','','住民税',-1,5,1,2,'借'],
        ['','','事業税',-1,5,1,3,'借'],
        ['','','法人税等',49,5,1,4,'借'],
        ['当期利益','','','',6,'','',''],
        ['','','当期利益',32,6,'',1,'借'],
      ],
    },
    camp: { // "camp2024"シート(cols+values)
      name: 'camp2024',
      cols: [
        {name:'userId',type:'number',primaryKey:true},
        {name:'タイムスタンプ',type:'string'},
        {name:'メールアドレス',type:'string'},
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
        {name:'authority',type:'string'},
        {name:'CPkey',type:'string'},
        {name:'trial',type:'string'},
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
      values: [
        ["タイムスタンプ","メールアドレス","申込者氏名","申込者カナ","申込者の参加","宿泊、テント","引取者氏名","参加者01氏名","参加者01カナ","参加者01所属","参加者02氏名","参加者02カナ","参加者02所属","参加者03氏名","参加者03カナ","参加者03所属","参加者04氏名","参加者04カナ","参加者04所属","参加者05カナ","参加者05氏名","参加者05所属","緊急連絡先","ボランティア募集","備考","キャンセル","authority","CPkey","userId","trial","editURL","entryTime","receptionist","fee00","fee01","fee02","fee03","fee04","fee05","memo"],
        ["2024/10/06 19:51:06","nakairo@gmail.com","国生　邦浩","コクショウ　クニヒロ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","","","","","2","jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=","1","{\"passcode\":920782,\"created\":1728874149915,\"result\":0,\"log\":[{\"timestamp\":1728874165893,\"enterd\":920782,\"status\":1}]}","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnuePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE","","","","","","","","",""],
        ["2024/09/15 12:47:04","va15r@yahoo.co.jp","榎田　素直","エノキダ　スナオ","参加予定(宿泊なし)","宿泊しない","宿泊予定なので不要","榎田　若菜","エノキダ　ワカナ","1年生","","","","","","","","","","","","","9013357002","できる","食事以外でも、お手伝い出来る事があれば。","","1","","2","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo","","","","","","","","",""],
        ["2024/09/15 13:51:37","kuke.m4690@gmail.com","吉野　晃祐","ヨシノ　コウスケ","参加予定(宿泊あり)","宿泊する(テントあり)","宿泊予定なので不要","吉野　涼","ヨシノ　リョウ","6年生","","","","","","","","","","","","","","できる","","","1","","3","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk","","","","","","","","",""],
        ["2024/09/15 14:18:02","naka001@gmail.com","国生　弘子","コクショウ　ヒロコ","参加予定(宿泊なし)","宿泊しない","","国生　悠奈","コクショウ　ユウナ","4年生","","","","","","","","","","","","","","","","","2","k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=","4","{\"passcode\":65698,\"created\":1729076868102,\"result\":0,\"log\":[{\"timestamp\":1728729400367,\"enterd\":119192,\"status\":1}]}","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI","","","","","","","","",""],
        ["2024/09/15 18:17:44","takaki.173@icloud.com","新田　隆行","ニッタ　タカユキ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","9086493601","","","","2","","5","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufYUAyvDIMpF5sXyi49ICUvIq8eI73TSfNFSCfRzYvwwNX_f2M5991pGhnh7dHSS0Q","","","","","","","","",""],
        ["2024/10/11 8:55:06","kafsnxo@cang.jp","中島　幸典","ナカジマ　ユキノリ","不参加","宿泊する(テントなし)","宿泊予定なので不要","中島　楓理","ナカジマ　フウリ","5年生","","","","","","","","","","","","","9035259368","できる","","","1","","6","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufFgoyc-O5e6v8H81HtPrm5LzbPk2h8e8Oy_kWf4_rlguFpTnJoFpJj_9FBPZcEB7o","","","","","","","","",""],
        ["2024/09/16 15:56:10","o9098431480@gmail.com","樹原 幸司","キハラ コウジ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊する(テントなし)","宿泊予定なので不要","","","","","","","","","","","","","","","","","","","","2","clhamUnWtGN6XNQUCwOBstn+69s/iTOgIyf0c52sQHrB7oxSt+fokoL5GhYC1tTO45CJaVrf8jRmd3PwS/UNhGVGH0Q8ePxMN342RETiQJvfiVTHB0rewLK0WWHD4zjxIbyfSoh3p1CBuP1cYlDHn3RS5Nv+NYT0QusxlBT/8i0=","7","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufL97OKOOWgne5ttIJyuOkI-i-hvbqB1p-5KP3tMy_1E-FfKl5BRs4W-mvoKZXI4Zo","","","","","","","","",""],
        ["2024/09/16 17:02:23","sii23@yahoo.co.jp","友田　精一","トモダ　セイイチ","参加予定(宿泊あり)","宿泊する(テントなし)","申込者は参加しないが、申込者がお迎えに行く","友田　悠介","トモダ　ユウスケ","5年生","友田　菜月","トモダ　ナツキ","1年生","友田　綾乃","トモダ　アヤノ","保護者","","","","","","","9065080469","できる","","","1","","8","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudO3FkforwL-KN-e20ZDBFiJdJS5X7mRIC3v1DLx55849cOSOnK0O40lZZkb9dvXMs","","","","","","","","",""],
        ["2024/09/17 12:48:25","mak15@yahoo.ne.jp","奥田　誠","オクダ　マコト","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","","できる","毎回お化け屋敷の設置と案内を担当をしています。","","2","gvxvWv/FkdlZu2OYYJNomOvmubs6//pL0ptfQP7s0RtXELkaoRpZv2hX1hAYMbxb1NQ9+l47tm4UrBMZV410fX/C+n087U0mH99DfzHIRHbHoxJf73O5HKl5p2DYv1YMIaDXJQdPMTw1mVyq5ovSyA9krKMhybLVFQxZlLdT1Q0=","9","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueez5HR3gku37_CBxNV0sVK4fc6cP4IzX2sdO4nRS31NKDv-dGucV8-eEnPY2AvMAQ","","","","","","","","",""],
        ["2024/09/17 14:56:11","sny.mae510@gmail.com","名越　裕香","ナゴシ　ユカ","参加予定(宿泊あり)","宿泊する(テントあり)","宿泊予定なので不要","名越　優芽乃","ナゴシ　ユメノ","1年生","名越　亮","ナゴシ　リョウ","保護者","名越　優翔","ナゴシ　ユウト","未就学児","","","","","","","8011376989","","","","1","","10","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudOb6qOXKHbDi0l5dy9YRsFQVGI7lDmjU39r_485CMkdeAYQuxt4HWmfMpHQD37fUs","","","","","","","","",""]
      ],
    },
    board: {
      name: '掲示板',
      values: [['timestamp','from','to','message'],
      ['2022-10-27T05:45:35.101Z','パパ','スタッフ全員','テスト\n改行\nしてみたぞ'],
      ['2022-10-27T06:23:43.168Z','パパ','本部','ご本部様\nご機嫌麗しく...'],
      ['2022-10-27T07:24:24.216Z','嶋津パパ','嶋津ママ','追加のテスト'],
      ['2022-10-27T07:25:59.339Z','嶋津パパ','嶋津ママ','追加のテスト'],
      ['2022-10-27T07:34:46.564Z','パパ','スタッフ全員','ぼけ'],
      ['2022-10-27T07:43:00.743Z','(未定義)','スタッフ全員','新規投稿'],
      ['2022-10-27T07:57:16.144Z','(未定義)','スタッフ全員','ほれほれ'],
      ['2022-10-27T08:05:03.631Z','パパ','金魚すくい担当','by みゆきさま'],
      ['2022-10-27T08:49:32.196Z','屋上テラス','射的担当','今日も都庁がよく見える。\n特に意味はない。\nホントだよ'],
      ['2022-10-27T10:09:54.791Z','右に空白','スタッフ全員','textareaの幅がおかしい\n'],
      ['2022-10-27T16:02:50.217Z','ぱぱ','校内探検担当','目が覚めた…\nもっかい寝よ'],
      ['2022-10-28T03:02:59.374Z','パパ','スタッフ全員','見えた？'],
      ['2022-10-28T03:03:10.982Z','まま','カレー担当','玉ねぎは薄切り希望'],
      ['2022-10-28T05:56:15.199Z','(未定義)','スタッフ全員','てすと'],
      ['2022-10-28T08:35:49.937Z','嶋津','スタッフ全員','さて、名前が保存されてるかな？'],
      ['2022-10-28T08:36:15.515Z','嶋津','スタッフ全員','されてた❤'],
      ['2022-11-01T05:49:34.454Z','嶋津パパ','嶋津ママ','追加のテスト'],
      ['2022-11-01T06:10:05.150Z','嶋津パパ','嶋津ママ','追加のテスト'],
      ['2022-11-01T06:15:23.668Z','嶋津ぱぱ','受付担当','トイレ行きたい\n誰か来て'],
      ['2022-11-08T01:50:28.670Z','パパ','スタッフ全員','とうこう！'],
      ['2022-11-09T04:48:51.137Z','ぱぱ','校内探検担当','下校中の小学生、\n元気だなぁ'],
      ['2022-11-11T08:36:17.409Z','','スタッフ全員','append getMessages'],
      ['2022-12-06T07:11:41.330Z','しまづパパ','スタッフ全員','てすと'],
      ['2022-12-06T07:18:34.254Z','嶋津ぱぱ','金魚すくい担当','天気晴朗なれど波高し'],
      ['2022-12-12T06:43:53.951Z','嶋津ぱぱ','本部','誤本部様におかれてはご機嫌麗しく。'],
      ['2022-12-13T03:02:05.554Z','嶋津ぱぱ','スタッフ全員','2022-12-13T03:00:00.000Z'],
      ['2022-12-13T06:05:51.111Z','嶋津ぱぱ','スタッフ全員','ひとごーまるご'],
      ['2022-12-13T06:35:40.506Z','嶋津ぱぱ','スタッフ全員','ひとごーさんよん'],
      ['2022-12-23T07:21:21.888Z','嶋津ぱぱ','校内探検担当','わるいごは　いねが〜\nカチャトーラには ビネガ〜'],
      ['2022-12-23T07:43:46.676Z','嶋津ぱぱ','スタッフ全員','こうしんてすと'],
      ['2022-12-27T06:32:25.407Z','嶋津ぱぱ','スタッフ全員','強制遷移抑止テスト'],
      ['2022-12-28T03:26:55.850Z','システム','テスタ','2022-12-28T03:26:55.881Z'],
      ['2023-01-20T08:41:22.368Z','shimazu','スタッフ全員','Hello, world.'],
      ['2023-01-21T03:45:35.480Z','tester','スタッフ全員','2023-01-21T03:45:00.000Z'],
      ['2023-01-21T04:08:05.240Z','しまづぱぱ','スタッフ全員','2023-01-21T04:08:00.000Z'],
      ['2023-01-21T07:17:52.425Z','はんどるねえむ','スタッフ全員','2023-01-21T07:17:00.000Z'],
      ['2023-01-21T08:07:47.800Z','220.144.110.83','スタッフ全員',''],
      ['2023-01-22T03:27:26.860Z','119.240.42.100','スタッフ全員','ふがほげ'],
      ['2023-01-25T07:45:16.307Z','220.144.109.231','スタッフ全員','あいうえお'],
      ['2023-01-25T07:59:10.794Z','220.144.109.231','スタッフ全員','かきくけこ'],
      ['2023-01-25T08:12:22.362Z','220.144.109.231','スタッフ全員','さしすせそ'],
      ['2023-01-25T23:46:08.402Z','半弗　値絵夢','スタッフ全員','たちつてと'],
      ['2023-01-26T00:16:10.868Z','しまづぱぱ','スタッフ全員','なにぬねの'],
      ['2023-01-26T00:19:03.669Z','しまづぱぱ','スタッフ全員','はひふへほ'],
      ['2023-01-26T00:31:22.382Z','しまづ','スタッフ全員','はひふへほ'],
      ['2023-01-26T00:39:44.432Z','嶋津','スタッフ全員','まみむめも'],
      ['2023-01-30T06:13:30.312Z','水戸黄門','スタッフ全員','控えおろうっ！'],
      ['2023-01-31T05:42:42.836Z','手簾戸','スタッフ全員','投稿140'],
      ['2023-02-01T01:17:45.584Z','てすと','スタッフ全員','全員に配信テスト(before Broad.gs deploy)'],
      ['2023-02-01T01:46:23.398Z','てすと','スタッフ全員','スタッフに配信テスト'],
      ['2023-02-01T01:53:49.358Z','てすと','本部','参加者のみに配信テスト'],
      ['2023-02-01T01:54:20.596Z','てすと','本部','スタッフ・参加者両方に配信'],
      ['2023-02-03T07:54:05.432Z','しまづパパ','スタッフ全員','きょうのてすと'],
      ['2023/02/09 15:18:27','しまづパパ','スタッフ全員','129'],
      ['2023/02/10 15:27:38','嶋津パパ','スタッフ全員','r.1.4.4、リリースしました']],
    },
    autoIncrement: {
      name: 'AutoInc',
      cols: [
        {name:'pKey',auto_increment:10,primaryKey:true},
        {name:'ラベル',type:'string',unique:true},
        {name:'ぬる',auto_increment:null},
        {name:'真',auto_increment:true},
        {name:'偽',auto_increment:false},
        {name:'配列①',auto_increment:[20]},
        {name:'配列②',auto_increment:[30,-1]},
        {name:'obj',auto_increment:{start:40,step:5}},
        {name:'def関数',default:"o => {return toLocale(new Date())}"},
      ],
      values: [{'ラベル':'fuga'},{'ラベル':'hoge'}],
    }
  };
  const scenario = {
    create: [ // create関係のテスト群
      { // 0.基本形
        query: [
          {command:'create',table:src.status.name,cols:src.status.cols},  // 「ユーザ管理」シート作成
          {command:'create',table:src.PL.name,values:src.PL.values},  // 「損益計算書」シート作成
          {command:'create',table:src.camp.name,cols:src.camp.cols,values:src.camp.values},  // 「camp2024」シート作成
          {command:'create',table:src.board.name,values:src.board.values},  // 「掲示板」シート作成
          {command:'create',table:src.autoIncrement.name,cols:src.autoIncrement.cols,values:src.autoIncrement.values},  // 「AutoInc」シート作成  
        ],
        opt: {userId:'Administrator'},
        check: sdbMain => { // 結果を分析、レポートを出力する関数
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.rv.push(`query.${v.i} ----------`);
            v.rv.push(`ErrCD: ${sdbMain[v.i].ErrCD}`);
            v.rv.push(`command: ${sdbMain[v.i].query.command}`);
            v.rv.push(`table: ${sdbMain[v.i].query.table}`);
          };
          v.rv = [...v.rv,
            '【シート確認事項】',
            '①対象シートは全て作成されているか',
            '②メモの内容は適切か',
            '③ユーザ管理シート以外、シートには初期データが入っているか',
            '④掲示板シートのメッセージは改行されているか',
            'camp2024のuserIdはprimaryKeyになっているか',
            'camp2024の左端列はtimestampからuserIdに変更されているか',
            '各シートのcreateがlogシートに出力されているか',
          ];
          return v.rv.join('\n');
        }
      },{ // 1.userId未指定では作成できないことの確認
        query: {command:'create',table:src.status.name,cols:src.status.cols},  // 「ユーザ管理」シート作成
        // optは指定しない(ユーザ未定)
        check: sdbMain => { // 結果を分析、レポートを出力する関数
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.result = sdbMain[v.i].ErrCD === 'No Authority' ? 'success' : 'failed';
            v.rv = [...v.rv,
              `query.${v.i} [${v.result}] ----------`,
              `ErrCD: ${sdbMain[v.i].ErrCD}`,
              `command: ${sdbMain[v.i].query.command}`,
              `table: ${sdbMain[v.i].query.table}`,
            ];
          };
          return v.rv.join('\n');
        }
      },{ // 2.管理者以外は作成できないことの確認
        query: {command:'create',table:src.status.name,cols:src.status.cols},  // 「ユーザ管理」シート作成
        opt: {userId:'fuga'},
        check: (sdbMain,query,opt) => { // 結果を分析、レポートを出力する関数
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.result = (sdbMain[v.i].ErrCD === 'No Authority'
            && sdbMain[v.i].log.userId === opt.userId
            ) ? 'success' : 'failed';
            v.rv = [...v.rv,
              `query.${v.i} [${v.result}] ----------`,
              `ErrCD: ${sdbMain[v.i].ErrCD}`,
              `log.userId: ${sdbMain[v.i].log.userId}`,
              `command: ${sdbMain[v.i].query.command}`,
              `table: ${sdbMain[v.i].query.table}`,
            ];
          };
          return v.rv.join('\n');
        }
      },
    ],
    select: [ // select関係のテスト群
      { // 0.基本形
        reset: ['掲示板'],
        query: [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"},
          // 日付の比較では"new Date()"を使用。ちなみにgetTime()無しで比較可能
          {table:'掲示板',command:'select',where:"o=>{return new Date(o.timestamp) < new Date('2022/11/1')"},
        ],
        opt: {userId:'Administrator'},
        check: (sdbMain,query,opt) => { // 結果を分析、レポートを出力する関数
          console.log(JSON.stringify(sdbMain));
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.result = (sdbMain[v.i].ErrCD === null
            && sdbMain[v.i].rows.length === 6
            ) ? 'success' : 'failed';
            v.rv = [...v.rv,
              `query.${v.i} [${v.result}] ----------`,
              `table.command: ${query.table}.${query.command}`,
              `ErrCD: ${sdbMain[v.i].ErrCD}`,
              `rows: ${sdbMain[v.i].rows.length}`,
              `log.userId: ${sdbMain[v.i].log.userId}`,
            ];
          };
          return v.rv.join('\n');
        }
      },{ // 1.ゲストに「掲示板」の読込を許可した場合
        reset: [], //['掲示板'],
        query: [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
        ],
        opt: {guestAuth:{'掲示板':'r'}},  // ゲストに掲示板の読込権限付与
        check: (sdbMain,query,opt) => { // 結果を分析、レポートを出力する関数
          console.log(JSON.stringify(sdbMain));
          console.log(JSON.stringify(query));
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.result = sdbMain[v.i].ErrCD === null ? 'success' : 'failed';
            v.rv = [...v.rv,
              `query.${v.i} [${v.result}] ----------`,
              `table.command: ${sdbMain[v.i].log.table}.${sdbMain[v.i].log.command}`,
              `ErrCD(${whichType(sdbMain[v.i].ErrCD)}): ${sdbMain[v.i].ErrCD}`,
              `rows: ${sdbMain[v.i].rows.length}`,
              `log.userId: ${sdbMain[v.i].log.userId}`,
            ];
          };
          return v.rv.join('\n');
        }
      },{ // 2.ゲストに「掲示板」の読込を許可しなかった場合 ⇒ 「権限無し」エラー
        reset: [], //['掲示板'],
        query: [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
        ],
        opt: {},  // ゲストなので、ユーザID,権限指定は無し
        check: (sdbMain,query,opt) => { // 結果を分析、レポートを出力する関数
          //console.log(JSON.stringify(sdbMain));
          v.rv = [];
          for( v.i=0 ; v.i<sdbMain.length ; v.i++ ){
            v.result = sdbMain[v.i].ErrCD === 'No Authority' ? 'success' : 'failed';
            v.rv = [...v.rv,
              `query.${v.i} [${v.result}] ----------`,
              `table.command: ${sdbMain[v.i].log.table}.${sdbMain[v.i].log.command}`,
              `ErrCD(${whichType(sdbMain[v.i].ErrCD)}): ${sdbMain[v.i].ErrCD}`,
              `rows: ${Array.isArray(sdbMain[v.i].rows) ? sdbMain[v.i].rows.length : sdbMain[v.i].rows}`,
              `log.userId: ${sdbMain[v.i].log.userId}`,
            ];
          };
          return v.rv.join('\n');
        }
      }
      /*
      ],[  // 
        {command:'create',table:src.board.name,values:src.board.values},
        [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
          {},  // ゲストなので、ユーザID,権限指定は無し
        ],
      ],[ // 3.ユーザに掲示板の読込権限付与
        {command:'create',table:src.board.name,values:src.board.values},
        [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
          {userId: 'pikumin',userAuth:{'掲示板':'r'}}
        ],
      ],[ // 4.ユーザに掲示板の読込権限を付与しなかった場合 ⇒ 「権限無し」エラー
        {command:'create',table:src.board.name,values:src.board.values},
        [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
          {userId: 'pikumin',userAuth:{'掲示板':'w'}}
        ],
      ],[ // 5.ユーザ権限未指定の場合 ⇒ 「権限無し」エラー
        {command:'create',table:src.board.name,values:src.board.values},
        [
          {table:'掲示板',command:'select',where:"o=>{return o.from=='パパ'}"}, // 「掲示板」を参照
          {userId: 'pikumin'}
        ],
      ],
      */
    ],
  };

  try {

    v.step = 1; // v.scenarioで指定されたテスト群について、v.startからv.num個分を実行
    if( v.num < 0 ){
      v.step = 1.1; // 指定テスト群の後ろからv.num個
      v.st = scenario[v.scenario].length + v.num;
      v.ed = scenario[v.scenario].length;
    } else if( v.num === 0 ){
      v.step = 1.2; // 指定テスト群全部実行
      v.st = v.start;
      v.ed = scenario[v.scenario].length;
    } else {
      v.step = 1.3; // v.startからv.num個
      v.st = v.start;
      v.ed = v.start + v.num;
    }

    v.step = 2;
    for( v.idx=v.st ; v.idx<v.ed ; v.idx++ ){
      v.step = 2.1; // テスト用データをセット
      if( Object.hasOwn(scenario[v.scenario][v.idx],'reset') ){
        v.reset(scenario[v.scenario][v.idx].reset); // 再作成シート指定が有ればその指示に従う
      } else {
        v.deleteSheet(); // 既存シートを全部削除
      }

      v.step = 2.2; // scenarioからqueryとoptをセット
      v.r = SpreadDb(
        scenario[v.scenario][v.idx].query,
        scenario[v.scenario][v.idx].opt
      );
      if( v.r instanceof Error ) throw v.r;

      v.step = 2.3; // テスト結果(サマリ)の表示
      v.msg = `===== ${v.whois} end: scenario=${v.scenario}.${v.idx}\n`;
      console.log(v.msg+scenario[v.scenario][v.idx].check(v.r,scenario[v.scenario][v.idx].query,scenario[v.scenario][v.idx].opt));
    }

  } catch(e) {
    console.error(`${v.whois} abnormal end at step.${v.step}\n${e.message}`);
  }
}