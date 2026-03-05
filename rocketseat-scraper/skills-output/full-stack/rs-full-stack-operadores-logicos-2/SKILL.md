---
name: rs-full-stack-operadores-logicos
description: "Applies JavaScript logical operator patterns when writing conditionals or boolean logic. Use when user asks to 'check conditions', 'validate login', 'write if statement', 'combine booleans', or any conditional logic task. Enforces correct AND (&&), OR (||), NOT (!) usage with clear variable naming. Make sure to use this skill whenever generating conditional expressions or boolean checks. Not for bitwise operators, comparison operators, or ternary expressions."
---

# Operadores Lógicos

> Ao escrever condições, use operadores lógicos (AND, OR, NOT) com variáveis booleanas descritivas para criar fluxos de decisão legíveis.

## Rules

1. **AND (&&) exige TODAS verdadeiras** — retorna `true` somente se todas as condições forem `true`, porque basta uma `false` para invalidar o conjunto inteiro
2. **OR (||) exige UMA verdadeira** — retorna `true` se qualquer condição for `true`, porque todas precisam ser `false` para retornar `false`
3. **NOT (!) inverte sem mutar** — `!value` inverte o valor na expressão mas não altera a variável original, porque é uma operação de leitura
4. **Nomeie booleanos pela causa** — `isEmailValid` não `emailCheck`, porque o nome deve comunicar o que foi testado
5. **Combine operadores com parênteses** — `(a && b) || c` não `a && b || c`, porque precedência implícita causa bugs silenciosos

## How to write

### Validação com AND (todas devem ser verdadeiras)

```javascript
const isEmailCorrect = true
const isPasswordCorrect = true

// Libera acesso somente se AMBOS corretos
const canLogin = isEmailCorrect && isPasswordCorrect // true
```

### Verificação com OR (basta uma verdadeira)

```javascript
const isEmailCorrect = true
const isPasswordCorrect = false

// OR: basta um ser verdadeiro
const hasPartialMatch = isEmailCorrect || isPasswordCorrect // true
```

### Negação com NOT

```javascript
const isPasswordCorrect = false

// Inverte o valor na expressão (variável original não muda)
console.log(!isPasswordCorrect) // true
console.log(isPasswordCorrect)  // false (inalterado)
```

### Combinando operadores

```javascript
const isEmailCorrect = true
const isPasswordCorrect = true
const isAdmin = false

// Combina AND e OR com parênteses explícitos
const canAccess = (isEmailCorrect && isPasswordCorrect) || isAdmin
```

## Example

**Before (confuso):**
```javascript
const e = true
const p = false
if (e && p || !p) { /* ... */ }
```

**After (com esta skill):**
```javascript
const isEmailCorrect = true
const isPasswordCorrect = false
if ((isEmailCorrect && isPasswordCorrect) || !isPasswordCorrect) { /* ... */ }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Validar login (email + senha) | Use `&&` — ambos devem ser corretos |
| Verificar permissão alternativa | Use `||` — qualquer uma basta |
| Inverter flag temporariamente | Use `!` — não reatribua a variável |
| Mais de 2 operadores na expressão | Agrupe com parênteses explícitos |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `e && p` (nomes crípticos) | `isEmailCorrect && isPasswordCorrect` |
| `a && b \|\| c` (sem parênteses) | `(a && b) \|\| c` |
| `password = !password` (mutação) | `const isInvalid = !isPasswordCorrect` |
| `if (x == true)` | `if (x)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações