# Code Examples: Perguntas de Dados

## Framework de Refinamento de Perguntas

Este skill e conceitual (nao envolve codigo), mas pode ser aplicado como template estruturado para documentar o processo de refinamento.

### Template de refinamento

```markdown
## Refinamento de Pergunta

### Pergunta original (negocio)
> [Pergunta como chegou do stakeholder]

### Analise da pergunta
- **O que e vago?** [Identificar termos imprecisos]
- **O que falta?** [Metrica, periodo, segmento]
- **Qual o objetivo real?** [Descoberto em conversa com stakeholder]

### Pergunta refinada (dados)
> [Pergunta especifica, mensuravel, com periodo e segmento]

### Validacao SMART
- [x] Especifica: [justificativa]
- [x] Mensuravel: [KPI definido]
- [x] Atingivel: [dados disponiveis]
- [x] Relevante: [decisao que sera tomada]
- [x] Temporal: [periodo definido]

### Risco de causalidade
- [ ] Verificado se nao estamos confundindo correlacao com causalidade
- [ ] Verificado se nao estamos resolvendo efeito colateral em vez de causa raiz
```

### Exemplo 1: Retencao de clientes

```markdown
## Refinamento de Pergunta

### Pergunta original (negocio)
> Como podemos melhorar nossa retencao de clientes?

### Analise da pergunta
- **O que e vago?** "Melhorar" — melhorar em relacao a que? "Retencao" — qual metrica especifica?
- **O que falta?** Periodo, baseline, segmentacao
- **Qual o objetivo real?** Entender por que clientes estao saindo e como reverter

### Pergunta refinada (dados)
> Qual a taxa de churn nos ultimos 3 meses e quais fatores mais influenciam na saida de clientes?

### Validacao SMART
- [x] Especifica: taxa de churn + fatores de influencia
- [x] Mensuravel: churn rate (%) + ranking de fatores
- [x] Atingivel: dados de cancelamento e historico de clientes disponiveis
- [x] Relevante: resposta direciona acoes de retencao
- [x] Temporal: ultimos 3 meses

### Risco de causalidade
- [ ] Produto X com mais churn pode ser efeito de insatisfacao anterior com produto Y
- [ ] Sazonalidade pode explicar queda sem necessidade de intervencao
```

### Exemplo 2: Anuncios

```markdown
## Refinamento de Pergunta

### Pergunta original (negocio)
> Nossos anuncios estao funcionando?

### Analise da pergunta
- **O que e vago?** "Funcionando" — cliques? conversao? vendas? "Nossos" — todos ou especificos?
- **O que falta?** Definicao de sucesso, periodo, canais
- **Qual o objetivo real?** Saber se investimento em anuncios converte em vendas

### Pergunta refinada (dados)
> Qual a taxa de conversao por canal de aquisicao nos ultimos 3 meses,
> com comparativo tri-over-tri?

### Validacao SMART
- [x] Especifica: taxa de conversao por canal
- [x] Mensuravel: conversion rate (%)
- [x] Atingivel: dados de campanhas e vendas disponiveis
- [x] Relevante: direciona alocacao de budget de marketing
- [x] Temporal: ultimos 3 meses + comparativo trimestral
```

### Exemplo 3: Satisfacao com suporte

```markdown
### Pergunta original (negocio)
> Nossos clientes gostam do nosso suporte?

### Pergunta refinada (dados)
> Qual o NPS por canal de atendimento nos ultimos 6 meses?
> Quais os principais motivos de reclamacao?

### Nota sobre metrica
"Gostar" nao e mensuravel. O NPS (Net Promoter Score) e um proxy
quantificavel para satisfacao. Alternativas: CSAT, CES.
```

### Tabela de traducao rapida: termos vagos → metricas

```markdown
| Termo vago          | Metrica sugerida                    |
|---------------------|-------------------------------------|
| "funcionando"       | Taxa de conversao, ROI, CTR         |
| "popular"           | Taxa de retencao, DAU/MAU, downloads|
| "gostam"            | NPS, CSAT, CES                      |
| "trazendo clientes" | CAC, taxa de conversao por canal    |
| "ajudando"          | Lift incremental, A/B test result   |
| "reconhecimento"    | Brand awareness survey, share of voice|
| "satisfeitos"       | NPS, CSAT, tempo de resolucao       |
| "melhorar"          | Delta vs baseline, % de melhoria    |
```