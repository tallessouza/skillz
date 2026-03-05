---
name: rs-data-analytics-tensores
description: "Applies tensor dimensionality concepts when working with NumPy arrays, TensorFlow tensors, or multidimensional data structures in Python. Use when user asks to 'create an array', 'work with numpy', 'build a matrix', 'handle multidimensional data', or 'prepare data for machine learning'. Maps scalar/vector/matrix/tensor to 0D/1D/2D/3D+ arrays. Make sure to use this skill whenever creating or manipulating ndarray objects. Not for tensor calculus in physics or pure mathematical proofs."
---

# Tensores — Dimensionalidade de Estruturas de Dados

> Ao trabalhar com estruturas de dados multidimensionais, identifique a dimensionalidade (rank) correta e use a terminologia consistente entre matematica e codigo.

## Rules

1. **Identifique o rank antes de criar** — escalar=0D, vetor=1D, matriz=2D, tensor=3D+, porque a dimensionalidade determina quais operacoes sao validas
2. **Use ndim para validar** — sempre verifique `.ndim` apos criar arrays, porque erros de dimensionalidade causam bugs silenciosos em operacoes de broadcasting
3. **Nomeie variaveis pela dimensionalidade** — `user_scores_matrix` nao `data`, `embedding_tensor` nao `values`, porque o nome comunica a estrutura esperada
4. **Tensores 3D+ sao arrays encadeados** — uma matriz dentro de outra matriz, formando dimensoes adicionais, porque essa visualizacao mental evita confusao ao fazer reshape

## Mapa de dimensionalidade

| Objeto Matematico | Rank/nDim | NumPy | TensorFlow | Exemplo |
|-------------------|-----------|-------|------------|---------|
| Escalar | 0 | `np.array(5)` | `tf.constant(5)` | Um unico numero |
| Vetor | 1 | `np.array([1,2,3])` | `tf.constant([1,2,3])` | Lista de numeros |
| Matriz | 2 | `np.array([[1,2],[3,4]])` | `tf.constant([[1,2],[3,4]])` | Tabela de numeros |
| Tensor | 3+ | `np.array([[[1,2],[3,4]],[[5,6],[7,8]]])` | `tf.constant(...)` | Matrizes encadeadas |

## How to write

### Criando arrays com dimensionalidade correta

```python
import numpy as np

# 0D — escalar
scalar = np.array(42)
assert scalar.ndim == 0

# 1D — vetor
feature_vector = np.array([1.0, 2.0, 3.0])
assert feature_vector.ndim == 1

# 2D — matriz
user_ratings_matrix = np.array([
    [5, 3, 0],
    [4, 0, 1],
    [1, 1, 5]
])
assert user_ratings_matrix.ndim == 2

# 3D — tensor (batch de matrizes)
image_batch_tensor = np.array([
    [[255, 0, 0], [0, 255, 0]],
    [[0, 0, 255], [255, 255, 0]]
])
assert image_batch_tensor.ndim == 3
```

## Example

**Before (dimensionalidade ignorada):**
```python
data = np.array([[1, 2], [3, 4]])
values = np.array([1, 2, 3])
x = np.array(5)
more_data = np.array([[[1,2],[3,4]],[[5,6],[7,8]]])
```

**After (dimensionalidade explicita no nome):**
```python
correlation_matrix = np.array([[1, 2], [3, 4]])       # 2D
feature_vector = np.array([1, 2, 3])                   # 1D
learning_rate_scalar = np.array(5)                      # 0D
rgb_image_tensor = np.array([[[1,2],[3,4]],[[5,6],[7,8]]])  # 3D
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado unico (peso, bias, taxa) | Escalar 0D, nomeie pelo significado |
| Lista de features ou labels | Vetor 1D |
| Tabela rows x columns | Matriz 2D |
| Batch de imagens ou sequencias temporais | Tensor 3D+ |
| Duvida sobre dimensionalidade | Imprima `.shape` e `.ndim` antes de operar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `data = np.array(...)` (generico) | `price_matrix = np.array(...)` |
| Reshape sem verificar ndim | `assert tensor.ndim == 3` antes do reshape |
| Confundir shape `(3,)` com `(3,1)` | Vetor 1D vs matriz coluna 2D — escolha explicitamente |
| `list` Python para calculo numerico | `np.array()` com dtype explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
