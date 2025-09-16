const kzConfig = {
  schema: {
    dbName: 'kz12',
    tableDef: {
      'kz標準': {
        note: 'kawazanyoで使用する仕訳日記帳の標準',
        primaryKey: ['伝票番号','明細番号'],  // 複合キー
        colDef: [
          {name:'年度', type:'number'},
          {name:'伝票番号', type:'number', note:'伝票を一意に特定する番号'},
          {name:'明細番号', type:'number', note:'伝票内の明細行番号'},
          {name:'取引日', type:'string',alias: ['日付','取引日付','伝票日付']},
          {name:'摘要', type:'string', alias:['取引摘要']},
          {name:'補助摘要', type:'string'},
          {name:'借方科目', type:'string',alias: ['借方勘定科目','借方科目名称']},
          {name:'借方補助', type:'string',alias: ['借方補助科目','借方補助科目名称']},
          {name:'借方部門', type:'string', alias: ['借方部門名称']},
          {name:'借方本体', type:'number'},
          {name:'借方税額', type:'number',alias: ['借方税金額','借方消費税']},
          {name:'借方金額', type:'number'},
          {name:'貸方科目', type:'string',alias: ['貸方勘定科目','貸方科目名称']},
          {name:'貸方補助', type:'string',alias: ['貸方補助科目','貸方補助科目名称']},
          {name:'貸方部門', type:'string', alias: ['貸方部門名称']},
          {name:'貸方本体', type:'number'},
          {name:'貸方税額', type:'number',alias: ['貸方税金額','貸方消費税']},
          {name:'貸方金額', type:'number'},
          {name:'備考', type:'string'},
        ],
      },
      '勘定科目': {
        note: 'kawazanyoで使用する勘定科目の一覧。ツリー構造のテーブル',
        colDef: [
          {name:'大分類',type:'string',note:'BS/PL上の大分類'},
          {name:'中分類',type:'string',note:'BS/PL上の中分類'},
          {name:'小分類',type:'string',note:'BS/PL上の小分類'},
          {name:'科目名',type:'string',note:'勘定科目名'},
          {name:'CF分類',type:'string',note:"CF上の分類を' > 'で連結"},
        ],
      },
      '過年度一覧': {
        note: '過年度の仕訳日記帳データ(CSV)に関する情報',
        primaryKey: ['年度'],
        colDef: [
          {name:'年度', type:'number', note:'会計年度'},
          {name:'状態', type:'string', note:'未了 or 完了'},
          {name:'パス', type:'string', note:'年度別仕訳日記帳(CSV)へのGoogle Driveのパス'},
          {name:'ID', type:'string', note:'CSVのGoogle Drive上のファイルID'},
          {name:'URL', type:'string', note:'CSVのURL。必ずプレビューで開くよう、IDから導出'},
          {name:'文字コード', type:'string', note:'CSVの文字コード。Shift-JIS(MS932)対応'},
          {name:'ヘッダ', type:'number', note:'CSV上のヘッダ行番号。基底=1'},
          {name:'備考', type:'string', note:''},
          {name:'決算書パス', type:'string', note:'当該会計年度のBS/PL(PDF)へパス'},
          {name:'決算書URL', type:'string', note:'同URL'},
          {name:'頁', type:'number', note:'PDF上でBS/PLが掲載されている頁番号'},
        ],
      },
    },
    tables: {
      '過年度CSV': {def:'kz標準'},
      '勘定科目': {data:  // スプレッドシートのコピペで可。
`大分類	中分類	小分類	科目名	CF分類
資産の部				
	流動資産			
			現金	現金または現金同等物
			普通預金	現金または現金同等物
			売掛金	営業活動によるキャッシュ・フロー > 支払・回収
			前払金	営業活動によるキャッシュ・フロー > 支払・回収
			立替金	営業活動によるキャッシュ・フロー > 支払・回収
			未収金	営業活動によるキャッシュ・フロー > 支払・回収
			預け金	営業活動によるキャッシュ・フロー > 支払・回収
	固定資産			
		有形固定資産		
			建物	投資活動によるキャッシュ・フロー
			建物附属設備	投資活動によるキャッシュ・フロー
			工具器具備品	投資活動によるキャッシュ・フロー
			土地	投資活動によるキャッシュ・フロー
			減価償却累計額	投資活動によるキャッシュ・フロー
		投資その他		
			差入保証金	営業活動によるキャッシュ・フロー > 支払・回収
			長期前払費用	営業活動によるキャッシュ・フロー > 償却
			出資金	投資活動によるキャッシュ・フロー
負債の部				
	流動負債			
			役員借入金	財務活動によるキャッシュ・フロー
			未払金	営業活動によるキャッシュ・フロー > 支払・回収
			前受金	営業活動によるキャッシュ・フロー > 支払・回収
			預り金	営業活動によるキャッシュ・フロー > 支払・回収
			未払法人税等	営業活動によるキャッシュ・フロー > 租税公課
	固定負債			
			長期借入金	財務活動によるキャッシュ・フロー
			預り敷金・保証金	営業活動によるキャッシュ・フロー > 支払・回収
純資産の部				
			資本金	財務活動によるキャッシュ・フロー
			資本剰余金	財務活動によるキャッシュ・フロー
	利益剰余金			
		その他利益剰余金		
			繰越利益剰余金	財務活動によるキャッシュ・フロー
収益の部				
	売上高			
			売上高	営業活動によるキャッシュ・フロー
	営業外収益			
			受取利息	財務活動によるキャッシュ・フロー
			雑収入	営業活動によるキャッシュ・フロー
	特別利益			
			固定資産売却益	投資活動によるキャッシュ・フロー
費用の部				
	売上原価			
	販売費および一般管理費			
			役員報酬	営業活動によるキャッシュ・フロー > 販管費
			給料	営業活動によるキャッシュ・フロー > 販管費
			法定福利費	営業活動によるキャッシュ・フロー > 租税公課
			福利厚生費	営業活動によるキャッシュ・フロー > 販管費
			外注費	営業活動によるキャッシュ・フロー > 販管費
			広告宣伝費	営業活動によるキャッシュ・フロー > 販管費
			会議費	営業活動によるキャッシュ・フロー > 販管費
			交際費	営業活動によるキャッシュ・フロー > 販管費
			寄附金	営業活動によるキャッシュ・フロー > 販管費
			旅費交通費	営業活動によるキャッシュ・フロー > 販管費
			通信費	営業活動によるキャッシュ・フロー > 販管費
			新聞図書費	営業活動によるキャッシュ・フロー > 販管費
			地代家賃	営業活動によるキャッシュ・フロー > 販管費
			水道光熱費	営業活動によるキャッシュ・フロー > 販管費
			修繕費	営業活動によるキャッシュ・フロー > 販管費
			消耗品費	営業活動によるキャッシュ・フロー > 販管費
			事務用品費	営業活動によるキャッシュ・フロー > 販管費
			支払報酬料	営業活動によるキャッシュ・フロー > 販管費
			支払手数料	営業活動によるキャッシュ・フロー > 販管費
			保険料	営業活動によるキャッシュ・フロー > 販管費
			租税公課	営業活動によるキャッシュ・フロー > 租税公課
			諸会費	営業活動によるキャッシュ・フロー > 販管費
			雑費	営業活動によるキャッシュ・フロー > 販管費
			減価償却費	投資活動によるキャッシュ・フロー
			長期前払費用償却	営業活動によるキャッシュ・フロー > 償却
	営業外費用			
			支払利息	財務活動によるキャッシュ・フロー
			貸倒損失	営業活動によるキャッシュ・フロー > 支払・回収
			雑損失	営業活動によるキャッシュ・フロー
	特別損失			
			固定資産売却損	投資活動によるキャッシュ・フロー
	法人税・住民税及び事業税			
			法人税	営業活動によるキャッシュ・フロー > 租税公課
			住民税	営業活動によるキャッシュ・フロー > 租税公課
			事業税	営業活動によるキャッシュ・フロー > 租税公課
			法人税等	営業活動によるキャッシュ・フロー > 租税公課`
      },
      '過年度一覧': {data:  // スプレッドシートのコピペで可。
`年度	状態	パス	ID	URL	文字コード	ヘッダ	備考	決算書パス	決算書URL	頁
2011	完了	ena.kaon > log > fy2012 > 20121107_第1期(2011年度)決算報告 > ena第1期.csv	1vpWci_L2RAKRTd3mq6dc7uJxylx6Qu7u	https://drive.google.com/file/d/1vpWci_L2RAKRTd3mq6dc7uJxylx6Qu7u/preview	MS932	8		ena.kaon > log > fy2012 > 20121107_第1期(2011年度)決算報告 > ena.kaon決算報告書(2011年度).pdf	https://drive.google.com/file/d/1DYuOjpHT1GtPmy0ch5nr4D2b6kj6p7t4/preview	15
2012	完了	ena.kaon > log > fy2013 > 20131111_第2期(2012年度)決算報告 > ena第2期.csv	1-gyWYQHRginZFHNTFfV7BS87Y5HSuezQ	https://drive.google.com/file/d/1-gyWYQHRginZFHNTFfV7BS87Y5HSuezQ/preview	MS932	8		ena.kaon > log > fy2013 > 20131111_第2期(2012年度)決算報告 > ena.kaon決算報告書(2012年度).pdf	https://drive.google.com/file/d/1xFnjstCh9_GIZTkta47F0zIM8zQyN_mj/preview	16
2013	完了	ena.kaon > log > fy2014 > 20141121_第3期(2013年度)決算報告 > ena第3期.csv	1AMafGuIpXPPtga_EODuFsqPlQ2o1LYIx	https://drive.google.com/file/d/1AMafGuIpXPPtga_EODuFsqPlQ2o1LYIx/preview	MS932	8		ena.kaon > log > fy2014 > 20141121_第3期(2013年度)決算報告 > ena.kaon決算報告書(2013年度).pdf	https://drive.google.com/file/d/1kKD1NVW_JiemOodtfKympnq9MlkVf2xA/preview	16
2014	完了	ena.kaon > log > fy2015 > 20151118_第4期(2014年度)決算報告 > ena第4期.csv	1WcRLe7QdFNsJkQYC8O1Nv27xDVaQBLQW	https://drive.google.com/file/d/1WcRLe7QdFNsJkQYC8O1Nv27xDVaQBLQW/preview	MS932	8		ena.kaon > log > fy2015 > 20151118_第4期(2014年度)決算報告 > ena.kaon決算報告書(2014年度).pdf	https://drive.google.com/file/d/1omBSbBnB90bmobBUDgctZcakwSbOcA48/preview	28
2015	完了	share > 税理士法人YFPクレア > log > fy2016 > 20161118_第5期(2015年度)決算報告 > ena第5期改.csv	16sJ66akRZLJJX69PRgHRd0xuH8IE4Uws	https://drive.google.com/file/d/16sJ66akRZLJJX69PRgHRd0xuH8IE4Uws/preview		1	"同一フォルダの「ena第5期.csv」が原本。
ヘッダ行を加え、Shift-JIS -> UTF-8に変更"	share > 税理士法人YFPクレア > log > fy2016 > 20161118_第5期(2015年度)決算報告 > ena.kaon決算報告書(2015年度).pdf	https://drive.google.com/file/d/1sTiljIFDzngLRrnPgjtmhX9ra0VNQdeM/preview	24
2016	完了	share > 税理士法人YFPクレア > log > fy2017 > 20171128_第6期(2016年度)決算報告 > 第6期.csv	1IIqShJen8b0bgKLha2rw7o11gyzuyGUK	https://drive.google.com/file/d/1IIqShJen8b0bgKLha2rw7o11gyzuyGUK/preview	MS932	8		share > 税理士法人YFPクレア > log > fy2017 > 20171128_第6期(2016年度)決算報告 > 決算書類2016.pdf	https://drive.google.com/file/d/1dWX8Oix51_Y3Bo4MW3ClNbb18DG21A6g/preview	19
2017	完了	ena.kaon > log > fy2018 > 20181010_第7期(2017年度)決算 > 決算報告書2017 > 会計データ.csv	1Fx7qByvMp7UMYQWGicNG0Xa8cfxX1y6P	https://drive.google.com/file/d/1Fx7qByvMp7UMYQWGicNG0Xa8cfxX1y6P/preview	MS932	1	"同一フォルダの「会計データ.txt」が原本。
ヘッダ行を追加(文字コードの変更は無し)"	ena.kaon > log > fy2018 > 20181010_第7期(2017年度)決算 > 決算報告書2017 > 決算報告書2017.pdf	https://drive.google.com/file/d/1enHmBfr07mieidfr59ioz1pI85h2Y2hO/preview	2
2018	完了	share > 税理士法人YFPクレア > log > fy2019 > 20191122_会計データ > 仕訳日記帳.csv	1rgxJkm_FTpp6CaJHfBbwlQaohrXl1uq-	https://drive.google.com/file/d/1rgxJkm_FTpp6CaJHfBbwlQaohrXl1uq-/preview	MS932	1		share > 税理士法人YFPクレア > log > fy2019 > 20191126_第8期決算 > 申告書類.pdf	https://drive.google.com/file/d/1i5BMyv31tF0okcs3Ik68yi8lJIbvHznF/preview	31
2019	完了	share > 税理士法人YFPクレア > log > fy2020 > 20201005_2019年度決算 > 20201207申告書決算書元帳データ > 20201207仕訳日記帳(第9期).csv	1czTmfkwuxz2lEIkPUlJ8BZyYWa58J6O9	https://drive.google.com/file/d/1czTmfkwuxz2lEIkPUlJ8BZyYWa58J6O9/preview		1		share > 税理士法人YFPクレア > log > fy2020 > 20201005_2019年度決算 > 20201207申告書決算書元帳データ > 20201207申告書類.pdf	https://drive.google.com/file/d/11X2xH70on4JDo6ZLrIhOfD6y0AXSbwSq/preview	23
2020	完了	share > 税理士法人YFPクレア > log > fy2021 > 20211111_2020年度決算 > 20111111_会計データ > 202010-202109仕訳日記帳.csv	1XV2DuVMLl-X4chu5FLMdq5PD52InnpQ6	https://drive.google.com/file/d/1XV2DuVMLl-X4chu5FLMdq5PD52InnpQ6/preview	MS932	1		share > 税理士法人YFPクレア > log > fy2021 > 20211111_2020年度決算 > 20211202_提出済申告書・決算書・元帳 > 提出済申告書･決算書.pdf	https://drive.google.com/file/d/1a_TC_ureTmYp17P5wokTWe2ZiPJqs0EN/preview	24
2021	完了	share > 税理士法人YFPクレア > log > fy2022 > 20221005_2021年度決算 > 20221107_会計データ > 仕訳日記帳.csv	1w5q6p1bQCGtqui7NN3mJTUuQewVZWYTy	https://drive.google.com/file/d/1w5q6p1bQCGtqui7NN3mJTUuQewVZWYTy/preview		1		share > 税理士法人YFPクレア > log > fy2022 > 20221005_2021年度決算 > 20221128_提出済申告書・決算書・元帳 > 株式会社ena.kaon-2022年9月-決算書.pdf	https://drive.google.com/file/d/1DVY1EcUS1My9U0Tw5DAlOppFT530hH_b/preview	2
2022	完了	share > 税理士法人YFPクレア > log > fy2024 > 2023年度決算 > 20241122会計データ > 仕訳日記帳2023.csv	138k67CeWYZb8grdK8-eFjBMQ5qXjiD3V	https://drive.google.com/file/d/138k67CeWYZb8grdK8-eFjBMQ5qXjiD3V/preview	MS932	1	"以下にも2022年度のCSVがあるが、後から提供された本表左のファイルを採用
share > 税理士法人YFPクレア > log > fy2023 > 20231009_2022年度決算 > 20231214提出済申告書 > 202210-102311仕訳日記帳.csv"	share > 税理士法人YFPクレア > log > fy2023 > 20231009_2022年度決算 > 20231214提出済申告書 > 決算書.pdf	https://drive.google.com/file/d/1kCiQAl6f-nUl9oTO3kLYVF49XGTxEEvV/preview	2
2023	完了	share > 税理士法人YFPクレア > log > fy2024 > 2023年度決算 > 20241122会計データ > 仕訳日記帳2024.csv	1208k0gmxUcTmcqLpTpQUEpBgnPOeWpsW	https://drive.google.com/file/d/1208k0gmxUcTmcqLpTpQUEpBgnPOeWpsW/preview	MS932	1		share > 税理士法人YFPクレア > log > fy2024 > 2023年度決算 > 20241122試算表(確定値) > 株式会社ena.kaon-2024年9月-決算書(20241122).pdf	https://drive.google.com/file/d/1lsXNpNqfK1BQvKshL76wMXUMqAQEb7zd/preview	2`},
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