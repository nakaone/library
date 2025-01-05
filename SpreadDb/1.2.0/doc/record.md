<!--
record {Object|string|Function} 更新する値
-->
【record句の指定方法】
- Object ⇒ appendなら行オブジェクト、updateなら{更新対象項目名:セットする値}
- string ⇒ 上記Objectに変換可能なJSON文字列
- Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
  【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
