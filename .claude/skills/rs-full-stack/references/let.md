---
name: rs-full-stack-let
description: "Enforces correct usage of let for variable declarations in JavaScript. Use when user asks to 'declare a variable', 'create a variable', 'write JavaScript code', or any JS code generation task. Applies rules: prefer let over var, never redeclare with same name, reassign instead of redeclare. Make sure to use this skill whenever generating JavaScript variable declarations. Not for const usage, TypeScript type declarations, or advanced scoping discussions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, variables, let, var, declaration, scope]
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

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `SyntaxError: Identifier has already been declared` | Tentou redeclarar variável com `let` no mesmo escopo | Use reatribuição (`x = novoValor`) em vez de redeclaração (`let x = novoValor`) |
| `ReferenceError: x is not defined` | Variável declarada em escopo diferente (bloco `if`, `for`) | Declare a variável no escopo onde será usada ou em escopo pai |
| Valor da variável não muda | Usando `const` quando deveria usar `let` | Troque `const` por `let` se o valor precisa ser reatribuído |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Modelo mental de memoria, analogia do armario, diferenca var vs let
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes