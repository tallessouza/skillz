---
name: rs-testes-arquitetura-testando-navegacao
description: "Enforces navigation testing patterns with Jest and React Testing Library when writing frontend tests. Use when user asks to 'test navigation', 'test router push', 'test button redirect', 'mock useRouter', or 'test Next.js routing'. Applies patterns: mock push with jest.fn(), verify toHaveBeenCalledWith for routes, organize tests in nested describes by feature. Make sure to use this skill whenever testing click-to-navigate behavior in React/Next.js apps. Not for API testing, unit logic tests, or E2E browser tests."
---

# Testando Navegacao com Push Mock

> Teste navegacao verificando que a funcao push foi chamada com a rota correta, nunca verificando a URL do browser.

## Rules

1. **Mock push com jest.fn() no escopo do describe** — crie `const pushMock = jest.fn()` e passe para o mock do useRouter, porque isola o comportamento de navegacao sem depender do router real
2. **Verifique rota com toHaveBeenCalledWith** — use `expect(pushMock).toHaveBeenCalledWith('/rota')`, porque garante que o argumento exato foi passado
3. **Organize describes por funcionalidade** — agrupe testes relacionados (colapsar, novoPrompt, editar) em describes aninhados, porque facilita leitura e manutencao
4. **Testes de click sao async** — use `async/await` com `user.click()`, porque eventos de usuario sao assincronos no Testing Library
5. **Use mock customizado para cenarios simples** — nao instale next-router-mock para verificar um push simples, porque adiciona dependencia desnecessaria
6. **Use next-router-mock para cenarios complexos** — quando precisar verificar pathname, query params, ou iniciar teste em rota especifica, porque o mock customizado nao cobre esses casos

## How to write

### Mock do useRouter com pushMock

```typescript
const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))
```

### Teste de navegacao por click

```typescript
describe('novoPrompt', () => {
  it('deveria navegar o usuario para a pagina de novo prompt', async () => {
    makeSUT()

    const newButton = screen.getByRole('button', { name: /novo prompt/i })
    await user.click(newButton)

    expect(pushMock).toHaveBeenCalledWith('/nu')
  })
})
```

## Example

**Before (sem teste de navegacao):**
```typescript
it('should navigate', () => {
  render(<Sidebar />)
  fireEvent.click(screen.getByText('Novo'))
  // nenhuma verificacao de rota
})
```

**After (com push mock verificado):**
```typescript
const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('novoPrompt', () => {
  it('deveria navegar para /nu ao clicar no botao', async () => {
    makeSUT()

    const newButton = screen.getByRole('button', { name: /novo prompt/i })
    await user.click(newButton)

    expect(pushMock).toHaveBeenCalledWith('/nu')
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Verificar destino de um botao | Mock push + toHaveBeenCalledWith('/rota') |
| Verificar query params na navegacao | Considere next-router-mock |
| Verificar se navegou sem importar destino | toHaveBeenCalled() (sem argumento) |
| Verificar numero de navegacoes | toHaveBeenCalledTimes(n) |
| Multiplos testes de navegacao no mesmo arquivo | pushMock no escopo do describe, limpe com beforeEach |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `expect(window.location.href).toBe(...)` | `expect(pushMock).toHaveBeenCalledWith(...)` |
| `fireEvent.click(button)` sem await | `await user.click(button)` |
| Testes de navegacao sem describe separado | Describe aninhado por funcionalidade |
| Mock inline dentro do it | Mock no escopo do describe |
| next-router-mock para verificar um push simples | jest.fn() customizado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
