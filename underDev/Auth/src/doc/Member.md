# Member クラス 仕様書

## 概要

- Member は サーバ側 でメンバ情報を一元的に管理するクラスです。
- 加入・ログイン・パスコード試行・デバイス別CPkey管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。

## 状態遷移

```mermaid
stateDiagram-v2
  [*] --> 未加入
  未加入 --> 審査中 : 加入要求
  審査中 --> 加入中 : 承認
  審査中 --> [*] : 否認
  state 加入中 {
    [*] --> 未ログイン
    未ログイン --> ログイン試行中 : ログイン要求
    ログイン試行中 --> ログイン中 : 成功
    ログイン試行中 --> ログイン試行中 : 失敗(回数制限内)
    ログイン中 --> ログイン期限切れ
    ログイン期限切れ --> [*]
    ログイン試行中 --> 凍結中 : 失敗(回数制限超)
    凍結中 --> [*]
  }
  加入中 --> 加入期限切れ
  加入期限切れ --> [*]
```

| No | 状態 | 説明・判定方法 |
| --: | :-- | :-- |
| 1 | 未加入 | memberListに存在しない<br>memberList.memberIdに無い |
| 2 | 審査中 | 管理者承認待ち<br>!memberList.accepted && !memberList.reportResult |
| 3 | 加入中 | 有効メンバ。期限内であれば認証可能<br>0 < memberList.accepted && Date.now() < memberList.expire |
| 4 | &emsp;未ログイン | 当該デバイスでは有効なCPkeyが未発行、または期限切れの状態<br>（他デバイスではログイン中であってもよい）<br>memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime < Date.now() |
| 5 | &emsp;ログイン試行中 | 認証用パスコードを発行済みで、結果が未確定<br>Date.now() < memberList.memberId[deviceId].trial[0].created + authConfig.passcodeLifeTime |
| 6 | &emsp;ログイン中 | 認証が成功し、権限が必要な処理も要求できる状態<br>Date.now() <= memberList.memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime |
| 7 | &emsp;ログイン期限切れ | CPキーの有効期限が切れて再作成が必要な状態<br>memberList.memberId[deviceId].CPkeyUpdated+authConfig.loginLifeTime < Date.now() |
| 8 | &emsp;凍結中 | 制限回数内に認証が成功せず、試行できない状態<br>Date.now() < memberList.memberId[deviceId].trial[0].freezingUntil |
| 9 | 加入期限切れ | メンバ加入承認後の有効期間が切れた状態<br>memberList.expire < Date.now() |

## 状態遷移時にセットすべき変数

| 状態 | 更新されるプロパティ | 更新内容 |
| :-- | :-- | :-- |
| 審査中 → 加入中 | accepted, expire | 承認日時、承認後の有効期限を設定 |
| 加入中 → 未ログイン | device[].trial | 認証試行履歴を初期化（空配列） |
| 未ログイン → ログイン試行中 | device[].trial[0].passcode, created | 新しいパスコードを生成し記録 |
| ログイン試行中 → ログイン中 | device[].CPkey, CPkeyUpdated | クライアントから送信されたCPkeyを登録 |
| ログイン中 → ログイン期限切れ | device[].CPkeyUpdated | 期限切れ判定により更新なし。再生成を要求 |
| ログイン試行中 → 凍結中 | device[].trial[0].freezingUntil | 現在時刻＋freezingをセット |
| 加入中 → 加入期限切れ | expire | 判定のみ。更新なし |

## データ型定義

### Member

<!--::$tmp/Member.md::-->

### MemberProfile

<!--::$tmp/MemberProfile.md::-->

### MemberDevice

<!--::$tmp/MemberDevice.md::-->

### MemberTrial

<!--::$tmp/MemberTrial.md::-->

### MemberTrialLog

<!--::$tmp/MemberTrialLog.md::-->
