---
name: rs-testes-arquitetura-fe-melhorando-testes-prompt-form
description: "Enforces integration test patterns for React forms with update/create flows using Vitest and Testing Library. Use when user asks to 'test a form', 'write integration tests', 'test update flow', 'mock actions', or 'improve test coverage'. Applies rules: clear inputs before typing on edit forms, mock resolved values with message, test only uncovered branches, avoid duplicating unit-tested scenarios in integration tests. Make sure to use this skill whenever writing form tests with edit/create modes. Not for unit tests of isolated functions, E2E tests, or API testing."
---

# Melhorando Testes de Formularios com Update/Create

> Testes de integracao de formularios cobrem branches nao testadas (update vs create) sem duplicar cenarios ja validados em testes unitarios.

## Rules

1. **Limpe inputs antes de digitar em formularios de edicao** — `await user.clear(input)` antes de `user.type(input, newValue)`, porque inputs pre-preenchidos concatenam texto ao inves de substituir
2. **Crie mocks separados para cada action** — `createActionMock` e `updateActionMock` com retornos independentes, porque cada branch precisa de verificacao isolada
3. **Retorne message no mock quando o componente usa result.message** — `mockResolvedValueOnce({ success: true, message: '...' })`, porque omitir campos causa falhas silenciosas
4. **Nao duplique cenarios de erro ja testados em niveis inferiores** — se o cenario de erro do create ja foi testado unitariamente, nao repita no update integration test, porque sobe custo sem agregar cobertura
5. **Use `toHaveBeenCalledTimes(1)` para garantir chamada unica** — especialmente em `router.refresh()` e actions, porque chamadas duplicadas indicam bug de re-render
6. **Passe props ao makeSUT para cobrir branches condicionais** — se `isEdit` depende de `prompt.id`, passe o prompt como prop, porque sem ele a branch de update nunca executa

## How to write

### Mock de action com message

```typescript
const updateActionMock = vi.fn().mockResolvedValueOnce({
  success: true,
  message: 'Prompt atualizado com sucesso',
})
```

### Limpar e digitar em inputs pre-preenchidos

```typescript
const titleInput = screen.getByPlaceholderText('Título do prompt')
const contentInput = screen.getByPlaceholderText('Digite o conteúdo do prompt')

await user.clear(titleInput)
await user.type(titleInput, 'new title')

await user.clear(contentInput)
await user.type(contentInput, 'new content')
```

### Verificar action chamada com dados corretos

```typescript
expect(updateActionMock).toHaveBeenCalledWith({
  id: prompt.id,
  title: 'new title',
  content: 'new content',
})
```

## Example

**Before (mock incompleto, sem clear):**
```typescript
it('should update a prompt', async () => {
  const updateMock = vi.fn().mockResolvedValueOnce({ success: true })
  makeSUT({ prompt })

  const titleInput = screen.getByPlaceholderText('Título do prompt')
  await user.type(titleInput, 'new title') // concatena com valor existente!

  await user.click(screen.getByRole('button', { name: 'Salvar' }))
  expect(toastSuccess).toHaveBeenCalledWith('Prompt atualizado com sucesso') // FALHA: message undefined
})
```

**After (com clear e mock completo):**
```typescript
it('should update an existing prompt successfully', async () => {
  const updateActionMock = vi.fn().mockResolvedValueOnce({
    success: true,
    message: 'Prompt atualizado com sucesso',
  })
  makeSUT({ prompt })

  const titleInput = screen.getByPlaceholderText('Título do prompt')
  const contentInput = screen.getByPlaceholderText('Digite o conteúdo do prompt')

  await user.clear(titleInput)
  await user.type(titleInput, 'new title')
  await user.clear(contentInput)
  await user.type(contentInput, 'new content')

  await user.click(screen.getByRole('button', { name: 'Salvar' }))

  expect(updateActionMock).toHaveBeenCalledWith({
    id: prompt.id,
    title: 'new title',
    content: 'new content',
  })
  expect(toastSuccess).toHaveBeenCalledWith('Prompt atualizado com sucesso')
  expect(refreshMock).toHaveBeenCalledTimes(1)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario tem modo edit e create | Crie testes separados, com mocks separados para cada action |
| Input ja tem valor default (edit mode) | `user.clear()` antes de `user.type()` |
| Coverage mostra branch nao coberta | Escreva teste que force entrada naquela branch especifica |
| Cenario de erro ja testado no unitario | Nao repita no teste de integracao — suba na piramide sem duplicar |
| Mock retorna objeto usado pelo componente | Inclua TODOS os campos que o componente acessa (success, message, etc) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `user.type(filledInput, 'new')` sem clear | `user.clear(input)` + `user.type(input, 'new')` |
| `mockResolvedValue({ success: true })` quando componente usa `result.message` | `mockResolvedValue({ success: true, message: '...' })` |
| Teste de erro duplicado em unit + integration + e2e | Teste erro no unitario, sucesso no integration |
| Um unico mock para create e update | Mocks separados: `createActionMock` e `updateActionMock` |
| `toHaveBeenCalled()` para funcoes que devem rodar 1x | `toHaveBeenCalledTimes(1)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-melhorando-os-testes-do-prompt-form/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-melhorando-os-testes-do-prompt-form/references/code-examples.md)
