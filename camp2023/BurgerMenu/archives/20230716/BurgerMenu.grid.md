# body画面領域

<style>
  :root {
    --header: 20px;
    --border: solid 1px #ccc;
  }

  div {
    margin: 0;
    padding: 0;
    display: grid;
    border-right: var(--border);
    border-bottom: var(--border);
  }
  div.body, div.screen {
    border-top: var(--border);
    border-left: var(--border);
    margin: 1rem;
    width: calc(var(--header)*6 - 1px);
    height: calc(var(--header)*8 - 1px);
  }
  div.body {
    grid-template-rows:  var(--header)  calc(var(--header)*7);
  }
  div.screen {
    grid-template-columns: calc(var(--header)*2) calc(var(--header)*3) var(--header);
    grid-template-rows:  var(--header)  calc(var(--header)*7);
  }
  .checked {
    background-color: rgba(255,192,192,0.7);
  }
</style>


<div style="grid-template-columns:repeat(4, 1fr);border:none">
  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/4"></div>
    <div style="grid-row:2/3;grid-column:1/4"></div>
    <div style="grid-row:1/3;grid-column:1/4" class="checked">.SimpleMenu<br>(z=1)</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/4"></div>
    <div style="grid-row:2/3;grid-column:1/4"></div>
    <div style="grid-row:2/3;grid-column:1/4" class="checked">body > div:not(.BurgerMenu)<br>(z=0)</div>
  </div>

</div>

# BurgerMenu画面領域

<div style="grid-template-columns:repeat(4, 1fr);border:none">
  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:1/2;grid-column:1/3" class="checked">.Title<br>(z=1)</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:1/2;grid-column:3/4" class="checked">.Navicon<br>(z=1)</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:2/4" class="checked">.Navi<br>(z=3)</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:1/3;grid-column:1/4" class="checked">.NaviBack<br>(z=2)</div>
  </div>
</div>
