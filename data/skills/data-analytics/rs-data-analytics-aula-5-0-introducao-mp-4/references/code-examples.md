# Code Examples: Algebra Linear para Analistas de Dados

## Exemplo 1: Array como vetor

O instrutor menciona arrays em Python e JavaScript como exemplos de vetores.

```python
# Python — um array/lista e um vetor
vendas = [10, 20, 30]

# JavaScript — mesma ideia
# const vendas = [10, 20, 30]
```

O "colchete de um lado e de outro" com valores dentro e a representacao de um vetor na programacao.

## Exemplo 2: Tabela Excel como matriz

```python
# O que voce ve no Excel:
#    A      B      C
# 1  Nome   Idade  Cidade
# 2  Ana    25     SP
# 3  Bruno  30     RJ

# Em algebra linear, isso e uma matriz 2x3 (dados, sem cabecalho):
# | Ana   | 25 | SP |
# | Bruno | 30 | RJ |
```

## Exemplo 3: pandas DataFrame como matriz

```python
import pandas as pd

# Criar um DataFrame — por tras dos panos, e uma matriz
df = pd.DataFrame({
    'nome': ['Ana', 'Bruno', 'Carla'],
    'idade': [25, 30, 28],
    'cidade': ['SP', 'RJ', 'BH']
})

# Cada coluna e um vetor
print(df['idade'].values)  # array([25, 30, 28]) — vetor

# O DataFrame inteiro e uma matriz
print(df.values)
# array([['Ana', 25, 'SP'],
#        ['Bruno', 30, 'RJ'],
#        ['Carla', 28, 'BH']])
```

## Exemplo 4: Array dentro de array = matriz

```python
import numpy as np

# Array simples = vetor (1 dimensao)
vetor = np.array([10, 20, 30])
print(vetor.shape)  # (3,) — 3 elementos

# Array de arrays = matriz (2 dimensoes)
matriz = np.array([
    [10, 20, 30],
    [40, 50, 60]
])
print(matriz.shape)  # (2, 3) — 2 linhas, 3 colunas
```

## Exemplo 5: Dataset de Machine Learning

```python
from sklearn.datasets import load_iris

# Carregar dataset classico
iris = load_iris()

# O dataset e uma matriz
print(iris.data.shape)  # (150, 4) — 150 amostras, 4 features
# 150 vetores-linha, cada um com 4 valores
# A tabela inteira: uma matriz 150x4

# Cada feature (coluna) e um vetor
# Cada amostra (linha) e um vetor
# O conjunto todo e algebra linear em acao
```

## Resumo visual

```
Vetor (1D):     [10, 20, 30]           → lista, coluna, linha

Matriz (2D):    [[10, 20, 30],         → tabela, DataFrame, planilha
                 [40, 50, 60]]

Na pratica:     Excel    = Matriz
                pandas   = Matriz
                array    = Vetor
                array[][]= Matriz
                ML data  = Matriz grande
```