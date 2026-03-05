# Code Examples: Permutação Simples

## Exemplo 1: Fila com 5 pessoas (do transcript)

```python
import math

# 5 pessoas em uma fila — quantas ordens possíveis?
# Posição 1: 5 opções
# Posição 2: 4 opções
# Posição 3: 3 opções
# Posição 4: 2 opções
# Posição 5: 1 opção

permutacoes = math.factorial(5)
print(f"P(5) = 5! = {permutacoes}")  # 120
```

## Exemplo 2: Fila com 8 pessoas (do transcript)

```python
# 8 pessoas em uma fila
permutacoes = math.factorial(8)
print(f"P(8) = 8! = {permutacoes}")  # 40320
```

## Exemplo 3: 6 relatórios diferentes (do transcript)

```python
# De quantas maneiras organizar 6 relatórios distintos?
n = 6
resultado = math.factorial(n)
print(f"P({n}) = {n}! = {resultado}")  # 720
```

## Exemplo 4: Visualizando o princípio fundamental da contagem

```python
def permutacao_passo_a_passo(n):
    """Mostra o raciocínio posição a posição."""
    opcoes = list(range(n, 0, -1))  # [n, n-1, ..., 1]
    
    print(f"Permutação de {n} elementos distintos:")
    for i, opcao in enumerate(opcoes, 1):
        print(f"  Posição {i}: {opcao} opções")
    
    resultado = math.factorial(n)
    multiplicacao = " × ".join(str(x) for x in opcoes)
    print(f"  Total: {multiplicacao} = {resultado}")
    return resultado

permutacao_passo_a_passo(5)
# Posição 1: 5 opções
# Posição 2: 4 opções
# Posição 3: 3 opções
# Posição 4: 2 opções
# Posição 5: 1 opção
# Total: 5 × 4 × 3 × 2 × 1 = 120
```

## Exemplo 5: Fórmula genérica P(N) = N!

```python
def permutacao_simples(n: int) -> int:
    """Calcula a permutação simples de N elementos distintos.
    
    Pré-condição: n >= 0, todos os elementos são distintos.
    """
    if n < 0:
        raise ValueError("N deve ser >= 0")
    return math.factorial(n)

# Casos do transcript
assert permutacao_simples(5) == 120
assert permutacao_simples(6) == 720
assert permutacao_simples(8) == 40320
```

## Quando NÃO usar permutação simples

```python
# ERRADO: elementos repetidos
# "BANANA" tem letras repetidas → usar permutação com repetição
# P = 6! / (3! × 2!) = 60  (não 720)

# ERRADO: selecionar apenas parte dos elementos
# Escolher 3 de 10 pessoas para uma fila → usar arranjo
# A(10,3) = 10! / 7! = 720  (não 10!)

# ERRADO: ordem não importa
# Escolher 3 de 10 pessoas para um grupo → usar combinação
# C(10,3) = 10! / (3! × 7!) = 120
```