---
name: rs-full-stack-array-2
description: "Enforces correct TypeScript array typing patterns when declaring or working with arrays. Use when user asks to 'create an array', 'type a list', 'declare a collection', or writes TypeScript code involving arrays. Applies type annotation syntax (string[], number[]) and leverages type inference when values are assigned. Make sure to use this skill whenever generating TypeScript code with arrays. Not for object typing, tuple typing, or generic collection patterns."
---

# Tipagem em Arrays no TypeScript

> Ao declarar arrays, use anotacao de tipo (`string[]`, `number[]`) quando o conteudo nao e obvio, e inferencia quando os valores ja deixam o tipo claro.

## Rules

1. **Use colchetes apos o tipo para arrays** — `string[]` nao `Array<string>`, porque e mais conciso e idiomatico no ecossistema Skillz/TypeScript moderno
2. **Anote o tipo quando o array comeca vazio ou o conteudo nao e obvio** — `let names: string[] = []`, porque sem anotacao o TypeScript infere `never[]`
3. **Deixe o TypeScript inferir quando os valores sao atribuidos imediatamente** — `let products = ["X", "Y"]` ja e tipado como `string[]`, porque a anotacao seria redundante
4. **Nunca misture tipos sem uniao explicita** — se o array aceita string e number, declare `(string | number)[]`, porque TypeScript bloqueia insercoes invalidas

## How to write

### Anotacao de tipo (Type Annotation)

```typescript
let names: string[] = ["Rodrigo", "Mayk"]
let numbers: number[] = [1, 2, 3, 4, 5]
let active: boolean[] = [true, false, true]
```

### Inferencia de tipo

```typescript
// TypeScript infere string[] automaticamente
let products = ["Product x", "Product y", "Product z"]
```

## Example

**Before (sem tipagem, array vazio perigoso):**
```typescript
let users = []
users.push("Ana")
users.push(42) // nenhum erro, mas bug silencioso
```

**After (com anotacao de tipo):**
```typescript
let users: string[] = []
users.push("Ana")
users.push(42) // ERRO: Argument of type 'number' is not assignable to parameter of type 'string'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Array inicializado com valores | Deixe inferir — `let items = [1, 2, 3]` |
| Array vazio | Anote — `let items: number[] = []` |
| Parametro de funcao | Sempre anote — `function sum(numbers: number[])` |
| Retorno de funcao | Anote se nao for obvio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `let items: Array<string>` | `let items: string[]` |
| `let items = []` (sem tipo) | `let items: string[] = []` |
| `let items: any[]` | `let items: string[]` (tipo especifico) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando anotar vs inferir, analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-array-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-array-2/references/code-examples.md)
