---
name: rs-full-stack-null-e-undefined
description: "Enforces correct usage of null and undefined in TypeScript code. Use when user asks to 'declare variables', 'handle null checks', 'initialize values', 'check if value exists', or 'create objects with optional properties'. Applies rules: undefined means unassigned, null means intentional absence, always use null for explicit emptiness. Make sure to use this skill whenever generating TypeScript code that deals with absent or optional values. Not for error handling, exception throwing, or type narrowing with discriminated unions."
---

# Null e Undefined no TypeScript

> Use `undefined` para valores ainda nao atribuidos e `null` para ausencia intencional de valor — nunca confunda os dois.

## Rules

1. **`undefined` = valor nao atribuido** — variavel declarada sem valor ou propriedade inexistente em objeto, porque o runtime do JS ja atribui `undefined` automaticamente nesses casos
2. **`null` = ausencia intencional** — use quando voce quer explicitamente dizer "nao tem nada aqui", porque comunica intencao ao leitor do codigo
3. **Nunca atribua `undefined` manualmente** — use `null` quando quiser indicar vazio, porque `undefined` e o valor que o proprio JS atribui quando algo nao existe
4. **Verifique valores falsy com negacao** — `if (!value)` captura tanto `null` quanto `undefined`, porque ambos sao falsy em JavaScript
5. **TypeScript infere propriedades do objeto** — se uma propriedade nao foi declarada, o TypeScript avisa antes da execucao, porque o type checker conhece a shape do objeto

## How to write

### Variavel sem valor (undefined automatico)

```typescript
let value: number
// value e undefined aqui — TypeScript avisa que nao foi atribuido
value = 12
console.log(value) // 12
```

### Ausencia intencional com null

```typescript
let email: string | null = null
console.log(email) // null

if (!email) {
  console.log("Informe o e-mail!")
}
```

### Propriedade inexistente em objeto

```typescript
const user = {
  name: "Rodrigo"
}
// user.email → TypeScript erro: propriedade nao existe
// Em runtime seria undefined, mas TypeScript impede o acesso
```

## Example

**Before (confuso sobre null vs undefined):**

```typescript
let email: string = undefined // errado: atribuindo undefined manualmente
let phone = null
let name: string // undefined, mas tentando usar direto

if (email === undefined) {
  // misturando conceitos
}
```

**After (com esta skill aplicada):**

```typescript
let email: string | null = null // intencional: ainda nao tem email
let phone: string | null = null // intencional: ainda nao tem telefone
let name: string // undefined ate receber valor — TypeScript protege o uso

if (!email) {
  console.log("Informe o e-mail!")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Variavel sera preenchida depois | Declare sem valor, deixe `undefined` natural |
| Quer indicar "vazio de proposito" | Atribua `null` explicitamente |
| Verificar se tem valor | Use `if (!value)` para capturar ambos |
| Propriedade opcional em objeto | Use `?:` na tipagem, nao atribua `undefined` |
| Retorno de funcao sem resultado | Retorne `null`, nao `undefined` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `let x: string = undefined` | `let x: string \| null = null` |
| `return undefined` | `return null` |
| `if (x === undefined && x === null)` | `if (!x)` |
| `user.email` (sem propriedade) | Declare a propriedade como opcional na tipagem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes