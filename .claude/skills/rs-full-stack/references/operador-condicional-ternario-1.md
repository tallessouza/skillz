---
name: rs-full-stack-operador-condicional-ternario
description: "Applies ternary operator patterns when writing JavaScript/TypeScript conditional expressions. Use when user asks to 'write a condition', 'check if value', 'return based on condition', 'inline if', or ternary-related code. Enforces three-part structure: condition ? valueIfTrue : valueIfFalse. Make sure to use this skill whenever generating inline conditional logic. Not for complex multi-branch logic, switch statements, or if/else blocks with side effects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, ternary, conditional, operator, expression]
---

# Operador Condicional Ternário

> Use o operador ternário para expressões condicionais inline com exatamente três partes: condição, resultado verdadeiro, resultado falso.

## Rules

1. **Sempre respeite a estrutura de três partes** — `condição ? seVerdadeiro : seFalso`, porque inverter ou omitir partes causa erro de sintaxe
2. **Use ternário apenas para expressões, não para statements** — retorne valores, não execute blocos de código, porque ternário produz um valor, não controla fluxo
3. **Quebre em múltiplas linhas quando a expressão ficar longa** — coloque cada parte em sua própria linha para legibilidade, porque uma linha com 3 partes fica difícil de escanear
4. **Combine com operadores lógicos na condição** — `&&`, `||`, `>=`, `<` funcionam normalmente dentro da condição do ternário
5. **Evite ternários aninhados** — se precisar de mais de uma condição, use `if/else` ou early return, porque ternários aninhados destroem legibilidade

## How to write

### Ternário inline (expressões curtas)

```typescript
const message = age >= 18 ? "Você pode dirigir." : "Você não pode dirigir."
```

### Ternário multilinha (expressões longas)

```typescript
const message =
  age >= 18 // condição
    ? "Você pode dirigir."  // se verdadeiro
    : "Você não pode dirigir." // se falso
```

### Com operadores lógicos na condição

```typescript
const access =
  age >= 18 && hasLicense
    ? "Acesso liberado."
    : "Acesso negado."
```

## Example

**Before (verbose para lógica simples):**
```typescript
let message
if (age >= 18) {
  message = "Você pode dirigir."
} else {
  message = "Você não pode dirigir."
}
console.log(message)
```

**After (com ternário):**
```typescript
console.log(
  age >= 18
    ? "Você pode dirigir."
    : "Você não pode dirigir."
)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Atribuir um valor baseado em condição simples | Use ternário |
| Retornar JSX condicional em React | Use ternário |
| Executar side effects diferentes por branch | Use `if/else` |
| Mais de 2 branches | Use `if/else if` ou `switch` |
| Condição + valores cabem em ~80 chars | Ternário inline |
| Condição ou valores são longos | Ternário multilinha |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `condition : value1 ? value2` | `condition ? value1 : value2` (ordem correta) |
| `a ? b ? c : d : e` (aninhado) | `if/else` com early return |
| `isValid ? doSomething() : doOther()` (side effects) | `if (isValid) { doSomething() } else { doOther() }` |
| `x ? true : false` | `Boolean(x)` ou `!!x` |
| `x ? x : defaultValue` | `x \|\| defaultValue` ou `x ?? defaultValue` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Erro de sintaxe no ternario | Ordem invertida (`:` antes de `?`) | Respeite: `condicao ? verdadeiro : falso` |
| Ternario dificil de ler | Muitos ternarios aninhados | Refatore para `if/else` com early return |
| `x ? true : false` redundante | Ternario desnecessario | Simplifique para `Boolean(x)` ou `!!x` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes