---
name: rs-full-stack-estruturando-secao-destaques
description: "Enforces CSS Grid layout patterns for image gallery sections with proper image fitting and utility class organization. Use when user asks to 'create an image grid', 'build a featured section', 'layout images in columns', 'fix image overflow', or 'organize CSS files'. Applies object-fit cover for image cropping, utility-first CSS classes, and Grid template columns. Make sure to use this skill whenever building image-heavy sections or grid layouts with mixed column counts. Not for CSS animations, responsive breakpoints, or JavaScript interactivity."
---

# Estruturando Secoes de Destaque com CSS Grid

> Construa secoes de imagens usando Grid com classes utilitarias separadas, imagens ajustadas com object-fit cover, e CSS modularizado em arquivos dedicados.

## Rules

1. **Separe CSS em arquivos por responsabilidade** — `utility.css` para classes reutilizaveis, `sections.css` para estilos de secao, `global.css` para resets e base, porque facilita manutencao e evita arquivos monoliticos
2. **Imagens sempre com max-width 100%** — no CSS global, aplique `img { max-width: 100% }` porque impede transbordamento horizontal (scroll lateral = algo transbordando)
3. **Use object-fit cover para preencher espacos** — quando a imagem nao tem o recorte perfeito do layout (sempre vai acontecer), `object-fit: cover` faz a cobertura completa sem distorcao
4. **Combine height 100% com object-fit cover** — `height: 100%` preenche o espaco sobrando, `cover` corrige a distorcao que o esticamento causa
5. **Crie classes utilitarias granulares para Grid** — `grid`, `grid-flow-col`, `grid-cols-2`, `gap-16` como classes separadas porque permitem composicao no HTML
6. **Use IDs para secoes unicas, classes para reutilizaveis** — `section#featured` para a secao especifica, `.grid` para comportamento reutilizavel

## How to write

### Estrutura HTML da secao

```html
<main class="container grid">
  <section id="featured">
    <div>
      <img src="assets/images/image-1.png" alt="Destaque principal" />
    </div>
    <div class="grid grid-cols-2 gap-16">
      <div><img src="assets/images/image-2.png" alt="" /></div>
      <div><img src="assets/images/image-3.png" alt="" /></div>
      <div><img src="assets/images/image-4.png" alt="" /></div>
      <div><img src="assets/images/image-5.png" alt="" /></div>
    </div>
  </section>
</main>
```

### Classes utilitarias (utility.css)

```css
.grid { display: grid; }
.grid-flow-col { grid-auto-flow: column; }
.grid-cols-2 { grid-template-columns: 1fr 1fr; }
.gap-16 { gap: 16px; }
```

### Estilos da secao (sections.css)

```css
#featured img {
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

### Global (global.css)

```css
img {
  max-width: 100%;
}

main {
  margin-top: 40px;
}
```

### Imports no index

```css
@import url("utility.css");
@import url("header.css");
@import url("sections.css");
```

## Example

**Before (imagens transbordando, sem organizacao):**

```css
/* Tudo num arquivo so */
.featured img { width: auto; }
.grid-container { display: flex; flex-wrap: wrap; }
```

```html
<div class="grid-container">
  <img src="image-1.png" />
  <img src="image-2.png" />
  <!-- imagens gigantes causam scroll horizontal -->
</div>
```

**After (com esta skill aplicada):**

```css
/* global.css */
img { max-width: 100%; }

/* utility.css */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: 1fr 1fr; }
.gap-16 { gap: 16px; }

/* sections.css */
#featured img {
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

```html
<section id="featured" class="grid grid-flow-col gap-16">
  <div><img src="image-1.png" alt="Destaque principal" /></div>
  <div class="grid grid-cols-2 gap-16">
    <div><img src="image-2.png" alt="" /></div>
    <div><img src="image-3.png" alt="" /></div>
    <div><img src="image-4.png" alt="" /></div>
    <div><img src="image-5.png" alt="" /></div>
  </div>
</section>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Scroll horizontal apareceu | Algum elemento esta transbordando — verifique `max-width: 100%` nas imagens |
| Espaco sobrando ao redor da imagem | Aplique `height: 100%` + `object-fit: cover` |
| Imagem esticou/distorceu | Falta `object-fit: cover` (height sozinho distorce) |
| Layout 1 grande + N pequenas | Grid com `grid-auto-flow: column` no container pai, `grid-cols-2` no container das pequenas |
| CSS ficando grande demais | Separe em `utility.css`, `sections.css`, `global.css` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Todas as classes CSS num unico arquivo | Arquivos separados por responsabilidade |
| `img { width: 100%; height: auto; }` para grids | `img { max-width: 100%; }` global + `height: 100%; object-fit: cover;` na secao |
| `display: flex; flex-wrap: wrap` para grid de imagens 2x2 | `display: grid; grid-template-columns: 1fr 1fr;` |
| Imagem sem restricao de largura maxima | `img { max-width: 100%; }` no global |
| Espacamento com margin em cada item | `gap: 16px` no container grid |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre object-fit, transbordamento e organizacao CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes