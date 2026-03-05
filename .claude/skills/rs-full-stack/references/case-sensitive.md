---
name: rs-full-stack-case-sensitive
description: "Enforces case sensitivity awareness when writing JavaScript/TypeScript identifiers. Use when user asks to 'create a variable', 'rename a function', 'debug undefined variable', or encounters 'is not defined' errors. Applies rules: treat uppercase/lowercase as distinct identifiers, avoid near-identical names differing only by case, understand var re-declaration overwrites. Make sure to use this skill whenever debugging reference errors or reviewing variable declarations. Not for naming conventions, style guides, or linting configuration."
---

# Case Sensitive em JavaScript

> JavaScript diferencia letras maiusculas e minusculas em todos os identificadores — variaveis, funcoes e propriedades com grafias diferentes sao entidades completamente distintas.

## Rules

1. **Trate maiusculas e minusculas como identificadores distintos** — `product`, `Product` e `PRODUCT` sao tres variaveis diferentes, porque o interpretador compara nome caractere a caractere
2. **Evite nomes que diferem apenas por case** — `product` e `Product` no mesmo escopo causam confusao e bugs sutis, porque humanos leem por forma visual e nao por case exato
3. **Verifique o case exato ao debugar "is not defined"** — o erro `ReferenceError: X is not defined` frequentemente significa que o nome foi escrito com case diferente da declaracao
4. **Saiba que `var` permite re-declaracao e sobrescreve** — declarar `var product` duas vezes no mesmo escopo sobrescreve o valor anterior silenciosamente, porque `var` nao impede re-declaracao

## How to write

### Identificadores consistentes

```javascript
// Cada grafia e uma variavel DIFERENTE
var product = "teclado mecanico"
var Product = "mouse gamer"

console.log(product) // "teclado mecanico"
console.log(Product) // "mouse gamer"
```

### Sobrescrita com var

```javascript
var product = "teclado mecanico"
var product = "fone sem fio"  // sobrescreve silenciosamente

console.log(product) // "fone sem fio" — o valor anterior sumiu
```

## Example

**Before (bug comum):**

```javascript
var userName = "Rodrigo"
console.log(username) // ReferenceError: username is not defined
```

**After (case corrigido):**

```javascript
var userName = "Rodrigo"
console.log(userName) // "Rodrigo"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| `ReferenceError: X is not defined` | Verificar se o case do nome bate exatamente com a declaracao |
| Duas variaveis com nomes quase iguais | Renomear para nomes semanticamente distintos |
| Variavel parece ter valor errado | Checar se `var` re-declarou e sobrescreveu o valor |
| Aprendendo linguagem nova | Primeiro verificar se ela e case sensitive |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `var product` e `var Product` no mesmo escopo | Usar nomes semanticamente distintos: `productName` e `selectedProduct` |
| Debugar "not defined" mudando logica | Comparar o case exato com a declaracao original |
| Re-declarar com `var` para "atualizar" | Usar `let` ou apenas reatribuir sem `var` |
| Assumir que `Rodrigo` == `rodrigo` como identificador | Tratar cada combinacao de case como unica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases sobre case sensitivity
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-case-sensitive/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-case-sensitive/references/code-examples.md)
