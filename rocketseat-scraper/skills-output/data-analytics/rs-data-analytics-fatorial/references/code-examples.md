# Code Examples: Fatorial

## Exemplo 1: Calculo basico de fatorial

Da aula — calculo direto:

```
4! = 4 × 3 × 2 × 1 = 24
7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5040
```

Em Python:
```python
import math

# Usando a biblioteca padrao
math.factorial(4)   # 24
math.factorial(7)   # 5040
math.factorial(0)   # 1

# Implementacao manual
def fatorial(n):
    if n == 0:
        return 1
    resultado = 1
    for i in range(1, n + 1):
        resultado *= i
    return resultado
```

## Exemplo 2: Divisao entre fatoriais (simplificacao)

Da aula — `5! / 4!`:

```
Passo 1: Reescrever 5! como 5 × 4!
         5! / 4! = (5 × 4!) / 4!

Passo 2: Cancelar 4!
         = 5

Resultado: 5
```

Em Python:
```python
# Forma bruta (funciona mas ineficiente para numeros grandes)
math.factorial(5) // math.factorial(4)  # 5

# Forma inteligente: cancelar antes
def dividir_fatoriais(n, k):
    """Calcula n! / k! onde n >= k, sem calcular fatoriais inteiros."""
    resultado = 1
    for i in range(k + 1, n + 1):
        resultado *= i
    return resultado

dividir_fatoriais(5, 4)   # 5
dividir_fatoriais(7, 5)   # 7 × 6 = 42
dividir_fatoriais(10, 7)  # 10 × 9 × 8 = 720
```

## Exemplo 3: Expressao mista com multiplicacao e divisao

Da aula — `3! × 2! / 2!`:

```
Passo 1: Identificar termos que cancelam
         3! × 2! / 2!

Passo 2: Cancelar 2! / 2! = 1
         = 3!

Passo 3: Calcular 3!
         = 3 × 2 × 1 = 6
```

## Exemplo 4: Aplicacao pratica — ordenacao de clientes VIP

Da aula — 3 clientes VIP em ordem de premiacao:

```
Clientes: A, B, C

Possibilidades:
1. A, B, C
2. A, C, B
3. B, A, C
4. B, C, A
5. C, A, B
6. C, B, A

Total = 3! = 6 formas
```

Em Python (gerando todas as permutacoes):
```python
from itertools import permutations

clientes_vip = ['Cliente A', 'Cliente B', 'Cliente C']
ordens_possiveis = list(permutations(clientes_vip))

print(f"Total de arranjos: {len(ordens_possiveis)}")  # 6
for i, ordem in enumerate(ordens_possiveis, 1):
    print(f"{i}. {' → '.join(ordem)}")
```

## Exemplo 5: Generalizacao para n elementos

```python
# Quantas formas de organizar n itens?
def total_arranjos(n):
    return math.factorial(n)

total_arranjos(3)   # 6
total_arranjos(5)   # 120
total_arranjos(10)  # 3628800
```

## Exemplo 6: Fatorial em SQL (para contexto de data analytics)

```sql
-- Calcular fatorial usando CTE recursivo
WITH RECURSIVE fat(n, resultado) AS (
    SELECT 1, 1
    UNION ALL
    SELECT n + 1, resultado * (n + 1)
    FROM fat
    WHERE n < 10
)
SELECT n, resultado AS fatorial
FROM fat;

-- Resultado:
-- n | fatorial
-- 1 | 1
-- 2 | 2
-- 3 | 6
-- 4 | 24
-- 5 | 120
-- ...
```

## Exemplo 7: Uso em Excel/Google Sheets

```
=FACT(4)    → 24
=FACT(7)    → 5040
=FACT(0)    → 1

# Divisao entre fatoriais
=FACT(5)/FACT(4)    → 5
=FACT(3)*FACT(2)/FACT(2)    → 6
```