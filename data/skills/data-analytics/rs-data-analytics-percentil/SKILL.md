---
name: rs-data-analytics-percentil
description: "Applies percentile calculation methods when analyzing data distribution in grouped frequency tables. Use when user asks to 'calculate percentile', 'find P20', 'analyze data distribution', 'interpret position measures', or 'find what percentage falls below a value'. Converts percentage to fraction K, finds position, applies interpolation formula with LI, cumulative frequency, and class width. Make sure to use this skill whenever computing percentiles, deciles, or relating them to quartiles and median. Not for mean, mode, standard deviation, or ungrouped data percentiles."
---

# Percentil — Medida de Posição

> Calcule percentis em tabelas de frequência agrupada convertendo a porcentagem em fração K, localizando a posição na frequência acumulada e aplicando a fórmula de interpolação.

## Rules

1. **Percentil divide em 100 partes** — cada parte vale 1%, porque permite localizar qualquer ponto da distribuição (P1 a P100)
2. **Converta percentual em fração K** — P20 → K = 20/100, porque a fórmula usa K multiplicado pelo somatório de frequências
3. **Ache a posição antes de interpolar** — Posição = K × Σf, porque sem a posição não se sabe em qual classe o percentil cai
4. **Localize a classe pela frequência acumulada** — a classe correta é aquela cuja acumulada contém a posição, porque interpolar na classe errada invalida o resultado
5. **Relacione percentis com outras medidas** — P25 = Q1, P50 = Mediana, P75 = Q3, porque são a mesma operação com K diferente
6. **Interprete o resultado como limiar** — P20 = 165 significa que 20% dos dados estão abaixo de 165, porque os dados estão em ordem crescente

## How to write

### Fórmula de interpolação

```
P_k = LI + ((Posição - F_ant) / f_i) × h
```

Onde:
- `LI` = limite inferior da classe do percentil
- `Posição` = K × Σf
- `F_ant` = frequência acumulada da classe anterior
- `f_i` = frequência da classe do percentil
- `h` = amplitude da classe

### Cálculo passo a passo

```python
# 1. Definir K
k = 20 / 100  # Para P20

# 2. Calcular posição
soma_frequencias = 40
posicao = k * soma_frequencias  # 0.2 × 40 = 8

# 3. Localizar classe (freq acumulada >= posição)
# Classe: 164 |— 168, acumulada anterior = 7, f_i = 4

# 4. Interpolar
LI = 164
F_ant = 7
f_i = 4
h = 4  # 168 - 164
P20 = LI + ((posicao - F_ant) / f_i) * h
# P20 = 164 + ((8 - 7) / 4) * 4 = 165
```

## Example

**Dado:** Tabela de frequência com Σf = 40. Calcular P20.

**Before (erro comum):**
```
P20 = 20% de 40 = 8
"O percentil 20 é 8"  # ERRADO: confundiu posição com valor
```

**After (com esta skill):**
```
K = 20/100
Posição = 0.2 × 40 = 8
Classe: 164 |— 168 (acumulada anterior = 7, f_i = 4)
P20 = 164 + ((8 - 7) / 4) × 4 = 165
→ 20% dos pesquisados têm valores abaixo de 165
```

## Heuristics

| Situação | Faça |
|----------|------|
| Pediram P50 | Use a mesma fórmula — é a mediana |
| Pediram Q1 | Use K = 25/100 (P25 = Q1) |
| Pediram D3 (decil 3) | Use K = 30/100 (D3 = P30) |
| Posição cai exatamente no limite entre classes | Use a classe seguinte como classe do percentil |
| Dados não agrupados | Ordene, calcule posição, interpole entre valores adjacentes |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Confundir posição com o valor do percentil | Posição localiza a classe; o valor vem da interpolação |
| Esquecer de simplificar K antes de multiplicar | Simplifique 20/100 = 1/5 para evitar erro aritmético |
| Usar frequência acumulada da própria classe como F_ant | F_ant é a acumulada da classe ANTERIOR |
| Dizer "P20 = 165 significa que 20% têm 165" | Diga "20% têm valores ABAIXO de 165" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
