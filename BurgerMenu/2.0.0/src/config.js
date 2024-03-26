const config = (()=>{
  const common = {};  // client/server共通定義

  common.listSheetName = 'list';  // {string} 名簿シートのシート名

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