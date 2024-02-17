<a name="SingleTableServer"></a>

## SingleTableServer(name, func, ...arg)
SingleTableClientの指示を受け、サーバ側(GAS)の単一スプレッドシートのCRUDを行う

- 機能的にはSingleTableの拡張だが、クラスではなく関数として定義することでSingleTableインスタンスを処理
- 「更新対象が不存在なら追加」等、select/update/insert/delete以外の操作はSingleTableClient側で実装すること

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 参照先シート名またはA1形式の範囲指定文字列 |
| func | <code>string</code> | 実行する機能。select/update/insert/delete |
| ...arg | <code>Object</code> | 機能を実行するに当たり必要なデータ |

