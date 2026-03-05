---
name: rs-data-analytics-arranjo-simples
description: "Applies simple arrangement (arranjo simples) calculations when solving combinatorics problems where order matters. Use when user asks to 'calculate arrangements', 'podium combinations', 'rank items', 'order matters', or any permutation problem without repetition. Derives formula A(n,p) = n!/(n-p)! from first principles using fundamental counting. Make sure to use this skill whenever solving combinatorics problems where element order is significant. Not for combinations (order doesn't matter), arrangements with repetition, or general probability."
---

# Arranjo Simples

> Quando a ordem dos elementos importa e nao ha repeticao, use arranjo simples: resolva pelo principio fundamental da contagem primeiro, aplique a formula apenas como atalho.

## Rules

1. **Identifique se a ordem importa** — pergunte "trocar a posicao dos elementos gera um resultado diferente?". Se sim, e arranjo. Porque podio 1o-2o-3o e diferente de 3o-2o-1o
2. **Verifique se ha repeticao** — em arranjo simples, nenhum elemento ocupa mais de uma posicao. Porque uma pessoa nao pode ser 1o e 2o lugar ao mesmo tempo
3. **Resolva primeiro sem formula** — use o principio fundamental da contagem (multiplicacao das possibilidades decrescentes). Porque isso garante compreensao antes de mecanizar
4. **Aplique a formula como confirmacao** — A(n,p) = n! / (n-p)!, onde n = total de elementos, p = quantos serao escolhidos/organizados
5. **Valide o resultado** — o resultado da formula deve ser identico ao do principio fundamental da contagem

## How to write

### Resolucao pelo Principio Fundamental da Contagem

```
Problema: Podio de 3 lugares entre 5 atletas

Posicoes:    [1o lugar] [2o lugar] [3o lugar]
Opcoes:      [   5    ] [   4    ] [   3    ]

Resultado: 5 × 4 × 3 = 60 possibilidades
```

### Resolucao pela Formula

```
A(n,p) = n! / (n-p)!

A(5,3) = 5! / (5-3)! = 5! / 2! = (5×4×3×2×1) / (2×1) = 120 / 2 = 60
```

### Derivacao da formula (por que funciona)

```
Contagem direta:  5 × 4 × 3

Para transformar em fatorial, complete ate 1:
  5 × 4 × 3 × (2 × 1) = 5!

Mas adicionamos 2×1 a mais, entao dividimos:
  5! / (2 × 1) = 5! / 2! = 5! / (5-3)!
```

## Example

**Problema:** Ranquear os 4 melhores entre 7 atletas.

**Sem formula:**
```
Posicoes:  [1o] [2o] [3o] [4o]
Opcoes:    [ 7] [ 6] [ 5] [ 4]

7 × 6 = 42 → 42 × 5 = 210 → 210 × 4 = 840
```

**Com formula:**
```
A(7,4) = 7! / (7-4)! = 7! / 3! = 5040 / 6 = 840
```

## Heuristics

| Situacao | Acao |
|----------|------|
| "Classificar", "ranquear", "podio", "ordem" | Arranjo simples |
| "Escolher sem importar ordem" | NAO e arranjo — e combinacao |
| Elementos podem repetir nas posicoes | NAO e arranjo simples — e arranjo com repeticao |
| Poucos elementos (n < 8) | Resolva por contagem direta, mais intuitivo |
| Muitos elementos (n >= 8) | Use a formula para evitar multiplicacoes longas |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Aplicar formula sem entender o problema | Primeiro identifique: ordem importa? Ha repeticao? |
| Usar combinacao quando ordem importa | Use arranjo — C ignora ordem, A preserva |
| Decorar formula sem derivar | Entenda que A(n,p) vem de completar o fatorial e dividir o excesso |
| Confundir n e p na formula | n = total disponivel, p = quantos voce vai usar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
