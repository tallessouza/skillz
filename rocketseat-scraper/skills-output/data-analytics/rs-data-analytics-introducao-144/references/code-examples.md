# Code Examples: Análise Combinatória — Introdução

## Exemplo do instrutor: Arranjo de 3 produtos

O exemplo central da aula é sobre apresentar 3 produtos (A, B, C) em uma campanha.

### Enumeração manual (o que a combinatória substitui)
```python
from itertools import permutations

produtos = ['A', 'B', 'C']

# Todas as formas de organizar 3 produtos
todas_formas = list(permutations(produtos))
print(f"Total de formas: {len(todas_formas)}")
# Total de formas: 6

for forma in todas_formas:
    print(forma)
# ('A', 'B', 'C')
# ('A', 'C', 'B')
# ('B', 'A', 'C')
# ('B', 'C', 'A')
# ('C', 'A', 'B')
# ('C', 'B', 'A')
```

### Cálculo direto com fatorial
```python
import math

n_produtos = 3
total_arranjos = math.factorial(n_produtos)
print(f"Permutações de {n_produtos} produtos: {total_arranjos}")
# Permutações de 3 produtos: 6
```

## Exemplo prático: Seleção de grupos para teste A/B

```python
from itertools import combinations
import math

# 10 usuários, selecionar grupo de 5 para teste A
usuarios = list(range(1, 11))

# Quantos grupos distintos de 5 pessoas são possíveis?
n = len(usuarios)
k = 5
total_grupos = math.comb(n, k)
print(f"Grupos possíveis de {k} em {n}: {total_grupos}")
# Grupos possíveis de 5 em 10: 252
```

## Quando usar cada técnica em Python

```python
from itertools import permutations, combinations
import math

# PERMUTAÇÃO: ordem importa, todos os elementos
# "De quantas formas posso ordenar estes itens?"
math.factorial(n)

# ARRANJO: ordem importa, subconjunto
# "De quantas formas posso escolher e ordenar k de n?"
math.perm(n, k)

# COMBINAÇÃO: ordem NÃO importa, subconjunto
# "De quantas formas posso escolher k de n?"
math.comb(n, k)
```