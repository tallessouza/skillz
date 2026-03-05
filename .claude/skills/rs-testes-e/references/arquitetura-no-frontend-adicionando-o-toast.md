---
name: rs-testes-arquitetura-fe-toast-tests
description: "Enforces toast feedback setup with Sonner and Jest unit testing patterns for Prisma repository methods in Next.js. Use when user asks to 'add toast notifications', 'add user feedback', 'test prisma repository', 'write jest tests for create/find methods', or 'mock prisma delegate'. Applies Sonner toast configuration, mocked Prisma delegate patterns, and repository test structure. Make sure to use this skill whenever implementing visual feedback with toasts or writing tests for Prisma repository layers. Not for E2E tests, integration tests with real databases, or UI component testing."
---

# Toast Feedback e Testes de Repository Prisma

> Toda acao do usuario precisa de feedback visual, e todo metodo de repository precisa de teste unitario com mock do Prisma delegate.

## Rules

1. **Configure o Toaster no layout raiz** — importe o `<Toaster />` dentro do `<body>` no layout principal, porque ele precisa estar disponivel globalmente para qualquer pagina disparar toasts
2. **Use toast.error e toast.success nos formularios** — nunca deixe acoes silenciosas, porque o usuario precisa saber se a operacao funcionou ou falhou
3. **Mocke o Prisma delegate com Jest.MockedFunction tipado** — defina tipos explicitos para cada metodo mockado (create, findFirst, findMany), porque testes sem tipagem correta nao detectam mudancas de contrato
4. **Teste que o metodo foi chamado com os dados corretos** — use `toHaveBeenCalledWith` para validar os argumentos, nao apenas que foi chamado, porque garante que o repository passa os dados corretamente ao Prisma
5. **Extraia inputs como constantes nos testes** — defina `input` antes do `await` e reutilize no `expect`, porque evita duplicacao e facilita manutencao

## How to write

### Configuracao do Toaster no Layout

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

### Toast no formulario

```tsx
import { toast } from 'sonner'

// No handler do formulario
if (result.error) {
  toast.error(result.message)
} else {
  toast.success(result.message)
}
```

### Mock do Prisma Delegate tipado

```typescript
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
```

### Teste do metodo create

```typescript
describe('create', () => {
  it('deve chamar prisma.prompt.create com os dados corretos', async () => {
    const input = { title: 'Title 01', content: 'Content 01' }

    await repository.create(input)

    expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input })
  })
})
```

### Teste do metodo findByTitle

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

## Example

**Before (sem feedback e sem testes):**
```tsx
// Formulario silencioso
const handleSubmit = async (data) => {
  const result = await createPrompt(data)
  // usuario nao sabe o que aconteceu
}

// Repository sem testes
// "funciona no browser, ta bom"
```

**After (com toast e testes):**
```tsx
// Formulario com feedback
const handleSubmit = async (data) => {
  const result = await createPrompt(data)
  if (result.error) {
    toast.error(result.message)
  } else {
    toast.success(result.message)
  }
}

// Testes validando contrato com Prisma
expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input })
expect(result).toEqual(input)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Acao de formulario (create, update, delete) | Sempre adicione toast.success e toast.error |
| Novo metodo no repository | Crie teste verificando argumentos passados ao Prisma |
| Mock de metodo Prisma | Tipe com jest.MockedFunction e defina args + retorno |
| Valor de retorno do repository | Use mockResolvedValue e valide com toEqual |
| Multiplos testes no mesmo describe | Extraia input/mock como constante reutilizavel |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `console.log('criado')` como feedback | `toast.success('Prompt criado')` |
| `expect(fn).toHaveBeenCalled()` sem args | `expect(fn).toHaveBeenCalledWith({ data: input })` |
| Mock sem tipagem: `jest.fn()` solto | `jest.fn() as jest.MockedFunction<...>` tipado |
| Duplicar dados no test e no expect | Extrair `const input = {...}` e reutilizar |
| Testar apenas o happy path | Testar tambem retorno null do findFirst |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionando-o-toast/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionando-o-toast/references/code-examples.md)
