---
name: rs-testes-arq-frontend-home-page
description: "Generates a Next.js home page with centered placeholder content and responsive layout structure. Use when user asks to 'create a home page', 'build a landing page', 'setup initial page', or 'create a placeholder page' in Next.js projects. Applies patterns: flex-centered content, responsive padding, viewport-height layout, sidebar-ready structure. Make sure to use this skill whenever scaffolding the initial page of a Next.js app with Tailwind CSS. Not for complex pages with data fetching, authentication flows, or API integration."
---

# Criando a Home Page — Next.js com Layout Sidebar-Ready

> Ao criar a pagina inicial, estruture o layout para acomodar sidebar e conteudo principal desde o inicio, mesmo que a sidebar ainda nao exista.

## Rules

1. **Layout raiz com h-screen e flex** — o body wrapper usa `flex h-screen` para ocupar toda a viewport, porque isso prepara a estrutura para sidebar + conteudo lado a lado
2. **Main com flex-1 e overflow-auto** — o conteudo principal ocupa o espaco restante e permite scroll independente, porque a sidebar tera altura fixa
3. **Padding responsivo progressivo** — use `p-4 sm:p-6 md:p-8` para adaptar espacamento por breakpoint, porque telas pequenas precisam de mais area util
4. **Conteudo placeholder centralizado** — use flex + items-center + justify-center para centralizar instrucoes ao usuario, porque a home sem conteudo selecionado deve guiar o usuario
5. **Max-width no conteudo** — aplique `max-w-3xl mx-auto` para limitar largura de leitura, porque linhas muito longas prejudicam legibilidade

## How to write

### Layout raiz (layout.tsx)

```tsx
// Dentro do body no layout.tsx
<section className="flex h-screen">
  {/* Sidebar vai aqui depois */}
  <main className="relative flex-1 overflow-auto">
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      {children}
    </div>
  </main>
</section>
```

### Home page (page.tsx)

```tsx
export default function Home() {
  return (
    <section className="flex min-h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Selecione um prompt
          </h1>
          <p className="text-gray-400">
            Escolha um prompt da lista ao lado para visualizar e editar.
          </p>
        </div>
      </div>
    </section>
  )
}
```

## Example

**Before (default Next.js page):**
```tsx
export default function Home() {
  return <div>Welcome</div>
}
```

**After (with this skill applied):**
```tsx
export default function Home() {
  return (
    <section className="flex min-h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Selecione um prompt</h1>
          <p className="text-gray-400">
            Escolha um prompt da lista ao lado para visualizar e editar.
          </p>
        </div>
      </div>
    </section>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| App tera sidebar futura | Ja coloque `flex h-screen` no layout raiz |
| Pagina sem conteudo selecionado | Centralize instrucoes guiando o usuario |
| Conteudo principal com scroll | Use `overflow-auto` no main, nao no body |
| Responsividade de padding | Use 3 breakpoints: base, sm, md |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `height: 100vh` inline | `h-screen` no wrapper flex |
| `overflow: scroll` no body | `overflow-auto` apenas no main |
| Padding fixo sem responsividade | `p-4 sm:p-6 md:p-8` |
| Conteudo sem max-width | `max-w-3xl mx-auto` |
| Home vazia sem instrucoes | Placeholder centralizado guiando o usuario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
