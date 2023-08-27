/**
 * @classdesc 受付業務の画面を生成、受付番号のスキャン/入力から該当参加者情報の表示・編集を行う
 * 
 * なおスキャンはclass WebScanner.scanQRで、該当参加者情報の表示はdrawPassportで行う。
 */
class Reception {
  /**
   * @constructor
   * @param {Auth} auth - 認証局他のAuthインスタンス
   * @param {Object} area - 表示領域に関する定義
   * @param {string} area.selector - CSSセレクタ
   * @param {Object} boot - スキャナ起動のトリガーとなる要素に関する定義
   * @param {string} boot.selector - CSSセレクタ
   * @param {Object} loading - 待機画面
   * @param {string} loading.selector - CSSセレクタ
   * @returns {void}
   */
  constructor(opt){
    const v = {whois:'Reception.constructor',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      this.#setProperties(this,null,opt);
      this.area.element = document.querySelector(this.area.selector);
      this.boot.element = document.querySelector(this.boot.selector);
      this.loading.element = document.querySelector(this.loading.selector);
      console.log('step.'+v.step+' : ',this.area,this.boot,this.loading);

      v.step = '2'; // 入力・検索・編集画面の生成
      this.#setWindows();
      console.log('step.'+v.step+' : ',this.area.element);

      v.step = '3'; // スキャナ起動イベントの定義(「受付」タグのクリック)
      this.boot.element.addEventListener('click',this.bootScanner);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 設定先のオブジェクトに起動時パラメータを優先して既定値を設定する
   * @param {Object} dest - 設定先のオブジェクト。初回呼出時はthis
   * @param {def} def - 既定値のオブジェクト。初回呼出時はnull(内部定義を使用)
   * @param {AuthOpt} opt - 起動時にオプションとして渡されたオブジェクト
   * @returns {void}
   */
  #setProperties(dest,def,opt){
    const v = {whois:'Reception.#setProperties',rv:true,def:{
      auth: null, // {Auth} 認証局他のAuthインスタンス
      area:{  // 表示領域となる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
        design  : {},     // {Object} createElementに渡す定義
      },
      boot:{  // 受付タグ等、スキャナ起動のトリガーとなる要素
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
      },
      loading:{  // 待機画面
        selector: '',     // {string} CSSセレクタ
        element : null,   // {HTMLElement} 要素本体
      },
      entry: {  // 入力画面(スキャナ＋氏名)
        element: null,   // {HTMLElement} 要素本体
      },
      list: {   // 複数候補選択画面
        element: null,   // {HTMLElement} 要素本体
        table: null,     // {HTMLElement} 選択画面のテーブル部
        candidates: [],  // {Object[]} 候補となった参加者情報の配列
      },
      edit: {   // 編集画面(ダイアログ)
        element: null,   // {HTMLElement} 要素本体
        table: null,     // {HTMLElement} 編集画面のテーブル部
        details: null,   // {HTMLElement} 編集画面の詳細情報部
        css: [
          {sel:'dialog.Reception',prop:{
            'margin':'auto',
            'padding': '1rem',
          }},
          {sel:'dialog.Reception::backdrop',prop:{
            'background-color': 'rgba(127,127,127,0.8)',
          }},
          {sel:'dialog.Reception [name="table"]',prop:{
            'display': 'grid',
            'grid-template-columns': '2fr 10fr 8fr 6fr',
            'grid-gap': '0.2rem',
          }},
          {sel:'dialog.Reception input[type="button"]',prop:{
            'margin': '0.5rem 1rem',
            'font-size': '1.5rem',
            'padding': '0.2rem 1rem',
          }},
          {sel:'dialog.Reception ruby rt',prop:{
            'font-size': '0.6rem',
          }},
          {sel:'dialog.Reception [name="details"]',prop:{
            'display': 'grid',
            'grid-template-columns': '1fr 3fr',
            'grid-gap': '0.2rem',
            'overflow-wrap': 'anywhere',
          }},
          {sel:'dialog.Reception sub',prop:{
            'font-size': '0.7rem',
          }},
          {sel:'dialog.Reception [name="details"] [name="memo"]',prop:{
            'width': '95%',
            'height': '5rem',
          }},
          // 複数候補者一覧(list)用
          {sel:'dialog.Reception[name="list"] [name="table"]',prop:{
            'display': 'grid',
            'grid-template-columns': '8rem 1fr',
            'grid-gap': '0.2rem',
          }},
        ],    
      },
    }};

    console.log(v.whois+' start.');
    try {
      if( def !== null ){ // 2回目以降の呼出(再起呼出)
        // 再起呼出の場合、呼出元から渡された定義Objを使用
        v.def = def;
      }

      for( let key in v.def ){
        if( whichType(v.def[key]) !== 'Object' ){
          dest[key] = opt[key] || v.def[key]; // 配列はマージしない
        } else {
          if( !dest.hasOwnProperty(key) ) dest[key] = {};
          this.#setProperties(dest[key],v.def[key],opt[key]||{});
        }
      }

      if( def === null ){ // 初回呼出(非再帰)
        // 親画面のHTML要素を保存
        this.parentWindow = document.querySelector(this.parentSelector);
      }

      //console.log(v.whois+' normal end.');
      return v.rv;
    } catch(e){
      v.msg = v.whois + ' abnormal end(step.'+v.step+').' + e.message;
      console.error(v.msg);
      return e;
    }
  }

  /** Reception関係画面をセットする
   * @param {void} - 無し
   * @returns {void} 無し
   */
  #setWindows(){
    const v = {whois:'Reception.#setWindows',rv:null,step:'0'};
    console.log(v.whois+' start.');
    try {
  
      v.step = 1; // dialog用のCSS定義を追加(getPassCodeと共通)
      v.style = createElement('style');
      document.head.appendChild(v.style);
      for( v.i=0 ; v.i<this.edit.css.length ; v.i++ ){
        v.x = this.edit.css[v.i];
        for( v.y in v.x.prop ){
          v.prop = v.x.sel+' { '+v.y+' : '+v.x.prop[v.y]+'; }\n';
          console.log(v.prop);
          v.style.sheet.insertRule(v.prop,
            v.style.sheet.cssRules.length,
          );
        }
      }

      v.step = 2; // 検索キー文字列入力画面
      this.entry.element = createElement({
        attr:{name:'entry'},children:[
          {attr:{class:'webScanner'}},  // スキャン画像表示領域
          {tag:'input',attr:{type:'text'}},
          {
            tag:'input',
            attr:{type:'button',value:'検索'},
            event:{click: this.main},
          },
        ],
      });
      this.area.element.appendChild(this.entry.element);

      v.step = 3; // 一覧用ダイアログを定義
      this.list.element = createElement({
        tag:'dialog',
        attr:{class:'Reception',name:'list'},
        html: `<p>複数の候補が見つかりました。該当者名をクリックしてください。</p>
        <div name="table">
          <div class="th">申込者名</div>
          <div class="th">e-mail</div>
        </div>`,
      });
      document.querySelector('body').prepend(this.list.element);
      this.list.table = this.list.element.querySelector('[name="table"]');

      v.step = 4; // 編集用ダイアログを定義
      this.edit.element = createElement({
        tag:'dialog',
        attr:{class:'Reception',name:'edit'},
        html: `<div name="table">
          <div class="th">No</div>
          <div class="th">氏名</div>
          <div class="th">所属</div>
          <div class="th">参加費</div>
        </div>
        <input type="button" name="cancel" value="キャンセル" />
        <input type="button" name="submit" value="送信" />
        <div name="details">
          <div class="th">申込</div><div class="td">
            No.<span name="entryNo"></span>
            &emsp;
            <ruby>
              <span name="申込者氏名"></span>
              <rt name="申込者カナ"></rt>
            </ruby>
            &emsp;(<span name="申込者の参加"></span>)
          </div>
          <div class="th">宿泊、テント</div><div class="td" name="宿泊、テント"></div>
          <div class="th">引取者</div><div class="td" name="引取者氏名"></div>
          <div class="th">e-mail</div><div class="td" name="メールアドレス"></div>
          <div class="th">緊急連絡先</div><div class="td" name="緊急連絡先"></div>
          <div class="th">ボランティア</div><div class="td" name="ボランティア募集"></div>
          <div class="th">備考</div><div class="td" name="備考"></div>
          <div class="th">キャンセル</div><div class="td" name="キャンセル"></div>
          <div class="th">申込URL</div><div class="td" name="editURL"></div>
          <div class="th">メモ<br><sub>※スタッフ記入欄</sub></div>
          <div class="td"><textarea name="memo"></textarea></div>
        </div>`,
      });
      document.querySelector('body').prepend(this.edit.element);
      this.edit.table = this.edit.element.querySelector('[name="table"]');
      this.edit.details = this.edit.element.querySelector('[name="details"]');
  
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+')\n',e,v);
      return e;
    }
  }

  /** search, list, editを順次呼び出す(全体制御)
   * @param {string|Event} arg - 受付番号(スキャン結果文字列) or clickイベント
   * @returns {void}
   */
  main = async (arg) => {
    const v = {whois:'Reception.main',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // スキャン結果でない場合、入力文字列を取得
      v.keyword = whichType(arg) === 'String' ? arg
      : arg.target.parentElement.querySelector('input[type="text"]').value;
      console.log('step.'+v.step+': keyword='+v.keyword);

      // 認証局経由で管理局に該当者情報を問合せ
      v.rv = await this.#search(v.keyword);
      console.log(v.rv);
      console.log(JSON.stringify(v.rv.result));

      if( v.rv.isErr || v.rv.result.length === 0 ){
        // 検索画面でメッセージをポップアップ
        alert( v.rv.message );
      } else {
        v.target = v.rv.result[0];
        if( v.rv.result.length > 1 ){
          console.log(JSON.stringify(v.rv));
          // 該当者一覧画面に遷移、編集対象者を特定
          this.list.candidates = v.rv.result; // 候補者リストに格納
          v.target = await this.#list(v.rv.result);
        }
        // 編集画面を表示し、変更箇所を取得
        v.data = await this.#edit(v.target);
        // auth.fetchで変更箇所を管理局に送信
        if( v.data !== null ){
          v.rv = await this.#update(v.data);
          // 編集結果のメッセージを表示
          alert(v.rv.message);
        }
      }
      // 検索画面を再表示(bootScanner)
      this.bootScanner();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;        
    }
  }

  /** スキャナを起動、読み込んだQRデータをsearchに渡す
   * @param {void}
   * @returns 
   */
  bootScanner = async () => {
    const v = {whois:'Reception.bootScanner',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      const sel = this.area.selector+' [name="entry"] .webScanner';
      document.querySelector(sel).innerHTML = '';
      const code = await scanQR(sel);
      if( code !== null ){
        v.rv = this.main(code); // 後続のmainにスキャン文字列を渡す
        // 文字入力された⇒スキャン結果無しでタイムアウト(code=null)の場合
        // mainを呼び出さずに終了する
      }

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 認証局経由で管理局に該当者情報を問合せ
   * @param {string} keyword - 参加者の検索キー
   * @returns {Object[]} 検索キーに該当する参加者情報の配列
   */
  #search = async (keyword) => {
    const v = {whois:'Reception.#search',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      // entry画面を閉じてloading表示
      this.loading.element.style.display = 'block';

      // Auth.fetchで認証局に問い合わせ
      console.log(this.auth);
      v.rv = await this.auth.fetch('recept1A',keyword,3);

      // loading画面を閉じる
      this.loading.element.style.display = 'none';

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 該当者リストの表示、対象者の選択
   * @param {Object[]} data - 検索キーに該当する参加者情報の配列
   * @returns {Object} 選択された対象者情報
   */
  #list(data){
    const v = {whois:'Reception.#list',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 前回候補者一覧の削除
      this.list.table.querySelectorAll('div.td').forEach(x => x.remove());

      v.step = 2; // 候補者の表示
      data.forEach(d => {
        v.step = 2.1; // 氏名＋カナ
        this.list.table.appendChild(createElement({
          attr:{class:'td'},
          children:[{
            tag:'a',  // 氏名＋カナはaタグで囲む
            attr:{name:d.entryNo}, // 受付番号をname属性で持たせる
            children:[{
              tag: 'ruby',
              html: d['申込者氏名'], 
              children: [{
                tag: 'rt',
                text: d['申込者カナ'],
              }],
            }],
          }],
        }));

        v.step = 2.2; // e-mail
        this.list.table.appendChild(createElement({
          attr:{class:'td'},
          text: d['メールアドレス'],
        }));
      });

      v.step = 3.1; // 一覧用ダイアログの表示
      this.list.element.showModal();

      v.step = 3.2; // 戻り値を設定
      return new Promise(resolve => {
        document.querySelectorAll('dialog.Reception[name="list"] a').forEach(x => {
          // 一覧表の氏名(aタグ)全てにclickイベントリスナを付与
          x.addEventListener('click',(element) => {
            this.list.element.close();  // ダイアログを閉じる
            // aタグから受付番号を取得
            let entryNo = element.target.parentElement.getAttribute('name');
            for( let i=0 ; i<this.list.candidates.length ; i++ ){
              // 事前に保存しておいた候補者配列から該当者を選択して返す
              if( this.list.candidates[i].entryNo === entryNo ){
                console.log('Reception.#list normal end.',entryNo);
                resolve(this.list.candidates[i]);
              }
            }
          });
        });
      });

    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

  /** 対象となる参加者情報の表示と編集、結果を管理局に反映
   * @param {Object} participant - 対象者情報
   * @returns {Object} 管理局からの戻り値
   */
  #edit = async (data) => {
    const v = {whois:'Reception.#edit',rv:null,step:'0'};
    console.log(v.whois+' start.\n'+JSON.stringify(data));
    try {
  
      v.step = 1; // データクレンジング
      data['申込者所属'] = '申込者';  // 未定義なので追加しておく
      for( v.i=0 ; v.i<6 ; v.i++ ){
        if( data['fee0'+v.i].length === 0 ){
          data['fee0'+v.i] = (data['参加者0'+v.i+'所属'] === '未就学児') ? '無し' : '未収';
        }
      }
  
      v.step = 2; // 参加者一覧の表示
      // 前回参加者一覧の削除
      this.edit.table.querySelectorAll('div.td').forEach(x => x.remove());
      for( v.i=0 ; v.i<6 ; v.i++ ){
        v.step = 2.1; // 項目名の接頭辞
        v.pre = v.i === 0 ? '申込者' : ('参加者0' + v.i);
  
        v.step = 2.2; // 申込者が不参加、または氏名・所属とも未登録の参加者は表示しない
        if( v.i === 0 && data['申込者の参加'] === '不参加'
        || data[v.pre+'氏名'].length === 0 && data[v.pre+'所属'].length === 0 ){
          continue;
        }
  
        v.step = 2.3; // No
        this.edit.table.appendChild(createElement({attr:{class:'td'},text: ('0'+v.i)}));
  
        v.step = 2.4; // 氏名＋カナ
        this.edit.table.appendChild(createElement({attr:{class:'td'},children:[{
          tag: 'ruby',
          html: data[v.pre+'氏名'], 
          children: [{
            tag: 'rt',
            text: data[v.pre+'カナ']
          }]
        }]}));
  
        v.step = 2.5; // 所属
        this.edit.table.appendChild(createElement({attr:{class:'td'},text: data[v.pre+'所属']}));
  
        v.step = 2.6; // 参加費
        v.options = [];
        ['無し','未収','既収'].forEach(x => {
          v.options.push({
            tag:'option',
            value:x,
            text:x,
            logical:{selected:(data['fee0'+v.i] === x)},
          });
        });
        this.edit.table.appendChild(createElement({attr:{class:'td'},children:[{
          tag: 'select',
          attr: {class:'fee',name:'fee0'+v.i},
          children:v.options,
        }]}));
      }
  
      v.step = 3.1; // 詳細情報のセット
      ['メールアドレス', '申込者氏名', '申込者カナ', '申込者の参加',
      '宿泊、テント', '引取者氏名', '緊急連絡先',
      'ボランティア募集', '備考', 'キャンセル',
      'entryNo','memo'].forEach(x => {
        console.log(x,data[x]);
        let e = this.edit.details.querySelector('[name="'+x+'"]');
        console.log(e);
        e.innerText = data[x];
      });
      v.step = 3.2; // 申込フォーム修正URL(QRコード)
      v.qrDiv = this.edit.details.querySelector('[name="editURL"]');
      v.qrDiv.innerHTML = '';
      v.qr = new QRCode(v.qrDiv,{
        text: data.editURL,
        width: 300, height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      
  
      v.step = 4.1; // 編集用ダイアログの表示
      this.edit.element.showModal();
  
      v.step = 4.2; // 戻り値を設定
      return new Promise(resolve => {
        v.step = 5.1; // 「キャンセル」クリック時はnullを返す
        document.querySelector('dialog[name="edit"] input[name="cancel"]')
        .addEventListener('click',() => {
          this.edit.element.close();
          console.log('Reception.edit normal end.');
          resolve(null);
        });
        v.step = 5.2; // 「送信」クリック時に値を返すよう定義
        document.querySelector('dialog[name="edit"] input[name="submit"]')
        .addEventListener('click',() => {
          this.edit.element.close();
          const rv = {};
          // 受付番号
          rv.entryNo = this.edit.element.querySelector('[name="entryNo"]').innerText;
          // 参加費
          this.edit.element.querySelectorAll('select.fee').forEach(x => {
            rv[x.getAttribute('name')] = x.value;
          });
          // スタッフメモ欄
          rv.memo = this.edit.element.querySelector('[name="memo"]').value;
          console.log('Reception.edit normal end.',rv);
          resolve(rv);
        });
      });
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+')\n',e,v);
      return e;
    }
  }

  /** 認証局経由で管理局の参加者情報を更新
   * @param {Object} data - 参加者情報
   * @returns {Object} 更新結果
   */
  #update = async (data) => {
    const v = {whois:'Reception.#update',step:'0',rv:null};
    console.log(v.whois+' start.');
    try {

      // loading表示
      this.loading.element.style.display = 'block';

      // Auth.fetchで認証局に問い合わせ
      //console.log(this.auth);
      v.rv = await this.auth.fetch('recept2A',data,3);

      // loading画面を閉じる
      this.loading.element.style.display = 'none';

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end.',e,v);
      return e;        
    }
  }

}