<!--
where {Object|Function|string} 対象レコードの判定条件
-->
【where句の指定方法】
- Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
- function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
- string
  - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化。{〜} で囲みreturn文を付与。
  - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値
- その他(Object,function,string以外) ⇒ 項目定義で"primaryKey"を指定した項目の値