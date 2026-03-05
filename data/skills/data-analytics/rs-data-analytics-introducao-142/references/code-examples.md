# Code Examples: Fundamentos de Analise de Dados

Esta aula e introdutoria e conceitual — nao contem exemplos de codigo. Abaixo, exemplos praticos que ilustram o pipeline analitico descrito pelo instrutor.

## Pipeline completo em Python (ilustrativo)

```python
import pandas as pd
import numpy as np

# 1. RECEBER os dados (a "pilha de dados" que o instrutor menciona)
vendas = pd.read_csv("vendas_empresa.csv")

# 2. ESTATISTICA DESCRITIVA - organizar e resumir
print(vendas.describe())  # Media, mediana, min, max, quartis
print(vendas.shape)        # Dimensoes do dataset
print(vendas.dtypes)       # Tipos de dados

# 3. MEDIDAS DE DISPERSAO - identificar discrepancias
desvio_padrao = vendas["faturamento"].std()
variancia = vendas["faturamento"].var()
amplitude = vendas["faturamento"].max() - vendas["faturamento"].min()

# 4. QUARTIS E PERCENTIS - entender limites
q1 = vendas["faturamento"].quantile(0.25)
q3 = vendas["faturamento"].quantile(0.75)
iqr = q3 - q1  # Intervalo interquartil

# 5. PROBABILIDADE - prever eventos
# "Isso esta acontecendo com certa frequencia,
#  tem chance de tantos por cento de ocorrer novamente"
meses_com_queda = vendas[vendas["variacao"] < 0].shape[0]
total_meses = vendas.shape[0]
probabilidade_queda = meses_com_queda / total_meses
print(f"Probabilidade de queda: {probabilidade_queda:.1%}")
```

## Exemplo do cenario descrito pelo instrutor

```python
# O instrutor descreve: empresa com problema de vendas
# Voce recebe os dados e precisa analisar

# Passo 1: Formular a pergunta (dor da empresa)
# "As vendas estao caindo nos ultimos meses?"

# Passo 2: Organizar (estatistica descritiva)
vendas_mensais = dados.groupby("mes")["valor"].sum()
media_vendas = vendas_mensais.mean()
mediana_vendas = vendas_mensais.median()

# Passo 3: Identificar anomalias (dispersao)
# Meses com vendas muito abaixo ou acima da media
outliers = vendas_mensais[
    (vendas_mensais < media_vendas - 2 * vendas_mensais.std()) |
    (vendas_mensais > media_vendas + 2 * vendas_mensais.std())
]

# Passo 4: Segmentar (quartis)
# Em qual faixa de performance cada mes se encontra
faixas = pd.qcut(vendas_mensais, q=4, labels=["Critico", "Baixo", "Normal", "Alto"])

# Passo 5: Apresentar com clareza
resumo = pd.DataFrame({
    "vendas": vendas_mensais,
    "faixa": faixas,
    "vs_media": vendas_mensais - media_vendas
})
print(resumo)
```