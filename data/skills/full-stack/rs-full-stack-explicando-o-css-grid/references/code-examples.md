# Code Examples: CSS Grid — Modelo Mental

## Exemplo 1: Grid basico com 1 coluna

```html
<div id="app">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

```css
#app {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
```

Resultado: elementos empilhados verticalmente (equivalente a block, mas agora num contexto de grid).

## Exemplo 2: Grid com 3 colunas

```css
#app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
```

Os 3 itens ficam lado a lado em colunas de tamanho igual.

**Variacao com `repeat`:**
```css
grid-template-columns: repeat(3, 1fr);
```

## Exemplo 3: Grid 3x3 (3 colunas, 3 linhas)

```html
<div id="app">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
</div>
```

```css
#app {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 100px);
  gap: 8px;
}
```

## Exemplo 4: Layout classico (header, sidebar, content, footer)

Este e o exemplo principal da aula — o instrutor desenha esse layout passo a passo.

```html
<div id="app">
  <header>Menu de navegacao</header>
  <aside>Sidebar com links</aside>
  <main>Conteudo principal</main>
  <footer>Informacoes do rodape</footer>
</div>
```

```css
#app {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header  header"
    "side    content"
    "footer  footer";
  min-height: 100vh;
}

header  { grid-area: header; }
aside   { grid-area: side; }
main    { grid-area: content; }
footer  { grid-area: footer; }
```

**O que acontece aqui:**
- Header ocupa as 2 colunas do topo (spanning)
- Sidebar ocupa a coluna esquerda no meio
- Content ocupa a coluna direita no meio
- Footer ocupa as 2 colunas do fundo

## Exemplo 5: Elemento ocupando multiplas celulas

```css
.item-destaque {
  grid-column: 1 / 3; /* ocupa coluna 1 e 2 */
  grid-row: 1 / 2;    /* ocupa apenas linha 1 */
}
```

**Variacao com span:**
```css
.item-destaque {
  grid-column: span 2; /* ocupa 2 colunas a partir da posicao natural */
}
```

## Exemplo 6: Deixando espacos vazios

```css
#app {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "a . b"
    ". c ."
    "d . e";
}
```

O `.` representa celulas vazias — nenhum elemento e posicionado ali.

## Exemplo 7: Posicionamento livre de elementos

```css
.elemento-a {
  grid-column: 1;
  grid-row: 1;
}

.elemento-b {
  grid-column: 3;
  grid-row: 2;
}

.elemento-c {
  grid-column: 2;
  grid-row: 3;
}
```

Cada elemento e colocado exatamente na celula desejada, independente da ordem no HTML.