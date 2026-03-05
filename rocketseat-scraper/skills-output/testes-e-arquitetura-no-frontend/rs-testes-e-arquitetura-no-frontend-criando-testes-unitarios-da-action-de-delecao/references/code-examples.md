# Code Examples: Testes Unitários de Action de Deleção

## Setup completo do arquivo de teste

```typescript
import { deletePromptAction } from '@/actions/prompt-actions'

const { useCaseDelete } = vi.hoisted(() => ({
  useCaseDelete: { execute: vi.fn() },
}))

vi.mock('@/use-cases/delete-prompt', () => ({
  DeletePromptUseCase: vi.fn().mockReturnValue(useCaseDelete),
}))

describe('deletePromptAction', () => {
  // testes aqui
})
```

## Teste 1: ID vazio

```typescript
it('deve retornar erro quando o id for vazio', async () => {
  const promptId = ''
  const result = await deletePromptAction(promptId)

  expect(result.success).toBe(false)
  expect(result.message).toBe('ID do prompt é obrigatório')
})
```

## Teste 2: Prompt não encontrado

```typescript
it('deve retornar erro quando o prompt não existir', async () => {
  useCaseDelete.execute.mockRejectedValue(
    new Error('Prompt not found')
  )

  const promptId = 'non-existent-id'
  const result = await deletePromptAction(promptId)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Prompt não encontrado')
})
```

## Teste 3: Erro genérico

```typescript
it('deve retornar erro genérico quando a action falhar', async () => {
  useCaseDelete.execute.mockRejectedValue(
    new Error('unknown')
  )

  const promptId = 'some-id'
  const result = await deletePromptAction(promptId)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Falha ao remover prompt')
})
```

## Teste 4: Sucesso

```typescript
it('deve remover com sucesso', async () => {
  useCaseDelete.execute.mockResolvedValue(undefined)

  const promptId = 'valid-id'
  const result = await deletePromptAction(promptId)

  expect(result.success).toBe(true)
  expect(result.message).toBe('Prompt removido com sucesso')
})
```

## Suite completa

```typescript
import { deletePromptAction } from '@/actions/prompt-actions'

const { useCaseDelete } = vi.hoisted(() => ({
  useCaseDelete: { execute: vi.fn() },
}))

vi.mock('@/use-cases/delete-prompt', () => ({
  DeletePromptUseCase: vi.fn().mockReturnValue(useCaseDelete),
}))

describe('deletePromptAction', () => {
  it('deve retornar erro quando o id for vazio', async () => {
    const promptId = ''
    const result = await deletePromptAction(promptId)

    expect(result.success).toBe(false)
    expect(result.message).toBe('ID do prompt é obrigatório')
  })

  it('deve retornar erro quando o prompt não existir', async () => {
    useCaseDelete.execute.mockRejectedValue(
      new Error('Prompt not found')
    )

    const promptId = 'non-existent-id'
    const result = await deletePromptAction(promptId)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Prompt não encontrado')
  })

  it('deve retornar erro genérico quando a action falhar', async () => {
    useCaseDelete.execute.mockRejectedValue(
      new Error('unknown')
    )

    const promptId = 'some-id'
    const result = await deletePromptAction(promptId)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Falha ao remover prompt')
  })

  it('deve remover com sucesso', async () => {
    useCaseDelete.execute.mockResolvedValue(undefined)

    const promptId = 'valid-id'
    const result = await deletePromptAction(promptId)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Prompt removido com sucesso')
  })
})
```

## Rodando com coverage

```bash
# Rodar apenas os testes de actions
npx vitest run src/tests/actions/

# Rodar com coverage
npx vitest run --coverage
```

## Padrão reutilizável para outras actions CRUD

O mesmo padrão se aplica para create e update. A estrutura é idêntica:

```typescript
// Para create:
const { useCaseCreate } = vi.hoisted(() => ({
  useCaseCreate: { execute: vi.fn() },
}))

// Para update:
const { useCaseUpdate } = vi.hoisted(() => ({
  useCaseUpdate: { execute: vi.fn() },
}))
```

Os 4 cenários se repetem: validação de input, not found (para update/delete), erro genérico e sucesso.