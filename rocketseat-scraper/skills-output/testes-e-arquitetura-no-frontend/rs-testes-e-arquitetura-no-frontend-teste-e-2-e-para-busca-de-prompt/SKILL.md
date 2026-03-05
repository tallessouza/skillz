---
name: rs-testes-arq-frontend-e2e-busca
description: "Generates E2E search tests with Playwright when writing search, filter, or listing tests. Use when user asks to 'test search', 'write e2e test for filter', 'test listing', 'playwright search test', or 'test real-time filtering'. Applies patterns: seed test data with unique identifiers, verify real-time filtering, assert count not visibility, test non-existent terms. Make sure to use this skill whenever creating E2E tests for search or filter functionality. Not for unit tests, integration tests, or API testing."
---

# Teste E2E para Busca com Playwright

> Testes E2E de busca exigem dados unicos seedados antes da execucao, verificacao de filtragem em tempo real, e validacao de resultados inexistentes.

## Rules

1. **Sempre seedar dados antes do teste** — crie registros no banco com identificadores unicos antes de testar, porque o teste precisa ser repetivel em qualquer ambiente
2. **Use Date.now() para unicidade** — concatene timestamps nos dados de teste (`e2e-search-alpha-${Date.now()}`), porque evita colisao entre execucoes paralelas ou repetidas
3. **Asserte count, nao visibilidade** — use `toHaveCount(1)` em vez de `toBeVisible()`, porque count ja implica visibilidade e valida unicidade do resultado
4. **Teste termos inexistentes** — sempre inclua um caso que busca um termo nao inserido e espere `toHaveCount(0)`, porque garante que o filtro realmente funciona
5. **Desconecte o banco apos seed** — chame `prisma.$disconnect()` apos criar os dados, porque conexoes abertas causam falhas intermitentes
6. **fill() substitui o conteudo** — no Playwright, `fill()` limpa o campo antes de digitar (diferente do Jest que concatena), porque isso permite testar multiplas buscas sequenciais sem `clear()`

## How to write

### Seed de dados unicos

```typescript
const uniqueAlpha = `e2e-search-alpha-${Date.now()}`
const uniqueBeta = `e2e-search-beta-${Date.now()}`

await prisma.prompt.createMany({
  data: [
    { title: uniqueAlpha, content: 'alpha content' },
    { title: uniqueBeta, content: 'beta content' },
  ],
})
await prisma.$disconnect()
```

### Teste de filtragem em tempo real

```typescript
test('filtra a lista de prompts em tempo real baseado no termo digitado', async ({ page }) => {
  await page.goto('/')

  const searchInput = page.getByPlaceholder('Buscar prompts')
  await expect(searchInput).toBeVisible()

  // Busca primeiro termo
  await searchInput.fill(uniqueAlpha)
  await expect(page.getByText(uniqueAlpha)).toHaveCount(1)

  // Busca segundo termo (fill limpa automaticamente)
  await searchInput.fill(uniqueBeta)
  await expect(page.getByText(uniqueBeta)).toHaveCount(1)

  // Busca termo inexistente
  const notExist = `e2e-search-not-exist-${Date.now()}`
  await searchInput.fill(notExist)
  await expect(page.getByText(notExist)).toHaveCount(0)
})
```

## Example

**Before (teste fragil):**
```typescript
test('busca funciona', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('Buscar').fill('meu prompt')
  await expect(page.getByText('meu prompt')).toBeVisible()
})
```

**After (teste repetivel e robusto):**
```typescript
test.describe('busca de prompts na sidebar', () => {
  test('filtra em tempo real', async ({ page }) => {
    // Seed com identificadores unicos
    const unique = `e2e-search-${Date.now()}`
    await prisma.prompt.create({ data: { title: unique, content: 'test' } })
    await prisma.$disconnect()

    await page.goto('/')
    const searchInput = page.getByPlaceholder('Buscar prompts')

    await searchInput.fill(unique)
    await expect(page.getByText(unique)).toHaveCount(1)

    // Termo inexistente
    await searchInput.fill(`not-exist-${Date.now()}`)
    await expect(page.getByText(unique)).toHaveCount(0)
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste depende de dados existentes | Seedar no setup com Date.now() |
| Verificar se resultado aparece | `toHaveCount(1)` em vez de `toBeVisible()` |
| Verificar ausencia de resultado | `toHaveCount(0)` |
| Multiplas buscas no mesmo teste | Use `fill()` sequencial (limpa automaticamente) |
| Teste precisa de banco limpo | Crie dados unicos em vez de limpar banco |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Dados hardcoded sem unicidade | `\`e2e-${Date.now()}\`` |
| `toBeVisible()` para checar resultado de busca | `toHaveCount(1)` |
| `clear()` + `type()` no Playwright | `fill()` que ja limpa |
| Teste sem caso de termo inexistente | Sempre inclua `toHaveCount(0)` |
| Conexao Prisma aberta apos seed | `await prisma.$disconnect()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
