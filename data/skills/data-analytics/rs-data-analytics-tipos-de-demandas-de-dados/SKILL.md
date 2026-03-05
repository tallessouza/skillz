---
name: rs-data-analytics-tipos-demandas
description: "Classifies data analysis demands into exploratory, descriptive, diagnostic, predictive, and prescriptive types following CRISP-DM methodology. Use when user asks to 'analyze data', 'create a dashboard', 'investigate why metrics changed', 'predict future values', 'recommend actions from data', or any data analysis task. Applies demand classification before starting analysis to ensure the right question is being answered. Make sure to use this skill whenever scoping a data analysis project or translating business questions into data problems. Not for database schema design, ETL pipelines, or pure coding tasks."
---

# Tipos de Demandas de Dados

> Antes de analisar dados, classifique a demanda para garantir que voce esta respondendo a pergunta certa — se voce nao sabe que pergunta esta respondendo, nao tem como saber se a resposta esta correta.

## Rules

1. **Sempre classifique a demanda antes de iniciar** — identifique se e exploratoria, descritiva, diagnostica, preditiva ou prescritiva, porque cada tipo exige tecnicas e entregas diferentes
2. **Traduza o problema de negocio em problema de dado** — o executivo muitas vezes nao sabe o que quer; seu papel e minerar detalhes e formular a verdadeira pergunta de dados
3. **Diferencie pelo tempo verbal** — diagnostica = passado (por que aconteceu?), preditiva = futuro (o que pode acontecer?), prescritiva = acao (o que devemos fazer?)
4. **Exploratoria antecede todas as outras** — ela nao ocorre isolada, sempre precede diagnostico, predicao ou prescricao
5. **Levante hipoteses, premissas e restricoes nesta etapa** — deadlines, limites de dados, e possibilidades devem ser mapeados antes de qualquer analise tecnica

## Classificacao de Demandas

### Exploratoria — "O que os dados sao?"
```
Natureza: Exploracao da composicao dos dados
Pergunta tipica: "O que os dados podem nos dizer?"
Tecnicas: EDA, media, desvio padrao, outliers, valores nulos, duplicados
Exemplo: "Quais produtos tem menor giro de estoque?"
Origem: Lider tecnico ou iniciativa propria do analista
```

### Descritiva — "O que aconteceu?"
```
Natureza: Resumir informacoes e apresentar metricas
Pergunta tipica: "Quais sao os numeros do mes?"
Tecnicas: Dashboards, KPIs, reportes mensais
Exemplo: Dashboards financeiros para reunioes executivas
Origem: Demanda recorrente, geralmente ja automatizada
```

### Diagnostica — "Por que aconteceu?"
```
Natureza: Raio-x sobre causa do problema
Pergunta tipica: "Por que tivemos queda nas vendas?"
Tecnicas: Analise de sazonalidade, YoY, segmentacao, correlacao
Exemplo: "Nosso site teve queda no trafego, qual foi o motivo?"
Origem: Executivos apos identificar anomalia no dashboard
```

### Preditiva — "O que pode acontecer?"
```
Natureza: Estimativa do futuro com ressalvas e premissas
Pergunta tipica: "Quanto vamos fechar de receita ate o final do ano?"
Tecnicas: Regressao, machine learning, series temporais
Exemplo: "Se ajustarmos o preco em 10%, qual sera o impacto nas vendas?"
Origem: Planejamento estrategico, gestao de risco
```

### Prescritiva — "O que devemos fazer?"
```
Natureza: Recomendacao pratica, tomada de decisao
Pergunta tipica: "Como podemos reduzir o CAC?"
Tecnicas: Otimizacao, sistemas de recomendacao, analise a priori
Exemplo: "Clientes que compraram A tambem compram B" → gerar recomendacoes
Origem: Operacoes em tempo real, decisoes estrategicas
```

## Heuristics

| Situacao | Classificacao |
|----------|---------------|
| Pergunta sobre composicao/natureza dos dados | Exploratoria |
| Pergunta no passado ("por que aconteceu?") | Diagnostica |
| Pergunta no futuro ("o que pode acontecer?") | Preditiva |
| Pergunta de acao ("o que devemos fazer?") | Prescritiva |
| Metricas recorrentes em dashboard | Descritiva |
| Executivo pede analise mas nao especifica bem | Pare, minerem juntos a verdadeira pergunta |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Comecar analise sem classificar a demanda | Classifique primeiro, depois escolha tecnicas |
| Assumir que o executivo sabe o que quer | Ajude-o a formular hipoteses e definir a pergunta |
| Responder com analise de sazonalidade quando pedem progressao de descontos | Valide a pergunta real antes de executar |
| Pular analise exploratoria e ir direto para diagnostico | Sempre faca EDA antes de qualquer outra analise |
| Confundir preditiva com prescritiva | Preditiva preve, prescritiva recomenda acao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
