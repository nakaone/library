const cf = {
  schema: { // データ構造については SpreadDB.js の typedef "schemaDef" 参照
    dbName: 'taxation',
    tables: [{  // files: Google Driveのカレントフォルダに存在するファイル一覧
      // 移動したファイルはリストアップ対象外(リストに残っていたら削除)
      name: 'files',
      primaryKey: 'id',
      cols: [
        {name:'id',type:'string',note:'ファイルのID'},
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},
        {name:'mime',type:'string',note:'MIMEタイプ。例:"application/pdf","application/vnd.google-apps.spreadsheet"'},
        {name:'desc',type:'string',note:'ファイルの説明。「詳細を表示>詳細タグ>ファイルの詳細>説明」に設定された文字列'},
        {name:'url',type:'string',note:'ファイルのURL。File.getDownloadUrl()ではなくFile.getUrl()'},
        {name:'viewers',type:'string',note:'閲覧権限を持つアカウント'},
        {name:'editors',type:'string',note:'編集権限を持つアカウント'},
        {name:'created',type:'string',note:'作成日時。ISO8601拡張形式'},
        {name:'updated',type:'string',note:'更新日時。ISO8601拡張形式'},
      ],
      initial: () => getFileList(), // ファイル一覧作成
      /*{  // YFP関係の結合処理実行後、ファイル一覧を返す
        concatYFP().then(()=>{return getFileList()});
      },*/
    },{ // 記入用
      name: '記入用',
      primaryKey: 'id',
      cols: [
        {name:'id',type:'string',note:'ファイルのID'},
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},  // シート上はファイルへのリンクを張る
        {name:'link',type:'string',note:'プレビュー用URL'},
        {name:'isExist',type:'boolean',note:'GD上の状態(存否)'},
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]'},
        {name:'date',type:'string',note:'取引日。電子証憑・参考等、report.html上取引日の表示が必要な場合設定'},
        {name:'label',type:'string',note:'摘要(電子証憑)、行き先(交通費)、資料名(参考)'},
        {name:'price',label:'価格',type:'string'},
        {name:'payby',label:'支払方法',type:'string',note:'役員借入金 or AMEX'},
        {name:'note',label:'備考',type:'string',note:'pdf上の頁指定等で使用'},
      ],
      initial: () => [
        {"id":"1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_","type":"参考","date":"2025/05/16","label":"2025年度給与所得等に係る特別徴収税額の決定通知書"},
        {"id":"11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC","type":"電子証憑","date":"2024/10/28","label":"スマホスタンド","price":1850,"payby":"役員借入金"},
        {"id":"1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr","type":"電子証憑","date":"2024/11/16","label":"ボールペン替芯","price":545,"payby":"AMEX"},
        {"id":"1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ","type":"電子証憑","date":"2024/11/16","label":"文具","price":3524,"payby":"AMEX"},
        {"id":"1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL","type":"電子証憑","date":"2024/12/05","label":"スマホフィルム","price":2520,"payby":"役員借入金"},
        {"id":"1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N","type":"電子証憑","date":"2024/12/07","label":"スマホ消耗品、書籍","price":3899,"payby":"AMEX"},
        {"id":"1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei","type":"電子証憑","date":"2024/12/09","label":"書籍","price":3080,"payby":"AMEX"},
        {"id":"1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF","type":"電子証憑","date":"2024/12/09","label":"プリンタインク","price":1180,"payby":"AMEX"},
        {"id":"1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo","type":"電子証憑","date":"2024/12/09","label":"USB充電器","price":3919,"payby":"AMEX"},
        {"id":"195AbJCoKG74szRbjbo-19CrL2YTjgk3E","type":"電子証憑","date":"2024/12/11","label":"クリヤーブック","price":2220,"payby":"AMEX"},
        {"id":"18exrmCa45gXffolZO9vdU5GD0B2EAK1N","type":"電子証憑","date":"2024/12/11","label":"司法書士(登記変更、他)","price":93500,"payby":"役員借入金","note":"p.2のみ"},
        {"id":"1dEIdlcHtfkXresrJVvi7yqschZRA9N_W","type":"電子証憑","date":"2025/01/28","label":"PC周辺機器","price":1310,"payby":"役員借入金"},
        {"id":"1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx","type":"電子証憑","date":"2025/03/13","label":"養生テープ","price":1369,"payby":"AMEX"},
        {"id":"1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG","type":"電子証憑","date":"2025/05/07","label":"営繕・補修用資材","price":4747,"payby":"役員借入金"},
        {"id":"1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D","type":"電子証憑","date":"2025/05/07","label":"営繕・補修用資材","price":123,"payby":"役員借入金"},
        {"id":"1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-","type":"電子証憑","date":"2025/05/08","label":"営繕・補修用資材","price":2813,"payby":"役員借入金"},
        {"id":"1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC","type":"電子証憑","date":"2025/05/22","label":"備品(バスケット)","price":5279,"payby":"役員借入金"},
        {"id":"1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty","type":"電子証憑","date":"2025/07/03","label":"カメラ(本体)","price":136170,"payby":"役員借入金"},
        {"id":"1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI","type":"電子証憑","date":"2025/08/06","label":"若宮宅残置物撤去","price":330000,"payby":"役員借入金"},
        {"id":"19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0","type":"返済明細","date":"2024/12/30","label":"SMBCローン返済明細"},
        {"id":"1xXxbijwGf65A75_BV54jjEQWBzYf8uss","type":"返済明細","date":"2025/04/21","label":"SMBCローン返済明細"},
        {"id":"1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD","type":"返済明細","date":"2024/10/01","label":"SMTLFローン返済明細"},
      ],
    },{ // 交通費
      name: '交通費',
      cols: [
        {name:'date',label:'日付',type:'string'},
        {name:'destination',label:'行先',type:'string'},
        {name:'label',label:'目的',type:'string'},
        {name:'route',label:'経路',type:'string'},
        {name:'number',label:'人数',type:'number'},
        {name:'price',label:'金額',type:'number',func:o=>Number(o.price).toLocaleString()},
        {name:'note',label:'備考',type:'string'},
      ],
      initial: () => [
        {"date":"2024/10/08","destination":"羽沢","label":"現状確認","route":"笹塚 - 市ヶ谷 - 新桜台","number":1,"price":1240},
        {"date":"2024/11/08","destination":"上池袋","label":"現状確認","route":"笹塚 - 新宿 - 板橋","number":1,"price":640},
        {"date":"2024/12/09","destination":"恵比寿","label":"現状確認","route":"笹塚 - 新宿 - 恵比寿","number":1,"price":620},
        {"date":"2024/12/10","destination":"オーシャン","label":"打合せ(登記変更依頼)","route":"代々木上原 - 表参道","number":1,"price":360},
        {"date":"2025/01/08","destination":"羽沢","label":"現状確認","route":"笹塚 - 市ヶ谷 - 新桜台","number":1,"price":1240},
        {"date":"2024/11/10","destination":"ふじやまビレジ","label":"打合せ(方針論議)","route":"笹塚 - 上界戸","number":2,"price":14800,"note":"〜11/12"},
        {"date":"2025/02/08","destination":"上池袋","label":"現状確認","route":"笹塚 - 新宿 - 板橋","number":1,"price":640},
        {"date":"2025/03/01","destination":"上池袋","label":"SB現調","route":"笹塚 - 新宿 - 板橋","number":2,"price":1280},
        {"date":"2025/03/09","destination":"恵比寿","label":"現状確認","route":"笹塚 - 新宿 - 恵比寿","number":1,"price":620},
        {"date":"2025/03/26","destination":"上池袋","label":"SB現調","route":"笹塚 - 新宿 - 板橋","number":1,"price":640},
        {"date":"2025/04/08","destination":"羽沢","label":"現状確認","route":"笹塚 - 市ヶ谷 - 新桜台","number":1,"price":1240},
        {"date":"2025/05/08","destination":"上池袋","label":"現状確認","route":"笹塚 - 新宿 - 板橋","number":1,"price":640},
        {"date":"2025/05/24","destination":"野方","label":"現地調査","route":"笹塚 - 新宿 - 高田馬場 - 野方","number":2,"price":1880},
        {"date":"2025/06/08","destination":"恵比寿","label":"現状確認","route":"笹塚 - 新宿 - 恵比寿","number":1,"price":620},
        {"date":"2025/07/04","destination":"野方","label":"現状確認、清掃","route":"笹塚 - 新宿 - 高田馬場 - 野方","number":1,"price":940},
        {"date":"2025/07/08","destination":"羽沢","label":"現状確認","route":"笹塚 - 市ヶ谷 - 新桜台","number":1,"price":1240},
        {"date":"2025/07/23","destination":"野方","label":"現状確認、整理","route":"笹塚 - 新宿 - 高田馬場 - 野方","number":2,"price":1880},
        {"date":"2025/08/06","destination":"野方","label":"残置物搬出","route":"笹塚 - 新宿 - 高田馬場 - 野方","number":2,"price":1880},
        {"date":"2025/08/08","destination":"上池袋","label":"現状確認","route":"笹塚 - 新宿 - 板橋","number":1,"price":640}
      ],
    }],
    custom: { // AlaSQLのカスタム関数(以下は使用例)
      // alasql.fn.exclude = cf.custom.exclude;
      // alasql('select * from `files` where exclude(`name`)');

      // exclude: ファイル一覧で処理か判定。引数：ファイル名、戻り値：trueなら処理対象外
      exclude: fn => /^(20\d{2})(\d{2})(\d{2})_400_00[0|3]\.pdf$/.test(fn),
      // previewURL: ファイルIDとラベルからpreviewモードで当該ファイルを開くURLを返す
      previewURL: (id,label) => `<a href="https://drive.google.com/file/d/${id}/preview" target="_blank">${label}</a>`,
      // identifyType: ファイルの自動判別可否または処理対象外かを判定
      identifyType: fileName => {
        // 処理対象外のファイル
        for( let rex of cf.ignore ) if( rex.test(fileName) ) return '対象外';
        // 自動判別可能なら該当するメンバ名を、判別不可能なら「不明」を返す
        for (const [key, value] of Object.entries(cf.classDef))
          if (value.rex && value.rex.test(fileName)) return key;
        return '不明';
      },
    },
  },
  YFPrex: { // YFP関係PDFファイル名の正規表現
    '顧問報酬': /^(20\d{2})(\d{2})(\d{2})_400_000\.pdf$/,
    '記帳代行': /^(20\d{2})(\d{2})(\d{2})_400_003\.pdf$/,
    '結合済': /^YFP(\d{4})(\d{2})\.pdf$/,
  },
  /**
   * @typedef {Object} JSONstructure - 出力するJSONの形式。メンバ名はdata-type
   * @param {number} colnum - 一行当たりの項目数。0:テーブル、>=1:箇条書き。数字は項目数/行
   * @param {RegExp} rex - ファイル名を基にdata-typeを判定する正規表現。特定不能型はnull
   * -- 以下、箇条書きの場合に設定される項目
   * @param {Function} func - data.label生成関数
   *   引数はo:「記入用」行オブジェクト・m:rexの結果、戻り値はHTML文字列。
   *   なおoは何れの場合も必須なので第一引数、使用しない場合も有るmは第二引数とする。
   * @param {Object[]} data - ファイル単位のデータ。以下は出力時に生成
   * @param {string} data.id - ファイルのID。URL作成用
   * @param {string} data.name - ファイル名
   * @param {string} data.label - ラベル
   * -- 以下、テーブルの場合に設定される項目
   * @param {Object[]} cols - 項目定義
   * @param {string} cols.name - 行オブジェクト内のメンバ名
   * @param {string} [cols.label] - テーブルに表示する項目名。省略時はnameを流用
   * @param {string} cols.type='string' - データ型。string/number/boolean
   * @param {any} [cols.default=''] - 0,false以外の無効値の場合に設定する値
   * @param {Function} [cols.func] - 桁区切りやリンク等のlabel生成関数
   *   引数はo:「記入用」行オブジェクト・m:rexの結果、戻り値はHTML文字列
   * @param {string} [cols.note] - 備考
   * @param {Object[]} data - テーブルの行オブジェクト。以下は出力時に生成
   */
  classDef: { // report.html上の証憑分類に関する定義(classify Definition)
    // ----- 金融関係 ----------
    '通帳': {
      colnum: 4,  // 箇条書き型(4列/行)
      rex: /^([A-Z]{4})(\d{2})\.pdf$/,
      func: (o,m) => `${m[1]} No.${previewURL(o.id,m[2])}`,
    },
    '返済明細': { // 記入項目：①資料名(label),②入手日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      func: o => previewURL(o.id,o.label) + (o.date?`(${o.date})`:''),
    },
    'AMEX': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    // ----- レントロール ----------
    '恵比寿': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^EF(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    '上池袋': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^CK(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    '羽沢': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^HS(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    // ----- 証憑類 ----------
    '健保・年金': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^pension(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    '確証貼付ノート': {
      colnum: 10,  // 箇条書き型(10列/行)
      rex: /^note(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => 'p.' + previewURL(o.id,m[2]),
    },
    'YFP': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^YFP(20\d{2})(\d{2})\.pdf$/,
      func: (o,m) => previewURL(o.id,`${m[1]}/${m[2]}`),
    },
    '電子証憑': {
      colnum: 0,  // テーブル型
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      cols: [
        {name:'date',label:'取引日',type:'string',func:o=>previewURL(o.id,o.label)},
        {name:'label',label:'摘要',type:'string'},
        {name:'price',label:'価格',type:'number',func:o=>Number(o.price).toLocaleString()},
        {name:'payby',label:'支払',type:'string'},
        {name:'note',label:'備考',type:'string'},
      ]
    },
    // ----- その他 ----------
    '交通費': {
      colnum: 0,  // テーブル型
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      cols: [
        {name:'date',label:'日付',type:'string'},
        {name:'label',label:'行先',type:'string'},
        {name:'route',label:'経路',type:'string'},
        {name:'number',label:'人数',type:'string'},
        {name:'price',label:'金額',type:'number',func:o=>Number(o.price).toLocaleString()},
        {name:'payby',label:'支払',type:'string',default:'役員借入金'},
        {name:'note',label:'備考',type:'string'},
      ]
    },
    '参考資料': { // 記入項目：①資料名(label),②入手日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      func: o => previewURL(o.id,o.label) + (o.date?`(${o.date})`:''),
    },
    '特記事項': { // 記入項目：①タイトル(label),②内容(note),③記入日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      func: o => `<h3>${o.label}<h3><div>${o.note}</div>`
      + `<div style="text-align:right">${o.date}</div>`,  // 記入日
    },
  },
  ignore: [ // {RegExp[]} 存在しても処理対象外となるファイル名の正規表現集
    /^(?!.*\.pdf$).*/,  // 末尾が".pdf"ではない
    /^(20\d{2})(\d{2})(\d{2})_400_00[0|3]\.pdf$/, // 結合前のYFP顧問報酬(0),記帳代行(3)
  ],
  // ファイルプレビュー用のURL
  previewURL: "https://drive.google.com/file/d/$1/preview",
}