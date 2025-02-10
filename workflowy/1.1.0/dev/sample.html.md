# テスト

## リンク先がdetailsの場合、リンク元クリックでdetailsが開くかテスト

- [リンク先](#anchor01)

- <details><summary>リンク先タイトル</summary>

  <a name="anchor01">リンク先</a>  

  リンク先タイトルに付けても開かないが、details内部に付けた場合は開く

  | No | ① | ② |
  | :-- | :-- | :-- |
  | 01 | セル① | セル② |

</details>

## all markdown(details無し)

### l1-1
### l1-2
#### l2-1
#### l2-2

<details><summary>詳細</summary>

- l3-1

  l3-1のノート

  1. その①
  1. その②

  | No | ① | ② |
  | :-- | :-- | :-- |
  | 01 | セル① | セル② |

- l3-2
- l3-3

</details>

##### l3-1
##### l3-2
##### l3-3
#### l2-3
### l1-3
### l1-4

## all markdown(details無し)

### l1-1
### l1-2
#### l2-1
#### l2-2

- l3-1

  l3-1のノート

  1. その①
  1. その②

  | No | ① | ② |
  | :-- | :-- | :-- |
  | 01 | セル① | セル② |

- l3-2
- l3-3

##### l3-1
##### l3-2
##### l3-3
#### l2-3
### l1-3
### l1-4

## [NG] 全部htmlで記述 -> TOCにl1他hタグで記述したものが出てこない

<h3>l1-1</h3>
<details><summary><h3>l1-2</h3></summary><ul>
  <li>l2-1</li>
  <li><details><summary>l2-2</summary><ul>
    <li>l3-1<div>
      <p>l3-1のノート</p>
      <br>
      <ol>
        <li>その①</li>
        <li>その②</li>
      </ol>
      <table><tr><th>へっだ</th><td>セル①</td><td>セル②</td></tr></table>
    </div></li>
    <li>l3-2<div></div></li><!-- 空のノート -->
    <li>l3-3</li>
  </ul></details></li>
  <li>l2-3</li>
</ul></details>
<h3>l1-3<ul></ul></h3><!-- 空のul -->
<h3>l1-4</h3>

## [NG]liをmarkdown記法 -> l2-1で余計な項目を認識してしまう

- <details><summary>l1-1</summary>
  - <details><summary>l2-1</summary>
    - l3-1
    - l3-2
    - l3-3
    </details>
  - l2-2
  </details>
- l1-2

## [OK]liをhtml記法(1階層) 

<ul>
  <li>l1-1</li>
  <li><details><summary>l1-2</summary><ul>
    <li>l2-1</li>
    <li>l2-2</li>
    <li>l2-3</li>
  </ul></details></li>
  <li>l1-3</li>
</ul>

## [OK]liをhtml記法(2階層) 

<ul>
  <li>l1-1</li>
  <li><details><summary>l1-2</summary><ul>
    <li>l2-1</li>
    <li><details><summary>l2-2</summary><ul>
      <li>l3-1</li>
      <li>l3-2</li>
      <li>l3-3</li>
    </ul></details></li>
    <li>l2-3</li>
  </ul></details></li>
  <li>l1-3</li>
</ul>

## [NG]liをhtml記法(2階層、子要素をmd形式で表記) 

<ul>
  <li>l1-1</li>
  <li><details><summary>l1-2</summary><ul>
    <li>l2-1</li>
    <li><details><summary>l2-2</summary><ul>
      - l3-1
      - l3-2
      - l3-3
    </ul></details></li>
    <li>l2-3</li>
  </ul></details></li>
  <li>l1-3</li>
</ul>
