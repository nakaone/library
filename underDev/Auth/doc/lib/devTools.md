<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

  .popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

# <span id="devTools_top">🧩 devToolsクラス仕様書</span>

<p class="source">source: lib/devTools.3_2_0.mjs line.72</p>開発支援関係メソッド集

## <a href="#devTools_top"><span id="devTools_prop">🔢 devTools メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| whois | string | '' | 関数名またはクラス名.メソッド名 |
| seq | number | 必須 | 関数・メソッドの呼出順 |
| arg | Object.<string, any> | {} | 起動時引数。{変数名：値}形式 |
| v | Object | {} | 関数・メソッド内汎用変数 |
| stepNo | string | 1 | 関数・メソッド内の現在位置 |
| log | string[] | [ | {string[]} 実行順に並べたdev.stepNo |
| startTime | number | Date.now() | 開始時刻 |
| endTime | number | 必須 | 終了時刻 |
| elaps | number | 必須 | 所要時間(ミリ秒) |
| opt | devToolsOpt | 必須 | オプション設定値 |

## <a href="#devTools_top"><span id="devTools_func">🧱 devTools メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#devTools-constructor_top">constructor</a> | constructor |
| 2 | <a href="#devTools-devToolsError_top">devToolsError</a> | devTools専用拡張エラークラス |
| 3 | <a href="#devTools-end_top">end</a> | 正常終了時処理 |
| 4 | <a href="#devTools-error_top">error</a> | 異常終了時処理 |
| 5 | <a href="#devTools-extract_top">extract</a> | オブジェクトまたはその配列から指定メンバを抽出したオブジェクトを作成 |
| 6 | <a href="#devTools-finisher_top">finisher</a> | end/error共通の終了時処理 |
| 7 | <a href="#devTools-formatObject_top">formatObject</a> | オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する |
| 8 | <a href="#devTools-parseStructure_top">parseStructure</a> | メンバ名・抽出条件指定文字列をオブジェクト化(extractの前処理) |
| 9 | <a href="#devTools-step_top">step</a> | 関数内の進捗状況管理＋変数のダンプ |
| 10 | <a href="#devTools-toLocale_top">toLocale</a> | ログ出力用時刻文字列整形 |

## <a href="#devTools_top"><span id="devTools_desc">🧾 devTools 概説</span></a>

function xxx(o){
  const v = {whois:'xxx',arg:{o},rv:null};
  const dev = new devTools(v); // 従来のdev.startを代替
  try {
    dev.step(1);
    ...
    dev.end(); // 省略可
  } catch(e) {
    return dev.error(e);
  }
}

## <span id="devTools-constructor_top">🧩 constructor()</span>

constructor

### <a href="#devTools-constructor_top"><span id="devTools-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| v | Object | {} | 関数・メソッド内汎用変数 |
| opt | devToolsOpt | {} |  |

## <span id="devTools-devToolsError_top">🧩 devToolsError()</span>

devTools専用拡張エラークラス

## <span id="devTools-end_top">🧩 end()</span>

正常終了時処理

### <a href="#devTools-end_top"><span id="devTools-end_param">▶️ end 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | any | 任意 | 終了時ダンプする変数 |

### <a href="#devTools-end_top"><span id="devTools-end_return">◀️ end 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| void |  |

## <span id="devTools-error_top">🧩 error()</span>

異常終了時処理

### <a href="#devTools-error_top"><span id="devTools-error_param">▶️ error 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| e | Error | 必須 |  |

### <a href="#devTools-error_top"><span id="devTools-error_return">◀️ error 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Error |  |

## <span id="devTools-extract_top">🧩 extract()</span>

オブジェクトまたはその配列から指定メンバを抽出したオブジェクトを作成

### <a href="#devTools-extract_top"><span id="devTools-extract_desc">🧾 extract 概説</span></a>

- `dev.extract(doclet,"{longname}")`
- `dev.extract(doclet,"[x => Object.hasOwn(x,'kind') && x.kind === 'class']:"`<br>
  `+ "{longname,properties:{type:{names}}}")`

### <a href="#devTools-extract_top"><span id="devTools-extract_param">▶️ extract 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| data | Object \| Object[] | null | 抽出元オブジェクト |  |
| cond | string | null | 抽出条件 | 基本形：①配列の場合の抽出条件＋②抽出結果オブジェクト定義<br>  1. 配列の場合の抽出条件：'['+filter関数(文字列)+']:'。抽出しない場合は省略。末尾':'必須<br>     - `[x => Object.hasOwn(x,'kind') && x.kind === 'class']:`<br>  2. 抽出結果オブジェクト定義：'{'+抽出対象メンバ名+'}'。子孫要素指定は`{}`で記述<br>     - `{longname}`<br>     - `longname,meta:{lineno,columnno}}` |

### <a href="#devTools-extract_top"><span id="devTools-extract_return">◀️ extract 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object \| Object[] \| Error | 処理の結果新たに作成されたオブジェクト |

## <span id="devTools-finisher_top">🧩 finisher()</span>

end/error共通の終了時処理

### <a href="#devTools-finisher_top"><span id="devTools-finisher_param">▶️ finisher 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
|  | void | 必須 |  |

### <a href="#devTools-finisher_top"><span id="devTools-finisher_return">◀️ finisher 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| void |  |

## <span id="devTools-formatObject_top">🧩 formatObject()</span>

オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する

### <a href="#devTools-formatObject_top"><span id="devTools-formatObject_param">▶️ formatObject 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| obj | any | 必須 | 整形対象のオブジェクトまたは配列 |
| indentLevel | number | 0 | 現在のインデントレベル |

### <a href="#devTools-formatObject_top"><span id="devTools-formatObject_return">◀️ formatObject 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| string | 整形された文字列 |

## <span id="devTools-parseStructure_top">🧩 parseStructure()</span>

メンバ名・抽出条件指定文字列をオブジェクト化(extractの前処理)

### <a href="#devTools-parseStructure_top"><span id="devTools-parseStructure_desc">🧾 parseStructure 概説</span></a>

- "{メンバ名＋抽出条件:{子要素}}"
- 子要素は上記パターンで再帰的に定義
- 親子関係だけに絞る({name,filter,children}形式にしない)
- 子要素が存在しない場合は空オブジェクト
- 抽出条件はメンバ名の後ろに"[〜]"で付記
- メンバ名・抽出条件には空白文字が存在

入力(文字列)："{longname,meta[x=>Object.hasOwn(x,'code')]:{range,type:{name}},kind}"
出力(オブジェクト)：
{
  "longname":{},
  "meta[x=>Object.hasOwn(x,'code')]": {
    "range": {},
    "type": {
      "name":{}
    }
  },
  "kind":{}
}

### <a href="#devTools-parseStructure_top"><span id="devTools-parseStructure_param">▶️ parseStructure 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| input | string | 必須 |  |

### <a href="#devTools-parseStructure_top"><span id="devTools-parseStructure_return">◀️ parseStructure 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Object.<string, Object> |  |

## <span id="devTools-step_top">🧩 step()</span>

関数内の進捗状況管理＋変数のダンプ

### <a href="#devTools-step_top"><span id="devTools-step_desc">🧾 step 概説</span></a>

123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
  dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
  ※ 99はデバック、0.123は行番号の意で設定

### <a href="#devTools-step_top"><span id="devTools-step_param">▶️ step 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| label | number \| string | 必須 | dev.start〜end内での位置を特定するマーカー |
| val | any | null | ダンプ表示する変数 |
| cond | boolean | true | 特定条件下でのみダンプ表示したい場合の条件 |

### <a href="#devTools-step_top"><span id="devTools-step_return">◀️ step 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| void |  |

## <span id="devTools-toLocale_top">🧩 toLocale()</span>

ログ出力用時刻文字列整形

### <a href="#devTools-toLocale_top"><span id="devTools-toLocale_param">▶️ toLocale 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| date | Date | 必須 | 整形対象Dateオブジェクト |
| template | string | yyyy-MM-ddThh:mm:ss.nnnZ | テンプレート |

### <a href="#devTools-toLocale_top"><span id="devTools-toLocale_return">◀️ toLocale 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| string | 整形済日時文字列 |