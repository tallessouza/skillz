---
name: rs-testes-e-iniciando-a-busca-de-prompts
description: "Enforces correct Server Actions and Server Functions patterns in Next.js/React when implementing search, CRUD, or form-driven server logic. Use when user asks to 'create a server action', 'implement search', 'add form submission', 'use useActionState', or 'query database from component'. Applies rules: use server directive, typed form state, previous state signature for useActionState, Prisma query patterns with insensitive search. Make sure to use this skill whenever creating server-side functions triggered by forms in Next.js App Router. Not for client-side state management, API routes, or REST endpoint design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: ci-cd
  tags: [testing, next-js, react, prisma, server-actions, forms]
---

# Server Actions e Server Functions no Next.js

> Toda funcao server-side triggered por formulario segue a assinatura `(previousState, formData) => Promise<TypedState>`, com `'use server'` no topo do arquivo.

## Rules

1. **Diretiva `'use server'` no topo do arquivo** — coloque no arquivo inteiro quando todas as funcoes sao server-side, porque isso garante que nenhuma funcao vaze para o cliente
2. **Diferencie server function de server action** — server function = executada no servidor (ex: gerar relatorio, buscar dados). Server action = server function que MUTA dados (criar, editar, deletar). Busca e leitura sao server functions, nao actions, porque nao sao idempotentes por natureza diferente
3. **Assinatura com previous state** — funcoes usadas com `useActionState` recebem `(previousState: T, formData: FormData) => Promise<T>`, porque o hook exige esse formato. Use `_` se nao usar o previous state
4. **Type o form state explicitamente** — crie um tipo com `success: boolean`, dados opcionais e `message?: string`, porque isso padroniza retornos de sucesso e erro
5. **Capture form fields com `formData.get()`** — sempre converta para String e aplique `.trim()`, porque inputs podem vir null ou com espacos
6. **Retorne formato consistente** — sucesso retorna `{ success: true, data }`, erro retorna `{ success: false, message }`, porque o componente cliente precisa de um contrato previsivel

## How to write

### Arquivo de actions com `'use server'`

```typescript
'use server'

// Tipo do estado do formulario
type SearchFormState = {
  success: boolean
  prompts?: PromptSummary[]
  message?: string
}

// _ no previousState quando nao utilizado (exigido pelo useActionState)
export async function searchPromptAction(
  _: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = String(formData.get('q') ?? '').trim()

  try {
    const prompts = await prisma.prompt.findMany({
      where: term
        ? {
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { content: { contains: term, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'descending' },
    })

    const summaries = prompts.map(({ id, title, content }) => ({
      id, title, content,
    }))

    return { success: true, prompts: summaries }
  } catch {
    return { success: false, message: 'Falha ao buscar prompts' }
  }
}
```

## Example

**Before (sem tipagem, sem padrao):**
```typescript
export async function search(formData: FormData) {
  const q = formData.get('q')
  const data = await prisma.prompt.findMany({
    where: { title: { contains: q } },
  })
  return data
}
```

**After (com this skill applied):**
```typescript
'use server'

type SearchFormState = {
  success: boolean
  prompts?: { id: string; title: string; content: string }[]
  message?: string
}

export async function searchPromptAction(
  _: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = String(formData.get('q') ?? '').trim()

  try {
    const prompts = await prisma.prompt.findMany({
      where: term
        ? { OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { content: { contains: term, mode: 'insensitive' } },
          ]}
        : undefined,
      orderBy: { createdAt: 'descending' },
    })

    return {
      success: true,
      prompts: prompts.map(({ id, title, content }) => ({ id, title, content })),
    }
  } catch {
    return { success: false, message: 'Falha ao buscar prompts' }
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao busca/le dados no servidor | Server function (nao action) — mas mantenha o sufixo Action se usar useActionState |
| Funcao cria/edita/deleta dados | Server action — mutacao real |
| Hook useActionState no cliente | Assinatura obrigatoria: `(prev, formData) => Promise<State>` |
| Campo do form pode ser null | `String(formData.get('field') ?? '').trim()` |
| Busca textual com Prisma | Use `contains` + `mode: 'insensitive'` + OR para multiplos campos |
| Sem termo de busca | Passe `undefined` no where para retornar todos os registros |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `formData.get('q')` direto sem cast | `String(formData.get('q') ?? '').trim()` |
| `return prompts` sem envelope | `return { success: true, prompts }` |
| Catch vazio sem retorno | `catch { return { success: false, message: '...' } }` |
| Server action sem `'use server'` | Sempre `'use server'` no topo do arquivo |
| `(formData: FormData)` sem previous state | `(_: State, formData: FormData)` para useActionState |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
