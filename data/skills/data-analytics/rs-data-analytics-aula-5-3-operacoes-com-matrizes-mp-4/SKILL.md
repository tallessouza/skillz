---
name: rs-data-analytics-operacoes-matrizes
description: "Applies matrix operation rules when writing code involving matrix addition, subtraction, scalar multiplication, or matrix multiplication. Use when user asks to 'multiply matrices', 'add matrices', 'implement matrix operations', 'linear algebra operations', or 'numpy matrix math'. Enforces dimension validation before operations: same dimensions for add/sub, columns-of-first equals rows-of-second for multiplication. Make sure to use this skill whenever generating code that manipulates matrices or 2D arrays arithmetically. Not for vector operations, tensor operations, or single-array math."
---

# Operacoes com Matrizes

> Antes de qualquer operacao entre matrizes, valide as dimensoes — a operacao so existe se as dimensoes permitirem.

## Rules

1. **Soma/Subtracao exige dimensoes identicas** — matriz A (m×n) so pode somar/subtrair com matriz B (m×n), porque a operacao e elemento-a-elemento, posicao com posicao
2. **Multiplicacao por escalar preserva dimensoes** — cada elemento da matriz e multiplicado pelo escalar, resultado tem mesma dimensao
3. **Multiplicacao de matrizes: colunas da 1a = linhas da 2a** — A (m×p) × B (p×n) = C (m×n), porque cada elemento C[i][j] e o produto escalar da linha i de A pela coluna j de B
4. **A×B ≠ B×A** — multiplicacao de matrizes NAO e comutativa, e muitas vezes B×A sequer e possivel
5. **Sempre valide dimensoes antes de operar** — lance erro claro informando as dimensoes incompativeis

## How to write

### Soma/Subtracao (elemento a elemento)

```python
def add_matrices(a, b):
    rows_a, cols_a = len(a), len(a[0])
    rows_b, cols_b = len(b), len(b[0])
    if (rows_a, cols_a) != (rows_b, cols_b):
        raise ValueError(f"Cannot add {rows_a}x{cols_a} and {rows_b}x{cols_b} matrices — dimensions must match")
    return [[a[i][j] + b[i][j] for j in range(cols_a)] for i in range(rows_a)]
```

### Multiplicacao por escalar

```python
def scalar_multiply(scalar, matrix):
    return [[scalar * element for element in row] for row in matrix]
```

### Multiplicacao de matrizes (linha × coluna)

```python
def multiply_matrices(a, b):
    cols_a, rows_b = len(a[0]), len(b)
    if cols_a != rows_b:
        raise ValueError(f"Cannot multiply: A has {cols_a} columns but B has {rows_b} rows")
    rows_a, cols_b = len(a), len(b[0])
    return [[sum(a[i][k] * b[k][j] for k in range(cols_a)) for j in range(cols_b)] for i in range(rows_a)]
```

## Example

**Before (sem validacao, bug silencioso):**

```python
result = [[a[i][j] + b[i][j] for j in range(len(a[0]))] for i in range(len(a))]
# Crash com IndexError se dimensoes diferentes — sem mensagem util
```

**After (com validacao clara):**

```python
if len(a) != len(b) or len(a[0]) != len(b[0]):
    raise ValueError(f"Cannot add {len(a)}x{len(a[0])} and {len(b)}x{len(b[0])} — dimensions must match")
result = [[a[i][j] + b[i][j] for j in range(len(a[0]))] for i in range(len(a))]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Soma/subtracao de matrizes | Valide dimensoes identicas antes |
| Escalar × matriz | Multiplique cada elemento, mantenha dimensao |
| A × B | Verifique colunas(A) == linhas(B), resultado e linhas(A) × colunas(B) |
| Usuario pede B × A | Verifique se e possivel — provavelmente nao e |
| Numpy disponivel | Use `np.dot()` ou `@` operator, que ja validam dimensoes |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Somar matrizes sem checar dimensao | Validar `shape_a == shape_b` antes |
| Multiplicar sem checar colunas×linhas | Validar `cols_a == rows_b` antes |
| Assumir A×B == B×A | Tratar como operacoes distintas |
| IndexError generico em dimensao errada | Mensagem explicita com as dimensoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
