---
name: rs-data-analytics-amplitude-interquartil-exercicio
description: "Applies interquartile range (IQR) calculation when analyzing datasets or dot plots. Use when user asks to 'calculate IQR', 'find interquartile range', 'analyze spread', 'quartile analysis', or 'interpret dot plot data'. Guides step-by-step: extract data from visualization, order values, find median (Q2), then Q1 and Q3, compute IQR = Q3 - Q1. Make sure to use this skill whenever computing quartiles or IQR from any data representation. Not for mean, standard deviation, or other dispersion measures beyond IQR."
---

# Amplitude Interquartil: Exercicio Pratico

> Ao calcular a amplitude interquartil, extraia os dados, ordene, encontre Q2, depois Q1 e Q3, e compute IQR = Q3 - Q1.

## Rules

1. **Extraia os dados antes de calcular** — se os dados vem de grafico de pontos, tabela ou visualizacao, converta para um conjunto numerico ordenado primeiro, porque erros de leitura visual propagam para todo o calculo
2. **Conte os elementos para decidir o metodo da mediana** — quantidade par: media dos dois centrais; quantidade impar: valor central direto, porque o metodo errado gera quartis incorretos
3. **Calcule Q2 (mediana) antes de Q1 e Q3** — Q2 divide o conjunto em duas metades iguais que serao usadas para encontrar Q1 e Q3
4. **Q1 e Q3 sao medianas das metades** — Q1 = mediana da metade inferior, Q3 = mediana da metade superior, aplicando a mesma regra par/impar
5. **IQR = Q3 - Q1** — sempre subtraia nessa ordem, porque IQR e sempre positivo

## How to write

### Extraindo dados de grafico de pontos

```python
# Cada ponto sobre um valor no eixo X representa uma ocorrencia
# Valor 6: 0 pontos → nao entra
# Valor 7: 1 ponto → [7]
# Valor 8: 2 pontos → [8, 8]
# Converta para lista ordenada
dados = [7, 8, 8, 9, 10, 10, 10, 12, 12, 14]
```

### Calculo completo do IQR

```python
import numpy as np

def calcular_iqr(dados):
    dados_ordenados = sorted(dados)
    n = len(dados_ordenados)
    
    # Q2 (mediana)
    if n % 2 == 0:
        q2 = (dados_ordenados[n//2 - 1] + dados_ordenados[n//2]) / 2
    else:
        q2 = dados_ordenados[n//2]
    
    # Dividir em metades
    metade_inferior = dados_ordenados[:n//2]
    metade_superior = dados_ordenados[(n+1)//2:]
    
    # Q1 e Q3 (medianas das metades)
    q1 = np.median(metade_inferior)
    q3 = np.median(metade_superior)
    
    iqr = q3 - q1
    return q1, q2, q3, iqr
```

## Example

**Dados do grafico de pontos:** `[7, 8, 8, 9, 10, 10, 10, 12, 12, 14]`

**Passo a passo:**

```
Dados ordenados: 7, 8, 8, 9, 10 | 10, 10, 12, 12, 14
                                  ↑
Contagem: 10 (par) → Q2 = (10+10)/2 = 10

Metade inferior: 7, 8, [8], 9, 10 → Q1 = 8
Metade superior: 10, 10, [12], 12, 14 → Q3 = 12

IQR = Q3 - Q1 = 12 - 8 = 4
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quantidade de dados par | Media dos dois centrais para Q2 |
| Quantidade de dados impar | Valor central direto para Q2 |
| Dados vem de grafico/visualizacao | Converta para lista numerica ordenada primeiro |
| Metade com quantidade impar | Q1 ou Q3 e o valor central direto |
| Metade com quantidade par | Q1 ou Q3 e a media dos dois centrais da metade |
| Valor no eixo sem pontos | Nao incluir no conjunto de dados |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Calcular Q1/Q3 sem achar Q2 primeiro | Sempre Q2 → Q1 → Q3 → IQR |
| Incluir valores do eixo sem ocorrencias | So incluir valores que tem pontos/frequencia |
| Esquecer de ordenar os dados | Sempre ordenar antes de qualquer calculo |
| Confundir amplitude total com IQR | Amplitude total = max - min; IQR = Q3 - Q1 |
| Subtrair Q1 - Q3 | Sempre Q3 - Q1 (resultado positivo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
