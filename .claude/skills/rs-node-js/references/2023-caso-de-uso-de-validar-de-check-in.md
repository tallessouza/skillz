---
name: rs-node-js-2023-validar-check-in
description: "Enforces the validate check-in use case pattern following SOLID and repository pattern in Node.js. Use when user asks to 'create a validation use case', 'implement check-in validation', 'write a save/update method in repository', or 'test use case with in-memory repository'. Applies rules: reuse existing repository, add findById and save methods, validate resource existence before mutation, test both return value and repository state. Make sure to use this skill whenever implementing validation/update use cases in Node.js with repository pattern. Not for HTTP controllers, Prisma implementation, or route definitions."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [validate, check-in, findById, save, repository-pattern, in-memory, solid]
---

# Caso de Uso de Validar Check-in

> Ao implementar um caso de uso de validacao/atualizacao, reutilize o repositorio existente, adicione apenas os metodos necessarios (findById, save), e valide a existencia do recurso antes de qualquer mutacao.

## Rules

1. **Reutilize o repositorio existente** — nao crie um novo repositorio para cada caso de uso, adicione metodos ao que ja existe, porque o repositorio representa a entidade e nao o caso de uso
2. **Sempre valide existencia antes de mutar** — busque com `findById`, lance erro se nulo, so entao atualize, porque mutacoes em recursos inexistentes causam bugs silenciosos
3. **Separe create de save (update)** — `create` insere novo registro, `save` atualiza existente, porque sao operacoes semanticamente distintas no repositorio
4. **findById retorna null, nao undefined** — normalize o retorno do `find` nativo para `null` quando nao encontrar, porque a interface do repositorio deve ser consistente
5. **Teste tanto o retorno quanto o estado do repositorio** — valide que o retorno do use case tem os dados corretos E que o repositorio in-memory foi realmente atualizado, porque um pode passar sem o outro
6. **Teste o caso negativo com rejects/toBeInstanceOf** — valide que recursos inexistentes lancam o erro tipado correto, porque garante que a validacao de existencia funciona

## How to write

### Use case de validacao/atualizacao

```typescript
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
```

### Metodo save no in-memory repository

```typescript
async save(checkIn: CheckIn) {
  const checkInIndex = this.items.findIndex(
    (item) => item.id === checkIn.id,
  )

  if (checkInIndex >= 0) {
    this.items[checkInIndex] = checkIn
  }

  return checkIn
}
```

### Metodo findById no in-memory repository

```typescript
async findById(id: string) {
  const checkIn = this.items.find((item) => item.id === id)

  if (!checkIn) {
    return null
  }

  return checkIn
}
```

## Example

**Before (sem padrao de validacao):**
```typescript
async execute({ checkInId }) {
  // Muta direto sem verificar existencia
  await this.checkInsRepository.update(checkInId, {
    validated_at: new Date(),
  })
}
```

**After (com validacao e save):**
```typescript
async execute({ checkInId }) {
  const checkIn = await this.checkInsRepository.findById(checkInId)

  if (!checkIn) {
    throw new ResourceNotFoundError()
  }

  checkIn.validated_at = new Date()
  await this.checkInsRepository.save(checkIn)

  return { checkIn }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo caso de uso na mesma entidade | Adicione metodos ao repositorio existente, nao crie novo |
| Precisa atualizar campo de entidade | Busque com findById, mute o objeto, salve com save |
| findIndex retorna -1 | Verifique `>= 0` antes de atualizar o array |
| Teste de caso de uso de update | Crie o recurso no repositorio ANTES de chamar o use case |
| Validar que teste realmente funciona | Use expect no retorno E no estado interno do repositorio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `repository.update(id, data)` sem verificar existencia | `findById` + verificar null + mutar + `save` |
| `find()` retornando `undefined` na interface | Normalize para `null` no repositorio |
| Testar apenas o retorno do use case | Testar retorno + `repository.items[0]` |
| Criar repositorio novo para cada use case | Reutilizar repositorio da entidade |
| `if (checkInIndex !== -1)` | `if (checkInIndex >= 0)` — mais idiomatico |

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

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-validar-de-check-in/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-validar-de-check-in/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
