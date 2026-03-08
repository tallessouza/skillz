---
name: rs-testes-e-adicionar-mais-testes-ao-prisma-prompt-repository
description: "Enforces patterns for testing Prisma repository methods (update, findById) with typed mocked functions in Jest. Use when user asks to 'test repository update', 'mock prisma findById', 'test partial updates', 'unit test database layer', or 'test null/not-found cases'. Applies mock-before-action order, where/data structure assertions, partial field independence tests, and null case coverage. Make sure to use this skill whenever writing unit tests for Prisma repository methods. Not for E2E tests, integration tests with real database, or API route testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: repository-testing
  tags: [prisma, repository, jest, mock, testing, update, findById, typescript]
---

# Testes de Repository Prisma — Update e FindById

> Cada metodo do repository precisa de testes que validem a chamada correta ao Prisma E os cenarios de borda como campos parciais e registros inexistentes.

## Rules

1. **Mock antes, action depois** — configure `mockResolvedValue` antes de chamar o metodo, porque o teste precisa do retorno simulado antes da execucao
2. **Valide a estrutura where/data** — assert com `toHaveBeenCalledWith({ where: { id }, data: { ... } })`, porque garante parametros corretos
3. **Teste campos parciais independentemente** — testes separados para title-only e content-only, porque usuario pode atualizar campos de forma independente
4. **Verifique ausencia de campos nao enviados** — `expect("field" in call.data).toBe(false)` garante que campos extras nao vazam
5. **Teste o caso null/not-found** — para findById, teste retorno do registro E retorno null, porque ambos sao fluxos validos
6. **Tipe mocks com jest.MockedFunction** — defina assinatura do Prisma no tipo, porque detecta mudancas de contrato

## How to write

### Teste de update completo

```typescript
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
```

### Teste de campo parcial

```typescript
it("deve enviar apenas campos presentes", async () => {
  prisma.prompt.update.mockResolvedValue(input)
  await repository.update(input.id, { title: input.title })

  const call = prisma.prompt.update.mock.calls[0][0]
  expect(call.data).toEqual({ title: input.title })
  expect("content" in call.data).toBe(false)
})
```

### FindById — existe e nao existe

```typescript
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
  expect(result).toBeDefined() // vago, nao valida nada
})
```

**After (cobertura completa):**
```typescript
describe("update", () => {
  it("deve atualizar com todos os campos", async () => { /* ... */ })
  it("deve enviar apenas title quando so title for passado", async () => { /* ... */ })
  it("deve enviar apenas content quando so content for passado", async () => { /* ... */ })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo retorna entidade | mockResolvedValue + toEqual no result |
| Metodo aceita campos opcionais | Teste cada campo independente + verifique ausencia |
| Metodo pode retornar null | Teste cenario positivo E cenario null |
| Quer validar args granularmente | Acesse `mock.calls[0][0]` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `expect(result).toBeDefined()` | `expect(result).toEqual(expectedObject)` |
| Um unico teste para update com todos campos | Testes separados: todos, so title, so content |
| Esquecer cenario null no findById | Teste explicito com `mockResolvedValue(null)` |
| Mock sem tipagem | `jest.MockedFunction<(args: Type) => Promise<Return>>` |

## Troubleshooting

### Teste de campo parcial passa mesmo sem filtrar campos
**Symptom:** `expect("content" in call.data).toBe(false)` sempre passa
**Cause:** Repository esta espalhando todos os campos inclusive undefined
**Fix:** Verificar que o repository filtra campos undefined antes de chamar Prisma

### mockResolvedValue nao funciona
**Symptom:** Metodo retorna undefined apesar do mock configurado
**Cause:** Mock foi configurado no objeto errado (nao o que o repository usa)
**Fix:** Garantir que repository recebe a mesma referencia do mock no construtor

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
