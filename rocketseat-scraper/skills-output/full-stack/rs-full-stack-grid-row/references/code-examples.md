# Code Examples: Grid Row

## Setup Base do Grid

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

```html
<div class="container">
  <div class="header">1 - Header</div>
  <div class="main">2 - Main</div>
  <div class="aside">3 - Aside</div>
  <div class="footer">4 - Footer</div>
</div>
```

## Exemplo 1: grid-row-start e grid-row-end (longhand)

```css
.header {
  grid-row-start: 1;
  grid-row-end: 4;
}
```

Resultado: o header ocupa da linha virtual 1 até a 4 (todas as 3 rows). Os outros items são empurrados e o grid cria linhas implícitas para acomodá-los.

## Exemplo 2: grid-row shorthand

```css
.header {
  grid-row: 1 / 4;
}
```

Idêntico ao exemplo 1, mas em uma linha.

## Exemplo 3: Combinando grid-column e grid-row

```css
.main {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}
```

O main ocupa colunas 2-4 (duas colunas) e rows 1-3 (duas rows).

## Exemplo 4: Layout Completo (Mínima Configuração)

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

/* Apenas 2 items precisam de configuração explícita */
.header {
  grid-row: 1 / 4;
}

.main {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}

/* aside e footer se posicionam automaticamente */
```

## Variação: Layout Sidebar + Content

```css
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.sidebar {
  grid-row: 1 / 3; /* ocupa header + content rows */
}

/* content e footer se auto-posicionam */
```

## Variação: Item Spanning com span

```css
/* Alternativa ao end explícito */
.header {
  grid-row: 1 / span 3; /* começa na 1, ocupa 3 rows */
}

/* Equivale a grid-row: 1 / 4 */
```

## DevTools: Visualizando Linhas Implícitas

No Chrome/Firefox DevTools:
1. Inspecione o container grid
2. Clique no badge "grid" no painel Elements
3. Linhas explícitas aparecem sólidas
4. Linhas implícitas (criadas automaticamente) aparecem tracejadas
5. Conte as linhas para verificar se o grid extrapolou