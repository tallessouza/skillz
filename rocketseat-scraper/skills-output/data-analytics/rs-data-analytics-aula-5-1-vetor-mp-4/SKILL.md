---
name: rs-data-analytics-vetores
description: "Applies vector concepts and operations when writing data manipulation code in JavaScript or Python. Use when user asks to 'sum arrays', 'multiply array by scalar', 'manipulate dataframe columns', 'work with vectors', or 'linear algebra operations'. Enforces same-size validation for vector addition, element-wise operations via map/list comprehension, and correct zero-based indexing. Make sure to use this skill whenever generating code that operates on numerical arrays element-wise. Not for matrix operations, machine learning model building, or physics simulations."
---

# Vetores — Operacoes com Arrays como Vetores

> Trate arrays numericos como vetores: valide tamanhos antes de operar, use operacoes element-wise, e nomeie pelo conteudo do vetor.

## Rules

1. **Valide tamanho antes de somar vetores** — vetores so podem ser somados se tiverem a mesma quantidade de elementos, porque operacoes element-wise exigem correspondencia posicional
2. **Some posicao com posicao** — `a[0] + b[0]`, `a[1] + b[1]`, porque vetor soma e formado pelo emparelhamento de indices
3. **Multiplicacao por escalar percorre todo o vetor** — o escalar multiplica cada elemento individualmente, porque o resultado e um novo vetor de mesmo tamanho
4. **Arrays sao vetores** — em JavaScript e Python, arrays/lists sao a representacao direta de vetores matematicos
5. **Indices comecam em 0** — a posicao do primeiro elemento e 0, nao 1, porque assim funcionam arrays em JavaScript e Python
6. **Colunas de DataFrames sao vetores** — cada coluna (Series) do Pandas e um vetor que suporta operacoes element-wise nativas

## How to write

### Soma de vetores (JavaScript)

```javascript
function sumVectors(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length')
  }
  return vectorA.map((element, index) => element + vectorB[index])
}

const vectorA = [1, 2, 3]
const vectorB = [4, 5, 6]
const vectorSum = sumVectors(vectorA, vectorB) // [5, 7, 9]
```

### Multiplicacao por escalar (JavaScript)

```javascript
const vector = [2, 5]
const scalar = 3
const scaledVector = vector.map(element => element * scalar) // [6, 15]
```

### Soma de vetores (Python)

```python
vector_a = [1, 2, 3]
vector_b = [4, 5, 6]
vector_sum = [a + b for a, b in zip(vector_a, vector_b)]  # [5, 7, 9]
```

### Multiplicacao por escalar (Python)

```python
vector = [2, 5]
scalar = 3
scaled_vector = [scalar * element for element in vector]  # [6, 15]
```

### Com NumPy/Pandas (operacoes nativas)

```python
import numpy as np

vector_a = np.array([1, 2, 3])
vector_b = np.array([4, 5, 6])
vector_sum = vector_a + vector_b        # array([5, 7, 9])
scaled = 3 * vector_a                    # array([3, 6, 9])
```

## Example

**Before (sem validacao, nomes genericos):**
```javascript
const data1 = [1, 2, 3]
const data2 = [4, 5]
const result = data1.map((v, i) => v + data2[i]) // [5, 7, NaN] — bug silencioso
```

**After (com validacao e nomes descritivos):**
```javascript
const revenuePerMonth = [1000, 2000, 3000]
const expensesPerMonth = [400, 500, 600]

if (revenuePerMonth.length !== expensesPerMonth.length) {
  throw new Error('Vectors must have the same length')
}
const profitPerMonth = revenuePerMonth.map((revenue, index) => revenue - expensesPerMonth[index])
// [600, 1500, 2400]
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dois arrays numericos do mesmo tamanho | Operacao element-wise com map/zip |
| Arrays de tamanhos diferentes | Validar e lancar erro antes de operar |
| Multiplicar array por numero | `.map(el => el * scalar)` ou list comprehension |
| Coluna de DataFrame | Use operacoes vetorizadas nativas do Pandas/NumPy |
| Vetor de strings | Mesma estrutura, mas operacoes sao concatenacao/transformacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `a.map((v,i) => v + b[i])` sem validar tamanho | Validar `a.length === b.length` antes |
| `for (let i = 1; i <= arr.length; i++)` | `for (let i = 0; i < arr.length; i++)` |
| Loop manual em Python para somar arrays NumPy | `vector_a + vector_b` (operacao nativa) |
| `const data = [1,2,3]` para vetor de precos | `const pricesInCents = [100, 200, 300]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
