const cf = {
  /**
   * @typedef {Object} schemaDef - DB構造定義オブジェクト
   * @param {string} dbName - データベース名
   * @param {Object[]} tables - DB内の個々のテーブルの定義
   * @param {string} tables.name - テーブル名
   * @param {string|string[]} tables.primaryKey - 主キーとなる項目名。複合キーの場合配列で指定
   * @param {Object[]} tables.cols - 項目定義
   * @param {string} tables.cols.name - 項目名
   * @param {string} tables.cols.type - データ型。string/number/boolean
   * @param {string|number|boolean|function} tables.cols.default - 既定値
   * @param {string} tables.cols.note - 備考
   */
  schema: {
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
      ]
    },{ // 記入用: 記入用シート
      name: '記入用',
      primaryKey: 'id',
      cols: [
        {name:'id',type:'string',note:'ファイルのID'},
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},  // シート上はファイルへのリンクを張る
        {name:'isExist',type:'boolean',note:'GD上の状態(存否)'},
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]'},
        {name:'label',type:'string',note:'report.html上の証憑名'},
        {name:'date',type:'string',note:'取引日。電子証憑・参考等、report.html上取引日の表示が必要な場合設定'},
        {name:'price',type:'string',note:'価格。以降、電子証憑の場合のみ設定'},
        {name:'payby',type:'number',note:'支払方法。"役員借入金"or"AMEX"'},
        {name:'note',type:'string',note:'備考。pdf上の頁指定等で使用'},
      ]
    },{
      name: '証憑分類',
      primaryKey: 'type',
      cols: [
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]'},
        {name:'rex',type:'string',note:'正規表現文字列'},
        {name:'label',type:'string',note:''},
      ],
      initialData: [
        {path:['金融関係','銀行通帳'],type:'通帳',rex:'',label:''},
        {path:['金融関係','ローン関係'],type:'返済明細',rex:'',label:''},
        {path:['金融関係','クレジットカード利用明細'],type:'AMEX',rex:'',label:''},
        {path:['レントロール','恵比寿フェリシタ'],type:'恵比寿',rex:'',label:''},
        {path:['レントロール','クレセント上池袋'],type:'上池袋',rex:'',label:''},
        {path:['レントロール','羽沢眞和マンション'],type:'羽沢',rex:'',label:''},
        {path:['証憑類','健保・年金、確定拠出年金'],type:'健保・年金',rex:'',label:''},
        {path:['証憑類','確証貼付ノート'],type:'確証貼付ノート',rex:'',label:''},
        {path:['証憑類','税理士(YFP)'],type:'YFP',rex:'',label:''},
        {path:['証憑類','電子証憑'],type:'電子証憑',rex:'',label:''},
        {path:['その他','交通費'],type:'交通費',rex:'',label:''},
        {path:['その他','参考資料'],type:'参考',rex:'',label:''},
        // {path:['その他','特記事項'],type:'',rex:'',label:''},
      ]
    },{/* 旧版記入用シート。備忘
      name: 'master',
      primaryKey: 'url',
      cols: [
        {name:'id',type:'string',note:'ファイルのID'},
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},
        {name:'url',type:'string',note:'ファイルのURL。File.getDownloadUrl()ではなくFile.getUrl()'},
        // 以下getFileList()の戻り値オブジェクト"FileInfoObj"
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},
        {name:'mime',type:'string',note:'MIMEタイプ。例:"application/pdf","application/vnd.google-apps.spreadsheet"'},
        {name:'desc',type:'string',note:'ファイルの説明。「詳細を表示>詳細タグ>ファイルの詳細>説明」に設定された文字列'},
        {name:'url',type:'string',note:'ファイルのURL。File.getDownloadUrl()ではなくFile.getUrl()'},
        {name:'viewers',type:'string',note:'閲覧権限を持つアカウント'},
        {name:'editors',type:'string',note:'編集権限を持つアカウント'},
        {name:'created',type:'string',note:'作成日時。ISO8601拡張形式'},
        {name:'updated',type:'string',note:'更新日時。ISO8601拡張形式'},
        {name:'isExist',type:'string',default:'o',note:'GD上の状態(存否)。o:現在も存在、x:(一時期存在したが)現在不在'},
        // "FileInfoObj"ここまで。以下はmasterシート上のみの項目
        {name:'fill',type:'string',note:'o:追記が必要、x:(自動設定対象なので)追記不要'},
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]を設定'},
        {name:'label',type:'string',note:'report.html上の証憑名'},
        {name:'date',type:'string',note:'取引日。電子証憑・参考等、report.html上取引日の表示が必要な場合設定'},
        {name:'price',type:'string',note:'価格。以降、電子証憑の場合のみ設定'},
        {name:'payby',type:'number',note:'支払方法。"役員借入金"or"AMEX"'},
        {name:'note',type:'string',note:'備考。pdf上の頁指定等で使用'},
      ],
    },{*/
      name: '交通費',
      cols: [
        {name:'日付',type:'string',note:'yyyy/MM/dd形式'},
        {name:'行先',type:'string',note:''},
        {name:'目的',type:'string',note:''},
        {name:'補助',type:'string',note:'賦課部門。CO,EF,等'},
        {name:'経路',type:'string',note:''},
        {name:'人数',type:'number',note:''},
        {name:'金額',type:'number',note:''},
        {name:'備考',type:'string',note:''},
      ]
    },{
      name: '特記事項',
      cols: [
        {name:'seq',type:'string',note:'記述の順番指定'},
        {name:'md',type:'string',note:'記述内容。Markdown形式'},
      ]
    },{
      name: '分類規則',
      cols: [
        {name:'label',type:'string',note:''},
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]を設定'},
        {name:'rex',type:'string',note:'正規表現文字列'},
        {name:'replace',type:'string',note:''},
      ]
    }],
  },
  YFPrex: { // YFP関係PDFファイル名の正規表現
    '顧問報酬': /^(20\d{2})(\d{2})(\d{2})_400_000\.pdf$/,
    '記帳代行': /^(20\d{2})(\d{2})(\d{2})_400_003\.pdf$/,
    '結合済': /^YFP(\d{4})(\d{2})\.pdf$/,
  },
}