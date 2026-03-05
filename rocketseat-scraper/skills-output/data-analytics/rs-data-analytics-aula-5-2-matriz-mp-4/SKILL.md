---
name: rs-data-analytics-matrizes
description: "Applies matrix concepts and terminology when working with tabular data structures in Python (NumPy, Pandas). Use when user asks to 'create a matrix', 'work with dataframes', 'manipulate arrays', 'understand matrix types', or references 'ndarray', 'reshape', '2D array'. Ensures correct vocabulary (linhas/colunas, matriz quadrada, identidade, simetrica) and proper matrix construction order. Make sure to use this skill whenever generating code that creates or manipulates 2D arrays or dataframes. Not for matrix arithmetic operations, determinants, or eigenvalues."
---

# Matrizes — Conceitos Fundamentais

> Toda estrutura tabular (DataFrame, 2D array, planilha) e uma matriz: dados organizados em linhas e colunas com enderecos precisos.

## Hierarquia de Dados

1. **Escalar** — um unico numero (`x = 7`), representado por letra minuscula
2. **Vetor** — conjunto de escalares em 1D (`[1, 2, 3]`), equivale a um array/ndarray1d
3. **Matriz** — conjunto de vetores organizados em linhas e colunas (2D), equivale a ndarray2d/DataFrame

## Rules

1. **Dimensao e sempre M x N** — M = linhas (primeiro), N = colunas (segundo), porque a convencao matematica universal e linhas primeiro
2. **Endereco de elemento e (i, j)** — i = linha, j = coluna, porque localizar dados exige coordenada precisa (como celula no Excel)
3. **Construa da esquerda para direita, de cima para baixo** — preenchimento segue ordem de leitura, porque garante consistencia na indexacao
4. **Matriz quadrada: M == N** — quando linhas == colunas, porque habilita operacoes especiais (determinante, inversa)
5. **Matriz identidade: diagonal principal = 1, resto = 0** — funciona como o "1" da multiplicacao de matrizes, porque A * I = A

## Mapeamento para Python

### Escalar → Vetor → Matriz

```python
import numpy as np

escalar = 7                          # 0D - numero unico
vetor = np.array([1, 2, 3])         # 1D - ndarray1d
matriz = np.array([[1, 2],
                    [3, 4],
                    [5, 6]])          # 2D - ndarray2d (3x2)
```

### DataFrame como Matriz

```python
import pandas as pd

# Tabela (com rotulos) → Matriz (so numeros)
df = pd.DataFrame({
    'altura': [1.70, 1.65, 1.80],
    'peso': [70, 60, 85],
    'idade': [25, 30, 28]
})

# Extrair a matriz subjacente
matriz_valores = df.values  # shape (3, 3) → matriz 3x3 quadrada
```

## Tipos de Matrizes

| Tipo | Condicao | Exemplo shape |
|------|----------|---------------|
| Linha | 1 linha, N colunas | `(1, 4)` |
| Coluna | M linhas, 1 coluna | `(3, 1)` |
| Retangular | M != N | `(2, 3)` |
| Quadrada | M == N | `(3, 3)` |
| Identidade | diagonal=1, resto=0 | `np.eye(3)` |
| Simetrica | A == A.T | `(3, 3)` |
| Triangular | zeros acima ou abaixo da diagonal | `np.tril()` / `np.triu()` |

## Example

**Before (vocabulario impreciso):**
```python
data = [[1,2],[3,4],[5,6]]  # "array de arrays"
print(len(data))      # "tamanho"
print(len(data[0]))   # "tamanho interno"
```

**After (com vocabulario correto):**
```python
matriz = np.array([[1, 2],
                    [3, 4],
                    [5, 6]])  # matriz 3x2
linhas, colunas = matriz.shape  # 3 linhas, 2 colunas
elemento_2_1 = matriz[1, 0]     # linha 2, coluna 1 → valor 3
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criar matriz com np | Sempre especificar shape como comentario (MxN) |
| Acessar elemento | Usar notacao `[i, j]` com comentario da coordenada |
| Converter tabela para matriz | Usar `.values` ou `.to_numpy()` |
| Verificar se e quadrada | Checar `shape[0] == shape[1]` |
| Criar identidade | Usar `np.eye(n)`, nunca construir manualmente |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `# array 2D` (sem dimensao) | `# matriz 3x2 (3 linhas, 2 colunas)` |
| `data[1][0]` (lista de listas) | `matriz[1, 0]` (indexacao NumPy) |
| `len(m), len(m[0])` para dimensoes | `m.shape` → `(linhas, colunas)` |
| Identidade manual `[[1,0],[0,1]]` | `np.eye(2)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
