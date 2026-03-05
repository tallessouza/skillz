---
name: rs-testes-arq-frontend-prompt-card-coverage
description: "Enforces complete test coverage patterns for React components with server actions and error scenarios. Use when user asks to 'test a component', 'cover error cases', 'improve coverage', 'test server actions', or 'write component tests'. Applies patterns: mock resolved/rejected values for actions, test error toasts, refactor for branch elimination, assert all code paths. Make sure to use this skill whenever writing or improving React component tests that involve async actions or error handling. Not for unit testing pure functions, API route tests, or E2E tests."
---

# Cobrindo Cenarios de Teste no Component Card

> Ao testar componentes com actions assincronas, cubra todos os branches: sucesso, falha controlada (success: false) e excecao inesperada (throw).

## Rules

1. **Teste falha controlada separadamente de excecao** — `mockResolvedValue({ success: false })` testa o fluxo de erro normal, `mockRejectedValue(new Error())` testa excecoes inesperadas, porque sao branches diferentes no codigo
2. **Simplifique branches antes de testar** — refatore `if/else` + `try/catch/finally` para reduzir branches, porque menos branches = menos testes necessarios para 100% de coverage
3. **Use coverage para encontrar branches nao testados** — rode `--coverage` e olhe as linhas nao cobertas antes de escrever novos testes, porque isso guia exatamente o que falta
4. **Cada teste cobre UM cenario** — nao misture assertions de sucesso e erro no mesmo teste, porque testes isolados facilitam debugging quando quebram
5. **Mock no nivel da action, nao do fetch** — mocke `deletePromptAction` e nao `fetch`, porque a action e o contrato do componente

## How to write

### Teste de erro controlado (action retorna success: false)

```typescript
it('should display error toast when action fails', async () => {
  const errorMessage = 'Erro ao remover prompt'

  deleteMock.mockResolvedValue({
    success: false,
    message: errorMessage,
  })

  // render, click delete button, confirm modal...

  expect(toast.error).toHaveBeenCalledWith(errorMessage)
})
```

### Teste de excecao inesperada (action lanca throw)

```typescript
it('should display error toast when action throws', async () => {
  const errorMessage = 'Unexpected error'

  deleteMock.mockRejectedValueOnce(new Error(errorMessage))

  // render, click delete button, confirm modal...

  expect(toast.error).toHaveBeenCalledWith(errorMessage)
})
```

### Refatoracao para eliminar branches

```typescript
// ANTES: 4 branches (try/catch + if/else + finally)
try {
  const result = await deletePromptAction(id)
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
} catch (error) {
  toast.error('Erro inesperado')
} finally {
  setIsDeleting(false)
}

// DEPOIS: 2 branches (so if/else, sem try/catch)
const result = await deletePromptAction(id)
if (result.success) {
  toast.success(result.message)
} else {
  toast.error(result.message)
}
```

## Example

**Before (coverage incompleto — linhas 40-41 nao cobertas):**
```typescript
describe('PromptCard', () => {
  it('should delete prompt successfully', async () => {
    deleteMock.mockResolvedValue({ success: true, message: 'Removido' })
    // ... apenas testa sucesso
  })
})
// Coverage: 85% — branches de erro nao cobertos
```

**After (100% coverage):**
```typescript
describe('PromptCard', () => {
  it('should delete prompt successfully', async () => {
    deleteMock.mockResolvedValue({ success: true, message: 'Removido' })
    // ... testa sucesso
    expect(toast.success).toHaveBeenCalledWith('Removido')
  })

  it('should display error when action fails', async () => {
    deleteMock.mockResolvedValue({ success: false, message: 'Erro' })
    // ... testa falha controlada
    expect(toast.error).toHaveBeenCalledWith('Erro')
  })

  it('should display error when action throws', async () => {
    deleteMock.mockRejectedValueOnce(new Error('Erro'))
    // ... testa excecao
    expect(toast.error).toHaveBeenCalledWith('Erro')
  })
})
// Coverage: 100%
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Action retorna objeto com `success` boolean | Teste ambos: `true` e `false` |
| Action tem try/catch | Teste com `mockRejectedValue` para cobrir o catch |
| Coverage mostra branch nao coberto | Crie teste especifico para aquele branch |
| Muitos branches no handler | Refatore para simplificar ANTES de testar |
| Action nunca lanca throw (trata internamente) | Considere remover try/catch do componente e simplificar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Ignorar linhas nao cobertas no coverage | Analise cada linha e crie teste especifico |
| `mockResolvedValue` para testar excecoes | `mockRejectedValueOnce(new Error(...))` |
| Testar sucesso e erro no mesmo `it` | Um `it` por cenario |
| Manter try/catch/finally quando action ja trata erros | Remova e simplifique para reduzir branches |
| Rodar testes sem `--coverage` ao melhorar cobertura | Sempre rode coverage para ver o que falta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-cobrindo-cenarios-no-prompt-card/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-cobrindo-cenarios-no-prompt-card/references/code-examples.md)
