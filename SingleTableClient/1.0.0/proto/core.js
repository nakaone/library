/**
 * @classdesc Google Spreadの単一シート(テーブル)の内容をhtml(SPA)でCRUD
 * 
 * #### SingleTableClientメンバ一覧
 * 
 * 以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。
 * 
 * - className {string} 'SingleTableClient'固定。ログ出力時に使用
 * - parent='body' {string|HTMLElement} 親要素。CSSセレクタかHTMLElementで指定。
 * - wrapper {HTMLElement} 【内部】親要素直下、一番外側の枠組みDOM
 * - sourceCode=false {boolean} 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピーするならtrue
 * - source  {Object} データソース(シートの読込 or 行Objの配列)に関する定義
 *   - list=null {string[]} listメソッド内でのシートデータ読み込み時のdoGAS引数の配列
 *   - update=null {string[]} updateメソッド内でのシートデータ更新時のdoGAS引数の配列
 *   - delete=null {string[]} deleteメソッド内でのシートデータ削除時のdoGAS引数の配列
 *     <details><summary>【参考：doGAS引数】</summary>
 *     ```
 *     0:サーバ側関数名。"tipsServer"固定
 *     1:操作対象シート名。"tips","log"等
 *     2:tipsServer()内部での処理分岐フラグ。list or update or delete
 *     3〜:分岐先処理への引数
 *       list  -> 不要
 *       update-> 3:pKey項目名,4:データObj,5:採番関数※
 *       delete-> 3:pKey項目名,4:pKey値
 *       ※採番関数を省略し、primaryKey項目=nullの場合、tipsServer側で
 *        primaryKey項目(数値)の最大値＋1を自動的に採番する
 *     ```
 *     </details>
 *   - filter=x=>true {Function|Arrow} 一覧に掲載する明細の判定関数。引数は明細(行オブジェクト)
 *   - primaryKey=null {string} プライマリーキー。data-idにセットする項目名。
 *   - sortKey=[] {Object[]} 一覧表示時の並べ替えキー。既定値primaryKeyをconstructorでセット
 *     - col {string} 項目名文字列
 *     - dir {boolean} true:昇順、false:降順
 *   - raw=[] {Object[]} 明細全件
 *   - data=[] {Object[]} 一覧に表示する明細。rawの部分集合
 *   - reload=false {boolean} シートデータを強制再読込するならtrue
 * - frame {Object} 各画面の枠組み定義<details><summary>(既定値)</summary>
 *   ```
 *   {attr:{name:'wrapper',class:'SingleTableClient'},children:[
 *     {attr:{name:'list',class:'screen'},children:[
 *       {attr:{name:'header'},children:[
 *         {attr:{name:'items'},children:[]},
 *         {attr:{name:'control'},children:[]},
 *       ]},
 *       {attr:{name:'table'},children:[]} thead,tbodyに分かれると幅に差が発生するので一元化
 *       {attr:{name:'footer'},children:[
 *         {attr:{name:'items'},children:[]},
 *         {attr:{name:'control'},children:[]},
 *       ]},
 *     ]},
 *     {attr:{name:'detail',class:'screen'},children:[
 *       {attr:{name:'header'},children:[
 *         {attr:{name:'items'},children:[]},
 *         {attr:{name:'control'},children:[]},
 *       ]},
 *       {attr:{name:'table'},children:[]},
 *       {attr:{name:'footer'},children:[
 *         {attr:{name:'items'},children:[]},
 *         {attr:{name:'control'},children:[]},
 *       ]},
 *     ]},
 *   ]},
 *   ```
 *   </details>
 * - list {Object} 一覧表表示領域に関する定義
 *   - def {Object} 一覧画面に表示するボタンの定義
 *     - header=true {boolean} 一覧表のヘッダにボタンを置く
 *     - footer=true {boolean} フッタにボタンを置く
 *     - elements {createElement[]} 配置される要素のcreateElementオブジェクトの配列<details><summary>(既定値)</summary>
 *       ```
 *       {event:'append',tag:'button',text:'append',style:{gridRow:'1/2',gridColumn:'1/3'}},
 *       ```
 *       </details><details><summary>(searchサンプル)</summary>
 *       ```
 *       elements:[ // 検索用の入力欄・ボタン・クリアを追加
 *         // 以下のname属性(keyword,clear)はSingleTableClient.search()で参照するので固定
 *         {tag:'input',attr:{type:'text',name:'keyword'},style:{gridRow:'1/2',gridColumn:'7/9'}},
 *         {event:'search',tag:'button',text:'search',style:{gridRow:'1/2',gridColumn:'9/11'},
 *           func:(rowObj,key) => (rowObj.title+rowObj.tag).indexOf(key) >= 0 // マッチするかの判定式
 *         } name='search'は自動で設定されるので省略
 *         {event:'clear',tag:'button',text:'clear',attr:{name:'clear'},style:{gridRow:'1/2',gridColumn:'11/13'}},
 *       ]
 *       ```
 *       </details>
 *   - cols=null {Object[]} 一覧表に表示する項目。既定値の無い指定必須項目なのでnullで仮置き<details><summary>引数サンプル</summary>
 *     ```
 *     cols: [{  // 一覧表に表示する項目
 *       col:'id',
 *       th:{attr:{class:'th'},style:{gridColumn:'1/2'},text:'ID'},
 *       td:{attr:{class:'td num','data-id':x=>x.id},style:{gridColumn:'1/2'},text:x=>x.id}
 *     },{
 *       col:'title',
 *       th:{attr:{class:'th'},style:{gridColumn:'2/13'},text:'TITLE'},
 *       td:{attr:{class:'td','data-id':x=>x.id},style:{gridColumn:'2/13'},text:x=>x.title}
 *     }],
 *     ```
 *     </details>
 *   - dom {Object} 【内部】ボタン名：一覧表に配置するボタンのHTMLElement
 * - detail {Object} 詳細画面表示領域に関する定義
 *   - def {Object} 詳細画面に表示するボタンの定義
 *     - header=true {boolean} 詳細画面のヘッダにボタンを置く
 *     - footer=true {boolean} フッタにボタンを置く
 *     - elements {createElement[]} 配置される要素のcreateElementオブジェクトの配列<details><summary>(既定値)</summary>
 *       ```
 *       // detail,editのようにフリップフロップで表示されるボタンの場合、
 *       // grid-columnの他grid-rowも同一内容を指定。
 *       // 表示される方を後から定義する(detail->editの順に定義するとeditが表示される)
 *       {event:'list',tag:'button',text:'list',style:{gridColumn:'1/5'}},
 *       {event:'view',tag:'button',text:'view',style:{gridRow:'1/2',gridColumn:'5/9'}},
 *       {event:'edit',tag:'button',text:'edit',style:{gridRow:'1/2',gridColumn:'5/9'}},
 *       {event:'delete',tag:'button',text:'delete',style:{gridRow:'1/2',gridColumn:'9/13'}},
 *       {event:'update',tag:'button',text:'update',style:{gridRow:'1/2',gridColumn:'9/13'}},
 *       ```
 *       </details>
 *   - cols=null {Object[]} 詳細・編集画面に表示する項目。既定値の無い指定必須項目なのでnullで仮置き<details><summary>引数サンプル</summary>
 *     ```
 *     cols:[{  // 詳細・編集画面に表示する項目。tableに追加する枠(DIV)順に記載
 *       name:'id' 明細のメンバ名
 *       col:'1/2' grid-template-columns。view/edit両方に適用
 *       view: {children:[
 *         {attr:{class:'th'},text:'ID'},
 *         {text:x=>x.id?('000'+x.id).slice(-4):'(未設定)'},
 *       ]},
 *       // edit無指定の場合、編集時もview指定の要素を表示
 *     },{
 *       name:'del' // view/editが無い項目は備考。表示・編集ともに非表示
 *     },{
 *       name:'title',col:'2/13',
 *       view: {children:[ // view: 表示時のcreateElementオブジェクト
 *         {attr:{class:'th'},text:'表題'},
 *         {attr:{class:'td'},text:x=>x.title},
 *       ]},
 *       edit: {children:[  // edit: 編集時のcreateElementオブジェクト
 *         {attr:{class:'th'},text:'表題'},
 *         {tag:'input',attr:{
 *           class:'box' 入力欄は'.box'を指定(updateで使用。必須)
 *           value:x=>x.title
 *         }},
 *       ]},
 *     },{
 *       name:'tag',
 *       view: {children:[
 *         {attr:{class:'th'},text:'タグ'},
 *         {attr:{class:'td'},text:x=>x.tag},
 *       ]},
 *       edit: {children:[
 *         {attr:{class:'th'},text:'タグ'},
 *         {tag:'input',attr:{class:'box',value:x=>x.tag}},
 *       ]},
 *     },{
 *       name:'article' colが無指定の場合、既定値は'1/13'
 *       view:{children:[
 *         {attr:{class:'th'},text:'記事'},
 *         {html:x=>marked.parse(x.article)} Markdownに変換して表示。メンバはhtml指定
 *       ]},
 *       edit:{children:[
 *         {attr:{class:'th'},style:{display:'block'},text:'記事',children:[
 *           {tag:'span',style:{fontSize:'0.7rem',marginLeft:'2rem'},text:'※ Markdown形式で記述'},
 *         ]},
 *         {tag:'textarea',text:x=>x.article,attr:{class:'box',rows:15}},
 *       ]},
 *     },{
 *       name:'note',
 *       view: {children:[
 *         {attr:{class:'th'},text:'備考'},
 *         {text:x=>x.note},
 *       ]},
 *       edit: {children:[
 *         {attr:{class:'th'},text:'備考'},
 *         {tag:'textarea',text:x=>x.note,attr:{class:'box'}}
 *       ]},
 *     }],
 *
 *     ```
 *     </details>
 *   - dom {Object} 【内部】ボタン名：詳細・編集画面に配置するボタンのHTMLElement
 * - current=null {string|number} 現在表示・編集している行のID
 * - registLog {AsyncFunction|AsyncArrow} ログ登録のスクリプト。アプリ毎にログ形式が異なるので既定値は設定せず、constructorに関数で渡す。<br>
 *   なお引数のbefore,after(更新前後の明細(行オブジェクト))はsearchメソッドから渡されるので、固定。<details><summary>サンプル</summary>
 *   ```
 *   async (before,after=null) => { //シート更新があるので必ずasync
 *     // 削除なら引数は一つ、更新・追加なら二つ、追加ならbefore.id=null
 *     console.log(`registLog start.\nbefore=${stringify(before)}\nafter=${stringify(after)}`);
 * 
 *     const w = {log:[],proto:{
 *       id: null ログのIDは自動採番にする
 *       pId: before.id || after.id || null,
 *       date: toLocale(new Date(),'yyyy/MM/dd hh:mm:ss'),
 *       desc: after === null
 *         ? '削除：' + before.title
 *         : window.prompt('修正内容を入力してください(既定値：新規作成)') || '新規作成',
 *     }};
 *
 *     if( after === null ){ // 削除の場合
 *       w.log.push(Object.assign({before: stringify(before)},w.proto));
 *     } else if(before.id === null){ // 新規の場合
 *       w.log.push(Object.assign({after:stringify(after)},w.proto));
 *     } else { // 更新の場合
 *       //w.diff = diffRow(before,after);
 *       for( w.key in after ){
 *         w.log.push(Object.assign({
 *           column: w.key,
 *           before: before[w.key], //stringify(w.diff[w.key][0]),
 *           after: after[w.key], //stringify(w.diff[w.key][1])
 *         },w.proto));
 *       }
 *     }
 *
 *     // doGAS引数(this.sourceに設定されている配列)
 *     // 0:サーバ側関数名。"tipsServer"固定
 *     // 1:シート名。"tips"固定
 *     // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
 *     // 3〜:分岐先処理への引数。list->不要,
 *     //   update->3:pKey項目名,4:データObj,5:採番関数,
 *     //   delete->3:pKey項目名,4:pKey値
 *     console.log(`l.1499 w.log=${stringify(w.log)}`)
 *     return await doGAS('tipsServer','log','update','id',w.log);
 *   },
 *   ```
 *   </details>
 * - css {string} SingleTableClientで使用するCSS<details><summary>(既定値)</summary>  
 *   ```
 *   div.SingleTableClient, .SingleTableClient div {
 *     display: grid;
 *     width: 100%;
 *     grid-column: 1/13;
 *   }
 *
 *   .SingleTableClient {
 *     --buttonMargin: 0.5rem;
 *     --buttonPaddingTB: 0.15rem;
 *     --buttonPaddingLR: 0.5rem;
 *   }
 *   .SingleTableClient input {
 *     margin: 0.5rem;
 *     font-size: 1rem;
 *     height: calc(var(--buttonMargin) * 2 + var(--buttonPaddingTB) * 2 + 1rem + 1px * 2);
 *     grid-column: 1/13;
 *   }
 *   .SingleTableClient button {
 *     display: inline-block;
 *     margin: var(--buttonMargin);
 *     padding: var(--buttonPaddingTB) var(--buttonPaddingLR);
 *     width: calc(100% - 0.5rem * 2);
 *     color: #444;
 *     background: #fff;
 *     text-decoration: none;
 *     user-select: none;
 *     border: 1px #444 solid;
 *     border-radius: 3px;
 *     transition: 0.4s ease;
 *   }
 *   .SingleTableClient button:hover {
 *     color: #fff;
 *     background: #444;
 *   }
 *
 *   .SingleTableClient textarea {
 *     grid-column: 1/13;
 *   }
 *
 *   .SingleTableClient code {
 *     white-space: pre-wrap;
 *   }`,
 *   ```
 *   </details>
 * 
 * #### サンプルデータ：tips
 * 
 * | id | del | title | tag | article | note |
 * | --: | :--: | :-- | :-- | :-- | :-- |
 * | 1 | | JavaScriptでsleep機能 | #sleep #promise | - [Promiseでsleep機能を作る](https://www.sejuku.net/blog/24629#index_id5)    |
 * | 2 | | classで自分のメソッドを呼び出せない | #method | 本文02 | 備考02 |
 * | 3 | true | [失敗]Mac標準ApacheのSSL通信化(https対応) | #OS標準 | 本文03 |
 * | 4 | | スプレッドシート上でQRコード作成時の注意 | #spread #qr | 本文04 |
 *
 * #### サンプルデータ：log
 * 
 * | id | pId | date | desc | column | before | after |
 * | --: | --: | :-- | :-- | :-- | :-- | :-- |
 * | 136 | 49 | 2024/03/02 12:10:16 | 新規作成 |  |  | {"title":"test1210","tag":"1210","article":"lkj","note":"jj","id":"49"} |
 * | 137 | 2 | 2024/03/02 12:47:34 | test | title | [test]JavaScriptでsleep機能 | [test1247]JavaScriptでsleep機能 |
 * | 138 | 50 | 2024/03/02 12:48:03 | 新規作成 |  |  | {"title":"test1248","id":"50"} |
 *
 * <details><summary>参考：インスタンス生成時のサンプルコード</summary>
 * 
 * ```
 * v.tips = new SingleTableClient({
 *   source:{
 *     // 0:サーバ側関数名。"tipsServer"固定
 *     // 1:シート名。"tips"固定
 *     // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
 *     // 3〜:分岐先処理への引数。list->不要,
 *     //   update->3:pKey項目名,4:データObj,5:採番関数,
 *     //   delete->3:pKey項目名,4:pKey値
 *     list:['tipsServer','tips','list'],
 *     update:['tipsServer','tips','update','id',null,undefined], // id=null->新規追加
 *     delete:['tipsServer','tips','delete','id',null],
 *     primaryKey: 'id', // プライマリーキー。data-idにセットする項目名。
 *   },
 *   list: {
 *     def:{elements:[ // 検索用の入力欄・ボタン・クリアを追加
 *       // 以下のname属性(keyword,clear)はSingleTableClient.search()で参照するので固定
 *       {tag:'input',attr:{type:'text',name:'keyword'},style:{gridRow:'1/2',gridColumn:'7/9'}},
 *       {tag:'button',text:'search',style:{gridRow:'1/2',gridColumn:'9/11'},
 *         event:'search',func:(rowObj,key) => (rowObj.title+rowObj.tag).indexOf(key) >= 0}, // name='search'は自動で設定されるので省略
 *       {event:'clear',tag:'button',text:'clear',attr:{name:'clear'},style:{gridRow:'1/2',gridColumn:'11/13'}},
 *     ]},
 *     cols: [{  // 一覧表に表示する項目
 *       col:'id',
 *       th:{attr:{class:'th'},style:{gridColumn:'1/2'},text:'ID'},
 *       td:{attr:{class:'td num','data-id':x=>x.id},style:{gridColumn:'1/2'},text:x=>x.id}
 *     },{
 *       col:'title',
 *       th:{attr:{class:'th'},style:{gridColumn:'2/13'},text:'TITLE'},
 *       td:{attr:{class:'td','data-id':x=>x.id},style:{gridColumn:'2/13'},text:x=>x.title}
 *     }],
 *   },
 *   detail:{
 *     cols:[{  // 詳細・編集画面に表示する項目。tableに追加する枠(DIV)順に記載
 *       name:'id',  // 行オブジェクトのメンバ名
 *       col:'1/2',  // grid-template-columns。view/edit両方に適用
 *       view: {children:[
 *         {attr:{class:'th'},text:'ID'},
 *         {text:x=>x.id?('000'+x.id).slice(-4):'(未設定)'},
 *       ]},
 *       // edit無指定の場合、編集時もview指定の要素を表示
 *     },{
 *       name:'del' // view/editが無い項目は備考。表示・編集ともに非表示
 *     },{
 *       name:'title',col:'2/13',
 *       view: {children:[ // view: 表示時のcreateElementオブジェクト
 *         {attr:{class:'th'},text:'表題'},
 *         {attr:{class:'td'},text:x=>x.title},
 *       ]},
 *       edit: {children:[  // edit: 編集時のcreateElementオブジェクト
 *         {attr:{class:'th'},text:'表題'},
 *         {tag:'input',attr:{
 *           class:'box',  // 入力欄は'.box'を指定(updateで使用。必須)
 *           value:x=>x.title
 *         }},
 *       ]},
 *     },{
 *       name:'tag',
 *       view: {children:[
 *         {attr:{class:'th'},text:'タグ'},
 *         {attr:{class:'td'},text:x=>x.tag},
 *       ]},
 *       edit: {children:[
 *         {attr:{class:'th'},text:'タグ'},
 *         {tag:'input',attr:{class:'box',value:x=>x.tag}},
 *       ]},
 *     },{
 *       name:'article', // colが無指定の場合、既定値は'1/13'
 *       view:{children:[
 *         {attr:{class:'th'},text:'記事'},
 *         {html:x=>marked.parse(x.article)}, // Markdownに変換して表示。メンバはhtml指定
 *       ]},
 *       edit:{children:[
 *         {attr:{class:'th'},style:{display:'block'},text:'記事',children:[
 *           {tag:'span',style:{fontSize:'0.7rem',marginLeft:'2rem'},text:'※ Markdown形式で記述'},
 *         ]},
 *         {tag:'textarea',text:x=>x.article,attr:{class:'box',rows:15}},
 *       ]},
 *     },{
 *       name:'note',
 *       view: {children:[
 *         {attr:{class:'th'},text:'備考'},
 *         {text:x=>x.note},
 *       ]},
 *       edit: {children:[
 *         {attr:{class:'th'},text:'備考'},
 *         {tag:'textarea',text:x=>x.note,attr:{class:'box'}}
 *       ]},
 *     }],
 *   },
 *   registLog: async (before,after=null) => { // ログ登録のスクリプト。シート更新があるので必ずasync
 *     // ※アプリ毎にログ形式が異なるので、関数にして引数で渡す
 *     // 削除なら引数は一つ、更新・追加なら二つ、追加ならbefore.id=null
 *     console.log(`registLog start.\nbefore=${stringify(before)}\nafter=${stringify(after)}`);
 *
 *     const w = {log:[],proto:{
 *       id: null, // ログのIDは自動採番にする
 *       pId: before.id || after.id || null,
 *       date: toLocale(new Date(),'yyyy/MM/dd hh:mm:ss'),
 *       desc: after === null
 *         ? '削除：' + before.title
 *         : window.prompt('修正内容を入力してください(既定値：新規作成)') || '新規作成',
 *     }};
 *
 *     if( after === null ){ // 削除の場合
 *       w.log.push(Object.assign({before: stringify(before)},w.proto));
 *     } else if(before.id === null){ // 新規の場合
 *       w.log.push(Object.assign({after:stringify(after)},w.proto));
 *     } else { // 更新の場合
 *       //w.diff = diffRow(before,after);
 *       for( w.key in after ){
 *         w.log.push(Object.assign({
 *           column: w.key,
 *           before: before[w.key], //stringify(w.diff[w.key][0]),
 *           after: after[w.key], //stringify(w.diff[w.key][1])
 *         },w.proto));
 *       }
 *     }
 *
 *     // doGAS引数(this.sourceに設定されている配列)
 *     // 0:サーバ側関数名。"tipsServer"固定
 *     // 1:シート名。"tips"固定
 *     // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
 *     // 3〜:分岐先処理への引数。list->不要,
 *     //   update->3:pKey項目名,4:データObj,5:採番関数,
 *     //   delete->3:pKey項目名,4:pKey値
 *     console.log(`l.1499 w.log=${stringify(w.log)}`)
 *     return await doGAS('tipsServer','log','update','id',w.log);
 *   },
 *   sourceCode: true, // 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピーするならtrue
 * });
 * await v.tips.listView();
 * ```
 * </details>
 */
class SingleTableClient {

  // ::constructor::
  // ::realize::
  // ::listView::
  // ::detailView::
  // ::search::
  // ::clear::
  // ::append::
  // ::update::
  // ::delete::
  
}