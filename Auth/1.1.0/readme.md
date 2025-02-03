===== [fatal] hrefs only: リンク有るのにアンカー未定義の項目
ceffd9e40da5: SpreadDb.query
f3f5e1e469cf: SpreadDb.rv

# Auth 1.1.0

## 概要

### おおまかな流れ

![](doc/summary.svg)

### 処理要求の流れ

![](doc/query.svg)

<details><summary>①要求(クエリ)の作成</summary><img src="doc/query01.svg" /></details>
<details><summary>②ゲストとして実行</summary><img src="doc/query02.svg" /></details>
<details><summary>③アカウントを検証、ユーザとして実行</summary><img src="doc/query03.svg" /></details>
<details><summary>④ログイン処理</summary><img src="doc/query04.svg" /></details>
<details><summary>⑤アカウント不在なら新規登録、要権限ならパスコード入力</summary><img src="doc/query05.svg" /></details>

### 新規登録の流れ

![](doc/registration.svg)

## authClient

## authServer

### 新規登録要求

- 引数
	- arg {Object}
		- email {string}
		- CPkey {string}
- 戻り値 {Object}
	- SPkey {string} サーバ側公開鍵。ゲストの場合は付加しない

### 処理要求(クエリ)

未ログイン時にはログイン要求
- 引数
	- arg {Object}
		- userId {string} ユーザ識別子<br>
			ゲストの場合はundefined
		- token {[SpreadDb.query](#ceffd9e40da5)} SpreadDbのクエリ<br>
			ゲストは平文、ユーザはSP/CSkeyで暗号化＋署名
- 戻り値 {Object}
	- email {string} サーバ側に保存されているユーザのメールアドレス
	- type {string} authClientから渡された引数のデータ型チェックの結果<br>
		新規登録 or ゲスト or 不審者 or ユーザ
	- status {string} authServerで判断されたユーザの状態
	- response {[SpreadDb.rv](#f3f5e1e469cf)} 要求(クエリ)の実行結果

### パスコード入力

- 引数
	- arg {Object}
		- userId {string} ユーザ識別子
		- token {string} 入力されたパスコードをSP/CSkeyで暗号化＋署名
- 戻り値 {Object}

## typedefs

### accounts - アカウント一覧

### device - アカウントに紐付くデバイス毎のアクセス管理

### log - SpreadDbのアクセスログ

### sv - authServerのメンバ

server variables

### cv - authClientのメンバ

## sessionStorage

### userId {string} ユーザ識別子

ゲストの場合はundefined

### email {string} ユーザの連絡先メールアドレス

### CSkey

### CPkey

### SPkey
