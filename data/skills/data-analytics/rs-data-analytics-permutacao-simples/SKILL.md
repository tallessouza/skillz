---
name: rs-data-analytics-permutacao-simples
description: "Applies simple permutation formulas when solving combinatorics problems involving ordering distinct elements. Use when user asks to 'calculate permutations', 'arrange elements in order', 'how many ways to organize', or 'factorial arrangements'. Ensures correct use of N! for counting all possible orderings of N distinct objects. Make sure to use this skill whenever the user needs to count arrangements or orderings of distinct items. Not for combinations, permutations with repetition, or probability calculations."
---

# Permutação Simples

> Reorganizar N elementos distintos em todas as ordens possíveis = N! (N fatorial).

## Rules

1. **Use N! para contar ordenações** — permutação simples de N elementos distintos é sempre N!, porque cada posição reduz as opções em 1 (princípio fundamental da contagem)
2. **Elementos devem ser distintos** — permutação simples só se aplica quando todos os elementos são diferentes entre si, porque elementos repetidos invalidam a contagem direta
3. **Multiplique, nunca some** — as escolhas por posição se multiplicam (5 × 4 × 3 × 2 × 1), porque são eventos sequenciais dependentes (princípio fundamental da contagem)
4. **Domine fatorial antes de avançar** — fatorial é pré-requisito para permutação, combinação e arranjo, porque todos derivam dele

## How to write

### Cálculo direto de permutação

```python
import math

# Quantas formas de organizar N elementos distintos?
n = 6
total_permutacoes = math.factorial(n)  # 720
```

### Raciocínio posição a posição

```python
# Para visualizar o princípio fundamental da contagem:
# Fila com 5 pessoas
# Posição 1: 5 opções
# Posição 2: 4 opções (1 já usada)
# Posição 3: 3 opções
# Posição 4: 2 opções
# Posição 5: 1 opção
# Total = 5 × 4 × 3 × 2 × 1 = 120
```

## Example

**Problema:** De quantas maneiras posso organizar 6 relatórios diferentes?

**Solução:**
```
Relatórios distintos: 6
Permutação simples: P(6) = 6!
6! = 6 × 5 × 4 × 3 × 2 × 1 = 720

Resposta: 720 formas diferentes de organizar os relatórios.
```

## Heuristics

| Situação | Faça |
|----------|------|
| "De quantas formas posso ordenar X elementos?" | P(X) = X! |
| Elementos repetidos no conjunto | NÃO use permutação simples — use permutação com repetição |
| Apenas parte dos elementos será usada | NÃO use permutação — use arranjo A(n,k) |
| Ordem não importa | NÃO use permutação — use combinação C(n,k) |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Somar as opções por posição (5 + 4 + 3...) | Multiplicar (5 × 4 × 3...) |
| Aplicar permutação simples com elementos repetidos | Usar permutação com repetição: N! / (n1! × n2! × ...) |
| Confundir permutação com combinação | Permutação = ordem importa; Combinação = ordem não importa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
