# 改版履歴

- rev.1.0.0
- rev.1.1.0 2023/12/09
  - [bug] レイアウトが崩れる
  - [bug] 複数テーブル対応(grid-templateの指定を.range2Tableから要素のstyleに移動)
  - [bug] セルの高さが全て既定値になる<br>
    セルに折り返しが指定されている場合、getActiveCellInfo内のgetRowHeight()は
    表示されている行の高さを無視して全て既定値(19px)を返す。
    却って見づらくなるので、行の高さは指定しないように変更
  - 処理結果の出力先をtextareaからクリップボードに変更