<a name="stringify"></a>

## stringify(variable, opt) ⇒ <code>string</code>
関数他を含め、変数を文字列化
- JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
- 関数はtoString()で文字列化
- シンボルは`Symbol(xxx)`という文字列とする
- undefinedは'undefined'(文字列)とする

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| variable | <code>Object</code> |  | 文字列化対象変数 |
| opt | <code>Object</code> \| <code>boolean</code> |  | booleanの場合、opt.addTypeの値とする |
| opt.addType | <code>boolean</code> | <code>false</code> | 文字列化の際、元のデータ型を追記 |

**Example**  
```
console.log(`l.424 v.td=${stringify(v.td,true)}`)
⇒ l.424 v.td={
  "children":[{
    "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
    "text":"[String]タグ"
  },{
    "attr":{"class":"[String]td"},
    "text":"[String]#md"
  }],
  "style":{"gridColumn":"[String]1/13"},
  "attr":{"name":"[String]tag"}
}
```
