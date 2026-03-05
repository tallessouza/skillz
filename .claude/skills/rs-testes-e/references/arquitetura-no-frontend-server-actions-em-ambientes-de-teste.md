---
name: rs-testes-arq-frontend-server-actions-teste
description: "Applies correct patterns for testing React 19 Server Actions and Suspense boundaries in Next.js test suites. Use when user asks to 'test a server action', 'fix act warning', 'test suspense component', 'mock requestSubmit', or encounters 'a]suspended resource finished loading inside a test' errors. Make sure to use this skill whenever writing tests for components that use Server Actions or Suspense. Not for testing pure client components without async behavior or API route testing."
---

# Server Actions em Ambientes de Teste

> Componentes com Server Actions e Suspense precisam de tratamento assincrono nos testes para que o React processe todas as atualizacoes antes das assertions.

## Rules

1. **Testes com Server Actions devem ser assincronos** — marque o callback do `it`/`test` como `async`, porque Server Actions disparam ciclos assincronos que o React precisa finalizar antes das assertions
2. **Use `waitFor` para assertions que dependem de Server Actions** — `await waitFor(() => expect(...))` garante que o React processou todas as atualizacoes pendentes, porque sem isso o teste pode passar mas emitir console errors
3. **100% coverage nao significa 100% dos cenarios testados** — pular um teste pode manter coverage em 100% mas deixar bugs escaparem, porque coverage mede linhas executadas, nao comportamentos validados
4. **Console errors em testes que passam sao sinais de alerta** — um teste verde com `console.error` sobre Act indica que assertions rodam antes do React finalizar atualizacoes, porque o ciclo assincrono nao foi tratado

## How to write

### Abordagem preferida: async + waitFor

```typescript
it('deve renderizar com search params', async () => {
  render(<SidebarContent prompts={mockPrompts} />)

  await waitFor(() => {
    expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
  })
})
```

### Abordagem alternativa: spy no requestSubmit

```typescript
it('deve renderizar com search params', () => {
  const submitMock = jest.spyOn(
    HTMLFormElement.prototype,
    'requestSubmit'
  ).mockImplementation(() => undefined)

  render(<SidebarContent prompts={mockPrompts} />)

  expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()

  submitMock.mockRestore()
})
```

## Example

**Before (console error sobre Act, mesmo com teste verde):**
```typescript
it('deve iniciar o campo de busca com search params', () => {
  render(<SidebarContent prompts={mockPrompts} />)
  expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
})
// Console error: "A suspended resource finished loading inside a test,
// but the event was not wrapped in act(...)"
```

**After (sem console error):**
```typescript
it('deve iniciar o campo de busca com search params', async () => {
  render(<SidebarContent prompts={mockPrompts} />)

  await waitFor(() => {
    expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
  })
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente usa `requestSubmit` ou Server Action | Teste deve ser `async` com `waitFor` |
| Console error sobre Act mas teste passa | Adicionar `waitFor` ou spy no `requestSubmit` |
| Componente envolto em Suspense | Tratar ciclo assincrono no teste |
| Coverage 100% mas console errors | Investigar — ha comportamento nao tratado |
| Precisa isolar o submit do form | Usar `jest.spyOn(HTMLFormElement.prototype, 'requestSubmit')` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Teste sincrono para componente com Server Action | Teste `async` com `await waitFor(...)` |
| Ignorar console errors porque o teste passou | Corrigir o tratamento assincrono |
| Confiar que 100% coverage = tudo testado | Validar cenarios alem do que coverage mostra |
| `mockRestore` esquecido apos `spyOn` | Sempre chamar `submitMock.mockRestore()` no final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-server-actions-em-ambientes-de-teste/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-server-actions-em-ambientes-de-teste/references/code-examples.md)
