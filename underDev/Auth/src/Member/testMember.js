/************************************************************
 * 🔹使用例
 ************************************************************/
function testMember() {
  const mng = new Member({ memberList: 'memberList' });

  // 登録 or 更新例
  const member = {
    memberId: 'test@example.com',
    name: 'テスト太郎',
    log: {
      joiningRequest: Date.now(),
      approval: Date.now(),
      joiningExpiration: Date.now() + 1000 * 60 * 60 * 24 * 30
    },
    profile: { name: 'テスト太郎', email: 'test@example.com' },
    device: [{ deviceId: 'device001', model: 'iPhone', platform: 'iOS' }]
  };

  const result = mng.setMember(member);
  Logger.log(result);

  // 検索例
  const one = mng.getMember('test@example.com');
  Logger.log(one);
}
