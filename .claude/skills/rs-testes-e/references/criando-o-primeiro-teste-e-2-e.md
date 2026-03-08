---
name: rs-testes-e-criando-o-primeiro-teste-e-2-e
description: "Generates Playwright E2E test files for Next.js applications. Use when user asks to 'create e2e test', 'write playwright test', 'test page loads', 'add end-to-end test', or 'verify page renders correctly'. Applies patterns: async test with Page type, page.goto for navigation, getByRole/getByText for element selection, toBeVisible assertions. Make sure to use this skill whenever generating Playwright test code for page verification. Not for unit tests, component tests, or API testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: e2e-testing
  tags: [testing, next-js, react, playwright, e2e]
---

# Primeiro Teste E2E com Playwright

> Testes E2E verificam a aplicacao real rodando — sempre levante o servidor antes de executar.

## Rules

1. **Sempre use funcoes async nos testes** — `async ({ page })` porque todas as interacoes com o browser sao assincronas e precisam de await
2. **Nomeie arquivos como `{feature}.spec.ts`** — `home.spec.ts` nao `test1.ts`, porque organiza testes por funcionalidade
3. **Selecione elementos por role ou texto visivel** — `getByRole('heading')`, `getByText('texto')` nao por CSS selectors, porque roles sao semanticos e resistentes a mudancas de layout
4. **Use `toBeVisible()` para verificar carregamento** — porque garante que o elemento esta renderizado e visivel ao usuario, nao apenas presente no DOM
5. **Servidor deve estar rodando** — testes E2E acessam a aplicacao real na porta configurada, sem servidor = teste falha com erro de conexao
6. **Type o parametro page** — `page: Page` importado de `@playwright/test`, porque garante autocomplete e seguranca de tipos

## How to write

### Teste basico de carregamento de pagina

```typescript
import { test, expect, Page } from '@playwright/test'

test('deve carregar a pagina inicial', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Selecionar Prompt' })).toBeVisible()
  await expect(page.getByText('Escolha um prompt')).toBeVisible()
})
```

### Selecao de elementos

```typescript
// Por role semantico (preferido)
page.getByRole('heading', { name: 'Titulo' })
page.getByRole('button', { name: 'Enviar' })

// Por texto visivel
page.getByText('Texto exato na tela')
```

## Example

**Before (teste generico sem tipagem):**
```typescript
test('test1', ({ page }) => {
  page.goto('http://localhost:3000')
  const el = page.locator('.title')
  expect(el).toBeTruthy()
})
```

**After (com this skill applied):**
```typescript
import { test, expect, Page } from '@playwright/test'

test('deve carregar a pagina inicial', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Selecionar Prompt' })).toBeVisible()
  await expect(page.getByText('Escolha um prompt e dê a lista ao lado para visualizar e editar')).toBeVisible()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Verificar se pagina carregou | `toBeVisible()` nos elementos-chave (heading, texto principal) |
| Selecionar elemento com texto unico | `getByText('texto exato')` |
| Selecionar elemento semantico (h1, button) | `getByRole('heading')`, `getByRole('button')` |
| Teste falha com erro de conexao | Verificar se o servidor esta rodando na porta correta |
| Modo visual para debug | `npx playwright test --ui` abre interface grafica |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `page.locator('.css-class')` | `page.getByRole('heading', { name: '...' })` |
| `page.goto('http://localhost:3000')` | `page.goto('/')` (usa baseURL do config) |
| `expect(el).toBeTruthy()` | `await expect(el).toBeVisible()` |
| `test('test1', ({ page }) => {` | `test('deve carregar a pagina inicial', async ({ page }) => {` |
| Esquecer `await` nas interacoes | Sempre `await page.goto()`, `await expect().toBeVisible()` |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
