/**
 * memberListシート全体を取得
 * @returns {Member[]}
 */
getAllMembers() {
  dev.start('Member.getAllMembers');
  const data = this.sheet.getDataRange().getValues();
  const headers = data[0];
  const members = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const m = {};
    headers.forEach((h, j) => {
      let v = row[j];
      if (['log', 'profile', 'device'].includes(h)) {
        try { v = JSON.parse(v || '{}'); } catch { v = {}; }
      }
      m[h] = v;
    });
    members.push(m);
  }
  dev.end();
  return members;
}
