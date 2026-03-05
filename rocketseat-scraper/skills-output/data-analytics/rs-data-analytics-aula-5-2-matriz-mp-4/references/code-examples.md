# Code Examples: Matrizes

## 1. Hierarquia completa: Escalar → Vetor → Matriz

```python
import numpy as np

# Escalar (0D) — um unico numero
escalar = np.array(7)
print(escalar.ndim)  # 0

# Vetor (1D) — conjunto de escalares
vetor = np.array([1, 2, 3])
print(vetor.ndim)    # 1
print(vetor.shape)   # (3,)

# Matriz (2D) — conjunto de vetores
matriz = np.array([[1, 2, 3],
                    [4, 5, 6]])
print(matriz.ndim)   # 2
print(matriz.shape)  # (2, 3) → 2 linhas, 3 colunas
```

## 2. Construindo a matriz A(3,2) da aula

```python
# Matriz A com 3 linhas e 2 colunas
# Preenchimento: esquerda→direita, cima→baixo
A = np.array([
    [11, 12],   # L1: a₁₁, a₁₂
    [21, 22],   # L2: a₂₁, a₂₂
    [31, 32]    # L3: a₃₁, a₃₂
])

linhas, colunas = A.shape  # 3, 2

# Acessar elemento por coordenada (i, j)
# Lembre: Python usa indice 0, matematica usa indice 1
a_21 = A[1, 0]  # linha 2, coluna 1 → valor 21
```

## 3. Tabela Excel → Matriz

```python
import pandas as pd

# Tabela com rotulos (como no Excel)
tabela = pd.DataFrame({
    'altura': [1.70, 1.65, 1.80],
    'peso':   [70, 60, 85],
    'idade':  [25, 30, 28]
}, index=['Pessoa 1', 'Pessoa 2', 'Pessoa 3'])

print(tabela)
#           altura  peso  idade
# Pessoa 1    1.70    70     25
# Pessoa 2    1.65    60     30
# Pessoa 3    1.80    85     28

# Extrair somente os numeros (matriz pura)
matriz = tabela.to_numpy()
print(matriz)
# [[ 1.7  70.   25. ]
#  [ 1.65 60.   30. ]
#  [ 1.8  85.   28. ]]

print(matriz.shape)  # (3, 3) → matriz quadrada
```

## 4. Todos os tipos de matrizes

```python
import numpy as np

# Matriz Linha (1 x N)
linha = np.array([[1, 2, 3, 4]])
print(linha.shape)  # (1, 4)

# Matriz Coluna (M x 1)
coluna = np.array([[1], [2], [3]])
print(coluna.shape)  # (3, 1)

# Matriz Retangular (M != N)
retangular = np.array([[1, 2, 3],
                        [4, 5, 6]])
print(retangular.shape)  # (2, 3)

# Matriz Quadrada (M == N)
quadrada = np.array([[1, 2, 3],
                      [4, 5, 6],
                      [7, 8, 9]])
print(quadrada.shape)  # (3, 3)
print(quadrada.shape[0] == quadrada.shape[1])  # True

# Matriz Identidade
identidade = np.eye(3)
print(identidade)
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]

# Matriz Triangular Inferior
triangular_inf = np.tril(quadrada)
print(triangular_inf)
# [[1 0 0]
#  [4 5 0]
#  [7 8 9]]

# Matriz Triangular Superior
triangular_sup = np.triu(quadrada)
print(triangular_sup)
# [[1 2 3]
#  [0 5 6]
#  [0 0 9]]

# Matriz Simetrica
simetrica = np.array([[1, -3,  5],
                       [-3,  2,  7],
                       [5,  7,  4]])
print(np.array_equal(simetrica, simetrica.T))  # True
```

## 5. Verificacoes uteis

```python
def classificar_matriz(m):
    """Classifica uma matriz pelo tipo."""
    linhas, colunas = m.shape

    if linhas == 1:
        return "Matriz Linha"
    if colunas == 1:
        return "Matriz Coluna"
    if linhas != colunas:
        return "Matriz Retangular"

    # Daqui pra baixo, e quadrada
    if np.array_equal(m, np.eye(linhas)):
        return "Matriz Identidade"
    if np.array_equal(m, m.T):
        return "Matriz Simetrica"
    if np.allclose(m, np.tril(m)):
        return "Matriz Triangular Inferior"
    if np.allclose(m, np.triu(m)):
        return "Matriz Triangular Superior"

    return "Matriz Quadrada"
```

## 6. ndarray dimensions (0D, 1D, 2D, 3D)

O instrutor menciona que no NumPy existem 0D, 1D, 2D, 3D:

```python
# 0D — escalar
arr_0d = np.array(42)
print(arr_0d.ndim)  # 0

# 1D — vetor
arr_1d = np.array([1, 2, 3])
print(arr_1d.ndim)  # 1

# 2D — matriz
arr_2d = np.array([[1, 2], [3, 4]])
print(arr_2d.ndim)  # 2

# 3D — tensor (conjunto de matrizes)
arr_3d = np.array([[[1, 2], [3, 4]],
                    [[5, 6], [7, 8]]])
print(arr_3d.ndim)  # 3
print(arr_3d.shape) # (2, 2, 2)
```