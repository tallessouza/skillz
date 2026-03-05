---
name: rs-testes-arq-frontend-revalidate-path
description: "Applies Next.js revalidatePath after Server Actions that mutate data (create, update, delete). Use when user asks to 'create a server action', 'add revalidation', 'fix stale data in Next.js', 'static page not updating', or 'server action not refreshing'. Ensures revalidatePath is called after every mutation and tests mock next/cache. Make sure to use this skill whenever writing Next.js Server Actions that modify data. Not for client-side fetching, SWR, React Query, or API route handlers."
---

# revalidatePath em Server Actions

> Toda Server Action que muta dados deve chamar `revalidatePath` apos a mutacao, porque o Next.js renderiza componentes estaticamente no build e nao detecta mudancas automaticamente quando o ORM nao usa `fetch`.

## Rules

1. **Sempre revalidar apos mutacao** — chame `revalidatePath` depois de create, update e delete, porque o Next.js congela a versao estatica gerada no build e dados novos nao aparecem sem revalidacao
2. **Especifique o tipo como layout** — use `revalidatePath("/", "layout")` para revalidar a rota incluindo o layout (ex: sidebar com listagem), porque `"page"` nao revalida componentes no layout
3. **Chame depois do use case, nao antes** — revalidar antes da mutacao nao faz sentido; coloque sempre apos a execucao bem-sucedida do use case
4. **Mocke next/cache nos testes** — sem mock, testes quebram porque `revalidatePath` nao existe no ambiente de teste
5. **Centralize o mock no setup global** — em vez de mockar em cada arquivo de teste, use o setup file do Jest para mockar `next/cache` uma unica vez
6. **Valide que revalidatePath foi chamado** — nos testes de actions, verifique com `toHaveBeenCalledTimes(1)` para garantir que a revalidacao acontece

## How to write

### Server Action com revalidatePath

```typescript
"use server"

import { revalidatePath } from "next/cache"

export async function createPromptAction(data: CreatePromptInput) {
  const result = await createPromptUseCase(data)
  revalidatePath("/", "layout")
  return result
}

export async function updatePromptAction(id: string, data: UpdatePromptInput) {
  const result = await updatePromptUseCase(id, data)
  revalidatePath("/", "layout")
  return result
}

export async function deletePromptAction(id: string) {
  const result = await deletePromptUseCase(id)
  revalidatePath("/", "layout")
  return result
}
```

### Mock centralizado no Jest setup

```typescript
// jest.setup.ts ou src/test/setup.ts
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))
```

### Teste validando revalidatePath

```typescript
import { revalidatePath } from "next/cache"

const revalidatePathMock = revalidatePath as jest.Mock

beforeEach(() => {
  revalidatePathMock.mockReset()
})

it("deve criar prompt e revalidar", async () => {
  await createPromptAction(validData)
  expect(revalidatePathMock).toHaveBeenCalledTimes(1)
})
```

## Example

**Before (dados ficam congelados em producao):**
```typescript
export async function deletePromptAction(id: string) {
  await deletePromptUseCase(id)
  // Sem revalidatePath — sidebar continua mostrando o prompt deletado
}
```

**After (revalidacao garante dados frescos):**
```typescript
export async function deletePromptAction(id: string) {
  await deletePromptUseCase(id)
  revalidatePath("/", "layout")
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server Action que faz INSERT/UPDATE/DELETE | Sempre adicionar `revalidatePath` |
| ORM que nao usa `fetch` (Prisma, Drizzle, etc.) | Revalidacao manual obrigatoria |
| Dados aparecem na sidebar/layout | Usar tipo `"layout"`, nao `"page"` |
| Dados aparecem apenas na page | Pode usar `"page"` |
| Testes quebraram apos adicionar revalidatePath | Mockar `next/cache` no setup |
| Quero validar que revalidou | `toHaveBeenCalledTimes(1)` no teste da action |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `revalidatePath` antes do use case | `revalidatePath` depois do use case |
| `revalidatePath("/", "page")` quando sidebar precisa atualizar | `revalidatePath("/", "layout")` |
| Mock de `revalidatePath` em cada arquivo de teste | Mock centralizado no jest setup |
| Nenhum `revalidatePath` em Server Action com mutacao | Sempre adicionar apos a mutacao |
| Testar action sem verificar se revalidou | `expect(mock).toHaveBeenCalledTimes(1)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
