# テスト用サンプル

## No.1
No.1のノート
- 項目1
- 項目2
- No.1.1
	ノート内で[リンク](#a0376dbc8b20)を張ってみた
- No.1.2
	
	- No.1.2の子要素1
		
		- No.1.2の孫要素
			
	- No.1.2の子要素2
		
## No.2。<b>太文字</b>と<span class="colored c-red">赤文字</span>を使用

- <a href="#a0376dbc8b20">No.1.2</a>へのリンク
	
## No.3 : 置換関係

- No.1.2の子要素1
	
	- No.1.2の孫要素
		
- No.1.2の子要素2
	
- [▽]リンク先子要素をリンク元の弟要素として追加
	
- No.1.2の子要素1
	
	- No.1.2の孫要素
		
- No.1.2の子要素2
	
## No.4 : 外部リンク SpreadDb.<a href="#1e80990a7c63">sdbQuery</a>へのリンク
- query {<a href="#7f3649978774">[o]sdbRequest</a>[]} 処理要求,- □timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式),- □userId {string|number}=<a href="#5554e1d6a61d">opt.userId</a> ユーザ識別子(uuid等),- 〇arg {string} 操作関数に渡された引数(データ),- □qSts {string} クエリ単位の実行結果,- 〇num {number} 変更された行数,- 〇result {<a href="#d2f620e47c51">sdbResult</a>[]} レコード単位の実行結果
