---
name: rs-testes-frontend-testando-delecao
description: "Enforces test-first deletion feedback patterns when writing E2E or integration tests for delete operations in React/Next.js. Use when user asks to 'test deletion', 'write delete test', 'mock toast', 'test confirmation dialog', or 'test user feedback after action'. Applies rules: mock external modules (sonner/toast) with jest.fn, test multi-step user interactions (click delete then confirm), assert toast.success called with correct message, validate happy path before implementing server action. Make sure to use this skill whenever writing tests for destructive UI actions like delete, remove, or archive. Not for testing API routes, database operations, or non-UI deletion logic."
---

# Testando Sucesso na Deleção

> Valide o feedback ao usuário (toast de sucesso) antes mesmo de implementar a action real — o teste guia a implementação.

## Rules

1. **Mocke módulos de feedback (sonner/toast) no topo do arquivo** — `jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))`, porque o teste não deve depender de UI real do toast
2. **Teste interações multi-step na ordem correta** — clique no botão de deletar, depois clique no botão de confirmação, porque modais de confirmação exigem dois cliques distintos
3. **Use `getByRole('button', { name })` para capturar botões de confirmação** — porque selecionar por role + name é resiliente a mudanças de estilo
4. **Assertar `toHaveBeenCalledWith` com mensagem exata** — `expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso')`, porque garante que o usuário recebe o feedback correto
5. **Escreva o teste antes da action existir** — adicione o toast.success no componente como próximo passo guiado pelo teste, porque TDD garante que o feedback nunca é esquecido
6. **Prepare mocks de error junto com success** — `toast: { success: jest.fn(), error: jest.fn() }`, porque o teste do caminho triste vem logo depois

## How to write

### Mock do módulo de toast

```typescript
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
```

### Teste de deleção com confirmação

```typescript
it('should remove successfully and show toast', async () => {
  const { user } = makeSUT({ prompt })

  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)

  const confirmButton = screen.getByRole('button', { name: /confirmar remoção/i })
  await user.click(confirmButton)

  expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso')
})
```

## Example

**Before (sem teste de feedback):**
```typescript
it('should delete prompt', async () => {
  const { user } = makeSUT({ prompt })
  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)
  // Nenhuma verificação de feedback ao usuário
})
```

**After (com validação completa do fluxo):**
```typescript
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

it('should remove successfully and show toast', async () => {
  const { user } = makeSUT({ prompt })

  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)

  const confirmButton = screen.getByRole('button', { name: /confirmar remoção/i })
  await user.click(confirmButton)

  expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso')
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Ação destrutiva com modal de confirmação | Teste os dois cliques (trigger + confirm) |
| Toast/notificação como feedback | Mocke o módulo inteiro, assertar `toHaveBeenCalledWith` |
| Action ainda não implementada | Escreva o teste primeiro, adicione toast no componente, implemente action depois |
| Múltiplos botões com mesmo role | Diferencie pelo `name` acessível |
| Caminho feliz validado | Prepare mock de `error` para testar falha na próxima iteração |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `screen.getByText('X')` para botões | `screen.getByRole('button', { name: 'X' })` |
| `expect(toast.success).toHaveBeenCalled()` sem args | `expect(toast.success).toHaveBeenCalledWith('mensagem exata')` |
| Teste que depende da action real existir | Teste que valida feedback antes da action |
| Mock inline dentro do teste | Mock no topo do arquivo com `jest.mock()` |
| Apenas `jest.fn()` para success | `success: jest.fn(), error: jest.fn()` — prepare ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
