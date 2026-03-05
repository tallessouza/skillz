# Code Examples: Moda e Mediana

## Exemplo 1: Moda — Valor de compra mais frequente

Cenario do instrutor: Uma empresa quer saber qual o valor de compra mais frequente dos clientes.

```python
# Dados do exemplo da aula
purchase_values = [50, 75, 100, 50, 150, 200, 50, 100]

# Calcular frequencia de cada valor
from collections import Counter
frequency = Counter(purchase_values)
# Counter({50: 3, 100: 2, 75: 1, 150: 1, 200: 1})

# Moda: valor com maior frequencia
mode = frequency.most_common(1)[0]
print(f"Moda: {mode[0]} (aparece {mode[1]} vezes)")
# Moda: 50 (aparece 3 vezes)
```

## Exemplo 2: Mediana impar — Tempo mediano de uso

Cenario do instrutor: Tempo gasto por usuarios em um aplicativo.

```python
# Dados originais (NAO ordenados)
usage_times = [22, 5, 7, 12, 15, 25, 18]

# ERRADO: pegar o meio sem ordenar
wrong_median = usage_times[len(usage_times) // 2]
print(f"Mediana ERRADA: {wrong_median}")  # 12

# CORRETO: ordenar primeiro (Rol), depois pegar o meio
sorted_times = sorted(usage_times)
# [5, 7, 12, 15, 18, 22, 25]
#              ^^ valor central (posicao 3, indice 3)

correct_median = sorted_times[len(sorted_times) // 2]
print(f"Mediana CORRETA: {correct_median}")  # 15
```

## Exemplo 3: Mediana par — Dois valores centrais

Cenario do instrutor: Dataset com 8 valores.

```python
values = [3, 25, 12, 7, 22, 16, 9, 18]

# Passo 1: Rol (ordenacao crescente)
sorted_values = sorted(values)
# [3, 7, 9, 12, 16, 18, 22, 25]

# Passo 2: Identificar os dois centrais
n = len(sorted_values)  # 8
middle_left = sorted_values[n // 2 - 1]   # indice 3 → 12
middle_right = sorted_values[n // 2]       # indice 4 → 16

# Passo 3: Media dos dois centrais
median = (middle_left + middle_right) / 2  # (12 + 16) / 2 = 14.0
print(f"Mediana: {median}")  # 14.0
```

## Exemplo 4: Funcao completa reutilizavel

```python
from collections import Counter
from typing import Union


def descriptive_central(values: list[float]) -> dict:
    """Calcula moda e mediana de um conjunto de dados."""
    # Moda
    frequency = Counter(values)
    max_freq = max(frequency.values())
    modes = [v for v, c in frequency.items() if c == max_freq]

    if max_freq == 1:
        mode_type = "amodal"
    elif len(modes) == 1:
        mode_type = "unimodal"
    elif len(modes) == 2:
        mode_type = "bimodal"
    else:
        mode_type = "multimodal"

    # Mediana (sempre ordenar primeiro!)
    sorted_values = sorted(values)
    n = len(sorted_values)
    if n % 2 == 1:
        median = sorted_values[n // 2]
    else:
        median = (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2

    return {
        "modes": modes,
        "mode_type": mode_type,
        "mode_frequency": max_freq,
        "median": median,
        "sorted_data": sorted_values,
    }


# Teste com dados da aula
result = descriptive_central([50, 75, 100, 50, 150, 200, 50, 100])
print(result)
# {'modes': [50], 'mode_type': 'unimodal', 'mode_frequency': 3,
#  'median': 87.5, 'sorted_data': [50, 50, 50, 75, 100, 100, 150, 200]}
```

## Exemplo 5: Visualizacao de frequencia (como o grafico da aula)

```python
def print_frequency_chart(values: list) -> None:
    """Grafico de barras horizontal mostrando frequencia (como na aula)."""
    frequency = Counter(values)
    for value, count in sorted(frequency.items()):
        bar = "█" * count
        print(f"{value:>6} | {bar} ({count}x)")


purchase_values = [50, 75, 100, 50, 150, 200, 50, 100]
print_frequency_chart(purchase_values)
#     50 | ███ (3x)   ← MODA
#     75 | █ (1x)
#    100 | ██ (2x)
#    150 | █ (1x)
#    200 | █ (1x)
```