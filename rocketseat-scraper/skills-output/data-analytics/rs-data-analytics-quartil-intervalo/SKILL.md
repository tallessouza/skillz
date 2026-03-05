---
name: rs-data-analytics-quartil-intervalo
description: "Applies quartile calculation formula for grouped/interval data when analyzing frequency distributions. Use when user asks to 'calculate quartiles', 'find Q1 Q2 Q3', 'analyze grouped data', 'frequency distribution quartiles', or 'interval statistics'. Covers finding position via K*ΣFi, identifying correct class interval, and applying the interpolation formula with LI, Fac, Fi, and h. Make sure to use this skill whenever computing quartiles from frequency tables or grouped data. Not for simple list quartiles, percentiles, or ungrouped data medians."
---

# Quartil para Dados Agrupados em Intervalos

> Para calcular quartis em dados agrupados, primeiro encontre a posicao, depois aplique a formula de interpolacao.

## Rules

1. **Sempre encontre a posicao antes de tudo** — `posicao = K * ΣFi`, porque sem a posicao voce nao sabe qual linha da tabela analisar
2. **Use o valor de K correto para cada quartil** — Q1 = 1/4, Q2 = 1/2, Q3 = 3/4, porque cada quartil representa uma fracao especifica do total
3. **Identifique a classe pela frequencia acumulada** — a classe correta e aquela cuja Fac contem a posicao desejada, porque a Fac anterior nao alcanca e a atual ultrapassa ou iguala
4. **Use a frequencia acumulada ANTERIOR, nao a atual** — o Fac_anterior e da linha de cima, nao da linha que voce esta analisando, porque representa quantos elementos ja passaram antes daquela classe
5. **Calcule a amplitude h pelo intervalo** — `h = limite_superior - limite_inferior` da classe, porque e o tamanho do intervalo
6. **Monte a frequencia acumulada antes de comecar** — some as frequencias progressivamente, porque o ultimo valor e o ΣFi total

## Formula

```
Q* = LI + ((K * ΣFi) - Fac_anterior) / Fi * h
```

| Simbolo | Significado |
|---------|-------------|
| LI | Limite inferior da classe do quartil |
| K | Fracao: 1/4 (Q1), 1/2 (Q2), 3/4 (Q3) |
| ΣFi | Soma total das frequencias |
| Fac_anterior | Frequencia acumulada da classe ANTERIOR |
| Fi | Frequencia da classe do quartil |
| h | Amplitude da classe (limite superior - limite inferior) |

## How to write

### Passo 1: Montar frequencia acumulada

```python
# Dada uma tabela de frequencias
intervalos = [(160, 164), (164, 168), (168, 172), (172, 176), (176, 180)]
frequencias = [7, 4, 5, 8, 16]

# Calcular Fac
fac = []
acumulado = 0
for f in frequencias:
    acumulado += f
    fac.append(acumulado)
# fac = [7, 11, 16, 24, 40]
# ΣFi = 40
```

### Passo 2: Encontrar posicao e classe

```python
def encontrar_classe(posicao, fac):
    for i, acumulado in enumerate(fac):
        if posicao <= acumulado:
            return i
    return len(fac) - 1

# Q1: posicao = (1/4) * 40 = 10
# Fac = [7, 11, 16, 24, 40] → posicao 10 cai na classe indice 1 (Fac=11)
```

### Passo 3: Aplicar formula

```python
# Q1: LI=164, posicao=10, Fac_anterior=7, Fi=4, h=4
# Q1 = 164 + ((10 - 7) / 4) * 4 = 164 + 3 = 167
```

## Example

**Tabela de entrada:**

| Intervalo | Fi | Fac |
|-----------|----|-----|
| 160-164 | 7 | 7 |
| 164-168 | 4 | 11 |
| 168-172 | 5 | 16 |
| 172-176 | 8 | 24 |
| 176-180 | 16 | 40 |

**Q1:** posicao = (1/4)*40 = 10 → classe 164-168 (Fac=11 contem 10)
```
Q1 = 164 + ((10 - 7) / 4) * 4 = 164 + 3 = 167
```

**Q2:** posicao = (1/2)*40 = 20 → classe 172-176 (Fac=24 contem 20)
```
Q2 = 172 + ((20 - 16) / 8) * 4 = 172 + 2 = 174
```

**Q3:** posicao = (3/4)*40 = 30 → classe 176-180 (Fac=40 contem 30)
```
Q3 = 176 + ((30 - 24) / 16) * 4 = 176 + 1.5 = 177.5
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Posicao cai exatamente no limite entre classes | Use a classe seguinte como classe do quartil |
| Todas as amplitudes sao iguais | Calcule h uma vez e reutilize |
| Primeira classe contem a posicao | Fac_anterior = 0 |
| Dados nao agrupados (lista simples) | Use metodo de ordenar e dividir, nao esta formula |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar Fac da propria classe como Fac_anterior | Usar Fac da classe de cima (anterior) |
| Aplicar formula sem montar Fac primeiro | Sempre calcular Fac completa antes |
| Confundir Fi (frequencia da classe) com Fac | Fi e a frequencia individual, Fac e a acumulada |
| Tentar achar LI sem saber a posicao | Primeiro calcular posicao, depois identificar classe e LI |
| Esquecer de multiplicar por h | O h (amplitude) e parte essencial da interpolacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
