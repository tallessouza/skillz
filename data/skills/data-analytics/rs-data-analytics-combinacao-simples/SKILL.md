---
name: rs-data-analytics-combinacao-simples
description: "Applies simple combination (combinação simples) formulas and reasoning when solving counting problems where order does not matter. Use when user asks to 'calculate combinations', 'form groups', 'choose items from a set', 'how many ways to select', or any combinatorics problem without order. Distinguishes from arrangements (arranjos) by detecting order-irrelevant scenarios. Make sure to use this skill whenever the user faces a selection/grouping problem in data analytics or probability. Not for permutations, arrangements where order matters, or probability distributions."
---

# Combinação Simples

> Quando a ordem não importa, use combinação: selecione P elementos de N eliminando os casos repetidos pela divisão por P!.

## Rules

1. **Identifique se a ordem importa** — se trocar a posição dos elementos não gera um caso novo, é combinação, porque arranjo conta posições distintas como casos diferentes
2. **Nunca use arranjo quando a ordem é irrelevante** — arranjo superestima o total multiplicando por P! casos repetidos
3. **Sempre divida pelo fatorial da quantidade selecionada** — `A(n,p) / p!` elimina as repetições de ordem dentro de cada grupo
4. **Use a fórmula canônica** — `C(n,p) = n! / (p! × (n-p)!)`, porque é a versão completa que já embute a correção
5. **Valide com força bruta em casos pequenos** — liste todos os grupos manualmente para confirmar o resultado, porque erros conceituais só aparecem na verificação

## Fórmula

```
C(n, p) = n! / (p! × (n - p)!)
```

Relação com arranjo:

```
C(n, p) = A(n, p) / p!

Onde A(n, p) = n! / (n - p)!
```

## How to write

### Cálculo direto

```python
from math import comb, factorial

# Formar grupo de 3 clientes entre 10 pessoas
n, p = 10, 3
resultado = comb(n, p)  # 120

# Equivalente manual:
resultado_manual = factorial(n) // (factorial(p) * factorial(n - p))  # 120
```

### Identificação do problema

```python
# COMBINAÇÃO (ordem NÃO importa):
# "Formar um grupo de 3 pessoas entre 5"
# "Escolher 4 itens de um cardápio de 10"
# "Selecionar 2 projetos entre 8 candidatos"

# ARRANJO (ordem importa):
# "Pódio com 1º, 2º e 3º lugar entre 5"
# "Eleger presidente e vice entre 10"
# "Sequência de 4 dígitos entre 10"
```

## Example

**Problema:** Formar grupo de 3 clientes entre 5 pessoas (A, B, C, D, E).

**Abordagem ingênua (erro):**
```
5 × 4 × 3 = 60  ← ERRADO, conta ordem
```

**Por que está errado:** ABC, ACB, BAC, BCA, CAB, CBA são o mesmo grupo contado 6 vezes (3! = 6).

**Correção com combinação:**
```
60 / 3! = 60 / 6 = 10 ✓
```

**Pela fórmula:**
```
C(5,3) = 5! / (3! × 2!) = 120 / (6 × 2) = 10 ✓
```

**Os 10 grupos:** ABC, ABD, ABE, ACD, ACE, ADE, BCD, BCE, BDE, CDE.

## Heuristics

| Situação | Ação |
|----------|------|
| "Formar grupo", "selecionar", "escolher" | Combinação — ordem não importa |
| "Ranking", "pódio", "sequência", "senha" | Arranjo — ordem importa |
| Resultado do arranjo parece grande demais | Divida por P! para verificar se era combinação |
| N e P são pequenos (≤ 6) | Valide listando todos os casos manualmente |
| P > N | Impossível — resultado é 0 |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Usar `5 × 4 × 3 = 60` para grupos sem ordem | `C(5,3) = 10` — divida por `3!` |
| Confundir "selecionar" com "ordenar" | Pergunte: "trocar posições gera caso novo?" |
| Esquecer o `p!` no denominador | Sempre use `n! / (p! × (n-p)!)` |
| Calcular `C(n,p)` quando `p > n` | Retorne 0 — não há como selecionar mais do que existe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
