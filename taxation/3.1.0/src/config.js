const cf = {
  schema: {
    dbName: 'taxation',
    tables: [{
      name: 'master',
      primaryKey: 'url',
      cols: [
        {name:'name',type:'string',note:'ファイル(フォルダ)名'},
        {name:'mime',type:'string',note:'MIMEタイプ。例:"application/pdf","application/vnd.google-apps.spreadsheet"'},
        {name:'desc',type:'string',note:'ファイルの説明。「詳細を表示>詳細タグ>ファイルの詳細>説明」に設定された文字列'},
        {name:'url',type:'string',note:'ファイルのURL'},
        {name:'viewers',type:'string',note:'閲覧権限を持つアカウント'},
        {name:'editors',type:'string',note:'編集権限を持つアカウント'},
        {name:'created',type:'string',note:'作成日時。ISO8601拡張形式'},
        {name:'updated',type:'string',note:'更新日時。ISO8601拡張形式'},
        {name:'isExist',type:'string',note:'GD上の状態(存否)。o:現在も存在、x:(一時期存在したが)現在不在'},
        {name:'fill',type:'string',note:'o:追記が必要、x:(自動設定対象なので)追記不要'},
        {name:'type',type:'string',note:'証憑としての分類。report.html上の掲載するdiv[data-type]を設定'},
        {name:'label',type:'string',note:'report.html上の証憑名'},
        {name:'date',type:'string',note:'取引日。電子証憑・参考等、report.html上取引日の表示が必要な場合設定'},
        {name:'price',type:'string',note:'価格。以降、電子証憑の場合のみ設定'},
        {name:'payby',type:'number',note:'支払方法。"役員借入金"or"AMEX"'},
        {name:'note',type:'string',note:'備考。pdf上の頁指定等で使用'},
      ],
    },{
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
  }
}