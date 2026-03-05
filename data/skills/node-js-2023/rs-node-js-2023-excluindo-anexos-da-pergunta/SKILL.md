---
name: rs-node-js-2023-excluindo-anexos-pergunta
description: "Enforces cascade deletion pattern through repository dependency injection in DDD aggregates. Use when user asks to 'delete an entity with children', 'cascade delete', 'remove parent and related entities', 'clean up attachments on delete', or implements aggregate root deletion. Applies repository-depends-on-repository pattern for consistent data cleanup. Make sure to use this skill whenever implementing delete operations on aggregate roots that own child entities. Not for simple CRUD without relationships, database-level cascade configs, or ORM cascade annotations."
---

# Cascade Delete via Repository Dependency Injection

> Quando um agregado e deletado, o repositorio do agregado deve orquestrar a remocao de todas entidades filhas atraves de inversao de dependencia entre repositorios.

## Rules

1. **Repositorio do agregado recebe repositorios filhos no construtor** — `QuestionsRepository` recebe `QuestionAttachmentsRepository`, porque a responsabilidade de manter consistencia pertence ao repositorio do agregado raiz
2. **Crie metodos `deleteManyByParentId` nos repositorios filhos** — `deleteManyByQuestionId(questionId)`, porque a operacao de limpeza precisa ser atomica e reutilizavel
3. **Chame a limpeza dentro do metodo `delete` do repositorio pai** — porque garante que toda exclusao do agregado limpa automaticamente os filhos, sem depender do caso de uso lembrar
4. **Use inversao de dependencia entre repositorios, nao entre caso de uso e repositorio filho** — o caso de uso chama `questionsRepository.delete()`, nao `questionAttachmentsRepository.deleteManyByQuestionId()`, porque o caso de uso nao deve conhecer detalhes internos do agregado
5. **Atualize todos os locais que instanciam o repositorio pai** — ao adicionar dependencia no construtor, todos os testes e consumers precisam passar o novo repositorio

## How to write

### Repositorio filho com deleteManyByParentId

```typescript
// InMemoryQuestionAttachmentsRepository
async deleteManyByQuestionId(questionId: string) {
  const questionAttachments = this.items.filter(
    (item) => item.questionId.toString() !== questionId,
  )
  this.items = questionAttachments
}
```

### Repositorio pai recebendo dependencia

```typescript
// InMemoryQuestionsRepository
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)
    // Cascade: limpa entidades filhas
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
```

## Example

**Before (delete sem cascade — anexos orfaos permanecem):**
```typescript
// InMemoryQuestionsRepository
async delete(question: Question) {
  const itemIndex = this.items.findIndex((item) => item.id === question.id)
  this.items.splice(itemIndex, 1)
  // Anexos ficam orfaos no QuestionAttachmentsRepository
}
```

**After (delete com cascade via DI entre repositorios):**
```typescript
// InMemoryQuestionsRepository
constructor(
  private questionAttachmentsRepository: QuestionAttachmentsRepository,
) {}

async delete(question: Question) {
  const itemIndex = this.items.findIndex((item) => item.id === question.id)
  this.items.splice(itemIndex, 1)
  this.questionAttachmentsRepository.deleteManyByQuestionId(
    question.id.toString(),
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Deletando aggregate root que possui entidades filhas | Injete repositorio filho no repositorio pai e chame cascade no delete |
| InMemory para testes | Mesmo pattern — garante que testes validam cascade |
| Migrando para banco real | Mesmo pattern se aplica na camada de infraestrutura |
| Caso de uso so precisa chamar `repository.delete()` | Correto — cascade e responsabilidade do repositorio, nao do use case |
| Adicionou dependencia no construtor do repositorio | Atualize TODOS os locais que instanciam esse repositorio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useCase` chama `attachmentsRepo.deleteMany()` direto | `questionsRepo.delete(question)` que internamente faz cascade |
| Deletar pai sem limpar filhos | Sempre cascade via repositorio |
| Duplicar logica de cascade em cada caso de uso | Centralizar no metodo `delete` do repositorio pai |
| Esquecer de atualizar outros testes ao adicionar dependencia | Buscar todos os `new InMemoryQuestionsRepository` e passar o novo param |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
