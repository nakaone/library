/**
 * b0003.mjs
 * authClient / authClientConfig のコンストラクタ検証テスト
 */
/* プロンプト
localFuncを実行し、authClientインスタンス生成時に以下の条件を満たしているかテストするJestをb0003.jsとして作成して欲しい。
- 必須引数として`{adminMail:"fuga@gmail.com",adminName:"田中一郎",api:'abcdefghijklmnopqrstuvwxyz'}`を与え、authClientConfigインスタンスが返る
- 必須引数のいずれかが指定されていない場合はエラーが返る(必須引数全パターンについてテスト)
- 任意引数として`{systemName:"AuthTest"}`を与えるとthis.systemNameは"Auth"ではなく"AuthTest"になる

=== onLoad.mjs
*/

import {
  authClientConfig
} from '../tmp/onLoad.mjs';

// ---------------------------------------------
// 1. 正常系：必須引数をすべて渡すと authClientConfig を生成できる
// ---------------------------------------------
test('authClientConfig: 必須引数を与えるとインスタンスが返る', () => {

  const arg = {
    adminMail: "fuga@gmail.com",
    adminName: "田中一郎",
    api: "abcdefghijklmnopqrstuvwxyz",
  };

  const inst = new authClientConfig(arg);

  expect(inst).toBeInstanceOf(authClientConfig);
  expect(inst.adminMail).toBe(arg.adminMail);
  expect(inst.adminName).toBe(arg.adminName);
  expect(inst.api).toBe(arg.api);
});


// ---------------------------------------------
// 2. 必須引数が欠ける場合は Error が返る（全パターン）
// ---------------------------------------------
describe('authClientConfig: 必須引数欠落時は Error が返る', () => {

  const base = {
    adminMail: "fuga@gmail.com",
    adminName: "田中一郎",
    api: "abcdefghijklmnopqrstuvwxyz",
  };

  const patterns = [
    { missing: 'adminMail', arg: { adminName: base.adminName, api: base.api }},
    { missing: 'adminName', arg: { adminMail: base.adminMail, api: base.api }},
    { missing: 'api',       arg: { adminMail: base.adminMail, adminName: base.adminName }},
  ];

  patterns.forEach(({missing, arg}) => {

    test(`必須引数 ${missing} が欠けている場合は Error`, () => {

      let rv;
      try {
        rv = new authClientConfig(arg);
      } catch (e) {
        rv = e;
      }

      expect(rv).toBeInstanceOf(Error);
    });

  });

});


// ---------------------------------------------
// 3. 任意引数 systemName が指定されている場合
// ---------------------------------------------
test('authClientConfig: systemName を与えれば this.systemName が上書きされる', () => {

  const arg = {
    adminMail: "fuga@gmail.com",
    adminName: "田中一郎",
    api: "abcdefghijklmnopqrstuvwxyz",
    systemName: "AuthTest"
  };

  const inst = new authClientConfig(arg);

  expect(inst.systemName).toBe("AuthTest");
});
