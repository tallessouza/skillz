---
name: rs-data-analytics-grafico-box-plot-exercicio
description: "Applies BoxPlot construction procedure when analyzing datasets with quartiles, IQR, limits, and outliers. Use when user asks to 'build a boxplot', 'find outliers', 'calculate quartiles', 'analyze data distribution', or 'construct box and whisker plot'. Follows step-by-step: sort data, find median (Q2), calculate Q1/Q3, compute IQR, determine limits, identify outliers. Make sure to use this skill whenever building boxplots or identifying outliers in datasets. Not for histograms, scatter plots, or other chart types."
---

# Construcao de Grafico BoxPlot

> Construir um BoxPlot seguindo a sequencia exata: ordenar, mediana, quartis, AIQ, limites, outliers.

## Rules

1. **Sempre ordene primeiro (Roll)** — organize os dados em ordem crescente antes de qualquer calculo, porque quartis dependem da posicao ordenada
2. **Mediana (Q2) primeiro** — divida o conjunto em duas metades iguais antes de calcular Q1 e Q3, porque Q1 e Q3 dependem dessa divisao
3. **Para quantidade par, faca a media** — se N e par, a mediana e a media dos dois valores centrais (posicoes N/2 e N/2+1), porque nao existe um unico valor central
4. **Limites usam 1.5x AIQ, nao os extremos dos dados** — limite superior = Q3 + 1.5*AIQ, limite inferior = Q1 - 1.5*AIQ, porque os limites definem a fronteira de normalidade
5. **Compare limites calculados com dados reais** — se o limite calculado excede o range dos dados, use o maior/menor valor real como limite do bigode, porque o bigode nao pode ir alem dos dados existentes
6. **Valores fora dos limites sao outliers** — marque-os como pontos isolados no grafico, porque representam valores discrepantes

## Steps

### Step 1: Ordenar (Roll)
```
Dados brutos → Ordenar em ordem crescente
Identificar: menor valor, maior valor, total N
```

### Step 2: Calcular Mediana (Q2)
```
Se N par:  Q2 = (valor[N/2] + valor[N/2 + 1]) / 2
Se N impar: Q2 = valor[(N+1)/2]
```

### Step 3: Calcular Q1 e Q3
```
Q1 = mediana da metade inferior (posicoes 1 a N/2)
Q3 = mediana da metade superior (posicoes N/2+1 a N)
```

### Step 4: Amplitude Interquartil (AIQ)
```
AIQ = Q3 - Q1
```

### Step 5: Limites
```
Limite Superior Calculado = Q3 + 1.5 * AIQ
Limite Inferior Calculado = Q1 - 1.5 * AIQ

Limite Superior Real = min(Limite Superior Calculado, maior valor dos dados)
Limite Inferior Real = max(Limite Inferior Calculado, menor valor dos dados)
```

### Step 6: Outliers
```
Outliers = valores < Limite Inferior Calculado OU valores > Limite Superior Calculado
```

## Example

**Dados: 40 notas de alunos (ja ordenadas)**
```
0  10 20 25 30 35 40 40 45 50
50 55 55 60 60 65 65 70 70 70
70 70 75 75 75 80 80 80 80 85
85 85 90 90 90 95 95 95 100 100
```

**Resolucao:**
```
N = 40 (par)
Q2 = (valor[20] + valor[21]) / 2 = (70 + 70) / 2 = 70
Q1 = (valor[10] + valor[11]) / 2 = (50 + 50) / 2 = 50
Q3 = (valor[30] + valor[31]) / 2 = (80 + 80) / 2 = 80

AIQ = 80 - 50 = 30

Limite Superior Calculado = 80 + 1.5 * 30 = 125
Limite Inferior Calculado = 50 - 1.5 * 30 = 5

Limite Superior Real = min(125, 100) = 100  (dados so vao ate 100)
Limite Inferior Real = max(5, 0) = 5        (mas 0 < 5, entao bigode para em 5)

Outlier: 0 (esta abaixo do limite inferior 5)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Limite calculado > maior dado | Use o maior dado como fim do bigode |
| Limite calculado < menor dado | Use o menor dado como fim do bigode |
| Multiplos outliers no mesmo lado | Marque cada um como ponto isolado |
| Q1 = Q2 ou Q2 = Q3 | Normal, a caixa fica assimetrica |
| Todos os valores dentro dos limites | Sem outliers, bigodes vao ate os extremos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar min/max dos dados como limites diretamente | Calcular Q1 - 1.5*AIQ e Q3 + 1.5*AIQ primeiro |
| Calcular Q1/Q3 antes da mediana | Sempre Q2 primeiro, depois Q1 e Q3 |
| Esquecer de comparar limite calculado com dados reais | Sempre verificar se o bigode ultrapassa os dados |
| Ignorar valores fora dos limites | Marcar como outliers explicitamente |
| Calcular AIQ como max - min | AIQ = Q3 - Q1 (amplitude interquartil, nao total) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
