/*
  authServerテスト用ソース
    GASの専用シートを用意、本ソースをコピペしてauthServerTest()を実行する
*/

function authServerTest(){
  // 新規申込：「申込情報」シートに申込情報を追加
  // 掲示板表示：「掲示板」シートから取得
  // 申込の修正：申込内容を修正
  // 掲示板追加：「掲示板」シートに新たな告知を追加
  // 掲示板更新：前回取得時以降に追加された告知を取得

  // guest
  // 新規アカウント作成要求
  // 通常要求

  // 通常要求(userId不明)
  // 操作ミス(パスコード入力画面でリロード)
  const v = {whois:'authServerTest',step:0,rv:null,
    // ----- 定数・ユーティリティ関数群
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName=null) => {  // テスト用シートの削除
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
    RSA: (arg='password') => {  // RSA鍵ペア生成
      v.r = {};
      v.r.key = cryptico.generateRSAKey(arg,1024);
      v.r.pKey = cryptico.publicKeyString(v.r.key);
      v.r.sKey = JSON.stringify(v.r.key.toJSON());
      // 秘密鍵の復元は`RSAKey.parse(v.r.sKey)`で行う
      return v.r;
    },
    setup: (arg) => { // テスト用シートの準備。引数=trueなら全シートを再作成
      console.log(`${v.whois}.setup start.`);
      if( arg === true ) v.deleteSheet();

      v.r = SpreadDb([{
        command:'create', // 「申込情報」シート作成
        table:'申込情報',
        cols:[
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
        values:[
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
        ]
      },{
        command:'create', // 「掲示板」シート作成
        table:'掲示板',
        values:[
          ['timestamp','from','to','message'],
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
          ['2023/02/10 15:27:38','嶋津パパ','スタッフ全員','r.1.4.4、リリースしました'],
        ]
      }],{userId:'Administrator'});
      if( v.r instanceof Error ) throw v.r;

      console.log(`${v.whois}.setup end.`);
    },
  };
  const scenario = {
    appendUser: () => { // 新規申込者の追加
      v.step = 1;
      v.request = {
        email: 'nakaone@kunihiro@gmail.com',
        CPkey: v.RSA().pKey,
        query: [
          {table:'掲示板',command:'schema'},  // 掲示板のテーブル管理情報取得
          {table:'掲示板',command:'select',where:'()=>true'}, // 掲示板の全件取得
        ],
      }
      v.r = authServer(v.request);
      console.log(`appendUser step.1: status="retry:Send PC"でパスコード通知メール受領を確認\nv.r=${JSON.stringify(v.r,null,2)}`);

      v.step = 2; // 「ユーザ管理」シートのtrial.passcodeを111111に書き換え
      v.step = 3; // authServerにpasscode=111111を送信
      v.step = 4; // 掲示板のテーブル管理情報と全レコードデータ取得を確認
    },
  };
  console.log(`${v.whois} start.`);
  try {
    v.setup();
    v.rv = scenario.appendUser();
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv,null,2)}`);
  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

function authServer(arg,opt={}){
  const v = {whois:'authServer',step:0,rv:null};
  const pv = {};  // public values: 擬似メンバ
  console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
  try {

    v.step = 1; // 事前準備
    v.rv = setup();

    v.step = 2;
    if( pv.arg.CPkey ){
      // 引数にCPkeyが存在
      if( pv.arg.email ){
        // 引数にemailが存在 ⇒ ユーザ管理情報を生成、シートに追加
      } else {
        // 引数にemailが不在 ⇒ No Mailエラー
        v.rv = {status:'Err:No Mail'};
      }
    } else {
      // 引数にCPkeyが不存在
      if( pv.arg.userId === null && pv.arg.email === null ){
        // userIdもemailも不存在 ⇒ ゲスト
        // setupで権限の既定値をゲストとして設定しているので、特段の処理は不要
      } else {
        // ユーザ管理情報を取得
        v.r = SpreadDb({table:pv.opt.accountTableName,command:'select',where:pv.arg.userId});
        if( v.r instanceof Error ) throw v.r;
        if( v.r[0].isErr || v.r[0].data.length === 0 ){
          // ユーザ情報取得失敗 ⇒ No Accountエラー
          v.rv = {status:'Err:No Account'};
        } else {
          // ユーザ情報取得成功
          pv.account = v.r[0].data;
          // token復号
          // v.r = cryptico.decrypt(v.cipher,v.SSkey);
          // 署名検証
          // v.r = login()
        }
      }
    }

    if( v.rv === null ){
      // pv.accountでSpreadDb実行
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  function setup(arg,opt){
    const v = {whois:'authServer.setup',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {

      v.step = 1.1; // 引数を整形、メンバに格納
      pv.arg = Object.assign({
        userId: null, // {string|number}=null ユーザ識別子。nullはゲスト
        token: null, // {string} 発信時刻(UNIX時刻)を暗号化・署名した文字列
        email: null, // {string} ユーザのメールアドレス
        CPkey: null, // {string} ユーザの公開鍵
        query: null, // {Object|Object[]} 以下の内容を署名・暗号化した文字列
      },arg);
      if( pv.arg.query !== null ){
        if( !Array.isArray(pv.arg.query) ) pv.arg.query = [pv.arg.query];
        for( v.i=0 ; v.i<pv.arg.query.length ; v.i++ ){
          pv.arg.query[v.i] = Object.assign({
            table: null,
            command: null,
            where: null,
            record: null,
            passcode: null,
          },pv.arg.query[v.i]);
        }
      }

      v.step = 1.2; // オプションの既定値設定
      pv.opt = Object.assign({
        accountTableName: 'ユーザ管理', // {string} 「ユーザ管理」シートの名前
        tokenExpiry: 10 * 60 * 1000, // トークンの有効期間
        validityPeriod: 24 * 60 * 60 * 1000, // {number}=1日 ログイン有効期間。有効期間を超えた場合は再ログインを必要とする
        graceTime: 10 * 60 * 1000, // {number} メール送信〜パスコード確認処理終了までの猶予時間(ミリ秒)
        passcodeValidityPeriod: 10 * 60 * 1000, // {number} パスコードの有効期間。ミリ秒
        maxTrial: 3 , // {number} パスコード入力の最大試行回数
        passcodeDigit: 6, // {number}=6  パスコードの桁数
        freezing: 60 * 60 * 1000, // {number} 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
        bits: 1024, // {number} 鍵長
      },opt);

      v.step = 1.3; // SpreadDb使用時のアカウントの既定値
      pv.account = {userId:'guest',userAuth:{log:'r'}};

      v.step = 2; // 「ユーザ管理」シートが存在しなければ作成
      v.r = SpreadDb({command:'create',table:pv.opt.accountTableName,cols:[
        {name:'userId',type:'string',primatyKey:true,default:'()=>{return Utilities.getUuid()}',note:'ユーザ識別子'},
        {name:'email',type:'',unique:true,note:'ユーザのメールアドレス'},
        {name:'name',type:'string',note:'ユーザの氏名'},
        {name:'phone',type:'string',note:'ユーザの電話番号'},
        {name:'address',type:'',note:'ユーザの住所'},
        {name:'note',type:'string',note:'その他ユーザ情報(備考)'},
        {name:'validityStart',type:'string',note:'有効期間開始日時'},
        {name:'validityEnd',type:'string',note:'有効期間終了日時'},
        {name:'CPkey',type:'string',note:'クライアント側公開鍵'},
        {name:'CPkeyExpiry',type:'string',note:'CPkey有効期限'},
        {name:'authority',type:'JSON',note:'シート毎のアクセス権限。{シート名:rwdos文字列} 形式'},
        {name:'trial',type:'JSON',note:'ログイン試行関連情報'},
        {name:'created',type:'string',note:'ユーザ登録日時',default:'()=>{return toLocale(new Date())'},
        {name:'updated',type:'string',note:'最終更新日時',default:'()=>{return toLocale(new Date())'},
        {name:'deleted',type:'string',note:'論理削除日時'},
      ]},{userId:'Administrator'});

      v.step = 3; // RSA鍵の取得
      v.docProps = PropertiesService.getDocumentProperties();
      pv.SPkey = v.docProps.getProperty('SPkey');
      if( !pv.SPkey ){
        v.pw = createPassword();
        if( v.pw instanceof Error ) throw v.pw;
        pv.SSkey = cryptico.generateRSAKey(v.pw,pv.opt.bits);
        v.docProps.setProperty('SSkey',JSON.stringify(pv.SSkey.toJSON()));
        pv.SPkey = cryptico.publicKeyString(pv.SSkey);
        v.docProps.setProperty('SPkey',pv.SPkey);
      } else {
        pv.SSkey = RSAKey.parse(v.docProps.getProperty('SSkey'));
        pv.SPkey = v.docProps.getProperty('SPkey');
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
}

/** 長さ・文字種指定に基づき、パスワードを生成
 *
 * @param {number} [len=16] - パスワードの長さ
 * @param {Object} opt
 * @param {boolean} [opt.lower=true] - 英小文字を使うならtrue
 * @param {boolean} [opt.upper=true] - 英大文字を使うならtrue
 * @param {boolean} [opt.symbol=true] - 記号を使うならtrue
 * @param {boolean} [opt.numeric=true] - 数字を使うならtrue
 * @returns {string}
 */
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,',
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
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

    v.step = 1; // 全体事前処理
    v.step = 1.11; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      userId: 'guest', // {string} ユーザの識別子
      userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
      guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
      adminId: 'Administrator', // {string} 管理者として扱うuserId
    },opt);

    v.step = 1.12; // メンバ登録：内部設定項目
    Object.assign(pv,{
      spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
      sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
      table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
      log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
    });

    v.step = 1.2; // queryを配列化
    if( !Array.isArray(query) ) query = [query];

    v.step = 1.3; // スプレッドシートのロックを取得
    v.lock = LockService.getDocumentLock();

    v.step = 1.4; // 変更履歴テーブルのsdbTable取得。無ければ作成
    v.r = genTable({name:pv.opt.log});
    if( v.r instanceof Error ) throw v.r;
    if( v.r === null ){
      v.r = createTable({
        table: pv.opt.log,
        cols: genLog(), // sdbLog各項目の定義集
      });
      if( v.r instanceof Error ) throw v.r;
    } else {
      pv.table[pv.opt.log] = v.r;
    }

    for( v.tryNo=pv.opt.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){

      v.step = 2; // スプレッドシートのロック
      if( v.lock.tryLock(pv.opt.interval) ){

        for( v.i=0 ; v.i<query.length ; v.i++ ){

          v.step = 3; // 要求(query)実行準備
          v.step = 3.1; //実行結果オブジェクト(v.queryResult)の初期化
          v.queryResult = {query:query[v.i],isErr:false,message:'',rows:null,shcema:null,log:null};

          v.step = 3.2; // createでテーブル名を省略した場合は補完
          if( query[v.i].command === 'create' && !Object.hasOwn(query[v.i],'table') ){
            query[v.i].table = query[v.i].arg.name;
          }

          v.step = 3.3; // 操作対象のテーブル管理情報を準備(無ければ作成)
          if( !Object.hasOwn(pv.table,query[v.i].table) ){
            v.r = genTable({name:query[v.i].table});
            if( v.r instanceof Error ) throw v.r;
            pv.table[query[v.i].table] = v.r;
          }

          v.step = 4; // ユーザの操作対象シートに対する権限をv.allowにセット
          v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : ( pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query[v.i].table] || '')  // ゲスト(userId指定無し)
          : ( pv.opt.userAuth[query[v.i].table] || ''));  // 通常ユーザ

          v.step = 5; // 呼出先メソッド設定
          if( v.allow.includes('o') ){

            // o(=own record only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
            // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
            //read/write/append/deleteは自分のみ可、schemaは実行不可

            v.step = 5.1;  // 操作対象レコードの絞り込み(検索・追加条件の変更)
            if( query[v.i].command !== 'append' ){
              v.step = 5.2; // select/update/deleteなら対象を自レコードに限定
              query[v.i].where = pv.opt.userId;
            } else {
              v.step = 5.3; // appendの場合
              v.pKey = pv.table[query[v.i].table].schema.primaryKey;
              if( !v.pKey ){
                v.step = 5.4; // 追加先テーブルにprimaryKeyが不在ならエラー
                Object.assign(v.queryResult,{
                  isErr: true,
                  message: `primaryKey未設定のテーブルには追加できません`
                });
              } else {
                v.step = 5.5; // 追加レコードの主キーはuserIdに変更
                if( !Array.isArray(query[v.i].record) ) query[v.i].record = [query[v.i].record];
                query[v.i].record.forEach(x => x[v.pKey] = pv.opt.userId);
              }
            }

            v.step = 5.6; // 'o'の場合の呼出先メソッドを設定
            switch( query[v.i].command ){
              case 'select': v.isOK = true; v.func = selectRow; break;
              case 'update': v.isOK = true; v.func = updateRow; break;
              case 'append': case 'insert': v.isOK = true; v.func = appendRow; break;
              case 'delete': v.isOK = true; v.func = deleteRow; break;
              default: v.isOK = false;
            }

          } else {

            v.step = 5.7;  // 'o'以外の場合の呼出先メソッドを設定
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

          v.step = 6; // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
          if( v.isOK ){

            v.step = 7; // 呼出先メソッド実行
            v.step = 7.1; // create以外の場合、操作対象のテーブル管理情報をcommand系メソッドの引数に追加
            if( query[v.i].command !== 'create' && query[v.i].command !== 'schema' ){
              if( !pv.table[query[v.i].table] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
                pv.table[query[v.i].table] = genTable({name:query[v.i].table});
                if( pv.table[query[v.i].table] instanceof Error ) throw pv.table[query[v.i].table];
              }
              query[v.i].table = pv.table[query[v.i].table];
            }

            v.step = 7.2;  // メソッド実行
            v.sdbLog = v.func(query[v.i]);

            v.step = 8;  // 戻り値がErrorオブジェクト
            if( v.sdbLog instanceof Error ){

              v.step = 9; // 異常終了時実行結果設定
              // selectRow, updateRow他のcommand系メソッドでエラー発生
              // command系メソッドからエラーオブジェクトが帰ってきた場合はエラーとして処理
              Object.assign(v.queryResult,{
                isErr: true,
                message: v.sdbLog.message
              });
              v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                isErr: true,
                message: v.sdbLog.message,
                // before, after, diffは空欄
              });
              if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

            } else {  // 戻り値がErrorオブジェクト以外

              v.step = 10; // 正常終了時実行結果設定(command系メソッドが正常終了した場合の処理)
              if( query[v.i].command === 'select' || query[v.i].command === 'schema' ){

                v.step = 10.1; // select, schemaは結果をrow/schemaにセット
                v.queryResult[query[v.i].command === 'select' ? 'rows' : 'schema'] = v.sdbLog;
                v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
                  table: query[v.i].table.name,
                  command: query[v.i].command,
                  arg: toString(query[v.i].command === 'select' ? query[v.i].where : query[v.i].table),
                  isErr: false,
                  message: query[v.i].command === 'select' ? `rownum=${v.sdbLog.length}` : '',
                  // before, after, diffは空欄
                });
                if( v.queryResult.log instanceof Error ) throw v.queryResult.log;

              } else {

                v.step = 10.2; // update, append, deleteは実行結果(sdbLog)をlogにセット
                v.queryResult.log = v.sdbLog;
                v.sdbLog.forEach(x => {if( x.isErr === true ){ v.queryResult.isErr = true; }});

              }
            }

          } else {

            v.step = 11; // isOKではない場合、無権限時実行結果設定
            v.msg = `シート「${query[v.i].table}」に対して'${query[v.i].command}'する権限がありません`;
            Object.assign(v.queryResult,{
              isErr: true,
              message: v.msg,
            });
            v.queryResult.log = genLog({  // sdbLogオブジェクトの作成
              isErr: true,
              message: v.msg,
              // before, after, diffは空欄
            });
            if( v.queryResult.log instanceof Error ) throw v.queryResult.log;
          }

          v.step = 12; // 実行結果を戻り値に追加
          v.rv.push(v.queryResult);
        }

        v.step = 13; // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.step = 13.1; // ログを配列化
        v.log = [];
        v.rv.forEach(x => {
          if( Array.isArray(x.log) ){
            v.log = [...v.log,...x.log];
          } else {
            v.log.push(x.log);
          }
        });
        v.step = 13.2; // 変更履歴シートに追記
        v.r = appendRow({
          table: pv.table[pv.opt.log],
          record: v.log,
        });
        if( v.r instanceof Error ) throw v.r;

        v.step = 14; // ロック解除
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
          isErr: false,
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
            v.log.isErr = true;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.log.message = v.log.message === 'null' ? [] : v.log.message.split('\n');
            v.log.message.push(`${v.unique}欄の値「${arg.record[v.i][v.unique]}」が重複しています`);
            v.log.message = v.log.message.join('\n');
          } else {
            // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(arg.record[v.i][v.unique]);
          }
        }

        v.step = 2.5; // 正当性チェックOKの場合の処理
        if( v.log.isErr === false ){

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
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** createTable: 新規にシートを作成
   * @param {sdbTable} arg
   * @param {string} arg.table - テーブル名
   * @param {sdbColumn[]} arg.cols - 項目定義オブジェクトの配列
   * @param {Object[]|any[][]} arg.values - 行オブジェクトの配列、またはシートイメージ
   * @returns {sdbLog}
   */
  function createTable(arg){
    const v = {whois:`${pv.whois}.createTable`,step:0,rv:[],convertRow:null};
    console.log(`${v.whois} start. arg.table=${arg.table}`);
    try {

      // ----------------------------------------------
      v.step = 1; // 事前準備
      // ----------------------------------------------
      v.step = 1.1; // 一件分のログオブジェクトを作成
      v.log = genLog({
        table: arg.table,
        command: 'create',
        arg: arg.cols,
        isErr: false,
        message: `created ${Object.hasOwn(arg,'values') ? arg.values.length : 0} rows.`,
        // before, after, diffは空欄
      });
      if( v.log instanceof Error ) throw v.log;

      v.step = 1.2; // sdbTableのプロトタイプ作成
      v.table = {
        name: arg.table, // {string} テーブル名(範囲名)
        account: pv.opt.userId, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };

      // ----------------------------------------------
      v.step = 2; // テーブル管理情報の作成
      // ----------------------------------------------
      if( arg.cols ){

        v.step = 2.1; // 項目定義情報が存在する場合
        v.table.header = arg.cols.map(x => x.name);
        v.table.colnum = v.table.header.length;

      } else { // 項目定義情報が存在しない場合

        if( arg.values ){

          v.step = 2.2; // 項目定義不在で初期データのみ存在
          v.convertRow = convertRow(arg.values);
          if( v.convertRow instanceof Error ) throw v.convertRow;
          v.table.header = v.convertRow.header;
          v.table.colnum = v.table.header.length;

        } else {

          v.step = 2.3; // シートも項目定義も初期データも無い
          throw new Error(`シートも項目定義も初期データも存在しません`);

        }
      }

      v.step = 2.4; // スキーマをインスタンス化
      v.r = genSchema({
        cols: arg.cols || null,
        header: v.table.header,
        notes: v.table.notes,
        values: v.table.values,
      });
      if( v.r instanceof Error ) throw v.r;
      v.table.schema = v.r.schema;
      v.table.notes = v.r.notes;

      // ----------------------------------------------
      v.step = 3; // シートが存在しない場合、新規追加
      // ----------------------------------------------
      if( v.table.sheet === null ){
        v.step = 3.1; // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(arg.table);

        v.step = 3.2; // ヘッダ行・メモのセット
        v.headerRange = v.table.sheet.getRange(1,1,1,v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1,v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定

        v.step = 3.3; // 初期データの追加
        if( (arg.values||[]).length > 0 ){
          if( v.convertRow === null ){
            v.convertRow = convertRow(arg.values,v.table.header);
            if( v.convertRow instanceof Error ) throw v.convertRow;
          }
          v.r = appendRow({table:v.table,record:v.convertRow.obj});
          if( v.r instanceof Error ) throw v.r;
        }
      } else {
        v.log.message = `"${v.table.name}" is already exist.`;
      }

      v.step = 9; // 終了処理
      pv.table[v.table.name] = v.table;
      v.rv = [v.log];
      console.log(`${v.whois}: create "${arg.table}" normal end.`);
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
      arg.where = functionalyze({table:arg.table,data:arg.where});
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
          isErr: false,
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
        v.range = arg.table.sheet.deleteRow(v.i+2); // 添字->行番号で+1、ヘッダ行分で+1

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
   * @param {Object} arg
   * @param {sdbTable} arg.table - 呼出元で処理対象としているテーブル
   * @param {Object|function|string} arg.data - 関数化するオブジェクトor文字列
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
  function functionalyze(arg=null){
    const v = {whois:`${pv.whois}.functionalyze`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 引数のチェック
      if( typeof arg === 'string' ){
        arg = {data:arg,table:null};
      } else if( !whichType(arg,'Object') || !Object.hasOwn(arg,'data')){
        throw new Error(`引数「${toString(arg)}」は適切な引数ではありません`);
      }

      switch( typeof arg.data ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg.data;
          break;
        case 'object': v.step = 2.2;
          v.keys = Object.keys(arg.data);
          if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
            v.step = 2.21; // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o',`return isEqual(o['${arg.data.key}'],'${arg.data.value}')`);
          } else {
            v.step = 2.22; // {キー項目名:値}形式での指定の場合
            v.c = [];
            for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg.data[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o',`return (${v.c.join(' && ')})`);
          }
          break;
        case 'string': v.step = 2.3;
          v.fx = arg.data.match(/^function\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if( v.fx || v.ax ){
            v.step = 2.31; // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g,''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g,' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
            break;
          }
        default:
          v.step = 2.4; // 関数ではない文字列、またはfunction/object/string以外の型はprimaryKeyの値指定と看做す
          if( arg.table !== null && arg.table.schema.primaryKey ){
            if( typeof arg.data === 'string') arg.data = `"${arg.data}"`;
            v.rv = new Function('o',`return isEqual(o['${arg.table.schema.primaryKey}'],${arg.data})`);
          } else {
            throw new Error(`引数の型が不適切です`);
          }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nrv=${toString(v.rv)}`);
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
      idStr: 'arg=' + (typeof arg === 'string' ? arg : arg.name),
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
    console.log(`${v.whois} start. ${v.idStr}`);
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
      v.map = {'null':null,'true':true,'false':false};
      Object.keys(v.rv.column).forEach(x => {

        v.step = 2.11; // 文字列で指定された'null','true','false'は値にする
        if( Object.hasOwn(v.map,v.rv.column[x]) ){
          v.rv.column[x] = v.map[v.rv.column[x]];
        }

        v.step = 2.12; // メモ文字列を作成する場合(=引数がメモ文字列では無かった場合)
        // かつ属性値が未定義(null)ではない場合、v.rv.columnにもメモ作成用の属性値をセット
        if( whichType(v.rv.note,'Object') && v.rv.column[x] !== null ){
          v.rv.note[x] = v.rv.column[x];
        }
      });

      v.step = 2.2; // defaultを関数に変換
      if( v.rv.column.default ){
        v.r = functionalyze(v.rv.column.default);
        if( v.r instanceof Error ) throw v.r;
        v.rv.column.default = v.r;
      }
      if( v.rv.column.default instanceof Error ) throw v.rv.column.default;

      v.step = 2.3; // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => {return {obj:{start:x[0],step:(x[1]||1)},str:JSON.stringify(x)}},  // [start,step]形式
        Number: x => {return {obj:{start:x,step:1},str:x}},  // startのみ数値で指定
        Object: x => {return {obj:x, str:JSON.stringify(x)}}, // {start:m,step:n}形式
        Null: x => {return {obj:false, str:'false'}}, // auto_incrementしない
        Boolean: x => {return x ? {obj:{start:1,step:1}, str:'true'} : {obj:false, str:'false'}}, // trueは[1,1],falseはauto_incrementしない
      };
      if( v.rv.column.auto_increment ){
        if( typeof v.rv.column.auto_increment === 'string' )
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        // 開始値はstart+stepになるので、予め-stepしておく
        v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
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
      console.log(`${v.whois} normal end. ${v.idStr}`);
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
    const v = {whois:`${pv.whois}.genLog`,step:0,rv:null,
      idStr: 'arg='+(arg===null?'null':`${arg.table}.${arg.command}`)};
    console.log(`${v.whois} start. ${v.idStr}`);
    try {

      v.step = 1; // 変更履歴シートの項目定義
      v.logDef = [
        {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
        {name:'timestamp',type:'string',note:'更新日時。ISO8601拡張形式'},
        {name:'account',type:'string|number',note:'ユーザの識別子'},
        {name:'table',type:'string',note:'対象テーブル名'},
        {name:'command',type:'string',note:'操作内容(コマンド名)'},
        {name:'arg',type:'string',note:'操作関数に渡された引数'},
        {name:'isErr',type:'boolean',note:'true:追加・更新が失敗'},
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
          isErr: null, // {boolean} true:追加・更新が失敗
          message: null, // {string} エラーメッセージ
          before: null, // {JSON} 更新前の行データオブジェクト(JSON)
          after: null, // {JSON} 更新後の行データオブジェクト(JSON)。selectの場合はここに格納
          diff: null, // {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
        },arg);

        v.step = 4; // 値が関数またはオブジェクトの場合、文字列化
        for( v.x in v.rv ) v.rv[v.x] = toString(v.rv[v.x]);

      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end. ${v.idStr}`);
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
            // auto_incrementのメンバ : start {number} 開始値, step {number} 増減値, current {number} 現在の最大(小)値
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
      for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
        v.step = 3.1; // primaryKey
        if( Object.hasOwn(v.rv.schema.cols[v.i],'primaryKey') && v.rv.schema.cols[v.i].primaryKey === true ){
          v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( Object.hasOwn(v.rv.schema.cols[v.i],'unique') && v.rv.schema.cols[v.i].unique === true ){
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].start;
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
      console.log(`${v.whois} normal end. table=${arg.name}`);
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
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${JSON.stringify(arg)}`);
    try {

      v.step = 1.1; // 引数のデータ型チェック
      if( !whichType(arg,'Object') || !Object.hasOwn(arg,'table') ){
        throw new Error('引数にtableが含まれていません');
      }
      v.step = 1.2; // 対象テーブル名の配列化
      v.arg = typeof arg.table === 'string' ? [arg.table]: arg.table;

      v.step = 2; // 戻り値の作成
      for( v.i=0 ; v.i<v.arg.length ; v.i++ ){
        if( !pv.table[v.arg[v.i]] ){  // 以前のcommandでテーブル管理情報が作られていない場合は作成
          pv.table[v.arg[v.i]] = genTable({name:v.arg[v.i]});
          if( pv.table[v.arg[v.i]] instanceof Error ) throw pv.table[v.arg[v.i]];
        }
        v.rv.push(pv.table[v.arg[v.i]]);
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
  /** selectRow: テーブルから該当行を抽出
   * @param {Object|Object[]} arg
   * @param {sdbTable} arg.table - 操作対象のテーブル管理情報
   * @param {Object|function} arg.where - 対象レコード判定条件
   * @returns {Object[]} 該当行オブジェクトの配列
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(arg){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[]};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 判定条件を関数に統一
      v.where = functionalyze({table:arg.table,data:arg.where});
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
  function updateRow(arg={}){
    const v = {whois:`${pv.whois}.updateRow`,step:0,rv:[],
      top:Infinity,left:Infinity,right:0,bottom:0, // 更新範囲の行列番号
    };
    console.log(`${v.whois} start.`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      v.step = 1.1; // 引数whereの処理
      if( Object.hasOwn(arg,'where') && arg.where ){
        // 該当レコードかの判別用関数を作成
        v.where = functionalyze({table:arg.table,data:arg.where});
        if( v.where instanceof Error ) throw v.where;
      } else {
        throw new Error(`テーブル「${arg.table.name}」の更新で、対象(where)が指定されていません`);
      }

      v.step = 1.2; // 引数recordの処理
      if( Object.hasOwn(arg,'record') && arg.record ){
        // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
        // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
        v.r = (arg=>{
          if( whichType(arg,'Object')) return arg;
          try{return JSON.parse(arg)}catch{return null}
        })(arg.record);
        if( v.r !== null ){
          v.record = () => {return v.r};
        } else {
          // 更新する値を導出する関数を作成
          v.record = functionalyze({table:arg.table,data:arg.record});
          if( v.record instanceof Error ) throw v.record;
        }
      } else {
        throw new Error(`テーブル「${arg.table.name}」の更新で、更新値(record)が指定されていません`);
      }

      v.step = 1.3; // 更新履歴記録用に文字列化
      v.argStr = `{"where":"${toString(arg.where)}","record":"${toString(arg.record)}"}`;

      // ------------------------------------------------
      v.step = 2; // table.valuesを更新、ログ作成
      // ------------------------------------------------
      for( v.i=0 ; v.i<arg.table.values.length ; v.i++ ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( v.where(arg.table.values[v.i]) === false ) continue;

        v.step = 2.2; // v.before(更新前の行オブジェクト),after,diffの初期値を用意
        [v.before,v.after,v.diff] = [arg.table.values[v.i],{},{}];

        v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
        v.rObj = v.record(arg.table.values[v.i]);

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
        });

        v.step = 2.5; // 更新履歴オブジェクトを作成
        v.log = genLog({
          table: arg.table.name,
          command: 'update',
          arg: v.argStr,
          isErr: false,
          before: v.before,
          after: v.after,
          diff: v.diff,
        });
        if( v.log instanceof Error ) throw v.log;

        v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in arg.table.schema.unique ){
          if( arg.table.schema.unique[v.unique].indexOf(v.where[v.unique]) >= 0 ){
            v.step = 2.61; // 登録済の場合はエラーとして処理
            v.log.isErr = true;
            // 複数項目のエラーメッセージに対応するため場合分け
            v.log.message = (v.log.message === null ? '' : '\n')
            + `${v.unique}欄の値「${v.where[v.unique]}」が重複しています`;
          } else {
            v.step = 2.62; // 未登録の場合arg.table.sdbSchema.uniqueに値を追加
            arg.table.schema.unique[v.unique].push(v.where[v.unique]);
          }
        }

        v.step = 2.7; // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
        if( v.log.isErr === false ){
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
      v.target = [];
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
      if( v.target.length > 0 || (v.target.length === 1 && v.target[0].length === 0) ){
        arg.table.sheet.getRange(
          v.top +2,  // +1(添字->行番号)+1(ヘッダ行)
          v.left +1,  // +1(添字->行番号)
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
const navigator = {appName: "Netscape",appVersion: '5.0'};
var dbits,canary=244837814094590,j_lm=(canary&16777215)==15715070;function BigInteger(a,b,c){a!=null&&("number"==typeof a?this.fromNumber(a,b,c):b==null&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function nbi(){return new BigInteger(null)}function am1(a,b,c,d,e,g){for(;--g>=0;){var h=b*this[a++]+c[d]+e,e=Math.floor(h/67108864);c[d++]=h&67108863}return e}
function am2(a,b,c,d,e,g){var h=b&32767;for(b>>=15;--g>=0;){var f=this[a]&32767,o=this[a++]>>15,p=b*f+o*h,f=h*f+((p&32767)<<15)+c[d]+(e&1073741823),e=(f>>>30)+(p>>>15)+b*o+(e>>>30);c[d++]=f&1073741823}return e}function am3(a,b,c,d,e,g){var h=b&16383;for(b>>=14;--g>=0;){var f=this[a]&16383,o=this[a++]>>14,p=b*f+o*h,f=h*f+((p&16383)<<14)+c[d]+e,e=(f>>28)+(p>>14)+b*o;c[d++]=f&268435455}return e}
j_lm&&navigator.appName=="Microsoft Internet Explorer"?(BigInteger.prototype.am=am2,dbits=30):j_lm&&navigator.appName!="Netscape"?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28);BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=[],rr,vv;
rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(a){return BI_RM.charAt(a)}function intAt(a,b){var c=BI_RC[a.charCodeAt(b)];return c==null?-1:c}function bnpCopyTo(a){for(var b=this.t-1;b>=0;--b)a[b]=this[b];a.t=this.t;a.s=this.s}function bnpFromInt(a){this.t=1;this.s=a<0?-1:0;a>0?this[0]=a:a<-1?this[0]=a+DV:this.t=0}
function nbv(a){var b=nbi();b.fromInt(a);return b}
function bnpFromString(a,b){var c;if(b==16)c=4;else if(b==8)c=3;else if(b==256)c=8;else if(b==2)c=1;else if(b==32)c=5;else if(b==4)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var d=a.length,e=!1,g=0;--d>=0;){var h=c==8?a[d]&255:intAt(a,d);h<0?a.charAt(d)=="-"&&(e=!0):(e=!1,g==0?this[this.t++]=h:g+c>this.DB?(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}if(c==8&&(a[0]&128)!=0)this.s=-1,g>0&&(this[this.t-1]|=(1<<
this.DB-g)-1<<g);this.clamp();e&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){for(var a=this.s&this.DM;this.t>0&&this[this.t-1]==a;)--this.t}
function bnToString(a){if(this.s<0)return"-"+this.negate().toString(a);if(a==16)a=4;else if(a==8)a=3;else if(a==2)a=1;else if(a==32)a=5;else if(a==64)a=6;else if(a==4)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,d=!1,e="",g=this.t,h=this.DB-g*this.DB%a;if(g-- >0){if(h<this.DB&&(c=this[g]>>h)>0)d=!0,e=int2char(c);for(;g>=0;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,h<=0&&(h+=this.DB,--g)),c>0&&(d=!0),d&&(e+=int2char(c))}return d?e:"0"}
function bnNegate(){var a=nbi();BigInteger.ZERO.subTo(this,a);return a}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var b=this.s-a.s;if(b!=0)return b;var c=this.t,b=c-a.t;if(b!=0)return b;for(;--c>=0;)if((b=this[c]-a[c])!=0)return b;return 0}function nbits(a){var b=1,c;if((c=a>>>16)!=0)a=c,b+=16;if((c=a>>8)!=0)a=c,b+=8;if((c=a>>4)!=0)a=c,b+=4;if((c=a>>2)!=0)a=c,b+=2;a>>1!=0&&(b+=1);return b}
function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(a,b){var c;for(c=this.t-1;c>=0;--c)b[c+a]=this[c];for(c=a-1;c>=0;--c)b[c]=0;b.t=this.t+a;b.s=this.s}function bnpDRShiftTo(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s}
function bnpLShiftTo(a,b){var c=a%this.DB,d=this.DB-c,e=(1<<d)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,f;for(f=this.t-1;f>=0;--f)b[f+g+1]=this[f]>>d|h,h=(this[f]&e)<<c;for(f=g-1;f>=0;--f)b[f]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()}
function bnpRShiftTo(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var d=a%this.DB,e=this.DB-d,g=(1<<d)-1;b[0]=this[c]>>d;for(var h=c+1;h<this.t;++h)b[h-c-1]|=(this[h]&g)<<e,b[h-c]=this[h]>>d;d>0&&(b[this.t-c-1]|=(this.s&g)<<e);b.t=this.t-c;b.clamp()}}
function bnpSubTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]-a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d-=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d-=a[c],b[c++]=d&this.DM,d>>=this.DB;d-=a.s}b.s=d<0?-1:0;d<-1?b[c++]=this.DV+d:d>0&&(b[c++]=d);b.t=c;b.clamp()}
function bnpMultiplyTo(a,b){var c=this.abs(),d=a.abs(),e=c.t;for(b.t=e+d.t;--e>=0;)b[e]=0;for(e=0;e<d.t;++e)b[e+c.t]=c.am(0,d[e],b,e,0,c.t);b.s=0;b.clamp();this.s!=a.s&&BigInteger.ZERO.subTo(b,b)}function bnpSquareTo(a){for(var b=this.abs(),c=a.t=2*b.t;--c>=0;)a[c]=0;for(c=0;c<b.t-1;++c){var d=b.am(c,b[c],a,2*c,0,1);if((a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,d,b.t-c-1))>=b.DV)a[c+b.t]-=b.DV,a[c+b.t+1]=1}a.t>0&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()}
function bnpDivRemTo(a,b,c){var d=a.abs();if(!(d.t<=0)){var e=this.abs();if(e.t<d.t)b!=null&&b.fromInt(0),c!=null&&this.copyTo(c);else{c==null&&(c=nbi());var g=nbi(),h=this.s,a=a.s,f=this.DB-nbits(d[d.t-1]);f>0?(d.lShiftTo(f,g),e.lShiftTo(f,c)):(d.copyTo(g),e.copyTo(c));d=g.t;e=g[d-1];if(e!=0){var o=e*(1<<this.F1)+(d>1?g[d-2]>>this.F2:0),p=this.FV/o,o=(1<<this.F1)/o,q=1<<this.F2,n=c.t,k=n-d,j=b==null?nbi():b;g.dlShiftTo(k,j);c.compareTo(j)>=0&&(c[c.t++]=1,c.subTo(j,c));BigInteger.ONE.dlShiftTo(d,
j);for(j.subTo(g,g);g.t<d;)g[g.t++]=0;for(;--k>=0;){var l=c[--n]==e?this.DM:Math.floor(c[n]*p+(c[n-1]+q)*o);if((c[n]+=g.am(0,l,c,k,0,d))<l){g.dlShiftTo(k,j);for(c.subTo(j,c);c[n]<--l;)c.subTo(j,c)}}b!=null&&(c.drShiftTo(d,b),h!=a&&BigInteger.ZERO.subTo(b,b));c.t=d;c.clamp();f>0&&c.rShiftTo(f,c);h<0&&BigInteger.ZERO.subTo(c,c)}}}}function bnMod(a){var b=nbi();this.abs().divRemTo(a,null,b);this.s<0&&b.compareTo(BigInteger.ZERO)>0&&a.subTo(b,b);return b}function Classic(a){this.m=a}
function cConvert(a){return a.s<0||a.compareTo(this.m)>=0?a.mod(this.m):a}function cRevert(a){return a}function cReduce(a){a.divRemTo(this.m,null,a)}function cMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}function cSqrTo(a,b){a.squareTo(b);this.reduce(b)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;
function bnpInvDigit(){if(this.t<1)return 0;var a=this[0];if((a&1)==0)return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return b>0?this.DV-b:-b}function Montgomery(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}
function montConvert(a){var b=nbi();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);a.s<0&&b.compareTo(BigInteger.ZERO)>0&&this.m.subTo(b,b);return b}function montRevert(a){var b=nbi();a.copyTo(b);this.reduce(b);return b}
function montReduce(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,d=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,d,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);a.compareTo(this.m)>=0&&a.subTo(this.m,a)}function montSqrTo(a,b){a.squareTo(b);this.reduce(b)}function montMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Montgomery.prototype.convert=montConvert;
Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(a,b){if(a>4294967295||a<1)return BigInteger.ONE;var c=nbi(),d=nbi(),e=b.convert(this),g=nbits(a)-1;for(e.copyTo(c);--g>=0;)if(b.sqrTo(c,d),(a&1<<g)>0)b.mulTo(d,e,c);else var h=c,c=d,d=h;return b.revert(c)}
function bnModPowInt(a,b){var c;c=a<256||b.isEven()?new Classic(b):new Montgomery(b);return this.exp(a,c)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;
BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;
BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnClone(){var a=nbi();this.copyTo(a);return a}function bnIntValue(){if(this.s<0)if(this.t==1)return this[0]-this.DV;else{if(this.t==0)return-1}else if(this.t==1)return this[0];else if(this.t==0)return 0;return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return this.t==0?this.s:this[0]<<24>>24}function bnShortValue(){return this.t==0?this.s:this[0]<<16>>16}
function bnpChunkSize(a){return Math.floor(Math.LN2*this.DB/Math.log(a))}function bnSigNum(){return this.s<0?-1:this.t<=0||this.t==1&&this[0]<=0?0:1}function bnpToRadix(a){a==null&&(a=10);if(this.signum()==0||a<2||a>36)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=nbv(b),d=nbi(),e=nbi(),g="";for(this.divRemTo(c,d,e);d.signum()>0;)g=(b+e.intValue()).toString(a).substr(1)+g,d.divRemTo(c,d,e);return e.intValue().toString(a)+g}
function bnpFromRadix(a,b){this.fromInt(0);b==null&&(b=10);for(var c=this.chunkSize(b),d=Math.pow(b,c),e=!1,g=0,h=0,f=0;f<a.length;++f){var o=intAt(a,f);o<0?a.charAt(f)=="-"&&this.signum()==0&&(e=!0):(h=b*h+o,++g>=c&&(this.dMultiply(d),this.dAddOffset(h,0),h=g=0))}g>0&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));e&&BigInteger.ZERO.subTo(this,this)}
function bnpFromNumber(a,b,c){if("number"==typeof b)if(a<2)this.fromInt(1);else{this.fromNumber(a,c);this.testBit(a-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);for(this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(BigInteger.ONE.shiftLeft(a-1),this)}else{var c=[],d=a&7;c.length=(a>>3)+1;b.nextBytes(c);d>0?c[0]&=(1<<d)-1:c[0]=0;this.fromString(c,256)}}
function bnToByteArray(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,d,e=0;if(a-- >0){if(c<this.DB&&(d=this[a]>>c)!=(this.s&this.DM)>>c)b[e++]=d|this.s<<this.DB-c;for(;a>=0;)if(c<8?(d=(this[a]&(1<<c)-1)<<8-c,d|=this[--a]>>(c+=this.DB-8)):(d=this[a]>>(c-=8)&255,c<=0&&(c+=this.DB,--a)),(d&128)!=0&&(d|=-256),e==0&&(this.s&128)!=(d&128)&&++e,e>0||d!=this.s)b[e++]=d}return b}function bnEquals(a){return this.compareTo(a)==0}function bnMin(a){return this.compareTo(a)<0?this:a}
function bnMax(a){return this.compareTo(a)>0?this:a}function bnpBitwiseTo(a,b,c){var d,e,g=Math.min(a.t,this.t);for(d=0;d<g;++d)c[d]=b(this[d],a[d]);if(a.t<this.t){e=a.s&this.DM;for(d=g;d<this.t;++d)c[d]=b(this[d],e);c.t=this.t}else{e=this.s&this.DM;for(d=g;d<a.t;++d)c[d]=b(e,a[d]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()}function op_and(a,b){return a&b}function bnAnd(a){var b=nbi();this.bitwiseTo(a,op_and,b);return b}function op_or(a,b){return a|b}
function bnOr(a){var b=nbi();this.bitwiseTo(a,op_or,b);return b}function op_xor(a,b){return a^b}function bnXor(a){var b=nbi();this.bitwiseTo(a,op_xor,b);return b}function op_andnot(a,b){return a&~b}function bnAndNot(a){var b=nbi();this.bitwiseTo(a,op_andnot,b);return b}function bnNot(){for(var a=nbi(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a}function bnShiftLeft(a){var b=nbi();a<0?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b}
function bnShiftRight(a){var b=nbi();a<0?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b}function lbit(a){if(a==0)return-1;var b=0;(a&65535)==0&&(a>>=16,b+=16);(a&255)==0&&(a>>=8,b+=8);(a&15)==0&&(a>>=4,b+=4);(a&3)==0&&(a>>=2,b+=2);(a&1)==0&&++b;return b}function bnGetLowestSetBit(){for(var a=0;a<this.t;++a)if(this[a]!=0)return a*this.DB+lbit(this[a]);return this.s<0?this.t*this.DB:-1}function cbit(a){for(var b=0;a!=0;)a&=a-1,++b;return b}
function bnBitCount(){for(var a=0,b=this.s&this.DM,c=0;c<this.t;++c)a+=cbit(this[c]^b);return a}function bnTestBit(a){var b=Math.floor(a/this.DB);return b>=this.t?this.s!=0:(this[b]&1<<a%this.DB)!=0}function bnpChangeBit(a,b){var c=BigInteger.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c}function bnSetBit(a){return this.changeBit(a,op_or)}function bnClearBit(a){return this.changeBit(a,op_andnot)}function bnFlipBit(a){return this.changeBit(a,op_xor)}
function bnpAddTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]+a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d+=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d+=a[c],b[c++]=d&this.DM,d>>=this.DB;d+=a.s}b.s=d<0?-1:0;d>0?b[c++]=d:d<-1&&(b[c++]=this.DV+d);b.t=c;b.clamp()}function bnAdd(a){var b=nbi();this.addTo(a,b);return b}function bnSubtract(a){var b=nbi();this.subTo(a,b);return b}
function bnMultiply(a){var b=nbi();this.multiplyTo(a,b);return b}function bnSquare(){var a=nbi();this.squareTo(a);return a}function bnDivide(a){var b=nbi();this.divRemTo(a,b,null);return b}function bnRemainder(a){var b=nbi();this.divRemTo(a,null,b);return b}function bnDivideAndRemainder(a){var b=nbi(),c=nbi();this.divRemTo(a,b,c);return[b,c]}function bnpDMultiply(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()}
function bnpDAddOffset(a,b){if(a!=0){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}}function NullExp(){}function nNop(a){return a}function nMulTo(a,b,c){a.multiplyTo(b,c)}function nSqrTo(a,b){a.squareTo(b)}NullExp.prototype.convert=nNop;NullExp.prototype.revert=nNop;NullExp.prototype.mulTo=nMulTo;NullExp.prototype.sqrTo=nSqrTo;function bnPow(a){return this.exp(a,new NullExp)}
function bnpMultiplyLowerTo(a,b,c){var d=Math.min(this.t+a.t,b);c.s=0;for(c.t=d;d>0;)c[--d]=0;var e;for(e=c.t-this.t;d<e;++d)c[d+this.t]=this.am(0,a[d],c,d,0,this.t);for(e=Math.min(a.t,b);d<e;++d)this.am(0,a[d],c,d,0,b-d);c.clamp()}function bnpMultiplyUpperTo(a,b,c){--b;var d=c.t=this.t+a.t-b;for(c.s=0;--d>=0;)c[d]=0;for(d=Math.max(b-this.t,0);d<a.t;++d)c[this.t+d-b]=this.am(b-d,a[d],c,0,0,this.t+d-b);c.clamp();c.drShiftTo(1,c)}
function Barrett(a){this.r2=nbi();this.q3=nbi();BigInteger.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}function barrettConvert(a){if(a.s<0||a.t>2*this.m.t)return a.mod(this.m);else if(a.compareTo(this.m)<0)return a;else{var b=nbi();a.copyTo(b);this.reduce(b);return b}}function barrettRevert(a){return a}
function barrettReduce(a){a.drShiftTo(this.m.t-1,this.r2);if(a.t>this.m.t+1)a.t=this.m.t+1,a.clamp();this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);a.compareTo(this.r2)<0;)a.dAddOffset(1,this.m.t+1);for(a.subTo(this.r2,a);a.compareTo(this.m)>=0;)a.subTo(this.m,a)}function barrettSqrTo(a,b){a.squareTo(b);this.reduce(b)}function barrettMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Barrett.prototype.convert=barrettConvert;
Barrett.prototype.revert=barrettRevert;Barrett.prototype.reduce=barrettReduce;Barrett.prototype.mulTo=barrettMulTo;Barrett.prototype.sqrTo=barrettSqrTo;
function bnModPow(a,b){var c=a.bitLength(),d,e=nbv(1),g;if(c<=0)return e;else d=c<18?1:c<48?3:c<144?4:c<768?5:6;g=c<8?new Classic(b):b.isEven()?new Barrett(b):new Montgomery(b);var h=[],f=3,o=d-1,p=(1<<d)-1;h[1]=g.convert(this);if(d>1){c=nbi();for(g.sqrTo(h[1],c);f<=p;)h[f]=nbi(),g.mulTo(c,h[f-2],h[f]),f+=2}for(var q=a.t-1,n,k=!0,j=nbi(),c=nbits(a[q])-1;q>=0;){c>=o?n=a[q]>>c-o&p:(n=(a[q]&(1<<c+1)-1)<<o-c,q>0&&(n|=a[q-1]>>this.DB+c-o));for(f=d;(n&1)==0;)n>>=1,--f;if((c-=f)<0)c+=this.DB,--q;if(k)h[n].copyTo(e),
k=!1;else{for(;f>1;)g.sqrTo(e,j),g.sqrTo(j,e),f-=2;f>0?g.sqrTo(e,j):(f=e,e=j,j=f);g.mulTo(j,h[n],e)}for(;q>=0&&(a[q]&1<<c)==0;)g.sqrTo(e,j),f=e,e=j,j=f,--c<0&&(c=this.DB-1,--q)}return g.revert(e)}
function bnGCD(a){var b=this.s<0?this.negate():this.clone(),a=a.s<0?a.negate():a.clone();if(b.compareTo(a)<0)var c=b,b=a,a=c;var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(d<0)return b;c<d&&(d=c);d>0&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;b.signum()>0;)(c=b.getLowestSetBit())>0&&b.rShiftTo(c,b),(c=a.getLowestSetBit())>0&&a.rShiftTo(c,a),b.compareTo(a)>=0?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));d>0&&a.lShiftTo(d,a);return a}
function bnpModInt(a){if(a<=0)return 0;var b=this.DV%a,c=this.s<0?a-1:0;if(this.t>0)if(b==0)c=this[0]%a;else for(var d=this.t-1;d>=0;--d)c=(b*c+this[d])%a;return c}
function bnModInverse(a){var b=a.isEven();if(this.isEven()&&b||a.signum()==0)return BigInteger.ZERO;for(var c=a.clone(),d=this.clone(),e=nbv(1),g=nbv(0),h=nbv(0),f=nbv(1);c.signum()!=0;){for(;c.isEven();){c.rShiftTo(1,c);if(b){if(!e.isEven()||!g.isEven())e.addTo(this,e),g.subTo(a,g);e.rShiftTo(1,e)}else g.isEven()||g.subTo(a,g);g.rShiftTo(1,g)}for(;d.isEven();){d.rShiftTo(1,d);if(b){if(!h.isEven()||!f.isEven())h.addTo(this,h),f.subTo(a,f);h.rShiftTo(1,h)}else f.isEven()||f.subTo(a,f);f.rShiftTo(1,
f)}c.compareTo(d)>=0?(c.subTo(d,c),b&&e.subTo(h,e),g.subTo(f,g)):(d.subTo(c,d),b&&h.subTo(e,h),f.subTo(g,f))}if(d.compareTo(BigInteger.ONE)!=0)return BigInteger.ZERO;if(f.compareTo(a)>=0)return f.subtract(a);if(f.signum()<0)f.addTo(a,f);else return f;return f.signum()<0?f.add(a):f}
var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,
733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],lplim=67108864/lowprimes[lowprimes.length-1];
function bnIsProbablePrime(a){var b,c=this.abs();if(c.t==1&&c[0]<=lowprimes[lowprimes.length-1]){for(b=0;b<lowprimes.length;++b)if(c[0]==lowprimes[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<lowprimes.length;){for(var d=lowprimes[b],e=b+1;e<lowprimes.length&&d<lplim;)d*=lowprimes[e++];for(d=c.modInt(d);b<e;)if(d%lowprimes[b++]==0)return!1}return c.millerRabin(a)}
function bnpMillerRabin(a){var b=this.subtract(BigInteger.ONE),c=b.getLowestSetBit();if(c<=0)return!1;var d=b.shiftRight(c),a=a+1>>1;if(a>lowprimes.length)a=lowprimes.length;for(var e=nbi(),g=0;g<a;++g){e.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var h=e.modPow(d,this);if(h.compareTo(BigInteger.ONE)!=0&&h.compareTo(b)!=0){for(var f=1;f++<c&&h.compareTo(b)!=0;)if(h=h.modPowInt(2,this),h.compareTo(BigInteger.ONE)==0)return!1;if(h.compareTo(b)!=0)return!1}}return!0}
BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.fromNumber=bnpFromNumber;BigInteger.prototype.bitwiseTo=bnpBitwiseTo;BigInteger.prototype.changeBit=bnpChangeBit;BigInteger.prototype.addTo=bnpAddTo;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;
BigInteger.prototype.modInt=bnpModInt;BigInteger.prototype.millerRabin=bnpMillerRabin;BigInteger.prototype.clone=bnClone;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.byteValue=bnByteValue;BigInteger.prototype.shortValue=bnShortValue;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.toByteArray=bnToByteArray;BigInteger.prototype.equals=bnEquals;BigInteger.prototype.min=bnMin;BigInteger.prototype.max=bnMax;BigInteger.prototype.and=bnAnd;BigInteger.prototype.or=bnOr;
BigInteger.prototype.xor=bnXor;BigInteger.prototype.andNot=bnAndNot;BigInteger.prototype.not=bnNot;BigInteger.prototype.shiftLeft=bnShiftLeft;BigInteger.prototype.shiftRight=bnShiftRight;BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;BigInteger.prototype.bitCount=bnBitCount;BigInteger.prototype.testBit=bnTestBit;BigInteger.prototype.setBit=bnSetBit;BigInteger.prototype.clearBit=bnClearBit;BigInteger.prototype.flipBit=bnFlipBit;BigInteger.prototype.add=bnAdd;BigInteger.prototype.subtract=bnSubtract;
BigInteger.prototype.multiply=bnMultiply;BigInteger.prototype.divide=bnDivide;BigInteger.prototype.remainder=bnRemainder;BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;BigInteger.prototype.modPow=bnModPow;BigInteger.prototype.modInverse=bnModInverse;BigInteger.prototype.pow=bnPow;BigInteger.prototype.gcd=bnGCD;BigInteger.prototype.isProbablePrime=bnIsProbablePrime;BigInteger.prototype.square=bnSquare;
(function(a,b,c,d,e,g,h){function f(a){var b,d,e=this,g=a.length,f=0,h=e.i=e.j=e.m=0;e.S=[];e.c=[];for(g||(a=[g++]);f<c;)e.S[f]=f++;for(f=0;f<c;f++)b=e.S[f],h=h+b+a[f%g]&c-1,d=e.S[h],e.S[f]=d,e.S[h]=b;e.g=function(a){var b=e.S,d=e.i+1&c-1,g=b[d],f=e.j+g&c-1,h=b[f];b[d]=h;b[f]=g;for(var k=b[g+h&c-1];--a;)d=d+1&c-1,g=b[d],f=f+g&c-1,h=b[f],b[d]=h,b[f]=g,k=k*c+b[g+h&c-1];e.i=d;e.j=f;return k};e.g(c)}function o(a,b,c,d,e){c=[];e=typeof a;if(b&&e=="object")for(d in a)if(d.indexOf("S")<5)try{c.push(o(a[d],
b-1))}catch(g){}return c.length?c:a+(e!="string"?"\x00":"")}function p(a,b,d,e){a+="";for(e=d=0;e<a.length;e++){var g=b,f=e&c-1,h=(d^=b[e&c-1]*19)+a.charCodeAt(e);g[f]=h&c-1}a="";for(e in b)a+=String.fromCharCode(b[e]);return a}b.seedrandom=function(q,n){var k=[],j,q=p(o(n?[q,a]:arguments.length?q:[(new Date).getTime(),a,window],3),k);j=new f(k);p(j.S,a);b.random=function(){for(var a=j.g(d),b=h,f=0;a<e;)a=(a+f)*c,b*=c,f=j.g(1);for(;a>=g;)a/=2,b/=2,f>>>=1;return(a+f)/b};return q};h=b.pow(c,d);e=b.pow(2,
e);g=e*2;p(b.random(),a)})([],Math,256,6,52);function SeededRandom(){}function SRnextBytes(a){var b;for(b=0;b<a.length;b++)a[b]=Math.floor(Math.random()*256)}SeededRandom.prototype.nextBytes=SRnextBytes;function Arcfour(){this.j=this.i=0;this.S=[]}function ARC4init(a){var b,c,d;for(b=0;b<256;++b)this.S[b]=b;for(b=c=0;b<256;++b)c=c+this.S[b]+a[b%a.length]&255,d=this.S[b],this.S[b]=this.S[c],this.S[c]=d;this.j=this.i=0}
function ARC4next(){var a;this.i=this.i+1&255;this.j=this.j+this.S[this.i]&255;a=this.S[this.i];this.S[this.i]=this.S[this.j];this.S[this.j]=a;return this.S[a+this.S[this.i]&255]}Arcfour.prototype.init=ARC4init;Arcfour.prototype.next=ARC4next;function prng_newstate(){return new Arcfour}var rng_psize=256,rng_state,rng_pool,rng_pptr;
function rng_seed_int(a){rng_pool[rng_pptr++]^=a&255;rng_pool[rng_pptr++]^=a>>8&255;rng_pool[rng_pptr++]^=a>>16&255;rng_pool[rng_pptr++]^=a>>24&255;rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}
if(rng_pool==null){rng_pool=[];rng_pptr=0;var t;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=z.charCodeAt(t)&255}for(;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=t&255;rng_pptr=0;rng_seed_time()}
function rng_get_byte(){if(rng_state==null){rng_seed_time();rng_state=prng_newstate();rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(a){var b;for(b=0;b<a.length;++b)a[b]=rng_get_byte()}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;
function SHA256(a){function b(a,b){var c=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(c>>16)<<16|c&65535}function c(a,b){return a>>>b|a<<32-b}a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var h=a.charCodeAt(c);h<128?b+=String.fromCharCode(h):(h>127&&h<2048?b+=String.fromCharCode(h>>6|192):(b+=String.fromCharCode(h>>12|224),b+=String.fromCharCode(h>>6&63|128)),b+=String.fromCharCode(h&63|128))}return b}(a);return function(a){for(var b="",c=0;c<a.length*4;c++)b+="0123456789abcdef".charAt(a[c>>
2]>>(3-c%4)*8+4&15)+"0123456789abcdef".charAt(a[c>>2]>>(3-c%4)*8&15);return b}(function(a,e){var g=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,
2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],f=Array(64),o,p,q,n,k,j,l,m,s,r,u,w;a[e>>5]|=128<<24-e%32;a[(e+64>>9<<4)+15]=e;for(s=0;s<a.length;s+=16){o=h[0];p=h[1];q=h[2];n=h[3];
k=h[4];j=h[5];l=h[6];m=h[7];for(r=0;r<64;r++)f[r]=r<16?a[r+s]:b(b(b(c(f[r-2],17)^c(f[r-2],19)^f[r-2]>>>10,f[r-7]),c(f[r-15],7)^c(f[r-15],18)^f[r-15]>>>3),f[r-16]),u=b(b(b(b(m,c(k,6)^c(k,11)^c(k,25)),k&j^~k&l),g[r]),f[r]),w=b(c(o,2)^c(o,13)^c(o,22),o&p^o&q^p&q),m=l,l=j,j=k,k=b(n,u),n=q,q=p,p=o,o=b(u,w);h[0]=b(o,h[0]);h[1]=b(p,h[1]);h[2]=b(q,h[2]);h[3]=b(n,h[3]);h[4]=b(k,h[4]);h[5]=b(j,h[5]);h[6]=b(l,h[6]);h[7]=b(m,h[7])}return h}(function(a){for(var b=[],c=0;c<a.length*8;c+=8)b[c>>5]|=(a.charCodeAt(c/
8)&255)<<24-c%32;return b}(a),a.length*8))}var sha256={hex:function(a){return SHA256(a)}};
function SHA1(a){function b(a,b){return a<<b|a>>>32-b}function c(a){var b="",c,d;for(c=7;c>=0;c--)d=a>>>c*4&15,b+=d.toString(16);return b}var d,e,g=Array(80),h=1732584193,f=4023233417,o=2562383102,p=271733878,q=3285377520,n,k,j,l,m,a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):(d>127&&d<2048?b+=String.fromCharCode(d>>6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&
63|128))}return b}(a);n=a.length;var s=[];for(d=0;d<n-3;d+=4)e=a.charCodeAt(d)<<24|a.charCodeAt(d+1)<<16|a.charCodeAt(d+2)<<8|a.charCodeAt(d+3),s.push(e);switch(n%4){case 0:d=2147483648;break;case 1:d=a.charCodeAt(n-1)<<24|8388608;break;case 2:d=a.charCodeAt(n-2)<<24|a.charCodeAt(n-1)<<16|32768;break;case 3:d=a.charCodeAt(n-3)<<24|a.charCodeAt(n-2)<<16|a.charCodeAt(n-1)<<8|128}for(s.push(d);s.length%16!=14;)s.push(0);s.push(n>>>29);s.push(n<<3&4294967295);for(a=0;a<s.length;a+=16){for(d=0;d<16;d++)g[d]=
s[a+d];for(d=16;d<=79;d++)g[d]=b(g[d-3]^g[d-8]^g[d-14]^g[d-16],1);e=h;n=f;k=o;j=p;l=q;for(d=0;d<=19;d++)m=b(e,5)+(n&k|~n&j)+l+g[d]+1518500249&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=20;d<=39;d++)m=b(e,5)+(n^k^j)+l+g[d]+1859775393&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=40;d<=59;d++)m=b(e,5)+(n&k|n&j|k&j)+l+g[d]+2400959708&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;for(d=60;d<=79;d++)m=b(e,5)+(n^k^j)+l+g[d]+3395469782&4294967295,l=j,j=k,k=b(n,30),n=e,e=m;h=h+e&4294967295;f=f+n&4294967295;o=o+k&4294967295;
p=p+j&4294967295;q=q+l&4294967295}m=c(h)+c(f)+c(o)+c(p)+c(q);return m.toLowerCase()}
var sha1={hex:function(a){return SHA1(a)}},MD5=function(a){function b(a,b){var c,d,e,f,g;e=a&2147483648;f=b&2147483648;c=a&1073741824;d=b&1073741824;g=(a&1073741823)+(b&1073741823);return c&d?g^2147483648^e^f:c|d?g&1073741824?g^3221225472^e^f:g^1073741824^e^f:g^e^f}function c(a,c,d,e,f,g,h){a=b(a,b(b(c&d|~c&e,f),h));return b(a<<g|a>>>32-g,c)}function d(a,c,d,e,f,g,h){a=b(a,b(b(c&e|d&~e,f),h));return b(a<<g|a>>>32-g,c)}function e(a,c,d,e,f,g,h){a=b(a,b(b(c^d^e,f),h));return b(a<<g|a>>>32-g,c)}function g(a,
c,d,e,f,g,h){a=b(a,b(b(d^(c|~e),f),h));return b(a<<g|a>>>32-g,c)}function h(a){var b="",c="",d;for(d=0;d<=3;d++)c=a>>>d*8&255,c="0"+c.toString(16),b+=c.substr(c.length-2,2);return b}var f=[],o,p,q,n,k,j,l,m,a=function(a){for(var a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):(d>127&&d<2048?b+=String.fromCharCode(d>>6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&63|128))}return b}(a),
f=function(a){var b,c=a.length;b=c+8;for(var d=((b-b%64)/64+1)*16,e=Array(d-1),f=0,g=0;g<c;)b=(g-g%4)/4,f=g%4*8,e[b]|=a.charCodeAt(g)<<f,g++;e[(g-g%4)/4]|=128<<g%4*8;e[d-2]=c<<3;e[d-1]=c>>>29;return e}(a);k=1732584193;j=4023233417;l=2562383102;m=271733878;for(a=0;a<f.length;a+=16)o=k,p=j,q=l,n=m,k=c(k,j,l,m,f[a+0],7,3614090360),m=c(m,k,j,l,f[a+1],12,3905402710),l=c(l,m,k,j,f[a+2],17,606105819),j=c(j,l,m,k,f[a+3],22,3250441966),k=c(k,j,l,m,f[a+4],7,4118548399),m=c(m,k,j,l,f[a+5],12,1200080426),l=c(l,
m,k,j,f[a+6],17,2821735955),j=c(j,l,m,k,f[a+7],22,4249261313),k=c(k,j,l,m,f[a+8],7,1770035416),m=c(m,k,j,l,f[a+9],12,2336552879),l=c(l,m,k,j,f[a+10],17,4294925233),j=c(j,l,m,k,f[a+11],22,2304563134),k=c(k,j,l,m,f[a+12],7,1804603682),m=c(m,k,j,l,f[a+13],12,4254626195),l=c(l,m,k,j,f[a+14],17,2792965006),j=c(j,l,m,k,f[a+15],22,1236535329),k=d(k,j,l,m,f[a+1],5,4129170786),m=d(m,k,j,l,f[a+6],9,3225465664),l=d(l,m,k,j,f[a+11],14,643717713),j=d(j,l,m,k,f[a+0],20,3921069994),k=d(k,j,l,m,f[a+5],5,3593408605),
m=d(m,k,j,l,f[a+10],9,38016083),l=d(l,m,k,j,f[a+15],14,3634488961),j=d(j,l,m,k,f[a+4],20,3889429448),k=d(k,j,l,m,f[a+9],5,568446438),m=d(m,k,j,l,f[a+14],9,3275163606),l=d(l,m,k,j,f[a+3],14,4107603335),j=d(j,l,m,k,f[a+8],20,1163531501),k=d(k,j,l,m,f[a+13],5,2850285829),m=d(m,k,j,l,f[a+2],9,4243563512),l=d(l,m,k,j,f[a+7],14,1735328473),j=d(j,l,m,k,f[a+12],20,2368359562),k=e(k,j,l,m,f[a+5],4,4294588738),m=e(m,k,j,l,f[a+8],11,2272392833),l=e(l,m,k,j,f[a+11],16,1839030562),j=e(j,l,m,k,f[a+14],23,4259657740),
k=e(k,j,l,m,f[a+1],4,2763975236),m=e(m,k,j,l,f[a+4],11,1272893353),l=e(l,m,k,j,f[a+7],16,4139469664),j=e(j,l,m,k,f[a+10],23,3200236656),k=e(k,j,l,m,f[a+13],4,681279174),m=e(m,k,j,l,f[a+0],11,3936430074),l=e(l,m,k,j,f[a+3],16,3572445317),j=e(j,l,m,k,f[a+6],23,76029189),k=e(k,j,l,m,f[a+9],4,3654602809),m=e(m,k,j,l,f[a+12],11,3873151461),l=e(l,m,k,j,f[a+15],16,530742520),j=e(j,l,m,k,f[a+2],23,3299628645),k=g(k,j,l,m,f[a+0],6,4096336452),m=g(m,k,j,l,f[a+7],10,1126891415),l=g(l,m,k,j,f[a+14],15,2878612391),
j=g(j,l,m,k,f[a+5],21,4237533241),k=g(k,j,l,m,f[a+12],6,1700485571),m=g(m,k,j,l,f[a+3],10,2399980690),l=g(l,m,k,j,f[a+10],15,4293915773),j=g(j,l,m,k,f[a+1],21,2240044497),k=g(k,j,l,m,f[a+8],6,1873313359),m=g(m,k,j,l,f[a+15],10,4264355552),l=g(l,m,k,j,f[a+6],15,2734768916),j=g(j,l,m,k,f[a+13],21,1309151649),k=g(k,j,l,m,f[a+4],6,4149444226),m=g(m,k,j,l,f[a+11],10,3174756917),l=g(l,m,k,j,f[a+2],15,718787259),j=g(j,l,m,k,f[a+9],21,3951481745),k=b(k,o),j=b(j,p),l=b(l,q),m=b(m,n);return(h(k)+h(j)+h(l)+
h(m)).toLowerCase()};function parseBigInt(a,b){return new BigInteger(a,b)}function linebrk(a,b){for(var c="",d=0;d+b<a.length;)c+=a.substring(d,d+b)+"\n",d+=b;return c+a.substring(d,a.length)}function byte2Hex(a){return a<16?"0"+a.toString(16):a.toString(16)}
function pkcs1pad2(a,b){if(b<a.length+11)throw"Message too long for RSA (n="+b+", l="+a.length+")";for(var c=[],d=a.length-1;d>=0&&b>0;){var e=a.charCodeAt(d--);e<128?c[--b]=e:e>127&&e<2048?(c[--b]=e&63|128,c[--b]=e>>6|192):(c[--b]=e&63|128,c[--b]=e>>6&63|128,c[--b]=e>>12|224)}c[--b]=0;d=new SecureRandom;for(e=[];b>2;){for(e[0]=0;e[0]==0;)d.nextBytes(e);c[--b]=e[0]}c[--b]=2;c[--b]=0;return new BigInteger(c)}
function RSAKey(){this.n=null;this.e=0;this.coeff=this.dmq1=this.dmp1=this.q=this.p=this.d=null}function RSASetPublic(a,b){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16)):alert("Invalid RSA public key")}function RSADoPublic(a){return a.modPowInt(this.e,this.n)}function RSAEncrypt(a){a=pkcs1pad2(a,this.n.bitLength()+7>>3);if(a==null)return null;a=this.doPublic(a);if(a==null)return null;a=a.toString(16);return(a.length&1)==0?a:"0"+a}
// -- rev 1.1.0 追加ここから
function RSAToJSON(){return {coeff: this.coeff.toString(16),d: this.d.toString(16),dmp1: this.dmp1.toString(16),dmq1: this.dmq1.toString(16),e: this.e.toString(16),n: this.n.toString(16),p: this.p.toString(16),q: this.q.toString(16)}}
function RSAParse(rsaString) {var json=JSON.parse(rsaString);var rsa = new RSAKey();rsa.setPrivateEx(json.n,json.e,json.d,json.p,json.q,json.dmp1,json.dmq1,json.coeff);return rsa;}
RSAKey.prototype.toJSON = RSAToJSON;RSAKey.parse = RSAParse;
// -- rev 1.1.0 追加ここまで
RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt;function pkcs1unpad2(a,b){for(var c=a.toByteArray(),d=0;d<c.length&&c[d]==0;)++d;if(c.length-d!=b-1||c[d]!=2)return null;for(++d;c[d]!=0;)if(++d>=c.length)return null;for(var e="";++d<c.length;){var g=c[d]&255;g<128?e+=String.fromCharCode(g):g>191&&g<224?(e+=String.fromCharCode((g&31)<<6|c[d+1]&63),++d):(e+=String.fromCharCode((g&15)<<12|(c[d+1]&63)<<6|c[d+2]&63),d+=2)}return e}
function RSASetPrivate(a,b,c){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16)):alert("Invalid RSA private key")}
function RSASetPrivateEx(a,b,c,d,e,g,h,f){a!=null&&b!=null&&a.length>0&&b.length>0?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16),this.p=parseBigInt(d,16),this.q=parseBigInt(e,16),this.dmp1=parseBigInt(g,16),this.dmq1=parseBigInt(h,16),this.coeff=parseBigInt(f,16)):alert("Invalid RSA private key")}
function RSAGenerate(a,b){var c=new SeededRandom,d=a>>1;this.e=parseInt(b,16);for(var e=new BigInteger(b,16);;){for(;;)if(this.p=new BigInteger(a-d,1,c),this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.p.isProbablePrime(10))break;for(;;)if(this.q=new BigInteger(d,1,c),this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)==0&&this.q.isProbablePrime(10))break;if(this.p.compareTo(this.q)<=0){var g=this.p;this.p=this.q;this.q=g}var g=this.p.subtract(BigInteger.ONE),
h=this.q.subtract(BigInteger.ONE),f=g.multiply(h);if(f.gcd(e).compareTo(BigInteger.ONE)==0){this.n=this.p.multiply(this.q);this.d=e.modInverse(f);this.dmp1=this.d.mod(g);this.dmq1=this.d.mod(h);this.coeff=this.q.modInverse(this.p);break}}}
function RSADoPrivate(a){if(this.p==null||this.q==null)return a.modPow(this.d,this.n);for(var b=a.mod(this.p).modPow(this.dmp1,this.p),a=a.mod(this.q).modPow(this.dmq1,this.q);b.compareTo(a)<0;)b=b.add(this.p);return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)}function RSADecrypt(a){a=this.doPrivate(parseBigInt(a,16));return a==null?null:pkcs1unpad2(a,this.n.bitLength()+7>>3)}RSAKey.prototype.doPrivate=RSADoPrivate;RSAKey.prototype.setPrivate=RSASetPrivate;
RSAKey.prototype.setPrivateEx=RSASetPrivateEx;RSAKey.prototype.generate=RSAGenerate;RSAKey.prototype.decrypt=RSADecrypt;var _RSASIGN_DIHEAD=[];_RSASIGN_DIHEAD.sha1="3021300906052b0e03021a05000414";_RSASIGN_DIHEAD.sha256="3031300d060960864801650304020105000420";var _RSASIGN_HASHHEXFUNC=[];_RSASIGN_HASHHEXFUNC.sha1=sha1.hex;_RSASIGN_HASHHEXFUNC.sha256=sha256.hex;
function _rsasign_getHexPaddedDigestInfoForString(a,b,c){b/=4;for(var a=(0,_RSASIGN_HASHHEXFUNC[c])(a),c="00"+_RSASIGN_DIHEAD[c]+a,a="",b=b-4-c.length,d=0;d<b;d+=2)a+="ff";return sPaddedMessageHex="0001"+a+c}function _rsasign_signString(a,b){var c=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),b);return this.doPrivate(parseBigInt(c,16)).toString(16)}
function _rsasign_signStringWithSHA1(a){a=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha1");return this.doPrivate(parseBigInt(a,16)).toString(16)}function _rsasign_signStringWithSHA256(a){a=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),"sha256");return this.doPrivate(parseBigInt(a,16)).toString(16)}function _rsasign_getDecryptSignatureBI(a,b,c){var d=new RSAKey;d.setPublic(b,c);return d.doPublic(a)}
function _rsasign_getHexDigestInfoFromSig(a,b,c){return _rsasign_getDecryptSignatureBI(a,b,c).toString(16).replace(/^1f+00/,"")}function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a){for(var b in _RSASIGN_DIHEAD){var c=_RSASIGN_DIHEAD[b],d=c.length;if(a.substring(0,d)==c)return[b,a.substring(d)]}return[]}
function _rsasign_verifySignatureWithArgs(a,b,c,d){b=_rsasign_getHexDigestInfoFromSig(b,c,d);c=_rsasign_getAlgNameAndHashFromHexDisgestInfo(b);if(c.length==0)return!1;b=c[1];a=(0,_RSASIGN_HASHHEXFUNC[c[0]])(a);return b==a}function _rsasign_verifyHexSignatureForMessage(a,b){var c=parseBigInt(a,16);return _rsasign_verifySignatureWithArgs(b,c,this.n.toString(16),this.e.toString(16))}
function _rsasign_verifyString(a,b){var b=b.replace(/[ \n]+/g,""),c=this.doPublic(parseBigInt(b,16)).toString(16).replace(/^1f+00/,""),d=_rsasign_getAlgNameAndHashFromHexDisgestInfo(c);if(d.length==0)return!1;c=d[1];d=(0,_RSASIGN_HASHHEXFUNC[d[0]])(a);return c==d}RSAKey.prototype.signString=_rsasign_signString;RSAKey.prototype.signStringWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signStringWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.verifyString=_rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage=_rsasign_verifyHexSignatureForMessage;
var aes=function(){var a={Sbox:[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,
95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],ShiftRowTab:[0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11]};a.Init=
function(){a.Sbox_Inv=Array(256);for(var b=0;b<256;b++)a.Sbox_Inv[a.Sbox[b]]=b;a.ShiftRowTab_Inv=Array(16);for(b=0;b<16;b++)a.ShiftRowTab_Inv[a.ShiftRowTab[b]]=b;a.xtime=Array(256);for(b=0;b<128;b++)a.xtime[b]=b<<1,a.xtime[128+b]=b<<1^27};a.Done=function(){delete a.Sbox_Inv;delete a.ShiftRowTab_Inv;delete a.xtime};a.ExpandKey=function(b){var c=b.length,d,e=1;switch(c){case 16:d=176;break;case 24:d=208;break;case 32:d=240;break;default:alert("my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!")}for(var g=
c;g<d;g+=4){var h=b.slice(g-4,g);if(g%c==0){if(h=[a.Sbox[h[1]]^e,a.Sbox[h[2]],a.Sbox[h[3]],a.Sbox[h[0]]],(e<<=1)>=256)e^=283}else c>24&&g%c==16&&(h=[a.Sbox[h[0]],a.Sbox[h[1]],a.Sbox[h[2]],a.Sbox[h[3]]]);for(var f=0;f<4;f++)b[g+f]=b[g+f-c]^h[f]}};a.Encrypt=function(b,c){var d=c.length;a.AddRoundKey(b,c.slice(0,16));for(var e=16;e<d-16;e+=16)a.SubBytes(b,a.Sbox),a.ShiftRows(b,a.ShiftRowTab),a.MixColumns(b),a.AddRoundKey(b,c.slice(e,e+16));a.SubBytes(b,a.Sbox);a.ShiftRows(b,a.ShiftRowTab);a.AddRoundKey(b,
c.slice(e,d))};a.Decrypt=function(b,c){var d=c.length;a.AddRoundKey(b,c.slice(d-16,d));a.ShiftRows(b,a.ShiftRowTab_Inv);a.SubBytes(b,a.Sbox_Inv);for(d-=32;d>=16;d-=16)a.AddRoundKey(b,c.slice(d,d+16)),a.MixColumns_Inv(b),a.ShiftRows(b,a.ShiftRowTab_Inv),a.SubBytes(b,a.Sbox_Inv);a.AddRoundKey(b,c.slice(0,16))};a.SubBytes=function(a,c){for(var d=0;d<16;d++)a[d]=c[a[d]]};a.AddRoundKey=function(a,c){for(var d=0;d<16;d++)a[d]^=c[d]};a.ShiftRows=function(a,c){for(var d=[].concat(a),e=0;e<16;e++)a[e]=d[c[e]]};
a.MixColumns=function(b){for(var c=0;c<16;c+=4){var d=b[c+0],e=b[c+1],g=b[c+2],h=b[c+3],f=d^e^g^h;b[c+0]^=f^a.xtime[d^e];b[c+1]^=f^a.xtime[e^g];b[c+2]^=f^a.xtime[g^h];b[c+3]^=f^a.xtime[h^d]}};a.MixColumns_Inv=function(b){for(var c=0;c<16;c+=4){var d=b[c+0],e=b[c+1],g=b[c+2],h=b[c+3],f=d^e^g^h,o=a.xtime[f],p=a.xtime[a.xtime[o^d^g]]^f;f^=a.xtime[a.xtime[o^e^h]];b[c+0]^=p^a.xtime[d^e];b[c+1]^=f^a.xtime[e^g];b[c+2]^=p^a.xtime[g^h];b[c+3]^=f^a.xtime[h^d]}};return a}(),cryptico=function(){var a={};aes.Init();
a.b256to64=function(a){var c,d,e,g="",h=0,f=0,o=a.length;for(e=0;e<o;e++)d=a.charCodeAt(e),f==0?(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>2&63),c=(d&3)<<4):f==1?(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c|d>>4&15),c=(d&15)<<2):f==2&&(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c|d>>6&3),h+=1,g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d&63)),h+=1,f+=1,f==3&&
(f=0);f>0&&(g+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c),g+="=");f==1&&(g+="=");return g};a.b64to256=function(a){var c,d,e="",g=0,h=0,f=a.length;for(d=0;d<f;d++)c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d)),c>=0&&(g&&(e+=String.fromCharCode(h|c>>6-g&255)),g=g+2&7,h=c<<g&255);return e};a.b16to64=function(a){var c,d,e="";a.length%2==1&&(a="0"+a);for(c=0;c+3<=a.length;c+=3)d=parseInt(a.substring(c,c+3),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>
6)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d&63);c+1==a.length?(d=parseInt(a.substring(c,c+1),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d<<2)):c+2==a.length&&(d=parseInt(a.substring(c,c+2),16),e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>2)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d&3)<<4));for(;(e.length&3)>0;)e+="=";return e};a.b64to16=function(a){var c="",
d,e=0,g;for(d=0;d<a.length;++d){if(a.charAt(d)=="=")break;v="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d));v<0||(e==0?(c+=int2char(v>>2),g=v&3,e=1):e==1?(c+=int2char(g<<2|v>>4),g=v&15,e=2):e==2?(c+=int2char(g),c+=int2char(v>>2),g=v&3,e=3):(c+=int2char(g<<2|v>>4),c+=int2char(v&15),e=0))}e==1&&(c+=int2char(g<<2));return c};a.string2bytes=function(a){for(var c=[],d=0;d<a.length;d++)c.push(a.charCodeAt(d));return c};a.bytes2string=function(a){for(var c="",d=0;d<
a.length;d++)c+=String.fromCharCode(a[d]);return c};a.blockXOR=function(a,c){for(var d=Array(16),e=0;e<16;e++)d[e]=a[e]^c[e];return d};a.blockIV=function(){var a=new SecureRandom,c=Array(16);a.nextBytes(c);return c};a.pad16=function(a){var c=a.slice(0),d=(16-a.length%16)%16;for(i=a.length;i<a.length+d;i++)c.push(0);return c};a.depad=function(a){for(a=a.slice(0);a[a.length-1]==0;)a=a.slice(0,a.length-1);return a};a.encryptAESCBC=function(b,c){var d=c.slice(0);aes.ExpandKey(d);for(var e=a.string2bytes(b),
e=a.pad16(e),g=a.blockIV(),h=0;h<e.length/16;h++){var f=e.slice(h*16,h*16+16),o=g.slice(h*16,h*16+16),f=a.blockXOR(o,f);aes.Encrypt(f,d);g=g.concat(f)}d=a.bytes2string(g);return a.b256to64(d)};a.decryptAESCBC=function(b,c){var d=c.slice(0);aes.ExpandKey(d);for(var b=a.b64to256(b),e=a.string2bytes(b),g=[],h=1;h<e.length/16;h++){var f=e.slice(h*16,h*16+16),o=e.slice((h-1)*16,(h-1)*16+16);aes.Decrypt(f,d);f=a.blockXOR(o,f);g=g.concat(f)}g=a.depad(g);return a.bytes2string(g)};a.wrap60=function(a){for(var c=
"",d=0;d<a.length;d++)d%60==0&&d!=0&&(c+="\n"),c+=a[d];return c};a.generateAESKey=function(){var a=Array(32);(new SecureRandom).nextBytes(a);return a};a.generateRSAKey=function(a,c){Math.seedrandom(sha256.hex(a));var d=new RSAKey;d.generate(c,"03");return d};a.publicKeyString=function(b){return pubkey=a.b16to64(b.n.toString(16))};a.publicKeyID=function(a){return MD5(a)};a.publicKeyFromString=function(b){var b=a.b64to16(b.split("|")[0]),c=new RSAKey;c.setPublic(b,"03");return c};a.encrypt=function(b,
c,d){var e="",g=a.generateAESKey();try{var h=a.publicKeyFromString(c);e+=a.b16to64(h.encrypt(a.bytes2string(g)))+"?"}catch(f){return{status:"Invalid public key"}}d&&(signString=cryptico.b16to64(d.signString(b,"sha256")),b+="::52cee64bb3a38f6403386519a39ac91c::",b+=cryptico.publicKeyString(d),b+="::52cee64bb3a38f6403386519a39ac91c::",b+=signString);e+=a.encryptAESCBC(b,g);return{status:"success",cipher:e}};a.decrypt=function(b,c){var d=b.split("?"),e=c.decrypt(a.b64to16(d[0]));if(e==null)return{status:"failure"};
e=a.string2bytes(e);d=a.decryptAESCBC(d[1],e).split("::52cee64bb3a38f6403386519a39ac91c::");if(d.length==3){var e=a.publicKeyFromString(d[1]),g=a.b64to16(d[2]);return e.verifyString(d[0],g)?{status:"success",plaintext:d[0],signature:"verified",publicKeyString:a.publicKeyString(e)}:{status:"success",plaintext:d[0],signature:"forged",publicKeyString:a.publicKeyString(e)}}else return{status:"success",plaintext:d[0],signature:"unsigned"}};return a}();

