# Code Examples: Delete Use Case Pattern

## 1. Use Case completo

```typescript
// core/application/prompts/delete-prompt-use-case.ts
import { PromptRepository } from './prompt-repository'

export class DeletePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(id: string) {
    const prompt = await this.promptRepository.findById(id)
    if (!prompt) {
      throw new Error('Prompt not found')
    }
    await this.promptRepository.delete(id)
  }
}
```

## 2. Interface do Repository (atualizada)

```typescript
// core/application/prompts/prompt-repository.ts
export interface PromptRepository {
  create(prompt: Prompt): Promise<Prompt>
  findById(id: string): Promise<Prompt | null>
  search(query: string): Promise<Prompt[]>
  update(prompt: Prompt): Promise<Prompt>
  delete(id: string): Promise<void>  // NOVO
}
```

## 3. Implementacao Prisma

```typescript
// infra/prisma-prompt-repository.ts
async delete(id: string): Promise<void> {
  await this.prisma.prompt.delete({
    where: { id }
  })
}
```

## 4. Teste do Use Case (completo)

```typescript
// core/application/prompts/delete-prompt-use-case.spec.ts
import { DeletePromptUseCase } from './delete-prompt-use-case'
import { PromptRepository } from './prompt-repository'

const makeRepository = (overrides?: Partial<PromptRepository>): PromptRepository => {
  const base: Partial<PromptRepository> = {
    delete: jest.fn(async () => {}),
    findById: jest.fn(),
  }
  return { ...base, ...overrides } as PromptRepository
}

describe('DeletePromptUseCase', () => {
  it('deveria deletar um prompt quando ele existe', async () => {
    const now = new Date()
    const prompt = {
      id: '1',
      title: 'title',
      content: 'content',
      createdAt: now,
      updatedAt: now,
    }

    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(prompt),
      delete: jest.fn().mockResolvedValue(undefined),
    })

    const useCase = new DeletePromptUseCase(repository)
    const result = await useCase.execute(prompt.id)

    expect(result).toBeUndefined()
    expect(repository.delete).toHaveBeenCalledWith(prompt.id)
  })

  it('deveria falhar com prompt not found quando o prompt nao existir', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    })

    const useCase = new DeletePromptUseCase(repository)

    await expect(useCase.execute('any-id')).rejects.toThrow('Prompt not found')
  })
})
```

## 5. Teste do Repository Prisma (delete)

```typescript
// infra/prisma-prompt-repository.spec.ts (dentro do describe existente)
describe('delete', () => {
  it('deveria chamar prisma.prompt.delete com where id', async () => {
    const promptId = '1'
    await repository.delete(promptId)

    expect(prisma.prompt.delete).toHaveBeenCalledWith({
      where: { id: promptId }
    })
  })
})
```

## 6. Verificacao de coverage

```bash
# Rodar coverage para confirmar 100% no use case
pnpm test --coverage

# Rodar teste em watch mode durante desenvolvimento
pnpm test --watch core/application/prompts/delete-prompt-use-case.spec.ts
```

## Variacao: Factory com todos os metodos

Se o repository tem muitos metodos, a factory pode incluir todos com defaults:

```typescript
const makeRepository = (overrides?: Partial<PromptRepository>): PromptRepository => {
  const base: PromptRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  return { ...base, ...overrides }
}
```

Mas o instrutor prefere incluir apenas os metodos relevantes para o use case sendo testado (`findById` e `delete`), mantendo o teste focado.