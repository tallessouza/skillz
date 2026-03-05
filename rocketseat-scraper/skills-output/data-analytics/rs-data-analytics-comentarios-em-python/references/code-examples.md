# Code Examples: Comentarios em Python

## Exemplos do instrutor

### Comentario de uma linha apos comando

```python
print("Olá")  # Esse é o meu comentário
```

**Resultado:** Executa o `print("Olá")`, imprime "Olá". O comentario e completamente ignorado pelo interpretador.

### Comentario antes do comando (linha inteira comentada)

```python
# Essa linha inteira é um comentário e não será executada
print("Olá")
```

**Resultado:** A primeira linha e ignorada. Apenas `print("Olá")` executa.

### Multiplas linhas com `#`

```python
# Comentário 1
# Comentário 2
# Comentário 3
```

Cada linha individualmente comentada. Util para blocos curtos (2-5 linhas).

### Triple aspas simples

```python
'''
Comentários
de várias
linhas
'''
```

### Triple aspas duplas

```python
"""
Comentários
de várias
linhas
"""
```

## Exemplos expandidos para contexto de Data Analytics

### Comentando um pipeline pandas

```python
import pandas as pd

# Carrega dados brutos do CSV exportado pelo time de vendas
df = pd.read_csv("vendas_2024.csv")

# Remove linhas duplicadas baseado no ID da transacao
# (exportacao do SAP gera duplicatas em lotes grandes)
df = df.drop_duplicates(subset=["transaction_id"])

# Converte coluna de data de string para datetime
# Formato BR: dd/mm/yyyy
df["data_venda"] = pd.to_datetime(df["data_venda"], format="%d/%m/%Y")

'''
Regra de negocio: vendas com valor zero sao brindes promocionais.
Mantemos no dataset mas marcamos com flag para excluir de metricas de receita.
Decisao alinhada com time financeiro em 2024-03-15.
'''
df["is_brinde"] = df["valor"] == 0
```

### Comentando decisoes em visualizacao

```python
import matplotlib.pyplot as plt

# Usa escala logaritmica porque distribuicao de receita tem cauda longa
# (poucos clientes respondem por 80% do faturamento)
plt.yscale("log")

plt.hist(df["receita"], bins=50)  # 50 bins para granularidade sem ruido
plt.title("Distribuição de Receita por Cliente")
plt.show()
```

### Quando NAO comentar

```python
# NAO FACA ISSO — comentarios obvios:
# Importa pandas
import pandas as pd
# Le o arquivo
df = pd.read_csv("dados.csv")
# Mostra as primeiras linhas
df.head()

# FACA ISSO — sem comentarios, o codigo ja e claro:
import pandas as pd
df = pd.read_csv("dados.csv")
df.head()
```