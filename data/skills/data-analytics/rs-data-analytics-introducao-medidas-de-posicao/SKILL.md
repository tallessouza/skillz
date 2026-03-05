---
name: rs-data-analytics-medidas-posicao-intro
description: "Applies positional measures (separatrices) concepts when analyzing data distributions. Use when user asks to 'calculate median', 'find quartiles', 'compute percentiles', 'split data into parts', or 'analyze data distribution position'. Guides correct usage of median, quartiles, deciles, and percentiles for dividing datasets. Make sure to use this skill whenever working with data partitioning or positional statistics. Not for central tendency (mean, mode) or dispersion measures (variance, std dev)."
---

# Medidas de Posicao (Separatrizes)

> Medidas de posicao dividem os dados ordenados em partes iguais, cada uma representando uma fracao do total.

## Key concept

Medidas de posicao (ou separatrizes) sao valores que dividem um conjunto de dados ordenados em partes iguais. Diferente das medidas de tendencia central (media, moda) que resumem o "centro", e das medidas de dispersao (variancia, desvio padrao) que medem o "espalhamento", as medidas de posicao indicam **onde um valor se situa** dentro da distribuicao.

## Decision framework

| Medida | Divide em | Partes | Uso principal |
|--------|-----------|--------|---------------|
| **Mediana** | 2 partes | 50% + 50% | Valor central, resistente a outliers |
| **Quartis** | 4 partes | 25% cada | Box plots, identificar dispersao e outliers |
| **Decis** | 10 partes | 10% cada | Rankings, faixas de desempenho |
| **Percentis** | 100 partes | 1% cada | Posicionamento preciso, benchmarks |

## How to think about it

### Mediana como separatriz fundamental

A mediana ja e uma medida de posicao: pega todos os dados (100%), divide ao meio. 50% dos valores estao abaixo ou igual a mediana, 50% estao acima ou igual. E o caso mais simples de separatriz.

### Quartis como extensao natural

Se a mediana divide em 2, os quartis dividem em 4:
- **Q1 (25%)** — 25% dos dados abaixo
- **Q2 (50%)** — equivale a mediana
- **Q3 (75%)** — 75% dos dados abaixo

### Percentis para granularidade maxima

Percentis dividem em 100 partes. O percentil 90 (P90) significa que 90% dos dados estao abaixo daquele valor. Util para benchmarks e SLAs.

## Hierarquia das separatrizes

```
Mediana (2 partes)
  └── Quartis (4 partes)
        └── Decis (10 partes)
              └── Percentis (100 partes)
```

Cada nivel e um refinamento do anterior. Q2 = Mediana = P50 = D5.

## Heuristics

| Situacao | Use |
|----------|-----|
| Resumo rapido da posicao central | Mediana |
| Box plot ou analise de dispersao | Quartis (Q1, Q2, Q3) |
| Ranking ou classificacao em faixas | Decis |
| Posicionamento preciso ou SLA | Percentis |
| Dados com outliers | Mediana/Quartis (mais robustos que media) |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Mediana e so medida de tendencia central | Mediana tambem e medida de posicao (separatriz que divide em 2) |
| Quartis sao calculados sobre dados nao ordenados | Dados devem estar ordenados antes de calcular qualquer separatriz |
| Percentil 90 = acertar 90% | Percentil 90 = estar acima de 90% das observacoes |
| Media e mediana sao intercambiaveis | Mediana e posicional e robusta a outliers, media nao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
