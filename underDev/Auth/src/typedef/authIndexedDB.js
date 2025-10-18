/**
 * @typedef {Object} authIndexedDB - クライアントのIndexedDBに保存するオブジェクト,IndexedDB保存時のキー名は`authConfig.system.name`から取得
 * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時。UNIX時刻(new Date().getTime()),なおサーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く。
 * @prop {string} memberId - メンバの識別子(=メールアドレス)
 * @prop {string} memberName - メンバ(ユーザ)の氏名(ex."田中　太郎")。加入要求確認時に管理者が申請者を識別する他で使用。
 * @prop {CryptoKey} CSkeySign - 署名用秘密鍵
 * @prop {CryptoKey} CPkeySign - 署名用公開鍵
 * @prop {CryptoKey} CSkeyEnc - 暗号化用秘密鍵
 * @prop {CryptoKey} CPkeyEnc - 暗号化用公開鍵
 * @prop {string} SPkey - サーバ公開鍵(Base64)
 * @prop {number} expireCPkey=0 - CPkeyの有効期限(無効になる日時)。未ログイン時は0
 */