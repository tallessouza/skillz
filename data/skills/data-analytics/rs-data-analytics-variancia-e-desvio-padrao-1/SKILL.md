---
name: rs-data-analytics-variancia-desvio-padrao
description: "Applies variance and standard deviation calculations when analyzing data dispersion. Use when user asks to 'calculate variance', 'find standard deviation', 'measure data spread', 'analyze dispersion', or 'check how far values are from the mean'. Guides step-by-step: mean, deviations, squaring, averaging, square root. Make sure to use this skill whenever computing dispersion metrics or evaluating if a mean is misleading. Not for correlation, regression, or probability distributions."
---

# Variância e Desvio Padrão

> Calcule a variância e o desvio padrão passo a passo para revelar o quanto os dados se afastam da média.

## Rules

1. **Sempre calcule a média primeiro** — a média é o ponto central de referência para todas as distâncias, porque sem ela não há como medir dispersão
2. **Calcule a diferença de cada valor para a média** — `valor - média` para cada observação, porque isso mostra o afastamento individual
3. **Eleve as diferenças ao quadrado** — porque valores negativos cancelariam os positivos na soma, resultando em zero
4. **Variância = média dos quadrados das diferenças** — some todos os quadrados e divida pelo número de observações
5. **Desvio padrão = raiz quadrada da variância** — porque elevar ao quadrado distorceu a unidade de medida, e a raiz retorna à unidade original
6. **Quanto maior o desvio padrão, menos confiável a média** — um desvio padrão alto significa que os dados estão muito espalhados e a média sozinha engana

## How to write

### Cálculo passo a passo em Python

```python
import math

def desvio_padrao(valores):
    n = len(valores)
    media = sum(valores) / n
    diferencas_quadradas = [(v - media) ** 2 for v in valores]
    variancia = sum(diferencas_quadradas) / n
    return math.sqrt(variancia)
```

### Cálculo passo a passo em SQL

```sql
-- Desvio padrão populacional
SELECT
    STDDEV_POP(faturamento) AS desvio_padrao,
    VARIANCE(faturamento) AS variancia,
    AVG(faturamento) AS media
FROM lojas;
```

## Example

**Before (confiando apenas na média):**
```python
lojas = [10, 100, 70]
media = sum(lojas) / len(lojas)  # 60%
print(f"Média: {media}%")  # "Tá tudo bem, acima de 50%"
# PROBLEMA: Loja A está com 10%, quase fechando!
```

**After (com variância e desvio padrão):**
```python
lojas = [10, 100, 70]
media = 60  # (10 + 100 + 70) / 3

# Passo 1: Diferenças para a média
diferencas = [v - media for v in lojas]  # [-50, 40, 10]

# Passo 2: Elevar ao quadrado (elimina negativos)
quadrados = [d ** 2 for d in diferencas]  # [2500, 1600, 100]

# Passo 3: Variância (média dos quadrados)
variancia = sum(quadrados) / len(quadrados)  # 1400

# Passo 4: Desvio padrão (raiz da variância)
desvio = variancia ** 0.5  # ≈ 37.4%

print(f"Média: {media}%, Desvio Padrão: {desvio:.1f}%")
# Desvio de 37% sobre média de 60% = dados MUITO dispersos
# A média NÃO é confiável neste caso
```

## Heuristics

| Situação | Faça |
|----------|------|
| Desvio padrão baixo relativo à média | Média é representativa, dados homogêneos |
| Desvio padrão alto relativo à média | Média engana, investigue valores individuais |
| Diferenças somam zero | Confirma necessidade de elevar ao quadrado |
| Precisa voltar à unidade original | Tire raiz quadrada da variância |
| Amostra vs população | Use `n-1` (amostral) ou `n` (populacional) no denominador |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Confiar só na média para decisão | Calcule desvio padrão junto com a média |
| Somar diferenças sem elevar ao quadrado | Eleve ao quadrado para eliminar negativos |
| Reportar variância como medida final | Tire a raiz para obter desvio padrão na unidade original |
| Ignorar dispersão alta | Alerte que a média não representa bem os dados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
