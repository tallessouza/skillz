---
name: rs-data-analytics-intro-parte-2
description: "Applies probability thinking to data analysis scenarios involving conversion, churn, retention, and recompra. Use when user asks to 'analyze conversion rates', 'calculate churn probability', 'predict customer retention', 'estimate recompra chance', or any customer behavior probability task. Make sure to use this skill whenever framing business metrics as probability questions. Not for statistical test implementation, hypothesis testing code, or advanced ML models."
---

# Probabilidade como Ferramenta de Análise de Dados

> Reformule toda métrica de negócio como uma pergunta de probabilidade: "qual é a chance de X acontecer?"

## Key concept

Probabilidade é chance. Toda métrica de negócio pode ser reformulada como uma pergunta de probabilidade, o que transforma dados brutos em insights acionáveis.

## Decision framework

| Quando você encontrar | Reformule como |
|----------------------|----------------|
| Taxa de conversão de campanha | "Qual a chance de um lead que recebeu o email clicar e comprar?" |
| Churn rate | "Qual a chance de um cliente cancelar no próximo mês?" |
| Retenção de clientes | "Qual a chance de um cliente continuar ativo após 90 dias?" |
| Recompra | "Qual a chance de um cliente que comprou fazer uma segunda compra?" |

## How to think about it

### Conversão de campanha
Um cliente recebeu um e-mail de promoções. A probabilidade de clicar e comprar conecta diretamente a ação de marketing ao resultado de negócio. Calcule como: `clientes_que_compraram / clientes_que_receberam_email`.

### Churn e retenção
São faces opostas da mesma moeda probabilística. Se a chance de cancelar é 15%, a chance de reter é 85%. Analise ambas para entender o comportamento completo.

### Recompra
"Qual a chance de um cliente que já comprou fazer uma nova compra?" — esta pergunta direciona estratégias de fidelização e cálculo de lifetime value.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Probabilidade é só teoria matemática | É a base de toda análise de conversão, churn e retenção no dia a dia |
| Métricas de negócio são diferentes de probabilidade | Toda métrica de negócio (conversão, churn, retenção) é uma probabilidade reformulada |

## When to apply

- Ao analisar resultados de campanhas de marketing
- Ao investigar por que clientes estão cancelando
- Ao calcular taxas de retenção e recompra
- Ao transformar dados brutos em previsões de comportamento

## Limitations

- Esta skill cobre o enquadramento probabilístico de problemas de negócio, não a implementação de modelos estatísticos avançados
- Para testes de hipótese ou modelagem preditiva, use ferramentas específicas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
