---
name: rs-devops-analisando-traces-metricas
description: "Analyzes distributed traces and metrics using OpenTelemetry, Grafana Tempo, and Mimir for request debugging. Use when user asks to 'debug a request', 'analyze traces', 'check metrics', 'correlate services', 'find slow endpoints', or 'investigate latency'. Enforces pipeline validation before investigation, Trace ID correlation across services, and auto-instrumentation interpretation before custom metrics. Make sure to use this skill whenever debugging request flows across services or validating observability pipelines. Not for setting up OpenTelemetry instrumentation, configuring collectors, or writing custom metrics code."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-analysis
  tags: [observability]
---

# Analisando Traces e Metricas da Aplicacao

> Use Trace IDs para correlacionar chamadas entre servicos e metricas auto-instrumentadas para validar o pipeline de observabilidade.

## Rules

1. **Sempre valide o pipeline antes de investigar** — rode `docker ps` e `docker logs <container>` para confirmar que os coletores estao saudaveis, porque traces nao aparecem se o pipeline estiver quebrado
2. **Use Trace ID para correlacao distribuida** — o Trace ID e o mesmo da aplicacao A ate a B, porque isso permite rastrear uma requisicao inteira atraves de multiplos servicos
3. **Interprete auto-instrumentacao antes de criar metricas custom** — OpenTelemetry ja fornece duration buckets, request totals e breakdowns por operacao, porque duplicar isso gera ruido
4. **Analise o breakdown temporal do trace** — cada span mostra quanto tempo cada operacao levou (Express init, JSON parser, handler), porque isso revela gargalos especificos
5. **Use TraceQL para buscas diretas** — cole o Trace ID no campo de busca do Tempo para ir direto ao trace, porque navegar pela lista e ineficiente em producao

## How to analyze

### Validar pipeline de observabilidade

```bash
# 1. Verificar containers rodando
docker ps

# 2. Checar logs do coletor por erros
docker logs <otel-collector-container>

# 3. Gerar traces de teste
curl http://localhost:3000/health
curl http://localhost:3000/help
```

### Navegar traces no Grafana Tempo

```
1. Grafana → Explore → Data Source: Tempo
2. Clicar em "Search" para listar Trace IDs recentes
3. Clicar no Trace ID para ver breakdown:
   - Duracao total da chamada (ex: 3.4ms)
   - Spans individuais (Express init, JSON parser, handler)
   - Servicos externos chamados (trace distribuido)
4. Ou usar TraceQL: colar Trace ID direto no campo de busca
```

### Explorar metricas no Mimir

```
1. Grafana → Explore → Data Source: Mimir
2. Clicar em "Metrics Browser"
3. Metricas auto-instrumentadas disponiveis:
   - http_server_duration_seconds_bucket  (latencia server-side)
   - http_client_duration_seconds_bucket  (latencia client-side)
   - http_server_request_total            (total de requisicoes)
4. Visualizar como: points, bars, time series
```

## Example

**Cenario: Debug de requisicao lenta**

**Antes (sem observabilidade):**
```
"O endpoint /health ta lento" → Sem dados → Chute → Trial and error
```

**Depois (com traces):**
```
1. Grafana Tempo → Search → Filtrar por /health
2. Trace mostra: total 2.6ms
   ├── Express bootstrap: 0.1ms
   ├── JSON Parser: 0.2ms
   ├── Route handler: 2.0ms  ← gargalo identificado
   └── Response: 0.3ms
3. Acao: otimizar o handler especifico
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Trace nao aparece apos request | Verifique `docker logs` do coletor primeiro |
| Quer rastrear chamada entre servicos | Use o mesmo Trace ID — ele propaga automaticamente |
| Metricas parecem confusas | Comece pelas auto-instrumentadas (duration, total) antes de custom |
| Precisa do trace especifico | Use TraceQL com o Trace ID direto |
| Quer evoluir dashboards | Primeiro valide que dados estao chegando no Mimir, depois crie dashboards |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Ignorar logs do coletor e ir direto ao Grafana | Valide pipeline com `docker logs` primeiro |
| Criar metricas custom sem explorar auto-instrumentacao | Use Metrics Browser para ver o que ja existe |
| Debugar sem Trace ID | Copie o Trace ID e use TraceQL para busca direta |
| Interpretar duration em segundos quando e milissegundos | Atente-se a unidade: 0.5 no bucket pode ser 0.5ms, nao 0.5s |
| Montar dashboards antes de validar que dados chegam | Primeiro confirme no Explore que metricas existem no Mimir |

## Troubleshooting

### Traces nao aparecem no Grafana Tempo apos fazer requisicoes
**Symptom:** Requisicoes sao feitas mas nenhum trace aparece no Tempo
**Cause:** O pipeline de coleta (OTEL Collector) pode estar com erro ou o exporter nao esta configurado corretamente
**Fix:** Verifique `docker logs` do OTEL Collector procurando erros de conexao ou configuracao, e confirme que o exporter do Tempo esta no service.pipelines

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-analisando-os-traces-e-metricas-da-aplicacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-analisando-os-traces-e-metricas-da-aplicacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
