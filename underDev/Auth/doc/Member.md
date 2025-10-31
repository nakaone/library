Error: embedRecursively abnormal end at step.3.4
ENOENT: no such file or directory, open '/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/tmp/Member.md'
path=/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/tmp/Member.md
line=<!--::$tmp/Member.md::-->
opt={"prj":"/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth","lib":"/Users/ena.kaon/Desktop/GitHub/library","src":"/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/src","doc":"/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/doc","tmp":"/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/tmp","maxDepth":"10","encoding":"utf-8","depth":"0","parentLevel":"0","useRoot":"false","prefix":""}
    at Object.readFileUtf8 (node:internal/fs/sync:25:18)
    at Object.readFileSync (node:fs:441:19)
    at embedRecursively (/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.2.0/pipe.js:116:26)
    at Interface.<anonymous> (/Users/ena.kaon/Desktop/GitHub/library/embedRecursively/1.2.0/pipe.js:11:15)
    at Interface.emit (node:events:526:35)
    at Interface.close (node:internal/readline/interface:527:10)
    at Socket.onend (node:internal/readline/interface:253:10)
    at Socket.emit (node:events:526:35)
    at endReadableNT (node:internal/streams/readable:1408:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/tmp/Member.md'
}
