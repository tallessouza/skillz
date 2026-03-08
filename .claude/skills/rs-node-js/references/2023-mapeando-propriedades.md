---
name: rs-node-js-2023-mapeando-propriedades
description: "Enforces correct property mapping in DDD entities when designing domain models in TypeScript/Node.js. Use when user asks to 'create an entity', 'map properties', 'design a domain model', 'add fields to entity', or 'model a class with DDD'. Applies rules: IDs use value objects not strings, createdAt is required, updatedAt is optional for edit-tracking, relationships use typed IDs. Make sure to use this skill whenever creating or modifying domain entities. Not for database schemas, DTOs, or API response types."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-entities
  tags: [ddd, entity, value-objects, unique-entity-id, domain-model, typescript, property-mapping]
---

# Mapeando Propriedades de Entidades DDD

> Propriedades de entidades devem refletir o dominio com tipos semanticos — IDs tipados, datas obrigatorias e campos opcionais quando o dominio permite ausencia.

## Rules

1. **IDs de relacao usam Value Objects, nunca strings** — `authorId: UniqueEntityId` nao `authorId: string`, porque o tipo garante consistencia e validacao em todo o dominio
2. **createdAt e sempre obrigatorio** — toda entidade precisa de data de criacao porque ordenacao temporal e auditoria sao requisitos universais
3. **updatedAt e opcional** — representa edicao explicita do usuario, nao atualizacao tecnica, porque a interface precisa mostrar "editado" apenas quando houve edicao real
4. **Campos opcionais refletem regras de dominio** — `bestAnswerId?: UniqueEntityId` e opcional porque nem toda pergunta tem melhor resposta, nao por preguica de implementar
5. **Mapeie incrementalmente** — comece com propriedades principais, adicione campos complexos (tags, anexos) quando os conceitos necessarios estiverem prontos
6. **Propriedades contam a historia do dominio** — cada campo deve ter justificativa de negocio clara (ex: updatedAt existe para mostrar que resposta foi editada)

## How to write

### Props interface com IDs tipados

```typescript
interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}
```

### Entidade com campo opcional de relacionamento

```typescript
interface QuestionProps {
  title: string
  content: string
  slug: string
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}
```

## Example

**Before (IDs como strings, sem datas):**
```typescript
interface AnswerProps {
  authorId: string
  questionId: string
  content: string
}
```

**After (com esta skill aplicada):**
```typescript
interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade e um ID de outra entidade | Use `UniqueEntityId`, nunca `string` |
| Campo pode nao existir no momento da criacao | Marque como opcional com `?` |
| Campo e necessario para ordenacao ou auditoria | `createdAt: Date` obrigatorio |
| Campo indica acao do usuario (edicao) | `updatedAt?: Date` opcional |
| Relacionamento 1:1 opcional (ex: melhor resposta) | `bestAnswerId?: UniqueEntityId` |
| Propriedade envolve conceito nao modelado ainda | Deixe para depois, mapeie incrementalmente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `authorId: string` | `authorId: UniqueEntityId` |
| `questionId: string` | `questionId: UniqueEntityId` |
| Entidade sem `createdAt` | Sempre inclua `createdAt: Date` |
| `updatedAt: Date` (obrigatorio) | `updatedAt?: Date` (opcional) |
| Todos os campos de uma vez | Mapeie incrementalmente por conceito |
| Campo opcional sem justificativa de dominio | Documente por que o campo pode ser ausente |

## Troubleshooting

### ID de relacionamento definido como string ao inves de UniqueEntityId
**Symptom:** Comparacoes de ID falham silenciosamente ou retornam false inesperadamente
**Cause:** `authorId: string` perde a semantica e metodos de comparacao do Value Object
**Fix:** Use `authorId: UniqueEntityId` e compare com `.equals()` em vez de `===`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
