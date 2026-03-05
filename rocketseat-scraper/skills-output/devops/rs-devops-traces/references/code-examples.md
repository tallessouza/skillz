# Code Examples: Traces — Rastreio Distribuido

## Exemplo visual do instrutor

O instrutor mostrou uma imagem de trace com a seguinte estrutura:

```
Trace ID: abc-123-def-456
Duration: 97ms
Services: 3
Spans: 5

├── [0ms - 97ms] service-a: GET /api/order
│   ├── [2ms - 38ms] service-b: GET /api/user/username  (36ms)
│   ├── [40ms - 65ms] service-b: db.find(users)         (25ms)
│   └── [67ms - 95ms] service-c: GET /api/inventory     (28ms)
```

Pontos observados:
- Duracao total: 97ms (menos de 100ms — "tempo bem ok")
- Span mais lento: getUserName com 36ms
- Hierarquia visivel: quem chamou quem
- Timestamp de cada span para correlacao temporal

## Propagacao de contexto — Exemplo pratico

### HTTP Headers (padrao OpenTelemetry W3C)

```typescript
// Servico A — origem da requisicao
import { context, propagation } from '@opentelemetry/api';

async function handleRequest(req: Request) {
  const span = tracer.startSpan('service-a.handleOrder');
  
  // Propagar contexto via headers
  const headers: Record<string, string> = {};
  propagation.inject(context.active(), headers);
  
  // Chamada ao servico B carrega o trace ID
  const userResponse = await fetch('http://service-b/api/user', {
    headers: {
      ...headers,  // traceparent, tracestate
      'Content-Type': 'application/json',
    },
  });
  
  span.end();
}
```

```typescript
// Servico B — extrai contexto e continua o trace
import { context, propagation } from '@opentelemetry/api';

async function handleUserRequest(req: Request) {
  // Extrair contexto do header — mesmo trace ID
  const parentContext = propagation.extract(context.active(), req.headers);
  
  const span = tracer.startSpan('service-b.getUser', undefined, parentContext);
  
  // Span de banco de dados
  const dbSpan = tracer.startSpan('db.findUser', undefined, 
    trace.setSpan(context.active(), span));
  const user = await db.users.findOne({ id: req.params.id });
  dbSpan.end();
  
  span.end();
  return user;
}
```

## Auto-instrumentacao com OpenTelemetry (abordagem do curso)

```typescript
// setup.ts — configuracao unica, instrumentacao automatica
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Instrumenta automaticamente: HTTP, Express, DB, etc.
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
    }),
  ],
});

sdk.start();
```

Com auto-instrumentacao, spans sao criados automaticamente para:
- Requisicoes HTTP de entrada e saida
- Queries ao banco de dados
- Operacoes de frameworks (Express, Fastify, etc.)

## Mapa de dependencias — Estrutura conceitual

```
           ┌─────────┐
           │ Frontend │
           └────┬─────┘
                │ HTTP
           ┌────▼─────┐
           │ Service A │
           │ (Gateway) │
           └──┬────┬───┘
              │    │
     ┌────────▼┐  ┌▼────────┐
     │Service B│  │Service C │
     │ (Users) │  │(Inventory│
     └────┬────┘  └────┬─────┘
          │             │
     ┌────▼────┐   ┌───▼─────┐
     │  DB-B   │   │  DB-C   │
     │(Postgres│   │ (Redis) │
     └─────────┘   └─────────┘

Blast radius se Service B cai:
- Local: Service B indisponivel
- Global: Service A degradado → Frontend recebe erro
- Service C: NAO afetado (independente)
```

## Analise de latencia por span

```
Trace: GET /api/checkout
Total: 342ms

Span                          Duration    % Total
────────────────────────────  ──────────  ───────
checkout.validateCart          12ms        3.5%
checkout.getUser               45ms        13.2%
  └─ db.findUser               38ms        11.1%   ← query lenta?
checkout.calculatePricing      8ms         2.3%
checkout.reserveInventory      180ms       52.6%   ← GARGALO
  └─ inventory.checkStock      120ms       35.1%
  └─ inventory.reserve         55ms        16.1%
checkout.processPayment        90ms        26.3%
  └─ payment.charge            85ms        24.9%

Insight: reserveInventory consome 52.6% do tempo total.
Acao: investigar inventory.checkStock (120ms) — possivel otimizacao com cache.
```

## Identificando chamadas desnecessarias

```
Trace: GET /api/dashboard
Total: 250ms

Span                          Duration    Result Used?
────────────────────────────  ──────────  ────────────
dashboard.getUser              30ms        SIM
dashboard.getPreferences       25ms        SIM
dashboard.getLegacyConfig      45ms        NAO ← desnecessario!
dashboard.getNotifications     80ms        SIM
dashboard.getAnalytics         70ms        SIM

Insight: getLegacyConfig adiciona 45ms e o resultado nao e usado.
Acao: remover chamada → reduzir latencia de 250ms para 205ms (-18%).
```