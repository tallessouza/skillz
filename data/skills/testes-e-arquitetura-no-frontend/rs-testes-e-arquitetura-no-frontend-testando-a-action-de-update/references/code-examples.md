# Code Examples: Testando Actions de Update

## Estrutura completa do describe de Update

```typescript
describe('Update Prompt Action', () => {
  it('deve atualizar com sucesso', async () => {
    const promptId = 'prompt-1'
    const data = { id: promptId, title: 'New title', content: 'New content' }

    mockUpdateExecute.mockResolvedValue(undefined)

    const result = await updatePromptAction(data)

    expect(result).toMatchObject({
      success: true,
      message: 'Prompt atualizado com sucesso',
    })
  })

  it('deve retornar erro de validacao quando campos faltarem', async () => {
    const data = { id: '1', title: '', content: '' }

    const result = await updatePromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Erro de validação')
    expect(result.errors).toBeDefined()
  })

  it('deve retornar erro quando prompt nao existir', async () => {
    const promptId = 'non-existent-id'
    const data = { id: promptId, title: 'New title', content: 'Content' }

    mockUpdateExecute.mockRejectedValue(new Error('Prompt not found'))

    const result = await updatePromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Prompt não encontrado')
  })

  it('deve retornar erro generico quando falhar ao atualizar', async () => {
    const promptId = 'prompt-1'
    const data = { id: promptId, title: 'Title', content: 'Content' }

    mockUpdateExecute.mockRejectedValue(new Error('unexpected'))

    const result = await updatePromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Falha ao atualizar o prompt')
  })
})
```

## A action sendo testada (referencia)

```typescript
// app/actions/prompt-actions.ts (trecho update)
export async function updatePromptAction(data: UpdatePromptDTO) {
  const validated = updatePromptSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const useCase = new UpdatePrompt(new PrismaPromptRepository())
    await useCase.execute(validated.data)

    return { success: true, message: 'Prompt atualizado com sucesso' }
  } catch (error) {
    if (error instanceof Error && error.message === 'Prompt not found') {
      return { success: false, message: 'Prompt não encontrado' }
    }
    return { success: false, message: 'Falha ao atualizar o prompt' }
  }
}
```

## Setup completo de mocks (arquivo de teste)

```typescript
// Mocks de use cases
const mockCreateExecute = vi.fn()
const mockUpdateExecute = vi.fn()
const mockSearchExecute = vi.fn()

vi.mock('@/use-cases/create-prompt', () => ({
  CreatePrompt: vi.fn().mockImplementation(() => ({
    execute: mockCreateExecute,
  })),
}))

vi.mock('@/use-cases/update-prompt', () => ({
  UpdatePrompt: vi.fn().mockImplementation(() => ({
    execute: mockUpdateExecute,
  })),
}))

vi.mock('@/use-cases/search-prompts', () => ({
  SearchPrompts: vi.fn().mockImplementation(() => ({
    execute: mockSearchExecute,
  })),
}))

// beforeEach com reset completo
beforeEach(() => {
  mockCreateExecute.mockReset()
  mockUpdateExecute.mockReset()
  mockSearchExecute.mockReset()
  // outros resets: toast, router, revalidatePath, etc.
})
```

## Padrao AAA (Arrange, Act, Assert) explicito

```typescript
it('deve retornar erro quando prompt nao existir', async () => {
  // Arrange
  const promptId = 'non-existent-id'
  const data = { id: promptId, title: 'Title', content: 'Content' }
  mockUpdateExecute.mockRejectedValue(new Error('Prompt not found'))

  // Act
  const result = await updatePromptAction(data)

  // Assert
  expect(result.success).toBe(false)
  expect(result.message).toBe('Prompt não encontrado')
})
```

## Comparacao: toMatchObject vs propriedade por propriedade

```typescript
// Opcao 1: propriedade por propriedade (funciona, mais verboso)
expect(result.success).toBe(true)
expect(result.message).toBe('Prompt atualizado com sucesso')

// Opcao 2: toMatchObject (mais conciso, escala melhor)
expect(result).toMatchObject({
  success: true,
  message: 'Prompt atualizado com sucesso',
})
```

## Rodando coverage para validar

```bash
# Rodar coverage geral
npx vitest run --coverage

# Rodar apenas os testes da action com watch
npx vitest watch app/actions/prompt-actions

# Rodar com describe.only para debug
# (adicionar .only no describe temporariamente)
```