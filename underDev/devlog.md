# ロードマップ

- underDev/SpreadDb/core.js ◀いまここ
  - create tableでpKey設定機能を追加
  - update(append)で更新＋追加機能をテスト
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

## 注意事項

- SpreadDb関係の修正はGASutil/test側で行う(∵テストケースが重複、データ共有)

# 20250920

## [bug] SpreadDb.1.1: Cannot read properties of undefined (reading 'colDef')

⇒ テストデータの設定ミス

## [bug] SpreadDb.1.3: The number of columns in the range must be at least 1.