# Schema/Adapter/DBの役割分担

```mermaid
sequenceDiagram
    autonumber

    participant App as Application
    participant DB as ClientDB
    participant Adapter as SchemaAdapterSheet
    participant Schema as Schema

    Note over App,Schema: schemaDef は Client / Server に<br/>const schemaDef = {...} として<br/>同一内容をコードで保持

    %% 初期化フェーズ
    App->>DB: new ClientDB(schemaDef)
    DB->>Adapter: new SchemaAdapterSheet(schemaDef)
    Adapter->>Schema: new Schema(schemaDef)

    Note right of Schema: Schema は純粋な定義オブジェクト<br/>- tableDef<br/>- colDef<br/>- 型・制約<br/>※ 実 I/O は行わない

    %% 利用フェーズ（例：read）
    App->>DB: read(tableName, query)
    DB->>Adapter: read(tableName, query)

    Adapter->>Schema: getTableDef(tableName)
    Schema-->>Adapter: tableDef / colDef

    Note right of Adapter: translate 処理<br/>論理 query / row を<br/>物理 I/O 形式へ変換<br/>(Sheet: Range / Values)

    Adapter->>Adapter: translate(query, tableDef)
    Adapter->>Adapter: getRange / setValues
    Adapter-->>DB: logical result
    DB-->>App: result
```

- Schema
	- 呼ばれるだけの存在
	- 自身では外部（DB / Sheet / SQL）を一切知らない
	- 構造・制約・型の「事実」だけを保持
- SchemaAdapter
	- Schema を 解釈する主体
	- translate（論理 → 物理）を一手に担う
	- DB実装（Sheet / SQL / IndexedDB）に依存してよい
- DB（ClientDB / ServerDB）
	- Application から見える 唯一の窓口
	- Adapter を内部に隠蔽
	- Schema の中身は直接触らない
- Application
	- Adapter / Schema の存在を意識しない
	- DB API のみを使用（Single Window）