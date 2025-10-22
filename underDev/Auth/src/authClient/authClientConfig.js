//::$src/common/authConfig.js::

//::$tmp/authClientConfig.js::
class authClientConfig extends authConfig {
  constructor(arg){
    super(arg);
    this.api = arg.api;
    this.timeout = arg.timeout || 300000;
    this.CPkeyGraceTime = arg.CPkeyGraceTime || 600000;
  }
}
