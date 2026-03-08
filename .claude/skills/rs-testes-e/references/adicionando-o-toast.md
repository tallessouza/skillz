---
name: rs-testes-e-adicionando-o-toast
description: "Enforces toast feedback setup with Sonner and Jest unit testing patterns for Prisma repository methods in Next.js. Use when user asks to 'add toast notifications', 'add user feedback', 'test prisma repository', 'write jest tests for create/find methods', or 'mock prisma delegate'. Applies Sonner toast configuration, typed Prisma delegate mocks, and repository test structure. Make sure to use this skill whenever implementing visual feedback with toasts or writing tests for Prisma repository layers. Not for E2E tests (use rs-testes-e-criando-o-primeiro-teste-e-2-e), integration tests with real databases, or UI component testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: repository-testing
  tags: [sonner, toast, prisma, repository, jest, testing, mock, next-js]
---

# Toast Feedback e Testes de Repository Prisma

> Toda acao do usuario precisa de feedback visual, e todo metodo de repository precisa de teste unitario com mock tipado do Prisma delegate.

## Rules

1. **Configure o Toaster no layout raiz** — importe `<Toaster />` dentro do `<body>`, porque precisa estar disponivel globalmente
2. **Use toast.error e toast.success nos formularios** — nunca deixe acoes silenciosas, porque o usuario precisa saber se funcionou ou falhou
3. **Mocke o Prisma delegate com jest.MockedFunction tipado** — defina tipos explicitos para cada metodo (create, findFirst, findMany), porque testes sem tipagem nao detectam mudancas de contrato
4. **Valide argumentos com toHaveBeenCalledWith** — nao apenas que foi chamado, porque garante que o repository passa dados corretos ao Prisma
5. **Extraia inputs como constantes** — defina `input` antes do `await` e reutilize no `expect`, porque evita duplicacao

## How to write

### Configuracao do Toaster

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <Toaster position="top-right" />
    </body></html>
  )
}
```

### Toast no formulario

```tsx
import { toast } from 'sonner'

if (result.error) {
  toast.error(result.message)
} else {
  toast.success(result.message)
}
```

### Mock tipado do Prisma delegate

```typescript
const promptDelegateMock = {
  findMany: jest.fn() as jest.MockedFunction<() => Promise<Prompt[]>>,
  create: jest.fn() as jest.MockedFunction<(args: { data: CreatePromptDTO }) => Promise<void>>,
  findFirst: jest.fn() as jest.MockedFunction<
    (args: { where: { title: string } }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >,
}
```

### Teste do metodo create

```typescript
it('deve chamar prisma.prompt.create com dados corretos', async () => {
  const input = { title: 'Title 01', content: 'Content 01' }
  await repository.create(input)
  expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input })
})
```

## Example

**Before (sem feedback e sem testes):**
```tsx
const handleSubmit = async (data) => {
  await createPrompt(data) // usuario nao sabe o que aconteceu
}
```

**After (com toast e testes):**
```tsx
const handleSubmit = async (data) => {
  const result = await createPrompt(data)
  result.error ? toast.error(result.message) : toast.success(result.message)
}
// Teste: expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Acao de formulario (create, update, delete) | Sempre adicione toast.success e toast.error |
| Novo metodo no repository | Crie teste verificando argumentos ao Prisma |
| Mock de metodo Prisma | Tipe com jest.MockedFunction |
| Multiplos testes no mesmo describe | Extraia input como constante reutilizavel |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `console.log('criado')` como feedback | `toast.success('Prompt criado')` |
| `expect(fn).toHaveBeenCalled()` sem args | `expect(fn).toHaveBeenCalledWith({ data: input })` |
| Mock sem tipagem: `jest.fn()` solto | `jest.fn() as jest.MockedFunction<...>` |

## Troubleshooting

### Toast nao aparece no app
**Symptom:** toast.success/error e chamado mas nada visual aparece
**Cause:** Componente `<Toaster />` nao esta no layout raiz
**Fix:** Adicionar `<Toaster />` dentro do `<body>` no layout principal

### Mock do Prisma nao captura chamadas
**Symptom:** `toHaveBeenCalledWith` falha mesmo com implementacao correta
**Cause:** Mock nao esta conectado a instancia usada pelo repository
**Fix:** Garantir que o repository recebe o objeto mockado no construtor

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
