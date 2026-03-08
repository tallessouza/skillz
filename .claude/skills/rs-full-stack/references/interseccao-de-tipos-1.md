---
name: rs-full-stack-interseccao-de-tipos-1
description: "Enforces TypeScript type intersection patterns when composing or extending types. Use when user asks to 'create a type', 'extend a type', 'combine types', 'reuse type properties', or 'share common fields between types'. Applies the & operator to compose base types with specific properties instead of duplicating fields. Make sure to use this skill whenever defining related types that share common properties. Not for union types (|), generics, or class inheritance with extends."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-fundamentals
  tags: [typescript, types, intersection, composition, reuse]
---

# Intersecção de Tipos

> Ao definir tipos relacionados que compartilham propriedades, extraia o comum em um type base e use `&` para compor tipos específicos.

## Rules

1. **Extraia propriedades comuns em um type base** — `type Person = { id: number, name: string }` em vez de repetir `id` e `name` em cada tipo, porque duplicação gera divergência quando um campo muda
2. **Use `&` para compor tipos específicos** — `type Teacher = Person & { subjects: string[] }` porque o operador `&` une todos os campos de ambos os tipos em um só
3. **Mantenha no tipo específico apenas o que é exclusivo dele** — se `id` e `name` existem em Person, Teacher só declara `subjects`, porque isso torna explícito o que diferencia cada entidade
4. **Prefira intersecção sobre duplicação** — mesmo para 2 tipos, extraia o base, porque o terceiro tipo que compartilhar os mesmos campos já estará coberto

## How to write

### Type base com propriedades comuns

```typescript
type Person = {
  id: number
  name: string
}
```

### Tipos específicos via intersecção

```typescript
type Teacher = Person & {
  subjects: string[]
}

type Student = Person & {
  age: number
}
```

### Uso das variáveis tipadas

```typescript
let teacher: Teacher
// teacher tem: id, name, subjects

let student: Student
// student tem: id, name, age
```

## Example

**Before (propriedades duplicadas):**

```typescript
type Teacher = {
  id: number
  name: string
  subjects: string[]
}

type Student = {
  id: number
  name: string
  age: number
}
```

**After (intersecção com type base):**

```typescript
type Person = {
  id: number
  name: string
}

type Teacher = Person & {
  subjects: string[]
}

type Student = Person & {
  age: number
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| 2+ tipos compartilham 2+ campos | Extrair type base e usar `&` |
| Tipo específico tem apenas 1 campo extra | Ainda vale intersecção — clareza sobre duplicação |
| Campos comuns podem mudar no futuro | Intersecção garante mudança em um só lugar |
| Hierarquia profunda (A & B & C) | Compor em cadeia é válido, mas mantenha legível |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Campos `id` e `name` repetidos em 3 tipos | Um `type Base` com `&` nos específicos |
| `type Teacher = { id: number, name: string, subjects: string[] }` duplicando Person | `type Teacher = Person & { subjects: string[] }` |
| Interface vazia só para "herdar" | Intersecção direta com `&` sem intermediários vazios |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Tipo resultante da intersecção tem campos `never` | Campos com tipos incompatíveis entre os tipos combinados (ex: `string & number`) | Verifique se os tipos base não têm campos com o mesmo nome mas tipos diferentes |
| Autocomplete não mostra campos do tipo base | IDE pode não resolver `&` automaticamente em todos os contextos | Extraia o tipo interseccionado em um `type` alias e use-o explicitamente |
| Erro "Type is not assignable" ao atribuir objeto literal | Objeto literal tem campos extras que não existem na intersecção | Remova campos extras ou use `as` assertion se necessário |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre intersecção vs duplicação e quando usar `&` vs `extends`
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações