/**
 * @classdesc Google Spreadの単一シート(テーブル)の内容をhtml(SPA)でCRUD
 * 
 * #### SingleTableClientメンバ一覧
 * 
 * 以下はthisとして「constructorのv.default < constructorの引数 < listViewの引数」の順で有効となる。
 * 
 * 1. 「**太字**」はインスタンス生成時、必須指定項目
 * 1. 「【*内部*】」は指定不要の項目(constructor他で自動的に設定されるメンバ)
 * 
 * - className {string} 【*内部*】'SingleTableClient'固定。ログ出力時に使用
 * - parent='body' {string|HTMLElement} 親要素。CSSセレクタかHTMLElementで指定。
 * - wrapper {HTMLElement} 【*内部*】親要素直下、一番外側の枠組みDOM
 * - sourceCode=false {boolean} 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピーするならtrue
 * - source  {Object} データソース(シートの読込 or 行Objの配列)に関する定義
 *   - **list** {string[]} listメソッド内でのシートデータ読み込み時のdoGAS引数の配列
 *   - **update** {string[]} updateメソッド内でのシートデータ更新時のdoGAS引数の配列
 *   - **delete** {string[]} deleteメソッド内でのシートデータ削除時のdoGAS引数の配列
 *     <details><summary>【参考：doGAS引数】</summary>
 * 
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
 *   - **primaryKey** {string} プライマリーキー。data-idにセットする項目名。
 *   - sortKey=[] {Object[]} 一覧表示時の並べ替えキー。既定値primaryKeyをconstructorでセット
 *     - col {string} 項目名文字列
 *     - dir {boolean} true:昇順、false:降順
 *   - raw=[] {Object[]} 明細全件。データをシートでは無くオブジェクトの配列で渡す場合、ここにセット
 *   - data=[] {Object[]} 【*内部*】一覧に表示する明細。rawの部分集合
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
 *   - **cols** {Object[]} 一覧表に表示する項目。既定値の無い指定必須項目なのでnullで仮置き<details><summary>引数サンプル</summary>
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
 *   - dom {Object} 【*内部*】ボタン名：一覧表に配置するボタンのHTMLElement
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
 *   - **cols** {Object[]} 詳細・編集画面に表示する項目。既定値の無い指定必須項目なのでnullで仮置き<details><summary>引数サンプル</summary>
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
 *   - dom {Object} 【*内部*】ボタン名：詳細・編集画面に配置するボタンのHTMLElement
 * - current=null {string|number} 【*内部*】現在表示・編集している行のID
 * - registLog {AsyncFunction|AsyncArrow} ログ登録のスクリプト。アプリ毎にログ形式が異なるので既定値は設定せず、constructorに関数で渡す。<br>
 *   なお引数のbefore,after(更新前後の明細(行オブジェクト))はsearchメソッドから渡されるので、固定。<details><summary>サンプル</summary>
 * 
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

  /**
   * @constructor
   * @param {Object} arg - 内容は「SingleTableClientメンバ一覧」を参照
   * @returns {null|Error}
   */
  constructor(arg={}){
    const v = {whois:'SingleTableClient.constructor',rv:null,step:0,
      default:{ // メンバの既定値
        className: 'SingleTableClient',
        parent: 'body', // {string|HTMLElement} - 親要素
        wrapper: null, // {HTMLElement} - 親要素直下、一番外側の枠組みDOM
        sourceCode: false,  // {boolean} 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピーするならtrue
        source:{ // データソース(シートの読込 or 行Objの配列)に関する定義
          list:null,  // {string[]} listメソッド内でのシートデータ読み込み時のdoGAS引数の配列
          update:null,  // {string[]} updateメソッド内でのシートデータ更新時のdoGAS引数の配列
          delete: null, // {string[]} deleteメソッド内でのシートデータ削除時のdoGAS引数の配列
          // 【参考：doGAS引数】
          // 0:サーバ側関数名。"tipsServer"固定
          // 1:操作対象シート名。"tips","log"等
          // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
          // 3〜:分岐先処理への引数
          //   list  -> 不要
          //   update-> 3:pKey項目名,4:データObj,5:採番関数※
          //   delete-> 3:pKey項目名,4:pKey値
          //   ※採番関数を省略し、primaryKey項目=nullの場合、tipsServer側で
          //    primaryKey項目(数値)の最大値＋1を自動的に採番する
          filter: x => true, // {Function|Arrow} 一覧に掲載する行オブジェクトの判定関数
          primaryKey: null, // {string} プライマリーキー。data-idにセットする項目名。
          sortKey: [], // {string} 一覧表示時の並べ替えキー。既定値primaryKeyをconstructorでセット
          // [{col:(項目名文字列),dir:(true:昇順、false:降順)},{..},..]
          raw: [], // {Object[]} 行オブジェクト全件
          data: [], // {Object[]} 一覧に表示する行オブジェクト。rawの部分集合
          reload: false, // {boolean} シートデータを強制再読込するならtrue
        },
        frame: {attr:{name:'wrapper',class:'SingleTableClient'},children:[ // 各画面の枠組み定義
          {attr:{name:'list',class:'screen'},children:[
            {attr:{name:'header'},children:[
              {attr:{name:'items'},children:[]},
              {attr:{name:'control'},children:[]},
            ]},
            {attr:{name:'table'},children:[]}, // thead,tbodyに分かれると幅に差が発生するので一元化
            {attr:{name:'footer'},children:[
              {attr:{name:'items'},children:[]},
              {attr:{name:'control'},children:[]},
            ]},
          ]},
          {attr:{name:'detail',class:'screen'},children:[
            {attr:{name:'header'},children:[
              {attr:{name:'items'},children:[]},
              {attr:{name:'control'},children:[]},
            ]},
            {attr:{name:'table'},children:[]},
            {attr:{name:'footer'},children:[
              {attr:{name:'items'},children:[]},
              {attr:{name:'control'},children:[]},
            ]},
          ]},
        ]},
        list: { // 一覧表表示領域に関する定義
          cols: null, // {Object[]} 一覧表に表示する項目。既定値の無い指定必須項目なのでnullで仮置き
          def: {  // 一覧画面に表示するボタンの定義
            header: true, // 一覧表のヘッダにボタンを置く
            footer: true, // フッタにボタンを置く
            elements:[    // 配置される要素のcreateElementオブジェクトの配列
              {event:'append',tag:'button',text:'append',style:{gridRow:'1/2',gridColumn:'1/3'}},
            ]
          },
          dom: {}, // {Object} ボタン名：一覧表に配置するボタンのHTMLElement
        },
        detail: { // 詳細画面表示領域に関する定義
          cols: null, // {Object[]} 詳細・編集画面に表示する項目。既定値の無い指定必須項目なのでnullで仮置き
          def: { // 詳細画面に表示するボタンの定義
            header: true, // 詳細画面のヘッダにボタンを置く
            footer: true, // フッタにボタンを置く
            elements:[    // 配置される要素のcreateElementオブジェクトの配列
              // detail,editのようにフリップフロップで表示されるボタンの場合、
              // grid-columnの他grid-rowも同一内容を指定。
              // 表示される方を後から定義する(detail->editの順に定義するとeditが表示される)
              {event:'list',tag:'button',text:'list',style:{gridColumn:'1/5'}},
              {event:'view',tag:'button',text:'view',style:{gridRow:'1/2',gridColumn:'5/9'}},
              {event:'edit',tag:'button',text:'edit',style:{gridRow:'1/2',gridColumn:'5/9'}},
              {event:'delete',tag:'button',text:'delete',style:{gridRow:'1/2',gridColumn:'9/13'}},
              {event:'update',tag:'button',text:'update',style:{gridRow:'1/2',gridColumn:'9/13'}},
            ]
          },
          dom: {}, // {Object} ボタン名：詳細・編集画面に配置するボタンのHTMLElement
        },
        current: null, // 現在表示・編集している行のID
        css:
  `div.SingleTableClient, .SingleTableClient div {
  display: grid;
  width: 100%;
  grid-column: 1/13;
  }
  
  .SingleTableClient {
  --buttonMargin: 0.5rem;
  --buttonPaddingTB: 0.15rem;
  --buttonPaddingLR: 0.5rem;
  }
  .SingleTableClient input {
  margin: 0.5rem;
  font-size: 1rem;
  height: calc(var(--buttonMargin) * 2 + var(--buttonPaddingTB) * 2 + 1rem + 1px * 2);
  /* height = button margin*2 + padding*2 + font-size + border*2 */
  grid-column: 1/13;
  }
  .SingleTableClient button {
  display: inline-block;
  margin: var(--buttonMargin);
  padding: var(--buttonPaddingTB) var(--buttonPaddingLR);
  width: calc(100% - 0.5rem * 2);
  color: #444;
  background: #fff;
  text-decoration: none;
  user-select: none;
  border: 1px #444 solid;
  border-radius: 3px;
  transition: 0.4s ease;
  }
  .SingleTableClient button:hover {
  color: #fff;
  background: #444;
  }
  
  .SingleTableClient textarea {
  grid-column: 1/13;
  }
  
  .SingleTableClient code {
  white-space: pre-wrap;
  }`,
      },
    };
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {
  
      v.step = 1; // 既定値の設定
      v.opt = mergeDeeply(arg,v.default);
      if( v.opt instanceof Error ) throw v.opt;
  
      v.step = 2; // 適用値の設定
      for( v.key in v.opt ) this[v.key] = v.opt[v.key];
      if( typeof v.opt.parent === 'string' ){ // 親要素指定が文字列ならDOMに変更
        this.parent = document.querySelector(v.opt.parent);
      }
      // 一覧表示時の並べ替えキーが未指定ならprimaryKeyをセット
      if( this.source.sortKey.length === 0 )
        this.source.sortKey[0] = {col:this.source.primaryKey,dir:true};
      // SingleTable用のスタイルシートが未定義なら追加
      if( !document.querySelector('style.SingleTableClient') ){
        v.styleTag = document.createElement('style');
        v.styleTag.classList.add('SingleTableClient');
        v.styleTag.textContent = this.css;
        document.head.appendChild(v.styleTag);
      }
  
      v.step = 3; // 枠組み定義
      if( !document.querySelector('body > div[name="loading"]') ){
        v.step = 3.1; // 待機画面が未設定ならbody直下に追加
        v.r = createElement({attr:{name:'loading',class:'loader screen'},text:'loading...'},'body');
      }
      v.step = 3.2; // 一覧画面、詳細・編集画面をparent以下に追加
      createElement(this.frame,this.parent);
      v.step = 3.3; // wrapperをメンバとして追加(以降のquerySelectorで使用)
      this.wrapper = this.parent.querySelector('.SingleTableClient[name="wrapper"]');
  
      v.step = 4; // 一覧画面、詳細・編集画面のボタンを追加
      v.step = 4.1; // ボタンの動作定義
      v.event = {
        search: {click: () => this.search()},
        clear : {click: () => this.clear()},
        append: {click: () => this.append()},
        list  : {click: () => this.listView()},
        view  : {click: () => this.detailView()},
        edit  : {click: () => this.detailView(this.current,'edit')},
        update: {click: async () => await this.update()},
        delete: {click: async () => await this.delete()},
      };
      v.step = 4.2; // 一覧表のボタン
      v.step = 4.21;
      this.list.def.elements.forEach(x => {
        if( !x.hasOwnProperty('attr') ) x.attr = {};
        // クリック時の動作にメソッドを割り当て
        if( x.hasOwnProperty('event') && typeof x.event === 'string' ){
          // name属性を追加
          x.attr.name = x.event;
          // 既定のイベントを文字列で指定された場合、v.eventからアサイン
          x.event = v.event[x.event];
        }
      });
      v.step = 4.22; // ヘッダ・フッタにボタンを追加
      ['header','footer'].forEach(x => {
        if( this.list.def[x] === true ){
          createElement(this.list.def.elements,
          this.wrapper.querySelector(`[name="list"] [name="${x}"] [name="control"]`));
        }
      });
      v.step = 4.3; // 詳細画面のボタン
      v.step = 4.31;
      this.detail.def.elements.forEach(x => {
        // name属性を追加
        if( !x.hasOwnProperty('attr') ) x.attr = {};
        x.attr.name = x.event;
        // クリック時の動作にメソッドを割り当て
        if( x.hasOwnProperty('event') )
          x.event = v.event[x.event];
      });
      v.step = 4.32; // ヘッダ・フッタにボタンを追加
      ['header','footer'].forEach(x => {
        if( this.detail.def[x] === true ){
          createElement(this.detail.def.elements,
          this.wrapper.querySelector(`[name="detail"] [name="${x}"] [name="control"]`));
        }
      });
      v.step = 4.4; // edit・detailボタンはthis.detail.domに登録
      ['edit','view','update','delete'].forEach(fc => { // fc=FunCtion
        this.detail.dom[fc] = [];
        ['header','footer'].forEach(hf => { // hf=Header and Footer
          this.detail.dom[fc].push(this.wrapper.querySelector(
            `[name="detail"] [name="${hf}"] [name="control"] [name="${fc}"]`
          ));
        });
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
    }
  }
  /** 関数で定義された項目を再帰的に検索し、実数化
   * @param {Object} obj - 関数を含む、実数化対象オブジェクト。例：
   * @param {Object} row - 関数に渡す、行オブジェクト(シート上の1行分のデータ)
   * @param {number} depth=0 - 呼出の階層。デバッグ用
   * @returns {Object} 実数化済のオブジェクト
   * @example
   * ```
   * realize({tag:'p',text:x=>x.title},{id:10,title:'fuga'})
   * ⇒ {tag:'p',text:'fuga'}
   * ```
   */
  realize(obj,row,depth=0){
    const v = {whois:this.className+'.realize',rv:{},step:0};
    //console.log(`${v.whois} start. depth=${depth}\nobj=${stringify(obj)}\nrow=${stringify(row)}`);
    try {
  
      for( v.prop in obj ){
        v.step = v.prop;
        switch( whichType(obj[v.prop]) ){
          case 'Object':
            v.rv[v.prop] = this.realize(obj[v.prop],row,depth+1);
            break;
          case 'Function': case 'Arrow':
            v.rv[v.prop] = obj[v.prop](row);
            break;
          case 'Array':
            v.rv[v.prop] = [];
            obj[v.prop].forEach(x => v.rv[v.prop].push(this.realize(x,row,depth+1)));
            break;
          default:
            v.rv[v.prop] = obj[v.prop];
        }
      }
  
      v.step = 9; // 終了処理
      //console.log(`${v.whois} normal end.\nrv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}\nobj=${stringify(obj)}\nrow=${stringify(row)}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  /** 一覧の表示
   * - 「いずれかの項目をクリックで当該行の詳細画面に遷移」は仕様として固定
   * - 'click':g.tips.detail はNG。無名関数で覆う必要あり
   *   - [JSのクラスメソッドをonclickに設定するときにつまずいたこと](https://zenn.dev/ihashiguchi/articles/d1506331996d76)
   *
   * #### 明細(行オブジェクト)の取得・更新ロジック
   *
   * - this.source.raw.length === 0 : 引数でオブジェクトの配列を渡されていない(=シート要読込)、かつシート未読込
   *   ⇒ doGAS(this.source.list)
   * - this.source.raw.length > 0 : 引数でオブジェクトの配列を渡された、またはシート読込済
   *   - this.source.reload === true : データソースはシート(オブジェクトの配列ではない)、かつ強制再読込
   * 	   ⇒ doGAS(this.source.list)
   *   - this.source.reload === false : 引数でオブジェクトの配列を渡された、またはシート読込済で強制再読込は不要
   * 	   ⇒ 処理不要
   * 
   * @param {Object} arg={} - 「SingleTableClientメンバ一覧」のsourceオブジェクト
   * @returns {HTMLObjectElement|Error}
   */
  async listView(arg={}){
    const v = {whois:this.className+'.listView',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 事前準備
      changeScreen('loading');
      v.source = mergeDeeply(arg,this.source);
      if( v.source instanceof Error ) throw v.source;
      this.source = v.source;
  
      v.step = 2; // データが未設定またはデータソースがシートで強制再読込指定の場合、データ取得
      if( this.source.raw.length === 0 || this.source.reload === true ){
        v.r = await doGAS(...this.source.list);
        if( v.r instanceof Error ) throw v.r;
        this.source.raw = v.r;
        this.source.data = []; // 再読込の場合に備え、一度クリア
      }
  
      v.step = 3; // 一覧に表示するデータの準備
      v.step = 3.1; // 表示データ未設定ならthis.source.dataにセット
      if( this.source.data.length === 0 ){
        this.source.raw.forEach(x => { // filter(関数)で母集団とするか判定
          if(this.source.filter(x)) this.source.data.push(x); // 表示対象なら保存
        });
      }
      v.step = 3.2; // 並べ替え
      v.sort = (a,b,d=0) => { // a,bは比較対象のオブジェクト(ハッシュ)
        if( d < this.source.sortKey.length ){
          if( a[this.source.sortKey[d].col] < b[[this.source.sortKey[d].col]] )
            return this.source.sortKey[d].dir ? -1 : 1;
          if( a[this.source.sortKey[d].col] > b[[this.source.sortKey[d].col]] )
            return this.source.sortKey[d].dir ? 1 : -1;
          return v.sort(a,b,d+1);
        } else {
          return 0;
        }
      }
      this.source.data.sort((a,b) => v.sort(a,b));
  
      v.step = 4; // 表の作成
      v.table = this.wrapper.querySelector('[name="list"] [name="table"]');
      v.table.innerHTML = '';
      v.step = 4.1; // thead
      for( v.c=0 ; v.c<this.list.cols.length ; v.c++ ){
        // name属性を追加
        v.th = mergeDeeply(this.list.cols[v.c].th,{attr:{name:this.list.cols[v.c].col}});
        createElement(v.th,v.table);
      }
      v.step = 4.2; // tbody
      for( v.r=0 ; v.r<this.source.data.length ; v.r++ ){
        for( v.c=0 ; v.c<Object.keys(this.list.cols).length ; v.c++ ){
          // name属性を追加
          v.td = mergeDeeply(this.list.cols[v.c].td,{attr:{name:this.list.cols[v.c].col},event:{}});
          // 関数を使用していれば実数化
          v.td = this.realize(v.td,this.source.data[v.r]);
          // 一行のいずれかの項目をクリックしたら、当該項目の詳細表示画面に遷移するよう定義
          v.td.event.click = ()=>this.detailView(JSON.parse(event.target.getAttribute('data-id')),'view');
          createElement(v.td,v.table);
        }
      }
  
      v.step = 5; // 終了処理
      changeScreen('list');
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
      return e;
    }
  }
  /** 詳細・編集画面の表示
   * - 遷移元が一覧表の場合、id,modeは一覧表明細のonclickで取得・設定(id != undefined)
   * - 詳細から編集画面に遷移する際のidの引き継ぎはthis.currentを介して行う<br>
   *   ∵ editボタンはconstructorで追加されるが、そこでidを設定することはできない。
   *   (やるならボタンの追加をここで行う必要がある)
   *   本メソッド内で`addeventListener('click',this.edit(1))`のように
   *   IDを持たせたイベントを設定することは可能だが、
   *   view,edit,update,deleteの全てについて設定が必要になり、煩雑なため
   *   インスタンスメンバで「現在表示・編集している画面ID」を持たせた方がわかりやすいと判断。
   * 
   * @param {string|number} id=undefined - primaryKeyの値
   * @param {string} mode='view' - view or edit
   */
  detailView(id=undefined,mode='view'){
    const v = {whois:this.className+'.detailView',rv:null,step:0};
    console.log(`${v.whois} start. id=${id}, mode=${mode}`);
    try {
  
      v.step = 1.1; // 事前準備：表示・編集対象およびモードの判定
      if( id === undefined ){
        id = this.current;
      } else {
        this.current = id;
      }
  
      v.step = 1.2; // ボタン表示の変更
      if( mode === 'view' ){
        v.step = 1.21; // edit->view状態に変更
        for( v.i=0 ; v.i<2 ; v.i++ ){
          // viewボタンを隠し、editボタンを表示
          this.detail.dom.view[v.i].style.zIndex = 1;
          this.detail.dom.edit[v.i].style.zIndex = 2;
          // updateボタンを隠し、deleteボタンを表示
          this.detail.dom.update[v.i].style.zIndex = 1;
          this.detail.dom.delete[v.i].style.zIndex = 2;
        }
      } else {  // mode='edit'
        v.step = 1.22; // view->edit状態に変更
        // editボタンを隠し、viewボタンを表示
        for( v.i=0 ; v.i<2 ; v.i++ ){
          this.detail.dom.view[v.i].style.zIndex = 2;
          this.detail.dom.edit[v.i].style.zIndex = 1;
          // deleteボタンを隠し、updateボタンを表示
          this.detail.dom.update[v.i].style.zIndex = 2;
          this.detail.dom.delete[v.i].style.zIndex = 1;
        }
      }
  
      v.step = 1.3; // 詳細表示領域をクリア
      this.wrapper.querySelector('[name="detail"] [name="table"]').innerHTML = '';
  
      v.step = 1.4; // 対象行オブジェクトをv.dataに取得
      v.data = this.source.raw.find(x => x[this.source.primaryKey] === id);
      v.step = 1.5; // 操作対象(詳細情報表示領域)のDOMを特定
      v.table = this.wrapper.querySelector('[name="detail"] [name="table"]');
  
      v.step = 2; // 詳細画面に表示する項目を順次追加
      for( v.i=0 ; v.i<this.detail.cols.length ; v.i++ ){
        v.col = this.detail.cols[v.i];
        v.step = 2.1; // 表示不要項目はスキップ
        if( !v.col.hasOwnProperty('view') && !v.col.hasOwnProperty('edit') )
          continue;
        v.step = 2.2; // 項目の作成と既定値の設定
        v.proto = {style:{gridColumn:v.col.col||'1/13'}};
        if( v.col.hasOwnProperty('name') ) v.proto.attr = {name:v.col.name};
        v.step = 2.3; // データに項目が無い場合、空文字列をセット(例：任意入力の備考欄が空白)
        if( !v.data.hasOwnProperty(v.col.name) ) v.data[v.col.name] = '';
        v.step = 2.4; // 参照か編集かを判断し、指定値と既定値をマージ
        if( v.col.hasOwnProperty('edit') && mode === 'edit' ){
          v.step = 2.41; // 編集指定の場合、detail.cols.editのcreateElementオブジェクトを出力
          v.td = mergeDeeply(v.col.edit, v.proto);
        } else {
          v.step = 2.42; // 参照指定の場合、または編集指定だがeditのcreateElementが無指定の場合、
          // detail.cols.viewのcreateElementオブジェクトを出力
          v.td = mergeDeeply(v.col.view, v.proto);
        }
        v.step = 2.5; // 関数で指定されている項目を実数化
        v.td = this.realize(v.td,v.data);
        v.step = 2.6; // table領域に項目を追加
        createElement(v.td,v.table);
      }
  
      v.step = 3; // this.sourceCode 詳細・編集画面のcodeタグ内をクリック時にクリップボードに内容をコピー
      if( this.sourceCode ){
        this.wrapper.querySelectorAll('[name="detail"] [name="table"] code').forEach(x => {
          x.classList.add('prettyprint');
          x.classList.add('linenums');
          x.addEventListener('click',()=>writeClipboard());
        });
        this.wrapper.querySelectorAll('[name="detail"] [name="table"] pre').forEach(x => {
          x.classList.add('prettyprint');
          x.classList.add('linenums');
        });
      }
  
      v.step = 4; // 終了処理
      changeScreen('detail');
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
      return e;
    }
  }
  /** キーワード検索
   * @param {void} - 画面からキーを取得するので引数は無し
   * @returns {null|Error}
   */
  search(){
    const v = {whois:this.className+'.search',rv:null,step:0,keyword:'',list:[]};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // v.keyに検索キーを取得
      this.wrapper.querySelectorAll('[name="list"] [name="control"] [name="keyword"]').forEach(x => {
        if( x.value !== '' ) v.keyword = x.value;
      });
  
      v.step = 2; // this.source.rawから合致する行オブジェクトをv.listに抽出
      v.func = this.list.def.elements.find(x => x.hasOwnProperty('func')).func;
      for( v.i=0 ; v.i<this.source.raw.length ; v.i++ ){
        console.log(`l.1171\nresult=${v.func(this.source.raw[v.i],v.keyword)}\nkeyword=${v.keyword}\ntitle+tag=${this.source.raw[v.i].title+this.source.raw[v.i].tag}`);
        if( v.func(this.source.raw[v.i],v.keyword) ){
          v.list.push(this.source.raw[v.i]);
        }
      }
      console.log(`l.1154\nv.func=${stringify(v.func)}\nv.list=${stringify(v.list)}`);
  
      v.step = 3;
      if( v.list.length === 0 ){
        alert('該当するものがありません');
      } else if( v.list.length === 1 ){
        // 結果が単一ならdetailを参照モードで呼び出し
        this.current = v.list[0][this.source.primaryKey];
        v.r = this.detailView();
      } else {
        // 結果が複数ならlistを呼び出し
        this.source.data = v.list;
        v.r = this.listView();
      }
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
      return e;
    }
  }
  /** キーワード文字列の消去＋一覧の再描画
   * @param {void}
   * @returns {null|Error}
   */
  clear(){
    const v = {whois:this.className+'.clear',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 入力欄をクリア
      this.wrapper.querySelectorAll('[name="list"] [name="control"] [name="keyword"]')
      .forEach(x => x.value = '');
  
      v.step = 2; // listで一覧表を再描画
      this.source.data = [];
      v.r = this.listView();
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  /** 新規追加
   *
   * - IDはSymbol.for(UNIX時刻)で採番
   * - サーバ側はIDがSymbolなら新規と判断、新規IDを自動採番する
   * - 変更点：this.idMap, detail.cols.key
   *
   * - 凡例
   *   - client: SingleTableClient
   *   - server: SingleTableServer。アプリ毎に別名になるので注意(ex.tipsServer)
   *   - insert: SingleTable.insertメソッド
   * - 複数クライアントでの同時追加によるIDの重複を避けるため、採番〜更新が最短になるようSingleTableServerで自動採番する
   *   - SingleTableServer冒頭でSingleTableインスタンスを生成しており、その時点の最新が取得できる
   *   - serverで「SingleTableインスタンス生成〜insert実行」に別クライアントから追加処理行われるとIDの重複が発生するが、回避不能なので諦める
   * - ②:this.source.rawにid(this.source.primaryKey)=nullの行があれば、それを書き換える(追加はしない)
   * - ④:自動採番用の関数は、serverに持たせておく(ex. tipsServer)
   * - ④:`id != null`ならそれを採用する(client側で適切な採番が行われたと看做す)
   *
   * @param {void}
   * @returns {null|Error}
   */
  async append(){
    const v = {whois:this.className+'.append',rv:null,step:0,obj:{}};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // this.source.rawに空Objを追加
      v.obj[this.source.primaryKey] = null;
      this.source.raw.push(v.obj);
  
      v.step = 2; // 追加した空Objを編集画面に表示
      v.r = this.detailView(null,'edit');
      if( v.r instanceof Error ) throw v.r;
  
      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  /** 編集画面の表示内容でシート・オブジェクトを更新
   * - this.source.primaryKeyを参照し、更新後の値はdetail画面から取得するので引数不要
   * - 新規の場合、this.current=null
   *
   * @param {void} - 更新内容は画面から取得するので引数不要
   * @returns {null|Error}
   */
  async update(){
    const v = {whois:this.className+'.update',rv:null,step:0,
    msgBefore:'',msgAfter:'',diff:[],after:{}};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // 事前準備
      changeScreen('loading');
      // 対象行オブジェクトをv.beforeに取得
      v.before = this.source.raw.find(x => x[this.source.primaryKey] === this.current);
  
      v.step = 2; // 編集可能な欄(.box)について、編集後の値を取得
      v.str = '[name="detail"] [name="table"] [name="_1"] .box';
      this.detail.cols.forEach(col => {
        v.step = '2:' + col;
        if( col.hasOwnProperty('edit') ){ // detail.colsでeditを持つもののみ対象
          v.x = this.wrapper.querySelector(v.str.replace('_1',col.name)).value;
          if( v.before[col.name] !== v.x ) // 値が変化したメンバのみ追加
            v.after[col.name] = v.x;
        }
      })
  
      v.step = 3; // ログ出力時の比較用に加工前のデータを保存
      v.diff = [Object.assign({},v.before),Object.assign({},v.after)];
  
      if( Object.keys(v.after).length > 0 ){
        v.step = 4; // 修正された項目が存在した場合の処理
  
        //v.msgBefore = v.msgAfter = '';
        for( v.key in v.after ){
          v.step = 4.1; // 修正箇所表示用メッセージの作成
          v.msgBefore += `\n${v.key} : ${stringify(v.before[v.key])}`;
          v.msgAfter += `\n${v.key} : ${stringify(v.after[v.key])}`;
          v.step = 4.2; // this.source.rawの修正
          v.before[v.key] = v.after[v.key];
        }
        v.msg = `${this.source.primaryKey}="${v.before[this.source.primaryKey]}"について、以下の変更を行いました。\n`
        + `--- 変更前 ------${v.msgBefore}\n\n--- 変更後 ------${v.msgAfter}`;
  
        v.step = 4.3; // v.afterは更新された項目のみでidを持たないので、追加
        v.after[this.source.primaryKey] = this.current;
  
        v.step = 4.4; // シートデータの場合、シートの修正・ログ出力
        if( whichType(this.source,'Object') ){  // 元データがシート
          v.step = 4.5; // データシートの更新
          // doGAS引数(this.sourceに設定されている配列)
          // 0:サーバ側関数名。"tipsServer"固定
          // 1:シート名。"tips"固定
          // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
          // 3〜:分岐先処理への引数。list->不要,
          //   update->3:pKey項目名,4:データObj,5:採番関数,
          //   delete->3:pKey項目名,4:pKey値
          v.arg = [...this.source.update];
          v.arg[4] = v.after; // 更新対象オブジェクトをセット
          v.r = await doGAS(...v.arg);
          if( v.r instanceof Error ) throw v.r;
  
          v.step = 4.6; // 新規作成でid=nullだった場合、採番されたIDをセット
          if( v.before[this.source.primaryKey] === null ){
            this.current = v.before[this.source.primaryKey]
            = v.diff[1][this.source.primaryKey] = v.r[this.source.primaryKey];
          }
  
          v.step = 4.7; // ログシートの更新
          if( whichType(this.registLog,'AsyncFunction') ){
            v.r = await this.registLog(...v.diff);
            if( v.r instanceof Error ) throw v.r;
          }
        }
  
        v.step = 4.8; // 編集画面から参照画面に変更
        this.detailView(this.current,'view');
  
      } else {
        v.step = 5; // 修正された項目が存在しない場合の処理
        v.msg = `変更箇所がありませんでした`;
        // 変更箇所がない場合、参照画面に遷移せず編集続行
      }
  
      v.step = 6; // 終了処理
      alert(v.msg);
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
      return e;
    }
  }
  /** 表示中の内容をシート・オブジェクトから削除
   * @param {void} - 削除対象はthis.currentで特定するので引数不要
   * @returns {null|Error}
   */
  async delete(){
    const v = {whois:this.className+'.delete',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {
  
      // 確認メッセージの表示、キャンセルされたら終了
      if( window.confirm(`元に戻せませんが、削除しますか？`) ){
        changeScreen('loading');
        v.step = 1; // this.source.rawから削除
        v.index = this.source.raw.findIndex(x => x[this.source.primaryKey] === this.current);
        v.delObj = this.source.raw.splice(v.index,1)[0];
  
        v.step = 2; // シートからの削除
        if( whichType(this.source,'Object') ){
          v.step = 2.1; // データシートの更新
          // doGAS引数(this.sourceに設定されている配列)
          // 0:サーバ側関数名。"tipsServer"固定
          // 1:シート名。"tips"固定
          // 2:tipsServer()内部での処理分岐フラグ。list or update or delete
          // 3〜:分岐先処理への引数。list->不要,
          //   update->3:pKey項目名,4:データObj,5:採番関数,
          //   delete->3:pKey項目名,4:pKey値
          v.arg = [...this.source.delete];
          v.arg[4] = this.current; // 削除対象オブジェクトをセット
          v.r = await doGAS(...v.arg);
          if( v.r instanceof Error ) throw v.r;
  
          v.step = 2.2; // ログシートの更新
          if( whichType(this.registLog,'AsyncFunction') ){
            v.r = await this.registLog(v.delObj);
            if( v.r instanceof Error ) throw v.r;
          }
        }
  
        v.step = 3; // 削除時の終了処理
        alert(`${this.source.primaryKey}=${stringify(this.current)}を削除しました`);
        this.current = null;
        this.listView({reload:true}); // 強制再読込、一覧画面に遷移
      } else {
        v.step = 4;
        alert('削除は取り消されました')
      }
  
      v.step = 5; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      alert(e.message);
      return e;
    }
  }
  
}
