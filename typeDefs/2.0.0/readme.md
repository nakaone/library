# シート格納場所

ena.kaon > Google Drive > projects > [typeDefs](https://docs.google.com/spreadsheets/d/1XN7p14-Hyo2DCu76A0I6UXjUxLlKtfP9697UxjS-7ys/edit?usp=drive_link)

## "origin"の考え方

### 目的

- リンク元の親要素に対して子要素の追加・削除が有った場合、それを反映する
- リンク先の要素に未設定の属性が有った場合、リンク元の当該属性を引用する

### 処理

- "origin"には引用元要素のnIdを設定する
- 親要素1の子要素aを親要素2に持たせたい場合
  - 親要素2のnodeテーブル上のoriginは空白(設定不要)
  - branchテーブル上に親要素2-子要素bのレコードを追加
  - nodeテーブル上のnId=bのレコードのoriginに子要素aのoriginを設定

- リンク元の親要素1に子要素nが追加された場合
  1. 親要素1の既存子要素(1〜m)のいずれかを持つ要素を検索
  2. 1.で検索された全要素それぞれに対して子要素nを追加するか確認

**【没案】**

- 「親要素1の既存子要素(1〜m)のいずれかを持つ要素を検索」の代わりに「親要素1のnIdをoriginに持つ要素を全て検索」
  - 複数のリンク元から子要素を引用したい場合、親要素のoriginを配列化しなければならないのでNG

- リンク元の親要素1から子要素nが削除された場合
  1. 子要素nのnIdをchildとして持つ親要素を検索
  2. 1.で検索された全要素それぞれに対して子要素nを削除するか確認

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