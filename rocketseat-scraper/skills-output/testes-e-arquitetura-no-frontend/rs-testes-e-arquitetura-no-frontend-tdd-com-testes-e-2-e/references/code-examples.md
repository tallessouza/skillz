# Code Examples: TDD com Testes E2E

## Teste E2E completo da aula

```typescript
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

test('edicao de prompt via UI com sucesso', async ({ page }) => {
  // Setup: conexao direta com o banco
  const prisma = new PrismaClient({
    adapter: new PrismaPG(process.env.DATABASE_URL)
  });

  const now = Date.now();
  const originalTitle = `e2e edit original ${now}`;
  const originalContent = `e2e edit original content ${now}`;
  const updatedTitle = `e2e edit updated ${now}`;
  const updatedContent = `e2e edit updated content ${now}`;

  // Criar prompt no banco para ter algo para editar
  const created = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    }
  });

  await prisma.$disconnect();

  // Navegar para pagina de edicao
  await page.goto(`/created/${created.id}`);

  // Verificar que o placeholder esta visivel
  await expect(page.getByPlaceholder('titulo do prompt')).toBeVisible();

  // Preencher novos valores
  await page.fill('input[name="title"]', updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);

  // Clicar em salvar
  await page.getByRole('button', { name: 'salvar' }).click();

  // Aguardar toast de sucesso
  await page.waitForSelector(
    'text=Prompt atualizado com sucesso',
    { state: 'visible', timeout: 15000 }
  );

  // Verificar que os dados foram atualizados
  await expect(
    page.getByRole('heading', { name: updatedTitle })
  ).toBeVisible();

  await expect(
    page.locator('input[name="title"]')
  ).toHaveValue(updatedTitle);
});
```

## Pagina dinamica de edicao

```typescript
// app/created/[id]/page.tsx
import { PrismaPromptRepository } from '@/infra/prisma-prompt-repository';
import { prisma } from '@/lib/prisma';
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

## Interface do repository com findById

```typescript
// domain/prompt-repository.ts
export interface PromptRepository {
  create(data: CreatePromptData): Promise<Prompt>;
  findByTitle(title: string): Promise<Prompt | null>;
  findById(id: string): Promise<Prompt | null>; // NOVO
}
```

## Implementacao do findById

```typescript
// infra/prisma-prompt-repository.ts
async findById(id: string): Promise<Prompt | null> {
  const prompt = await this.prisma.prompt.findUnique({
    where: { id }
  });
  return prompt;
}
```

## Formulario adaptado para criacao e edicao

```typescript
// components/prompt-form.tsx
import { Prompt } from '@/domain/prompt';

type PromptFormProps = {
  prompt?: Prompt | null;
};

export function PromptForm({ prompt }: PromptFormProps) {
  // prompt undefined/null = modo criacao
  // prompt com dados = modo edicao (campos pre-preenchidos)
  return (
    <form>
      <input
        name="title"
        placeholder="titulo do prompt"
        defaultValue={prompt?.title ?? ''}
      />
      <textarea
        name="content"
        defaultValue={prompt?.content ?? ''}
      />
      <button type="submit">salvar</button>
    </form>
  );
}
```

## Padrao de nomes unicos em testes E2E

```typescript
// Usar Date.now() para evitar colisao entre execucoes paralelas
const now = Date.now();
const originalTitle = `e2e edit original ${now}`;
const updatedTitle = `e2e edit updated ${now}`;
```

## Verificacao com toHaveValue vs toBeVisible

```typescript
// toBeVisible: verifica que o elemento esta na tela
await expect(page.getByPlaceholder('titulo do prompt')).toBeVisible();

// toHaveValue: verifica o VALOR de um input (mais preciso para forms)
await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle);
```