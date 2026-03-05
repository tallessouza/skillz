---
name: rs-next-js-parallel-intercepting-routes
description: "Applies Next.js Parallel Routes and Intercepting Routes patterns when building layouts with simultaneous content, modals, sheets, or drawers. Use when user asks to 'create a modal route', 'show content without navigation', 'open a sheet over the page', 'implement a drawer', 'parallel routes', or 'intercepting routes'. Make sure to use this skill whenever building overlay UI patterns in Next.js App Router. Not for API routes, middleware, or client-side state management."
---

# Parallel e Intercepting Routes no Next.js

> Use Parallel Routes para renderizar duas paginas simultaneamente e Intercepting Routes para exibir conteudo sem perder o contexto da pagina atual.

## Rules

1. **Parallel Routes usam pasta com prefixo `@`** — `@modal`, `@sheet`, `@drawer`, porque o nome da pasta vira um slot no layout
2. **O nome do slot deve ser semantico** — `@modal` nao `@banana`, porque o nome aparece nas props do layout e deve comunicar intencao
3. **Sempre crie `default.tsx` no slot** — retornando `null` quando nao ha conteudo a exibir, porque o Next precisa de um fallback para rotas que nao tem match
4. **Intercepting Routes usam `(.)` antes do segmento** — `(.)issues/[id]/page.tsx` dentro do slot, porque o ponto indica interceptacao no mesmo nivel
5. **Espelhe a estrutura de rotas dentro do slot** — se existe `issues/[id]/page.tsx` fora, crie `@modal/(.)issues/[id]/page.tsx` dentro, porque o Next faz match pela estrutura identica
6. **F5 navega para a pagina real** — a interceptacao so funciona via navegacao client-side (Link/router.push), porque hard refresh ignora a interceptacao e renderiza a rota original

## How to write

### Estrutura de pastas

```
app/
├── layout.tsx              # Recebe {children, modal} nas props
├── page.tsx                # Pagina principal
├── issues/
│   └── [id]/
│       └── page.tsx        # Pagina real da issue (acessada via F5)
└── @modal/
    ├── default.tsx         # Retorna null (fallback)
    └── (.)issues/
        └── [id]/
            └── page.tsx    # Conteudo do modal (interceptado)
```

### Layout com slot paralelo

```typescript
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

### Default do slot (fallback)

```typescript
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

### Pagina interceptada (modal)

```typescript
// app/@modal/(.)issues/[id]/page.tsx
export default async function IssueModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Renderizar conteudo do modal/sheet/drawer aqui
  return <div>Issue {id}</div>
}
```

## Example

**Before (navegacao tradicional — perde contexto):**
```typescript
// Clicar no link navega para /issues/123
// Usuario perde a visao do board
<Link href={`/issues/${issue.id}`}>{issue.title}</Link>
```

**After (com intercepting route — mantem contexto):**
```typescript
// Clicar no link mostra modal SOBRE o board
// URL muda para /issues/123 mas o board continua visivel
// F5 na URL vai para a pagina real da issue
<Link href={`/issues/${issue.id}`}>{issue.title}</Link>
// O modal aparece via @modal/(.)issues/[id]/page.tsx
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modal/sheet/drawer sobre pagina existente | Parallel Route (`@modal`) + Intercepting Route (`(.)`) |
| Conteudo fixo em todas as paginas (sidebar, header) | Parallel Route com `default.tsx` retornando o conteudo |
| Conteudo que muda por rota dentro do slot | Espelhe a estrutura de rotas dentro do `@slot/` |
| Precisa que URL seja compartilhavel | Intercepting Route — F5 vai para a pagina real |
| Nao precisa de client component para o overlay | Use este pattern — e server-side por padrao |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `useState` para controlar modal de rota | Parallel Route + Intercepting Route |
| Slot sem `default.tsx` | Sempre crie `default.tsx` retornando `null` |
| Nome generico como `@banana` | Nome semantico como `@modal`, `@sheet`, `@drawer` |
| Estrutura diferente dentro do slot | Espelhe exatamente a estrutura da rota real |
| `(..)` quando a rota esta no mesmo nivel | `(.)` para mesmo nivel, `(..)` para um nivel acima |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-parallel-e-intercepting-routes/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-parallel-e-intercepting-routes/references/code-examples.md)
