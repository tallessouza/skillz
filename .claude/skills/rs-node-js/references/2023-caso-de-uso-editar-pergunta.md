---
name: rs-node-js-2023-editar-pergunta
description: "Applies Edit use case pattern with authorization check when implementing DDD use cases in Node.js. Use when user asks to 'create an edit use case', 'implement update entity', 'add authorization to use case', or 'write edit functionality with ownership check'. Ensures author-only editing, repository save method, and proper unit testing. Make sure to use this skill whenever building CRUD use cases that require ownership validation in Clean Architecture. Not for database migrations, API controllers, or frontend form handling."
---

# Caso de Uso: Editar Entidade (Edit Use Case Pattern)

> Ao criar um caso de uso de edicao, valide autoria antes de modificar, altere apenas campos com setters explicitos, e salve via metodo dedicado no repositorio.

## Rules

1. **Valide existencia antes de editar** — busque a entidade pelo ID e lance erro se nao encontrada, porque editar algo inexistente causa erros silenciosos
2. **Valide autoria (authorId)** — compare o authorId do request com o authorId da entidade, lance "Not allowed" se diferente, porque apenas o autor pode editar seu proprio conteudo
3. **Altere apenas campos com setter definido** — so modifique propriedades que possuem `set` na entidade, porque isso garante que a entidade controla quais campos sao mutaveis
4. **Crie metodo `save` separado de `create`** — no repositorio, `save` atualiza uma entidade existente substituindo no indice encontrado, `create` insere nova, porque sao operacoes semanticamente diferentes
5. **Separe edicao de campos de regras de negocio complexas** — campos como `bestAnswerId` devem ter caso de uso proprio, porque escolher melhor resposta nao acontece no momento de editar pergunta
6. **Teste o caminho feliz e o caminho de autorizacao** — no minimo: editar com autor correto (sucesso) e editar com autor diferente (erro), porque autorizacao e a regra de negocio principal deste caso de uso

## How to write

### Caso de uso de edicao

```typescript
interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId, title, content }: EditQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
  }
}
```

### Metodo save no repositorio in-memory

```typescript
async save(question: Question): Promise<void> {
  const itemIndex = this.items.findIndex((item) => item.id === question.id)

  this.items[itemIndex] = question
}
```

### Interface do repositorio

```typescript
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>  // novo metodo
}
```

## Example

**Before (sem validacao de autoria):**
```typescript
async execute({ questionId, title, content }) {
  const question = await this.questionsRepository.findById(questionId)
  question.title = title
  question.content = content
  await this.questionsRepository.save(question)
}
```

**After (com validacao completa):**
```typescript
async execute({ authorId, questionId, title, content }) {
  const question = await this.questionsRepository.findById(questionId)

  if (!question) {
    throw new Error('Question not found.')
  }

  if (question.authorId.toString() !== authorId) {
    throw new Error('Not allowed.')
  }

  question.title = title
  question.content = content

  await this.questionsRepository.save(question)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| CRUD de entidade com dono | Sempre exigir authorId e validar autoria |
| Campo que envolve regra de negocio complexa | Criar caso de uso separado (ex: chooseBestAnswer) |
| Repositorio so tem create/delete | Adicionar metodo `save` para update |
| Teste de edicao | Usar `toMatchObject` para verificar apenas campos alterados |
| Entidade tem campos imutaveis | Nao expor setter na entidade, o use case nem tenta alterar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `repository.create(question)` para update | `repository.save(question)` |
| Editar sem verificar existencia | `if (!question) throw new Error(...)` |
| Editar sem verificar autoria | `if (question.authorId !== authorId) throw ...` |
| Um caso de uso que edita tudo incluindo bestAnswer | Casos de uso separados por responsabilidade |
| `repository.update(id, { title })` com partial | Buscar entidade, mutar via setter, salvar inteira |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-editar-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-editar-pergunta/references/code-examples.md)
