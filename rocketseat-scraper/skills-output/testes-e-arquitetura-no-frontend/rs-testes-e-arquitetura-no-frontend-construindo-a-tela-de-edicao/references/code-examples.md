# Code Examples: Construindo a Tela de Edicao

## 1. Formulario com Defaults para Edicao

```typescript
// prompt-form.tsx
// O formulario recebe o prompt existente e preenche os campos
export function PromptForm({ prompt }: { prompt: Prompt }) {
  const isEdit = !!prompt.id

  // Defaults preenchidos com dados existentes
  // ?? '' garante string vazia se undefined
  const titleDefault = prompt.title ?? ''
  const contentDefault = prompt.content ?? ''

  async function onSubmit(data: FormData) {
    const result = isEdit
      ? await updatePromptAction({ id: prompt.id, ...data })
      : await createPromptAction(data)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="title" defaultValue={titleDefault} />
      <textarea name="content" defaultValue={contentDefault} />
      <button type="submit">{isEdit ? 'Atualizar' : 'Criar'}</button>
    </form>
  )
}
```

## 2. Schema de Validacao para Update

```typescript
// schemas/prompt.ts
import { z } from 'zod'

export const createPromptSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

// Update inclui ID obrigatorio
export const updatePromptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export type CreatePromptDto = z.infer<typeof createPromptSchema>
export type UpdatePromptDto = z.infer<typeof updatePromptSchema>
```

## 3. FormState Type

```typescript
// types/form.ts
export type FormState = {
  success: boolean
  message: string
  errors?: unknown
}
```

## 4. Server Action Completa

```typescript
// actions/prompt.ts
export async function updatePromptAction(data: UpdatePromptDto): Promise<FormState> {
  const validated = updatePromptSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const repository = new PrismaPromptRepository(prisma)
    const useCase = new UpdatePromptUseCase(repository)
    await useCase.execute(validated.data)

    return { success: true, message: 'Prompt atualizado com sucesso' }
  } catch (error) {
    const e = error as Error
    if (e.message === 'Prompt not found') {
      return { success: false, message: 'Prompt não encontrado' }
    }
    return { success: false, message: 'Falha ao atualizar o prompt' }
  }
}
```

## 5. Use Case de Update

```typescript
// use-cases/update-prompt.ts
export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDto) {
    const exists = await this.promptRepository.findById(data.id)

    if (!exists) {
      throw new Error('Prompt not found')
    }

    return this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    })
  }
}
```

## 6. Repository Interface com Update

```typescript
// repositories/prompt-repository.ts
export interface PromptRepository {
  create(data: CreatePromptDto): Promise<Prompt>
  findById(id: string): Promise<Prompt | null>
  update(id: string, data: Partial<CreatePromptDto>): Promise<Prompt>
  // ... outros metodos
}
```

## 7. Prisma Repository Implementation

```typescript
// repositories/prisma-prompt-repository.ts
async update(id: string, data: Partial<CreatePromptDto>): Promise<Prompt> {
  const updated = await this.prisma.prompt.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
    },
  })

  return updated
}
```

## 8. Teste E2E (Playwright)

```typescript
// e2e/prompt.spec.ts
test('edição de prompt via UI', async ({ page }) => {
  // 1. Criar prompt primeiro
  // 2. Navegar ate ele
  // 3. Editar titulo e conteudo
  // 4. Submeter
  // 5. Verificar mensagem de sucesso
  await expect(page.getByText('Prompt atualizado com sucesso')).toBeVisible()
  // 6. Verificar que o titulo foi atualizado
  await expect(page.getByRole('heading', { name: 'Updated Title' })).toBeVisible()
})
```

## 9. Configuracao WebServer no Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  // ... resto da config
})
```

Com essa configuracao, `npx playwright test` sobe o servidor automaticamente — nao precisa rodar `npm run dev` separadamente.