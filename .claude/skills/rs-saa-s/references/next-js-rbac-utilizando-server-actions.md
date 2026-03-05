---
name: rs-saas-nextjs-rbac-server-actions
description: "Applies Server Actions patterns when writing Next.js form handling code. Use when user asks to 'create a form', 'handle form submit', 'use server actions', 'create actions file', or 'submit data in Next.js'. Enforces async functions, use server directive, FormData handling, and proper file structure. Make sure to use this skill whenever implementing form submissions in Next.js App Router. Not for API Route Handlers, client-side state management, or React Query/SWR data fetching."
---

# Server Actions no Next.js

> Server Actions sao funcoes assincronas anotadas com 'use server' que executam no servidor e se tornam rotas HTTP automaticamente, reduzindo JavaScript enviado ao cliente.

## Rules

1. **Sempre declare 'use server' no topo do arquivo de actions** — porque essa diretiva transforma todas as funcoes exportadas em endpoints HTTP automaticos
2. **Toda Server Action deve ser async** — porque ela se torna uma requisicao HTTP entre cliente e servidor do Next, que e inerentemente assincrona
3. **Crie arquivo separado `actions.tsx`** — na pasta da rota correspondente, porque mantem organizacao e permite multiplas actions por contexto
4. **Use `Object.fromEntries(formData)` para converter FormData** — porque FormData usa formato de entries (arrays aninhados) que nao e legivel; `Object.fromEntries` converte para objeto plano
5. **Server Actions nao substituem Route Handlers** — use actions para interacoes de usuario em componentes especificos; use pasta `api/` para criar endpoints reutilizaveis
6. **Nao mova logica reativa para o servidor** — React e uma biblioteca reativa; manter tudo no servidor transforma a app em PHP/Ruby tradicional, perdendo o proposito do React

## How to write

### Arquivo de actions

```typescript
// app/auth/sign-in/actions.tsx
'use server'

export async function signInWithEmailAndPassword(data: FormData) {
  const { email, password } = Object.fromEntries(data)
  // Logica executada exclusivamente no servidor
  // console.log aparece no terminal do servidor, NAO no browser
}
```

### Conectando ao formulario

```tsx
// app/auth/sign-in/page.tsx
import { signInWithEmailAndPassword } from './actions'

export default function SignInPage() {
  return (
    <form action={signInWithEmailAndPassword}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

## Example

**Before (tudo no cliente):**
```tsx
'use client'
import { useState } from 'react'
import { z } from 'zod' // vai pro bundle do cliente

export default function SignIn() {
  const [email, setEmail] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    // validacao e fetch no cliente = mais JS no bundle
  }
  return <form onSubmit={handleSubmit}>...</form>
}
```

**After (com Server Action):**
```tsx
// actions.tsx
'use server'
import { z } from 'zod' // fica APENAS no servidor

export async function signInWithEmailAndPassword(data: FormData) {
  const { email, password } = Object.fromEntries(data)
  // z, validacao, tudo fica fora do bundle do cliente
}

// page.tsx
import { signInWithEmailAndPassword } from './actions'

export default function SignIn() {
  return (
    <form action={signInWithEmailAndPassword}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Submit de formulario com validacao | Server Action — bibliotecas de validacao ficam fora do bundle |
| Precisa criar endpoint reutilizavel por outros clientes | Route Handler na pasta `api/`, nao Server Action |
| Componente precisa de reatividade (estados, efeitos) | Mantenha no cliente com 'use client' |
| Multiplas actions no mesmo contexto (login email + login GitHub) | Nomeie descritivamente: `signInWithEmailAndPassword`, `signInWithGitHub` |
| Precisa que funcione sem JavaScript habilitado | Server Actions funcionam nativamente via HTML form action |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export function action(data)` (sync) | `export async function action(data: FormData)` |
| `'use server'` dentro de componente client | Arquivo separado `actions.tsx` com `'use server'` no topo |
| `data.get('email')` para cada campo | `Object.fromEntries(data)` para converter tudo de uma vez |
| `console.log` no browser esperando ver output da action | Verifique o terminal do servidor Node |
| Server Action para criar API consumida por mobile/outros | Route Handler em `app/api/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-utilizando-server-actions/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-utilizando-server-actions/references/code-examples.md)
