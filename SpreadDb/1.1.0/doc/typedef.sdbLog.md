- [01A] id {UUID}=Utilities.getUuid() 一意キー項目
- [02B] timestamp {string}=toLocale(new Date()) 更新日時
- [03C] account {string|number} uuid等、更新者の識別子
- [04D] range {string} 更新対象テーブル名
- [05E] action {string} 操作内容。command系内部関数名のいずれか
- [06F] argument {string} 操作関数に渡された引数
- [07G] isErr {boolean} true:追加・更新が失敗
- [08H] message {string} エラーメッセージ
- [09I] before {JSON} 更新前の行データオブジェクト(JSON)
- [10J] after {JSON} 更新後の行データオブジェクト(JSON)<br>selectの場合はここに格納
- [11K] diff {JSON} 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式