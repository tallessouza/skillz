# Code Examples: Integrando Server Action ao Formulário

## Exemplo 1: Teste completo da Create Prompt Action

```typescript
describe('Create Prompt Action', () => {
  beforeEach(() => {
    vi.mocked(repository.create).mockReset()
    vi.mocked(repository.findByTitle).mockReset()
  })

  it('deve criar prompt com sucesso', async () => {
    const data = { title: 'Meu Prompt', content: 'Conteúdo do prompt' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Prompt criado com sucesso')
  })

  it('deve retornar erro quando campos estão vazios', async () => {
    const data = { title: '', content: '' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    // mensagem de validação específica
  })

  it('deve retornar erro quando prompt já existe', async () => {
    vi.mocked(repository.findByTitle).mockResolvedValueOnce({
      id: '1',
      title: 'Existente',
      content: 'conteúdo',
      createdAt: new Date(),
    })

    const data = { title: 'Existente', content: 'novo conteúdo' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Prompt já existe')
  })

  it('deve retornar erro genérico quando criação falhar', async () => {
    vi.mocked(repository.create).mockRejectedValueOnce(
      new Error('Database error')
    )

    const data = { title: 'title', content: 'content' }
    const result = await createPromptAction(data)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Falha ao criar o prompt')
  })
})
```

## Exemplo 2: Componente do formulário com integração

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createPromptAction } from '@/actions/create-prompt-action'
import { CreatePromptDto } from '@/dtos/create-prompt-dto'

export function PromptForm() {
  const router = useRouter()
  const form = useForm<CreatePromptDto>()

  const submit = async (data: CreatePromptDto) => {
    const result = await createPromptAction(data)

    if (!result.success) {
      // TODO: exibir mensagem de erro para o usuário
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <input {...form.register('title')} />
      <textarea {...form.register('content')} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 3: Implementação do repositório Prisma

```typescript
class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePromptDto): Promise<void> {
    await this.prisma.prompt.create({
      data: {
        title: data.title,
        content: data.content,
      },
    })
  }

  async findByTitle(title: string): Promise<Prompt | null> {
    const prompt = await this.prisma.prompt.findFirst({
      where: { title },
    })
    return prompt
  }
}
```

## Exemplo 4: Padrão de retorno da Server Action

```typescript
// A Action sempre retorna um objeto com success e message
type ActionResult = {
  success: boolean
  message: string
}

// Isso permite tratamento uniforme no front:
const result = await createPromptAction(data)
if (!result.success) {
  // result.message contém a descrição do erro
  return
}
// sucesso
```