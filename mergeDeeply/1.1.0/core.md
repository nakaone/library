<a name="mergeDeeply"></a>

## mergeDeeply(pri, sub, opt) ⇒ <code>any</code> \| <code>Error</code>
渡された変数内のオブジェクト・配列を再帰的にマージ
- pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す

**Kind**: global function  
**Returns**: <code>any</code> \| <code>Error</code> - #### デシジョンテーブル

| 優先(pri) | 劣後(sub) | 結果 | 備考 |
| :--: | :--: | :--: | :-- |
|  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
|  A  |  B  |  A  | |
|  A  | [B] |  A  | |
|  A  | {B} |  A  | |
| [A] |  -  | [A] | |
| [A] |  B  | [A] | |
| [A] | [B] | [X] | 配列はopt.arrayによる |
| [A] | {B} | [A] | |
| {A} |  -  | {A} | |
| {A} |  B  | {A} | |
| {A} | [B] | {A} | |
| {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
|  -  |  -  |  -  | |
|  -  |  B  |  B  | |
|  -  | [B] | [B] | |
|  -  | {B} | {B} | |

#### opt.array : pri,sub双方配列の場合の処理方法を指定

例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]

- pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
- add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
- set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
  ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
- str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
  ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
- cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
  ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]  

| Param | Type | Description |
| --- | --- | --- |
| pri | <code>any</code> | 優先される変数(priority) |
| sub | <code>any</code> | 劣後する変数(subordinary) |
| opt | <code>Object</code> | オプション |

