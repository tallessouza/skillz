# Code Examples: Fundamentos de Python para Dados

## Nota sobre esta aula

Esta aula e introdutoria e conceitual — o instrutor nao apresentou codigo. Os exemplos abaixo ilustram os conceitos mencionados com codigo pratico para referencia futura.

## Pandas — Limpeza e analise basica

```python
import pandas as pd

# Carregar dados
users = pd.read_csv("users.csv")

# Explorar
print(users.head())
print(users.describe())

# Limpar dados faltantes
users_clean = users.dropna(subset=["email"])

# Filtrar usuarios ativos
active_users = users_clean[users_clean["is_active"] == True]

# Agrupar e contar
users_by_city = active_users.groupby("city").size().reset_index(name="count")
```

## NumPy — Operacoes numericas

```python
import numpy as np

# Calcular metricas de vendas
sales = np.array([1200, 3400, 2800, 5600, 4200])

average_sales = np.mean(sales)
total_sales = np.sum(sales)
std_deviation = np.std(sales)

print(f"Media: {average_sales}, Total: {total_sales}, Desvio: {std_deviation}")
```

## PySpark — Processamento distribuido

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("analytics").getOrCreate()

# Carregar dataset grande
orders = spark.read.parquet("s3://data-lake/orders/")

# Transformar e agregar
revenue_by_month = (
    orders
    .groupBy("year", "month")
    .agg({"total_amount": "sum", "order_id": "count"})
    .orderBy("year", "month")
)

revenue_by_month.show()
```

## Comparacao de sintaxe: Pandas vs PySpark

```python
# PANDAS (dados na memoria)
result = df[df["status"] == "active"].groupby("category")["revenue"].sum()

# PYSPARK (dados distribuidos — sintaxe similar)
result = df.filter(df["status"] == "active").groupBy("category").agg({"revenue": "sum"})
```

## Exemplo conceitual: Sistema de recomendacao (Netflix)

```python
from sklearn.neighbors import NearestNeighbors
import pandas as pd

# Matriz usuario x filme (ratings)
ratings_matrix = pd.pivot_table(
    ratings_df, 
    values="rating", 
    index="user_id", 
    columns="movie_id", 
    fill_value=0
)

# Encontrar filmes similares
model = NearestNeighbors(metric="cosine", algorithm="brute")
model.fit(ratings_matrix.T)

# Recomendar filmes similares ao filme X
distances, indices = model.kneighbors(
    ratings_matrix.T.iloc[movie_index].values.reshape(1, -1), 
    n_neighbors=5
)
```