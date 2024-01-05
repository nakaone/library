/**
 * @typedef {Object} SingleTableObject
 * === クラス共通
 * @prop {string} className - クラス名(=SingleTable)
 * @prop {number} [logMode=0] - 0:エラーログ、1:終了ログ、2:開始ログ、4:実行時ログ、以上の論理和
 * @prop {Function} clog - ログモードを判断してコンソールにログを出力
 * @prop {Function} deepcopy - 劣後(dest)オブジェクトに優先(opt)のメンバを追加・上書き
 * 
 * === SingleTable 特有メンバ
 * @prop {string} name - シート名またはA1形式の範囲指定文字列
 * @prop {Spreadsheet} sheet - シートオブジェクト
 * @prop {any[][]} raw - 指定シート上の有効データ(二次元配列)
 * @prop {string[]} header - ヘッダ行(項目名欄の並び)
 * @prop {number} top - ヘッダ行の行番号(自然数)
 * @prop {number} left - データ領域左端の列番号(自然数)
 * @prop {number} right - データ領域右端の列番号(自然数)
 * @prop {number} bottom - データ領域下端の行番号(自然数)
 * @prop {Array.Object.<string, any>} data - 項目名：値をメンバとするオブジェクトの配列
 * 
 * === SingleTable 特有メソッド
 * @prop {Function} convertNotation - 列記号<->列番号(数値)の相互変換
 * @prop {Function} select - 条件に該当するレコード(オブジェクト)を抽出
 * @prop {Function} update - 条件に該当するレコード(オブジェクト)を更新
 * @prop {Function} insert - レコード(オブジェクト)を追加
 * @prop {Function} delete - 条件に該当するレコード(オブジェクト)を削除
 */

/** スプレッドシートに対して参照・変更・削除を行う
 * 
 * - 原則「1シート1テーブル」で運用する
 *   ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
 *   複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
 * - 表の結合には対応しない(join機能は実装しない)
 * - データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
 * 
 * #### 参考
 * - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
 */
class SingleTable {
  // -:: constructor ::-
  // -:: clog ::-
  // -:: lib.deepcopy ::-
  // -:: lib.convertNotation ::-
  // -:: select ::-
  // -:: update ::-
  // -:: insert ::-
  // -:: delete ::-
}