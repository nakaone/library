※ToDoは[workflowy](https://workflowy.com/#/ed15b0e99a8d)参照

## 2025/12/05


# 開発履歴

## 2025/11/28

- 旧版移行：spec.md
- 旧版移行：LocalRequest.md
- 旧版移行：LocalResponse.md
- 旧版移行：authIndexedDB.md
- 旧版移行：decryptedRequest.md
- 旧版移行：decryptedResponse.md
- 旧版移行：encryptedRequest.md
- 旧版移行：encryptedResponse.md
- 旧版移行：authResponse.md
- 旧版移行：authRequest.md
- TypeError: Cannot read properties of undefined (reading 'constructor')
- [bug] devTools.errorでstepがでない

## 2025/11/27

- TypeError: Cannot read properties of undefined (reading 'constructor')
  @ MethodDef.evaluate

### 対応済

- [bug] null/Errorでも"not fixed"エラーが発生
- 旧版移行：cryptoClient.md
- 旧版移行：authClientKeys.md ⇒ cryptoClientに統合
- 定義されたデータ型以外も"not fixed"が出る
- ReturnDefで「戻り値はnull|Error」が表現できない
- [bug] cryptoClient.mdのタイトル行が出力されない

## 2025/11/26

### 目標

- [bug] cryptoClient.mdの一部が出力されない
- 旧版移行：cryptoClient.md
- 旧版移行：authClientKeys.md ⇒ cryptoClientに統合

### 対応済

- [bug] main処理終了のメッセージが出ない(main normal end)
- [bug] ProjectDef.outputMD終了後もループが動いている ⇒ 一つ前の派生バグ
  15:07:09.219 [1433] ProjectDef.outputMD normal end
  15:07:09.219 [1426] MethodDef.trimIndent normal end
  15:07:09.219 [1425] ParamsDef.createMd normal end
- devTools: 正常終了時、開始/終了時刻とelaps表示
- devTools導入(ClassDef)
- devTools導入(MembersDef)
- devTools導入(FieldDef)
- devTools導入(MethodsDef)
- devTools導入(MethodDef)
- devTools導入(ParamsDef)
- devTools導入(ReturnsDef)
- devTools導入(ReturnDef)
- devTools導入(ProjectDef)
- devTools導入、BaseDefのみソース修正
- [bug] authClientConfig.mdの一部が出力されない
- 旧版移行：authClientConfig.md
- 旧版移行：authAuditLog.md
- LocalRequest: エラー時の戻り値が未評価
- Error: unregistered type

#### devTools改訂・独自Error導入

- dev.startで引数無しでもOKに
- dev.endで戻り値格納
- trace用stackには引数・戻り値・汎用変数を全て格納、エラー時のみ表示
- dev.stepで変数指定で表示(dev.dump兼用)
- footprintは非表示
- エラーは発生箇所以外表示しない
- ISO8601拡張では無く、hh:mm:ss.nnnで短く表示
- verboseモード搭載
  - エラー以外出力しない
  - 開始・終了時のみ
