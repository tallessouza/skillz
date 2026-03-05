---
name: rs-testes-frontend-configurando-playwright
description: "Applies Playwright configuration best practices when setting up or modifying playwright.config.ts in Next.js projects. Use when user asks to 'configure playwright', 'setup e2e tests', 'add end-to-end testing', 'configure test runner', or 'setup playwright config'. Enforces correct baseURL, parallel execution, retry strategies, trace/video/screenshot settings, and webServer configuration. Make sure to use this skill whenever creating or editing playwright.config.ts. Not for writing actual test cases, unit tests, or component tests."
---

# Configurando o Playwright

> Configurar o playwright.config.ts com estrategias diferenciadas para CI e ambiente local, otimizando paralelismo, retries, debugging e gerenciamento do servidor.

## Rules

1. **Separe configuracoes CI vs local** — use `process.env.CI` para retries, workers, timeout e webServer command, porque CI precisa de mais resiliencia e local precisa de velocidade
2. **Habilite fullyParallel** — `fullyParallel: true` acelera a suite significativamente executando testes em paralelo
3. **Use forbidOnly em CI** — `forbidOnly: !!process.env.CI` previne que `.only` escape para CI e rode a suite parcialmente
4. **Configure trace, screenshot e video para falhas** — grave apenas quando testes falham, porque facilita debugging sem consumir espaco desnecessario
5. **Use baseURL no use** — permite usar `page.goto('/')` com rotas relativas ao inves de URLs completas
6. **Sincronize testDir com a pasta real** — ao renomear a pasta de testes, atualize `testDir` no config E o outputDir

## How to write

### Configuracao completa

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './end-to-end',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  reporter: 'html',

  use: {
    baseURL: `http://localhost:${process.env.PORT ?? 3000}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { PORT: process.env.PORT ?? '' },
  },
})
```

### Scripts no package.json

```json
{
  "scripts": {
    "test:e2e": "npx playwright test",
    "test:e2e:ui": "npx playwright test --ui"
  }
}
```

## Example

**Before (config padrao sem otimizacoes):**
```typescript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

**After (com estrategias CI/local e debugging):**
```typescript
export default defineConfig({
  testDir: './end-to-end',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  reporter: 'html',

  use: {
    baseURL: `http://localhost:${process.env.PORT ?? 3000}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { PORT: process.env.PORT ?? '' },
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Renomeou pasta de testes | Atualize `testDir` e `outputDir` no config |
| Testes flaky no CI | Aumente `retries` para 2-3 no CI |
| CI lento | Mantenha `workers: 1` no CI para estabilidade |
| Debugging de falha | Use `--ui` para acompanhar visualmente frame a frame |
| Quer ver apenas falhas | `screenshot: 'only-on-failure'` + `video: 'retain-on-failure'` |
| App Next.js | Configure `webServer` com `dev` local e `start` no CI |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| URL completa no `page.goto('http://localhost:3000/')` | `page.goto('/')` com baseURL configurada |
| `retries: 2` em todos os ambientes | `retries: process.env.CI ? 2 : 0` |
| Deixar `.only` escapar para CI | `forbidOnly: !!process.env.CI` |
| `video: 'on'` gravando tudo | `video: 'retain-on-failure'` so falhas |
| Rodar sem `webServer` e subir server manual | Configurar `webServer` com `reuseExistingServer: true` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
