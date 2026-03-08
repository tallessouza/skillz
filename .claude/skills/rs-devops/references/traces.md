---
name: rs-devops-traces
description: "Applies distributed tracing concepts for debugging, optimizing, and analyzing microservice communication paths. Use when user asks about 'distributed tracing', 'trace ID propagation', 'spans', 'blast radius', 'service dependency map', or 'latency analysis'. Enforces trace ID propagation, span granularity, dependency mapping, and auto-instrumentation with OpenTelemetry. Make sure to use this skill whenever instrumenting microservices for tracing or analyzing request latency across service boundaries. Not for log aggregation (see logs skill), metrics collection (see metrics skill), or specific tracing tool configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability
  tags: [observability, tracing, distributed-tracing, opentelemetry, spans, trace-id, blast-radius, latency]
---

# Traces — Rastreio Distribuido

> Em sistemas distribuidos, rastreie o caminho completo da requisicao entre servicos usando trace ID e spans para debug, otimizacao e analise de impacto.

## Rules

1. **Propague o trace ID em toda a cadeia** — quando a requisicao nasce, associe um ID unico que acompanha todo o fluxo A→B→C→D, porque sem ele voce precisa correlacionar logs manualmente entre servicos
2. **Modele cada operacao como um span** — chamada ao banco, chamada a outro servico, processamento interno — cada acao e um span distinto, porque granularidade permite identificar exatamente onde esta a latencia
3. **Identifique chamadas desnecessarias pelo trace** — spans que existem mas nao contribuem para o resultado sao candidatos a eliminacao, porque latencia acumulada de chamadas ociosas degrada performance silenciosamente
4. **Mapeie dependencias a partir dos traces** — construa um mapa de quem chama quem, porque isso revela o blast radius (raio de impacto) quando um servico fica indisponivel
5. **Distinga impacto local de global** — servico B indisponivel e o impacto local, mas todos que chamam B (A, C, D) sao o impacto global, porque decisoes de prioridade dependem do raio de explosao real
6. **Use auto-instrumentacao quando possivel** — prefira bibliotecas que instrumentam automaticamente (OpenTelemetry) a spans manuais, porque reduz erro humano e garante cobertura uniforme

## How to write

### Propagacao de trace ID entre servicos

```typescript
// Ao fazer chamada HTTP entre servicos, propague o trace ID via header
const response = await fetch('http://service-b/api/users', {
  headers: {
    'X-Trace-Id': context.traceId,  // mesmo ID da requisicao original
    'X-Span-Id': span.spanId,        // span pai para hierarquia
  },
});
```

### Criando spans para operacoes

```typescript
// Cada operacao relevante gera um span com inicio, fim e metadados
const span = tracer.startSpan('db.findUser');
const user = await database.users.findOne({ id: userId });
span.setAttributes({ 'db.operation': 'findOne', 'db.collection': 'users' });
span.end();
```

## Example

**Before (debug manual sem trace):**
```
1. Olhar logs do servico A → achar request ID
2. Copiar request ID → buscar nos logs do servico B
3. Repetir para servico C e D
4. Montar timeline manualmente
5. Tentar correlacionar tempos
```

**After (com tracing distribuido):**
```
1. Buscar pelo trace ID na ferramenta (Jaeger/Tempo)
2. Ver hierarquia completa: A → B → C → D
3. Ver duracao de cada span lado a lado
4. Identificar imediatamente: "service B.getUserName = 36ms de 97ms total"
5. Decidir otimizacao com dados concretos
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Requisicao lenta sem causa obvia | Abrir trace, ordenar spans por duracao, focar no mais lento |
| Span existe mas resultado nao e usado | Candidato a eliminacao — chamada desnecessaria |
| Servico critico ficou indisponivel | Consultar mapa de dependencias para calcular blast radius |
| Fluxo sincrono com latencia alta | Avaliar se spans podem ser paralelizados ou tornados assincronos |
| Consistencia eventual aceitavel | Latencia maior em spans assincronos nao e necessariamente problema |
| Planejando refatoracao arquitetural | Usar mapa de dependencias do tracing para identificar acoplamentos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Debug distribuido via logs manuais | Use trace ID para correlacao automatica |
| Ignorar spans com latencia "aceitavel" | Analise spans acumulados — muitos "aceitaveis" somam latencia relevante |
| Assumir que indisponibilidade e local | Calcule blast radius via mapa de dependencias |
| Instrumentar apenas chamadas externas | Instrumente tambem operacoes de banco e processamento interno |
| Criar spans sem metadados | Adicione operacao, servico, duracao e status em cada span |


## Troubleshooting

### Traces mostram spans incompletos ou desconectados
**Symptom:** Visualizacao do trace mostra gaps — servico B nao aparece como filho do servico A
**Cause:** Contexto de trace (trace ID) nao esta sendo propagado nos headers HTTP entre servicos
**Fix:** Use `propagation.inject()` ao fazer chamadas HTTP e `propagation.extract()` ao receber — ou habilite auto-instrumentacao do OpenTelemetry

### Auto-instrumentacao nao gera spans para chamadas ao banco
**Symptom:** Spans de HTTP aparecem mas operacoes de banco nao geram spans
**Cause:** Instrumentacao do driver de banco nao esta habilitada no setup do OpenTelemetry SDK
**Fix:** Adicione o pacote de instrumentacao especifico (ex: `@opentelemetry/instrumentation-pg`) no array de instrumentations

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Traces — Rastreio Distribuido

## Por que traces existem

O instrutor posiciona traces como o terceiro pilar da observabilidade (junto com logs e metricas). A motivacao central e: em sistemas distribuidos, uma unica requisicao atravessa multiplos servicos, e sem uma forma de rastrear esse caminho, o debug se torna um exercicio manual e fragil.

A analogia implicita e a de um detetive seguindo pistas: sem trace, voce precisa ir em cada "cena do crime" (servico) e tentar reconstruir a sequencia. Com trace, voce tem uma camera que filmou todo o percurso.

## Conceitos fundamentais

### Trace ID — O fio condutor

Quando uma requisicao nasce (ex: sai do frontend via HTTP), um ID unico e associado a ela. Esse ID e propagado em cada chamada subsequente. Servico A chama B passando o trace ID, B chama C passando o mesmo ID. Isso permite que ferramentas de observabilidade agreguem todos os eventos sob uma unica visao.

O instrutor enfatiza que sem o trace ID, voce teria que:
1. Achar algo nos logs do servico A
2. Pegar um elemento identificador
3. Procurar manualmente no servico B
4. Repetir para cada servico na cadeia

Isso e "um fluxo muito mais manual" — e portanto propenso a erro e demorado.

### Span — A unidade de execucao

Um span representa uma operacao individual dentro do trace. Exemplos:
- Requisicao ao banco de dados (find, insert, upsert)
- Chamada a outro servico
- Processamento interno

O instrutor explica que spans podem ser criados manualmente (instrumentacao no codigo) ou via auto-instrumentacao (bibliotecas que fazem isso automaticamente). Na parte pratica do curso, sera usado o segundo approach.

### Hierarquia de spans

Spans formam uma arvore. O instrutor mostra uma imagem onde:
- O trace total durou ~97ms
- Um span especifico (getUserName) durou 36ms
- Cada span tem timestamp e duracao
- A hierarquia mostra quem chamou quem

Isso permite ver que de 97ms totais, 36ms foram gastos em uma unica operacao — informacao valiosa para otimizacao.

## Valor pratico do tracing

### 1. Identificacao de chamadas desnecessarias

O instrutor destaca este ponto como "muito legal": ao visualizar o trace, voce pode encontrar spans que representam chamadas que "nem sao utilizadas mais, estao ali simplesmente de maneira desnecessaria e estao causando latencia". Isso e algo que logs e metricas isolados nao revelam com a mesma clareza.

### 2. Mapa de dependencias

Os traces naturalmente constroem um mapa de quem chama quem. O instrutor conecta isso com:
- **Visao arquitetural**: entender o ecossistema de dependencias
- **Refatoracao**: identificar dependencias que podem ser eliminadas
- **Backstage**: ferramenta de documentacao que tambem pode mapear dependencias (complementar ao tracing)

### 3. Blast radius (raio de explosao)

Conceito central: quando um servico falha, qual e o impacto real?

- **Impacto local**: servico B esta indisponivel
- **Impacto global**: todos que dependem de B (direta ou transitivamente) sao afetados

O instrutor enfatiza que com mapa de dependencias, voce consegue "metrificar melhor o raio de explosao" — saber antecipadamente o que acontece se qualquer servico do ecossistema ficar indisponivel.

### 4. Sincrono vs assincrono

O instrutor faz uma distincao importante:
- **Sincrono**: latencia impacta diretamente o tempo de resposta ao usuario (ex: 100ms e "um tempo bem ok")
- **Assincrono**: latencia maior pode ser aceitavel dependendo do negocio (consistencia eventual), como consumo de eventos

## Conexao com ferramentas

O instrutor menciona que nas proximas aulas cobrira:
- Ferramentas de tracing (Jaeger, Tempo, etc.)
- OpenTelemetry como padrao de instrumentacao
- Parte pratica com auto-instrumentacao

## Upstream e downstream

O instrutor menciona brevemente os conceitos de upstream/downstream na cadeia de dependencias, relacionando com a capacidade de entender o raio de impacto quando um servico "upstream" ou "downstream" fica indisponivel.

---

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
