---
name: rs-full-stack-como-extender-interfaces
description: "Enforces TypeScript interface extension patterns when writing typed code. Use when user asks to 'create an interface', 'define types', 'share properties between types', 'extend a type', or 'avoid duplicate properties'. Applies DRY principle to interfaces via extends keyword, extracting common properties into base interfaces. Make sure to use this skill whenever creating multiple interfaces with shared properties. Not for generic types, utility types, or class inheritance."
---

# Como Estender Interfaces

> Extraia propriedades comuns em uma interface base e use `extends` para reutiliza-las, eliminando duplicacao e propagando mudancas automaticamente.

## Rules

1. **Identifique propriedades duplicadas entre interfaces** — se duas ou mais interfaces compartilham campos identicos (`id`, `name`, etc.), extraia-os para uma interface base, porque duplicacao causa inconsistencia quando uma muda e a outra nao
2. **Use `extends` para herdar propriedades** — `interface Child extends Parent` herda todas as propriedades do Parent, porque mudancas no Parent refletem automaticamente em todos os filhos
3. **Mantenha apenas propriedades especificas na interface filha** — a interface filha so declara o que e unico dela, porque propriedades herdadas ja existem via `extends`
4. **Adicione propriedades na base quando sao comuns** — ao adicionar um campo compartilhado (ex: `email`), adicione na interface base para refletir em todas as filhas automaticamente
5. **Nomeie a interface base pelo conceito compartilhado** — `Person` para Teacher/Student, `Vehicle` para Car/Truck, porque o nome deve representar a abstracao comum

## How to write

### Extraindo interface base

```typescript
// Propriedades comuns vao para a interface base
interface Person {
  id: number
  name: string
}

// Cada interface filha so declara o que e unico
interface Teacher extends Person {
  subjects: string[]
}

interface Student extends Person {
  age: number
}
```

### Usando as interfaces estendidas

```typescript
// Teacher tem: id, name, subjects
let teacher: Teacher = { id: 1, name: "Rodrigo", subjects: ["JavaScript", "TypeScript"] }

// Student tem: id, name, age
let student: Student = { id: 2, name: "João", age: 23 }
```

## Example

**Before (propriedades duplicadas):**
```typescript
interface Teacher {
  id: number
  name: string
  subjects: string[]
}

interface Student {
  id: number
  name: string
  age: number
}
```

**After (com extends):**
```typescript
interface Person {
  id: number
  name: string
}

interface Teacher extends Person {
  subjects: string[]
}

interface Student extends Person {
  age: number
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 2+ interfaces com campos identicos | Extraia para interface base com `extends` |
| Nova propriedade comum a todos os filhos | Adicione na interface base |
| Propriedade so existe em um tipo | Mantenha na interface filha |
| Muitos niveis de heranca (3+) | Considere composicao em vez de heranca profunda |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Mesmos campos copiados em N interfaces | Interface base + `extends` |
| Comentar campos herdados dentro da filha | Remova-os — `extends` ja os inclui |
| Interface base com propriedades especificas de um filho | Mantenha so o que e comum a todos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias com OOP e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes