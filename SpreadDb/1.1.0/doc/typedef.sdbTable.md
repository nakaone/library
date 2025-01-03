- name {string} テーブル名(範囲名)
- account {string} 更新者のアカウント(識別子)
- sheet {[Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)} スプレッドシート内の操作対象シート(ex."master"シート)
- schema {sdbSchema} シートの項目定義
  <!--::$doc/typedef.sdbSchema.md::-->
- values {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
- header {string[]} 項目名一覧(ヘッダ行)
- notes {string[]} ヘッダ行のメモ
- colnum {number} データ領域の列数
- rownum {number} データ領域の行数(ヘッダ行は含まず)