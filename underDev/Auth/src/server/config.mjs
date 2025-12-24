import { commonConfig } from "../common/config.mjs";
//::$tmp/commonConfig.js::

// config: authServerConfigの必須設定項目
export const config = Object.assign(commonConfig,{
  func: {
    svTest: m => {serverFunc(...m)},
  }
});