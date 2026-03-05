---
name: rs-data-analytics-fatorial
description: "Applies factorial calculations and simplification techniques when solving combinatorics or probability problems. Use when user asks to 'calculate factorial', 'simplify factorial expression', 'count arrangements', 'permutations', or any combinatorics task. Ensures correct factorial arithmetic, inter-factorial operations, and practical applications like ordering/ranking scenarios. Make sure to use this skill whenever factorial notation appears in any math or data problem. Not for advanced permutations with repetition, combinations (nCr), or probability distributions."
---

# Fatorial

> Fatorial de n (n!) e o produto de todos os inteiros de n ate 1, e serve como base para toda analise combinatoria.

## Rules

1. **Multiplique de n ate 1, nunca ate zero** — `n! = n × (n-1) × ... × 1`, porque multiplicar por zero anularia tudo
2. **Fatorial de zero e sempre 1** — `0! = 1` por definicao, porque garante consistencia nas formulas combinatorias
3. **Simplifique antes de calcular** — em expressoes como `n! / k!`, cancele os termos comuns antes de multiplicar, porque evita calculos desnecessarios com numeros grandes
4. **Reescreva fatoriais em termos de subfatoriais** — `5! = 5 × 4!`, porque permite cancelamento direto em divisoes

## How to write

### Calculo direto

```python
# Fatorial de n: multiplique de n ate 1
def fatorial(n):
    if n == 0:
        return 1
    resultado = 1
    for i in range(1, n + 1):
        resultado *= i
    return resultado

# 4! = 4 × 3 × 2 × 1 = 24
# 7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5040
```

### Simplificacao entre fatoriais

```python
# 5! / 4! = (5 × 4!) / 4! = 5
# Cancele o subfatorial comum antes de calcular

# 3! × 2! / 2! = 3! = 6
# Cancele 2! com 2!, resta 3! = 3 × 2 × 1 = 6
```

## Example

**Before (calculo bruto sem simplificar):**
```
5! / 4! = 120 / 24 = 5
# Calculou os dois fatoriais inteiros desnecessariamente
```

**After (com simplificacao):**
```
5! / 4! = (5 × 4!) / 4! = 5
# Cancelou 4! direto, sem calcular 120 nem 24
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Divisao entre fatoriais | Reescreva o maior em termos do menor e cancele |
| Fatorial de 0 aparece | Substitua por 1 imediatamente |
| Problema de ordenacao/ranking | Numero de arranjos = n! |
| Numeros muito grandes | Simplifique algebricamente antes de computar |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Multiplicar ate zero: `4 × 3 × 2 × 1 × 0` | Pare em 1: `4 × 3 × 2 × 1` |
| Calcular `7!` e `5!` separado para dividir | Reescrever `7! / 5! = 7 × 6 = 42` |
| Esquecer que `0! = 1` | Sempre tratar `0! = 1` como regra fixa |
| Calcular tudo na forca bruta | Cancelar termos comuns primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
