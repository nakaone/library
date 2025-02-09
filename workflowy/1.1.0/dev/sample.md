{"id":"X000001","children":["X000002","X000016","33a7f77d9c25"],"depth":1,"text":"workflowy : workflowy(OPML)をmarkdown文書に変換","link":[],"note":"","href":[],"parent":null}
{"id":"X000002","children":["X000003"],"depth":2,"text":"1.0.0","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"X000003","children":["X000004","X000009"],"depth":3,"text":"typedefs","link":[],"note":"","href":[],"parent":"X000002"}
{"id":"X000004","children":["X000005","X000008"],"depth":4,"text":"opmlXML {Object} require('xml-js').xml2json()によるopml処理により生成されるオブジェクト","link":[],"note":"<a href=\"https://www.npmjs.com/package/xml-js\">https://www.npmjs.com/package/xml-js</a>","href":[],"parent":"X000003"}
{"id":"X000005","children":["X000006"],"depth":5,"text":"declaration {Object}","link":[],"note":"","href":[],"parent":"X000004"}
{"id":"X000006","children":["X000007"],"depth":6,"text":"attributes {Object}","link":[],"note":"","href":[],"parent":"X000005"}
{"id":"X000007","children":[],"depth":7,"text":"version {string} XMLバージョン","link":[],"note":"","href":[],"parent":"X000006"}
{"id":"X000008","children":[],"depth":5,"text":"elements {Object[]} head,body他の子要素","link":[],"note":"","href":[],"parent":"X000004"}
{"id":"X000009","children":["X000010","X000011","X000012","X000013"],"depth":4,"text":"opmlObj {Object} opmlの一行分のオブジェクト","link":[],"note":"","href":[],"parent":"X000003"}
{"id":"X000010","children":[],"depth":5,"text":"type {string} \"element\"固定","link":[],"note":"","href":[],"parent":"X000009"}
{"id":"X000011","children":[],"depth":5,"text":"name {string} タグ名。\"outline\"のみ対象とする","link":[],"note":"","href":[],"parent":"X000009"}
{"id":"X000012","children":[],"depth":5,"text":"elements {opmlObj[]} 子要素となるOPML一行分のオブジェクト","link":[],"note":"","href":[],"parent":"X000009"}
{"id":"X000013","children":["X000014","X000015"],"depth":5,"text":"attributes {Object}","link":[],"note":"","href":[],"parent":"X000009"}
{"id":"X000014","children":[],"depth":6,"text":"text {striing} 表題のinnerHTML","link":[],"note":"- 逆参照は\"n Backlinks\"","href":[],"parent":"X000013"}
{"id":"X000015","children":[],"depth":6,"text":"_note {string} ノートのinnerHTML","link":[],"note":"- 改行は'\\n'","href":[],"parent":"X000013"}
{"id":"X000016","children":["X000017","X000021","X000022","X000023","X000026"],"depth":2,"text":"1.1.0","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"X000017","children":["X000018","X000020"],"depth":3,"text":"workflowy主処理(main)","link":[],"note":"","href":[],"parent":"X000016"}
{"id":"X000018","children":["X000019"],"depth":4,"text":"引数","link":[],"note":"","href":[],"parent":"X000017"}
{"id":"X000019","children":[],"depth":5,"text":"option {<a href=\"#63c52c5262e3\">workflowy_option</a>} workflowyの動作設定用オプション指定","link":[["<a href=\"https://workflowy.com/#/63c52c5262e3\">workflowy_option</a>","63c52c5262e3","workflowy_option"]],"note":"","href":[["63c52c5262e3"]],"parent":"X000018"}
{"id":"X000020","children":[],"depth":4,"text":"戻り値 {Function} markdown,sampleをメソッドとするクロージャ","link":[],"note":"","href":[],"parent":"X000017"}
{"id":"X000021","children":[],"depth":3,"text":"markdown() : OPML形式のテキストをマークダウンに変換","link":[],"note":"","href":[],"parent":"X000016"}
{"id":"X000022","children":[],"depth":3,"text":"sample() : ","link":[],"note":"","href":[],"parent":"X000016"}
{"id":"X000023","children":["X000024"],"depth":3,"text":"typedefs","link":[],"note":"","href":[],"parent":"X000016"}
{"id":"X000024","children":["X000025"],"depth":4,"text":"workflowy_option {Object} workflowyの動作設定用オプション指定","link":[],"note":"","href":[],"parent":"X000023"}
{"id":"X000025","children":[],"depth":5,"text":"mdHeader {number}=3 body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定","link":[],"note":"","href":[],"parent":"X000024"}
{"id":"X000026","children":["X000027","X000028"],"depth":3,"text":"readme","link":[],"note":"","href":[],"parent":"X000016"}
{"id":"X000027","children":[],"depth":4,"text":"使用方法","link":[],"note":"`node pipe.js markdown n`\n\n\"markdown\"は固定。nはヘッダとして扱う階層(2 -> h1,h2を作成、以下はliタグで処理)\n\n```\ncat $test/SpreadDb.opml | awk 1 | node $prj/pipe.js markdown 3 > $test/<a href=\"http://SpreadDb.md\">SpreadDb.md</a>\n```","href":[],"parent":"X000026"}
{"id":"X000028","children":["X000029","X000032"],"depth":4,"text":"更新履歴","link":[],"note":"","href":[],"parent":"X000026"}
{"id":"X000029","children":["X000030","X000031"],"depth":5,"text":"1.1.0 2025/02/07","link":[],"note":"","href":[],"parent":"X000028"}
{"id":"X000030","children":[],"depth":6,"text":"他プログラムの要素も参照可能に","link":[],"note":"ex. AuthからSpreadDbのtypedefを参照可能に","href":[],"parent":"X000029"}
{"id":"X000031","children":[],"depth":6,"text":"参照先要素を参照元以下に展開","link":[],"note":"","href":[],"parent":"X000029"}
{"id":"X000032","children":[],"depth":5,"text":"1.0.0 2025/01/30 - 初版","link":[],"note":"","href":[],"parent":"X000028"}
{"id":"33a7f77d9c25","children":["X000033","X000038","X000040","X000044"],"depth":2,"text":"<a name=\"33a7f77d9c25\">テスト用サンプル</a>","link":[],"note":"","href":[],"parent":"X000001"}
{"id":"X000033","children":["X000034","a0376dbc8b20"],"depth":3,"text":"No.1","link":[],"note":"No.1のノート\n- 項目1\n- 項目2","href":[],"parent":"33a7f77d9c25"}
{"id":"X000034","children":[],"depth":4,"text":"No.1.1","link":[],"note":"ノート内で[リンク](#a0376dbc8b20)を張ってみた","href":["a0376dbc8b20"],"parent":"X000033"}
{"id":"a0376dbc8b20","children":["X000035","X000037"],"depth":4,"text":"<a name=\"a0376dbc8b20\">No.1.2</a>","link":[],"note":"","href":[],"parent":"X000033"}
{"id":"X000035","children":["X000036"],"depth":5,"text":"No.1.2の子要素1","link":[],"note":"","href":[],"parent":"a0376dbc8b20"}
{"id":"X000036","children":[],"depth":6,"text":"No.1.2の孫要素","link":[],"note":"","href":[],"parent":"X000035"}
{"id":"X000037","children":[],"depth":5,"text":"No.1.2の子要素2","link":[],"note":"","href":[],"parent":"a0376dbc8b20"}
{"id":"X000038","children":["X000039"],"depth":3,"text":"No.2。<b>太文字</b>と<span class=\"colored c-red\">赤文字</span>を使用","link":[],"note":"","href":[],"parent":"33a7f77d9c25"}
{"id":"X000039","children":[],"depth":4,"text":"<a href=\"#a0376dbc8b20\">No.1.2</a>へのリンク","link":[["<a href=\"https://workflowy.com/#/a0376dbc8b20\">No.1.2</a>","a0376dbc8b20","No.1.2"]],"note":"","href":[["a0376dbc8b20"]],"parent":"X000038"}
{"id":"X000040","children":["X000041","X000042","X000043"],"depth":3,"text":"No.3 : 置換関係","link":[],"note":"","href":[],"parent":"33a7f77d9c25"}
{"id":"X000041","children":[],"depth":4,"text":"<a href=\"https://workflowy.com/#/a0376dbc8b20\">[■]リンク先</a>でリンク元を置換(リンク先子要素も追加)","link":[["<a href=\"https://workflowy.com/#/a0376dbc8b20\">[■]リンク先</a>","a0376dbc8b20","[■]リンク先"]],"note":"","href":[],"parent":"X000040"}
{"id":"X000042","children":[],"depth":4,"text":"<a href=\"https://workflowy.com/#/a0376dbc8b20\">[▼]リンク先</a>子要素でリンク元を置換","link":[["<a href=\"https://workflowy.com/#/a0376dbc8b20\">[▼]リンク先</a>","a0376dbc8b20","[▼]リンク先"]],"note":"","href":[],"parent":"X000040"}
{"id":"X000043","children":[],"depth":4,"text":"<a href=\"https://workflowy.com/#/a0376dbc8b20\">[▽]リンク先</a>子要素をリンク元の弟要素として追加","link":[["<a href=\"https://workflowy.com/#/a0376dbc8b20\">[▽]リンク先</a>","a0376dbc8b20","[▽]リンク先"]],"note":"","href":[],"parent":"X000040"}
{"id":"X000044","children":[],"depth":3,"text":"No.4 h1指定","link":[],"note":"","href":[],"parent":"33a7f77d9c25"}
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
		
## No.3 : 置換関係
	
- <a name="a0376dbc8b20">No.1.2</a>
		
	- No.1.2の子要素1
			
		- No.1.2の孫要素
				
	- No.1.2の子要素2
			
- No.1.2の子要素1
		
	- No.1.2の孫要素
			
- No.1.2の子要素2
		
- No.1.2の子要素1
		
	- No.1.2の孫要素
			
- No.1.2の子要素2
		
- <a href="https://workflowy.com/#/a0376dbc8b20">[▽]リンク先</a>子要素をリンク元の弟要素として追加
		
## No.4 h1指定
	
