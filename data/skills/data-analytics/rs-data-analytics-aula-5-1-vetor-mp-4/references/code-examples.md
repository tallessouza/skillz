# Code Examples: Vetores

## 1. Representacao de vetores

### JavaScript
```javascript
const vector = [1, 2, 3, 4]
```

### Python
```python
vector = [1, 2, 3, 4]
```

Vetores tambem podem conter strings:
```javascript
const names = ["Maria", "Joao", "Ana"]
```

### Vetores dentro de vetores (formando tabela/matriz)
```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
// Cada array interno e um vetor
// Juntos formam uma matriz (tabela)
```

## 2. Soma de vetores

### Conceito matematico
```
A = [3, 2]
B = [1, 4]

A + B = [3+1, 2+4] = [4, 6]
```

Regra: vetores devem ter o mesmo tamanho (mesma quantidade de elementos).

### JavaScript
```javascript
const vectorA = [1, 2, 3]
const vectorB = [4, 5, 6]

// Usando map com index para acessar posicao correspondente
const vectorSum = vectorA.map((element, index) => element + vectorB[index])
// Resultado: [5, 7, 9]

// Detalhamento:
// posicao 0: 1 + 4 = 5
// posicao 1: 2 + 5 = 7
// posicao 2: 3 + 6 = 9
```

### Python
```python
vector_a = [1, 2, 3]
vector_b = [4, 5, 6]

vector_sum = [a + b for a, b in zip(vector_a, vector_b)]
# Resultado: [5, 7, 9]
```

## 3. Multiplicacao por escalar

### Conceito matematico
```
V = [2, 5]
escalar = 3

3 * V = [3*2, 3*5] = [6, 15]
```

O escalar multiplica **cada elemento** do vetor individualmente.

### JavaScript
```javascript
const vector = [2, 5]
const scalar = 3

// map percorre cada elemento multiplicando pelo escalar
const scaledVector = vector.map(element => element * scalar)
// Resultado: [6, 15]

// Detalhamento:
// 3 * 2 = 6
// 3 * 5 = 15
```

### Python
```python
vector = [2, 5]
scalar = 3

scaled_vector = [scalar * element for element in vector]
# Resultado: [6, 15]
```

## 4. Variacoes e cenarios reais

### Soma de vetores com validacao (JavaScript)
```javascript
function sumVectors(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Cannot sum vectors of different sizes: ${a.length} vs ${b.length}`)
  }
  return a.map((element, index) => element + b[index])
}

// Funciona:
sumVectors([1, 2, 3], [4, 5, 6]) // [5, 7, 9]

// Lanca erro:
sumVectors([1, 2], [4, 5, 6]) // Error: Cannot sum vectors of different sizes: 2 vs 3
```

### Subtracao de vetores (mesma logica)
```javascript
const revenue = [1000, 2000, 3000]
const expenses = [400, 500, 600]
const profit = revenue.map((rev, i) => rev - expenses[i])
// [600, 1500, 2400]
```

### Com NumPy (operacoes vetorizadas nativas)
```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Soma — sem precisar de loop ou list comprehension
vector_sum = a + b  # array([5, 7, 9])

# Multiplicacao por escalar
scaled = 3 * a  # array([3, 6, 9])

# Subtracao
diff = a - b  # array([-3, -3, -3])
```

### Com Pandas (colunas como vetores)
```python
import pandas as pd

df = pd.DataFrame({
    'person': ['Maria', 'Joao', 'Ana', 'Carlos'],
    'age': [25, 56, 31, 43]
})

# A coluna 'age' e um vetor (Series)
ages = df['age']  # Series: [25, 56, 31, 43]

# Operacao escalar na coluna inteira
ages_in_months = df['age'] * 12  # [300, 672, 372, 516]

# Soma de duas colunas (vetores)
df['total'] = df['revenue'] + df['expenses']
```

## 5. Indices zero-based — detalhe importante

```javascript
const vector = [10, 20, 30]

// Posicoes:
// vector[0] = 10  (primeiro elemento)
// vector[1] = 20  (segundo elemento)
// vector[2] = 30  (terceiro elemento)

// ERRADO: acessar posicao 3 (nao existe)
// vector[3] = undefined
```

```python
vector = [10, 20, 30]

# Posicoes:
# vector[0] = 10
# vector[1] = 20
# vector[2] = 30
```