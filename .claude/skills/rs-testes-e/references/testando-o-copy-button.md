---
name: rs-testes-e-testando-o-copy-button
description: "Enforces testing patterns for clipboard copy button components in React/Next.js. Use when user asks to 'test a copy button', 'mock clipboard API', 'test async state changes', 'advance timers in tests', or 'test toast notifications'. Applies patterns: clipboard writeText mocking via defineProperty, jest fake timers with userEvent advanceTimersByTime, findBy over waitFor for simple async assertions, spyOn for clearTimeout verification. Make sure to use this skill whenever writing tests for components that interact with navigator.clipboard or have timer-based state transitions. Not for testing form inputs, API calls, or non-clipboard interactions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, jest, mock, forms]
---

# Testando Copy Button Components

> Ao testar componentes de copia, mocke o clipboard via defineProperty, use fake timers para transicoes de estado temporais, e prefira findBy para assertions async simples.

## Rules

1. **Mocke clipboard via Object.defineProperty** — `Object.defineProperty(global.navigator, 'clipboard', { value: { writeText: mockFn }, configurable: true })`, porque navigator.clipboard nao e diretamente atribuivel
2. **Use jest.useFakeTimers com userEvent.setup({ advanceTimers: jest.advanceTimersByTime })** — porque userEvent precisa saber como avancar timers fake, senao as interacoes travam
3. **Prefira findBy sobre waitFor para presenca simples** — `await screen.findByRole('button', { name: 'copiado' })` em vez de `waitFor(() => expect(...).toBeInTheDocument())`, porque findBy retorna promise e e mais direto
4. **Use waitFor apenas para assertions complexas** — quando precisa checar algo alem de presenca no DOM, como propriedades ou estados compostos
5. **Resete mocks no beforeEach** — `writeTextMock.mockReset()` antes de cada teste, porque estado de mock vazado entre testes causa falsos positivos
6. **Teste o ciclo completo de estado** — copiar → copiado → (avanca tempo) → copiar, porque cobertura parcial esconde bugs de timeout

## How to write

### Setup do clipboard mock

```typescript
const writeTextMock = jest.fn()

beforeEach(() => {
  writeTextMock.mockReset()
  Object.defineProperty(global.navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    configurable: true,
  })
  jest.useFakeTimers()
})
```

### UserEvent com fake timers

```typescript
const user = userEvent.setup({
  advanceTimers: jest.advanceTimersByTime,
})
```

### Mock de toast para erro

```typescript
jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}))
```

### SpyOn para clearTimeout

```typescript
const clearSpy = jest.spyOn(window, 'clearTimeout')
// ... acoes ...
expect(clearSpy).toHaveBeenCalled()
clearSpy.mockRestore()
```

## Example

**Before (teste incompleto):**
```typescript
it('should copy text', async () => {
  render(<CopyButton content="texto" />)
  const button = screen.getByRole('button', { name: 'copiar' })
  await user.click(button)
  // Nao verifica transicao de label
  // Nao avanca timers
  // Nao testa retorno ao estado inicial
})
```

**After (ciclo completo):**
```typescript
it('deve copiar, alterar label para copiado e voltar para copiar', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  writeTextMock.mockResolvedValueOnce(undefined)

  render(<CopyButton content="texto" />)
  const button = screen.getByRole('button', { name: 'copiar' })

  await user.click(button)

  const copiedButton = await screen.findByRole('button', { name: 'copiado' })
  expect(copiedButton).toBeVisible()

  act(() => { jest.advanceTimersByTime(2000) })

  const resetButton = await screen.findByRole('button', { name: 'copiar' })
  expect(resetButton).toBeVisible()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa navigator.clipboard | Mock via defineProperty no beforeEach |
| Estado muda apos delay (setTimeout) | useFakeTimers + advanceTimersByTime dentro de act() |
| Verifica se elemento apareceu async | findBy (nao waitFor) |
| Verifica propriedade alem de presenca | waitFor com expect dentro |
| Testa erro de clipboard | jest.spyOn + mockRejectedValueOnce |
| Testa limpeza de timer anterior | spyOn em window.clearTimeout |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `navigator.clipboard.writeText = jest.fn()` | `Object.defineProperty(global.navigator, 'clipboard', ...)` |
| `waitFor(() => expect(el).toBeInTheDocument())` para presenca simples | `await screen.findByRole(...)` |
| `userEvent.setup()` com fake timers sem config | `userEvent.setup({ advanceTimers: jest.advanceTimersByTime })` |
| `jest.advanceTimersByTime()` fora de act() | `act(() => { jest.advanceTimersByTime(2000) })` |
| Testar apenas o clique sem verificar retorno ao estado inicial | Testar ciclo completo: default → changed → default |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
