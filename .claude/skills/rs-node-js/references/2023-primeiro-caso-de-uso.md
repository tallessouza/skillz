---
name: rs-node-js-2023-primeiro-caso-de-uso
description: "Enforces DDD entity and use case implementation patterns in TypeScript/Node.js projects. Use when user asks to 'create an entity', 'implement a use case', 'write a domain class', 'add a new feature with DDD', or 'structure domain layer'. Applies rules: entities are not database tables, IDs optional in constructors for reference vs creation, use cases as classes with single execute method, named parameters via interfaces, tests from the start. Make sure to use this skill whenever implementing domain layer code in Node.js/TypeScript. Not for infrastructure, database schemas, or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-entities-use-cases
  tags: [ddd, entity, use-case, domain, typescript, solid, srp, uuid]
---

# Primeiro Caso de Uso — Entidades e Use Cases em DDD

> Implemente entidades e casos de uso como classes simples, comecando pelo minimo necessario e evoluindo com o conhecimento adquirido.

## Rules

1. **Entidades nao sao tabelas** — desconecte entidades de tabelas no banco de dados, porque varias entidades podem mapear para uma unica tabela ou nem existir no banco
2. **Comece pelo minimo** — crie entidades apenas com os campos que voce conhece agora, porque software e um organismo vivo e vai evoluir
3. **ID opcional no constructor** — se passado, cria referencia para entidade existente; se omitido, gera UUID novo com `randomUUID()`, porque a mesma classe serve para criar e referenciar
4. **Use case = uma classe, um metodo** — seguindo SRP do SOLID, cada caso de uso tem apenas `execute()` (ou `handle`), porque cada arquivo contem a rotina de um unico caso de uso
5. **Parametros nomeados via interface** — crie uma interface `{UseCaseName}Request` para os parametros do `execute()`, porque parametros posicionais sao ilegíveis
6. **Teste desde o comeco** — escreva testes unitarios junto com a implementacao, porque testes guiam o desenvolvimento da aplicacao

## How to write

### Entidade basica

```typescript
import { randomUUID } from 'node:crypto'

export class Question {
  public id: string
  public title: string
  public content: string

  constructor(title: string, content: string, id?: string) {
    this.id = id ?? randomUUID()
    this.title = title
    this.content = content
  }
}
```

### Use case com parametros nomeados

```typescript
interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer(content, instructorId, questionId)
    return answer
  }
}
```

### Teste unitario desde o inicio

```typescript
import { test, expect } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'

test('create an answer', () => {
  const answerQuestion = new AnswerQuestionUseCase()

  const answer = answerQuestion.execute({
    content: 'Nova resposta',
    questionId: '1',
    instructorId: '2',
  })

  expect(answer.content).toEqual('Nova resposta')
})
```

## Example

**Before (sem DDD, pensando em tabelas):**
```typescript
// Misturando dominio com persistencia
function answerQuestion(instructorId: string, questionId: string, content: string) {
  return db.answers.create({ instructor_id: instructorId, question_id: questionId, content })
}
```

**After (com DDD, dominio puro):**
```typescript
interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer(content, instructorId, questionId)
    return answer
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando entidade nova do zero | Nao passe ID no constructor (sera gerado) |
| Referenciando entidade existente | Passe o ID no constructor |
| Use case recebe 2+ parametros | Crie interface `{Name}Request` com parametros nomeados |
| Entidades parecidas (pergunta/resposta) | Mantenha separadas no dominio, decisao de tabela e da infra |
| Nao sabe todos os campos ainda | Comece com o minimo, evolua depois |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `execute(instructorId, questionId)` (posicional) | `execute({ instructorId, questionId })` (nomeado) |
| Pensar "essa entidade = essa tabela" | Entidades representam conceitos do dominio |
| Criar entidade com todos os campos possiveis | Comece com os campos que voce conhece agora |
| Use case com multiplos metodos publicos | Um use case = um metodo `execute` |
| ID sempre obrigatorio no constructor | ID opcional: omitido = novo, passado = referencia |
| Implementar sem teste | Escreva o teste junto com a implementacao |

## Troubleshooting

### Use case com multiplos metodos publicos
**Symptom:** A classe do use case tem metodos como `create()`, `validate()`, `notify()` alem de `execute()`
**Cause:** Violacao do SRP — cada use case deve ter apenas um metodo publico
**Fix:** Mantenha apenas `execute()` como metodo publico. Metodos auxiliares devem ser privados ou extraidos para outros use cases

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
