/*
localFuncを実行し、以下の項目をテストするJestおよびtest.shのソースをb0004.mjsとして提供願います。
- 必須引数のいずれかが指定されていない場合はエラーが返る(必須引数全パターンについてテスト)
- 以下の項目がIndexedDBに格納されている
  - memberId: 'dummyID',  // 仮IDはサーバ側で生成
  - memberName: 'dummyName',
  - deviceId: crypto.randomUUID(),
  - keyGeneratedDateTime: Date.now(),
  - SPkey: 'dummySPkey',
- 後続処理(authClient.exec)はIndexedDB格納後に実施されている

=== フォルダ構成
.
├── __tests__       // Jestテストパターン別ソースファイル集
│   └── b0004.mjs
├── archives        // バックアップファイル(Git対象外)
├── deploy          // ブラウザ・GASに実装するソースファイル集
├── devlog.md       // 開発履歴
├── doc             // 仕様書集 ※buildの都度クリアして作成
├── node_modules    // Auth開発関係(Jest)
├── package-lock.json // Jest用設定
├── package.json      // Jest用設定
├── src
│   ├── client      // クライアント側ソースファイル集
│   ├── doc         // 仕様書(原本・パーツ) ※buildの都度、これを加工してdocに出力
│   ├── library     // ライブラリ(シンボリックリンク)
│   └── server      // サーバ側ソースファイル集
├── tmp
│   └── onLoad.mjs  // クライアント側テスト用(index.htmlのonLoad)
└── tools
    ├── archives.sh // バックアップファイルを作成(除、archives/,tmp/)
    ├── build.sh    // ソース・仕様書を作成
    ├── mdTable.sh  // クリップボードのTSVからMarkdownの表を作成
    ├── specify.mjs // クラス定義から各クラスの仕様書を作成
    └── test.sh     // Jestテストを実行
*/
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { localFunc } from '../deploy/onLoad.mjs';

// IndexedDB モック
function createMockIndexedDB() {
  const store = {};
  return {
    put: vi.fn(async (key, value) => {
      store[key] = value;
    }),
    get: vi.fn(async (key) => store[key]),
    _store: store
  };
}

// authClient.exec モック
const mockAuthExec = vi.fn(async () => ({ result: true }));

describe('b0004 localFunc tests', () => {
  let mockDB;

  beforeEach(() => {
    mockDB = createMockIndexedDB();

    localFunc.__setMockDB?.(mockDB);
    localFunc.__setAuthExec?.(mockAuthExec);
  });

  // ---------------------------------------------------------------
  // ① 必須引数の欠落パターン
  // ---------------------------------------------------------------
  const requiredArgs = ['memberName', 'SPkey', 'serverURL'];

  requiredArgs.forEach(arg => {
    test(`必須引数「${arg}」が無い場合はエラー`, async () => {
      const args = {
        memberName: 'dummyName',
        SPkey: 'dummySPkey',
        serverURL: 'https://example.com'
      };
      delete args[arg];

      await expect(localFunc(args)).rejects.toThrow();
    });
  });

  // ---------------------------------------------------------------
  // ② IndexedDB に正しく保存されているか
  // ---------------------------------------------------------------
  test('IndexedDB に必要項目が保存されている', async () => {
    const args = {
      memberName: 'dummyName',
      SPkey: 'dummySPkey',
      serverURL: 'https://example.com'
    };

    const result = await localFunc(args);

    expect(result).toHaveProperty('result', true);

    const saved = mockDB._store['authRecord'];

    expect(saved).toMatchObject({
      memberId: 'dummyID',
      memberName: 'dummyName',
      SPkey: 'dummySPkey'
    });

    expect(typeof saved.deviceId).toBe('string');
    expect(typeof saved.keyGeneratedDateTime).toBe('number');
  });

  // ---------------------------------------------------------------
  // ③ IndexedDB 保存後に authClient.exec が実行されている
  // ---------------------------------------------------------------
  test('authClient.exec は IndexedDB 保存後に呼ばれる', async () => {
    const args = {
      memberName: 'dummyName',
      SPkey: 'dummySPkey',
      serverURL: 'https://example.com'
    };

    await localFunc(args);

    expect(mockDB.put).toHaveBeenCalled();
    expect(mockAuthExec).toHaveBeenCalled();

    const putTime = mockDB.put.mock.invocationCallOrder[0];
    const execTime = mockAuthExec.mock.invocationCallOrder[0];

    expect(putTime).toBeLessThan(execTime);
  });
});
