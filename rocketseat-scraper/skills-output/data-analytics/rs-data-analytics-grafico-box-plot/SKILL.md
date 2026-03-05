---
name: rs-data-analytics-grafico-box-plot
description: "Applies box plot (diagrama de caixa) construction and outlier detection when analyzing data distributions. Use when user asks to 'create a box plot', 'detect outliers', 'find discrepant values', 'analyze data dispersion', or 'build a diagrama de caixa'. Guides quartile calculation, IQR computation, and limit determination. Make sure to use this skill whenever visualizing data spread or identifying outliers in datasets. Not for bar charts, histograms, scatter plots, or other visualization types."
---

# Grafico BoxPlot (Diagrama de Caixa)

> Construa box plots calculando mediana, quartis, amplitude interquartil e limites para identificar outliers — valores que distorcem a media.

## Rules

1. **Organize os dados primeiro (roll)** — ordene todos os valores antes de qualquer calculo, porque quartis dependem da posicao dos dados ordenados
2. **Calcule na ordem: mediana → Q1 → Q3 → IQR → limites** — cada etapa depende da anterior, pular etapas causa erros em cascata
3. **Limites nao sao necessariamente min/max dos dados** — o limite superior e `min(max_dados, Q3 + 1.5 * IQR)` e o inferior e `max(min_dados, Q1 - 1.5 * IQR)`, porque o limite real depende de qual valor e menor
4. **Pense "uma caixa e meia"** — o limite e 1.5x o tamanho da caixa (IQR) projetado para frente do Q3 e para tras do Q1
5. **Outliers distorcem a media** — descarte-os da analise ou investigue se houve erro na coleta antes de tomar decisoes

## How to write

### Calculo do IQR e limites

```python
# Amplitude interquartil
IQR = Q3 - Q1

# Limites calculados (1 caixa e meia)
limite_superior_calculado = Q3 + 1.5 * IQR
limite_inferior_calculado = Q1 - 1.5 * IQR

# Limites reais: nunca ultrapassam os dados existentes
limite_superior = min(max(dados), limite_superior_calculado)
limite_inferior = max(min(dados), limite_inferior_calculado)

# Outliers: quem ultrapassa os limites calculados
outliers = [x for x in dados if x > limite_superior_calculado or x < limite_inferior_calculado]
```

### Box plot com matplotlib

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.boxplot(dados, vert=True, patch_artist=True)
ax.set_title("Diagrama de Caixa")
plt.show()
```

## Example

**Dados:** Q3 = 70, Q1 = 40, IQR = 30, maior valor = 100

```
IQR = 70 - 40 = 30
Limite superior calculado = 70 + 1.5 * 30 = 70 + 45 = 115
Maior valor dos dados = 100

Como 100 < 115 → limite superior real = 100 (nao ha outliers acima)

Se o maior valor fosse 135:
  135 > 115 → limite superior real = 115
  135 seria um outlier
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Media muito diferente da mediana | Suspeite de outliers, construa box plot |
| Valor isolado longe do centro | Calcule limites antes de classificar como outlier |
| Outlier identificado | Investigue coleta antes de descartar |
| Dados com poucos registros | Box plot pode nao ser representativo, prefira tabela |
| Comparar distribuicoes | Use box plots lado a lado (horizontal ou vertical) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Assumir que min/max sao os limites | Calcular Q1 - 1.5*IQR e Q3 + 1.5*IQR |
| Remover outliers sem investigar | Verificar se houve erro na coleta |
| Confiar na media com outliers presentes | Usar mediana como medida central |
| Esquecer de ordenar os dados | Sempre fazer o roll antes dos calculos |
| Decorar a formula sem entender | Pensar "uma caixa e meia para cada lado" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
