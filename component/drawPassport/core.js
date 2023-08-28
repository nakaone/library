/*
- [JavaScriptでの rem ⇔ px に変換するテクニック＆コード例](https://pisuke-code.com/javascript-convert-rem-to-px/)
*/
/** 参加者情報の表示・編集を行い、編集結果を返す
 * @param {HTMLElement} parent - 親要素
 * @param {Object} info - 参加者情報
 * @param {Object} [opt={}] - オプション
 * @param {boolean} [opt.edit=false] - 編集モードならtrue, 参照モードならfalse
 * @param {boolean} [opt.showList=false] - リスト表示ならtrue、但し編集モードなら強制表示
 * @param {boolean} [opt.showDetail=false] - 詳細を表示するならtrue
 * @returns {Object.<string, any>} 修正された項目ラベルと値
 * 
 */
class drawPassport {
  constructor(opt={}){
    const v = {whois:'drawPassport.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = '1'; // オプション未定義項目の既定値をプロパティにセット
      v.rv = setupInstance(this,opt,{
        css:[{
          // drawPassport全体
          sel :'.drawPassport',
          prop:{
            'width': 'calc(100% - 2rem)',
            'display': 'grid',
            'grid-template-columns': '1fr',
            'padding': '1rem',
            'font-size': '1rem',
          }
        },{
          sel :'.drawPassport rt',
          prop:{
            'font-size': '50%',
          }
        },{
          sel :'.drawPassport .label',
          prop:{
            'margin-top': '1rem',
            'width': '100%',
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'gap': '2rem',
          }
        },{
          sel :'.drawPassport .label p',
          prop:{
            'grid-column': '1 / 3',
            'font-size': '1.4rem',
          }
        },{
          sel :'.drawPassport .label button',
          prop:{
            'grid-column': '3 / 4',
          }
        },

        // summary: QRコード、受付番号、申込者名
        {
          sel :'.drawPassport .summary',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(12, 1fr)',
            'gap': '1rem',
          }
        },{
          sel :'.drawPassport .summary [name="qrcode"]',
          prop:{
            'padding': '0rem',
            'grid-row': '1 / 3',
            'grid-column': '1 / 5',
          }
        },{
          sel :'.drawPassport .summary [name="entryNo"]',
          prop:{
            'grid-row': '1 / 2',
            'grid-column': '5 / 13',
          }
        },{
          sel :'.drawPassport .summary [name="entryNo"] span',
          prop:{
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .summary [name="申込者氏名"]',
          prop:{
            'grid-row': '2 / 3',
            'grid-column': '5 / 13',
          }
        },{
          sel :'.drawPassport .summary ruby span',
          prop:{
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .summary rt span',
          prop:{
            'font-size': '1rem',
          }
        },
        
        // list: 参加者リスト
        {
          sel :'.drawPassport .list .content',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(12, 1fr)',
            'gap': '0.2rem',
          }
        },{
          sel :'.drawPassport .list .content.hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+1)',
          prop:{
            'grid-column': '1 / 3',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+2)',
          prop:{
            'grid-column': '3 / 7',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+3)',
          prop:{
            'grid-column': '7 / 10',
          }
        },{
          sel :'.drawPassport .list .content div:nth-child(4n+4)',
          prop:{
            'grid-column': '10 / 13',
          }
        },
        
        // detail: 詳細情報
        {
          sel :'.drawPassport .detail',
          prop:{
          }
        },{
          sel :'.drawPassport .detail .content',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': '2fr 3fr',
            'gap': '0.2rem',
          }
        },{
          sel :'.drawPassport .detail .content.hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .message',
          prop:{
            'display': 'block',
          }
        },{
          sel :'.drawPassport .message.hide',
          prop:{
            'display': 'none',
          }
        },
        
        // buttons: ボタン領域
        {
          sel :'.drawPassport .buttons',
          prop:{
            'width': '100%',
            'margin': '1rem 0px',
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'gap': '2rem',
          }
        },{
          sel :'.drawPassport .buttons button',
          prop:{
            'display': 'block',
            'width': '100%',
            'font-size': '2rem',
          }
        },{
          sel :'.drawPassport .buttons [name="取消"].hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .buttons [name="決定"].hide',
          prop:{
            'display': 'none',
          }
        },{
          sel :'.drawPassport .buttons [name="全員"].hide',
          prop:{
            'display': 'none',
          }
        }],        
      });
      if( v.rv instanceof Error ) throw v.rv;

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }    
  }

  edit = async () => {
    const v = {whois:'drawPassport.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}