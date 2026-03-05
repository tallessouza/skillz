---
name: rs-acessibilidade-react-html-landmarks
description: "Enforces correct HTML landmark structure when writing React components for accessibility. Use when user asks to 'create a layout', 'add a header', 'build a page structure', 'fix accessibility', or 'add semantic HTML'. Applies rules: use semantic elements over ARIA roles, unique landmarks with aria-label, header/main/footer/nav as page skeleton, context-aware header behavior inside article. Make sure to use this skill whenever generating page layouts or fixing accessibility issues. Not for ARIA widgets, form validation, or color contrast."
---

# HTML Landmarks

> Estruture paginas com elementos HTML semanticos (header, main, footer, nav) em vez de divs com roles, porque elementos semanticos carregam significado E comportamento.

## Rules

1. **Use elementos semanticos, nao roles** — `<header>` nao `<div role="banner">`, porque roles adicionam significado semantico mas NAO adicionam o comportamento do elemento (um `<div role="form">` nao dispara onSubmit)
2. **Toda pagina deve ter um `<main>`** — sem main, leitores de tela nao identificam o conteudo principal
3. **Todo conteudo visivel deve estar dentro de landmarks** — nenhum conteudo pode ficar "solto" fora de header, main, footer ou nav
4. **Landmarks duplicadas precisam de aria-label** — duas `<nav>` sem label sao indistinguiveis para tecnologias assistivas, causando confusao
5. **Header dentro de article NAO e banner** — um `<header>` dentro de `<article>` e apenas o cabecalho do artigo, nao uma landmark de banner, porque o contexto muda o significado do elemento
6. **Nunca adicione role redundante a elemento semantico** — nao coloque `role="banner"` em `<header>`, o elemento ja carrega essa semantica implicitamente

## How to write

### Estrutura base de pagina React

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/about">Sobre</a>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <nav aria-label="rodapé">
          <a href="/termos">Termos de uso</a>
          <a href="/privacidade">Privacidade</a>
        </nav>
      </footer>
    </>
  )
}
```

### Article com header semantico (sem landmark)

```tsx
<article>
  <header>
    <h2>{post.title}</h2>
    <h4>{post.subtitle}</h4>
  </header>
  <p>{post.content}</p>
</article>
```

## Example

**Before (sem landmarks, divs genericas):**
```tsx
<div>
  <div className="header">
    <a href="/">GitHub Explorer</a>
  </div>
  <div className="content">
    <h2>{repo.name}</h2>
    <p>{repo.description}</p>
  </div>
</div>
```

**After (com landmarks corretas):**
```tsx
<>
  <header>
    <nav>
      <a href="/">GitHub Explorer</a>
    </nav>
  </header>
  <main>
    <article>
      <header>
        <h2>{repo.name}</h2>
      </header>
      <p>{repo.description}</p>
    </article>
  </main>
</>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Cabecalho principal da pagina | `<header>` direto no root — vira landmark banner |
| Cabecalho de um artigo/card | `<header>` dentro de `<article>` — NAO vira landmark |
| Navegacao principal | `<nav>` sem aria-label (unica na pagina) |
| Navegacao secundaria (footer, sidebar) | `<nav aria-label="descricao">` |
| Conteudo principal | `<main>` (um unico por pagina) |
| Wrapper desnecessario | Remova a `<div>` e use fragment `<>` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<div role="banner">` | `<header>` |
| `<div role="main">` | `<main>` |
| `<div role="navigation">` | `<nav>` |
| `<div role="contentinfo">` | `<footer>` |
| `<header role="banner">` (redundante) | `<header>` |
| Duas `<nav>` sem aria-label | Segunda `<nav>` com `aria-label="rodape"` |
| `<div role="form" onSubmit={...}>` | `<form onSubmit={...}>` |
| Conteudo fora de qualquer landmark | Envolva em `<main>` ou landmark apropriada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
