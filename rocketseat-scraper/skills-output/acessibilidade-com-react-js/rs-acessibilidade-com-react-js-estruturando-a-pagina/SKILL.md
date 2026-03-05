---
name: rs-acessibilidade-react-estruturando-pagina
description: "Identifies and fixes non-semantic HTML structure in React/Next.js pages. Use when user asks to 'create a page', 'build a layout', 'add a header', 'structure HTML', or 'fix accessibility'. Detects div-soup, wrong heading hierarchy, missing alt text, non-semantic navigation. Make sure to use this skill whenever generating page structure or reviewing existing HTML semantics. Not for styling, state management, or API integration."
---

# Estruturando Paginas com HTML Semantico

> Toda estrutura de pagina deve usar elementos semanticos corretos — divs nao comunicam significado para tecnologias assistivas.

## Rules

1. **Use elementos semanticos no lugar de divs** — `<header>` nao `<div className="header">`, `<nav>` nao `<div className="nav">`, porque leitores de tela dependem da semantica para navegar
2. **Sempre passe alt text em imagens** — Next.js Image exige `alt` prop, porque imagens sem alt sao invisiveis para usuarios de leitores de tela
3. **Respeite a hierarquia de headings** — comece com `<h1>`, depois `<h2>`, `<h3>` em ordem, nunca pule niveis (h2 direto para h4), porque a arvore de headings e usada como indice de navegacao
4. **Uma pagina deve ter exatamente um h1** — o titulo principal da pagina, porque multiplos h1 confundem a estrutura do documento
5. **Links com apenas icone precisam de label acessivel** — `aria-label` ou texto visualmente escondido, porque um SVG dentro de `<a>` nao comunica destino
6. **Use `<main>` para o conteudo principal** — nao `<div className="content">`, porque `<main>` permite pular direto ao conteudo

## How to write

### Header semantico com Next.js

```tsx
// CORRETO: elementos semanticos
<header className={styles.header}>
  <Image src={logoImg} alt="Logo Rocketseat" width={143} height={39} />
  <nav>
    <a href="https://github.com/user" aria-label="Perfil no GitHub">
      <GitHubIcon />
    </a>
  </nav>
</header>
```

### Hierarquia de headings correta

```tsx
<main className={styles.content}>
  <h1>Desenvolvendo uma web acessivel</h1>
  <h2>Protocolos e diretrizes</h2>
  <p>Conteudo do paragrafo...</p>
  <h2>O que e acessibilidade afinal</h2>
  <p>Mais conteudo...</p>
</main>
```

## Example

**Before (pagina nao acessivel):**
```tsx
<div>
  <div className="header">
    <Image src={logoImg} width={143} />
    <div className="nav">
      <a href="https://github.com/user">
        <svg>...</svg>
      </a>
    </div>
  </div>
  <div className="content">
    <h2>Desenvolvendo uma web acessivel</h2>
    <h4>Protocolos e diretrizes</h4>
    <p>Texto...</p>
    <h3>O que e acessibilidade</h3>
  </div>
</div>
```

**After (com semantica correta):**
```tsx
<>
  <header className={styles.header}>
    <Image src={logoImg} alt="Logo Rocketseat" width={143} height={39} />
    <nav className={styles.nav}>
      <a href="https://github.com/user" aria-label="Perfil no GitHub">
        <svg>...</svg>
      </a>
    </nav>
  </header>
  <main className={styles.content}>
    <h1>Desenvolvendo uma web acessivel</h1>
    <h2>Protocolos e diretrizes</h2>
    <p>Texto...</p>
    <h2>O que e acessibilidade</h2>
  </main>
</>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Container de layout sem significado | `<div>` e OK (wrapper de CSS) |
| Cabecalho da pagina com logo e nav | `<header>` + `<nav>` |
| Area principal de conteudo | `<main>` |
| Grupo de links de navegacao | `<nav>` |
| Imagem decorativa (logo sem funcao de link) | `alt=""` (vazio, nao omitir) |
| Imagem informativa | `alt` descritivo do conteudo |
| Link contendo apenas icone/SVG | Adicionar `aria-label` |
| Titulos visuais menores | Usar CSS para tamanho, manter hierarquia semantica |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div className="header">` | `<header>` |
| `<div className="nav">` | `<nav>` |
| `<div className="content">` (conteudo principal) | `<main>` |
| `<h2>` como primeiro heading da pagina | `<h1>` |
| `<h2>` seguido de `<h4>` (pulando h3) | `<h2>` seguido de `<h3>` |
| `<Image src={logo} />` (sem alt) | `<Image src={logo} alt="Logo Rocketseat" />` |
| `<a href="..."><svg/></a>` (sem label) | `<a href="..." aria-label="GitHub"><svg/></a>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
