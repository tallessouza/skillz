# Code Examples: Estatística Descritiva

## Contexto

A aula é conceitual e não inclui código diretamente. Os exemplos abaixo traduzem os conceitos ensinados em código prático usando Python/Pandas, que é o stack comum em data analytics.

## Exemplo 1: Recebendo dados brutos de e-commerce

```python
import pandas as pd

# Cenário do instrutor: planilha de 10k linhas de vendas
df = pd.read_csv('vendas_ecommerce.csv')

# Primeiro passo: entender o que temos
print(f"Linhas: {len(df)}")
print(f"Colunas: {list(df.columns)}")
print(f"Tipos: \n{df.dtypes}")
```

## Exemplo 2: Limpeza — remover dados repetidos

```python
# O instrutor menciona: "tirar dados repetidos, deixar mais claro"
duplicatas = df.duplicated().sum()
print(f"Dados repetidos encontrados: {duplicatas}")

df_limpo = df.drop_duplicates()
print(f"Linhas após limpeza: {len(df_limpo)}")
```

## Exemplo 3: Resumo descritivo

```python
# "Resumir e organizar de maneira simples"
print(df_limpo.describe())

# Resumo por categoria — para entregar ao time de marketing/vendas
resumo = df_limpo.groupby('categoria').agg({
    'valor_venda': ['count', 'sum', 'mean', 'median'],
    'quantidade': ['sum', 'mean']
})
print(resumo)
```

## Exemplo 4: De dado bruto para dado trabalhado

```python
# Transformação que o instrutor ilustra visualmente

# ANTES (dado bruto)
# - Duplicatas, valores faltando, sem organização

# DEPOIS (dado trabalhado)
df_final = (
    df
    .drop_duplicates()
    .dropna(subset=['valor_venda'])
    .sort_values('data_venda')
    .reset_index(drop=True)
)

# Agora é possível "bater o olho" e tomar decisões
print(df_final.head(10))
```

## Exemplo 5: Insights para times de marketing e vendas

```python
# O instrutor menciona: entregar dados para "time de marketing, time de venda"
# com "tomadas de decisões baseadas nos dados"

# Top categorias por faturamento
top_categorias = (
    df_final
    .groupby('categoria')['valor_venda']
    .sum()
    .sort_values(ascending=False)
    .head(5)
)
print("Top 5 categorias por faturamento:")
print(top_categorias)

# Tendência temporal
vendas_por_mes = df_final.groupby(df_final['data_venda'].dt.to_period('M'))['valor_venda'].sum()
print("\nVendas por mês:")
print(vendas_por_mes)
```