# Code Examples: Arranjo Simples

## Exemplo 1: Podio de 3 entre 5 atletas

### Pelo Principio Fundamental da Contagem
```
Posicoes a preencher: 3 (1o, 2o, 3o lugar)
Atletas disponiveis: 5

1o lugar: 5 opcoes
2o lugar: 4 opcoes (1 atleta ja esta no 1o)
3o lugar: 3 opcoes (2 atletas ja ocupados)

Total = 5 × 4 × 3 = 60 possibilidades
```

### Pela Formula
```
n = 5 (total de atletas)
p = 3 (posicoes no podio)

A(5,3) = 5! / (5-3)!
       = 5! / 2!
       = (5 × 4 × 3 × 2 × 1) / (2 × 1)
       = 120 / 2
       = 60 ✓
```

## Exemplo 2: Podio de 4 entre 7 atletas

### Pelo Principio Fundamental da Contagem
```
1o lugar: 7 opcoes
2o lugar: 6 opcoes
3o lugar: 5 opcoes
4o lugar: 4 opcoes

Total = 7 × 6 × 5 × 4 = 840 possibilidades
```

### Pela Formula
```
A(7,4) = 7! / (7-4)!
       = 7! / 3!
       = (7 × 6 × 5 × 4 × 3 × 2 × 1) / (3 × 2 × 1)
       = 5040 / 6
       = 840 ✓
```

## Exemplo 3: Podio de 3 entre 10 atletas

### Pelo Principio Fundamental da Contagem
```
1o lugar: 10 opcoes
2o lugar: 9 opcoes
3o lugar: 8 opcoes

Total = 10 × 9 × 8 = 720 possibilidades
```

### Pela Formula
```
A(10,3) = 10! / (10-3)!
        = 10! / 7!
        = (10 × 9 × 8 × 7!) / 7!
        = 10 × 9 × 8
        = 720 ✓
```

## Implementacao em Python

```python
import math

def arranjo_simples(n: int, p: int) -> int:
    """Calcula arranjo simples A(n,p) = n! / (n-p)!"""
    if p > n:
        raise ValueError(f"p ({p}) nao pode ser maior que n ({n})")
    if n < 0 or p < 0:
        raise ValueError("n e p devem ser nao-negativos")
    return math.factorial(n) // math.factorial(n - p)

# Sem formula — principio fundamental da contagem
def arranjo_por_contagem(n: int, p: int) -> int:
    """Calcula arranjo multiplicando possibilidades decrescentes"""
    resultado = 1
    for i in range(p):
        resultado *= (n - i)
    return resultado

# Verificacao
assert arranjo_simples(5, 3) == 60
assert arranjo_simples(7, 4) == 840
assert arranjo_simples(10, 3) == 720
assert arranjo_por_contagem(5, 3) == arranjo_simples(5, 3)
```

## Implementacao em SQL (para analytics)

```sql
-- Funcao para calcular arranjo simples
-- Util em analises combinatorias sobre dados
CREATE OR REPLACE FUNCTION arranjo_simples(n INTEGER, p INTEGER)
RETURNS BIGINT AS $$
DECLARE
    resultado BIGINT := 1;
    i INTEGER;
BEGIN
    FOR i IN 0..(p-1) LOOP
        resultado := resultado * (n - i);
    END LOOP;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Exemplo: quantas formas de rankear top 3 de 10 produtos?
SELECT arranjo_simples(10, 3); -- 720
```

## Checklist de identificacao

```
1. [ ] A ordem dos elementos importa? (Se nao → combinacao)
2. [ ] Elementos podem repetir? (Se sim → arranjo com repeticao)
3. [ ] Se ordem importa E sem repeticao → ARRANJO SIMPLES
4. [ ] Identificar n (total disponivel)
5. [ ] Identificar p (quantos serao organizados)
6. [ ] Calcular: multiplicar de n ate (n-p+1), ou usar n!/(n-p)!
```