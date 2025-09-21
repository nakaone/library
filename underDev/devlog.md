# ロードマップ

- underDev/SpreadDb/core.js
  - create tableでpKey設定機能を追加
  - AlaSQLの予約語とSpreadDb.schemaの重複排除
    - SpreadDb.schema.tables -> tableMap
    - SpreadDb.schema.tables.cols -> colMap(予約語columnsと紛らわし)
  - update(append)で更新＋追加機能をテスト ◀いまここ
- underDev/GASutil/test/proto.js
  - SpreadDbの元ソースをlibからunderDevに変更
  - configでファイル一覧に以下項目を追加
      - 修正前：現状(マイドライブ〜所属フォルダ＋現ファイル名)
          移動処理後は修正後(移動先フルパス)
      - 修正後：移動先指定(移動先フルパス＋新ファイル名)
          移動処理後は空欄
      - 結果：処理前は空欄、処理後は修正前
      - 備考
- underDev/GASutil/getFilePropertiesメソッド
  - フルパス情報取得機能追加
- underDev/GASutil/listFilesメソッド
  - シート更新機能を削除
  - テーブル更新はlistFilesで行う
- underDev/GASutil/updateFileListメソッド(新規)
  - シート更新機能をlistFilesからここに移動
- underDev/GASutil/moveFileメソッド(新規)
  - ファイル情報テーブルを元にファイル名変更＋フォルダ移動
  - ファイル情報テーブルを更新(修正前・修正後・結果)
- underDev配下をlibraryに正式登録
  - GASutil
  - Schema
  - SpreadDb
  - underDev/GASutil/test/proto.js内のライブラリ引用元を修正、テスト
- Schema,SpreadDb修正分のkz12iへの影響確認
- kz12pの修正
- kz12sの作成

## 注意事項

- SpreadDb関係の修正はGASutil/test側で行う(∵テストケースが重複、データ共有)

# 20250921

## [bug] SpreadDb.1.2: Parse error on line 1
drop table if exists `ファイル一覧`;create table ファイル一覧 (id string not null,name string,mime string,desc string,url string,viewers string,editors string,created string,updated string,before string,after string,result string,note string) primary key (id)

## [bug] SpreadDb.1.1: pv.schema.tableDef[tableName].primaryKey.join is not a function

# 20250920

## [bug] SpreadDb.1.1: Cannot read properties of undefined (reading 'colDef')

⇒ テストデータの設定ミス

## [bug] SpreadDb.1.3: The number of columns in the range must be at least 1.