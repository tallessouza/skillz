# Code Examples: Testes E2E para Criacao de Prompt

## Exemplo completo da aula

Arquivo: `prompt.create.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test('criacao de prompt via UI - caso de sucesso', async ({ page }) => {
  // 1. Gerar titulo unico para evitar conflito com regra de negocio
  const uniqueTitle = `e2e-prompt-${Date.now()}`
  const content = 'Conteudo gerado via end-to-end'

  // 2. Navegar direto para a pagina de criacao
  await page.goto('/new')

  // 3. Verificar que o formulario carregou
  await expect(page.getByPlaceholder('título do prompt')).toBeVisible()

  // 4. Preencher titulo
  await page.fill('input[name="title"]', uniqueTitle)

  // 5. Preencher conteudo (textarea)
  await page.fill('textarea[name="content"]', content)

  // 6. Clicar no botao salvar
  await page.getByRole('button', { name: 'salvar' }).click()

  // 7. Verificar toast de sucesso
  await page.waitForSelector('text=prompt criado com sucesso', {
    state: 'visible',
    timeout: 15_000,
  })
})
```

## Variacao: navegando pela home primeiro

```typescript
test('criacao de prompt partindo da home', async ({ page }) => {
  const uniqueTitle = `e2e-prompt-${Date.now()}`

  // Comecar pela home
  await page.goto('/')

  // Clicar no botao de novo prompt
  await page.getByRole('button', { name: 'novo prompt' }).click()

  // Aguardar navegacao
  await expect(page.getByPlaceholder('título do prompt')).toBeVisible()

  // Preencher e submeter
  await page.fill('input[name="title"]', uniqueTitle)
  await page.fill('textarea[name="content"]', 'Conteudo do teste')
  await page.getByRole('button', { name: 'salvar' }).click()

  await page.waitForSelector('text=prompt criado com sucesso', {
    state: 'visible',
    timeout: 15_000,
  })
})
```

## Variacao: verificar que o prompt aparece na lista apos criacao

```typescript
test('prompt criado aparece na listagem', async ({ page }) => {
  const uniqueTitle = `e2e-prompt-${Date.now()}`

  await page.goto('/new')
  await page.fill('input[name="title"]', uniqueTitle)
  await page.fill('textarea[name="content"]', 'Conteudo de verificacao')
  await page.getByRole('button', { name: 'salvar' }).click()

  await page.waitForSelector('text=prompt criado com sucesso', {
    state: 'visible',
    timeout: 15_000,
  })

  // Navegar para a listagem
  await page.goto('/')

  // Verificar que o prompt aparece
  await expect(page.getByText(uniqueTitle)).toBeVisible()
})
```

## Padrao de nomeacao de arquivos de teste E2E

```
prompt.create.spec.ts    → testes de criacao
prompt.edit.spec.ts      → testes de edicao
prompt.delete.spec.ts    → testes de delecao
home.spec.ts             → testes da pagina inicial
```

O padrao `{recurso}.{acao}.spec.ts` facilita identificar o escopo de cada arquivo.