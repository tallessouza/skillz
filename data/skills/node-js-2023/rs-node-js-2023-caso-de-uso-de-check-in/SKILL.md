---
name: rs-node-js-2023-caso-de-uso-de-check-in
description: "Enforces use case and in-memory repository patterns when building Node.js features with SOLID principles. Use when user asks to 'create a use case', 'write a check-in feature', 'implement repository pattern', 'write unit tests for use cases', or 'setup in-memory testing'. Applies rules: use case receives IDs and delegates to repository, in-memory repos use randomUUID, Prisma UncheckedCreateInput for existing relationships, always await expect with rejects. Make sure to use this skill whenever creating new use cases, repositories, or unit tests in a SOLID Node.js project. Not for HTTP controllers, route definitions, or database migrations."
---

# Caso de Uso de Check-in (Use Case + Repository + Test Pattern)

> Cada caso de uso recebe IDs primitivos, delega ao repositorio, e retorna a entidade criada — comece simples, adicione regras de negocio incrementalmente.

## Rules

1. **Use case recebe apenas IDs primitivos** — `userId`, `gymId`, nao objetos completos, porque o use case decide o que buscar e validar
2. **Comece pelo caminho feliz** — implemente create basico primeiro, adicione validacoes depois, porque testes incrementais garantem que cada regra e testavel isoladamente
3. **Use UncheckedCreateInput quando relacionamentos ja existem** — `Prisma.CheckInUncheckedCreateInput` aceita `user_id` e `gym_id` direto, sem precisar conectar entidades, porque no check-in usuario e academia ja foram criados antes
4. **In-memory repos usam randomUUID** — `randomUUID()` de `node:crypto`, nunca IDs fixos como `'user-1'`, porque IDs unicos evitam colisoes entre testes
5. **Campos opcionais tem fallback explicito** — `data.validatedAt ? new Date(data.validatedAt) : null`, porque garante tipo consistente (Date | null) no array in-memory
6. **Sempre `await` no `expect` com promises** — `await expect(promise).rejects.toBeInstanceOf(Error)`, porque sem await o teste pode passar sem esperar a resolucao, gerando falsos positivos

## How to write

### Use case structure

```typescript
interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Regras de negocio vao aqui (incrementalmente)

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }
}
```

### Repository interface

```typescript
import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
```

### In-memory repository

```typescript
import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)
    return checkIn
  }
}
```

## Example

**Before (erros comuns):**
```typescript
// ID fixo no in-memory — colisao entre testes
const user = { id: 'user-1', ...data }

// CreateInput ao inves de UncheckedCreateInput — exige connect
create(data: Prisma.CheckInCreateInput) // { user: { connect: { id } } }

// Sem await no expect — falso positivo
expect(promise).rejects.toBeInstanceOf(Error)
```

**After (com esta skill aplicada):**
```typescript
// randomUUID para cada entidade
const user = { id: randomUUID(), ...data }

// UncheckedCreateInput — aceita IDs diretos
create(data: Prisma.CheckInUncheckedCreateInput) // { user_id, gym_id }

// Await garante que a promise e resolvida antes da assertion
await expect(promise).rejects.toBeInstanceOf(Error)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case cria entidade com relacionamentos existentes | Use `UncheckedCreateInput` |
| Use case cria entidade E relacionamento juntos | Use `CreateInput` com connect/create |
| Campo opcional no in-memory | Fallback explicito: `data.field ? new Date(data.field) : null` |
| Teste usa `.rejects` ou `.resolves` | Sempre coloque `await` antes do `expect` |
| Novo use case sendo criado | Comece com create basico, adicione regras depois |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `id: 'user-1'` no in-memory | `id: randomUUID()` |
| `import { randomUUID } from 'crypto'` | `import { randomUUID } from 'node:crypto'` |
| `expect(asyncFn()).rejects...` sem await | `await expect(asyncFn()).rejects...` |
| Use case recebendo objeto User completo | Use case recebendo `userId: string` |
| Todas as regras de negocio no primeiro commit | Comece simples, adicione incrementalmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
