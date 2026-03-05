# Code Examples: Separando Regras de Negocio

## Exemplo completo passo a passo

### 1. Entidade de dominio (ja existia)

```typescript
// src/core/domain/prompts/prompt.entity.ts
export interface Prompt {
  id: string
  title: string
  content: string
}
```

### 2. Interface do Repository

```typescript
// src/core/domain/prompts/prompt.repository.ts
import { Prompt } from './prompt.entity'

export interface PromptRepository {
  findMany(): Promise<Prompt[]>
  searchMany(term: string | undefined): Promise<Prompt[]>
}
```

### 3. Use Case

```typescript
// src/core/application/prompts/search-prompts.use-case.ts
import { PromptRepository } from '@/core/domain/prompts/prompt.repository'

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

### 4. Implementacao concreta com Prisma

```typescript
// src/infra/repository/prisma.prompt.repository.ts
import { PrismaClient } from '@prisma/client'
import { Prompt } from '@/core/domain/prompts/prompt.entity'
import { PromptRepository } from '@/core/domain/prompts/prompt.repository'

export class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(): Promise<Prompt[]> {
    const prompts = await this.prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return prompts
  }

  async searchMany(term: string | undefined): Promise<Prompt[]> {
    const query = term?.trim() || ''
    if (!query) {
      return this.findMany()
    }
    const prompts = await this.prisma.prompt.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
    return prompts
  }
}
```

### 5. Composicao na Server Action

```typescript
// src/app/actions.ts
import { prisma } from '@/lib/prisma'
import { PrismaPromptRepository } from '@/infra/repository/prisma.prompt.repository'
import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case'

export async function searchAction(formData: FormData) {
  const term = formData.get('q') as string

  const repository = new PrismaPromptRepository(prisma)
  const useCase = new SearchPromptsUseCase(repository)
  const results = await useCase.execute(term)

  return results
}
```

## Codigo ANTES da refatoracao (acoplado)

```typescript
// Tudo na server action — Prisma direto, logica de where misturada
export async function searchAction(formData: FormData) {
  const q = formData.get('q') as string

  const prompts = await prisma.prompt.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, content: true },
  })

  return prompts
}
```

## Variacao: Adicionando novo metodo ao repository

Quando precisar de `findById`, o processo e:

```typescript
// 1. Adicionar na interface
export interface PromptRepository {
  findMany(): Promise<Prompt[]>
  searchMany(term: string | undefined): Promise<Prompt[]>
  findById(id: string): Promise<Prompt | null>  // novo
}

// 2. Implementar no PrismaPromptRepository
async findById(id: string): Promise<Prompt | null> {
  return this.prisma.prompt.findUnique({ where: { id } })
}

// 3. Criar novo Use Case se necessario
export class GetPromptByIdUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(id: string) {
    return this.promptRepository.findById(id)
  }
}
```

## Variacao: Repository in-memory para testes

```typescript
export class InMemoryPromptRepository implements PromptRepository {
  private prompts: Prompt[] = []

  async findMany(): Promise<Prompt[]> {
    return this.prompts
  }

  async searchMany(term: string | undefined): Promise<Prompt[]> {
    if (!term) return this.prompts
    return this.prompts.filter(
      p => p.title.includes(term) || p.content.includes(term)
    )
  }

  // Helper para testes
  addPrompt(prompt: Prompt) {
    this.prompts.push(prompt)
  }
}
```