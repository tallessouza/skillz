# Code Examples: Logs — Primeiro Pilar da Observabilidade

## Exemplo basico: console.log vs logger estruturado

O instrutor menciona que `console.log` no Node.js ja e uma forma de emitir log, mas nao e adequado para producao.

```typescript
// O que muitos devs fazem (inadequado para producao)
console.log('Passou aqui')
console.log('Erro:', error)
console.log('User ID:', userId)
```

```typescript
// O que deve ser feito: logger estruturado
import { logger } from '@org/logger'

logger.info('Request processed', {
  userId: '123',
  endpoint: '/api/orders',
  duration: 45,
})
```

## Niveis de severidade na pratica

```typescript
// INFO — registro informativo de sucesso
logger.info('User created successfully', { userId: newUser.id })

// WARN — alerta, algo nao completou normalmente
logger.warn('External API slow response', {
  service: 'payment-gateway',
  responseTimeMs: 4500,
  threshold: 3000,
})

// ERROR — erro real
logger.error('Database connection failed', {
  host: config.dbHost,
  port: config.dbPort,
  error: error.message,
})

// CRITICAL — falha grave do sistema
logger.critical('Out of memory', {
  service: 'order-processor',
  memoryUsageMb: 1950,
  limitMb: 2048,
})
```

## Formato JSON padronizado

O instrutor enfatiza que logs devem ser objetos JSON estruturados:

```json
{
  "timestamp": "2026-02-28T14:30:00.000Z",
  "level": "error",
  "service": "order-service",
  "message": "Failed to process order",
  "orderId": "ord_abc123",
  "userId": "usr_456",
  "error": "Insufficient inventory for SKU-789",
  "requestId": "req_xyz",
  "environment": "production"
}
```

## Lib interna padronizada (conceito do instrutor)

```typescript
// packages/logger/src/index.ts
// Lib compartilhada que todos os servicos usam

interface LogMeta {
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'critical'
  service: string
  message: string
  [key: string]: unknown
}

function createLogEntry(
  level: LogEntry['level'],
  service: string,
  message: string,
  meta: LogMeta
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    ...meta,
  }
}

export function createLogger(serviceName: string) {
  const emit = (entry: LogEntry) => {
    // Envia para stdout (coletado por agente externo)
    // ou diretamente para ferramenta via HTTP/gRPC
    process.stdout.write(JSON.stringify(entry) + '\n')
  }

  return {
    info: (message: string, meta: LogMeta = {}) =>
      emit(createLogEntry('info', serviceName, message, meta)),
    warn: (message: string, meta: LogMeta = {}) =>
      emit(createLogEntry('warn', serviceName, message, meta)),
    error: (message: string, meta: LogMeta = {}) =>
      emit(createLogEntry('error', serviceName, message, meta)),
    critical: (message: string, meta: LogMeta = {}) =>
      emit(createLogEntry('critical', serviceName, message, meta)),
  }
}
```

```typescript
// Uso em qualquer servico da organizacao
import { createLogger } from '@org/logger'

const logger = createLogger('payment-service')

logger.error('Payment declined', {
  userId: user.id,
  amount: order.totalInCents,
  reason: gateway.declineReason,
})
```

## Anti-pattern historico: logs em arquivo local

```php
// PHP antigo — pasta de logs dentro do projeto (NAO FACA ISSO)
<?php
$logFile = __DIR__ . '/logs/' . date('Y-m-d') . '.txt';
file_put_contents($logFile, date('H:i:s') . " - Erro: $message\n", FILE_APPEND);
?>
```

```typescript
// Node.js equivalente do anti-pattern
import fs from 'fs'
fs.appendFileSync(
  `./logs/${new Date().toISOString().split('T')[0]}.txt`,
  `${Date.now()} - Error: ${error.message}\n`
)
// PROBLEMA: se container morrer, logs somem
// PROBLEMA: como buscar/indexar em arquivos txt?
```

## Estrategia de retencao com archive

```yaml
# Exemplo conceitual de politica de retencao
log_retention:
  transactional:
    duration: 7d
    storage: grafana-loki  # ou LogZIO, Elasticsearch
    purpose: debug em tempo real

  archive:
    trigger: after_transactional_expiry
    format: compressed  # gzip/zip
    destination: s3://logs-archive/deep-archive/
    storage_class: GLACIER_DEEP_ARCHIVE
    purpose: auditoria e compliance
    retrieval_time: horas (nao minutos)

  deletion:
    enabled: false  # ou true com duration: 90d
    applies_to: archive
```

## Exemplo de query em ferramenta (LogZIO style)

```
// Buscar erros do servico de pagamento nas ultimas 24h
level:error AND service:"payment-service" AND timestamp:[now-24h TO now]

// Buscar por usuario especifico
userId:"usr_456" AND level:error

// Buscar warnings de lentidao
level:warn AND message:"slow response"
```