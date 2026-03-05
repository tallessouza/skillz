---
name: rs-node-js-2023-mapeando-relacionamentos
description: "Enforces correct entity relationship mapping in DDD when writing domain entities or modeling a system. Use when user asks to 'create an entity', 'model a domain', 'map relationships', 'design entities', or 'implement DDD'. Applies rules: relate by ID only, never assume DB structure from domain, separate similar entities by ubiquitous language, resist premature DRY. Make sure to use this skill whenever designing domain layers or creating entity classes. Not for database schema design, ORM configuration, or infrastructure layer code."
---

# Mapeando Relacionamentos entre Entidades (DDD)

> Relacionamentos entre entidades sao mapeados exclusivamente por IDs, sem assumir estrutura de persistencia.

## Rules

1. **Relacione entidades apenas por ID** — `authorId: string`, `questionId: string`, nunca por referencia direta ao objeto, porque a camada de dominio nao conhece o banco de dados
2. **Dominio NAO espelha banco** — duas entidades com ID de relacionamento podem virar uma unica tabela, ou tabelas separadas, ou documentos, ou grafos, porque a persistencia e decisao da camada de infraestrutura
3. **Entidades distintas para atores distintos** — `Student` e `Instructor` sao entidades separadas mesmo com campos identicos, porque a linguagem ubiqua os distingue e regras de negocio divergem no futuro
4. **DRY com cuidado** — codigo semelhante entre entidades NAO justifica unificacao prematura, porque regras de negocio especificas surgem por ator (limites de resposta, permissao de anexos)
5. **Use Props interface no construtor** — agrupe propriedades obrigatorias em uma interface `{Entity}Props` para clareza na criacao de instancias
6. **Traduza a linguagem ubiqua** — se o expert de dominio diz "instrutor respondeu aluno", o codigo tem `Instructor` e `Student`, nunca um generico `User`

## How to write

### Entidade com relacionamento por ID

```typescript
interface QuestionProps {
  authorId: string
  title: string
  content: string
}

export class Question {
  public id: string
  public authorId: string
  public title: string
  public content: string

  constructor(props: QuestionProps, id?: string) {
    this.authorId = props.authorId
    this.title = props.title
    this.content = props.content
    this.id = id ?? randomUUID()
  }
}
```

### Entidade com multiplos relacionamentos

```typescript
interface AnswerProps {
  authorId: string
  questionId: string
  content: string
}

export class Answer {
  public id: string
  public authorId: string
  public questionId: string
  public content: string

  constructor(props: AnswerProps, id?: string) {
    this.authorId = props.authorId
    this.questionId = props.questionId
    this.content = props.content
    this.id = id ?? randomUUID()
  }
}
```

## Example

**Before (unificacao prematura):**
```typescript
// "Student e Instructor sao iguais, vou criar User"
export class User {
  public id: string
  public name: string
}

// Caso de uso generico para ambos
export class AnswerQuestion {
  execute(userId: string, questionId: string) { /* ... */ }
}
```

**After (entidades separadas pela linguagem ubiqua):**
```typescript
export class Student {
  public id: string
  public name: string
}

export class Instructor {
  public id: string
  public name: string
}

// Casos de uso separados — regras diferentes por ator
export class AnswerQuestionByInstructor {
  execute(instructorId: string, questionId: string) {
    // Instrutor pode anexar arquivos
  }
}

export class AnswerQuestionByStudent {
  execute(studentId: string, questionId: string) {
    // Aluno tem limite de 3 respostas/dia, sem anexos
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas entidades com campos identicos mas atores diferentes | Mantenha separadas — regras divergem no futuro |
| Entidade precisa referenciar outra | Use apenas o ID (`authorId`, `questionId`) |
| Tentacao de criar classe base generica (`User`) | Pergunte: o expert de dominio usa esse termo? Se nao, nao crie |
| Definindo estrutura de entidade | Crie interface `{Entity}Props` para o construtor |
| Pensando em como salvar no banco | PARE — isso e decisao da camada de infraestrutura |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `public author: Student` (referencia direta) | `public authorId: string` (apenas ID) |
| `class User` quando existem Student e Instructor | `class Student` + `class Instructor` separados |
| Um caso de uso generico para atores com regras diferentes | Casos de uso separados por ator |
| Construtor com N parametros posicionais | Interface `Props` com objeto nomeado |
| Modelar entidade pensando nas tabelas do banco | Modelar pela linguagem ubiqua do dominio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
