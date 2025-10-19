/**
 * @param {authServerConfig} [authServerConfig]
 */
constructor(authServerConfig = {}) {
  dev.start('Member.constructor', arguments);
  this.config = Object.assign({ memberList: 'memberList' }, authServerConfig);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(this.config.memberList);

  // シートが存在しない場合は新規作成
  if (!sheet) {
    sheet = ss.insertSheet(this.config.memberList);
    const headers = ['memberId', 'name', 'status', 'log', 'profile', 'device', 'note'];
    sheet.appendRow(headers);

    const notes = {
      memberId: 'メンバ識別子（メールアドレスなど）',
      name: '氏名',
      status: 'メンバ状態',
      log: 'MemberLog(JSON文字列)',
      profile: 'MemberProfile(JSON文字列)',
      device: 'MemberDevice[](JSON文字列)',
      note: '備考'
    };
    headers.forEach((h, i) => sheet.getRange(1, i + 1).setNote(notes[h] || ''));
  }

  this.sheet = sheet;
  dev.end();
}
