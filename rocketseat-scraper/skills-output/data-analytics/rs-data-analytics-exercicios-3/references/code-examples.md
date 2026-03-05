# Code Examples: Analise Descritiva Completa

## Exemplo completo do exercicio (Python)

```python
dados = [10, 12, 8, 10, 10]

# Min e Max
minimo = min(dados)  # 8
maximo = max(dados)  # 12

# Amplitude
amplitude = maximo - minimo  # 12 - 8 = 4

# Media
media = sum(dados) / len(dados)  # 50 / 5 = 10

# Moda (valor que mais se repete)
from collections import Counter
contagem = Counter(dados)  # {10: 3, 12: 1, 8: 1}
moda = contagem.most_common(1)[0][0]  # 10

# Mediana (valor central do rol ordenado)
rol = sorted(dados)  # [8, 10, 10, 10, 12]
n = len(rol)
if n % 2 == 1:
    mediana = rol[n // 2]  # 10
else:
    mediana = (rol[n // 2 - 1] + rol[n // 2]) / 2

# Variancia (media dos desvios ao quadrado)
desvios_quadrado = [(x - media) ** 2 for x in dados]
# [(10-10)², (12-10)², (8-10)², (10-10)², (10-10)²]
# [0, 4, 4, 0, 0]
variancia = sum(desvios_quadrado) / len(dados)  # 8 / 5 = 1.6

# Desvio padrao (raiz da variancia)
desvio_padrao = variancia ** 0.5  # ≈ 1.2649
```

## Calculo passo a passo da variancia (como no exercicio)

```python
dados = [10, 12, 8, 10, 10]
media = 10

# Passo 1: Subtrair media de cada valor
diferencas = [x - media for x in dados]
# [0, 2, -2, 0, 0]

# Passo 2: Elevar ao quadrado (elimina negativos)
quadrados = [d ** 2 for d in diferencas]
# [0, 4, 4, 0, 0]

# Passo 3: Somar TODOS (incluindo zeros!)
soma = sum(quadrados)  # 8

# Passo 4: Dividir pela quantidade total
variancia = soma / len(dados)  # 8 / 5 = 1.6

# Passo 5: Raiz quadrada = desvio padrao
desvio = variancia ** 0.5  # ≈ 1.26
```

## Usando pandas (cenario real)

```python
import pandas as pd

vendas = pd.Series([10, 12, 8, 10, 10],
                   index=['seg', 'ter', 'qua', 'qui', 'sex'])

print(vendas.describe())
# count     5.0
# mean     10.0
# std       1.58  (pandas usa ddof=1 por padrao — amostral)
# min       8.0
# 25%      10.0
# 50%      10.0  (mediana)
# 75%      10.0
# max      12.0

# Para variancia populacional (como no exercicio):
variancia_pop = vendas.var(ddof=0)  # 1.6
desvio_pop = vendas.std(ddof=0)     # 1.2649
```

## Template de relatorio de analise

```python
def relatorio_descritivo(dados, nome="Dataset"):
    import statistics

    n = len(dados)
    media = statistics.mean(dados)
    mediana = statistics.median(dados)
    try:
        moda = statistics.mode(dados)
    except statistics.StatisticsError:
        moda = "Sem moda unica"

    minimo = min(dados)
    maximo = max(dados)
    amplitude = maximo - minimo
    variancia = statistics.pvariance(dados)  # populacional
    desvio = statistics.pstdev(dados)

    print(f"=== Analise: {nome} (n={n}) ===")
    print(f"Min: {minimo} | Max: {maximo} | Amplitude: {amplitude}")
    print(f"Media: {media} | Moda: {moda} | Mediana: {mediana}")
    print(f"Variancia: {variancia:.2f} | Desvio padrao: {desvio:.2f}")

    if media == mediana == moda:
        print("→ Dados altamente concentrados (media=moda=mediana)")
    if variancia < media * 0.2:
        print("→ Baixa dispersao — boa previsibilidade")

# Uso:
relatorio_descritivo([10, 12, 8, 10, 10], "Vendas Semanais")
```