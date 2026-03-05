# Code Examples: Operacoes com Matrizes

## Exemplo 1: Soma de matrizes 2×2

Direto do instrutor:

```python
# Matriz A (2x2)
A = [[1, 2],
     [3, 4]]

# Matriz B (2x2)
B = [[5, 6],
     [7, 8]]

# A + B: posicao com posicao
# [1+5, 2+6] = [6, 8]
# [3+7, 4+8] = [10, 12]
result = [[6, 8],
          [10, 12]]
```

## Exemplo 2: Escalar × Matriz

Direto do instrutor:

```python
x = 2  # escalar
C = [[2, 4],
     [6, 8]]

# x * C: multiplica cada elemento por 2
# [2*2, 2*4] = [4, 8]
# [2*6, 2*8] = [12, 16]
result = [[4, 8],
          [12, 16]]
```

## Exemplo 3: Multiplicacao de matrizes

Direto do instrutor:

```python
A = [[-1, 3],
     [2, 1]]

B = [[1, 2],
     [3, 4]]

# Elemento [0][0]: linha 0 de A × coluna 0 de B
# (-1*1) + (3*3) = -1 + 9 = 8

# Elemento [0][1]: linha 0 de A × coluna 1 de B
# (-1*2) + (3*4) = -2 + 12 = 10

# Elemento [1][0]: linha 1 de A × coluna 0 de B
# (2*1) + (1*3) = 2 + 3 = 5

# Elemento [1][1]: linha 1 de A × coluna 1 de B
# (2*2) + (1*4) = 4 + 4 = 8

result = [[8, 10],
          [5, 8]]
```

## Exemplo 4: Validacao de dimensoes para multiplicacao

Do raciocinio do instrutor:

```python
# A (2x3) × B (3x4) → possivel (3 == 3), resultado 2x4
# B (3x4) × A (2x3) → impossivel (4 != 2)

A_shape = (2, 3)
B_shape = (3, 4)

# A × B
assert A_shape[1] == B_shape[0]  # 3 == 3 ✓
result_shape = (A_shape[0], B_shape[1])  # (2, 4)

# B × A
assert B_shape[1] == A_shape[0]  # 4 != 2 ✗ — impossivel!
```

## Exemplo 5: Implementacao completa com NumPy

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Soma (dimensoes devem ser iguais)
soma = A + B  # [[6, 8], [10, 12]]

# Escalar × Matriz
escalar = A * 2  # [[2, 4], [6, 8]]

# Multiplicacao de matrizes
produto = A @ B  # [[19, 22], [43, 50]]
# Equivalente: np.dot(A, B)

# B @ A produz resultado DIFERENTE:
produto_inverso = B @ A  # [[23, 34], [31, 46]]
# Comprova: A×B ≠ B×A
```

## Exemplo 6: Implementacao pura Python com validacao

```python
def matrix_add(a, b):
    """Soma elemento a elemento. Exige dimensoes identicas."""
    ra, ca = len(a), len(a[0])
    rb, cb = len(b), len(b[0])
    if ra != rb or ca != cb:
        raise ValueError(f"Cannot add {ra}x{ca} + {rb}x{cb}")
    return [[a[i][j] + b[i][j] for j in range(ca)] for i in range(ra)]

def matrix_scalar(s, m):
    """Multiplica cada elemento pelo escalar."""
    return [[s * m[i][j] for j in range(len(m[0]))] for i in range(len(m))]

def matrix_multiply(a, b):
    """Produto matricial. Colunas de A devem igualar linhas de B."""
    ca, rb = len(a[0]), len(b)
    if ca != rb:
        raise ValueError(f"Cannot multiply: {len(a)}x{ca} @ {rb}x{len(b[0])}")
    return [
        [sum(a[i][k] * b[k][j] for k in range(ca)) for j in range(len(b[0]))]
        for i in range(len(a))
    ]
```