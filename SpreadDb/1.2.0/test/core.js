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