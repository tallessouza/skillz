---
name: rs-full-stack-inferencia-tipagem-explicita
description: "Enforces correct use of TypeScript type inference versus explicit typing when writing TypeScript code. Use when user asks to 'create a variable', 'declare a type', 'write TypeScript', or any TS code generation task. Applies rules: use inference when value is assigned at declaration, use explicit typing when declaring without assignment. Make sure to use this skill whenever generating TypeScript variable declarations. Not for JavaScript-only projects, runtime type checking, or Zod/io-ts schema validation."
---

# Inferência de Tipos e Tipagem Explícita

> Ao declarar variáveis TypeScript, use tipagem explícita quando não há valor inicial e inferência quando o valor já está presente na declaração.

## Rules

1. **Use tipagem explícita quando declarar sem valor** — `let name: string` não `let name`, porque sem valor o TypeScript não tem como deduzir o tipo e a variável fica como `any`
2. **Deixe o TypeScript inferir quando atribuir valor na declaração** — `let message = "Oi"` não `let message: string = "Oi"`, porque a anotação é redundante e adiciona ruído visual
3. **Confie na inferência para constantes com valor literal** — `const count = 42` não `const count: number = 42`, porque o TypeScript infere o tipo automaticamente a partir do valor
4. **Use tipagem explícita em assinaturas de função** — parâmetros e retorno de funções devem ter tipos explícitos, porque não há valor inicial para inferir

## How to write

### Declaração sem valor (tipagem explícita obrigatória)
```typescript
let userName: string
let age: number
let isActive: boolean
```

### Declaração com valor (inferência)
```typescript
let message = "Oi, tudo bem?"
const maxRetries = 3
const isEnabled = true
```

## Example

**Before (redundância desnecessária):**
```typescript
let message: string = "Oi, tudo bem?"
const count: number = 42
const isValid: boolean = true
let name: string
name = "Rodrigo"
```

**After (com esta skill aplicada):**
```typescript
let message = "Oi, tudo bem?"      // inferência — valor presente
const count = 42                    // inferência — valor presente
const isValid = true                // inferência — valor presente
let name: string                    // explícito — sem valor inicial
name = "Rodrigo"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| `let` sem valor inicial | Tipagem explícita obrigatória |
| `let` ou `const` com valor literal | Deixar TypeScript inferir |
| Parâmetros de função | Tipagem explícita |
| Retorno de função complexo | Tipagem explícita |
| Retorno de função óbvio (one-liner) | Inferência é aceitável |
| Destructuring de API response | Tipagem explícita no tipo do response |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `let msg: string = "hello"` | `let msg = "hello"` |
| `const n: number = 10` | `const n = 10` |
| `let data` (sem tipo, sem valor) | `let data: string` (tipo explícito) |
| `const flag: boolean = true` | `const flag = true` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada abordagem e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações