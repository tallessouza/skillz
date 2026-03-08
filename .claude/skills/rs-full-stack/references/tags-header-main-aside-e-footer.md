---
name: rs-full-stack-tags-header-main-aside-footer
description: "Enforces correct usage of HTML semantic structure tags header, main, aside, and footer when writing HTML pages. Use when user asks to 'create a page', 'build a layout', 'structure HTML', 'add a header', or 'create page skeleton'. Ensures proper semantic hierarchy and content placement. Make sure to use this skill whenever generating HTML page structures, even for simple pages. Not for CSS layout, styling, or non-HTML templating."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-fundamentos
  tags: [html, semantic, structure, header, main, aside, footer, layout]
---

# Tags Semânticas de Estrutura: header, main, aside, footer

> Toda página HTML usa tags semânticas de estrutura para separar cabeçalho, conteúdo principal, conteúdo secundário e rodapé.

## Rules

1. **Use `<header>` para o cabeçalho** — navegação principal, logo, elementos do topo da página, porque define semanticamente o início da página para leitores de tela e SEO
2. **Use `<main>` para o conteúdo principal** — apenas UM por página, porque representa o conteúdo único daquela página específica
3. **Use `<aside>` para conteúdo secundário** — referências, links relacionados, informações complementares ao `<main>`, porque semanticamente indica conteúdo que estende ou complementa o principal
4. **Use `<footer>` para o rodapé** — informações extras, menus secundários, copyright, porque fecha semanticamente a estrutura da página
5. **Mantenha a hierarquia header → main → footer** — essa é a estrutura base de qualquer página, porque `<aside>` é opcional mas os três principais são fundamentais

## How to write

### Estrutura base de página

```html
<body>
  <header>
    <!-- Cabeçalho: logo, navegação principal -->
  </header>

  <main>
    <!-- Conteúdo principal e único da página -->
    <h1>Título da Página</h1>
    <p>Conteúdo relevante...</p>
  </main>

  <footer>
    <!-- Rodapé: links, copyright, informações extras -->
  </footer>
</body>
```

### Com aside (quando há conteúdo secundário)

```html
<body>
  <header>
    <nav><!-- navegação --></nav>
  </header>

  <main>
    <h1>Artigo Principal</h1>
    <p>Conteúdo...</p>
  </main>

  <aside>
    <!-- Conteúdos relacionados, referências, sugestões -->
    <h2>Artigos Relacionados</h2>
  </aside>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</body>
```

## Example

**Before (sem semântica):**
```html
<div class="header">...</div>
<div class="content">...</div>
<div class="sidebar">...</div>
<div class="footer">...</div>
```

**After (com tags semânticas):**
```html
<header>...</header>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página simples sem sidebar | Use apenas header + main + footer |
| Página com conteúdo complementar | Adicione aside ao lado do main |
| Blog com artigos relacionados | aside para sugestões de leitura |
| Landing page | header + main + footer (aside raramente necessário) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `<div class="header">` | `<header>` |
| `<div class="main">` | `<main>` |
| `<div class="sidebar">` | `<aside>` |
| `<div class="footer">` | `<footer>` |
| Múltiplos `<main>` na página | Um único `<main>` por página |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Conteudo aparece fora da area esperada | Tags semanticas mal aninhadas ou faltando fechamento | Verifique se cada `<header>`, `<main>`, `<aside>`, `<footer>` esta corretamente aberta e fechada |
| Leitor de tela nao identifica secoes | Usando `<div>` em vez de tags semanticas | Substitua `<div class="header">` por `<header>`, etc. |
| Multiplos `<main>` causando warnings | Mais de um `<main>` na pagina | Mantenha apenas UM `<main>` por pagina |
| Layout CSS nao se aplica corretamente | Estilos referenciando classes em vez de tags semanticas | Atualize seletores CSS para usar as tags diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semântica HTML e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tags-header-main-aside-e-footer/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tags-header-main-aside-e-footer/references/code-examples.md)
