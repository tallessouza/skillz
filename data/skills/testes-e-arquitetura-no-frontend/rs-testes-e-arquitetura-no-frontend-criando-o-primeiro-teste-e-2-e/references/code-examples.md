# Code Examples: Primeiro Teste E2E com Playwright

## Exemplo completo da aula

O instrutor criou o arquivo `home.spec.ts` com o seguinte conteudo:

```typescript
import { test, expect, Page } from '@playwright/test'

test('deve carregar a pagina inicial', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Selecionar Prompt' })
  ).toBeVisible()

  await expect(
    page.getByText('Escolha um prompt e dê a lista ao lado para visualizar e editar')
  ).toBeVisible()
})
```

## Passo a passo da construcao

### 1. Renomear arquivo
O instrutor renomeou o arquivo padrao do Playwright para `home.spec.ts`, seguindo a convencao `{feature}.spec.ts`.

### 2. Estrutura do teste
```typescript
// Sintaxe basica — test() com descricao em portugues
test('deve carregar a pagina inicial', async ({ page }: { page: Page }) => {
  // corpo do teste
})
```

### 3. Navegacao
```typescript
// goto() navega para a URL — usa baseURL do playwright.config.ts
await page.goto('/')
```

### 4. Selecao por role
```typescript
// O instrutor inspecionou o elemento e viu que era um <h1>
// Portanto, o role ARIA e 'heading'
page.getByRole('heading', { name: 'Selecionar Prompt' })
```

### 5. Selecao por texto
```typescript
// Para o subtitulo, usou getByText com o texto exato
page.getByText('Escolha um prompt e dê a lista ao lado para visualizar e editar')
```

### 6. Assertion de visibilidade
```typescript
// toBeVisible() garante que o elemento esta renderizado E visivel
await expect(element).toBeVisible()
```

## Comandos de execucao usados na aula

```bash
# Rodar testes com interface grafica (modo UI)
npx playwright test --ui

# O teste falhou primeiro (sem servidor)
# Depois o instrutor iniciou o servidor Next.js
npm run dev

# E re-executou o teste — passou com sucesso
```

## Variacoes do padrao para outras paginas

### Teste de pagina de login
```typescript
test('deve carregar a pagina de login', async ({ page }: { page: Page }) => {
  await page.goto('/login')

  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
})
```

### Teste de pagina com lista
```typescript
test('deve carregar a pagina de produtos', async ({ page }: { page: Page }) => {
  await page.goto('/produtos')

  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()
  // Verificar que pelo menos um item da lista esta visivel
  await expect(page.getByRole('listitem').first()).toBeVisible()
})
```

### Teste verificando loading state
```typescript
test('deve mostrar loading e depois conteudo', async ({ page }: { page: Page }) => {
  await page.goto('/')

  // O spinner do Suspense aparece brevemente (como o instrutor mostrou)
  // Depois o conteudo carrega
  await expect(page.getByRole('heading', { name: 'Selecionar Prompt' })).toBeVisible()
})
```