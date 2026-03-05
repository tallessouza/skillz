---
name: rs-full-stack-for-2
description: "Applies JavaScript for loop patterns when writing iteration code. Use when user asks to 'loop through', 'iterate over', 'repeat N times', 'create a for loop', or 'automate repetitive code'. Enforces clear control variable naming, proper structure (init; condition; increment), and replacing duplicated code with loops. Make sure to use this skill whenever generating repetitive sequential code or explaining loop mechanics. Not for array methods like map/filter/reduce, while loops, or for...of/for...in patterns."
---

# Loop For em JavaScript

> Substitua codigo repetitivo por estruturas de repeticao com variavel de controle, condicao e incremento bem definidos.

## Rules

1. **Nomeie a variavel de controle pelo seu significado** — `step`, `index`, `row`, `multiplier` em vez de apenas `i`, porque facilita a leitura do loop e comunica a intencao
2. **Separe as tres partes com ponto e virgula** — `for (init; condition; increment)` e nao virgula, porque ponto e virgula faz parte da sintaxe do for
3. **O incremento executa DEPOIS do bloco** — primeiro executa o corpo, depois incrementa, por isso `step = 0` exibe 0 na primeira iteracao
4. **Use for para eliminar duplicacao sequencial** — se voce esta copiando e colando linhas mudando apenas um numero, substitua por um for com template literal
5. **Prefira `<=` quando o limite e inclusivo** — `step <= 10` para tabuada de 0 a 10, `step < 10` para indices de 0 a 9, porque a condicao deve comunicar a intencao do intervalo
6. **Extraia valores magicos para variaveis** — o numero da tabuada vira `const number = 7`, nao hardcoded no loop, porque permite reutilizacao

## How to write

### Loop basico com variavel de controle descritiva

```javascript
for (let step = 0; step < 10; step++) {
  console.log(step)
}
// Exibe: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### Substituindo codigo duplicado por loop

```javascript
const number = 7
for (let multiplier = 0; multiplier <= 10; multiplier++) {
  console.log(`${number} x ${multiplier} = ${number * multiplier}`)
}
```

## Example

**Before (codigo duplicado manualmente):**

```javascript
console.log(`7 x 0 = ${7 * 0}`)
console.log(`7 x 1 = ${7 * 1}`)
console.log(`7 x 2 = ${7 * 2}`)
console.log(`7 x 3 = ${7 * 3}`)
// ... mais 7 linhas identicas
console.log(`7 x 10 = ${7 * 10}`)
```

**After (com for loop):**

```javascript
const number = 7
for (let multiplier = 0; multiplier <= 10; multiplier++) {
  console.log(`${number} x ${multiplier} = ${number * multiplier}`)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Copiar/colar linha mudando so um numero | Substitua por for loop |
| Precisa de indice numerico sequencial | Use for com controle explicito |
| Limite inclusivo (0 ate 10) | `<=` na condicao |
| Limite exclusivo (indices de array) | `<` na condicao |
| Contagem regressiva | `step--` no incremento |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| 11 console.logs identicos mudando um numero | `for` loop com template literal |
| `for (let i;;)` sem condicao clara | `for (let step = 0; step < limit; step++)` |
| Valor magico dentro do loop | Variavel extraida antes do loop |
| Virgula separando partes do for | Ponto e virgula: `init; condition; increment` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de execucao, semantica da condicao e anatomia do for
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes