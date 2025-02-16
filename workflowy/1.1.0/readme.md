# <a name="5a8dd15033a4">workflowy.js 1.1.0</a>

## workflowy主処理(main)

- 引数
	
	- opml {string} opmlテキスト
		
	- opt {Object}
		
		- opt.root {string} 出力するルート要素のID。必須
			
		- opt.lv {number} body直下を第1レベルとし、MarkDown化の際どのレベルまでheader化するかの指定
			
- 戻り値 {string} opmlから変換されたMarkdownテキスト
	
## 使用上の注意

- ルート要素は必ずIDをworkflowy上の行末に記載<br>
	ex. <code>workflowy.js 1.1.0(5a8dd15033a4)</code>
- opmlは参照先をカバーする範囲で準備
	
- 更新履歴
	
	- 1.1.0 2025/02/07〜16
		
		- 他プログラムの要素も参照可能に<br>
			ex. AuthからSpreadDbのtypedefを参照可能に
		- 参照先要素を参照元以下に展開
			
	- 1.0.0 2025/01/30 - 初版
		
