---
name: rs-devops-metricas
description: "Applies observability metrics patterns when instrumenting applications with counters, histograms, gauges, and timers. Use when user asks to 'add metrics', 'instrument code', 'monitor performance', 'track latency', 'add observability', or 'measure response time'. Covers metric types, percentiles (P99/P95), anomaly detection, SLI/SLO, and Golden Signals. Make sure to use this skill whenever implementing application monitoring or observability instrumentation. Not for log implementation, distributed tracing, or infrastructure provisioning."
---

# Métricas — Segundo Pilar da Observabilidade

> Métricas são valores numéricos que representam o estado e comportamento do sistema no macro, complementando logs (micro) com visão de sintomas e tendências.

## Rules

1. **Métricas mostram sintomas, não causas** — use métricas para detectar anomalias, depois investigue com logs e traces, porque métrica sozinha não permite debug
2. **Contadores só incrementam** — nunca decremente um counter; crie contadores separados para sucesso e erro, porque contadores representam totais acumulados
3. **Histogramas para duração** — use histograma quando precisar medir tempo de requisição ou latência, porque permite calcular percentis (P99, P95, P90)
4. **Métricas são baratas para armazenar** — diferente de logs, não há preocupação com deleção ou rotação, porque o custo de armazenamento é muito menor
5. **Defina métricas negociais além de técnicas** — métricas transacionais e de produto são tão importantes quanto latência e erros, porque permitem acompanhar crescimento do ecossistema
6. **Monitore percentis, não apenas médias** — P99 de 2s significa sistema lento mesmo que a média pareça ok, porque percentis revelam a experiência real dos usuários

## Tipos de métricas

### Counter (Contador)
```typescript
// Contadores SEPARADOS para sucesso e erro — nunca decremente
metrics.counter('user_registration_success_total').increment(1)
metrics.counter('user_registration_error_total').increment(1)
```

### Histogram (Histograma)
```typescript
// Medir tempo de requisição com diff de timestamps
const startTime = Date.now()
const result = await processRequest()
const durationMs = Date.now() - startTime
metrics.histogram('request_duration_ms').record(durationMs)
```

### Gauge (Medidor)
```typescript
// Gauge permite incrementar E decrementar
metrics.gauge('active_connections').increment(1)
metrics.gauge('active_connections').decrement(1)
```

### Timer (Temporizador)
```typescript
// Acompanhar lastro temporal de operações
const timer = metrics.timer('operation_duration')
timer.start()
await performOperation()
timer.stop()
```

## Example

**Before (sem métricas):**
```typescript
async function registerUser(data: CreateUserInput) {
  try {
    const user = await repository.create(data)
    return { user }
  } catch (error) {
    throw error
  }
}
```

**After (com métricas instrumentadas):**
```typescript
async function registerUser(data: CreateUserInput) {
  const startTime = Date.now()
  try {
    const user = await repository.create(data)
    metrics.counter('user_registration_success_total').increment(1)
    metrics.histogram('user_registration_duration_ms').record(Date.now() - startTime)
    return { user }
  } catch (error) {
    metrics.counter('user_registration_error_total').increment(1)
    metrics.histogram('user_registration_duration_ms').record(Date.now() - startTime)
    throw error
  }
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Contar ocorrências (sucesso, erro, requests) | Counter — só incrementa |
| Medir tempo/latência de operações | Histogram — permite percentis |
| Valor que sobe e desce (conexões ativas, fila) | Gauge — incrementa e decrementa |
| Acompanhar performance do sistema | Percentis P99, P95, P90 |
| Detectar problemas de capacidade | Golden Signals: saturação, erro, latência, tráfego |
| Contrato de SLA com cliente | Definir SLI (indicador) e SLO (objetivo) com métricas |
| Tráfego mudou drasticamente (100 RPS → 500 ou → 10) | Anomalia — investigar com logs e traces |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Decrementar um counter de erro | Criar counters separados: `success_total` e `error_total` |
| Usar só média para medir latência | Usar percentis P99/P95/P90 |
| Tentar debugar usando apenas métricas | Usar métrica como sintoma, investigar com logs |
| Ignorar métricas de negócio | Instrumentar fluxos transacionais (cadastros, vendas, conversões) |
| Deletar métricas antigas por espaço | Manter histórico — custo de armazenamento é baixo |
| Monitorar apenas erros técnicos | Incluir Golden Signals: saturação, erro, latência, tráfego |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
