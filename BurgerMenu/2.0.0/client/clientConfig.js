const unique = (common=>{
  const rv = {};

  // ------------------------------------------
  // テスト
  // ------------------------------------------
  rv.client = common.auth.core + 20;

  return rv;
})(common);