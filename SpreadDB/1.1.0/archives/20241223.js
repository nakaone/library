function SpreadDbTest(){
  /* 引数の形式
  - query {Object[]} 操作要求の内容
    - table {string} 操作対象テーブル名
    - command {string} 操作名。select/update/delete/append/schema
    - arg {object} 操作に渡す引数。command系内部関数の引数参照
  - opt {Object}={} オプション
    - userId {string}='guest' ユーザの識別子
    - userAuth {Object.<string,string>}={} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
    - log {string}='log' 更新履歴テーブル名
    - tables {Object[]} 新規作成するテーブルのデータ(genTablesの引数の配列)
    - maxTrial {number}=5 テーブル更新時、ロックされていた場合の最大試行回数
    - interval {number}=10000 テーブル更新時、ロックされていた場合の試行間隔(ミリ秒)
    - guestAuth {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
    - adminId {string} 管理者として扱うuserId
  */
  const v = {do:{p:'create',st:2,num:1},//num=0なら全部
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
    summary: a => { // 戻り値(Object[])の結果確認
      let rv = [`${v.whois} end: return value type: ${whichType(a)}`];
      a.forEach(o => {
        let result = {
          command: o.query.command,
          isErr: `${String(o.isErr)}(${whichType(o.isErr)})`,
          message: `${o.message||''}(${whichType(o.message)})`,
        };
        if( Object.hasOwn(o,'data') ) result.data = o.data;
        let json = JSON.stringify(result,null,2);
        rv = [...rv,...json.split('\n')]
      });
      console.log(rv.join('\n'));
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
        {name:'entryNo',type:'number',primaryKey:true},
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
      values: [["タイムスタンプ","メールアドレス","申込者氏名","申込者カナ","申込者の参加","宿泊、テント","引取者氏名","参加者01氏名","参加者01カナ","参加者01所属","参加者02氏名","参加者02カナ","参加者02所属","参加者03氏名","参加者03カナ","参加者03所属","参加者04氏名","参加者04カナ","参加者04所属","参加者05カナ","参加者05氏名","参加者05所属","緊急連絡先","ボランティア募集","備考","キャンセル","authority","CPkey","entryNo","trial","editURL","entryTime","receptionist","fee00","fee01","fee02","fee03","fee04","fee05","memo"],["2024/10/06 19:51:06","nakairo@gmail.com","国生　邦浩","コクショウ　クニヒロ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","","","","","2","jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=","1","{\"passcode\":920782,\"created\":1728874149915,\"result\":0,\"log\":[{\"timestamp\":1728874165893,\"enterd\":920782,\"status\":1}]}","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnuePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE","","","","","","","","",""],["2024/09/15 12:47:04","va15r@yahoo.co.jp","榎田　素直","エノキダ　スナオ","参加予定(宿泊なし)","宿泊しない","宿泊予定なので不要","榎田　若菜","エノキダ　ワカナ","1年生","","","","","","","","","","","","","9013357002","できる","食事以外でも、お手伝い出来る事があれば。","","1","","2","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo","","","","","","","","",""],["2024/09/15 13:51:37","kuke.m4690@gmail.com","吉野　晃祐","ヨシノ　コウスケ","参加予定(宿泊あり)","宿泊する(テントあり)","宿泊予定なので不要","吉野　涼","ヨシノ　リョウ","6年生","","","","","","","","","","","","","","できる","","","1","","3","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk","","","","","","","","",""],["2024/09/15 14:18:02","naka001@gmail.com","国生　弘子","コクショウ　ヒロコ","参加予定(宿泊なし)","宿泊しない","","国生　悠奈","コクショウ　ユウナ","4年生","","","","","","","","","","","","","","","","","2","k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=","4","{\"passcode\":65698,\"created\":1729076868102,\"result\":0,\"log\":[{\"timestamp\":1728729400367,\"enterd\":119192,\"status\":1}]}","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI","","","","","","","","",""],["2024/09/15 18:17:44","takaki.173@icloud.com","新田　隆行","ニッタ　タカユキ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","9086493601","","","","2","","5","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufYUAyvDIMpF5sXyi49ICUvIq8eI73TSfNFSCfRzYvwwNX_f2M5991pGhnh7dHSS0Q","","","","","","","","",""],["2024/10/11 8:55:06","kafsnxo@cang.jp","中島　幸典","ナカジマ　ユキノリ","不参加","宿泊する(テントなし)","宿泊予定なので不要","中島　楓理","ナカジマ　フウリ","5年生","","","","","","","","","","","","","9035259368","できる","","","1","","6","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufFgoyc-O5e6v8H81HtPrm5LzbPk2h8e8Oy_kWf4_rlguFpTnJoFpJj_9FBPZcEB7o","","","","","","","","",""],["2024/09/16 15:56:10","o9098431480@gmail.com","樹原 幸司","キハラ コウジ","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊する(テントなし)","宿泊予定なので不要","","","","","","","","","","","","","","","","","","","","2","clhamUnWtGN6XNQUCwOBstn+69s/iTOgIyf0c52sQHrB7oxSt+fokoL5GhYC1tTO45CJaVrf8jRmd3PwS/UNhGVGH0Q8ePxMN342RETiQJvfiVTHB0rewLK0WWHD4zjxIbyfSoh3p1CBuP1cYlDHn3RS5Nv+NYT0QusxlBT/8i0=","7","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufL97OKOOWgne5ttIJyuOkI-i-hvbqB1p-5KP3tMy_1E-FfKl5BRs4W-mvoKZXI4Zo","","","","","","","","",""],["2024/09/16 17:02:23","sii23@yahoo.co.jp","友田　精一","トモダ　セイイチ","参加予定(宿泊あり)","宿泊する(テントなし)","申込者は参加しないが、申込者がお迎えに行く","友田　悠介","トモダ　ユウスケ","5年生","友田　菜月","トモダ　ナツキ","1年生","友田　綾乃","トモダ　アヤノ","保護者","","","","","","","9065080469","できる","","","1","","8","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudO3FkforwL-KN-e20ZDBFiJdJS5X7mRIC3v1DLx55849cOSOnK0O40lZZkb9dvXMs","","","","","","","","",""],["2024/09/17 12:48:25","mak15@yahoo.ne.jp","奥田　誠","オクダ　マコト","スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊しない","","","","","","","","","","","","","","","","","","できる","毎回お化け屋敷の設置と案内を担当をしています。","","2","gvxvWv/FkdlZu2OYYJNomOvmubs6//pL0ptfQP7s0RtXELkaoRpZv2hX1hAYMbxb1NQ9+l47tm4UrBMZV410fX/C+n087U0mH99DfzHIRHbHoxJf73O5HKl5p2DYv1YMIaDXJQdPMTw1mVyq5ovSyA9krKMhybLVFQxZlLdT1Q0=","9","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueez5HR3gku37_CBxNV0sVK4fc6cP4IzX2sdO4nRS31NKDv-dGucV8-eEnPY2AvMAQ","","","","","","","","",""],["2024/09/17 14:56:11","sny.mae510@gmail.com","名越　裕香","ナゴシ　ユカ","参加予定(宿泊あり)","宿泊する(テントあり)","宿泊予定なので不要","名越　優芽乃","ナゴシ　ユメノ","1年生","名越　亮","ナゴシ　リョウ","保護者","名越　優翔","ナゴシ　ユウト","未就学児","","","","","","","8011376989","","","","1","","10","","https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudOb6qOXKHbDi0l5dy9YRsFQVGI7lDmjU39r_485CMkdeAYQuxt4HWmfMpHQD37fUs","","","","","","","","",""]],
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
        {name:'ラベル',type:'string'},
        {name:'ぬる',auto_increment:null},
        {name:'真',auto_increment:true},
        {name:'偽',auto_increment:false},
        {name:'配列①',auto_increment:[20]},
        {name:'配列②',auto_increment:[30,-1]},
        {name:'obj',auto_increment:{base:40,step:5}},
        {name:'def関数',default:"o => toLocale(new Date())"},
      ],
      values: [{'ラベル':'fuga'},{'ラベル':'hoge'}],
    }
  };
  const pattern = { /* テストパターン(関数)の定義
    - ログへの出力形式
    - メモの中の形式
    */
    create: [  // create関係のテスト
      () => { // 0.基本形
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // 複数テーブルの作成
          {command:'create',arg:src.status},
          {command:'create',arg:src.camp},
          {command:'create',arg:src.PL},
        ],{userId:'Administrator'}));
      },
      () => { // 1.管理者以外で作成できないことの確認
        v.deleteSheet();
        // 管理者とユーザが異なる
        v.summary(SpreadDb({command:'create',arg:src.status},{userId:'pikumin'}));
        // 管理者の指定無し
        v.summary(SpreadDb({command:'create',arg:src.camp},{userId:'pikumin'}));
        // ユーザの指定無し
        v.summary(SpreadDb({command:'create',arg:src.PL}));
      },
      () => { // 2.auto_increment, defaultが設定されるかのテスト
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // 複数テーブルの作成
          {command:'create',arg:src.autoIncrement},
        ],{userId:'Administrator'}));

      },
    ],
    select : [  // selectRow関係のテスト
      () => { // 0.基本形
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // テスト用シートを準備
          {command:'create',arg:src.camp},  // 「camp2024」シート作成
          {command:'create',arg:src.board},  // 「掲示板」シート作成
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}}, // 参照
          // 日付の比較では"new Date()"を使用。ちなみにgetTime()無しで比較可能
          {table:'掲示板',command:'select',arg:{where:"o=>{return new Date(o.timestamp) < new Date('2022/11/1')"}},
        ],{userId:'Administrator'})); // 管理者でログイン
      },
      () => { // 1.ゲストによるアクセス
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // テスト用シートを準備
          {command:'create',arg:src.board},  // 「掲示板」シート作成
        ],{userId:'Administrator'})); // 管理者でログイン

        v.summary(SpreadDb([  // ゲストに「掲示板」の読込を許可した場合
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}}, // 「掲示板」を参照
        ],{
          // ゲストなので、ユーザID,権限指定は無し
          guestAuth:{'掲示板':'r'}, // ゲストに掲示板の読込権限付与
        }));

        v.summary(SpreadDb([  // ゲストに「掲示板」の読込を許可しなかった場合
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}}, // 「掲示板」を参照
        ],{
          // ゲストなので、ユーザID,権限指定は無し
          //guestAuth:{'掲示板':'r'}, // ゲストに掲示板の読込権限付与
        }));
      },
      () => { // 2.ユーザによるアクセス
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // テスト用シートを準備
          {command:'create',arg:src.board},  // 「掲示板」シート作成
        ],{userId:'Administrator'})); // 管理者でログイン

        v.summary(SpreadDb([  // ユーザに「掲示板」の読込を許可した場合 ⇒ 該当データ取得
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}},
        ],{
          userId: 'pikumin',
          userAuth:{'掲示板':'r'}, // ユーザに掲示板の読込権限付与
        }));

        v.summary(SpreadDb([  // ユーザに「掲示板」の読込を許可しなかった場合 ⇒ 「権限無し」エラー
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}},
        ],{
          userId: 'pikumin',
          userAuth:{'掲示板':'w'}, // ユーザに掲示板の読込権限を付与しなかった場合 ⇒ 「権限無し」エラー
        }));

        v.summary(SpreadDb([  // ユーザの権限を未指定の場合
          {table:'掲示板',command:'select',arg:{where:"o=>{return o.from=='パパ'}"}},
        ],{
          userId: 'pikumin',
        }));

      },
    ],
    update: [ // updateRow関係のテスト
      () => { // 0.正常系(Administrator)
        // 複数項目の一括更新
        // 複数テーブルの一括更新
        // 更新対象の①関数による指定、②オブジェクトによる指定、③主キー値による指定
        // 更新値の①関数による指定、②オブジェクトによる指定、③値による指定
        // unique項目のチェック、また同一レコード複数unique項目の場合、全項目がエラーになるかチェック
        v.deleteSheet(); // 既存シートを全部削除
        v.summary(SpreadDb([  // 複数テーブルの作成
          {command:'create',arg:src.camp},
          {command:'create',arg:src.PL},
        ],{userId:'Administrator'}));


      },
      () => { // 1.ゲスト
        // 権限付与した場合
        // 権限付与しなかった場合
      },
      () => { // 2.ユーザ
        // 権限付与した場合
        // 権限付与しなかった場合
      },
    ],
    append: [ // appendRow関係のテスト
      () => { // 0.正常系(Administrator)
        // AutoIncシートでオートインクリメント
        // 既定値設定項目、unique項目に重複値
        // 複数レコードの追加
      },
      () => { // 1.ゲスト
        // 権限付与した場合
        // 権限付与しなかった場合
      },
      () => { // 2.ユーザ
        // 権限付与した場合
        // 権限付与しなかった場合
      },
    ],
    delete: [ // deleteRow関係のテスト
      () => { // 0.正常系(Administrator)
      },
      () => { // 1.ゲスト
        // 権限付与した場合
        // 権限付与しなかった場合
      },
      () => { // 2.ユーザ
        // 権限付与した場合
        // 権限付与しなかった場合
      },
    ],
    schema: [ // getSchema関係のテスト
      () => { // 0.正常系(Administrator)
        // メモで内容修正後、その修正が反映されているか
      },
      () => { // 1.ゲスト
        // 権限付与した場合
        // 権限付与しなかった場合
      },
      () => { // 2.ユーザ
        // 権限付与した場合
        // 権限付与しなかった場合
      },
    ],
    own: [  // 権限'o'によるアクセス
      () => {
        // 自レコードは参照可
        // 自レコード以外は参照不可
        // 自レコードは更新可
        // 自レコード以外は更新不可
        // 削除は自レコードを含め全て不可
        // テーブル管理情報取得は全て不可
      },
    ]
  };
  for( v.i=v.do.st ; v.i<(v.do.num===0 ? pattern[v.do.p].length : v.do.st+v.do.num) ; v.i++ ) pattern[v.do.p][v.i]();
}

/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 *
 * - rev.1.0.0 -> rev.1.1.0 変更点
 *   - 上・左余白不可、複数テーブル/シート不可に変更(∵ロジックが複雑で保守性低下)
 *     - テーブル名とシート名が一致
 *     - 左上隅のセルはA1に固定
 *   - 「更新履歴」の各項目の並び・属性他について、シート上の変更は反映されない(システム側で固定)
 *   - 各シートの権限チェックロジックを追加(opt.account)
 *   - クロージャを採用(append/update/deleteをprivate関数化)
 *     - select文を追加(従来のclass方式ではインスタンスから直接取得)
 *     - インスタンスを返す方式から、指定された操作(query)の結果オブジェクトを返すように変更
 *   - getSchemaメソッドを追加
 *   - 旧版のgetLogは廃止(select文で代替)
 * - 仕様の詳細は[workflowy](https://workflowy.com/#/4e03d2d2c266)参照
 */
function SpreadDb(query=[],opt={}){
  /**
   * main: SpreadDb主処理
   */
  const v = {step:0,rv:[],log:[]};
  const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
  console.log(`${pv.whois} start.`);
  try {

    v.step = 1.1; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      userId: 'guest', // {string} ユーザの識別子
      userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
      guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
      adminId: 'Administrator', // {string} 管理者として扱うuserId
    },opt);

    v.step = 1.2; // メンバ登録：内部設定項目
    Object.assign(pv,{
      spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
      sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
      table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
      log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
    });

    v.step = 2; // 変更履歴テーブルのsdbTable取得。無ければ作成
    v.r = genTable({name:pv.opt.log});
    if( v.r instanceof Error ) throw v.r;
    if( v.r === null ){
      v.r = createTable({
        name: pv.opt.log,
        cols: genLog(), // sdbLog各項目の定義集
      });
      if( v.r instanceof Error ) throw v.r;
    } else {
      pv.table[pv.opt.log] = v.r;
    }

    v.step = 3; // queryを順次処理処理

    if( !Array.isArray(query) ) query = [query];  // queryを配列化
    v.lock = LockService.getDocumentLock(); // スプレッドシートのロックを取得

    for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
      if( v.lock.tryLock(pv.opt.interval) ){

        v.step = 3.1; // ロック成功、シートの更新処理開始
        for( v.i=0 ; v.i<query.length ; v.i++ ){

          v.step = 3.11; // 戻り値、ログの既定値を設定
          v.queryResult = {query:query[v.i],isErr:false,message:'',data:null,log:null};

          v.step = 3.12; // 操作対象のテーブル管理情報が無ければ作成
          if( !Object.hasOwn(pv.table,query[v.i].table) ){
            v.r = genTable({name:query[v.i].table});
            if( v.r instanceof Error ) throw v.r;
            pv.table[query[v.i].table] = v.r;
          }

          v.step = 3.13; // ユーザの操作対象シートに対する権限をv.allowにセット
          v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : ( pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query[v.i].table] || '')  // ゲスト(userId指定無し)
          : ( pv.opt.userAuth[query[v.i].table] || ''));  // 通常ユーザ

          v.step = 3.14; // createでテーブル名を省略した場合は補完
          if( query[v.i].command === 'create' && !Object.hasOwn(query[v.i],'table') ){
            query[v.i].table = query[v.i].arg.name;
          }

          v.step = 3.2; // 処理内容を元に、必要とされる権限が与えられているか確認
          if( v.allow.includes('o') ){

            v.step = 3.21;
            // o(own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
            // また検索対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
            //read/writeは自分のみ可、delete/schemaは実行不可
            query[v.i].arg.where = pv.opt.userId;  // 自レコードのみ対象に限定
            switch( query[v.i].command ){
              case 'select': v.isOK = true; v.func = selectRow; break;
              case 'update': v.isOK = true; v.func = updateRow; break;
              default: v.isOK = false;
            }

          } else {

            v.step = 3.22;
            switch( query[v.i].command ){
              case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
              case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
              case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
              case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
              case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
              case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
              default: v.isOK = false;
            }
          }

          // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
          if( v.isOK ){

            v.step = 3.3; // 処理実行
            if( query[v.i].command !== 'create' ){
              // create以外の場合、操作対象のテーブル管理情報をcommand系メソッドの引数に追加
              if( !pv.table[query[v.i].table] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
                pv.table[query[v.i].table] = genTable({name:query[v.i].table});
                if( pv.table[query[v.i].table] instanceof Error ) throw pv.table[query[v.i].table];
              }
              query[v.i].arg.table = pv.table[query[v.i].table];
            }
            v.sdbLog = v.func(query[v.i].arg);

            if( v.sdbLog instanceof Error ){

              v.step = 3.31; // selectRow, updateRow他のcommand系メソッドでエラー発生
              // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
              Object.assign(v.queryResult,{
                isErr: true,
                message: v.sdbLog.message
              });
              v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                result: false,
                message: v.sdbLog.message,
                // before, after, diffは空欄
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

            } else {

              v.step = 3.32; // command系メソッドが正常終了した場合の処理
              if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){
                v.step = 3.321; // select, schemaは結果をdataにセット
                v.queryResult.data = v.sdbLog;
                v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                  result: true,
                  // messageは空欄
                  // before, diffは空欄、afterに出力件数をセット
                  after: query[v.i].command === 'select' ? `rownum=${v.sdbLog.length}` : null,
                });
                if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
              } else {
                v.step = 3.322; // update, append, deleteは実行結果(sdbLog)をlogにセット
                v.queryResult.log = v.sdbLog;
              }
            }

          } else {

            v.step = 3.4; // isOKではない場合
            v.msg = `シート「${query[v.i].table}」に対して'${query[v.i].command}'する権限がありません`;
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.msg,
            });
            v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
              result: false,
              message: v.msg,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
          }

          v.step = 3.5; // 実行結果を戻り値に追加
          v.rv.push(v.queryResult);
        }

        v.step = 3.6; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.r = appendRow({
          table: pv.table[pv.opt.log],
          record: v.rv.map(x => x.log)[0],
        });
        if( v.r instanceof Error ) throw v.r;

        v.step = 3.7; // ロック解除
        v.lock.releaseLock();
        v.tryNo = 0;
      }
    }

    v.step = 9; // 終了処理
    console.log(`${pv.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  /** appendRow: 領域に新規行を追加
   * @param {Object|Object[]} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|Object[]} arg.record=[] - 追加する行オブジェクト
   * @returns {sdbLog[]}
   */
  function appendRow(arg){
    const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[]};
    console.log(`${v.whois} start: target="${arg.table.name}", rows=${arg.record.length}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      if( !Array.isArray(arg.record)) arg.record = [arg.record];
      v.target = [];  // 対象領域のシートイメージを準備

      // ------------------------------------------------
      v.step = 2; // 追加レコードをシートイメージに展開
      // ------------------------------------------------
      for( v.i=0 ; v.i<arg.record.length ; v.i++ ){

        v.step = 2.1; // 一件分のログオブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'append',
          arg: arg.record,
          result: true,
          //message, before, after, diffは後工程で追加
        });
        if( v.log instanceof Error ) throw v.log;

        v.step = 2.2; // auto_increment項目に値を設定
        // ※ auto_increment設定はuniqueチェックに先行
        for( v.ai in arg.table.schema.auto_increment ){
          if( !arg.record[v.i][v.ai] ){ // 値が未設定だった場合は採番実行
            arg.table.schema.auto_increment[v.ai].current += arg.table.schema.auto_increment[v.ai].step;
            arg.record[v.i][v.ai] = arg.table.schema.auto_increment[v.ai].current;
          }
        }

        v.step = 2.3; // 既定値の設定
        for( v.dv in arg.table.schema.defaultRow ){
          arg.record[v.i][v.dv] = arg.table.schema.defaultRow[v.dv](arg.record[v.i]);
        }

        v.step = 2.4; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(arg.record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.log.result = false;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.log.message = v.log.message === null ? [] : v.log.message.split('\n');
            v.log.message.push(`${v.unique}欄の値「${arg.record[v.i][v.unique]}」が重複しています`);
            v.log.message = v.log.message.join('\n');
          } else {
            // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.record[v.i][v.unique]);
          }
        }

        v.step = 2.5; // 正当性チェックOKの場合の処理
        if( v.log.result ){

          v.step = 2.51; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<arg.table.header.length ; v.j++ ){
            v.a = arg.record[v.i][arg.table.header[v.j]];
            v.row[v.j] = (v.a && v.a !== 'null' && v.a !== 'undefined') ? v.a : '';
          }
          v.target.push(v.row);

          v.step = 2.52; // arg.table.valuesへの追加
          arg.table.values.push(arg.record[v.i]);

          v.step = 2.53; // ログに追加レコード情報を記載
          v.log.after = v.log.diff = JSON.stringify(arg.record[v.i]);
        }

        v.step = 2.6; // 成否に関わらず戻り値に保存
        v.rv.push(v.log);
      }

      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // 対象シートへの展開
      if( v.target.length > 0 ){
        arg.table.sheet.getRange(
          arg.table.rownum + 2,
          1,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
      v.step = 3.2; // arg.table.rownumの書き換え
      arg.table.rownum += v.target.length;

      v.step = 9; // 終了処理
      v.rv = v.rv;
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** convertRow: シートイメージと行オブジェクトの相互変換
   * @param {any[][]|Object[]} data - 行データ。シートイメージか行オブジェクトの配列
   * @param {string[]} [header]=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用
   * @returns {Object}
   *
   * - 戻り値のオブジェクト
   *   - raw {any[][]} シートイメージ
   *   - obj {Object[]} 行オブジェクトの配列
   *   - header {string} ヘッダ行
   */
  function convertRow(data,header=[]){
    const v = {whois:pv.whois+'.convertRow',step:0,rv:{raw:[],obj:[],header:header}};
    console.log(`${v.whois} start.`);
    try {

      if( Array.isArray(data[0]) ){ v.step = 1; // シートイメージ -> 行オブジェクト

        v.step = 1.1; // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
        for( v.i=1 ; v.i<data.length ; v.i++ ){
          v.o = {};
          for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
            if( data[v.i][v.j] ){
              v.o[data[0][v.j]] = data[v.i][v.j];
            }
          }
          v.rv.obj.push(v.o);
        }

        v.step = 1.2; // 引数headerが無ければrv.headerはシートイメージ先頭行とする
        if( header.length === 0 ){
          v.rv.header = data[0];
        }

      } else { v.step = 2; // 行オブジェクト -> シートイメージ

        v.rv.obj = data;        
        if( header.length === 0 ){ // 引数headerが無ければメンバ名からrv.headerを生成
          v.rv.header = [...new Set(data.flatMap(d => Object.keys(d)))];
        }

      }

      v.step = 3; // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
      for( v.i=0 ; v.i<v.rv.obj.length ; v.i++ ){
        v.arr = [];
        for( v.j=0 ; v.j<v.rv.header.length ; v.j++ ){
          v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]] || '');
        }
        v.rv.raw.push(v.arr);
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** createTable: 新規にシートを作成
   * @param {sdbTable} arg
   * @param {string} arg.name - テーブル名
   * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
   * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
   * @returns {sdbLog}
   */
  function createTable(arg){
    const v = {whois:`${pv.whois}.createTable`,step:0,rv:[]};
    console.log(`${v.whois} start. arg.name=${arg.name}`);
    try {

      v.step = 1; // 一件分のログオブジェクトを作成
      v.log = genLog({
        table: arg.name,
        command: 'create',
        arg: arg.cols,
        result: true,
        message: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
        // before, after, diffは空欄
      });
      if( v.log instanceof Error ) throw v.log;

      // ----------------------------------------------
      v.step = 2; // テーブル管理情報の作成
      // ----------------------------------------------
      if( Object.hasOwn(pv.table,arg.name) ){
        v.step = 2.1; // 作成済の場合、そのまま使用
        v.table = pv.table[arg.name];
      } else {  // 以下テーブル管理情報未作成の場合の処理

        v.step = 2.2; // sdbTableのプロトタイプ作成
        v.table = {
          name: arg.name, // {string} テーブル名(範囲名)
          account: pv.opt.userId, // {string} 更新者のアカウント
          sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
          schema: null, // {sdbSchema} シートの項目定義
          values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
          header: [], // {string[]} 項目名一覧(ヘッダ行)
          notes: [], // {string[]} ヘッダ行のメモ
          colnum: 0, // {number} データ領域の列数
          rownum: 0, // {number} データ領域の行数
        };

        if( arg.cols ){ v.step = 2.3; // 項目定義情報が存在する場合

          v.table.header = arg.cols.map(x => x.name);
          v.table.colnum = v.table.header.length;

          if( arg.values ){ v.step = 2.31; // 項目定義と初期データの両方存在

            // 項目の並びを指定してconvertRow
            v.convertRow = convertRow(arg.values,v.table.header);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.table.values = v.convertRow.obj;
            v.table.rownum = v.convertRow.raw.length;

          } else {  v.step = 2.32; // 項目定義のみ存在

            // values, rownumは取得不能なので既定値のまま
            v.table.values = [];
            v.table.rownum = 0;

          }

        } else { v.step = 2.4; // 項目定義情報が存在しない場合

          if( arg.values ){ v.step = 2.41; // 項目定義不在で初期データのみ存在

            v.convertRow = convertRow(arg.values);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.table.values = v.convertRow.obj;
            v.table.header = v.convertRow.header;
            v.table.colnum = v.table.header.length;
            v.table.rownum = v.convertRow.raw.length;

          } else {  v.step = 2.42; // シートも項目定義も初期データも無い
            throw new Error(`シートも項目定義も初期データも存在しません`);
          }
        }

        v.step = 2.5; // スキーマをインスタンス化
        v.r = genSchema({
          cols: arg.cols || null,
          header: v.table.header,
          notes: v.table.notes,
          values: v.table.values,
        });
        if( v.r instanceof Error ) throw v.r;
        v.table.schema = v.r.schema;
        v.table.notes = v.r.notes;
      }

      // ----------------------------------------------
      v.step = 3; // シートが存在しない場合、新規追加
      // ----------------------------------------------
      v.table.sheet = pv.spread.getSheetByName(v.table.name);
      if( v.table.sheet === null ){
        v.step = 3.1; // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(arg.name);

        v.step = 3.2; // シートイメージのセット
        v.r = convertRow(v.table.values,v.table.header);
        if( v.r instanceof Error ) throw v.r;
        v.headerRange = v.table.sheet.getRange(1,1,1,v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定
        // 初期データの追加
        v.initData = JSON.parse(JSON.stringify(v.table.values));
        v.table.rownum = 0; // appendで追加されるのでrownum, valuesをリセット
        v.table.values = [];
        v.r = appendRow({table:v.table,record:v.initData});
        if( v.r instanceof Error ) throw v.r;
      }

      v.step = 9; // 終了処理
      pv.table[v.table.name] = v.table;
      v.rv = [v.log];
      console.log(`${v.whois}: create "${arg.name}" normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {Object} any
   * @param {sdbTable} any.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} any.where - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法: functionalyze参照
   */
  function deleteRow(arg){
    const v = {whois:`${pv.whois}.deleteRow`,step:0,rv:[],whereStr:[]};
    console.log(`${v.whois} start.`);
    try {

      // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する

      v.step = 1; // 該当レコードかの判別用関数を作成
      v.whereStr = toString(arg.where); // 更新履歴記録用にwhereを文字列化
      arg.where = functionalyze(arg.where);
      if( arg.where instanceof Error ) throw arg.where;

      v.step = 2; // 対象レコードか、後ろから一件ずつチェック
      for( v.i=arg.table.values.length-1 ; v.i>=0 ; v.i-- ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( arg.where(arg.table.values[v.i]) === false ) continue;

        v.step = 2.2; // 一件分のログオブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'delete',
          arg: v.whereStr,
          result: true,
          before: arg.table.values[v.i],
          // after, diffは空欄
        });
        if( v.log instanceof Error ) throw v.log;
        v.rv.push(v.log);

        v.step = 2.3; // 削除レコードのunique項目をarg.table.schema.uniqueから削除
        // arg.table.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in arg.table.schema.unique ){ // unique項目を順次チェック
          if( arg.table.values[v.i][v.unique] ){  // 対象レコードの当該unique項目が有意な値
            // unique項目一覧(配列)から対象レコードの値の位置を探して削除
            v.idx = arg.table.schema.unique[v.unique].indexOf(arg.table.values[v.i][v.unique]);
            if( v.idx >= 0 ) arg.table.schema.unique[v.unique].splice(v.idx,1);
          }
        }

        v.step = 2.4; // arg.table.valuesから削除
        arg.table.values.splice(v.i,1);

        v.step = 2.5; // シートのセルを削除
        v.range = arg.table.sheet.deleteRow(v.i+1);

        v.step = 2.6; // arg.table.rownumを書き換え
        arg.table.rownum -= 1;

      }

      v.step = 9; // 終了処理
      v.rv = v.rv;
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
   * @param {Object|function|string} arg - 関数化するオブジェクトor文字列
   * @returns {function}
   *
   * - update/delete他、引数でwhereを渡されるメソッドで使用
   * - 引数のデータ型により以下のように処理分岐
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - string
   *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
   *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   */
  function functionalyze(arg){
    const v = {whois:`${pv.whois}.functionalyze`,step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      switch( typeof arg ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg;
          break;
        case 'object': v.step = 2.2;
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
        case 'string': v.step = 2.3;
          v.fx = arg.match(/^function\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if( v.fx || v.ax ){
            v.step = 2.31; // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g,''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g,' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
          } else {
            v.step = 2.32; // 関数ではない文字列はprimaryKeyの値指定と看做す
            v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
          }
          break;
        default: throw new Error(`引数の型が不適切です`);
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   *
   * - auto_incrementの記載ルール
   *   - null ⇒ 自動採番しない
   *   - boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
   *   - number ⇒ 自動採番する(基数=指定値,増減値=1)
   *   - number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
   *
   * - 戻り値のオブジェクト
   *   - column {sdbColumn}
   *   - note {string[]} メモ用の文字列
   */
  function genColumn(arg={}){
    const v = {whois:`${pv.whois}.genColumn`,step:0,rv:{},
      typedef:[ // sdbColumnの属性毎にname,type,noteを定義
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
      ],
      rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${JSON.stringify(arg)}`);
    try {

      // ------------------------------------------------
      v.step = 1; // rv.columnの準備
      // ------------------------------------------------
      if( typeof arg === 'object' ){
        v.step = 1.1; // 引数がオブジェクト(=sdbColumn)ならそのまま採用
        v.rv.column = arg;
        v.rv.note = {};
      } else {  // 文字列で与えられたらオブジェクトに変換

        v.step = 1.2; // コメントの削除、一行毎に分割
        v.lines = arg.replace(v.rex,'').split('\n');

        v.step = 1.3; // 一行毎に属性の表記かを判定
        v.rv.column = {};
        v.lines.forEach(prop => {
          v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+?)["']?$/);
          if( v.m ) v.rv.column[v.m[1]] = v.m[2];
        });

        v.step = 1.4; 
        if( Object.keys(v.rv.column).length === 0 ){
          // 属性項目が無ければ項目名と看做す
          v.rv.column = {name:arg.trim()};
          v.rv.note = {};
        } else {
          // 属性項目があればシート上のメモの文字列と看做す
          v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
        }
      }

      // ------------------------------------------------
      v.step = 2; // rv.column各メンバの値をチェック・整形
      // ------------------------------------------------
      v.step = 2.1; // 'null'はnullに変換
      Object.keys(v.rv.column).forEach(x => {
        if( v.rv.column[x] === 'null' ){
          v.rv.column[x]=null;
        } else if( whichType(v.rv.note,'Object') ){
          v.rv.note[x] = v.rv.column[x];
        }
      });

      v.step = 2.2; // defaultを関数に変換
      if( v.rv.column.default ){
        v.rv.column.default = functionalyze(v.rv.column.default);
      }
      if( v.rv.column.default instanceof Error ) throw v.rv.column.default;

      v.step = 2.3; // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => {return {obj:{base:x[0],step:(x[1]||1)},str:JSON.stringify(x)}},  // [base,step]形式
        Number: x => {return {obj:{base:x,step:1},str:x}},  // baseのみ数値で指定
        Object: x => {return {obj:x, str:JSON.stringify(x)}}, // {base:m,step:n}形式
        Null: x => {return {obj:false, str:'false'}}, // auto_incrementしない
        Boolean: x => {return x ? {obj:{base:1,step:1}, str:'true'} : {obj:false, str:'false'}}, // trueは[1,1],falseはauto_incrementしない
      };
      if( v.rv.column.auto_increment ){
        if( typeof v.rv.column.auto_increment === 'string' )
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        v.rv.note.auto_increment = v.acObj.str;
      }

      // ------------------------------------------------
      v.step = 3; // シートのメモに記載する文字列を作成
      // ------------------------------------------------
      if( typeof v.rv.note === 'object' ){
        v.x = [];
        v.typedef.map(x => x.name).forEach(x => {
          if( Object.hasOwn(v.rv.note,x) ){
            v.x.push(`${x}: "${v.rv.note[x]}"`);
          }
        });
        v.rv.note = v.x.join('\n');
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genLog: sdbLogオブジェクトを生成
   * @param {sdbLog|null} arg - 変更履歴シートの行オブジェクト
   * @returns {sdbLog|sdbColumn[]} 変更履歴シートに追記した行オブジェクト、または変更履歴シート各項目の定義
   */
  function genLog(arg=null){
    const v = {whois:`${pv.whois}.genLog`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 変更履歴シートの項目定義
      v.logDef = [
        {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
        {name:'timestamp',type:'string',note:'更新日時。ISO8601拡張形式'},
        {name:'account',type:'string|number',note:'ユーザの識別子'},
        {name:'table',type:'string',note:'対象テーブル名'},
        {name:'command',type:'string',note:'操作内容(コマンド名)'},
        {name:'arg',type:'string',note:'操作関数に渡された引数'},
        {name:'result',type:'boolean',note:'true:追加・更新が成功'},
        {name:'message',type:'string',note:'エラーメッセージ'},
        {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
        {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
        {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
      ];

      if( arg === null ){

        v.step = 2; // 引数が指定されていない場合、変更履歴シート各項目の定義を返す
        v.rv = v.logDef;

      } else {

        v.step = 3; // 引数としてオブジェクトが渡された場合、その値を設定したsdbLogオブジェクトを返す
        v.rv = Object.assign({
          id: Utilities.getUuid(), // {UUID} 一意キー項目
          timestamp: toLocale(new Date()), // {string} 更新日時
          account: pv.opt.userId, // {string|number} uuid等、更新者の識別子
          // 以下、本関数呼出元で設定する項目
          table: null, // {string} 更新対象となった範囲名(テーブル名)
          command: null, // {string} 操作内容。command系内部関数名のいずれか
          arg: null, // {string} 操作関数に渡された引数
          result: null, // {boolean} true:追加・更新が成功
          message: null, // {string} エラーメッセージ
          before: null, // {JSON} 更新前の行データオブジェクト(JSON)
          after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
          diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
        },arg);

        v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
        for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);

      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param arg {Object} - 対象テーブルのschemaオブジェクト
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {Object|Error}
   *
   * - 戻り値のオブジェクト
   *   - schema {sdbSchema}
   *   - notes {string[]} ヘッダ行に対応したメモ
   */
  function genSchema(arg){
    const v = {whois:`${pv.whois}.genSchema`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        schema: {
          cols: arg.cols || [], // {sdbColumn[]} 項目定義オブジェクトの配列
          primaryKey: 'id', // {string}='id' 一意キー項目名
          unique: {}, // {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
          auto_increment: {}, // {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
            // auto_incrementのメンバ : base {number} 基数, step {number} 増減値, current {number} 現在の最大(小)値
          defaultRow: {}, // {Object.<string,function>} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
        },
        notes: arg.notes || [], // ヘッダ行に対応したメモ
      };

      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if( v.rv.schema.cols.length === 0 ){
        if( v.rv.notes.length > 0 ){
          v.step = 2.1; // シートにメモが存在していた場合、その内容から作成
          for( v.i=0 ; v.i<v.rv.notes.length ; v.i++ ){
            v.r = genColumn(v.rv.notes[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
          }
        } else {
          v.step = 2.2; // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for( v.i=0 ; v.i<arg.header.length ; v.i++ ){
            v.r = genColumn(arg.header[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
            v.rv.notes.push(v.r.note);
          }
        }
      } else if( v.rv.notes.length === 0 ){
        v.step = 2.3; // 項目定義オブジェクトが渡された場合、notesのみを作成
        for( v.i=0 ; v.i<arg.cols.length ; v.i++ ){
          v.r = genColumn(arg.cols[v.i]);
          if( v.r instanceof Error ) throw v.r;
          v.rv.notes.push(v.r.note);
        }
      }

      // -----------------------------------------------
      v.step = 3; // v.rv.schema.cols以外のメンバ作成
      // -----------------------------------------------
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
        v.step = 3.1; // primaryKey
        if( v.bool(v.rv.schema.cols[v.i].primaryKey) === true ){
          v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( v.bool(v.rv.schema.cols[v.i].unique) === true ){
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].base;
        }

        v.step = 3.4; // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
        if( v.rv.schema.cols[v.i].default ){
          v.rv.schema.defaultRow[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].default;
        }
      }

      // ------------------------------------------------
      v.step = 4; // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      arg.values.forEach(vObj => {
        v.step = 4.1; // unique項目の値を洗い出し
        Object.keys(v.rv.schema.unique).forEach(unique => {
          if( vObj[unique] ){
            if( v.rv.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
              v.rv.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });

        v.step = 4.2; // auto_increment項目の値を洗い出し
        Object.keys(v.rv.schema.auto_increment).forEach(ai => {
          v.c = v.rv.schema.auto_increment[ai].current;
          v.s = v.rv.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
            v.rv.schema.auto_increment[ai].current = v.v;
          }
        });
      });

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genTable: sdbTableオブジェクトを生成
   * @param arg {Object}
   * @param arg.name {string} - シート名
   * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|null} シート不存在ならnull
   */
  function genTable(arg){
    const v = {whois:`${pv.whois}.genTable`,step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        name: arg.name, // {string} テーブル名(範囲名)
        account: pv.opt.userId, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };
      if( v.rv.sheet === null ) return null;  // シート不存在ならnull

      // ----------------------------------------------
      v.step = 2; // シートから各種情報を取得
      // ----------------------------------------------

      v.step = 2.1; // シートイメージを読み込み
      v.getDataRange = v.rv.sheet.getDataRange();
      v.getValues = v.getDataRange.getValues();
      v.rv.header = JSON.parse(JSON.stringify(v.getValues[0]));
      v.r = convertRow(v.getValues);
      if( v.r instanceof Error ) throw v.r;
      v.rv.values = v.r.obj;
      v.rv.notes = v.getDataRange.getNotes()[0];
      v.rv.colnum = v.rv.header.length;
      v.rv.rownum = v.rv.values.length;

      v.step = 2.3; // スキーマをインスタンス化
      v.r = genSchema({
        cols: [], // notesを優先するので空配列を指定
        header: v.rv.header,
        notes: v.rv.notes,
        values: v.rv.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.rv.schema = v.r.schema;

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {string|string[]} arg - 取得対象テーブル名
   * @returns {Object.<string,sdbColumn[]>} {テーブル名：項目定義オブジェクトの配列}形式
   */
  function getSchema(arg){
    const v = {whois:`${pv.whois}.getSchema`,step:0,rv:[]};
    console.log(`${v.whois} start.`);
    try {

      if( typeof arg === 'string' ) arg = [arg];
      arg.forEach(x => v.rv.push(pv.table[x].schema));

      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** selectRow: テーブルから該当行を抽出
   * @param {Object|Object[]} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|function} arg.where - 対象レコード判定条件
   * @returns {Object[]} 該当行オブジェクト
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(arg){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[]};
    console.log(`${v.whois} start.\nuserId=${pv.opt.userId}, table=${arg.table.name}, where=${arg.where}`);
    try {

      v.step = 1; // 判定条件を関数に統一
      v.where = functionalyze(arg.where);
      if( v.where instanceof Error ) throw v.where;

      v.step = 2; // 行オブジェクトを順次走査、該当行を戻り値に追加
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){
        if( v.where(arg.table.values[v.i]) ){
          v.rv.push(arg.table.values[v.i]);
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nrows=${v.rv.length}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** 関数・オブジェクトを文字列化 */
  function toString(arg){
    if( typeof arg === 'function' ) return arg.toString();
    if( typeof arg === 'object' ) return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: 領域に新規行を追加
   * @param {Object} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} arg.where - 対象レコードの判定条件
   * @param {Object|Function|string} arg.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法: functionalyze参照
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  function updateRow(arg){
    const v = {whois:`${pv.whois}.updateRow`,step:0,rv:[],
      top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      v.step = 1.1; // where,recordの存否確認
      if( !arg.where ){
        throw new Error(`テーブル「${arg.table.name}」の更新で、対象(where)が指定されていません`);
      }
      if( !arg.record ){
        throw new Error(`テーブル「${arg.table.name}」の更新で、更新値(record)が指定されていません`);
      }

      v.step = 1.2; // 更新履歴記録用に文字列化
      v.argStr = `{"where":"${toString(arg.where)}","record":"${toString(arg.record)}"}`;

      v.step = 1.3; // 該当レコードかの判別用関数を作成
      arg.where = functionalyze(arg.where);
      if( arg.where instanceof Error ) throw arg.where;

      v.step = 1.4; // 更新する値を導出する関数を作成
      arg.record = functionalyze(arg.record);
      if( arg.record instanceof Error ) throw arg.record;


      // ------------------------------------------------
      v.step = 2; // table.valuesを更新、ログ作成
      // ------------------------------------------------
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( v.where(arg.table.values[v.i]) === false ) continue;

        v.step = 2.2; // v.before(更新前の行オブジェクト),after,diffの初期値を用意
        [v.before,v.after,v.diff] = [arg.table.values[v.i],{},{}];

        v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
        v.rObj = arg.record(arg.table.values[v.i]);

        v.step = 2.4; // 項目毎に値が変わるかチェック
        arg.table.header.forEach(x => {
          if( Object.hasOwn(v.rObj,x) && !isEqual(v.before[x],v.rObj[x]) ){
            v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
            v.after[x] = v.diff[x] = v.rObj[x];
            v.step = 2.42; // 更新対象範囲の見直し
            v.colNo = arg.table.header.findIndex(y => y === x);
            v.left = Math.min(v.left,v.colNo);
            v.right = Math.max(v.right,v.colNo);
          } else {
            v.step = 2.43; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
            v.after[x] = v.before[x];
          }
        })

        v.step = 2.5; // 更新履歴オブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'update',
          arg: v.argStr,
          result: true,
          before: v.before,
          after: v.after,
          diff: v.diff,
        });
        if( v.log instanceof Error ) throw v.log;

        v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(arg.where[v.unique]) >= 0 ){
            v.step = 2.61; // 登録済の場合はエラーとして処理
            v.log.result = false;
            // 複数項目のエラーメッセージに対応するため場合分け
            v.log.message = (v.log.message === null ? '' : '\n')
            + `${v.unique}欄の値「${arg.where[v.unique]}」が重複しています`;
          } else {
            v.step = 2.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.where[v.unique]);
          }
        }

        v.step = 2.7; // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
        if( v.log.result === true ){
          v.top = Math.min(v.top, v.i);
          v.bottom = Math.max(v.bottom, v.i);
          arg.table.values[v.i] = v.after;
        }

        v.step = 2.8; // 成否に関わらずログ出力対象に保存
        v.rv.push(v.log);
      }

      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(arg.table.values[v.i][arg.table.header[v.j]] || null);
        }
        v.target.push(v.row);
      }

      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 ){
        arg.table.sheet.getRange(
          v.top +1,  // +1(添字->行番号)
          v.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

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