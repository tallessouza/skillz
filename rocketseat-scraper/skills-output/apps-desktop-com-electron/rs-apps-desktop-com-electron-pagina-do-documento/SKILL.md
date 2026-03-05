---
name: rs-electron-pagina-do-documento
description: "Applies document page layout patterns when building Electron desktop apps with React and Tailwind. Use when user asks to 'create a document page', 'add a sidebar', 'build a table of contents', 'layout with sticky sidebar', or 'structure a reading page'. Enforces sticky sidebar, composition pattern components, and centered content with max-width for readability. Make sure to use this skill whenever building document-style layouts in Electron or similar desktop apps. Not for mobile layouts, navigation bars, or non-document content pages."
---

# Página do Documento — Layout Structure

> Estruture páginas de documento com sidebar sticky para table of contents e área de conteúdo centralizada com largura limitada para leitura confortável.

## Rules

1. **Use padding assimétrico no container principal** — `py-12 px-10` (48px vertical, 40px horizontal), porque documentos precisam de respiro visual nas bordas
2. **Sidebar com position sticky e top-0** — sticky mantém a navegação visível durante scroll sem sair do flow do documento, diferente de fixed que remove do flow
3. **Sidebar responsiva com hidden lg:block** — esconda a sidebar em telas menores que 1024px, porque em telas pequenas ela compete com o conteúdo
4. **Limite a largura do texto** — use uma div com largura fixa (600-700px) centralizada, porque texto que ocupa a tela toda em monitores largos (2560px) fica ilegível
5. **Use composition pattern para componentes complexos** — exporte subcomponentes (`Toc.Root`, `Toc.Link`, `Toc.Section`) ao invés de um componente monolítico, porque permite flexibilidade na composição
6. **Escolha tags semânticas corretas** — use `<aside>` para sidebar, `<section>` para conteúdo, `<span>` ao invés de `<strong>` quando quer apenas estilo visual sem peso semântico

## How to write

### Layout principal do documento

```tsx
<main className="flex py-12 px-10 gap-8">
  {/* Sidebar — Table of Contents */}
  <aside className="hidden lg:block sticky top-0">
    <span className="text-xs font-semibold uppercase text-neutral-300">
      Table of contents
    </span>
    <Toc.Root>
      <Toc.Link>Section Title</Toc.Link>
      <Toc.Section>
        <Toc.Link>Subsection</Toc.Link>
      </Toc.Section>
    </Toc.Root>
  </aside>

  {/* Content area — centered with max-width */}
  <section className="flex-1 flex flex-col items-center">
    <div className="w-[700px] max-w-full">
      {/* Editor/content goes here */}
    </div>
  </section>
</main>
```

### Composition pattern para Table of Contents

```tsx
// components/toc.tsx
function Root({ children }) { return <nav>{children}</nav> }
function Link({ children }) { return <a>{children}</a> }
function Section({ children }) { return <div className="pl-4">{children}</div> }

export const Toc = { Root, Link, Section }
```

## Example

**Before (conteúdo sem estrutura):**
```tsx
<main className="flex items-center justify-center">
  <p>Document content stretching full width...</p>
</main>
```

**After (com sidebar sticky e conteúdo centralizado):**
```tsx
<main className="flex py-12 px-10 gap-8">
  <aside className="hidden lg:block sticky top-0">
    <span className="text-xs font-semibold uppercase text-neutral-300">
      Table of contents
    </span>
    <Toc.Root>
      <Toc.Link>Backend</Toc.Link>
      <Toc.Section>
        <Toc.Link>Banco de dados</Toc.Link>
        <Toc.Link>Autenticação</Toc.Link>
      </Toc.Section>
    </Toc.Root>
  </aside>
  <section className="flex-1 flex flex-col items-center">
    <div className="w-[700px] max-w-full">
      {/* Content */}
    </div>
  </section>
</main>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Tela > 1024px | Mostre a sidebar com `lg:block` |
| Tela < 1024px | Esconda sidebar com `hidden` |
| Texto de documento longo | Limite largura a 600-700px |
| Navegação lateral de seções | Use `sticky top-0` no aside |
| Componente com subcomponentes relacionados | Use composition pattern (`Component.Sub`) |
| Texto em negrito sem importância semântica | Use `<span className="font-semibold">` ao invés de `<strong>` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `position: fixed` para sidebar de documento | `sticky top-0` — mantém no flow |
| Texto ocupando 100% da largura em telas largas | `w-[700px] max-w-full` centralizado |
| `<strong>` só para estilo visual | `<span className="font-semibold">` |
| Componente TOC monolítico com props complexas | Composition pattern: `Toc.Root`, `Toc.Link`, `Toc.Section` |
| `display: none` com media query manual | `hidden lg:block` com Tailwind |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
