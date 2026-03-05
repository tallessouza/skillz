---
name: rs-data-analytics-perguntas-de-dados
description: "Enforces refinement of vague business questions into specific, measurable data questions using the SMART method. Use when user asks to 'analyze data', 'answer a business question', 'define KPIs', 'create a data analysis', or 'refine a question for analysis'. Applies rules: specify objective, define metric, set time range, consider segmentation, validate with SMART, check correlation vs causation. Make sure to use this skill whenever translating business demands into data analysis tasks. Not for writing SQL queries, building dashboards, or statistical modeling."
---

# Perguntas de Dados

> Traduza toda pergunta de negocio vaga em uma pergunta de dados especifica, mensuravel e acionavel antes de iniciar qualquer analise.

## Rules

1. **Nunca aceite a pergunta de negocio como ela veio** — perguntas de negocio sao estrategicas e vagas, perguntas de dados sao factuais e mensuraveis, porque trabalhar com perguntas vagas gera dezenas de caminhos possiveis e desperdiça recursos
2. **Especifique o objetivo real** — descubra o que o stakeholder realmente quer saber conversando com ele, porque a demanda superficial raramente reflete a necessidade real
3. **Defina uma metrica mensuravel** — toda pergunta precisa de um KPI ou indicador quantificavel, porque sem metrica nao ha como medir resultado (ex: "felicidade" → ENPS)
4. **Estabeleca recorte temporal** — sempre inclua periodo na pergunta, porque o recorte muda completamente o resultado (mensal, trimestral, anual)
5. **Considere segmentacoes relevantes** — avalie se o problema esta em um segmento especifico (regiao, canal, tipo de cliente), porque tratar o todo quando o problema e localizado desperdiça recursos
6. **Correlacao nao implica causalidade** — nunca assuma que dois eventos correlacionados tem relacao de causa e efeito, porque voce pode descontinuar um produto inocente ao confundir efeito colateral com causa raiz

## How to refine

### Passo a passo

```
1. Receba a pergunta de negocio
2. Especifique o objetivo → O que exatamente queremos descobrir?
3. Defina a metrica → Como podemos medir isso? (KPI)
4. Estabeleca o periodo → Qual recorte temporal?
5. Identifique segmentacoes → Comparar por que dimensoes?
6. Valide com SMART → Especifica, Mensuravel, Atingivel, Relevante, Temporal?
7. Verifique causalidade → Estou resolvendo a causa raiz ou um efeito colateral?
```

### Validacao SMART

```
[S] Especifica   → A pergunta e clara e bem definida?
[M] Mensuravel   → Consigo quantificar a resposta?
[A] Atingivel    → Os dados necessarios estao disponiveis?
[R] Relevante    → A resposta ajudara na tomada de decisao?
[T] Temporal     → A analise cobre um periodo adequado?
```

## Example

**Before (pergunta de negocio vaga):**
```
"Nossos anuncios estao funcionando?"
```

Problemas: Quais anuncios? Que periodo? O que e "funcionando" — cliques, conversao, checkout?

**After (pergunta de dados refinada):**
```
"Qual a taxa de conversao por canal de aquisicao nos ultimos tres meses,
comparando trimestre atual vs trimestre anterior?"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Stakeholder pede analise vaga | Converse para descobrir o objetivo real antes de comecar |
| Nao existe metrica obvia | Pesquise KPIs do setor (NPS, churn rate, CSAT, CAC, LTV) |
| Dados insuficientes para o periodo desejado | Amplie o recorte temporal ou reduza granularidade |
| Resultado aponta culpado obvio | Investigue se e causa raiz ou efeito colateral |
| Pergunta cobre muitos segmentos | Quebre em sub-perguntas por segmento |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Aceitar "melhore a retencao" como demanda | Perguntar: qual a taxa de churn nos ultimos 3 meses e quais fatores influenciam? |
| Usar "funcionando" como metrica | Definir KPI: taxa de conversao, CTR, ROI |
| Analisar sem periodo definido | Sempre incluir recorte temporal explicito |
| Assumir que correlacao e causa | Investigar a causa raiz separadamente |
| Descontinuar produto por correlacao | Avaliar se o problema vem de outro fator anterior |
| Medir "felicidade" diretamente | Usar proxy mensuravel: ENPS, NPS, CSAT |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
