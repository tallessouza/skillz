---
name: rs-testes-arquitetura-fe-testando-prompt-form
description: "Applies React component form testing patterns using Jest mocks, user-event interactions, and mock resets. Use when user asks to 'test a form', 'mock useRouter', 'test server actions', 'mock Next.js navigation', or 'test form submission'. Covers mocking external dependencies, simulating user input with userEvent, validating toast notifications, and resetting mocks between tests. Make sure to use this skill whenever writing tests for React forms with mocked dependencies. Not for unit testing pure functions, API route testing, or E2E tests."
---

# Testando Formularios React com Mocks

> Ao testar componentes de formulario, mocke todas as dependencias externas, simule interacoes reais do usuario e resete mocks entre testes para evitar interferencia.

## Rules

1. **Mocke dependencias externas no topo do arquivo** — `jest.mock('next/navigation')`, `jest.mock('sonner')`, porque o ambiente de teste nao tem acesso a features do framework
2. **Use `userEvent` em vez de `fireEvent`** — `userEvent.type()` e `userEvent.click()` simulam interacao real do usuario, porque `fireEvent` dispara eventos sinteticos que nao refletem o comportamento do browser
3. **Resete todos os mocks no `beforeEach`** — `mockReset()` em cada mock compartilhado, porque mocks retêm estado entre testes e causam falhas intermitentes
4. **Valide chamadas com `toHaveBeenCalledWith`** — verifique os parametros exatos passados para actions e callbacks, porque garantir que a funcao foi chamada nao e suficiente sem validar os argumentos
5. **Use `mockResolvedValueOnce` para controlar cenarios** — configure o retorno do mock antes de cada cenario (sucesso/erro), porque isso permite testar branches diferentes do mesmo componente
6. **Crie `makeSUT` para encapsular renderizacao** — System Under Test centralizado, porque evita duplicacao e facilita manutencao

## How to write

### Mock de dependencias externas

```typescript
const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}))

const createActionMock = jest.fn()
jest.mock('@/app/actions/create-prompt', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
```

### Setup com userEvent e makeSUT

```typescript
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/lib/test-utils'

function makeSUT() {
  return render(<PromptForm />)
}

const user = userEvent.setup()
```

### Reset de mocks no beforeEach

```typescript
beforeEach(() => {
  createActionMock.mockReset()
  refreshMock.mockReset()
  ;(toast.success as jest.Mock).mockReset()
  ;(toast.error as jest.Mock).mockReset()
})
```

## Example

**Before (teste fragil sem reset de mocks):**
```typescript
it('deve criar prompt com sucesso', async () => {
  render(<PromptForm />)
  // mocks compartilhados retêm estado do teste anterior — QUEBRA
  fireEvent.change(screen.getByPlaceholderText('Titulo'), { target: { value: 'title' } })
  fireEvent.click(screen.getByRole('button'))
  expect(createAction).toHaveBeenCalled() // sem validar parametros
})
```

**After (com this skill applied):**
```typescript
it('deve criar um novo prompt com sucesso', async () => {
  const successMessage = 'Prompt criado com sucesso'
  createActionMock.mockResolvedValueOnce({ success: true, message: successMessage })

  makeSUT()

  const titleInput = screen.getByPlaceholderText('Digite o titulo do prompt...')
  const contentInput = screen.getByPlaceholderText('Digite o conteudo do prompt...')
  const submitButton = screen.getByRole('button', { name: /salvar/i })

  await user.type(titleInput, 'title')
  await user.type(contentInput, 'content')
  await user.click(submitButton)

  expect(createActionMock).toHaveBeenCalledWith('title', 'content')
  expect(toast.success).toHaveBeenCalledWith(successMessage)
  expect(refreshMock).toHaveBeenCalledTimes(1)
})

it('deve exibir erro quando a action falhar', async () => {
  const errorMessage = 'Erro ao criar prompt'
  createActionMock.mockResolvedValueOnce({ success: false, message: errorMessage })

  makeSUT()

  await user.type(screen.getByPlaceholderText('Digite o titulo do prompt...'), 'title')
  await user.type(screen.getByPlaceholderText('Digite o conteudo do prompt...'), 'content')
  await user.click(screen.getByRole('button', { name: /salvar/i }))

  expect(toast.error).toHaveBeenCalledWith(errorMessage)
  expect(refreshMock).not.toHaveBeenCalled()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa hook do Next.js (useRouter, usePathname) | Mock no topo com `jest.mock('next/navigation')` |
| Componente chama server action | Mock do modulo da action, retornando `jest.fn()` com wrapper |
| Precisa testar cenario de sucesso E erro | Use `mockResolvedValueOnce` com valores diferentes em cada `it` |
| Mocks compartilhados entre testes | `beforeEach` com `mockReset()` em todos |
| Quer inspecionar o HTML renderizado | Use `debug()` retornado pelo `render()` — apenas para debug, nao commitar |
| Toast ou notificacao precisa ser validada | Mock da lib (sonner, react-toastify) e valide com `toHaveBeenCalledWith` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fireEvent.change(input, { target: { value } })` | `await user.type(input, value)` |
| `expect(mock).toHaveBeenCalled()` sem parametros | `expect(mock).toHaveBeenCalledWith(expectedArgs)` |
| Mocks sem reset entre testes | `beforeEach(() => { mock.mockReset() })` |
| `jest.fn()` inline dentro de cada teste | Mock compartilhado no escopo do `describe` + reset |
| `(toast as any).success` | `(toast.success as jest.Mock).mockReset()` |
| Skip de teste pra "resolver" falha intermitente | Investigar estado compartilhado entre testes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-o-prompt-form/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-o-prompt-form/references/code-examples.md)
