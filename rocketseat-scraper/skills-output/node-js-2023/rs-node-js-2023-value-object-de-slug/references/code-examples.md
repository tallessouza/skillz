# Code Examples: Value Object de Slug

## Implementacao completa do Slug

```typescript
// src/domain/forum/enterprise/entities/value-objects/slug.ts

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
      .normalize('NFKD')       // Decompoe caracteres Unicode (remove acentos)
      .toLowerCase()            // Tudo minusculo
      .trim()                   // Remove espacos nas bordas
      .replace(/\s+/g, '-')    // Espacos em branco → hifen
      .replace(/[^\w-]+/g, '') // Remove tudo que nao e palavra ou hifen
      .replace(/_/g, '-')      // Underlines → hifen
      .replace(/--+/g, '-')    // Hifens duplicados → hifen unico
      .replace(/-$/g, '')      // Remove hifen no final

    return new Slug(slugText)
  }
}
```

## Detalhamento das regex

| Regex | O que faz | Exemplo |
|-------|-----------|---------|
| `/\s+/g` | Pega todos espacos em branco (1 ou mais) | `"hello world"` → match: `" "` |
| `/[^\w-]+/g` | Pega tudo que NAO e palavra ou hifen | `"hello@world!"` → match: `"@"`, `"!"` |
| `/_/g` | Pega underlines | `"hello_world"` → match: `"_"` |
| `/--+/g` | Pega dois ou mais hifens consecutivos | `"hello--world"` → match: `"--"` |
| `/-$/g` | Pega hifen no final da string | `"hello-"` → match: `"-"` |

## Integracao com a entidade Question

```typescript
// src/domain/forum/enterprise/entities/question.ts

interface QuestionProps {
  title: string
  slug: Slug       // Tipo Slug, nao string
  content: string
  authorId: UniqueEntityID
}

export class Question extends Entity<QuestionProps> {
  get slug(): Slug {
    return this.props.slug
  }

  // ... outros getters
}
```

## Dois modos de uso

```typescript
// 1. Criando uma pergunta NOVA (slug gerado do titulo)
const newQuestion = Question.create({
  title: 'Como configurar ESLint no Node.js?',
  slug: Slug.createFromText('Como configurar ESLint no Node.js?'),
  content: 'Estou tentando configurar...',
  authorId: new UniqueEntityID('author-1'),
})
// slug.value => "como-configurar-eslint-no-nodejs"

// 2. Reconstituindo do banco de dados (slug ja existe)
const existingQuestion = Question.create({
  title: dbRow.title,
  slug: new Slug(dbRow.slug),  // Ja formatado, sem transformacao
  content: dbRow.content,
  authorId: new UniqueEntityID(dbRow.author_id),
})
```

## Teste unitario

```typescript
// src/domain/forum/enterprise/entities/value-objects/slug.spec.ts

import { expect, test } from 'vitest'
import { Slug } from './slug'

test('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')
})

// Testes adicionais recomendados:

test('should handle accented characters', () => {
  const slug = Slug.createFromText('Configuração de autenticação')
  expect(slug.value).toEqual('configuracao-de-autenticacao')
})

test('should handle special characters', () => {
  const slug = Slug.createFromText('What is Node.js? A guide!')
  expect(slug.value).toEqual('what-is-nodejs-a-guide')
})

test('should handle multiple spaces', () => {
  const slug = Slug.createFromText('  multiple   spaces  ')
  expect(slug.value).toEqual('multiple-spaces')
})

test('should handle underscores', () => {
  const slug = Slug.createFromText('snake_case_title')
  expect(slug.value).toEqual('snake-case-title')
})
```

## Exemplo de reuso entre entidades

```typescript
// O mesmo Value Object pode ser usado em Answer
interface AnswerProps {
  content: string
  slug: Slug  // Reutiliza o mesmo Value Object
  authorId: UniqueEntityID
  questionId: UniqueEntityID
}

export class Answer extends Entity<AnswerProps> {
  get slug(): Slug {
    return this.props.slug
  }
}
```