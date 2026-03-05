# Code Examples: Personas de Dados

## Nota sobre exemplos

Esta aula e conceitual (tipo Reference) e nao inclui exemplos de codigo. Os exemplos abaixo ilustram os tipos de trabalho que cada persona executa, baseados no que o instrutor descreveu.

## Analista de dados — Analise diagnostica

```sql
-- "O que aconteceu que houve uma queda de vendas?"
-- Analista de dados responde com queries e dashboards

SELECT
  DATE_TRUNC('month', sale_date) AS month,
  SUM(revenue) AS total_revenue,
  COUNT(DISTINCT customer_id) AS unique_customers
FROM sales
WHERE sale_date >= '2025-01-01'
GROUP BY 1
ORDER BY 1;
```

```python
# Analista tambem pode usar Python para limpeza e tratamento
import pandas as pd

sales = pd.read_excel('vendas_2025.xlsx')
sales_clean = sales.dropna(subset=['revenue'])
monthly = sales_clean.groupby(sales_clean['date'].dt.to_period('M'))['revenue'].sum()
```

## Cientista de dados — Analise preditiva

```python
# "Qual a probabilidade do churn continuar nos proximos meses?"
# Cientista resolve em poucas linhas o que seria muito dificil em Excel

from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)
churn_probability = model.predict_proba(X_future)[:, 1]
```

## Cientista de dados — Analise prescritiva

```python
# "O que fazer para garantir um cenario otimista?"
# Com base na predicao, o cientista propoe acoes

high_risk_customers = customers[churn_probability > 0.7]
# Recomendar acoes: desconto, contato proativo, etc.
recommended_actions = generate_retention_plan(high_risk_customers)
```

## Engenheiro de dados — Infraestrutura

```sql
-- Engenheiro nao faz analise, mas garante que os dados
-- estejam estruturados e otimizados

CREATE TABLE sales_mart AS
SELECT
  s.sale_id,
  s.sale_date,
  s.revenue,
  c.customer_name,
  c.segment
FROM raw_sales s
JOIN raw_customers c ON s.customer_id = c.id;

-- Criacao de indices para queries rapidas
CREATE INDEX idx_sales_date ON sales_mart(sale_date);
```

## Comparacao: mesma pergunta, diferentes abordagens

### "As vendas estao caindo. O que fazemos?"

**Analista de dados:**
```
→ Cria dashboard mostrando a queda
→ Identifica QUANDO e ONDE a queda aconteceu
→ Responde: "Vendas cairam 15% na regiao Sul em marco"
```

**Cientista de dados:**
```
→ Modela tendencia e preve proximos meses
→ Responde: "Se nada mudar, queda de 22% ate junho"
→ Prescreve: "Campanha focada na regiao Sul pode reverter em 3 meses"
```

**Engenheiro de dados:**
```
→ Garante que os dados de vendas estejam consolidados
→ Otimiza pipeline para que dashboard atualize em tempo real
→ Nao responde a pergunta diretamente
```