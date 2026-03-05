# Code Examples: Server Action com Validacao, Use Case e TDD

## 1. Server Action completa (promptActions.ts)

```typescript
// app/actions/promptActions.ts
import { createPromptSchema } from '@/schemas/createPromptSchema'
import { CreatePromptDTO } from '@/core/domain/prompts/CreatePromptDTO'
import { PrismaPromptRepository } from '@/core/infra/PrismaPromptRepository'
import { CreatePromptUseCase } from '@/core/application/prompts/CreatePromptUseCase'
import { prisma } from '@/lib/prisma'

export async function createPromptAction(data: CreatePromptDTO) {
  const validated = createPromptSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: validated.error.fieldErrors, // ou fromZodError
    }
  }

  try {
    const repository = new PrismaPromptRepository(prisma)
    const useCase = new CreatePromptUseCase(repository)
    await useCase.execute(validated.data)
  } catch (e) {
    const error = e as Error
    if (error.message === 'Prompt already exists') {
      return { success: false, message: 'Este prompt já existe' }
    }
    return { success: false, message: 'Falha ao criar o prompt' }
  }

  return { success: true, message: 'Prompt criado com sucesso' }
}
```

## 2. Use Case (CreatePromptUseCase.ts)

```typescript
// core/application/prompts/CreatePromptUseCase.ts
import { PromptRepository } from '@/core/domain/prompts/PromptRepository'
import { CreatePromptDTO } from '@/core/domain/prompts/CreatePromptDTO'

export class CreatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: CreatePromptDTO): Promise<void> {
    const promptExists = await this.promptRepository.findByTitle(data.title)
    if (promptExists) {
      throw new Error('Prompt already exists')
    }
    await this.promptRepository.create(data)
  }
}
```

## 3. Interface do Repository atualizada

```typescript
// core/domain/prompts/PromptRepository.ts
import { Prompt } from './Prompt'
import { CreatePromptDTO } from './CreatePromptDTO'

export interface PromptRepository {
  search(query: string): Promise<Prompt[]>
  findByTitle(title: string): Promise<Prompt | null>
  create(data: CreatePromptDTO): Promise<void>
}
```

## 4. Schema Zod

```typescript
// schemas/createPromptSchema.ts
import { z } from 'zod'

export const createPromptSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})
```

## 5. Teste completo (promptActions.test.ts)

```typescript
import { createPromptAction } from '@/app/actions/promptActions'
import { CreatePromptUseCase } from '@/core/application/prompts/CreatePromptUseCase'

// Mock do modulo inteiro
jest.mock('@/core/application/prompts/CreatePromptUseCase')

const mockedCreateExecute = jest.fn()

// Configura o mock para retornar o execute mockado
;(CreatePromptUseCase as jest.Mock).mockImplementation(() => ({
  execute: mockedCreateExecute,
}))

describe('createPromptAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar erro de validação quando os campos forem vazios', async () => {
    const data = { title: '', content: '' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Erro de validação')
    expect(result.errors).toBeDefined()
  })

  it('deve retornar erro quando prompt com mesmo título já existir', async () => {
    mockedCreateExecute.mockRejectedValue(
      new Error('Prompt already exists')
    )

    const data = { title: 'duplicado', content: 'duplicado' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Este prompt já existe')
  })

  it('deve criar um prompt com sucesso', async () => {
    mockedCreateExecute.mockResolvedValue(undefined)

    const data = { title: 'title', content: 'content' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Prompt criado com sucesso')
  })
})
```

## 6. Inspecionando field errors (debug)

```typescript
// Para ver a estrutura dos erros do Zod:
const validated = createPromptSchema.safeParse({ title: '', content: '' })
if (!validated.success) {
  console.log(validated.error.fieldErrors)
  // Output:
  // {
  //   title: ['String must contain at least 1 character(s)'],
  //   content: ['String must contain at least 1 character(s)']
  // }
}
```

## 7. Verificando falso positivo (pratica TDD)

```typescript
// SEMPRE inverta o valor esperado para confirmar que o teste e real:

// Se isso passa:
expect(result.success).toBe(false)

// Entao isso DEVE quebrar:
expect(result.success).toBe(true)  // ← deve falhar

// Se ambos passam, seu teste e falso positivo
```

## 8. Diferenca entre mockResolvedValue e mockRejectedValue

```typescript
// Simular SUCESSO (use case executou sem erro):
mockedCreateExecute.mockResolvedValue(undefined)
// Equivale a: await useCase.execute(data) → resolve normalmente

// Simular ERRO DE NEGOCIO (use case lancou excecao):
mockedCreateExecute.mockRejectedValue(new Error('Prompt already exists'))
// Equivale a: await useCase.execute(data) → throw new Error(...)
```