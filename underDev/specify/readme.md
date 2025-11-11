# specify 仕様書

## 概要

specifyは仕様書をJavaScriptオブジェクトとして定義し、それを基にMarkdownで仕様書を作成するスクリプト。

<details><summary>動作イメージ</summary>

- 定義部分(def.js)
  ```js
  console.log(JSON.stringify({  // オブジェクトで仕様を定義、JSONを標準出力に出力
    authAuditLog: {
      label: 'authServerの監査ログ',
      note: `
        - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
        - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力`,
      members: [...],
      methods: {
        constructor: {
          type: 'private',
          label: 'コンストラクタ',
          params: [],
          process: `- メンバと引数両方にある項目は、引数の値をメンバとして設定`,
          returns: {authAuditLog:{}},
        },
      },
    },
  }));
  ```
- 仕様書作成エンジン(specify.js)
  ```js
  // JSON化された定義を処理、出力先フォルダにMarkdownファイルを作成
  const lines = [];
  const rl = require('readline').createInterface({input: process.stdin});
  rl.on('line', x => lines.push(x)).on('close',() => {
    rl.close();
    classdef = JSON.parse(lines.join('\n'));
    main();
  });
  ```
- ビルダー(build.sh)
  ```zsh
  # クラス別定義
  node $src/doc/def.js | node $prj/tools/specify.js -o:$tmp
  ```

</details>

<details><summary>定義の手引き</summary>

```js
/*  classdefメンバの書き方
  className: {  // {ClassDef} ■クラス定義■
    // className {string} クラス名
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    navi: '', // {string} クラス内ナビ
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      //{name:'',type:'string',label:'',note:''},
      {
        name: '',	// {string} メンバ名(変数名)。英数字表記
        type: 'string',	// {string} データ型
        label: '',	// {string} 端的な項目説明。ex."サーバ側処理結果"
        note: '',	// {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
        default: '—',	// {any} 関数の場合'=Date.now()'のように記述
        isOpt: false,	// {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
      },
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        // className {string} クラス名
        // methodName {string} メソッド(関数)名
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。Markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          // 将来的にオブジェクト化、引数チェックロジックもここに記載
          // list {string[]} 定義順の引数名一覧
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
          //name: '',	// 引数としての変数名
          //type: '',	// データ型
          //note: '',	// 項目の説明
          //default: '—',	// 既定値
          //isOpt: false,  // 任意項目ならtrue
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定

          - 手順の中で自他クラスのメソッドを呼ぶ場合、caller対応のため以下のように記述すること。<br>
            [メソッド名](クラス名.md#クラス名(小文字表記)_メソッド名(小文字表記))
          - <evaluate>〜</evaluate>内部はMarkdown作成時に評価され、結果で置換される
          - 物理削除 ※comparisonTableサンプル
            <evaluate>comparisonTable({ // 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
              typeName:'authAuditLog',  // 対象元(投入先)となるclassdef(cdef)上のクラス名
              default: {request:'{memberId, physical}'},  // 各パターンの共通設定値。表記方法はassignと同じ
              pattern:{ // 設定パターン集
                '物理削除':{  // パターン名
                  assign: { // {Object.<string,string>} 当該パターンの設定値
                    func:'physical remove',
                    note:'削除対象メンバのMember(JSON)'
                  },
                  condition: '',  // 該当条件(trimIndent対象)
                  note: '',  // 備忘(trimIndent対象)
                }
              }
            },'  ')</evaluate>
            ※comparisonTable最小構成サンプル
            <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{'更新内容':{assign: {
              approval: 'examined === true ? Date.now() : 0',
              denial: 0,
              joiningExpiration: '現在日時(UNIX時刻)＋authServerConfig.memberLifeTime',
              unfreezeDenial: 0,
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。Markdownで記載(trimIndent対象)

        //returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'引数"request"',value:'MemberTrialオブジェクト'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '正答時': {
                assign: {result:'normal'}, // {Object.<string,string>} 当該パターンの設定値
                condition: ``,	// {string} 該当条件(trimIndent対象)
                note: ``,	// {string} 備忘(trimIndent対象)
              },
              '誤答・再挑戦可': {assign: {result:'warning'}},
              '誤答・再挑戦不可': {assign: {result:'fatal'}},
            }
          }
        },

        error: {  // エラー時処理
        },
      },
    },
  },
*/
```

</details>

## データ定義

■ 凡例

- 🔢：導出項目(定義不要)

### ClassesDef

```js
/**
 * @typedef {Object} ClassesDef - 特定のプロジェクトで使用するクラスの集合
 * @prop {Object.<string,ClassDef>} - クラス定義
 */
```

### FunctionsDef

```js
/**
 * @typedef {Object} FunctionsDef - 特定のプロジェクトで使用する関数の集合
 * @prop {Object.<string,FunctionDef>} - クラス定義
 */
```

### ClassDef

```js
/**
 * @typedef {Object} ClassDef
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} desc - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - クラスとしての補足説明。概要欄に記載
 * @prop {string} [policy=''] - 設計方針欄(trimIndent対象)
 * @prop {string} [example=''] - 想定する実装・使用例(Markdown,trimIndent対象)
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義
 * @prop {Object.<string,boolean>} implement - 実装の有無(ex.{cl:false,sv:true})
 * @prop {string} name - 🔢クラス名
 */
```

### MembersDef

```js
/**
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * @prop {MemberDef[]} members - 所属するメンバの配列
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
```

### MemberDef

```js
/**
 * @typedef {Object} MemberDef - メンバの定義(Schema.columnDef上位互換)
 * @prop {string} name - 項目(引数)名。原則英数字で構成(システム用)
 * @prop {string} [label=''] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @prop {string[]} [alias=[]] - 複数タイプのCSVを統一フォーマットで読み込む際のnameの別名
 * @prop {string} [desc=''] - 端的なメンバの説明(詳細はnoteに記述)
 * @prop {string} [note=''] - 備考
 * @prop {string} [type='string'] - データ型。'|'で区切って複数記述可
 * @prop {string} [default=''] - 既定値
 *   テーブル定義(columnDef)の場合、行オブジェクトを引数とするtoString()化された文字列も可
 * @prop {boolean} [isOpt=false] - 必須項目ならfalse。defaultが定義されていた場合は強制的にtrue
 * @prop {string} [printf=null] - 表示整形用関数。行オブジェクトを引数とするtoString()化された文字列
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名(引数・戻り値の場合のみ)
 */
```

### MethodsDef

```js
/**
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * @prop {FunctionDef[]} methods - 所属するメソッドの配列
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
```

### FunctionDef

```js
/**
 * @typedef {Object} FunctionDef - 関数・アロー関数・メソッド定義
 * @prop {string} name - 関数(メソッド)名
 * @prop {string} [type=''] - 関数(メソッド)の分類
 *   public/private, static, async, get/set, accessor, etc
 * @prop {string} [desc=''] - 端的な関数(メソッド)の説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - 注意事項。Markdownで記載
 * @prop {string} [source=''] - 想定するソースコード
 * @prop {string[]} [lib=''] - 本関数(メソッド)で使用する外部ライブラリ
 * @prop {string[]} caller - 🔢本関数(メソッド)の呼出元関数(メソッド)。メソッドの場合"クラス.メソッド名"
 * @prop {number} [rev=0] - 0:未着手 1:完了 0<n<1:作成途中
 * @prop {ParamsDef} params - 引数
 * @prop {string} process - 処理手順。Markdownで記載
 * @prop {ReturnsDef} returns - 戻り値の定義(パターン別)
 * @prop {string} [className=''] - 🔢所属するクラス名(メソッドのみ)
 */
```

### ParamsDef

```js
/**
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * @prop {MemberDef[]} params - 引数
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
```

### ReturnsDef

```js
/**
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * @prop {ReturnDef[]} returns - (データ型別)戻り値定義集
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
```

### ReturnDef

```js
/**
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * @prop {string} type - 戻り値のデータ型
 * @prop {PatternDef} default - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} pattern - 特定パターンへの設定値
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
/**
 * @typedef {Object.<string,string>} PatternDef - パターンに設定する値
 * @example {name:'fuga'} ⇒ 戻り値のデータ型のメンバ'name'に'fuga'を設定
 */
```

### MarkdownDef

```js
/**
 * @typedef {Object} MarkdownDef - Markdown文書作成時の定義
 * @prop {string} title - タイトル
 * @prop {number} [level=1] - 階層(自然数)
 * @prop {string} [icon=''] - タイトルの前に付けるアイコン(スペースを含む)
 * @prop {string} [anchor=''] - タイトルに付けるアンカー
 *   "## <span id="[anchor]">タイトル</span>"
 * @prop {string} [link=''] - タイトルに付けるリンク
 * @prop {string} [navi=''] - ナビゲーション
 * @prop {string} [template=''] - 本文のテンプレート
 * @prop {string} [content=''] - 🔢スペーストリミング＋埋込対応済の本文
 */
```
