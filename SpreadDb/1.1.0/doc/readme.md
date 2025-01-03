# SpreadDb rev.1.1.0

- [typedefs](#4b6d1866-70ca-43a0-88ef-b64656d0a153)
  - [sdbTable](#4633fb93-038b-44db-b927-a0f5815265de)
  - [sdbSchema](#e83945a7-e3e0-440f-b293-6de0c27aa556)
  - [sdbColumn](#e23eb4c4-ab0d-4776-8038-775f6b018fc6)
  - [sdbLog](#c8640a48-efb0-4999-8b78-e10dd39f16fc)

## <a name="726e2e5a-6be6-df18-acfa-3f73f91ef7f1">概要</a>

<!--::$doc/outline.md::-->

## <a name="1afe004e-f22b-569f-1bc6-d2930948e979">メンバ</a>

<!--::$doc/member.md::-->

## <a name="52628041-f45a-f621-6883-3088a580542b">引数</a>

<!--::$doc/arguments.md::-->

## <a name="f2453d3b-59c3-5008-8f6b-b0e45ef23594">戻り値</a>

<!--::$doc/returnValue.md::-->

## <a name="252d1755-0fdc-aa53-bbda-f5dcf05deaef">内部関数 - 非command系</a>

### <a name="09870987-01ad-48b3-810c-f2d292f2fb5b">constructor</a>() : メンバの初期値設定、更新履歴の準備

メンバの初期値設定および「更新履歴」シートの準備を行う

#### <a name="1f04d940-6884-819a-956c-921763e531ea">引数</a>

<!--::$doc/method.constructor.arg.md::-->

#### <a name="0e2570f7-932c-f77e-5a74-4e6f3284e349">戻り値</a>

{null|Error}

### <a name="5549d99d-f8fd-a54a-0617-f96160ce4d28">genTable</a>() : sdbTableオブジェクトを生成

<!--::$doc/method.genTable.md::-->

### <a name="805f567f-0df3-063f-abb7-32ae4f274b30">genSchema</a>() : sdbSchemaオブジェクトを生成

<!--::$doc/method.genSchema.md::-->

### <a name="d4bbd901-20cd-8a9d-fc95-a8ac9ae41163">genColumn</a>() : sdbColumnオブジェクトを生成

<!--::$doc/method.genColumn.md::-->

### <a name="400007bb-07a5-47f4-0757-4302270834ca">genLog</a>() : sdbLogオブジェクトを生成

<!--::$doc/method.genLog.md::-->

### <a name="9a995d12-3590-3102-84f6-426abe9b6e88">convertRow</a>() : シートイメージと行オブジェクトの相互変換

<!--::$doc/method.convertRow.md::-->

### <a name="5fc49311-21b1-e6db-2a73-f56d54cf80c5">functionalize</a>() :  where句のオブジェクト・文字列を関数化

<!--::$doc/method.functionalize.md::-->


## <a name="f8072377-142a-714b-bed3-5242d99bf8a4">内部関数 - command系</a>

### <a name="fe8db1fd-ecac-e11b-bbc0-e0380cab2895">createTable</a>() : データから新規テーブルを生成

<!--::$doc/method.createTable.md::-->

### <a name="23baa473-c62c-c42a-b072-c9fad50c888b">selectRow</a>() : テーブルから条件に合致する行を抽出

<!--::$doc/method.selectRow.md::-->

### <a name="fda2d5d4-b66e-1ae8-52a9-6a971bb88c9d">updateRow</a>() : テーブルを更新

<!--::$doc/method.updateRow.md::-->

### <a name="9ecd8e07-bc7b-a5da-63bc-5a01d2803a37">appendRow</a>() : テーブルに新規行を追加

<!--::$doc/method.appendRow.md::-->

### <a name="bacd444b-ae87-6170-0ed5-c7861db25648">deleteRow</a>() : テーブルから条件に合致する行を削除

<!--::$doc/method.deleteRow.md::-->

### <a name="dd3826fa-6096-30aa-2836-59b34bb6d7bc">getSchema</a>() : 指定されたテーブルの構造情報を取得

<!--::$doc/method.getSchema.md::-->


## <a name="e298081f-47f9-7918-58d1-f572d1ef5859">注意事項</a>

<!--::$doc/cautions.md::-->

## <a name="4b6d1866-70ca-43a0-88ef-b64656d0a153">typedefs</a>

### <a name="4633fb93-038b-44db-b927-a0f5815265de">sdbTable</a>

<!--::$doc/typedef.sdbTable.md::-->

### <a name="e83945a7-e3e0-440f-b293-6de0c27aa556">sdbSchema</a>

<!--::$doc/typedef.sdbSchema.md::-->

### <a name="e23eb4c4-ab0d-4776-8038-775f6b018fc6">sdbColumn</a>

<!--::$doc/typedef.sdbColumn.md::-->

### <a name="c8640a48-efb0-4999-8b78-e10dd39f16fc">sdbLog</a>

<!--::$doc/typedef.sdbLog.md::-->

