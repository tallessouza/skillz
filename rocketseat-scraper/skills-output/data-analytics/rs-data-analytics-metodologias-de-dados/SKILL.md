---
name: rs-data-analytics-metodologias-de-dados
description: "Applies data analysis methodology selection (CRISP-DM, Lean Analytics, DataOps, AB Testing) when user asks to 'analyze data', 'start a data project', 'investigate churn', 'build a data pipeline', or 'choose analysis approach'. Guides through CRISP-DM phases for structured analysis and recommends methodology based on context. Make sure to use this skill whenever planning or executing data analysis work. Not for code implementation, SQL queries, or dashboard building."
---

# Metodologias de Dados

> Selecione a metodologia de analise adequada ao problema antes de tocar nos dados.

## Rules

1. **Comece sempre pela compreensao do negocio** — nunca pule direto para os dados, porque sem entender o problema voce vai responder a pergunta errada
2. **Use CRISP-DM para perguntas pontuais de negocio** — "por que o churn subiu?" e um problema CRISP-DM, nao um dashboard de metricas, porque CRISP-DM e um processo fechado para responder UMA pergunta
3. **Use Lean Analytics para acompanhamento continuo** — metricas, KPIs, testes rapidos de hipotese, porque o objetivo e velocidade de decisao, nao profundidade de analise
4. **Use DataOps para governanca e automacao** — integridade, LGPD, pipelines automatizados, porque e responsabilidade de engenheiros/cientistas de dados
5. **Use AB Testing para experimentacao com usuarios** — variacao de elementos, comparacao de versoes, porque exige grupo de controle e volume de usuarios (B2C)
6. **Permita ida e volta entre fases** — compreensao de negocio e compreensao de dados sao iterativas, porque frequentemente voce descobre que nao tem os dados que imaginava

## Decision framework

| Situacao | Metodologia |
|----------|-------------|
| Responder uma pergunta especifica de negocio | CRISP-DM |
| Acompanhar metricas e tomar decisoes rapidas | Lean Analytics |
| Automatizar pipelines e garantir qualidade dos dados | DataOps |
| Testar variacoes de produto com usuarios reais | AB Testing |
| Problema complexo sem clareza | CRISP-DM (comece pela compreensao de negocio) |

## CRISP-DM — Ciclo completo

### 1. Compreensao de Negocio
- Definir o problema e os objetivos da analise
- Conversar com stakeholders (vendas, financeiro, marketing)
- Levantar hipoteses e premissas

### 2. Compreensao dos Dados
- Identificar quais dados sao necessarios
- Coleta e analise exploratoria
- Iterar com fase 1 (dados ausentes → voltar ao negocio)

### 3. Preparacao dos Dados
- Limpeza e normalizacao

### 4. Modelagem
- Aplicacao de tecnicas estatisticas e machine learning
- Se encontrar problemas, voltar para fase 3

### 5. Avaliacao
- Validacao dos resultados com stakeholders

### 6. Implantacao (Deploy)
- Automatizacao do modelo para uso continuo e perene

## Heuristics

| Situacao | Faca |
|----------|------|
| Stakeholder pede "analise de churn" | CRISP-DM: comece entendendo o problema com as areas envolvidas |
| Precisa de metricas de carrinho abandonado | Lean Analytics: defina KPIs e meca continuamente |
| Colunas sem documentacao no banco | DataOps: implemente governanca de dados |
| Quer otimizar taxa de clique em thumbnails | AB Testing: crie variacoes e teste com usuarios |
| Nao sabe qual metodologia usar | CRISP-DM cobre a maioria dos casos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Pular direto para o notebook/codigo | Compreensao de negocio primeiro |
| Usar CRISP-DM para criar dashboards de observacao | Use Lean Analytics para metricas continuas |
| Ignorar iteracao entre fases | Volte para fases anteriores quando necessario |
| Fazer deploy sem validacao com stakeholders | Avaliacao antes da implantacao |
| Tratar toda analise como igual | Selecione a metodologia adequada ao contexto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
