---
name: rs-full-stack-let
description: "Enforces correct usage of let for variable declarations in JavaScript. Use when user asks to 'declare a variable', 'create a variable', 'write JavaScript code', or any JS code generation task. Applies rules: prefer let over var, never redeclare with same name, reassign instead of redeclare. Make sure to use this skill whenever generating JavaScript variable declarations. Not for const usage, TypeScript type declarations, or advanced scoping discussions."
---

# Declaracao de Variaveis com Let

> Prefira `let` ao declarar variaveis em JavaScript — ele impede redeclaracao acidental e protege contra sobrescrita silenciosa.

## Rules

1. **Use `let` para variaveis que mudam** — nunca `var`, porque `var` permite redeclarar o mesmo nome sem erro, causando sobrescrita silenciosa
2. **Nunca redeclare uma variavel** — reatribua o valor em vez de criar outra com o mesmo nome, porque `let` bloqueia redeclaracao proposital
3. **Declare sem valor quando o valor vem depois** — `let user;` e valido e util quando o valor sera atribuido condicionalmente
4. **Reatribua com `=` direto** — sem repetir `let`, porque a variavel ja existe na memoria como espaco reservado com aquele nome

## How to write

### Declarar sem valor

```javascript
let user;
// valor atribuido depois
user = "Rodrigo Gonçalves";
```

### Declarar com valor

```javascript
let email = "rodrigo@email.com";
```

### Reatribuir valor

```javascript
let email = "rodrigo@email.com";
email = "joao@email.com"; // reatribuicao, nao redeclaracao
```

## Example

**Before (com var — sobrescrita silenciosa):**

```javascript
var user = "Rodrigo";
var user = "João"; // nenhum erro — sobrescreveu silenciosamente
console.log(user); // "João"
```

**After (com let — erro protege o codigo):**

```javascript
let user = "Rodrigo";
// let user = "João"; // SyntaxError: Identifier 'user' has already been declared
user = "João"; // correto: reatribuicao
console.log(user); // "João"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variavel que sera reatribuida | `let` |
| Variavel que nunca muda | `const` (outra aula) |
| Codigo legado com `var` | Migrar para `let` ou `const` |
| Declaracao sem valor inicial | `let nome;` — valido |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `var user = "Rodrigo"` | `let user = "Rodrigo"` |
| `let user = "A"; let user = "B";` | `let user = "A"; user = "B";` |
| Redeclarar para "atualizar" | Reatribuir com `=` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Modelo mental de memoria, analogia do armario, diferenca var vs let
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-let/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-let/references/code-examples.md)
