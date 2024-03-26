const unique = (common=>{
  const rv = {};

  // ------------------------------------------
  // テスト
  // ------------------------------------------
  rv.server = common.auth.core + 10;

  return rv;
})(common);