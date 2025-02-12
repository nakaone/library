# Error: リンク先が見つからない要素

63c52c5262e3
# workflowy.js 1.1.0

## workflowy主処理(main)

- 引数
	
	- option {<a href="#63c52c5262e3">workflowy_option</a>} workflowyの動作設定用オプション指定
		
- 戻り値 {Function} markdown,sampleをメソッドとするクロージャ
	
## markdown() : OPML形式のテキストをマークダウンに変換

## sample() :

## typedefs

- workflowy_option {Object} workflowyの動作設定用オプション指定
	
	- mdHeader {number}=3 body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
		
## readme

- 使用方法
	`node pipe.js aaaaaa xxxxxx n`
	- aaaaaa : 'markdown' or 'sample'
	- xxxxxx : ルート要素のID
	- n : ヘッダとして扱う階層(2 -> h1,h2を作成、以下はliタグで処理)
	
	```
	cat $test/SpreadDb.opml | awk 1 | node $prj/pipe.js markdown 909f842f7a95 3 > $test/<a href="http://SpreadDb.md">SpreadDb.md</a>
	```
- 開発時メモ
	
	- [NG] ■ : リンク元要素をリンク先要素に置換
		リンク先要素がa nameを持っていた場合に重複エラーとなるため
- 更新履歴
	
	- 1.1.0 2025/02/07〜09
		
		- 他プログラムの要素も参照可能に
			ex. AuthからSpreadDbのtypedefを参照可能に
		- 参照先要素を参照元以下に展開
			
	- 1.0.0 2025/01/30 - 初版
		
