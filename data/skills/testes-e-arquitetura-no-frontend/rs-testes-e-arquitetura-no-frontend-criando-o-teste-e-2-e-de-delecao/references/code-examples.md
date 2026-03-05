# Code Examples: Teste E2E de Deleção com Playwright

## Exemplo completo do teste

```typescript
// prompt-delete.spec.ts
import { test, expect } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

test('deleção de prompt via UI (sucesso)', async ({ page }) => {
  // === ARRANGE: Seed no banco ===
  const adapter = new PrismaPg(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });

  const uniqueTitle = `e2e-deletable-${Date.now()}`;
  const content = 'content';

  await prisma.prompt.create({
    data: { title: uniqueTitle, content },
  });
  await prisma.$disconnect();

  // === ACT: Navegar e localizar o prompt ===
  await page.goto('/');

  // Verificar que o heading com o título apareceu
  await expect(
    page.getByRole('heading', { name: uniqueTitle })
  ).toBeVisible({ timeout: 15000 });

  // Localizar o card (list item) pelo texto
  const promptItem = page
    .getByRole('listItem')
    .filter({ hasText: uniqueTitle });
  await expect(promptItem).toBeVisible();

  // === ACT: Deletar com confirmação ===
  // Clicar no botão de remover dentro do card
  await promptItem
    .getByRole('button', { name: 'remover prompt' })
    .click();

  // Confirmar no modal
  await page
    .getByRole('button', { name: 'confirmar remoção' })
    .click();

  // === ASSERT: Verificar remoção ===
  // Toast de sucesso
  await expect(
    page.getByText('prompt removido com sucesso')
  ).toBeVisible();

  // Item não existe mais na lista
  await expect(
    page.getByRole('heading', { name: uniqueTitle })
  ).toHaveCount(0);
});
```

## Evolução do código durante a aula

### Primeira tentativa (falhou)

```typescript
// O instrutor tentou buscar o listItem pelo nome diretamente
const promptItem = page.getByRole('listItem', { name: uniqueTitle });
await expect(promptItem).toBeVisible();
// FALHOU: o listItem não expõe o texto do h3 como nome acessível
```

### Correção: separar verificação de localização

```typescript
// Verificar visibilidade via heading (semântico)
await expect(
  page.getByRole('heading', { name: uniqueTitle })
).toBeVisible({ timeout: 15000 });

// Localizar o card via filter (para interagir com botões dentro)
const promptItem = page
  .getByRole('listItem')
  .filter({ hasText: uniqueTitle });
```

## Estrutura do componente PromptCard (contexto)

```tsx
// O componente que o teste está interagindo
<li> {/* listItem */}
  <header>
    <h3>{title}</h3> {/* heading */}
    <p>{content}</p>
  </header>
  <button aria-label="remover prompt">
    {/* ícone de delete */}
  </button>
</li>
```

## Padrão de nomeação dos testes

```typescript
// O instrutor considerou usar describe mas optou por simplicidade
// Opção com describe (não usada):
test.describe('deletar prompt', () => {
  test('deleção de prompt via UI (sucesso)', async ({ page }) => {
    // ...
  });
});

// Opção adotada (sem describe):
test('deleção de prompt via UI (sucesso)', async ({ page }) => {
  // ...
});
```

## Padrão de título único com timestamp

```typescript
// Garante unicidade entre execuções paralelas e sequenciais
const uniqueTitle = `e2e-deletable-${Date.now()}`;
// Exemplo de output: "e2e-deletable-1709312400000"
```