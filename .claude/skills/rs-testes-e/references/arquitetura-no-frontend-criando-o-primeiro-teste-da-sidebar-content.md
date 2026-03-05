---
name: rs-testes-arquitetura-frontend-primeiro-teste-sidebar
description: "Enforces component testing patterns with React Testing Library and Jest mocking for Next.js components. Use when user asks to 'write a test', 'test a component', 'mock useRouter', 'test if element renders', or 'create spec file'. Applies rules: use screen queries by role, mock external dependencies like next/navigation, use semantic HTML roles for assertions, follow describe/it structure. Make sure to use this skill whenever writing frontend component tests in Next.js projects. Not for API testing, E2E testing, or backend unit tests."
---

# Primeiro Teste de Componente com Mock do Next.js

> Ao testar componentes React/Next.js, mocke dependencias externas e use queries semanticas por role para validar renderizacao.

## Rules

1. **Mocke dependencias externas antes dos testes** — `jest.mock('next/navigation', ...)` porque o ambiente Jest nao tem o runtime do Next.js e o teste vai falhar com "expected app-router to be mounted"
2. **Use `getByRole` como query principal** — `screen.getByRole('button', { name: 'novo prompt' })` porque queries por role refletem acessibilidade e sao mais resilientes que queries por texto ou test-id
3. **Conheca as roles implicitas do HTML semantico** — `<aside>` tem role `complementary`, `<button>` tem role `button`, porque isso elimina a necessidade de adicionar roles explicitas
4. **Importe render e screen do wrapper customizado** — `import { render, screen } from '@/lib/test-utils'` porque o wrapper centraliza providers e configuracoes de teste
5. **Organize testes com describe por componente** — `describe('SidebarContent', () => { ... })` porque agrupa testes relacionados e facilita identificacao no output
6. **Mocke apenas o necessario da dependencia** — retorne apenas `{ useRouter: () => ({ push: jest.fn() }) }` nao o modulo inteiro, porque mocks simples sao mais faceis de manter

## How to write

### Mock do Next.js Navigation

```typescript
// Coloque ANTES do describe, no topo do arquivo de teste
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))
```

### Teste de renderizacao por role

```typescript
import { render, screen } from '@/lib/test-utils'
import { SidebarContent } from './sidebar-content'

describe('SidebarContent', () => {
  it('deveria renderizar o botao para criar novo prompt', () => {
    render(<SidebarContent />)

    expect(
      screen.getByRole('button', { name: /novo prompt/i })
    ).toBeVisible()
  })

  it('deveria renderizar a sidebar', () => {
    render(<SidebarContent />)

    expect(screen.getByRole('complementary')).toBeVisible()
  })
})
```

## Example

**Before (teste quebrado sem mock):**
```typescript
import { render, screen } from '@/lib/test-utils'
import { SidebarContent } from './sidebar-content'

describe('SidebarContent', () => {
  it('deveria renderizar o botao', () => {
    render(<SidebarContent />)
    // ERRO: "expected app-router to be mounted"
    expect(screen.getByText('novo prompt')).toBeInTheDocument()
  })
})
```

**After (com mock e query semantica):**
```typescript
import { render, screen } from '@/lib/test-utils'
import { SidebarContent } from './sidebar-content'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('SidebarContent', () => {
  it('deveria renderizar o botao para criar novo prompt', () => {
    render(<SidebarContent />)

    expect(
      screen.getByRole('button', { name: /novo prompt/i })
    ).toBeVisible()
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa `useRouter` | Mock `next/navigation` no topo do arquivo |
| Componente usa `usePathname`, `useSearchParams` | Adicione ao mock: `usePathname: () => '/', useSearchParams: () => new URLSearchParams()` |
| Elemento e tag semantica (aside, nav, main) | Use `getByRole` com a role implicita (complementary, navigation, main) |
| Nao sabe a role implicita | Consulte MDN Web Docs na secao "Accessibility" da tag |
| Quer checar se elemento esta visivel | `toBeVisible()` e mais preciso que `toBeInTheDocument()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `screen.getByText('novo prompt')` para botoes | `screen.getByRole('button', { name: /novo prompt/i })` |
| `screen.getByTestId('sidebar')` quando tem tag semantica | `screen.getByRole('complementary')` |
| Mock do modulo inteiro com todas as funcoes | Mock apenas das funcoes usadas pelo componente |
| `import { render } from '@testing-library/react'` direto | `import { render } from '@/lib/test-utils'` via wrapper |
| Teste sem mock de dependencia externa do Next.js | `jest.mock('next/navigation', ...)` antes do describe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-o-primeiro-teste-da-sidebar-content/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-o-primeiro-teste-da-sidebar-content/references/code-examples.md)
