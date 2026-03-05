# Code Examples: Testando Create Prompt Use Case

## Estrutura de arquivos

```
src/
  core/
    application/
      prompts/
        create-prompt.usecase.ts
        create-prompt.usecase.spec.ts    ← arquivo criado nesta aula
        search-prompt.usecase.spec.ts    ← já existia
```

## Use case sendo testado

```typescript
// create-prompt.usecase.ts
export class CreatePromptUseCase {
  constructor(private repository: PromptRepository) {}

  async execute(input: { title: string; content: string }): Promise<void> {
    const existing = await this.repository.findByTitle(input.title)

    if (existing) {
      throw new Error('Prompt already exists')
    }

    await this.repository.create(input)
  }
}
```

## Teste completo

```typescript
// create-prompt.usecase.spec.ts
import { CreatePromptUseCase } from './create-prompt.usecase'
import { PromptRepository } from '../ports/prompt-repository'

function makeRepository(
  overrides?: Partial<PromptRepository>
): PromptRepository {
  const base: PromptRepository = {
    create: jest.fn().mockResolvedValue(undefined),
    findByTitle: jest.fn().mockResolvedValue(null),
    // demais métodos da interface com defaults
    ...overrides,
  } as PromptRepository

  return base
}

describe('createPromptUseCase', () => {
  it('deve criar um prompt quando não existir duplicidade', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue(null),
    })
    const useCase = new CreatePromptUseCase(repository)
    const input = { title: 'Novo', content: 'Content' }

    await expect(useCase.execute(input)).resolves.toBeUndefined()
    expect(repository.create).toHaveBeenCalledWith(input)
  })

  it('deve falhar quando o título já existir', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue({
        id: 'id',
        title: 'Novo',
        content: 'Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    })
    const useCase = new CreatePromptUseCase(repository)
    const input = { title: 'Novo', content: 'Content' }

    await expect(useCase.execute(input)).rejects.toThrow(
      'Prompt already exists'
    )
  })
})
```

## Técnica de validação de falsos positivos

```typescript
// Passo 1: teste passa ✓
// Passo 2: remova a lógica do use case e lance erro manual
async execute(input) {
  throw new Error('forçando erro')
}
// Passo 3: teste deve FALHAR ✗ — confirma que não é falso positivo

// Passo 4: restaure a lógica original
// Passo 5: mude a mensagem esperada no teste
await expect(useCase.execute(input)).rejects.toThrow('mensagem errada')
// Passo 6: teste deve FALHAR ✗ — confirma que Jest valida a mensagem
```

## Rodando os testes

```bash
# Rodar testes
npx jest

# Rodar com coverage
npx jest --coverage
```

## Observação sobre coverage

O Jest mostra 100% para componentes que foram executados indiretamente (ex: Logo importado pela Sidebar que tem teste). Isso NÃO significa que o componente está testado — apenas que suas linhas foram executadas. Sempre valide se existem asserções específicas para cada componente crítico.