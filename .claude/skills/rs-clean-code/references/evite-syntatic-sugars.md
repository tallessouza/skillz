---
name: rs-clean-code-evite-syntatic-sugars
description: "Enforces explicit type conversions over JavaScript syntactic sugar when writing or reviewing JS/TS code. Use when user asks to 'convert a value', 'cast types', 'write clean code', 'review code readability', or generates any code with type coercion. Applies rules: use Number() not +prefix, Boolean() not !!, String() not concatenation. Make sure to use this skill whenever generating code that involves type conversion, even implicitly. Not for destructuring, spread operator, or other productive syntactic sugar."
---

# Evite Syntactic Sugars em Conversoes de Tipo

> Use construtores explicitos (Number, Boolean, String) em vez de atalhos sintaticos que sacrificam legibilidade sem ganho real de produtividade.

## Rules

1. **Use `Number()` para converter strings em numeros** — `Number(value)` nao `+value`, porque o prefixo `+` confunde leitores de outras linguagens que pensam em soma
2. **Use `Boolean()` para converter para booleano** — `Boolean(value)` nao `!!value`, porque dupla negacao e um truque sintatico que esconde a intencao
3. **Use `String()` para converter para string** — `String(value)` nao `value + ""` ou template literals vazios, porque o construtor declara a intencao explicitamente
4. **Evite `parseInt()` como padrao de conversao numerica** — `parseInt` descarta decimais silenciosamente, use `Number()` a menos que queira truncar intencionalmente, porque bugs de precisao sao silenciosos
5. **Mantenha syntactic sugars produtivos** — destructuring, spread, optional chaining, nullish coalescing sao permitidos, porque aumentam produtividade sem prejudicar legibilidade
6. **Regra de ouro: se alguem de outra linguagem nao entenderia, evite** — o codigo deve ser legivel para quem vem de PHP, Java, Python, porque times sao multi-linguagem

## How to write

### Conversao para numero
```typescript
// Construtor explicito — qualquer dev entende
const amount = Number(amountString)
```

### Conversao para booleano
```typescript
// Construtor explicito — intencao clara
const hasValue = Boolean(input)
```

### Conversao para string
```typescript
// Construtor explicito — sem truques
const label = String(productId)
```

## Example

**Before (syntactic sugar prejudicial):**
```typescript
const price = +priceString
const isValid = !!user
const id = productId + ""
const count = parseInt(quantityString)
```

**After (with this skill applied):**
```typescript
const price = Number(priceString)
const isValid = Boolean(user)
const id = String(productId)
const count = Number(quantityString) // ou parseInt se truncar e intencional
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Converter string para numero | `Number(value)` |
| Verificar se valor e truthy/falsy | `Boolean(value)` |
| Converter qualquer coisa para string | `String(value)` |
| Precisa truncar decimal intencionalmente | `parseInt(value, 10)` com comentario explicando |
| Destructuring, spread, optional chaining | Usar normalmente — sao produtivos |
| Nao sabe se o sugar e produtivo ou obscuro | Pergunte: "alguem de Java entenderia isso?" |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `+stringValue` | `Number(stringValue)` |
| `!!value` | `Boolean(value)` |
| `value + ""` | `String(value)` |
| `` `${value}` `` (so pra converter) | `String(value)` |
| `parseInt(v)` sem saber se tem decimal | `Number(v)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-evite-syntatic-sugars/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-evite-syntatic-sugars/references/code-examples.md)
