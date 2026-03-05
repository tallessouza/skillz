---
name: rs-data-analytics-estatistica-descritiva
description: "Applies descriptive statistics principles when analyzing, cleaning, or summarizing datasets. Use when user asks to 'analyze data', 'summarize dataset', 'clean spreadsheet', 'describe data', or 'explore dataframe'. Guides data organization, summarization, and insight extraction following descriptive statistics fundamentals. Make sure to use this skill whenever working with raw datasets that need initial exploration or summary. Not for inferential statistics, hypothesis testing, or machine learning modeling."
---

# Estatística Descritiva

> Estatística descritiva é a primeira etapa da análise de dados: resumir e organizar dados brutos em informações claras para tomada de decisão.

## Key concept

Estatística descritiva transforma dados brutos em informações acionáveis. Não se trata apenas de organizar tabelas — o objetivo é extrair insights, identificar padrões e preparar os dados para que qualquer pessoa consiga "bater o olho" e visualizar uma decisão.

Analogia do instrutor: imagine receber uma planilha de 10 mil linhas de vendas de um grande e-commerce. Tempo é dinheiro, o e-commerce não pode parar. Organizar esses dados de forma clara e rápida para entregar ao time de marketing e vendas — isso é estatística descritiva em ação.

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Dataset bruto com milhares de linhas | Primeiro resuma e organize antes de qualquer análise |
| Dados repetidos ou sujos | Limpe e deduplique antes de calcular métricas |
| Pedido de "análise rápida" | Use medidas descritivas (média, mediana, moda, distribuição) |
| Necessidade de comunicar dados para não-técnicos | Transforme números em visualizações claras |
| Planilha sem contexto | Identifique variáveis, tipos de dados e escala antes de tudo |

## How to think about it

### Pipeline de trabalho

```
Dados brutos → Limpeza → Organização → Resumo → Visualização → Insights
```

1. **Limpeza** — remover duplicatas, tratar valores ausentes, padronizar formatos
2. **Organização** — estruturar dados de forma que facilite análise
3. **Resumo** — calcular medidas centrais e de dispersão
4. **Visualização** — gráficos e tabelas que comuniquem rapidamente
5. **Insights** — conclusões acionáveis para tomada de decisão

### Exemplo prático

```python
# Dado bruto: planilha de vendas com 10k linhas
# Estatística descritiva transforma isso em:

df.describe()          # Resumo numérico
df.duplicated().sum()  # Identificar repetições
df.groupby('categoria').agg({'vendas': ['mean', 'median', 'sum']})  # Organizar por dimensão
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Estatística descritiva é só organizar tabela | É organizar, resumir, visualizar E extrair insights para decisão |
| Basta calcular média e pronto | Média sem contexto (dispersão, distribuição) pode enganar |
| É uma etapa opcional | É a primeira etapa obrigatória — sem ela, análises avançadas falham |

## When to apply

- Recebeu dataset novo e precisa entender o que tem ali
- Precisa entregar resumo executivo de dados para stakeholders
- Está preparando dados para análise mais avançada (inferencial, ML)
- Precisa identificar e remover dados sujos ou duplicados

## Limitations

- Não faz previsões — para isso, use estatística inferencial
- Não estabelece causalidade — apenas descreve o que existe
- Não substitui análise exploratória profunda em datasets complexos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
