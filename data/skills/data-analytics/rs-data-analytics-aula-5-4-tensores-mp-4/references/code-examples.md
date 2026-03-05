# Code Examples: Tensores

## Exemplo 1: Criando cada tipo de tensor em NumPy

```python
import numpy as np

# Escalar — Tensor de rank 0 (0D)
# Um unico numero, sem dimensoes
scalar = np.array(42)
print(f"Valor: {scalar}")
print(f"ndim: {scalar.ndim}")   # 0
print(f"shape: {scalar.shape}") # ()

# Vetor — Tensor de rank 1 (1D)
# Uma lista de numeros
vector = np.array([1, 2, 3])
print(f"Valor: {vector}")
print(f"ndim: {vector.ndim}")   # 1
print(f"shape: {vector.shape}") # (3,)

# Matriz — Tensor de rank 2 (2D)
# Uma tabela de numeros (array de arrays)
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6]
])
print(f"ndim: {matrix.ndim}")   # 2
print(f"shape: {matrix.shape}") # (2, 3)

# Tensor — Rank 3 (3D)
# Matrizes encadeadas
tensor_3d = np.array([
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]],
    [[9, 10], [11, 12]]
])
print(f"ndim: {tensor_3d.ndim}")   # 3
print(f"shape: {tensor_3d.shape}") # (3, 2, 2)
```

## Exemplo 2: Equivalencia com TensorFlow

```python
import tensorflow as tf

# Mesmos conceitos, mesma nomenclatura
scalar_tf = tf.constant(5)           # rank 0
vector_tf = tf.constant([1, 2, 3])   # rank 1
matrix_tf = tf.constant([[1, 2], [3, 4]])  # rank 2
tensor_tf = tf.constant([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])  # rank 3

# TensorFlow usa tf.rank() para obter a dimensionalidade
print(tf.rank(scalar_tf))  # tf.Tensor(0, shape=(), dtype=int32)
print(tf.rank(vector_tf))  # tf.Tensor(1, shape=(), dtype=int32)
print(tf.rank(matrix_tf))  # tf.Tensor(2, shape=(), dtype=int32)
print(tf.rank(tensor_tf))  # tf.Tensor(3, shape=(), dtype=int32)
```

## Exemplo 3: Caso real — batch de imagens como tensor 4D

```python
import numpy as np

# Uma imagem RGB: altura x largura x canais (3D)
single_image = np.random.randint(0, 256, size=(224, 224, 3))
print(f"Uma imagem - ndim: {single_image.ndim}, shape: {single_image.shape}")
# ndim: 3, shape: (224, 224, 3)

# Batch de imagens: batch x altura x largura x canais (4D)
image_batch = np.random.randint(0, 256, size=(32, 224, 224, 3))
print(f"Batch - ndim: {image_batch.ndim}, shape: {image_batch.shape}")
# ndim: 4, shape: (32, 224, 224, 3)

# Cada dimensao tem significado:
# dim 0: qual imagem no batch (32 imagens)
# dim 1: linha da imagem (224 pixels)
# dim 2: coluna da imagem (224 pixels)
# dim 3: canal de cor (R, G, B)
```

## Exemplo 4: Verificando dimensionalidade antes de operacoes

```python
import numpy as np

def matrix_multiply_safe(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Multiplicacao de matrizes com validacao de dimensionalidade."""
    assert a.ndim == 2, f"Esperado matriz 2D, recebido {a.ndim}D"
    assert b.ndim == 2, f"Esperado matriz 2D, recebido {b.ndim}D"
    assert a.shape[1] == b.shape[0], (
        f"Shapes incompativeis: {a.shape} x {b.shape}"
    )
    return a @ b

# Correto
weights_matrix = np.array([[1, 2], [3, 4]])
input_matrix = np.array([[5, 6], [7, 8]])
result = matrix_multiply_safe(weights_matrix, input_matrix)

# Erro claro ao passar vetor em vez de matriz
feature_vector = np.array([1, 2, 3])
# matrix_multiply_safe(feature_vector, weights_matrix)
# AssertionError: Esperado matriz 2D, recebido 1D
```

## Exemplo 5: Diferenca entre vetor 1D e matriz coluna 2D

```python
import numpy as np

# Vetor 1D — shape (3,)
vector_1d = np.array([1, 2, 3])
print(f"1D - ndim: {vector_1d.ndim}, shape: {vector_1d.shape}")

# Matriz coluna 2D — shape (3, 1)
column_matrix = np.array([[1], [2], [3]])
print(f"2D coluna - ndim: {column_matrix.ndim}, shape: {column_matrix.shape}")

# Matriz linha 2D — shape (1, 3)
row_matrix = np.array([[1, 2, 3]])
print(f"2D linha - ndim: {row_matrix.ndim}, shape: {row_matrix.shape}")

# Sao conceitualmente diferentes!
# vector_1d nao e nem "linha" nem "coluna" — e um vetor 1D
# column_matrix e uma matriz 2D com uma coluna
# row_matrix e uma matriz 2D com uma linha
```