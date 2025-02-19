# <a name="5623db8515ec">createObject : 定義と所与のオブジェクトから新たなオブジェクトを作成</a>

## 引数

- defs {Object.<string,<a href="#fe8ce0ad1e15">colDef</a>[]>} 項目定義集
	
- [root] {string} 項目定義が階層化されている場合、ルートとなる項目定義名
	
- val {Object} 項目定義により生成されたオブジェクトに上書きする値<br>
	defs未定義の項目は無視
- [addTo] {Object} 追加先オブジェクト<br>
	クラスのメンバに追加する等、新たなオブジェクトではなく既存オブジェクトへの追加の場合に使用
## 戻り値 {Object}

## typedefs

- <a name="fe8ce0ad1e15">colDef {Object} 項目定義</a>
	
	- name {string} 項目名(メンバ名)
		
	- type {string} valueのデータ型<br>
		- 指定が無い場合はノーチェック
		- <a href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof">typeof</a>の戻り値以外の場合、項目定義集に存在する独自データ型と看做す。
		- 配列は不可
	- value {any} 当該項目への設定値<br>
		- typeが独自データ型 ⇒ 設定しない(undefined)
		- type === typeof value ⇒ valueをそのまま設定
		- type == 'function' && typeof value != 'function' ⇒ valueを関数化
		- type != 'function' && typeof value == 'function' ⇒ value(関数)の実行結果を設定。但しvalueは引数不要な関数に限定。
	- [note] {string} 当該項目に関するメモ<br>
		単なるメモ、システムとしては不要。
