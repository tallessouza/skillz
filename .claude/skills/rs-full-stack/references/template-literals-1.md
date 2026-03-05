---
name: rs-full-stack-template-literals-1
description: "Enforces template literal usage over string concatenation when writing JavaScript/TypeScript code. Use when user asks to 'build a string', 'format a message', 'concatenate variables', 'create dynamic text', or any string interpolation task. Applies backtick syntax with ${} placeholders instead of + concatenation. Make sure to use this skill whenever generating code that combines strings with variables. Not for regex patterns, tagged templates, or SQL query building."
---

# Template Literals

> Ao construir strings com variaveis, use template literals (backticks + ${}) em vez de concatenacao com +.

## Rules

1. **Use backticks para strings com variaveis** — `` `Ola, ${name}` `` nao `"Ola, " + name`, porque template literals sao mais legiveis e eliminam erros de espacamento
2. **Use ${} para inserir expressoes** — qualquer expressao JavaScript valida funciona dentro de `${}`, incluindo chamadas de funcao e operacoes
3. **Concatenacao com + nao esta errada, mas e trabalhosa** — exige controle manual de espacos, aspas abrindo/fechando, e sinais de + entre cada trecho
4. **Backticks permitem strings multilinhas** — quebras de linha sao preservadas naturalmente, sem precisar de `\n`
5. **Prefira template literals para qualquer string dinamica** — sempre que uma string combina texto fixo com valores variaveis

## How to write

### String dinamica com variaveis

```typescript
const username = "Rodrigo"
const email = "rodrigo@email.com"

// Template literal — limpo e legivel
console.log(`Ola, ${username}. Voce conectou com o email ${email}`)
```

### Expressoes dentro de ${}

```typescript
const price = 49.9
console.log(`Total: R$ ${(price * 1.1).toFixed(2)}`)
```

## Example

**Before (concatenacao manual):**
```javascript
let message = "Ola, " + username + ". Voce conectou com o email " + email
console.log(message)
```

**After (template literal):**
```javascript
const message = `Ola, ${username}. Voce conectou com o email ${email}`
console.log(message)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| String pura sem variaveis | Aspas simples ou duplas — backticks nao necessarios |
| String com 1+ variaveis | Template literal com ${} |
| String multilinha | Template literal (preserva quebras) |
| Log com multiplos valores separados | `console.log(a, b)` e valido, mas template literal formata melhor |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"Ola, " + name + "!"` | `` `Ola, ${name}!` `` |
| `"Total: " + price + " reais"` | `` `Total: ${price} reais` `` |
| `"Linha1\nLinha2"` | `` `Linha1\nLinha2` `` ou backtick multilinha |
| `name + " - " + email + " - " + role` | `` `${name} - ${email} - ${role}` `` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-template-literals-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-template-literals-1/references/code-examples.md)
