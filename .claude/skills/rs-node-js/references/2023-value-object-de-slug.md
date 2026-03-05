---
name: rs-node-js-2023-value-object-de-slug
description: "Applies Value Object pattern for properties with independent business rules in DDD entities. Use when user asks to 'create a slug', 'normalize a string', 'implement value object', 'extract property logic', or designs domain entities with complex field validation. Enforces separation of field-specific business rules into dedicated classes with factory methods and direct constructors. Make sure to use this skill whenever implementing DDD entities with properties that have their own validation or transformation logic. Not for simple DTOs, database schemas, or generic string utilities."
---

# Value Object de Slug

> Propriedades de entidades que possuem regras de negocio proprias devem ser extraidas em Value Objects — classes separadas com logica isolada e reutilizavel.

## Rules

1. **Extraia propriedades com regras proprias em Value Objects** — se um campo tem validacao, formatacao ou transformacao, ele merece uma classe separada, porque isso evita que a entidade acumule logica que nao pertence a ela
2. **Ofereça dois caminhos de criacao** — factory method (`createFromText`) para dados novos e constructor direto para dados ja persistidos, porque criacao e reconstituicao tem regras diferentes
3. **Value Object substitui o tipo primitivo na entidade** — use `slug: Slug` nao `slug: string`, porque o sistema de tipos passa a garantir que o valor ja foi validado
4. **Nao transforme tudo em Value Object** — so extraia quando ha codigo significativo agregado ou potencial de reuso entre entidades, porque Value Objects triviais adicionam complexidade sem beneficio
5. **Teste Value Objects isoladamente** — eles sao unidades independentes com logica propria, porque erros em regex ou normalizacao so aparecem com testes dedicados

## How to write

### Estrutura do Value Object

```typescript
export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalizes it as a slug.
   *
   * @example "An Example Title" => "an-example-title"
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
```

### Uso na entidade

```typescript
// Nas props da entidade, use o Value Object como tipo
interface QuestionProps {
  title: string
  slug: Slug
  content: string
}

// Criacao nova (gera slug a partir do titulo)
const question = Question.create({
  title: 'Example Title',
  slug: Slug.createFromText('Example Title'),
  content: '...',
})

// Reconstituicao do banco (slug ja existe)
const question = Question.create({
  title: saved.title,
  slug: new Slug(saved.slug),
  content: saved.content,
})
```

## Example

**Before (logica misturada na entidade):**
```typescript
export class Question extends Entity<QuestionProps> {
  get slug(): string {
    return this.props.slug
  }

  constructor(props: { title: string; slug?: string }) {
    // Toda logica de slug dentro da entidade
    const slug = props.slug ?? props.title
      .normalize('NFKD').toLowerCase().trim()
      .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    super({ ...props, slug })
  }
}
```

**After (Value Object extraido):**
```typescript
// value-objects/slug.ts
export class Slug {
  public value: string
  private constructor(value: string) { this.value = value }
  static createFromText(text: string): Slug { /* normalizacao */ }
}

// entities/question.ts — limpa, sem logica de slug
export class Question extends Entity<QuestionProps> {
  get slug(): Slug { return this.props.slug }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Campo tem validacao + formatacao + transformacao | Extrair em Value Object |
| Campo e string simples sem regras | Manter como primitivo |
| Mesma logica de campo aparece em 2+ entidades | Value Object com reuso |
| Slug vem do banco (ja formatado) | Constructor direto (`new Slug(value)`) |
| Slug vem de input do usuario | Factory method (`Slug.createFromText(text)`) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `slug: string` na entidade com regras | `slug: Slug` usando Value Object |
| Logica de normalizacao dentro do constructor da entidade | Factory method estatico no Value Object |
| Value Object para campos triviais sem regras | Manter como tipo primitivo |
| Um unico caminho de criacao para dados novos e persistidos | Factory method + constructor separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-value-object-de-slug/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-value-object-de-slug/references/code-examples.md)
