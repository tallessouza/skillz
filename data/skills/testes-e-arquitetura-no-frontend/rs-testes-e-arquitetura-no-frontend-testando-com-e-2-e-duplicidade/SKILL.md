---
name: rs-testes-arq-frontend-e2e-duplicidade
description: "Enforces E2E test patterns for validating duplicate data scenarios with Playwright and Prisma. Use when user asks to 'write e2e test', 'test duplicate validation', 'playwright test setup', 'global setup playwright', or 'test error scenarios'. Applies rules: self-contained test data setup, database seeding before assertions, global setup configuration, web server config in playwright. Make sure to use this skill whenever writing E2E tests that depend on pre-existing database state. Not for unit tests, integration tests, or component testing."
---

# Testando Duplicidade com E2E

> Testes E2E que validam cenarios de erro devem ser autocontidos — criar o estado necessario no banco ANTES de executar, garantindo repetibilidade.

## Rules

1. **Teste autocontido** — todo dado necessario para o cenario deve ser criado dentro do proprio teste (no `beforeAll` ou inicio do test), porque depender de dados pre-existentes no banco quebra a repetibilidade
2. **Delete antes de inserir** — ao preparar dados de teste, delete registros com o mesmo identificador antes de criar novos, porque garante idempotencia em multiplas execucoes
3. **Configure global setup** — use `globalSetup` no `playwright.config.ts` para rodar seeds e preparar o ambiente antes de todos os testes
4. **Configure webServer** — use a opcao `webServer` no playwright config para iniciar o servidor automaticamente, porque elimina dependencia de servidor rodando manualmente
5. **Valide alem do feedback visual** — alem de checar toasts/mensagens de erro, valide que o dado duplicado NAO foi inserido (ex: contar elementos na sidebar), porque o toast pode aparecer mas o dado ser salvo por bug
6. **Poucos testes E2E** — mantenha apenas cenarios criticos (sucesso + erro principal) em E2E, porque sao caros, lentos e frageis — piramide de testes

## How to write

### Setup de dados no teste

```typescript
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client/generated'

test('validacao de duplicidade de titulo', async ({ page }) => {
  const duplicatedTitle = 'e2e-duplicate-prompt'

  // Preparar estado: garantir que titulo ja existe
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  await prisma.prompt.deleteMany({ where: { title: duplicatedTitle } })
  await prisma.prompt.create({
    data: { title: duplicatedTitle, content: 'content' }
  })
  await prisma.$disconnect()

  // Agora testar duplicidade
  await page.goto('/new')
  // ... preencher formulario com duplicatedTitle
  // ... clicar salvar
  // ... validar toast de erro
  // ... validar que sidebar tem apenas 1 item com esse titulo
})
```

### Playwright config com globalSetup e webServer

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  globalSetup: './end-to-end/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: 'http://localhost:3000',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '3000',
      DATABASE_URL: process.env.DATABASE_URL ?? '',
    },
  },
})
```

### Validacao dupla: toast + contagem

```typescript
// Validar mensagem de erro
await expect(page.getByText('Este prompt já existe')).toBeVisible()

// Validar que NAO criou duplicata na sidebar
await expect(
  page.getByRole('heading', { name: duplicatedTitle })
).toHaveCount(1)
```

## Example

**Before (teste fragil — depende de dado externo):**
```typescript
test('duplicidade', async ({ page }) => {
  // Assume que 'meu-prompt' ja existe no banco... mas e se nao existir?
  await page.goto('/new')
  await page.getByPlaceholder('Title').fill('meu-prompt')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Este prompt já existe')).toBeVisible()
})
```

**After (teste autocontido — cria o proprio estado):**
```typescript
test('duplicidade', async ({ page }) => {
  const duplicatedTitle = 'e2e-duplicate-prompt'

  // Setup: garantir dado pre-existente
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  await prisma.prompt.deleteMany({ where: { title: duplicatedTitle } })
  await prisma.prompt.create({ data: { title: duplicatedTitle, content: 'content' } })
  await prisma.$disconnect()

  // Test
  await page.goto('/new')
  await page.getByPlaceholder('Title').fill(duplicatedTitle)
  await page.getByPlaceholder('Content').fill('any content')
  await page.getByRole('button', { name: 'Save' }).click()

  // Assert: erro apareceu E dado nao duplicou
  await expect(page.getByText('Este prompt já existe')).toBeVisible()
  await expect(page.getByRole('heading', { name: duplicatedTitle })).toHaveCount(1)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste depende de dado no banco | Crie o dado no inicio do teste (delete + create) |
| Precisa de seed global | Use `globalSetup` no playwright config |
| Servidor precisa estar rodando | Configure `webServer` no playwright config |
| Validando que algo NAO aconteceu | Use `toHaveCount` em vez de `not.toBeVisible` |
| Muitos cenarios E2E | Reduza — mantenha apenas sucesso + erro critico |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Depender de dados manuais no banco | `deleteMany` + `create` no setup do teste |
| Rodar servidor manualmente antes dos testes | Configurar `webServer` no playwright config |
| Validar apenas o toast de erro | Validar toast + contar elementos para garantir que nao salvou |
| Criar dezenas de testes E2E | Poucos testes E2E, muitos de integracao e unidade |
| Usar titulo fixo sem cleanup | `deleteMany` antes de `create` para idempotencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
