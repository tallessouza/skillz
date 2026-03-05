# Code Examples: Grafico BoxPlot

## Exemplo completo: construcao passo a passo

```python
import numpy as np

dados = [12, 15, 18, 20, 22, 25, 28, 30, 35, 42, 135]
dados_ordenados = sorted(dados)

# Mediana (Q2)
Q2 = np.median(dados_ordenados)

# Quartis
Q1 = np.percentile(dados_ordenados, 25)
Q3 = np.percentile(dados_ordenados, 75)

# Amplitude interquartil
IQR = Q3 - Q1

# Limites calculados ("uma caixa e meia")
ls_calculado = Q3 + 1.5 * IQR
li_calculado = Q1 - 1.5 * IQR

# Limites reais (ajustados contra min/max dos dados)
limite_superior = min(max(dados_ordenados), ls_calculado)
limite_inferior = max(min(dados_ordenados), li_calculado)

# Identificar outliers
outliers = [x for x in dados_ordenados if x > ls_calculado or x < li_calculado]

print(f"Q1: {Q1}, Q2: {Q2}, Q3: {Q3}")
print(f"IQR: {IQR}")
print(f"Limite inferior: {limite_inferior}, Limite superior: {limite_superior}")
print(f"Outliers: {outliers}")
```

## Box plot com matplotlib

```python
import matplotlib.pyplot as plt

dados = [12, 15, 18, 20, 22, 25, 28, 30, 35, 42, 135]

fig, axes = plt.subplots(1, 2, figsize=(10, 5))

# Vertical
axes[0].boxplot(dados, vert=True, patch_artist=True)
axes[0].set_title("Box Plot Vertical")

# Horizontal
axes[1].boxplot(dados, vert=False, patch_artist=True)
axes[1].set_title("Box Plot Horizontal")

plt.tight_layout()
plt.show()
```

## Comparando distribuicoes lado a lado

```python
import matplotlib.pyplot as plt

grupo_a = [10, 12, 14, 15, 16, 18, 20, 22, 25]
grupo_b = [5, 15, 20, 22, 25, 30, 35, 80, 90]

fig, ax = plt.subplots()
ax.boxplot([grupo_a, grupo_b], labels=["Grupo A", "Grupo B"], patch_artist=True)
ax.set_title("Comparacao de Distribuicoes")
plt.show()
```

## Com pandas (caso comum em analise de dados)

```python
import pandas as pd

df = pd.DataFrame({
    "vendas": [100, 120, 130, 140, 150, 160, 200, 250, 800]
})

# Estatisticas descritivas (inclui quartis)
print(df["vendas"].describe())

# Box plot direto do DataFrame
df.boxplot(column="vendas")
```

## Detectando e removendo outliers com IQR

```python
def remover_outliers(dados):
    Q1 = np.percentile(dados, 25)
    Q3 = np.percentile(dados, 75)
    IQR = Q3 - Q1

    limite_inferior = Q1 - 1.5 * IQR
    limite_superior = Q3 + 1.5 * IQR

    dados_limpos = [x for x in dados if limite_inferior <= x <= limite_superior]
    outliers = [x for x in dados if x < limite_inferior or x > limite_superior]

    return dados_limpos, outliers

limpos, outliers = remover_outliers([12, 15, 18, 20, 22, 25, 28, 30, 35, 42, 135])
print(f"Dados limpos: {limpos}")
print(f"Outliers removidos: {outliers}")
```