---
name: rs-testes-e-adicionando-o-revalidate-path
description: "Applies Next.js revalidatePath after Server Actions that mutate data (create, update, delete). Use when user asks to 'add revalidation', 'fix stale data in Next.js', 'static page not updating', 'server action not refreshing', or 'revalidate cache after mutation'. Enforces revalidatePath call after every mutation with correct type parameter and centralized test mocking. Make sure to use this skill whenever writing Next.js Server Actions that modify data. Not for client-side fetching with SWR/React Query (use rs-next-js), or API route handlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: server-actions
  tags: [next-js, revalidatePath, server-actions, cache, testing, jest]
---

# revalidatePath em Server Actions

> Toda Server Action que muta dados deve chamar `revalidatePath` apos a mutacao, porque o Next.js renderiza componentes estaticamente e nao detecta mudancas quando o ORM nao usa `fetch`.

## Rules

1. **Sempre revalidar apos mutacao** — chame `revalidatePath` depois de create, update e delete, porque o Next.js congela a versao estatica gerada no build
2. **Especifique o tipo como layout** — use `revalidatePath("/", "layout")` para revalidar incluindo o layout (sidebar com listagem), porque `"page"` nao revalida componentes no layout
3. **Chame depois do use case** — revalidar antes da mutacao nao faz sentido; coloque sempre apos a execucao bem-sucedida
4. **Mocke next/cache no setup global** — centralize o mock em `jest.setup.ts` ao inves de cada arquivo de teste
5. **Valide que revalidatePath foi chamado** — use `toHaveBeenCalledTimes(1)` nos testes de actions

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
```

### Mock centralizado

```typescript
// jest.setup.ts
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))
```

### Teste validando revalidacao

```typescript
import { revalidatePath } from "next/cache"
const revalidatePathMock = revalidatePath as jest.Mock

it("deve criar prompt e revalidar", async () => {
  await createPromptAction(validData)
  expect(revalidatePathMock).toHaveBeenCalledTimes(1)
})
```

## Example

**Before (dados congelados em producao):**
```typescript
export async function deletePromptAction(id: string) {
  await deletePromptUseCase(id)
  // Sidebar continua mostrando o prompt deletado
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

| Situacao | Faca |
|----------|------|
| Server Action com INSERT/UPDATE/DELETE | Sempre adicionar `revalidatePath` |
| ORM sem fetch (Prisma, Drizzle) | Revalidacao manual obrigatoria |
| Dados na sidebar/layout | Usar tipo `"layout"` |
| Testes quebraram apos adicionar revalidatePath | Mockar `next/cache` no setup |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `revalidatePath` antes do use case | `revalidatePath` depois do use case |
| `revalidatePath("/", "page")` com sidebar | `revalidatePath("/", "layout")` |
| Mock em cada arquivo de teste | Mock centralizado no jest setup |
| Server Action com mutacao sem revalidatePath | Sempre adicionar apos mutacao |

## Troubleshooting

### Dados nao atualizam apos Server Action
**Symptom:** Formulario submete com sucesso mas lista/sidebar mostra dados antigos
**Cause:** revalidatePath nao foi chamado ou tipo errado ("page" ao inves de "layout")
**Fix:** Adicionar `revalidatePath("/", "layout")` apos a mutacao

### Testes quebram com "revalidatePath is not a function"
**Symptom:** Erro ao rodar testes que importam actions com revalidatePath
**Cause:** `next/cache` nao esta mockado no ambiente de teste
**Fix:** Adicionar `jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }))` no jest.setup.ts

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
