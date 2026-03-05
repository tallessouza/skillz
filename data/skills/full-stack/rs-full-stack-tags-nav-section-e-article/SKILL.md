---
name: rs-full-stack-tags-nav-section-article
description: "Enforces correct usage of HTML semantic structural tags nav, section, and article when writing HTML markup. Use when user asks to 'create a page', 'build a layout', 'write HTML structure', 'add navigation', or 'create an article page'. Applies rules: nav for navigation links, section with named id and heading, article for self-contained content. Make sure to use this skill whenever generating HTML page structure or layout markup. Not for CSS styling, JavaScript logic, or non-HTML templating."
---

# Tags Estruturais: nav, section e article

> Cada tag estrutural HTML tem um significado semantico especifico — use-a no local correto do seu significado.

## Rules

1. **`<nav>` e para navegacao** — contem links, listas de navegacao ou logomarca, porque leitores de tela e SEO dependem dessa semantica para identificar areas de navegacao
2. **`<nav>` pode ficar dentro ou fora do `<header>`** — nao existe regra obrigando nav dentro de header, porque a especificacao permite ambos os posicionamentos
3. **`<section>` precisa de nome e heading** — use atributo `id` e um `<h2>` interno, porque section sem identificacao nao comunica nada alem de "divisao generica"
4. **`<article>` e para conteudo autocontido** — nasceu para artigos, com `<h1>` de titulo e opcionalmente sections internas com `<h2>`, porque deve fazer sentido isoladamente
5. **`<article>` geralmente fica dentro de `<main>`** — embora nao obrigatorio, article representa conteudo principal e pertence ao main, porque isso reforça a hierarquia semantica
6. **Nunca use tags estruturais como `<div>` generica** — se precisa de container sem significado, use div, porque tags estruturais existem para comunicar significado

## How to write

### Navegacao com nav

```html
<nav>
  <a href="#">Logo</a>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#contato">Contato</a></li>
    <li><a href="#projetos">Projetos</a></li>
  </ul>
</nav>
```

### Nav dentro de header (opcional)

```html
<header>
  <nav>
    <a href="#">Logo</a>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#contato">Contato</a></li>
    </ul>
  </nav>
</header>
```

### Sections nomeadas

```html
<section id="home">
  <h2>Home</h2>
  <p>Conteudo da secao home.</p>
</section>

<section id="projetos">
  <h2>Projetos</h2>
  <p>Conteudo da secao projetos.</p>
</section>
```

### Article com sections internas

```html
<main>
  <article>
    <h1>Titulo do Artigo</h1>
    <section>
      <h2>Primeiro subtitulo</h2>
      <p>Conteudo...</p>
    </section>
    <section>
      <h2>Segundo subtitulo</h2>
      <p>Conteudo...</p>
    </section>
  </article>
</main>
```

## Example

**Before (sem semantica):**
```html
<div class="menu">
  <a href="#home">Home</a>
  <a href="#contato">Contato</a>
</div>
<div class="secao">
  <h2>Projetos</h2>
</div>
<div class="post">
  <h1>Meu Artigo</h1>
  <p>Texto...</p>
</div>
```

**After (com tags estruturais corretas):**
```html
<nav>
  <a href="#home">Home</a>
  <a href="#contato">Contato</a>
</nav>
<section id="projetos">
  <h2>Projetos</h2>
</section>
<main>
  <article>
    <h1>Meu Artigo</h1>
    <p>Texto...</p>
  </article>
</main>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Links de navegacao do site | Envolva com `<nav>` |
| Bloco tematico da pagina | Use `<section id="nome">` com `<h2>` |
| Conteudo que faz sentido isolado | Use `<article>` dentro de `<main>` |
| Section com conteudo lateral | Pode ficar dentro de `<aside>` |
| Precisa de container sem significado | Use `<div>`, nao tags estruturais |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<div class="nav">` | `<nav>` |
| `<section>` sem id nem heading | `<section id="contato"><h2>Contato</h2>` |
| `<article>` sem heading | `<article><h1>Titulo</h1>...` |
| `<div class="post">` para artigo | `<article>` |
| `<section>` como div generica | `<div>` para containers sem significado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes