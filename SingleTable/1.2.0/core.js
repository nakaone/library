/**
 * @typedef {Object} SingleTableObj
 * @prop {string} className - クラス名(='SingleTable')
 * @prop {string} name - シート名。データを引数で渡し、シートを作成しない場合は空文字列
 * @prop {string} type - 元データ。'sheet' or 'data'
 * @prop {string[]} header - ヘッダ行(項目名欄の並び)
 * @prop {any[][]} raw - 指定シート上の有効データ(二次元配列)。添字=0がヘッダ行になる
 * @prop {Array.Object.<string, any>} data - 項目名：値をメンバとするオブジェクトの配列
 * @prop {number} top - ヘッダ行の行番号(自然数)
 * @prop {number} left - データ領域左端の列番号(自然数)
 * @prop {number} right - データ領域右端の列番号(自然数)
 * @prop {number} bottom - データ領域下端の行番号(自然数)
 */

/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * 
 * - 原則「1シート1テーブル」で運用する
 *   ∵「ヘッダ行として指定した行にデータが存在する範囲がテーブル」として看做されるので、
 *   複数テーブルのつもりでヘッダ行が同じ行番号にあった場合、単一テーブルとして処理される
 * - 表の結合には対応しない(join機能は実装しない)
 * - データ領域右端より左のヘッダ行の空欄は、Col1から連番で欄の名前を採番する
 * - 本クラスのメンバについては[SingleTableObj](#SingleTableObj)参照
 * 
 * #### 参考
 * 
 * - GAS公式 [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=ja)
 * 
 * #### 使用するライブラリ
 * 
 * - convertNotation
 * 
 * #### 将来的検討課題
 * 
 * 1. groupByメソッドの追加
 * 1. ツリー構造であるシートをツリー構造オブジェクトとして出力(Objectizeメソッドの追加)
 */
class SingleTable {










}
