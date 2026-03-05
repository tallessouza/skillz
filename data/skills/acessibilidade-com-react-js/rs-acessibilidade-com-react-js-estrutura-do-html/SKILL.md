---
name: rs-acessibilidade-react-estrutura-html
description: "Enforces correct HTML structure for accessibility when building React/Next.js pages. Use when user asks to 'create a page', 'add a title', 'fix accessibility', 'structure HTML', or 'set up head tags'. Applies rules: page must have title, lang attribute on html, heading hierarchy must increment by one (never skip levels), use CSS for sizing instead of wrong heading level. Make sure to use this skill whenever generating HTML structure or headings in React/Next.js. Not for ARIA attributes, keyboard navigation, or color contrast."
---

# Estrutura HTML Acessivel

> Toda pagina deve ter titulo, atributo lang, e hierarquia de headings que incrementa por um — nunca pule niveis.

## Rules

1. **Toda pagina deve ter um titulo** — use `<title>` dentro de `<Head>` (Next.js) ou equivalente, porque leitores de tela anunciam o titulo da aba como primeira informacao de contexto
2. **Sempre defina o atributo lang no HTML** — `<Html lang="pt-br">`, porque tecnologias assistivas usam isso para pronuncia correta e navegadores oferecem traducao quando o idioma nao corresponde
3. **Toda pagina deve conter pelo menos um H1** — o H1 representa o conteudo principal da pagina, porque leitores de tela permitem navegar por headings e o H1 e o ponto de entrada
4. **Headings so incrementam por um** — H1 → H2 → H3, nunca H1 → H4, porque pular niveis quebra a navegacao por hierarquia em tecnologias assistivas
5. **Voce pode voltar niveis** — apos H3 voce pode ter outro H2, porque hierarquias paralelas sao validas (novo subtitulo no mesmo nivel)
6. **Use CSS para tamanho, nunca o heading errado** — se H2 e grande demais, aplique `font-size` menor via CSS, porque HTML define semantica, CSS define aparencia

## How to write

### Titulo da pagina (Next.js)

```tsx
import Head from 'next/head'
// Importar de 'next/head', NAO de 'next/document'

export default function PostPage() {
  return (
    <>
      <Head>
        <title>Desenvolvendo uma web acessível | Skillz Blog</title>
      </Head>
      <main>{/* conteudo */}</main>
    </>
  )
}
```

### Atributo lang (Next.js _document)

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### Hierarquia de headings correta

```tsx
<h1>Titulo principal do post</h1>
<h2>O que e acessibilidade</h2>
<h3>Beneficios</h3>
<h2>Como implementar</h2>  {/* voltou para H2 — valido */}
<h3>Ferramentas</h3>
```

## Example

**Before (erros de acessibilidade):**
```tsx
// Sem titulo na pagina
// Sem lang no HTML
<h2>Desenvolvendo uma web acessivel</h2>
<h4>O que e acessibilidade</h4>  {/* pulou de H2 para H4 */}
```

**After (com esta skill aplicada):**
```tsx
// _document.tsx
<Html lang="pt-br">

// page.tsx
<Head>
  <title>Desenvolvendo uma web acessivel | Blog</title>
</Head>
<h1>Desenvolvendo uma web acessivel</h1>
<h2 style={{ fontSize: '1.125rem' }}>O que e acessibilidade</h2>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Heading visualmente grande demais | Reduza com CSS `font-size`, mantenha o nivel semantico correto |
| Multiplos artigos na pagina | Cada artigo pode ter seu H1, mas prefira um H1 por pagina |
| Next.js — precisa de titulo | Importe `Head` de `next/head` (nao de `next/document`) |
| Pagina em portugues | `lang="pt-br"` no elemento `<Html>` |
| Pagina multilingual | Use `lang` no elemento especifico que muda de idioma |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<h4>` logo apos `<h1>` | `<h2>` (incremente por um) |
| Heading escolhido pelo tamanho visual | Heading pelo nivel semantico + CSS para tamanho |
| Pagina sem `<title>` | Sempre inclua `<Head><title>...</title></Head>` |
| `<Html>` sem `lang` | `<Html lang="pt-br">` |
| Multiplos H1 sem justificativa semantica | Um H1 por pagina representando o conteudo principal |
| `import Head from 'next/document'` | `import Head from 'next/head'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
