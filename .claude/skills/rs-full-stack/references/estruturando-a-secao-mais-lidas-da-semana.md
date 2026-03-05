---
name: rs-full-stack-estruturando-secao-mais-lidas
description: "Applies semantic HTML structure patterns for repeated content sections like 'most read', 'trending', or 'featured' lists. Use when user asks to 'create a section', 'build a card list', 'structure a news section', 'make a grid of articles', or 'layout repeated content'. Enforces figure/figcaption patterns, proper header with navigation links, and grid-based card layouts. Make sure to use this skill whenever building content listing sections with repeated card elements. Not for styling, animations, or JavaScript interactivity."
---

# Estruturando Seções de Listagem de Conteúdo

> Seções de listagem repetem uma estrutura semântica (figure + tag + imagem + texto) dentro de um grid, sempre precedidas por um header com título e link de navegação.

## Rules

1. **Use `<section>` com nome semântico** — `class="weekly"`, `class="trending"`, porque identifica o bloco no DOM e facilita estilização isolada
2. **Header da seção contém título + link de navegação** — `<h3>` + `<a>` com "Ver tudo", porque o usuário precisa de acesso rápido à página completa
3. **Use `<figure>` para cada card de conteúdo** — não `<div>`, porque figure representa conteúdo autocontido com mídia e legenda
4. **Tags de categoria via `<span class="content-tag">`** — dentro do figure, antes da imagem, porque identifica visualmente a categoria do conteúdo
5. **Grid utilitário no container dos cards** — `class="grid gap-16"`, porque mantém espaçamento consistente sem CSS custom
6. **Header usa grid flow column** — `class="grid grid-flow-col"`, porque posiciona título à esquerda e link à direita automaticamente

## How to write

### Estrutura completa da seção

```html
<section class="weekly">
  <header class="grid grid-flow-col">
    <h3>Mais Lidas da Semana</h3>
    <a href="#">
      <strong>Ver tudo</strong>
      <span><!-- ícone seta via CSS --></span>
    </a>
  </header>

  <div class="grid gap-16">
    <figure>
      <span class="content-tag">Categoria</span>
      <img src="assets/images/image-06.jpg" alt="Descrição" />
      <p>Título da notícia com texto truncado...</p>
    </figure>
    <!-- repetir figure para cada item -->
  </div>
</section>
```

### Padrão de repetição dos figures

```html
<!-- Cada figure segue exatamente a mesma estrutura -->
<figure>
  <span class="content-tag">Veículos</span>
  <img src="assets/images/image-06.jpg" alt="" />
  <p>Texto da chamada com três pontinhos...</p>
</figure>

<figure>
  <span class="content-tag">Internet</span>
  <img src="assets/images/image-07.jpg" alt="" />
  <p>Texto da chamada com três pontinhos...</p>
</figure>
```

## Example

**Before (estrutura genérica com divs):**
```html
<div class="section">
  <div class="title">Mais Lidas</div>
  <div class="cards">
    <div class="card">
      <div class="tag">Veículos</div>
      <img src="image.jpg" />
      <div class="text">Texto...</div>
    </div>
  </div>
</div>
```

**After (com esta skill aplicada):**
```html
<section class="weekly">
  <header class="grid grid-flow-col">
    <h3>Mais Lidas da Semana</h3>
    <a href="#"><strong>Ver tudo</strong><span></span></a>
  </header>
  <div class="grid gap-16">
    <figure>
      <span class="content-tag">Veículos</span>
      <img src="assets/images/image-06.jpg" alt="Veículos" />
      <p>Texto da chamada...</p>
    </figure>
  </div>
</section>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Seção com lista de cards repetidos | `section > header + div.grid > figure*N` |
| Header precisa de título + ação | `header.grid.grid-flow-col` com h3 + a |
| Card tem mídia + texto | `figure` com img + p, não div genérica |
| Card tem categoria/tag | `span.content-tag` como primeiro filho do figure |
| Ícone decorativo no link | `span` vazio, estilizado via CSS (não inline SVG) |
| Imagens seguem sequência | Numerar: `image-06.jpg`, `image-07.jpg`, etc. |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `<div class="section">` para listagem | `<section class="weekly">` |
| `<div class="title">` no topo da seção | `<header><h3>Título</h3></header>` |
| `<div class="card">` para mídia + texto | `<figure>` |
| `<div class="tag">` para categoria | `<span class="content-tag">` |
| Ícone como `<img>` inline | `<span>` vazio + CSS background/pseudo-element |
| Espaçamento via margin nos cards | Grid com `gap-16` no container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semântica HTML e escolhas de estrutura
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estruturando-a-secao-mais-lidas-da-semana/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estruturando-a-secao-mais-lidas-da-semana/references/code-examples.md)
