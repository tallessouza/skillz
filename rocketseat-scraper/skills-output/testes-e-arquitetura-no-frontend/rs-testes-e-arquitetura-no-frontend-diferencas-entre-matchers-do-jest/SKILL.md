---
name: rs-testes-arq-frontend-matchers-jest
description: "Enforces correct Jest matcher selection between toBeVisible and toBeInTheDocument when writing frontend tests. Use when user asks to 'write a test', 'check element visibility', 'fix failing test', 'test component rendering', or 'mock useRouter'. Applies rules: prefer toBeVisible over toBeInTheDocument, centralize repeated mocks in jest.setup, always reset mocks in beforeEach, verify side effects like router.refresh. Make sure to use this skill whenever writing or reviewing React/Next.js component tests. Not for backend tests, API tests, or unit tests without DOM."
---

# Matchers do Jest: toBeVisible vs toBeInTheDocument

> Ao escrever testes de componentes, valide visibilidade real com `toBeVisible`, nao apenas presenca no DOM.

## Rules

1. **Prefira `toBeVisible` sobre `toBeInTheDocument`** — porque `toBeInTheDocument` so verifica se o elemento existe na arvore DOM, mesmo que esteja oculto com `display: none`, `opacity: 0` ou `visibility: hidden`. `toBeVisible` garante que o usuario realmente ve o elemento
2. **Use `toBeInTheDocument` apenas para existencia** — quando voce quer confirmar que um elemento foi removido do DOM ou que ele existe independente de visibilidade (casos raros)
3. **Centralize mocks repetidos no jest.setup** — se `jest.mock('next/navigation')` aparece em 3+ arquivos de teste, mova para `jest.setup.ts` para evitar duplicacao e facilitar manutencao
4. **Sempre use `mockReset` em `beforeEach`** — garanta que cada teste comeca com estado limpo, mesmo que os testes ja passem sem isso, porque torna bugs mais faceis de debugar
5. **Verifique side effects apos acoes** — apos uma delecao bem-sucedida, verifique que `router.refresh()` foi chamado; apos falha, verifique que NAO foi chamado
6. **Nao confie apenas em coverage 100%** — coverage nao garante que voce esta testando o comportamento correto; adicione assertions para funcionalidades novas mesmo que coverage ja mostre 100%

## How to write

### Verificacao de visibilidade

```typescript
// CORRETO: garante que o elemento esta visivel para o usuario
expect(screen.getByRole('button', { name: /novo prompt/i })).toBeVisible()

// INCORRETO: passa mesmo com display:none ou opacity:0
expect(screen.getByRole('button', { name: /novo prompt/i })).toBeInTheDocument()
```

### Mock centralizado no jest.setup.ts

```typescript
// jest.setup.ts
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}))
```

### Reset de mocks em beforeEach

```typescript
const deleteMock = jest.fn()
const refreshMock = jest.fn()

beforeEach(() => {
  deleteMock.mockReset()
  refreshMock.mockReset()
  (toast.success as jest.Mock).mockReset()
  (toast.error as jest.Mock).mockReset()
})
```

### Verificacao de side effects

```typescript
// Apos acao bem-sucedida: refresh DEVE ser chamado
it('deveria chamar refresh apos deletar com sucesso', async () => {
  // ... trigger delete action
  expect(refreshMock).toHaveBeenCalledTimes(1)
})

// Apos falha: refresh NAO deve ser chamado
it('deveria nao chamar refresh quando action falhar', async () => {
  // ... trigger failing delete action
  expect(refreshMock).not.toHaveBeenCalled()
})
```

## Example

**Before (testes frageis):**
```typescript
// Cada arquivo repete o mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

it('deveria exibir botao', () => {
  render(<Sidebar />)
  // Passa mesmo com elemento invisivel!
  expect(screen.getByText('Novo Prompt')).toBeInTheDocument()
})

it('deveria deletar prompt', async () => {
  // Sem reset, estado vaza entre testes
  // Sem verificar refresh apos delete
  await userEvent.click(deleteButton)
  expect(toast.success).toHaveBeenCalled()
})
```

**After (com esta skill aplicada):**
```typescript
// Mock centralizado em jest.setup.ts
// Cada teste sobrescreve apenas o que precisa

const refreshMock = jest.fn()

beforeEach(() => {
  refreshMock.mockReset()
  ;(toast.success as jest.Mock).mockReset()
})

it('deveria exibir botao', () => {
  render(<Sidebar />)
  expect(screen.getByText('Novo Prompt')).toBeVisible()
})

it('deveria deletar e atualizar', async () => {
  await userEvent.click(deleteButton)
  expect(toast.success).toHaveBeenCalled()
  expect(refreshMock).toHaveBeenCalledTimes(1)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento pode ser oculto por CSS/animacao | `toBeVisible` |
| Verificar que elemento foi removido do DOM | `queryByText` retorna `null` |
| Mesmo mock em 3+ arquivos de teste | Centralizar em `jest.setup.ts` |
| Acao com side effect (refresh, redirect) | Verificar chamada E nao-chamada em caso de erro |
| Coverage ja esta 100% mas feature nova foi adicionada | Adicionar assertions mesmo assim |
| Teste usa `jest.fn()` sem reset | Adicionar `beforeEach` com `mockReset` |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `toBeInTheDocument()` para checar visibilidade | `toBeVisible()` |
| Mock duplicado em cada arquivo de teste | Mock centralizado em `jest.setup.ts` |
| Testes sem `beforeEach` + `mockReset` | `beforeEach(() => { mock.mockReset() })` |
| Deletar sem verificar `refresh` | `expect(refreshMock).toHaveBeenCalledTimes(1)` |
| Confiar em coverage como unica metrica | Verificar comportamento real alem de coverage |
| Mockar componente filho para evitar setup | Configurar mock do hook que o filho usa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
