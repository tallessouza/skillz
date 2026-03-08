---
name: rs-full-stack-texto-maiusculo-e-minusculo
description: "Applies JavaScript string case transformation methods toUpperCase and toLowerCase when manipulating text. Use when user asks to 'convert text to uppercase', 'lowercase a string', 'normalize case', 'compare strings case-insensitive', or any string case manipulation. Ensures immutability awareness: these methods return new strings without modifying the original. Make sure to use this skill whenever generating code that transforms string casing in JavaScript or TypeScript. Not for CSS text-transform, locale-aware collation, or regex-based case conversion."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentos
  tags: [javascript, string, toUpperCase, toLowerCase, immutability]
---

# Texto Maiúsculo e Minúsculo

> Ao transformar casing de strings, use `toUpperCase()` e `toLowerCase()` sabendo que retornam novas strings sem modificar a original.

## Rules

1. **Use `toUpperCase()` para maiúsculo** — `message.toUpperCase()` retorna todo o texto em caixa alta, porque é o método nativo de String para esse propósito
2. **Use `toLowerCase()` para minúsculo** — `message.toLowerCase()` retorna todo o texto em caixa baixa, porque é o par complementar
3. **Nunca assuma mutação** — esses métodos retornam uma nova string, a variável original permanece inalterada, porque strings em JavaScript são imutáveis
4. **Armazene o resultado se precisar reutilizar** — `const upper = text.toUpperCase()`, porque chamar o método repetidamente é desperdício

## How to write

### Transformação básica

```typescript
const message = "Estou estudando os fundamentos de JavaScript"

// Exibir em maiúsculo — retorna nova string
console.log(message.toUpperCase())
// "ESTOU ESTUDANDO OS FUNDAMENTOS DE JAVASCRIPT"

// Exibir em minúsculo — retorna nova string
console.log(message.toLowerCase())
// "estou estudando os fundamentos de javascript"

// Original permanece inalterada
console.log(message)
// "Estou estudando os fundamentos de JavaScript"
```

### Comparação case-insensitive

```typescript
const input = "JavaScript"
const expected = "javascript"

if (input.toLowerCase() === expected.toLowerCase()) {
  // Match encontrado
}
```

## Example

**Before (bug sutil — assume mutação):**
```typescript
const name = "João Silva"
name.toUpperCase()
console.log(name) // "João Silva" — não mudou!
```

**After (com esta skill aplicada):**
```typescript
const name = "João Silva"
const nameUpper = name.toUpperCase()
console.log(nameUpper) // "JOÃO SILVA"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Normalizar input do usuário para busca | `input.toLowerCase()` antes de comparar |
| Exibir label em caixa alta na UI | `label.toUpperCase()` no render, não modifique a variável |
| Precisa do resultado em múltiplos lugares | Armazene em variável: `const normalized = text.toLowerCase()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `text.toUpperCase()` esperando que `text` mude | `const upper = text.toUpperCase()` |
| `if (a === b)` com strings de casing diferente | `if (a.toLowerCase() === b.toLowerCase())` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Variavel original nao mudou apos `toUpperCase()` | Strings sao imutaveis em JavaScript | Armazene o retorno: `const upper = text.toUpperCase()` |
| Comparacao case-insensitive falha | Comparando sem normalizar o casing | Use `.toLowerCase()` em ambos os lados: `a.toLowerCase() === b.toLowerCase()` |
| Caracteres acentuados nao convertem corretamente | Problema de encoding ou locale | `toUpperCase()` e `toLowerCase()` funcionam com Unicode; verifique o encoding do arquivo |
| `TypeError: toUpperCase is not a function` | Variavel nao e string | Verifique o tipo com `typeof` antes de chamar o metodo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre imutabilidade de strings e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-texto-maiusculo-e-minusculo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-texto-maiusculo-e-minusculo/references/code-examples.md)
