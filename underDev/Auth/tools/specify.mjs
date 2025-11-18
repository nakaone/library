/** BaseDef - 各定義の基底クラス
 * ===== メンバ =====
 * @typedef {Object} BaseDef - 各定義の基底クラス
 * @prop {ProjectDef} prj - ProjectDefインスタンス。再帰参照用
 * @prop {string} [className=''] - 所属するクラス名。ex.'authAuditLog'
 * @prop {string} [methodName=''] - 所属するメソッド名。ex.'log'
 * @prop {string} [anchor] - アンカーを付ける場合の文字列。ex.'authauditlog_constructor_params'
 *    クラス名・メソッド名はclassName,methodName(小文字)、セクション名は'XxxDef'->'xxx'
 * @prop {string} [title=''] - 🔢Markdown化した時のタイトル行。anchor,link設定済
 * @prop {string} [template=''] - 🔢embed展開前のテンプレート。constructorでセット、以降不変
 * @prop {string} [content=''] - 🔢embedを展開後の本文。embed展開終了時にセット
 * 
 * ===== ゲッター・セッター ===== ※以下はspecify全体の共有変数として定義
 * @prop {string[]} [implement=[]] - 実装環境の一覧。空配列なら全てグローバル。ex.`["cl","sv"]`
 * @prop {Object.<string,ClassDef|MethodDef>} defs - ClassDefのマッピングオブジェクト
 * - defs
 *   - defs[クラス名]                   -> ClassDef
 *   - defs[クラス名].members           -> MembersDef
 *   - defs[クラス名].members[項目名]    -> FieldDef
 *   - defs[クラス名].methods           -> MethodsDef
 *   - defs[クラス名].methods[メソッド名] -> MethodDef
 *   - ※クラス名・メソッド名は大文字を含む正式名だけでなく、小文字のみのアンカー名でもアクセス可とする
 * 
 * ===== メソッド =====
 * @prop {Function} cfTable - メンバ一覧および対比表の作成
 * @prop {Function} article - タイトル行＋内容の作成
 * @prop {Function} evaluate - "%%〜%%"の「〜」を評価(eval)して置換
 *   - 一箇所でも評価できなかった場合は空文字列を返す
 * @prop {Function} createMd - 当該インスタンスのMarkdownを作成
 *   - this.content === '' ならthis.templateを評価、未作成のcontentが無ければthis.contentにセット
 *   - this.contentを返して終了
 * @prop {Function} trimIndent - 先頭・末尾の空白行、共通インデントの削除
 */
/** BaseDef.articleのパラメータ
 * @typedef {Object} 以下はarticleのパラメータ
 * @prop {string} [title=''] - タイトル。constructorでアンカー・リンク等が付加される
 * @prop {number} [level=0] - 階層。0ならタイトルに'#'を付けない
 * @prop {string} [anchor=''] - タイトルに付けるアンカー
 *   "## <span id="[anchor]">タイトル</span>"
 * @prop {string} [link=''] - タイトルに付けるリンク
 *   "## <a href="[link]">タイトル</a>"
 *   "## <span id="[anchor]"><a href="[link]">タイトル</a></span>"
 * @prop {string} [navi=''] - ナビゲーション
 * @prop {string} [body=''] - 本文
 * @prop {Object} [opt={}]
 * @prop {boolean} [opt.force=false] - trueなら本文空文字列でも作成
 * @returns {string}
 */

/** ProjectDef - プロジェクト全体定義
 * ===== メンバ =====
 * @typedef {Object} ProjectDef - プロジェクト全体定義
 * @prop {Object.<string, ClassDef>} defs - クラス・クロージャ関数定義集
 * @prop {Object} [opt={}] - オプション
 * @prop {string} [opt.autoOutput=true] - 指示タグの展開後、作成したMarkdownを出力
 * @prop {string} [opt.folder] - 出力先フォルダ名。無指定の場合カレントフォルダ
 * @prop {boolean} [opt.makeList=true] - true:関数・クラス名一覧を作成
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} outputMD - フォルダを作成、Markdownファイルを出力
 */

/** ClassDef - クラス・クロージャ関数定義
 * ===== メンバ =====
 * @typedef {Object} ClassDef - クラス・クロージャ関数定義
 * @prop {string} name - 🔢クラス名
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} [desc=''] - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️補足説明。概要欄に記載
 * @prop {string} [summary=''] - ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義
 * @prop {Object.<string,boolean>} implement - 実装の有無(ex.['cl','sv'])
 * @prop {string} [template] - Markdown出力時のテンプレート
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 *   - this.content === '' なら
 *     - this.templateを評価、未作成のcontentが無ければthis.contentにセット
 *     - this.members, this.methodsのcreateMd()を呼び出し、this.contentに追加
 *   - this.contentを返して終了
 * 
 * @example this.template初期値
 * ※ 出力時不要な改行は削除するので内容有無は不問
 * ```
 * %% this.desc %%
 * 
 * %% this.note %%
 * 
 * %% this.summary.length === 0 ? '' : `## <span id="${this.anchor}_summary">🧭 ${this.name} クラス 概要</span>\n\n${this.summary}` %%
 * ```
 */

/** MembersDef - クラスの内部変数の定義
 * ===== メンバ =====
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * @prop {FieldDef[]} list - 所属するメンバの配列
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * %% this.cfTable(this.defs[this.className].members) %%
 * ```
 */

/** FieldDef - メンバの定義(Schema.columnDef上位互換)
 * ===== メンバ =====
 * @typedef {Object} FieldDef - メンバの定義(Schema.columnDef上位互換)
 * @prop {string} name - 項目(引数)名。原則英数字で構成(システム用)
 * @prop {string} [label=''] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @prop {string[]} [alias=[]] - 複数タイプのCSVを統一フォーマットで読み込む際のnameの別名
 * @prop {string} [desc=''] - 端的なメンバの説明(詳細はnoteに記述)
 * @prop {string} [note=''] - ✂️備考
 * @prop {string} [type='string'] - データ型。'|'で区切って複数記述可
 * @prop {string} [default=''] - 既定値
 *   テーブル定義(columnDef)の場合、行オブジェクトを引数とするtoString()化された文字列も可
 * @prop {boolean} [isOpt=false] - 必須項目ならfalse。defaultが定義されていた場合は強制的にtrue
 * @prop {string} [printf=null] - 表示整形用関数。行オブジェクトを引数とするtoString()化された文字列
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 */

/** MethodsDef - クラスのメソッド集
 * ===== メンバ =====
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * @prop {MethodDef[]} list - 所属するメソッドの配列
 * @prop {string} template - BaseDef.templateをオーバーライド
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} methodsList - メソッド一覧をMarkdownで作成
 * @prop {Function} createMd - BaseDef.createMdをオーバーライド
 *   - this.content === '' なら
 *     - this.templateを評価、未作成のcontentが無ければthis.contentにセット
 *     - this.listのcreateMd()を呼び出し、this.contentに追加
 *     - 途中でthis.list[x].createMd()から空文字列が返ったら中断
 *   - this.contentを返して終了
 * 
 * @example this.template初期値(this.listはembeds要素が無いのでconstructorで作成可能)
 * ```js
 * this.template(文字列) = "['',`| メソッド名 | 型 | 内容 |`,'| :-- | :-- | :-- |',
 *   this.list.map(x=>{`| ${x.name} | ${x.type} | ${x.label} |`}))
 * ].join('\n')"
 * ```
 */

/** MethodDef - 関数・アロー関数・メソッド定義
 * ===== メンバ =====
 * @typedef {Object} MethodDef - 関数・アロー関数・メソッド定義
 * @prop {string} name - 関数(メソッド)名
 * @prop {string} [type=''] - 関数(メソッド)の分類
 *   public/private, static, async, get/set, accessor, etc
 * @prop {string} [desc=''] - 端的な関数(メソッド)の説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - ✂️注意事項。Markdownで記載
 * @prop {string} [source=''] - ✂️想定するソースコード
 * @prop {string[]} [lib=[]] - 本関数(メソッド)で使用する外部ライブラリ
 * @prop {number} [rev=0] - 0:未着手 1:完了 0<n<1:作成途中
 * @prop {ParamsDef} params - 引数
 * @prop {string} process - ✂️処理手順。Markdownで記載
 * @prop {ReturnsDef} returns - 戻り値の定義(パターン別)
 * @prop {Object[]} [caller=[]] - 🔢本関数(メソッド)の呼出元関数(メソッド)
 * @prop {string} caller.class - 呼出元クラス名
 * @prop {string} caller.method - 呼出元メソッド名
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * @prop {Function} createCaller - 呼出元一覧を作成(Markdown)「📞 呼出元」
 * 
 * @example this.template初期値
 * ※ 出力時不要な改行は削除するので内容有無は不問
 * ```
 * %% this.article(this.note) %%
 * %% this.article(this.sorce) %%
 * %% this.createCaller() %%
 * %% this.params.createMd() %%
 * %% this.evaluate(this.process) %%
 * %% this.returns.createMd() %%
 * ```
 */

/** ParamsDef - 関数(メソッド)引数定義
 * ===== メンバ =====
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * @prop {FieldDef[]} list - 引数
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * %% this.cfTable(this.defs[this.className].methods[this.methodName].params) %%
 * ```
 */

/** ReturnsDef - 関数(メソッド)戻り値定義集
 * ===== メンバ =====
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * @prop {ReturnDef[]} list - (データ型別)戻り値定義集
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 */

/** ReturnDef - 関数(メソッド)戻り値定義
 * ===== メンバ =====
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * @prop {string} type - 戻り値のデータ型
 * @prop {PatternDef} [default={}] - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} [patterns={}] - 特定パターンへの設定値
 * 
 * ===== ゲッター・セッター =====
 * - 無し
 * 
 * ===== メソッド =====
 * - 無し
 * 
 * @example this.template初期値
 * ```
 * [${this.className}](this.defs[this.className].anchor)
 * 
 * // 戻り値データ型のメンバ一覧
 * %% this.cfTable(this.defs[this.className].methods[this.methodName].params) %%
 * // 対比表
 * %% this.cfTable(this) %%
 * ```
 */
