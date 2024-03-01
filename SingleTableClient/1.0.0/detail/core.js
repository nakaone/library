/** 詳細・編集画面の表示
 * - 遷移元が一覧表の場合、id,modeは一覧表明細のonclickで取得・設定(id != undefined)
 * - 詳細から編集画面に遷移する際のidの引き継ぎはthis.currentを介して行う<br>
 *   ∵ editボタンはconstructorで追加されるが、そこでidを設定することはできない。
 *   (やるならボタンの追加をここで行う必要がある)
 *   本メソッド内で`addeventListener('click',this.edit(1))`のように
 *   IDを持たせたイベントを設定することは可能だが、
 *   view,edit,update,deleteの全てについて設定が必要になり、煩雑なため
 *   インスタンスメンバで「現在表示・編集している画面ID」を持たせた方がわかりやすいと判断。
 */
detail(id=undefined,mode='view'){
  const v = {whois:this.className+'.detail',rv:null,step:0};
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
        this.ctrl.detail.view[v.i].style.zIndex = 1;
        this.ctrl.detail.edit[v.i].style.zIndex = 2;
        // updateボタンを隠し、deleteボタンを表示
        this.ctrl.detail.update[v.i].style.zIndex = 1;
        this.ctrl.detail.delete[v.i].style.zIndex = 2;
      }
    } else {  // mode='edit'
      v.step = 1.22; // view->edit状態に変更
      // editボタンを隠し、viewボタンを表示
      for( v.i=0 ; v.i<2 ; v.i++ ){
        this.ctrl.detail.view[v.i].style.zIndex = 2;
        this.ctrl.detail.edit[v.i].style.zIndex = 1;
        // deleteボタンを隠し、updateボタンを表示
        this.ctrl.detail.update[v.i].style.zIndex = 2;
        this.ctrl.detail.delete[v.i].style.zIndex = 1;
      }
    }

    v.step = 1.3; // 詳細表示領域をクリア
    this.wrapper.querySelector('[name="detail"] [name="table"]').innerHTML = '';

    v.step = 1.4; // 対象行オブジェクトをv.dataに取得
    v.data = this.source.raw.find(x => x[this.primaryKey] === id);
    v.step = 1.5; // 操作対象(詳細情報表示領域)のDOMを特定
    v.table = this.wrapper.querySelector('[name="detail"] [name="table"]');

    v.step = 2; // 詳細画面に表示する項目を順次追加
    for( v.i=0 ; v.i<this.detailCols.length ; v.i++ ){
      v.col = this.detailCols[v.i];
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
        v.step = 2.41; // 編集指定の場合、detailCols.editのcreateElementオブジェクトを出力
        v.td = mergeDeeply(v.col.edit, v.proto);
      } else {
        v.step = 2.42; // 参照指定の場合、または編集指定だがeditのcreateElementが無指定の場合、
        // detailCols.viewのcreateElementオブジェクトを出力
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