---
name: rs-testes-arq-frontend-tdd-e2e
description: "Applies TDD workflow using E2E tests with Playwright in Next.js applications. Use when user asks to 'add edit feature', 'create update functionality', 'write e2e test first', 'implement with TDD', or 'test-driven development'. Guides writing failing E2E tests before implementation, then building pages/routes/repositories incrementally to make tests pass. Make sure to use this skill whenever implementing CRUD features test-first in Next.js. Not for unit tests, API-only tests, or non-TDD workflows."
---

# TDD com Testes E2E

> Escreva o teste E2E completo primeiro, depois construa pagina, rota, repository e server action incrementalmente ate o teste passar.

## Prerequisites

- Playwright configurado no projeto Next.js
- Prisma com adapter PostgreSQL
- Repository pattern implementado (ex: `PrismaPromptRepository`)
- Servidor Next.js rodando para os testes

## Steps

### Step 1: Criar o arquivo de teste antes de qualquer codigo

Criar o spec file para a feature que ainda nao existe. Nenhuma rota, pagina ou server action precisa existir.

```typescript
// e2e/updateSpec.ts
import { test, expect } from '@playwright/test';

test('edicao de prompt via UI com sucesso', async ({ page }) => {
  // Setup: criar dado diretamente no banco via Prisma
  const prisma = new PrismaClient({ adapter });
  const now = Date.now();
  const originalTitle = `e2e edit original ${now}`;
  const updatedTitle = `e2e edit updated ${now}`;

  const created = await prisma.prompt.create({
    data: { title: originalTitle, content: originalContent }
  });
  await prisma.$disconnect();

  // Navegar para rota que AINDA NAO EXISTE
  await page.goto(`/created/${created.id}`);

  // Verificar que campos estao preenchidos
  await expect(page.getByPlaceholder('titulo do prompt')).toBeVisible();

  // Preencher novos valores
  await page.fill('input[name="title"]', updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);

  // Submeter
  await page.getByRole('button', { name: 'salvar' }).click();

  // Verificar Toast de sucesso
  await page.waitForSelector(
    page.getByText('Prompt atualizado com sucesso'),
    { state: 'visible', timeout: 15000 }
  );

  // Verificar que dados foram atualizados na UI
  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle);
});
```

### Step 2: Rodar o teste — confirmar que falha pelo motivo certo

Rodar o teste e verificar que a falha e porque a rota/pagina nao existe, nao por erro de configuracao.

```bash
npx playwright test updateSpec.ts
```

Se falhar por timeout do servidor ou erro de rede, resolver isso primeiro — o teste deve falhar porque a pagina nao foi encontrada (404).

### Step 3: Criar a rota e pagina dinamica

```typescript
// app/created/[id]/page.tsx
import { PromptForm } from '@/components/prompt-form';

type PromptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const repository = new PrismaPromptRepository(prisma);
  const prompt = await repository.findById(id);

  return <PromptForm prompt={prompt} />;
}
```

### Step 4: Adicionar metodo findById no repository

```typescript
// Na interface do repository
findById(id: string): Promise<Prompt | null>;

// Na implementacao Prisma
async findById(id: string): Promise<Prompt | null> {
  const prompt = await this.prisma.prompt.findUnique({
    where: { id }
  });
  return prompt;
}
```

### Step 5: Adaptar o formulario para receber dados existentes

```typescript
type PromptFormProps = {
  prompt?: Prompt | null;
};

export function PromptForm({ prompt }: PromptFormProps) {
  // Usar prompt para preencher defaultValues quando existir
  // Reutilizar o mesmo form de criacao
}
```

### Step 6: Rodar o teste novamente — iterar

Cada execucao do teste revela o proximo ponto de falha. Implementar apenas o suficiente para avancar para o proximo erro.

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste falha por 404 | Crie a rota/pagina |
| Teste falha por campo nao visivel | Ajuste o formulario para receber props |
| Teste falha por metodo inexistente | Adicione o metodo na interface e implementacao |
| Teste falha por timeout do servidor | Reinicie o Next.js dev server, nao e falha do teste |
| Feature de edicao e igual a criacao | Reutilize o formulario, adicione props opcionais |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar pagina, rota e server action antes do teste | Escreva o teste completo primeiro |
| Criar formulario separado para edicao | Reutilize o form de criacao com props opcionais |
| Tipar params como objeto simples `{ id: string }` | Use `Promise<{ id: string }>` (Next.js 15+) |
| Ignorar falha de teste por timeout do servidor | Identifique se a falha e do teste ou da infra |
| Criar todos os metodos do repository de uma vez | Adicione metodos conforme os testes exigem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-tdd-com-testes-e-2-e/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-tdd-com-testes-e-2-e/references/code-examples.md)
