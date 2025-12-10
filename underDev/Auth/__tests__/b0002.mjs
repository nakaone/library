/**
 * Auth/__tests__/b0002.js
 * localFunc() を実行し、result === true ならテスト成功とする。
 */

import { jest } from '@jest/globals';
import {
  authClient,
  localFunc,
} from '../tmp/onLoad.mjs';

// devTools のログ大量出力を抑制
//jest.spyOn(console, 'log').mockImplementation(() => {});
//jest.spyOn(console, 'error').mockImplementation(() => {});

// ==== onLoad() 相当の初期化 ====
// onLoad.js 内ではグローバルに `let auth` があり localFunc() が参照するため
beforeEach(() => {
  //global.auth = new authClient();   // onLoad() と同等
});

// ==== テスト本体 ====
test('localFunc returns result === true', () => {
  const rv = localFunc();   // localFunc を実行
  console.log(`typeof: ${typeof rv}\nisErr: ${rv instanceof Error}\n${JSON.stringify(rv,null,2)}`);

  // localFunc は Error を返す場合もあるので先にチェック
  expect(rv).not.toBeInstanceOf(Error);
  expect(rv).toHaveProperty('result');

  // ここが true ならテスト成功
  expect(rv.result).toBe(true);
});
