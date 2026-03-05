# Code Examples: Fundamentos do Grid no Código

## Exemplo 1: Estrutura básica sem grid

```html
<div id="app">
  <div>1</div>
  <span>2</span>
  <span>3</span>
</div>
```

```css
#app div {
  border: 1px solid red;
}

span {
  border: 1px solid blue;
}
```

**Resultado:** A div (1) ocupa a linha inteira (block). Os spans (2 e 3) ficam lado a lado com largura do conteúdo (inline).

## Exemplo 2: Aplicando display grid

```html
<div id="app">
  <div>1</div>
  <span>2</span>
  <span>3</span>
</div>
```

```css
#app {
  display: grid;
}

#app div {
  border: 1px solid red;
}

span {
  border: 1px solid blue;
}
```

**Resultado:** Todos os 3 filhos agora ocupam uma row cada. Os spans não ficam mais lado a lado — eles se comportam como blocos dentro do grid.

## Exemplo 3: display inline-grid

```css
#app {
  display: inline-grid;
}
```

**Resultado:** O container `#app` agora tem a largura do conteúdo (não 100%). Internamente, o grid funciona igual — 3 rows, uma por filho.

## Exemplo 4: Prova de que inline puro rejeita margin-top

```html
<span class="teste">Inline puro</span>
```

```css
.teste {
  display: inline;
  margin-top: 30px; /* NÃO FUNCIONA — inline puro ignora margin-top */
  border: 1px solid blue;
}
```

## Exemplo 5: inline-grid aceita margin-top

```css
#app {
  display: inline-grid;
  margin-top: 30px; /* FUNCIONA — inline-grid aceita margin-top */
}
```

## Variação: Grid com mais filhos

```html
<div class="container">
  <div>Header</div>
  <nav>Navigation</nav>
  <main>Content</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>
```

```css
.container {
  display: grid;
  /* Sem propriedades extras: 5 rows automáticas, uma por filho */
}
```

## Variação: Mistura de elementos inline e block

```html
<div class="grid">
  <div>Block element</div>
  <span>Inline element</span>
  <a href="#">Link (inline)</a>
  <p>Paragraph (block)</p>
  <em>Emphasis (inline)</em>
</div>
```

```css
.grid {
  display: grid;
  /* Todos os 5 filhos se comportam como blocos no grid */
  /* Cada um ocupa uma row */
}
```

**Ponto chave:** Não importa se o elemento é inline ou block no HTML — dentro do grid, todos são controlados pelo container.