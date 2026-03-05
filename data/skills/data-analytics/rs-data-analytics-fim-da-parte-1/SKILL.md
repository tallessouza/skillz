---
name: rs-data-analytics-fim-da-parte-1
description: "Applies combinatorial analysis concepts (counting principle, factorial, arrangements, permutations, combinations) to data analytics tasks. Use when user asks to 'plan test scenarios', 'select samples', 'group data combinations', 'cross-reference data', 'count possibilities', or 'analyze combinations in datasets'. Make sure to use this skill whenever combinatorial reasoning is needed for data analysis, test planning, or report insights. Not for probability calculations, statistical inference, or machine learning tasks."
---

# Análise Combinatória Aplicada a Dados

> Domine contagem e combinações para planejar testes, selecionar amostras e extrair insights de cruzamentos de dados.

## Conceitos-chave

| Conceito | Quando usar | Fórmula |
|----------|-------------|---------|
| **Princípio Aditivo** | Cenários mutuamente exclusivos (OU) | `n1 + n2 + ... + nk` |
| **Princípio Multiplicativo** | Cenários sequenciais (E) | `n1 × n2 × ... × nk` |
| **Fatorial** | Total de formas de ordenar n elementos | `n!` |
| **Arranjo** | Ordem importa, subconjunto de n | `A(n,p) = n!/(n-p)!` |
| **Permutação** | Ordem importa, todos os n elementos | `P(n) = n!` |
| **Combinação** | Ordem NÃO importa, subconjunto de n | `C(n,p) = n!/(p!(n-p)!)` |

## Framework de decisão

| Pergunta | Se SIM | Se NÃO |
|----------|--------|--------|
| A ordem dos elementos importa? | Arranjo ou Permutação | Combinação |
| Uso todos os elementos? | Permutação | Arranjo ou Combinação |
| Cenários são excludentes? | Princípio Aditivo (soma) | Princípio Multiplicativo (produto) |

## Aplicações em Data Analytics

### Seleção de amostras
```python
# Quantas amostras de 5 clientes posso tirar de 100?
from math import comb
amostras_possiveis = comb(100, 5)  # Ordem não importa → Combinação
```

### Planejamento de testes
```python
# 3 browsers × 4 resoluções × 2 OS = cenários de teste
from math import prod
cenarios = prod([3, 4, 2])  # Princípio multiplicativo → 24 cenários
```

### Cruzamento de dados para relatórios
```python
# Quantas combinações de 2 métricas posso cruzar de 8 disponíveis?
cruzamentos = comb(8, 2)  # 28 cruzamentos possíveis
```

## Heurísticas

| Situação | Usar |
|----------|------|
| Selecionar subconjunto para análise | Combinação (ordem irrelevante) |
| Definir sequência de etapas de pipeline | Arranjo (ordem importa) |
| Calcular cenários de teste (variáveis independentes) | Princípio Multiplicativo |
| Opções alternativas/excludentes | Princípio Aditivo |
| Ranking ou ordenação de resultados | Permutação |

## Anti-patterns

| Erro comum | Correto |
|------------|---------|
| Usar arranjo quando ordem não importa | Usar combinação — porque `C(10,3) = 120` vs `A(10,3) = 720` |
| Somar quando cenários são simultâneos | Multiplicar — princípio multiplicativo |
| Multiplicar quando cenários são excludentes | Somar — princípio aditivo |
| Ignorar contagem e estimar "a olho" | Calcular — porque intuição falha com números grandes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
