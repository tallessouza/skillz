---
name: rs-node-js-2023-getters-setters-entidades
description: "Enforces DDD getter/setter patterns when writing TypeScript entity classes. Use when user asks to 'create an entity', 'add getters', 'implement domain model', 'write a class with properties', or 'design an aggregate'. Applies rules: getters for all readable props, setters only when needed, private touch() for updatedAt, computed properties via getters, validation inside setters. Make sure to use this skill whenever generating DDD entities or domain classes. Not for DTOs, database models, or simple data objects without behavior."
---

# Getters & Setters em Entidades DDD

> Getters e setters sao portas de entrada e saida da entidade — protegem propriedades, validam dados e adicionam comportamento.

## Rules

1. **Crie getters para todas as propriedades legiveis** — porque propriedades privadas so devem ser expostas de forma controlada
2. **Nao crie setters por padrao** — comece sem nenhum setter e adicione apenas quando um caso de uso exigir modificacao daquela propriedade
3. **Valide dentro do setter** — regras de negocio como limite de caracteres pertencem ao setter, porque e a porta de entrada do dado
4. **Use getters para propriedades computadas** — crie getters que retornam valores calculados mesmo que nao existam nas props da entidade (ex: `isNew`, `excerpt`)
5. **Atualize updatedAt via metodo privado `touch()`** — nunca exponha updatedAt como setter publico, porque a data de edicao deve ser automatica
6. **Setters podem disparar efeitos colaterais** — como atualizar o slug ao mudar o titulo, porque comportamento encapsulado e a razao de existir do setter

## How to write

### Getters para todas as propriedades

```typescript
get content() {
  return this.props.content
}

get createdAt() {
  return this.props.createdAt
}

get updatedAt() {
  return this.props.updatedAt
}
```

### Getter computado (propriedade que nao existe nas props)

```typescript
get isNew(): boolean {
  return dayjs().diff(this.createdAt, 'days') <= 3
}

get excerpt() {
  return this.content.substring(0, 120).trimEnd().concat('...')
}
```

### Setter com efeito colateral

```typescript
set title(title: string) {
  this.props.title = title
  this.props.slug = Slug.createFromText(title)
  this.touch()
}
```

### Metodo touch() privado

```typescript
private touch() {
  this.props.updatedAt = new Date()
}
```

## Example

**Before (propriedades publicas, sem controle):**

```typescript
class Answer {
  public content: string
  public authorId: string
  public updatedAt: Date

  update(content: string) {
    this.content = content
    this.updatedAt = new Date()
  }
}
// Problema: qualquer codigo externo faz answer.authorId = 'outro'
```

**After (com getters/setters controlados):**

```typescript
class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
  // Sem setter para authorId — autor nunca muda
  // Sem setter para updatedAt — atualizado via touch()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Propriedade nunca muda apos criacao (authorId, createdAt) | Apenas getter, sem setter |
| Propriedade precisa ser editavel (content, title) | Getter + setter com touch() |
| Propriedade derivada de outras (excerpt, isNew) | Getter computado, sem prop correspondente |
| updatedAt | Nunca setter publico, sempre via touch() privado |
| Slug depende do titulo | Atualizar slug dentro do setter de title |
| Propriedade opcional na criacao (slug) | Gerar automaticamente no constructor se nao fornecida |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `public content: string` (propriedade publica) | `get content() { return this.props.content }` |
| `answer.updatedAt = new Date()` (setter externo) | `private touch() { this.props.updatedAt = new Date() }` |
| Setter para authorId ou questionId | Apenas getter — relacoes imutaveis |
| Criar todos os setters de uma vez | Adicionar setters sob demanda, conforme casos de uso |
| Validacao de content fora da entidade | Validar dentro do setter: `if (content.length > 2400) throw` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-getters-and-setters-das-entidades/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-getters-and-setters-das-entidades/references/code-examples.md)
