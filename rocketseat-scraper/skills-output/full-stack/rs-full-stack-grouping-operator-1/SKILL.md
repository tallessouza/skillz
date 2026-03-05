---
name: rs-full-stack-grouping-operator-1
description: "Applies correct operator precedence using parentheses (grouping operator) when writing JavaScript arithmetic expressions. Use when user asks to 'calculate average', 'write math expression', 'fix calculation', 'compute total', or any arithmetic operation in JS/TS. Ensures parentheses enforce intended evaluation order. Make sure to use this skill whenever generating code with multiple arithmetic operators. Not for string concatenation, logical operators, or non-arithmetic expressions."
---

# Grouping Operator (Parênteses)

> Ao escrever expressoes aritmeticas em JavaScript, use parenteses para garantir que a ordem de calculo reflita a intencao, nunca confie na precedencia implicita em expressoes compostas.

## Rules

1. **Sempre agrupe operacoes que devem ser calculadas primeiro** — `(a + b) * c` nao `a + b * c`, porque multiplicacao tem precedencia sobre adicao e o resultado sera diferente do esperado
2. **Calculos de media sempre somam primeiro** — `(nota1 + nota2 + nota3) / total` nao `nota1 + nota2 + nota3 / total`, porque sem parenteses apenas o ultimo termo sera dividido
3. **Use parenteses mesmo quando "obvio"** — legibilidade explicita supera confianca na tabela de precedencia, porque outros desenvolvedores nao memorizam a tabela completa
4. **Quebre expressoes complexas em variaveis intermediarias** — se a expressao tem mais de 2 niveis de parenteses aninhados, extraia para variaveis nomeadas

## How to write

### Calculo de media

```typescript
// Soma primeiro, depois divide
const average = (grade1 + grade2 + grade3) / 3
```

### Expressoes compostas

```typescript
// Parenteses tornam a intencao explicita
const total = (basePrice + tax) * quantity
const discount = total * (1 - discountRate)
```

## Example

**Before (bug silencioso):**
```typescript
const average = 9.5 + 7 + 5 / 3
// Resultado: 18.16... (apenas 5 foi dividido por 3)
```

**After (com grouping operator):**
```typescript
const average = (9.5 + 7 + 5) / 3
// Resultado: 7.16... (soma feita primeiro, depois divisao)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Soma + divisao na mesma expressao | Sempre agrupar a soma com parenteses |
| Multiplicacao + adicao juntas | Parenteses se a adicao deve vir primeiro |
| Expressao com mais de 2 operadores | Parenteses explicitos mesmo que desnecessarios |
| Mais de 2 niveis de aninhamento | Extrair para variaveis intermediarias |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `a + b + c / n` (para media) | `(a + b + c) / n` |
| `price + tax * qty` (se quer somar antes) | `(price + tax) * qty` |
| `a * b + c * d / e` (ambiguo) | `(a * b) + ((c * d) / e)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre precedencia de operadores e como o JS avalia expressoes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes