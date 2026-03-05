# Code Examples: Teste E2E para Busca de Prompt

## Exemplo completo do teste (como mostrado na aula)

```typescript
// prompt.search.spec.ts
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

test.describe('busca de prompts na sidebar', () => {
  test('filtra a lista de prompts em tempo real baseado no termo digitado', async ({ page }) => {
    // Setup: criar adapter e Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    })

    // Criar identificadores unicos
    const uniqueAlpha = `e2e-search-alpha-${Date.now()}`
    const uniqueBeta = `e2e-search-beta-${Date.now()}`

    // Seedar dados
    await prisma.prompt.createMany({
      data: [
        { title: uniqueAlpha, content: 'alpha content' },
        { title: uniqueBeta, content: 'beta content' },
      ],
    })
    await prisma.$disconnect()

    // Navegar para a home
    await page.goto('/')

    // Capturar o input de busca
    const searchInput = page.getByPlaceholder('Buscar prompts')
    await expect(searchInput).toBeVisible()

    // Teste 1: buscar pelo termo alpha
    await searchInput.fill(uniqueAlpha)
    await expect(page.getByText(uniqueAlpha)).toHaveCount(1)

    // Teste 2: buscar pelo termo beta (fill limpa automaticamente)
    await searchInput.fill(uniqueBeta)
    await expect(page.getByText(uniqueBeta)).toHaveCount(1)

    // Teste 3: buscar termo inexistente
    const notExist = `e2e-search-not-exist-${Date.now()}`
    await searchInput.fill(notExist)
    await expect(page.getByText(notExist)).toHaveCount(0)
  })
})
```

## Variacao: usando beforeAll para seed

```typescript
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

const uniqueAlpha = `e2e-search-alpha-${Date.now()}`
const uniqueBeta = `e2e-search-beta-${Date.now()}`

test.describe('busca de prompts na sidebar', () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient()
    await prisma.prompt.createMany({
      data: [
        { title: uniqueAlpha, content: 'alpha content' },
        { title: uniqueBeta, content: 'beta content' },
      ],
    })
    await prisma.$disconnect()
  })

  test('filtra alpha', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Buscar prompts')
    await searchInput.fill(uniqueAlpha)
    await expect(page.getByText(uniqueAlpha)).toHaveCount(1)
  })

  test('filtra beta', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Buscar prompts')
    await searchInput.fill(uniqueBeta)
    await expect(page.getByText(uniqueBeta)).toHaveCount(1)
  })

  test('termo inexistente retorna zero', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Buscar prompts')
    const notExist = `e2e-not-exist-${Date.now()}`
    await searchInput.fill(notExist)
    await expect(page.getByText(notExist)).toHaveCount(0)
  })
})
```

## Variacao: cleanup apos testes

```typescript
test.afterAll(async () => {
  const prisma = new PrismaClient()
  await prisma.prompt.deleteMany({
    where: {
      title: { startsWith: 'e2e-search-' },
    },
  })
  await prisma.$disconnect()
})
```

## Padrao de nomeacao dos arquivos de teste

```
prompt.search.spec.ts    # busca
prompt.create.spec.ts    # criacao
prompt.delete.spec.ts    # delecao
prompt.update.spec.ts    # edicao
home.spec.ts             # pagina inicial
```

## Comandos para executar

```bash
# Rodar todos os testes E2E
pnpm test:e2e

# Rodar apenas o teste de busca
pnpm test:e2e prompt.search.spec.ts

# Rodar com UI do Playwright
pnpm test:e2e --ui
```