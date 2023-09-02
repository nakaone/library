/** camp2023でパスポート画面を作成する
 * @param {string} parent - 親要素のCSSセレクタ
 * @param {Object} config - Authから返された参加者情報
 * @returns {void}
 */
const Perticipants = (parent,config) => {
  const v = {whois:'Perticipants',step:0,rv:null,css:[
    /*
    { // 親要素
      sel : '',
      prop: {
        'width' : 'calc(100% - 2rem)',
        'height': '100%',
      }
    },
    */
    { // QRコード＋受付番号＋申込者名
      sel : '[name="entry"]',
      prop: {
        'width':'100%',
        'display'    : 'grid',
        'grid-template-columns': '300px 1fr',
        'grid-gap'   : '1rem',
      }
    },
    { // QRコード
      sel: '[name="qrcode"]',
      prop: {
        'grid-column': '1 / 2',
        'grid-row'   : '1 / 3',
      }
    },
    { // 受付番号
      sel : '[name="entryNo"]',
      prop: {
        'font-size'  : '2rem',
        'grid-column': '2 / 3',
        'grid-row'   : '1 / 2',
      }
    },
    { // 申込者氏名＋カナ
      sel : '[name="applicant"]',
      prop: {
        'grid-column': '2 / 3',
        'grid-row'   : '2 / 3',
      }
    },
    { // 申込者氏名
      sel : '[name="applicant"] ruby',
      prop: {
        'font-size'  : '2rem',
      }
    },
    { // 申込者カナ
      sel : '[name="applicant"] rt',
      prop: {
        'font-size'  : '0.8rem'
      }
    },
    { // 参加者一覧
      sel : '[name="list"]',
      prop: {
        'width':'100%',
        'margin' : '1rem 0rem',
        'display'    : 'grid',
        'grid-template-columns' : '3fr 2fr',
      }
    },
    { // 参加者名カナ
      sel : '[name="list"] rt',
      prop: {
        'font-size'  : '0.7rem',
      }
    },
    { // 詳細情報
      sel : '[name="detail"]',
      prop: {
        'margin' : '1rem 0rem',
        'display'    : 'grid',
        'grid-template-columns' : '8rem 1fr',
      }
    },
    { // editURL(申込フォーム修正)ボタン
      sel : '[name="button"] a',
      prop: {
        'text-decoration' : 'none',
        'margin' : '1rem',
        'display'       : 'inline-block',
        'font-size'     : '18pt',
        'text-align'    : 'center',
        'cursor'        : 'pointer',
        'padding'       : '12px 12px',
        'background'    : '#888888',
        'color'         : '#ffffff',
        'line-height'   : '1rem',
        'transition'    : '.3s',
        'box-shadow'    : '3px 3px 3px #444444',
        'border'        : '2px solid #888888',
      }
    },
    { // 
      sel : '',
      prop: {

      }
    },

  ]};
  console.log(v.whois+' start.');
  try {

    // 前準備
    v.step = 1.1; // 親要素を取得、内容を消去
    v.parent = document.querySelector(parent);
    v.parent.innerHTML = '';

    v.step = 1.2; // CSS定義
    v.style = document.createElement('style');
    document.head.appendChild(v.style);
    for( v.i=0 ; v.i<v.css.length ; v.i++ ){
      v.x = v.css[v.i];
      for( v.y in v.x.prop ){
        v.prop = parent + ' ' + v.x.sel
          + ' { ' + v.y + ' : ' + v.x.prop[v.y] + '; }\n';
        v.style.sheet.insertRule(v.prop,
          v.style.sheet.cssRules.length,
        );
      }
    }

    v.step = 2; // 受付番号(QR付)＋申込者氏名＋カナ
    v.div = createElement({
      attr:{name:'entry'},
      children: [
        {attr:{name:'qrcode'}}, // QRコード
        { // 受付番号
          attr:{name:'entryNo'},
          text: 'No.' + String(config.entryNo.value).slice(-4),
        },
        { // 申込者氏名＋カナ
          attr:{name:'applicant'},
          children:[{
            tag:'ruby',
            text: config.info['申込者氏名'],
            children:[{tag:'rt',text:config.info['申込者カナ']}]
          }]
        },
      ],
    });
    new QRCode(v.div.querySelector('[name="qrcode"]'),{
      text: String(config.entryNo.value).slice(-4),
      width: 300,
      height: 300,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel : QRCode.CorrectLevel.H,
    });
    v.parent.appendChild(v.div);

    v.step = 3; // 参加者一覧
    v.list = createElement({attr:{name:'list'}});
    v.step = 3.1; // 参加者一覧ヘッダ
    ['参加者氏名','所属'].forEach(x => {
      v.list.appendChild(createElement({
        attr:{class:'th'},text: x
      }));
    });
    v.step = 3.2; // データ(参加者氏名・所属)
    for( v.i=1 ; v.i<6 ; v.i++ ){
      v.name = '参加者0'+v.i;
      if( config.info[v.name+'氏名'].length > 0 ){
        v.list.appendChild(createElement({
          attr: {class:'td'},
          text: config.info[v.name+'氏名']
          + ' (' + config.info[v.name+'カナ'] + ')',
          /*
          children:[{
            tag:'ruby',
            text:config.info[v.name+'氏名'],
            children:[{
              tag:'rt',
              text:config.info[v.name+'カナ'],
            }]
          }]
          */
        }));
        v.list.appendChild(createElement({children:[
          {attr:{class:'td'},text:config.info[v.name+'所属']}
        ]}));
      }
    }
    v.parent.appendChild(v.list);

    v.step = 4; // その他参加者情報
    v.detail = createElement({attr:{name:'detail'}});
    ['メールアドレス','申込者の参加','宿泊、テント','引取者氏名',
    '緊急連絡先','ボランティア募集','備考','キャンセル'].forEach(x => {
      v.detail.appendChild(createElement({
        attr:{class:'th'},text:x
      }));
      v.detail.appendChild(createElement({
        attr:{class:'td'},text:config.info[x]
      }));
    });
    v.parent.appendChild(v.detail);

    v.step = 5; // editURL(申込フォーム修正)ボタン
    v.parent.appendChild(createElement({
      attr:{name:'button'},
      children:[
        {tag:'p',text:'上記内容に誤りがあれば下のボタンから修正してください。'},
        {
          tag:'a',
          attr:{href:config.info.editURL,target:'_blank'},
          text: '申込フォームの編集',
        }
      ]}
    ));

    console.log(v.whois+' normal end.',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }

}