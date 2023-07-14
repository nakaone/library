# 関数

| 関数名 | 概要 |
| :-- | :-- |
| [analyzeArg](analyzeArg.md) | コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す |
| [analyzePath](analyzePath.md) | パス名文字列から構成要素を抽出 |
| [mergeDeeply](mergeDeeply.md) | オブジェクトのプロパティを再帰的にマージ |
| [querySelector](querySelector.md) | HTMLの指定CSSセレクタの内容を抽出 |
| [whichType](whichType.md) | 変数の型を判定し、型名を文字列で返す |

# クラス

| クラス名 | 概要 |
| :-- | :-- |
| [TimeTable](TimeTable.md) | HTMLにタイムテーブルを描画する |
| [webScanner](webScanner.md) | 指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す |

# 既存型へのメソッド追加

| 既存型 | メソッド名 | 概要 |
| :-- | :-- | :-- |
| Array | [tabulize](Array_tabulize.md) | Array型の変数に2次元配列からHTMLの表を作成してtable要素として返す |
| Date  | [calc](Date.calc.md) | 指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加 |
| Date  | [toLocale](Date.toLocale.md) | 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加 |