# Code Examples: Logging Estruturado com Pino

## Instalacao

```bash
yarn add pino pino-pretty
# ou
npm install pino pino-pretty
```

## Arquivo logger.ts completo

```typescript
// src/infra/logger.ts
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

## Uso basico no main

```typescript
// src/main.ts
import { log } from "./infra/logger";

// Log informativo
log.info("Aplicacao iniciada com sucesso");

// Log de erro
log.error("Falha ao processar requisicao");

// Log de debug
log.debug("Dados recebidos do cliente");

// Log de warning
log.warn("Conexao lenta detectada");

// Log fatal
log.fatal("Servico indisponivel");
```

## Saida no terminal (com pino-pretty)

```
INFO [28/02/2026 14:30:00] Aplicacao iniciada com sucesso
ERROR [28/02/2026 14:30:01] Falha ao processar requisicao
```

Caracteristicas da saida:
- Level em primeiro (levelFirst: true)
- Timestamp formatado (translateTime)
- Colorizado por level (colorize: true)

## Configuracao do OTel Collector para logs

```yaml
# otel-collector-config.yaml
exporters:
  otlphttp:
    # CORRETO: apenas /otlp, sem /v1/logs
    endpoint: "http://loki:3100/otlp"

receivers:
  otlp:
    protocols:
      http: {}

processors:
  batch: {}
  resource:
    attributes:
      - key: service.name
        value: "app-skillz"
        action: upsert
      - key: service.environment
        value: "development"
        action: upsert
      - key: service.version
        value: "1.0"
        action: upsert

service:
  pipelines:
    logs:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [otlphttp]
```

## Debugging do pipeline

```bash
# 1. Verificar containers rodando
docker ps

# 2. Ver logs do OTel Collector
docker logs <container-id-do-collector>

# 3. Se houver erro de endpoint, corrigir e reiniciar
docker-compose down
docker-compose up

# 4. Reiniciar aplicacao para emitir novos logs
yarn run start:dev
```

## Erro comum: endpoint duplicado

```yaml
# ERRADO - duplica /v1/logs
exporters:
  otlphttp:
    endpoint: "http://loki:3100/otlp/v1/logs"
# O exporter ja concatena /v1/logs automaticamente
# Resultado: tenta acessar /otlp/v1/logs/v1/logs -> 404

# CORRETO
exporters:
  otlphttp:
    endpoint: "http://loki:3100/otlp"
```

## Variacoes de organizacao

### Arquivo unico (projetos simples)
```
src/
└── infra/
    └── logger.ts
```

### Subpasta (projetos maiores)
```
src/
└── infra/
    ├── logger/
    │   └── index.ts
    └── tracer/
        └── index.ts
```

## Verificacao no Grafana

Apos configurar, no Grafana > Explore > Loki:
1. Selecionar o service name da aplicacao
2. Usar "Run query" para ver logs
3. Filtrar por severidade (info, error)
4. Usar LogQL para queries avancadas:
   - `| json` para converter para JSON
   - Filtrar por campos especificos (versao, level)