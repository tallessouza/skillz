---
name: rs-devops-logs
description: "Enforces structured logging best practices when implementing observability, log systems, or debugging infrastructure. Use when user asks to 'add logging', 'implement logs', 'debug application', 'set up observability', or 'configure log levels'. Applies rules: structured JSON logs, severity levels, immutable log entries, external log storage, standardized log format across services. Make sure to use this skill whenever writing logging code or designing log infrastructure. Not for metrics, tracing, or application business logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-logs
  tags: [logs, observability, structured-logging, json, severity, monitoring]
---

# Logs — Primeiro Pilar da Observabilidade

> Logs sao registros textuais imutaveis de eventos que ja aconteceram, emitidos pela aplicacao e armazenados em ferramenta externa.

## Rules

1. **Exporte logs para ferramenta externa** — nunca armazene logs dentro do container ou da aplicacao, porque containers sao efemeros e ao serem descartados levam os logs junto
2. **Use formato JSON estruturado** — inclua timestamp, contexto da requisicao, IDs relevantes (usuario, admin), mensagem e severidade, porque isso permite buscas e indexacao eficientes
3. **Defina severidade correta** — use `info` para sucesso, `warn` para alertas (nao completou mas nao errou), `error` para erros, `critical` para falhas graves, porque facilita filtragem e priorizacao
4. **Padronize o formato entre servicos** — todos os servicos da organizacao devem emitir logs no mesmo formato, porque debug entre servicos diferentes com formatos diferentes e impraticavel
5. **Logs sao imutaveis** — nunca edite um log emitido; se precisar corrigir informacao, emita novo log, porque auditoria depende de imutabilidade
6. **Logue com objetividade** — logs devem ajudar no debug, nao atrapalhar; logue erros sempre, sucesso apenas quando necessario, porque excesso de logs gera custo e ruido

## How to write

### Logger estruturado com severidade

```typescript
// Sempre use logger estruturado, nunca console.log em producao
import { logger } from './lib/logger'

// Error — sempre logue erros com contexto
logger.error('Failed to process payment', {
  userId: user.id,
  orderId: order.id,
  error: error.message,
  stack: error.stack,
})

// Warning — acao nao completou mas nao e erro
logger.warn('Retry attempt on external API', {
  service: 'payment-gateway',
  attempt: 3,
  maxAttempts: 5,
})

// Info — eventos relevantes (use com parcimonia em producao)
logger.info('Order created successfully', {
  orderId: order.id,
  userId: user.id,
})
```

### Lib interna padronizada

```typescript
// Crie uma lib interna que todos os servicos usam
// Isso garante formato padronizado na organizacao
export function createLogger(serviceName: string) {
  return {
    info: (message: string, meta: Record<string, unknown>) =>
      emit({ level: 'info', service: serviceName, message, ...meta, timestamp: new Date().toISOString() }),
    warn: (message: string, meta: Record<string, unknown>) =>
      emit({ level: 'warn', service: serviceName, message, ...meta, timestamp: new Date().toISOString() }),
    error: (message: string, meta: Record<string, unknown>) =>
      emit({ level: 'error', service: serviceName, message, ...meta, timestamp: new Date().toISOString() }),
  }
}
```

## Example

**Before (anti-pattern):**
```typescript
// Log dentro do container, sem estrutura, sem severidade
console.log('deu erro aqui')
console.log(error)
fs.appendFileSync('./logs/app.txt', `${Date.now()} - erro\n`)
```

**After (with this skill applied):**
```typescript
logger.error('Payment processing failed', {
  userId: request.userId,
  orderId: request.orderId,
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
})
// Log emitido para ferramenta externa (Grafana Loki, LogZIO, etc.)
// Container pode morrer — log ja foi exportado
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Erro em qualquer fluxo | Sempre logue com `error` e contexto completo |
| Sucesso em producao | Avalie se realmente precisa; prefira nao logar |
| Sucesso em staging | Pode logar com `info` para debug, remova depois |
| Multiplos servicos | Crie lib padronizada compartilhada |
| Container/Kubernetes | Exporte logs para ferramenta externa antes de tudo |
| Auditoria fiscal/compliance | Arquive logs antigos em S3 Glacier/Deep Archive |
| Logs antigos sem necessidade | Defina retencao (ex: 7 dias transacional, depois archive ou delete) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `console.log('erro')` | `logger.error('Payment failed', { orderId, error })` |
| `fs.writeFileSync('./logs/...')` | Emita para ferramenta externa (Loki, LogZIO) |
| Log sem severidade | Sempre defina level: info, warn, error, critical |
| Formato livre por servico | Formato JSON padronizado via lib compartilhada |
| Editar log ja emitido | Emita novo log com informacao corrigida |
| Logar tudo em producao | Logue erros sempre, sucesso seletivamente |

## Troubleshooting

### Logs desaparecem quando container reinicia
**Symptom:** Apos restart do container, todos os logs anteriores sao perdidos
**Cause:** Logs estao sendo armazenados dentro do container (filesystem local) em vez de exportados para ferramenta externa
**Fix:** Configure exportacao para ferramenta externa (Grafana Loki, LogZIO, etc.) — nunca armazene logs dentro do container

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
