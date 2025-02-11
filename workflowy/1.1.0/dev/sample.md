# <a name="33a7f77d9c25">テスト用サンプル</a>

## No.1
No.1のノート
- 項目1
- 項目2
- No.1.1
	ノート内で[リンク](#a0376dbc8b20)を張ってみた
- <a name="a0376dbc8b20">No.1.2</a>
	
	- No.1.2の子要素1
		
		- No.1.2の孫要素
			
	- No.1.2の子要素2
		
## No.2。<b>太文字</b>と<span class="colored c-red">赤文字</span>を使用

- <a href="#a0376dbc8b20">No.1.2</a>へのリンク
	
## <a name="88c67383b3db">No.3 : 置換関係</a>

- No.1.2の子要素1
	
	- No.1.2の孫要素
		
- No.1.2の子要素2
	
- [▽]リンク先子要素をリンク元の弟要素として追加
	
- No.1.2の子要素1
	
	- No.1.2の孫要素
		
- No.1.2の子要素2
	
## No.4 : 外部リンク SpreadDb.<a href="#1e80990a7c63">sdbQuery</a>へのリンク
# 外部ライブラリ

<details><summary>sdbQuery {Object[]} 操作要求の内容</summary><a name="1e80990a7c63"></a>


- sdbQuery {Object[]} 操作要求の内容

  ■：引数で渡される項目、□：主処理でcommand系メソッド呼出前に設定される項目、〇：command系メソッドで設定される項目

	- query {<a href="#7f3649978774">[o]sdbRequest</a>[]} 処理要求
		
	- □timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)
		
	- □userId {string|number}=<a href="#5554e1d6a61d">opt.userId</a> ユーザ識別子(uuid等)
		
	- 〇arg {string} 操作関数に渡された引数(データ)
		createならcols、select/update/deleteならwhere、append/schemaなら空白。
		create/appendの追加レコード情報、selectの抽出レコード等はrecordで確認する運用を想定
	- □qSts {string} クエリ単位の実行結果
		正常終了なら"OK"。エラーコードは[エラーの種類](#60cbb24d684c)参照。
	- 〇num {number} 変更された行数
		create: 初期値の行数、append:追加行数、update:変更行数、delete:削除行数、select:抽出行数、schema:0(固定)
	- 〇result {<a href="#d2f620e47c51">sdbResult</a>[]} レコード単位の実行結果
		
</details>


