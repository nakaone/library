# 関数

| 関数名 | 概要 |
| :-- | :-- |
| [analyzeArg](analyzeArg.md) | コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す |
| [analyzePath](analyzePath.md) | パス名文字列から構成要素を抽出 |
| [mergeDeeply](mergeDeeply.md) | オブジェクトのプロパティを再帰的にマージ |
| [querySelector](querySelector.md) | HTMLの指定CSSセレクタの内容を抽出 |

# クラス

| クラス名 | 概要 |
| :-- | :-- |
| [TimeTable](TimeTable.md) | HTMLにタイムテーブルを描画する |

# 既存型へのメソッド追加

| 既存型 | メソッド名 | 概要 |
| :-- | :-- | :-- |
| Array | [tabulize](Array_tabulize.md) | Array型の変数に2次元配列からHTMLの表を作成してtable要素として返す |
| Date  | [calc](Date.calc.md) | 指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加 |
| Date  | [toLocale](Date.toLocale.md) | 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加 |