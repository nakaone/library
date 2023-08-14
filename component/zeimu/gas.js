/**
 * @typedef {Object} responseObj - 税務定期作業(ローカルhtml)の要求に対して返されるオブジェクト
 * @prop {number} fy - 会計年度
 * @prop {string} last - 前回更新日(ローカルでの差分チェックに使用)
 * @prop {fileInfo[]} files - ファイル属性情報の配列
 * @prop {transportInfo[]} transport - 交通費情報の配列
 */

/**
 * @typedef {Object} fileInfo - ファイル属性情報のオブジェクト
 * @property {string} name - ファイル名
 * @property {string} id - ファイルID
 * @property {string} url - URL
 * @property {string} created - 生成日時(UNIX時刻)
 * @property {string} updated - 最終変更日時(UNIX時刻)
 * @property {string} status - 前回提出分からの状態変化。append/update/delete/steady
 * @property {descObj} desc - 「説明」に設定されたJSON文字列
 */

/**
 * @typedef {Object} descObj - Googleドライブ上のファイル詳細情報内「説明」欄の設定項目
 * @property {string} date - 取引日
 * @property {string} summary - 品名(摘要)
 * @property {string} price - 価格
 * @property {string} method - 支払方法。AMEX, 役員借入金, SMBCから振込, 等
 * @property {string} note - 備考 
 */

/**
 * @typedef {Object} transportInfo - 交通費情報
 * @prop {string} date - 日付
 * @prop {string} perpose - 目的
 * @prop {string} destination - 行先
 * @prop {string} sub - 補助科目
 * @prop {string} path - 経路
 * @prop {number} number - 人数
 * @prop {number} amount - 金額
 * @prop {string} note - 備考
 * @prop {string} status - 前回提出分からの状態変化。append/update/delete/steady
 */

/** 税務定期作業(ローカルhtml)の要求に対して各種証憑データを返す
 * @param {void} - 無し
 * @returns {responseObj} 証憑・交通費情報
 */
function doGet() {
  const data = lib.main();
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  response.setContent(JSON.stringify(data));
  return response;  
}