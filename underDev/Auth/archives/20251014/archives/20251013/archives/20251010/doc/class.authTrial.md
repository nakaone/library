# class authTrial : サーバ側のログイン試行時のパスコード関係

- typedef {Object} authTrial
- prop {string} passcode - 設定されているパスコード
- prop {number} created - パスコード生成日時
- prop {number} [freezingUntil=0] - 凍結解除日時。最大試行回数を超えたら現在日時を設定
- prop {number} [CPkeyUpdateUntil=0] - CPkey更新処理中の場合、更新期限をUNIX時刻でセット
- prop {authTrialLog[]} [log=[]] - 試行履歴

## constructor()

- param {Object} arg
- param {string} arg.sheetName - memberListのシート名
- param {string} arg.memberId - メンバの識別子(=メールアドレス)
- param {Object} opt - authTrialの設定値。authConfig.trialを想定
- returns {authTrial[]}

1. memberListからthis.memberIdの情報を取得、trial欄をオブジェクト化
2. 新しいauthTrialインスタンスを生成
3. authTrial.passcodeをcreatePassword()で生成、createdに現在時刻を設定
4. authTrialインスタンスを先頭にセットした配列を戻り値とする
5. opt.generationMax超の履歴は削除
6. JSON化してtrial欄にセット

## try() : クライアント側で入力されたパスコードの検証

- param {Object} arg
- param {string} arg.sheetName - memberListのシート名
- param {string} arg.memberId - メンバの識別子(=メールアドレス)
- param {string} arg.enterd - 入力されたパスコード
- param {number} arg.timestamp - パスコード入力時刻
- param {Object} opt - authTrialの設定値。authConfig.trialを想定
- returns {authTrialLog}

1. memberListからthis.memberIdの情報を取得、trial欄をオブジェクト化
2. 凍結期間中ではないか判定(`Date.now() < opt.freezingUntil`)<br>
  結果は`{result:-1, message:'freezing'}`として5.に飛ぶ
3. パスコードの有効期間内か判定(`timestamp < authTrial.created+opt.passcodeLifeTime`)<br>
  エラー時は`{result:-1, message:'expired'}`として5.に飛ぶ
4. パスコードが一致するか判定(`Number(enterd)===Number(authTrial.passcode)`)<br>
  一致なら`{result:1}`、不一致なら`{result:0, message:'unmatch'}`として5.に飛ぶ
5. 結果を基にauthTrialLogインスタンスを生成、authTrial.logの先頭に追加
6. 試行回数のチェック。`result===0 && authTrial.log.length===opt.maxTrial`の場合、凍結期間を設定(`freezingUntil=opt.freezing+Date.now()`)
7. authTrialインスタンスをJSON化してmemberList.trialに記録(上書き)

## updateCPkey() : 期限切れCPkeyの更新処理


- param {authConfig} [config] - インスタンス化されたauthConfigオブジェクト。指定た場合、以下の指定は不要。
- param {number} [memberLifeTime=31536000000] - メンバ加入承認後の有効期間。既定値：1年
- param {number} [loginLifeTime=86400000] - ログイン成功後の有効期間(=CPkeyの有効期間)。既定値：1日
- param {number} [maxTrial=3] パスコード入力の最大試行回数
- param {number} [passcodeLifeTime=600000] - パスコードの有効期間。既定値：10分
- param {number} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差。既定値：2分
- param {number} [freezing=3600000] - 連続失敗した場合の凍結期間。既定値：1時間

