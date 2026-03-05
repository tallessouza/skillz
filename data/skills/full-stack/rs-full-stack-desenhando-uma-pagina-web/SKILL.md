---
name: rs-full-stack-desenhando-uma-pagina-web
description: "Enforces semantic HTML page structure when building web pages. Use when user asks to 'create a page', 'build a layout', 'structure HTML', 'add a header', 'add a footer', or any HTML scaffolding task. Applies correct semantic elements: header, nav, main, section, aside, footer in their proper positions. Make sure to use this skill whenever generating HTML page structure, even for quick prototypes. Not for CSS styling, JavaScript logic, or component-level markup."
---

# Estrutura Semantica de Paginas HTML

> Cada secao de uma pagina web tem um elemento semantico proprio — use a tag certa no lugar certo.

## Rules

1. **Use `<header>` para o topo** — contem logo e navegacao principal, porque define o cabecalho semantico da pagina
2. **Use `<nav>` para navegacao** — links de navegacao ficam dentro de `<nav>`, porque isso comunica ao browser e leitores de tela que sao links de navegacao
3. **Use `<main>` para o conteudo principal** — apenas um por pagina, porque identifica o conteudo central
4. **Use `<section>` para agrupar conteudo tematico** — cada bloco de conteudo relacionado dentro do main, porque cria divisoes semanticas claras
5. **Use `<aside>` para conteudo lateral/complementar** — informacoes extras que complementam o conteudo principal, porque semanticamente indica conteudo secundario
6. **Use `<footer>` para o rodape** — informacoes de rodape no final da pagina, porque define o encerramento semantico

## How to write

### Estrutura base de pagina

```html
<body>
  <header>
    <img src="logo.svg" alt="Logo" />
    <nav>
      <a href="/">Home</a>
      <a href="/about">Sobre</a>
      <a href="/contact">Contato</a>
    </nav>
  </header>

  <main>
    <section>
      <h1>Titulo Principal</h1>
      <p>Conteudo da secao principal.</p>
    </section>

    <section>
      <h2>Outra Secao</h2>
      <p>Mais conteudo tematico.</p>
    </section>
  </main>

  <aside>
    <h3>Extras</h3>
    <p>Conteudo complementar.</p>
  </aside>

  <footer>
    <p>&copy; 2026 Meu Site</p>
  </footer>
</body>
```

## Example

**Before (sem semantica):**
```html
<div class="header">
  <div class="logo">Logo</div>
  <div class="menu">
    <a href="/">Home</a>
  </div>
</div>
<div class="content">
  <div class="main-text">
    <h1>Titulo</h1>
    <p>Texto</p>
  </div>
  <div class="sidebar">Extras</div>
</div>
<div class="footer">Rodape</div>
```

**After (com semantica):**
```html
<header>
  <img src="logo.svg" alt="Logo" />
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <section>
    <h1>Titulo</h1>
    <p>Texto</p>
  </section>
</main>
<aside>Extras</aside>
<footer>Rodape</footer>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Topo com logo e links | `<header>` contendo `<nav>` |
| Bloco de conteudo principal | `<main>` com `<section>` dentro |
| Conteudo lateral/extra | `<aside>` |
| Rodape com copyright/links | `<footer>` |
| Grupo de links de navegacao | `<nav>` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `<div class="header">` | `<header>` |
| `<div class="nav">` | `<nav>` |
| `<div class="footer">` | `<footer>` |
| `<div class="sidebar">` | `<aside>` |
| `<div class="main">` | `<main>` |
| `<div class="section">` | `<section>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semantica HTML e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes