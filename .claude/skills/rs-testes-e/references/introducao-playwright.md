---
name: rs-testes-e-introducao-playwright
description: "Applies Playwright E2E testing setup and conventions when configuring end-to-end tests in Next.js or React projects. Use when user asks to 'setup playwright', 'add e2e tests', 'configure end-to-end testing', 'write playwright test', or 'test my app in multiple browsers'. Enforces multi-browser config, report generation, and Playwright idioms over Cypress patterns. Make sure to use this skill whenever setting up or writing E2E tests with Playwright. Not for unit tests, component tests, or integration tests with Vitest/Jest."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: e2e-testing
  tags: [testing, next-js, react, jest, playwright, e2e]
---

# Introdução ao Playwright — Setup e Convenções E2E

> Testes end-to-end validam fluxos reais da aplicação de ponta a ponta: UI, rotas, server actions e banco de dados.

## Rules

1. **Use Playwright ao invés de Cypress para novos projetos** — porque Playwright suporta Chromium, Firefox e WebKit nativamente, tem execução paralela e velocidade superior
2. **Configure multi-browser por padrão** — Chromium, Firefox e WebKit devem estar nos projects do config, porque testes E2E devem cobrir os navegadores reais dos usuários
3. **Coloque testes E2E em pasta separada** — `tests/` ou `e2e/` na raiz do projeto, separado dos testes unitários/integração, porque E2E tem lifecycle e config próprios
4. **Use a API nativa do Playwright sem user setup** — `page.goto()`, `page.getByRole()`, `element.click()` direto, porque Playwright não precisa de `userEvent` setup como Testing Library
5. **Ative reports HTML** — `npx playwright show-report` gera relatórios visuais com steps, erros, screenshots e vídeos, porque facilita debugging de falhas

## How to write

### Instalação e setup

```bash
# Instalar Playwright com browsers
pnpm dlx playwright install

# Criar config e exemplos
pnpm create playwright
# Colocar testes em: tests/
# GitHub Actions: não (opcional)
```

### Configuração básica (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

### Teste E2E básico

```typescript
import { test, expect } from '@playwright/test'

test('deve navegar para a página principal', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Minha App/)

  const link = page.getByRole('link', { name: 'Começar' })
  await link.click()

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
```

## Example

**Before (mentalidade Cypress/Testing Library):**
```typescript
// Setup desnecessário, API verbosa
const user = userEvent.setup()
render(<App />)
const button = screen.getByRole('button', { name: 'Submit' })
await user.click(button)
```

**After (Playwright idiomático):**
```typescript
// Direto, sem setup de user
test('submete formulário', async ({ page }) => {
  await page.goto('/form')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Sucesso')).toBeVisible()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Fluxo crítico do usuário (login, checkout, CRUD) | Teste E2E com Playwright |
| Lógica isolada de um hook/util | Teste unitário, não E2E |
| Componente individual | Teste de componente com Testing Library |
| Precisa testar em Safari | WebKit já está no config padrão |
| Teste falhou e precisa debugar | `npx playwright show-report` para ver screenshots/vídeos |
| CI/CD | Adicionar `npx playwright install --with-deps` no pipeline |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Testar só em Chromium | Configure Chromium + Firefox + WebKit |
| Ignorar o report HTML | `npx playwright show-report` após falhas |
| Misturar testes E2E com unitários na mesma pasta | Pasta `tests/` separada para E2E |
| Usar `page.locator('div.btn-primary')` | `page.getByRole('button', { name: '...' })` |
| Instalar Cypress E Playwright no mesmo projeto | Escolha um — Playwright cobre mais navegadores |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
