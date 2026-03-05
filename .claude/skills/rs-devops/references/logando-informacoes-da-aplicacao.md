---
name: rs-devops-logando-informacoes-da-aplicacao
description: "Enforces structured logging setup with Pino and pino-pretty in Node.js applications. Use when user asks to 'configure logging', 'add logs', 'setup pino', 'format log output', or 'send logs to Grafana'. Applies Pino transport configuration, log levels, timestamp formatting, colorization, and OpenTelemetry Collector integration for log export. Make sure to use this skill whenever setting up application logging or debugging log pipelines. Not for application metrics, tracing spans, or Prometheus configuration."
---

# Logging Estruturado com Pino

> Configure logs estruturados com niveis, timestamps e colorizacao usando Pino, e exporte para ferramentas de observabilidade via OpenTelemetry Collector.

## Rules

1. **Nunca use console.log em producao** — use uma lib de logging como Pino, porque console.log nao tem level, timestamp, nem colorizacao
2. **Organize o logger em `src/infra/logger.ts`** — pasta `infra/` agrupa concerns de infraestrutura (logger, tracer, etc.), porque separa dominio de infra
3. **Configure log level a partir de `debug`** — permite visibilidade completa durante desenvolvimento, porque levels mais restritivos escondem informacoes uteis
4. **Sempre inclua level e timestamp na saida** — todo registro precisa de `level` e `time` para ser util em investigacao, porque sem eles nao ha como filtrar nem ordenar
5. **Exporte o logger como named export** — `export { log }` nao default, porque facilita tree-shaking e autocomplete
6. **Pino e pino-pretty sao independentes do OpenTelemetry** — sao libs de formatacao de stdout apenas, porque a exportacao para collectors e responsabilidade do OTel SDK

## How to write

### Estrutura de pastas

```
src/
└── infra/
    └── logger.ts    # ou infra/logger/index.ts para projetos maiores
```

### Configuracao do Pino

```typescript
import pino from "pino";

const log = pino({
  level: "debug",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "error",
        options: {
          name: "dev-terminal",
          colorize: true,
          levelFirst: true,
          include: "level,time",
          translateTime: "SYS:dd/MM/yyyy HH:mm:ss",
        },
      },
    ],
  },
});

export { log };
```

### Uso no codigo

```typescript
import { log } from "./infra/logger";

log.info("Aplicacao iniciada");
log.error("Falha ao conectar no banco");
log.debug("Payload recebido");
log.warn("Rate limit proximo do limite");
```

## Example

**Before (sem estrutura):**
```typescript
console.log("app started");
console.log("error happened");
// Sem level, sem timestamp, sem colorizacao
// Impossivel filtrar no Grafana
```

**After (com Pino configurado):**
```typescript
import { log } from "./infra/logger";

log.info("App started");
log.error("Connection failed");
// Output: INFO [28/02/2026 14:30:00] App started
// Output: ERROR [28/02/2026 14:30:01] Connection failed
// Filtravel por level e time no Grafana/Loki
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo Node.js | Crie `infra/logger.ts` com Pino antes de qualquer feature |
| Precisa debugar pipeline de logs | `docker logs <container-id>` no OTel Collector para ver erros de envio |
| Logs nao aparecem no Grafana | Verifique endpoint do exporter — OTel ja concatena `/v1/logs`, nao duplique |
| Quer filtrar por severidade no Grafana | Use `log.info()`, `log.error()`, etc. — o level vira campo filtravel |
| Container reiniciou e perdeu logs | Esperado sem volume configurado — configure persistencia com volumes Docker |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `console.log("debug info")` | `log.debug("debug info")` |
| Logger sem timestamp | `include: "level,time"` no pino-pretty |
| Endpoint duplicado `/v1/logs` no OTel config | Use apenas `/otlp` — o exporter ja adiciona `/v1/logs` |
| Exportar logger como default | `export { log }` como named export |
| Misturar Pino com OpenTelemetry SDK conceitos | Pino = formatacao stdout, OTel = exportacao para collectors |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-logando-informacoes-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-logando-informacoes-da-aplicacao/references/code-examples.md)
