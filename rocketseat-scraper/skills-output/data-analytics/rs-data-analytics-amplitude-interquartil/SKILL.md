---
name: rs-data-analytics-amplitude-interquartil
description: "Applies interquartile range (IQR) calculation when analyzing data dispersion or detecting outliers. Use when user asks to 'calculate IQR', 'find interquartile range', 'analyze data spread', 'detect outliers', or 'calculate quartiles'. Enforces the correct step-by-step procedure: sort data, find median (Q2), find Q1 and Q3, then compute Q3 - Q1. Make sure to use this skill whenever computing quartile-based statistics. Not for mean, mode, standard deviation, or non-quartile dispersion measures."
---

# Amplitude Interquartil (IQR)

> Para calcular a amplitude interquartil, organize os dados em rol, encontre Q1, Q2 (mediana) e Q3, e compute Q3 - Q1.

## Rules

1. **Sempre faca o rol primeiro** — ordene os dados em ordem crescente antes de qualquer calculo, porque quartis dependem da posicao dos elementos
2. **Encontre Q2 (mediana) antes de Q1 e Q3** — Q2 divide o conjunto ao meio, e Q1/Q3 sao as medianas de cada metade
3. **Quantidade par: faca a media dos dois centrais** — `(valor_esquerdo + valor_direito) / 2`, porque nao existe elemento central unico
4. **Quantidade impar: o elemento central e a mediana** — sem necessidade de media, o valor exato ja esta no conjunto
5. **Formula final: IQR = Q3 - Q1** — mede a dispersao dos 50% centrais dos dados, ignorando extremos
6. **Marque elementos ja contados** — ao fazer o rol manualmente, risque elementos para evitar duplicatas ou omissoes

## How to write

### Calculo completo do IQR

```python
import statistics

def calcular_iqr(dados):
    dados_ordenados = sorted(dados)  # Rol
    n = len(dados_ordenados)
    
    # Encontrar Q2 (mediana)
    mediana = statistics.median(dados_ordenados)
    
    # Dividir em metade inferior e superior
    meio = n // 2
    metade_inferior = dados_ordenados[:meio]
    metade_superior = dados_ordenados[meio + 1:] if n % 2 != 0 else dados_ordenados[meio:]
    
    q1 = statistics.median(metade_inferior)
    q3 = statistics.median(metade_superior)
    
    iqr = q3 - q1
    return {"Q1": q1, "Q2": mediana, "Q3": q3, "IQR": iqr}
```

## Example

**Dados originais:** 5, 5, 7, 10, 12, 12, 14, 11, 8

**Passo 1 — Rol:** 5, 5, 7, 8, 10, 11, 12, 12, 14

**Passo 2 — Q2 (mediana):** 9 elementos (impar) → posicao central = 5º → Q2 = 10

**Passo 3 — Q1:** metade inferior = {5, 5, 7, 8} → media de 5 e 7 → Q1 = 6

**Passo 4 — Q3:** metade superior = {11, 12, 12, 14} → media de 12 e 12 → Q3 = 12

**Passo 5 — IQR:** 12 - 6 = **6**

## Heuristics

| Situacao | Faca |
|----------|------|
| Conjunto com quantidade impar | Mediana e o elemento central exato; exclua-o ao calcular Q1/Q3 |
| Conjunto com quantidade par | Mediana e a media dos dois centrais; divida o conjunto ao meio sem excluir |
| Dois valores centrais iguais | A media ainda e o proprio valor, mas documente o calculo para clareza |
| Conjunto muito grande | Marque/risque cada elemento ao ordenar para evitar erros |
| Precisa detectar outliers | Use IQR: outlier se valor < Q1 - 1.5*IQR ou valor > Q3 + 1.5*IQR |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Calcular IQR sem ordenar os dados | Sempre faca o rol primeiro |
| Usar amplitude total (max - min) como IQR | IQR = Q3 - Q1, nao max - min |
| Confundir amplitude com amplitude interquartil | Amplitude = max - min; IQR = Q3 - Q1 |
| Incluir a mediana nas metades (conjunto impar) | Exclua Q2 ao dividir em metades |
| Pular direto para Q1/Q3 sem achar Q2 | Sempre encontre Q2 primeiro para dividir corretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
