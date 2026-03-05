# Code Examples: Melhorando o Feedback para o Usuario

## 1. Adicionando FormMessage ao formulario

O componente FormMessage e importado do shadcn/ui e colocado dentro de cada FormItem:

```tsx
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Dentro do form, para cada campo:
<FormItem>
  <FormLabel>Titulo</FormLabel>
  <FormControl>
    <Input placeholder="Nome do prompt" {...field} />
  </FormControl>
  <FormMessage />
</FormItem>

<FormItem>
  <FormLabel>Conteudo</FormLabel>
  <FormControl>
    <Textarea placeholder="Conteudo do prompt" {...field} />
  </FormControl>
  <FormMessage />
</FormItem>
```

## 2. Schema Zod com mensagens customizadas

As mensagens que aparecem no FormMessage vem do schema:

```typescript
// schema.ts
import { z } from "zod"

export const promptSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
})
```

## 3. Teste completo de mensagens de erro

```tsx
// prompt-form.spec.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PromptForm } from "./prompt-form"

const createActionMock = vi.fn()

it("deve exibir as mensagens de erro quando o formulario estiver vazio", async () => {
  render(<PromptForm createAction={createActionMock} />)

  // Clica submit sem preencher nada
  const submitButton = screen.getByRole("button", { name: /salvar/i })
  await userEvent.click(submitButton)

  // Verifica que as mensagens de erro do Zod aparecem
  expect(screen.getByText("O título é obrigatório")).toBeVisible()
  expect(screen.getByText("O conteúdo é obrigatório")).toBeVisible()

  // Verifica que a action NAO foi chamada
  expect(createActionMock).not.toHaveBeenCalled()
})
```

## 4. Verificacao de falso positivo

Apos o teste passar, altere o texto esperado para confirmar que quebra:

```tsx
// Isso DEVE falhar — confirma que o teste e real
expect(screen.getByText("O título é obrigatórioo")).toBeVisible()
// Error: Unable to find an element with the text: "O título é obrigatórioo"
```

## 5. Server Component com repository pattern

```tsx
// sidebar.tsx (Server Component)
import { PrismaPromptRepository } from "@/repositories/prisma-prompt-repository"
import { prisma } from "@/lib/prisma"
import { PromptSummary } from "@/types"
import { SidebarContent } from "./sidebar-content"

export async function Sidebar() {
  const repository = new PrismaPromptRepository(prisma)
  let prompts: PromptSummary[] = []

  try {
    const result = await repository.findMany()
    prompts = result.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
    }))
  } catch {
    // Fallback silencioso — sidebar exibe lista vazia
    prompts = []
  }

  return <SidebarContent prompts={prompts} />
}
```

## 6. Repository com orderBy

```typescript
// prisma-prompt-repository.ts
class PrismaPromptRepository {
  async findMany() {
    return this.prisma.prompt.findMany({
      orderBy: { createdAt: "desc" }, // Novos primeiro
      select: {
        id: true,
        title: true,
      },
    })
  }
}
```

Isso garante que ao criar "teste 01" e depois "teste 02", o "02" aparece primeiro na sidebar — ordem consistente sem logica adicional no componente.