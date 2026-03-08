---
name: rs-testes-e-testando-componente-logo
description: "Enforces correct visibility assertions in React component tests using Testing Library. Use when user asks to 'test a component', 'write unit tests', 'check if element is visible', or 'test a link'. Applies toBeVisible vs toBeInTheDocument distinction, getByRole queries, and href attribute checks. Make sure to use this skill whenever writing React/Next.js component tests with Testing Library. Not for E2E tests, API tests, or backend testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, playwright, e2e, testing-library]
---

# Testando Componentes Simples com Testing Library

> Ao testar componentes de UI, prefira `toBeVisible` sobre `toBeInTheDocument` para garantir que o usuario de fato ve o elemento.

## Rules

1. **Use `toBeVisible` por padrao** — garante que o elemento esta visivel para o usuario, nao apenas presente no DOM, porque `toBeInTheDocument` captura elementos com `display: none`
2. **Use `getByRole` para links** — `screen.getByRole('link', { name: 'Texto' })` e mais semantico e acessivel que `getByText` ou `getByTestId`
3. **Verifique atributos de navegacao** — sempre cheque `toHaveAttribute('href', '/expected-path')` em links, porque renderizar sem href correto e um bug silencioso
4. **Pule `makeSut` para testes unicos** — se o componente tem apenas 1 teste, renderize direto sem factory, porque abstracoes desnecessarias adicionam complexidade

## How to write

### Teste de componente com link

```typescript
import { render, screen } from '@testing-library/react'
import { Logo } from './logo'

describe('Logo', () => {
  it('deveria renderizar o link para home', () => {
    render(<Logo />)

    const link = screen.getByRole('link', { name: /prompts/i })

    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', '/')
  })
})
```

## Example

**Before (teste fragil):**
```typescript
it('renderiza logo', () => {
  render(<Logo />)
  const el = screen.getByText('Prompts')
  expect(el).toBeInTheDocument() // passa mesmo com display:none
})
```

**After (teste robusto):**
```typescript
it('deveria renderizar o link para home', () => {
  render(<Logo />)
  const link = screen.getByRole('link', { name: /prompts/i })
  expect(link).toBeVisible() // garante visibilidade real
  expect(link).toHaveAttribute('href', '/')
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente com 1 caso de teste | Renderize direto, sem `makeSut` |
| Componente com 3+ casos | Crie `makeSut` para reutilizar setup |
| Elemento deve estar visivel ao usuario | `toBeVisible()` |
| Elemento pode estar oculto (tooltip, modal) | `toBeInTheDocument()` |
| Link de navegacao | `getByRole('link')` + `toHaveAttribute('href')` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `getByText('Home')` para links | `getByRole('link', { name: /home/i })` |
| `toBeInTheDocument()` para visibilidade | `toBeVisible()` |
| Teste sem verificar `href` em links | `toHaveAttribute('href', '/path')` |
| `makeSut` para um unico teste | Renderizacao direta |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
