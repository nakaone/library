# CSS

| ファイル名 | 概要 |
| :-- | :-- |
| [szLib.css](szLib.css) | 独自作成標準CSS |

# 関数

| 関数名 | 概要 |
| :-- | :-- |
| [analyzeArg](analyzeArg.md) | コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す |
| [analyzePath](analyzePath.md) | パス名文字列から構成要素を抽出 |
| [createElement](createElement.md) | HTMLの要素を生成 |
| [convertCharacters](convertCharacters.md) | 全角英数字は半角、半角カナは全角、ひらがな・カタカナは指定の方に変換 |
| [deserializeRSAKey](deserializeRSAKey.md) | 文字列化されたRSAキーを復元 |
| [embedComponent](embedComponent.md) | テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入 |
| [gSpreadTabulize](gSpreadTabulize.md) | GAS関数jsonRangeの出力からHTMLのテーブルを作成 |
| [jsonRange](jsonRange.md) | Googleスプレッド上で、選択範囲のセル情報をJSON化してmsgBoxに表示 |
| [mergeDeeply](mergeDeeply.md) | オブジェクトのプロパティを再帰的にマージ |
| [objectize](objectize.md) | 階層形式の二次元配列をオブジェクト化 |
| [serializeRSAKey](serializeRSAKey.md) | RSAキーを文字列化 |
| [toolbox](toolbox.md) | Googleスプレッドのメニューに「道具箱」を追加 |
| [querySelector](querySelector.md) | HTMLの指定CSSセレクタの内容を抽出 |
| [whichType](whichType.md) | 変数の型を判定し、型名を文字列で返す |

# クラス

| クラス名 | 概要 |
| :-- | :-- |
| [Auth](Auth.readme.md) | ブラウザで認証を行い、Webアプリから設定情報(config)を取得、後続処理を行う |
| [BurgerMenu](BurgerMenu.md) | HTMLにハンバーガーメニューを作成する |
| [szSheet](szSheet.md) | Googleスプレッドでデータ/行のCRUDを行う擬似クラス |
| [TabMenu](TabMenu.md) | HTMLにタブメニューを作成する |
| [TimeTable](TimeTable.md) | HTMLにタイムテーブルを描画する |
| [webScanner](webScanner.md) | 指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す |

# 既存型へのメソッド追加

| 既存型 | メソッド名 | 概要 |
| :-- | :-- | :-- |
| Array | [tabulize](Array.tabulize.md) | Array型の変数に2次元配列からHTMLの表を作成してtable要素として返す |
| Date  | [calc](Date.calc.md) | 指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加 |
| Date  | [toLocale](Date.toLocale.md) | 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加 |