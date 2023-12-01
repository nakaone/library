<a name="getActiveCellInfo"></a>

## getActiveCellInfo() ⇒ <code>Object</code> \| <code>Error</code>
アクティブなセル範囲の情報を取得する

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>Error</code> - 戻り値はexampleを参照  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>void</code> | 無し |

**Example**  
- spreadId {string} スプレッド(ファイル)のID
- spreadName {string} スプレッドの名前
- sheetId {number} シートのID
- sheetName {string} シート名
- firstRow {number} 最上行。自然数
- lastRow {number} 最下行
- firstColumn {number} 左端列。自然数
- lastColumn {number} 右端列
- width {number[]} シート上の列の幅(px)
- height {number[]} シート上の行の高さ(px)
- range {Object[][]} セルごとの情報。該当値が無い場合はundefind
  - value {any} セルの値。空欄ならundefined
  - type {string} データ型
  - formula {string} 数式
  - R1C1 {string} R1C1形式の数式
  - note {string} メモ
  - background {string} 背景色
  - format {string} 表示形式
  - fontColor {string} 文字色
  - fontWeight {string} 太さ　[bold/normal]
  - horizontalAlign {string} 水平位置
  - verticalAlign {string} 垂直位置
  - link {Object[]} リンク
    - text {string} リンクが貼ってある文字列
    - url {string} URL

```
{
  "spreadId":"18bH3p9QaRg36L0rIhcWCmopRGewyQ7MYgTcNTsJ1gIY",
  "spreadName":"仕訳日記帳",
  "sheetId":31277711,
  "sheetName":"勘定科目",
  "firstRow":4,
  "lastRow":5,
  "firstColumn":19,
  "lastColumn":21,
  "width":[32,32,127],
  "height":[21,21],
  "range":[[{
    "value":"損益計算書",
    "type":"String",
    "background":"#666666",
    "format":"0.###############",
    "fontColor":"#ffffff",
    "fontWeight":"bold",
    "horizontalAlign":"general-left",
    "verticalAlign":"bottom"
  },{
    "type":"String",
    "background":"#666666",
    "format":"0.###############",
    "fontColor":"#000000",
    "fontWeight":"normal",
    "horizontalAlign":"general",
    "verticalAlign":"bottom"
  },{
    "type":"String",
    "background":"#666666",
    "format":"0.###############",
    "fontColor":"#000000",
    "fontWeight":"normal",
    "horizontalAlign":"general",
    "verticalAlign":"bottom"
  }],[{
    "value":"大",
    "type":"String",
    "background":"#ffffff",
    "format":"0.###############",
    "fontColor":"#000000",
    "fontWeight":"normal",
    "horizontalAlign":"general-left",
    "verticalAlign":"bottom"
  },{
    "value":"中",
    "type":"String",
    "formula":"=\"中\"",
    "R1C1":"=\"中\"",
    "background":"#ffffff",
    "format":"0.###############",
    "fontColor":"#000000",
    "fontWeight":"normal",
    "horizontalAlign":"general-left",
    "verticalAlign":"bottom"
  },{
    "value":"勘定科目",
    "type":"String",
    "note":"赤字は追加した勘定科目",
    "background":"#ffffff",
    "format":"0.###############",
    "fontColor":"#000000",
    "fontWeight":"normal",
    "horizontalAlign":"general-left",
    "verticalAlign":"bottom",
    "link":[{   // 「勘定科目」の内、「勘定」の部分だけリンクが貼られた場合
      "text":"勘定",
      "url":"https://advisors-freee.jp/article/category/cat-big-02/cat-small-04/14503/"
    },{
      "text":"科目"
    }]
  }]]}
```
