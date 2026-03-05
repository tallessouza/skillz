---
name: rs-testes-frontend-e2e-criacao-prompt
description: "Applies Playwright E2E test patterns when writing end-to-end tests for form submission flows. Use when user asks to 'write an E2E test', 'test form submission', 'create Playwright test', 'test with Playwright', or 'add end-to-end test for creation flow'. Enforces unique test data generation, toast verification, proper await patterns, and timeout configuration. Make sure to use this skill whenever creating Playwright tests that involve filling forms and verifying UI feedback. Not for unit tests, integration tests, or component tests."
---

# Testes E2E com Playwright — Fluxo de Criacao

> Testes E2E simulam o usuario real: navegam, preenchem, clicam e verificam feedback visual.

## Rules

1. **Gere dados unicos por execucao** — use `Date.now()` no titulo, porque testes E2E rodam contra banco real e dados duplicados causam falhas intermitentes
2. **Importe `test` e `expect` do `@playwright/test`** — sem o import correto, `expect` fica undefined e `await` nao e exigido pelo linter, causando erros silenciosos
3. **Use `page.fill` com seletor `name` para inputs** — `page.fill('input[name="title"]', value)` e determinístico e resiliente a mudancas de layout
4. **Verifique feedback visual com `waitForSelector`** — toasts sao o feedback de sucesso; use `state: 'visible'` e `timeout` explicito (10-15s)
5. **Navegue direto para a rota** — `page.goto('/new')` e mais rapido e menos fragil que navegar pela home e clicar botoes
6. **Espere o campo estar visivel antes de preencher** — `expect(getByPlaceholder(...)).toBeVisible()` garante que a pagina carregou

## How to write

### Teste de criacao com formulario

```typescript
import { test, expect } from '@playwright/test'

test('criacao de recurso via UI - caso de sucesso', async ({ page }) => {
  const uniqueTitle = `e2e-prompt-${Date.now()}`
  const content = 'Conteudo gerado via end-to-end'

  await page.goto('/new')

  // Aguardar pagina carregar
  await expect(page.getByPlaceholder('título do prompt')).toBeVisible()

  // Preencher formulario
  await page.fill('input[name="title"]', uniqueTitle)
  await page.fill('textarea[name="content"]', content)

  // Submeter
  await page.getByRole('button', { name: 'salvar' }).click()

  // Verificar toast de sucesso
  await page.waitForSelector('text=prompt criado com sucesso', {
    state: 'visible',
    timeout: 15_000,
  })
})
```

## Example

**Before (teste fragil e incorreto):**
```typescript
import { test } from '@playwright/test'

test('create prompt', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Novo Prompt')
  await page.fill('input', 'meu prompt')
  await page.fill('textarea', 'conteudo')
  await page.click('button')
  // sem verificacao de resultado
})
```

**After (com esta skill aplicada):**
```typescript
import { test, expect } from '@playwright/test'

test('criacao de prompt via UI - caso de sucesso', async ({ page }) => {
  const uniqueTitle = `e2e-prompt-${Date.now()}`
  const content = 'Conteudo gerado via end-to-end'

  await page.goto('/new')
  await expect(page.getByPlaceholder('título do prompt')).toBeVisible()

  await page.fill('input[name="title"]', uniqueTitle)
  await page.fill('textarea[name="content"]', content)
  await page.getByRole('button', { name: 'salvar' }).click()

  await page.waitForSelector('text=prompt criado com sucesso', {
    state: 'visible',
    timeout: 15_000,
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario com campo unico (ex: titulo) | Gere valor com `Date.now()` ou `crypto.randomUUID()` |
| Teste precisa de dado pre-existente | Crie um setup test ou use `test.beforeEach` para inserir via API |
| Toast nao aparece a tempo | Aumente timeout, nunca remova a verificacao |
| Teste falha intermitentemente | Verifique se o servidor e o banco estao rodando — E2E e sensivel ao ambiente |
| Navegacao ate o formulario e complexa | Use `page.goto('/rota-direta')` em vez de clicar pela UI |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `test('test', ({ page }) => {` (sem async) | `test('descricao clara', async ({ page }) => {` |
| `page.fill('input', value)` (seletor generico) | `page.fill('input[name="title"]', value)` |
| `page.click('button')` (sem identificador) | `page.getByRole('button', { name: 'salvar' }).click()` |
| Titulo fixo `'Meu Prompt'` em todo teste | `\`e2e-prompt-${Date.now()}\`` |
| Sem verificacao apos submit | `waitForSelector('text=mensagem de sucesso')` |
| `import { test } from '@playwright/test'` (sem expect) | `import { test, expect } from '@playwright/test'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-teste-e-2-e-para-criacao-de-prompt/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-teste-e-2-e-para-criacao-de-prompt/references/code-examples.md)
