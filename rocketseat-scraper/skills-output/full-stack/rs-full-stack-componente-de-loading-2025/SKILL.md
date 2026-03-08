---
name: rs-full-stack-componente-de-loading-2025
description: "Enforces React loading component patterns with Tailwind CSS when building loading states, spinner components, or conditional rendering during async operations. Use when user asks to 'create a loading component', 'show loading state', 'handle async loading', 'add a spinner', or 'conditional render while fetching'. Applies full-screen centered layout with w-screen/h-screen, flex centering, and isLoading guard pattern. Make sure to use this skill whenever implementing loading indicators or async feedback UI in React. Not for skeleton loaders, progress bars, Suspense boundaries, or server-side loading states."
---

# Componente de Loading

> Crie componentes de loading simples, centralizados na tela, controlados por uma variavel booleana que interrompe a renderizacao principal com um early return.

## Rules

1. **Use w-screen e h-screen para loading full-screen** — `w-full` e `h-full` dependem do container pai, enquanto `w-screen` e `h-screen` garantem que o loading ocupe a viewport inteira independente de onde esteja montado
2. **Centralize com flex + justify-center + items-center** — porque e o padrao mais previsivel para centralizar conteudo vertical e horizontalmente
3. **Controle exibicao com early return** — verifique `isLoading` antes do JSX principal e retorne `<Loading />` com `return`, porque isso evita renderizar a UI incompleta enquanto dados nao chegaram
4. **Componente em arquivo proprio** — crie `loading.tsx` dentro de `components/`, porque loading e reutilizavel em multiplas rotas e contextos
5. **Estilize o texto com classes utilitarias** — use `text-gray-200`, `font-bold`, `text-sm` para feedback visual discreto que nao compete com o conteudo principal

## How to write

### Componente de Loading

```tsx
// src/components/loading.tsx
export function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <span className="text-gray-200 font-bold text-sm">
        Carregando
      </span>
    </div>
  )
}
```

### Uso com early return na rota

```tsx
import { Loading } from "@/components/loading"

export function SignIn() {
  const isLoading = true // vem do estado real da requisicao

  if (isLoading) {
    return <Loading />
  }

  return (
    // JSX principal da pagina
  )
}
```

## Example

**Before (loading inline sem centralizacao):**
```tsx
function SignIn() {
  const isLoading = true

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      <form>
        <input type="email" />
        <button>Entrar</button>
      </form>
    </div>
  )
}
```

**After (com componente dedicado e early return):**
```tsx
import { Loading } from "@/components/loading"

function SignIn() {
  const isLoading = true

  if (isLoading) {
    return <Loading />
  }

  return (
    <form>
      <input type="email" />
      <button>Entrar</button>
    </form>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Loading ocupa a pagina inteira | Use `w-screen h-screen` no container |
| Loading dentro de uma secao parcial | Use `w-full h-full` no container |
| Acao async apos clique do usuario | Ative `isLoading` no submit, desative no retorno da API |
| Multiplas rotas precisam de loading | Reutilize o mesmo componente `<Loading />` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `{isLoading && <p>loading</p>}` inline no meio do JSX | `if (isLoading) return <Loading />` como early return |
| `w-full h-full` para loading de pagina inteira | `w-screen h-screen` para garantir viewport completa |
| Loading hardcoded dentro de cada pagina | Componente `Loading` separado em `components/loading.tsx` |
| Renderizar form + loading ao mesmo tempo | Early return que substitui toda a UI durante carregamento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre w-screen vs w-full, early return pattern, e ajustes de layout
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e contexto de integracao