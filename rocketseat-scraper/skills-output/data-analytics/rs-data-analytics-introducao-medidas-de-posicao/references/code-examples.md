# Code Examples: Medidas de Posicao (Separatrizes)

## Calculando separatrizes com Python

### Mediana como separatriz

```python
import numpy as np

dados = [12, 15, 18, 22, 25, 28, 30, 35, 40, 45]

mediana = np.median(dados)
print(f"Mediana (P50): {mediana}")
# 50% dos dados <= mediana, 50% >= mediana
```

### Quartis

```python
q1 = np.percentile(dados, 25)
q2 = np.percentile(dados, 50)  # = mediana
q3 = np.percentile(dados, 75)

print(f"Q1 (25%): {q1}")
print(f"Q2 (50%): {q2}")
print(f"Q3 (75%): {q3}")
print(f"IQR: {q3 - q1}")
```

### Decis

```python
decis = [np.percentile(dados, d * 10) for d in range(1, 10)]
for i, d in enumerate(decis, 1):
    print(f"D{i} ({i*10}%): {d}")
```

### Percentis

```python
# Percentis especificos (ex: P10, P90 para SLA)
p10 = np.percentile(dados, 10)
p90 = np.percentile(dados, 90)
print(f"P10: {p10}")
print(f"P90: {p90}")
print(f"Faixa central 80%: [{p10}, {p90}]")
```

## Equivalencias entre separatrizes

```python
# Demonstrando que sao a mesma coisa em granularidades diferentes
assert np.median(dados) == np.percentile(dados, 50)  # Mediana = P50
assert np.percentile(dados, 25) == np.percentile(dados, 25)  # Q1 = P25
assert np.percentile(dados, 75) == np.percentile(dados, 75)  # Q3 = P75
```

## Visualizacao com box plot (usa quartis)

```python
import matplotlib.pyplot as plt

dados = [12, 15, 18, 22, 25, 28, 30, 35, 40, 45]

fig, ax = plt.subplots()
bp = ax.boxplot(dados, vert=True)
ax.set_title("Box Plot — Separatrizes em acao")
ax.set_ylabel("Valores")

# O box plot mostra: Q1 (base), Q2/mediana (linha), Q3 (topo)
plt.show()
```

## Com pandas

```python
import pandas as pd

df = pd.DataFrame({"valores": [12, 15, 18, 22, 25, 28, 30, 35, 40, 45]})

# describe() ja retorna quartis por padrao
print(df["valores"].describe())
# 25% = Q1, 50% = mediana, 75% = Q3

# Percentis customizados
print(df["valores"].quantile([0.1, 0.25, 0.5, 0.75, 0.9]))
```