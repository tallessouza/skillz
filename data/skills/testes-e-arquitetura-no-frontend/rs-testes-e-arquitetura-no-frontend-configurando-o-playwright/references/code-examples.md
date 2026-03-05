# Code Examples: Configurando o Playwright

## Configuracao completa do playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Diretorio onde ficam os testes e2e
  testDir: './end-to-end',

  // Habilita execucao paralela de testes (acelera a suite)
  fullyParallel: true,

  // Falha no CI se encontrar .only (previne suite parcial)
  forbidOnly: !!process.env.CI,

  // Retries: 2 no CI para estabilidade, 0 local para velocidade
  retries: process.env.CI ? 2 : 0,

  // Workers: 1 no CI (sequencial), undefined local (usa todos os cores)
  workers: process.env.CI ? 1 : undefined,

  // Timeout maior no CI (ambiente mais lento)
  timeout: process.env.CI ? 60_000 : 30_000,

  // Reporter HTML gera relatorio visual dos resultados
  reporter: 'html',

  // Opcoes padrao para todos os testes
  use: {
    // Permite usar page.goto('/') ao inves de URL completa
    baseURL: `http://localhost:${process.env.PORT ?? 3000}`,

    // Grava trace na primeira re-execucao apos falha
    trace: 'on-first-retry',

    // Tira screenshot apenas quando teste falha
    screenshot: 'only-on-failure',

    // Grava video mas mantem apenas dos testes que falharam
    video: 'retain-on-failure',
  },

  // Browsers para testar (Chromium cobre maioria, Firefox e Safari para garantia)
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
  ],

  // Gerencia o servidor da aplicacao automaticamente
  webServer: {
    // CI: build de producao, Local: modo dev
    command: process.env.CI ? 'npm run start' : 'npm run dev',

    // Se ja tem servidor rodando, reutiliza
    reuseExistingServer: true,

    // Timeout para o servidor iniciar
    timeout: 120_000,

    // Passa a porta via env
    env: {
      PORT: process.env.PORT ?? '',
    },
  },
})
```

## Scripts no package.json

```json
{
  "scripts": {
    "test:e2e": "npx playwright test",
    "test:e2e:ui": "npx playwright test --ui"
  }
}
```

### Diferenca entre os dois scripts

- `test:e2e` — roda no terminal sem interface grafica, ideal para CI e execucao rapida
- `test:e2e:ui` — abre interface grafica do Playwright onde voce acompanha visualmente os testes, ve o browser renderizando, network requests, e pode debugar frame a frame

## Usando baseURL com rotas relativas

```typescript
// SEM baseURL configurada (verboso, nao portavel)
await page.goto('http://localhost:3000/')
await page.goto('http://localhost:3000/prompts')
await page.goto('http://localhost:3000/settings')

// COM baseURL configurada (limpo, portavel)
await page.goto('/')
await page.goto('/prompts')
await page.goto('/settings')
```

## Renomeando pasta de testes

Se quiser mudar o nome da pasta de `tests` para `end-to-end`:

1. Renomeie a pasta fisicamente
2. Atualize no config:

```typescript
// ANTES
testDir: './tests',

// DEPOIS
testDir: './end-to-end',
```

3. Atualize qualquer referencia a outputDir tambem:

```typescript
// Se tinha outputDir referenciando a pasta antiga
outputDir: './end-to-end/results',
```

## Exemplo de teste basico (gerado pelo Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Prompt Manager/)
})
```