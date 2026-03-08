---
name: rs-devops-metrificando-descentralizando
description: "Applies CALMS Measurement and Sharing principles when designing observability, metrics, or knowledge-sharing practices. Use when user asks to 'add monitoring', 'create dashboards', 'set up observability', 'document processes', 'share knowledge', or 'diagnose DevOps maturity'. Ensures metrics cover both business and technical layers, and knowledge is decentralized across the team. Make sure to use this skill whenever designing monitoring strategies or team knowledge processes. Not for implementing specific monitoring tools, writing code, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: calms-measurement-sharing
  tags: [calms, devops-culture, metrics, knowledge-sharing, observability, monitoring]
---

# Mensuração e Compartilhamento de Conhecimento (CALMS M+S)

> Mensure tanto métricas negociais quanto técnicas, e descentralize conhecimento para eliminar a Síndrome da Pessoa-Herói.

## Rules

1. **Sempre mensure em duas camadas: negocial e técnica** — métricas técnicas sozinhas não orientam decisões de produto, e métricas negociais sozinhas não revelam erros antes do usuário
2. **Descubra erros antes de pessoas externas** — monitoramento interno deve detectar problemas antes que clientes reportem, porque isso é a diferença entre reação e prevenção
3. **Métricas alimentam melhoria contínua** — sem inputs (feedbacks, métricas, monitoramento), não há como melhorar continuamente; mensuração é pré-requisito para CI/CD real
4. **Descentralize conhecimento ativamente** — compartilhe aprendizados, erros, tecnologias novas que deram certo ou errado, porque conhecimento centralizado cria fragilidade organizacional
5. **Use CALMS como diagnóstico** — faça perguntas sobre cada pilar para avaliar maturidade DevOps atual antes de propor melhorias
6. **Conhecimento compartilhado libera tempo** — quando todos estão na mesma página, cada pessoa fica livre para aprender coisas novas em vez de ficar presa a processos

## Diagnóstico CALMS (M + S)

### Perguntas de Mensuração (M)

| Pergunta | Indica maturidade se... |
|----------|------------------------|
| Fluxos críticos estão mensurados e acompanhados? | Sim, com dashboards acessíveis |
| Métricas negociais são expostas para gestão? | Sim, entrega fácil para times não-técnicos |
| Erros são descobertos internamente antes do cliente? | Sim, via alertas e monitoramento proativo |
| Decisões de produto usam dados da aplicação? | Sim, decisão orientada a dados |

### Perguntas de Compartilhamento (S)

| Pergunta | Indica maturidade se... |
|----------|------------------------|
| Existe mecanismo de documentação? | Sim, atualizado e acessível |
| Há calls para compartilhar aprendizados? | Sim, recorrentes |
| Existe processo de incidente documentado? | Sim, com post-mortem |
| Conhecimento está centralizado em uma pessoa? | Não — se sim, há Síndrome da Pessoa-Herói |

## Heuristics

| Situação | Faça |
|----------|------|
| Definindo métricas para nova feature | Inclua métrica negocial (ex: acessos, conversão) E técnica (ex: latência, erros) |
| Membro do time é o único que sabe resolver X | Priorize documentação e pair session para descentralizar |
| Lançou feature nova | Adicione mensuração específica (mapa de calor, contagem de acessos à nova aba) |
| Precisa justificar investimento técnico | Use métricas negociais para mostrar impacto |
| Avaliando maturidade DevOps | Aplique perguntas diagnósticas de cada pilar do CALMS |

## Métricas: Dois Níveis

### Nível Negocial
```
- Acessos por período (mês, semana, dia)
- Adoção de features novas (quantas pessoas usaram a nova aba?)
- Mapas de calor (onde os usuários interagem?)
- Conversão por fluxo
- Impacto em campanhas de marketing
```

### Nível Técnico
```
- Erros por período (descobertos internamente)
- Latência dos fluxos críticos
- Disponibilidade (uptime)
- Tempo de resposta a incidentes
- Cobertura de observabilidade dos fluxos críticos
```

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Monitorar só métricas técnicas | Exponha métricas negociais em dashboards acessíveis |
| Deixar conhecimento só na cabeça de uma pessoa | Documente, faça calls, crie processos de incidente |
| Esperar cliente reportar erro | Configure alertas para descobrir erros internamente primeiro |
| Implementar feature sem mensuração | Defina métricas de sucesso antes do lançamento |
| Compartilhar conhecimento só quando der problema | Crie ciclo contínuo: aprender → compartilhar → liberar tempo → aprender mais |

## Troubleshooting

### Time descobre problemas apenas quando clientes reportam
**Symptom:** Erros em producao so sao detectados quando usuarios reclamam
**Cause:** Falta monitoramento proativo com alertas configurados para metricas criticas
**Fix:** Configure alertas para metricas tecnicas (5XX, latencia alta) e negociais (queda de conversao) com thresholds que disparam antes do impacto ser percebido pelo usuario

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
