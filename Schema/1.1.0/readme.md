# 更新履歴

- rev.1.1.0 : 2025/09/15 - メンバ名の修正
  - schema
    - tables {tableDef[]} -> tableDef{Object.<string,tableDef>}
      - tables.tableName -> 廃止
    - tableMap -> tables
      schemaDef   {Object.<string,string>}
      schemaDefEx {Object.<string,schemaDefEx>}
    - cols -> colDef
- rev.1.0.0 : 2025/09/15 - 初版作成