1. 関数での抽出条件・値の指定時の制約

   default(sdbColumn), where, record(update他)では関数での指定を可能にしている。
   これらをセル・メモで保存する場合、文字列に変換する必要があるが、以下のルールで対応する。
   
   - 引数は行オブジェクトのみ(引数は必ず一つ)
   - 関数に復元する場合`new Function('o',[ロジック部分文字列])で関数化
     - 必ず"{〜}"で囲み、return文を付ける

1. 権限によるアクセス制限(rwdos)
   r:read, w:write, d:delete, o:own, s:schema + c:createの略。コマンド毎に以下の権限が必要になる。
   
   - create(c): テーブル生成。管理者のみ実行可
   - select(r): 参照
   - update(rw): 更新
   - append(w): 追加
   - delete(d): 削除
   - schema(s): テーブル管理情報の取得
   
   特殊権限'o' : イベント申込情報等、本人以外の参照・更新を抑止するためのアクセス権限。
   
   - `userAuth:{シート名:o}`が指定された場合、当該シートのprimaryKey=userIdとなっているレコードのみ'r','w'可と看做す。
   - 'o'指定が有るシートのアクセス権として'rwds'が指定されていても'o'のみ指定されたと看做す
   - 'o'指定でselect/updateする場合、where句は無視され自情報に対する処理要求と看做す
     ex. userId=2の人がuserId=1の人の氏名の更新を要求 ⇒ userId=2の氏名が更新される
     SpreadDb(
       {table:'camp2024',command:'update',where:1,record:{'申込者氏名':'テスト'}},
       {userId:2,userAuth:{camp2024:'o'}}
     ); // -> userId=2の氏名が「テスト」に