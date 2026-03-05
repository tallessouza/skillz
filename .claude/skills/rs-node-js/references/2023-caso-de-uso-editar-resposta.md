---
name: rs-node-js-2023-editar-resposta
description: "Applies DDD use case pattern for editing entities with author-based authorization in Node.js. Use when user asks to 'edit an entity', 'create update use case', 'implement edit feature', or 'add authorization to updates'. Enforces pattern: validate author ownership, fetch by ID, mutate allowed fields only, save via repository, return updated entity. Make sure to use this skill whenever implementing edit/update use cases in DDD or Clean Architecture projects. Not for creating new entities, deleting, or read-only queries."
---

# Caso de Uso: Editar Entidade (Padrao DDD)

> Ao implementar um caso de uso de edicao, valide autoria, mute apenas campos permitidos, salve via repositorio e retorne a entidade atualizada.

## Rules

1. **Valide autoria antes de mutar** — compare `authorId` do request com o da entidade persistida, porque permite curto-circuito antes de qualquer mutacao
2. **Mute apenas campos editaveis** — Answer nao tem titulo, Question tem; cada entidade define seus campos mutaveis, porque expor campos imutaveis gera bugs silenciosos
3. **Retorne a entidade editada** — o caso de uso sempre retorna a entidade apos edicao, porque o chamador precisa do estado atualizado sem query extra
4. **Repositorio precisa de save()** — alem de findById e create, implemente save() que faz update por index, porque edicao requer persistencia de mutacao
5. **Reutilize estrutura de casos de uso similares** — copie EditQuestion para EditAnswer e adapte campos, porque DDD preza consistencia entre use cases do mesmo agregado

## How to write

### Caso de uso de edicao

```typescript
interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    answer.content = content

    await this.answersRepository.save(answer)

    return { answer }
  }
}
```

### Metodo save no repositorio in-memory

```typescript
async save(answer: Answer): Promise<void> {
  const itemIndex = this.items.findIndex((item) => item.id === answer.id)
  this.items[itemIndex] = answer
}
```

## Example

**Before (sem retorno, sem autorizacao):**
```typescript
async execute({ answerId, content }) {
  const answer = await this.answersRepository.findById(answerId)
  answer.content = content
  await this.answersRepository.save(answer)
}
```

**After (com autorizacao e retorno):**
```typescript
async execute({ authorId, answerId, content }) {
  const answer = await this.answersRepository.findById(answerId)

  if (!answer) throw new Error('Answer not found.')
  if (authorId !== answer.authorId.toString()) throw new Error('Not allowed.')

  answer.content = content
  await this.answersRepository.save(answer)

  return { answer }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Entidade nao tem campo (ex: Answer sem titulo) | Remova do request e da mutacao |
| Caso de uso similar ja existe (EditQuestion) | Copie e adapte via find-replace |
| Repositorio nao tem save() | Implemente antes do use case |
| Teste de edicao | Crie entidade, execute use case, assert campos mutados |
| Teste de autorizacao | Passe authorId diferente, expect throw |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Editar sem checar autoria | Valide `authorId === entity.authorId` antes de mutar |
| Retornar void no edit | Retorne `{ entity }` para o chamador |
| Expor campos imutaveis no request | Liste apenas campos editaveis na interface |
| Implementar save() como create() | save() faz update por index no array |
| Criar use case do zero quando similar existe | Copie, find-replace nome da entidade, ajuste campos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-editar-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-editar-resposta/references/code-examples.md)
