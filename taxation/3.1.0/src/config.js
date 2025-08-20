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
        {name:'price',label:'価格',type:'string',printf:o=>Number(o.price).toLocaleString()},
        {name:'payby',label:'支払方法',type:'string',note:'役員借入金 or AMEX'},
        {name:'note',label:'備考',type:'string',note:'特記事項の本文(MD)、他はpdf上の頁指定等'},
      ],
      initial: () => [],
    },{ // 交通費
      name: '交通費',
      cols: [
        {name:'date',label:'日付',type:'string'},
        {name:'destination',label:'行先',type:'string'},
        {name:'label',label:'目的',type:'string'},
        {name:'route',label:'経路',type:'string'},
        {name:'number',label:'人数',type:'number'},
        {name:'price',label:'金額',type:'number',printf:o=>Number(o.price).toLocaleString()},
        {name:'note',label:'備考',type:'string'},
      ],
      initial: () => [],
    }],
    custom: { // AlaSQLのカスタム関数(以下は使用例)
      // alasql.fn.exclude = cf.custom.exclude;
      // alasql('select * from `files` where exclude(`name`)');

      // exclude: ファイル一覧で処理か判定。引数：ファイル名、戻り値：trueなら処理対象外
      exclude: fn => /^(20\d{2})(\d{2})(\d{2})_400_00[0|3]\.pdf$/.test(fn),
      // identifyType: ファイルの自動判別可否または処理対象外かを判定
      identifyType: fileName => {
        if( !fileName ) return '不明';
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
   * @typedef {Object} classDef - report.html上の証憑分類に関する定義(classify Definition)
   * @param {number} colnum - 一行当たりの項目数。0:テーブル、>=1:箇条書き。数字は項目数/行
   * @param {RegExp} rex - ファイル名を基にdata-typeを判定する正規表現。特定不能型はnull
   * -- 以下、箇条書きの場合のみ設定される項目
   * @param {Arrow} printf - 箇条書きの場合、aタグを含むラベルHTML文字列を作成する関数。
   *   o:行オブジェクト、m:o.name.match(rex)の結果。戻り値はHTML文字列。
   * -- 以下、テーブルの場合のみ設定される項目
   * @param {Object[]} cols - 項目定義
   * @param {string} cols.name - 行オブジェクト内のメンバ名
   * @param {string} [cols.label] - テーブルに表示する項目名。省略時はnameを流用
   * @param {string} cols.type='string' - データ型。string/number/boolean
   * @param {Function} [cols.printf] - 桁区切りやリンク等のlabel生成関数
   *   引数はo:「記入用」行オブジェクト・m:rexの結果、戻り値はHTML文字列
   * @param {Function} cols.orderBy - ソートキー生成関数
   */
  classDef: {
    // ----- 金融関係 ----------
    '通帳': {
      colnum: 4,  // 箇条書き型(4列/行)
      rex: /^([A-Z]{4})(\d{2})\.pdf$/,
      printf: (o,m) => `${m[1]} No.${cf.getA(o.id,m[2])}`,
      orderBy: (o,m) => m[1] + m[2],  // 銀行名＋通帳番号
    },
    '返済明細': { // 記入項目：①資料名(label),②入手日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      printf: o => cf.getA(o.id,o.label) + (o.date?`(${o.date})`:''),
      orderBy: o => o.date,
    },
    'AMEX': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    // ----- レントロール ----------
    '恵比寿': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^EF(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    '上池袋': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^CK(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    '羽沢': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^HS(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    // ----- 証憑類 ----------
    '健保・年金': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^pension(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    '確証貼付ノート': {
      colnum: 10,  // 箇条書き型(10列/行)
      rex: /^note(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => 'p.' + cf.getA(o.id,m[2]),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    'YFP': {
      colnum: 6,  // 箇条書き型(月次型)
      rex: /^YFP(20\d{2})(\d{2})\.pdf$/,
      printf: (o,m) => cf.getA(o.id,`${m[1]}/${m[2]}`),
      orderBy: (o,m) => m[1] + m[2],  // 年＋月
    },
    '電子証憑': {
      colnum: 0,  // テーブル型
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      cols: [
        {name:'date',label:'取引日',type:'string'},
        {name:'label',label:'摘要',type:'string',printf:o=>cf.getA(o.id,o.label)},
        {name:'price',label:'価格',type:'number',printf:o=>Number(o.price).toLocaleString()},
        {name:'payby',label:'支払',type:'string'},
        {name:'note',label:'備考',type:'string'},
      ],
      orderBy: o => o.date,
    },
    // ----- その他 ----------
    '交通費': {
      colnum: 0,  // テーブル型
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      cols: [
        {name:'date',label:'日付',type:'string'},
        {name:'label',label:'行先',type:'string'},
        {name:'route',label:'経路',type:'string'},
        {name:'number',label:'人数',type:'number'},
        {name:'price',label:'金額',type:'number',printf:o=>Number(o.price).toLocaleString()},
        {name:'payby',label:'支払',type:'string',default:'役員借入金'},
        {name:'note',label:'備考',type:'string'},
      ],
      orderBy: o => o.date,
    },
    '参考資料': { // 記入項目：①資料名(label),②入手日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      printf: o => (o.date?`${o.date} : `:'') + cf.getA(o.id,o.label),
      orderBy: o => o.date,
    },
    '特記事項': { // 記入項目：①タイトル(label),②内容(note),③記入日(date)
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,  // 特定不能型はマニュアルで型を特定、必要事項を記入するようにする
      printf: o => {`<div>
        <span>${o.date+' : '}</span>
        <span>${o.label}</span><br>
        <pre>${o.note}</pre>
      </div>`},
      //printf: o => (o.date?`<li>${o.date}`:'<li>')  // 記入日
      //+ `<span style="margin-left:1rem;font-size:1.4rem">${o.label}</span><br>${o.note}</li>`,
      orderBy: o => o.date,
    },
    '不明': {
      colnum: 1,  // 箇条書き型(1件1行)
      rex: null,
      printf: o => cf.getA(o.id,o.name),
      orderBy: o => o.name,
    },
  },
  ignore: [ // {RegExp[]} 存在しても処理対象外となるファイル名の正規表現集
    /^(?!.*\.pdf$).*/,  // 末尾が".pdf"ではない
    /^(20\d{2})(\d{2})(\d{2})_400_00[0|3]\.pdf$/, // 結合前のYFP顧問報酬(0),記帳代行(3)
  ],
  // ファイルプレビュー用のURL
  previewURL: "https://drive.google.com/file/d/$1/preview",
  // getA: ファイルIDとラベルからpreviewモードで当該ファイルを開くURLを返す
  getA: (id,label) => `<a href="https://drive.google.com/file/d/${id}/preview" target="_blank">${label}</a>`,
}