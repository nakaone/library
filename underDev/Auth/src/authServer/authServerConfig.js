//::$src/common/authConfig.js::

//::$tmp/authServerConfig.js::
class authServerConfig extends authConfig {
  constructor(arg){
    super(arg);

    this.memberList = arg.memberList || "memberList";
    this.defaultAuthority = arg.defaultAuthority || 0;
    this.memberLifeTime = arg.memberLifeTime || 31536000000;
    this.prohibitedToJoin = arg.prohibitedToJoin || 259200000;
    this.loginLifeTime = arg.loginLifeTime || 86400000;
    this.loginFreeze = arg.loginFreeze || 600000;
    this.requestIdRetention = arg.requestIdRetention || 300000;
    this.func = arg.func.authority || {};
    arg.trial = arg.trial || {};
    this.trial = {
      passcodeLength: arg.trial.passcodeLength || 6,
      maxTrial: arg.trial.maxTrial || 3,
      passcodeLifeTime: arg.trial.passcodeLifeTime || 600000,
      generationMax: arg.trial.generationMax || 5,
    };
  }
}
