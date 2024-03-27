const config = (()=>{
  const common = {};  // client/server共通定義

  common.listSheetName = 'list';  // {string} 名簿シートのシート名
  common.passcodeLength = 6; // {number} パスコードの長さ

  // ------------------------------------------
  // listシートの項目定義
  // ------------------------------------------
  common.cols = {
    definition: {
      id:{ // レコードのプライマリキー
        label:'受付番号',  // {string} シート上の項目名。無指定ならメンバ名を流用
        isValid: // {Arrow|Function} 正常性判定。引数は当該レコード(Object)、戻り値は真偽値
          row=>{return (typeof row.id === 'number') && (isFinite(row.id))},
        default: // {Arrow|Function} 新規レコード追加時の既定値。引数はシートデータ(Object[])
          data=>{return Math.max(...data.map(x=>x.id))+1},
      },
      isTest:{  // デバッグ用のテストレコード識別用。テスト用ならtrue
        isValid: row=> typeof row.isTest === 'boolean',
        default: ()=>false,
      },
      created:{ // レコード生成日時
        isValid: row=>{
          let value=new Date(row.created).getTime();
          return ((typeof value === 'number') && (isFinite(value)));
        },
        default:()=>Date.now(),
      },
      name:{  // 申込者名
        label: '氏名',
        isValid: row=>row.name.match(/\S+?[\s　]+.+/),
        default: ()=>'',
        form: {
          desc: '姓と名の間にはスペースを入れてください',
          required: true,
          type: 'text',
          width: '15rem',  
        },
      },
      reading:{ // 申込者名読み
        isValid: row=>row.reading.match(/[ァ-ヾ]+　+[ァ-ヾ　]+/) ? true : false,
        default: ()=>'',
        form: {
          desc: '全角カナで、姓と名の間にはスペースを入れてください',
          required: true,
          type: 'text',
          width: '15rem',
        },
      },
      email:{ // 申込者のe-mail
        isValid: row=>row.email.match(/[\w\-._]+@[\w\-._]+\.[A-Za-z]+/),
        default: ()=>'',
        form: {
          required: true,
        },
      },
      tel:{
        isValid: row=>row.tel.match(/^\d{2,4}-?\d{2,4}-?\d{4}$/),
        message: '区切り無し、またはハイフン区切りで入力してください',  // isValidでエラーになった場合のメッセージ
        default: ()=>'',
        form: {
          required: false,
          desc: '区切り無し、またはハイフン区切りで入力してください',
          msg: 'ハイフンで区切って入力してください',
        }
      }
    }
  };
  common.table = {}; // id,label両方から参照可能にしたObj
  for( let x in common.cols.definition ){
    let y = common.cols.definition[x];
    if( !y.hasOwnProperty('label') ) y.label = x;
    y.id = x;
    common.table[x] = common.table[y.label] = y;
  }
/*
id
isTest : テスト用ならtrue
timestamp : 生成日時
name
reading
email
tel
authority : adminからシート上で付与された権限
note : フォームから入力された備考
status : {number} -1:無効(キャンセル済)、1:有効 
trial : {
  passcode : パスコードとして設定した6桁の数字
  created : パスコード生成日時(UNIX時刻)
  log :[ 直近のパスコード検証履歴
    timestamp : 入力日時(UNIX時刻)
    value : 入力されたパスコード
    msg : エラーメッセージ(不成功となった理由)。nullなら成功
  ]
}
memo : シートで入力した内部用備考


publicKey
keyCreated
certificate : 判定日時
*/


  // ------------------------------------------
  // アクセス権限
  // ------------------------------------------
  common.auth = {
    // 無権限
    none       :  0,
    // 個人情報を含まないコンテンツ
    memberMenu :  1,  // 2^0=1 : (一般公開しない)参加者向け情報の閲覧
    staffMenu  :  2,  // 2^1=2 : スタッフ向け情報の閲覧(応募状況、等)
    // 掲示板の閲覧・投稿
    viewBoard  :  4,  // 2^2=4 : スタッフ投稿の閲覧。但し0でもWhat's Newは閲覧可
    postBoard  :  8,  // 2^3=8 : 掲示板への投稿
    // 参加者個人情報の作成・検索・編集
    editSelf   : 16,  // 2^4=16 : 自分の申込情報の新規作成・編集
    editAll    : 32,  // 2^5=32 : 横断的な申込情報の検索・編集
  };
  common.auth.visitor = common.auth.none; // 訪問者。一般公開部分のみ閲覧可(無権限)
  common.auth.member = common.auth.visitor  // 参加者
    + common.auth.memberMenu + common.auth.viewBoard + common.auth.editSelf;
  common.auth.staff = common.auth.member  // スタッフ(一般)。横断的な申込情報の検索・編集以外はOK
    + common.auth.staffMenu + common.auth.postBoard;
  common.auth.core = common.auth.staff  // コアスタッフ
    + common.auth.editAll;


  // ------------------------------------------
  // クライアント側・サーバ側特有の定義
  // ------------------------------------------
  // clientConfig, serverConfig では変数'unique'に格納されるオブジェクトとして定義
  // ex. const unique = (common=>{})(common);

//::place_holder::

  return mergeDeeply(unique,common);
})();