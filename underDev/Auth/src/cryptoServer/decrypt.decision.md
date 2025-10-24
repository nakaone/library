No | 署名 | 復号 | 時差 | result | message | response
:--: | :-- | :-- | :-- | :-- | :-- | :--
1 | 一致 | 成功 | 誤差内 | normal | — | authRequest
2 | 一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
3 | 一致 | 失敗 | — | fatal | decrypt failed | —
4 | 不一致 | 成功 | 誤差内 | warning | Signature unmatch | authRequest
5 | 不一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
6 | 不一致 | 失敗 | — | fatal | decrypt failed | —

- 「時差」：`abs(Date.now() - request.timestamp) > allowableTimeDifference` ⇒ 誤差超
- No.4は加入申請(SPkey取得済・CPkey未登録)時を想定
