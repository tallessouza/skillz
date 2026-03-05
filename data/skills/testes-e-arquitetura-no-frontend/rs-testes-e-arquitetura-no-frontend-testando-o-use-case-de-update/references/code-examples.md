# Code Examples: Testando Use Cases de Update

## Estrutura completa do arquivo de teste

```typescript
// src/tests/core/update-prompt-use-case.spec.ts

import { UpdatePromptUseCase } from '@/core/use-cases/update-prompt-use-case'
import { PromptRepository } from '@/core/repositories/prompt-repository'

function makeRepository(overrides: Partial<PromptRepository> = {}): PromptRepository {
  return {
    update: jest.fn(async (id, data) => ({
      id,
      title: data.title ?? '',
      content: data.content ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findById: jest.fn(async () => null),
    ...overrides,
  }
}

describe('UpdatePromptUseCase', () => {
  it('should update when prompt exists', async () => {
    // Arrange
    const now = new Date()
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue({
        id: '1',
        title: 'oldTitle',
        content: 'oldContent',
        createdAt: now,
      }),
      update: jest.fn().mockResolvedValue({
        id: '1',
        title: 'newTitle',
        content: 'newContent',
        createdAt: now,
      }),
    })
    const useCase = new UpdatePromptUseCase(repository)
    const input = { id: '1', content: 'newContent', title: 'newTitle' }

    // Act
    const result = await useCase.execute(input)

    // Assert
    expect(result.title).toBe(input.title)
    expect(repository.update).toHaveBeenCalledWith(input.id, {
      title: input.title,
      content: input.content,
    })
  })

  it('should fail with prompt not found when prompt does not exist', async () => {
    // Arrange
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    })
    const useCase = new UpdatePromptUseCase(repository)
    const input = { id: '1', title: 'title', content: 'content' }

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('prompt not found')
  })
})
```

## O use case sendo testado (referencia)

```typescript
// src/core/use-cases/update-prompt-use-case.ts (estrutura inferida)

export class UpdatePromptUseCase {
  constructor(private repository: PromptRepository) {}

  async execute(input: { id: string; title: string; content: string }) {
    const prompt = await this.repository.findById(input.id)

    if (!prompt) {
      throw new Error('prompt not found')
    }

    return this.repository.update(input.id, {
      title: input.title,
      content: input.content,
    })
  }
}
```

## Variacao: testando que findById foi chamado com o id correto

```typescript
it('should call findById with the correct id', async () => {
  const now = new Date()
  const repository = makeRepository({
    findById: jest.fn().mockResolvedValue({
      id: '42', title: 'title', content: 'content', createdAt: now,
    }),
    update: jest.fn().mockResolvedValue({
      id: '42', title: 'title', content: 'content', createdAt: now,
    }),
  })
  const useCase = new UpdatePromptUseCase(repository)

  await useCase.execute({ id: '42', title: 'title', content: 'content' })

  expect(repository.findById).toHaveBeenCalledWith('42')
})
```

## Variacao: verificando que update NAO foi chamado no caminho de erro

```typescript
it('should not call update when prompt is not found', async () => {
  const repository = makeRepository({
    findById: jest.fn().mockResolvedValue(null),
  })
  const useCase = new UpdatePromptUseCase(repository)

  await expect(
    useCase.execute({ id: '1', title: 't', content: 'c' })
  ).rejects.toThrow()

  expect(repository.update).not.toHaveBeenCalled()
})
```

## Tecnica de validacao de falso positivo

```typescript
// Apos o teste passar, altere a mensagem para confirmar que nao e falso positivo:
await expect(useCase.execute(input)).rejects.toThrow('wrong message')
// ↑ Deve FALHAR — se passar, o teste original era falso positivo
```