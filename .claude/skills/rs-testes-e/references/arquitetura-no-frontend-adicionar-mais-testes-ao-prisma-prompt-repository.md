---
name: rs-testes-arq-frontend-mais-testes-prisma
description: "Enforces patterns for testing Prisma repository methods with mocked functions when writing unit tests for database repositories. Use when user asks to 'test repository', 'mock prisma', 'test update method', 'test findById', 'unit test database layer', or any repository testing task. Applies rules: mock resolved values before action, assert call args with where/data structure, test partial field updates independently, test null/not-found cases. Make sure to use this skill whenever generating repository tests or mocking Prisma client. Not for E2E tests, integration tests with real database, or API route testing."
---

# Testes de Repository Prisma — Update e FindById

> Cada metodo do repository precisa de testes que validem a chamada correta ao Prisma E os cenarios de borda como campos parciais e registros inexistentes.

## Rules

1. **Mock antes, action depois** — configure `mockResolvedValue` antes de chamar o metodo do repository, porque o teste precisa do retorno simulado antes da execucao
2. **Valide a estrutura where/data** — assert com `toHaveBeenCalledWith({ where: { id }, data: { ... } })`, porque garante que o repository passa os parametros corretos ao Prisma
3. **Teste campos parciais independentemente** — crie testes separados para update de title-only e content-only, porque o usuario pode atualizar campos de forma independente
4. **Verifique ausencia de campos nao enviados** — use `expect("field" in call.data).toBe(false)` para garantir que campos nao enviados nao aparecem no data
5. **Teste o caso null/not-found** — para findById, teste tanto o cenario de retorno do registro quanto o retorno null, porque ambos sao fluxos validos
6. **Registre mocks no setup do describe** — defina `jest.fn()` para cada operacao do Prisma (create, update, findUnique, findFirst) no objeto mock compartilhado

## How to write

### Mock do Prisma com operacoes tipadas

```typescript
const prisma = {
  prompt: {
    create: jest.fn() as jest.MockedFunction<(args: { data: CreatePromptDTO }) => Promise<void>>,
    update: jest.fn() as jest.MockedFunction<(args: { where: { id: string }, data: Partial<Prompt> }) => Promise<Prompt>>,
    findUnique: jest.fn() as jest.MockedFunction<(args: { where: { id: string } }) => Promise<Prompt | null>>,
  }
}
```

### Teste de update completo

```typescript
it("deve atualizar e retornar o prompt", async () => {
  const now = new Date()
  const input = { id: "1", title: "Title", content: "Content", createdAt: now, updatedAt: now }

  prisma.prompt.update.mockResolvedValue(input)

  const result = await repository.update(input.id, { title: input.title, content: input.content })

  expect(prisma.prompt.update).toHaveBeenCalledWith({
    where: { id: input.id },
    data: { title: input.title, content: input.content }
  })
  expect(result).toEqual(input)
})
```

### Teste de campo parcial (somente title)

```typescript
it("deve enviar apenas campos presentes", async () => {
  prisma.prompt.update.mockResolvedValue(input)

  await repository.update(input.id, { title: input.title })

  const call = prisma.prompt.update.mock.calls[0][0]
  expect(call.where).toEqual({ id: input.id })
  expect(call.data).toEqual({ title: input.title })
  expect("content" in call.data).toBe(false)
})
```

### Teste findById — existe e nao existe

```typescript
it("deve retornar prompt quando existir", async () => {
  prisma.prompt.findUnique.mockResolvedValue(input)

  const result = await repository.findById(input.id)

  expect(prisma.prompt.findUnique).toHaveBeenCalledWith({ where: { id: input.id } })
  expect(result).toEqual(input)
})

it("deve retornar null quando nao existir", async () => {
  prisma.prompt.findUnique.mockResolvedValue(null)

  const result = await repository.findById("nonexistent-id")

  expect(result).toBeNull()
})
```

## Example

**Before (teste incompleto):**
```typescript
it("testa update", async () => {
  const result = await repository.update("1", { title: "T", content: "C" })
  expect(result).toBeDefined()
})
```

**After (com esta skill aplicada):**
```typescript
describe("update", () => {
  it("deve atualizar e retornar o prompt", async () => {
    const input = { id: "1", title: "Title", content: "Content", createdAt: now, updatedAt: now }
    prisma.prompt.update.mockResolvedValue(input)

    const result = await repository.update(input.id, { title: input.title, content: input.content })

    expect(prisma.prompt.update).toHaveBeenCalledWith({
      where: { id: input.id },
      data: { title: input.title, content: input.content }
    })
    expect(result).toEqual(input)
  })

  it("deve enviar apenas o title quando so title for passado", async () => {
    prisma.prompt.update.mockResolvedValue(input)
    await repository.update(input.id, { title: input.title })

    const call = prisma.prompt.update.mock.calls[0][0]
    expect(call.data).toEqual({ title: input.title })
    expect("content" in call.data).toBe(false)
  })

  it("deve enviar apenas o content quando so content for passado", async () => {
    prisma.prompt.update.mockResolvedValue(input)
    await repository.update(input.id, { content: "new content" })

    const call = prisma.prompt.update.mock.calls[0][0]
    expect(call.data).toEqual({ content: "new content" })
    expect("title" in call.data).toBe(false)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Metodo retorna entidade | Teste mockResolvedValue + toEqual no result |
| Metodo aceita campos opcionais | Teste cada campo independentemente + verifique ausencia dos outros |
| Metodo pode retornar null | Teste cenario positivo E cenario null |
| Mock precisa de tipagem | Use `jest.MockedFunction<>` com a assinatura do Prisma |
| Quer validar args sem matcher | Acesse `mock.calls[0][0]` e faca assertions granulares |
| Coverage aponta linhas faltando | Verifique quais metodos do repository ainda nao tem teste |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `expect(result).toBeDefined()` (vago) | `expect(result).toEqual(expectedObject)` |
| Testar update sem verificar chamada ao Prisma | `expect(prisma.prompt.update).toHaveBeenCalledWith(...)` |
| Um unico teste para update com todos os campos | Testes separados: todos campos, so title, so content |
| Esquecer o cenario null no findById | Teste explicito com `mockResolvedValue(null)` + `toBeNull()` |
| Mock sem tipagem | `jest.MockedFunction<(args: Type) => Promise<Return>>` |
| Testar so o happy path | Sempre incluir cenario de ausencia/null/vazio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionar-mais-testes-ao-prisma-prompt-repository/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionar-mais-testes-ao-prisma-prompt-repository/references/code-examples.md)
