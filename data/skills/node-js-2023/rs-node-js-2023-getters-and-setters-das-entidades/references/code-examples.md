# Code Examples: Getters & Setters em Entidades DDD

## Answer — Entidade completa com getters, setters e touch()

```typescript
export class Answer extends Entity<AnswerProps> {
  // === GETTERS (todas as propriedades legiveis) ===

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // === GETTER COMPUTADO (nao existe nas props) ===

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  // === SETTER (apenas content e modificavel) ===

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  // === METODO PRIVADO ===

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityID) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return answer
  }
}
```

### Por que authorId e questionId nao tem setter?

Nao faz sentido mudar o autor de uma resposta nem a pergunta associada. Essas relacoes sao imutaveis apos criacao.

### Por que updatedAt nao tem setter?

A data de edicao e atualizada automaticamente via `touch()` — nunca diretamente pelo codigo externo.

---

## Question — Entidade com slug automatico e bestAnswerId

```typescript
export class Question extends Entity<QuestionProps> {
  // === GETTERS ===

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // === GETTER COMPUTADO ===

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  // === SETTERS ===

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  // === METODO PRIVADO ===

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return question
  }
}
```

### Detalhe: slug opcional no create()

O slug esta em `Optional<QuestionProps, 'createdAt' | 'slug'>`. Se nao fornecido, e gerado automaticamente a partir do titulo:

```typescript
slug: props.slug ?? Slug.createFromText(props.title)
```

### Detalhe: setter de title atualiza slug

```typescript
set title(title: string) {
  this.props.title = title
  this.props.slug = Slug.createFromText(title)  // efeito colateral
  this.touch()
}
```

Isso garante consistencia entre titulo e slug sem depender de codigo externo.

### Detalhe: bestAnswerId com undefined

Setters no TypeScript nao aceitam parametro opcional (`bestAnswerId?: ...`), entao o tipo e `UniqueEntityID | undefined` — aceita undefined explicitamente.

---

## Exemplo de validacao em setter (conceitual)

```typescript
// O instrutor mostrou como exemplo, mas removeu por nao fazer sentido neste dominio
set content(content: string) {
  if (content.length > 2400) {
    throw new Error('Invalid content length')
  }
  this.props.content = content
  this.touch()
}
```

Use este padrao quando houver regra de negocio real (ex: bio com limite de caracteres, titulo obrigatorio com minimo de 3 caracteres).

---

## Uso externo — como a entidade e consumida

```typescript
const question = Question.create({
  title: 'Como usar DDD com Node.js?',
  content: 'Estou estudando DDD e quero aplicar...',
  authorId: new UniqueEntityID('author-1'),
})

// Getter simples
console.log(question.title)     // "Como usar DDD com Node.js?"
console.log(question.slug)      // Slug gerado automaticamente

// Getter computado
console.log(question.isNew)     // true (criada agora)
console.log(question.excerpt)   // "Estou estudando DDD e quero aplicar..."

// Setter com efeito colateral
question.title = 'Novo titulo sobre DDD'
console.log(question.slug)      // Slug atualizado automaticamente

// Propriedades imutaveis — nao tem setter
// question.authorId = '...'    // ERRO: nao existe setter
// question.createdAt = '...'   // ERRO: nao existe setter
```