# Code Examples: Combinação Simples

## Exemplo 1: Força bruta — listar todos os grupos

```python
from itertools import combinations

# 3 clientes entre 5 pessoas
pessoas = ['A', 'B', 'C', 'D', 'E']
grupos = list(combinations(pessoas, 3))

for g in grupos:
    print(g)
# ('A', 'B', 'C')
# ('A', 'B', 'D')
# ('A', 'B', 'E')
# ('A', 'C', 'D')
# ('A', 'C', 'E')
# ('A', 'D', 'E')
# ('B', 'C', 'D')
# ('B', 'C', 'E')
# ('B', 'D', 'E')
# ('C', 'D', 'E')

print(f"Total: {len(grupos)}")  # 10
```

## Exemplo 2: Comparação arranjo vs combinação

```python
from math import factorial, comb, perm

n, p = 5, 3

arranjo = perm(n, p)        # 60 — conta ordem
combinacao = comb(n, p)      # 10 — ignora ordem
fator = factorial(p)         # 6 — repetições por grupo

print(f"Arranjo: {arranjo}")
print(f"Combinação: {combinacao}")
print(f"Arranjo / P!: {arranjo // fator}")  # 10 ✓
assert arranjo // fator == combinacao
```

## Exemplo 3: Fórmula manual passo a passo

```python
from math import factorial

def combinacao_manual(n: int, p: int) -> int:
    """C(n,p) = n! / (p! × (n-p)!)"""
    if p > n:
        return 0
    return factorial(n) // (factorial(p) * factorial(n - p))

# Os 3 exemplos da aula:
print(combinacao_manual(5, 3))   # 10
print(combinacao_manual(10, 3))  # 120
print(combinacao_manual(7, 4))   # 35
```

## Exemplo 4: Mostrar por que arranjo "erra" para grupos

```python
from itertools import permutations, combinations

pessoas = ['A', 'B', 'C', 'D', 'E']

# Arranjos de 3 entre 5 — conta ordem
arranjos = list(permutations(pessoas, 3))
print(f"Arranjos: {len(arranjos)}")  # 60

# Combinações de 3 entre 5 — ignora ordem
combos = list(combinations(pessoas, 3))
print(f"Combinações: {len(combos)}")  # 10

# Para cada combinação, quantos arranjos existem?
grupo = ('A', 'B', 'C')
arranjos_do_grupo = list(permutations(grupo))
print(f"Arranjos de {grupo}: {len(arranjos_do_grupo)}")  # 6 = 3!

# Cada grupo aparece 3! = 6 vezes nos arranjos
print(f"60 / 6 = {60 // 6}")  # 10 ✓
```

## Exemplo 5: Aplicação em SQL (analytics)

```sql
-- Quantas combinações de 2 produtos podem ser compradas juntas
-- de um catálogo de 50 produtos?
SELECT
    50 AS n,
    2 AS p,
    (50 * 49) / (2 * 1) AS combinacoes;  -- 1225

-- Simplificação: C(n,2) = n(n-1)/2
```

## Exemplo 6: Aplicação em pandas

```python
import pandas as pd
from itertools import combinations

# Gerar todos os pares possíveis de clientes para análise comparativa
clientes = pd.DataFrame({
    'id': [1, 2, 3, 4, 5],
    'nome': ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo']
})

pares = list(combinations(clientes['nome'], 2))
df_pares = pd.DataFrame(pares, columns=['cliente_1', 'cliente_2'])
print(f"Total de pares: {len(df_pares)}")  # C(5,2) = 10
print(df_pares)
```