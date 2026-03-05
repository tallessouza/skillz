# Code Examples: Variância e Desvio Padrão

## Exemplo completo do instrutor (passo a passo manual)

```
Dados: Loja A = 10%, Loja B = 100%, Loja C = 70%

Passo 1 — Calcular a média:
  (10 + 100 + 70) / 3 = 180 / 3 = 60%

Passo 2 — Diferença de cada valor para a média:
  10  - 60 = -50
  100 - 60 =  40
  70  - 60 =  10

  Observação: soma das diferenças = -50 + 40 + 10 = 0 (sempre zera!)

Passo 3 — Elevar ao quadrado:
  (-50)² = 2500
  (40)²  = 1600
  (10)²  = 100

Passo 4 — Variância (média dos quadrados):
  (2500 + 1600 + 100) / 3 = 4200 / 3 = 1400

Passo 5 — Desvio padrão (raiz da variância):
  √1400 ≈ 37.4%

Interpretação: Em média, os valores se distanciam ~37% da média de 60%.
```

## Python — Função detalhada com prints

```python
import math

def analise_dispersao(valores, nomes=None):
    n = len(valores)
    media = sum(valores) / n
    print(f"Média: {media:.1f}%")

    # Diferenças
    diferencas = [v - media for v in valores]
    for i, (v, d) in enumerate(zip(valores, diferencas)):
        nome = nomes[i] if nomes else f"Valor {i+1}"
        print(f"  {nome}: {v} - {media:.1f} = {d:+.1f}")

    print(f"  Soma das diferenças: {sum(diferencas):.1f} (sempre zero!)")

    # Quadrados
    quadrados = [d ** 2 for d in diferencas]
    print(f"  Quadrados: {quadrados}")

    # Variância
    variancia = sum(quadrados) / n
    print(f"  Variância: {variancia:.1f}")

    # Desvio padrão
    desvio = math.sqrt(variancia)
    print(f"  Desvio Padrão: {desvio:.1f}%")

    if desvio > media * 0.5:
        print("  ⚠ Desvio alto — média NÃO é representativa!")

    return {"media": media, "variancia": variancia, "desvio_padrao": desvio}

# Exemplo da aula
analise_dispersao([10, 100, 70], ["Loja A", "Loja B", "Loja C"])
```

## Python — Com pandas

```python
import pandas as pd

df = pd.DataFrame({
    "loja": ["A", "B", "C"],
    "faturamento": [10, 100, 70]
})

media = df["faturamento"].mean()           # 60.0
variancia = df["faturamento"].var(ddof=0)   # 1400.0 (populacional)
desvio = df["faturamento"].std(ddof=0)      # 37.4 (populacional)

# ddof=0 para populacional (como na aula)
# ddof=1 para amostral (padrão do pandas)
```

## SQL — Análise completa

```sql
WITH dados AS (
    SELECT unnest(ARRAY[10, 100, 70]) AS faturamento
),
estatisticas AS (
    SELECT
        AVG(faturamento) AS media,
        VARIANCE(faturamento) AS variancia,
        STDDEV_POP(faturamento) AS desvio_padrao_pop,
        STDDEV_SAMP(faturamento) AS desvio_padrao_amostral
    FROM dados
)
SELECT * FROM estatisticas;
-- media=60, variancia=1400, desvio_pop≈37.4, desvio_amostral≈43.2
```

## Variação: dados homogêneos vs dispersos

```python
# Dados homogêneos (desvio baixo)
homogeneos = [58, 60, 62]
# Média: 60, Desvio: ~1.6 → média é confiável

# Dados dispersos (desvio alto) — exemplo da aula
dispersos = [10, 100, 70]
# Média: 60, Desvio: ~37.4 → média engana
```