const kzConfig = {
  schema: {
    dbName: 'kz12',
    tableDef: {
      'kz標準': {
        note: 'kawazanyoで使用する仕訳日記帳の標準',
        primaryKey: ['伝票番号','明細番号'],  // 複合キー
        colDef: [
          {colName:'年度', type:'number'},
          {colName:'伝票番号', type:'number', note:'伝票を一意に特定する番号'},
          {colName:'明細番号', type:'number', note:'伝票内の明細行番号'},
          {colName:'取引日', type:'string',alias: ['日付','取引日付','伝票日付']},
          {colName:'摘要', type:'string', alias:['取引摘要']},
          {colName:'補助摘要', type:'string'},
          {colName:'借方科目', type:'string',alias: ['借方勘定科目','借方科目名称']},
          {colName:'借方補助', type:'string',alias: ['借方補助科目','借方補助科目名称']},
          {colName:'借方部門', type:'string', alias: ['借方部門名称']},
          {colName:'借方本体', type:'number'},
          {colName:'借方税額', type:'number',alias: ['借方税金額','借方消費税']},
          {colName:'借方金額', type:'number'},
          {colName:'貸方科目', type:'string',alias: ['貸方勘定科目','貸方科目名称']},
          {colName:'貸方補助', type:'string',alias: ['貸方補助科目','貸方補助科目名称']},
          {colName:'貸方部門', type:'string', alias: ['貸方部門名称']},
          {colName:'貸方本体', type:'number'},
          {colName:'貸方税額', type:'number',alias: ['貸方税金額','貸方消費税']},
          {colName:'貸方金額', type:'number'},
          {colName:'備考', type:'string'},
        ],
      },
      '勘定科目': {
        note: 'kawazanyoで使用する勘定科目の一覧。ツリー構造のテーブル',
        colDef: [
          {colName:'大分類',type:'string',note:'BS/PL上の大分類'},
          {colName:'中分類',type:'string',note:'BS/PL上の中分類'},
          {colName:'小分類',type:'string',note:'BS/PL上の小分類'},
          {colName:'科目名',type:'string',note:'勘定科目名'},
          {colName:'CF分類',type:'string',note:"CF上の分類を' > 'で連結"},
        ],
      },
      '過年度一覧': {
        note: '過年度の仕訳日記帳データ(CSV)に関する情報',
        primaryKey: ['年度'],
        colDef: [
          {colName:'年度', type:'number', note:'会計年度'},
          {colName:'状態', type:'string', note:'未了 or 完了'},
          {colName:'パス', type:'string', note:'年度別仕訳日記帳(CSV)へのGoogle Driveのパス'},
          {colName:'ID', type:'string', note:'CSVのGoogle Drive上のファイルID'},
          {colName:'URL', type:'string', note:'CSVのURL。必ずプレビューで開くよう、IDから導出'},
          {colName:'文字コード', type:'string', note:'CSVの文字コード。Shift-JIS(MS932)対応'},
          {colName:'ヘッダ', type:'string', note:'CSV上のヘッダ行番号。基底=1'},
          {colName:'備考', type:'string', note:''},
          {colName:'決算書パス', type:'string', note:'当該会計年度のBS/PL(PDF)へパス'},
          {colName:'決算書URL', type:'string', note:'同URL'},
          {colName:'頁', type:'string', note:'PDF上でBS/PLが掲載されている頁番号'},
        ],
      },
    },
    tables: {
      '過年度CSV': {def:'kz標準'},
      '勘定科目': {},
      '過年度一覧': {},
    },
    custom: {
      // 日付をyyyy/MM/ddに変換
      toLocale: `x => toLocale(x,{
        verbose: false,
        format:'yyyy/MM/dd',
        undecimber: true,
        fyEnd:'${this['期末日']}',
        errValue: 'error',
      })`,
      // 半角カナ修正
      convertCharacters: `x => convertCharacters(x)`,
    },
  },
  '期末日': '09/30',  // "MM/dd"形式で指定
}