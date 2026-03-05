---
name: rs-data-analytics-base-conceitual
description: "Applies foundational data analytics concepts when working with data analysis tasks. Use when user asks to 'analyze data', 'choose analysis type', 'handle outliers', 'structure data', or 'build a data pipeline'. Enforces that data serves decisions not just metrics, selects correct analysis type (descriptive/diagnostic/predictive/prescriptive), and validates statistical measures against outliers. Make sure to use this skill whenever making data analysis decisions or choosing analytical approaches. Not for writing SQL queries, building dashboards, or specific tool configuration."
---

# Base Conceitual de Dados

> Dados sao um meio para decisoes, nunca um fim em si mesmos.

## Key concept

Analise de dados existe para viabilizar tomadas de decisao. Entregar um KPI nao e o objetivo final — o objetivo e que esse KPI gere uma acao. Antes de qualquer analise, pergunte: "Que decisao sera tomada com base nesse resultado?"

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Executivo pede "o que aconteceu?" | Analise descritiva — resumir dados historicos |
| Executivo pede "por que aconteceu?" | Analise diagnostica — investigar causas |
| Executivo pede "o que vai acontecer?" | Analise preditiva — projetar tendencias |
| Executivo pede "o que devo fazer?" | Analise prescritiva — recomendar acoes |
| Dado vem em tabelas (colunas/linhas) | Dado estruturado — mais facil de trabalhar |
| Dado vem em JSON ou logs de sistemas | Dado semi-estruturado — precisa transformacao |
| Dado e texto, video ou audio | Dado nao estruturado — maior complexidade |
| Media parece distorcida | Verificar outliers antes de confiar na metrica |

## Tipos de analise (complexidade crescente)

| Tipo | Pergunta | Complexidade | Exemplo |
|------|----------|-------------|---------|
| **Descritiva** | O que aconteceu? | Baixa | Relatorio de vendas do mes |
| **Diagnostica** | Por que aconteceu? | Media | Investigar queda de conversao |
| **Preditiva** | O que vai acontecer? | Alta | Projecao de churn |
| **Prescritiva** | O que fazer? | Muito alta | Recomendar acao para reter clientes |

## How to think about it

### Estatistica: media vs mediana vs moda

Nunca trate media, mediana e moda como intercambiaveis. A escolha da metrica muda completamente a interpretacao.

**Exemplo classico:** 10 jovens (18-25 anos) numa sala. Media de idade ~22 anos. Entra uma senhora de 65 anos. A media salta para ~26 anos, sugerindo um grupo mais velho — o que e falso. Um unico outlier distorceu a media. A mediana continuaria representando o grupo corretamente.

**Regra:** antes de reportar qualquer metrica estatistica, investigue o comportamento dos dados — outliers, valor minimo, valor maximo. Torne-se "melhor amigo" dos seus dados.

### Ciclo de vida do dado

```
Geracao → Coleta → Transformacao → Estruturacao → Carga → Analise/Modelagem → Visualizacao → Decisao
```

### Metodologia CRISP-DM

```
Pergunta de negocio → Dados necessarios → Tratamento → Modelagem → Validacao → Deploy
```

A metodologia nunca pode estar desconectada da area de negocios.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Entregar o KPI e o trabalho final | O KPI e meio para uma decisao, nao o fim |
| Media sempre representa bem o grupo | Um unico outlier pode distorcer a media completamente |
| Trabalhar com dados e trabalho isolado | Exige navegacao social e proximidade com areas de negocio |
| Dados falam por si | Dados sem contexto de negocio sao inuteis |
| Analise descritiva e suficiente | Cada tipo de analise responde perguntas diferentes |

## When to apply

- Ao definir que tipo de analise realizar para uma pergunta de negocio
- Ao escolher entre media, mediana ou moda para reportar
- Ao receber dados e precisar classificar seu nivel de estruturacao
- Ao montar um pipeline de dados e definir as etapas
- Ao validar se uma analise esta conectada a uma decisao real

## Limitations

- Nao cobre implementacao tecnica (SQL, Python, ferramentas de BI)
- Nao substitui conhecimento estatistico aprofundado
- Nao aborda tecnicas especificas de machine learning para analise preditiva/prescritiva

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
