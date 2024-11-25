SpreadDB 1.0.0

- はじめに
  - 開発の動機 : encryptedQuery対応
    - "log"シートの作成、変更履歴の取得機能
    - append/update時のシート排他制御追加
    - メソッドをSQLベースから変数操作に変換
      > insert -> append
      > 
  - 参考
    - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
  - 注意事項
    - 原則「1シート1テーブル」で運用する
      > ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、正確に範囲を指定しないと単一テーブルとして処理される
    - 表の結合には対応しない(join機能は実装しない)
    - テーブルの途中行への挿入は対応しない(insert機能は実装しない)
    - 【変更】~~データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する~~ ⇒ ヘッダ行の空欄は許容しない
    - メモの形式(項目定義)
      - 項目定義以外の部分は「//」をつける(「/* 〜 */」は非対応)
      - 各項目はカンマでは無く改行で区切る(視認性の向上)
      - JSON.stringifyでの処理を前提とした書き方
        > 各項目をjoin(',')、両端に"{〜}"を加えてJSON.parseしたらオブジェクトになるように記載
  - 将来的導入検討課題
    - ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)
    - groupByメソッドの追加
- class SpreadDB : スプレッド(シート)単位の管理
  - メンバ
    > 以下はconstructor()の引数を除いた、インスタンス内で作成されるメンバ変数
    > 
    - spread {[Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)} スプレッドシートオブジェクト(=ファイル。シートの集合)
    - tables {Object.<string,[sdbTable](https://workflowy.com/#/2caab6afa5b7)>} 操作対象シートの情報。メンバ名はテーブル名。
    - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)} 更新履歴シートオブジェクト
      > tables[this.logSheetName]の別名
      > 
    - constructorの引数「[opt ](https://workflowy.com/#/192d23e7183c)」の各メンバ
  - constructor()
    - 処理概要
      - 引数の既定値設定＋メンバ化、導出項目の計算
        - 引数をメンバ化
        - 導出項目の計算(項目定義関係以外)
        - 項目定義関係の導出項目の計算
        - シート名およびデータ領域の推定
      - 旧：操作対象シートの読み込み
        > 以下は操作対象シートが未作成の場合の処理
        - 引数に行オブジェクト配列が存在
        - 引数にシートイメージが存在
        - シートも行オブジェクトもシートイメージも無し
      - 操作対象シートの読み込み
        > | No | シート | メモ | cols | data | raw | → | ヘッダ部 | データ部 | メモ | cols | 備考 |
        > | --: | :-- | :--: | :--: | :--: | :--: | :--: | :-- | :-- | :-- | :-- | :-- |
        > | 1 | 作成済 | 有 | — | — | — | → | — | — | — | メモで更新 | colsよりメモを優先(∵シートの手動修正はソース修正より容易)<br>項目数・項目名が一致しているか、併せて確認 |
        > | 2 | 作成済 | 無 | 有 | — | — | → | — | — | colsから作成 | — |  |
        > | 3 | 作成済 | 無 | 無 | — | — | → | — | — | 空メモを作成 | ヘッダから作成 | typeは最初に出てきた有効値のデータ型 |
        > | 4 | 未作成 | — | 有 | 有 | — | → | colsから作成 | dataから作成 | colsから作成 | — |  |
        > | 5 | 未作成 | — | 有 | 無 | 有 | → | colsから作成 | rawから作成 | colsから作成 | — | ヘッダとraw[0]が不一致ならヘッダ優先 |
        > | 6 | 未作成 | — | 有 | 無 | 無 | → | colsから作成 | — | colsから作成 | — |  |
        > | 7 | 未作成 | — | 無 | 有 | — | → | dataから作成 | dataから作成 | 空メモを作成 | dataから作成 | typeは最初に出てきた有効値のデータ型 |
        > | 8 | 未作成 | — | 無 | 無 | 有 | → | raw[0]から作成 | rawから作成 | 空メモを作成 | rawから作成 | typeは最初に出てきた有効値のデータ型 |
        > | 9 | 未作成 | — | 無 | 無 | 無 | → |  |  |  |  | エラー |
        - シート未作成ならthis.data/rawからシート作成
          > this.data > this.rawで作成、いずれも無ければエラー
        - ヘッダ行の属性メモが未作成なら作成
          > this.colsから作成。this.colsが存在しないならデータから作成
          > 
          > 属性メモは[cols](https://workflowy.com/#/7f319f47ac74)のname属性を除く各項目を改行で並べたもの。項目名は手動修正を容易にするため省略しない。以下はサンプル
          > - type: "string"
          > - format: "yyyy/MM"
          > - default: "未入場"
          > - unique: false
          > - auto_increment: false
          > - suffix: ""
          > - note: "これはサンプルです"
          > 
          > this.colsが存在しない場合、type属性は最初に出現する有意値(※)のデータ型とする。
          > ※JavaScriptのif文でfalseとなる0,空文字列,false,null,undefined,NaN【以外】の値
          > 
          > getValues()の戻り値となるデータ型
          > - String -> string or JSON
          > - Number
          > - Date
          > - Boolean
          > 参考：セルのデータ型 「Google公式 Class Range [getValue]([https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja#getvalue)」](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=ja#getvalue)%E3%80%8D)
          > 
          > データ型をどのように判断するかは保留。テストして判断する
          > 
        - 属性メモからcolsを更新
        - 
        - 
        - シート未作成
          - 属性メモが存在
          - this.dataが存在
          - this.rawが存在
        - かつ属性メモも存在
        - シート作成済かつ属性メモは不在
        - 操作対象シートが未作成の場合
      - 指定有効範囲の特定
        - 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
        - ヘッダ行番号以下の有効範囲(行)をv.rawに取得
        - ヘッダ行と項目定義の突き合わせ
        - 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
        - this.raw/dataにデータをセット
      - "log"シート不在なら作成
      - this.data取得後に導出可能になる項目の計算
        - this.uniqueの作成
        - this.auto_incrementの作成
    - 引数
      - tables {string|string[]|Object|Object[]} 変更履歴を除く操作対象領域情報。stringならnameと看做す
        - name {string} 範囲名。スプレッドシート内で一意
        - [range] {string} 対象データ範囲のA1記法。省略時はnameを流用、セル範囲指定は無しと看做す
        - [cols] {[sdbColumn](https://workflowy.com/#/9d48890fea1a)[]} 新規作成シートの項目定義オブジェクトの配列
        - [values] {Object[]|Array[]} 行オブジェクトまたはシートイメージ
        - 1 Backlink
          - SpreadDB.constructor()の引数[tables](https://workflowy.com/#/a7d1ffb1babb)のメンバ
      - opt {Object}={}
        - outputLog {boolean}=true ログ出力しないならfalse
        - logSheetName {string}='log' 更新履歴テーブル名
        - account {number|string}=null 更新者のアカウント
        - maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
        - interval {number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
        - 1 Backlink
          - constructorの引数「[opt ](https://workflowy.com/#/192d23e7183c)」の各メンバ
    - 戻り値 {SingleTable|Error}
  - transact() : シートの操作
    - 概要
      - テーブルに排他制御をかける
        > 参考：[GASの排他制御について](https://note.com/tiger_oshima/n/nd727a9cd0641)
      - append/update/deleteを呼び出し、結果をログ(変数)に記録
      - (this.outputLog=trueなら)ログ(変数)を更新履歴シートに記録
      - テーブルの排他制御を解除
    - 引数
      - trans {Object[]} 以下のメンバを持つオブジェクト(の配列)
        - name {string} 更新対象範囲名
          > ≒シート名
        - action {string} 操作内容
          > "append", "update", "delete"のいずれか
        - arg {Object|Object[]} append/update/deleteの引数
      - opt {Object} 以下のメンバを持つオブジェクト
        > 自分の参加者情報更新に合わせて他者が更新した参加者情報や掲示板情報を取得したい等、通常のCRUDに付随して更新履歴オブジェクトの取得も可能にする。
        > 
        - getLogFrom {string|number|Date}=null 取得する更新履歴オブジェクトの時刻指定
          > 既定値(null)ではgetLogは行われない。全件取得の場合は明示的に設定(ex.0,1970/1/1)
          > new Date(opt.getLogFrom)より後の履歴を対象とする(同一時刻は含まない)
          > 
        - getLogOption {Object} getLogFrom≠nullの場合、getLogのオプション
    - 戻り値
      - getLogForm=nullの場合、[更新履歴オブジェクト](https://workflowy.com/#/9af4f6b59860)の==配列==
      - getLogForm≠nullの場合、以下のメンバを持つ==オブジェクト==
        - result {[Object](https://workflowy.com/#/9af4f6b59860)[]} 更新対象または指定時刻以降の更新履歴オブジェクトの配列
        - data {[Object](https://workflowy.com/#/54d79b8c2df6)} getLogの戻り値
  - getLog() : 指定時刻からの更新履歴を取得
    - 引数
      - datetime {string}=null Date型に変換可能な日時文字列
        > nullの場合はログ全件を対象とする
      - opt {Object}={} オプション
        - cols {boolean} 各項目の定義集も返す
          > 既定値trueだがdatetime≠nullの場合は既定値false
          > 
        - excludeErrors {boolean}=true エラーログを除く
        - simple {boolean}=true 戻り値のログ情報の項目を絞り込む
    - 戻り値
      - lastReference {string} ログ取得日時(サーバ側時刻)
      - [cols] {Object.<string,[Object](https://workflowy.com/#/9d48890fea1a)[]>} 領域名をメンバ名とする項目定義集
      - [log] {[Object](https://workflowy.com/#/9af4f6b59860)[]} (opt.==simple=false==の場合の)指定時刻以降のログ情報
      - [log] {Object[]} (opt.==simple=true==の場合の)指定時刻以降のログ情報
        > DBミラーリングに必要な最小限のログ情報
        - range {string} 更新対象となった範囲名(テーブル名)
        - action {string} 'append','update','delete'のいずれか
        - record {Object.<string,any>} 更新後の行オブジェクト
          > action='delete'の場合、削除されたレコード
      - 1 Backlink
        - data {[Object](https://workflowy.com/#/54d79b8c2df6)} getLogの戻り値
- class sdbTable : テーブル単位の管理
  > シート内に複数のテーブルを持つ場合も有るので、「シート」内の対象範囲を「テーブル」と呼称する。
  - メンバ
    > 未設定かを判断するため、初期値は原則nullとする
    - spread {Spreadsheet} スプレッドシートオブジェクト
    - name {string} テーブル名(範囲名)
    - range {string} A1記法の範囲指定
      > 未指定の場合、name属性のシート名でセル範囲無しと解釈する。
    - account {string} 更新者のアカウント(識別子)
    - sheetName {string} シート名
      > rangeから導出される項目。
    - sheet {[Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja)} スプレッドシート内の操作対象シート(ex."master"シート)
    - schema {[sdbSchema](https://workflowy.com/#/4d91eb99d462)} シートの項目定義
    - values {Object[]} 行オブジェクトの配列。`{項目名:値,..}` 形式
    - top {number} ヘッダ行の行番号(自然数)。通常header+1
    - left {number} データ領域左端の列番号(自然数)
    - right {number} データ領域右端の列番号(自然数)
    - bottom {number} データ領域下端の行番号(自然数)
    - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)}=null 更新履歴シートオブジェクト。更新履歴を残さない場合null
    - 4 Backlinks
      - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)}=null 更新履歴シートオブジェクト。更新履歴を残さない場合null
      - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)}=null 更新履歴シートオブジェクト。更新履歴を残さない場合null
      - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)} 更新履歴シートオブジェクト
        > tables[this.logSheetName]の別名
        > 
      - tables {Object.<string,[sdbTable](https://workflowy.com/#/2caab6afa5b7)>} 操作対象シートの情報。メンバ名はテーブル名。
  - constructor()
    - 概要
      - 'range'から対象範囲絞り込み
      - shemaの作成
        > シート > arg.cols > arg.values
      - valuesの作成
        > シート > arg.values
      - シート未作成なら新規作成
      - ヘッダ行の項目定義メモを更新
    - 引数 : 以下メンバを持つオブジェクト
      - SpreadDB.constructor()の引数[tables](https://workflowy.com/#/a7d1ffb1babb)のメンバ
      - spread {SpreadSheet} スプレッドシートのオブジェクト
      - log {[sdbTable](https://workflowy.com/#/2caab6afa5b7)}=null 更新履歴シートオブジェクト。更新履歴を残さない場合null
      - account {number|string}=null 更新者のアカウント
  - append() : シートに新規行を追加
    - 処理概要
      - 追加レコードを順次チェック
        > 項目チェックはupdateと重複、sdbTable.checkRecord()として別だしした方が良いかも
        > 
        - pkey or uniqueのチェック、存在していれば失敗の配列に加えて追加対象から除外
        - auto_increment属性を持つ項目は採番
          > 値指定が有り、かつ既存でなければそれを採用
          > 
        - defaultの値をセット
        - 
          - 更新レコードの更新対象項目についてチェック
            > チェック内容は「[追加レコードを順次チェック](https://workflowy.com/#/bc5edf4476e4)」を参照
      - レコードの追加
        - 追加するレコードをシートイメージ(二次元配列)に変換
        - 配列をシートに追加
        - this.bottomの書き換え
    - 引数
      - record {Object.<string,string|number|boolean|Date>[]} 追加対象オブジェクト(の配列)
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
  - update() : シートの既存行を変更
    - 処理概要
      - 更新レコードの更新対象項目についてチェック
        > チェック内容は「[追加レコードを順次チェック](https://workflowy.com/#/bc5edf4476e4)」を参照
      - レコードの更新
        - 更新するレコードをシートイメージ(二次元配列)に変換
    - 引数
      - trans {Object|Object[]} 以下のメンバを持つオブジェクト(の配列)
        - where {function|object|string|number|boolean|Date} 対象レコードの判定条件
          > 形式は[functionalizeの引数](https://workflowy.com/#/7e86d9e8cd81)参照
          > 
        - record {Object|Function} 更新する値
          - Object ⇒ {更新対象項目名:セットする値}
          - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
            > 【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
  - delete() : シートの既存行を削除
    - 処理概要
      - 削除レコードについてチェック
        - unique項目についてリストから削除
      - シートからレコードを削除
        - 対象行以下のセルを上にシフト
        - this.bottomの書き換え
    - 引数
      - where {function|object|string|number|boolean|Date} 対象レコードの判定条件
        > 形式は[functionalizeの引数](https://workflowy.com/#/7e86d9e8cd81)参照
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
  - functionalize() : where句のオブジェクト・文字列を関数化
    - 引数
      - arg {function|object|string|number|boolean|Date} 関数化対象
        - Object ⇒ {キー項目名:値} or {key:キー項目名, value: キー項目の値}
          > {キー項目名:値}形式でキー項目が複数有る場合、全てを満たす(and条件)とする
          > 
        - Function ⇒ 行オブジェクトを引数に、対象ならtrueを返す関数
        - その他 ⇒ 項目定義で"primaryKey"指定された項目の値
        - 2 Backlinks
          - where {function|object|string|number|boolean|Date} 対象レコードの判定条件
            > 形式は[functionalizeの引数](https://workflowy.com/#/7e86d9e8cd81)参照
          - where {function|object|string|number|boolean|Date} 対象レコードの判定条件
            > 形式は[functionalizeの引数](https://workflowy.com/#/7e86d9e8cd81)参照
            > 
    - 戻り値 {function} 該当行か判断する関数
- class sdbSchema : テーブルの構造情報
  - メンバ
    - cols {[sdbColumn](https://workflowy.com/#/fa11531c0866)[]} 項目定義オブジェクトの配列
    - primaryKey {string}='id' 一意キー項目名
    - unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報
      > メンバ名はprimaryKey/uniqueの項目名
      > 
    - auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報
      > メンバ名はauto_incrementの項目名
      > 
      - base {number} 基数
      - step {number} 増減値
      - current {number} 現在の最大(小)値
        > currentはsdbTableインスタンスで操作する。
    - defaultRow {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
    - 1 Backlink
      - schema {[sdbSchema](https://workflowy.com/#/4d91eb99d462)} シートの項目定義
  - constructor()
    - 概要
      > メモ > arg.schema > arg.headerから作成。
      > 
    - 引数
      - cols {[sdbColumn](https://workflowy.com/#/fa11531c0866)[]} 項目定義オブジェクトの配列
      - header {string[]} ヘッダ行のシートイメージ(=項目名一覧)
      - notes {string[]} 項目定義メモの配列
      - values {Object[]} 初期データとなる行オブジェクトの配列
- class sdbColumn : 項目の構造情報
  - メンバ : typedef()で定義された各項目
  - static typedef() : 項目定義オブジェクトで定義する内容(項目の属性)を返す
    > 以下の項目の初期値は原則nullとする(∵未設定かを判断を容易にするため)
    > 
    - name {string} 項目名
    - type {string} データ型。string,number,boolean,Date,JSON,UUID
    - format {string} 表示形式。type=Dateの場合のみ指定
    - options {string} 取り得る選択肢(配列)のJSON表現
      > ex. ["未入場","既収","未収","無料"]
    - default {any} 既定値
    - primaryKey {boolean}=false 一意キー項目ならtrue
    - unique {boolean}=false primaryKey以外で一意な値を持つならtrue
    - auto_increment {bloolean|null|number|number[]}=false 自動採番項目
      > null ⇒ 自動採番しない
      > boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
      > number ⇒ 自動採番する(基数=指定値,増減値=1)
      > number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
    - suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
    - note {string} 本項目に関する備考。create table等では使用しない
    - 
      - [cols] {Object.<string,[Object](https://workflowy.com/#/9d48890fea1a)[]>} 領域名をメンバ名とする項目定義集
      - defs {[Object[]](https://workflowy.com/#/9d48890fea1a)} (sdbSchema.typedefで定義した)項目の属性
      - [cols] {[sdbColumn](https://workflowy.com/#/9d48890fea1a)[]} 新規作成シートの項目定義オブジェクトの配列
      - arg {[Object](https://workflowy.com/#/9d48890fea1a)|string} ①sdbColumn形式のオブジェクト、②項目定義メモ、③項目名のいずれか
  - constructor()
    - 引数
      - arg {[Object](https://workflowy.com/#/9d48890fea1a)|string} ①sdbColumn形式のオブジェクト、②項目定義メモ、③項目名のいずれか
      - defs {[Object[]](https://workflowy.com/#/9d48890fea1a)} (sdbSchema.typedefで定義した)項目の属性
  - str2obj() : 項目定義メモの文字列(または項目名)から項目定義オブジェクトを作成
    - 引数
      - arg {string} 項目定義メモの文字列、または項目名
    - 戻り値 : {Object} 項目定義オブジェクト
  - getNote() : 項目定義メモの文字列を作成
    - 引数 : 以下のメンバを持つオブジェクト
      - undef {boolean}=true 未定義の項目もコメントとして記載
      - defined {boolean}=false 定義済項目もデータ型・説明文をコメントとして記載
    - 戻り値 : 項目定義メモの文字列
  - 
    - cols {[sdbColumn](https://workflowy.com/#/fa11531c0866)[]} 項目定義オブジェクトの配列
    - cols {[sdbColumn](https://workflowy.com/#/fa11531c0866)[]} 項目定義オブジェクトの配列
- class sdbLog : 更新履歴オブジェクト
  - メンバ : typedef()で定義された各項目
  - static typedef() : 更新履歴オブジェクトの項目定義
    - id {UUID} 一意キー項目
    - timestamp {Date} 更新日時
    - account {string|number} uuid等、更新者の識別子
    - range {string} 更新対象となった範囲名(テーブル名)
    - action {string} 操作内容。append/update/delete/getLogのいずれか
    - argument {string} 操作関数に渡された引数
    - result {boolean} true:追加・更新が成功
    - message {string} エラーメッセージ
    - before {JSON} 更新前の行データオブジェクト(JSON)
    - after {JSON} 更新後の行データオブジェクト(JSON)
    - diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
    - 4 Backlinks
      - getLogForm=nullの場合、[更新履歴オブジェクト](https://workflowy.com/#/9af4f6b59860)の==配列==
      - [log] {[Object](https://workflowy.com/#/9af4f6b59860)[]} (opt.==simple=false==の場合の)指定時刻以降のログ情報
      - arg {[Object](https://workflowy.com/#/9af4f6b59860)} 更新履歴オブジェクトの項目定義(id,timestampを除く)
      - result {[Object](https://workflowy.com/#/9af4f6b59860)[]} 更新対象または指定時刻以降の更新履歴オブジェクトの配列
  - constructor()
    - 処理概要
    - 引数
      - arg {[Object](https://workflowy.com/#/9af4f6b59860)} 更新履歴オブジェクトの項目定義(id,timestampを除く)
    - 戻り値
  - 3 Backlinks
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
    - 戻り値 {[sdbLog](https://workflowy.com/#/8b174e2ddc41)[]} 更新結果の配列
