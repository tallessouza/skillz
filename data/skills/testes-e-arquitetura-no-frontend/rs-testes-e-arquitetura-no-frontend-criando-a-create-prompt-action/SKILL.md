---
name: rs-testes-arq-fe-create-prompt-action
description: "Enforces server action creation pattern with Zod validation, use cases, and TDD in Next.js. Use when user asks to 'create a server action', 'add form action', 'validate form data', 'write action tests', or 'implement use case with tests'. Applies pattern: Zod safeParse validation, use case injection via mocks, error categorization (validation/business/generic), and test-first development. Make sure to use this skill whenever creating Next.js server actions or testing them. Not for client-side validation, API routes, or React component testing."
---

# Server Action com Validacao, Use Case e TDD

> Toda server action segue o padrao: validar com Zod safeParse, delegar para use case, categorizar erros, e testar cada cenario com mocks.

## Rules

1. **Valide com safeParse, nunca parse** — `schema.safeParse(data)` retorna resultado tipado sem lançar excecao, porque permite tratamento granular de erros de validacao
2. **Extraia field errors com fromZodError** — use `fromZodError(validated.error).details` em vez do depreciado `flatten()`, porque a API muda e depreciados quebram em versoes futuras
3. **Delegue logica de negocio para use cases** — a server action NAO contem regras de negocio, ela valida input e chama `useCase.execute()`, porque permite testar regras isoladamente
4. **Categorize erros em 3 niveis** — validacao (campos invalidos), negocio (prompt ja existe), generico (falha inesperada), porque cada nivel tem tratamento diferente no frontend
5. **Retorne sempre o mesmo shape** — `{ success: boolean, message: string, errors?: object }`, porque o formulario depende de uma interface previsivel
6. **Teste com mocks do use case, nao do repository** — mock o `useCase.execute` com `mockResolvedValue` ou `mockRejectedValue`, porque testes da action nao devem depender de implementacao do banco

## How to write

### Server Action com validacao e use case

```typescript
export async function createPromptAction(data: CreatePromptDTO) {
  const validated = createPromptSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: fromZodError(validated.error).details,
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

### Use Case com regra de negocio

```typescript
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

## Example

**Teste completo com 3 cenarios:**

```typescript
import { createPromptAction } from './promptActions'

jest.mock('@/core/application/prompts/CreatePromptUseCase')

describe('createPromptAction', () => {
  it('deve retornar erro de validação quando campos vazios', async () => {
    const data = { title: '', content: '' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Erro de validação')
    expect(result.errors).toBeDefined()
  })

  it('deve retornar erro quando prompt já existe', async () => {
    mockedCreateExecute.mockRejectedValue(
      new Error('Prompt already exists')
    )
    const data = { title: 'duplicado', content: 'duplicado' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Este prompt já existe')
  })

  it('deve criar prompt com sucesso', async () => {
    mockedCreateExecute.mockResolvedValue(undefined)
    const data = { title: 'title', content: 'content' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Prompt criado com sucesso')
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validacao de input do usuario | `safeParse` + retorno com `errors` |
| Regra de negocio (duplicidade, permissao) | Dentro do use case, throw Error com mensagem especifica |
| Erro inesperado (banco fora, rede) | Catch generico com mensagem amigavel |
| Testar action sem banco | Mock do use case com `jest.mock()` |
| Verificar falso positivo no teste | Inverta o valor esperado e confirme que quebra |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `schema.parse(data)` (lanca excecao) | `schema.safeParse(data)` (retorna resultado) |
| Regra de negocio dentro da action | Use case separado com `execute()` |
| `validated.error.flatten()` (depreciado) | `fromZodError(validated.error).details` |
| Mock do repository no teste da action | Mock do use case no teste da action |
| `mockResolvedValue` para simular erro | `mockRejectedValue(new Error(...))` |
| Retornar shapes diferentes por cenario | Sempre `{ success, message, errors? }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
