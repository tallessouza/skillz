---
name: rs-testes-arquitetura-fe-testes-unitarios-action-delecao
description: "Enforces unit testing patterns for server actions in Next.js when writing delete/remove actions. Use when user asks to 'test a server action', 'write unit tests for delete', 'test action de deleção', 'criar testes unitários de action', or 'testar cenários de erro em actions'. Applies mock setup with use-case execute, explicit mock returns, and four-scenario coverage (empty id, not found, generic error, success). Make sure to use this skill whenever creating or reviewing unit tests for Next.js server actions. Not for E2E tests, component tests, or API route tests."
---

# Testes Unitários de Server Actions (Deleção)

> Testes unitários de actions devem cobrir todos os cenários possíveis porque são rápidos e baratos de executar.

## Rules

1. **Sempre mocke o use case execute** — `vi.fn()` no `useCaseDelete.execute`, porque o teste unitário isola a action do banco de dados
2. **Cubra no mínimo 4 cenários** — ID vazio, not found, erro genérico e sucesso, porque são os caminhos possíveis dentro de qualquer action CRUD
3. **Seja explícito nos mocks mesmo quando desnecessário** — use `mockResolvedValue(undefined)` no caso de sucesso em vez de confiar no retorno implícito, porque explicitude previne falsos positivos silenciosos
4. **Valide `success` e `message` em todo assertion** — nunca verifique apenas um dos dois, porque garante que o contrato da action está completo
5. **Use `describe.only` durante desenvolvimento, remova antes do commit** — porque evita que testes fiquem isolados no CI
6. **Teste falsos positivos** — coloque um valor errado temporariamente para confirmar que o teste realmente quebra, porque previne testes que sempre passam

## How to write

### Mock setup para action de deleção

```typescript
const { useCaseDelete } = vi.hoisted(() => ({
  useCaseDelete: { execute: vi.fn() },
}))

vi.mock('@/use-cases/delete-prompt', () => ({
  DeletePromptUseCase: vi.fn().mockReturnValue(useCaseDelete),
}))
```

### Cenário: ID vazio

```typescript
it('deve retornar erro quando o id for vazio', async () => {
  const promptId = ''
  const result = await deletePromptAction(promptId)

  expect(result.success).toBe(false)
  expect(result.message).toBe('ID do prompt é obrigatório')
})
```

### Cenário: Not found (mock rejects)

```typescript
it('deve retornar erro quando o prompt não existir', async () => {
  useCaseDelete.execute.mockRejectedValue(
    new Error('Prompt not found')
  )
  const result = await deletePromptAction('some-id')

  expect(result.success).toBe(false)
  expect(result.message).toBe('Prompt não encontrado')
})
```

### Cenário: Sucesso (mock explícito)

```typescript
it('deve remover com sucesso', async () => {
  useCaseDelete.execute.mockResolvedValue(undefined)
  const result = await deletePromptAction('valid-id')

  expect(result.success).toBe(true)
  expect(result.message).toBe('Prompt removido com sucesso')
})
```

## Example

**Before (teste incompleto — confia no mock implícito):**
```typescript
it('deve deletar', async () => {
  // Nenhum mock configurado — retorna undefined implicitamente
  const result = await deletePromptAction('id')
  expect(result.success).toBe(true)
})
```

**After (teste explícito e completo):**
```typescript
it('deve remover com sucesso', async () => {
  useCaseDelete.execute.mockResolvedValue(undefined)
  const result = await deletePromptAction('valid-id')

  expect(result.success).toBe(true)
  expect(result.message).toBe('Prompt removido com sucesso')
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Action tem validação de input | Teste com input vazio E com input inválido |
| Use case pode lançar erro específico | Mock com `mockRejectedValue(new Error('mensagem'))` |
| Use case pode lançar erro desconhecido | Mock com `mockRejectedValue(new Error('unknown'))` |
| Action retorna sucesso sem dados | `mockResolvedValue(undefined)` explícito |
| Quer confirmar que teste não é falso positivo | Mude o valor esperado, verifique que quebra, reverta |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Teste sem `mockRejectedValue` para erros | `execute.mockRejectedValue(new Error(...))` |
| Só verificar `success` sem `message` | Verificar ambos `success` e `message` |
| Confiar em mock implícito (undefined) | `mockResolvedValue(undefined)` explícito |
| Deixar `describe.only` no commit | Remover `.only` antes de commitar |
| Testar só o caso feliz | Cobrir validação, not found, erro genérico e sucesso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
