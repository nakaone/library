/**
 * @typedef {Object} authServerConfig - authConfigを継承した、authServerでのみ使用する設定値
 * @prop {string} [memberList="memberList"] - memberListシート名
 * @prop {number} defaultAuthority=0 - 新規加入メンバの権限の既定値
 * @prop {number} [memberLifeTime=31536000000] - 加入有効期間(=メンバ加入承認後の有効期間)。既定値は1年
 * @prop {number} [prohibitedToJoin=259200000] - 加入禁止期間(=管理者による加入否認後、再加入申請が自動的に却下される期間)。既定値は3日
 * @prop {number} [loginLifeTime=86400000] - 認証有効時間(=ログイン成功後の有効期間、CPkeyの有効期間)。既定値は1日
 * @prop {number} [loginFreeze=600000] - 認証凍結時間(=認証失敗後、再認証要求が禁止される期間)。既定値は10分
 * @prop {number} [requestIdRetention=300000] - 重複リクエスト拒否となる時間。既定値は5分
 * @prop {Object.<string,Object>} func - サーバ側の関数マップ
 * @prop {number} func.authority - 当該関数実行のために必要となるユーザ権限,`Member.profile.authority & authServerConfig.func.authrity > 0`なら実行可とする。
 * @prop {Function} func.do - 実行するサーバ側関数
 * @prop {Object} trial - ログイン試行関係の設定値
 * @prop {number} [trial.passcodeLength=6] - パスコードの桁数
 * @prop {number} [trial.maxTrial=3] - パスコード入力の最大試行回数
 * @prop {number} [trial.passcodeLifeTime=600000] - パスコードの有効期間。既定値は10分
 * @prop {number} [trial.generationMax=5] - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
 */