Error: embedRecursively abnormal end at step.6
ENOENT: no such file or directory, open '/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.0.0/test/source.txt'
arg="<style>\n/*::$library/CSS/1.3.0/core.css::*/\n</style>\n\n<p class=\"title\"><a name=\"Auth_top\">class Auth</a></p>\n\n「参加者一覧」等、スタッフには必要だが参加者に公開したくないメニューが存在する。これの表示制御を行うため、スタッフと参加者では「権限(auth)」を分ける。\n\n閲覧者が権限を持つかはGoogle Spread上に保存し、適宜「認証」を行って「利便性を確保しつつ、役割に応じた最低限の情報に限定」する。具体的な方法は「[認証の手順](#認証の手順)」の項を参照。\n\n<!--::SPAにおける表示制御::$test/displayControl.md::-->\n\n<!--::authClient/authServerとBurgerMenuの連携::$test/cooperation.md::-->\n\n<!--::Auth処理概要::$test/overview.md::-->\n  <!--【備忘】GAS/htmlでの暗号化 -->\n\n<!--::フォルダ構成::$test/folder.md::-->\n\n# <a name=\"jsdoc\" href=\"#Auth_top\">仕様(JSDoc)</a>\n\n<!--::JSDoc::$test/JSDoc.md::-->\n\n<!-- タイトル(第一レベル)が存在しない場合、ラベルをタイトルとして設定 -->\n<!--::>プログラムソース::$test/source.md::-->\n\n# <a name=\"revision_history\" href=\"#Auth_top\">改版履歴</a>\n\n- rev.2.0.0 : class Authと統合\n- rev.1.1.0 : 2024/03/14\n  - setupInstanceをmergeDeeplyに置換(setupInstanceは廃番)\n  - arg.funcの取り扱いを`new Function()`から直接関数を渡す形に修正\n  - changeメソッドを廃止、changeScreenで代替\n- rev.1.0.0 : 2024/01/03 初版"
opt={"library":"/Users/ena.kaon/Desktop/GitHub/library","test":"/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.0.0/test","maxDepth":"10","encoding":"utf-8"}
    at Object.readFileUtf8 (node:internal/fs/sync:25:18)
    at Object.readFileSync (node:fs:441:19)
    at embedRecursively (/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.0.0/pipe.js:126:24)
    at Interface.<anonymous> (/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.0.0/pipe.js:11:15)
    at Interface.emit (node:events:526:35)
    at Interface.close (node:internal/readline/interface:527:10)
    at Socket.onend (node:internal/readline/interface:253:10)
    at Socket.emit (node:events:526:35)
    at endReadableNT (node:internal/streams/readable:1408:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.0.0/test/source.txt'
}
