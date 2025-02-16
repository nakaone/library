# <a name="33a7f77d9c25">テスト用サンプル</a>

## No.1
No.1のノート
- 項目1
- 項目2
- No.1.1<br>
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

# 【参考】文書化対象外要素へのリンク

- <a name="1e80990a7c63">sdbQuery {Object[]} 操作要求の内容</a><br>
	■：引数で渡される項目、□：主処理でcommand系メソッド呼出前に設定される項目、〇：command系メソッドで設定される項目
	- query {<a href="#7f3649978774">[o]sdbRequest</a>[]} 処理要求
		
	- □timestamp {string}=toLocale(new Date()) 更新日時(ISO8601拡張形式)
		
	- □userId {string|number}=<a href="#5554e1d6a61d">opt.userId</a> ユーザ識別子(uuid等)
		
	- 〇arg {string} 操作関数に渡された引数(データ)<br>
		createならcols、select/update/deleteならwhere、append/schemaなら空白。
		create/appendの追加レコード情報、selectの抽出レコード等はrecordで確認する運用を想定
	- □qSts {string} クエリ単位の実行結果<br>
		正常終了なら"OK"。エラーコードは[エラーの種類](#60cbb24d684c)参照。
	- 〇num {number} 変更された行数<br>
		create: 初期値の行数、append:追加行数、update:変更行数、delete:削除行数、select:抽出行数、schema:0(固定)
	- 〇result {<a href="#d2f620e47c51">sdbResult</a>[]} レコード単位の実行結果
		
- <a name="7f3649978774">SpreadDb_query {Object} SpreadDbへの処理要求</a>
	
	- ■[queryId] {string} SpreadDb呼出元で設定する、クエリ・結果突合用文字列<br>
		未設定の場合は主処理でUUIDを設定
	- ■table {string} 操作対象テーブル名<br>
		全commandで使用
	- ■command {string} 操作名<br>
		全commandで使用。「[commandの種類とrwdos文字列によるアクセス制御](#0055bda95f77)」参照
	- ■[cols] {<a href="#df5b3c98954e">sdbColumn</a>[]} 新規作成シートの項目定義オブジェクトの配列<br>
		command='create'のみで使用
	- ■[<a href="#741ee9383b92">where</a>] {Object|Function|string} 対象レコードの判定条件<br>
		command='select','update','delete'で使用
	- ■[<a href="#58dde3944536">set</a>] {Object|Object[]|string|string[]|Function} 追加・更新する値<br>
		command='create','update','append'で使用
- <a name="df5b3c98954e">sdbColumn {Object} 項目の構造情報</a><br>
	= シート上のメモの文字列
	- name {string} 項目名
		
	- type {string} データ型。string,number,boolean,Date,JSON,UUID
		
	- format {string} 表示形式。type=Dateの場合のみ指定
		
	- options {string} 取り得る選択肢(配列)のJSON表現<br>
		ex. ["未入場","既収","未収","無料"]
	- default {function} 既定値を取得する関数。引数は当該行オブジェクト<br>
		指定の際は必ず<code>{〜}</code> で囲み、return文を付与のこと。
		ex.<code>o => {return toLocale(new Date())}</code>
	- primaryKey {boolean}=false 一意キー項目ならtrue
		
	- unique {boolean}=false primaryKey以外で一意な値を持つならtrue
		
	- auto_increment {bloolean|null|number|number[]}=false 自動採番項目<br>
		null ⇒ 自動採番しない
		boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
		number ⇒ 自動採番する(基数=指定値,増減値=1)
		number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
		object ⇒ {start:m,step:n}形式
	- suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
		
	- note {string} 本項目に関する備考<br>
		ローカル側のcreate table等では使用しない
- <a name="741ee9383b92">where {Object|Function|string} 対象レコードの判定条件</a><br>
	- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
	- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
	- string
	  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。<code>{〜}</code> で囲みreturn文を付与。
	  - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
	- その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値
- <a name="58dde3944536">set {Object|Object[]|string|Function} 更新する値</a><br>
	set句の指定方法
	- Object ⇒ create/appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
	- string ⇒ 上記Objectに変換可能なJSON文字列
	- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
	  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
- <a name="5554e1d6a61d">userId {string}='guest' ユーザの識別子</a><br>
	指定する場合、必ずuserAuthも併せて指定
- <a name="d2f620e47c51">sdbResult {Object} レコード単位の実行結果</a>
	
	- pKey {string} 処理対象レコードの識別子
		
	- rSts {string}='OK' レコード単位での実行結果<br>
		append/updateで重複エラー時は"Duplicate"
	- diff {Object} 当該レコードの変更点<br>
		create : 初期値として追加した行オブジェクト
		select : 抽出された行オブジェクト
		append : 追加された行オブジェクト。Duplicateエラーの場合、重複項目と値
		update : 変更点。{変更された項目名:[変更前,変更後]}
		delete : 削除された行オブジェクト
		schema : 提供された項目定義(sdbColumn[])
