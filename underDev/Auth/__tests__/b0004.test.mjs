/*
# 依頼内容

localFuncを実行し、以下の項目をテストするVitestソースをb0004.test.mjsとして提供願います。
- 必須引数のいずれかが指定されていない場合はエラーが返る(必須引数全パターンについてテスト)
- 以下の項目がIndexedDBに格納されている
  - memberId: 'dummyID',
  - memberName: 'dummyName',
  - deviceId: crypto.randomUUID(),
  - keyGeneratedDateTime: Date.now(),
  - SPkey: 'dummySPkey',
- 後続処理(authClient.exec)はIndexedDB格納後に実施されている

※以前同趣旨の質問をしたことがありますが、①クラス・関数毎にソースを分離(onLoad.jsから独立)、②クラス・関数にexport文を追加等、内容を変更しているので改めてご教示願います。

# フォルダ構成

```
.
├── __tests__
│   └── b0004.test.mjs ◀これが欲しい
├── deploy
│   └── index.html
├── package-lock.json
├── package.json
├── src
│   ├── client  ◀テスト対象のソースはここ(これ以外のフォルダにあるソースはテスト対象外)
│   │   ├── authClient.mjs
│   │   ├── authClientConfig.mjs
│   │   ├── authConfig.mjs
│   │   ├── index.html
│   │   ├── localFunc.mjs
│   │   └── onLoad.mjs
│   ├── doc
│   └── server
│       └── jsrsasign-all-min.js
├── tmp ◀このフォルダにあるソースはテスト対象外
└── tools
    ├── build.sh
    └── test.sh ◀テスト時はこれを起動(`% ./test.sh`でテスト実行)
```
*/
import { describe, test, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import { authConfig } from "../src/client/authConfig.mjs";
import { authClientConfig } from "../src/client/authClientConfig.mjs";
import { authClient } from "../src/client/authClient.mjs";
import { localFunc } from "../src/client/localFunc.mjs";

// -------------------------------------------
// 1. グローバル依存のモック
// -------------------------------------------

// IndexedDB
beforeAll(() => {
  globalThis.indexedDB = indexedDB;
  globalThis.IDBKeyRange = IDBKeyRange;
});

// crypto.randomUUID
beforeAll(() => {
  vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("UUID-TEST");
});

// Date.now
const FIXED_TIME = 1700000000000;
beforeAll(() => {
  vi.spyOn(Date, "now").mockReturnValue(FIXED_TIME);
});

// dev のモック
beforeAll(() => {
  globalThis.dev = {
    start: () => {},
    step: () => {},
    end: () => {},
    error: (e) => e
  };
});

// DBリセット
beforeEach(() => {
  indexedDB.deleteDatabase("Auth");
});

// -------------------------------------------
// テスト本体
// -------------------------------------------

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

describe("build0004テスト", () => {

  // authClientConfigの必須引数チェック
  const errorCases = [
    [
      { adminName: "x", api: "y" },
      `"adminMail" is not specified.`
    ],
    [
      { adminMail: "x", api: "y" },
      `"adminName" is not specified.`
    ],
    [
      { adminMail: "x", adminName: "y" },
      `"api" is not specified.`
    ]
  ];

  errorCases.forEach(([arg, msg]) => {
    it(`必須引数欠落: ${msg}`, () => {
      const rv = new authClientConfig(arg);
      expect(rv).toBeInstanceOf(Error);
      expect(rv.message).toContain(msg);
    });
  });

});
