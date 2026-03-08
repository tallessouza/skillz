---
name: 2023-entidades-e-casos-de-uso
description: "Defines DDD fundamentals: entities as nouns from domain expert conversations, use cases as verbs connecting entities, with zero external dependencies in the domain layer. Use when user asks to 'create an entity', 'write a use case', 'model domain objects', 'start DDD structure', or 'separate domain from infrastructure'. Make sure to use this skill whenever creating the initial domain layer structure with entities and use cases in a Node.js/TypeScript project. Not for infrastructure code, HTTP controllers, or database repository implementations."
category: coding-lens
tags: [ddd, entities, prisma, typescript, use-cases]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-fundamentos
  tags: [ddd, entities, use-cases, domain, linguagem-ubiqua, typescript]
---

# Entidades e Casos de Uso (DDD)

> Entidades sao substantivos extraidos da conversa com experts de dominio; casos de uso sao os verbos que conectam essas entidades.

## Rules

1. **Dominio zero dependencias externas** — a pasta `domain/` nao importa frameworks, ORMs, HTTP, ou banco de dados, porque o codigo deve ser portavel entre aplicacoes
2. **Entidades vem de substantivos** — identifique palavras-chave palpaveis na conversa com experts: "aluno", "duvida", "instrutor" viram classes/tipos, porque DDD traduz linguagem ubiqua em codigo
3. **Casos de uso vem de verbos** — "responder alunos", "criar topico", "selecionar resposta" viram use cases, porque representam acoes que conectam entidades
4. **Nao pense em tabelas** — ao criar uma entidade, nao associe mentalmente com tabela no banco, porque entidade representa um conceito de dominio com identidade propria
5. **Implemente com o que fizer sentido** — DDD nao exige OOP nem funcional; use classes, tipos puros, ou o que o projeto adotar, porque DDD e sobre modelagem, nao paradigma
6. **Estrutura inicial: entities/ e use-cases/** — dentro de `src/domain/`, separe entidades dos casos de uso em pastas distintas, porque facilita navegacao e responsabilidade

## How to write

### Entidade basica

```typescript
// src/domain/entities/student.ts
// Entidade pura — sem imports de framework ou banco
export class Student {
  constructor(
    public name: string,
    public email: string,
  ) {}
}
```

### Caso de uso basico

```typescript
// src/domain/use-cases/answer-question.ts
// Caso de uso = verbo que conecta entidades
export class AnswerQuestionUseCase {
  execute(instructorId: string, questionId: string, content: string) {
    // Logica de dominio pura
    // Sem acesso direto a banco, HTTP, ou framework
  }
}
```

### Estrutura de pastas

```
src/
  domain/
    entities/
      instructor.ts
      student.ts
      question.ts
    use-cases/
      answer-question.ts
```

## Example

**Before (acoplado a infraestrutura):**
```typescript
import { PrismaClient } from '@prisma/client'

export class Question {
  private prisma = new PrismaClient()

  async create(title: string, body: string) {
    return this.prisma.question.create({ data: { title, body } })
  }
}
```

**After (dominio puro):**
```typescript
// Entidade
export class Question {
  constructor(
    public title: string,
    public content: string,
    public authorId: string,
  ) {}
}

// Caso de uso separado
export class CreateQuestionUseCase {
  execute(title: string, content: string, authorId: string) {
    const question = new Question(title, content, authorId)
    return question
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Conversando com expert e ouve substantivo recorrente | Candidate a entidade |
| Conversando com expert e ouve verbo de acao | Candidate a caso de uso |
| Tentando importar ORM na entidade | Pare — entidade e dominio puro |
| Nao sabe se e entidade ou valor | Se tem identidade propria e ciclo de vida, e entidade |
| Projeto novo, nao sabe por onde comecar | Comece por `src/domain/entities/` e `src/domain/use-cases/` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Importar Prisma/TypeORM dentro de entity | Manter entidade 100% pura |
| Pensar "essa entidade e a tabela X" | Pensar "essa entidade representa o conceito X" |
| Colocar logica HTTP dentro do use case | Use case recebe dados puros, retorna dados puros |
| Criar entidade sem conversar sobre o dominio | Extrair entidades da linguagem ubiqua |
| Misturar entities e use-cases na mesma pasta | Separar em `entities/` e `use-cases/` |

## Troubleshooting

### Entidade importa Prisma ou outro ORM diretamente
**Symptom:** Entidade de dominio tem `import { PrismaClient }` ou dependencia de framework
**Cause:** Mistura da camada de dominio com camada de infraestrutura — entidade deve ser pura
**Fix:** Remova todas as importacoes de frameworks/ORMs da pasta `domain/` — acesso a banco fica em repositorios na camada de infraestrutura

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
