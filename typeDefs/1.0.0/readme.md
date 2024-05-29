# シートイメージ

## primitive

| id | name | type | range | role | note |
| --: | :-- | :-- | :-- | :-- | :-- |
| 0 | root |  |  |  |  |
| 3 | authMenu | class |  |  |  |
| 4 | changeScreen() | method |  |  |  |
| 5 | param |  |  |  |  |
| 6 | returns |  |  |  |  |
| 7 | userId | number | 自然数 | ユーザID |  |
| 8 | arg |  |  |  |  |
| 9 | func | string |  | authServer内部分岐用の機能名 |  |
| 10 | email | string |  | メールアドレス |  |
| 11 | CPkey | string |  | ユーザ公開鍵 |  |
| 12 | updated | string |  | ユーザ公開鍵更新日時 |  |
| 13 | allow | number |  | メニュー開示範囲 |  |
| 14 | createIfNotExist | boolean |  | true:メアドが未登録なら作成 |  |
| 15 | updateCPkey | boolean |  | true:渡されたCPkeyがシートと異なる場合は更新 |  |
| 16 | returnTrialStatus | boolean |  | true:現在のログイン試行の状態を返す |  |
| 17 | passcode | number |  | 入力されたパスコード |  |
| 18 | authServer | function |  | サーバ側主処理 |  |
| 19 | setProperties() | function |  | サーバ側主処理前に実行する事前準備 |  |
| 20 | param | void |  | 引数(無し) |  |
| 21 | returns | void |  | 戻り値(無し) |  |

## relation

| pId | pName | cId | cName | seq | hasChild |
| --: | :-- | :--: | :-- | --: | :-- |
| 0 | root | 3 | authMenu | 3 | true |
| 3 | authMenu | 4 | changeScreen() | 1 | true |
| 4 | changeScreen() | 5 | param | 1 | true |
| 4 | changeScreen() | 6 | returns | 2 | false |
| 5 | param | 7 | userId | 1 | false |
| 5 | param | 8 | arg | 2 | true |
| 8 | arg | 9 | func | 1 | false |
| 8 | arg | 10 | email | 2 | false |
| 8 | arg | 11 | CPkey | 3 | false |
| 8 | arg | 12 | updated | 4 | false |
| 8 | arg | 13 | allow | 5 | false |
| 8 | arg | 14 | createIfNotExist | 6 | false |
| 8 | arg | 15 | updateCPkey | 7 | false |
| 8 | arg | 16 | returnTrialStatus | 8 | false |
| 8 | arg | 17 | passcode | 9 | false |
| 0 | root | 18 | authServer | 2 | false |
| 0 | root | 19 | setProperties() | 1 | true |
| 19 | setProperties() | 20 | param | 1 | false |
| 19 | setProperties() | 21 | returns | 1 | false |

# 更新履歴

- rev.1.0.0 : 2024/05/28 初版作成