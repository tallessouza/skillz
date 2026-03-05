---
name: rs-nextjs-app-router-loading-streaming-ssr
description: "Applies Next.js loading states and Streaming SSR patterns when building App Router pages with async data fetching. Use when user asks to 'create a loading state', 'add a spinner', 'show skeleton while loading', 'fetch data in page', or 'stream server content'. Ensures correct loading.tsx placement, inheritance rules, and Streaming SSR understanding. Make sure to use this skill whenever creating Next.js App Router pages that fetch data asynchronously. Not for client-side loading states with useEffect, React Query, or SWR."
---

# Loading e Streaming SSR no Next.js App Router

> Sempre que uma page.tsx faz fetch assincrono, crie um loading.tsx no mesmo diretorio para dar feedback visual instantaneo via Streaming SSR.

## Rules

1. **Crie loading.tsx junto ao page.tsx que faz fetch** — no mesmo diretorio do arquivo que possui carregamento de dados, porque o Next substitui automaticamente o conteudo do loading enquanto o fetch nao finaliza
2. **loading.tsx herda o layout** — diferente do layout que encadeia (root + nested), o loading exibe o layout normalmente junto ao conteudo de carregamento, garantindo experiencia consistente (cabecalho, sidebar visiveis durante loading)
3. **loading.tsx usa proximidade, nao encadeamento** — o Next sempre procura o loading.tsx mais proximo da page.tsx que esta carregando, subindo ate a raiz se nao encontrar um especifico. Diferente do layout que carrega todos os niveis
4. **loading.tsx na raiz da pasta app e o root loading** — compartilhado com todas as paginas, similar ao root layout. Override criando loading.tsx em subpastas
5. **Streaming SSR acontece em uma unica requisicao** — o servidor envia primeiro o HTML do loading, mantem a conexao aberta, e quando o fetch completa, envia o HTML final com um script JS que substitui o loading pelos dados reais

## How to write

### Loading basico com skeleton

```typescript
// app/loading.tsx — root loading (vale para todas as paginas)
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  )
}
```

### Loading especifico por rota

```typescript
// app/catalog/loading.tsx — override do root loading para /catalog
export default function CatalogLoading() {
  return <p>Carregando catalogo...</p>
}
```

### Page com fetch assincrono (par obrigatorio do loading)

```typescript
// app/page.tsx
export default async function Home() {
  const response = await fetch('https://api.github.com/users/diego3g')
  const user = await response.json()

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  )
}
```

## Example

**Before (sem loading — usuario ve tela branca por 2s):**
```
app/
├── layout.tsx
└── page.tsx        ← fetch assincrono, sem loading.tsx
```
Resultado: usuario aguarda sem feedback ate o fetch completar.

**After (com loading — feedback instantaneo via Streaming SSR):**
```
app/
├── layout.tsx
├── loading.tsx     ← root loading (skeleton/spinner)
├── page.tsx        ← fetch assincrono
└── catalog/
    ├── loading.tsx ← loading especifico do catalogo
    └── page.tsx    ← fetch assincrono
```
Resultado: layout aparece instantaneamente + loading visivel + dados substituem loading quando prontos, tudo em uma unica requisicao.

## Heuristics

| Situacao | Faca |
|----------|------|
| Page.tsx com qualquer await/fetch | Crie loading.tsx no mesmo diretorio |
| Todas as paginas precisam de loading generico | Crie loading.tsx na raiz de app/ |
| Rota especifica precisa de loading diferente | Crie loading.tsx na pasta da rota (override) |
| Subrota sem loading.tsx proprio | Herda o loading.tsx mais proximo subindo a arvore |
| Quer mostrar cabecalho durante loading | Nao precisa fazer nada — loading herda layout automaticamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar page.tsx assincrono sem loading.tsx | Sempre criar loading.tsx pareado |
| Usar useState + useEffect para loading em Server Component | Usar loading.tsx (mecanismo nativo do App Router) |
| Esperar que loading.tsx encadeie como layout | Entender que loading usa proximidade — so o mais proximo e usado |
| Fazer fetch no cliente para evitar tela branca | Fazer fetch no servidor + loading.tsx para Streaming SSR |
| Criar loading.tsx vazio ou sem conteudo util | Colocar skeleton screen ou spinner significativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-loading-e-streaming-ssr/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-loading-e-streaming-ssr/references/code-examples.md)
