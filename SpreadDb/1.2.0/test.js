/*
  SpreadDbテスト用ソース
    GASの専用シートを用意、本ソースをコピペしてSpreadDbTest()を実行する
*/
const dev = devTools();
function SpreadDbTest() {
  const v = {
    scenario: 'all', start: 8, num: 1,//num=0ならstart以降全部、マイナスならstart無視して後ろから
    whois: `SpreadDbTest`, step: 0, rv: null,
    spread: SpreadsheetApp.getActiveSpreadsheet(),
  };
  // 表示内容の指定。開発時：{step:true}、通しテスト時：{start:false}
  dev.changeOption((v.num === 0 ? { start: false } : { step: true }));
  dev.start(v.whois);
  const src = { // テスト用サンプルデータ
    'ユーザ管理': { // "ユーザ管理"シート(colsのみ)
      cols: [
        { name: 'userId', type: 'string', primaryKey: true }, // ユーザ識別子(primaryKey)
        { name: 'name', type: 'string' },
        { name: 'profile', type: 'string' },
      ],
      set: [{ userId: 10, name: 'fuga', profile: 'a0001' }, { userId: 11, name: 'hoge', profile: 'a0002' }],
    },
    '損益計算書': { // "損益計算書"シート(valuesのみ、先頭ヘッダ行)
      set: [
        ['大', '中', '勘定科目', '一覧存否', 'L1', 'L2', 'SQ', '本籍'],
        ['売上高', '', '', '', 1, '', '', ''],
        ['', '売上高', '', '', 1, 1, '', ''],
        ['', '', '売上高', 22, 1, 1, 1, '貸'],
        ['', '売上原価', '', '', 1, 2, '', ''],
        ['', '', '仕入高', -1, 1, 2, 1, '借'],
        ['', '', '仕入値引高', -1, 1, 2, 2, '借'],
        ['', '', '仕入割戻し高', -1, 1, 2, 3, '借'],
        ['売上総利益', '', '', '', 2, '', '', ''],
        ['', '販売費および一般管理費', '', '', 2, 1, '', ''],
        ['', '', '役員報酬', 35, 2, 1, 1, '借'],
        ['', '', '給料', -1, 2, 1, 2, '借'],
        ['', '', '賞与', -1, 2, 1, 3, '借'],
        ['', '', '退職金', -1, 2, 1, 4, '借'],
        ['', '', '法定福利費', 52, 2, 1, 5, '借'],
        ['', '', '福利厚生費', 57, 2, 1, 6, '借'],
        ['', '', '販売促進費', -1, 2, 1, 7, '借'],
        ['', '', '外注費', 24, 2, 1, 8, '借'],
        ['', '', '広告宣伝費', 29, 2, 1, 9, '借'],
        ['', '', '荷造運賃', -1, 2, 1, 10, '借'],
        ['', '', '会議費', 9, 2, 1, 11, '借'],
        ['', '', '交際費', 8, 2, 1, 12, '借'],
        ['', '', '寄附金', 25, 2, 1, 13, '借'],
        ['', '', '旅費交通費', 40, 2, 1, 14, '借'],
        ['', '', '通信費', 63, 2, 1, 15, '借'],
        ['', '', '新聞図書費', 39, 2, 1, 16, '借'],
        ['', '', '地代家賃', 21, 2, 1, 17, '借'],
        ['', '', '水道光熱費', 48, 2, 1, 18, '借'],
        ['', '', '修繕費', 12, 2, 1, 19, '借'],
        ['', '', '消耗品費', 53, 2, 1, 20, '借'],
        ['', '', '事務用品費', 7, 2, 1, 21, '借'],
        ['', '', '賃借料', -1, 2, 1, 22, '借'],
        ['', '', '支払報酬料', 37, 2, 1, 22, '借'],
        ['', '', '支払手数料', 38, 2, 1, 22, '借'],
        ['', '', '保険料', 11, 2, 1, 23, '借'],
        ['', '', '租税公課', 58, 2, 1, 24, '借'],
        ['', '', '諸会費', 60, 2, 1, 26, '借'],
        ['', '', '雑費', 70, 2, 1, 27, '借'],
        ['', '', '減価償却費', 55, 2, 1, 25, '借'],
        ['', '', '長期前払費用償却', 66, 2, 1, 25, '借'],
        ['営業利益', '', '', '', 3, '', '', ''],
        ['', '営業外収益', '', '', 3, 1, '', ''],
        ['', '', '受取利息', 18, 3, 1, 1, '貸'],
        ['', '', '受取配当金', -1, 3, 1, 2, '貸'],
        ['', '', '有価証券売却益', -1, 3, 1, 3, '貸'],
        ['', '', '有価証券評価益', -1, 3, 1, 4, '貸'],
        ['', '', '為替差益', -1, 3, 1, 5, '貸'],
        ['', '', '雑収入', 33, 3, 1, 6, '貸'],
        ['', '営業外費用', '', '', 3, 2, '', ''],
        ['', '', '支払利息', 36, 3, 2, 1, '借'],
        ['', '', '有価証券評価損', -1, 3, 2, 2, '借'],
        ['', '', '創立費償却', -1, 3, 2, 3, '借'],
        ['', '', '開業費償却', -1, 3, 2, 4, '借'],
        ['', '', '貸倒損失', 6, 3, 2, 5, '借'],
        ['', '', '雑損失', 69, 3, 2, 6, '借'],
        ['経常利益', '', '', '', 4, '', '', ''],
        ['', '特別利益', '', '', 4, 1, '', ''],
        ['', '', '固定資産売却益', 19, 4, 1, 1, '貸'],
        ['', '', '投資有価証券売却益', -1, 4, 1, 2, '貸'],
        ['', '', '貸倒引当金戻入額', -1, 4, 1, 3, '貸'],
        ['', '特別損失', '', '', 4, 2, '', ''],
        ['', '', '固定資産売却損', -1, 4, 2, 1, '借'],
        ['', '', '固定資産除却損', -1, 4, 2, 2, '借'],
        ['', '', '投資有価証券売却損', -1, 4, 2, 3, '借'],
        ['税前利益', '', '', '', 5, '', '', ''],
        ['', '法人税・住民税及び事業税', '', '', 5, 1, '', ''],
        ['', '', '法人税', -1, 5, 1, 1, '借'],
        ['', '', '住民税', -1, 5, 1, 2, '借'],
        ['', '', '事業税', -1, 5, 1, 3, '借'],
        ['', '', '法人税等', 49, 5, 1, 4, '借'],
        ['当期利益', '', '', '', 6, '', '', ''],
        ['', '', '当期利益', 32, 6, '', 1, '借'],
      ],
    },
    'camp2024': { // "camp2024"シート(cols+values)
      cols: [
        { name: 'userId', type: 'number', primaryKey: true },
        { name: 'タイムスタンプ', type: 'string' },
        { name: 'メールアドレス', type: 'string' },
        { name: '申込者氏名', type: 'string' },
        { name: '申込者カナ', type: 'string' },
        { name: '申込者の参加', type: 'string' },
        { name: '宿泊、テント', type: 'string' },
        { name: '引取者氏名', type: 'string' },
        { name: '参加者01氏名', type: 'string' },
        { name: '参加者01カナ', type: 'string' },
        { name: '参加者01所属', type: 'string' },
        { name: '参加者02氏名', type: 'string' },
        { name: '参加者02カナ', type: 'string' },
        { name: '参加者02所属', type: 'string' },
        { name: '参加者03氏名', type: 'string' },
        { name: '参加者03カナ', type: 'string' },
        { name: '参加者03所属', type: 'string' },
        { name: '参加者04氏名', type: 'string' },
        { name: '参加者04カナ', type: 'string' },
        { name: '参加者04所属', type: 'string' },
        { name: '参加者05カナ', type: 'string' },
        { name: '参加者05氏名', type: 'string' },
        { name: '参加者05所属', type: 'string' },
        { name: '緊急連絡先', type: 'string' },
        { name: 'ボランティア募集', type: 'string' },
        { name: '備考', type: 'string' },
        { name: 'キャンセル', type: 'string' },
        { name: 'authority', type: 'string' },
        { name: 'CPkey', type: 'string' },
        { name: 'trial', type: 'string' },
        { name: 'editURL', type: 'string' },
        { name: 'entryTime', type: 'string' },
        { name: 'receptionist', type: 'string' },
        { name: 'fee00', type: 'string' },
        { name: 'fee01', type: 'string' },
        { name: 'fee02', type: 'string' },
        { name: 'fee03', type: 'string' },
        { name: 'fee04', type: 'string' },
        { name: 'fee05', type: 'string' },
        { name: 'memo', type: 'string' },
      ],
      set: [
        ["タイムスタンプ", "メールアドレス", "申込者氏名", "申込者カナ", "申込者の参加", "宿泊、テント", "引取者氏名", "参加者01氏名", "参加者01カナ", "参加者01所属", "参加者02氏名", "参加者02カナ", "参加者02所属", "参加者03氏名", "参加者03カナ", "参加者03所属", "参加者04氏名", "参加者04カナ", "参加者04所属", "参加者05カナ", "参加者05氏名", "参加者05所属", "緊急連絡先", "ボランティア募集", "備考", "キャンセル", "authority", "CPkey", "userId", "trial", "editURL", "entryTime", "receptionist", "fee00", "fee01", "fee02", "fee03", "fee04", "fee05", "memo"],
        ["2024/10/06 19:51:06", "nakairo@gmail.com", "国生　邦浩", "コクショウ　クニヒロ", "スタッフとして申込者のみ参加(おやじの会メンバ)", "宿泊しない", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2", "jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=", "1", "{\"passcode\":920782,\"created\":1728874149915,\"result\":0,\"log\":[{\"timestamp\":1728874165893,\"enterd\":920782,\"status\":1}]}", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnuePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE", "", "", "", "", "", "", "", "", ""],
        ["2024/09/15 12:47:04", "va15r@yahoo.co.jp", "榎田　素直", "エノキダ　スナオ", "参加予定(宿泊なし)", "宿泊しない", "宿泊予定なので不要", "榎田　若菜", "エノキダ　ワカナ", "1年生", "", "", "", "", "", "", "", "", "", "", "", "", "9013357002", "できる", "食事以外でも、お手伝い出来る事があれば。", "", "1", "", "2", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo", "", "", "", "", "", "", "", "", ""],
        ["2024/09/15 13:51:37", "kuke.m4690@gmail.com", "吉野　晃祐", "ヨシノ　コウスケ", "参加予定(宿泊あり)", "宿泊する(テントあり)", "宿泊予定なので不要", "吉野　涼", "ヨシノ　リョウ", "6年生", "", "", "", "", "", "", "", "", "", "", "", "", "", "できる", "", "", "1", "", "3", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk", "", "", "", "", "", "", "", "", ""],
        ["2024/09/15 14:18:02", "naka001@gmail.com", "国生　弘子", "コクショウ　ヒロコ", "参加予定(宿泊なし)", "宿泊しない", "", "国生　悠奈", "コクショウ　ユウナ", "4年生", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2", "k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=", "4", "{\"passcode\":65698,\"created\":1729076868102,\"result\":0,\"log\":[{\"timestamp\":1728729400367,\"enterd\":119192,\"status\":1}]}", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI", "", "", "", "", "", "", "", "", ""],
        ["2024/09/15 18:17:44", "takaki.173@icloud.com", "新田　隆行", "ニッタ　タカユキ", "スタッフとして申込者のみ参加(おやじの会メンバ)", "宿泊しない", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "9086493601", "", "", "", "2", "", "5", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufYUAyvDIMpF5sXyi49ICUvIq8eI73TSfNFSCfRzYvwwNX_f2M5991pGhnh7dHSS0Q", "", "", "", "", "", "", "", "", ""],
        ["2024/10/11 8:55:06", "kafsnxo@cang.jp", "中島　幸典", "ナカジマ　ユキノリ", "不参加", "宿泊する(テントなし)", "宿泊予定なので不要", "中島　楓理", "ナカジマ　フウリ", "5年生", "", "", "", "", "", "", "", "", "", "", "", "", "9035259368", "できる", "", "", "1", "", "6", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufFgoyc-O5e6v8H81HtPrm5LzbPk2h8e8Oy_kWf4_rlguFpTnJoFpJj_9FBPZcEB7o", "", "", "", "", "", "", "", "", ""],
        ["2024/09/16 15:56:10", "o9098431480@gmail.com", "樹原 幸司", "キハラ コウジ", "スタッフとして申込者のみ参加(おやじの会メンバ)", "宿泊する(テントなし)", "宿泊予定なので不要", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2", "clhamUnWtGN6XNQUCwOBstn+69s/iTOgIyf0c52sQHrB7oxSt+fokoL5GhYC1tTO45CJaVrf8jRmd3PwS/UNhGVGH0Q8ePxMN342RETiQJvfiVTHB0rewLK0WWHD4zjxIbyfSoh3p1CBuP1cYlDHn3RS5Nv+NYT0QusxlBT/8i0=", "7", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnufL97OKOOWgne5ttIJyuOkI-i-hvbqB1p-5KP3tMy_1E-FfKl5BRs4W-mvoKZXI4Zo", "", "", "", "", "", "", "", "", ""],
        ["2024/09/16 17:02:23", "sii23@yahoo.co.jp", "友田　精一", "トモダ　セイイチ", "参加予定(宿泊あり)", "宿泊する(テントなし)", "申込者は参加しないが、申込者がお迎えに行く", "友田　悠介", "トモダ　ユウスケ", "5年生", "友田　菜月", "トモダ　ナツキ", "1年生", "友田　綾乃", "トモダ　アヤノ", "保護者", "", "", "", "", "", "", "9065080469", "できる", "", "", "1", "", "8", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudO3FkforwL-KN-e20ZDBFiJdJS5X7mRIC3v1DLx55849cOSOnK0O40lZZkb9dvXMs", "", "", "", "", "", "", "", "", ""],
        ["2024/09/17 12:48:25", "mak15@yahoo.ne.jp", "奥田　誠", "オクダ　マコト", "スタッフとして申込者のみ参加(おやじの会メンバ)", "宿泊しない", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "できる", "毎回お化け屋敷の設置と案内を担当をしています。", "", "2", "gvxvWv/FkdlZu2OYYJNomOvmubs6//pL0ptfQP7s0RtXELkaoRpZv2hX1hAYMbxb1NQ9+l47tm4UrBMZV410fX/C+n087U0mH99DfzHIRHbHoxJf73O5HKl5p2DYv1YMIaDXJQdPMTw1mVyq5ovSyA9krKMhybLVFQxZlLdT1Q0=", "9", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnueez5HR3gku37_CBxNV0sVK4fc6cP4IzX2sdO4nRS31NKDv-dGucV8-eEnPY2AvMAQ", "", "", "", "", "", "", "", "", ""],
        ["2024/09/17 14:56:11", "sny.mae510@gmail.com", "名越　裕香", "ナゴシ　ユカ", "参加予定(宿泊あり)", "宿泊する(テントあり)", "宿泊予定なので不要", "名越　優芽乃", "ナゴシ　ユメノ", "1年生", "名越　亮", "ナゴシ　リョウ", "保護者", "名越　優翔", "ナゴシ　ユウト", "未就学児", "", "", "", "", "", "", "8011376989", "", "", "", "1", "", "10", "", "https://docs.google.com/forms/d/e/viewform?edit2=2_ABaOnudOb6qOXKHbDi0l5dy9YRsFQVGI7lDmjU39r_485CMkdeAYQuxt4HWmfMpHQD37fUs", "", "", "", "", "", "", "", "", ""]
      ],
    },
    '掲示板': {
      set: [
        ['timestamp', 'from', 'to', 'message'],
        ['2022-10-27T05:45:35.101Z', 'パパ', 'スタッフ全員', 'テスト\n改行\nしてみたぞ'],
        ['2022-10-27T06:23:43.168Z', 'パパ', '本部', 'ご本部様\nご機嫌麗しく...'],
        ['2022-10-27T07:24:24.216Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-10-27T07:25:59.339Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-10-27T07:34:46.564Z', 'パパ', 'スタッフ全員', 'ぼけ'],
        ['2022-10-27T07:43:00.743Z', '(未定義)', 'スタッフ全員', '新規投稿'],
        ['2022-10-27T07:57:16.144Z', '(未定義)', 'スタッフ全員', 'ほれほれ'],
        ['2022-10-27T08:05:03.631Z', 'パパ', '金魚すくい担当', 'by みゆきさま'],
        ['2022-10-27T08:49:32.196Z', '屋上テラス', '射的担当', '今日も都庁がよく見える。\n特に意味はない。\nホントだよ'],
        ['2022-10-27T10:09:54.791Z', '右に空白', 'スタッフ全員', 'textareaの幅がおかしい\n'],
        ['2022-10-27T16:02:50.217Z', 'ぱぱ', '校内探検担当', '目が覚めた…\nもっかい寝よ'],
        ['2022-10-28T03:02:59.374Z', 'パパ', 'スタッフ全員', '見えた？'],
        ['2022-10-28T03:03:10.982Z', 'まま', 'カレー担当', '玉ねぎは薄切り希望'],
        ['2022-10-28T05:56:15.199Z', '(未定義)', 'スタッフ全員', 'てすと'],
        ['2022-10-28T08:35:49.937Z', '嶋津', 'スタッフ全員', 'さて、名前が保存されてるかな？'],
        ['2022-10-28T08:36:15.515Z', '嶋津', 'スタッフ全員', 'されてた❤'],
        ['2022-11-01T05:49:34.454Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-11-01T06:10:05.150Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-11-01T06:15:23.668Z', '嶋津ぱぱ', '受付担当', 'トイレ行きたい\n誰か来て'],
        ['2022-11-08T01:50:28.670Z', 'パパ', 'スタッフ全員', 'とうこう！'],
        ['2022-11-09T04:48:51.137Z', 'ぱぱ', '校内探検担当', '下校中の小学生、\n元気だなぁ'],
        ['2022-11-11T08:36:17.409Z', '', 'スタッフ全員', 'append getMessages'],
        ['2022-12-06T07:11:41.330Z', 'しまづパパ', 'スタッフ全員', 'てすと'],
        ['2022-12-06T07:18:34.254Z', '嶋津ぱぱ', '金魚すくい担当', '天気晴朗なれど波高し'],
        ['2022-12-12T06:43:53.951Z', '嶋津ぱぱ', '本部', '誤本部様におかれてはご機嫌麗しく。'],
        ['2022-12-13T03:02:05.554Z', '嶋津ぱぱ', 'スタッフ全員', '2022-12-13T03:00:00.000Z'],
        ['2022-12-13T06:05:51.111Z', '嶋津ぱぱ', 'スタッフ全員', 'ひとごーまるご'],
        ['2022-12-13T06:35:40.506Z', '嶋津ぱぱ', 'スタッフ全員', 'ひとごーさんよん'],
        ['2022-12-23T07:21:21.888Z', '嶋津ぱぱ', '校内探検担当', 'わるいごは　いねが〜\nカチャトーラには ビネガ〜'],
        ['2022-12-23T07:43:46.676Z', '嶋津ぱぱ', 'スタッフ全員', 'こうしんてすと'],
        ['2022-12-27T06:32:25.407Z', '嶋津ぱぱ', 'スタッフ全員', '強制遷移抑止テスト'],
        ['2022-12-28T03:26:55.850Z', 'システム', 'テスタ', '2022-12-28T03:26:55.881Z'],
        ['2023-01-20T08:41:22.368Z', 'shimazu', 'スタッフ全員', 'Hello, world.'],
        ['2023-01-21T03:45:35.480Z', 'tester', 'スタッフ全員', '2023-01-21T03:45:00.000Z'],
        ['2023-01-21T04:08:05.240Z', 'しまづぱぱ', 'スタッフ全員', '2023-01-21T04:08:00.000Z'],
        ['2023-01-21T07:17:52.425Z', 'はんどるねえむ', 'スタッフ全員', '2023-01-21T07:17:00.000Z'],
        ['2023-01-21T08:07:47.800Z', '220.144.110.83', 'スタッフ全員', ''],
        ['2023-01-22T03:27:26.860Z', '119.240.42.100', 'スタッフ全員', 'ふがほげ'],
        ['2023-01-25T07:45:16.307Z', '220.144.109.231', 'スタッフ全員', 'あいうえお'],
        ['2023-01-25T07:59:10.794Z', '220.144.109.231', 'スタッフ全員', 'かきくけこ'],
        ['2023-01-25T08:12:22.362Z', '220.144.109.231', 'スタッフ全員', 'さしすせそ'],
        ['2023-01-25T23:46:08.402Z', '半弗　値絵夢', 'スタッフ全員', 'たちつてと'],
        ['2023-01-26T00:16:10.868Z', 'しまづぱぱ', 'スタッフ全員', 'なにぬねの'],
        ['2023-01-26T00:19:03.669Z', 'しまづぱぱ', 'スタッフ全員', 'はひふへほ'],
        ['2023-01-26T00:31:22.382Z', 'しまづ', 'スタッフ全員', 'はひふへほ'],
        ['2023-01-26T00:39:44.432Z', '嶋津', 'スタッフ全員', 'まみむめも'],
        ['2023-01-30T06:13:30.312Z', '水戸黄門', 'スタッフ全員', '控えおろうっ！'],
        ['2023-01-31T05:42:42.836Z', '手簾戸', 'スタッフ全員', '投稿140'],
        ['2023-02-01T01:17:45.584Z', 'てすと', 'スタッフ全員', '全員に配信テスト(before Broad.gs deploy)'],
        ['2023-02-01T01:46:23.398Z', 'てすと', 'スタッフ全員', 'スタッフに配信テスト'],
        ['2023-02-01T01:53:49.358Z', 'てすと', '本部', '参加者のみに配信テスト'],
        ['2023-02-01T01:54:20.596Z', 'てすと', '本部', 'スタッフ・参加者両方に配信'],
        ['2023-02-03T07:54:05.432Z', 'しまづパパ', 'スタッフ全員', 'きょうのてすと'],
        ['2023/02/09 15:18:27', 'しまづパパ', 'スタッフ全員', '129'],
        ['2023/02/10 15:27:38', '嶋津パパ', 'スタッフ全員', 'r.1.4.4、リリースしました'],
      ],
    },
    'AutoInc': {
      cols: [
        { name: 'pKey', auto_increment: 10, primaryKey: true },
        { name: 'ラベル', type: 'string', unique: true },
        { name: 'ぬる', auto_increment: null },
        { name: '真', auto_increment: true },
        { name: '偽', auto_increment: false },
        { name: '配列①', auto_increment: [20] },
        { name: '配列②', auto_increment: [30, -1] },
        { name: 'obj', auto_increment: { start: 40, step: 5 } },
        { name: 'def関数', default: "o => {return toLocale(new Date())}" },
      ],
      set: [{ 'ラベル': 'fuga' }, { 'ラベル': 'hoge' }],
    },
    'Duplicate': {  // 初期値でunique(primaryKey)項目に重複値が存在
      cols: [
        { name: 'pKey', auto_increment: 10, primaryKey: true },
        { name: 'Col1', type: 'number', unique: true },
        { name: 'Col2', type: 'number' },
      ],
      set: [{ Col1: 11, Col2: 12 }, { Col1: 11, Col2: 22 }],  // Col1が重複
    },
  };
  const scenario = {  // テストシナリオ
    create: [ // create関係のテスト群
      { // 0.正常系
        setup: null, // 全シート強制削除
        query: [
          { command: 'create', table: 'ユーザ管理', cols: src['ユーザ管理'].cols },  // 「ユーザ管理」シート作成
          { command: 'create', table: 'AutoInc', cols: src['AutoInc'].cols, set: src['AutoInc'].set },  // 「AutoInc」シート作成
          { command: 'create', table: 'camp2024', cols: src['camp2024'].cols, set: src['camp2024'].set },  // 「camp2024」シート作成
          { command: 'create', table: '掲示板', set: src['掲示板'].set },  // 「掲示板」シート作成
          { command: 'create', table: '損益計算書', set: src['損益計算書'].set },  // 「損益計算書」シート作成
        ],
        opt: { userId: 'Administrator' },
        check: [  // 戻り値から判断できる終了状態を定義
          { "table": "ユーザ管理", qSts: 'OK', num: 0 },
          { "table": "AutoInc", qSts: 'OK', num: 2 },
          { "table": "camp2024", qSts: 'OK', num: 10 },
          { "table": "掲示板", qSts: 'OK', num: 55 },
          { "table": "損益計算書", qSts: 'OK', num: 71 },
        ],
      }, { // 1.初期値のunique項目で重複値が存在
        setup: null,
        query: { command: 'create', table: 'Duplicate', cols: src['Duplicate'].cols, set: src['Duplicate'].set },
        opt: { userId: 'Administrator' },
        check: [{ "table": "Duplicate", qSts: 'Duplicate', num: 1, result: [{ rSts: 'OK' }, { rSts: 'Duplicate' }] }],
      }, { // 2.既存シートの新規作成指示 ⇒ qSts[0]='OK', qSts[1]='Already Exist'
        setup: null,
        query: [
          { command: 'create', table: 'camp2024', cols: src['camp2024'].cols, set: src['camp2024'].set },  // 「camp2024」シート作成
          { command: 'create', table: 'camp2024', cols: src['camp2024'].cols, set: src['camp2024'].set },  // 「camp2024」シート作成
        ],
        opt: { userId: 'Administrator' },
        check: [
          { "table": "camp2024", qSts: 'OK', num: 10 },
          { "table": "camp2024", qSts: 'Already Exist', num: 0 },
        ],
      }, { // 3.colsもsetも指定無し ⇒ qSts='No cols and data'
        setup: null,
        query: { command: 'create', table: 'Duplicate' },
        opt: { userId: 'Administrator' },
        check: [{ "table": "Duplicate", qSts: 'No cols and data', num: 0 }],
      }, { // 4.userId未指定 ⇒ qSts='No Authority'
        setup: null,
        query: { command: 'create', table: 'ユーザ管理', cols: src['ユーザ管理'].cols },  // 「ユーザ管理」シート作成
        // optは指定しない(ユーザ未定)
        check: [{ "table": "ユーザ管理", qSts: 'No Authority', num: 0 }],
      }, { // 5.管理者以外 ⇒ qSts='No Authority'
        setup: null,
        query: { command: 'create', table: 'ユーザ管理', cols: src['ユーザ管理'].cols },  // 「ユーザ管理」シート作成
        opt: { userId: 'fuga' },
        check: [{ "table": "ユーザ管理", qSts: 'No Authority', num: 0 }],
      },
    ],
    select: [ // select関係のテスト群(＋全体共通テスト)
      { // 0.正常系
        setup: { '掲示板': false },
        query: [
          { table: '掲示板', command: 'select', where: "o=>{return o.from=='パパ'}" },
          // 日付の比較では"new Date()"を使用。ちなみにgetTime()無しで比較可能
          { table: '掲示板', command: 'select', where: "o=>{return new Date(o.timestamp) < new Date('2022/11/1')" },
        ],
        opt: { userId: 'Administrator' },
        check: [
          { "table": "掲示板", qSts: 'OK', num: 6, result: r => { return r.length !== 6 ? false : r.every(x => x.from === 'パパ') } },
          { "table": "掲示板", qSts: 'OK', num: 16, result: r => { return r.length !== 16 ? false : r.every(x => new Date(x.timestamp) < new Date('2022/11/1')) } },
        ],
      }, { // 1.ゲストに「掲示板」の読込を許可 ⇒ qSts='OK'
        setup: { '掲示板': false },
        query: { table: '掲示板', command: 'select', where: "o=>{return o.from=='パパ'}" }, // 「掲示板」を参照
        opt: { guestAuth: { '掲示板': 'r' } },  // userId指定無し(⇒ゲスト)でゲストに掲示板の読込権限付与
        check: [{ "table": "掲示板", qSts: 'OK', num: 6, result: r => { return r.length !== 6 ? false : r.every(x => x.from === 'パパ') } }],
      }, { // 2.ゲストに「掲示板」の読込を不許可 ⇒ qSts='No Authority'
        setup: { '掲示板': false },
        query: { table: '掲示板', command: 'select', where: "o=>{return o.from=='パパ'}" }, // 「掲示板」を参照
        // ゲストなので、ユーザID,権限指定は無し
        check: [{ "table": "掲示板", qSts: 'No Authority', num: 0 }],
      }, { // 3.存在しないテーブルを指定 ⇒ qSts='No Table'
        query: { table: '存在しないテーブル', command: 'select', where: "o=>{return o.from=='パパ'}" },
        opt: {},  // ゲストなので、ユーザID,権限指定は無し
        check: [{ "table": "存在しないテーブル", qSts: 'No Table', num: 0 }],
      }, { // 4.権限'o'で自レコード取得 ⇒ qSts='OK'
        setup: { 'ユーザ管理': true },
        query: { table: 'ユーザ管理', command: 'select', where: 10 },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "ユーザ管理", qSts: 'OK', num: 1 }],
      }, { // 5.権限'o'で自レコード以外の取得 ⇒ qSts='No Authority'
        setup: { 'ユーザ管理': false },
        query: { table: 'ユーザ管理', command: 'select', where: 11 },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "ユーザ管理", qSts: 'No Authority', num: 0 }],
      }, { // 6.table指定無し ※select以外も含む、全体テスト
        setup: { 'ユーザ管理': false },
        query: { command: 'select', where: 11 },
        opt: { userId: 'Administrator' },
        check: [{ qSts: 'No Table name', num: 0, result: [] }],
      }, { // 7.command指定無し ※select以外も含む、全体テスト
        setup: { 'ユーザ管理': false },
        query: { table: 'ユーザ管理', where: 11 },
        opt: { userId: 'Administrator' },
        check: [{ qSts: 'No command', num: 0, result: [] }],
      }
    ],
    append: [
      { // 0.正常系
        setup: { 'AutoInc': true },
        query: [
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a01' } },
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a02' } }, // 1レコードずつ一括
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },  // setが配列
        ],
        opt: { userId: 'Administrator' },
        // 以下について、シート上で確認のこと。
        // auto_increment指定の確認 : ぬる・真・偽・配列①・配列②・obj
        // default指定の確認 : def関数
        check: [{
          "table": "AutoInc", qSts: 'OK', num: 1, result: [{
            rSts: 'OK',
            pKey: 12, // = auto_increment:10 + 初期データ2行
            diff: { // diffはJSON文字列だが、オブジェクトとして記述
              '真': 3, // = auto_increment:true + 初期データ2行
              '配列①': 22, // = auto_increment:[20] + 初期データ2行
              '配列②': 28, // = auto_increment:[30,-1] + 初期データ2行
              'obj': 50, // = auto_increment:{start:40,step:5} + 初期データ2行
              'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000
            }
          }]
        }, {
          "table": "AutoInc", qSts: 'OK', num: 1, result: [
            { rSts: 'OK', pKey: 13, diff: { '真': 4, '配列①': 23, '配列②': 27, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
          ]
        }, {
          "table": "AutoInc", qSts: 'OK', num: 2, result: [
            { rSts: 'OK', pKey: 14, diff: { '真': 5, '配列①': 24, '配列②': 26, 'obj': 60, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
            { rSts: 'OK', pKey: 15, diff: { '真': 6, '配列①': 25, '配列②': 25, 'obj': 65, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
          ]
        }],
      }, { // 1."unique=true"項目「ラベル」に重複値を指定して追加 ⇒ Duplicate
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: [
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a01' } },  // qSts='OK', rSts[0]='OK'
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a01' } },  // qSts='OK', rSts[0]='Duplicate'
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a02' }, { 'ラベル': 'a02' }] }, // qSts='OK', rSts=[OK, Duplicate]
        ],
        opt: { userId: 'Administrator' },
        check: [{
          "table": "AutoInc", qSts: 'OK', num: 1, result: [{
            rSts: 'OK',
            pKey: 12, // = auto_increment:10 + 初期データ2行
            diff: { // diffはJSON文字列だが、オブジェクトとして記述
              '真': 3, // = auto_increment:true + 初期データ2行
              '配列①': 22, // = auto_increment:[20] + 初期データ2行
              '配列②': 28, // = auto_increment:[30,-1] + 初期データ2行
              'obj': 50, // = auto_increment:{start:40,step:5} + 初期データ2行
              'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000
            }
          }]
        }, {
          "table": "AutoInc", qSts: 'OK', num: 0, result: [
            { rSts: 'Duplicate' },
          ]
        }, {
          "table": "AutoInc", qSts: 'OK', num: 1, result: [
            {
              rSts: 'OK', pKey: 14, // 本来pKey=13だが、前query時にschema.auto_incrementが+1され戻していないため、14になる
              diff: { '真': 4, '配列①': 23, '配列②': 27, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 }
            },
            { rSts: 'Duplicate', },
          ]
        }],
      }, { // 2.権限付与してゲストが実行 ⇒ qSts='OK',rSts=[OK,OK]
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },
        opt: { guestAuth: { AutoInc: 'w' } },
        check: [{
          "table": "AutoInc", qSts: 'OK', num: 2, result: [{
            rSts: 'OK',
            pKey: 12, // = auto_increment:10 + 初期データ2行
            diff: { // diffはJSON文字列だが、オブジェクトとして記述
              '真': 3, // = auto_increment:true + 初期データ2行
              '配列①': 22, // = auto_increment:[20] + 初期データ2行
              '配列②': 28, // = auto_increment:[30,-1] + 初期データ2行
              'obj': 50, // = auto_increment:{start:40,step:5} + 初期データ2行
              'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000
            }
          }, {
            rSts: 'OK',
            pKey: 13, // = auto_increment:10 + 初期データ2行
            diff: { '真': 4, '配列①': 23, '配列②': 27, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 }
          }]
        }],
      }, { // 3.権限付与せずゲストが実行 ⇒ qSts='No Authority'
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },
        opt: { guestAuth: { AutoInc: 'r' } },
        check: [{ "table": "AutoInc", qSts: 'No Authority', num: 0, result: [] }],
      }, { // 4.権限付与してユーザが実行 ⇒ qSts='OK',rSts=[OK,OK]
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },
        opt: { userId: 10, userAuth: { AutoInc: 'w' } },
        check: [{
          "table": "AutoInc", qSts: 'OK', num: 2, result: [
            { rSts: 'OK', pKey: 12, diff: { '真': 3, '配列①': 22, '配列②': 28, 'obj': 50, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
            { rSts: 'OK', pKey: 13, diff: { '真': 4, '配列①': 23, '配列②': 27, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
          ]
        }],
      }, { // 5.権限付与せずユーザが実行 ⇒ qSts='No Authority'
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },
        opt: { userId: 10, userAuth: { AutoInc: 'r' } },
        check: [{ "table": "AutoInc", qSts: 'No Authority', num: 0, result: [] }],
      }, { // 6.存在しないテーブルへの追加 ⇒ qSts=['No Table','No Table','No Table']
        setup: { 'AutoInc': null },  // AutoIncは強制削除
        query: [
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a01' } },
          { table: 'AutoInc', command: 'append', set: { 'ラベル': 'a02' } }, // 1レコードずつ一括
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },  // setが配列
        ],
        opt: { userId: 'Administrator' },
        check: [
          { "table": "AutoInc", qSts: 'No Table', num: 0, result: [] },
          { "table": "AutoInc", qSts: 'No Table', num: 0, result: [] },
          { "table": "AutoInc", qSts: 'No Table', num: 0, result: [] },
        ],
      }, { // 7.権限'o'のユーザが実行 ⇒ qSts='No Authority'
        setup: { 'AutoInc': true },  // AutoIncはテスト前に再作成
        query: { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a03' }, { 'ラベル': 'a04' }] },
        opt: { userId: 10, userAuth: { AutoInc: 'o' } },
        check: [{ "table": "AutoInc", qSts: 'No Authority', num: 0, result: [] }],
      }, { // 8.appendでsetが空
        setup: { 'AutoInc': true },
        query: [
          { table: 'AutoInc', command: 'append' }, // set自体無し
          { table: 'AutoInc', command: 'append', set: {} }, // 項目無し ⇒ 既定値でレコード追加
          { table: 'AutoInc', command: 'append', set: [] },  // setが空配列
        ],
        opt: { userId: 'Administrator' },
        check: [
          { "table": "AutoInc", qSts: 'Empty set', num: 0 },
          { "table": "AutoInc", qSts: 'OK', num: 1, result: [{ pKey: 12 }] },
          { "table": "AutoInc", qSts: 'Empty set', num: 0 },
        ]
      }
    ],
    delete: [
      { // 0.正常系 ⇒ pKey=10の行のみ残っていればOK
        setup: { 'AutoInc': true },
        query: [
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a01', '配列①': -1 }, { 'ラベル': 'a02', '配列②': -2 }, { 'ラベル': 'a03' }] },
          { table: 'AutoInc', command: 'delete', where: { '配列①': -1 } },  // where = Object
          { table: 'AutoInc', command: 'delete', where: o => { return o['配列②'] === -2 } },  // where = function
          { table: 'AutoInc', command: 'delete', where: 11 },  // where = any(pKey)
          { table: 'AutoInc', command: 'delete', where: 'o => {return o["ラベル"].slice(0,1)==="a"' },  // where = string(func)
        ],
        opt: { userId: 'Administrator' },
        check: [
          {
            "table": "AutoInc", command: 'append', qSts: 'OK', num: 3, result: [
              { pKey: 12, rSts: 'OK', diff: { '真': 3, '配列①': -1, '配列②': 28, 'obj': 50, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
              { pKey: 13, rSts: 'OK', diff: { '真': 4, '配列①': 22, '配列②': -2, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
              { pKey: 14, rSts: 'OK', diff: { '真': 5, '配列①': 23, '配列②': 27, 'obj': 60, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
            ]
          },
          { "table": "AutoInc", command: 'delete', qSts: 'OK', num: 1, result: [{ rSts: 'OK', diff: { '配列①': -1 } }] },
          { "table": "AutoInc", command: 'delete', qSts: 'OK', num: 1, result: [{ rSts: 'OK', diff: { '配列②': -2 } }] },
          { "table": "AutoInc", command: 'delete', qSts: 'OK', num: 1, result: [{ rSts: 'OK', diff: { pKey: 11 } }] },
          { "table": "AutoInc", command: 'delete', qSts: 'OK', num: 1, result: [{ rSts: 'OK', diff: { 'ラベル': 'a03' } }] },
        ],
      }, { // 1.該当レコード無し ⇒ qSts='OK',num=0
        setup: { 'AutoInc': true },
        query: [
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a01', '配列①': -1 }, { 'ラベル': 'a02', '配列②': -2 }, { 'ラベル': 'a03' }] },
          { table: 'AutoInc', command: 'delete', where: 99 },  // where = any(pKey)
        ],
        opt: { userId: 'Administrator' },
        check: [
          {
            "table": "AutoInc", command: 'append', qSts: 'OK', num: 3, result: [
              { pKey: 12, rSts: 'OK', diff: { '真': 3, '配列①': -1, '配列②': 28, 'obj': 50, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
              { pKey: 13, rSts: 'OK', diff: { '真': 4, '配列①': 22, '配列②': -2, 'obj': 55, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
              { pKey: 14, rSts: 'OK', diff: { '真': 5, '配列①': 23, '配列②': 27, 'obj': 60, 'def関数': o => (new Date().getTime() - new Date(o).getTime()) < 180000 } },
            ]
          },
          { "table": "AutoInc", command: 'delete', qSts: 'OK', num: 0 },
        ],
      }, { // 2.権限付与してユーザが実行 ⇒ qSts='OK', num=1, rSts=['OK']
        setup: { 'AutoInc': true },
        query: { table: 'AutoInc', command: 'delete', where: 10 },  // where = any(pKey)
        opt: { userId: 10, userAuth: { AutoInc: 'd' } },
        check: [{ "table": "AutoInc", command: 'delete', qSts: 'OK', num: 1, result: [{ pKey: 10, rSts: 'OK' }] }],
      }, { // 3.権限付与せずユーザが実行 ⇒ qSts='No Authority', num=0
        setup: { 'AutoInc': true },
        query: { table: 'AutoInc', command: 'delete', where: 10 },  // where = any(pKey)
        opt: { userId: 10, userAuth: { AutoInc: 'r' } },
        check: [{ "table": "AutoInc", command: 'delete', qSts: 'No Authority', num: 0 }],
      }, { // 4.存在しないテーブルでの削除 ⇒ qSts='No Table', num=0
        query: { table: '不在テーブル', command: 'delete', where: 10 },  // where = any(pKey)
        opt: { userId: 'Administrator' },
        check: [{ "table": "不在テーブル", command: 'delete', qSts: 'No Table', num: 0 }],
      }, { // 5.権限'o'のユーザが実行 ⇒ qSts='No Authority', num=0
        setup: { 'AutoInc': true },
        query: { table: 'AutoInc', command: 'delete', where: 10 },  // where = any(pKey)
        opt: { userId: 10, userAuth: { AutoInc: 'o' } },
        check: [{ "table": "AutoInc", command: 'delete', qSts: 'No Authority', num: 0 }],
      },
    ],
    update: [
      { // 0.正常系
        setup: { 'AutoInc': true },
        query: [
          { table: 'AutoInc', command: 'append', set: [{ 'ラベル': 'a01' }, { 'ラベル': 'a02' }, { 'ラベル': 'a03' }, { 'ラベル': 'a04' }, { 'ラベル': 'a05' }] },
          // 関数
          { command: 'update', table: 'AutoInc', where: o => { return o['ラベル'] === 'a01' }, set: () => { return { 'ラベル': 'b01' } } },
          // オブジェクト
          { command: 'update', table: 'AutoInc', where: { 'ラベル': 'a02' }, set: { 'ぬる': 'b02' } },
          { command: 'update', table: 'AutoInc', where: { key: 'ラベル', value: 'a03' }, set: { '真': 'b03' } },
          // 文字列(関数)
          { command: 'update', table: 'AutoInc', where: "o=>{return o['ラベル']==='a04'}", set: "()=>{return {'偽':'b04'}}" },
          // 文字列(非関数。where:主キーの値, set:JSON)
          { command: 'update', table: 'AutoInc', where: 16, set: JSON.stringify({ '配列①': 'b05' }) },
        ],
        opt: { userId: 'Administrator' },
        check: [
          { "table": "AutoInc", command: 'append', qSts: 'OK', num: 5 },
          { "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 12, rSts: 'OK', diff: { 'ラベル': ['a01', 'b01'] } }] },
          { "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 13, rSts: 'OK', diff: { 'ぬる': [null, 'b02'] } }] },
          { "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 14, rSts: 'OK', diff: { '真': [5, 'b03'] } }] },
          { "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 15, rSts: 'OK', diff: { '偽': [null, 'b04'] } }] },
          { "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 16, rSts: 'OK', diff: { '配列①': [26, 'b05'] } }] },
        ],
      }, { // 1.該当レコード無し ⇒ qSts='OK',num=0
        setup: { 'AutoInc': true },
        query: { command: 'update', table: 'AutoInc', where: { 'ラベル': 'xxx' }, set: { 'ぬる': 'b02' } },
        opt: { userId: 'Administrator' },
        check: [{ "table": "AutoInc", command: 'update', qSts: 'OK', num: 0 }],
      }, { // 2.更新対象項目が存在しない ⇒ qSts='Undefined Column', num=0
        setup: { 'AutoInc': true },
        query: { command: 'update', table: 'AutoInc', where: { 'ラベル': 'fuga' }, set: { 'xxx': 123 } },
        opt: { userId: 'Administrator' },
        check: [{ "table": "AutoInc", command: 'update', qSts: 'Undefined Column', num: 0 }],
      }, { // 3.自レコードのみの更新権限で自レコードを更新 ⇒ qSts='OK'
        setup: { 'ユーザ管理': true },
        query: { command: 'update', table: 'ユーザ管理', where: 10, set: { profile: 'xxx' } },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "AutoInc", command: 'update', qSts: 'OK', num: 1, result: [{ pKey: 10, rSts: 'OK', diff: { profile: ['a0001', 'xxx'] } }] }],
      }, { // 4.自レコードのみの更新権限で自レコードを更新だが、where句を関数で指定 ⇒ qSts='Invalid where clause'
        setup: { 'ユーザ管理': true },
        query: { command: 'update', table: 'ユーザ管理', where: () => 10, set: { profile: 'xxx' } },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "ユーザ管理", command: 'update', qSts: 'Invalid where clause', num: 0 }],
      }, { // 5.自レコードのみの更新権限で自レコードを更新だが、where句をオブジェクトで指定 ⇒ qSts='Invalid where clause'
        setup: { 'ユーザ管理': true },
        query: { command: 'update', table: 'ユーザ管理', where: { userId: 10 }, set: { profile: 'xxx' } },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "ユーザ管理", command: 'update', qSts: 'Invalid where clause', num: 0 }],
      }, { // 6.自レコードのみの更新権限で自レコード以外を更新 ⇒ qSts='No Authority'
        setup: { 'ユーザ管理': true },
        query: { command: 'update', table: 'ユーザ管理', where: 11, set: { profile: 'xxx' } },
        opt: { userId: 10, userAuth: { 'ユーザ管理': 'o' } },
        check: [{ "table": "ユーザ管理", command: 'update', qSts: 'No Authority', num: 0 }],
      }, { // 7.存在しないテーブルでの更新 ⇒ No Table
        setup: { 'ユーザ管理': true },
        query: { command: 'update', table: 'ふが', where: 10, set: { profile: 'xxx' } },
        opt: { userId: 'Administrator' },
        check: [{ "table": "ふが", command: 'update', qSts: 'No Table', num: 0 }],
      },
    ],
    schema: [
      { // 0.正常系
        setup: { 'ユーザ管理': false, '損益計算書': false },
        query: { command: 'schema', table: 'ユーザ管理' },
        opt: { userId: 'Administrator' },
        check: [{ "table": "ユーザ管理", command: 'schema', qSts: 'OK', num: 3 }],
      }, { // 1.該当テーブル無し ⇒ qSts='No Table',num=0
        setup: { 'ユーザ管理': false, '損益計算書': false },
        query: { command: 'schema', table: 'ふが' },
        opt: { userId: 'Administrator' },
        check: [{ "table": "ふが", command: 'schema', qSts: 'No Table', num: 0 }],
      }, { // 2.権限付与してユーザが実行 ⇒ OK
        setup: { 'ユーザ管理': false, '損益計算書': false },
        query: { command: 'schema', table: 'ユーザ管理' },
        opt: { userId: 'pikumin', userAuth: { 'ユーザ管理': 's' } },
        check: [{ "table": "ユーザ管理", command: 'schema', qSts: 'OK', num: 3 }],
      }, { // 3.権限付与せずユーザが実行 ⇒ No Authority
        setup: { 'ユーザ管理': false, '損益計算書': false },
        query: { command: 'schema', table: 'ユーザ管理' },
        opt: { userId: 'pikumin', userAuth: { 'ユーザ管理': '' } },
        check: [{ "table": "ユーザ管理", command: 'schema', qSts: 'No Authority', num: 0 }],
      },
      // シート上でシート上のメモを修正後、その修正が反映されているかの確認
    ],
  };
  function setupSheet(arg = undefined) { /** テスト対象シートの再作成
   * 引数argのメンバ名(=srcのメンバ)を対象シートとして以下を実施。
   * - true: 強制的に再作成
   * - false: 不在なら作成、存在なら再作成しない(不在時作成)
   * - null: 強制削除。存在していれば削除、再作成はしない
   * - undefined: 何もしない(既定値)
   * 引数argがオブジェクトではない場合、全シート対象に上記処理を行う。
   */
    console.log(`setupSheet start: arg=${JSON.stringify(arg)}`);
    if (arg === undefined) {
      console.log(`setupSheet normal end: arg=undefined`);
      return null;
    };

    v.step = 0.1; // 対象シートのリストアップ
    v.list = arg === null
      ? v.spread.getSheets().map(x => x.getName())  // 全シート強制削除なら存在する全シート
      : (typeof arg === 'boolean' ? Object.keys(src) // 全シート対象(真偽値)なら定義されているテスト用全シート
        : Object.keys(arg));  // 全シート対象ではない場合、指定シート名

    v.step = 0.2; // readmeは削除対象から外す
    v.i = v.list.findIndex(x => x === 'readme');
    if (v.i >= 0) v.list.splice(v.i, 1);

    for (v.i = 0; v.i < v.list.length; v.i++) {

      v.step = 0.3; // シート名と処理(真偽値)を特定
      v.key = v.list[v.i];
      v.value = (arg === null || typeof arg === 'boolean') ? arg : arg[v.key];
      v.exist = v.spread.getSheetByName(v.key) === null ? false : true;

      v.step = 0.4; // シートが存在し、強制再作成または強制削除なら削除
      if (v.exist === true && (v.value === true || v.value === null)) {
        v.sheet = v.spread.getSheetByName(v.key);
        v.spread.deleteSheet(v.sheet);
        console.log(`setupSheet: "${v.key}" is deleted.`);
      }

      v.step = 0.5; // 強制再作成、または存在しなければ作成
      if (v.value === true || v.exist === false && v.value === false) {
        v.r = SpreadDb({  // 対象シート作成
          command: 'create',
          table: v.key,
          cols: (src[v.key].cols || null),
          set: (src[v.key].set || null),
        }, { userId: 'Administrator' });
        if (v.r instanceof Error) return v.r;
        console.log(`setupSheet: append "${v.key}"`);
      }
    }
    console.log(`setupSheet normal end: arg=${JSON.stringify(arg)}`);
    return null;
  };
  try {

    dev.step(1);  // scenario='setup'なら初期化のみ実行
    if (v.scenario === 'setup') {
      setupSheet(null);
      return null;
    }

    dev.step(2);  // v.scenarioに対象シナリオ群を格納
    if (v.scenario === 'all') {
      setupSheet(null);
      v.scenario = Object.keys(scenario);
      v.start = 0;
      v.num = 0;
      dev.changeOption({ start: false, step: false });
    } else {
      if (!Array.isArray(v.scenario)) v.scenario = [v.scenario];
    }

    dev.step(3);
    for (v.sno = 0; v.sno < v.scenario.length; v.sno++) {

      dev.step(4); // v.st, v.edを計算
      if (v.num < 0) {
        dev.step(4.1); // 指定テストパターン群の後ろからv.num個
        v.st = scenario[v.scenario[v.sno]].length + v.num;
        v.ed = scenario[v.scenario[v.sno]].length;
      } else if (v.num === 0) {
        dev.step(4.2); // 指定テストパターン群全部実行
        v.st = v.start;
        v.ed = scenario[v.scenario[v.sno]].length;
      } else {
        dev.step(4.3); // v.startからv.num個
        v.st = v.start;
        v.ed = v.start + v.num;
      }

      dev.step(5);
      for (v.idx = v.st; v.idx < v.ed; v.idx++) {

        dev.step(5.1); // シートの準備
        v.setup = scenario[v.scenario[v.sno]][v.idx].setup || {};
        v.setup.log = v.sno === 0 && v.idx === v.st ? null : false;  // テスト開始時はlog削除、それ以外は追記にする
        v.r = setupSheet(v.setup);
        if (v.r instanceof Error) throw v.r;

        dev.step(5.2); // scenarioからqueryとoptをセットしてテスト実施、NG時は中断
        if (false === dev.check({
          asis: SpreadDb(
            scenario[v.scenario[v.sno]][v.idx].query,
            scenario[v.scenario[v.sno]][v.idx].opt
          ),
          tobe: (scenario[v.scenario[v.sno]][v.idx].check || undefined),
          title: `${v.whois}.${v.scenario[v.sno]}.${v.idx}`,
        })) throw new Error(`check NG`);
      }
    }

  } catch (e) {
    dev.error(e);
    return e;
  }
}

/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 */
function SpreadDb(query = [], opt = {}) {
  /** main: SpreadDb主処理 */
  const pv = { whois: 'SpreadDb', rv: [], log: [] };  // 擬似メンバ変数としてSpreadDb内で共有する値
  const v = { whois: `${pv.whois}.main`, step: 0 };
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1.1);
    if (!Array.isArray(query)) query = [query];  // 配列可の引数は配列に統一

    dev.step(1.2); // メンバに引数・初期値をセット
    v.r = constructor(query, opt);
    if (v.r instanceof Error) throw v.r;

    dev.step(2); // スプレッドシートのロックを取得
    v.lock = LockService.getDocumentLock();

    for (v.tryNo = pv.opt.maxTrial; v.tryNo > 0; v.tryNo--) {

      dev.step(3); // スプレッドシートのロック
      if (v.lock.tryLock(pv.opt.interval)) {

        dev.step(4); // クエリを順次処理
        for (v.i = 0; v.i < pv.query.length; v.i++) {
          dev.step(5); // クエリのメンバに既定値設定
          v.r = objectizeColumn('sdbQuery');
          if (v.r instanceof Error) throw v.r;
          pv.query[v.i] = Object.assign(v.r, pv.query[v.i], { userId: pv.opt.userId });

          dev.step(6); // クエリの実行
          v.r = doQuery(pv.query[v.i]);
          if (v.r instanceof Error) throw v.r;
        }

        dev.step(7); // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.r = objectizeColumn('sdbQuery');
        if (v.r instanceof Error) throw v.r;
        v.r = appendRow(Object.assign(v.r, {
          table: pv.opt.log,
          set: pv.log,
          result: [],
        }));
        if (v.r instanceof Error) throw v.r;

        dev.step(8); // ロック解除
        v.lock.releaseLock();
        v.tryNo = -1; // maxTrial回ロック失敗時(=0)と判別するため、負数をセット
      }
    }

    dev.step(9); // ロックができたか判定、不能時はエラー
    if (v.tryNo === 0) throw new Error("Could not Lock");

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) {
    dev.error(e);
    return e;
  }
  /** appendRow: 領域に新規行を追加
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.set=[] - 追加する行オブジェクト
   * @returns {null|Error}
   *
   * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
   */
  function appendRow(query) {
    const v = { whois: `${pv.whois}.appendRow`, step: 0, rv: null, target: [] };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      // 1. 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.setの存否判定
      if (!Object.hasOwn(query, 'set')) query.qSts = `No set`;  // query.setが不存在

      dev.step(1.3);
      // ①一行分のシートイメージ ⇒ any[] ⇒ 二次元配列化
      // ②一行分の行オブジェクト ⇒ Object ⇒ 配列化
      // ③複数行分のシートイメージ ⇒ any[][] ⇒ 行オブジェクトに変換
      // ④複数行分の行オブジェクト ⇒ Object[] ⇒ そのまま使用
      // ⑤上記以外 ⇒ エラー
      if (Array.isArray(query.set)) {
        dev.step(1.31); // 配列の長さ0
        if (query.set.length === 0) query.qSts = `Empty set`;
        if (whichType(query.set[0], 'Object')) {
          dev.step(1.32); // ④ ⇒ そのまま使用
        } else {
          if (Array.isArray(query.set[0])) {
            dev.step(1.33); // ③ ⇒ 行オブジェクトに変換
            v.r = convertRow(query.set);
            if (v.r instanceof Error) throw v.r;
            query.set = v.r.obj;
          } else {
            dev.step(1.34);  // ① ⇒ 二次元配列化
            query.set = [query.set];
          }
        }
      } else {
        if (whichType(query.set, 'Object')) {
          dev.step(1.35); // ② ⇒ 配列化
          query.set = [query.set];
        } else {
          dev.step(1.36); // ⑤ ⇒ エラー
          query.qSts = `Invalid set`;
        }
      }

      dev.step(2);
      if (query.qSts === 'OK') {
        // ------------------------------------------------
        // 2. 追加レコードをシートイメージに展開
        // ------------------------------------------------
        for (v.i = 0; v.i < query.set.length; v.i++) {

          dev.step(2.1); // 1レコード分のログを準備
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;

          dev.step(2.2); // auto_increment項目に値を設定
          // ※ auto_increment設定はuniqueチェックに先行
          for (v.ai in v.table.schema.auto_increment) {
            if (!query.set[v.i][v.ai]) { // 値が未設定だった場合は採番実行
              v.table.schema.auto_increment[v.ai].current += v.table.schema.auto_increment[v.ai].step;
              query.set[v.i][v.ai] = v.table.schema.auto_increment[v.ai].current;
            }
          }

          dev.step(2.3); // 既定値の設定
          for (v.dv in v.table.schema.defaultRow) {
            if (!query.set[v.i][v.dv]) {
              query.set[v.i][v.dv] = v.table.schema.defaultRow[v.dv](query.set[v.i]);
            }
          }

          dev.step(2.4); // 追加レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (v.table.schema.unique[v.unique].indexOf(query.set[v.i][v.unique]) >= 0) {
              // 登録済の場合はエラーとして処理
              v.log.rSts = 'Duplicate';
              v.log.diff[v.unique] = query.set[v.i][v.unique]; // diffに{unique項目名:重複値}を保存
            } else {
              // 未登録の場合v.table.sdbSchema.uniqueに値を追加
              v.table.schema.unique[v.unique].push(query.set[v.i][v.unique]);
            }
          }

          dev.step(2.5); // 主キーの値をpKeyにセット
          // 主キーがauto_incrementまたはdefaultで設定される可能性があるため、pKeyセットはこれらの後工程
          v.log.pKey = query.set[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 正当性チェックOKの場合の処理
          if (v.log.rSts === 'OK') {

            dev.step(2.61); // シートイメージに展開して登録
            v.row = [];
            for (v.j = 0; v.j < v.table.header.length; v.j++) {
              v.a = query.set[v.i][v.table.header[v.j]];
              v.row[v.j] = v.a;
            }
            v.target.push(v.row);

            dev.step(2.62); // v.table.valuesへの追加
            v.table.values.push(query.set[v.i]);

            dev.step(2.63); // ログに追加レコード情報を記載
            v.log.diff = JSON.stringify(query.set[v.i]);
          }

          dev.step(2.7); // 成否に関わらず戻り値に保存
          query.result.push(v.log);
        }

        dev.step(2.8); // 追加成功行数をnumにセット
        query.num = query.result.filter(x => x.rSts === 'OK').length || 0;

        // ------------------------------------------------
        dev.step(3); // 対象シートへの展開
        // ------------------------------------------------
        dev.step(3.1); // 対象シートにsetValues
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.table.rownum + 2,
            1,
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
        dev.step(3.2); // v.table.rownumの書き換え
        v.table.rownum += v.target.length;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** constructor: 擬似メンバの値設定、変更履歴テーブルの準備 */
  function constructor(query, opt) {
    const v = { whois: `${pv.whois}.constructor`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 擬似メンバに値を設定
      Object.assign(pv, {
        query: query,
        opt: Object.assign({
          userId: 'guest', // {string} ユーザの識別子
          userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
          log: 'log', // {string}='log' 更新履歴テーブル名
          maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
          interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
          guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
          adminId: 'Administrator', // {string} 管理者として扱うuserId
          additionalPrimaryKey: // {string} createTableで主キー無指定時に追加設定される主キー項目名
            { name: 'rowId', type: 'UUID', note: '主キー', primaryKey: true, default: () => Utilities.getUuid() },
          sdbQuery: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)', default: () => toLocale(new Date()) },
            { name: 'userId', type: 'string|number', note: 'ユーザ識別子(uuid等)', default: () => pv.opt.userId },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列。未設定の場合は主処理でUUIDを設定', default: () => Utilities.getUuid() },
            { name: 'table', type: 'string', note: '操作対象テーブル名', default: () => '' },
            { name: 'command', type: 'string', note: '操作名', default: () => '' },
            { name: 'cols', type: 'sdbColumn[]', note: '新規作成シートの項目定義オブジェクトの配列', default: () => [] },
            { name: 'where', type: 'Object|Function|string', note: '対象レコードの判定条件', default: () => null },
            { name: 'set', type: 'Object|string|Function', note: '追加・更新する値', default: () => [] },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果', default: () => 'OK' },
            { name: 'num', type: 'number', note: '変更された行数', default: () => 0 },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果', default: () => [] },
          ],
          sdbTable: [
            { name: 'name', type: 'string', note: 'テーブル名(範囲名)' },
            { name: 'account', type: 'string', note: '更新者のuserId(識別子)', default: () => pv.opt.userId },
            { name: 'sheet', type: 'Sheet', note: 'スプレッドシート内の操作対象シート(ex."master"シート)' },
            { name: 'schema', type: 'sdbSchema', note: 'シートの項目定義', default: () => objectizeColumn('sdbSchema') },
            { name: 'values', type: 'Object[]', note: '行オブジェクトの配列。{項目名:値,..} 形式', default: () => [] },
            { name: 'header', type: 'string[]', note: '項目名一覧(ヘッダ行)', default: () => [] },
            { name: 'notes', type: 'string[]', note: 'ヘッダ行のメモ', default: () => [] },
            { name: 'colnum', type: 'number', note: 'データ領域の列数', default: () => 0 },
            { name: 'rownum', type: 'number', note: 'データ領域の行数(ヘッダ行は含まず)', default: () => 0 },
          ],
          sdbSchema: [
            { name: 'cols', type: 'sdbColumn[]', note: '項目定義オブジェクトの配列', default: () => [] },
            { name: 'primaryKey', type: 'string', note: '一意キー項目名' },
            { name: 'unique', type: 'Object.<string, any[]>', note: 'primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名', default: () => new Object() },
            { name: 'auto_increment', type: 'Object.<string,Object>', note: 'auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名', default: () => new Object() },
            { name: 'defaultRow', type: 'Object|function', note: '既定値項目で構成されたオブジェクト。appendの際のプロトタイプ', default: () => new Object() },
          ],
          sdbColumn: [ // sdbColumnの属性毎にname,type,noteを定義
            { name: 'name', type: 'string', note: '項目名' },
            { name: 'type', type: 'string', note: 'データ型。string,number,boolean,Date,JSON,UUID' },
            { name: 'format', type: 'string', note: '表示形式。type=Dateの場合のみ指定' },
            { name: 'options', type: 'number|string|boolean|Date', note: '取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]' },
            { name: 'default', type: 'number|string|boolean|Date', note: '既定値' },
            { name: 'primaryKey', type: 'boolean', note: '一意キー項目ならtrue' },
            { name: 'unique', type: 'boolean', note: 'primaryKey以外で一意な値を持つならtrue' },
            {
              name: 'auto_increment', type: 'null|bloolean|number|number[]', note: '自動採番項目'
                + '\n// null ⇒ 自動採番しない'
                + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
                + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
                + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
            },
            { name: 'suffix', type: 'string', note: '"not null"等、上記以外のSQLのcreate table文のフィールド制約' },
            { name: 'note', type: 'string', note: '本項目に関する備考。create table等では使用しない' },
          ],
          sdbLog: [
            { name: 'logId', type: 'UUID', primaryKey: true, default: () => Utilities.getUuid() },
            { name: 'timestamp', type: 'string', note: '更新日時' },
            { name: 'userId', type: 'string', note: 'ユーザ識別子' },
            { name: 'queryId', type: 'string', note: 'クエリ・結果突合用識別子' },
            { name: 'table', type: 'string', note: '対象テーブル名' },
            { name: 'command', type: 'string', note: '操作内容(コマンド名)' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'pKey', type: 'string', note: '変更したレコードのprimaryKey' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果' },
            { name: 'diff', type: 'JSON', note: '差分情報。{項目名：[更新前,更新後]}形式' },
          ],
          sdbResult: [
            { name: 'pKey', type: 'string', note: '処理対象レコードの識別子' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果', default: () => 'OK' },
            { name: 'diff', type: 'Object', note: '当該レコードの変更点', default: () => new Object() },
          ],
          sdbMain: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)' },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列' },
            { name: 'table', type: 'string|string[]', note: '操作対象テーブル名' },
            { name: 'command', type: 'string', note: '操作名' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果' },
          ],
        }, opt),
        spread: SpreadsheetApp.getActiveSpreadsheet(), // スプレッドシートオブジェクト
        table: {}, // スプレッドシート上の各テーブル(領域)の情報
      });

      // 変更履歴テーブルのsdbTable準備
      dev.step(2); // 変更履歴用のクエリを作成
      v.r = objectizeColumn('sdbQuery');
      if (v.r instanceof Error) throw v.r;
      v.query = Object.assign(v.r, {
        userId: pv.opt.adminId,
        table: pv.opt.log,
        command: 'create',
        cols: pv.opt.sdbLog,
      });

      dev.step(3); // 変更履歴のテーブル管理情報を作成
      v.r = genTable(v.query);
      if (v.r instanceof Error) throw v.r;

      dev.step(4); // 変更履歴のシートが不在なら作成
      if (pv.table[pv.opt.log].sheet === null) {
        v.r = createTable(v.query);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
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
  function convertRow(data = [], header = []) {
    const v = { whois: pv.whois + '.convertRow', step: 0, rv: { raw: [], obj: data, header: header } };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1, `data=${JSON.stringify(data.slice(0, 2))}\nheader=${JSON.stringify(header)}`);

      if (data.length > 0) {

        dev.step(1); // ヘッダ未定義の場合、dataがシートイメージなら先頭行、行オブジェクトならメンバ名から作成
        // シートイメージの先頭行を使用する場合、createで主キー項目を追加(unshift)する場合に元データの先頭行も変化してしまうのでシャローコピーする
        if (v.rv.header.length === 0) {
          v.rv.header = Array.isArray(data[0]) ? [...data[0]] : [...new Set(data.flatMap(d => Object.keys(d)))];
        }

        if (Array.isArray(data[0])) { // dataがシートイメージの場合
          dev.step(2); // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
          v.rv.obj = [];
          for (v.i = 1; v.i < data.length; v.i++) {
            v.o = {};
            for (v.j = 0; v.j < data[v.i].length; v.j++) {
              if (data[v.i][v.j] || data[v.i][v.j] === 0 || data[v.i][v.j] === false) {
                v.o[data[0][v.j]] = data[v.i][v.j];
              }
            }
            v.rv.obj.push(v.o);
          }
        }

        dev.step(3); // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
        for (v.i = 0; v.i < v.rv.obj.length; v.i++) {
          v.arr = [];
          for (v.j = 0; v.j < v.rv.header.length; v.j++) {
            v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]]);
          }
          v.rv.raw.push(v.arr);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** createTable: 新規にシートを作成
   * @param {sdbQuery} query
   * @returns {null|Error}
   */
  function createTable(query) {
    const v = { whois: `${pv.whois}.createTable`, step: 0, rv: [], convertRow: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // 既定値設定
      if (!query.set) query.set = [];
      dev.step(1.2);  // テーブル管理情報をv.tableに保存
      v.table = pv.table[query.table];
      dev.step(1.3);  // 引数を保存
      query.arg = toString({ cols: query.cols });
      dev.step(1.4);  // シートが既に存在
      if (v.table.sheet !== null) query.qSts = 'Already Exist';

      if (query.qSts === 'OK') {
        dev.step(2); // 主キーが存在しない場合は追加
        if (!v.table.schema.cols.find(x => x.primaryKey === true)) {
          v.unique = v.table.schema.cols.find(x => x.unique === true);
          if (v.unique) {
            // ユニーク項目が存在している場合、主キーに昇格
            v.unique.primaryKey = true;
            v.table.schema.primaryKey = v.unique.name;
          } else {
            // ユニーク項目が不存在の場合は追加
            // schema.colsにopt.additionalPrimaryKeyを追加
            v.table.schema.cols.unshift(pv.opt.additionalPrimaryKey);
            // schema.primaryKeyに主キー項目名を設定
            v.table.schema.primaryKey = pv.opt.additionalPrimaryKey.name;
            // schema.uniqueに主キー項目名の空配列を設定
            v.table.schema.unique[pv.opt.additionalPrimaryKey.name] = [];
            // schema.defaultRowに主キー項目を追加
            v.table.schema.defaultRow[pv.opt.additionalPrimaryKey.name] = pv.opt.additionalPrimaryKey.default;
            // table.header先頭に主キー項目名を追加
            v.table.header.unshift(pv.opt.additionalPrimaryKey.name);
            // table.notes先頭に設定内容を追加
            v.r = genColumn(pv.opt.additionalPrimaryKey);
            if (v.r instanceof Error) throw v.r;
            v.table.notes.unshift(v.r.note);
            // table.colnumを+1
            v.table.colnum++;
          }
        }

        // ----------------------------------------------
        dev.step(3); // シートが存在しない場合、新規追加
        // ----------------------------------------------
        dev.step(3.1); // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(query.table);

        dev.step(3.2); // ヘッダ行・メモのセット
        v.headerRange = v.table.sheet.getRange(1, 1, 1, v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1, v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定

        dev.step(3.3); // 初期データの追加
        if (query.set.length > 0) {
          v.rv = appendRow(query);  // 初期データを追加した場合、戻り値はappendRowの戻り値とする
          if (v.rv instanceof Error) throw v.rv;

          dev.step(3.4);  // 初期レコードに重複が有った場合、qStsも"Duplicate"セット
          if (query.result.map(x => x.rSts).includes('Duplicate')) query.qSts = 'Duplicate';
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.where - 削除対象の指定
   * @returns {null|Error}
   */
  function deleteRow(query) {
    const v = { whois: `${pv.whois}.deleteRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在

      dev.step(1.3); // 該当レコードかの判別用関数を作成
      query.arg = toString(query.where); // 更新履歴記録用にwhereを文字列化
      query.where = functionalyze({ table: query.table, data: query.where });
      if (query.where instanceof Error) throw query.where;

      if (query.qSts === 'OK') {
        dev.step(2); // 対象レコードか、後ろから一件ずつチェック
        // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
        // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
        for (v.i = v.table.values.length - 1; v.i >= 0; v.i--) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (query.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // 1レコード分のログオブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          query.result.push(v.log);

          dev.step(2.3); // 削除レコードのunique項目をv.table.schema.uniqueから削除
          // v.table.schema.auto_incrementは削除の必要性が薄いので無視
          // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
          for (v.unique in v.table.schema.unique) { // unique項目を順次チェック
            if (v.table.values[v.i][v.unique]) {  // 対象レコードの当該unique項目が有意な値
              // unique項目一覧(配列)から対象レコードの値の位置を探して削除
              v.idx = v.table.schema.unique[v.unique].indexOf(v.table.values[v.i][v.unique]);
              if (v.idx >= 0) v.table.schema.unique[v.unique].splice(v.idx, 1);
            }
          }

          dev.step(2.4); // diffに削除レコード情報を記載
          v.log.diff = JSON.stringify(v.table.values[v.i]);

          dev.step(2.5); // 主キーの値をpKeyにセット
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 削除成功件数をインクリメント
          query.num++;

          dev.step(2.7); // v.table.valuesから削除
          v.table.values.splice(v.i, 1);

          dev.step(2.8); // シートのセルを削除
          v.range = v.table.sheet.deleteRow(v.i + 2); // 添字->行番号で+1、ヘッダ行分で+1

          dev.step(2.9); // v.table.rownumを書き換え
          v.table.rownum -= 1;

        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** doQuery: 単体クエリの実行、変更履歴の作成 */
  function doQuery(query) {
    const v = { whois: `${pv.whois}.doQuery`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------
      // 1. 事前準備
      // -------------------------------------------------
      if (!query.table || typeof query.table !== 'string') {
        dev.step(1.1);  // 必須パラメータの存否・形式確認：query.table
        query.qSts = 'No Table name';
      } else if (!query.command || ['create', 'select', 'update', 'append', 'delete', 'schema'].includes(query.command) !== true) {
        dev.step(1.2);  // 必須パラメータの存否・形式確認：query.command
        query.qSts = 'No command';
      } else {
        dev.step(1.3); // 操作対象のテーブル管理情報を準備
        if (!Object.hasOwn(pv.table, query.table)) {
          dev.step(1.4); // 未作成なら作成
          v.r = genTable(query);
          if (v.r instanceof Error) throw v.r;
        } else if (query.command !== 'create' && pv.table[query.table].sheet === null) {
          dev.step(1.5); // テーブル管理情報が存在しているがシートは不在の場合、create以外はエラー
          query.qSts = 'No Table';
        }
      }

      // -------------------------------------------------
      // 2. 実行権限の確認とcommand系メソッドの実行
      // -------------------------------------------------
      if (query.qSts === 'OK') { // エラーの場合は後続処理をスキップ

        // -------------------------------------------------
        dev.step(2.1); // ユーザの操作対象シートに対する権限を取得
        // -------------------------------------------------
        v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : (pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query.table] || '')  // ゲスト(userId指定無し)
            : (pv.opt.userAuth[query.table] || ''));  // 通常ユーザ

        // -------------------------------------------------
        dev.step(2.2); // 呼出先メソッド設定
        // -------------------------------------------------
        if (v.allow.includes('o')) {

          // o(=own set only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
          // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
          // 自分のread/write(select,update)およびschemaのみ実行可。append/deleteは実行不可
          // ∵新規登録(append)はシステム管理者の判断が必要。また誤ってdeleteした場合はappendが必要なのでこれも不可
          // 'o'の場合、where句はuserId固定とする(Object,function,JSON他は不可)

          switch (query.command) {
            case 'scheme':
              dev.step(2.211);  // command=schema
              v.isOK = true;
              v.func = getSchema;
              break;
            case 'select':
            case 'update':
              dev.step(2.212);  // command=select/update
              if (!isEqual(pv.opt.userId, query.where)) {
                dev.step(2.213);  // where句はuserId固定、かつ要一致
                // 非プリミティブ型なら指定方法がNG、プリミティブ型なら無権限と判断
                query.qSts = (typeof query.where === 'object' || typeof query.where === 'function')
                  ? 'Invalid where clause' : 'No Authority';
                v.isOK = false;
              } else {
                dev.step(2.214);  // select/updateでプリミティブ型の値が一致しているならOKと判断
                query.where = pv.opt.userId;
                v.isOK = true;
              }
              v.func = query.command === 'select' ? selectRow : updateRow;
              break;
            default:
              dev.step(2.215);
              v.isOK = false;
          }

        } else {

          dev.step(2.22);  // 'o'以外の場合の呼出先メソッドを設定
          switch (query.command) {
            case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
            case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
            case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
            case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
            case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
            case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
            default: v.isOK = false;
          }
        }

        dev.step(2.3); // 無権限ならqStsにエラーコードをセット
        if (v.isOK === false && query.qSts === 'OK') query.qSts = 'No Authority';

        // -------------------------------------------------
        dev.step(2.4); // メソッドの実行
        // -------------------------------------------------
        // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
        if (query.qSts === 'OK') {

          dev.step(2.41);  // メソッド実行
          v.r = v.func(query);
          if (v.r instanceof Error) {
            dev.step(2.42); // command系メソッドからエラーオブジェクトが帰ってきた場合はqSts=message
            query.qSts = v.r.message;
            throw v.r;
          }
        }
      }

      // -------------------------------------------------
      // 3. 戻り値と変更履歴シート追記イメージの作成
      // -------------------------------------------------
      dev.step(3.1); // 戻り値オブジェクトを作成
      v.r = objectizeColumn('sdbMain');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbMain.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.r[v.map[v.j]] = query[v.map[v.j]];
      }
      pv.rv.push(v.r);

      // クエリ単位の実行結果を変更履歴シートへ追記
      dev.step(3.21); // クエリ単位の実行結果オブジェクトを作成
      v.r = objectizeColumn('sdbLog');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbLog.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.val = query[v.map[v.j]];
        if (v.val || v.val === 0 || v.val === false) {
          v.r[v.map[v.j]] = toString(v.val);
        }
      }
      dev.step(3.211); // ユーザIDをセット
      v.r.userId = pv.opt.userId;
      dev.step(3.213); // 配列に追加
      pv.log.push(v.r);

      dev.step(3.22); // レコード単位の実行結果を変更履歴シートへ追記
      if (['create', 'append', 'update', 'delete'].includes(query.command)) {
        for (v.j = 0; v.j < query.result.length; v.j++) {

          dev.step(9.1); // レコード単位の実行結果オブジェクトを作成
          v.r = objectizeColumn('sdbLog');
          if (v.r instanceof Error) throw v.r;

          dev.step(9.2); // 配列に追加
          pv.log.push(Object.assign(v.r, {
            queryId: query.queryId,
            pKey: query.result[v.j].pKey,
            rSts: query.result[v.j].rSts,
            diff: toString(query.result[v.j].diff),
          }));
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
   * @param {Object} arg
   * @param {sdbTable} [arg.table] - 呼出元で処理対象としているテーブル
   * @param {Object|function|string} arg.data - 関数化するオブジェクトor文字列
   * @returns {function}
   *
   * - update/delete他、引数でdataを渡されるメソッドで使用
   * - 引数のデータ型により以下のように処理分岐
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - string
   *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
   *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   */
  function functionalyze(arg = null) {
    const v = { whois: `${pv.whois}.functionalyze`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 引数の型チェック＋変換
      if (typeof arg === 'function') {
        dev.step(1.1); // 引数が関数ならそのまま使用
        dev.end();
        return arg;
      } else if (typeof arg === 'string') {
        arg = { data: arg, table: null };
      } else if (!whichType(arg, 'Object') || !Object.hasOwn(arg, 'data')) {
        throw new Error(`Invalid Argument`);
      }

      switch (typeof arg.data) {
        case 'function': dev.step(2);  // 関数指定ならそのまま利用
          v.rv = arg.data;
          break;
        case 'object': dev.step(3);
          v.keys = Object.keys(arg.data);
          if (v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value')) {
            dev.step(3.1); // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o', `return isEqual(o['${arg.data.key}'],'${arg.data.value}')`);
          } else {
            dev.step(3.2); // {キー項目名:値}形式での指定の場合
            v.c = [];
            for (v.j = 0; v.j < v.keys.length; v.j++) {
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg.data[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o', `return (${v.c.join(' && ')})`);
          }
          break;
        case 'string': dev.step(4);
          v.fx = arg.data.match(/^function\s*\w*\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if (v.fx || v.ax) {
            dev.step(4.1); // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g, ''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g, ' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
            break;
          }
        // 関数では無い文字列の場合はdefaultで処理するため、breakの記述は省略
        default:
          dev.step(5); // 関数ではない文字列、またはfunction/object/string以外の型はprimaryKeyの値指定と看做す
          if (arg.table !== null && pv.table[arg.table].schema.primaryKey) {
            if (typeof arg.data === 'string') arg.data = `"${arg.data}"`;
            v.rv = new Function('o', `return isEqual(o['${pv.table[arg.table].schema.primaryKey}'],${arg.data})`);
          } else {
            throw new Error(`Invalid Argument`);
          }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {Object|Error}
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
  function genColumn(arg = {}) {
    const v = { whois: `${pv.whois}.genColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      // ------------------------------------------------
      dev.step(1); // 項目定義情報(rv.column)の準備
      // ------------------------------------------------
      if (typeof arg === 'object') {
        dev.step(1.1); // 引数がオブジェクト(=sdbColumn)ならそのまま採用
        v.rv.column = arg;
        v.rv.note = {};
      } else {  // 文字列で与えられたらオブジェクトに変換

        dev.step(1.2); // コメントの削除
        arg = arg.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');

        dev.step(1.3);
        // JSON文字列ならparse、それ以外はname属性と判断
        v.r = (arg => { try { return JSON.parse(arg) } catch { return null } })(arg);
        if (v.r === null) {
          // JSON文字列ではない場合、項目名と看做す
          v.rv.column = v.rv.note = { name: arg.trim() };
        } else {
          // JSON文字列ならオブジェクト化
          v.rv.column = v.r;
          v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
        }
      }

      // ------------------------------------------------
      dev.step(2); // シートのメモに記載する文字列を作成
      // ------------------------------------------------
      if (typeof v.rv.note === 'object') {
        // 元々シート上にメモが存在していた場合、step.1.4でオリジナルが保存されているので'string'
        v.rv.note = JSON.stringify(v.rv.column, (k, v) => typeof v === 'function' ? v.toString() : v, 2);
      }

      // ------------------------------------------------
      // default,auto_increment項目の準備
      // ------------------------------------------------
      dev.step(3); // defaultを関数に変換
      if (v.rv.column.default) {
        dev.step(3.1);
        v.r = functionalyze(v.rv.column.default);
        if (v.r instanceof Error) throw v.r;
        v.rv.column.default = v.r;
      }
      if (v.rv.column.default instanceof Error) throw v.rv.column.default;

      dev.step(4); // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => { return { obj: { start: x[0], step: (x[1] || 1) }, str: JSON.stringify(x) } },  // [start,step]形式
        Number: x => { return { obj: { start: x, step: 1 }, str: x } },  // startのみ数値で指定
        Object: x => { return { obj: x, str: JSON.stringify(x) } }, // {start:m,step:n}形式
        Null: x => { return { obj: false, str: 'false' } }, // auto_incrementしない
        Boolean: x => { return x ? { obj: { start: 1, step: 1 }, str: 'true' } : { obj: false, str: 'false' } }, // trueは[1,1],falseはauto_incrementしない
      };
      if (v.rv.column.auto_increment) {
        dev.step(3.1);
        if (typeof v.rv.column.auto_increment === 'string') {
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        }
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        // 開始値はstart+stepになるので、予め-stepしておく
        v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
        v.rv.note.auto_increment = v.acObj.str;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param table {sdbTable} - 対象テーブルのsdbTableオブジェクト
   * @returns {void}
   */
  function genSchema(table) {
    const v = { whois: `${pv.whois}.genSchema`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -----------------------------------------------
      dev.step(2); // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if (table.schema.cols.length === 0) {
        if (table.notes.length > 0) {
          dev.step(2.1); // シートにメモが存在していた場合、その内容から作成
          for (v.i = 0; v.i < table.notes.length; v.i++) {
            v.r = genColumn(table.notes[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
          }
        } else {
          dev.step(2.2); // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for (v.i = 0; v.i < table.header.length; v.i++) {
            v.r = genColumn(table.header[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
            table.notes.push(v.r.note);
          }
        }
      } else if (table.notes.length === 0) {
        dev.step(2.3); // 項目定義オブジェクトが渡された場合、notesのみを作成
        for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
          v.r = genColumn(table.schema.cols[v.i]);
          if (v.r instanceof Error) throw v.r;
          table.notes.push(v.r.note);
        }
      }

      // -----------------------------------------------
      dev.step(3); // table.schema.cols以外のメンバ作成
      // -----------------------------------------------
      for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
        dev.step(3.1); // primaryKey
        if (Object.hasOwn(table.schema.cols[v.i], 'primaryKey') && table.schema.cols[v.i].primaryKey === true) {
          table.schema.primaryKey = table.schema.cols[v.i].name;
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.2); // unique
        if (Object.hasOwn(table.schema.cols[v.i], 'unique') && table.schema.cols[v.i].unique === true) {
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.3); // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if (table.schema.cols[v.i].auto_increment && table.schema.cols[v.i].auto_increment !== false) {
          table.schema.auto_increment[table.schema.cols[v.i].name] = table.schema.cols[v.i].auto_increment;
          table.schema.auto_increment[table.schema.cols[v.i].name].current = table.schema.auto_increment[table.schema.cols[v.i].name].start;
        }

        dev.step(3.4); // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
        if (table.schema.cols[v.i].default) {
          table.schema.defaultRow[table.schema.cols[v.i].name] = table.schema.cols[v.i].default;
        }
      }

      // ------------------------------------------------
      dev.step(4); // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      table.values.forEach(vObj => {
        dev.step(4.1); // unique項目の値を洗い出し
        Object.keys(table.schema.unique).forEach(unique => {
          if (vObj[unique]) {
            if (table.schema.unique[unique].indexOf(vObj[unique]) < 0) {
              table.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });

        dev.step(4.2); // auto_increment項目の値を洗い出し
        Object.keys(table.schema.auto_increment).forEach(ai => {
          v.c = table.schema.auto_increment[ai].current;
          v.s = table.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if ((v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v)) {
            table.schema.auto_increment[ai].current = v.v;
          }
        });
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genTable: pv.table(sdbTable)を生成
   * @param query {sdbQuery}
   * @param query.table {string} - シート名
   * @param [query.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [query.set] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|null} シート不存在ならnull
   */
  function genTable(query) {
    const v = { whois: `${pv.whois}.genTable`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(2); // テーブルのプロトタイプを作成、初期化＋既定値設定
      v.r = objectizeColumn('sdbTable');
      if (v.r instanceof Error) throw v.r;
      pv.table[query.table] = v.table = Object.assign(v.r, {
        name: query.table, // {string} テーブル名(範囲名)
        sheet: pv.spread.getSheetByName(query.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      });

      dev.step(3); // シートの存否確認
      if (v.table.sheet === null) {

        if (query.command !== 'create') {
          // select, append, update, delete, schema の
          // create以外のコマンドの場合、対象テーブル未作成はエラー
          query.qSts = 'No Table';
        } else {

          dev.step(4); // シート不在なら引数から項目定義を作成
          if (query.cols && query.cols.length > 0) {
            dev.step(4.1); // 引数に項目定義オブジェクトが存在
            v.table.schema.cols = query.cols;
            v.table.header = query.cols.map(x => x.name);
          } else {
            if (query.set && query.set.length > 0) {
              dev.step(4.2); // 引数に項目定義オブジェクトが不存在だが初期データは存在
              v.r = convertRow(query.set);
              if (v.r instanceof Error) throw v.r;
              v.table.header = v.r.header;
            } else {
              dev.step(4.3); // 項目定義も初期データも無いならエラー
              query.qSts = 'No cols and data';
            }
          }

          dev.step(4.4); // 項目数・データ行数の設定
          v.table.colnum = v.table.header.length;
          v.table.rownum = 0;

          // 尚v.table.notes(項目定義メモ)は設定不要
          // ∵ step.6のgenSchema経由genColumnでcolsから作成される

        }
      } else {

        dev.step(5); // シートが存在するならシートから各種情報を取得
        dev.step(5.1); // シートイメージを読み込み
        v.getDataRange = v.table.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        dev.step(5.2); // シートイメージからヘッダ行・行オブジェクトを作成
        v.r = convertRow(v.getValues);
        if (v.r instanceof Error) throw v.r;

        dev.step(5.3); // ヘッダ・データの設定
        v.table.header = v.r.header;
        v.table.values = v.r.obj;
        v.table.colnum = v.table.header.length;
        v.table.rownum = v.table.values.length;

        dev.step(5.4); // ヘッダ行のメモ(項目定義メモ)を取得
        v.table.notes = v.getDataRange.getNotes()[0];

      }

      dev.step(6); // スキーマをインスタンス化
      if (query.qSts === 'OK') {
        v.r = genSchema(v.table);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {sdbQuery} query
   * @param {string} query.table - 取得対象テーブル名。テーブルと構造情報の対応を明確にするため、複数テーブル指定不可
   * @returns {null|Error}
   *
   * - sdbResult.pKeyは空欄、rStsはOK固定、diffにsdbColumnをセット
   */
  function getSchema(query) {
    const v = { whois: `${pv.whois}.getSchema`, step: 0, rv: [] };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // テーブル管理情報を項目毎にresultにセット
      v.cols = pv.table[query.table].schema.cols;
      for (v.i = 0; v.i < v.cols.length; v.i++) {
        query.result.push(v.cols[v.i]);
      }

      dev.step(2); // 項目数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** objectizeColumn: 項目定義メタ情報(JSDoc)からオブジェクトを生成
   * @param arg {Object[]|string} 文字列の場合、pv.opt以下に定義されているメンバ(typedef)と看做す
   * @param arg.name {string} 生成するオブジェクト内のメンバ名
   * @param arg.default {string|function} メンバ名にセットする値(functionalyzeの引数)
   * @returns {Object} 生成されたオブジェクト
   */
  function objectizeColumn(arg) {
    const v = { whois: `${pv.whois}.objectizeColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 文字列ならpv.opt以下に定義されているメンバ、それ以外は配列化
      v.arg = typeof arg === 'string' ? pv.opt[arg] : (Array.isArray(arg) ? arg : [arg]);

      dev.step(2);
      for (v.i = 0; v.i < v.arg.length; v.i++) {
        if (Object.hasOwn(v.arg[v.i], 'default') && v.arg[v.i].default) {
          dev.step(3);
          v.func = functionalyze(v.arg[v.i].default);
          if (v.func instanceof Error) throw v.func;
          v.rv[v.arg[v.i].name] = v.func();
        } else {
          dev.step(4); // 既定値の指定が無い場合はnullとする
          v.rv[v.arg[v.i].name] = null;
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** selectRow: テーブルから該当行を抽出
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|function} query.where - 対象レコード判定条件
   * @returns {null|Error}
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(query) {
    const v = { whois: `${pv.whois}.selectRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 抽出条件をquery.argにセット
      query.arg = toString(query.where);

      dev.step(2); // 判定条件を関数に統一
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(3); // 行オブジェクトを順次走査、該当行を戻り値に追加
      v.table = pv.table[query.table];
      for (v.i = 0; v.i < v.table.values.length; v.i++) {
        if (v.where(v.table.values[v.i])) {
          query.result.push(v.table.values[v.i]);
        }
      }

      dev.step(4); // 抽出行数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** 関数・オブジェクトを文字列化 */
  function toString(arg) {
    if (typeof arg === 'function') return arg.toString().replaceAll(/\n/g, '');
    if (arg !== null && typeof arg === 'object') return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: テーブルの既存行の内容を更新
   * @param {Object} query
   * @param {sdbTable} query.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} query.where - 対象レコードの判定条件
   * @param {Object|Function|string} query.set - 更新する値
   * @returns {null|Error}
   */
  function updateRow(query) {
    const v = {
      whois: `${pv.whois}.updateRow`, step: 0, rv: null,
      top: Infinity, left: Infinity, right: 0, bottom: 0
    }; // 更新範囲の行列番号
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在
      query.arg = { where: toString(query.where) };  // 変更履歴シート記録用に文字列化
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(1.3); // query.setの存否判定、引数setの処理
      if (Object.hasOwn(query, 'set') && query.set) {
        query.arg.set = toString(query.set);
        // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
        // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
        v.r = (query => {
          if (whichType(query, 'Object')) return query;  // Objectならそのまま返す
          try { return JSON.parse(query) } catch { return null } // JSONならObjectを、それ以外の文字列はnullを返す
        })(query.set);
        if (v.r !== null) { // query.setがObjectかJSONだった場合
          v.set = () => { return v.r }; // Objectを返す関数とする
        } else { // query.setがObjectでもJSONでもない文字列だった場合
          // 更新する値を導出する関数を作成
          v.set = functionalyze({ table: query.table, data: query.set });
          if (v.set instanceof Error) throw v.set;
        }

        dev.step(1.4); // 更新履歴記録用に文字列化
        query.arg = JSON.stringify(query.arg);

        dev.step(1.5); // 配列a1がa2の部分集合かどうかを判断する関数を用意
        // 更新対象項目がテーブルの項目名リストに全て入っているかの判断で使用(step.3.2)
        v.isSubset = (a1, a2) => {
          for (let element of a1)
            if (!a2.includes(element)) return false;
          return true;
        };

      } else {
        query.qSts = `No set`;
      }

      if (query.qSts === 'OK') {
        // ------------------------------------------------
        dev.step(2); // table.valuesを更新、ログ作成
        // ------------------------------------------------
        for (v.i = 0; v.i < v.table.values.length; v.i++) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (v.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.set(v.table.values[v.i]);

          dev.step(2.3); // 更新対象項目が項目名リストに存在しない場合はエラー
          // 本来事前チェックを行うべき項目だが、setをfunctionで指定していた場合
          // レコード毎に更新対象項目が変動する可能性があるため、レコード毎にチェック
          if (!v.isSubset(Object.keys(v.rObj), v.table.header)) {
            query.qSts = `Undefined Column`;
            break;
          }

          dev.step(2.4); // レコード単位の更新履歴オブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];
          query.result.push(v.log);

          dev.step(2.5); // v.before(更新前の行オブジェクト),after,diffの初期値を用意
          [v.before, v.after] = [v.table.values[v.i], {}];

          dev.step(2.6); // 項目毎に値が変わるかチェック
          v.table.header.forEach(x => {
            if (Object.hasOwn(v.rObj, x) && !isEqual(v.before[x], v.rObj[x])) {
              dev.step(6.1); // 変更指定項目かつ値が変化していた場合
              v.after[x] = v.rObj[x]; // afterは変更後の値
              v.log.diff[x] = [v.before[x], v.rObj[x]];  // diffは[変更前,変更後]の配列
              dev.step(6.2); // 更新対象範囲の見直し
              v.colNo = v.table.header.findIndex(y => y === x);
              v.left = Math.min(v.left, v.colNo);
              v.right = Math.max(v.right, v.colNo);
            } else {
              dev.step(6.3); // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          });

          dev.step(2.7); // 更新レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (Object.hasOwn(v.log.diff, v.unique)) {
              // 変更後の値がschema.uniqueに登録済の場合はDuplicate
              if (v.table.schema.unique[v.unique].indexOf(v.after[v.unique]) >= 0) {  // いまここ：全部Duplicate判定
                dev.step(7.1); // 登録済の場合はエラー
                v.log.rSts = 'Duplicate';
              } else {
                dev.step(7.2); // 未登録の場合、table.sdbSchema.uniqueから変更前の値を削除して変更後の値を追加
                v.idx = v.table.schema.unique[v.unique].findIndex(x => x === v.before[v.unique]);
                v.table.schema.unique[v.unique].splice(v.idx, 1);
                v.table.schema.unique[v.unique].push(v.after[v.unique]);
              }
            }
          }

          dev.step(2.8); // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
          if (v.log.rSts === 'OK') {
            query.num++;
            v.top = Math.min(v.top, v.i);
            v.bottom = Math.max(v.bottom, v.i);
            v.table.values[v.i] = v.after;
          }
        }

        // ------------------------------------------------
        dev.step(3); // 対象シート・更新履歴に展開
        // ------------------------------------------------
        dev.step(3.1); // シートイメージ(二次元配列)作成
        v.target = [];
        for (v.i = v.top; v.i <= v.bottom; v.i++) {
          v.row = [];
          for (v.j = v.left; v.j <= v.right; v.j++) {
            v.row.push(v.table.values[v.i][v.table.header[v.j]]);
          }
          v.target.push(v.row);
        }

        dev.step(3.2); // シートに展開
        // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
        // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.top + 2,  // +1(添字->行番号)+1(ヘッダ行)
            v.left + 1,  // +1(添字->行番号)
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
}

/** devTools: 開発支援関係メソッド集
 * @param {Object} option
 * @param {boolean} option.start=true - 開始・終了メッセージの表示
 * @param {boolean} option.arg=true - 開始時に引数を表示
 * @param {boolean} option.step=false - step毎の進捗ログの出力
 */
function devTools(option) {
  let opt = Object.assign({ start: true, arg: true, step: false }, option);
  let seq = 0;  // 関数の呼出順
  let stack = []; // 呼出元関数情報のスタック
  return { changeOption: changeOption, check: check, dump: dump, end: end, error: error, start: start, step: step };

  /** オプションの変更 */
  function changeOption(option) {
    opt = Object.assign(opt, option);
    console.log(`devTools.changeOption result: ${JSON.stringify(opt)}`);
  }
  /** 実行結果の確認
   * - JSON文字列の場合、オブジェクト化した上でオブジェクトとして比較する
   * @param {Object} arg
   * @param {any} arg.asis - 実行結果
   * @param {any} arg.tobe - 確認すべきポイント(Check Point)。エラーの場合、エラーオブジェクトを渡す
   * @param {string} arg.title='' - テストのタイトル(ex. SpreadDbTest.delete.4)
   * @param {Object} [arg.opt] - isEqualに渡すオプション
   * @returns {boolean} - チェック結果OK:true, NG:false
   */
  function check(arg = {}) {
    /** recursive: 変数の内容を再帰的にチェック
     * @param {any} asis - 結果の値
     * @param {any} tobe - 有るべき値
     * @param {Object} opt - isEqualに渡すオプション
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (asis, tobe, opt, depth = 0, label = '') => {
      let rv;
      // JSON文字列はオブジェクト化
      asis = (arg => { try { return JSON.parse(arg) } catch { return arg } })(asis);
      // データ型の判定
      let type = String(Object.prototype.toString.call(tobe).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(tobe)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in tobe)) type = 'Arrow'; break;
      }
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in tobe) {
            rv = !Object.hasOwn(asis, mn) ? false // 該当要素が不在
              : recursive(asis[mn], tobe[mn], opt, depth + 1, mn);
          }
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < tobe.length; i++) {
            rv = (asis[i] === undefined && tobe[i] !== undefined) ? false // 該当要素が不在
              : recursive(asis[i], tobe[i], opt, depth + 1, String(i));
          }
          msg.push(`${indent}]`);
          break;
        case 'Function': case 'Arrow':
          rv = tobe(asis);  // 合格ならtrue, 不合格ならfalseを返す関数を定義
          msg.push(
            indent + (label.length > 0 ? (label + ': ') : '')
            + (rv ? asis : `[NG] (${tobe.toString()})(${asis}) -> false`)
          );
          break;
        default:
          if (tobe === undefined) {
            rv = true;
          } else {
            rv = isEqual(asis, tobe, opt);
            msg.push(
              indent + (label.length > 0 ? (label + ': ') : '')
              + (rv ? asis : `[NG] ToBe=${tobe}, AsIs=${asis}`)
            );
          }
      }
      return rv;
    }

    // 主処理
    let msg = [];
    let isOK = true;  // チェックOKならtrue

    arg = Object.assign({ msg: '', opt: {} }, arg);
    if (arg.tobe === undefined) {
      // check未指定の場合、チェック省略、結果表示のみ
      msg.push(`===== ${arg.title} Check Result : Not checked`);
    } else {
      // arg.asisとarg.tobeのデータ型が異なる場合、またはrecursiveで不一致が有った場合はエラーと判断
      if (String(Object.prototype.toString.call(arg.asis).slice(8, -1))
        !== String(Object.prototype.toString.call(arg.tobe).slice(8, -1))
        || recursive(arg.asis, arg.tobe, arg.opt) === false
      ) {
        isOK = false;
        msg.unshift(`===== ${arg.title} Check Result : Error`);
      } else {
        msg.unshift(`===== ${arg.title} Check Result : OK`);
      }
    }

    // 引数として渡されたmsgおよび結果(JSON)を先頭に追加後、コンソールに表示
    msg = `::::: Verified by devTools.check\n`
      + `===== ${arg.title} Returned Value\n`
      + JSON.stringify(arg.asis, (k, v) => typeof v === 'function' ? v.toString() : v, 2)
      + `\n\n\n${msg.join('\n')}`;
    if (isOK) console.log(msg); else console.error(msg);
    return isOK;
  }
  /** dump: 渡された変数の内容をコンソールに表示
   * - 引数には対象変数を列記。最後の引数が数値だった場合、行番号と看做す
   * @param {any|any[]} arg - 表示する変数および行番号
   * @returns {void}
   */
  function dump() {
    let arg = [...arguments];
    let line = typeof arg[arg.length - 1] === 'number' ? arg.pop() : null;
    const o = stack[stack.length - 1];
    let msg = (line === null ? '' : `l.${line} `) + `${o.label} step.${o.step}`;
    for (let i = 0; i < arg.length; i++) {
      // 対象変数が複数有る場合、Noを追記
      msg += '\n' + (arg.length > 0 ? `${i}: ` : '') + stringify(arg[i]);
    }
    console.log(msg);
  }
  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function end() {
    const o = stack.pop();
    if (opt.start) console.log(`${o.label} normal end.`);
  }
  /** error: 異常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function error(e) {
    const o = stack.pop();
    // 参考 : e.lineNumber, e.columnNumber, e.causeを試したが、いずれもundefined
    e.message = `${o.label} abnormal end at step.${o.step}\n${e.message}`;
    console.error(e.message
      + `\n-- footprint\n${o.footprint}`
      + `\n-- arguments\n${o.arg}`
    );
  }
  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} name - 関数名
   * @param {any[]} arg - start呼出元関数に渡された引数([...arguments]固定)
   */
  function start(name, arg = []) {
    const o = {
      class: '',  // nameがクラス名.メソッド名だった場合のクラス名
      name: name,
      seq: seq++,
      step: 0,
      footprint: [],
      arg: [],
    };
    o.sSeq = ('000' + o.seq).slice(-4);
    const caller = stack.length === 0 ? null : stack[stack.length - 1]; // 呼出元
    // nameがクラス名.メソッド名だった場合、クラス名をセット
    if (name.includes('.')) [o.class, o.name] = name.split('.');
    // ラベル作成。呼出元と同じクラスならクラス名は省略
    o.label = `[${o.sSeq}]` + ((o.class === '' || caller.class === o.class) ? '' : `${o.class}.`) + o.name;
    // footprintの作成
    stack.forEach(x => o.footprint.push(`${x.label}.${x.step}`));
    o.footprint = o.footprint.length === 0 ? '(root)' : o.footprint.join(' > ');
    // 引数情報の作成
    if (arg.length === 0) {
      o.arg = '(void)';
    } else {
      for (let i = 0; i < arg.length; i++) o.arg[i] = stringify(arg[i]);
      o.arg = o.arg.join('\n');
    }
    // 作成した呼出元関数情報を保存
    stack.push(o);

    if (opt.start) {  // 開始メッセージの表示指定が有った場合
      console.log(`${o.label} start.\n-- footprint\n${o.footprint}` + (opt.arg ? `\n-- arguments\n${o.arg}` : ''));
    }
  }
  /** step: 呼出元関数の進捗状況の登録＋メッセージの表示 */
  function step(step, msg = '') {
    const o = stack[stack.length - 1];
    o.step = step;
    if (opt.step) console.log(`${o.label} step.${o.step} ${msg}`);
  }
  /** stringify: 変数の内容をラベル＋データ型＋値の文字列として出力
   * @param {any} arg - 文字列化する変数
   * @returns {string}
   */
  function stringify(arg) {
    /** recursive: 変数の内容を再帰的にメッセージ化
     * @param {any} arg - 内容を表示する変数
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (arg, depth = 0, label = '') => {
      // データ型の判定
      let type = String(Object.prototype.toString.call(arg).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(arg)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in arg)) type = 'Arrow'; break;
      }
      // ラベル＋データ型＋値の出力
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in arg) recursive(arg[mn], depth + 1, mn);
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < arg.length; i++) recursive(arg[i], depth + 1, String(i));
          msg.push(`${indent}]`);
          break;
        default:
          let val = typeof arg === 'function' ? `"${arg.toString()}"` : (typeof arg === 'string' ? `"${arg}"` : arg);
          // Class Sheetのメソッドのように、toStringが効かないnative codeは出力しない
          if (typeof val !== 'string' || val.indexOf('[native code]') < 0) {
            msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}${val}(${type})`);
          }
      }
    }
    const msg = [];
    recursive(arg);
    return msg.join('\n');
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

