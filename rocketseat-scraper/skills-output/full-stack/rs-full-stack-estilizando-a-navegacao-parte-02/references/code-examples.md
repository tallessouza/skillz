# Code Examples: Container Pattern e Background Full-Width

## Exemplo 1: Container basico no Global CSS

```css
/* global.css */
.container {
  padding-inline: 32px;
  max-width: 1280px;
  margin-inline: auto;
}
```

Explicacao passo a passo:
1. `padding-inline: 32px` — 32px de espacamento nas laterais (esquerda e direita)
2. `max-width: 1280px` — largura maxima inclui os 32px de cada lado (1216 + 64)
3. `margin-inline: auto` — centraliza horizontalmente quando a viewport e maior que 1280px

## Exemplo 2: Aplicando container no HTML

```html
<nav class="container">
  <!-- conteudo da navegacao -->
</nav>
```

Resultado: a nav tera 32px de padding lateral, nao ultrapassara 1280px de largura, e ficara centralizada.

## Exemplo 3: Background full-width com wrapper

```html
<!-- Wrapper: sem limitacao de largura, aplica background -->
<div class="bg-surface-color">
  <!-- Container: limita e centraliza o conteudo -->
  <nav class="container">
    <a href="#">Logo</a>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </nav>
</div>
```

```css
.bg-surface-color {
  background-color: var(--surface-color);
}
```

## Exemplo 4: Classe utilitaria de background

```css
/* global.css — classes utilitarias de background */
.bg-surface-color {
  background-color: var(--surface-color);
}

.bg-brand-color {
  background-color: var(--background-brand);
}
```

Convencao: prefixo `bg-` + nome da variavel CSS.

## Exemplo 5: Comportamento responsivo natural

```css
.container {
  padding-inline: 32px;
  max-width: 1280px;
  margin-inline: auto;
}
```

Comportamento em diferentes larguras de viewport:
- **Viewport < 1280px:** container ocupa 100% com 32px de padding lateral
- **Viewport = 1280px:** container atinge max-width, padding de 32px, conteudo com 1216px
- **Viewport > 1280px:** container fixo em 1280px, centralizado com margens automaticas

## Exemplo 6: Multiplas secoes reutilizando container

```html
<div class="bg-surface-color">
  <nav class="container"><!-- nav --></nav>
</div>

<main class="container">
  <!-- conteudo principal -->
</main>

<div class="bg-surface-color">
  <footer class="container"><!-- footer --></footer>
</div>
```

Cada secao usa `.container` para garantir os mesmos 32px laterais e 1280px de largura maxima. Secoes com background usam o wrapper externo.

## Exemplo 7: Variacao com padding-inline de dois valores

```css
/* Caso precise de padding assimetrico */
.container-asymmetric {
  padding-inline: 16px 32px; /* start: 16px, end: 32px */
  max-width: 1248px; /* 1200 + 16 + 32 */
  margin-inline: auto;
}
```

O `padding-inline` aceita dois valores para situacoes onde o espacamento nao e simetrico.