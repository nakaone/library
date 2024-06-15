# シート格納場所

ena.kaon > Google Drive > projects > [typeDefs](https://docs.google.com/spreadsheets/d/1XN7p14-Hyo2DCu76A0I6UXjUxLlKtfP9697UxjS-7ys/edit?usp=drive_link)


# 更新履歴

- rev.2.0.0
  - masterシートをnode,relationに分離
  - labelを含め、画面に表示する要素はnode.attributeに一元化
  - node.type(行タイプ)を追加
- rev.1.3.0 : 2024/06/05
  - range,defaultをnote欄に統合
  - 関数・メソッド内部で呼び出す関数・メソッドをシート上に項目として追加(ref,refName)
  - refをhtml上の備考欄に追記するよう修正
- rev.1.2.0 : 2024/06/01
  - ロジック見直しでcId, cName, hasChild欄を削除
  - choices -> range, def -> defaultに欄の名前を変更
  - シート上のシステム行を2行目に集約
  - lId<0を除外対象子要素として指定可能に
- rev.1.1.0 : 2024/05/30
  - 表示対象のルート要素(pId)をURLクエリから指定可能に変更
  - primitive, relationを同一シートに統合
  - range(choices), default(def)欄を追加
- rev.1.0.0 : 2024/05/28 初版作成