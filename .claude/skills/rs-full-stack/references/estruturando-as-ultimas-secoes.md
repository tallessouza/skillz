---
name: rs-full-stack-estruturando-ultimas-secoes
description: "Applies HTML section structuring patterns when building multi-article news portal layouts. Use when user asks to 'create a news section', 'structure articles grid', 'build a portal layout', 'add content sections with cards', or 'layout articles with images and text'. Enforces semantic HTML with article tags, grid utility classes, content-tag spans, and consistent header patterns across sections. Make sure to use this skill whenever structuring repeated content sections in a news or blog portal. Not for CSS styling, animations, or JavaScript interactivity."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-layout
  tags: [html, semantic-html, article, grid, news-portal]
---

# Estruturando Secoes de Portal de Noticias

> Ao criar secoes de conteudo repetitivo, use tags semanticas consistentes, utility classes de grid/gap, e um padrao de header replicavel entre secoes.

## Rules

1. **Use `<article>` para itens de conteudo** — cada noticia/card e um `<article>`, porque semanticamente representa conteudo independente e redistribuivel
2. **Mantenha headers consistentes entre secoes** — toda section tem `<header>` com `<h3>` + link "ver tudo" com seta, porque cria previsibilidade visual e de codigo
3. **Separe imagem e texto em divs distintas** — dentro do article, uma div para imagem e outra para textos, porque permite controle independente de layout via grid
4. **Use utility classes para espacamento** — `gap-16`, `gap-32`, `grid`, `grid-flow-col` como classes reutilizaveis, porque evita CSS inline e promove consistencia
5. **Use `<span>` com classe `content-tag`** — para categorias/tags de conteudo (ex: "inteligencia artificial", "criptomoedas"), porque diferencia visualmente a categoria do titulo
6. **Crie utility classes conforme necessidade** — ao precisar de `gap-32`, crie no arquivo de utilitarios e reutilize, porque evita duplicacao de CSS

## How to write

### Estrutura de section completa

```html
<section>
  <!-- Ads lateral (quando aplicavel) -->
  <div>
    <img src="assets/ads.png" alt="Anuncio" />
  </div>

  <!-- Section de conteudo -->
  <section class="more">
    <header>
      <h3>Destaques da Inteligencia Artificial</h3>
      <a href="#">
        <span class="grid grid-flow-col">
          <strong>Ver tudo</strong>
          <span>→</span>
        </span>
      </a>
    </header>

    <div class="grid gap-32">
      <!-- Articles aqui -->
    </div>
  </section>
</section>
```

### Estrutura de article (imagem + texto)

```html
<article class="grid grid-flow-col gap-16">
  <div>
    <img src="assets/images/image-10.png" alt="Descricao da imagem" />
  </div>
  <div>
    <span class="content-tag">Inteligencia Artificial</span>
    <h3 class="text-extra-large">Titulo do artigo aqui...</h3>
    <p class="text-small">Texto do artigo que para em determinado ponto...</p>
  </div>
</article>
```

### Article com ordem invertida (texto antes da imagem)

```html
<article class="grid grid-flow-col gap-16">
  <div>
    <span class="content-tag">Realidade Virtual</span>
    <h3 class="text-extra-large">Titulo do artigo...</h3>
  </div>
  <div>
    <img src="assets/images/image-14.png" alt="Descricao da imagem" />
  </div>
</article>
```

### Utility class no CSS

```css
.gap-32 {
  gap: 32px;
}
```

## Example

**Before (sem padrao, sem semantica):**
```html
<div>
  <div class="title">Inteligencia Artificial</div>
  <div>
    <div>
      <img src="img10.png" />
      <div class="tag">IA</div>
      <div class="big-text">Titulo...</div>
      <div>Texto...</div>
    </div>
    <div>
      <img src="img11.png" />
      <div class="tag">IA</div>
      <div class="big-text">Titulo...</div>
    </div>
  </div>
</div>
```

**After (com esta skill aplicada):**
```html
<section>
  <header>
    <h3>Destaques da Inteligencia Artificial</h3>
    <a href="#" class="grid grid-flow-col">
      <strong>Ver tudo</strong>
      <span>→</span>
    </a>
  </header>

  <div class="grid gap-32">
    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-10.png" alt="IA em empresas" />
      </div>
      <div>
        <span class="content-tag">Inteligencia Artificial</span>
        <h3 class="text-extra-large">Empresas adotam IA...</h3>
        <p class="text-small">Texto descritivo...</p>
      </div>
    </article>

    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-11.png" alt="Avancos em IA" />
      </div>
      <div>
        <span class="content-tag">Inteligencia Artificial</span>
        <h3 class="text-extra-large">Outro titulo...</h3>
        <p class="text-small">Outro texto...</p>
      </div>
    </article>
  </div>
</section>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Secao com lista de artigos/noticias | Use `<section>` com `<header>` + `<div class="grid gap-32">` contendo `<article>`s |
| Article com imagem ao lado do texto | `grid grid-flow-col gap-16` no article, divs separadas para img e texto |
| Article que inverte posicao da imagem | Troque a ordem das divs (texto primeiro, imagem depois) |
| Precisa de novo espacamento | Crie utility class no CSS (ex: `gap-32`) |
| Categoria/tag de conteudo | `<span class="content-tag">` |
| Link "ver tudo" com seta | `<a>` com `<strong>Ver tudo</strong>` + `<span>` para seta |
| Texto longo que precisa truncar | Corte no CSS depois; no HTML, coloque o texto completo |
| Multiplas secoes com mesmo padrao | Replique a estrutura header + div.grid + articles |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<div class="title">` para titulos de secao | `<header><h3>Titulo</h3></header>` |
| `<div>` para cards de noticia | `<article>` com classes de grid |
| `style="gap: 32px"` inline | `class="gap-32"` com utility no CSS |
| `<div class="tag">` para categorias | `<span class="content-tag">` |
| Imagem e texto na mesma div sem separacao | Divs distintas dentro do article |
| `<img>` sem atributo alt | `<img alt="descricao relevante">` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Articles nao alinham imagem e texto lado a lado | Falta `grid grid-flow-col` no article | Adicionar classes de grid no article |
| Espacamento entre articles inconsistente | Usando margin em vez de gap | Usar `gap-32` no container grid |
| Ordem imagem/texto invertida | Divs na ordem errada dentro do article | Trocar ordem das divs filhas do article |
| Utility class `gap-32` nao funciona | Classe nao definida no CSS | Criar `.gap-32 { gap: 32px; }` no utility.css |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semantica HTML, hierarquia de headings e padroes de replicacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e secoes completas