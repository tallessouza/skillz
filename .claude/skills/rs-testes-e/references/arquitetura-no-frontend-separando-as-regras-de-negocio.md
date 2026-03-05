---
name: rs-testes-arq-frontend-separando-regras
description: "Enforces Clean Architecture separation with Use Cases and Repository Pattern in TypeScript/Next.js applications. Use when user asks to 'create a use case', 'implement repository pattern', 'decouple business logic', 'apply dependency inversion', or 'separate concerns'. Applies rules: use cases orchestrate domain logic via interfaces, repositories implement data access behind contracts, server actions stay thin. Make sure to use this skill whenever structuring business logic in frontend or fullstack TypeScript projects. Not for simple CRUD without business rules, or pure backend API design."
---

# Separando Regras de Negocio — Clean Architecture no Frontend

> Regras de negocio vivem em Use Cases que dependem de interfaces (contratos), nunca de implementacoes concretas.

## Rules

1. **Use Case = uma regra de negocio** — cada Use Case tem um unico metodo `execute()`, porque isso torna a leitura explicita: `useCase.execute(params)`
2. **Use Case nunca conhece infraestrutura** — recebe um Repository (interface) via construtor, porque isso permite trocar Prisma por qualquer implementacao sem tocar na regra de negocio
3. **Repository e uma interface no dominio** — definida em `core/domain/{entity}/`, porque o contrato pertence ao dominio, nao a infraestrutura
4. **Implementacao concreta fica em `infra/`** — `PrismaPromptRepository` implementa `PromptRepository`, porque separa o "o que" do "como"
5. **Server Actions ficam finas** — instanciam repository, criam use case, executam e retornam, porque a action nao e lugar para logica de negocio
6. **Metodos do repository podem diferir do ORM** — `searchMany` nao existe no Prisma, mas existe no contrato, porque a interface modela o dominio, nao o banco

## How to write

### Estrutura de pastas

```
src/
├── core/
│   ├── domain/
│   │   └── prompts/
│   │       ├── prompt.entity.ts        # Entidade de dominio
│   │       └── prompt.repository.ts    # Interface (contrato)
│   └── application/
│       └── prompts/
│           └── search-prompts.use-case.ts  # Regra de negocio
└── infra/
    └── repository/
        └── prisma.prompt.repository.ts     # Implementacao concreta
```

### Interface do Repository

```typescript
// core/domain/prompts/prompt.repository.ts
export interface PromptRepository {
  findMany(): Promise<Prompt[]>
  searchMany(term: string | undefined): Promise<Prompt[]>
}
```

### Use Case

```typescript
// core/application/prompts/search-prompts.use-case.ts
export class SearchPromptsUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(term?: string) {
    if (!term) {
      return this.promptRepository.findMany()
    }
    return this.promptRepository.searchMany(term)
  }
}
```

### Implementacao concreta

```typescript
// infra/repository/prisma.prompt.repository.ts
export class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(): Promise<Prompt[]> {
    return this.prisma.prompt.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async searchMany(term: string | undefined): Promise<Prompt[]> {
    const query = term?.trim() || ''
    if (!query) return this.findMany()
    return this.prisma.prompt.findMany({
      where: { OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ]},
      orderBy: { createdAt: 'desc' },
    })
  }
}
```

### Composicao na Server Action

```typescript
// app/actions.ts
const repository = new PrismaPromptRepository(prisma)
const useCase = new SearchPromptsUseCase(repository)
const results = await useCase.execute(term)
```

## Example

**Before (acoplado):**
```typescript
async function searchAction(formData: FormData) {
  const q = formData.get('q') as string
  const prompts = await prisma.prompt.findMany({
    where: q ? { OR: [
      { title: { contains: q } },
      { content: { contains: q } },
    ]} : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return prompts.map(p => ({ id: p.id, title: p.title, content: p.content }))
}
```

**After (desacoplado):**
```typescript
async function searchAction(formData: FormData) {
  const term = formData.get('q') as string
  const repository = new PrismaPromptRepository(prisma)
  const useCase = new SearchPromptsUseCase(repository)
  return useCase.execute(term)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Logica usa ORM diretamente na action/route | Extraia para Use Case + Repository |
| Metodo do ORM nao expressa bem a intencao | Crie metodo semantico na interface (`searchMany` em vez de `findMany` com where) |
| Use Case precisa de dois repositories | Receba ambos no construtor |
| Regra de negocio e trivial (apenas findById) | Ainda use o pattern — facilita testes futuros |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `prisma.prompt.findMany()` dentro de server action | `useCase.execute()` na action, prisma no repository |
| Use Case importando `PrismaClient` | Use Case recebendo `PromptRepository` (interface) |
| Interface do repository em `infra/` | Interface em `core/domain/` |
| Metodo `execute` recebendo `FormData` | `execute` recebe tipos primitivos (string, number) |
| Repository sem interface | Sempre defina o contrato antes da implementacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-separando-as-regras-de-negocio/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-separando-as-regras-de-negocio/references/code-examples.md)
