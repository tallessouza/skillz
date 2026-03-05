# Code Examples: revalidatePath em Server Actions

## Exemplo completo: Server Actions com revalidatePath

### Create Action

```typescript
// src/app/actions/create-prompt-action.ts
"use server"

import { revalidatePath } from "next/cache"
import { createPromptUseCase } from "@/use-cases/create-prompt"

export async function createPromptAction(data: { title: string; content: string }) {
  const prompt = await createPromptUseCase(data)

  // Revalida DEPOIS do use case — informa ao Next que os dados mudaram
  revalidatePath("/", "layout")

  return prompt
}
```

### Update Action

```typescript
// src/app/actions/update-prompt-action.ts
"use server"

import { revalidatePath } from "next/cache"
import { updatePromptUseCase } from "@/use-cases/update-prompt"

export async function updatePromptAction(id: string, data: { title?: string; content?: string }) {
  const prompt = await updatePromptUseCase(id, data)

  revalidatePath("/", "layout")

  return prompt
}
```

### Delete Action

```typescript
// src/app/actions/delete-prompt-action.ts
"use server"

import { revalidatePath } from "next/cache"
import { deletePromptUseCase } from "@/use-cases/delete-prompt"

export async function deletePromptAction(id: string) {
  await deletePromptUseCase(id)

  revalidatePath("/", "layout")
}
```

## Mock centralizado no Jest

```typescript
// jest.setup.ts
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))
```

## Teste completo das actions com verificacao de revalidatePath

```typescript
// src/test/app/prompt-actions.test.ts
import { revalidatePath } from "next/cache"
import { createPromptAction } from "@/app/actions/create-prompt-action"
import { updatePromptAction } from "@/app/actions/update-prompt-action"
import { deletePromptAction } from "@/app/actions/delete-prompt-action"

// Cast para acessar metodos do Jest
const revalidatePathMock = revalidatePath as jest.Mock

beforeEach(() => {
  revalidatePathMock.mockReset()
})

describe("createPromptAction", () => {
  it("deve criar um prompt com sucesso e revalidar", async () => {
    const data = { title: "Testando", content: "prompt content" }

    await createPromptAction(data)

    expect(revalidatePathMock).toHaveBeenCalledTimes(1)
    expect(revalidatePathMock).toHaveBeenCalledWith("/", "layout")
  })
})

describe("updatePromptAction", () => {
  it("deve atualizar prompt com sucesso e revalidar", async () => {
    await updatePromptAction("some-id", { title: "Updated" })

    expect(revalidatePathMock).toHaveBeenCalledTimes(1)
  })
})

describe("deletePromptAction", () => {
  it("deve remover prompt com sucesso e revalidar", async () => {
    await deletePromptAction("some-id")

    expect(revalidatePathMock).toHaveBeenCalledTimes(1)
  })
})
```

## Teste de falso positivo

O instrutor demonstra que se voce colocar `toHaveBeenCalledTimes(2)` quando a funcao so foi chamada uma vez, o teste quebra — provando que a verificacao e valida:

```typescript
it("falso positivo check", async () => {
  await createPromptAction(validData)

  // Isso QUEBRA — prova que nao e falso positivo
  expect(revalidatePathMock).toHaveBeenCalledTimes(2) // FAIL: called 1 time
})
```

## Reproducao do bug em producao

Para ver o problema que o revalidatePath resolve:

```bash
# Build de producao
pnpm build

# Inicia servidor de producao
pnpm start
```

Sem `revalidatePath`:
1. Abra a app em `localhost:3000`
2. Delete um prompt
3. O prompt continua aparecendo na sidebar (versao estatica congelada)
4. Tente deletar novamente → "prompt nao encontrado"

Com `revalidatePath`:
1. Mesmos passos
2. Prompt desaparece da sidebar imediatamente
3. Criar/editar/deletar funciona normalmente