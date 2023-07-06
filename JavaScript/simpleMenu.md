# 画面領域

<style>
  div {
    margin: 0;
    padding: 0;
    display: grid;
    --border: solid 1px #ccc;
    border-right: var(--border);
    border-bottom: var(--border);
  }
  div.screen {
    --header: 20px;
    border-top: var(--border);
    border-left: var(--border);
    margin: 1rem;
    width: calc(var(--header)*6 - 1px);
    height: calc(var(--header)*8 - 1px);
    grid-template-columns: calc(var(--header)*2) calc(var(--header)*3) var(--header);
    grid-template-rows:  var(--header)  calc(var(--header)*7);
  }
  .checked {
    background-color: rgba(255,192,192,0.7);
  }
</style>

<div style="grid-template-columns:repeat(3, 1fr);border:none">
  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:1/2;grid-column:1/3" class="checked">Title</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:1/2;grid-column:3/4" class="checked">MenuIcon</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/4" class="checked">Main</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:2/4" class="checked">Menu</div>
  </div>

  <div class="screen">
    <div style="grid-row:1/2;grid-column:1/2"></div>
    <div style="grid-row:1/2;grid-column:2/3"></div>
    <div style="grid-row:1/2;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2"></div>
    <div style="grid-row:2/3;grid-column:2/3"></div>
    <div style="grid-row:2/3;grid-column:3/4"></div>
    <div style="grid-row:2/3;grid-column:1/2" class="checked">MenuBack</div>
  </div>
</div>
