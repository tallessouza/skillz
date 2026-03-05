---
name: rs-testes-arq-frontend-tela-edicao
description: "Applies the create/edit form pattern with server actions, use cases, and schema validation in Next.js when building CRUD edit screens. Use when user asks to 'add edit functionality', 'create update action', 'build edit form', 'implement CRUD update', or 'reuse form for create and edit'. Follows TDD-driven approach: E2E test as goal, then build backwards through action, use case, repository. Make sure to use this skill whenever implementing edit/update flows in Next.js App Router. Not for delete operations, list views, or search functionality."
---

# Construindo a Tela de Edicao

> Ao implementar edicao em formularios reutilizaveis, diferencie create de update por presenca de ID e construa de fora pra dentro: teste E2E como meta, depois action, use case, repository.

## Rules

1. **Diferencie create/edit por presenca de ID** — `if (prompt.id)` determina se chama `updatePromptAction` ou `createPromptAction`, porque o formulario e compartilhado mas as actions sao distintas
2. **Passe defaults do registro existente ao formulario** — campos recebem `defaultValue={prompt.title ?? ''}`, porque o form deve vir preenchido na edicao
3. **Crie schema de validacao separado para update** — `updatePromptSchema` inclui `id` obrigatorio alem dos campos de create, porque update precisa saber QUAL registro atualizar
4. **Use case valida existencia antes de atualizar** — `findById` antes do `update`, lanca erro `"Prompt not found"` se nao existir, porque update em registro inexistente deve falhar explicitamente
5. **Repository.update aceita campos parciais** — `Partial<CreatePromptDto>` permite editar so titulo ou so conteudo, porque nem sempre todos os campos mudam
6. **TDD E2E como meta de longo alcance** — o teste end-to-end define o comportamento final, e voce constroi os passos intermediarios (action, use case, repository) ate ele passar

## How to write

### Server Action de Update

```typescript
export async function updatePromptAction(data: UpdatePromptDto): Promise<FormState> {
  const validated = updatePromptSchema.safeParse(data)

  if (!validated.success) {
    return { success: false, message: 'Erro de validação', errors: validated.error.flatten().fieldErrors }
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

### Schema de Update (com ID obrigatorio)

```typescript
export const updatePromptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export type UpdatePromptDto = z.infer<typeof updatePromptSchema>
```

### Use Case com validacao de existencia

```typescript
export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDto) {
    const exists = await this.promptRepository.findById(data.id)
    if (!exists) {
      throw new Error('Prompt not found')
    }
    return this.promptRepository.update(data.id, { title: data.title, content: data.content })
  }
}
```

### Form com bifurcacao create/edit

```typescript
const isEdit = !!prompt.id

const result = isEdit
  ? await updatePromptAction({ id: prompt.id, ...data })
  : await createPromptAction(data)
```

## Example

**Before (form so cria, nao edita):**
```typescript
async function onSubmit(data) {
  const result = await createPromptAction(data)
  toast(result.message)
}
```

**After (form cria E edita):**
```typescript
async function onSubmit(data) {
  const result = isEdit
    ? await updatePromptAction({ id: prompt.id, ...data })
    : await createPromptAction(data)

  toast(result.message)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Form reutilizado para create e edit | Bifurque por presenca de ID |
| Schema de update | Inclua ID como campo obrigatorio |
| Use case de update | Valide existencia com findById antes |
| Repository.update | Aceite Partial para campos opcionais |
| Campos condicionais no Prisma | Use ternario: `data.title !== undefined ? { title: data.title } : {}` |
| FormState compartilhado entre actions | Crie tipo unico com success, message, errors? |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Uma unica action que faz create E update | Actions separadas: `createPromptAction` e `updatePromptAction` |
| Update sem checar se registro existe | `findById` antes de `update`, lance erro se nao existir |
| Schema de update sem campo ID | Schema proprio com `id: z.string().min(1)` |
| Rodar servidor manualmente para testes E2E | Configure `webServer` no Playwright para subir automaticamente |
| Retornar mensagem generica no catch | Diferencie "not found" de "falha ao atualizar" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-construindo-a-tela-de-edicao/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-construindo-a-tela-de-edicao/references/code-examples.md)
