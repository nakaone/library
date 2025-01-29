# 使用方法

`node pipe.js markdown n`

"markdown"は固定。nはヘッダとして扱う階層(2 -> h1,h2を作成、以下はliタグで処理)

```
cat $test/SpreadDb.opml | awk 1 | node $prj/pipe.js markdown 3 > $test/SpreadDb.md
```

# 更新履歴

- rev.1.0.0 2025/01/29 : 初版作成