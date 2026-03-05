# Code Examples: Média Aritmética

## Exemplo da aula: Acessos semanais a um site

### Dados do problema

Um analista está analisando o número de acessos diários a um site ao longo de uma semana:

| Dia | Acessos |
|-----|---------|
| 1   | 100     |
| 2   | 130     |
| 3   | 180     |
| 4   | 200     |
| 5   | 230     |
| 6   | 250     |
| 7   | 300     |

### Cálculo manual (como feito na aula)

```
Média = (100 + 130 + 180 + 200 + 230 + 250 + 300) / 7
Média = 1390 / 7
Média = 198,57
```

### Em Python puro

```python
acessos_semana = [100, 130, 180, 200, 230, 250, 300]

# Passo 1: Identificar N
quantidade_dias = len(acessos_semana)  # 7

# Passo 2: Somar todos os valores
soma_acessos = sum(acessos_semana)  # 1390

# Passo 3: Dividir pela quantidade
media_acessos = soma_acessos / quantidade_dias  # 198.57142857142858

print(f"Total de acessos na semana: {soma_acessos}")
print(f"Média de acessos diários: {media_acessos:.2f}")
```

### Com pandas (cenário real)

```python
import pandas as pd

dados = pd.DataFrame({
    'dia': range(1, 8),
    'acessos': [100, 130, 180, 200, 230, 250, 300]
})

media = dados['acessos'].mean()
print(f"Média de acessos: {media:.2f}")

# Contexto adicional que um bom analista incluiria
print(f"Mínimo: {dados['acessos'].min()}")
print(f"Máximo: {dados['acessos'].max()}")
print(f"Amplitude: {dados['acessos'].max() - dados['acessos'].min()}")
```

### Com numpy

```python
import numpy as np

acessos = np.array([100, 130, 180, 200, 230, 250, 300])
media = np.mean(acessos)
print(f"Média: {media:.2f}")
```

### Em SQL

```sql
-- Calculando média de acessos diários de uma semana
SELECT 
    AVG(acessos) AS media_acessos,
    MIN(acessos) AS min_acessos,
    MAX(acessos) AS max_acessos,
    COUNT(*) AS total_dias
FROM site_analytics
WHERE semana = 1;
```

### Visualização com matplotlib (como o gráfico mostrado na aula)

```python
import matplotlib.pyplot as plt

dias = list(range(1, 8))
acessos = [100, 130, 180, 200, 230, 250, 300]
media = sum(acessos) / len(acessos)

plt.figure(figsize=(10, 6))
plt.bar(dias, acessos, color='steelblue', label='Acessos diários')
plt.axhline(y=media, color='red', linestyle='--', label=f'Média: {media:.2f}')
plt.xlabel('Dia da semana')
plt.ylabel('Número de acessos')
plt.title('Acessos diários ao site')
plt.legend()
plt.show()
```

### Exemplo de como a média pode enganar (alerta do instrutor)

```python
# Cenário onde a média é traiçoeira
salarios = [2000, 2500, 3000, 2800, 3200, 50000]
media_salarios = sum(salarios) / len(salarios)
# Resultado: 10583.33 — não representa nenhum funcionário!

# Por isso o instrutor alerta: sempre considere outras medidas
import statistics
mediana_salarios = statistics.median(salarios)
# Resultado: 2900.0 — muito mais representativo

print(f"Média: R${media_salarios:,.2f}")    # R$10,583.33
print(f"Mediana: R${mediana_salarios:,.2f}")  # R$2,900.00
```