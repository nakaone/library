# 概要

typeofを基本にデータ型を判定、同一データ型なら厳密比較を行い、異なるデータ型なら以下のデシジョンテーブルに基づき「なるべく拾う」ように比較する。

ex. `new Date('1965/9/5') = '1965/9/5' = '9-5-1965' = -136458000000 = 'Sun Sep 05 1965 00:00:00 GMT+0900 (日本標準時)'`

- 引数v1のデータ型(縦軸)とv2のデータ型(横軸)でマトリクスをとり(=デシジョンテーブル)、組み合わせ毎にどのように判定するか定義する(=判定式)
- 組み合わせ毎にデータ型の相違を無視するかをオプションで指定可能にする<br>
  ex. v1 = new Date('1965/9/5'), v2 = '1965/9/5'
  - opt.string_date == true -> 文字列・Date型の相違を無視して`true`を返す
  - opt.string_date == false -> 文字列・Date型の相違を無視せず`false`を返す
- 比較対象のデータ型を強制可能にする<br>
  ex. v1 = '1965/9/5', v2 = '9-5-1965'
  - opt.force = null(既定値) -> v1,v2はstring同士で比較して`false`を返す
  - opt.force = 'date' -> v1,v2はdate同士として比較を実行し`true`を返す

# デシジョンテーブル

| v1/v2 | string | number | bigint | boolean | undefined | symbol | function | null | Date | Object | Array |
| :-- | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| string | ① | ② | ③ | ④ | ⑤ | — | ⑥ | ④ | ⑦ | — | — |
| number | ② | ① | ③ | — | — | — | — | — | ⑦ | — | — |
| bigint | ③ | ③ | ① | — | — | — | — | — | ⑧ | — | — |
| boolean | ④ | — | — | ① | — | — | — | — | — | — | — |
| undefined | ⑤ | — | — | — | ① | — | — | — | — | — | — |
| symbol | — | — | — | — | — | ⑥ | — | — | — | — | — |
| function | ⑥ | — | — | — | — | — | ⑥ | — | — | — | — |
| null | ④ | — | — | — | — | — | — | ① | — | — | — |
| Date | ⑦ | ⑦ | ⑧ | — | — | — | — | — | ⑦ | — | — |
| Object | — | — | — | — | — | — | — | — | — | ⑨ | — |
| Array | — | — | — | — | — | — | — | — | — | — | ⑩ |

# 判定式

| No | 名称 | 式 |
| :--: | :-- | :-- |
| ① | 厳密比較 | v1 === v2 |
| ② | 緩い比較 | v1 == v2 |
| ③ | BigInt | BigInt(v1) === BigInt(v2) |
| ④ | lowerCase() | String(v1).toLowerCase() === String(v2).toLowerCase() |
| ⑤ | String | String(v1) === String(v2) |
| ⑥ | toString() | v1.toString() === v2.toString() |
| ⑦ | getTime() | new Date(v1).getTime() === new Date(v2).getTime() |
| ⑧ | getTime(num) | new Date(Number(v1)).getTime() === new Date(Number(v2)).getTime() |
| ⑨ | メンバ再帰 | メンバが一致しているか確認、メンバ毎に再帰 |
| ⑩ | 要素再帰 | 要素数が一致しているか確認、要素毎に再帰 |

<a name="history"></a>

# 改版履歴

- rev.1.0.0 : 2024/02/17 初版
- rev.1.1.0 : 2024/11/20
  - 「データ型が異なる ⇒ 同値では無い」から、異なるデータ型同士でも比較可能になるようパターンを細分化(デシジョンテーブル)
  - データ型はスプレッドシートで使用するnumber,string,boolean,Dateを包含するよう、typeof＋αに変更