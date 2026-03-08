---
name: rs-clean-code-regras-em-condicionais
description: "Enforces clean conditional patterns when writing JavaScript/TypeScript code. Use when user asks to 'write a function', 'add validation', 'implement logic', 'refactor conditionals', or any code with if/else blocks. Applies rules: avoid negations in conditions, prefer early return over else, never nest conditionals. Make sure to use this skill whenever generating code with conditional logic. Not for CSS, database queries, or markup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: regras-em-condicionais
  tags: [conditionals, early-return, guard-clauses, negation, clean-code, typescript, javascript]
---

# Regras em Condicionais

> Escreva condicionais que possam ser lidas como frases afirmativas, com caminhos lineares e sem aninhamento.

## Rules

1. **Evite negacoes em condicionais** — `isYoungerThan18` nao `!isOlderThan18`, porque negacoes forcam um switch mental na leitura e pioram quando combinadas com operadores logicos
2. **Prefira early return ao else** — retorne cedo e deixe o fluxo principal sem indentacao, porque apos um `return` o restante ja nao executa
3. **Use else apenas quando traz semantica** — se a funcao tem muitos ifs encadeados com early returns escondidos, o else explicita melhor o que acontece em cada caminho
4. **Nunca aninhe condicionais** — un if dentro de outro cria ramificacoes exponenciais na linha do tempo do codigo, dificultando a leitura
5. **Una condicoes ou use early return** — ao inves de if dentro de if, combine com `&&` ou faca early return no primeiro if e coloque o segundo abaixo

## How to write

### Condicionais sem negacao

```typescript
// Crie variaveis auxiliares afirmativas ao inves de negar
const isYoungerThan18 = user.age < 18
const livesOutsideBrazil = user.country !== 'BR'

if (isYoungerThan18 && livesOutsideBrazil) {
  // logica
}
```

### Early return

```typescript
function isUserOlderThan18(user: User) {
  if (!user) {
    return new Error('User not provided')
  }

  return user.age >= 18
}
```

### Desaninhando condicionais

```typescript
// Ao inves de aninhar, use early return + if sequencial
if (user.age < 18) {
  return 'underage'
}

if (user.age === 18) {
  return 'just turned 18'
}

return 'adult'
```

## Example

**Before (negacoes + else + aninhamento):**
```typescript
function processUser(user: User) {
  if (user) {
    if (!user.isOlderThan18) {
      return 'blocked'
    } else {
      if (!user.livesInBrazil) {
        return 'international'
      } else {
        return 'domestic'
      }
    }
  } else {
    return 'no user'
  }
}
```

**After (com esta skill aplicada):**
```typescript
function processUser(user: User) {
  if (!user) {
    return 'no user'
  }

  if (user.isYoungerThan18) {
    return 'blocked'
  }

  if (user.livesOutsideBrazil) {
    return 'international'
  }

  return 'domestic'
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Condicional com `!` em variavel booleana | Crie variavel auxiliar afirmativa |
| `!a && !b` | Crie `isX` e `isY` afirmativos |
| if/else simples com return no if | Remova o else, use early return |
| Funcao com muitos early returns escondidos | Use else para explicitar semantica |
| if dentro de if | Combine com `&&` ou separe com early return |
| Ternario aninhado `a ? (b ? x : y) : z` | Nunca — use if/else ou early return |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `if (!isOlderThan18)` | `if (isYoungerThan18)` |
| `if (!isValid && !isActive)` | `if (isInvalid && isInactive)` |
| `if (x) { ... } else { return }` | `if (!x) { return } ...` |
| `if (a) { if (b) { ... } }` | `if (a && b) { ... }` |
| `condition ? (nested ? a : b) : c` | if/else com early return |

## Troubleshooting

### Condicional com dupla negacao dificulta leitura
**Symptom:** Codigo como `if (!isNotActive && !isNotValid)` requer multiplos "switches mentais" para entender
**Cause:** Variaveis booleanas foram criadas com negacao no nome (`isNotX`) e depois negadas novamente no if
**Fix:** Crie variaveis afirmativas: `const isActive = ...` e `const isValid = ...`, depois use `if (isActive && isValid)` — leia como frase natural

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-regras-em-condicionais/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-regras-em-condicionais/references/code-examples.md)
