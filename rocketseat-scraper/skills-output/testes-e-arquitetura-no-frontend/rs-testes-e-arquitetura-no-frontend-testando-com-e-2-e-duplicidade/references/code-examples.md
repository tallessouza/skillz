# Code Examples: Testando Duplicidade com E2E

## 1. Global Setup completo

```typescript
// end-to-end/global-setup.ts
import { seedDatabase } from '../prisma/seed'

async function globalSetup() {
  // Copiar env se nao estiver em CI
  if (!process.env.CI) {
    const { config } = await import('dotenv')
    config({ path: '.env' })
  }

  // Rodar seed para popular banco com dados base
  await seedDatabase()
}

export default globalSetup
```

## 2. Playwright config completo

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './end-to-end',
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

## 3. Teste de sucesso (criacao de prompt)

```typescript
// end-to-end/prompt-create.spec.ts
import { test, expect } from '@playwright/test'

test('criacao de prompt com sucesso', async ({ page }) => {
  const uniqueTitle = `e2e-prompt-${Date.now()}`

  await page.goto('/new')

  const titleInput = page.getByPlaceholder('Title')
  await expect(titleInput).toBeVisible()
  await titleInput.fill(uniqueTitle)

  const contentInput = page.getByPlaceholder('Content')
  await contentInput.fill('Test content')

  await page.getByRole('button', { name: 'Save' }).click()

  // Validar sucesso
  await expect(page.getByText('Prompt criado com sucesso')).toBeVisible()
})
```

O uso de `Date.now()` no titulo garante unicidade — cada execucao gera um titulo diferente, eliminando conflitos de duplicidade.

## 4. Teste de duplicidade completo

```typescript
// end-to-end/prompt-create.spec.ts
import { test, expect } from '@playwright/test'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client/generated'

test('validacao de duplicidade de titulo', async ({ page }) => {
  const duplicatedTitle = 'e2e-duplicate-prompt'
  const content = 'content'

  // === SETUP: garantir dado pre-existente ===
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  // Delete primeiro (idempotencia)
  await prisma.prompt.deleteMany({
    where: { title: duplicatedTitle },
  })

  // Create o registro que sera "duplicado"
  await prisma.prompt.create({
    data: { title: duplicatedTitle, content },
  })

  await prisma.$disconnect()

  // === TEST: tentar criar com mesmo titulo ===
  await page.goto('/new')

  const titleInput = page.getByPlaceholder('Title')
  await expect(titleInput).toBeVisible()
  await titleInput.fill(duplicatedTitle)

  const contentInput = page.getByPlaceholder('Content')
  await contentInput.fill(content)

  await page.getByRole('button', { name: 'Save' }).click()

  // === ASSERT: erro apareceu ===
  await expect(page.getByText('Este prompt já existe')).toBeVisible()

  // === ASSERT: dado NAO foi duplicado na sidebar ===
  await expect(
    page.getByRole('heading', { name: duplicatedTitle })
  ).toHaveCount(1)
})
```

## 5. Variacao: usando beforeAll para setup compartilhado

Se multiplos testes no mesmo arquivo precisam do mesmo dado pre-existente:

```typescript
import { test, expect } from '@playwright/test'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client/generated'

const DUPLICATE_TITLE = 'e2e-duplicate-prompt'

test.beforeAll(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  await prisma.prompt.deleteMany({ where: { title: DUPLICATE_TITLE } })
  await prisma.prompt.create({
    data: { title: DUPLICATE_TITLE, content: 'seeded content' },
  })

  await prisma.$disconnect()
})

test('rejeita titulo duplicado', async ({ page }) => {
  await page.goto('/new')
  // ... preencher com DUPLICATE_TITLE e validar erro
})

test('sidebar mantem apenas um item', async ({ page }) => {
  // ... validar contagem na sidebar
})
```

## 6. Pattern: toHaveCount para validar ausencia de duplicatas

```typescript
// FRACO: pode dar falso positivo se elemento ainda nao renderizou
await expect(page.getByText(title)).not.toBeVisible()

// FORTE: valida quantidade exata
await expect(
  page.getByRole('heading', { name: title })
).toHaveCount(1) // exatamente 1, nao 0, nao 2+
```

`toHaveCount` e mais preciso que `not.toBeVisible` porque:
- `not.toBeVisible` pode passar se o elemento ainda nao carregou
- `toHaveCount(1)` espera ate encontrar exatamente 1 elemento, validando que nao duplicou