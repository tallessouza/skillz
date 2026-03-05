# Code Examples: Introdução ao Playwright

## Instalação

### Método 1: Instalar browsers apenas
```bash
pnpn dlx playwright install
```
Instala os browsers (Chromium, WebKit, Firefox) sem criar config.

### Método 2: Setup completo com config e exemplos
```bash
pnpm create playwright
```

Perguntas interativas:
- **Onde colocar testes E2E?** → `tests` (pasta na raiz)
- **GitHub Actions workflow?** → Não (opcional)

Gera:
- `playwright.config.ts` — configuração completa
- `tests/example.spec.ts` — exemplo de teste
- `tests-examples/` — exemplos adicionais

## Configuração gerada (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile browsers (comentado por padrão)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  // Servidor local (opcional)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
```

## Exemplo de teste gerado

```typescript
import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await expect(page).toHaveTitle(/Playwright/)
})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/')

  // Captura o link pelo role e name, depois clica
  await page.getByRole('link', { name: 'Get started' }).click()

  // Verifica que o heading existe na página de destino
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible()
})
```

## Comandos úteis

```bash
# Rodar todos os testes
npx playwright test

# Ver relatório HTML após execução
npx playwright show-report

# Rodar em modo headed (ver o browser)
npx playwright test --headed

# Rodar um teste específico
npx playwright test tests/example.spec.ts

# Rodar em um browser específico
npx playwright test --project=chromium
```

## Comparação de API: Testing Library vs Playwright

### Testing Library (testes de componente)
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('clica no botão', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)

  const button = screen.getByRole('button', { name: 'Enviar' })
  await user.click(button)

  expect(screen.getByText('Enviado')).toBeInTheDocument()
})
```

### Playwright (teste E2E)
```typescript
import { test, expect } from '@playwright/test'

test('clica no botão', async ({ page }) => {
  await page.goto('/my-page')

  // Sem setup de user, sem render — direto no ponto
  await page.getByRole('button', { name: 'Enviar' }).click()

  await expect(page.getByText('Enviado')).toBeVisible()
})
```

A API é quase idêntica (`getByRole`, `getByText`), mas Playwright elimina o boilerplate de setup.