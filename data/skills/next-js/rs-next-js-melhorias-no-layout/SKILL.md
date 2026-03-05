---
name: rs-next-js-melhorias-no-layout
description: "Enforces Next.js Pages Router layout optimization patterns when structuring shared components, refactoring templates, and implementing responsive Tailwind CSS. Use when user asks to 'improve layout', 'move component to layout', 'refactor template', 'make responsive', or 'fix mobile styles' in Next.js Pages Router. Make sure to use this skill whenever restructuring shared UI elements or adjusting responsive behavior in Pages Router projects. Not for App Router, API routes, or data fetching logic."
---

# Melhorias no Layout — Next.js Pages Router

> Componentes presentes em todas as telas pertencem ao layout, nao as paginas individuais.

## Rules

1. **Componente repetido em todas as telas vai pro layout** — se call-to-action, footer, ou qualquer elemento aparece em todas as paginas, mova para `_app` ou layout wrapper, porque duplicacao gera inconsistencia e manutencao extra
2. **Remova duplicatas das paginas apos mover pro layout** — ao promover um componente para o layout, remova-o de cada pagina individual para evitar renderizacao duplicada
3. **Extraia templates descritivos** — paginas complexas devem ter seu conteudo extraido para `templates/`, com nomes descritivos como `PostPage`, `BlogList`, porque melhora organizacao e reuso
4. **Responsive mobile-first com Tailwind** — defina o estilo mobile como default e use breakpoints (`md:`, `lg:`) para telas maiores, porque Tailwind e mobile-first por design
5. **Use `hidden`/`block` para visibilidade responsiva** — controle o que aparece em cada breakpoint com `hidden md:block` em vez de JS condicional, porque e mais performatico e declarativo
6. **Width `fit` no mobile, `full` no desktop para botoes** — `w-fit md:w-full` garante que botoes ocupem apenas o necessario no mobile e expandam no desktop

## How to write

### Promover componente para layout

```tsx
// _app.tsx ou layout wrapper
export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <CallToAction /> {/* Presente em TODAS as telas */}
      <Footer />
    </>
  )
}
```

### Extrair template descritivo

```tsx
// templates/post/PostPage.tsx
export const PostPage = ({ post }) => {
  return (
    <article>
      <Breadcrumb />
      <PostHeader post={post} />
      <PostContent content={post.content} />
      <ShareButtons post={post} />
    </article>
  )
}

// templates/post/index.ts
export { PostPage } from './PostPage'
```

### Botoes de compartilhamento responsivos

```tsx
<div className="flex justify-between md:flex-col gap-2">
  <span className="hidden md:block">Compartilhar</span>
  {providers.map(provider => (
    <button key={provider.name} className="w-fit md:w-full">
      <provider.icon />
      <span className="hidden md:block">{provider.name}</span>
    </button>
  ))}
</div>
```

## Example

**Before (call-to-action duplicado em cada pagina):**
```tsx
// pages/index.tsx
<Hero />
<CallToAction />
<Footer />

// pages/blog/index.tsx
<PostList />
<CallToAction />
<Footer />

// pages/blog/[slug].tsx
<PostContent />
<CallToAction />
<Footer />
```

**After (call-to-action no layout):**
```tsx
// layout
<Header />
{children}
<CallToAction />
<Footer />

// pages/index.tsx — sem CallToAction
<Hero />

// pages/blog/index.tsx — sem CallToAction
<PostList />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente aparece em todas as telas | Mova para o layout |
| Pagina tem JSX extenso | Extraia para `templates/NomeDescritivo` |
| Texto/label so aparece no desktop | `hidden md:block` |
| Botao deve ser compacto no mobile | `w-fit md:w-full` |
| Icones com label no desktop, sem no mobile | Envolva label em `<span className="hidden md:block">` |
| Espacamento excessivo entre header e conteudo | Use `py-20` em vez de `mt-` grande |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| CallToAction duplicado em 3+ paginas | CallToAction no layout |
| Template sem nome descritivo (`Component1`) | `PostPage`, `BlogList` |
| `display: none` com JS para responsivo | `hidden md:block` com Tailwind |
| `w-full` fixo em botoes mobile | `w-fit md:w-full` |
| `mt-32` para espacar do header | `py-20` para padding vertical equilibrado |
| Componente inline em `pages/[slug].tsx` | Extraido em `templates/post/PostPage.tsx` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
