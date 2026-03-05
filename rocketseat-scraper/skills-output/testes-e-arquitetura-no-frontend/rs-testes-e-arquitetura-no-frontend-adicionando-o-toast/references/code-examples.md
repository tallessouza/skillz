# Code Examples: Toast Feedback e Testes de Repository Prisma

## 1. Instalacao do Sonner

```bash
npm install sonner
```

## 2. Configuracao do Toaster no Layout

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

## 3. Uso do toast no formulario

```tsx
import { toast } from 'sonner'

// Dentro do handler de submit
const result = await createPrompt(formData)

if (result.error) {
  toast.error(result.message)
} else {
  toast.success(result.message)
}
```

## 4. Mock completo do Prisma Delegate

```typescript
import { Prompt } from '@prisma/client'

type CreatePromptDTO = { title: string; content: string }

const promptDelegateMock = {
  findMany: jest.fn() as jest.MockedFunction<
    () => Promise<Prompt[]>
  >,
  findFirst: jest.fn() as jest.MockedFunction<
    (args: { where: { title: string } }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >,
  create: jest.fn() as jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >,
}
```

## 5. Teste do metodo create

```typescript
describe('create', () => {
  it('deve chamar prisma.prompt.create com os dados corretos', async () => {
    const input = { title: 'Title 02', content: 'Content 02' }

    await repository.create(input)

    expect(prisma.prompt.create).toHaveBeenCalledWith({
      data: input,
    })
  })
})
```

## 6. Teste do metodo findByTitle

```typescript
describe('findByTitle', () => {
  it('deve chamar findFirst com o title correto', async () => {
    const input = { id: '1', title: 'Title01', content: 'Content01' }

    prisma.prompt.findFirst.mockResolvedValue(input)

    const result = await repository.findByTitle('Title01')

    expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
      where: { title: 'Title01' },
    })
    expect(result).toEqual(input)
  })
})
```

## 7. Estrutura completa do arquivo de teste

```typescript
import { PrismaPromptRepository } from './prisma-prompt-repository'
import { Prompt } from '@prisma/client'

type CreatePromptDTO = { title: string; content: string }

const promptDelegateMock = {
  findMany: jest.fn() as jest.MockedFunction<() => Promise<Prompt[]>>,
  findFirst: jest.fn() as jest.MockedFunction<
    (args: { where: { title: string } }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >,
  create: jest.fn() as jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >,
}

const prisma = { prompt: promptDelegateMock }
const repository = new PrismaPromptRepository(prisma as any)

describe('PrismaPromptRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findMany', () => {
    // ... testes existentes
  })

  describe('searchMany', () => {
    // ... testes existentes
  })

  describe('create', () => {
    it('deve chamar prisma.prompt.create com os dados corretos', async () => {
      const input = { title: 'Title 02', content: 'Content 02' }
      await repository.create(input)
      expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input })
    })
  })

  describe('findByTitle', () => {
    it('deve chamar findFirst com o title correto', async () => {
      const input = { id: '1', title: 'Title01', content: 'Content01' }
      prisma.prompt.findFirst.mockResolvedValue(input)

      const result = await repository.findByTitle('Title01')

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: 'Title01' },
      })
      expect(result).toEqual(input)
    })
  })
})
```

## 8. Variacoes uteis

### Testando retorno null do findByTitle

```typescript
it('deve retornar null quando title nao existe', async () => {
  prisma.prompt.findFirst.mockResolvedValue(null)

  const result = await repository.findByTitle('inexistente')

  expect(result).toBeNull()
})
```

### Toast com diferentes severidades

```tsx
// Erro de validacao
toast.error('Titulo ja existe')

// Sucesso
toast.success('Prompt criado com sucesso')

// Informativo (Sonner suporta)
toast.info('Carregando...')

// Warning
toast.warning('Prompt sera sobrescrito')
```