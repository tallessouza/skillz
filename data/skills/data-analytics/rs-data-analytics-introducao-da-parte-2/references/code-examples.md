# Code Examples: Probabilidade como Ferramenta de Análise de Dados

## Reformulando métricas como probabilidades

A aula é conceitual e não contém código, mas aqui estão implementações práticas dos cenários mencionados pelo instrutor.

### Probabilidade de recompra

```python
import pandas as pd

# Dado um dataframe de pedidos
orders = pd.DataFrame({
    'customer_id': [1, 2, 3, 1, 4, 2, 1],
    'order_date': ['2025-01-01', '2025-01-05', '2025-02-01', 
                   '2025-03-01', '2025-03-15', '2025-04-01', '2025-05-01']
})

# Contar pedidos por cliente
orders_per_customer = orders.groupby('customer_id').size()

# Probabilidade de recompra = clientes com 2+ pedidos / total de clientes
total_customers = orders['customer_id'].nunique()
repeat_customers = (orders_per_customer >= 2).sum()

recompra_probability = repeat_customers / total_customers
print(f"Chance de recompra: {recompra_probability:.1%}")
# Chance de recompra: 66.7%
```

### Conversão de campanha (email → compra)

```python
# Cenário do instrutor: "cliente que recebeu email de promoções clicar e ir comprar"
emails_sent = 10000
emails_clicked = 1200
purchases_from_email = 180

click_probability = emails_clicked / emails_sent
purchase_probability = purchases_from_email / emails_sent
click_to_purchase = purchases_from_email / emails_clicked

print(f"Chance de clicar: {click_probability:.1%}")           # 12.0%
print(f"Chance de comprar (do total): {purchase_probability:.1%}")  # 1.8%
print(f"Chance de comprar (se clicou): {click_to_purchase:.1%}")    # 15.0%
```

### Churn e retenção como probabilidades opostas

```python
# "Os clientes estão cancelando, qual é a retenção desses clientes?"
active_customers_start = 500
churned_customers = 75

churn_probability = churned_customers / active_customers_start
retention_probability = 1 - churn_probability

print(f"Chance de cancelar (churn): {churn_probability:.1%}")     # 15.0%
print(f"Chance de continuar (retenção): {retention_probability:.1%}")  # 85.0%
```

### Probabilidade de chover no final de semana

```python
# Exemplo cotidiano do instrutor para ilustrar que probabilidade = chance
import random

# Simulação simples: dado histórico de 52 finais de semana
weekends_with_rain = 18
total_weekends = 52

rain_probability = weekends_with_rain / total_weekends
print(f"Chance de chover no fim de semana: {rain_probability:.1%}")  # 34.6%
```

### Template geral: qualquer métrica como probabilidade

```python
def calculate_probability(events_occurred: int, total_possible: int) -> float:
    """
    Fórmula base: P(evento) = eventos favoráveis / total de possibilidades
    
    Exemplos do instrutor:
    - P(recompra) = clientes_recompraram / total_clientes
    - P(churn) = clientes_cancelaram / total_clientes
    - P(conversão) = clientes_compraram / clientes_receberam_email
    """
    if total_possible == 0:
        return 0.0
    return events_occurred / total_possible
```