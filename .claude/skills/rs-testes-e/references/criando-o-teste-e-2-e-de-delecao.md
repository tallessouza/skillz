---
name: rs-testes-e-criando-o-teste-e-2-e-de-delecao
description: "Enforces Playwright E2E deletion test patterns when writing end-to-end tests for CRUD delete flows. Use when user asks to 'write e2e test', 'test deletion', 'playwright delete test', 'test modal confirmation', or 'e2e remove flow'. Applies: repeatable test setup via direct DB seeding, role-based element queries, modal confirmation flow, post-deletion assertion with heading count zero. Make sure to use this skill whenever creating Playwright tests for delete operations. Not for unit tests, integration tests, or non-deletion E2E flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: e2e-testing
  tags: [testing, next-js, react, playwright, e2e]
---

# Teste E2E de Deleção com Playwright

> Testes E2E de deleção semeiam o dado no banco antes do teste, executam a deleção via UI incluindo confirmação em modal, e verificam ausência do elemento na tela.

## Rules

1. **Sempre crie o dado antes do teste via Prisma direto** — `prisma.prompt.create()` antes de qualquer interação, porque o teste precisa ser repetível independente do estado do banco
2. **Desconecte do banco após o seed** — `prisma.$disconnect()` logo após criar o dado, porque conexões abertas causam flaky tests
3. **Use `getByRole('heading')` para localizar itens** — não use `getByRole('listItem')` diretamente para verificar texto, porque o conteúdo está dentro de tags semânticas como `h3`
4. **Filtre list items com `filter({ hasText })` para interagir** — `page.getByRole('listItem').filter({ hasText: uniqueTitle })` para encontrar o card correto e clicar no botão de delete dentro dele
5. **Use títulos únicos com timestamp** — `Date.now()` no título evita colisões entre execuções paralelas
6. **Cubra apenas o cenário de sucesso no E2E** — testes de unidade e integração já cobrem edge cases; E2E valida apenas o fluxo feliz, porque está no topo da pirâmide

## How to write

### Setup com seed direto no banco

```typescript
import { test, expect } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

test('deleção de prompt via UI (sucesso)', async ({ page }) => {
  // Arrange — seed direto no banco
  const adapter = new PrismaPg(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });

  const uniqueTitle = `e2e-deletable-${Date.now()}`;
  const content = 'content';

  await prisma.prompt.create({
    data: { title: uniqueTitle, content },
  });
  await prisma.$disconnect();

  // Act & Assert abaixo...
});
```

### Fluxo completo de deleção

```typescript
  // Act — navegar e localizar
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: uniqueTitle })
  ).toBeVisible({ timeout: 15000 });

  const promptItem = page.getByRole('listItem').filter({ hasText: uniqueTitle });
  await expect(promptItem).toBeVisible();

  // Act — deletar com confirmação em modal
  await promptItem.getByRole('button', { name: 'remover prompt' }).click();
  await page.getByRole('button', { name: 'confirmar remoção' }).click();

  // Assert — toast de sucesso e ausência do item
  await expect(page.getByText('prompt removido com sucesso')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: uniqueTitle })
  ).toHaveCount(0);
```

## Example

**Before (frágil e não repetível):**
```typescript
test('delete prompt', async ({ page }) => {
  await page.goto('/');
  // Depende de dado existente no banco — não repetível
  await page.click('.delete-btn');
  await page.click('.confirm-btn');
  // Sem verificação de remoção real
});
```

**After (com esta skill aplicada):**
```typescript
test('deleção de prompt via UI (sucesso)', async ({ page }) => {
  const adapter = new PrismaPg(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });
  const uniqueTitle = `e2e-deletable-${Date.now()}`;
  await prisma.prompt.create({ data: { title: uniqueTitle, content: 'c' } });
  await prisma.$disconnect();

  await page.goto('/');
  await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible({ timeout: 15000 });

  const promptItem = page.getByRole('listItem').filter({ hasText: uniqueTitle });
  await promptItem.getByRole('button', { name: 'remover prompt' }).click();
  await page.getByRole('button', { name: 'confirmar remoção' }).click();

  await expect(page.getByText('prompt removido com sucesso')).toBeVisible();
  await expect(page.getByRole('heading', { name: uniqueTitle })).toHaveCount(0);
});
```

## Heuristics

| Situação | Faça |
|----------|------|
| Deleção com modal de confirmação | Clique no botão de delete, depois clique em confirmar no modal |
| Verificar que item sumiu da lista | `toHaveCount(0)` no heading, não `not.toBeVisible()` |
| Elemento demora pra aparecer | Use `timeout` customizado no `toBeVisible()` |
| Múltiplos itens com nome similar | Use `Date.now()` no título para unicidade |
| Decidindo quantos cenários E2E criar | Apenas sucesso — edge cases ficam em unit/integration |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `page.click('.delete-btn')` | `promptItem.getByRole('button', { name: 'remover prompt' }).click()` |
| `not.toBeVisible()` para item removido | `toHaveCount(0)` — mais determinístico |
| Teste que depende de dado pré-existente | Seed com `prisma.create()` no início do teste |
| `getByRole('listItem', { name: title })` | `getByRole('listItem').filter({ hasText: title })` |
| Muitos cenários E2E para mesma feature | Um cenário de sucesso; rest fica em unit/integration |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
