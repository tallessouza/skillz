---
name: rs-full-stack-semantica-1
description: "Enforces semantic HTML element usage when writing HTML markup. Use when user asks to 'create a page', 'write HTML', 'build a layout', 'add a section', or any HTML structure task. Applies rules: use semantic tags over generic divs, match element to content purpose, never use divs for titles/paragraphs/navigation/sections. Make sure to use this skill whenever generating HTML, even if the user doesn't mention semantics. Not for CSS styling, JavaScript logic, or backend code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-fundamentals
  tags:
    - html
    - semantics
    - accessibility
    - seo
    - structure
---

# HTML Semântico

> Cada elemento HTML deve comunicar o significado do seu conteúdo, nunca apenas sua aparência visual.

## Rules

1. **Pergunte "tem uma tag pra isso?"** — antes de usar `<div>` ou `<span>`, verifique se existe um elemento semântico adequado, porque o HTML tem mais de 100 elementos semânticos disponíveis
2. **Nunca estruture conteúdo apenas com divs** — `<div>` é genérico e invisível para leitores de tela e motores de busca, porque acessibilidade e SEO dependem de semântica
3. **Elemento descreve o conteúdo, CSS descreve a aparência** — use `<h1>` para título e estilize com CSS, nunca um `<div class="titulo">`, porque separar significado de visual é o propósito do HTML
4. **Use elementos HTML5 de estrutura** — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` existem para organizar regiões da página
5. **Elementos interativos têm tags próprias** — links usam `<a>`, botões usam `<button>`, nunca `<div onclick>`, porque a semântica nativa traz acessibilidade de graça
6. **Elementos de mídia têm tags próprias** — imagens usam `<img>`, vídeos usam `<video>`, áudio usa `<audio>`, porque permitem fallbacks e metadados nativos

## How to write

### Estrutura de página

```html
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">Sobre</a>
  </nav>
</header>

<main>
  <article>
    <h1>Título do Conteúdo</h1>
    <p>Parágrafo descritivo.</p>
  </article>
  <aside>
    <h2>Relacionados</h2>
  </aside>
</main>

<footer>
  <p>© 2025</p>
</footer>
```

### Conteúdo textual

```html
<h1>Título principal</h1>
<p>Parágrafo explicativo com <a href="/link">um link</a>.</p>
<button type="submit">Enviar</button>
```

## Example

**Before (div soup):**
```html
<div class="header">
  <div class="nav">
    <div class="link" onclick="go('/')">Home</div>
  </div>
</div>
<div class="content">
  <div class="title">Meu Site</div>
  <div class="text">Bem-vindo ao meu site.</div>
  <div class="btn" onclick="submit()">Enviar</div>
</div>
```

**After (HTML semântico):**
```html
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <h1>Meu Site</h1>
  <p>Bem-vindo ao meu site.</p>
  <button type="submit">Enviar</button>
</main>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Texto que é um título | `<h1>`–`<h6>` conforme hierarquia |
| Bloco de texto corrido | `<p>` |
| Navegação do site | `<nav>` com `<a>` dentro |
| Ação do usuário | `<button>` ou `<a>` (navegação) |
| Imagem | `<img>` com `alt` descritivo |
| Vídeo/áudio | `<video>` / `<audio>` com fallback |
| Região lateral | `<aside>` |
| Conteúdo independente | `<article>` |
| Agrupamento temático | `<section>` com heading |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<div class="title">` | `<h1>` a `<h6>` |
| `<div class="paragraph">` | `<p>` |
| `<div onclick="...">` | `<button>` ou `<a>` |
| `<div class="nav">` | `<nav>` |
| `<div class="header">` | `<header>` |
| `<div class="footer">` | `<footer>` |
| `<span class="link">` | `<a href="...">` |
| `<div class="image">` com background-image | `<img src="..." alt="...">` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Leitor de tela nao identifica regioes da pagina | Uso exclusivo de divs sem elementos semanticos | Substitua divs por `<header>`, `<nav>`, `<main>`, `<footer>` |
| SEO fraco apesar de conteudo bom | Titulos em divs em vez de tags `<h1>`-`<h6>` | Use heading tags na hierarquia correta |
| Botao nao acessivel via teclado | Usando `<div onclick>` em vez de `<button>` | Substitua por `<button>` que tem acessibilidade nativa |
| Formulario nao submete com Enter | Elementos interativos em divs genericas | Use `<form>`, `<button type="submit">` e `<input>` semanticos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semântica, acessibilidade e SEO
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-semantica-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-semantica-1/references/code-examples.md)
