---
name: rs-node-js-2023-caso-de-uso-de-perfil
description: "Applies the Get User Profile use case pattern when building user profile retrieval in Node.js with SOLID principles. Use when user asks to 'create a profile use case', 'get user profile', 'fetch logged user data', or 'implement user profile endpoint'. Enforces ID-based lookup, generic ResourceNotFoundError, repository interface extension, and unit test coverage. Make sure to use this skill whenever implementing profile retrieval or similar find-by-id use cases. Not for authentication flows, JWT handling, or HTTP controller creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [profile, find-by-id, resource-not-found, repository-pattern, solid, use-case]
---

# Caso de Uso de Perfil

> Use cases de consulta por ID seguem o padrao: receber ID, buscar no repositorio, validar existencia com erro generico, retornar entidade.

## Rules

1. **Sempre use ID como identificador** — `userId` nao `email`, porque o ID e a unica informacao garantida apos autenticacao e nunca muda
2. **Crie erros genericos para verificacoes comuns** — `ResourceNotFoundError` nao `UserDoesNotExistError`, porque verificacoes de existencia repetem em quase todos os use cases e raramente sao acionadas por uso legitimo
3. **Estenda a interface do repositorio antes de implementar** — adicione `findById` na interface, depois implemente no in-memory e no Prisma, porque o contrato vem primeiro
4. **Reaproveite logica entre metodos do repositorio** — `findById` e `findByEmail` sao estruturalmente identicos, mude apenas o campo de comparacao
5. **Foque em use cases e testes antes de controllers** — construa a camada de dominio completa antes de ir para a camada de infra (HTTP, banco), porque isso permite validar regras de negocio isoladamente
6. **Teste o caminho feliz E o caminho de erro** — todo use case de consulta precisa de teste de sucesso e teste com ID inexistente

## How to write

### Interface do repositorio

```typescript
// Adicione findById ao lado de findByEmail na interface
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
```

### Erro generico reutilizavel

```typescript
// src/use-cases/errors/resource-not-found-error.ts
export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found.')
  }
}
```

### Use case de perfil

```typescript
interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
```

### In-memory repository (findById)

```typescript
async findById(id: string) {
  const user = this.items.find((item) => item.id === id)
  if (!user) {
    return null
  }
  return user
}
```

## Example

**Before (erro especifico para cada entidade):**
```typescript
// Criando erros separados para cada verificacao de existencia
throw new UserDoesNotExistError()
throw new GymDoesNotExistError()
throw new CheckInDoesNotExistError()
```

**After (erro generico reutilizavel):**
```typescript
// Um unico erro para todas as verificacoes de existencia
throw new ResourceNotFoundError()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case recebe dados do usuario logado | Use `userId` (do token), nunca email |
| Verificacao de existencia em use case de consulta | Use `ResourceNotFoundError` generico |
| Novo metodo necessario no repositorio | Adicione na interface primeiro, depois implemente |
| Use case simples sem regra de negocio complexa | Implemente mesmo assim — mantem consistencia arquitetural |
| Camada HTTP ainda nao existe | Nao se preocupe, foque no use case + teste unitario |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findByEmail(email)` para perfil logado | `findById(userId)` |
| `throw new UserNotFoundError()` por entidade | `throw new ResourceNotFoundError()` generico |
| Use case sem teste de ID inexistente | Teste com ID invalido esperando `ResourceNotFoundError` |
| Controller antes do use case | Use case + teste unitario primeiro |
| Copiar findByEmail sem reaproveitar estrutura | Reaproveitar logica, trocando apenas o campo comparado |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-perfil/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-perfil/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
