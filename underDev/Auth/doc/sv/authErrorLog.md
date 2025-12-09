<style>
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md) | [開発](../dev.md)

</div>

# <span id="autherrorlog">authErrorLog クラス仕様書</span>

authServerのエラーログ

- 各メソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

## <span id="autherrorlog_members">🔢 authErrorLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時 | ISO8601拡張形式の文字列 |
| memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス |
| deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 |  |
| result | string | fatal | サーバ側処理結果 | fatal/warning/normal |
| message | string | 任意 | サーバ側からのエラーメッセージ | normal時は`undefined` |
| stack | string | 任意 | エラー発生時のスタックトレース | 本項目は管理者への通知メール等、シート以外には出力不可 |

## <span id="autherrorlog_methods">🧱 authErrorLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#autherrorlog_constructor) | private | コンストラクタ |  |
| [log()](#autherrorlog_log) | public | エラーログシートにエラー情報を追記 |  |

### <span id="autherrorlog_constructor"><a href="#autherrorlog_methods">🧱 authErrorLog.constructor()</a></span>

#### <span id="autherrorlog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="autherrorlog_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- authServerConfig.[errorLog](authServerConfig.md#authserverconfig_members)シートが無ければ作成
- timestampに現在日時を設定

#### <span id="autherrorlog_constructor_returns">📤 戻り値</span>

- [authErrorLog](#autherrorlog_members)インスタンス
### <span id="autherrorlog_log"><a href="#autherrorlog_methods">🧱 authErrorLog.log()</a></span>

#### <span id="autherrorlog_log_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| e | Error | <span style="color:red">必須</span> |  | エラーオブジェクト |
| response | [authResponse](authResponse.md#authresponse_members) | <span style="color:red">必須</span> |  | 処理結果 |

#### <span id="autherrorlog_log_process">🧾 処理手順</span>

- メンバに以下を設定
    | 項目名 | データ型 | 要否/既定値 | 説明 | 設定内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | 要求日時 | **toLocale(this.timestamp)(ISO8601拡張形式)** |
    | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | **response.request.memberId** |
    | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | **response.request.deviceId** |
    | result | string | fatal | サーバ側処理結果 | **response.result** |
    | message | string | 任意 | サーバ側からのエラーメッセージ | **response.message** |
    | stack | string | 任意 | エラー発生時のスタックトレース | **e.stack** |

#### <span id="autherrorlog_log_returns">📤 戻り値</span>

- [authErrorLog](authErrorLog.md#autherrorlog_members) : シートに出力したauthErrorLogオブジェクト