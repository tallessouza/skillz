---
name: rs-data-analytics-quartis
description: "Applies quartile calculation methods when analyzing datasets or computing positional measures. Use when user asks to 'calculate quartiles', 'find Q1 Q3', 'divide data into quarters', 'compute percentiles', or 'analyze data distribution'. Enforces correct ordering, median-first approach, and proper interpolation for even-count halves. Make sure to use this skill whenever splitting datasets into positional segments. Not for grouped/frequency data quartiles, deciles, or percentiles beyond Q1-Q3."
---

# Quartis (Medidas de Posição)

> Quartis dividem um conjunto de dados ordenado em 4 partes iguais de 25% cada — calcule sempre a mediana primeiro (Q2), depois aplique o mesmo processo a cada metade.

## Rules

1. **Ordene os dados primeiro** — qualquer calculo de quartil exige dados em ordem crescente, porque posicao so faz sentido em sequencia ordenada
2. **Calcule Q2 (mediana) antes de Q1 e Q3** — Q2 divide o conjunto ao meio; Q1 e Q3 sao as medianas de cada metade resultante
3. **Quantidade impar: exclua o valor central** — ao dividir as metades para Q1/Q3, o valor mediano nao pertence a nenhuma das metades
4. **Quantidade par nas metades: faca a media** — quando a metade tem quantidade par, Q1 ou Q3 e a media dos dois valores centrais dessa metade
5. **Interprete corretamente** — Q1: 25% dos valores estao abaixo; Q2: 50%; Q3: 75% abaixo

## How to write

### Calculo completo de quartis

```python
# 1. Ordenar
dados = sorted(dados_brutos)
n = len(dados)

# 2. Q2 = mediana
if n % 2 == 1:
    q2 = dados[n // 2]
    metade_inferior = dados[:n // 2]
    metade_superior = dados[n // 2 + 1:]
else:
    q2 = (dados[n // 2 - 1] + dados[n // 2]) / 2
    metade_inferior = dados[:n // 2]
    metade_superior = dados[n // 2:]

# 3. Q1 = mediana da metade inferior
m = len(metade_inferior)
if m % 2 == 1:
    q1 = metade_inferior[m // 2]
else:
    q1 = (metade_inferior[m // 2 - 1] + metade_inferior[m // 2]) / 2

# 4. Q3 = mediana da metade superior
m = len(metade_superior)
if m % 2 == 1:
    q3 = metade_superior[m // 2]
else:
    q3 = (metade_superior[m // 2 - 1] + metade_superior[m // 2]) / 2
```

## Example

**Dados brutos:** 8, 4, 10, 2, 9, 15, 17, 10, 5

**Passo 1 — Ordenar:** 2, 4, 5, 8, 8, 9, 10, 10, 15, 17
*(corrigido: 9 elementos)*

**Passo 2 — Q2 (mediana):** posicao central (5a) = **8**

**Passo 3 — Q1:** metade inferior = [2, 4, 5, 8] → media de 4 e 5 = **4.5**

**Passo 4 — Q3:** metade superior = [9, 10, 10, 17] → media de 9 e 10 = **9.5**

| Quartil | Valor | Interpretacao |
|---------|-------|---------------|
| Q1 | 4.5 | 25% dos dados estao abaixo |
| Q2 | 8 | 50% dos dados estao abaixo |
| Q3 | 9.5 | 75% dos dados estao abaixo |

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados nao ordenados | Ordene antes de qualquer calculo |
| N impar | Exclua o elemento central ao formar metades |
| N par | Divida ao meio sem exclusao |
| Metade com N par | Q1/Q3 = media dos dois centrais |
| Metade com N impar | Q1/Q3 = elemento central direto |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Calcular Q1/Q3 sem ordenar | Sempre `sorted()` primeiro |
| Incluir mediana nas metades (N impar) | Excluir o valor central |
| Confundir Q2 com media aritmetica | Q2 = mediana (valor posicional) |
| Calcular Q1 antes de Q2 | Sempre Q2 primeiro, depois dividir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
