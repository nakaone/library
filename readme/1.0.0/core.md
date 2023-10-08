<a name="Readme"></a>

## Readme
コンポーネント一覧の表示

**Kind**: global class  

* [Readme](#Readme)
    * [new Readme(api)](#new_Readme_new)
    * [.edit](#Readme+edit)
    * [.build()](#Readme+build) ⇒ <code>null</code> \| <code>Error</code>
    * [.drawList([list])](#Readme+drawList) ⇒ <code>null</code> \| <code>Error</code>

<a name="new_Readme_new"></a>

### new Readme(api)

| Param | Type | Description |
| --- | --- | --- |
| api | <code>string</code> | スプレッドシートのAPI |

<a name="Readme+edit"></a>

### readme.edit
Readmeを格納しているスプレッドシートを表示

**Kind**: instance property of [<code>Readme</code>](#Readme)  
<a name="Readme+build"></a>

### readme.build() ⇒ <code>null</code> \| <code>Error</code>
スプレッドシートからデータを取得、メンバに格納

**Kind**: instance method of [<code>Readme</code>](#Readme)  

| Param | Type |
| --- | --- |
|  | <code>void</code> | 

<a name="Readme+drawList"></a>

### readme.drawList([list]) ⇒ <code>null</code> \| <code>Error</code>
Readme一覧表示

**Kind**: instance method of [<code>Readme</code>](#Readme)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [list] | <code>Object</code> | <code></code> | 一覧表示するReadmeデータ |

