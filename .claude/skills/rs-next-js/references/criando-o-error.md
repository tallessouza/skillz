---
name: rs-next-js-criando-o-error
description: "Applies Next.js error.tsx Error Boundary pattern when handling runtime errors in App Router applications. Use when user asks to 'handle errors', 'create error boundary', 'add error page', 'catch runtime errors', or 'create error.tsx' in Next.js. Enforces client component declaration, reset function usage, and granular error boundary placement. Make sure to use this skill whenever implementing error handling UI in Next.js App Router projects. Not for API error handling, try-catch in server actions, or form validation errors."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: error-boundary
  tags: [next-js, error-boundary, error-tsx, app-router, use-client, reset, fallback-ui]
---

# Error Boundary no Next.js (error.tsx)

> Crie arquivos `error.tsx` como client components que capturam erros em runtime e exibem uma UI de fallback, evitando que toda a aplicacao quebre.

## Rules

1. **Sempre declare `"use client"`** — error boundaries precisam ser client components porque utilizam React Error Boundary por baixo dos panos, que depende de hooks como useEffect para capturar erros durante a montagem
2. **Exporte por default** — o Next.js espera um default export, igual ao `page.tsx` e `loading.tsx`
3. **Receba `error` e `reset` como props** — `error` contem a mensagem do erro, `reset` e uma funcao que tenta re-renderizar o segmento
4. **Posicione por granularidade** — `app/error.tsx` captura erros globais, `app/dashboard/error.tsx` captura apenas erros do segmento dashboard. O error boundary mais proximo sempre captura primeiro
5. **Trate `error.message` como opcional** — nem todo erro tera uma mensagem util, faca checagem condicional antes de renderizar

## How to write

### error.tsx basico

```typescript
"use client"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-16">
      <div className="max-w-md w-full text-center">
        <h2 className="text-xl text-white font-sans mb-8">
          Something went wrong
        </h2>

        {error.message && (
          <p className="text-gray-200 mb-8 text-sm overflow-hidden text-ellipsis">
            {error.message}
          </p>
        )}

        <button onClick={reset} className="mt-16">
          Try again
        </button>
      </div>
    </div>
  )
}
```

### Hierarquia de error boundaries

```
app/
├── error.tsx          ← captura TODOS os erros (global fallback)
├── dashboard/
│   ├── error.tsx      ← captura apenas erros do dashboard
│   └── page.tsx
└── blog/
    ├── error.tsx      ← captura apenas erros do blog
    └── page.tsx
```

## Example

**Before (sem error boundary — app crasha inteira):**
```typescript
// Componente lanca erro → tela branca, app trava
export default function Page() {
  throw new Error("Algo deu errado")
  return <div>Conteudo</div>
}
```

**After (com error.tsx — erro contido, UI de fallback):**
```typescript
// app/error.tsx
"use client"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      {error.message && <p>{error.message}</p>}
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App inteira precisa de protecao | Crie `app/error.tsx` na raiz |
| Segmento especifico falha frequentemente | Crie `error.tsx` dentro da pasta do segmento |
| Erro pode ser transitorio (API fora do ar) | Implemente o botao reset para tentar novamente |
| Precisa logar o erro | Use `useEffect` para enviar para servico de logging |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `error.tsx` sem `"use client"` | Sempre declare `"use client"` no topo |
| Ignorar a prop `reset` | Sempre oferecer botao de "try again" ao usuario |
| Renderizar `error.message` sem checagem | Cheque `{error.message && <p>{error.message}</p>}` |
| Unico error boundary global para tudo | Use error boundaries granulares por segmento quando necessario |
| Confundir com try-catch em server components | `error.tsx` e para erros de renderizacao no cliente |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-error/references/deep-explanation.md) — O arquivo `error.tsx` do Next.js utiliza a **Error Boundary API do React** por baixo dos panos. Isso
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-error/references/code-examples.md) — // app/error.tsx
