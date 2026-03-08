---
name: rs-testes-e-configurando-o-playwright
description: "Applies Playwright configuration best practices when setting up playwright.config.ts in Next.js projects. Use when user asks to 'configure playwright', 'setup e2e tests', 'add end-to-end testing', 'configure test runner for e2e', or 'setup playwright config'. Enforces correct baseURL, CI vs local strategies, parallel execution, retry/trace/video settings, and webServer configuration. Make sure to use this skill whenever creating or editing playwright.config.ts. Not for writing test cases (use rs-testes-e-criando-o-primeiro-teste-e-2-e), unit tests, or component tests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: e2e-setup
  tags: [playwright, e2e, config, next-js, ci, testing, webserver]
---

# Configurando o Playwright

> Configurar playwright.config.ts com estrategias diferenciadas para CI e ambiente local, otimizando paralelismo, retries e debugging.

## Rules

1. **Separe CI vs local** — use `process.env.CI` para retries, workers, timeout e webServer command
2. **Habilite fullyParallel** — `fullyParallel: true` acelera a suite significativamente
3. **Use forbidOnly em CI** — `forbidOnly: !!process.env.CI` previne `.only` escapando para CI
4. **Configure trace/screenshot/video para falhas** — grave apenas quando testes falham
5. **Use baseURL** — permite `page.goto('/')` com rotas relativas
6. **Sincronize testDir** — ao renomear pasta de testes, atualize `testDir` no config

## How to write

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
  },
})
```

## Example

**Before (config padrao sem otimizacoes):**
```typescript
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000' },
})
```

**After (com estrategias CI/local):**
```typescript
export default defineConfig({
  testDir: './end-to-end',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: `http://localhost:${process.env.PORT ?? 3000}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    reuseExistingServer: true,
  },
})
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| URL completa no `page.goto()` | Rotas relativas com baseURL |
| `retries: 2` em todos ambientes | `retries: process.env.CI ? 2 : 0` |
| `.only` escapar para CI | `forbidOnly: !!process.env.CI` |
| `video: 'on'` gravando tudo | `video: 'retain-on-failure'` |

## Troubleshooting

### webServer timeout
**Symptom:** Playwright falha esperando o server iniciar
**Cause:** Timeout muito curto ou comando errado
**Fix:** Aumentar `timeout: 120_000` e verificar que o comando (`dev` ou `start`) esta correto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
