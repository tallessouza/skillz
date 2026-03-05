---
name: rs-data-analytics-moda-e-mediana
description: "Applies mode and median calculations when analyzing datasets or implementing statistical functions in code. Use when user asks to 'calculate median', 'find mode', 'central tendency', 'sort data', 'descriptive statistics', or 'analyze frequency'. Enforces data ordering before median calculation and correct handling of even/odd dataset sizes. Make sure to use this skill whenever implementing statistical measures or data analysis pipelines. Not for mean/average calculations, standard deviation, or inferential statistics."
---

# Moda e Mediana

> Ao calcular medidas de tendencia central, sempre ordenar os dados antes de extrair a mediana e identificar frequencias para a moda.

## Rules

1. **Sempre ordene antes de calcular mediana** — faca o Rol (ordenacao crescente) antes de qualquer calculo, porque a mediana sem ordenacao produz resultado errado
2. **Mediana impar: valor central direto** — quando o conjunto tem quantidade impar de elementos, o valor do meio e a mediana sem necessidade de calculo adicional
3. **Mediana par: media dos dois centrais** — quando o conjunto tem quantidade par, calcule a media aritmetica dos dois valores centrais
4. **Moda e a frequencia maxima** — identifique o valor que mais se repete; pode ser unimodal (1 moda), bimodal (2 modas) ou amodal (sem moda)
5. **Nunca confunda mediana com media** — mediana e o valor posicional central, media e a soma dividida pela quantidade

## How to write

### Calculando moda

```python
from collections import Counter

def calculate_mode(values: list) -> list:
    frequency = Counter(values)
    max_count = max(frequency.values())
    # Retorna todos os valores com frequencia maxima
    modes = [value for value, count in frequency.items() if count == max_count]
    return modes
```

### Calculando mediana (com ordenacao obrigatoria)

```python
def calculate_median(values: list) -> float:
    sorted_values = sorted(values)  # Rol: ordenacao crescente
    n = len(sorted_values)
    middle = n // 2

    if n % 2 == 1:
        # Impar: valor central direto
        return sorted_values[middle]
    else:
        # Par: media dos dois centrais
        return (sorted_values[middle - 1] + sorted_values[middle]) / 2
```

## Example

**Before (erro comum — mediana sem ordenar):**
```python
values = [22, 5, 7, 12, 15, 25, 18]
# Erro: pegar o valor do meio sem ordenar
median = values[len(values) // 2]  # Retorna 12 — ERRADO
```

**After (com esta skill aplicada):**
```python
values = [22, 5, 7, 12, 15, 25, 18]
sorted_values = sorted(values)  # [5, 7, 12, 15, 18, 22, 25]
median = sorted_values[len(sorted_values) // 2]  # Retorna 15 — CORRETO
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quantidade impar de elementos | Pegue o valor central direto apos ordenar |
| Quantidade par de elementos | Calcule a media dos dois valores centrais |
| Precisa saber o mais frequente | Use moda (Counter/frequencia) |
| Dados ainda nao ordenados | Faca o Rol antes de qualquer calculo de mediana |
| Dataset pode ter multiplas modas | Retorne lista de modas, nao apenas uma |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `values[len(values)//2]` sem ordenar | `sorted(values)[len(values)//2]` |
| Assumir que dataset tem exatamente 1 moda | Verificar se e unimodal, bimodal ou amodal |
| Confundir mediana com media aritmetica | Mediana = posicional, media = soma/quantidade |
| Ignorar caso par na mediana | Sempre verificar `n % 2` e tratar ambos os casos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
